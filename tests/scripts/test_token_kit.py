import importlib
import re
import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
tk = importlib.import_module("token-kit")


def member(path):
    return SimpleNamespace(filename=path)


def rule(role, mx, rx):
    return {"role": role, "max": mx, "rx": re.compile(rx, re.I), "desert": False}


MEMBERS = [member(f"FA_Tokens/Adversaries/Bandits/{n}") for n in (
    "Bandit_Captain_A1_01.png", "Bandit_Captain_A2_01.png", "Bandit_Captain_A3_01.png",
    "Desert_Bandit_Captain_A1_01.png", "Bandit_Thug_A1_01.png",
)]


def test_ledger_round_trip_sorts_and_dedupes(tmp_path):
    led = tmp_path / "tokens-uploaded.txt"
    tk.write_ledger([(30, "drover", "B.png"), (29, "mastiff", "A.png"), (30, "drover", "B.png")], led)
    assert tk.read_ledger(led) == [(29, "mastiff", "A.png"), (30, "drover", "B.png")]
    assert led.read_text(encoding="utf-8").startswith("# Tokens already uploaded")


def test_read_ledger_missing_file_is_empty(tmp_path):
    assert tk.read_ledger(tmp_path / "nope.txt") == []


def test_kit_files_reads_flat_and_per_role_folders(tmp_path):
    (tmp_path / "drover__Bandit_Captain_A1_01.png").write_bytes(b"")
    (tmp_path / "mastiff").mkdir()
    (tmp_path / "mastiff" / "Mastiff_A1_01.png").write_bytes(b"")
    assert tk.kit_files(tmp_path) == [
        ("drover", "Bandit_Captain_A1_01.png"),
        ("mastiff", "Mastiff_A1_01.png"),
    ]


def test_choose_counts_uploaded_tokens_toward_max_and_skips_them():
    rules = [rule("drover", 2, "Bandit_Captain")]
    tk.choose(rules, MEMBERS, {"Bandit_Captain_A1_01.png": 29})
    r = rules[0]
    assert r["resident"] == [("Bandit_Captain_A1_01.png", 29)]
    assert [tk.basename(i) for i in r["picks"]] == ["Bandit_Captain_A2_01.png"]
    assert r["hits"] == 3  # the desert variant is skipped


def test_choose_role_fully_uploaded_picks_nothing_new():
    rules = [rule("drover", 1, "Bandit_Captain")]
    tk.choose(rules, MEMBERS, {"Bandit_Captain_A2_01.png": 30})
    assert rules[0]["picks"] == []
    assert rules[0]["resident"] == [("Bandit_Captain_A2_01.png", 30)]


def test_choose_never_picks_a_file_twice_across_rules():
    rules = [rule("drover", 3, "Bandit_"), rule("thug", 3, "Bandit_")]
    tk.choose(rules, MEMBERS, {})
    first = {i.filename for i in rules[0]["picks"]}
    second = {i.filename for i in rules[1]["picks"]}
    assert not first & second
