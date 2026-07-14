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
