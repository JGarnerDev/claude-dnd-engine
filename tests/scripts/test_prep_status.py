import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
ps = importlib.import_module("prep-status")

PLAN = """---
name: "Session 9 Test"
note: "`<not a placeholder, frontmatter>`"
---

## Orientation

Clock: `<a day's ride>` from town.

### Scene 1 — The Yard

#### S1_GATE — The gate

The toll is `<a price>`.

```text
`<inside a fence>`
```

- **Label (party-facing):** Drover
- **Label (party-facing):** Mastiff 1 (Brick), Mastiff 2 (Mortar)
- **Label (party-facing):** Cask-hand (Haddo), Half-orc Cask-hand (Brask)
"""


def test_placeholders_skip_frontmatter_and_fences_and_name_their_beat():
    assert ps.placeholders(PLAN) == [
        ("<a day's ride>", ""),
        ("<a price>", "S1_GATE"),
    ]


def test_label_roles_drop_numbers_and_parentheticals():
    assert ps.label_roles(PLAN) == ["drover", "mastiff", "cask-hand", "half-orc-cask-hand"]


def test_manifest_roles_read_rule_lines_only():
    text = "# comment\n1  drover  4  Bandit_Captain  ; note\n\n2 innkeeper 4 Tiefling\n"
    assert ps.manifest_roles(text) == {"drover", "innkeeper"}


def test_flow_markers_read_boxes_and_diamonds():
    text = (
        'S1_GATE["[x] S1_GATE<br/>The gate"]\n'
        'S1_PICK{"[?] S1_PICK<br/>Fight or pay?"}\n'
        'S1_GATE --> S1_PICK\n'
        'S1_PAY["[-] S1_PAY<br/>Pay"]\n'
    )
    assert ps.flow_markers(text) == {"S1_GATE": "x", "S1_PICK": "?", "S1_PAY": "-"}


def test_open_tasks_keep_text_after_a_bold_name():
    text = (
        "- [x] **Done:** skip me\n"
        "- [ ] **Kellan:** confirm Halsby's spend\n"
        "      continuation line is ignored\n"
        "- [ ] plain item\n"
    )
    assert ps.open_tasks(text) == ["Kellan: confirm Halsby's spend", "plain item"]
