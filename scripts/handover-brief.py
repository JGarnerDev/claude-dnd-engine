#!/usr/bin/env python3
# handover-brief.py -- everything a DM rotation's handover page is built from. Backbone of /handover.
# consumers: .claude/commands/handover.md, meta/dm-rotation.md -- update these if usage, flags, or output format change.
# uses: scripts/spotlight-balance.py (render_lines) for the PC ARCS block; scripts/threads-brief.py (run) for open threads.
# Read-only. Gathers, for the active campaign: who the DM is, the party and PCs not active, the
# campaign file's Current State and Rest Clock headings, each scheduler/campaign/_*.md tracker's
# header and sections, the mysteries answer key's questions (marking any held back), the PC arcs,
# the campaign's open threads, and the todo-dashboard items that name the outgoing DM.
# Usage: uv run scripts/handover-brief.py [--from <outgoing DM>]
#   --from : whose dashboard items to list (default: the active campaign's dm:)

import argparse
import importlib
import os
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (ROOT, ci_eq, cwrite, get_active_campaign, get_frontmatter,
                        read_text_no_bom)

spotlight = importlib.import_module('spotlight-balance')

HELD_RE = re.compile(r'\*\*Held back\*\*', re.I)
ITEM_RE = re.compile(r'^- \*\*(\d+)\.\*\*\s*(.*)$')


def section(title: str) -> None:
    cwrite(f"\n--- {title} ---", 'darkgray')


def headings(raw: str, skip=('Engine',)) -> list:
    """The `##`/`###` headings of a file. A `##` named in skip drops with its `###` children."""
    out = []
    skipping = False
    for line in raw.splitlines():
        m = re.match(r'^(#{2,3})\s+(.*)$', line)
        if not m:
            continue
        if m.group(1) == '##':
            skipping = any(m.group(2).startswith(s) for s in skip)
        if not skipping:
            out.append(('  ' if m.group(1) == '###' else '') + m.group(2).strip())
    return out


def tracker_lines(root: Path) -> list:
    """(header, [section headings]) for each scheduler/campaign/_*.md with an (as of:) header."""
    out = []
    for f in sorted((root / 'scheduler' / 'campaign').glob('_*.md')):
        raw = read_text_no_bom(f)
        first = raw.splitlines()[0] if raw else ''
        if '(as of:' not in first:
            continue
        # The answer key's questions get their own section below; list only its header here.
        hs = [] if f.name == '_mysteries.md' else headings(raw)
        out.append((f"{f.name}: {first.lstrip('# ').strip()}", hs))
    return out


def mystery_questions(root: Path) -> list:
    """(question, held_back) for each ### under ## Answers in the answer key."""
    path = root / 'scheduler' / 'campaign' / '_mysteries.md'
    if not path.exists():
        return []
    raw = read_text_no_bom(path)
    body = raw.split('## Answers', 1)[-1].split('\n## Answered', 1)[0]
    out = []
    for block in re.split(r'\n### ', '\n' + body)[1:]:
        q, _, rest = block.partition('\n')
        out.append((q.strip(), bool(HELD_RE.search(rest))))
    return out


def dashboard_items(root: Path, name: str) -> list:
    """(number, first words) of each dashboard item that names the given person."""
    path = root / 'todo-dashboard.md'
    if not path.exists() or not name:
        return []
    out = []
    for line in read_text_no_bom(path).splitlines():
        m = ITEM_RE.match(line)
        if m and re.search(rf'\b{re.escape(name)}\b', m.group(2)):
            text = re.sub(r'\*\*', '', m.group(2))
            out.append((m.group(1), text[:110] + ('...' if len(text) > 110 else '')))
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description='Sources for a DM rotation handover page')
    ap.add_argument('--from', dest='outgoing', help="outgoing DM (default: the active campaign's dm:)")
    args = ap.parse_args()

    camp = get_active_campaign(ROOT)
    cwrite("\n========================================", 'darkgray')
    cwrite("  HANDOVER BRIEF", 'cyan')
    cwrite("========================================", 'darkgray')
    if not camp:
        cwrite("  no active campaign in scheduler/campaign/ - nothing to hand over", 'yellow')
        return
    cfm = get_frontmatter(camp['path'])
    outgoing = args.outgoing or camp['dm']
    tag = cfm.get('campaign') or ''
    cwrite(f"Campaign: {camp['name']} [{tag}]  -  DM: {camp['dm'] or '(no dm: field)'}", 'white')
    if args.outgoing and camp['dm'] and not ci_eq(args.outgoing, camp['dm']):
        cwrite(f"  ! --from {args.outgoing} is not the campaign's dm: ({camp['dm']})", 'yellow')

    section("CAMPAIGN FILE (sections to read)")
    for h in headings(read_text_no_bom(camp['path']), skip=('Setup TODO',)):
        cwrite(f"  {h}", 'white')

    section("PCS NOT ACTIVE")
    pcs_dir = ROOT / 'historian' / 'characters' / 'pcs'
    others = []
    for f in sorted(pcs_dir.glob('*.md')) if pcs_dir.exists() else []:
        fm = get_frontmatter(f)
        if fm.get('state') and not ci_eq(fm.get('state'), 'active'):
            others.append(f"  {fm.get('name')} ({fm.get('player') or '?'}): {fm.get('state')}")
    for line in others or ["  (all PCs active)"]:
        cwrite(line, 'white')

    section("TRACKERS")
    for header, hs in tracker_lines(ROOT):
        cwrite(f"  {header}", 'white')
        for h in hs:
            cwrite(f"    {h}", 'darkgray')

    section("MYSTERY ANSWER KEY")
    qs = mystery_questions(ROOT)
    for i, (q, held) in enumerate(qs, 1):
        cwrite(f"  {i}. {q}" + ("  [held back]" if held else ""), 'white')
    if not qs:
        cwrite("  (no answer key)", 'darkgray')

    in_arcs = False
    for text, clr in spotlight.render_lines(section=True):
        in_arcs = in_arcs or text.strip().startswith('--- PC ARCS')
        if in_arcs and text.strip():
            cwrite(text.rstrip(), clr)

    section(f"OPEN THREADS ({tag or 'all'})")
    res = subprocess.run([sys.executable, str(ROOT / 'scripts' / 'threads-brief.py')],
                         capture_output=True, text=True, encoding='utf-8', cwd=ROOT,
                         env={**os.environ, 'NO_COLOR': '1'})
    kept = [l for l in res.stdout.splitlines()
            if l.startswith('  ') and 'BRIEF' not in l and (not tag or f'[campaign: {tag}]' in l or '[campaign:' not in l)]
    for line in kept or ["  (none)"]:
        cwrite(line[:160] + ('...' if len(line) > 160 else ''), 'white')

    section(f"DASHBOARD ITEMS NAMING {outgoing or '?'}")
    items = dashboard_items(ROOT, outgoing)
    for num, text in items:
        cwrite(f"  {num}. {text}", 'white')
    if not items:
        cwrite("  (none)", 'darkgray')
    cwrite(f"\n{len(items)} dashboard item(s), {len(qs)} mystery answer(s), "
           f"{sum(1 for _, h in qs if h)} held back.", 'darkgray')


if __name__ == '__main__':
    main()
