#!/usr/bin/env python3
# threads-brief.py -- unresolved-thread signals. Backbone of /threads Phase 2.
# consumers: CLAUDE.md, .claude/commands/threads.md, .claude/commands/session.md -- update these if usage, flags, or output format change.
# Collects: historian entities in unresolved states, hostile characters (recency judged
# by the caller), and pending Seeded: lines from the two meta tracking files.
# Usage: python scripts/threads-brief.py

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, ci_eq, cwrite, get_frontmatter, read_text_no_bom

STATE_RE = re.compile(r'^state:\s*(missing|imprisoned|transformed|unknown|stranded|captured)\s*$', re.M | re.I)
HOSTILE_RE = re.compile(r'^disposition:\s*hostile\s*$', re.M | re.I)
ITEM_RE = re.compile(r'^-\s+\*\*([^*]+)\*\*')
SEED_RE = re.compile(r'^\s*-\s*\*Seeded:\s*(.+?)\*?\s*$')
PAID_OFF_RE = re.compile(r'paid off', re.I)


def campaign_tag(fm: dict) -> str:
    # /session must skip other-season threads unless the DM asks for a crossover;
    # printing the tag saves it opening each file to find out. Untagged = agnostic.
    return f" [campaign: {fm['campaign']}]" if fm.get('campaign') else ''


def main() -> None:
    cwrite("\n========================================", 'darkgray')
    cwrite("  THREADS BRIEF", 'cyan')
    cwrite("========================================", 'darkgray')

    # -- Unresolved states ----------------------------------------------------
    cwrite("\n--- UNRESOLVED STATES (historian) ---", 'darkgray')
    found = False
    for f in sorted((ROOT / 'historian').rglob('*.md'), key=lambda f: str(f).lower()):
        text = read_text_no_bom(f)
        m = STATE_RE.search(text)
        if not m:
            continue
        found = True
        fm = get_frontmatter(f)
        name = fm.get('name') or f.stem
        type_ = f"{fm['type']}/{fm['subtype']}" if fm.get('subtype') else str(fm.get('type') or '')
        cwrite(f"  {name} ({type_}) [{m.group(1)}]{campaign_tag(fm)} - {fm.get('description', '')}", 'white')
    if not found:
        cwrite("  (none)", 'darkgray')

    # -- Hostile characters ---------------------------------------------------
    cwrite("\n--- HOSTILE CHARACTERS ---", 'darkgray')
    chars_dir = ROOT / 'historian' / 'characters'
    found = False
    if chars_dir.exists():
        for f in sorted(chars_dir.rglob('*.md'), key=lambda f: str(f).lower()):
            text = read_text_no_bom(f)
            if not HOSTILE_RE.search(text):
                continue
            fm = get_frontmatter(f)
            if ci_eq(fm.get('state'), 'dead'):
                continue
            found = True
            name = fm.get('name') or f.stem
            cwrite(f"  {name} [state: {fm.get('state', '')}]{campaign_tag(fm)} - {fm.get('description', '')}", 'white')
    if not found:
        cwrite("  (none)", 'darkgray')

    # -- Pending seeds --------------------------------------------------------
    cwrite("\n--- PENDING SEEDS ---", 'darkgray')
    seed_count = 0
    for meta_file in (ROOT / 'meta' / 'literary-devices.md',
                      ROOT / 'meta' / 'campaign-design-preferences.md'):
        if not meta_file.exists():
            continue
        item_name = "?"
        for line in read_text_no_bom(meta_file).split('\n'):
            line = line.rstrip('\r')
            mi = ITEM_RE.match(line)
            if mi:
                item_name = mi.group(1).strip()
                continue
            ms = SEED_RE.match(line)
            if ms and not PAID_OFF_RE.search(line):
                src = meta_file.stem
                cwrite(f"  {item_name} ({src}): {ms.group(1).strip()}", 'yellow')
                seed_count += 1
    if not seed_count:
        cwrite("  (nothing seeded)", 'darkgray')

    cwrite("\n========================================\n", 'darkgray')


if __name__ == '__main__':
    main()
