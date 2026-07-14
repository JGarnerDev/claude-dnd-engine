import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
pb = importlib.import_module("pitch-brief")

WB = """---
x: y
---

## Tone

Dark and political.

## Core Themes

- Intrigue
- Scarcity

## Setting Pillars
"""

HIST = """# Pitch history

- npc: A brooding smuggler
- location: A drowned temple
- npc: A retired assassin
"""


def test_worldbuilding_tone_and_themes(tmp_path):
    p = tmp_path / "worldbuilding.md"
    p.write_text(WB, encoding="utf-8")
    lines = pb.worldbuilding_lines(p)
    assert lines == ["\nTone: Dark and political.", "Themes: Intrigue | Scarcity"]


def test_worldbuilding_missing(tmp_path):
    assert pb.worldbuilding_lines(tmp_path / "nope.md") == ["\n(worldbuilding.md not found)"]


def test_history_all(tmp_path):
    p = tmp_path / "hist.md"
    p.write_text(HIST, encoding="utf-8")
    lines = pb.history_lines(p)
    assert lines[0] == "\nPitch history (all):"
    assert "  - npc: A brooding smuggler" in lines


def test_history_typed(tmp_path):
    p = tmp_path / "hist.md"
    p.write_text(HIST, encoding="utf-8")
    lines = pb.history_lines(p, type_filter="npc")
    assert lines[0] == "\nnpc history (2 entries - avoid all):"
    assert "  A brooding smuggler" in lines
    assert "  A retired assassin" in lines


def test_history_typed_none(tmp_path):
    p = tmp_path / "hist.md"
    p.write_text(HIST, encoding="utf-8")
    assert pb.history_lines(p, type_filter="deity") == ["\ndeity history: none"]


def test_history_missing_file(tmp_path):
    assert pb.history_lines(tmp_path / "nope.md") == ["\nPitch history: none"]
