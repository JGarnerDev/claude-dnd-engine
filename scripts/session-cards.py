#!/usr/bin/env python3
"""session-cards.py -- extract one planned session as JSON for the session runner page.
consumers: .claude/commands/review.md, app/pages/home/session-data-plugin.ts
-- update those if usage, flags, or output shape change.

Reads a session folder in scheduler/sessions/ -- the written plan (`Session NN Name.md`)
and its flow chart (`_flow.md`) -- and emits the JSON the session runner
(app/pages/home/session.html, `npm run home` -> /session.html) walks card by card:

  { session: {name, number, date, description, openingScene, closingHook, preamble, folder,
               campaign, root, looseThreads},
    previously: [{name, number, date, campaign, description, recap, cliffhanger, path}],
                                             # the session before this one, plus the last one
                                             # in this season when that differs (historian)
    nodes:   [{id, marker, kind, scene, title, lines, notes}],
    edges:   [{from, to, label, dashed}],
    scenes:  [{id, key, title, md}],         # flow subgraph + matching `### Scene <key>` prose
    sections:[{title, md}],                  # the plan's other `##` sections (Orientation, Rewards...)
    established:[{title, md}],               # `##` sections of the folder's optional _established.md
                                             # (town / region / world facts, table-safe)
    quickRefs: {entity name: md},            # `## NPC Quick-Reference` subsections
    roster:  [entity name],                  # wikilinks in the session + act frontmatter
    party:   [{name, player, raceClass, level, status, path}],
    entities:[{name, type, subtype, description, campaign, aliases, path}] }

Frontmatter only for entities and previous sessions; bodies are fetched on demand by the page. Spitballs are
never read -- they are not canon.

Usage: python scripts/session-cards.py [--session <folder name or session number>] [--root <repo root>]
  With no --session, picks the planned session with the earliest planned_date that has a _flow.md.
"""

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (  # noqa: E402
    ROOT, ci_eq, entity_md_files, get_frontmatter, get_frontmatter_from_text,
    parse_party_table, read_text_no_bom, try_int,
)

ENTITY_DIRS = ['data', 'historian', 'scheduler']
LOOT_DIR = 'meta/loot-options'

_FM_RE = re.compile(r'^---\r?\n(.+?)\r?\n---\r?\n?', re.S)
_WIKI_RE = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]')
_MERMAID_RE = re.compile(r'```mermaid\r?\n(.*?)```', re.S)
_SUBGRAPH_RE = re.compile(r'^\s*subgraph\s+([A-Za-z0-9_]+)\s*\["([^"]*)"\]')
_NODE_RE = re.compile(r'^\s*([A-Za-z][A-Za-z0-9_]*)\s*(?:\["|\{")(.*?)(?:"\]|"\})\s*$')
_EDGE_RE = re.compile(r'([A-Za-z][A-Za-z0-9_]*)\s*(-->|-\.->)\s*(?:\|"([^"]*)"\|\s*)?(?=([A-Za-z][A-Za-z0-9_]*))')
_CLASS_RE = re.compile(r'^\s*class\s+([A-Za-z0-9_,]+)\s+(\w+)')
_HEAD_RE = re.compile(r'^\[([x\-?])\]\s+([A-Za-z][A-Za-z0-9_]*)\s*$')
_SCENE_KEY_RE = re.compile(r'Scene\s+(\w+)', re.I)
MARKERS = {'x': 'committed', '-': 'draft', '?': 'open'}


def split_body(text: str) -> str:
    """The file body with its frontmatter block removed."""
    m = _FM_RE.match(text)
    return text[m.end():] if m else text


def split_headings(md: str, level: int) -> list:
    """Split markdown into [(title, body)] at headings of exactly `level`. Text before the
    first heading comes back with title ''. Headings inside code fences are ignored."""
    marker = '#' * level + ' '
    out, title, buf, fenced = [], '', [], False
    for line in md.splitlines():
        if line.lstrip().startswith('```'):
            fenced = not fenced
        if not fenced and line.startswith(marker):
            out.append((title, '\n'.join(buf).strip()))
            title, buf = line[len(marker):].strip(), []
        else:
            buf.append(line)
    out.append((title, '\n'.join(buf).strip()))
    return out


def parse_flow(text: str) -> tuple:
    """Return (nodes, edges, subgraphs) from the first mermaid block of a flow file.

    Nodes keep definition order -- that is the plan order the runner falls back on."""
    m = _MERMAID_RE.search(text)
    if not m:
        return [], [], []
    nodes, edges, subgraphs, kinds, stack = [], [], [], {}, []
    for line in m.group(1).splitlines():
        sm = _SUBGRAPH_RE.match(line)
        if sm:
            stack.append(sm.group(1))
            subgraphs.append({'id': sm.group(1), 'title': sm.group(2)})
            continue
        if line.strip() == 'end':
            if stack:
                stack.pop()
            continue
        cm = _CLASS_RE.match(line)
        if cm:
            for nid in cm.group(1).split(','):
                kinds[nid] = cm.group(2)
            continue
        if line.strip().startswith('classDef'):
            continue
        nm = _NODE_RE.match(line)
        if nm:
            parts = [p.strip() for p in nm.group(2).split('<br/>')]
            marker, lines = None, parts
            hm = _HEAD_RE.match(parts[0]) if parts else None
            if hm:
                marker, lines = MARKERS[hm.group(1)], parts[1:]
            nodes.append({
                'id': nm.group(1),
                'marker': marker,
                'scene': stack[-1] if stack else None,
                'title': lines[0] if lines else nm.group(1),
                'lines': lines[1:],
            })
            continue
        for em in _EDGE_RE.finditer(line):
            edges.append({'from': em.group(1), 'to': em.group(4),
                          'label': em.group(3) or '', 'dashed': em.group(2) == '-.->'})
    for n in nodes:
        n['kind'] = kinds.get(n['id'], 'social')
    return nodes, edges, subgraphs


def flow_notes(text: str, ids: set) -> dict:
    """Paragraphs of the flow file's prose (outside the mermaid block and the commitment
    ledger) that name a node id in backticks, keyed by id."""
    prose = _MERMAID_RE.sub('', text)
    prose = re.split(r'^## Commitment ledger', prose, flags=re.M)[0]
    notes = {}
    for para in re.split(r'\n\s*\n', split_body(prose)):
        for nid in set(re.findall(r'`([A-Za-z][A-Za-z0-9_]*)`', para)) & ids:
            notes.setdefault(nid, []).append(' '.join(para.split()))
    return notes


def pick_session(root: Path, want) -> Path:
    """The session folder to extract: by folder name or number, else the next planned one."""
    folders = [d for d in sorted((root / 'scheduler' / 'sessions').glob('*/')) if (d / '_flow.md').exists()]
    if not folders:
        sys.exit('No session folder with a _flow.md in scheduler/sessions/')
    if want:
        for d in folders:
            num = re.match(r'Session (\d+)', d.name)
            if d.name == want or (num and num.group(1) == str(want)):
                return d
        sys.exit(f'No session folder matches {want!r}')

    def key(d):
        fm = get_frontmatter(plan_file(d)) if plan_file(d) else {}
        planned = 0 if ci_eq(fm.get('state'), 'planned') else 1
        return (planned, fm.get('planned_date') or '9999')
    return sorted(folders, key=key)[0]


def plan_file(folder: Path):
    return next((f for f in folder.glob('*.md') if not f.name.startswith('_')), None)


def entity_index(root: Path) -> list:
    out = []
    for d in ENTITY_DIRS:
        for f in entity_md_files(root / d):
            fm = get_frontmatter(f)
            if not fm.get('name'):
                continue
            out.append({
                'name': fm['name'],
                'type': fm.get('type', ''),
                'subtype': fm.get('subtype', ''),
                'description': fm.get('description', ''),
                'campaign': fm.get('campaign', ''),
                'aliases': fm.get('_list_aliases', []),
                'path': f.relative_to(root).as_posix(),
            })
    # Confirmed loot options are items the plan hands out ([[The Shadowless Spear]]),
    # but they live in meta/ with `item:` instead of `name:`. Options still under
    # discussion stay out -- they are not part of any plan yet.
    for f in entity_md_files(root / LOOT_DIR):
        fm = get_frontmatter(f)
        if not fm.get('item') or fm.get('status') != 'confirmed':
            continue
        out.append({
            'name': fm['item'],
            'type': 'item',
            'subtype': fm.get('class', ''),
            'description': ' · '.join(filter(None, [fm.get('rarity', ''), fm.get('character', ''), fm.get('form', '')])),
            'campaign': '',
            'aliases': [],
            'path': f.relative_to(root).as_posix(),
        })
    return out


_FM_STRING_TMPL = r'^{key}:\s*"((?:[^"\\]|\\.)*)"\s*$'


def fm_string(raw: str, key: str) -> str:
    """A quoted frontmatter scalar, read whole. get_frontmatter's scalar regex stops at a
    '#' or an inner quote, which long prose fields (recap, cliffhanger) often contain."""
    block = _FM_RE.match(raw)
    if not block:
        return ''
    m = re.search(_FM_STRING_TMPL.format(key=re.escape(key)), block.group(1), re.M)
    if m:
        return m.group(1).replace('\\"', '"')
    return get_frontmatter_from_text(raw).get(key, '')


def previous_sessions(root: Path, number, campaign: str) -> list:
    """The played session just before `number`, plus -- when that one belongs to the other
    season -- the last session played in this session's own season. Seasons alternate, so
    "last time" and "last time in this world" can be different sessions."""
    played = []
    for f in entity_md_files(root / 'historian' / 'sessions'):
        raw = read_text_no_bom(f)
        fm = get_frontmatter_from_text(raw)
        n = try_int(fm.get('session_number'))
        if n is None or (number is not None and n >= number):
            continue
        played.append((n, f, raw, fm))
    played.sort(key=lambda x: x[0])
    picks = played[-1:]
    if picks and campaign and not ci_eq(picks[0][3].get('campaign'), campaign):
        same = [x for x in played if ci_eq(x[3].get('campaign'), campaign)]
        picks += same[-1:]
    return [{
        'name': fm.get('name', f.stem),
        'number': n,
        'date': fm.get('played_date', ''),
        'campaign': fm.get('campaign', ''),
        'description': fm_string(raw, 'description'),
        'recap': fm_string(raw, 'recap'),
        'cliffhanger': fm_string(raw, 'cliffhanger'),
        'path': f.relative_to(root).as_posix(),
    } for n, f, raw, fm in picks]


def established(folder: Path) -> list:
    """The `##` sections of the session folder's optional _established.md -- what the
    table can be told about the town, region and world. Text before the first heading is
    a note to the DM and is dropped."""
    f = folder / '_established.md'
    if not f.exists():
        return []
    return [{'title': t, 'md': md} for t, md in split_headings(split_body(read_text_no_bom(f)), 2) if t]


def party(root: Path) -> list:
    campaign_dir = root / 'scheduler' / 'campaign'
    files = sorted(campaign_dir.glob('*.md')) if campaign_dir.exists() else []
    active = next((f for f in files if ci_eq(get_frontmatter(f).get('state'), 'active')), None)
    tag = get_frontmatter(active).get('campaign', '') if active else ''
    rows = parse_party_table(active) if active else []
    out = []
    for f in sorted((root / 'historian' / 'characters' / 'pcs').glob('*.md')):
        fm = get_frontmatter(f)
        if fm.get('campaign') and tag and not ci_eq(fm['campaign'], tag):
            continue
        name = fm.get('name', f.stem)
        status = ''
        for cols in rows:
            if len(cols) >= 4 and name.lower() in re.sub(r'[\[\]"]', '', cols[1]).lower():
                status = cols[3]
        out.append({
            'name': name,
            'player': fm.get('player', ''),
            'raceClass': ' '.join(x for x in (fm.get('race', ''), fm.get('class', '')) if x),
            'level': fm.get('level', ''),
            'status': status,
            'path': f.relative_to(root).as_posix(),
        })
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--session')
    ap.add_argument('--root', default=str(ROOT))
    args = ap.parse_args()
    root = Path(args.root)

    folder = pick_session(root, args.session)
    plan = plan_file(folder)
    plan_text = read_text_no_bom(plan) if plan else ''
    fm = get_frontmatter_from_text(plan_text)
    flow_text = read_text_no_bom(folder / '_flow.md')

    nodes, edges, subgraphs = parse_flow(flow_text)
    notes = flow_notes(flow_text, {n['id'] for n in nodes})
    for n in nodes:
        n['notes'] = notes.get(n['id'], [])

    # Plan body: ## sections; ## Scenes splits again at ###; NPC quick-ref too.
    sections, scene_prose, quick_refs, preamble = [], {}, {}, ''
    for title, md in split_headings(split_body(plan_text), 2):
        if not title:
            preamble = md
        elif ci_eq(title, 'Scenes'):
            for st, smd in split_headings(md, 3):
                km = _SCENE_KEY_RE.match(st)
                if km:
                    scene_prose[km.group(1).lower()] = {'title': st, 'md': smd}
        elif title.lower().startswith('npc quick'):
            for nt, nmd in split_headings(md, 3):
                if nt:
                    wm = _WIKI_RE.search(nt)
                    quick_refs[wm.group(1) if wm else nt] = nmd
            sections.append({'title': title, 'md': md})
        else:
            sections.append({'title': title, 'md': md})

    scenes = []
    for sg in subgraphs:
        km = _SCENE_KEY_RE.search(sg['title'])
        key = km.group(1).lower() if km else ''
        prose = scene_prose.get(key, {})
        scenes.append({'id': sg['id'], 'key': key, 'title': sg['title'], 'md': prose.get('md', '')})

    # Pinned roster: every wikilink in the session frontmatter, then the act's relates_to.
    fm_block = (_FM_RE.match(plan_text) or [None, ''])[1] if plan_text else ''
    roster = _WIKI_RE.findall(fm_block)
    act_name = fm.get('act')
    if act_name:
        act_file = next((f for f in entity_md_files(root / 'scheduler' / 'acts')
                         if ci_eq(get_frontmatter(f).get('name'), act_name)), None)
        if act_file:
            roster += [w for w in _WIKI_RE.findall(str(get_frontmatter(act_file).get('_list_relates_to', [])))]
    seen, deduped = set(), []
    for r in roster:
        if r.lower() not in seen:
            seen.add(r.lower())
            deduped.append(r)

    out = {
        'session': {
            'name': fm.get('name', folder.name),
            'number': try_int(fm.get('session_number')),
            'date': fm.get('planned_date', ''),
            'description': fm.get('description', ''),
            'openingScene': fm.get('opening_scene', ''),
            'closingHook': fm.get('closing_hook', ''),
            'preamble': preamble,
            'folder': folder.relative_to(root).as_posix(),
            'campaign': fm.get('campaign', ''),
            'root': root.resolve().as_posix(),
            'looseThreads': fm.get('_list_loose_threads', []),
        },
        'previously': previous_sessions(root, try_int(fm.get('session_number')), fm.get('campaign', '')),
        'nodes': nodes,
        'edges': edges,
        'scenes': scenes,
        'sections': sections,
        'established': established(folder),
        'quickRefs': quick_refs,
        'roster': deduped,
        'party': party(root),
        'entities': entity_index(root),
    }
    print(json.dumps(out, ensure_ascii=False))


if __name__ == '__main__':
    main()
