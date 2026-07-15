#!/usr/bin/env python3
# count-markers.py
# consumers: CLAUDE.md, .claude/commands/region.md -- update these if usage, flags, or output format change.
# Count undetailed city markers (red dots) in a map region.
# Uses Pillow to detect and count distinct red blobs in city-markers.webp.
# Cell pixel size is derived from the master image's actual resolution at count time.
#
# Usage:
#   uv run scripts/count-markers.py --feature "Bay B"
#   uv run scripts/count-markers.py --col-min 4 --col-max 7 --row-min 3 --row-max 6

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT  # noqa: E402
from lib.map_common import NCOLS, NROWS, crop_box, require_master, resolve_feature_bounds  # noqa: E402

INDEX_FILE = ROOT / "maps" / "world" / "index.md"
MARKERS_IMAGE = ROOT / "maps" / "world" / "masters" / "city-markers.webp"

# 8-connected neighborhood for flood-filling contiguous red blobs.
_NEIGHBORS = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]


def _is_red(r, g, b) -> bool:
    return r > 160 and g < 110 and b < 110


def count_red_blobs(crop, min_area: int) -> int:
    """Count distinct red blobs (>= min_area px) in an RGB crop via flood fill."""
    w, h = crop.size
    pixels = crop.load()
    red = set()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if _is_red(r, g, b):
                red.add((x, y))

    count = 0
    while red:
        stack = [next(iter(red))]
        size = 0
        while stack:
            p = stack.pop()
            if p not in red:
                continue
            red.discard(p)
            size += 1
            x, y = p
            for dx, dy in _NEIGHBORS:
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    stack.append((nx, ny))
        if size >= min_area:
            count += 1
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description="Count undetailed city markers in a map region")
    parser.add_argument("--feature", default="")
    parser.add_argument("--col-min", type=int, default=0)
    parser.add_argument("--col-max", type=int, default=0)
    parser.add_argument("--row-min", type=int, default=0)
    parser.add_argument("--row-max", type=int, default=0)
    parser.add_argument("--margin", type=int, default=112)
    parser.add_argument("--min-area", type=int, default=-1,
                        help="-1 = auto (~0.0006 of a grid cell; scales with resolution). "
                             "Drops sub-dot specks (lava flecks / webp noise).")
    args = parser.parse_args()

    require_master(MARKERS_IMAGE)

    col_min, col_max = args.col_min, args.col_max
    row_min, row_max = args.row_min, args.row_max

    if args.feature:
        bounds = resolve_feature_bounds(INDEX_FILE, args.feature)
        if bounds is None:
            print(f"'{args.feature}' not in index -- provide --col-min/--col-max/--row-min/--row-max directly",
                  file=sys.stderr)
            sys.exit(1)
        col_min, col_max, row_min, row_max = bounds

    if col_min == 0 and col_max == 0:
        print("Provide --feature or --col-min/--col-max/--row-min/--row-max", file=sys.stderr)
        sys.exit(1)

    from PIL import Image
    img = Image.open(MARKERS_IMAGE).convert("RGB")
    w, h = img.size
    cw, ch = w / NCOLS, h / NROWS
    box = crop_box(w, h, col_min, col_max, row_min, row_max, args.margin)
    crop = img.crop(box)

    min_area = args.min_area if args.min_area >= 0 else max(6, round(cw * ch * 0.0006))
    count = count_red_blobs(crop, min_area)

    label = args.feature if args.feature else f"cols {col_min}-{col_max} rows {row_min}-{row_max}"
    print(f"Undetailed cities in '{label}': {count}")


if __name__ == "__main__":
    main()
