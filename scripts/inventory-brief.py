#!/usr/bin/env python3
# inventory-brief.py -- free entity pool inventory. Backbone of the /inventory command.
# consumers: CLAUDE.md, .claude/commands/inventory.md -- update these if usage, flags, or output format change.
# Replaces a manual frontmatter sweep of every file under data/ (1,200+ files).
# Reports exists:false entities grouped by type/subtype, plus a gaps section for
# pool types with zero free entities. Reference catalogs (exists:true) are skipped.
# Usage: python scripts/inventory-brief.py [--type <type>]

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, get_frontmatter

# Pool types checked in the gaps section (reference data like class/race/deity excluded)
POOL_TYPES = [
    'character/npc', 'event', 'faction', 'item/magic',
    'location/city', 'location/dungeon', 'location/region',
    'location/shop', 'location/wilderness', 'rumor',
]


def main():
    parser = argparse.ArgumentParser(description='Free entity pool inventory')
    parser.add_argument('--type', default='')
    args = parser.parse_args()

    groups = {}
    for f in (ROOT / 'data').rglob('*.md'):
        if f.name == 'CLAUDE.md':
            continue
        fm = get_frontmatter(f)
        if fm.get('exists') != 'false':
            continue
        key = f"{fm['type']}/{fm['subtype']}" if fm.get('subtype') else str(fm.get('type') or '')
        if not key or key == '/':
            key = '(untyped)'
        if args.type and args.type not in key:
            continue
        name = fm.get('name') or f.stem
        imp = fm.get('importance') or '-'
        act = fm.get('active') or '-'
        by = f" by:{fm['contributed_by']}" if fm.get('contributed_by') else ""
        groups.setdefault(key, []).append(f"    {name}  [importance: {imp} | active: {act}{by}]")

    cwrite("\n========================================", 'darkgray')
    cwrite("  FREE ENTITY INVENTORY", 'cyan')
    cwrite("========================================", 'darkgray')

    total = 0
    for key in sorted(groups):
        cwrite(f"\n  {key} ({len(groups[key])})", 'yellow')
        for line in sorted(groups[key]):
            cwrite(line, 'white')
        total += len(groups[key])
    cwrite(f"\n  Total free entities: {total}", 'cyan')

    if not args.type:
        gaps = [t for t in POOL_TYPES if t not in groups]
        if gaps:
            cwrite("\n--- GAPS (pool types with zero free entities) ---", 'red')
            for g in gaps:
                cwrite(f"  {g}", 'red')
        else:
            cwrite("\n  No pool-type gaps.", 'darkgray')

    cwrite("\n========================================\n", 'darkgray')


if __name__ == '__main__':
    main()
