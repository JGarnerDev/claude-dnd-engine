#!/usr/bin/env python3
# naming-status.py -- named vs. unnamed entries in questionnaires/world/naming/world-naming.md
# consumers: maps/CLAUDE.md -- update these if usage, flags, or output format change.
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

    path = ROOT / "questionnaires" / "world" / "naming" / "world-naming.md"
    if not path.exists():
        print(f"Not found: {path}", file=sys.stderr)
        sys.exit(1)
    named, unnamed = parse_naming(read_text_no_bom(path))
    for line in render(named, unnamed, args.section):
        print(line)


if __name__ == "__main__":
    main()
