#!/usr/bin/env python3
# /// script
# requires-python = ">=3.14"
# dependencies = ["pyyaml"]
# ///
# audit.py -- TEMPORARY (schema migration, tasks/schema-migration/PLAN.md step 1). Delete with the task.
# Read-only survey of entity frontmatter: which files parse as strict YAML, which would parse once
# their [[links]] are quoted, unquoted link counts, and per type the fields used and their values.
# Entity scope matches validate.ps1: data/, historian/, scheduler/, minus CLAUDE.md, templates,
# pool docs and _-prefixed files.
# Usage: uv run tasks/schema-migration/scripts/audit.py [--type <type>] [--files] [--max-values <n>]
#   (no flags)    summary plus a field table per type
#   --type        only that type's field table, with every distinct value
#   --files       list the files that fail strict YAML, with the parser error

import argparse
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

import yaml

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parents[3]
ENTITY_DIRS = ('data', 'historian', 'scheduler')

FM_BLOCK_RE = re.compile(r'^---\r?\n(.*?)\r?\n---(?:\r?\n|$)', re.DOTALL)
# A frontmatter line whose value (after `key:` or a list `-`) starts with an unquoted [[link]].
UNQUOTED_LINK_RE = re.compile(r'^(\s*(?:-\s+|[A-Za-z_][\w-]*:\s+))(\[\[.*)$')
TYPE_LINE_RE = re.compile(r'^type:\s*["\']?([\w-]+)', re.MULTILINE)


def is_entity(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    name = path.name
    return (rel.parts[0] in ENTITY_DIRS and name != 'CLAUDE.md' and 'template' not in name
            and 'pool' not in name and not name.startswith('_'))


def read_text(path: Path) -> str:
    raw = path.read_text(encoding='utf-8')
    return raw[1:] if raw.startswith('﻿') else raw


def quote_link_value(value: str) -> str:
    """`[[X]] (note)  # comment` -> `"[[X]] (note)"  # comment`. Shared with quote-links.py."""
    comment = ''
    m = re.match(r'^(.*\]\][^#]*?)(\s+#.*)$', value)
    if m:
        value, comment = m.group(1), m.group(2)
    value = value.rstrip()
    return '"' + value.replace('\\', '\\\\').replace('"', '\\"') + '"' + comment


def quote_links(block: str) -> tuple[str, int]:
    """Quote every unquoted [[link]] value in a frontmatter block. Returns (block, lines changed)."""
    out, n = [], 0
    for line in block.split('\n'):
        cr = '\r' if line.endswith('\r') else ''
        m = UNQUOTED_LINK_RE.match(line.rstrip('\r'))
        if m:
            line = m.group(1) + quote_link_value(m.group(2)) + cr
            n += 1
        out.append(line)
    return '\n'.join(out), n


def try_yaml(block: str):
    try:
        data = yaml.safe_load(block)
    except yaml.YAMLError as e:
        first = str(e).strip().splitlines()
        mark = getattr(e, 'problem_mark', None)
        where = f'line {mark.line + 1}: ' if mark else ''
        return None, where + (first[0] if first else 'parse error')
    if data is not None and not isinstance(data, dict):
        return None, f'frontmatter is a {type(data).__name__}, not a mapping'
    return data or {}, None


def short(value) -> str:
    s = value if isinstance(value, str) else repr(value)
    return s if len(s) <= 40 else s[:37] + '...'


def main() -> None:
    ap = argparse.ArgumentParser(description='Survey entity frontmatter for the schema migration.')
    ap.add_argument('--type', default='')
    ap.add_argument('--files', action='store_true')
    ap.add_argument('--max-values', type=int, default=12,
                    help='list a field\'s values when it has at most this many distinct ones')
    args = ap.parse_args()

    files = sorted(p for d in ENTITY_DIRS for p in (ROOT / d).rglob('*.md') if is_entity(p))

    no_fm, strict_ok, fixed_by_quoting, still_broken = [], [], [], []
    unquoted_lines, unquoted_files = 0, 0
    by_type = defaultdict(list)  # type -> [parsed frontmatter dict]
    type_counts = Counter()

    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        m = FM_BLOCK_RE.match(read_text(path))
        if not m:
            no_fm.append(rel)
            continue
        block = m.group(1)
        quoted, n = quote_links(block)
        if n:
            unquoted_lines += n
            unquoted_files += 1

        data, err = try_yaml(block)
        if data is not None:
            strict_ok.append(rel)
        else:
            data, err2 = try_yaml(quoted)
            if data is not None:
                fixed_by_quoting.append(rel)
            else:
                still_broken.append((rel, err2))

        if data is not None:
            t = str(data.get('type') or '(none)')
        else:
            tm = TYPE_LINE_RE.search(block)
            t = tm.group(1) if tm else '(none)'
        type_counts[t] += 1
        if data is not None:
            by_type[t].append(data)

    print(f'Entity files: {len(files)}  (data/, historian/, scheduler/)')
    print(f'  no frontmatter:              {len(no_fm)}')
    print(f'  strict YAML ok today:        {len(strict_ok)}')
    print(f'  ok once links are quoted:    {len(fixed_by_quoting)}   (step 3 fixes these)')
    print(f'  still broken after quoting:  {len(still_broken)}   (step 4, by hand)')
    print(f'Unquoted frontmatter links: {unquoted_lines} lines in {unquoted_files} files')
    print()

    if args.files:
        print('Files with no frontmatter:')
        for rel in no_fm:
            print(f'  {rel}')
        print()
        print('Files still broken after quoting (path: error):')
        for rel, err in still_broken:
            print(f'  {rel}: {err}')
        print()
        return

    if not args.type:
        print('Types (files; parsed after quoting):')
        for t, c in type_counts.most_common():
            print(f'  {t:<16} {c:>4}   {len(by_type[t]):>4}')
        print()

    types = [args.type] if args.type else [t for t, _ in type_counts.most_common()]
    for t in types:
        docs = by_type.get(t, [])
        if not docs:
            if args.type:
                print(f'No parsed files of type "{t}".')
            continue
        print(f'== {t}  ({len(docs)} parsed files)')
        fields = Counter(k for d in docs for k in d)
        for key, count in fields.most_common():
            values = Counter()
            kinds = Counter()
            for d in docs:
                if key not in d:
                    continue
                v = d[key]
                kinds[type(v).__name__] += 1
                if isinstance(v, (str, int, float, bool)) or v is None:
                    values[short(v)] += 1
            kind = '/'.join(k for k, _ in kinds.most_common())
            line = f'  {key:<22} {count:>4}/{len(docs):<4} {kind}'
            limit = None if args.type else args.max_values
            if values and (limit is None or len(values) <= limit):
                line += '  = ' + ', '.join(f'{v} ({c})' for v, c in values.most_common())
            elif values:
                line += f'  ({len(values)} distinct values)'
            print(line)
        print()


if __name__ == '__main__':
    main()
