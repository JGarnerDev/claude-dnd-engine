import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
from lib import labels  # noqa: E402
lc = importlib.import_module("label-check")

PLAN = """# Session 9

## Combatants

### At a glance

- **The Fork** (Scene 2):
  - **Archer Rider** — Ilsa Thorn (human, Scout), rides for the camp
- **The Camp** (Scene 3):
  - **Drover** — Varrick Tenn (human, Bandit Captain), by the fire
  - **Mastiff 1** and **Mastiff 2** — Brick and Mortar (Mastiffs), chained
  - **Sniper** — [[Nella]], on the ridge
- **Morale:**
  - **The fork:** when Ilsa drops

### Scout — Ilsa Thorn

- **Label (party-facing):** Archer Rider

### Drover — Varrick Tenn

- **Label (party-facing):** Drover

### Mastiff — Brick and Mortar

- **Label (party-facing):** Mastiff 1 (Brick), Mastiff 2 (Mortar)

### Nella

- **Label (party-facing):** Sniper

## NPC Quick-Reference

- **Label (party-facing):** Mara (the party knows her)
"""

LAYOUT = """title: The Camp
== terrain ==
....
== tokens ==
P12  Dv  red     Drover -- Varrick Tenn (Bandit Captain), by the fire
A1   M1  red     Mastiff 1 -- Brick (Mastiff)
B1   X   red     Archer -- Ilsa Thorn (Scout)
== labels ==
C1   to the camp -- not a token
"""


def test_role_of_drops_lookalike_numbers_and_hyphenates():
    assert labels.role_of("Mastiff 2") == "mastiff"
    assert labels.role_of("Half-orc Cask-hand") == "half-orc-cask-hand"
    assert labels.role_of("Hedge Priest") == "hedge-priest"


def test_combatant_labels_stay_inside_combatants():
    assert labels.combatant_labels(PLAN) == ["Archer Rider", "Drover", "Mastiff 1", "Mastiff 2", "Sniper"]


def test_glance_entries_read_name_stat_and_encounter():
    entries = labels.glance_entries(PLAN)
    assert entries[0] == {"labels": ["Archer Rider"], "name": "Ilsa Thorn", "stat": "Scout",
                          "encounter": "The Fork"}
    assert entries[2]["labels"] == ["Mastiff 1", "Mastiff 2"]
    assert entries[3] == {"labels": ["Sniper"], "name": "Nella", "stat": "", "encounter": "The Camp"}
    assert len(entries) == 4  # the Morale bullet has no dash-entry under a label


def test_layout_labels_read_only_the_tokens_section():
    assert labels.layout_labels(LAYOUT) == ["Drover", "Mastiff 1", "Archer"]


def test_manifest_rules_skip_comments():
    text = "# 1 commented 4 x\n1  drover  4  Bandit_Captain  ; note\n2 innkeeper 4 Tiefling\n"
    assert labels.manifest_rules(text) == [(1, "drover"), (2, "innkeeper")]


def test_compare_lists_every_disagreement():
    manifest = "1  drover  4  Bandit_Captain\n1  horses  4  Riding_Horse\n"
    c = lc.compare(PLAN, manifest, {"camp.txt": labels.layout_labels(LAYOUT)})
    assert c["glance_missing"] == [] and c["glance_extra"] == []
    assert c["rule_missing"] == ["archer-rider", "mastiff", "sniper"]
    assert c["rule_extra"] == ["horses"]
    assert c["layout_unknown"] == [("camp.txt", "Archer")]
    assert c["layout_absent"] == ["Archer Rider", "Mastiff 2", "Sniper"]


def test_stub_rule_guesses_regex_from_stat_block_and_names_both_lookalikes():
    glance = labels.glance_entries(PLAN)
    all_labels = labels.combatant_labels(PLAN)
    line = lc.stub_rule("mastiff", all_labels, glance)
    assert line.startswith("1  mastiff")
    assert " Mastiff " in line  # "Mastiffs" singularised for the regex
    assert "Brick and Mortar" in line and "(The Camp)" in line
    sniper = lc.stub_rule("sniper", all_labels, glance)
    assert " sniper " in sniper and "Nella" in sniper
