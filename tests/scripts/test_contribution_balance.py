import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
cb = importlib.import_module("contribution-balance")


def _entity(path, contributor=None):
    fm = "---\ntype: npc\n"
    if contributor is not None:
        fm += f"contributed_by: {contributor}\n"
    fm += "---\nbody\n"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(fm, encoding="utf-8")


def test_counts_players_and_none(tmp_path):
    _entity(tmp_path / "a.md", "paul")
    _entity(tmp_path / "b.md", "paul")
    _entity(tmp_path / "sub" / "c.md", "jeff")
    _entity(tmp_path / "d.md")  # no contributor
    counts = cb.count_contributions(tmp_path)
    assert counts["paul"] == 2
    assert counts["jeff"] == 1
    assert counts["ben"] == 0
    assert counts["(none)"] == 1


def test_unknown_contributor_counted(tmp_path):
    _entity(tmp_path / "a.md", "zara")
    _entity(tmp_path / "b.md", "zara")
    counts = cb.count_contributions(tmp_path)
    assert counts["zara"] == 2


def test_render_table_and_next_up(tmp_path):
    pool = {"paul": 3, "ben": 1, "miguel": 0, "jeff": 0, "(none)": 5}
    historian = {"paul": 2, "ben": 0, "miguel": 0, "jeff": 0, "(none)": 8}
    lines = cb.render(pool, historian)
    assert lines[0] == "\n=== Contribution Balance ==="
    header = lines[1]
    assert header.startswith("Player") and "Pool" in header and "% Canon" in header
    # rows sorted by canonized ascending; paul (2 canon) is last player row
    assert any("paul" in ln and "20%" in ln for ln in lines)  # 2/10 = 20.0 -> "20"
    # next-up = fewest canonized among players with pool>0 -> ben
    assert lines[-1].startswith("Next up: ben")
