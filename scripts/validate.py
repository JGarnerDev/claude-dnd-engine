#!/usr/bin/env python3
# validate.py -- integrity checks for the campaign entity graph, built on notes-kit.
# consumers: CLAUDE.md, tests/CLAUDE.md, scripts/todo-brief.py (count_errors), .claude/commands/handover.md, .claude/commands/recap.md, tests/commands/recap/spec.md -- update these if usage, flags, or output format change.
# Catches problems that accumulate silently across 1000+ files:
#   ERRORS   - dangling [[wiki-links]]; missing mandatory frontmatter (name/type/exists);
#              exists:false in historian/ (canon must be real); two entities sharing a filename;
#              frontmatter that isn't valid YAML.
#   WARNINGS - core reference-catalog type marked exists:false (should be true);
#              historian files missing provenance (source_session/confirmed_date);
#              name != filename; frontmatter [[links]] not echoed in body (Foam graph gap).
# Scope, skips and link targets are configured under [tool.notes-kit] in pyproject.toml.
#
# Usage: uv run scripts/validate.py [--scope all|links|frontmatter] [--quiet]
#   --scope     which checks to run (default all)
#   --quiet     show ERRORS only, suppress WARNINGS
# Exit code: 0 = no errors, 1 = errors found (CI-friendly).

import argparse
import sys
from pathlib import Path

from notes_kit import Config, Problem, validate
from notes_kit.validate import WIKILINK, link_target

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite

# Reference-catalog types are campaign-agnostic stat libraries; their schemas omit `exists`.
REF_TYPES = {'monster', 'spell', 'deity', 'feat', 'race', 'class', 'background', 'skill'}

# Spotlight ledger fields (meta/character-focus.md) are intentionally plain-string, NOT wikilinks:
#   spotlight_hooks (list of {hook,status}), spotlight (normal|low) on PCs;
#   beats ("classification: weight") and pcs_present (PC names) on sessions.
# PC names inside `beats:` are ledger tokens, not graph edges -- keep them bracket-free so they
# don't register as dangling [[links]] here. Do not convert them to [[wiki-links]].

# notes-kit check names, plus the engine's own, split by --scope.
LINK_CHECKS = {'wikilinks', 'echo'}


def blank(value) -> bool:
    return value is None or not str(value).strip()


def links(text: str) -> list:
    return [t for t in (link_target(raw) for raw in WIKILINK.findall(text)) if t]


def engine_checks(notes: dict) -> list:
    """The engine's rules on top of notes-kit: mandatory fields, `exists`, provenance, echoed links."""
    problems = []
    for note in notes.values():
        rel, fm = note.rel, note.meta
        top = rel.split('/')[0]

        def add(text, check, severity='error'):
            problems.append(Problem(f'{rel}: {text}', check, severity))

        for req in ('name', 'type', 'exists'):
            if blank(fm.get(req)):
                add(f"missing mandatory field '{req}'", 'mandatory')
        # `exists` = real/canon in the world, not folder location. Historian is always canon;
        # core rulebook material in data/ should be real too (see meta/schemas/entity.md).
        if str(fm.get('exists')).lower() == 'false':
            if top == 'historian':
                add('exists:false in historian/ (canon must be true)', 'exists')
            if top == 'data' and fm.get('type') in REF_TYPES:
                add(f"reference-catalog type '{fm['type']}' is exists:false (core material should be true)",
                    'exists', 'warning')
        # Session files ARE the source of canon, so they carry no source_session/confirmed_date.
        if top == 'historian' and '/sessions/' not in rel:
            for req in ('source_session', 'confirmed_date'):
                if blank(fm.get(req)):
                    add(f"historian file missing '{req}'", 'provenance', 'warning')
        name = fm.get('name')
        if not blank(name) and str(name).strip().lower() != note.stem.lower():
            add(f"name '{name}' != filename '{note.stem}'", 'name', 'warning')
        # Frontmatter links must also appear in the body (Foam reads body links only).
        body = {b.lower() for b in links(note.body)}
        for fl in dict.fromkeys(links(note.head)):
            if fl.lower() not in body:
                add(f'frontmatter link [[{fl}]] not echoed in body', 'echo', 'warning')
    return problems


def collect() -> tuple:
    """(notes, problems) for the whole entity graph: notes-kit's checks plus the engine's."""
    notes, problems = validate(Config.load(ROOT))
    return notes, problems + engine_checks(notes)


def count_errors() -> int:
    """Number of errors, for todo-brief.py's graph-health line."""
    return sum(p.is_error for p in collect()[1])


def main():
    ap = argparse.ArgumentParser(description='Integrity checks for the campaign entity graph.')
    ap.add_argument('--scope', choices=['all', 'links', 'frontmatter'], default='all')
    ap.add_argument('--quiet', action='store_true', help='show errors only')
    args = ap.parse_args()

    notes, problems = collect()
    if args.scope != 'all':
        problems = [p for p in problems if (p.check in LINK_CHECKS) == (args.scope == 'links')]

    errors = sorted(p for p in problems if p.is_error)
    warnings = sorted(p for p in problems if not p.is_error)
    if errors:
        cwrite(f'\n=== ERRORS ({len(errors)}) ===', 'red')
        for p in errors:
            cwrite(f'  {p}', 'red')
    if not args.quiet and warnings:
        cwrite(f'\n=== WARNINGS ({len(warnings)}) ===', 'yellow')
        for p in warnings:
            cwrite(f'  {p}', 'yellow')

    tail = '' if args.quiet else f'  Warnings: {len(warnings)}'
    cwrite(f'\nChecked {len(notes)} entity files. Errors: {len(errors)}{tail}', 'cyan')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
