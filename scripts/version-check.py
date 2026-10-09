#!/usr/bin/env python3
# version-check.py -- flag engine changes since the last version bump
# consumers: CLAUDE.md, meta/versioning.md, scripts/session-start.py -- update these if usage, flags, or output format change.
# Usage: uv run scripts/version-check.py
#
# Reads root VERSION, finds the last commit that touched it (the bump commit),
# then lists engine-path commits since. Non-blocking advisory, same spirit as
# the semantic-index staleness check. Bump rules live in meta/versioning.md.

import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite

# Engine paths the version is meant to track. Routine content (data/historian/
# scheduler) is below the bump bar and deliberately excluded.
ENGINE_PATHS = [
    '.claude/commands',
    'scripts',
    'meta',
    'app',
    'CLAUDE.md',
    'README.md',
]


def git(*args) -> str:
    """Run a git command in the repo root; '' on any failure."""
    try:
        out = subprocess.run(
            ['git', *args], cwd=str(ROOT), capture_output=True, text=True, check=False
        )
        return out.stdout.strip() if out.returncode == 0 else ''
    except OSError:
        return ''


def engine_status():
    """(version, bump_sha, bump_date, changed_lines), or None if VERSION is missing.

    bump_sha is '' when VERSION has never been committed. Shared with session-start.py.
    """
    version_file = ROOT / 'VERSION'
    if not version_file.exists():
        return None
    version = version_file.read_text(encoding='utf-8-sig').strip()

    # Last commit that touched VERSION = the last bump.
    bump_sha = git('log', '-1', '--format=%H', '--', 'VERSION')
    if not bump_sha:
        return version, '', '', []
    bump_date = git('log', '-1', '--format=%ci', bump_sha) or 'unknown'

    # Engine commits since the bump.
    changes = git('log', '--oneline', f'{bump_sha}..HEAD', '--', *ENGINE_PATHS)
    lines = [ln for ln in changes.split('\n') if ln.strip()] if changes else []
    return version, bump_sha, bump_date, lines


def main() -> None:
    status = engine_status()
    if status is None:
        cwrite("VERSION file missing -- versioning not initialized. See meta/versioning.md.", 'yellow')
        return
    version, bump_sha, bump_date, lines = status
    cwrite(f"\nEngine version: {version}", 'cyan')
    if not bump_sha:
        cwrite("  VERSION not yet committed -- commit the bump so staleness can be tracked.", 'yellow')
        return
    cwrite(f"  Last bump: {bump_sha[:7]} ({bump_date})", 'darkgray')

    if lines:
        cwrite(
            f"\n  Engine changed in {len(lines)} commit(s) since last bump "
            "-- decide whether this clears the bump bar:",
            'yellow',
        )
        for line in lines:
            cwrite(f"    {line}", 'gray')
        cwrite("\n  If yes: edit VERSION + prepend CHANGELOG.md (see meta/versioning.md).", 'darkgray')
    else:
        cwrite("  No engine changes since last bump -- version is current.", 'green')
    cwrite()


if __name__ == '__main__':
    main()
