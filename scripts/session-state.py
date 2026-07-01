#!/usr/bin/env python3
# session-state.py -- dump current campaign/act/mission/session state
# consumers: CLAUDE.md, .claude/commands/threads.md -- update these if usage, flags, or output format change.
# Usage: python scripts/session-state.py

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, ci_eq, cwrite, get_frontmatter, parse_party_table


def show_entity(label: str, fm: dict, path) -> None:
    rel = str(Path(path).relative_to(ROOT))
    cwrite(f"\n[{label}]", 'cyan')
    cwrite(f"  Name:  {fm.get('name', '')}", 'white')
    cwrite(f"  State: {fm.get('state', '')} | Exists: {fm.get('exists', '')}", 'white')
    if fm.get('description'):
        cwrite(f"  Desc:  {fm['description']}", 'gray')
    cwrite(f"  File:  {rel}", 'darkgray')


def md_files(rel_dir: str) -> list:
    # PowerShell `Sort-Object Name` is case-insensitive.
    d = ROOT / rel_dir
    return sorted(d.glob('*.md'), key=lambda f: f.name.lower()) if d.exists() else []


def main() -> None:
    campaign_files = list((ROOT / 'scheduler' / 'campaign').glob('*.md')) \
        if (ROOT / 'scheduler' / 'campaign').exists() else []

    if campaign_files:
        for f in campaign_files:
            fm = get_frontmatter(f)
            if ci_eq(fm.get('state'), 'active'):
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
        rows = parse_party_table(campaign_file)
        if rows:
            cwrite("\n[PARTY]", 'cyan')
            for cols in rows:
                if len(cols) >= 4:
                    cwrite("  {0}: {1} ({2}) - {3}".format(
                        cols[0], cols[1], cols[2], cols[3]), 'white')

    cwrite("")


if __name__ == '__main__':
    main()
