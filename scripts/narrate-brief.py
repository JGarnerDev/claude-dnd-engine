#!/usr/bin/env python3
"""narrate-brief.py -- everything /narrate needs to write one scene's ear script, in one call.
consumers: .claude/commands/narrate.md -- update it if usage, flags, or output format change.

Reads the session plan through session-cards.py (scenes, flow nodes, edges) and narration/cast.md,
and prints for one target (a scene key like `4`, or a beat id like `S35_09_CELL`):
  - the plan path and the line where the scene (or beat) starts, so the prose can be Read directly
  - the spine: the target's beats in story order (solid flow edges, then plan order), with markers
  - the forks: dashed or labelled flow edges, and every Choice / Private / Contingency line,
    with plan line numbers, so each gets an aside (meta/narration.md -> Forks)
  - the cast: each named speaker in the scene's `Cast:` header, its `voice:` core, and whether
    narration/cast.md already gives it a voice
  - a length estimate and the take name

Usage: uv run scripts/narrate-brief.py <scene key | beat id> [--session <n>]
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, entity_md_files, get_frontmatter, read_text_no_bom  # noqa: E402

CAST_FILE = ROOT / 'narration' / 'cast.md'
_CAST_ROW_RE = re.compile(r'^\s*-\s+\*\*(.+?)\*\*\s*[—-]+')
_WIKI_RE = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]')
_FORK_RE = re.compile(r'^\s*-\s+\*\*(Choice \([^)]*\)|Private \([^)]*\)|Contingenc\w*)[:*]')
_ROLL_RE = re.compile(r'\b(on a (?:fail|success|1\b|natural)|fails? by|succeeds?|beats? the DC|\d+\s*[–-]\s*\d+:)', re.I)
WORDS_PER_MIN = 150


def cards(session):
    cmd = ['uv', 'run', str(ROOT / 'scripts' / 'session-cards.py')]
    if session:
        cmd += ['--session', str(session)]
    env = {**os.environ, 'PYTHONIOENCODING': 'utf-8'}  # piped stdout is cp1252 on Windows
    out = subprocess.run(cmd, capture_output=True, cwd=ROOT, env=env)
    if out.returncode:
        sys.exit(out.stderr.decode('utf-8', 'replace'))
    return json.loads(out.stdout.decode('utf-8'))


def cast_names() -> set:
    if not CAST_FILE.exists():
        return set()
    return {m.group(1).strip().lower() for line in read_text_no_bom(CAST_FILE).splitlines()
            if (m := _CAST_ROW_RE.match(line))}


def voice_cores() -> dict:
    out = {}
    for f in entity_md_files(ROOT / 'historian'):
        fm = get_frontmatter(f)
        if fm.get('voice'):
            out[f.stem.lower()] = fm['voice']
    return out


def story_order(ids: list, edges: list) -> list:
    """Topological order over solid edges inside the target, ties broken by flow-file order."""
    inside = set(ids)
    solid = [(e['from'], e['to']) for e in edges
             if not e['dashed'] and e['from'] in inside and e['to'] in inside]
    indeg = {i: 0 for i in ids}
    for _, t in solid:
        indeg[t] += 1
    order, ready = [], [i for i in ids if indeg[i] == 0]
    while ready:
        n = ready.pop(0)
        order.append(n)
        for f, t in solid:
            if f == n:
                indeg[t] -= 1
                if indeg[t] == 0:
                    ready.append(t)
                    ready.sort(key=ids.index)
    return order + [i for i in ids if i not in order]  # cycles: append in file order


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('target', help='scene key (e.g. 4) or beat id (e.g. S35_09_CELL)')
    ap.add_argument('--session')
    a = ap.parse_args()

    d = cards(a.session)
    s = d['session']
    plan = ROOT / s['folder'] / f"{s['name']}.md"
    plan_lines = read_text_no_bom(plan).splitlines()
    nodes = {n['id']: n for n in d['nodes']}
    t = a.target.strip()

    scene = next((sc for sc in d['scenes'] if sc['key'].lower() == t.lower()), None)
    if scene:
        ids = [n['id'] for n in d['nodes'] if n['scene'] == scene['id']]
        heading = scene['title']
        take = f"session-{s['number']}.scene-{scene['key']}"
        md = scene['md']
    elif t.upper() in nodes:
        n = nodes[t.upper()]
        ids = [n['id']]
        scene = next((sc for sc in d['scenes'] if sc['id'] == n['scene']), None)
        heading = n['id']
        take = f"session-{s['number']}.{n['id'].lower()}"
        md = scene['md'] if scene else ''
    else:
        keys = ', '.join(sc['key'] for sc in d['scenes'])
        sys.exit(f'no scene or beat "{t}" in {s["name"]} (scenes: {keys})')

    # where the target starts and ends in the plan file
    # the scene title in the cards comes from the flow subgraph, so match the plan heading by key
    want = (rf'^### Scene {re.escape(scene["key"])}\b' if heading != ids[0]
            else rf'^#### {re.escape(heading)}\b')
    start = next((i for i, l in enumerate(plan_lines) if re.match(want, l)), None)
    if start is None:
        sys.exit(f'no heading for {heading} in {plan.name}; narrate its scene instead')
    level = 3 if heading != ids[0] else 4
    end = next((i for i in range(start + 1, len(plan_lines))
                if re.match(rf'^#{{1,{level}}} ', plan_lines[i])), len(plan_lines))

    print(f"SESSION  {s['name']}  ({s.get('campaign', '')})")
    print(f"PLAN     {plan.relative_to(ROOT).as_posix()}  lines {start + 1}-{end}")
    print(f"TARGET   {heading}")
    print(f"TAKE     narration/scripts/{take}.md -> narration/takes/{take}.mp3")

    print('\nSPINE (story order; markers from _flow.md)')
    order = story_order(ids, d['edges'])
    for i in order:
        n = nodes[i]
        hl = next((k + 1 for k in range(start, end) if plan_lines[k].startswith('#') and i in plan_lines[k]), None)
        where = f'line {hl}' if hl else 'no heading (flow node only)'
        print(f"  {n['marker']:<9} {i:<20} {n['title']}  [{where}]")

    print('\nFORKS (each non-spine outcome gets an aside)')
    forks = 0
    for e in d['edges']:
        if e['from'] in ids and (e['dashed'] or e['label']):
            kind = 'alt' if e['dashed'] else 'when'
            print(f"  flow {kind:<4} {e['from']} -> {e['to']}: {e['label'] or '(unlabelled)'}")
            forks += 1
    for k in range(start, end):
        line = plan_lines[k]
        if (m := _FORK_RE.match(line)):
            print(f"  line {k + 1:<5} {m.group(1)}: {line.split(':**', 1)[-1].strip()[:90]}")
            forks += 1
        elif _ROLL_RE.search(line) and line.lstrip().startswith(('-', '*')):
            print(f"  line {k + 1:<5} roll band: {line.strip()[:90]}")
            forks += 1
    if not forks:
        print('  none found')

    print('\nCAST (narration/cast.md)')
    have, cores = cast_names(), voice_cores()
    cast_line = next((l for l in md.splitlines() if l.startswith('- **Cast:**')), '')
    # the header wraps onto indented lines
    md_lines = md.splitlines()
    if cast_line:
        i = md_lines.index(cast_line) + 1
        while i < len(md_lines) and md_lines[i].startswith('  '):
            cast_line += ' ' + md_lines[i].strip()
            i += 1
    names = _WIKI_RE.findall(cast_line)
    for name in names:
        state = 'cast' if name.lower() in have else 'NOT CAST'
        core = cores.get(name.lower(), '(no voice: core)')
        print(f"  {state:<9} {name}: {core}")
    others = [x.strip() for x in _WIKI_RE.sub('', cast_line.replace('- **Cast:**', '')).split('·')]
    others = [x for x in others if x and not x.startswith('(')]
    if others:
        print(f"  unnamed   {', '.join(others)}  (narrator voices them, or cast if they speak much)")
    if not names and not others:
        print('  no Cast: header')

    words = sum(len(plan_lines[k].split()) for k in range(start, end))
    print(f"\nLENGTH   plan text ~{words} words; a take runs ~{max(1, words // 2 // WORDS_PER_MIN)}"
          f"-{max(2, words // WORDS_PER_MIN)} min once rewritten for the ear")


if __name__ == '__main__':
    main()
