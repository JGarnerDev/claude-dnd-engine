#!/usr/bin/env python3
# spitball-brief.py -- the spitball pile, filtered by frontmatter (see meta/spitball.md)
# consumers: .claude/commands/spitball.md, .claude/commands/session.md,
#   .claude/commands/flow.md -- update these if usage, flags, or output format change.
# Groups loose story ideas by target act, with subtype/campaign/state/heat filters so a planning
# session can pull the relevant pile in one call instead of walking the tree.
# Usage: python scripts/spitball-brief.py [--target <slug>] [--subtype <kind>] [--campaign <name>]
#                                         [--state <state>] [--min-heat <n>] [--all] [--count]
#   --target <slug>   : one act folder, or "unassigned"
#   --subtype <kind>  : act|session|encounter|npc|location|thread|twist|item|hook
#   --campaign <name> : homebrew|strahd|agnostic
#   --state <state>   : raw|developed|used|parked|killed  (default: hides used and killed)
#   --min-heat <n>    : only ideas rated at or above n
#   --all             : include used and killed
#   --count           : totals only, no listing
#
# Importable: gather(**filters) returns a list of dicts for session-brief.py and flow tooling.

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, color, get_frontmatter

SPITBALL_DIR = ROOT / 'spitball'

# Hidden unless --all or an explicit --state asks for them: a mined or dead idea is history,
# not a candidate, and leaving them in the default view buries the live pile.
ARCHIVED_STATES = {'used', 'killed'}

STATE_COLOR = {
    'raw': 'gray', 'developed': 'green', 'parked': 'yellow',
    'used': 'darkcyan', 'killed': 'red',
}


def gather(target=None, subtype=None, campaign=None, state=None, min_heat=None, include_all=False):
    """Return filtered spitballs as dicts, newest-updated first."""
    out = []
    if not SPITBALL_DIR.is_dir():
        return out

    for path in SPITBALL_DIR.rglob('*.md'):
        if path.name.lower() == 'readme.md':
            continue
        fm = get_frontmatter(path)
        if (fm.get('type') or '').strip().lower() != 'spitball':
            continue

        folder = path.parent.name
        item = {
            'path': path,
            'rel': path.relative_to(ROOT).as_posix(),
            'name': fm.get('name') or path.stem,
            'subtype': (fm.get('subtype') or '').strip().lower(),
            'campaign': (fm.get('campaign') or '').strip().lower(),
            'target': (fm.get('target') or 'unassigned').strip(),
            'folder': folder,
            'state': (fm.get('state') or 'raw').strip().lower(),
            'heat': _as_int(fm.get('heat')),
            'created': (fm.get('created') or '').strip(),
            'updated': (fm.get('updated') or '').strip(),
            'description': (fm.get('description') or '').strip(),
        }

        if state and item['state'] != state.lower():
            continue
        if not state and not include_all and item['state'] in ARCHIVED_STATES:
            continue
        if target and folder.lower() != target.lower() and item['target'].lower() != target.lower():
            continue
        if subtype and item['subtype'] != subtype.lower():
            continue
        if campaign and item['campaign'] != campaign.lower():
            continue
        if min_heat is not None and (item['heat'] is None or item['heat'] < min_heat):
            continue

        out.append(item)

    out.sort(key=lambda i: (i['updated'] or i['created'] or '', i['name']), reverse=True)
    return out


def _as_int(v):
    try:
        return int(str(v).strip())
    except (TypeError, ValueError):
        return None


def main():
    ap = argparse.ArgumentParser(description='Filter the spitball pile by frontmatter.')
    ap.add_argument('--target', help='act folder slug, or "unassigned"')
    ap.add_argument('--subtype', help='act|session|encounter|npc|location|thread|twist|item|hook')
    ap.add_argument('--campaign', help='homebrew|strahd|agnostic')
    ap.add_argument('--state', help='raw|developed|used|parked|killed')
    ap.add_argument('--min-heat', type=int, dest='min_heat', help='only ideas rated >= n')
    ap.add_argument('--all', action='store_true', help='include used and killed')
    ap.add_argument('--count', action='store_true', help='totals only')
    args = ap.parse_args()

    if not SPITBALL_DIR.is_dir():
        cwrite('No spitball/ directory yet.', 'yellow')
        cwrite('Run /spitball <idea> to file the first one.', 'gray')
        return 0

    items = gather(args.target, args.subtype, args.campaign, args.state,
                   args.min_heat, args.all)

    if not items:
        cwrite('=== SPITBALLS ===', 'cyan')
        filtered = any((args.target, args.subtype, args.campaign, args.state,
                        args.min_heat is not None))
        if filtered:
            cwrite('  nothing matches those filters.', 'yellow')
            if not args.all and not args.state:
                cwrite('  (used and killed ideas are hidden — pass --all to include them)', 'gray')
        else:
            cwrite('  the pile is empty.', 'yellow')
            cwrite('  Run /spitball <idea> to file the first one.', 'gray')
        return 0

    cwrite('=== SPITBALLS ===', 'cyan')

    if args.count:
        by_state, by_sub = {}, {}
        for i in items:
            by_state[i['state']] = by_state.get(i['state'], 0) + 1
            by_sub[i['subtype'] or '?'] = by_sub.get(i['subtype'] or '?', 0) + 1
        cwrite(f"  {len(items)} ideas")
        cwrite('  by state: ' + ' · '.join(
            color(f'{v} {k}', STATE_COLOR.get(k, 'white')) for k, v in sorted(by_state.items())))
        cwrite('  by kind:  ' + ' · '.join(f'{v} {k}' for k, v in sorted(by_sub.items())))
        return 0

    # Group by folder; unassigned last so the targeted piles read first.
    groups = {}
    for i in items:
        groups.setdefault(i['folder'], []).append(i)
    ordered = sorted(groups, key=lambda g: (g == 'unassigned', g))

    for folder in ordered:
        cwrite(f'\n  {folder}/', 'darkcyan')
        for i in groups[folder]:
            heat = f"  heat {i['heat']}" if i['heat'] is not None else ''
            tags = f"{i['subtype'] or '?'} · {i['campaign'] or '?'}"
            cwrite(f"    {i['name']}", 'white')
            cwrite('      ' + color(i['state'], STATE_COLOR.get(i['state'], 'white'))
                   + f" · {tags}{heat}")
            if i['description']:
                cwrite(f"      {i['description']}", 'gray')

    hidden = '' if (args.all or args.state) else '  (used/killed hidden — --all to include)'
    plural = '' if len(items) == 1 else 's'
    tplural = '' if len(groups) == 1 else 's'
    cwrite(f'\n  {len(items)} idea{plural} across {len(groups)} target{tplural}.{hidden}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
