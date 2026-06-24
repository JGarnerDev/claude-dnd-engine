#!/usr/bin/env python3
# location-entities.py -- find all historian entities at or near a location
# consumers: CLAUDE.md -- update these if usage, flags, or output format change.
# Hop 0: direct location/region/relates_to match
# Hops 1-N: BFS via all frontmatter entity-name references
# Usage: python scripts/location-entities.py --location "Barovia Village" [--depth 3]

import argparse
import sys
from collections import deque
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, get_frontmatter


def get_all_refs(fm):
    refs = []
    for key, val in fm.items():
        if key.startswith('_list_'):
            refs.extend(val)
        elif isinstance(val, str) and val != '':
            refs.append(val)
    return refs


def matches_location(fm, loc):
    loc_lower = loc.lower()
    for key in ('location', 'region'):
        v = fm.get(key)
        if v and loc_lower in v.lower():
            return True
    for key in ('_list_locations', '_list_relates_to'):
        for item in fm.get(key, []):
            if loc_lower in item.lower():
                return True
    return False


def main():
    parser = argparse.ArgumentParser(description='Historian entities at or near a location')
    parser.add_argument('--location', required=True)
    parser.add_argument('--depth', type=int, default=3)
    args = parser.parse_args()
    depth = args.depth

    hist_dir = ROOT / 'historian'
    entity_index = {}    # canonical name -> { fm, file }
    entity_by_lower = {}  # lowercase name -> canonical name

    for f in hist_dir.rglob('*.md'):
        fm = get_frontmatter(f)
        name = fm.get('name')
        if name:
            entity_index[name] = {'fm': fm, 'file': f}
            entity_by_lower[name.lower()] = name

    visited = {}   # canonical name -> hop distance
    queue = deque()

    for name in entity_index:
        if matches_location(entity_index[name]['fm'], args.location):
            if name not in visited:
                visited[name] = 0
                queue.append(name)

    while queue:
        current = queue.popleft()
        current_hop = visited[current]
        if current_hop >= depth:
            continue
        for ref in get_all_refs(entity_index[current]['fm']):
            ref_key = ref.strip().lower()
            if ref_key in entity_by_lower:
                ename = entity_by_lower[ref_key]
                if ename not in visited:
                    visited[ename] = current_hop + 1
                    queue.append(ename)

    if not visited:
        cwrite(f"No historian entities found referencing '{args.location}'.", 'yellow')
        cwrite("Try a partial name (e.g. 'Barovia' instead of 'Barovia Village').", 'darkgray')
        return

    cwrite(f"\n=== Entities near: {args.location} ({len(visited)} total, depth {depth}) ===", 'cyan')

    for hop in range(depth + 1):
        hop_names = [n for n in visited if visited[n] == hop]
        if not hop_names:
            continue

        label = "Direct" if hop == 0 else f"Hop {hop}"
        cwrite(f"\n--- {label} ({len(hop_names)}) ---", 'magenta')

        hop_results = []
        for name in hop_names:
            fm = entity_index[name]['fm']
            rel = str(entity_index[name]['file'].relative_to(ROOT))
            hop_results.append({
                'Name': fm.get('name'),
                'Type': fm.get('type'),
                'Subtype': fm.get('subtype'),
                'State': fm.get('state'),
                'Exists': fm.get('exists'),
                'Importance': fm.get('importance'),
                'Desc': fm.get('description'),
                'File': rel,
            })

        types = sorted({r['Type'] for r in hop_results}, key=lambda t: (t is None, t))
        for t in types:
            group = [r for r in hop_results if r['Type'] == t]
            cwrite(f"\n  [{t}]", 'yellow')
            for r in sorted(group, key=lambda r: (str(r['Importance'] or ''), str(r['Name'] or ''))):
                sub = f"/{r['Subtype']}" if r['Subtype'] else ""
                exists_color = 'green' if r['Exists'] == 'true' else 'darkyellow'
                cwrite("    {0}{1} - {2}".format(r['Name'], sub, r['State']), exists_color)
                if r['Desc']:
                    cwrite(f"      {r['Desc']}", 'darkgray')

    cwrite("")


if __name__ == '__main__':
    main()
