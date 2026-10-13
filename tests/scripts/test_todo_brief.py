import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
tb = importlib.import_module("todo-brief")


def _write(root: Path, rel: str, text: str) -> None:
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


def _session(root: Path, n: int, npcs: str) -> None:
    _write(root, f"historian/sessions/Session {n} Test/Session {n} Test.md",
           f'---\nname: "Session {n} Test"\nsession_number: {n}\nkey_npcs:\n{npcs}---\n\nBody.\n')


def _npc(root: Path, name: str, extra: str = "", body: str = "", sub: str = "npcs") -> None:
    _write(root, f"historian/characters/{sub}/{name}.md",
           f'---\nname: "{name}"\ntype: character\n{extra}---\n\n{body}')


def test_stale_when_appearance_lags_stamp(tmp_path):
    _session(tmp_path, 28, '  - "[[Sable Wren]] (the offer)"\n')
    _session(tmp_path, 29, '  - [[Sable Wren]]\n')
    _npc(tmp_path, "Sable Wren", "voice_confirmed: 28\n", "## Voice\n")
    lines = [t for t, _ in tb.voice_flags(tmp_path)]
    assert lines == ["  VOICE STALE: Sable Wren confirmed at session 28, appeared in session 29"
                     " - rebuild their current mood at next /recap"]


def test_current_stamp_is_clean(tmp_path):
    _session(tmp_path, 29, '  - "[[Nella]] (offscreen)"\n')
    _npc(tmp_path, "Nella", "voice_confirmed: 29\n", "## Voice\n", sub="antagonists")
    assert tb.voice_flags(tmp_path) == []


def test_section_without_stamp_is_unstamped(tmp_path):
    _npc(tmp_path, "Strahd", body="## Voice\n\nLow, measured.\n", sub="antagonists")
    lines = [t for t, _ in tb.voice_flags(tmp_path)]
    assert len(lines) == 1 and "VOICE UNSTAMPED: Strahd" in lines[0]


def test_no_voice_no_flag(tmp_path):
    _session(tmp_path, 29, '  - [[Mara Tull]]\n  - "the big one (nameless by design)"\n')
    _npc(tmp_path, "Mara Tull")
    assert tb.voice_flags(tmp_path) == []
