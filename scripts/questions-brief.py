#!/usr/bin/env python3
# questions-brief.py -- open world-design questions in questionnaires/, counted by topic.
# consumers: CLAUDE.md, .claude/commands/todo.md, questionnaires/README.md
#            -- update these if usage, flags, or output format change.
# Reads frontmatter only (status/topic/priority). questionnaires/ is gitignored, so
# ripgrep-based tools cannot see it -- this script walks the tree directly.
# Usage: python scripts/questions-brief.py [--topic <prefix>] [--required] [--list]

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lib.common import ROOT, cwrite, get_frontmatter  # noqa: E402

QDIR = ROOT / "questionnaires"


def collect():
    """Return list of (relpath, status, topic, priority) for every question file."""
    if not QDIR.exists():
        return []
    out = []
    for f in sorted(QDIR.rglob("*.md")):
        if f.name == "README.md":
            continue
        fm = get_frontmatter(f)
        status = str(fm.get("status") or "").strip().lower()
        if not status:
            continue
        out.append((
            f.relative_to(QDIR).as_posix(),
            status,
            str(fm.get("topic") or "").strip(),
            str(fm.get("priority") or "").strip().lower(),
        ))
    return out


def group_key(topic: str, depth: int) -> str:
    parts = [p for p in topic.split("/") if p]
    return "/".join(parts[:depth]) or "(untopiced)"


def main() -> None:
    ap = argparse.ArgumentParser(description="Open world-design questions by topic")
    ap.add_argument("--topic", default="", help="only topics starting with this prefix")
    ap.add_argument("--required", action="store_true", help="required questions only")
    ap.add_argument("--list", action="store_true", help="list every matching file")
    args = ap.parse_args()

    rows = collect()
    if not rows:
        cwrite("No question files found in questionnaires/.", "yellow")
        return

    if args.topic:
        rows = [r for r in rows if r[2].startswith(args.topic)]
    if args.required:
        rows = [r for r in rows if r[3] == "required"]

    questions = [r for r in rows if r[1] in ("open", "answered")]
    refs = [r for r in rows if r[1] == "reference"]
    open_rows = [r for r in questions if r[1] == "open"]
    answered = len(questions) - len(open_rows)
    req_open = [r for r in open_rows if r[3] == "required"]

    cwrite("\n========================================", "darkgray")
    cwrite("  WORLD-DESIGN QUESTIONS", "cyan")
    cwrite("========================================", "darkgray")
    cwrite(f"  {len(open_rows)} open  |  {answered} answered  |  {len(refs)} reference files",
           "white")
    cwrite(f"  {len(req_open)} of the open ones are REQUIRED",
           "yellow" if req_open else "darkgray")

    # -- by area (first topic segment), then by group (first two) ---------------
    areas = {}
    for rel, status, topic, prio in open_rows:
        areas.setdefault(group_key(topic, 1), []).append((rel, topic, prio))

    for area in sorted(areas):
        items = areas[area]
        n_req = sum(1 for _, _, p in items if p == "required")
        cwrite(f"\n--- {area}  ({len(items)} open, {n_req} required) ---", "darkcyan")
        groups = {}
        for rel, topic, prio in items:
            groups.setdefault(group_key(topic, 2), []).append((rel, prio))
        for g in sorted(groups):
            gi = groups[g]
            g_req = sum(1 for _, p in gi if p == "required")
            label = g[len(area) + 1:] if g.startswith(area + "/") else g
            suffix = f", {g_req} required" if g_req else ""
            cwrite(f"  {label or '(top level)'}: {len(gi)} open{suffix}", "white")
            if args.list:
                for rel, prio in sorted(gi):
                    mark = "!" if prio == "required" else " "
                    cwrite(f"    {mark} {rel}", "darkgray")

    if answered:
        cwrite(f"\n--- answered ({answered}) ---", "darkgray")
        for rel, status, topic, prio in sorted(questions):
            if status == "answered":
                cwrite(f"  {rel}", "darkgray")

    cwrite("")


if __name__ == "__main__":
    main()
