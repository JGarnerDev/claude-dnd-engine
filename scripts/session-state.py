#!/usr/bin/env python3
# session-state.py -- dump current campaign/act/mission/session state
# consumers: CLAUDE.md, .claude/commands/threads.md -- update these if usage, flags, or output format change.
# Usage: python scripts/session-state.py

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, get_frontmatter


def show_entity(label, fm, path):
    rel = str(Path(path).relative_to(ROOT))
    cwrite(f"\n[{label}]", 'cyan')
    cwrite(f"  Name:  {fm.get('name', '')}", 'white')
    cwrite(f"  State: {fm.get('state', '')} | Exists: {fm.get('exists', '')}", 'white')
    if fm.get('description'):
        cwrite(f"  Desc:  {fm['description']}", 'gray')
    cwrite(f"  File:  {rel}", 'darkgray')


def md_files(rel_dir):
    # PowerShell `Sort-Object Name` is case-insensitive.
    d = ROOT / rel_dir
    return sorted(d.glob('*.md'), key=lambda f: f.name.lower()) if d.exists() else []


def main():
    campaign_files = list((ROOT / 'scheduler' / 'campaign').glob('*.md')) \
        if (ROOT / 'scheduler' / 'campaign').exists() else []

    if campaign_files:
        for f in campaign_files:
            fm = get_frontmatter(f)
            if fm.get('state') == 'active':
                show_entity("CAMPAIGN", fm, f)
    else:
        cwrite("\n[CAMPAIGN] none found", 'darkgray')

    act_files = md_files('scheduler/acts')
    if act_files:
        for f in act_files:
            show_entity("ACT", get_frontmatter(f), f)
    else:
        cwrite("\n[ACT] none in scheduler", 'darkgray')

    mission_files = md_files('scheduler/missions')
    if mission_files:
        for f in mission_files:
            show_entity("MISSION", get_frontmatter(f), f)
    else:
        cwrite("\n[MISSIONS] none in scheduler", 'darkgray')

    session_files = md_files('scheduler/sessions')
    if session_files:
        for f in session_files:
            show_entity("SESSION (planned)", get_frontmatter(f), f)
    else:
        cwrite("\n[SESSIONS] none planned in scheduler", 'darkgray')

    hist_sessions = sorted(
        (ROOT / 'historian' / 'sessions').glob('*.md'),
        key=lambda f: f.name.lower(), reverse=True) \
        if (ROOT / 'historian' / 'sessions').exists() else []
    if hist_sessions:
        last = hist_sessions[0]
        show_entity("LAST PLAYED SESSION", get_frontmatter(last), last)

    campaign_file = campaign_files[0] if campaign_files else None
    if campaign_file:
        content = Path(campaign_file).read_text(encoding='utf-8')
        m = re.search(r'## Party\r?\n([\s\S]+?)(\r?\n##|\Z)', content)
        if m:
            cwrite("\n[PARTY]", 'cyan')
            party_block = m.group(1).strip()
            for line in party_block.split('\n'):
                line = line.rstrip('\r')
                if line.startswith('|') and not line.startswith('|---'):
                    cols = [c.strip() for c in line.split('|') if c != '']
                    if cols and cols[0] != 'Player':
                        cwrite("  {0}: {1} ({2}) - {3}".format(
                            cols[0], cols[1], cols[2], cols[3]), 'white')

    cwrite("")


if __name__ == '__main__':
    main()
