import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
hb = importlib.import_module("handover-brief")
from lib.common import get_active_campaign  # noqa: E402


def _write(root: Path, rel: str, text: str) -> None:
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


def test_active_campaign_and_dm(tmp_path):
    _write(tmp_path, "scheduler/campaign/Old.md", '---\nname: "Old"\nstate: on-hiatus\ndm: "Kellan"\n---\n')
    _write(tmp_path, "scheduler/campaign/Redwater.md", '---\nname: "Redwater"\nstate: active\ndm: "Jeff"\n---\n')
    _write(tmp_path, "scheduler/campaign/_citadel-clock.md", '# The Citadel Clock (as of: Session 33)\n')
    camp = get_active_campaign(tmp_path)
    assert camp["name"] == "Redwater" and camp["dm"] == "Jeff"


def test_no_active_campaign(tmp_path):
    _write(tmp_path, "scheduler/campaign/Old.md", '---\nname: "Old"\nstate: completed\n---\n')
    assert get_active_campaign(tmp_path) is None


def test_trackers_skip_non_trackers(tmp_path):
    _write(tmp_path, "scheduler/campaign/_sky-clock.md", "# The Sky Clock (as of: Session 33)\n\n## Engine\n\n## Now\n")
    _write(tmp_path, "scheduler/campaign/_handover.md", "# Handover: Jeff to Ben\n\n## Where the story stands\n")
    out = hb.tracker_lines(tmp_path)
    assert out == [("_sky-clock.md: The Sky Clock (as of: Session 33)", ["Now"])]


def test_mystery_questions_mark_held_back(tmp_path):
    _write(tmp_path, "scheduler/campaign/_mysteries.md",
           "# Mystery Answers (as of: Session 33)\n\n## Answers\n\n### Who is Harrow Bane?\n\n**Canon.** A bandit.\n\n"
           "### Whose griffon is that?\n\n**Held back** (Jeff, 2026-11-24): ask before using.\n\n## Answered\n\n### Old one?\n")
    assert hb.mystery_questions(tmp_path) == [("Who is Harrow Bane?", False), ("Whose griffon is that?", True)]


def test_dashboard_items_name_the_person(tmp_path):
    _write(tmp_path, "todo-dashboard.md",
           "- **71.** 🤝 **Jeff + Ben** — Tyler bridges.\n- **72.** 🙋 **Paul** — something.\n- **73.** 🙋 **Jeffrey** — not him.\n")
    assert [n for n, _ in hb.dashboard_items(tmp_path, "Jeff")] == ["71"]
