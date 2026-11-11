import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
sb = importlib.import_module("spotlight-balance")

HOOKS = (
    'spotlight_hooks:\n'
    '  - hook: "find the twin sister"\n'
    '    status: open\n'
    '  - hook: "confront the raiders"\n'
    '    status: paid\n'
)


def _arc(root: Path, pc: str, stamp: str, steps: list, state: str = "active") -> None:
    p = root / "scheduler" / "arcs" / f"{pc} PC Arc.md"
    p.parent.mkdir(parents=True, exist_ok=True)
    step_lines = "".join(f'  - "{s}"\n' for s in steps)
    p.write_text(
        f'---\nname: "{pc} PC Arc"\ntype: pc-arc\nexists: false\nstate: {state}\n'
        f'pc: "[[{pc}]]"\narc_checked: {stamp}\nnext_step:\n{step_lines}---\n\n## Logline\n',
        encoding="utf-8")


def _pc(name: str) -> dict:
    return {"Name": name, "HookStatus": sb._hook_statuses(HOOKS)}


def _lines(root, monkeypatch, pcs, latest):
    monkeypatch.setattr(sb, "ROOT", root)
    return [t.strip() for t, _ in sb._arc_lines(pcs, latest)]


def test_hook_statuses_parse():
    assert sb._hook_statuses(HOOKS) == {"find the twin sister": "open", "confront the raiders": "paid"}


def test_current_arc_is_clean(tmp_path, monkeypatch):
    _arc(tmp_path, "Dip", "34", ["find the twin sister"])
    lines = _lines(tmp_path, monkeypatch, [_pc("Dip")], 34)
    assert lines[1:] == ["Dip        (checked S34)", 'next: "find the twin sister" [open]']


def test_stale_paid_and_missing_flags(tmp_path, monkeypatch):
    _arc(tmp_path, "Dip", "31", ["confront the raiders", "no such hook"])
    lines = _lines(tmp_path, monkeypatch, [_pc("Dip"), _pc("Luci")], 34)
    text = "\n".join(lines)
    assert "! stale - checked S31, latest played S34" in text
    assert '! next-step hook already paid - pick a new next step: "confront the raiders"' in text
    assert '! next-step hook not found on PC file: "no such hook"' in text
    assert "! Luci has no PC arc - draft one with the DM." in text


def test_retired_arc_is_ignored(tmp_path, monkeypatch):
    _arc(tmp_path, "Dip", "34", ["find the twin sister"], state="retired")
    lines = _lines(tmp_path, monkeypatch, [_pc("Dip")], 34)
    assert "! Dip has no PC arc - draft one with the DM." in lines
