#!/usr/bin/env python3
# region-scale.py -- travel scale context for a region
# consumers: CLAUDE.md, .claude/commands/region.md -- update these if usage, flags, or output format change.
# Usage: uv run scripts/region-scale.py --span-grids <decimal> [--water-body sea|river|both|none] [--locations <n>]

import argparse
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import cwrite, fmt_num

GRID_KM = 1000


def build_output(span_grids: float, water_body: str = "none", locations: int = 0) -> list:
    """Return list of (text, color_name) tuples for the full output block."""
    if span_grids <= 0:
        lines = [
            ("", None),
            ("Usage: uv run scripts/region-scale.py --span-grids <n> [--water-body sea|river|both|none] [--locations <n>]", "yellow"),
            ("", None),
            ("--span-grids: fraction of a world map grid square this region covers", "gray"),
            ("  Example: 0.25 = 250km across | 0.5 = 500km | 1.0 = 1000km", "gray"),
            ("  Tip: compare region map width to world map grid lines to estimate", "gray"),
            ("", None),
        ]
        return lines

    width_km = int(span_grids * GRID_KM)
    foot = round(width_km / 30, 1)
    horse = round(width_km / 60, 1)
    barge_d = round(width_km / 80, 1)
    barge_u = round(width_km / 30, 1)
    ship = round(width_km / 150, 1)

    wb_lower = water_body.lower()

    lines = [
        ("", None),
        ("========================================", "darkgray"),
        (f"  REGION SCALE -- {fmt_num(span_grids)} grid = ~{width_km}km across", "cyan"),
        ("========================================", "darkgray"),
        ("", None),
        ("  Mode                  Speed       Region crossing", "white"),
        ("  ------------------------------------------------", "darkgray"),
        (f"  On foot               30km/day    ~{fmt_num(foot)} days", "gray"),
        (f"  Horseback             60km/day    ~{fmt_num(horse)} days", "gray"),
    ]

    if "river" in wb_lower or "both" in wb_lower:
        lines.append((f"  River barge (down)    80km/day    ~{fmt_num(barge_d)} days", "gray"))
        lines.append((f"  River barge (up)      30km/day    ~{fmt_num(barge_u)} days", "gray"))
    if "sea" in wb_lower or "ocean" in wb_lower or "both" in wb_lower:
        lines.append((f"  Coastal/sea ship     150km/day    ~{fmt_num(ship)} days", "gray"))

    lines += [
        ("", None),
        ("-- Modifiers ----------------------------", "darkgray"),
        ("  Mountain crossing:      +2-3 days per major range", "gray"),
        ("  Dense forest (foot):    -25% speed", "gray"),
        ("  Deep winter (overland): halve all speeds", "gray"),
        ("  Hostile territory:      avoid main roads; unpredictable delay", "gray"),
    ]

    if locations > 0:
        avg_spacing = int(width_km / math.sqrt(locations))
        foot_days = round(avg_spacing / 30, 1)
        horse_days = round(avg_spacing / 60, 1)
        lines += [
            ("", None),
            (f"-- City Spacing ({locations} locations) --------------", "darkgray"),
            (f"  Avg spacing between markers: ~{avg_spacing}km", "gray"),
            (f"  Nearest neighbors: ~{fmt_num(foot_days)} days on foot, ~{fmt_num(horse_days)} days on horse", "gray"),
        ]

    lines.append(("", None))
    return lines


def render(span_grids: float, water_body: str = "none", locations: int = 0) -> list:
    """Return rendered plain-text lines (no color, for test assertions)."""
    return [text for text, _ in build_output(span_grids, water_body, locations)]


def main():
    parser = argparse.ArgumentParser(description="Travel scale context for a region")
    parser.add_argument("--span-grids", type=float, default=0,
                        help="Fraction of a world map grid square this region covers")
    parser.add_argument("--water-body", default="none",
                        help="sea, river, both, or none")
    parser.add_argument("--locations", type=int, default=0,
                        help="Number of named locations for city spacing calc")
    args = parser.parse_args()

    for text, color_name in build_output(args.span_grids, args.water_body, args.locations):
        cwrite(text, color_name)


if __name__ == "__main__":
    main()
