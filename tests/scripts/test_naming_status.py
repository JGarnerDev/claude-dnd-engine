import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
ns = importlib.import_module("naming-status")

SAMPLE = """# World Naming

## Rivers

### The long river
**Name:** Silverflow

### The short river
**Name:**

## Plains

### The wide plain
**Name:**

## Locked
- Old Capital => **Kingsholt** *(paul)*
"""


def test_parse_named_unnamed_and_locked():
    named, unnamed = ns.parse_naming(SAMPLE)
    assert {(n["Section"], n["Entry"], n["Name"]) for n in named} == {
        ("Rivers", "The long river", "Silverflow"),
        ("Locked", "Old Capital", "Kingsholt"),
    }
    assert {(u["Section"], u["Entry"]) for u in unnamed} == {
        ("Rivers", "The short river"),
        ("Plains", "The wide plain"),
    }


def test_render_counts_and_groups():
    named, unnamed = ns.parse_naming(SAMPLE)
    lines = ns.render(named, unnamed)
    assert lines[:3] == [
        "",
        "World Naming Status",
        "Named: 2 / 4  |  Unnamed: 2 / 4",
    ]
    assert "UNNAMED" in lines
    assert "    - The short river" in lines
    assert "    + The long river => Silverflow" in lines


def test_section_filter_case_insensitive():
    named, unnamed = ns.parse_naming(SAMPLE)
    lines = ns.render(named, unnamed, section="river")
    assert "Named: 1 / 2  |  Unnamed: 1 / 2" in lines
    assert "    - The wide plain" not in lines
