#!/usr/bin/env python3
# snapshot.py -- TEMPORARY (schema migration, tasks/schema-migration/PLAN.md steps 2 and 4). Delete with the task.
# Runs every script that reads frontmatter through scripts/lib/common.py with fixed arguments and saves
# each output to <out_dir>/<name>.txt, so a parser change can be checked with a plain diff:
#   uv run tasks/schema-migration/scripts/snapshot.py <scratch>/before
#   (change the parser)
#   uv run tasks/schema-migration/scripts/snapshot.py <scratch>/after
#   diff -r <scratch>/before <scratch>/after
# timeline-gantt.py writes historian/timeline/*.md; those files are captured and then restored, so the
# repo is left as it was. Session-plan scripts run against a temporary copy of a played session
# (see SESSION_RUNS). transcribe.py is skipped (GPU, minutes per run).
# Usage: uv run tasks/schema-migration/scripts/snapshot.py <out_dir>

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]

RUNS = [
    ('contribution-balance', []),
    ('entity-graph-strahd', ['entity-graph.py', '--name', 'Strahd Von Zarovich']),
    ('entity-graph-jorn', ['entity-graph.py', '--name', 'Jorn']),
    ('free-entities', []),
    ('free-entities-deity', ['free-entities.py', '--type', 'deity']),
    ('handover-brief', []),
    ('inventory-brief', []),
    ('location-entities-barovia', ['location-entities.py', '--location', 'Barovia Village']),
    ('location-entities-ashford', ['location-entities.py', '--location', 'Ashford']),
    ('monster-lookup', ['monster-lookup.py', '--type', 'undead', '--cr-max', '3']),
    ('party-status', []),
    ('questions-brief', []),
    ('region-brief', []),
    ('region-world-context', ['region-world-context.py', '--col', '5', '--row', '5']),
    ('route-cities', ['route-cities.py', '--route', 'The Irongate Road']),
    ('session-brief', []),
    ('session-state', []),
    ('spitball-brief', []),
    ('spotlight-balance', []),
    ('threads-brief', []),
    ('todo-brief', []),
    ('timeline-data', ['timeline-data.py']),
    ('timeline-data-full', ['timeline-data.py', '--full']),
    ('timeline-gantt', []),
]
GANTT_FILES = ['world-history.md', 'party-history.md']  # timeline.md only carries today's date

# These read only scheduler/sessions/, which is empty between sessions, so a played session is
# copied there for this phase alone and removed after.
SESSION_SRC = 'Session 34 The Red Trail'
SESSION_RUNS = [
    ('label-check', ['label-check.py', '--session', '34']),
    ('narrate-brief', ['narrate-brief.py', '3', '--session', '34']),
    ('prep-status', ['prep-status.py', '--session', '34']),
    ('session-cards', ['session-cards.py', '--session', '34']),
]


def run(name: str, argv: list) -> str:
    argv = argv or [f'{name}.py']
    env = {**os.environ, 'PYTHONIOENCODING': 'utf-8', 'NO_COLOR': '1'}
    p = subprocess.run([sys.executable, str(ROOT / 'scripts' / argv[0]), *argv[1:]], cwd=ROOT,
                       capture_output=True, env=env)
    out = p.stdout.decode('utf-8', 'replace') + p.stderr.decode('utf-8', 'replace')
    return f'exit {p.returncode}\n{out}'


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit('Usage: snapshot.py <out_dir>')
    out_dir = Path(sys.argv[1])
    out_dir.mkdir(parents=True, exist_ok=True)

    timeline = ROOT / 'historian' / 'timeline'
    saved = {p: p.read_bytes() for p in timeline.glob('*.md')} if timeline.exists() else {}
    try:
        for name, argv in RUNS:
            text = run(name, argv)
            if name == 'timeline-gantt':
                for f in GANTT_FILES:
                    path = timeline / f
                    text += f'\n=== {f}\n' + (path.read_text(encoding='utf-8') if path.exists() else '(missing)')
            (out_dir / f'{name}.txt').write_text(text, encoding='utf-8')
            print(f'{name:<28} {text.splitlines()[0]}')
    finally:
        for p in timeline.glob('*.md') if timeline.exists() else []:
            if p not in saved:
                p.unlink()
        for p, data in saved.items():
            p.write_bytes(data)

    copy = ROOT / 'scheduler' / 'sessions' / SESSION_SRC
    if copy.exists():
        sys.exit(f'{copy} already exists; not overwriting it')
    shutil.copytree(ROOT / 'historian' / 'sessions' / SESSION_SRC, copy)
    try:
        for name, argv in SESSION_RUNS:
            text = run(name, argv)
            (out_dir / f'{name}.txt').write_text(text, encoding='utf-8')
            print(f'{name:<28} {text.splitlines()[0]}')
    finally:
        shutil.rmtree(copy)


if __name__ == '__main__':
    main()
