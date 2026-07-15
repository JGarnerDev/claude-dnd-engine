import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))

from lib import map_common  # noqa: E402
from PIL import Image  # noqa: E402

map_crop = importlib.import_module("map-crop")
count_markers = importlib.import_module("count-markers")
fetch_maps = importlib.import_module("fetch-maps")


# -- crop_box -----------------------------------------------------------------

def test_crop_box_basic_no_margin():
    # 1600x1300 with the 16x13 grid -> 100px cells.
    assert map_common.crop_box(1600, 1300, 5, 10, 2, 6, margin=0) == (400, 100, 1000, 600)


def test_crop_box_applies_and_clamps_margin():
    # Margin expands the box but left/top clamp to 0 and right/bottom to the edges.
    assert map_common.crop_box(1600, 1300, 1, 16, 1, 13, margin=50) == (0, 0, 1600, 1300)


def test_crop_box_derives_cell_size_from_resolution():
    # A different export resolution yields a proportionally scaled box, no code change.
    assert map_common.crop_box(3200, 2600, 5, 10, 2, 6, margin=0) == (800, 200, 2000, 1200)


# -- resolve_feature_bounds ---------------------------------------------------

def _write_index(tmp_path, *rows):
    body = "| Feature | Cols | Rows | Draft |\n|---|---|---|---|\n" + "".join(rows)
    p = tmp_path / "index.md"
    p.write_text(body, encoding="utf-8")
    return p


def test_resolve_feature_bounds_range(tmp_path):
    idx = _write_index(tmp_path, "| Erevast | ~5-10 | ~2-6 | draft |\n")
    assert map_common.resolve_feature_bounds(idx, "Erevast") == (5, 10, 2, 6)


def test_resolve_feature_bounds_single_value_collapses(tmp_path):
    idx = _write_index(tmp_path, "| Spire | 8 | 3 | — |\n")
    assert map_common.resolve_feature_bounds(idx, "Spire") == (8, 8, 3, 3)


def test_resolve_feature_bounds_missing_returns_none(tmp_path):
    idx = _write_index(tmp_path, "| Erevast | ~5-10 | ~2-6 | draft |\n")
    assert map_common.resolve_feature_bounds(idx, "Nowhere") is None


# -- slugify ------------------------------------------------------------------

def test_slugify_collapses_and_trims():
    assert map_crop.slugify("Erevast Bay!!") == "erevast-bay"
    assert map_crop.slugify("  --The Storm's Edge--  ") == "the-storm-s-edge"


# -- count_red_blobs ----------------------------------------------------------

def _red_block(px, x0, y0, w, h):
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            px[x, y] = (255, 0, 0)


def test_count_red_blobs_counts_distinct_dots():
    img = Image.new("RGB", (100, 100), (255, 255, 255))
    px = img.load()
    _red_block(px, 10, 10, 5, 5)   # 25 px
    _red_block(px, 60, 60, 5, 5)   # 25 px, separated
    assert count_markers.count_red_blobs(img, min_area=1) == 2


def test_count_red_blobs_min_area_drops_specks():
    img = Image.new("RGB", (100, 100), (255, 255, 255))
    px = img.load()
    _red_block(px, 10, 10, 5, 5)   # 25 px -- kept
    px[80, 80] = (255, 0, 0)       # 1 px speck -- dropped
    assert count_markers.count_red_blobs(img, min_area=6) == 1


def test_count_red_blobs_ignores_non_red():
    img = Image.new("RGB", (50, 50), (10, 200, 10))  # all green
    assert count_markers.count_red_blobs(img, min_area=1) == 0


# -- parse_manifest -----------------------------------------------------------

def test_parse_manifest_valid_and_skips_comments():
    text = "# comment\n\nmaps/a.webp\thttps://cdn/a\nmaps/b.webp\thttps://cdn/b\n"
    entries, warnings = fetch_maps.parse_manifest(text)
    assert entries == [("maps/a.webp", "https://cdn/a"), ("maps/b.webp", "https://cdn/b")]
    assert warnings == []


def test_parse_manifest_flags_malformed():
    text = "maps/ok.webp\thttps://cdn/ok\nno-tab-here\n"
    entries, warnings = fetch_maps.parse_manifest(text)
    assert entries == [("maps/ok.webp", "https://cdn/ok")]
    assert warnings == ["no-tab-here"]
