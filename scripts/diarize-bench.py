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
# NOTE: same interpreter and deps as diarize-track.py, whose functions this imports --
# the bench must score the real code, not a copy of it.
# consumers: recaps/CLAUDE.md -- update it if usage, flags, or output format change.
# Usage: uv run scripts/diarize-bench.py --session <n> --tracks "<stem>,<stem>[,<stem>]"
#            [--method cluster|refs] [--cluster-method spectral|kmeans|agglomerative]
#            [--ref-sessions "<n>,<n>"] [--norm center|none] [--rounds <n>]
#            [--short inherit|weak] [--short-min <s>] [--short-pad <s>] [--prior-weight <x>]
#            [--min-confidence <x>] [--device cpu|cuda] [--force-embed]
"""
diarize-bench.py -- score a shared-microphone split against a known answer.

A real shared track has no ground truth: nobody knows who said each of its 1,100
lines, so a split can only be spot-checked by hand (session 30: 13 lines). This
builds a fake one that does have an answer. Craig records every speaker on their own
time-aligned track, so summing several solo tracks from one session gives one track
that sounds like those players sharing a microphone, while each solo track's cached
transcript still says exactly who spoke when.

    1. load each solo track's cached utterances (transcribe.py's JSON) -> the answer
    2. tag utterances that overlap another speaker's -- scored apart, since nobody
       can give them a single label
    3. sum the decoded tracks into one mixed waveform
    4. run a labelling method on the mix exactly as diarize-track.py would
    5. score it

The number that matters most is **confident-wrong**: a label the method measured and
stood behind, and got wrong. Those flow into /recap as attributions. An ambiguous
label costs the DM a question; a confident wrong one costs canon.

Caveat: in the mix each voice still arrives through its own microphone, so voices
differ by channel as well as by speaker, and the score runs optimistic next to a
genuinely shared mic. A method that fails here will fail for real; one that passes
here still needs checking against session 30's hand-verified lines.

Methods:
    cluster   diarize-track.py as it stands: cluster voiceprints, name the clusters
              from DM name-calls and class vocabulary. Also reports an "oracle naming"
              score -- the same clusters with the best possible names -- which shows
              whether a failure is in the clustering or in the naming.
    refs      match every line against voiceprints from the same players' solo tracks
              in other sessions (--ref-sessions), then adapt to the target track for
              --rounds. No clusters, so no naming step to get wrong.
"""

import argparse
import importlib.util
import itertools
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite

_spec = importlib.util.spec_from_file_location(
    'diarize_track', Path(__file__).resolve().parent / 'diarize-track.py')
dt = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(dt)

# An utterance counts as overlapped when another speaker's utterance covers at least
# this share of it. Whisper's segment edges are loose, so a small brush is not overlap.
OVERLAP_SHARE = 0.3


def build_truth(cache: Path, stems: list, names: list) -> list:
    """Every utterance from every solo track, time-sorted, tagged with its speaker."""
    segs = []
    for stem, name in zip(stems, names):
        data = json.loads((cache / (stem + '.json')).read_text(encoding='utf-8'))
        for s in data['segments']:
            segs.append({'start': float(s['start']), 'end': float(s['end']),
                         'text': s['text'], 'truth': name})
    segs.sort(key=lambda s: s['start'])

    # Overlap: sweep each segment against the others' that start before it ends.
    for i, s in enumerate(segs):
        dur = max(s['end'] - s['start'], 1e-6)
        covered = 0.0
        j = i - 1
        while j >= 0 and segs[j]['start'] > s['start'] - 60:
            o = segs[j]
            if o['truth'] != s['truth']:
                covered += max(0.0, min(s['end'], o['end']) - max(s['start'], o['start']))
            j -= 1
        j = i + 1
        while j < len(segs) and segs[j]['start'] < s['end']:
            o = segs[j]
            if o['truth'] != s['truth']:
                covered += max(0.0, min(s['end'], o['end']) - max(s['start'], o['start']))
            j += 1
        s['overlap'] = covered / dur >= OVERLAP_SHARE
    return segs


def mix(paths: list):
    """Decode each track and sum them into one waveform, padded to the longest."""
    import numpy as np

    acc = None
    for p in paths:
        wav = dt.decode(p)
        cwrite('  decoded : %s  (%.1f min)' % (p.name, len(wav) / dt.SAMPLE_RATE / 60),
               'darkgray')
        if acc is None:
            acc = wav
        else:
            if len(wav) > len(acc):
                acc, wav = wav, acc
            acc[:len(wav)] += wav
        del wav
    peak = float(np.abs(acc).max())
    if peak > 1.0:                                   # keep it in range, as a real mic would
        acc /= peak
    return acc


# -- Methods ------------------------------------------------------------------

def method_cluster(segs, idx, mat, names, cache, stems, args):
    """diarize-track.py's own pipeline, unchanged. Returns (final, extra report lines)."""
    k = len(names)
    lab, conf = dt.cluster(mat, k, args.cluster_method)
    anchors = dt.dm_anchors(cache, None, names, skip=set(stems))
    ev = dt.score_clusters(segs, idx, lab, k, names, anchors)
    naming = dt.assign_names(ev['votes'], names, k)
    final = dt.fill(segs, idx, lab, conf, naming, args.min_confidence)

    notes = ['%d DM name anchors, %d class-vocabulary hits'
             % (len(anchors), len(ev['detail']))]
    for c in range(k):
        mine = [segs[i]['truth'] for r, i in enumerate(idx) if int(lab[r]) == c]
        makeup = ', '.join('%s %d' % (n.split('(')[0].strip(), mine.count(n)) for n in names)
        notes.append('cluster %d -> %-18s holds: %s' % (c, naming[c], makeup))

    # Oracle naming: the best cluster->name mapping in hindsight. If this scores well
    # and the real naming does not, the voices separated and the naming failed.
    best, best_map = -1, None
    for perm in itertools.permutations(names, k):
        hits = sum(1 for r, i in enumerate(idx)
                   if not segs[i]['overlap'] and perm[int(lab[r])] == segs[i]['truth'])
        if hits > best:
            best, best_map = hits, dict(enumerate(perm))
    oracle = dt.fill(segs, idx, lab, conf, best_map, args.min_confidence)
    return final, notes, oracle


def method_refs(segs, idx, mat, names, cache, stems, args):
    """Match every line to voiceprints built from the players' solo tracks elsewhere."""
    handles = [dt.handle_of(s) for s in stems]
    sessions = [x.strip() for x in args.ref_sessions.split(',') if x.strip()]
    here = cache.name.replace('session-', '')
    if here in [x.replace('session-', '') for x in sessions]:
        cwrite('  ! --ref-sessions includes the bench session itself -- the answer leaks in',
               'yellow')
    refs = dt.ref_embeddings(handles, sessions, args.device)
    missing = [h for h in handles if h not in refs]
    if missing:
        sys.exit('no solo reference audio for: ' + ', '.join(missing))
    R = [refs[h] for h in handles]
    lab, conf, space = dt.match_refs(mat, R, norm=args.norm, rounds=args.rounds,
                                     min_conf=args.min_confidence)
    final = dt.fill(segs, idx, lab, conf, dict(enumerate(names)), args.min_confidence)

    notes = ['refs from session(s) %s, norm=%s, rounds=%d, short=%s'
             % (', '.join(sessions), args.norm, args.rounds, args.short)]
    if args.short == 'weak':
        final, n_weak = weak_pass(segs, idx, mat, lab, conf, space, names, cache, stems, args)
        notes.append('weak pass: %d low-confidence lines relabelled (min %.1fs, pad %.2fs, '
                     'neighbour weight %.2f)' % (n_weak, args.short_min, args.short_pad,
                                                 args.prior_weight))
    for c, n in enumerate(names):
        mine = [segs[i]['truth'] for r, i in enumerate(idx) if int(lab[r]) == c]
        makeup = ', '.join('%s %d' % (m.split('(')[0].strip(), mine.count(m)) for m in names)
        notes.append('%-18s %4d ref lines   labelled set holds: %s'
                     % (n, len(R[c]), makeup))
    return final, notes, None


def weak_pass(segs, idx, mat, lab, conf, space, names, cache, stems, args):
    """dt.refine_weak() on the mix, with the bench's tunable crop and neighbour settings."""
    tag = '-short%.1f-pad%.2f' % (args.short_min, args.short_pad)
    return dt.refine_weak(segs, idx, mat, lab, conf, space, names, args.get_wav,
                          args.device,
                          cache / ('_bench-' + '+'.join(stems) + tag + '.emb.npz'),
                          args.min_confidence, force=args.force_embed,
                          min_dur=args.short_min, pad=args.short_pad,
                          prior=args.prior_weight)


METHODS = {'cluster': method_cluster, 'refs': method_refs}


# -- Scoring ------------------------------------------------------------------

def score(segs: list, final: list, names: list) -> dict:
    """Tally labels against the answer. Overlapped utterances are counted apart."""
    r = {'clean': 0, 'overlap': 0, 'measured_ok': 0, 'measured_bad': 0,
         'inherited_ok': 0, 'inherited_bad': 0, 'unresolved': 0,
         'per': {n: {'total': 0, 'ok': 0, 'claimed': 0} for n in names}}
    for s, (lab, conf) in zip(segs, final):
        if s['overlap']:
            r['overlap'] += 1
            continue
        r['clean'] += 1
        r['per'][s['truth']]['total'] += 1
        if lab is None:
            r['unresolved'] += 1
            continue
        r['per'][lab]['claimed'] += 1
        ok = lab == s['truth']
        if ok:
            r['per'][lab]['ok'] += 1
        kind = 'inherited' if conf < 0 else 'measured'
        r[kind + ('_ok' if ok else '_bad')] += 1
    return r


def pct(a, b):
    return '%5.1f%%' % (100.0 * a / b) if b else '   - '


def report(title: str, r: dict, names: list) -> None:
    labelled = r['measured_ok'] + r['measured_bad'] + r['inherited_ok'] + r['inherited_bad']
    right = r['measured_ok'] + r['inherited_ok']
    cwrite('')
    cwrite('  --- ' + title + ' ---', 'darkcyan')
    cwrite('  clean utterances  %4d   (overlapped, not scored: %d)'
           % (r['clean'], r['overlap']), 'white')
    cwrite('  accuracy          %s  of labelled (%d/%d)' % (pct(right, labelled), right, labelled),
           'green' if labelled and right / labelled >= 0.9 else 'yellow')
    cwrite('  coverage          %s  labelled at all' % pct(labelled, r['clean']), 'white')
    bad = r['measured_bad']
    cwrite('  confident-wrong   %s  (%d measured labels wrong, of %d measured)'
           % (pct(bad, r['measured_ok'] + bad), bad, r['measured_ok'] + bad),
           'red' if bad and bad / max(1, r['measured_ok'] + bad) > 0.1 else 'white')
    cwrite('  inherited         %s  right (%d/%d)'
           % (pct(r['inherited_ok'], r['inherited_ok'] + r['inherited_bad']),
              r['inherited_ok'], r['inherited_ok'] + r['inherited_bad']), 'white')
    cwrite('  unresolved        %4d   (left on the joint label)' % r['unresolved'], 'white')
    for n in names:
        p = r['per'][n]
        cwrite('    %-20s recall %s   precision %s   (%d lines)'
               % (n, pct(p['ok'], p['total']), pct(p['ok'], p['claimed']), p['total']),
               'darkgray')


# -- Main ---------------------------------------------------------------------

def main() -> None:
    ap = argparse.ArgumentParser(
        description='Score a shared-mic split on a fake shared track built from solo tracks.')
    ap.add_argument('--session', required=True, help='session with solo tracks, e.g. 29')
    ap.add_argument('--tracks', required=True,
                    help='comma-separated solo track stems to mix, e.g. '
                         '"1-rugn_n_mickn,3-dynamicpenny,4-akumakel"')
    ap.add_argument('--method', default='cluster', choices=sorted(METHODS))
    ap.add_argument('--cluster-method', default='spectral',
                    choices=['spectral', 'kmeans', 'agglomerative'])
    ap.add_argument('--min-confidence', type=float, default=dt.DEFAULT_MIN_CONFIDENCE)
    ap.add_argument('--ref-sessions', default='',
                    help='refs method: sessions whose solo tracks give the voiceprints, '
                         'e.g. "26,28" -- leave the bench session out')
    ap.add_argument('--norm', default='none', choices=['center', 'none'])
    ap.add_argument('--rounds', type=int, default=2,
                    help='refs method: adaptation rounds on the target track (default 2)')
    ap.add_argument('--short', default='weak', choices=['inherit', 'weak'],
                    help='refs method: low-confidence lines copy the nearest confident '
                         'label (inherit), or are scored on voice plus neighbours (weak)')
    ap.add_argument('--short-min', type=float, default=dt.WEAK_MIN_DUR,
                    help='weak pass: shortest crop worth embedding, seconds')
    ap.add_argument('--short-pad', type=float, default=dt.WEAK_PAD,
                    help='weak pass: seconds of context added each side of a short crop')
    ap.add_argument('--prior-weight', type=float, default=dt.WEAK_PRIOR,
                    help='weak pass: weight of the neighbours vote against the voice match')
    ap.add_argument('--device', default='cpu', choices=['cpu', 'cuda'])
    ap.add_argument('--force-embed', action='store_true',
                    help='recompute the mix embeddings instead of reusing the cache')
    args = ap.parse_args()

    raw = [t.strip() for t in args.tracks.split(',') if t.strip()]
    if len(raw) < 2:
        sys.exit('--tracks needs at least two stems')

    cwrite('\n========================================', 'darkgray')
    cwrite('  DIARIZE BENCH', 'cyan')
    cwrite('========================================', 'darkgray')

    paths, cache = [], None
    for t in raw:
        slug, path, cache = dt.resolve(args.session, t)
        paths.append(path)
    stems = [p.stem for p in paths]
    labels = dt.speaker_map(paths[0].parent)
    names = [labels.get(s.lower(), s) for s in stems]
    if len(set(names)) != len(names):
        sys.exit('two tracks share a speaker label: ' + ', '.join(names))

    segs = build_truth(cache, stems, names)
    cwrite('  session : ' + slug, 'white')
    cwrite('  mix     : ' + ' + '.join(names), 'white')
    cwrite('  answer  : %d utterances, %d overlapped'
           % (len(segs), sum(s['overlap'] for s in segs)), 'white')

    emb_cache = cache / ('_bench-' + '+'.join(stems) + '.emb.npz')
    args.get_wav = lambda: mix(paths)
    idx, mat = dt.embed(args.get_wav, segs, args.device,
                        cache_file=emb_cache, force=args.force_embed)

    final, notes, oracle = METHODS[args.method](segs, idx, mat, names, cache, stems, args)

    cwrite('')
    cwrite('  --- ' + args.method + ' ---', 'darkcyan')
    for n in notes:
        cwrite('  ' + n, 'darkgray')
    report(args.method, score(segs, final, names), names)
    if oracle is not None:
        report(args.method + ', oracle naming (best names in hindsight)',
               score(segs, oracle, names), names)
    cwrite('')


if __name__ == '__main__':
    main()
