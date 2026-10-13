import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
from lib import stats  # noqa: E402

REPO = Path(__file__).resolve().parents[2]

LEDGER = """DM note: never shown.

## Session 1

### Dip

- killing-blows: 2
- damage-dealt: ~40

### Iggy

- hp-healed: 10

## Session 2

### Dip

- killing-blows: 1

### Iggy

- hp-healed: 12
- bogus-stat: 4

## Session 3

### Dip

- killing-blows: 3
- damage-dealt: 50

### Luci

- killing-blows: 3

### Iggy

- hp-healed: 9
"""


def make_repo(tmp_path, campaigns):
    (tmp_path / "meta").mkdir(parents=True)
    shutil.copy(REPO / "meta" / "stats.md", tmp_path / "meta" / "stats.md")
    sessions = tmp_path / "historian" / "sessions"
    sessions.mkdir(parents=True)
    for n, tag in campaigns.items():
        (sessions / f"Session {n} Test.md").write_text(
            f'---\nname: "Session {n} Test"\ncampaign: {tag}\ntype: session\n'
            f"session_number: {n}\nexists: true\n---\n", encoding="utf-8")
    (sessions / "_stats.md").write_text(LEDGER, encoding="utf-8")
    return tmp_path


def by_id(rows, cid):
    return next(r for r in rows if r["id"] == cid)


def test_catalog_reads_every_line_of_the_meta_block():
    cat = stats.load_catalog(REPO)
    assert len(cat) >= 10
    assert by_id(cat, "hp-healed")["kind"] == "sum"
    assert by_id(cat, "nat-1s")["family"] == "dice"


def test_awards_ties_share_and_personal_bests(tmp_path):
    root = make_repo(tmp_path, {1: "strahd", 2: "strahd", 3: "strahd"})
    s = stats.standings(root, 3)
    kb = by_id(s["awards"], "killing-blows")
    assert kb["pcs"] == ["Dip", "Luci"] and kb["value"] == 3
    # Dip beat 2; Luci has no earlier ledgered session, so no star.
    assert kb["best"] == ["Dip"]
    # A corrected sum wins plain; Iggy's 9 is below 12, no star.
    assert by_id(s["awards"], "damage-dealt")["rough"] is False
    assert by_id(s["awards"], "hp-healed")["best"] == []


def test_season_totals_reset_at_a_swap_and_lifetime_does_not(tmp_path):
    root = make_repo(tmp_path, {1: "strahd", 2: "strahd", 3: "homebrew"})
    s = stats.standings(root, 3)
    assert s["season"] == {"first": 3, "last": 3}
    heal = by_id(s["leaderboards"], "hp-healed")["rows"]
    assert heal == [{"pc": "Iggy", "value": 9, "rough": False}]
    life = by_id(s["lifetime"], "hp-healed")
    assert life["value"] == 31
    # Lifetime damage includes a rough Session 1 value, so the total is rough.
    assert by_id(s["lifetime"], "damage-dealt")["rough"] is True


def test_first_session_of_a_season_carries_the_previous_season(tmp_path):
    root = make_repo(tmp_path, {1: "strahd", 2: "strahd", 3: "homebrew"})
    prev = stats.standings(root, 3)["previousSeason"]
    assert prev["campaign"] == "strahd" and (prev["first"], prev["last"]) == (1, 2)
    assert by_id(prev["leaderboards"], "killing-blows")["rows"][0] == {
        "pc": "Dip", "value": 3, "rough": False}
    # Mid-season sessions do not repeat it.
    root2 = make_repo(tmp_path / "b", {1: "strahd", 2: "strahd", 3: "strahd"})
    assert stats.standings(root2, 3)["previousSeason"] is None


def test_unknown_ids_warn_and_unledgered_sessions_return_none(tmp_path):
    root = make_repo(tmp_path, {1: "strahd", 2: "strahd", 3: "strahd"})
    assert any("bogus-stat" in w for w in stats.standings(root, 3)["warnings"])
    assert stats.standings(root, 9) is None
