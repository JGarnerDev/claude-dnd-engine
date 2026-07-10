import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
rb = importlib.import_module("region-brief")

DRAFT_NO_ZONES = """---
name: Ashenvale
world_position: Col 5, Row 3
climate: Cold Temperate
major_water: River Corren
exists: true
type: location
---

Some body text.
"""

DRAFT_WITH_ZONES = """---
name: Thornmarch
world_position: Col 8, Row 6
climate: Subtropical
exists: true
type: location
---

## Zone A

### Location 1 — River Delta

Geographic description.

**Candidate entities:**
- [[Mira the Fisher]] (character, paul) -- fits the coast

### Location 2 -- Hilltop

Geographic description.

**Candidate entities:**
None. No free entities fit this location.

## Open Questions

- **Political structure** — who rules?
- **Trade routes** — which sea lanes?
"""


def test_name_from_frontmatter(tmp_path):
    p = tmp_path / "ashenvale.md"
    p.write_text(DRAFT_NO_ZONES, encoding="utf-8")
    lines = rb.render(p)
    assert any("Ashenvale" in l for l in lines)


def test_name_falls_back_to_stem(tmp_path):
    p = tmp_path / "mystery-region.md"
    content = "---\nexists: true\ntype: location\n---\n# body\n"
    p.write_text(content, encoding="utf-8")
    lines = rb.render(p)
    assert any("mystery-region" in l for l in lines)


def test_climate_and_water_shown(tmp_path):
    p = tmp_path / "ashenvale.md"
    p.write_text(DRAFT_NO_ZONES, encoding="utf-8")
    lines = rb.render(p)
    assert any("Cold Temperate" in l for l in lines)
    assert any("River Corren" in l for l in lines)


def test_zone_and_location_counts(tmp_path):
    p = tmp_path / "thornmarch.md"
    p.write_text(DRAFT_WITH_ZONES, encoding="utf-8")
    lines = rb.render(p)
    # 1 zone (## Zone A), 2 locations (### Location 1, ### Location 2)
    assert any("Zones: 1" in l for l in lines)
    assert any("Locations: 2" in l for l in lines)


def test_anchored_entity_listed(tmp_path):
    p = tmp_path / "thornmarch.md"
    p.write_text(DRAFT_WITH_ZONES, encoding="utf-8")
    lines = rb.render(p)
    assert any("Anchored" in l for l in lines)
    assert any("Mira the Fisher" in l for l in lines)


def test_unanchored_listed(tmp_path):
    p = tmp_path / "thornmarch.md"
    p.write_text(DRAFT_WITH_ZONES, encoding="utf-8")
    lines = rb.render(p)
    assert any("Unanchored" in l for l in lines)
    assert any("2" in l for l in lines)


def test_open_questions_extracted(tmp_path):
    p = tmp_path / "thornmarch.md"
    p.write_text(DRAFT_WITH_ZONES, encoding="utf-8")
    lines = rb.render(p)
    assert any("Open Questions" in l for l in lines)
    assert any("Political structure" in l for l in lines)
    assert any("Trade routes" in l for l in lines)


def test_file_name_in_output(tmp_path):
    p = tmp_path / "thornmarch.md"
    p.write_text(DRAFT_WITH_ZONES, encoding="utf-8")
    lines = rb.render(p)
    assert any("thornmarch.md" in l for l in lines)


def test_no_zones_no_phase4(tmp_path):
    p = tmp_path / "ashenvale.md"
    p.write_text(DRAFT_NO_ZONES, encoding="utf-8")
    lines = rb.render(p)
    assert not any("Phase 4" in l for l in lines)


def test_phase4_when_zones_present(tmp_path):
    p = tmp_path / "thornmarch.md"
    p.write_text(DRAFT_WITH_ZONES, encoding="utf-8")
    lines = rb.render(p)
    assert any("Phase 4" in l for l in lines)


def test_questionnaire_phase_detected(tmp_path):
    drafts_dir = tmp_path / "regions"
    drafts_dir.mkdir()
    q_dir = tmp_path / "questionnaires"
    q_dir.mkdir()
    p = drafts_dir / "thornmarch.md"
    p.write_text(DRAFT_WITH_ZONES, encoding="utf-8")
    (q_dir / "thornmarch-city-1.md").write_text("q1", encoding="utf-8")
    (q_dir / "thornmarch-city-2.md").write_text("q2", encoding="utf-8")
    lines = rb.render(p, questionnaires_dir=q_dir)
    assert any("Phase 7 (2 questionnaires)" in l for l in lines)


def test_map_images_listed(tmp_path):
    p = tmp_path / "thornmarch.md"
    p.write_text(DRAFT_WITH_ZONES, encoding="utf-8")
    maps_dir = tmp_path / "maps" / "regions" / "thornmarch"
    maps_dir.mkdir(parents=True)
    (maps_dir / "overview.jpg").write_bytes(b"")
    lines = rb.render(p, maps_dir=maps_dir)
    assert any("overview.jpg" in l for l in lines)


def test_map_section_absent_when_no_maps_dir(tmp_path):
    p = tmp_path / "thornmarch.md"
    p.write_text(DRAFT_WITH_ZONES, encoding="utf-8")
    # Pass a non-existent maps_dir so the maps section is skipped entirely
    lines = rb.render(p, maps_dir=tmp_path / "nonexistent")
    assert not any("overview.jpg" in l for l in lines)


def test_find_draft_auto_detect(tmp_path):
    drafts_dir = tmp_path / "regions"
    drafts_dir.mkdir()
    p = drafts_dir / "solo.md"
    p.write_text(DRAFT_NO_ZONES, encoding="utf-8")
    found = rb.find_draft(drafts_dir, "")
    assert found == p


def test_find_draft_by_slug(tmp_path):
    drafts_dir = tmp_path / "regions"
    drafts_dir.mkdir()
    p = drafts_dir / "my-region.md"
    p.write_text(DRAFT_NO_ZONES, encoding="utf-8")
    found = rb.find_draft(drafts_dir, "my-region")
    assert found == p
