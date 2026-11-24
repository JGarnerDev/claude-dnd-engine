import importlib
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
pc = importlib.import_module("plant-check")


def problems_in(text: str) -> list[str]:
    markers, problems = pc.scan_plan(text)
    return [p.message for p in problems + pc.check_markers(markers)]


def test_plant_then_payoff_is_clean():
    text = "- **Plant (rope):** new rope on the boards.\n- **Payoff (rope):** the rope goes up.\n"
    assert problems_in(text) == []


def test_plant_kept_for_a_later_session_needs_no_payoff():
    text = "- **Plant (letter, kept for Session 36):** the letter stays folded.\n"
    markers, _ = pc.scan_plan(text)
    assert markers[0].kept_for_session == 36
    assert problems_in(text) == []


def test_unpaid_plant_is_reported():
    [msg] = problems_in("- **Plant (rope):** new rope.\n")
    assert "plant 'rope' has no payoff" in msg


def test_payoff_before_plant_is_reported():
    text = "- **Payoff (rope):** it goes up.\n- **Plant (rope):** new rope.\n"
    assert any("comes before its plant" in m for m in problems_in(text))


def test_mistyped_payoff_key_is_reported():
    text = "- **Plant (rope):** new rope.\n- **Payoff (ropes):** it goes up.\n"
    msgs = problems_in(text)
    assert any("payoff 'ropes' has no plant" in m for m in msgs)
    assert any("plant 'rope' has no payoff" in m for m in msgs)


@pytest.mark.parametrize(
    "line",
    [
        "- **Plant:** no key.",
        "- **Plant (The Rope):** capitals.",
        "- **Payoff (rope, kept for Session 36):** payoffs can't be kept.",
        "- **Plant (rope) :** stray space.",
    ],
)
def test_malformed_markers_are_rejected(line):
    [msg] = problems_in(line + "\n")
    assert msg.startswith("bad marker")


def test_duplicate_plant_is_reported():
    text = "- **Plant (rope):** a.\n- **Plant (rope):** b.\n- **Payoff (rope):** c.\n"
    assert any("planted again" in m for m in problems_in(text))


def test_session_resolves_by_number_or_name(tmp_path):
    (tmp_path / "Session 9 Test").mkdir()
    (tmp_path / "Session 19 Other").mkdir()
    assert pc.resolve_session("9", sessions_dir=tmp_path).name == "Session 9 Test"
    assert pc.resolve_session("Session 19 Other", sessions_dir=tmp_path).name == "Session 19 Other"
    with pytest.raises(SystemExit):
        pc.resolve_session("7", sessions_dir=tmp_path)
