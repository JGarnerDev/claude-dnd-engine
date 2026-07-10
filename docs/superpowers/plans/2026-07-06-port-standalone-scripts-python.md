# Port Standalone PowerShell Scripts to Python (issue #13) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `monster-lookup`, `naming-status`, `pitch-brief`, and `contribution-balance` from PowerShell to Python with output-format parity, backed by pytest regression tests that lock each script's contract.

**Architecture:** Each script is refactored into importable **pure functions** (parse/filter/render → return `list[str]`) plus a thin argparse `main()`. Pure functions take a directory/path argument so tests inject `tmp_path` fixtures. Rendering wraps text in `common.color()`, which is a no-op on non-tty / `NO_COLOR`, so tests assert plain text while humans still get color. Reuse `scripts/lib/common.py` helpers (`get_frontmatter`, `ci_eq`, `ci_contains`, `color`, `ROOT`) — never reimplement frontmatter parsing.

**Tech Stack:** Python 3.14, `uv`, pytest (new dev dependency), existing `scripts/lib/common.py`.

## Global Constraints

- Python pinned `==3.14.*`; run everything via `uv run`.
- Flags: PowerShell `-Pascal` → argparse `--lower-dashed`. Preserve PowerShell case-insensitivity through `ci_eq` / `ci_contains` (the parity bug class from PR #10).
- Reuse `scripts/lib/common.py`; do not reimplement frontmatter reads or comparison helpers.
- Each new `.py` mirrors the header style of `scripts/free-entities.py`: shebang, `# <name>.py -- ...`, `# consumers: ...`, `# Usage: uv run scripts/<name>.py ...`, then `sys.path.insert(0, str(Path(__file__).resolve().parent))` and `from lib.common import ...`.
- No markdown tables in generated campaign docs — N/A here (doc edits only touch the exempt scripts table).
- After ports + tests green: delete the 4 `.ps1`, repoint all doc references, confirm no lingering refs.

## File Structure

- Create `scripts/monster-lookup.py`, `scripts/naming-status.py`, `scripts/pitch-brief.py`, `scripts/contribution-balance.py` — one responsibility each; pure functions + `main()`.
- Create `tests/scripts/conftest.py` — autouse fixture forcing `common._USE_COLOR = False` so assertions are plain even under `pytest -s`.
- Create `tests/scripts/test_monster_lookup.py`, `test_naming_status.py`, `test_pitch_brief.py`, `test_contribution_balance.py`.
- Modify `pyproject.toml` — add `[dependency-groups] dev = ["pytest"]`.
- Modify `scripts/lib/common.py` header `consumers:` list — add the 4 new scripts.
- Modify docs: `CLAUDE.md`, `meta/difficulty.md`, `data/CLAUDE.md`, `.claude/commands/event.md`, `.claude/commands/pitch.md`, `.claude/commands/region.md`.
- Delete `scripts/monster-lookup.ps1`, `scripts/naming-status.ps1`, `scripts/pitch-brief.ps1`, `scripts/contribution-balance.ps1`.

### Key parity gotchas (discovered in exploration)

- Monster habitats are stored as **quoted wikilinks**: `- "[[Mountains]]"`. `common.get_frontmatter` routes these through its plain-list branch, so `_list_habitats` yields `['[[Mountains]]', ...]` with brackets intact. The port must strip `[[ ]]` (and any `|alias`) to match the PowerShell display (`Mountains`). A local `_clean_wikilink` helper does this.
- `challenge_rating` is a quoted fraction string like `"1/4"`; `common.get_frontmatter` unwraps the quotes to `1/4`. Parse fractions to floats (`0.25`), plain numbers to floats, unparseable to `-1.0` (excluded).
- `contribution-balance` display rows are only the fixed players + `(none)`. Unknown contributors inflate the totals but get **no row** — replicate faithfully (rows need not sum to TOTAL).
- Monster files carry a UTF-8 BOM; `common.get_frontmatter` already strips it.

---

### Task 0: pytest scaffolding

**Files:**

- Modify: `pyproject.toml`
- Create: `tests/scripts/conftest.py`

**Interfaces:**

- Produces: `uv run pytest` runnable; autouse color-disable fixture for all `tests/scripts/*`.

- [ ] **Step 1: Add pytest dev dependency**

Append to `pyproject.toml` (after the `[tool.uv]` block):

```toml
[dependency-groups]
dev = ["pytest"]
```

- [ ] **Step 2: Sync and verify pytest resolves**

Run: `uv run pytest --version`
Expected: prints a pytest version (uv installs it into the dev group).

- [ ] **Step 3: Create the conftest**

Create `tests/scripts/conftest.py`:

```python
"""Shared fixtures for the scripts test suite.

Forces color off so rendered output is plain text regardless of whether
pytest captures stdout (`-s` makes stdout a tty, which would otherwise emit
ANSI codes via common.color()).
"""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
from lib import common  # noqa: E402


@pytest.fixture(autouse=True)
def _no_color(monkeypatch):
    monkeypatch.setattr(common, "_USE_COLOR", False)
```

- [ ] **Step 4: Confirm empty collection succeeds**

Run: `uv run pytest tests/scripts -q`
Expected: `no tests ran` (exit 5) — scaffolding importable, no errors.

- [ ] **Step 5: Commit**

```bash
git add pyproject.toml tests/scripts/conftest.py
git commit -m "test: add pytest dev dependency and scripts test scaffolding"
```

---

### Task 1: Port `monster-lookup`

**Files:**

- Create: `scripts/monster-lookup.py`
- Test: `tests/scripts/test_monster_lookup.py`

**Interfaces:**

- Produces:
  - `parse_cr(cr_str) -> float`
  - `find_monsters(monsters_dir, type_filter='', cr_min=0.0, cr_max=30.0, habitat='') -> list[dict]` (dict keys: `Name, CR, CRNum, CreatureType, Habitats`)
  - `render(results, type_filter='', cr_min=None, cr_max=None, habitat='') -> list[str]` (`cr_min`/`cr_max` `None` = not shown in empty-result message)

- [ ] **Step 1: Write the failing tests**

Create `tests/scripts/test_monster_lookup.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `uv run pytest tests/scripts/test_monster_lookup.py -q`
Expected: FAIL — `ModuleNotFoundError` / attribute errors (script not created yet).

- [ ] **Step 3: Write the implementation**

Create `scripts/monster-lookup.py`:

```python
#!/usr/bin/env python3
# monster-lookup.py -- filter monsters by CR, creature type, and/or habitat
# consumers: CLAUDE.md, meta/difficulty.md, data/CLAUDE.md -- update these if usage, flags, or output format change.
# Reads frontmatter only. Replaces manual Glob + Read loops over data/monsters/.
# Usage: uv run scripts/monster-lookup.py [--type <aberration|undead|...>] [--cr-min <n>] [--cr-max <n>] [--habitat <cave|forest|...>]

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, ci_contains, ci_eq, color, fmt_num, get_frontmatter


def parse_cr(cr_str):
    """'1/4' -> 0.25; plain number -> float; unparseable -> -1.0 (excluded)."""
    s = str(cr_str or "").strip()
    if "/" in s:
        num, _, den = s.partition("/")
        try:
            return float(num) / float(den)
        except (ValueError, ZeroDivisionError):
            return -1.0
    try:
        return float(s)
    except ValueError:
        return -1.0


def _clean_wikilink(s):
    """'[[Name|alias]]' -> 'Name'; a plain string is returned unchanged."""
    s = str(s).strip()
    if s.startswith("[[") and s.endswith("]]"):
        s = s[2:-2]
    return s.split("|")[0].strip()


def find_monsters(monsters_dir, type_filter="", cr_min=0.0, cr_max=30.0, habitat=""):
    results = []
    for f in sorted(Path(monsters_dir).glob("*.md"), key=lambda p: p.name):
        fm = get_frontmatter(f)
        if not fm:
            continue
        creature_type = fm.get("creature_type", "")
        if type_filter and not ci_eq(creature_type, type_filter):
            continue
        habitats = [_clean_wikilink(h) for h in fm.get("_list_habitats", [])]
        if habitat and not any(ci_contains(h, habitat) for h in habitats):
            continue
        cr_num = parse_cr(fm.get("challenge_rating", ""))
        if cr_num < 0 or cr_num < cr_min or cr_num > cr_max:
            continue
        results.append({
            "Name": fm.get("name", ""),
            "CR": fm.get("challenge_rating", ""),
            "CRNum": cr_num,
            "CreatureType": creature_type,
            "Habitats": ", ".join(habitats),
        })
    return results


def render(results, type_filter="", cr_min=None, cr_max=None, habitat=""):
    if not results:
        filters = []
        if type_filter:
            filters.append(f"type={type_filter}")
        if cr_min is not None:
            filters.append(f"CR>={fmt_num(cr_min)}")
        if cr_max is not None:
            filters.append(f"CR<={fmt_num(cr_max)}")
        if habitat:
            filters.append(f"habitat={habitat}")
        suffix = (" matching " + ", ".join(filters)) if filters else ""
        return [f"No monsters found{suffix}."]

    lines = []
    types = sorted({r["CreatureType"] for r in results}, key=lambda t: str(t).lower())
    for t in types:
        group = [r for r in results if r["CreatureType"] == t]
        lines.append(color(f"\n=== {t} ({len(group)}) ===", "cyan"))
        for m in sorted(group, key=lambda r: (r["CRNum"], str(r["Name"]).lower())):
            hab = f"  [{m['Habitats']}]" if m["Habitats"] else ""
            lines.append(color(f"  CR {str(m['CR']):<4}  {m['Name']}{hab}", "white"))
    lines.append(color(f"\nTotal: {len(results)} monsters", "yellow"))
    return lines


def main():
    parser = argparse.ArgumentParser(description="Filter monsters by CR, creature type, and/or habitat")
    parser.add_argument("--type", default="")
    parser.add_argument("--cr-min", type=float, default=None)
    parser.add_argument("--cr-max", type=float, default=None)
    parser.add_argument("--habitat", default="")
    args = parser.parse_args()

    cr_min = 0.0 if args.cr_min is None else args.cr_min
    cr_max = 30.0 if args.cr_max is None else args.cr_max
    results = find_monsters(ROOT / "data" / "monsters", args.type, cr_min, cr_max, args.habitat)
    for line in render(results, args.type, args.cr_min, args.cr_max, args.habitat):
        print(line)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `uv run pytest tests/scripts/test_monster_lookup.py -q`
Expected: PASS (8 passed).

- [ ] **Step 5: Smoke-check against live data**

Run: `uv run scripts/monster-lookup.py --type undead --cr-min 1 --cr-max 5`
Expected: `=== undead (N) ===` block with `CR` lines, `Total: N monsters` footer. Spot-check one name/CR against its file in `data/monsters/`.

- [ ] **Step 6: Commit**

```bash
git add scripts/monster-lookup.py tests/scripts/test_monster_lookup.py
git commit -m "feat(scripts): port monster-lookup to python with regression tests"
```

---

### Task 2: Port `naming-status`

**Files:**

- Create: `scripts/naming-status.py`
- Test: `tests/scripts/test_naming_status.py`

**Interfaces:**

- Produces:
  - `parse_naming(text) -> tuple[list[dict], list[dict]]` → `(named, unnamed)`; named dicts `{Section, Entry, Name}`, unnamed dicts `{Section, Entry}`
  - `render(named, unnamed, section='') -> list[str]`

- [ ] **Step 1: Write the failing tests**

Create `tests/scripts/test_naming_status.py`:

```python
import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
ns = importlib.import_module("naming-status")

SAMPLE = """# World Naming

## Rivers

### The long river
**Name:** Silverflow

### The short river
**Name:**

## Plains

### The wide plain
**Name:**

## Locked
- Old Capital => **Kingsholt** *(paul)*
"""


def test_parse_named_unnamed_and_locked():
    named, unnamed = ns.parse_naming(SAMPLE)
    assert {(n["Section"], n["Entry"], n["Name"]) for n in named} == {
        ("Rivers", "The long river", "Silverflow"),
        ("Locked", "Old Capital", "Kingsholt"),
    }
    assert {(u["Section"], u["Entry"]) for u in unnamed} == {
        ("Rivers", "The short river"),
        ("Plains", "The wide plain"),
    }


def test_render_counts_and_groups():
    named, unnamed = ns.parse_naming(SAMPLE)
    lines = ns.render(named, unnamed)
    assert lines[:3] == [
        "",
        "World Naming Status",
        "Named: 2 / 4  |  Unnamed: 2 / 4",
    ]
    assert "UNNAMED" in lines
    assert "    - The short river" in lines
    assert "    + The long river => Silverflow" in lines


def test_section_filter_case_insensitive():
    named, unnamed = ns.parse_naming(SAMPLE)
    lines = ns.render(named, unnamed, section="river")
    assert "Named: 1 / 2  |  Unnamed: 1 / 2" in lines
    assert "    - The wide plain" not in lines
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `uv run pytest tests/scripts/test_naming_status.py -q`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `scripts/naming-status.py`:

```python
#!/usr/bin/env python3
# naming-status.py -- named vs. unnamed entries in questionnaires/world-naming.md
# consumers: CLAUDE.md -- update these if usage, flags, or output format change.
# Usage: uv run scripts/naming-status.py [--section <name>]

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, ci_contains, color, read_text_no_bom

_SECTION_RE = re.compile(r"^## (.+)")
_ENTRY_RE = re.compile(r"^### (.+)")
_NAME_EMPTY_RE = re.compile(r"^\*\*Name:\*\*\s*$")
_NAME_RE = re.compile(r"^\*\*Name:\*\*\s+(.+)$")
_LOCKED_RE = re.compile(r"^- (.+?) => \*\*(.+?)\*\*")


def parse_naming(text):
    section = ""
    entry = ""
    named, unnamed = [], []
    for line in text.split("\n"):
        line = line.rstrip("\r")
        m = _SECTION_RE.match(line)
        if m:
            section = m.group(1).strip()
            continue
        m = _ENTRY_RE.match(line)
        if m:
            entry = m.group(1).strip()
            continue
        if _NAME_EMPTY_RE.match(line):
            unnamed.append({"Section": section, "Entry": entry})
            continue
        m = _NAME_RE.match(line)
        if m:
            named.append({"Section": section, "Entry": entry, "Name": m.group(1).strip()})
            continue
        m = _LOCKED_RE.match(line)
        if m:
            named.append({"Section": section, "Entry": m.group(1).strip(), "Name": m.group(2).strip()})
    return named, unnamed


def _group_by_section(rows):
    groups = {}
    for r in rows:
        groups.setdefault(r["Section"], []).append(r)
    return groups


def render(named, unnamed, section=""):
    if section:
        named = [n for n in named if ci_contains(n["Section"], section)]
        unnamed = [u for u in unnamed if ci_contains(u["Section"], section)]
    total = len(named) + len(unnamed)
    lines = [
        "",
        color("World Naming Status", "cyan"),
        f"Named: {len(named)} / {total}  |  Unnamed: {len(unnamed)} / {total}",
        "",
    ]
    if unnamed:
        lines.append(color("UNNAMED", "yellow"))
        for sec, rows in _group_by_section(unnamed).items():
            lines.append(f"  [{sec}]")
            lines.extend(f"    - {r['Entry']}" for r in rows)
        lines.append("")
    if named:
        lines.append(color("NAMED", "green"))
        for sec, rows in _group_by_section(named).items():
            lines.append(f"  [{sec}]")
            lines.extend(f"    + {r['Entry']} => {r['Name']}" for r in rows)
        lines.append("")
    return lines


def main():
    parser = argparse.ArgumentParser(description="Named vs. unnamed world-naming entries")
    parser.add_argument("--section", default="")
    args = parser.parse_args()

    path = ROOT / "questionnaires" / "world-naming.md"
    if not path.exists():
        print(f"Not found: {path}", file=sys.stderr)
        sys.exit(1)
    named, unnamed = parse_naming(read_text_no_bom(path))
    for line in render(named, unnamed, args.section):
        print(line)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `uv run pytest tests/scripts/test_naming_status.py -q`
Expected: PASS (3 passed).

- [ ] **Step 5: Smoke-check the missing-file path**

Run: `uv run scripts/naming-status.py; echo "exit=$?"`
Expected: `Not found: .../questionnaires/world-naming.md` on stderr and `exit=1` (no questionnaire exists yet — matches the PowerShell `Write-Error` + `exit 1`).

- [ ] **Step 6: Commit**

```bash
git add scripts/naming-status.py tests/scripts/test_naming_status.py
git commit -m "feat(scripts): port naming-status to python with regression tests"
```

---

### Task 3: Port `pitch-brief`

**Files:**

- Create: `scripts/pitch-brief.py`
- Test: `tests/scripts/test_pitch_brief.py`

**Interfaces:**

- Produces:
  - `worldbuilding_lines(wb_path) -> list[str]` (tone + themes, or `(worldbuilding.md not found)`)
  - `history_lines(hist_path, type_filter='') -> list[str]`
  - `render(wb_path, hist_path, type_filter='') -> list[str]`

- [ ] **Step 1: Write the failing tests**

Create `tests/scripts/test_pitch_brief.py`:

```python
import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
pb = importlib.import_module("pitch-brief")

WB = """---
x: y
---

## Tone

Dark and political.

## Core Themes

- Intrigue
- Scarcity

## Setting Pillars
"""

HIST = """# Pitch history

- npc: A brooding smuggler
- location: A drowned temple
- npc: A retired assassin
"""


def test_worldbuilding_tone_and_themes(tmp_path):
    p = tmp_path / "worldbuilding.md"
    p.write_text(WB, encoding="utf-8")
    lines = pb.worldbuilding_lines(p)
    assert lines == ["\nTone: Dark and political.", "Themes: Intrigue | Scarcity"]


def test_worldbuilding_missing(tmp_path):
    assert pb.worldbuilding_lines(tmp_path / "nope.md") == ["\n(worldbuilding.md not found)"]


def test_history_all(tmp_path):
    p = tmp_path / "hist.md"
    p.write_text(HIST, encoding="utf-8")
    lines = pb.history_lines(p)
    assert lines[0] == "\nPitch history (all):"
    assert "  - npc: A brooding smuggler" in lines


def test_history_typed(tmp_path):
    p = tmp_path / "hist.md"
    p.write_text(HIST, encoding="utf-8")
    lines = pb.history_lines(p, type_filter="npc")
    assert lines[0] == "\nnpc history (2 entries - avoid all):"
    assert "  A brooding smuggler" in lines
    assert "  A retired assassin" in lines


def test_history_typed_none(tmp_path):
    p = tmp_path / "hist.md"
    p.write_text(HIST, encoding="utf-8")
    assert pb.history_lines(p, type_filter="deity") == ["\ndeity history: none"]


def test_history_missing_file(tmp_path):
    assert pb.history_lines(tmp_path / "nope.md") == ["\nPitch history: none"]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `uv run pytest tests/scripts/test_pitch_brief.py -q`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `scripts/pitch-brief.py`:

```python
#!/usr/bin/env python3
# pitch-brief.py -- pre-pitch context summary (tone, themes, pitch history)
# consumers: CLAUDE.md, .claude/commands/event.md, .claude/commands/pitch.md -- update these if usage, flags, or output format change.
# Replaces manual reads of meta/worldbuilding.md and pitch-log/pitch-history.md.
# Usage: uv run scripts/pitch-brief.py [--type <type>]

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, color, read_text_no_bom

_TONE_RE = re.compile(r"## Tone\r?\n\r?\n(.+?)\r?\n\r?\n##", re.DOTALL)
_THEMES_RE = re.compile(r"## Core Themes\r?\n\r?\n((?:- [^\r\n]+\r?\n?)+)")


def worldbuilding_lines(wb_path):
    wb_path = Path(wb_path)
    if not wb_path.exists():
        return ["\n(worldbuilding.md not found)"]
    content = read_text_no_bom(wb_path)
    lines = []
    m = _TONE_RE.search(content)
    if m:
        lines.append(f"\nTone: {m.group(1).strip()}")
    m = _THEMES_RE.search(content)
    if m:
        themes = [ln[2:] for ln in m.group(1).split("\n") if ln.startswith("- ")]
        lines.append(f"Themes: {' | '.join(themes)}")
    return lines


def history_lines(hist_path, type_filter=""):
    hist_path = Path(hist_path)
    if not hist_path.exists():
        return ["\nPitch history: none"]
    bullets = [ln.rstrip("\r") for ln in read_text_no_bom(hist_path).split("\n")
               if ln.startswith("- ")]
    if type_filter:
        prefix = f"- {type_filter}:"
        matched = [b for b in bullets if b.startswith(prefix)]
        if not matched:
            return [f"\n{type_filter} history: none"]
        out = [f"\n{type_filter} history ({len(matched)} entries - avoid all):"]
        out.extend(f"  {b[len(prefix):].strip()}" for b in matched)
        return out
    out = ["\nPitch history (all):"]
    out.extend(f"  {b}" for b in bullets)
    return out


def render(wb_path, hist_path, type_filter=""):
    header = f"PITCH BRIEF -- {type_filter}" if type_filter else "PITCH BRIEF"
    lines = [color(header, "cyan")]
    lines.extend(worldbuilding_lines(wb_path))
    lines.extend(history_lines(hist_path, type_filter))
    lines.append("")
    return lines


def main():
    parser = argparse.ArgumentParser(description="Pre-pitch context summary")
    parser.add_argument("--type", default="")
    args = parser.parse_args()
    lines = render(ROOT / "meta" / "worldbuilding.md",
                   ROOT / "pitch-log" / "pitch-history.md", args.type)
    for line in lines:
        print(line)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `uv run pytest tests/scripts/test_pitch_brief.py -q`
Expected: PASS (6 passed).

- [ ] **Step 5: Smoke-check against live data**

Run: `uv run scripts/pitch-brief.py` and `uv run scripts/pitch-brief.py --type npc`
Expected: `PITCH BRIEF` header, `Tone:` + `Themes:` from `meta/worldbuilding.md`, and `Pitch history: none` (no `pitch-log/` exists yet).

- [ ] **Step 6: Commit**

```bash
git add scripts/pitch-brief.py tests/scripts/test_pitch_brief.py
git commit -m "feat(scripts): port pitch-brief to python with regression tests"
```

---

### Task 4: Port `contribution-balance`

**Files:**

- Create: `scripts/contribution-balance.py`
- Test: `tests/scripts/test_contribution_balance.py`

**Interfaces:**

- Produces:
  - `PLAYERS = ["paul", "ben", "miguel", "jeff"]`
  - `count_contributions(folder) -> dict[str, int]` (players + `(none)` preseeded to 0; unknown contributors added)
  - `render(pool, historian) -> list[str]`

- [ ] **Step 1: Write the failing tests**

Create `tests/scripts/test_contribution_balance.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `uv run pytest tests/scripts/test_contribution_balance.py -q`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `scripts/contribution-balance.py`:

```python
#!/usr/bin/env python3
# contribution-balance.py -- contributed_by counts per player across ./data and ./historian
# consumers: CLAUDE.md, .claude/commands/region.md, data/CLAUDE.md -- update these if usage, flags, or output format change.
# Usage: uv run scripts/contribution-balance.py

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, color, fmt_num, get_frontmatter

PLAYERS = ["paul", "ben", "miguel", "jeff"]


def count_contributions(folder):
    counts = {p: 0 for p in PLAYERS}
    counts["(none)"] = 0
    folder = Path(folder)
    if not folder.exists():
        return counts
    for f in folder.rglob("*.md"):
        fm = get_frontmatter(f)
        raw = fm.get("contributed_by")
        contributor = str(raw).split()[0].strip('"') if raw else None
        if contributor:
            counts[contributor] = counts.get(contributor, 0) + 1
        else:
            counts["(none)"] += 1
    return counts


def render(pool, historian):
    total_pool = sum(pool.values())
    total_hist = sum(historian.values())

    lines = [
        color("\n=== Contribution Balance ===", "cyan"),
        color(f"{'Player':<12} {'Pool':>8} {'Canonized':>12} {'% Canon':>10}", "yellow"),
        color(f"{'------':<12} {'----':>8} {'---------':>12} {'-------':>10}", "darkgray"),
    ]

    rows = []
    for idx, p in enumerate(PLAYERS + ["(none)"]):
        pool_c = pool.get(p, 0)
        hist_c = historian.get(p, 0)
        pct = round((hist_c / total_hist) * 100, 1) if total_hist > 0 else 0
        rows.append({"Player": p, "Pool": pool_c, "Canon": hist_c, "Pct": pct, "Idx": idx})

    for row in sorted(rows, key=lambda r: (r["Canon"], r["Idx"])):
        clr = "darkgray" if row["Player"] == "(none)" else "white"
        lines.append(color(
            f"{row['Player']:<12} {row['Pool']:>8} {row['Canon']:>12} {fmt_num(row['Pct']):>9}%",
            clr))

    lines.append(color(f"{'TOTAL':<12} {total_pool:>8} {total_hist:>12}", "yellow"))

    candidates = [r for r in rows if r["Player"] != "(none)" and r["Pool"] > 0]
    if candidates:
        nxt = sorted(candidates, key=lambda r: (r["Canon"], r["Player"]))[0]
        lines.append(color(
            f"\nNext up: {nxt['Player']} ({nxt['Canon']} canonized, {nxt['Pool']} in pool)",
            "green"))
    return lines


def main():
    pool = count_contributions(ROOT / "data")
    historian = count_contributions(ROOT / "historian")
    for line in render(pool, historian):
        print(line)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `uv run pytest tests/scripts/test_contribution_balance.py -q`
Expected: PASS (3 passed).

- [ ] **Step 5: Smoke-check against live data**

Run: `uv run scripts/contribution-balance.py`
Expected: `=== Contribution Balance ===`, aligned table, TOTAL row, `Next up:` line. (Note: `historian/` currently has no `contributed_by`, so canonized counts are 0 and `(none)` is large — this matches the PowerShell behavior.)

- [ ] **Step 6: Commit**

```bash
git add scripts/contribution-balance.py tests/scripts/test_contribution_balance.py
git commit -m "feat(scripts): port contribution-balance to python with regression tests"
```

---

### Task 5: Update references, common.py header, and delete `.ps1`

**Files:**

- Modify: `scripts/lib/common.py` (header `consumers:` list)
- Modify: `CLAUDE.md`, `meta/difficulty.md`, `data/CLAUDE.md`, `.claude/commands/event.md`, `.claude/commands/pitch.md`, `.claude/commands/region.md`
- Delete: `scripts/monster-lookup.ps1`, `scripts/naming-status.ps1`, `scripts/pitch-brief.ps1`, `scripts/contribution-balance.ps1`

**Interfaces:**

- Consumes: the four new `.py` scripts and their new flag names from Tasks 1-4.

- [ ] **Step 1: Update the `CLAUDE.md` scripts table rows**

Replace the four rows (currently referencing `.ps1`) with `uv run` + dashed flags:

```markdown
| `contribution-balance.py` | Player contribution counts (pool vs. canonized) | `uv run scripts/contribution-balance.py` |
| `pitch-brief.py` | Start of every `/pitch` | `uv run scripts/pitch-brief.py [--type <type>]` |
| `monster-lookup.py` | Find monsters by CR, creature type, or habitat | `uv run scripts/monster-lookup.py [--type <type>] [--cr-min <n>] [--cr-max <n>] [--habitat <name>]` |
| `naming-status.py` | Show named vs. unnamed entries in world-naming questionnaire | `uv run scripts/naming-status.py [--section <name>]` |
```

- [ ] **Step 2: Update prose doc references**

Repoint each remaining reference (drop the leading `.\`, switch to `uv run scripts/<name>.py`):

- `meta/difficulty.md:62` — `monster-lookup.ps1` → `monster-lookup.py`.
- `data/CLAUDE.md:7` — `monster-lookup.ps1` → `monster-lookup.py`.
- `data/CLAUDE.md:84` — `.\scripts\contribution-balance.ps1` → `uv run scripts/contribution-balance.py`.
- `.claude/commands/event.md:34` — `.\scripts\pitch-brief.ps1` → `uv run scripts/pitch-brief.py`.
- `.claude/commands/pitch.md:36` — `.\scripts\pitch-brief.ps1 -Type <type>` → `uv run scripts/pitch-brief.py --type <type>`.
- `.claude/commands/region.md:176` — `.\scripts\contribution-balance.ps1` → `uv run scripts/contribution-balance.py`.

- [ ] **Step 3: Add the new scripts to `common.py`'s consumers header**

In `scripts/lib/common.py`, extend the `consumers:` list at the top of the module docstring to include `scripts/monster-lookup.py, scripts/naming-status.py, scripts/pitch-brief.py, scripts/contribution-balance.py`.

- [ ] **Step 4: Delete the PowerShell originals**

```bash
git rm scripts/monster-lookup.ps1 scripts/naming-status.ps1 scripts/pitch-brief.ps1 scripts/contribution-balance.ps1
```

- [ ] **Step 5: Verify no lingering references**

Run: `grep -rIn 'monster-lookup\.ps1\|naming-status\.ps1\|pitch-brief\.ps1\|contribution-balance\.ps1' . --include='*.md' --include='*.py' --include='*.ps1' --include='*.ts' --include='*.json' | grep -v node_modules | grep -v '\.venv/'`
Expected: no output (all references repointed).

- [ ] **Step 6: Run the full suite and commit**

Run: `uv run pytest tests/scripts -q`
Expected: PASS (all tests across the four scripts).

```bash
git add CLAUDE.md meta/difficulty.md data/CLAUDE.md .claude/commands/event.md .claude/commands/pitch.md .claude/commands/region.md scripts/lib/common.py
git commit -m "docs+chore: repoint refs to ported python scripts and remove ps1 originals"
```

---

## Verification (end-to-end)

1. `uv run pytest tests/scripts -q` — all tests green.
2. `uv run scripts/monster-lookup.py --type undead --cr-min 1 --cr-max 5` — grouped output; spot-check a name/CR against `data/monsters/`.
3. `uv run scripts/contribution-balance.py` — aligned table, TOTAL, Next up.
4. `uv run scripts/pitch-brief.py --type npc` — tone/themes + `Pitch history: none`.
5. `uv run scripts/naming-status.py; echo $?` — `Not found:` on stderr, exit 1 (no questionnaire yet).
6. `grep` from Task 5 Step 5 — no lingering `.ps1` references.

```
