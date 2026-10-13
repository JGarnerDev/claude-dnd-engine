#!/usr/bin/env python3
# prep-status.py -- what is left before a planned session can run.
# consumers: CLAUDE.md, .claude/commands/review.md, .claude/commands/todo.md -- update these if usage, flags, or output format change.
# Builds the session's prep checklist from its files instead of a hand-kept list:
#   plan state and date, unset `<placeholders>` (with the beat they sit under),
#   flow beats by marker, linked loot that is not confirmed, battlemap layouts and
#   their renders, combatant labels with no token rule, the token kit, stale PC
#   levels, the search index, and unchecked lines in the folder's _tasks.md.
# _tasks.md stays for what no file can show (cards to print, players to ask);
# everything this script derives does not belong in it.
# Output: one block per area; lines needing action start with "TODO", fine ones "ok",
# information "--". Ends with a count of TODO lines.
# Usage:
#   uv run scripts/prep-status.py                 (newest draft or planned session)
#   uv run scripts/prep-status.py --session 30    (number or folder name)
import argparse
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (  # noqa: E402
    ROOT, ci_eq, cwrite, entity_md_files, get_frontmatter, index_staleness,
    read_text_no_bom, try_int, try_parse_date,
)

SESSIONS = ROOT / 'scheduler' / 'sessions'
LOOT = ROOT / 'meta' / 'loot-options'
ASSETS = ROOT / 'maps' / 'roll20 assets'
RENDERS = ROOT / 'maps' / 'battlemaps'

PLACEHOLDER_RE = re.compile(r'`(<[^>`]+>)`')
HEADING_RE = re.compile(r'^(#{3,4})\s+(.+?)\s*$')
NODE_ID_RE = re.compile(r'^([A-Z][A-Z0-9]*_[A-Z0-9_]+)\b')
FLOW_NODE_RE = re.compile(r'\b([A-Z][A-Z0-9]*_[A-Z0-9_]+)\s*[\[{(]+"\[([x?-])\]\s')
WIKILINK_RE = re.compile(r'\[\[([^\]|#]+)')
LABEL_RE = re.compile(r'\*\*Label \(party-facing\):\*\*\s*(.+)')
RULE_RE = re.compile(r'^\s*\d+\s+(\S+)\s+\d+\s+')
TASK_RE = re.compile(r'^\s*- \[ \]\s+(.+)')
KIT_COUNT_RE = re.compile(r'^(\d+) tokens, ([\d.]+) MB', re.MULTILINE)


# -- Parsers (pure, tested) ----------------------------------------------------

def placeholders(text: str) -> list:
    """(placeholder, where) for every backticked `<...>` outside frontmatter.

    `where` is the node id of the nearest #### heading above, else the ### heading."""
    out, where = [], ''
    body = re.sub(r'\A---\r?\n.*?\r?\n---', '', text, count=1, flags=re.DOTALL)
    in_fence = False
    for line in body.splitlines():
        if line.lstrip().startswith('```'):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        m = HEADING_RE.match(line)
        if m:
            title = m.group(2)
            node = NODE_ID_RE.match(title)
            where = node.group(1) if node else title
            continue
        for ph in PLACEHOLDER_RE.findall(line):
            out.append((ph, where))
    return out


def flow_markers(text: str) -> dict:
    """Node id -> marker ('x', '-', '?') for every node definition in a flow file."""
    nodes = {}
    for node_id, marker in FLOW_NODE_RE.findall(text):
        nodes.setdefault(node_id, marker)
    return nodes


def label_roles(text: str) -> list:
    """tokens.txt roles implied by the plan's Label (party-facing) lines, in order.

    'Mastiff 1 (Brick), Mastiff 2 (Mortar)' -> ['mastiff']; 'Half-orc Cask-hand' ->
    ['half-orc-cask-hand']."""
    roles = []
    for line in LABEL_RE.findall(text):
        for part in line.split(','):
            label = re.sub(r'\([^)]*\)', '', part).strip(' .*_')
            label = re.sub(r'\s+\d+$', '', label).strip()
            if not label:
                continue
            role = re.sub(r'\s+', '-', label.lower())
            if role not in roles:
                roles.append(role)
    return roles


def manifest_roles(text: str) -> set:
    return {m.group(1).lower() for line in text.splitlines() if (m := RULE_RE.match(line))}


def open_tasks(text: str) -> list:
    """Unchecked '- [ ]' items, first line only, bold markers dropped, cut at 90 chars.

    A bold title that is only a name ('**Kellan:** confirm ...') keeps the text after it."""
    out = []
    for line in text.splitlines():
        m = TASK_RE.match(line)
        if not m:
            continue
        item = re.sub(r'\*\*(.+?)\*\*', r'\1', m.group(1).strip())
        out.append(item[:87].rstrip() + '...' if len(item) > 90 else item)
    return out


# -- Session lookup ------------------------------------------------------------

def plan_file(folder: Path):
    exact = folder / f'{folder.name}.md'
    if exact.exists():
        return exact
    cands = [p for p in folder.glob('*.md') if not p.name.startswith(('_', 'Encounter '))]
    return cands[0] if cands else None


def find_session(arg):
    folders = [f for f in SESSIONS.iterdir() if f.is_dir()] if SESSIONS.exists() else []
    if arg:
        n = try_int(arg)
        for f in folders:
            if (n is not None and re.match(rf'Session 0*{n}\b', f.name)) or ci_eq(f.name, arg):
                return f
        return None
    best, best_n = None, -1
    for f in folders:
        plan = plan_file(f)
        if not plan:
            continue
        fm = get_frontmatter(plan)
        n = try_int(fm.get('session_number')) or -1
        if (fm.get('state') or '').lower() in ('draft', 'planned') and n > best_n:
            best, best_n = f, n
    return best


def latest_played() -> int:
    latest = 0
    sessions_dir = ROOT / 'historian' / 'sessions'
    if sessions_dir.exists():
        for sf in entity_md_files(sessions_dir):
            n = try_int(get_frontmatter(sf).get('session_number'))
            if n is not None and n > latest:
                latest = n
    return latest


# -- Report --------------------------------------------------------------------

class Report:
    def __init__(self):
        self.todo = 0

    def head(self, title):
        cwrite(f'\n{title}', 'cyan')

    def line(self, kind, text):
        if kind == 'TODO':
            self.todo += 1
        cwrite(f'  {kind:<4} {text}', {'TODO': 'yellow', 'ok': 'green'}.get(kind, 'gray'))


def main():
    ap = argparse.ArgumentParser(description='Prep checklist for a planned session.')
    ap.add_argument('--session', help='session number or folder name (default: newest draft/planned)')
    args = ap.parse_args()

    folder = find_session(args.session)
    if not folder:
        cwrite('No draft or planned session found in scheduler/sessions/.' if not args.session
               else f'No session folder matches "{args.session}".', 'red')
        sys.exit(1)
    plan = plan_file(folder)
    if not plan:
        cwrite(f'No plan file in {folder.name}/.', 'red')
        sys.exit(1)
    text = read_text_no_bom(plan)
    fm = get_frontmatter(plan)
    n = try_int(fm.get('session_number'))
    r = Report()

    cwrite(f'=== PREP STATUS: {folder.name} ===', 'cyan')

    # Plan
    r.head('PLAN')
    state = (fm.get('state') or '?').lower()
    r.line('ok' if state == 'planned' else 'TODO',
           f'state: {state}' + ('' if state == 'planned' else ' (run /review --ready when it is set)'))
    when = try_parse_date(fm.get('planned_date') or '')
    if when:
        days = (when - date.today()).days
        gap = 'today' if days == 0 else f'in {days} day{"s" if days != 1 else ""}' if days > 0 \
            else f'passed {-days} day{"s" if days != -1 else ""} ago'
        r.line('--', f'planned date: {when:%a %Y-%m-%d} ({gap})')
    else:
        r.line('TODO', 'no planned_date')
    phs = placeholders(text)
    if phs:
        for ph, where in phs:
            r.line('TODO', f'set {ph}' + (f'  ({where})' if where else ''))
    else:
        r.line('ok', 'no placeholders left to set')

    # Flow
    r.head('FLOW (_flow.md)')
    flow = folder / '_flow.md'
    if flow.exists():
        nodes = flow_markers(read_text_no_bom(flow))
        by = {m: [k for k, v in nodes.items() if v == m] for m in 'x-?'}
        r.line('--', f'{len(nodes)} beats: {len(by["x"])} committed, {len(by["-"])} draft, {len(by["?"])} open')
        if by['?']:
            r.line('TODO', 'open (decide first): ' + ', '.join(by['?']))
        if by['-']:
            r.line('TODO', f'draft, not yet committed ({len(by["-"])}): ' + ', '.join(by['-']))
        if not by['?'] and not by['-']:
            r.line('ok', 'every beat committed')
    else:
        r.line('--', 'no _flow.md')

    # Loot
    r.head('LOOT')
    loot_files = {p.stem.lower(): p for p in LOOT.rglob('*.md') if p.name != 'README.md'} if LOOT.exists() else {}
    seen = []
    for link in WIKILINK_RE.findall(text):
        p = loot_files.get(link.strip().lower())
        if p and p not in seen:
            seen.append(p)
    if not seen:
        r.line('--', 'no loot-option items linked')
    for p in seen:
        status = (get_frontmatter(p).get('status') or 'draft').lower()
        r.line('ok' if status == 'confirmed' else 'TODO', f'{p.stem}: {status}')

    # Maps
    r.head('MAPS')
    layouts = sorted((folder / 'maps').glob('*.txt')) if (folder / 'maps').exists() else []
    roles = label_roles(text)
    if not layouts:
        r.line('TODO' if roles else '--',
               'no battlemap layouts' + (' (fights are planned; fine if they run in the theatre of the mind)' if roles else ''))
    for lay in layouts:
        outs = [RENDERS / f'session-{n}' / f'{lay.stem}-{kind}.png' for kind in ('vtt', 'key')]
        missing = [o.name for o in outs if not o.exists()]
        if missing:
            r.line('TODO', f'{lay.name}: not rendered ({", ".join(missing)}); run uv run scripts/battlemap.py --session {n}')
        elif any(o.stat().st_mtime < lay.stat().st_mtime for o in outs):
            r.line('TODO', f'{lay.name}: render is older than the layout; run uv run scripts/battlemap.py --session {n}')
        else:
            r.line('ok', f'{lay.name}: rendered')

    # Tokens
    r.head('TOKENS')
    kit_dir = ASSETS / f'session-{n}'
    manifest = kit_dir / 'tokens.txt'
    if not roles:
        r.line('--', 'no combatant labels in the plan')
    elif not manifest.exists():
        r.line('TODO', f'no tokens.txt yet for {len(roles)} combatant labels')
    else:
        have = manifest_roles(read_text_no_bom(manifest))
        missing = [x for x in roles if x not in have]
        if missing:
            r.line('TODO', 'labels with no tokens.txt rule: ' + ', '.join(missing))
        else:
            r.line('ok', f'all {len(roles)} combatant labels have a tokens.txt rule')
    readme = kit_dir / 'tokens' / 'README.md'
    if manifest.exists():
        if not readme.exists():
            r.line('TODO', f'kit not built; run uv run scripts/token-kit.py --session {n}')
        elif readme.stat().st_mtime < manifest.stat().st_mtime:
            r.line('TODO', f'kit is older than tokens.txt; rebuild with uv run scripts/token-kit.py --session {n}')
        else:
            m = KIT_COUNT_RE.search(read_text_no_bom(readme))
            r.line('ok', f'kit built: {m.group(1)} tokens, {m.group(2)} MB' if m else 'kit built')

    # Party
    r.head('PARTY')
    latest = latest_played()
    pcs_dir = ROOT / 'historian' / 'characters' / 'pcs'
    stale = []
    for pc in sorted(pcs_dir.glob('*.md')) if pcs_dir.exists() else []:
        pfm = get_frontmatter(pc)
        if not ci_eq(pfm.get('state'), 'active') or not latest:
            continue
        conf = try_int(pfm.get('level_confirmed'))
        if conf is None or conf < latest:
            stale.append(f'{pfm.get("name") or pc.stem} (confirmed at {conf if conf is not None else "never"})')
    if stale:
        r.line('TODO', f'levels not confirmed since Session {latest}: ' + ', '.join(stale))
    else:
        r.line('ok', 'PC levels confirmed')

    # Hand-kept
    tasks = folder / '_tasks.md'
    if tasks.exists():
        r.head('HAND-KEPT (_tasks.md, unchecked)')
        items = open_tasks(read_text_no_bom(tasks))
        for item in items:
            r.line('TODO', item)
        if not items:
            r.line('ok', 'every item ticked')

    # Housekeeping
    r.head('HOUSEKEEPING')
    idx = index_staleness(ROOT)
    if idx is None:
        r.line('TODO', 'search index never built; run uv run scripts/index-entities.py')
    elif idx[2]:
        r.line('TODO', f'search index stale ({len(idx[2])} commits); run uv run scripts/index-entities.py')
    else:
        r.line('ok', 'search index fresh')

    cwrite(f'\n{r.todo} to do.', 'yellow' if r.todo else 'green')


if __name__ == '__main__':
    main()
