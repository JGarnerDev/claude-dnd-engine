import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
import importlib
ml = importlib.import_module("monster-lookup")


def _monster(tmp_path, name, ctype, cr, habitats=()):
    hab = "".join(f'  - "[[{h}]]"\n' for h in habitats)
    body = (
        f"﻿---\n"
        f"name: {name}\n"
        f"creature_type: {ctype}\n"
        f'challenge_rating: "{cr}"\n'
        f"habitats:\n{hab}"
        f"---\nbody\n"
    )
    (tmp_path / f"{name}.md").write_text(body, encoding="utf-8")


def test_parse_cr_fraction():
    assert ml.parse_cr("1/4") == 0.25


def test_parse_cr_plain_and_unparseable():
    assert ml.parse_cr("5") == 5.0
    assert ml.parse_cr("") == -1.0


def test_cr_range_filters(tmp_path):
    _monster(tmp_path, "Rat", "beast", "1/8")
    _monster(tmp_path, "Ogre", "giant", "2")
    _monster(tmp_path, "Lich", "undead", "21")
    names = {m["Name"] for m in ml.find_monsters(tmp_path, cr_min=1, cr_max=10)}
    assert names == {"Ogre"}


def test_type_filter_case_insensitive(tmp_path):
    _monster(tmp_path, "Zombie", "Undead", "1/4")
    _monster(tmp_path, "Wolf", "beast", "1/4")
    got = ml.find_monsters(tmp_path, type_filter="undead")
    assert [m["Name"] for m in got] == ["Zombie"]


def test_habitat_substring_case_insensitive_and_bracket_stripped(tmp_path):
    _monster(tmp_path, "Bat", "beast", "0", habitats=["Underdark Caves"])
    got = ml.find_monsters(tmp_path, habitat="cave")
    assert len(got) == 1
    assert got[0]["Habitats"] == "Underdark Caves"


def test_render_groups_sorted_and_footer(tmp_path):
    _monster(tmp_path, "Zombie", "undead", "1/4", habitats=["Crypt"])
    _monster(tmp_path, "Skeleton", "undead", "1/4")
    _monster(tmp_path, "Wolf", "beast", "1/4")
    lines = ml.render(ml.find_monsters(tmp_path))
    assert lines == [
        "\n=== beast (1) ===",
        "  CR 1/4   Wolf",
        "\n=== undead (2) ===",
        "  CR 1/4   Skeleton",
        "  CR 1/4   Zombie  [Crypt]",
        "\nTotal: 3 monsters",
    ]


def test_render_empty_with_filters():
    lines = ml.render([], type_filter="dragon", cr_min=5, cr_max=10)
    assert lines == ["No monsters found matching type=dragon, CR>=5, CR<=10."]


def test_render_empty_no_filters():
    assert ml.render([]) == ["No monsters found."]
