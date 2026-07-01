#!/usr/bin/env python3
# session-brief.py -- pre-session planning dashboard
# consumers: CLAUDE.md, .claude/commands/recap.md, .claude/commands/session.md, meta/difficulty.md, tests/commands/session/spec.md -- update these if usage, flags, or output format change.
# uses: scripts/spotlight-balance.py (render_lines) for the spotlight readout.
# Replaces ~8 manual Read calls at the start of every /session invocation
# Usage: python scripts/session-brief.py

import importlib
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (ROOT, ci_eq, cwrite, digits_int, fmt_num, get_frontmatter,
                        parse_party_table, read_text_no_bom, try_parse_date)

spotlight = importlib.import_module('spotlight-balance')


def main() -> None:
    hist_dir = ROOT / 'historian' / 'sessions'
    sched_dir = ROOT / 'scheduler' / 'sessions'
    hist_sessions = list(hist_dir.glob('*.md')) if hist_dir.exists() else []
    sched_sessions = list(sched_dir.glob('*.md')) if sched_dir.exists() else []
    hist_full = {f.resolve() for f in hist_sessions}
    all_sessions = hist_sessions + sched_sessions

    max_num = 0
    latest_played = 0
    for s in all_sessions:
        fm = get_frontmatter(s)
        n = digits_int(fm.get('session_number'))
        if n > max_num:
            max_num = n
        if n > latest_played and s.resolve() in hist_full:
            latest_played = n
    next_num = max_num + 1

    cwrite("\n========================================", 'darkgray')
    cwrite("  SESSION BRIEF", 'cyan')
    cwrite("========================================", 'darkgray')

    cwrite(f"\nNext session: #{next_num}", 'yellow')
    if next_num % 5 == 0:
        cwrite(f"  MILESTONE: session #{next_num} - worth marking at the table.", 'magenta')

    # -- Uncanonized sessions -------------------------------------------------
    today = date.today()
    hist_nums = {}
    for s in hist_sessions:
        fm = get_frontmatter(s)
        if fm.get('session_number'):
            hist_nums[str(fm['session_number'])] = True
    uncanonized = []
    for s in sched_sessions:
        fm = get_frontmatter(s)
        state = str(fm.get('state') or '').lower()
        if state not in ('draft', 'planned'):
            continue
        if not fm.get('planned_date') or ci_eq(fm.get('planned_date'), 'null'):
            continue
        pd = try_parse_date(fm['planned_date'])
        if not pd:
            continue
        if pd < today and str(fm.get('session_number')) not in hist_nums:
            uncanonized.append(
                f"  ! #{fm.get('session_number')} '{fm.get('name')}' planned "
                f"{fm.get('planned_date')} - played but not canonized? Run /recap.")
    inbox_dir = ROOT / 'recaps' / 'inbox'
    inbox = [f for f in inbox_dir.glob('*.md') if f.name != '.gitkeep'] if inbox_dir.exists() else []
    for f in inbox:
        uncanonized.append(f"  ! Notes waiting in recaps/inbox/{f.name} - run /recap to canonize.")
    if uncanonized:
        cwrite("\n--- UNCANONIZED SESSIONS ---", 'red')
        for u in uncanonized:
            cwrite(u, 'red')

    # -- Campaign / Act / Mission ---------------------------------------------
    cwrite("\n--- STORY STATE ---", 'darkgray')
    campaign_dir = ROOT / 'scheduler' / 'campaign'
    campaign_files = list(campaign_dir.glob('*.md')) if campaign_dir.exists() else []
    for f in campaign_files:
        fm = get_frontmatter(f)
        cwrite("  Campaign: {0} [{1}]".format(fm.get('name'), fm.get('state')), 'white')
        if fm.get('current_act'):
            cwrite(f"  Current act note: {fm['current_act']}", 'darkgray')

    acts_dir = ROOT / 'scheduler' / 'acts'
    for f in (sorted(acts_dir.glob('*.md'), key=lambda f: f.name.lower()) if acts_dir.exists() else []):
        fm = get_frontmatter(f)
        cwrite("  Act: {0} [{1}]".format(fm.get('name'), fm.get('state')), 'white')

    missions_dir = ROOT / 'scheduler' / 'missions'
    mission_files = sorted(missions_dir.glob('*.md'), key=lambda f: f.name.lower()) if missions_dir.exists() else []
    if mission_files:
        for f in mission_files:
            fm = get_frontmatter(f)
            cwrite("  Mission: {0} [{1}]".format(fm.get('name'), fm.get('state')), 'white')
    else:
        cwrite("  Missions: none active", 'darkgray')

    # -- Last played session --------------------------------------------------
    cwrite("\n--- LAST SESSION ---", 'darkgray')
    last_session = sorted(hist_sessions, key=lambda f: f.name.lower(), reverse=True)[0] if hist_sessions else None
    if last_session:
        fm = get_frontmatter(last_session)
        cwrite("  #{0}: {1}".format(fm.get('session_number'), fm.get('name')), 'white')
        if fm.get('description'):
            cwrite(f"  Summary: {fm['description']}", 'gray')
        body = read_text_no_bom(last_session)
        m = re.search(r'cliffhanger:\s*"([^"]+)"', body)
        if m:
            cwrite(f"  Cliffhanger: {m.group(1)}", 'darkyellow')
        m = re.search(r'played_date:\s*"?([^"\r\n]+)"?', body)
        if m:
            cwrite(f"  Played: {m.group(1)}", 'darkgray')

    # -- Rest clock -----------------------------------------------------------
    cwrite("\n--- REST CLOCK ---", 'darkgray')
    active_campaign = None
    for f in campaign_files:
        if ci_eq(get_frontmatter(f).get('state'), 'active'):
            active_campaign = f
            break
    if not active_campaign and campaign_files:
        active_campaign = campaign_files[0]

    content = read_text_no_bom(active_campaign) if active_campaign else ''
    if active_campaign:
        m = re.search(r'### Rest Clock \(as of:? Session (\d+)\)\r?\n([\s\S]+?)(\r?\n##|\r?\n###|\Z)', content)
        if m:
            clock_session = int(m.group(1))
            clock_block = m.group(2)
            for line in clock_block.split('\n'):
                line = line.rstrip('\r')
                lm = re.match(r'^- (.+)$', line)
                if lm:
                    cwrite(f"  {lm.group(1)}", 'white')
            hm = re.search(r'(?im)^\s*-\s*Hours since last long rest:\s*~?\s*(\d+(?:\.\d+)?)', clock_block)
            if hm:
                hrs = float(hm.group(1))
                if hrs >= 24:
                    cwrite(f"  > Long rest TIME GATE met ({fmt_num(hrs)} h >= 24) - offerable if location is safe and no PC at 0 HP.", 'green')
                else:
                    cwrite("  ! Long rest NOT available: only {0} h since last (needs 24) - {1} h more in-world before a fresh reset.".format(
                        fmt_num(hrs), fmt_num(24 - hrs)), 'red')
            else:
                cwrite("  ! Long rest availability UNKNOWN - 'Hours since last long rest' not numeric; reconstruct with DM.", 'yellow')
            if clock_session < latest_played:
                cwrite(f"  ! REST CLOCK STALE: as of Session {clock_session}, latest played is {latest_played} - reconstruct with DM before encounter planning.", 'red')
        elif re.search(r'### Rest Clock', content):
            cwrite("  ! REST CLOCK NOT INITIALIZED - reconstruct with DM before encounter planning.", 'red')
        else:
            cwrite("  ! No Rest Clock section in campaign Current State - add one (see meta/difficulty.md).", 'red')

        m = re.search(r'## Current State \(after Session (\d+)\)', content)
        if m:
            if int(m.group(1)) < latest_played:
                cwrite(f"  ! CURRENT STATE STALE: header says Session {m.group(1)}, latest played is {latest_played} - update and restamp at next /recap.", 'red')
        elif re.search(r'## Current State', content):
            cwrite("  ! Current State header has no '(after Session N)' stamp - restamp at next /recap.", 'yellow')

    # -- Party ----------------------------------------------------------------
    cwrite("\n--- PARTY ---", 'darkgray')
    afflictions = {}
    if active_campaign:
        for cols in parse_party_table(active_campaign):
            if len(cols) >= 4:
                char_name = re.sub(r'\[\[|\]\]', '', cols[1]).replace('"', '')
                afflictions[char_name] = cols[3]

    pcs_dir = ROOT / 'historian' / 'characters' / 'pcs'
    pc_files = sorted(pcs_dir.glob('*.md'), key=lambda f: f.name.lower()) if pcs_dir.exists() else []
    for f in pc_files:
        fm = get_frontmatter(f)
        name = fm.get('name')
        affliction = None
        for key in afflictions:
            if (name and key.lower() in name.lower()) or (key and name and name.lower() in key.lower()):
                affliction = afflictions[key]
                break
        suffix = f" ! {affliction}" if affliction and not re.match(r'^Alive$', affliction) else ""
        cwrite("  {0} ({1}) - {2} {3} L{4}{5}".format(
            name, fm.get('player'), fm.get('race'), fm.get('class'), fm.get('level'), suffix), 'white')

    # -- Design preference drought --------------------------------------------
    pref_file = ROOT / 'meta' / 'campaign-design-preferences.md'
    if pref_file.exists():
        raw = read_text_no_bom(pref_file)
        total = len(re.findall(r'(?m)^\s*-\s*\*Deployed:', raw))
        deployed = len(re.findall(r'(?m)^\s*-\s*\*Deployed:[^\r\n]*\[\[', raw))
        seeded = len(re.findall(r'(?m)^\s*-\s*\*Seeded:', raw))
        if total - deployed > 0:
            cwrite("\n--- PREFERENCES ---", 'darkgray')
            cwrite(f"  {total - deployed} of {total} group wishlist items not yet deployed; {seeded} seeded ({latest_played} sessions played)", 'white')

    # -- Spotlight balance ----------------------------------------------------
    spotlight.emit(spotlight.render_lines(section=True))

    cwrite("\n========================================\n", 'darkgray')


if __name__ == '__main__':
    main()
