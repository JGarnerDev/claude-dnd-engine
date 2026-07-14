#!/usr/bin/env python3
# monster-lookup.py -- filter monsters by CR, creature type, and/or habitat
# consumers: CLAUDE.md, meta/difficulty.md, data/CLAUDE.md -- update these if usage, flags, or output format change.
# Reads frontmatter only. Replaces manual Glob + Read loops over data/monsters/.
# Usage: uv run scripts/monster-lookup.py [--type <aberration|undead|...>] [--cr-min <n>] [--cr-max <n>] [--habitat <cave|forest|...>]

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, ci_contains, ci_eq, color, fmt_num, get_frontmatter


def parse_cr(cr_str):
    """'1/4' -> 0.25; plain number -> float; unparseable -> -1.0 (excluded)."""
    s = str(cr_str or "").strip()
    if "/" in s:
        num, _, den = s.partition("/")
        try:
            return float(num) / float(den)
        except (ValueError, ZeroDivisionError):
            return -1.0
    try:
        return float(s)
    except ValueError:
        return -1.0


def _clean_wikilink(s):
    """'[[Name|alias]]' -> 'Name'; a plain string is returned unchanged."""
    s = str(s).strip()
    if s.startswith("[[") and s.endswith("]]"):
        s = s[2:-2]
    return s.split("|")[0].strip()


def find_monsters(monsters_dir, type_filter="", cr_min=0.0, cr_max=30.0, habitat=""):
    results = []
    for f in sorted(Path(monsters_dir).glob("*.md"), key=lambda p: p.name):
        fm = get_frontmatter(f)
        if not fm:
            continue
        creature_type = fm.get("creature_type", "")
        if type_filter and not ci_eq(creature_type, type_filter):
            continue
        habitats = [_clean_wikilink(h) for h in fm.get("_list_habitats", [])]
        if habitat and not any(ci_contains(h, habitat) for h in habitats):
            continue
        cr_num = parse_cr(fm.get("challenge_rating", ""))
        if cr_num < 0 or cr_num < cr_min or cr_num > cr_max:
            continue
        results.append({
            "Name": fm.get("name", ""),
            "CR": fm.get("challenge_rating", ""),
            "CRNum": cr_num,
            "CreatureType": creature_type,
            "Habitats": ", ".join(habitats),
        })
    return results


def render(results, type_filter="", cr_min=None, cr_max=None, habitat=""):
    if not results:
        filters = []
        if type_filter:
            filters.append(f"type={type_filter}")
        if cr_min is not None:
            filters.append(f"CR>={fmt_num(cr_min)}")
        if cr_max is not None:
            filters.append(f"CR<={fmt_num(cr_max)}")
        if habitat:
            filters.append(f"habitat={habitat}")
        suffix = (" matching " + ", ".join(filters)) if filters else ""
        return [f"No monsters found{suffix}."]

    lines = []
    types = sorted({r["CreatureType"] for r in results}, key=lambda t: str(t).lower())
    for t in types:
        group = [r for r in results if r["CreatureType"] == t]
        lines.append(color(f"\n=== {t} ({len(group)}) ===", "cyan"))
        for m in sorted(group, key=lambda r: (r["CRNum"], str(r["Name"]).lower())):
            hab = f"  [{m['Habitats']}]" if m["Habitats"] else ""
            lines.append(color(f"  CR {str(m['CR']):<4}  {m['Name']}{hab}", "white"))
    lines.append(color(f"\nTotal: {len(results)} monsters", "yellow"))
    return lines


def main():
    parser = argparse.ArgumentParser(description="Filter monsters by CR, creature type, and/or habitat")
    parser.add_argument("--type", default="")
    parser.add_argument("--cr-min", type=float, default=None)
    parser.add_argument("--cr-max", type=float, default=None)
    parser.add_argument("--habitat", default="")
    args = parser.parse_args()

    cr_min = 0.0 if args.cr_min is None else args.cr_min
    cr_max = 30.0 if args.cr_max is None else args.cr_max
    results = find_monsters(ROOT / "data" / "monsters", args.type, cr_min, cr_max, args.habitat)
    for line in render(results, args.type, args.cr_min, args.cr_max, args.habitat):
        print(line)


if __name__ == "__main__":
    main()
