#!/usr/bin/env python3
# session-start.py -- start-of-conversation orientation, run by the SessionStart hook
# consumers: CLAUDE.md, .claude/settings.json, meta/dm-rotation.md -- update these if usage, flags, or output format change.
# Usage: uv run scripts/session-start.py
#
# Replaces the hand-run start-of-session ritual (read VERSION + CHANGELOG, run
# version-check, read the index stamp, git log, look in recaps/). The hook injects
# stdout into Claude's context, so output stays short: a handful of lines, flags only
# when something needs attention. Never fails the session -- any error prints one line.

import importlib
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, get_active_campaign, index_staleness, pending_recordings, read_text_no_bom

version_check = importlib.import_module('version-check')

ENTRY_RE = re.compile(r'^## \[([^\]]+)\]\s*[—-]\s*(\S+)', re.M)
HIGHLIGHT_RE = re.compile(r'^- \*\*(.+?)\*\*', re.M)
ENTRIES = 2          # changelog entries summarized
PER_ENTRY = 4        # highlights per entry


def changelog_highlights() -> list:
    path = ROOT / 'CHANGELOG.md'
    if not path.exists():
        return []
    text = read_text_no_bom(path).replace('\r\n', '\n')
    heads = list(ENTRY_RE.finditer(text))
    out = []
    for i, h in enumerate(heads[:ENTRIES]):
        end = heads[i + 1].start() if i + 1 < len(heads) else len(text)
        items = HIGHLIGHT_RE.findall(text[h.end():end])
        more = f" (+{len(items) - PER_ENTRY} more)" if len(items) > PER_ENTRY else ''
        out.append(f"  {h.group(1)} ({h.group(2)}): " + '; '.join(
            x.rstrip('.') for x in items[:PER_ENTRY]) + more)
    return out


def main() -> None:
    print("[engine orientation -- from scripts/session-start.py]")

    status = version_check.engine_status()
    if status is None:
        print("Engine version: VERSION missing (see meta/versioning.md)")
    else:
        version, bump_sha, _, changed = status
        print(f"Engine v{version}. Recent changelog:")
        for line in changelog_highlights():
            print(line)
        if bump_sha and changed:
            print(f"! {len(changed)} engine commit(s) since the last version bump -- "
                  "decide whether they clear the bump bar (uv run scripts/version-check.py)")

    camp = get_active_campaign(ROOT)
    if camp:
        print(f"DM: {camp['dm'] or '(no dm: field)'} ({camp['name']})")

    idx = index_staleness(ROOT)
    if idx is None:
        print("! Search index never built -- prompt the user to run: uv run scripts/index-entities.py")
    elif idx[2]:
        print(f"! Search index stale since {idx[1][:7]} ({len(idx[2])} commit(s)) -- "
              "prompt the user to run: uv run scripts/index-entities.py")

    inbox_dir = ROOT / 'recaps' / 'inbox'
    if inbox_dir.exists():
        for f in sorted(inbox_dir.glob('*.md')):
            print(f"! Session notes waiting: recaps/inbox/{f.name} -- offer /recap")
    for slug, _ in pending_recordings(ROOT):
        print(f"! Untranscribed recording: {slug} -- offer /transcript {slug} --transcribe "
              "(never start it unprompted)")


if __name__ == '__main__':
    try:
        main()
    except Exception as e:  # orientation is advisory; never block a session start
        print(f"[session-start.py failed: {e}] -- run the checks in CLAUDE.md -> Session Start by hand")
