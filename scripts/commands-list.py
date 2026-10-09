#!/usr/bin/env python3
# commands-list.py -- list every slash command from .claude/commands/*.md frontmatter
# consumers: .claude/commands/commands.md -- update these if usage, flags, or output format change.
# Usage: python scripts/commands-list.py
#
# Built from the files themselves so the list cannot drift from what exists. A command
# without a `description:` is printed with a MISSING flag rather than skipped.

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, read_text_no_bom

# lib.common's frontmatter parser only takes \w keys; `argument-hint` has a hyphen.
_FIELD_RE = re.compile(r'^(description|argument-hint):\s*"?(.*?)"?\s*$', re.MULTILINE)


def command_fields(path) -> dict:
    raw = read_text_no_bom(path).replace('\r\n', '\n')
    if not raw.startswith('---\n'):
        return {}
    block = raw[4:raw.find('\n---', 4)]
    return dict(_FIELD_RE.findall(block))


def main() -> None:
    files = sorted((ROOT / '.claude' / 'commands').glob('*.md'), key=lambda f: f.stem)
    for f in files:
        fm = command_fields(f)
        desc = fm.get('description') or 'MISSING description frontmatter'
        usage = f"/{f.stem} {fm.get('argument-hint', '')}".rstrip()
        cwrite(f"- `{usage}` -- {desc}")


if __name__ == '__main__':
    main()
