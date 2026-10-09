#!/usr/bin/env python3
# map-crop.py
# consumers: .claude/commands/region.md, maps/CLAUDE.md -- update these if usage, flags, or output format change.
# Crop a region from world-names.webp by feature name (looked up in the index) or by explicit col/row.
# Cell pixel size is derived from the master image's actual resolution at crop time.
# Saves permanent crops to maps/locations/<slug>-map.png.
# Saves temp crops to maps/world/temp-crop.png (caller must delete).
# --markers: also crop city-markers.webp to the same bounds -> <slug>-markers.png or temp-markers.png
#
# WARNING: keep --output inside maps/. .gitignore covers maps/**/*.{png,webp,...} but NOT
# arbitrary paths elsewhere. A crop written outside maps/ can be committed by accident --
# never commit generated images.
#
# Usage:
#   uv run scripts/map-crop.py --feature "Erevast"
#   uv run scripts/map-crop.py --feature "Erevast" --markers
#   uv run scripts/map-crop.py --feature "Erevast" --margin 500
#   uv run scripts/map-crop.py --col-min 5 --col-max 10 --row-min 2 --row-max 6
#   uv run scripts/map-crop.py --col-min 5 --col-max 10 --row-min 2 --row-max 6 --markers
#   uv run scripts/map-crop.py --col-min 5 --col-max 10 --row-min 2 --row-max 6 --output maps/locations/erevast-map.png

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT  # noqa: E402
from lib.map_common import crop_box, require_master, resolve_feature_bounds  # noqa: E402

INDEX_FILE = ROOT / "maps" / "world" / "index.md"
SOURCE_IMAGE = ROOT / "maps" / "world" / "masters" / "world-names.webp"
MARKERS_IMAGE = ROOT / "maps" / "world" / "masters" / "city-markers.webp"


def slugify(name: str) -> str:
    """lower-case, collapse non-alphanumeric runs to '-', trim leading/trailing '-'."""
    s = re.sub(r"[^a-z0-9]+", "-", name.lower())
    return s.strip("-")


def _resolve_out(path_str: str) -> Path:
    """Resolve an output path (relative paths are anchored at the repo root)."""
    p = Path(path_str)
    return p if p.is_absolute() else ROOT / p


def _crop_and_save(source: Path, col_min, col_max, row_min, row_max, margin,
                   out_display: str, label: str) -> None:
    from PIL import Image
    img = Image.open(source)
    w, h = img.size
    box = crop_box(w, h, col_min, col_max, row_min, row_max, margin)
    crop = img.crop(box)
    out_path = _resolve_out(out_display)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    crop.save(out_path)
    cw, ch = crop.size
    print(f"{label}{cw}x{ch}px from {w}x{h} master -> {out_display}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Crop the world map by feature or col/row")
    parser.add_argument("--feature", default="")
    parser.add_argument("--col-min", type=int, default=0)
    parser.add_argument("--col-max", type=int, default=0)
    parser.add_argument("--row-min", type=int, default=0)
    parser.add_argument("--row-max", type=int, default=0)
    parser.add_argument("--margin", type=int, default=112)
    parser.add_argument("--output", default="")
    parser.add_argument("--temp", action="store_true",
                        help="Save as temp-crop.png instead of maps/locations/")
    parser.add_argument("--markers", action="store_true",
                        help="Also crop city-markers to the same bounds")
    args = parser.parse_args()

    require_master(SOURCE_IMAGE)

    col_min, col_max = args.col_min, args.col_max
    row_min, row_max = args.row_min, args.row_max

    if args.feature:
        bounds = resolve_feature_bounds(INDEX_FILE, args.feature)
        if bounds is None:
            print(f"'{args.feature}' not found in Known Region Positions table in maps/world/index.md",
                  file=sys.stderr)
            sys.exit(1)
        col_min, col_max, row_min, row_max = bounds

    if col_min == 0 and col_max == 0:
        print("Provide --feature or --col-min/--col-max/--row-min/--row-max", file=sys.stderr)
        sys.exit(1)

    # Resolve base output path
    if args.output:
        output = args.output
    elif args.temp or not args.feature:
        output = "maps/world/temp-crop.png"
    else:
        output = f"maps/locations/{slugify(args.feature)}-map.png"

    _crop_and_save(SOURCE_IMAGE, col_min, col_max, row_min, row_max, args.margin,
                   output, label="Saved ")

    if args.temp:
        print(f"Temp file -- delete after reading: {output}", file=sys.stderr)

    if not args.markers:
        return

    require_master(MARKERS_IMAGE)
    if args.temp or not args.feature:
        markers_output = "maps/world/temp-markers.png"
    else:
        markers_output = f"maps/locations/{slugify(args.feature)}-markers.png"

    _crop_and_save(MARKERS_IMAGE, col_min, col_max, row_min, row_max, args.margin,
                   markers_output, label="Markers: ")


if __name__ == "__main__":
    main()
