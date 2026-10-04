#!/usr/bin/env python3
# party-status.py -- show all PCs from historian + afflictions from campaign file
# consumers: CLAUDE.md, .claude/commands/session.md, meta/difficulty.md, tests/commands/session/spec.md -- update these if usage, flags, or output format change.
# Usage: python scripts/party-status.py

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (
    ROOT, ci_eq, cwrite, entity_md_files, fmt_num, get_frontmatter,
    get_played_spotlight_sessions, get_spotlight_rotation, parse_party_table, try_int,
)


def main() -> None:
    # Load afflictions from campaign party table
    afflictions = {}
    campaign_dir = ROOT / 'scheduler' / 'campaign'
    # The ACTIVE campaign, not the first filename alphabetically -- 'Curse of Strahd.md'
    # sorts ahead of 'Homebrew Campaign.md', so the old pick read the paused season's
    # party table. Same selection session-brief.py uses.
    campaign_files = sorted(campaign_dir.glob('*.md'), key=lambda f: f.name.lower()) if campaign_dir.exists() else []
    campaign_file = next(
        (f for f in campaign_files if ci_eq(get_frontmatter(f).get('state'), 'active')),
        next(iter(campaign_files), None),
    )
    if campaign_file:
        for cols in parse_party_table(campaign_file):
            if len(cols) >= 4:
                char_name = re.sub(r'\[\[|\]\]', '', cols[1]).replace('"', '')
                afflictions[char_name] = cols[3]

    # Latest played session number -- staleness baseline for level_confirmed
    latest_session = 0
    sessions_dir = ROOT / 'historian' / 'sessions'
    if sessions_dir.exists():
        for sf in entity_md_files(sessions_dir):
            n = try_int(get_frontmatter(sf).get('session_number'))
            if n is not None and n > latest_session:
                latest_session = n

    pcs_dir = ROOT / 'historian' / 'characters' / 'pcs'
    pc_files = sorted(pcs_dir.glob('*.md'), key=lambda f: f.name.lower()) if pcs_dir.exists() else []
    if not pc_files:
        cwrite("No PCs found in historian/characters/pcs", 'red')
        sys.exit(1)

    # Spotlight rotation tally (windowed) -- shared logic in lib/common.py.
    rot_window = 4
    focus_doc = ROOT / 'meta' / 'character-focus.md'
    if focus_doc.exists():
        ffm = get_frontmatter(focus_doc)
        if ffm.get('rotation_window_sessions'):
            rot_window = int(ffm['rotation_window_sessions'])
    active_names = [get_frontmatter(f).get('name') for f in pc_files]
    spot_sessions = get_played_spotlight_sessions(ROOT)
    rotation = get_spotlight_rotation(spot_sessions, rot_window, active_names)
    rot_shown = len(spot_sessions) >= rot_window

    cwrite("\n=== PARTY STATUS ===", 'cyan')

    for f in pc_files:
        fm = get_frontmatter(f)
        name = fm.get('name')
        player = fm.get('player')
        cls = fm.get('class')
        race = fm.get('race')
        level = fm.get('level')
        state = fm.get('state')
        desc = fm.get('description')

        state_color = 'green' if ci_eq(state, 'active') else 'red' if ci_eq(state, 'dead') else 'yellow'

        cwrite(f"\n  {name}", 'white', end='')
        cwrite(f" ({player})", 'gray')
        cwrite("    {0} {1}, Level {2}".format(race, cls, level), 'white')

        if ci_eq(state, 'active') and latest_session > 0:
            confirmed = try_int(fm.get('level_confirmed'))
            if confirmed is None:
                cwrite(f"    LEVEL STALE: no level_confirmed stamp (latest session: {latest_session})", 'red')
            elif confirmed < latest_session:
                cwrite(f"    LEVEL STALE: confirmed at session {confirmed}, latest is {latest_session}", 'red')
        cwrite("    State: ", 'gray', end='')
        cwrite(state, state_color)

        affliction = None
        for key in afflictions:
            if (name and key.lower() in name.lower()) or (key and name and name.lower() in key.lower()):
                affliction = afflictions[key]
                break
        if affliction and not re.match(r'^Alive$', affliction):
            cwrite(f"    Status: {affliction}", 'darkyellow')

        appetite = fm['spotlight'].strip() if fm.get('spotlight') else 'normal'
        if appetite == 'low':
            cwrite("    Spotlight: low appetite (excluded from rotation)", 'darkgray')
        elif rot_shown:
            t = rotation['turns'].get(name, 0.0)
            seen = name in rotation['present']
            note = "" if seen else " (absent this window)"
            cwrite("    Spotlight: {0} rotation turns over last {1} sessions{2}".format(
                fmt_num(t), rot_window, note), 'darkcyan')

        if desc:
            cwrite(f"    {desc}", 'darkgray')

    cwrite("")


if __name__ == '__main__':
    main()
