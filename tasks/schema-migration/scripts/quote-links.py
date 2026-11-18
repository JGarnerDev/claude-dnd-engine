#!/usr/bin/env python3
# /// script
# requires-python = ">=3.14"
# dependencies = ["pyyaml"]
# ///
# quote-links.py -- TEMPORARY (schema migration, tasks/schema-migration/PLAN.md step 3). Delete with the task.
# Wraps unquoted [[links]] in entity frontmatter in double quotes, so the frontmatter is valid YAML:
#   location: [[Duskwater]]          ->  location: "[[Duskwater]]"
#   - [[Harrow Bane]] (his captain)  ->  - "[[Harrow Bane]] (his captain)"
# Only frontmatter lines whose value starts with an unquoted link change; the body, line endings and
# any BOM are left as they are. Same entity scope as audit.py. A file whose frontmatter would still not
# parse as YAML after quoting is reported and left alone.
# Usage: uv run tasks/schema-migration/scripts/quote-links.py <folder> [<folder> ...] [--apply] [--quiet]
#   (default)   dry run: print each change as -/+ lines, then a summary
#   --apply     write the changes
#   --quiet     summary only

import argparse
import importlib.util
import sys
from pathlib import Path

# audit.py holds the quoting rule, so both scripts agree on what changes.
_spec = importlib.util.spec_from_file_location('audit', Path(__file__).with_name('audit.py'))
audit = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(audit)

ROOT = audit.ROOT


def main() -> None:
    ap = argparse.ArgumentParser(description='Quote unquoted [[links]] in entity frontmatter.')
    ap.add_argument('folders', nargs='+', help='folders under data/, historian/ or scheduler/')
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--quiet', action='store_true')
    args = ap.parse_args()

    files = []
    for folder in args.folders:
        base = (ROOT / folder).resolve()
        if not base.is_dir() or base.relative_to(ROOT).parts[0] not in audit.ENTITY_DIRS:
            sys.exit(f'{folder}: not a folder under {", ".join(audit.ENTITY_DIRS)}')
        files += sorted(p for p in base.rglob('*.md') if audit.is_entity(p))

    changed_files = changed_lines = 0
    skipped = []
    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        raw = path.read_bytes().decode('utf-8')
        bom = '﻿' if raw.startswith('﻿') else ''
        text = raw[len(bom):]
        m = audit.FM_BLOCK_RE.match(text)
        if not m:
            continue
        block = m.group(1)
        quoted, n = audit.quote_links(block)
        if not n:
            continue
        data, err = audit.try_yaml(quoted)
        if data is None:
            skipped.append((rel, err))
            continue
        changed_files += 1
        changed_lines += n
        if not args.quiet:
            print(f'== {rel}')
            for old, new in zip(block.split('\n'), quoted.split('\n')):
                if old != new:
                    print(f'  - {old.rstrip()}')
                    print(f'  + {new.rstrip()}')
        if args.apply:
            new_text = text[:m.start(1)] + quoted + text[m.end(1):]
            path.write_bytes((bom + new_text).encode('utf-8'))

    verb = 'Quoted' if args.apply else 'Would quote'
    print(f'\n{verb} {changed_lines} links in {changed_files} files ({len(files)} entity files scanned).')
    if skipped:
        print(f'Left alone, frontmatter still invalid after quoting ({len(skipped)}):')
        for rel, err in skipped:
            print(f'  {rel}: {err}')


if __name__ == '__main__':
    main()
