#!/usr/bin/env python3
# reputation-standings.py -- one homebrew session's reputation: each PC's world fame and infamy,
# that session's gains and top deeds, tier crossings (world and local), local scores and party
# fame, from historian/sessions/_reputation.md (meta/reputation.md)
# consumers: .claude/commands/recap.md, .claude/commands/session.md, meta/reputation.md,
#   scheduler/campaign/_reputation.md -- update these if usage, flags, or output format change.
# Usage: python scripts/reputation-standings.py [--session <n>] [--json]
#   With no --session, uses the newest session in the ledger.

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite  # noqa: E402
from lib.reputation import load_ledger, reputation  # noqa: E402


def track(r: dict) -> str:
    gain = f" (+{r['gain']:,})" if r['gain'] else ''
    return f"{r['score']:,} {r['tier']}{gain}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--session', type=int)
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--root', default=str(ROOT))
    args = ap.parse_args()
    root = Path(args.root)

    number = args.session if args.session is not None else max(load_ledger(root), default=None)
    data = reputation(root, number) if number is not None else None
    if args.json:
        print(json.dumps(data, ensure_ascii=False))
        return
    if not data:
        cwrite(f'No reputation for session {number} (not homebrew, or no deeds yet).'
               if number else 'Reputation ledger is empty.')
        return

    cwrite(f"\n=== REPUTATION: SESSION {data['session']} ===", 'cyan')
    cwrite(f"  Party fame: {data['partyFame']:,} {data['partyTier']}")
    cwrite('\n--- PCs ---', 'cyan')
    for p in data['pcs']:
        cwrite(f"  {p['pc']}: fame {track(p['fame'])} | infamy {track(p['infamy'])}")
        for d in p['deeds']:
            cwrite(f"    {d['track']} +{d['points']:,} @ {d['scope']}: {d['text']}")
        for loc in p['local']:
            bits = [f"{t} {loc[t]['score']:,} {loc[t]['tier']}" for t in ('fame', 'infamy') if loc[t]['score']]
            cwrite(f"    local {loc['place']}: " + ', '.join(bits))
    cwrite('\n--- TIER CROSSINGS ---', 'cyan')
    if not data['crossings']:
        cwrite('  none')
    for c in data['crossings']:
        where = 'world' if c['scope'] == 'world' else f"local, {c['scope']}"
        cwrite(f"  {c['pc']} -> {c['tier']} ({c['track']}, {where}): propose a reward", 'green')
    for w in data['warnings']:
        cwrite(f'  ! {w}', 'yellow')


if __name__ == '__main__':
    main()
