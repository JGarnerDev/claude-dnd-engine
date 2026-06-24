#!/usr/bin/env python3
# route-cities.py -- find all cities served by a given trade route
# consumers: CLAUDE.md, meta/schemas/location-city.md -- update these if usage, flags, or output format change.
# Searches data/ and historian/ city files for a routes field match
# Usage: python scripts/route-cities.py --route "The Irongate Road"

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, get_frontmatter

IMPORTANCE_ORDER = {'critical': 0, 'major': 1, 'minor': 2, 'background': 3, '-': 4}


def main():
    parser = argparse.ArgumentParser(description='Cities served by a trade route')
    parser.add_argument('--route', required=True)
    args = parser.parse_args()
    route = args.route

    search_dirs = [
        ROOT / 'data' / 'locations' / 'cities',
        ROOT / 'historian' / 'locations' / 'cities',
    ]

    results = []
    for d in search_dirs:
        if not d.exists():
            continue
        is_canon = 'historian' in d.parts
        for f in sorted(d.glob('*.md')):
            fm = get_frontmatter(f)
            route_list = fm.get('_list_routes')
            if not route_list:
                continue
            if not any(route in r for r in route_list):
                continue
            results.append({
                'Name': fm.get('name'),
                'Importance': fm.get('importance') or '-',
                'State': fm.get('state') or '-',
                'Canon': 'canon' if is_canon else 'free',
                'Desc': fm.get('description'),
                'File': str(f.relative_to(ROOT)),
            })

    if not results:
        cwrite(f"No cities found linked to route: {route}", 'yellow')
        cwrite("")
        cwrite("Add to a city's frontmatter:", 'darkgray')
        cwrite("  routes:", 'darkgray')
        cwrite(f"    - [[{route}]]", 'darkgray')
        return

    results.sort(key=lambda r: (IMPORTANCE_ORDER.get(r['Importance'], 4), str(r['Name'] or '').lower()))

    cwrite("")
    cwrite(f"=== Cities served by: {route} ({len(results)} found) ===", 'cyan')
    cwrite("")

    for r in results:
        color = 'green' if r['Canon'] == 'canon' else 'darkyellow'
        cwrite("  {0} [{1}] - {2} ({3})".format(r['Name'], r['Importance'], r['State'], r['Canon']), color)
        if r['Desc']:
            cwrite(f"    {r['Desc']}", 'darkgray')

    cwrite("")


if __name__ == '__main__':
    main()
