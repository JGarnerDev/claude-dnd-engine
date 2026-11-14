#!/usr/bin/env python3
# /// script
# requires-python = "==3.12.*"
# dependencies = [
#   "chatterbox-tts==0.1.7",
#   "kokoro>=0.9.4,<1",
#   "torch==2.6.0",
#   "torchaudio==2.6.0",
#   "lameenc>=1.8",
#   "soundfile>=0.12",
#   "pyloudnorm>=0.1",
#   "setuptools<81",
# ]
# [[tool.uv.index]]
# name = "pytorch-cu124"
# url = "https://download.pytorch.org/whl/cu124"
# explicit = true
# [tool.uv.sources]
# torch = { index = "pytorch-cu124", marker = "sys_platform != 'darwin'" }
# torchaudio = { index = "pytorch-cu124", marker = "sys_platform != 'darwin'" }
# ///
# NOTE: pinned to Python 3.12 via PEP-723: Kokoro ships for <3.13, and Chatterbox pins
# torch 2.6.0 below 3.14. The rest of the repo stays on 3.14; `uv run` builds an isolated
# 3.12 env for this script (same pattern as transcribe.py). torch comes from the CUDA 12.4
# index -- PyPI's Windows torch wheel is CPU-only. setuptools<81 supplies pkg_resources, which
# Chatterbox's watermarker (resemble-perth) imports; without it the model fails to load.
# consumers: .claude/commands/narrate.md, meta/narration.md
#   -- update these if usage, flags, or output format change.
"""
narrate.py -- render an ear script into a spoken MP3 take (meta/narration.md).

Takes are rendered by Chatterbox on the GPU. The narrator uses Chatterbox's built-in voice
unless narration/cast.md gives it a clip; each NPC speaks in the voice of its reference clip.
Kokoro is used only by --seed, to make candidate clips for a new NPC.

Layout:
    narration/cast.md                   committed: who speaks with which clip and settings
    narration/voices/<slug>.wav         reference clips (gitignored)
    narration/voices/candidates/        --seed output, one file per candidate voice
    narration/scripts/<take>.md         ear scripts (gitignored)
    narration/takes/<take>.mp3          rendered takes (gitignored)
    narration/.cache/                   one WAV per rendered line, keyed by text + voice

Usage: uv run scripts/narrate.py --script <path> [--force]
       uv run scripts/narrate.py --seed "<NPC>" [--line "<text>"] [--voices a,b,c]
       uv run scripts/narrate.py --keep "<NPC>=<kokoro voice>"
       uv run scripts/narrate.py --list
"""

import argparse
import hashlib
import re
import shutil
import sys
import time
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
NARR = ROOT / 'narration'
CAST = NARR / 'cast.md'
VOICES = NARR / 'voices'
CANDIDATES = VOICES / 'candidates'
SCRIPTS = NARR / 'scripts'
TAKES = NARR / 'takes'
CACHE = NARR / '.cache'

SR = 24000                 # Chatterbox and Kokoro both render at 24 kHz
LINE_LUFS = -20.0          # every line evened to this before joining
PEAK_DB = -1.0             # final take peak
MAX_CHUNK = 280            # characters per Chatterbox call; longer lines split at sentences
GAP_SENTENCE = 0.30        # seconds between chunks of one line
GAP_LINE = 0.55            # between lines, same speaker
GAP_SPEAKER = 0.75         # between lines, speaker changes
GAP_ASIDE = 1.0            # before and after an aside
ASIDE_SHIFT = (-0.1, -0.1) # aside = narrator with (exaggeration, cfg_weight) nudged down: calmer, slower

# Default Kokoro candidates for --seed: two American, one British, mixed.
SEED_VOICES = 'am_michael,bm_george,af_bella'
SEED_LINE = ("You'll want to hear this before you decide anything. "
             "I'll say it once, slowly, and then we'll see what you make of it.")


# -- cast.md --------------------------------------------------------------------
# One bullet per speaker:
#   - **Nella** — clip: voices/nella.wav · exaggeration: 0.35 · cfg_weight: 0.4 · from: "Patient and dry…"
# `clip: default` means Chatterbox's built-in voice.

_CAST_RE = re.compile(r'^\s*-\s+\*\*(.+?)\*\*\s*[—-]+\s*(.+)$')


def slug(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def read_cast() -> dict:
    cast = {}
    if not CAST.exists():
        return cast
    for line in CAST.read_text(encoding='utf-8').splitlines():
        m = _CAST_RE.match(line)
        if not m:
            continue
        fields = {}
        for part in m.group(2).split('·'):
            if ':' in part:
                k, v = part.split(':', 1)
                fields[k.strip().lower()] = v.strip()
        clip = fields.get('clip', 'default')
        cast[m.group(1).strip().lower()] = {
            'name': m.group(1).strip(),
            'clip': None if clip in ('', 'default', 'none') else NARR / clip,
            'exaggeration': float(fields.get('exaggeration', 0.5)),
            'cfg_weight': float(fields.get('cfg_weight', 0.5)),
        }
    return cast


# -- ear script -----------------------------------------------------------------
# One utterance per line: `[narrator] text`, `[aside] text`, `[<NPC>] text`, `[pause 1.5]`.
# Blank lines, `#` comments and a leading frontmatter block are skipped.

_LINE_RE = re.compile(r'^\[([^\]]+)\]\s*(.*)$')


def parse_script(path: Path) -> list:
    text = path.read_text(encoding='utf-8')
    text = re.sub(r'^---\r?\n.*?\r?\n---\r?\n', '', text, flags=re.S)
    items = []
    for n, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith('#'):
            continue
        m = _LINE_RE.match(line)
        if not m:
            sys.exit(f'{path.name}:{n}: not a [speaker] line: {line[:60]}')
        tag, body = m.group(1).strip(), m.group(2).strip()
        pm = re.fullmatch(r'pause\s+([\d.]+)', tag, re.I)
        if pm:
            items.append(('pause', float(pm.group(1))))
        elif body:
            items.append((tag, body))
    return items


def chunks(text: str) -> list:
    """Split a long line at sentence ends so each Chatterbox call stays short."""
    if len(text) <= MAX_CHUNK:
        return [text]
    out, cur = [], ''
    for s in re.split(r'(?<=[.!?…])\s+', text):
        if cur and len(cur) + len(s) + 1 > MAX_CHUNK:
            out.append(cur)
            cur = s
        else:
            cur = f'{cur} {s}'.strip()
    if cur:
        out.append(cur)
    return out


# -- audio helpers --------------------------------------------------------------

def silence(seconds: float):
    import numpy as np
    return np.zeros(int(SR * seconds), dtype=np.float32)


def even_loudness(wav):
    import numpy as np
    import pyloudnorm as pyln
    if len(wav) < SR // 2:
        return wav
    meter = pyln.Meter(SR)
    lufs = meter.integrated_loudness(wav)
    if not np.isfinite(lufs):
        return wav
    return pyln.normalize.loudness(wav, lufs, LINE_LUFS).astype(np.float32)


def trim(wav, thresh=0.01):
    """Cut leading and trailing near-silence so the gaps are ours, not the model's."""
    import numpy as np
    idx = np.where(np.abs(wav) > thresh)[0]
    if len(idx) == 0:
        return wav
    pad = int(SR * 0.04)
    return wav[max(0, idx[0] - pad): idx[-1] + pad]


def write_mp3(wav, path: Path, kbps: int = 128):
    import lameenc
    import numpy as np
    peak = float(np.max(np.abs(wav))) or 1.0
    wav = wav * (10 ** (PEAK_DB / 20) / peak)
    pcm = (np.clip(wav, -1, 1) * 32767).astype(np.int16).tobytes()
    enc = lameenc.Encoder()
    enc.set_bit_rate(kbps)
    enc.set_in_sample_rate(SR)
    enc.set_channels(1)
    enc.set_quality(2)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(enc.encode(pcm) + enc.flush())


# -- render ---------------------------------------------------------------------

def line_key(text: str, voice: dict) -> str:
    clip = voice['clip']
    clip_sig = hashlib.sha1(clip.read_bytes()).hexdigest()[:12] if clip else 'default'
    sig = f"{text}|{clip_sig}|{voice['exaggeration']:.2f}|{voice['cfg_weight']:.2f}"
    return hashlib.sha1(sig.encode('utf-8')).hexdigest()[:20]


def resolve_voice(tag: str, cast: dict) -> tuple:
    """Map a script tag to (voice settings, is_aside)."""
    t = tag.lower()
    narrator = cast.get('narrator', {'name': 'narrator', 'clip': None,
                                     'exaggeration': 0.5, 'cfg_weight': 0.5})
    if t == 'narrator':
        return narrator, False
    if t == 'aside':
        dx, dc = ASIDE_SHIFT
        v = dict(narrator)
        v['exaggeration'] = max(0.25, v['exaggeration'] + dx)
        v['cfg_weight'] = max(0.2, v['cfg_weight'] + dc)
        return v, True
    if t in cast:
        return cast[t], False
    sys.exit(f'"{tag}" is not in narration/cast.md. Cast them first (narrate.py --seed).')


def render(script: Path, force: bool):
    import numpy as np
    import soundfile as sf
    items = parse_script(script)
    cast = read_cast()
    for clip in {v['clip'] for v in cast.values() if v['clip']}:
        if not clip.exists():
            sys.exit(f'missing clip {clip.relative_to(ROOT)} (named in narration/cast.md)')
    # resolve every tag up front so a typo fails before the GPU spends minutes
    for tag, _ in items:
        if tag != 'pause':
            resolve_voice(tag, cast)

    CACHE.mkdir(parents=True, exist_ok=True)
    todo = [(t, b) for t, b in items if t != 'pause'
            and (force or not (CACHE / f'{line_key(b, resolve_voice(t, cast)[0])}.wav').exists())]
    model = None
    if todo:
        import torch
        from chatterbox.tts import ChatterboxTTS
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f'loading Chatterbox on {device}; {len(todo)} of '
              f'{sum(1 for t, _ in items if t != "pause")} lines to render', flush=True)
        model = ChatterboxTTS.from_pretrained(device=device)

    parts, prev, t0, done = [], None, time.time(), 0
    for tag, body in items:
        if tag == 'pause':
            parts.append(silence(body))
            prev = None
            continue
        voice, aside = resolve_voice(tag, cast)
        cached = CACHE / f'{line_key(body, voice)}.wav'
        if force or not cached.exists():
            pieces = []
            for c in chunks(body):
                kw = {'exaggeration': voice['exaggeration'], 'cfg_weight': voice['cfg_weight']}
                if voice['clip']:
                    kw['audio_prompt_path'] = str(voice['clip'])
                out = model.generate(c, **kw)
                pieces += [trim(out.squeeze(0).cpu().numpy().astype(np.float32)),
                           silence(GAP_SENTENCE)]
            sf.write(cached, even_loudness(np.concatenate(pieces[:-1])), SR)
            done += 1
            print(f'  [{done}/{len(todo)}] {tag}: {body[:60]}', flush=True)
        wav, _ = sf.read(cached, dtype='float32')
        if parts and prev is not None:
            gap = GAP_ASIDE if (aside or prev == 'aside') else \
                GAP_LINE if prev == tag.lower() else GAP_SPEAKER
            parts.append(silence(gap))
        parts.append(wav)
        prev = 'aside' if aside else tag.lower()

    if not parts:
        sys.exit(f'{script.name}: no lines to speak')
    take = TAKES / f'{script.stem}.mp3'
    full = np.concatenate(parts)
    write_mp3(full, take)
    mins, secs = divmod(int(len(full) / SR), 60)
    print(f'take: {take.relative_to(ROOT)}  ({mins}:{secs:02d}, rendered {done} lines '
          f'in {int(time.time() - t0)}s)')


# -- seed / keep ----------------------------------------------------------------

def seed(npc: str, line: str, voices: str):
    from kokoro import KPipeline
    import numpy as np
    import soundfile as sf
    CANDIDATES.mkdir(parents=True, exist_ok=True)
    if len(line) < 160:  # Chatterbox clones best from ~10 s; pad a short line out
        line = f'{line} {SEED_LINE}'
    pipes = {}
    for v in [x.strip() for x in voices.split(',') if x.strip()]:
        lang = v[0]  # a = American, b = British
        if lang not in pipes:
            pipes[lang] = KPipeline(lang_code=lang)
        audio = [np.asarray(a, dtype=np.float32) for _, _, a in pipes[lang](line, voice=v)]
        wav = np.concatenate(audio)
        base = f'{slug(npc)}.{v}'  # not Path.with_suffix: the voice name is the "suffix"
        sf.write(CANDIDATES / f'{base}.wav', wav, SR)
        write_mp3(wav, CANDIDATES / f'{base}.mp3')
        print(f'candidate: {(CANDIDATES / f"{base}.mp3").relative_to(ROOT)}  ({len(wav) / SR:.1f}s)')
    print(f'keep one with: uv run scripts/narrate.py --keep "{npc}=<voice>"')


def keep(spec: str):
    if '=' not in spec:
        sys.exit('--keep takes "<NPC>=<kokoro voice>"')
    npc, v = (s.strip() for s in spec.split('=', 1))
    src = CANDIDATES / f'{slug(npc)}.{v}.wav'
    if not src.exists():
        sys.exit(f'no candidate {src.relative_to(ROOT)}; run --seed "{npc}" first')
    dst = VOICES / f'{slug(npc)}.wav'
    shutil.copyfile(src, dst)
    print(f'clip: {dst.relative_to(ROOT)}  (cast.md row: clip: voices/{dst.name})')


def list_takes():
    scripts = sorted(SCRIPTS.glob('*.md')) if SCRIPTS.exists() else []
    if not scripts:
        print('no ear scripts in narration/scripts/')
    for s in scripts:
        take = TAKES / f'{s.stem}.mp3'
        if not take.exists():
            state = 'not rendered'
        elif s.stat().st_mtime > take.stat().st_mtime:
            state = 'stale (script edited after render)'
        else:
            state = 'ok'
        print(f'{s.stem}: {state}')
    cast = read_cast()
    print(f'cast: {", ".join(v["name"] for v in cast.values()) or "(empty)"}')


def main():
    ap = argparse.ArgumentParser(description='Render an ear script into an MP3 take.')
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument('--script', help='ear script to render (narration/scripts/<take>.md)')
    g.add_argument('--seed', metavar='NPC', help='make candidate clips for a new NPC with Kokoro')
    g.add_argument('--keep', metavar='NPC=VOICE', help='keep one --seed candidate as the clip')
    g.add_argument('--list', action='store_true', help='list ear scripts, take state, and cast')
    ap.add_argument('--force', action='store_true', help='re-render every line, ignoring the cache')
    ap.add_argument('--line', default=SEED_LINE, help='the line --seed speaks')
    ap.add_argument('--voices', default=SEED_VOICES, help='Kokoro voices --seed tries, comma-separated')
    a = ap.parse_args()
    if a.script:
        p = Path(a.script)
        if not p.exists():
            p = SCRIPTS / a.script
        if not p.exists():
            sys.exit(f'no ear script {a.script}')
        render(p, a.force)
    elif a.seed:
        seed(a.seed, a.line, a.voices)
    elif a.keep:
        keep(a.keep)
    else:
        list_takes()


if __name__ == '__main__':
    main()
