"""map_common.py -- shared helpers for map scripts.
consumers: scripts/map-crop.py, scripts/count-markers.py

Map masters and tiles are NOT committed -- masters are fetched from the CDN and
tiles are generated locally. Scripts that need a master must guard for its
presence and tell the user how to produce it.
"""

import re
import sys
from pathlib import Path

# Grid is 16 cols x 13 rows (structural). Cell pixel size is NEVER hardcoded --
# it is derived per-image from the master's actual resolution at run time
# (cw = W / NCOLS, ch = H / NROWS), so any export resolution works unchanged.
NCOLS = 16
NROWS = 13


def require_master(path) -> None:
    """Exit with fetch/regen instructions if a master image is missing.

    Mirrors the PowerShell Require-Master guard: writes to stderr and exits 1
    so a cold clone (no CDN masters) fails loudly instead of tiling garbage.
    """
    if not Path(path).exists():
        print(
            f"Master image not found: {path}\n"
            "Map masters are not committed -- fetch them first, then regenerate tiles:\n"
            "  uv run scripts/fetch-maps.py\n"
            "  uv run scripts/gen-tiles.py",
            file=sys.stderr,
        )
        sys.exit(1)


def resolve_feature_bounds(index_path, feature):
    """Look a feature's col/row span up in the index's Known Region Positions
    table. Returns (col_min, col_max, row_min, row_max) or None if not found.

    Matches rows like: | Feature | ~colMin-colMax | ~rowMin-rowMax | ...
    A single value (no dash) collapses max to min.
    """
    pattern = re.compile(
        r"\|\s*" + re.escape(feature) + r"\s*\|\s*~?(\d+)[^\d]*(\d*)\s*\|\s*~?(\d+)[^\d]*(\d*)\s*\|"
    )
    for line in Path(index_path).read_text(encoding="utf-8").splitlines():
        m = pattern.search(line)
        if m:
            col_min = int(m.group(1))
            col_max = int(m.group(2)) if m.group(2) else col_min
            row_min = int(m.group(3))
            row_max = int(m.group(4)) if m.group(4) else row_min
            return col_min, col_max, row_min, row_max
    return None


def crop_box(width, height, col_min, col_max, row_min, row_max, margin,
             ncols=NCOLS, nrows=NROWS):
    """Pixel crop box (left, top, right, bottom) for a grid-cell span, derived
    from the master's actual resolution and clamped to the image bounds."""
    cw, ch = width / ncols, height / nrows
    left = max(0, round((col_min - 1) * cw) - margin)
    top = max(0, round((row_min - 1) * ch) - margin)
    right = min(width, round(col_max * cw) + margin)
    bottom = min(height, round(row_max * ch) + margin)
    return left, top, right, bottom
