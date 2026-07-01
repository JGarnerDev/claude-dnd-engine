#!/usr/bin/env python3
# free-entities.py -- list all free (exists: false) entities in ./data
# consumers: CLAUDE.md, .claude/commands/entity-ingest.md, .claude/commands/entity-questionnaire.md, .claude/commands/region.md, .claude/commands/session.md, tests/commands/session/spec.md, data/CLAUDE.md -- update these if usage, flags, or output format change.
# Usage: python scripts/free-entities.py [--type npc|location|deity|etc] [--player paul|ben|miguel|jeff]

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, ci_eq, cwrite, get_frontmatter


def main() -> None:
    parser = argparse.ArgumentParser(description='List free (exists: false) entities in ./data')
    parser.add_argument('--type', default='')
    parser.add_argument('--player', default='')
    args = parser.parse_args()

    data_dir = ROOT / 'data'
    results = []
    for f in data_dir.rglob('*.md'):
        fm = get_frontmatter(f)
        if not ci_eq(fm.get('exists'), 'false'):
            continue
        if args.type and not ci_eq(fm.get('type'), args.type):
            continue
        if args.player and not ci_eq(fm.get('contributed_by'), args.player):
            continue
        results.append({
            'Name': fm.get('name'),
            'Type': fm.get('type'),
            'Subtype': fm.get('subtype'),
            'Importance': fm.get('importance'),
            'ContributedBy': fm.get('contributed_by'),
            'Description': fm.get('description'),
            'File': str(f.relative_to(ROOT)),
        })

    if not results:
        flt = []
        if args.type:
            flt.append(f"type '{args.type}'")
        if args.player:
            flt.append(f"player '{args.player}'")
        suffix = (" matching " + ", ".join(flt)) if flt else ""
        cwrite(f"No free entities found{suffix}.")
        return

    types = sorted({r['Type'] for r in results}, key=lambda t: (t is None, str(t or '').lower()))
    for t in types:
        group = [r for r in results if r['Type'] == t]
        cwrite(f"\n=== {t} ({len(group)}) ===", 'cyan')
        for r in sorted(group, key=lambda r: (str(r['Importance'] or '').lower(), str(r['Name'] or '').lower())):
            sub = f"/{r['Subtype']}" if r['Subtype'] else ""
            by = f" [{r['ContributedBy']}]" if r['ContributedBy'] else ""
            cwrite(f"  [{r['Importance']}] {r['Name']}{sub}{by}", 'white')
            if r['Description']:
                cwrite(f"    {r['Description']}", 'gray')

    cwrite(f"\nTotal: {len(results)} free entities", 'yellow')


if __name__ == '__main__':
    main()
