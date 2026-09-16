#!/usr/bin/env python3
# /// script
# requires-python = "==3.13.*"
# dependencies = [
#   "faster-whisper>=1.2,<2",
#   "nvidia-cublas-cu12; sys_platform != 'darwin'",
#   "nvidia-cudnn-cu12>=9,<10; sys_platform != 'darwin'",
# ]
# ///
# NOTE: pinned to Python 3.13 via PEP-723 because ctranslate2 (faster-whisper's engine)
# publishes Windows wheels only through cp313 -- there is no cp314 win_amd64 build. The
# rest of the repo stays on 3.14; `uv run` builds an isolated 3.13 env for this script.
# The two nvidia-* wheels are the CUDA runtime bits ctranslate2 dlopens for GPU decode;
# they are skipped on macOS, where CUDA does not exist and the script runs on CPU.
# consumers: CLAUDE.md, README.md, .claude/commands/transcript.md, .claude/commands/recap.md,
#   scripts/session-brief.py, scripts/todo-brief.py -- update these if usage, flags, or output format change.
"""
transcribe.py -- turn a session's recorded audio into a speaker-labeled transcript.

Built for multi-track recordings (Craig/Discord style: one audio file per speaker),
which need no diarization -- the filename *is* the speaker. A single mixed file works
too; everything lands under one speaker label.

Layout:
    recaps/audio/session-12/jeff.aac        one file per speaker
    recaps/audio/session-12/kellan.aac
    recaps/audio/session-12/speakers.tsv    optional: "<file stem>  <Display Name>"
    recaps/audio/session-12.m4a             or a single mixed file

Output:
    recaps/transcripts/session-12.md        merged, timestamped, speaker-labeled
    recaps/transcripts/.cache/session-12/   per-track JSON, so a rerun re-merges
                                            without re-transcribing (--force to redo)

Usage: uv run scripts/transcribe.py [--session <n>] [--audio <path>] [--model large-v3]
                                    [--device auto|cuda|cpu] [--lang en] [--force]
                                    [--no-fixup] [--list]
"""

import argparse
import difflib
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, get_frontmatter

AUDIO_DIR = ROOT / 'recaps' / 'audio'
OUT_DIR = ROOT / 'recaps' / 'transcripts'
AUDIO_EXTS = {'.aac', '.m4a', '.mp3', '.wav', '.flac', '.ogg', '.opus', '.webm', '.mp4', '.mkv'}

# Whisper's prompt window is 224 tokens (half of 448). Feeding it the campaign's proper
# nouns is what stops "Strahd" becoming "Strad" -- but overfilling it starts evicting the
# model's own context, so the name list is capped and priority-ordered (PCs first).
MAX_PROMPT_NAMES = 48

# Seconds of silence that end a speaker's paragraph, at render time.
PARAGRAPH_GAP = 15.0

# Seconds of silence that split one Whisper segment into separate utterances.
#
# This is the load-bearing one. vad_filter strips the silence out of a track, and
# faster-whisper then decodes the *concatenated* speech in 30-second windows and maps
# the timestamps back to original time. For a player who says four scattered things
# across six minutes, all four land in one decode window and come back as a single
# segment stamped at the first -- so the transcript claims they said all of it at once,
# six minutes before some of it happened. Word timestamps are the only way back to real
# time, so we ask for them and re-cut each segment wherever the speaker actually paused.
SEGMENT_SPLIT_GAP = 2.0

# Per-speaker tracks are mostly silence, and Whisper hallucinates filler into silence.
# These are the stock hallucinations it emits on empty audio.
HALLUCINATIONS = {
    'thanks for watching!', 'thank you for watching!', 'thanks for watching.',
    'subscribe!', 'please subscribe.', 'bye.', 'you', 'thank you.', 'thank you',
    '[music]', '[applause]', '[silence]', 'okay.', '.',
}


# -- Track discovery ----------------------------------------------------------

def _pretty_speaker(stem: str) -> str:
    """'1-Jeff_1699999999' -> 'Jeff'. Craig prefixes a track number and suffixes a
    unix timestamp; strip both, then title-case what's left."""
    s = re.sub(r'^\d+[-_]', '', stem)
    s = re.sub(r'[-_]\d{6,}$', '', s)
    s = s.replace('_', ' ').replace('-', ' ').strip()
    return s.title() if s.islower() else (s or stem)


def load_speaker_map(d: Path) -> dict:
    """Optional speakers.tsv in the session audio dir: '<file stem>\t<Display Name>'.
    Lets a track named `2-kel_170.aac` render as 'Kellan (DM)' without renaming files."""
    f = d / 'speakers.tsv'
    if not f.exists():
        return {}
    out = {}
    for line in f.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        parts = re.split(r'\t|\s{2,}|=', line, maxsplit=1)
        if len(parts) == 2:
            out[parts[0].strip().lower()] = parts[1].strip()
    return out


def discover(session: str = None, audio: str = None) -> tuple:
    """Resolve (slug, [(speaker, path), ...]). A directory yields one track per file;
    a single file yields one 'Table' track."""
    if audio:
        target = Path(audio)
        if not target.is_absolute():
            target = ROOT / audio
    elif session:
        slug = f'session-{int(session):02d}' if str(session).isdigit() else str(session)
        target = AUDIO_DIR / slug
        if not target.exists():
            cands = [p for p in AUDIO_DIR.glob(slug + '.*') if p.suffix.lower() in AUDIO_EXTS]
            if not cands:
                raise SystemExit("No audio found for '" + slug + "' in recaps/audio/")
            target = cands[0]
    else:
        dirs = sorted(p for p in AUDIO_DIR.iterdir() if p.is_dir()) if AUDIO_DIR.exists() else []
        loose = sorted(p for p in AUDIO_DIR.glob('*') if p.suffix.lower() in AUDIO_EXTS) if AUDIO_DIR.exists() else []
        all_c = dirs + loose
        if not all_c:
            raise SystemExit('No audio in recaps/audio/ -- drop a session folder there first.')
        target = all_c[-1]   # most recent by name; session-NN sorts correctly via zero-pad

    if not target.exists():
        raise SystemExit('Not found: ' + str(target))

    if target.is_dir():
        files = sorted(p for p in target.iterdir() if p.suffix.lower() in AUDIO_EXTS)
        if not files:
            raise SystemExit('No audio files in ' + str(target))
        smap = load_speaker_map(target)
        tracks = [(smap.get(p.stem.lower(), _pretty_speaker(p.stem)), p) for p in files]
        return target.name, tracks
    return target.stem, [('Table', target)]


# -- Canon vocabulary ---------------------------------------------------------

def campaign_names() -> list:
    """Proper nouns from entity frontmatter, PCs/NPCs first. Drives both the Whisper
    prompt bias and the post-pass spelling fixup."""
    buckets = {'pc': [], 'npc': [], 'place': [], 'other': []}
    seen = set()
    roots = [
        (ROOT / 'historian' / 'characters', 'npc'),
        (ROOT / 'historian', 'place'),
        (ROOT / 'data', 'other'),
    ]
    for base, default_bucket in roots:
        if not base.exists():
            continue
        for f in base.rglob('*.md'):
            if f.name in ('CLAUDE.md', 'README.md') or 'template' in f.name:
                continue
            fm = get_frontmatter(f)
            name = (fm.get('name') or '').strip()
            if not name or len(name) < 4 or name.lower() in seen:
                continue
            seen.add(name.lower())
            sub = (fm.get('subtype') or '').lower()
            typ = (fm.get('type') or '').lower()
            if sub == 'pc':
                buckets['pc'].append(name)
            elif typ == 'character':
                buckets['npc'].append(name)
            elif typ in ('location', 'faction', 'deity', 'item'):
                buckets['place'].append(name)
            else:
                buckets[default_bucket].append(name)
    return buckets['pc'] + buckets['npc'] + buckets['place'] + buckets['other']


def build_prompt(names: list) -> str:
    """A comma-joined name list. Whisper treats initial_prompt as prior context, so a
    bare roster of proper nouns biases decoding toward those spellings."""
    picked = names[:MAX_PROMPT_NAMES]
    if not picked:
        return ''
    return 'A Dungeons & Dragons session featuring: ' + ', '.join(picked) + '.'


# Only words of 5+ letters are candidates; shorter ones collide with ordinary speech
# far too easily ("with" is a 0.89 match for a canon "Witch").
_WORD_RE = re.compile(r"\b[A-Za-z][A-Za-z'\-]{4,}\b")

# Ordinary English, including the table's own vocabulary and the generic half of place
# names. Guards BOTH ends of the fixup: a common word is never rewritten, and a canon
# name's common-word tokens ('Wood', 'Castle') never become correction targets. Without
# this the pass turns ordinary speech into false canon -- the one failure mode that
# actually matters here, since transcripts feed the historian.
_COMMON = {
    'about', 'above', 'after', 'again', 'against', 'along', 'already', 'alright',
    'always', 'among', 'another', 'answer', 'anyone', 'anything', 'around', 'because',
    'become', 'before', 'begin', 'behind', 'being', 'believe', 'below', 'better',
    'between', 'black', 'blood', 'break', 'bring', 'brother', 'building', 'cannot',
    'carry', 'castle', 'catch', 'chance', 'change', 'check', 'church', 'close',
    'coming', 'could', 'course', 'creature', 'damage', 'dark', 'death', 'decide',
    'doing', 'door', 'down', 'dream', 'drink', 'during', 'either', 'elder', 'else',
    'enough', 'even', 'ever', 'every', 'everyone', 'everything', 'exactly', 'fall',
    'father', 'feel', 'fight', 'find', 'first', 'follow', 'forest', 'forward', 'found',
    'friend', 'from', 'front', 'gate', 'getting', 'give', 'going', 'gonna', 'good',
    'great', 'group', 'guard', 'guess', 'hall', 'hand', 'happen', 'having', 'head',
    'health', 'hear', 'here', 'hold', 'horse', 'house', 'human', 'hundred', 'initiative',
    'inside', 'into', 'itself', 'keep', 'kill', 'kind', 'know', 'lady', 'large', 'last',
    'later', 'leave', 'less', 'letter', 'level', 'light', 'like', 'listen', 'little',
    'living', 'long', 'look', 'lord', 'magic', 'maybe', 'mean', 'might', 'mind',
    'minute', 'moment', 'money', 'more', 'morning', 'most', 'mother', 'mountain',
    'move', 'much', 'must', 'name', 'near', 'need', 'never', 'next', 'night', 'nothing',
    'number', 'often', 'okay', 'once', 'only', 'open', 'other', 'others', 'outside',
    'over', 'party', 'people', 'perception', 'perhaps', 'person', 'place',
    'play', 'please', 'point', 'potion', 'power', 'pretty', 'probably', 'problem',
    'pull', 'push', 'question', 'quite', 'reach', 'read', 'ready', 'real', 'really',
    'remember', 'rest', 'right', 'river', 'road', 'roll', 'room', 'round', 'same',
    'saving', 'second', 'seem', 'send', 'sense', 'shall', 'should', 'show', 'side',
    'sister', 'small', 'some', 'someone', 'something', 'sound', 'speak', 'spell',
    'stand', 'start', 'still', 'stone', 'stop', 'story', 'strong', 'such', 'sure',
    'sword', 'table', 'take', 'talk', 'tell', 'temple', 'than', 'that', 'their',
    'them', 'then', 'there', 'these', 'they', 'thing', 'think', 'this', 'those',
    'though', 'thought', 'three', 'through', 'throw', 'time', 'together', 'told',
    'tower', 'town', 'travel', 'tree', 'trust', 'turn', 'under', 'understand', 'until',
    'village', 'voice', 'wait', 'walk', 'want', 'watch', 'water', 'weapon', 'well',
    'were', 'what', 'when', 'where', 'which', 'while', 'white', 'whole', 'will',
    'with', 'within', 'without', 'woman', 'wood', 'word', 'work', 'world', 'would',
    'wrong', 'yeah', 'year', 'your',
    # Table vocabulary. These reach the vocab through reference-catalog entities
    # (feats, spells, monsters) whose names are ordinary English -- 'Savage Attacker'
    # is why an excited "Attack!" was being rewritten.
    'attack', 'attacker', 'armor', 'armour', 'acrobatics', 'advantage', 'arcana',
    'athletics', 'bandit', 'barbarian', 'bard', 'cantrip', 'charisma', 'cleric',
    'constitution', 'dagger', 'deception', 'dexterity', 'disadvantage', 'druid',
    'fighter', 'goblin', 'insight', 'intelligence', 'intimidation', 'investigation',
    'medicine', 'monk', 'nature', 'paladin', 'performance', 'persuasion', 'ranger',
    'rations', 'religion', 'ritual', 'rogue', 'savage', 'scroll', 'shield',
    'silver', 'skeleton', 'sorcerer', 'stealth', 'strength', 'survival', 'torch',
    'undead', 'warlock', 'wisdom', 'wizard', 'zombie',
}

_TOKEN_RE = re.compile(r"[A-Za-z][A-Za-z'\-]+")


def build_vocab(names: list) -> dict:
    """lowercased token -> canon spelling, for the spelling fixup.

    Multi-word names contribute their distinctive tokens too, since the table says
    "Strahd", not "Strahd Von Zarovich" -- minus any token that is ordinary English,
    which is what keeps "Castle Ravenloft" from making "castle" a correction target.
    """
    vocab = {}
    for n in names:
        for tok in _TOKEN_RE.findall(n):
            lt = tok.lower()
            if len(tok) >= 5 and lt not in _COMMON:
                vocab.setdefault(lt, tok)
    return vocab


def fixup(text: str, vocab: dict, tally: dict) -> str:
    """Repair near-miss spellings of canon proper nouns ('Strad' -> 'Strahd').

    Deliberately conservative: one word at a time, close matches only, never an ordinary
    English word, and never a length jump of more than two characters. Transcripts feed
    canon, so a wrong 'correction' is worse than a missed one -- keep the bar high.
    """
    if not vocab:
        return text
    keys = list(vocab)

    def repl(m):
        w = m.group(0)
        # Whisper capitalizes what it hears as a name, including the ones it mangles
        # ("Strad", "Barovya"). A lowercase word is ordinary speech, so leaving it alone
        # costs a few missed fixes and buys immunity to the whole class of
        # "attack -> Attacker" rewrites that no stopword list can fully cover.
        if w[0].islower():
            return w
        lw = w.lower()
        if lw in vocab or lw in _COMMON:
            return w
        hit = difflib.get_close_matches(lw, keys, n=1, cutoff=0.84)
        if not hit:
            return w
        canon = vocab[hit[0]]
        if abs(len(canon) - len(w)) > 2:
            return w
        key = w + ' -> ' + canon
        tally[key] = tally.get(key, 0) + 1
        return canon

    return _WORD_RE.sub(repl, text)


# -- GPU plumbing -------------------------------------------------------------

def enable_cuda_dlls() -> None:
    """Point the loader at the CUDA DLLs shipped in the nvidia-* wheels.

    On Linux those wheels carry rpath and load themselves; on Windows nothing adds
    site-packages/nvidia/*/bin to the search path, so ctranslate2 fails to find
    cublas64_12.dll / cudnn_ops64_9.dll and reports no CUDA device.
    """
    if not hasattr(os, 'add_dll_directory'):
        return
    for site in sys.path:
        nv = Path(site) / 'nvidia'
        if not nv.is_dir():
            continue
        for sub in sorted(nv.iterdir()):
            for bindir in (sub / 'bin', sub / 'lib'):
                if bindir.is_dir():
                    try:
                        os.add_dll_directory(str(bindir))
                    except OSError:
                        pass
                    os.environ['PATH'] = str(bindir) + os.pathsep + os.environ.get('PATH', '')


def load_model(name: str, device: str):
    """Build the WhisperModel, falling back GPU -> CPU with a visible warning rather
    than dying: a CPU run is slow but still produces the transcript."""
    from faster_whisper import WhisperModel
    if device in ('auto', 'cuda'):
        enable_cuda_dlls()
        try:
            return WhisperModel(name, device='cuda', compute_type='float16'), 'cuda', 'float16'
        except Exception as e:
            if device == 'cuda':
                raise SystemExit('CUDA requested but unavailable: ' + str(e))
            cwrite('  ! GPU unavailable (' + type(e).__name__ + ') -- falling back to CPU.', 'darkyellow')
    return WhisperModel(name, device='cpu', compute_type='int8'), 'cpu', 'int8'


# -- Transcription ------------------------------------------------------------

def _hms(sec: float) -> str:
    sec = int(sec or 0)
    return '%d:%02d:%02d' % (sec // 3600, (sec % 3600) // 60, sec % 60)


def split_on_pauses(seg) -> list:
    """One Whisper segment -> [(start, end, text), ...], cut where the speaker paused.

    Each piece is stamped from its own words, so an utterance is dated when it was
    actually said rather than when the segment that swallowed it began. Falls back to
    the segment as-is if word timestamps are missing, which keeps an older cache and
    any model that declines to emit them working.
    """
    words = getattr(seg, 'words', None)
    if not words:
        return [(seg.start, seg.end, seg.text.strip())]

    out, cur = [], []
    for w in words:
        if cur and (w.start - cur[-1].end) > SEGMENT_SPLIT_GAP:
            out.append(cur)
            cur = []
        cur.append(w)
    if cur:
        out.append(cur)

    pieces = []
    for group in out:
        text = ''.join(w.word for w in group).strip()
        if text:
            pieces.append((group[0].start, group[-1].end, text))
    return pieces


def transcribe_track(model, path: Path, lang: str, prompt: str) -> dict:
    """One audio file -> {'duration': float, 'segments': [{start, end, text}]}.

    vad_filter is what makes per-speaker tracks cheap: a player's track is mostly dead
    air, and the VAD skips it instead of feeding silence to the decoder.
    """
    segments, info = model.transcribe(
        str(path),
        language=lang or None,
        initial_prompt=prompt or None,
        vad_filter=True,
        vad_parameters={'min_silence_duration_ms': 800, 'speech_pad_ms': 300},
        beam_size=5,
        word_timestamps=True,               # required to re-cut segments; see SEGMENT_SPLIT_GAP
        condition_on_previous_text=False,   # stops one hallucination cascading down the track
    )
    out = []
    for s in segments:
        text = s.text.strip()
        if not text or text.lower() in HALLUCINATIONS:
            continue
        # Low confidence plus high no-speech is the signature of invented speech in silence.
        # Judged on the whole segment, before it is cut into utterances.
        if s.no_speech_prob > 0.7 and s.avg_logprob < -0.8:
            continue
        for start, end, chunk in split_on_pauses(s):
            out.append({'start': start, 'end': end, 'text': chunk})
        if len(out) % 50 == 0:
            cwrite('\r      ' + str(len(out)) + ' utterances  (' + _hms(s.end) + ')', 'darkgray', end='')
    out.sort(key=lambda u: u['start'])
    return {'duration': info.duration, 'segments': out}


# -- Output -------------------------------------------------------------------

def render(slug: str, tracks: list, results: dict, meta: dict, vocab: dict, do_fixup: bool) -> str:
    """Merge every track's segments into one time-ordered, speaker-labeled document.

    Consecutive segments from the same speaker are glued into a paragraph so the
    transcript reads as speech, not as a segment dump -- the digest step downstream
    reads much better that way, and it roughly halves the line count.
    """
    merged = []
    for speaker, path in tracks:
        for s in results[str(path)]['segments']:
            merged.append((s['start'], s['end'], speaker, s['text']))
    merged.sort(key=lambda r: r[0])

    tally = {}
    lines = []
    words = 0
    cur_spk = None
    cur_start = 0.0
    cur_end = 0.0
    buf = []

    def flush():
        nonlocal words
        if not buf:
            return
        text = ' '.join(buf)
        if do_fixup:
            text = fixup(text, vocab, tally)
        words += len(text.split())
        lines.append('**[' + _hms(cur_start) + '] ' + cur_spk + ':** ' + text)
        lines.append('')

    # A paragraph continues only while the same speaker keeps talking without a real
    # pause. A speaker change ends it, and so does PARAGRAPH_GAP of silence -- the
    # second test is what keeps a block's timestamp honest, since the segments in one
    # block can otherwise be minutes apart.
    for start, end, speaker, text in merged:
        if speaker != cur_spk or (start - cur_end) > PARAGRAPH_GAP:
            flush()
            cur_spk, cur_start, buf = speaker, start, [text]
            cur_end = end          # reset: the gap is measured within a paragraph,
        else:                      # never against the one that just ended
            buf.append(text)
            cur_end = max(cur_end, end)
    flush()

    dur = max((results[str(p)]['duration'] for _, p in tracks), default=0)
    fm = [
        '---',
        'transcript_of: "' + slug + '"',
        'generated: "' + datetime.now(timezone.utc).astimezone().isoformat(timespec='seconds') + '"',
        'model: "' + meta['model'] + '"',
        'device: "' + meta['device'] + ' (' + meta['compute'] + ')"',
        'duration: "' + _hms(dur) + '"',
        'word_count: ' + str(words),
        'tracks:',
    ]
    for speaker, path in tracks:
        n = len(results[str(path)]['segments'])
        fm.append('  - "' + speaker + ': ' + path.name + ' (' + str(n) + ' segments)"')
    fm += ['---', '']

    head = [
        '# Transcript — ' + slug,
        '',
        '> Machine transcription. Not canon. Names may be misheard and timestamps are',
        '> per-track and approximate. Run `/transcript` to digest this into session',
        '> notes, then `/recap` to canonize. Confirm anything load-bearing with the DM.',
        '',
    ]
    if tally:
        top = sorted(tally.items(), key=lambda kv: -kv[1])[:12]
        head += ['> **Name fixups applied:** ' + '; '.join(k + ' (' + str(v) + ')' for k, v in top), '']
    return '\n'.join(fm + head + lines) + '\n'


# -- Main ---------------------------------------------------------------------

def main() -> None:
    ap = argparse.ArgumentParser(description='Transcribe session audio into a speaker-labeled markdown transcript.')
    ap.add_argument('--session', help='session number or slug (e.g. 12 or session-12)')
    ap.add_argument('--audio', help='explicit path to an audio file or a folder of tracks')
    ap.add_argument('--model', default='large-v3', help='whisper model (large-v3, medium, small, ...)')
    ap.add_argument('--device', default='auto', choices=['auto', 'cuda', 'cpu'])
    ap.add_argument('--lang', default='en', help="language code, or '' to auto-detect")
    ap.add_argument('--force', action='store_true', help='re-transcribe tracks already cached')
    ap.add_argument('--no-fixup', action='store_true', help='skip canon-name spelling repair')
    ap.add_argument('--list', action='store_true', help='show discovered audio and exit')
    args = ap.parse_args()

    cwrite('\n========================================', 'darkgray')
    cwrite('  SESSION TRANSCRIBER', 'cyan')
    cwrite('========================================', 'darkgray')

    if args.list:
        if not AUDIO_DIR.exists():
            cwrite('  (no recaps/audio/ yet)', 'darkgray')
            return
        for p in sorted(AUDIO_DIR.iterdir()):
            if p.is_dir():
                n = len([q for q in p.iterdir() if q.suffix.lower() in AUDIO_EXTS])
                done = (OUT_DIR / (p.name + '.md')).exists()
                cwrite('  ' + p.name + '  (' + str(n) + ' tracks)  ' + ('[transcribed]' if done else '[pending]'),
                       'green' if done else 'yellow')
            elif p.suffix.lower() in AUDIO_EXTS:
                cwrite('  ' + p.name + '  (single file)', 'yellow')
        return

    slug, tracks = discover(args.session, args.audio)
    out_file = OUT_DIR / (slug + '.md')
    cache = OUT_DIR / '.cache' / slug
    cache.mkdir(parents=True, exist_ok=True)

    cwrite('  session : ' + slug, 'white')
    cwrite('  tracks  : ' + str(len(tracks)) + '  (' + ', '.join(s for s, _ in tracks) + ')', 'white')

    names = campaign_names()
    prompt = build_prompt(names)
    cwrite('  vocab   : ' + str(len(names)) + ' canon names (' +
           str(min(len(names), MAX_PROMPT_NAMES)) + ' biased into the prompt)', 'darkcyan')

    pending = [(s, p) for s, p in tracks if args.force or not (cache / (p.stem + '.json')).exists()]
    results = {}
    model = None
    # A cache-only rerun (relabelling speakers, say) decodes nothing, so it must report
    # how the cached segments were actually produced -- carry the previous transcript's
    # model and device forward. /transcript reads `device` to warn about slow CPU runs,
    # and a literal "cached" there would tell it nothing.
    meta = {'model': args.model, 'device': 'unknown', 'compute': 'from cache'}
    if out_file.exists():
        prev = get_frontmatter(out_file)
        if prev.get('model'):
            meta['model'] = prev['model']
        if prev.get('device'):
            dev = prev['device']
            meta['device'], _, comp = dev.partition(' (')
            meta['compute'] = comp.rstrip(')') or 'from cache'

    if pending:
        cwrite('  loading ' + args.model + ' ...', 'darkgray')
        t0 = time.time()
        model, dev, comp = load_model(args.model, args.device)
        meta = {'model': args.model, 'device': dev, 'compute': comp}
        cwrite('  device  : ' + dev + ' (' + comp + ')  [' + ('%.0f' % (time.time() - t0)) + 's to load]',
               'green' if dev == 'cuda' else 'yellow')

    for i, (speaker, path) in enumerate(tracks, 1):
        cf = cache / (path.stem + '.json')
        prefix = '  [' + str(i) + '/' + str(len(tracks)) + '] ' + speaker.ljust(14)
        if cf.exists() and not args.force:
            results[str(path)] = json.loads(cf.read_text(encoding='utf-8'))
            cwrite(prefix + ' cached (' + str(len(results[str(path)]['segments'])) + ' segments)', 'darkgray')
            continue
        cwrite(prefix + ' ' + path.name, 'white')
        t0 = time.time()
        res = transcribe_track(model, path, args.lang, prompt)
        cf.write_text(json.dumps(res), encoding='utf-8')
        results[str(path)] = res
        cwrite('\r      ' + str(len(res['segments'])) + ' segments  (' + _hms(res['duration']) +
               ' audio, ' + ('%.0f' % (time.time() - t0)) + 's)   ', 'green')

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = render(slug, tracks, results, meta, build_vocab(names), not args.no_fixup)
    out_file.write_text(doc, encoding='utf-8')

    cwrite('')
    cwrite('  -> recaps/transcripts/' + slug + '.md  (' + format(len(doc.split()), ',') + ' words)', 'cyan')
    cwrite('  next: /transcript ' + slug + ' to digest it into recaps/inbox/ for /recap.', 'darkcyan')
    cwrite('')


if __name__ == '__main__':
    main()
