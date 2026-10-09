#!/usr/bin/env python3
# /// script
# requires-python = "==3.13.*"
# dependencies = [
#   "av",
#   "numpy",
#   "scikit-learn",
#   "speechbrain>=1.0",
#   "torch",
#   "torchaudio",
# ]
# ///
# NOTE: pinned to Python 3.13 to match transcribe.py -- this script reads that script's
# per-track JSON cache, and sharing the interpreter keeps one uv env for both. torch here
# is the default PyPI wheel, which on Windows is CPU-only; that is deliberate. ECAPA is a
# ~20M-parameter model and the work is a few thousand short crops, so CPU finishes in
# minutes and the CUDA wheel is a ~2.5GB download for no useful gain.
# consumers: recaps/CLAUDE.md, README.md, .claude/commands/transcript.md -- update these if
#   usage, flags, or output format change.
"""
diarize-track.py -- split ONE audio track that carries two or more speakers.

The normal case needs nothing like this: Craig gives one file per speaker, so the
filename is the speaker and transcribe.py is done. This script exists for the case
where that assumption breaks -- two players sharing one microphone, because one of
them is sitting at the other's house.

It does not do full diarization. transcribe.py already found where speech is and cut
it into utterances, so the only open question is *who* said each one. So:

    1. decode the track to 16 kHz mono (via av -- no ffmpeg needed)
    2. crop each cached utterance and embed it with ECAPA-TDNN (speaker voiceprint)
    3. cluster the embeddings into `--num-speakers` groups
    4. name the clusters from table evidence, not guesswork (see `score_clusters`)
    5. write a sidecar the next transcribe.py run picks up

Output:
    recaps/transcripts/.cache/<slug>/<stem>.speakers.json

    {"stem": ..., "speakers": [...], "labels": ["Jeff (Iggy)", "Paul (Luci)", ...],
     "confidence": [0.83, ...], "evidence": {...}}

`labels` is parallel to the `segments` array in <stem>.json, so transcribe.py can
stamp a per-segment speaker without re-decoding anything.

A word on what this can and cannot do. Two people on one microphone in one room is
the hard case for speaker separation: same channel, same room acoustics, and they
talk over each other. Expect good-not-perfect, worst at interruptions. Every label
carries a confidence, and `--min-confidence` marks the weak ones ambiguous rather
than guessing -- an honestly ambiguous label is worth more than a confident wrong
one, because /recap turns these into canon.

Usage:
    uv run scripts/diarize-track.py --session 27 --track 1-eljeffe0024 \
        --speakers "Jeff (Iggy),Paul (Luci)"
    uv run scripts/diarize-track.py --session 27 --track 1-eljeffe0024 \
        --speakers "Jeff (Iggy),Paul (Luci)" --assign 0=Paul --dry-run
"""

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite

AUDIO_DIR = ROOT / 'recaps' / 'audio'
OUT_DIR = ROOT / 'recaps' / 'transcripts'
AUDIO_EXTS = {'.aac', '.m4a', '.mp3', '.wav', '.flac', '.ogg', '.opus', '.webm', '.mp4', '.mkv'}

SAMPLE_RATE = 16000

# An utterance shorter than this does not contain enough voiced audio for a stable
# voiceprint -- "yeah" embeds closer to other short crops than to its own speaker.
# These are labelled by their nearest confident neighbour in time instead.
MIN_EMBED_DUR = 0.8

# Crops longer than this are trimmed to the middle N seconds. ECAPA saturates well
# before this, and a 60-second crop is usually two people trading lines anyway.
MAX_EMBED_DUR = 8.0

# Margin between the best and second-best cluster distance, below which a label is
# called ambiguous. Tuned loose on purpose: see the module docstring.
DEFAULT_MIN_CONFIDENCE = 0.55

# How long after the DM says a player's name that player is assumed to be talking.
# Their turn is the window; 90s is about one combat turn with dice and argument.
ANCHOR_WINDOW = 90.0

# Class vocabulary that only one character would say. Used to name clusters, never to
# label individual lines -- measured on session 27, this fires on ~2% of utterances,
# which is useless as a primary signal but ideal as ground truth for naming a cluster.
CLASS_VOCAB = {
    'monk': [r'\bmonk\b', r'\bki\b', r'flurry', r'step of the wind', r'stunning strike',
             r'martial art', r'unarmed', r'patient defense', r'focus point', r'deflect missile'],
    'bard': [r'\bbard\b', r'bardic', r'inspiration', r'faerie fire', r'healing word',
             r'vicious mockery', r'crossbow', r'cutting words', r'countercharm', r'\blute\b'],
    'wizard': [r'chromatic orb', r'acid splash', r'fire ?bolt', r'spell ?book', r'familiar',
               r'magic missile', r'arcane recovery'],
    'barbarian': [r'\brage\b', r'raging', r'reckless', r'greataxe', r'\bbrutal\b'],
}


# -- Discovery ----------------------------------------------------------------

def resolve(session: str, track: str) -> tuple:
    """(slug, audio path, cache dir) for a session number/slug and a track stem."""
    slug = session if str(session).startswith('session-') else 'session-' + str(session)
    folder = AUDIO_DIR / slug
    if not folder.is_dir():
        sys.exit('no audio folder: recaps/audio/' + slug)

    cands = [p for p in sorted(folder.iterdir()) if p.suffix.lower() in AUDIO_EXTS]
    if not cands:
        sys.exit('no audio files in recaps/audio/' + slug)

    hit = [p for p in cands if p.stem == track]
    if not hit:
        hit = [p for p in cands if track.lower() in p.stem.lower()]
    if not hit:
        cwrite('  tracks present: ' + ', '.join(p.stem for p in cands), 'darkgray')
        sys.exit("no track matching '" + track + "' in recaps/audio/" + slug)
    if len(hit) > 1:
        sys.exit("'" + track + "' matches several tracks: " + ', '.join(p.stem for p in hit))

    cache = OUT_DIR / '.cache' / slug
    if not (cache / (hit[0].stem + '.json')).exists():
        sys.exit('no cached transcript for that track -- run transcribe.py --session '
                 + str(session) + ' first')
    return slug, hit[0], cache


# -- Audio --------------------------------------------------------------------

def decode(path: Path):
    """Whole track -> float32 mono numpy at SAMPLE_RATE, via av. No ffmpeg required."""
    import av
    import numpy as np

    container = av.open(str(path))
    stream = container.streams.audio[0]
    resampler = av.audio.resampler.AudioResampler(format='s16', layout='mono', rate=SAMPLE_RATE)
    chunks = []
    for frame in container.decode(stream):
        for out in resampler.resample(frame):
            chunks.append(out.to_ndarray().reshape(-1))
    container.close()
    if not chunks:
        sys.exit('decoded no audio from ' + path.name)
    wav = np.concatenate(chunks).astype('float32') / 32768.0
    return wav


# -- Embedding ----------------------------------------------------------------

def embed(get_wav, segments: list, device: str, cache_file=None, force: bool = False):
    """Crop every long-enough utterance and return (index list, L2-normalised matrix).

    `get_wav` is a callable, not samples: on a cache hit the audio is never decoded at
    all. Embeddings are cached because they take minutes to compute and never change for
    a given track, while the clustering downstream is worth re-running with new settings.
    """
    import numpy as np

    if cache_file is not None and cache_file.exists() and not force:
        blob = np.load(cache_file)
        if len(blob['idx']) and blob['mat'].shape[0] == len(blob['idx']):
            cwrite('  embeddings: reusing ' + cache_file.name + ' ('
                   + str(len(blob['idx'])) + ' cached vectors)', 'darkcyan')
            return list(blob['idx']), blob['mat']

    import torch
    from speechbrain.inference import EncoderClassifier

    wav = get_wav()

    cwrite('  loading ECAPA-TDNN (speechbrain/spkrec-ecapa-voxceleb) ...', 'darkgray')
    kw = {}
    # speechbrain links its savedir to the HuggingFace cache, and symlinking on Windows
    # needs a privilege a normal account does not hold -- it dies with WinError 1314.
    # Copying is a few MB and works everywhere, so ask for it when the enum exists.
    try:
        from speechbrain.utils.fetching import LocalStrategy
        kw['local_strategy'] = LocalStrategy.COPY
    except ImportError:
        pass
    model = EncoderClassifier.from_hparams(
        source='speechbrain/spkrec-ecapa-voxceleb',
        savedir=str(ROOT / '.models' / 'ecapa'),
        run_opts={'device': device},
        **kw,
    )

    idx, crops = [], []
    for i, s in enumerate(segments):
        dur = float(s['end']) - float(s['start'])
        if dur < MIN_EMBED_DUR:
            continue
        a = int(float(s['start']) * SAMPLE_RATE)
        b = int(float(s['end']) * SAMPLE_RATE)
        if dur > MAX_EMBED_DUR:                      # keep the middle: edges hold crosstalk
            mid = (a + b) // 2
            half = int(MAX_EMBED_DUR * SAMPLE_RATE / 2)
            a, b = mid - half, mid + half
        crop = wav[max(a, 0):min(b, len(wav))]
        if len(crop) < int(MIN_EMBED_DUR * SAMPLE_RATE):
            continue
        idx.append(i)
        crops.append(crop)

    if not crops:
        sys.exit('no utterance long enough to embed (all under %.1fs)' % MIN_EMBED_DUR)

    vecs = []
    BATCH = 16
    for start in range(0, len(crops), BATCH):
        batch = crops[start:start + BATCH]
        longest = max(len(c) for c in batch)
        padded = np.zeros((len(batch), longest), dtype='float32')
        lens = np.zeros(len(batch), dtype='float32')
        for j, c in enumerate(batch):
            padded[j, :len(c)] = c
            lens[j] = len(c) / longest          # speechbrain wants *relative* lengths
        with torch.no_grad():
            out = model.encode_batch(torch.from_numpy(padded).to(device),
                                     torch.from_numpy(lens).to(device))
        vecs.append(out.squeeze(1).cpu().numpy())
        done = min(start + BATCH, len(crops))
        cwrite('\r      embedded %d/%d utterances' % (done, len(crops)), 'darkgray', end='')
    cwrite('')

    mat = np.concatenate(vecs)
    mat /= (np.linalg.norm(mat, axis=1, keepdims=True) + 1e-9)
    if cache_file is not None:
        np.savez_compressed(cache_file, idx=np.array(idx), mat=mat)
        cwrite('  embeddings: cached to ' + cache_file.name, 'darkgray')
    return idx, mat


# -- Clustering ---------------------------------------------------------------

def cluster(mat, k: int, method: str = 'spectral'):
    """Cluster voiceprints -> (labels, confidence per row).

    Two speakers on ONE microphone in ONE room share their entire channel: same mic
    response, same room reverb, same distance-ish. That shared component is the largest
    direction of variance in the raw embeddings and it says nothing about who is talking,
    so it is removed first -- mean-centre the track, then re-normalise. Skipping this is
    what makes naive clustering collapse: measured on session 27, average-linkage on
    un-centred vectors put 763 of 766 utterances in one cluster.

    Method matters too. Average-linkage agglomerative chains along a continuum and
    produces one giant cluster plus crumbs. Spectral clustering on a cosine affinity is
    what speaker-diarization systems actually use, and k-means on centred unit vectors
    (spherical k-means) is a robust fallback.

    Confidence is the normalised margin between the nearest and second-nearest centroid.
    """
    import numpy as np

    # -- remove the shared channel/room component
    centred = mat - mat.mean(axis=0, keepdims=True)
    centred /= (np.linalg.norm(centred, axis=1, keepdims=True) + 1e-9)

    if method == 'spectral':
        from sklearn.cluster import SpectralClustering
        aff = (centred @ centred.T + 1.0) / 2.0           # cosine -> [0,1] affinity
        np.fill_diagonal(aff, 1.0)
        lab = SpectralClustering(n_clusters=k, affinity='precomputed',
                                 assign_labels='kmeans', random_state=0).fit_predict(aff)
    elif method == 'kmeans':
        from sklearn.cluster import KMeans
        lab = KMeans(n_clusters=k, n_init=20, random_state=0).fit_predict(centred)
    else:
        from sklearn.cluster import AgglomerativeClustering
        lab = AgglomerativeClustering(n_clusters=k, metric='cosine',
                                      linkage='complete').fit_predict(centred)

    cents = np.stack([centred[lab == c].mean(axis=0) if (lab == c).any()
                      else np.zeros(centred.shape[1]) for c in range(k)])
    cents /= (np.linalg.norm(cents, axis=1, keepdims=True) + 1e-9)
    sims = centred @ cents.T                              # cosine similarity to each centroid
    order = np.argsort(-sims, axis=1)
    best = sims[np.arange(len(sims)), order[:, 0]]
    second = sims[np.arange(len(sims)), order[:, 1]] if k > 1 else np.zeros(len(sims))
    # Margin mapped into 0..1. Cosine gaps between two voices on one mic are small, so
    # the spread is stretched to make --min-confidence a usable dial.
    conf = np.clip((best - second) * 6.0, 0.0, 1.0)
    return lab, conf


# -- Naming the clusters ------------------------------------------------------

def dm_anchors(cache: Path, stem: str, names: list) -> list:
    """[(time, name)] for every moment the DM (any other track) says a player's name.

    The DM naming someone is the strongest text-side evidence available: 'Paul, it is
    your turn' means the next utterance on a shared track is very likely Paul.
    """
    first = [n.split('(')[0].strip().split()[0].lower() for n in names]
    out = []
    for jf in sorted(cache.glob('*.json')):
        if jf.stem == stem or jf.name.endswith('.speakers.json'):
            continue
        try:
            segs = json.loads(jf.read_text(encoding='utf-8')).get('segments', [])
        except (ValueError, OSError):
            continue
        for s in segs:
            low = s['text'].lower()
            said = [n for n, f in zip(names, first) if re.search(r'\b' + re.escape(f) + r'\b', low)]
            if len(said) == 1:                      # naming two people anchors neither
                out.append((float(s['start']), said[0]))
    out.sort()
    return out


def pc_classes() -> dict:
    """{lowercased name or player name: class} from historian PC frontmatter.

    The display label is "Jeff (Iggy)" -- a player and a character, neither of which
    states a class. The class lives in the PC entity, so read it from there rather than
    trying to infer it from the label. Both the player name and the character name are
    keyed, since a --speakers label may use either.
    """
    out = {}
    pcs = ROOT / 'historian' / 'characters' / 'pcs'
    if not pcs.is_dir():
        return out
    for f in sorted(pcs.glob('*.md')):
        head = f.read_text(encoding='utf-8', errors='replace')[:1500]
        def field(key):
            m = re.search(r'^' + key + r':\s*(.+)$', head, re.M)
            return re.sub(r'[\[\]"\']', '', m.group(1)).strip().lower() if m else None
        cls, nm, player = field('class'), field('name'), field('player')
        if not cls:
            continue
        for key in (nm, player):
            if key:
                out[key] = cls
    return out


def score_clusters(segments: list, idx: list, lab, k: int, names: list, anchors: list) -> dict:
    """Vote each cluster -> speaker name, using DM anchors and class vocabulary.

    Returns {'votes': {cluster: {name: score}}, 'detail': [...]} for reporting. Nothing
    here touches individual labels; it only decides which cluster is whom.
    """
    votes = {c: {n: 0.0 for n in names} for c in range(k)}
    detail = []

    by_cluster = {}
    for row, seg_i in enumerate(idx):
        by_cluster.setdefault(int(lab[row]), []).append(seg_i)

    # -- DM anchors: an utterance inside the window after "<name>," votes for <name>
    for row, seg_i in enumerate(idx):
        t = float(segments[seg_i]['start'])
        near = {n for at, n in anchors if at <= t <= at + ANCHOR_WINDOW}
        if len(near) == 1:
            n = near.pop()
            if n in votes[int(lab[row])]:
                votes[int(lab[row])][n] += 1.0

    # -- class vocabulary: a monk-only line votes for whoever plays the monk.
    # The class comes from the PC entity, since "Jeff (Iggy)" names a player and a
    # character but never a class. Any word in the label may be the key: "Jeff (Iggy)"
    # matches on either "jeff" or "iggy".
    lookup = pc_classes()
    cls_of = {}
    for n in names:
        for tok in re.findall(r'[A-Za-z]+', n.lower()):
            if tok in lookup and lookup[tok] in CLASS_VOCAB:
                cls_of[n] = lookup[tok]
                break
    for row, seg_i in enumerate(idx):
        txt = segments[seg_i]['text'].lower()
        fired = [cls for cls, pats in CLASS_VOCAB.items() if any(re.search(p, txt) for p in pats)]
        if len(fired) != 1:
            continue
        for n, cls in cls_of.items():
            if cls == fired[0]:
                votes[int(lab[row])][n] += 3.0          # rarer than anchors, so weighted up
                detail.append((int(lab[row]), n, segments[seg_i]['text'][:70]))
    return {'votes': votes, 'detail': detail, 'sizes': {c: len(v) for c, v in by_cluster.items()}}


def assign_names(votes: dict, names: list, k: int) -> dict:
    """Greedy highest-vote-first cluster->name assignment, each name used once."""
    pairs = sorted(((v, c, n) for c, d in votes.items() for n, v in d.items()), reverse=True)
    out, used = {}, set()
    for v, c, n in pairs:
        if c in out or n in used or v <= 0:
            continue
        out[c] = n
        used.add(n)
    for c in range(k):                                   # unvoted clusters take what is left
        if c not in out:
            spare = [n for n in names if n not in used]
            out[c] = spare[0] if spare else names[0]
            used.add(out[c])
    return out


# -- Filling the gaps ---------------------------------------------------------

def fill(segments: list, idx: list, lab, conf, naming: dict, min_conf: float) -> tuple:
    """Every segment -> (name or None, confidence). Short/weak ones inherit a neighbour.

    A sub-second "yeah" has no usable voiceprint, but it almost always belongs to
    whoever was just talking, so it inherits the nearest confident label in time.
    Anything with no confident neighbour within a turn's reach stays None -- honestly
    unknown, which the transcript renders as the joint label.
    """
    named = {}
    for row, seg_i in enumerate(idx):
        if conf[row] >= min_conf:
            named[seg_i] = (naming[int(lab[row])], float(conf[row]))

    strong = sorted(named)
    out = []
    for i, s in enumerate(segments):
        if i in named:
            out.append(named[i])
            continue
        best, gap = None, 1e9
        t = float(s['start'])
        for j in strong:                                 # nearest confident label in time
            d = abs(float(segments[j]['start']) - t)
            if d < gap:
                gap, best = d, j
        if best is not None and gap <= ANCHOR_WINDOW / 3:
            out.append((named[best][0], -1.0))           # -1 marks inherited, not measured
        else:
            out.append((None, 0.0))
    return out


# -- Main ---------------------------------------------------------------------

def main() -> None:
    ap = argparse.ArgumentParser(
        description='Split one audio track that carries two or more speakers.')
    ap.add_argument('--session', required=True, help='session number or slug (e.g. 27)')
    ap.add_argument('--track', required=True, help='track filename stem (e.g. 1-eljeffe0024)')
    ap.add_argument('--speakers', required=True,
                    help='comma-separated display names sharing the track, '
                         'e.g. "Jeff (Iggy),Paul (Luci)"')
    ap.add_argument('--num-speakers', type=int, default=0,
                    help='cluster count (default: however many --speakers were given)')
    ap.add_argument('--min-confidence', type=float, default=DEFAULT_MIN_CONFIDENCE,
                    help='below this margin a label is left ambiguous (default %.2f)'
                         % DEFAULT_MIN_CONFIDENCE)
    ap.add_argument('--assign', action='append', default=[],
                    help='force a cluster to a name, e.g. --assign 0="Paul (Luci)". '
                         'Repeatable; overrides the vote.')
    ap.add_argument('--device', default='cpu', choices=['cpu', 'cuda'])
    ap.add_argument('--cluster-method', default='spectral',
                    choices=['spectral', 'kmeans', 'agglomerative'],
                    help='spectral (default) is what diarization systems use; kmeans is a '
                         'robust fallback; agglomerative is here for comparison')
    ap.add_argument('--force-embed', action='store_true',
                    help='recompute embeddings instead of reusing the cached ones')
    ap.add_argument('--dry-run', action='store_true',
                    help='report the split without writing the sidecar')
    args = ap.parse_args()

    names = [s.strip() for s in args.speakers.split(',') if s.strip()]
    if len(names) < 2:
        sys.exit('--speakers needs at least two comma-separated names')
    k = args.num_speakers or len(names)

    cwrite('\n========================================', 'darkgray')
    cwrite('  TRACK DIARIZER', 'cyan')
    cwrite('========================================', 'darkgray')

    slug, audio, cache = resolve(args.session, args.track)
    segments = json.loads((cache / (audio.stem + '.json')).read_text(encoding='utf-8'))['segments']
    cwrite('  session : ' + slug, 'white')
    cwrite('  track   : ' + audio.name + '  (' + str(len(segments)) + ' cached utterances)', 'white')
    cwrite('  split   : ' + str(k) + ' ways -> ' + ', '.join(names), 'white')

    # Decoding 3 hours of audio takes a while and is pure waste when the embeddings are
    # already cached, so it is deferred until embed() actually needs samples.
    emb_cache = cache / (audio.stem + '.emb.npz')

    def audio_samples():
        wav = decode(audio)
        cwrite('  audio   : %.1f min decoded at %d Hz mono'
               % (len(wav) / SAMPLE_RATE / 60, SAMPLE_RATE), 'darkgray')
        return wav

    idx, mat = embed(audio_samples, segments, args.device,
                     cache_file=emb_cache, force=args.force_embed)
    lab, conf = cluster(mat, k, args.cluster_method)

    anchors = dm_anchors(cache, audio.stem, names)
    ev = score_clusters(segments, idx, lab, k, names, anchors)
    naming = assign_names(ev['votes'], names, k)

    for spec in args.assign:                             # manual override wins
        raw_c, _, raw_n = spec.partition('=')
        try:
            c = int(raw_c.strip())
        except ValueError:
            sys.exit('--assign wants <cluster>=<name>, got: ' + spec)
        match = [n for n in names if raw_n.strip().strip('"\'').lower() in n.lower()]
        if not match:
            sys.exit("--assign name '" + raw_n.strip() + "' is not one of --speakers")
        naming[c] = match[0]

    cwrite('')
    cwrite('  --- cluster evidence (' + str(len(anchors)) + ' DM name anchors, '
           + str(len(ev['detail'])) + ' class-vocabulary hits) ---', 'darkcyan')
    if not ev['detail']:
        cwrite('  ! no class-vocabulary evidence -- naming rests on DM anchors alone, '
               'which is weaker. Check the vote margins below.', 'yellow')
    for c in range(k):
        v = ev['votes'][c]
        top = sorted(v.items(), key=lambda kv: -kv[1])
        tally = '  '.join('%s=%.0f' % (n.split('(')[0].strip(), s) for n, s in top)
        cwrite('  cluster %d  n=%-4d  -> %-20s  votes: %s'
               % (c, ev['sizes'].get(c, 0), naming[c], tally), 'white')
    for c, n, txt in ev['detail'][:8]:
        cwrite('      c%d vocab-> %s : "%s"' % (c, n.split('(')[0].strip(), txt), 'darkgray')

    # -- Sanity checks. A split can fail in two ways that both look like success
    # downstream, so say so loudly rather than writing a confident fiction.
    warn = []
    sizes = [ev['sizes'].get(c, 0) for c in range(k)]
    if min(sizes) < 0.1 * max(sizes):
        warn.append('degenerate: cluster sizes ' + '/'.join(str(s) for s in sizes)
                    + ' -- one cluster swallowed the track, so the voices did not separate')
    for c in range(k):
        top = sorted(ev['votes'][c].values(), reverse=True)
        if len(top) > 1 and top[0] > 0 and top[1] > 0.7 * top[0]:
            warn.append('cluster %d votes are near-tied (%s) -- it probably holds both voices'
                        % (c, ', '.join('%.0f' % v for v in top[:2])))
    if warn:
        cwrite('')
        for w in warn:
            cwrite('  ! ' + w, 'yellow')
        cwrite('  ! Treat this split as unreliable. Try --cluster-method kmeans, or keep the',
               'yellow')
        cwrite('    joint label and let the DM attribute at /recap.', 'yellow')

    final = fill(segments, idx, lab, conf, naming, args.min_confidence)

    counts, inherited, unknown = {}, 0, 0
    for n, c in final:
        if n is None:
            unknown += 1
        else:
            counts[n] = counts.get(n, 0) + 1
            if c < 0:
                inherited += 1
    cwrite('')
    cwrite('  --- result ---', 'darkcyan')
    for n in names:
        got = counts.get(n, 0)
        cwrite('  %-22s %4d utterances  (%.0f%%)' % (n, got, 100 * got / len(segments)), 'green')
    cwrite('  %-22s %4d  (short/weak, inherited from nearest confident neighbour)'
           % ('inherited:', inherited), 'darkgray')
    cwrite('  %-22s %4d  (left ambiguous -> keeps the joint track label)'
           % ('unresolved:', unknown), 'yellow' if unknown else 'darkgray')

    if args.dry_run:
        cwrite('')
        cwrite('  dry run -- nothing written.', 'yellow')
        cwrite('')
        return

    out = cache / (audio.stem + '.speakers.json')
    out.write_text(json.dumps({
        'stem': audio.stem,
        'speakers': names,
        'labels': [n for n, _ in final],
        'confidence': [round(c, 3) for _, c in final],
        'evidence': {
            'dm_anchors': len(anchors),
            'vocab_hits': len(ev['detail']),
            'cluster_sizes': ev['sizes'],
            'naming': {str(c): n for c, n in naming.items()},
        },
    }, indent=2), encoding='utf-8')

    cwrite('')
    cwrite('  -> ' + str(out.relative_to(ROOT)).replace('\\', '/'), 'cyan')
    cwrite('  next: uv run scripts/transcribe.py --session ' + str(args.session)
           + '  (re-merges from cache, no re-decode)', 'darkcyan')
    cwrite('')


if __name__ == '__main__':
    main()
