import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "scripts"))
from lib import reputation  # noqa: E402

LEDGER = """DM note: never shown.

## Session 29

### Dip

- fame · Ashford · notable × named-foe × witnesses · lvl 4 = 5,424: Felled the raider
  captain in the square.

## Session 30

### Dip

- fame · Ashford · minor · lvl 4 = 272: Bought a round.
- infamy · Nowhere Inn · minor · lvl 4 = 999: Burned the inn. Wrong points on purpose.

### Iggy

- fame · The Golden Lioness · major × style · lvl 4 = 9,506: Played the Lioness until dawn.

## Session 31

### Luci

- fame · Barovia · minor · lvl 4 = 272: Strahd-side deed.
"""


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def session(n: int, campaign: str) -> str:
    return f'---\nname: "Session {n}"\ntype: session\nexists: true\nsession_number: {n}\ncampaign: {campaign}\n---\n'


def location(name: str, parent: str = "") -> str:
    gl = f"global_location: [[{parent}]]\n" if parent else ""
    return f'---\nname: "{name}"\ntype: location\nexists: true\n{gl}---\n'


def make_repo(tmp_path: Path) -> Path:
    (tmp_path / "meta").mkdir()
    shutil.copy(REPO / "meta" / "reputation.md", tmp_path / "meta" / "reputation.md")
    s = tmp_path / "historian" / "sessions"
    write(s / "_reputation.md", LEDGER)
    write(s / "Session 29.md", session(29, "homebrew"))
    write(s / "Session 30.md", session(30, "homebrew"))
    write(s / "Session 31.md", session(31, "strahd"))
    loc = tmp_path / "historian" / "locations"
    write(loc / "regions" / "Stonemarch.md", location("Stonemarch", "Calenmere Basin"))
    write(loc / "regions" / "Calenmere Basin.md", location("Calenmere Basin"))
    write(loc / "cities" / "Ashford.md", location("Ashford", "Stonemarch"))
    write(loc / "shops" / "The Golden Lioness.md", location("The Golden Lioness"))
    pcs = tmp_path / "historian" / "characters" / "pcs"
    for name in ("Dip", "Iggy", "Luci"):
        write(pcs / f"{name}.md", f'---\nname: "{name}"\ntype: character\nsubtype: pc\nexists: true\n---\n')
    write(pcs / "Elsewhere.md", '---\nname: "Elsewhere"\ncampaign: strahd\n---\n')
    return tmp_path


def by_pc(data: dict) -> dict:
    return {p["pc"]: p for p in data["pcs"]}


def test_formula_stacks_multipliers_and_rounds_half_up():
    cat = reputation.load_catalog(REPO)
    assert reputation.points(cat, "notable", ["named-foe", "witnesses"], 4) == 5424
    assert reputation.points(cat, "minor", ["style"], 1) == 22  # 22.1
    assert reputation.points(cat, "legendary", ["named-foe", "witnesses", "style", "underdog"], 20) == 5457270
    assert reputation.points(cat, "huge", [], 4) is None


def test_catalog_has_ten_tiers():
    tiers = reputation.load_catalog(REPO)["tiers"]
    assert len(tiers) == 10
    assert (tiers[0]["fame"], tiers[-1]["infamy"]) == ("Unknown", "Infamous")


def test_world_scores_gains_and_top_deeds(tmp_path):
    data = reputation.reputation(make_repo(tmp_path), 30)
    dip = by_pc(data)["Dip"]
    assert dip["fame"]["score"] == 5424 + 272
    assert dip["fame"]["gain"] == 272
    assert dip["infamy"]["score"] == 999
    assert [d["points"] for d in dip["deeds"]] == [999, 272]
    assert by_pc(data)["Iggy"]["fame"]["score"] == 9506


def test_tier_crossings_world_and_local(tmp_path):
    data = reputation.reputation(make_repo(tmp_path), 29)
    dip = by_pc(data)["Dip"]
    assert (dip["fame"]["tier"], dip["fame"]["up"]) == ("Noticed", True)
    assert {"pc": "Dip", "track": "fame", "scope": "Ashford", "tier": "Noticed", "rank": 2} in data["crossings"]
    later = reputation.reputation(tmp_path, 30)
    assert by_pc(later)["Dip"]["fame"]["up"] is False


def test_local_rollup_halves_and_stops_at_missing_link(tmp_path):
    data = reputation.reputation(make_repo(tmp_path), 29)
    local = {loc["place"]: loc["fame"]["score"] for loc in by_pc(data)["Dip"]["local"]}
    assert local == {"Ashford": 5424, "Stonemarch": 2712, "Calenmere Basin": 1356}
    iggy = reputation.reputation(tmp_path, 30)
    assert [loc["place"] for loc in by_pc(iggy)["Iggy"]["local"]] == ["The Golden Lioness"]


def test_party_fame_averages_the_whole_roster(tmp_path):
    data = reputation.reputation(make_repo(tmp_path), 30)
    assert [p["pc"] for p in data["pcs"]] == ["Iggy", "Dip", "Luci"]  # Strahd-only PC left out
    assert data["partyFame"] == round((5696 + 9506 + 0) / 3)


def test_warnings_for_bad_points_unknown_scope_and_strahd(tmp_path):
    w = "\n".join(reputation.reputation(make_repo(tmp_path), 30)["warnings"])
    assert "stored 999, formula gives 272" in w
    assert 'scope "Nowhere Inn"' in w
    assert "Session 31 is strahd" in w


def test_strahd_and_empty_sessions_are_none(tmp_path):
    make_repo(tmp_path)
    assert reputation.reputation(tmp_path, 31) is None
    assert reputation.reputation(tmp_path, 28) is None
    assert reputation.reputation(tmp_path / "nowhere", 30) is None
