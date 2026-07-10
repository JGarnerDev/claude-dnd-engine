import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
rs = importlib.import_module("region-scale")


def test_usage_when_no_span():
    lines = rs.render(0)
    assert any("--span-grids" in l for l in lines)


def test_header_contains_km():
    lines = rs.render(0.5)
    assert any("500km" in l for l in lines)


def test_foot_and_horse_always_present():
    lines = rs.render(0.5)
    assert any("On foot" in l for l in lines)
    assert any("Horseback" in l for l in lines)


def test_river_mode_shown_for_river():
    lines = rs.render(0.5, water_body="river")
    assert any("River barge" in l for l in lines)


def test_river_mode_shown_for_both():
    lines = rs.render(0.5, water_body="both")
    assert any("River barge" in l for l in lines)
    assert any("Coastal/sea ship" in l for l in lines)


def test_sea_mode_not_shown_for_none():
    lines = rs.render(0.5, water_body="none")
    assert not any("River barge" in l for l in lines)
    assert not any("Coastal/sea ship" in l for l in lines)


def test_sea_mode_shown_for_sea():
    lines = rs.render(0.5, water_body="sea")
    assert any("Coastal/sea ship" in l for l in lines)


def test_city_spacing_section_shown():
    lines = rs.render(1.0, locations=9)
    assert any("City Spacing" in l for l in lines)
    assert any("Avg spacing" in l for l in lines)


def test_city_spacing_not_shown_without_locations():
    lines = rs.render(1.0)
    assert not any("City Spacing" in l for l in lines)


def test_travel_times_are_plausible():
    # 1000km / 30 km/day = 33.3 days on foot
    lines = rs.render(1.0)
    assert any("33.3" in l for l in lines)


def test_whole_number_formatted_cleanly():
    # 300km across: foot = 300/30 = 10 days, horse = 300/60 = 5 days (both whole)
    lines = rs.render(0.3)
    foot_lines = [l for l in lines if "On foot" in l]
    assert foot_lines  # sanity
    assert any("~10 days" in l for l in foot_lines)
    horse_lines = [l for l in lines if "Horseback" in l]
    assert any("~5 days" in l for l in horse_lines)


def test_modifiers_always_present():
    lines = rs.render(0.5)
    assert any("Mountain crossing" in l for l in lines)
    assert any("Dense forest" in l for l in lines)
