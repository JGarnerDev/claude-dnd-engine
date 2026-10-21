import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
from lib import achievements  # noqa: E402

LEDGER = """DM note: never shown.

## Session 30

### Iggy

- **Gravity's Favorite**: You landed flat on your back.
- **Encore**: You played the room
  until the room begged.

### Dip

## Session 31

### Iggy

- **Gravity's Favorite II**: Twice now.
- **Fresh One**: Something new.
"""


def make_repo(tmp_path):
    sessions = tmp_path / "historian" / "sessions"
    sessions.mkdir(parents=True)
    (sessions / "_achievements.md").write_text(LEDGER, encoding="utf-8")
    return tmp_path


def test_parses_items_and_continuations(tmp_path):
    out = achievements.achievements(make_repo(tmp_path), 30)
    assert [p["pc"] for p in out] == ["Iggy"]  # a PC with no bullets is dropped
    items = out[0]["items"]
    assert items[0] == {"title": "Gravity's Favorite", "text": "You landed flat on your back.", "times": 1}
    assert items[1]["text"] == "You played the room until the room begged."


def test_repeats_count_across_sessions_ignoring_numerals(tmp_path):
    items = achievements.achievements(make_repo(tmp_path), 31)[0]["items"]
    assert [(i["title"], i["times"]) for i in items] == [("Gravity's Favorite II", 2), ("Fresh One", 1)]


def test_unledgered_session_is_none(tmp_path):
    assert achievements.achievements(make_repo(tmp_path), 29) is None
    assert achievements.achievements(tmp_path / "nowhere", 30) is None
