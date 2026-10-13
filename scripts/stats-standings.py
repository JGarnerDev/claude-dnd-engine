#!/usr/bin/env python3
# stats-standings.py -- one session's stats awards, season leaderboards, lifetime leaders and
# previous-season standings, from historian/sessions/_stats.md (meta/stats.md)
# consumers: .claude/commands/recap.md, meta/stats.md -- update these if usage, flags, or output format change.
# Usage: python scripts/stats-standings.py [--session <n>] [--json]
#   With no --session, uses the newest session in the ledger.

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite  # noqa: E402
from lib.stats import load_catalog, load_ledger, standings  # noqa: E402


def fmt(x: dict) -> str:
    return f"{'~' if x['rough'] else ''}{x['value']}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--session', type=int)
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--root', default=str(ROOT))
    args = ap.parse_args()
    root = Path(args.root)

    number = args.session
    if number is None:
        ledger, _ = load_ledger(root, {c['id'] for c in load_catalog(root)})
        number = max(ledger, default=None)
    data = standings(root, number) if number is not None else None
    if args.json:
        print(json.dumps(data, ensure_ascii=False))
        return
    if not data:
        cwrite(f'No stats ledgered for session {number}.' if number else 'Stats ledger is empty.')
        return

    cwrite(f"\n=== STATS: SESSION {data['session']} ({data['campaign']}) ===", 'cyan')
    cwrite(f"  Season: sessions {data['season']['first']}-{data['season']['last']}")
    cwrite('\n--- AWARDS ---', 'cyan')
    for a in data['awards']:
        star = '  * personal best: ' + ', '.join(a['best']) if a['best'] else ''
        cwrite(f"  {a['award']}: {', '.join(a['pcs'])} ({fmt(a)} {a['label'].lower()}){star}")
    cwrite('\n--- SEASON LEADERBOARDS ---', 'cyan')
    for b in data['leaderboards']:
        cwrite(f"  {b['label']}: " + ', '.join(f"{r['pc']} {fmt(r)}" for r in b['rows']))
    cwrite('\n--- HALL OF FAME (lifetime) ---', 'cyan')
    for h in data['lifetime']:
        cwrite(f"  {h['label']}: {', '.join(h['pcs'])} {fmt(h)}")
    prev = data['previousSeason']
    if prev:
        cwrite(f"\n--- PREVIOUS SEASON ({prev['campaign']}, sessions {prev['first']}-{prev['last']}) ---", 'cyan')
        for b in prev['leaderboards']:
            cwrite(f"  {b['label']}: " + ', '.join(f"{r['pc']} {fmt(r)}" for r in b['rows']))
    for w in data['warnings']:
        cwrite(f'  ! {w}', 'yellow')


if __name__ == '__main__':
    main()
