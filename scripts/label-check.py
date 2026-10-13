#!/usr/bin/env python3
# label-check.py -- do a session's combatant labels agree everywhere they are written?
# consumers: maps/battlemaps/CLAUDE.md, .claude/commands/review.md, scripts/prep-status.py -- update these if usage, flags, or output format change.
# A combatant's party-facing label lives in four places: the plan's `Label (party-facing):`
# lines (the source), its Combatants "At a glance" list, the role column of tokens.txt, and the
# token lines of its battlemap layouts. The fourth, the Roll20 token itself, is set by hand from
# these. This compares the first three against the plan's Label lines and lists every mismatch.
#
# --stub writes what can be derived and leaves the creative picks alone:
#   tokens.txt   appends a tier-1 rule for each label with no role. The regex is a first guess
#                from the stat block (Bandit Captain -> Bandit_Captain); check it with
#                token-kit.py --count and swap in the art you want.
#   layouts      prints a token line per label missing from every layout, for pasting into the
#                right layout with a real grid ref, glyph and colour. Layouts are never edited.
#
# Output: one block per check; lines needing action start with "TODO", fine ones "ok",
# information "--". Ends with a count of TODO lines.
# Usage:
#   uv run scripts/label-check.py                  (newest draft or planned session)
#   uv run scripts/label-check.py --session 30
#   uv run scripts/label-check.py --session 30 --stub
import argparse
import importlib
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, read_text_no_bom, try_int, get_frontmatter  # noqa: E402
from lib.labels import (  # noqa: E402
    combatant_labels, glance_entries, layout_labels, manifest_rules, role_of,
)

prep = importlib.import_module('prep-status')

STUB_HEAD = ('# {name} -- token manifest for scripts/token-kit.py\n'
             '# <tier> <role> <max> <regex>  ; note\n'
             '# Tier 1: combatants. Tier 2: named NPCs and companions. Tier 3: walk-ons and set pieces.\n'
             '# Roles are the plan\'s Label (party-facing) lines, lowercased and hyphenated; real names '
             'live in the notes only.\n\n')


def compare(plan: str, manifest: str, layouts: dict) -> dict:
    """Every disagreement between the plan's Label lines and the other three places."""
    labels = combatant_labels(plan)
    low = {x.lower() for x in labels}
    roles = list(dict.fromkeys(role_of(x) for x in labels))
    glance = glance_entries(plan)
    glance_labels = [x for e in glance for x in e['labels']]
    rules = manifest_rules(manifest)
    have = {role for _, role in rules}
    in_layouts = {x.lower() for ls in layouts.values() for x in ls}
    return {
        'labels': labels,
        'roles': roles,
        'glance_missing': [x for x in labels if x.lower() not in {g.lower() for g in glance_labels}],
        'glance_extra': [x for x in glance_labels if x.lower() not in low],
        'rule_missing': [r for r in roles if r not in have],
        'rule_extra': [role for tier, role in rules if tier == 1 and role not in roles],
        'layout_unknown': [(name, x) for name, ls in layouts.items() for x in ls if x.lower() not in low],
        'layout_absent': [x for x in labels if x.lower() not in in_layouts],
        'glance': glance,
    }


def entry_for(label: str, glance: list) -> dict:
    return next((e for e in glance if label.lower() in (x.lower() for x in e['labels'])), {})


def stub_rule(role: str, labels: list, glance: list) -> str:
    """A tier-1 tokens.txt line for a role, regex guessed from the stat block."""
    entries = [entry_for(x, glance) for x in labels if role_of(x) == role]
    entries = [e for e in entries if e] or [{}]
    stat = entries[0].get('stat', '')
    rx = re.sub(r's$', '', stat).replace(' ', '_') if stat else role.replace('-', '_')
    names = ' and '.join(dict.fromkeys(e['name'] for e in entries if e.get('name')))
    where = entries[0].get('encounter', '')
    note = ', '.join(x for x in (names, stat) if x) + (f' ({where})' if where else '')
    return f'1  {role:<18} 4  {rx:<40} ; {note or "stub"} -- regex guessed, check with --count'


def main():
    ap = argparse.ArgumentParser(description='Check combatant labels across plan, tokens.txt and layouts.')
    ap.add_argument('--session', help='session number or folder name (default: newest draft/planned)')
    ap.add_argument('--stub', action='store_true', help='append missing tokens.txt rules; print layout lines')
    args = ap.parse_args()

    folder = prep.find_session(args.session)
    plan_path = prep.plan_file(folder) if folder else None
    if not plan_path:
        cwrite('No matching session plan in scheduler/sessions/.', 'red')
        sys.exit(1)
    plan = read_text_no_bom(plan_path)
    n = try_int(get_frontmatter(plan_path).get('session_number'))
    manifest_path = prep.ASSETS / f'session-{n}' / 'tokens.txt'
    manifest = read_text_no_bom(manifest_path) if manifest_path.exists() else ''
    layouts = {p.name: layout_labels(read_text_no_bom(p))
               for p in sorted((folder / 'maps').glob('*.txt'))} if (folder / 'maps').exists() else {}
    c = compare(plan, manifest, layouts)
    r = prep.Report()

    cwrite(f'=== LABEL CHECK: {folder.name} ===', 'cyan')
    if not c['labels']:
        cwrite('\nNo Label (party-facing) lines under ## Combatants.', 'gray')
        return

    r.head('PLAN')
    r.line('--', f'{len(c["labels"])} labels: ' + ', '.join(c['labels']))
    for x in c['glance_missing']:
        r.line('TODO', f'"{x}" has a Label line but is not in the At a glance list')
    for x in c['glance_extra']:
        r.line('TODO', f'At a glance names "{x}", which no Label line has')
    if not c['glance_missing'] and not c['glance_extra']:
        r.line('ok', 'At a glance agrees with the Label lines')

    r.head('TOKENS.TXT')
    if not manifest_path.exists():
        r.line('TODO', f'no tokens.txt yet ({manifest_path.relative_to(ROOT)}); --stub starts one')
    for role in c['rule_missing'] if manifest_path.exists() else []:
        r.line('TODO', f'no rule for role "{role}"')
    for role in c['rule_extra']:
        r.line('--', f'tier-1 role "{role}" matches no label (fine for mounts and set pieces; '
                     'otherwise a renamed label)')
    if manifest_path.exists() and not c['rule_missing']:
        r.line('ok', f'every label has a role ({len(c["roles"])} roles)')

    r.head('LAYOUTS')
    if not layouts:
        r.line('--', 'no layouts')
    for name, x in c['layout_unknown']:
        r.line('TODO', f'{name}: token "{x}" matches no label')
    for x in c['layout_absent']:
        r.line('--', f'"{x}" is on no layout')
    if layouts and not c['layout_unknown']:
        r.line('ok', 'every layout token uses a plan label')

    if args.stub:
        r.head('STUBS')
        if c['rule_missing']:
            lines = [stub_rule(role, c['labels'], c['glance']) for role in c['rule_missing']]
            manifest_path.parent.mkdir(parents=True, exist_ok=True)
            head = '' if manifest_path.exists() else STUB_HEAD.format(name=folder.name)
            sep = '' if not manifest or manifest.endswith('\n') else '\n'
            with open(manifest_path, 'a', encoding='utf-8') as f:
                f.write(head + sep + '\n'.join(lines) + '\n')
            r.line('--', f'appended {len(lines)} rules to {manifest_path.relative_to(ROOT)}:')
            for ln in lines:
                cwrite(f'       {ln}', 'gray')
            r.line('--', f'next: uv run scripts/token-kit.py --session {n} --count')
        if c['layout_absent'] and layouts:
            r.line('--', 'layout token lines to paste (set the ref, glyph and colour):')
            for x in c['layout_absent']:
                e = entry_for(x, c['glance'])
                tail = f' -- {e["name"]} ({e["stat"]})' if e.get('stat') else f' -- {e.get("name", "")}'
                cwrite(f'       <ref>  <glyph>  <colour>  {x}{tail}', 'gray')

    cwrite(f'\n{r.todo} to do.', 'yellow' if r.todo else 'green')


if __name__ == '__main__':
    main()
