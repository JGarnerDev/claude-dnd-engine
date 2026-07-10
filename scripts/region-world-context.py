#!/usr/bin/env python3
# region-world-context.py -- geographic rules for a world map grid position
# consumers: CLAUDE.md, .claude/commands/region.md -- update these if usage, flags, or output format change.
# Usage: uv run scripts/region-world-context.py --col <n> --row <n>
# Grid assumption: ~16 cols x 13 rows, 1000km per cell, equator at row 7, poles at rows 1 and 13

import argparse
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, get_frontmatter_from_text, read_text_no_bom

GRID_KM = 1000

_COORD_RE = re.compile(r'[^0-9.]')


def _parse_coord(s, default: int = 0) -> int:
    """Parse a grid coordinate, supporting fractional values (rounds to nearest int).

    Matches PowerShell ``[int]($val -replace '[^0-9.]','')`` which keeps the
    decimal point before casting, so "3.5" rounds to 4 rather than becoming 35.
    """
    stripped = _COORD_RE.sub('', str(s or ''))
    try:
        return int(round(float(stripped))) if stripped else default
    except ValueError:
        return default


def climate_band(dist_from_equator: int) -> str:
    if dist_from_equator <= 1:
        return "Tropical / Equatorial"
    if dist_from_equator == 2:
        return "Subtropical -- warm, pronounced wet/dry seasons"
    if dist_from_equator == 3:
        return "Warm Temperate -- mild winters, hot summers"
    if dist_from_equator == 4:
        return "Cold-to-Warm Temperate -- four seasons, reliable rainfall"
    if dist_from_equator == 5:
        return "Cold Temperate / Continental -- harsh winters, short summers"
    return "Subarctic / Tundra -- permafrost possible, low biodiversity"


def wind_note(col: int, total_cols: int, dist_from_equator: int) -> str:
    col_pct = col / total_cols
    if col_pct <= 0.25:
        if dist_from_equator <= 1:
            return "Tropical western coast -- warm and humid year-round; distinct wet/dry seasons, not persistent grey"
        if dist_from_equator <= 2:
            return "Subtropical western coast -- Mediterranean pattern: hot dry summers, mild wet winters; sunny, not grey"
        if dist_from_equator <= 3:
            return "Warm temperate western coast -- mild, maritime; reliable year-round moisture; can be overcast but not cold"
        return "Temperate/cold western coast -- direct ocean exposure; maximum moisture, frequent storms; grey skies common"
    if col_pct <= 0.45:
        return "Western interior -- good moisture unless blocked by mountain ranges"
    if col_pct <= 0.65:
        return "Central interior -- moisture depends on local mountain barriers; drier than west"
    return "Eastern zone -- likely drier; western ranges may cast rain shadow here"


def nearby_world_entities(col: int, row: int, world_dir: Path) -> list:
    """Return description strings for world entities within 2 grid squares."""
    entities = []
    if not world_dir.exists():
        return entities
    for f in world_dir.glob("*.md"):
        try:
            raw = read_text_no_bom(f)
        except OSError:
            continue
        fm = get_frontmatter_from_text(raw)
        e_col = _parse_coord(fm.get("world_col", ""), 0)
        e_row = _parse_coord(fm.get("world_row", ""), 0)
        if e_col > 0 and e_row > 0:
            dist = math.sqrt((col - e_col) ** 2 + (row - e_row) ** 2)
            if dist <= 2:
                name = fm.get("name", "")
                desc = fm.get("description", "")
                entities.append(f"  {name} -- {desc}")
    return entities


def build_output(col: int, row: int, total_cols: int = 16, total_rows: int = 13,
                 world_dir: Path = None) -> list:
    """Return list of (text, color_name) tuples for the full output block."""
    equator_row = total_rows // 2 + 1
    hemisphere = "Northern" if row <= equator_row else "Southern"
    dist = abs(row - equator_row)
    band = climate_band(dist)
    wnote = wind_note(col, total_cols, dist)
    km_west = (col - 1) * GRID_KM
    km_north = (row - 1) * GRID_KM

    if world_dir is None:
        world_dir = ROOT / "data" / "locations" / "world"
    entities = nearby_world_entities(col, row, world_dir)

    lines = []  # (text, color)
    lines.append(("", None))
    lines.append(("========================================", "darkgray"))
    lines.append((f"  WORLD CONTEXT -- Col {col}, Row {row}", "cyan"))
    lines.append(("========================================", "darkgray"))
    lines.append(("", None))
    lines.append((f"Climate:    {band}", "white"))
    lines.append((f"Hemisphere: {hemisphere}", "gray"))
    lines.append((f"Position:   ~{km_west}km from western edge, ~{km_north}km from northern edge", "gray"))
    lines.append(("", None))
    lines.append(("-- Wind & Moisture ----------------------", "darkgray"))
    lines.append((f"  {wnote}", "gray"))
    lines.append(("  Prevailing direction: West -> East", "gray"))
    if dist <= 2:
        lines.append(("  West-facing slopes/coasts:  warm and moist; wet season distinct from dry; NOT persistently grey", "gray"))
    else:
        lines.append(("  West-facing slopes/coasts:  wet, lush, frequent storms; overcast common", "gray"))
    lines.append(("  East-facing slopes/coasts:  drier; rain shadow if mountains present", "gray"))
    lines.append(("", None))
    lines.append(("-- Rivers -------------------------------", "darkgray"))
    lines.append(("  Drain east/southeast off mountain ranges", "gray"))
    lines.append(("  Lakes form at mountain bases and along river courses", "gray"))
    lines.append(("", None))
    lines.append(("-- Coast Type (if applicable) -----------", "darkgray"))
    if dist <= 2:
        lines.append(("  West-facing (tropical/subtropical):  warm water; beaches possible; rocky headlands between bays", "gray"))
    else:
        lines.append(("  West-facing (temperate/cold):  rocky cliffs, sea stacks, no beaches", "gray"))
    lines.append(("  East-facing/bays:  calmer, sandy beaches", "gray"))
    lines.append(("  River mouths:      wide muddy estuaries", "gray"))
    lines.append(("  Polar coasts:      fjords", "gray"))
    lines.append(("", None))
    lines.append(("-- Scale --------------------------------", "darkgray"))
    lines.append(("  1 grid cell = 1000km x 1000km", "gray"))
    lines.append(("  Estimate how many grid squares wide the region covers", "yellow"))
    lines.append(("  then run: uv run scripts/region-scale.py --span-grids <n> --water-body <type>", "yellow"))
    lines.append(("", None))
    lines.append(("-- Water Body Checklist -----------------", "darkgray"))
    lines.append(("  Confirm before proceeding with draft:", "yellow"))
    lines.append(("  [ ] Entirely landlocked, or ocean-connected?", "gray"))
    lines.append(("  [ ] If ocean-connected -- which direction is the sea passage?", "gray"))
    lines.append(("  [ ] What major rivers feed into or drain out of this region?", "gray"))
    lines.append(("  [ ] Does any water body connect two separate regions?", "gray"))
    lines.append(("", None))
    lines.append(("-- Known World Entities Nearby ----------", "darkgray"))
    if entities:
        for e in entities:
            lines.append((e, "gray"))
    else:
        lines.append(("  None. Add world-scale entries to data/locations/world/", "darkyellow"))
        lines.append(("  Use schema: world_col, world_row fields for geographic indexing", "darkyellow"))
    lines.append(("", None))
    return lines


def render(col: int, row: int, total_cols: int = 16, total_rows: int = 13,
           world_dir: Path = None) -> list:
    """Return rendered plain-text lines (no color, for test assertions)."""
    return [text for text, _ in build_output(col, row, total_cols, total_rows, world_dir)]


def main():
    parser = argparse.ArgumentParser(
        description="Geographic rules for a world map grid position")
    parser.add_argument("--col", type=int, required=True, help="Grid column (1-based)")
    parser.add_argument("--row", type=int, required=True, help="Grid row (1-based)")
    parser.add_argument("--total-cols", type=int, default=16)
    parser.add_argument("--total-rows", type=int, default=13)
    args = parser.parse_args()

    for text, col_name in build_output(args.col, args.row, args.total_cols, args.total_rows):
        cwrite(text, col_name)


if __name__ == "__main__":
    main()
