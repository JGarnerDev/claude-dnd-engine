import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
rwc = importlib.import_module("region-world-context")


def test_climate_tropical():
    assert rwc.climate_band(0) == "Tropical / Equatorial"
    assert rwc.climate_band(1) == "Tropical / Equatorial"


def test_climate_subtropical():
    assert rwc.climate_band(2) == "Subtropical -- warm, pronounced wet/dry seasons"


def test_climate_subarctic():
    assert rwc.climate_band(6) == "Subarctic / Tundra -- permafrost possible, low biodiversity"
    assert rwc.climate_band(10) == "Subarctic / Tundra -- permafrost possible, low biodiversity"


def test_wind_western_coast_tropical():
    note = rwc.wind_note(1, 16, 0)
    assert "Tropical western coast" in note


def test_wind_western_coast_temperate():
    note = rwc.wind_note(1, 16, 4)
    assert "Temperate/cold western coast" in note


def test_wind_central_interior():
    note = rwc.wind_note(9, 16, 3)
    assert "Central interior" in note


def test_wind_eastern_zone():
    note = rwc.wind_note(14, 16, 3)
    assert "Eastern zone" in note


def test_hemisphere_northern():
    lines = rwc.render(4, 3)
    assert any("Northern" in l for l in lines)


def test_hemisphere_southern():
    lines = rwc.render(4, 11)
    assert any("Southern" in l for l in lines)


def test_position_km():
    lines = rwc.render(3, 2)
    # col 3 → (3-1)*1000 = 2000km from west; row 2 → (2-1)*1000 = 1000km from north
    assert any("2000km from western edge" in l for l in lines)
    assert any("1000km from northern edge" in l for l in lines)


def test_tropical_coast_text():
    # dist_from_equator <= 2 → tropical/subtropical coast text
    lines = rwc.render(1, 7)  # equator row on default 13-row grid = 7
    assert any("West-facing (tropical/subtropical)" in l for l in lines)


def test_temperate_coast_text():
    lines = rwc.render(1, 1)  # far north → dist 6
    assert any("West-facing (temperate/cold)" in l for l in lines)


def test_scale_hint_references_python_script():
    lines = rwc.render(4, 5)
    assert any("region-scale.py" in l for l in lines)


def test_no_world_entities(tmp_path):
    empty_world = tmp_path / "world"
    empty_world.mkdir()
    lines = rwc.render(4, 5, world_dir=empty_world)
    assert any("None." in l for l in lines)


def test_world_entity_nearby(tmp_path):
    world_dir = tmp_path / "world"
    world_dir.mkdir()
    ent = world_dir / "great-sea.md"
    ent.write_text(
        "---\nname: Great Sea\nworld_col: 4\nworld_row: 5\ndescription: A vast inland sea\n---\n",
        encoding="utf-8",
    )
    lines = rwc.render(4, 5, world_dir=world_dir)
    assert any("Great Sea" in l for l in lines)


def test_world_entity_far_away(tmp_path):
    world_dir = tmp_path / "world"
    world_dir.mkdir()
    ent = world_dir / "distant.md"
    ent.write_text(
        "---\nname: Distant Peak\nworld_col: 15\nworld_row: 1\ndescription: Far away\n---\n",
        encoding="utf-8",
    )
    lines = rwc.render(4, 5, world_dir=world_dir)
    assert not any("Distant Peak" in l for l in lines)


def test_header_contains_col_row():
    lines = rwc.render(6, 9)
    assert any("Col 6, Row 9" in l for l in lines)


def test_world_entity_fractional_coord(tmp_path):
    """Fractional world_col/world_row (e.g. "3.5") should round to nearest int, not concatenate digits."""
    world_dir = tmp_path / "world"
    world_dir.mkdir()
    ent = world_dir / "midpoint-sea.md"
    ent.write_text(
        "---\nname: Midpoint Sea\nworld_col: 3.5\nworld_row: 5.5\ndescription: A sea at the grid midpoint\n---\n",
        encoding="utf-8",
    )
    # col=4, row=6 is adjacent to the rounded (4, 6) position → within dist 2
    lines = rwc.render(4, 6, world_dir=world_dir)
    assert any("Midpoint Sea" in l for l in lines)
