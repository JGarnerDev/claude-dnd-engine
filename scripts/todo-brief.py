#!/usr/bin/env python3
# todo-brief.py -- DM action-item dashboard. Backbone of the /todo command.
# consumers: CLAUDE.md, .claude/commands/todo.md -- update these if usage, flags, or output format change.
# uses: scripts/spotlight-balance.py (render_lines) for the spotlight ledger flags;
#       scripts/validate.py (count_errors) for graph health, when present.
# Collects every mechanical "needs attention" signal in one call:
#   uncanonized sessions, recap inbox, untranscribed recordings, index staleness,
#   unchecked topic-todo items, NPC voice stamps (meta/voice.md),
#   world buildout gaps (empty entity types, scheduler structure),
#   questionnaire fill states, draft files, undeployed design preferences.
# Output is raw signals; /todo translates them to plain DM language.
# Usage: python scripts/todo-brief.py

import importlib
import re
import sys
from datetime import date, timedelta
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (ROOT, ci_eq, color, cwrite, entity_md_files, get_frontmatter,
                        get_frontmatter_from_text, index_staleness, pending_recordings,
                        read_text_no_bom, try_int, try_parse_date)

spotlight = importlib.import_module('spotlight-balance')

D20, DRAGON, SCROLL, CROWN, HORNS = '🎲', '🐉', '📜', '👑', '🤘'

_WIKI_NAME_RE = re.compile(r'\[\[([^\]|]+)')
_VOICE_SECTION_RE = re.compile(r'^## Voice\s*$', re.M)


def _glob(rel: str, pattern: str = '*.md') -> list:
    # Sessions are a folder each, so the default pattern recurses.
    if pattern == '*.md':
        return entity_md_files(ROOT / rel)
    d = ROOT / rel
    return list(d.glob(pattern)) if d.exists() else []


def voice_flags(root: Path) -> list:
    """(text, color) lines for NPC voices that lag the sessions they appeared in.

    Appearance is a played session's `key_npcs`, whose items come either bare
    ([[Name]]) or quoted with a note ("[[Name]] (why they're here)"). A voice is
    stale when its `voice_confirmed` stamp is older than its last appearance, and
    unstamped when it has a `## Voice` section but no stamp (meta/voice.md).
    """
    last_seen = {}
    for s in entity_md_files(root / 'historian' / 'sessions'):
        fm = get_frontmatter(s)
        n = try_int(fm.get('session_number'))
        if n is None:
            continue
        for item in fm.get('_list_key_npcs', []):
            m = _WIKI_NAME_RE.search(item)
            name = (m.group(1) if m else item.split(' (')[0]).strip().lower()
            last_seen[name] = max(last_seen.get(name, 0), n)

    lines = []
    for sub in ('npcs', 'antagonists'):
        for f in entity_md_files(root / 'historian' / 'characters' / sub):
            raw = read_text_no_bom(f)
            fm = get_frontmatter_from_text(raw)
            name = fm.get('name') or f.stem
            stamp = try_int(fm.get('voice_confirmed'))
            seen = last_seen.get(name.lower())
            if stamp is None:
                if _VOICE_SECTION_RE.search(raw):
                    lines.append((f"  VOICE UNSTAMPED: {name} has a voice section but no voice_confirmed - confirm at next /recap or /voice", 'yellow'))
            elif seen and seen > stamp:
                lines.append((f"  VOICE STALE: {name} confirmed at session {stamp}, appeared in session {seen} - rebuild their current mood at next /recap", 'yellow'))
    return lines


def main() -> None:
    # DM name from the active campaign's frontmatter
    dm_name = None
    for c in _glob('scheduler/campaign'):
        cfm = get_frontmatter(c)
        if ci_eq(cfm.get('state'), 'active') and cfm.get('dm'):
            dm_name = cfm['dm']
            break

    cwrite("\n========================================", 'darkgray')
    cwrite(f"  {D20} DM TODO BRIEF {DRAGON}", 'cyan')
    cwrite(f"  {SCROLL} quests, debts, and loose ends", 'darkcyan')
    if dm_name:
        cwrite(f"  DM: {dm_name}", 'darkcyan')
    cwrite("========================================", 'darkgray')

    # -- 1. Uncanonized sessions + recap inbox --------------------------------
    hist_sessions = _glob('historian/sessions')
    sched_sessions = _glob('scheduler/sessions')
    today = date.today()

    hist_nums = {}
    for s in hist_sessions:
        fm = get_frontmatter(s)
        if fm.get('session_number'):
            hist_nums[str(fm['session_number'])] = True

    cwrite("\n--- SESSIONS ---", 'darkgray')
    session_flags = 0
    for s in sched_sessions:
        fm = get_frontmatter(s)
        if str(fm.get('state') or '').lower() not in ('draft', 'planned'):
            continue
        pd = try_parse_date(fm['planned_date']) if fm.get('planned_date') and not ci_eq(fm['planned_date'], 'null') else None
        has_date = pd is not None
        if has_date and pd < today and str(fm.get('session_number')) not in hist_nums:
            cwrite(f"  UNCANONIZED: #{fm.get('session_number')} '{fm.get('name')}' planned {fm.get('planned_date')}", 'red')
        else:
            for_part = f" for {fm.get('planned_date')}" if has_date else ""
            cwrite(f"  Pending plan: #{fm.get('session_number')} '{fm.get('name')}' [{fm.get('state')}]{for_part}", 'yellow')
        session_flags += 1
    for f in _glob('recaps/inbox'):
        cwrite(f"  INBOX NOTES: recaps/inbox/{f.name} awaiting /recap", 'red')
        session_flags += 1
    for slug, n_tracks in pending_recordings(ROOT):
        tracks = f"{n_tracks} tracks" if n_tracks != 1 else "single file"
        cwrite(f"  UNTRANSCRIBED RECORDING: recaps/audio/{slug} ({tracks}) -- /transcript {slug} --transcribe", 'red')
        session_flags += 1

    future_plans = 0
    for s in sched_sessions:
        fm = get_frontmatter(s)
        if str(fm.get('state') or '').lower() not in ('draft', 'planned'):
            continue
        pd = try_parse_date(fm['planned_date']) if fm.get('planned_date') and not ci_eq(fm['planned_date'], 'null') else None
        if pd is None or pd >= today:
            future_plans += 1
    if not future_plans:
        days_until = (1 - today.weekday() + 7) % 7  # Tuesday == weekday 1
        next_game = (today + timedelta(days=days_until)).strftime('%Y-%m-%d')
        when = f"TONIGHT ({next_game})" if days_until == 0 else f"Tuesday {next_game} ({days_until} day(s) away)"
        cwrite(f"  NO PLAN: next game is {when} - nothing drafted. Run /session.", 'red')
        session_flags += 1
    if not session_flags:
        cwrite("  (clean)", 'darkgray')

    # -- 1b. Open threads -----------------------------------------------------
    cwrite("\n--- OPEN THREADS ---", 'darkgray')
    thread_re = re.compile(r'^state:\s*(missing|imprisoned|transformed|stranded|captured)\s*$', re.M)
    thread_hits = []
    for f in (ROOT / 'historian').rglob('*.md'):
        m = thread_re.search(read_text_no_bom(f))
        if m:
            thread_hits.append((f, m.group(1)))
    if thread_hits:
        for f, st in thread_hits:
            cwrite(f"  {f.stem} [{st}]", 'white')
        cwrite(f"  ({len(thread_hits)} total - run /threads for the full picture)", 'darkgray')
    else:
        cwrite("  (none)", 'darkgray')

    # -- 1b2. Party state staleness -------------------------------------------
    cwrite("\n--- PARTY STATE ---", 'darkgray')
    latest_played = max((try_int(k) or 0 for k in hist_nums), default=0)
    party_flags = 0
    if latest_played > 0:
        for pc in _glob('historian/characters/pcs'):
            fm = get_frontmatter(pc)
            if not ci_eq(fm.get('state'), 'active'):
                continue
            confirmed = try_int(fm.get('level_confirmed'))
            if confirmed is None:
                cwrite(f"  LEVEL STALE: {fm.get('name')} has no level_confirmed stamp (latest session: {latest_played})", 'red')
                party_flags += 1
            elif confirmed < latest_played:
                cwrite(f"  LEVEL STALE: {fm.get('name')} confirmed at session {confirmed}, latest is {latest_played}", 'red')
                party_flags += 1
    active_campaign = None
    for c in _glob('scheduler/campaign'):
        if ci_eq(get_frontmatter(c).get('state'), 'active'):
            active_campaign = c
            break
    if active_campaign:
        c_raw = read_text_no_bom(active_campaign)
        m = re.search(r'### Rest Clock \(as of:? Session (\d+)\)', c_raw)
        if m:
            if int(m.group(1)) < latest_played:
                cwrite(f"  REST CLOCK STALE: as of Session {m.group(1)}, latest played is {latest_played} - reconstruct at next /session or /recap", 'red')
                party_flags += 1
        elif re.search(r'### Rest Clock', c_raw):
            cwrite("  REST CLOCK NOT INITIALIZED - reconstruct at next /session or /recap", 'red')
            party_flags += 1
        else:
            cwrite("  No Rest Clock section in campaign Current State (see meta/difficulty.md)", 'yellow')
            party_flags += 1
    if not party_flags:
        cwrite("  (clean)", 'darkgray')

    # -- 1b2b. NPC voice stamps -----------------------------------------------
    cwrite("\n--- NPC VOICES ---", 'darkgray')
    v_lines = voice_flags(ROOT)
    for text, clr in v_lines:
        cwrite(text, clr)
    if not v_lines:
        cwrite("  (clean)", 'darkgray')

    # -- 1b3. Spotlight -------------------------------------------------------
    cwrite("\n--- SPOTLIGHT ---", 'darkgray')
    spot_lines = spotlight.render_lines(section=True)
    spot_flags = 0
    for text, _clr in spot_lines:
        t = text.strip()
        if 'Overdue:' in t:
            cwrite(f"  {t}", 'yellow')
            spot_flags += 1
        elif 'no spotlight hooks' in t:
            cwrite(f"  {t}", 'yellow')
            spot_flags += 1
        elif 'insufficient history' in t:
            cwrite(f"  {t}", 'darkgray')
            spot_flags += 1
    if not spot_flags:
        cwrite("  (clean)", 'darkgray')

    # -- 1c. Graph health -----------------------------------------------------
    cwrite("\n--- GRAPH HEALTH ---", 'darkgray')
    err_count = _validate_error_count()
    if err_count is None:
        cwrite("  (validate.py did not report - run it manually)", 'yellow')
    elif err_count:
        cwrite(f"  {err_count} broken cross-reference(s) or missing field(s) - run validate.py for detail", 'yellow')
        cwrite("  (placeholder world names under construction are expected here)", 'darkgray')
    else:
        cwrite("  Clean", 'darkgray')

    # -- 2. Semantic index staleness ------------------------------------------
    cwrite("\n--- INDEX ---", 'darkgray')
    idx = index_staleness(ROOT)
    if idx is None:
        cwrite("  Never built - run: uv run scripts/index-entities.py", 'red')
    else:
        built, sha, commits = idx
        if commits:
            cwrite(f"  Stale: {len(commits)} entity-dir commit(s) since last build ({sha[:7]})", 'yellow')
            cwrite("  (commits touching only CLAUDE.md/README do not stale the index)", 'darkgray')
        else:
            cwrite(f"  Fresh (built {built})", 'darkgray')

    # -- 3. Unchecked todo items ----------------------------------------------
    cwrite("\n--- TODO FILES (unchecked) ---", 'darkgray')
    todo_files = [f for f in _glob('.', 'todo*.md') if f.name != 'todo-dashboard.md']
    if todo_files:
        for todo_file in todo_files:
            cwrite(f"  == {todo_file.name} ==", 'darkgray')
            section = ""
            for line in read_text_no_bom(todo_file).split('\n'):
                hm = re.match(r'^##\s+(.*)', line)
                if hm:
                    section = hm.group(1).strip()
                    continue
                im = re.match(r'^\s*-\s+\[ \]\s+(.*)', line)
                if im:
                    item = im.group(1).strip()
                    if len(item) > 110:
                        item = item[:107] + "..."
                    cwrite(f"  [{section}] {item}", 'white')
    else:
        cwrite("  (no todo files found)", 'darkgray')

    # -- 3b. World buildout ---------------------------------------------------
    cwrite("\n--- WORLD BUILDOUT ---", 'darkgray')
    buildout_dirs = [
        ("regions", "data/locations/regions"),
        ("cities", "data/locations/cities"),
        ("dungeons", "data/locations/dungeons"),
        ("wilderness", "data/locations/wilderness"),
        ("shops", "data/locations/shops"),
        ("factions", "data/factions"),
        ("NPCs", "data/characters/npcs"),
        ("PCs", "data/characters/pcs"),
        ("events", "data/events"),
        ("rumors", "data/rumors"),
    ]
    empty, populated = [], []
    for label, rel in buildout_dirs:
        n = len(_glob(rel))
        if n == 0:
            empty.append(label)
        else:
            populated.append(f"{label} ({n})")
    if empty:
        cwrite(f"  EMPTY - no entities yet: {', '.join(empty)}", 'yellow')
    else:
        cwrite("  All core entity types populated.", 'darkgray')
    cwrite(f"  Populated: {', '.join(populated)}", 'darkgray')

    act_files = _glob('scheduler/acts')
    mis_n = len(_glob('scheduler/missions'))
    if not act_files:
        cwrite("  SCHEDULER: no act defined yet", 'yellow')
    elif any('Placeholder' in f.name for f in act_files):
        cwrite("  SCHEDULER: only a placeholder act exists - needs real act notes", 'yellow')
    if mis_n == 0:
        cwrite("  SCHEDULER: no missions defined yet", 'yellow')

    for pf in _glob('historian/characters/parties'):
        fm = get_frontmatter(pf)
        pname = str(fm.get('name') or '').replace('"', '').strip()
        if re.match(r'^the party$', pname, re.I):
            cwrite("  PARTY UNNAMED: still called 'The Party' - encourage the group to pick a name", 'yellow')

    # -- 4. Questionnaires ----------------------------------------------------
    # questionnaires/ is one-question-per-file, grouped in topic subfolders, so this
    # walks the tree (rglob) rather than a flat glob. See scripts/questions-brief.py
    # for the detailed breakdown; this is the dashboard summary only.
    cwrite("\n--- QUESTIONNAIRES ---", 'darkgray')
    qdir = ROOT / 'questionnaires'
    q_files = sorted(qdir.rglob('*.md')) if qdir.exists() else []
    open_by_area, answered, required_open = {}, 0, 0
    legacy = []
    for q in q_files:
        if q.name == 'README.md':
            continue
        fm = get_frontmatter(q)
        status = str(fm.get('status') or '').strip().lower()
        if not status:
            # Pre-split questionnaire: whole-file CLAUDE-INGEST block with a `filled:` marker.
            raw_q = read_text_no_bom(q)
            if re.search(r'(?m)^filled:\s*true', raw_q):
                legacy.append((q, True))
            elif re.search(r'(?m)^<!-- CLAUDE-INGEST', raw_q):
                legacy.append((q, False))
            continue
        if status == 'answered':
            answered += 1
        elif status == 'open':
            area = str(fm.get('topic') or '').split('/')[0] or '(untopiced)'
            open_by_area[area] = open_by_area.get(area, 0) + 1
            if str(fm.get('priority') or '').strip().lower() == 'required':
                required_open += 1
    total_open = sum(open_by_area.values())
    if total_open:
        areas = ', '.join(f"{a} {n}" for a, n in sorted(open_by_area.items()))
        cwrite(f"  {total_open} open questions ({areas}); {answered} answered", 'white')
        if required_open:
            cwrite(f"  {required_open} of them are REQUIRED - something downstream is blocked", 'yellow')
        cwrite("  run: uv run scripts/questions-brief.py --required --list", 'darkgray')
    elif not legacy:
        cwrite("  (none outstanding)", 'darkgray')
    for q, filled in legacy:
        rel = q.relative_to(ROOT)
        if filled:
            cwrite(f"  READY TO INGEST: {rel}", 'yellow')
        else:
            cwrite(f"  Awaiting answers: {rel}", 'white')


    # -- 5. Draft files -------------------------------------------------------
    cwrite("\n--- DRAFTS ---", 'darkgray')
    draft_count = 0
    for rel in ('data/lore', 'scheduler/acts', 'scheduler/missions'):
        for f in _glob(rel):
            fm = get_frontmatter(f)
            if ci_eq(fm.get('state'), 'draft'):
                cwrite(f"  {f.relative_to(ROOT)} - {fm.get('description')}", 'white')
                draft_count += 1
    if not draft_count:
        cwrite("  (none)", 'darkgray')

    # -- 6. Design preferences not yet used -----------------------------------
    cwrite("\n--- DESIGN PREFERENCES ---", 'darkgray')
    pref_file = ROOT / 'meta' / 'campaign-design-preferences.md'
    if pref_file.exists():
        raw = read_text_no_bom(pref_file)
        total = len(re.findall(r'(?m)^\s*-\s*\*Deployed:', raw))
        deployed = len(re.findall(r'(?m)^\s*-\s*\*Deployed:[^\r\n]*\[\[', raw))
        undeployed = total - deployed
        seeded = len(re.findall(r'(?m)^\s*-\s*\*Seeded:', raw))
        cwrite(f"  {undeployed} of {total} items not yet deployed; {seeded} seeded", 'white')
        if latest_played > 0 and latest_played % 5 == 0 and undeployed > 0:
            cwrite(f"  AGING CHECK DUE: session {latest_played} milestone - review undeployed items; seed or retire what's stalling", 'yellow')

    cwrite("\n========================================", 'darkgray')
    cwrite(f"  {HORNS} {CROWN} All hail the DM {CROWN} {HORNS}", 'yellow')
    cwrite("========================================\n", 'darkgray')


def _validate_error_count() -> Optional[int]:
    """Error count from validate.py if present (built in a later PR), else None."""
    try:
        validate = importlib.import_module('validate')
    except ImportError:
        return None
    fn = getattr(validate, 'count_errors', None)
    if fn is None:
        return None
    try:
        return fn()
    except Exception:
        return None


if __name__ == '__main__':
    main()
