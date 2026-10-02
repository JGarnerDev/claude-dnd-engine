#!/usr/bin/env python3
# flow-status.py -- commitment coverage for flow graph sets (see meta/flow-graphs.md)
# consumers: CLAUDE.md, .claude/commands/flow.md -- update these if usage, flags, or output format change.
# Scans flow graph folders for mermaid nodes carrying a [x]/[-]/[?] marker, reports coverage per
# file, and flags integrity problems: a printed id that does not match its mermaid node id, and a
# committed node sitting downstream of one that is not committed.
# Usage: python scripts/flow-status.py [--set <path>] [--blockers] [--quiet]
#   --set <path> : scan one flow graph folder instead of discovering every set in the repo
#   --blockers   : list every committed-after-open edge, not just the count
#   --quiet      : totals only, no per-file breakdown

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, color, read_text_no_bom

# A flow graph set is a folder whose README names the conventions doc.
SET_MARKER = 'meta/flow-graphs.md'

MARKERS = {'x': 'committed', '-': 'draft', '?': 'open'}
MARKER_COLOR = {'committed': 'green', 'draft': 'yellow', 'open': 'gray'}

# Node definition: ID followed by [" or {" and a label whose first line should be "[m] ID".
_NODE_RE = re.compile(
    r'^\s*([A-Za-z][A-Za-z0-9_]*)\s*(?:\[\"|\{\"|\(\[\")(.*?)(?:<br/>|\"])',
    re.M,
)
_LABEL_HEAD_RE = re.compile(r'^\[([x\-?])\]\s+([A-Za-z][A-Za-z0-9_]*)\s*$')

# Edges: A --> B, A -.-> B, with optional |"label"| between. Chains are split on the fly.
_EDGE_RE = re.compile(
    r'([A-Za-z][A-Za-z0-9_]*)\s*(?:-->|-\.->|---|==>)\s*(?:\|[^|]*\|\s*)?([A-Za-z][A-Za-z0-9_]*)'
)

_FENCE_RE = re.compile(r'```mermaid\r?\n(.*?)```', re.S)


def mermaid_blocks(text):
    """Yield the body of every ```mermaid fence in a file."""
    for m in _FENCE_RE.finditer(text):
        yield m.group(1)


def scan_file(path):
    """Return (nodes, edges, problems) for one graph file.

    nodes maps node id -> marker name. problems is a list of strings.
    """
    nodes, edges, problems = {}, [], []
    text = read_text_no_bom(path)

    for block in mermaid_blocks(text):
        # Strip classDef/class lines so their ids are never read as node definitions.
        body = '\n'.join(
            ln for ln in block.splitlines()
            if not ln.strip().startswith(('classDef ', 'class ', 'subgraph ', 'direction '))
        )

        for node_id, label in _NODE_RE.findall(body):
            head = label.split('<br/>')[0].strip()
            m = _LABEL_HEAD_RE.match(head)
            if not m:
                problems.append(f"{node_id}: label starts with '{head}', expected '[marker] {node_id}'")
                nodes[node_id] = 'draft'
                continue
            marker, printed = m.groups()
            if printed != node_id:
                problems.append(f"{node_id}: label prints id '{printed}'")
            nodes[node_id] = MARKERS[marker]

        for a, b in _EDGE_RE.findall(body):
            edges.append((a, b))

    return nodes, edges, problems


def find_sets(root, explicit):
    """Locate flow graph folders. A set is a dir with a README naming the conventions doc."""
    if explicit:
        p = Path(explicit)
        if not p.is_absolute():
            p = root / p
        return [p] if p.is_dir() else []

    found = []
    for readme in root.rglob('README.md'):
        parts = readme.parts
        if '.git' in parts or 'node_modules' in parts or 'vector-index' in parts:
            continue
        try:
            if SET_MARKER in read_text_no_bom(readme):
                found.append(readme.parent)
        except (OSError, UnicodeDecodeError):
            continue
    return sorted(found)


def main():
    ap = argparse.ArgumentParser(description='Commitment coverage for flow graph sets.')
    ap.add_argument('--set', dest='set_path', help='scan one flow graph folder')
    ap.add_argument('--blockers', action='store_true', help='list every committed-after-open edge')
    ap.add_argument('--quiet', action='store_true', help='totals only')
    args = ap.parse_args()

    sets = find_sets(ROOT, args.set_path)
    if not sets:
        cwrite('No flow graph sets found.', 'yellow')
        cwrite('A set is a folder whose README.md references meta/flow-graphs.md.', 'gray')
        cwrite('Run /flow to build one.', 'gray')
        return 0

    for set_dir in sets:
        rel = set_dir.relative_to(ROOT).as_posix()
        cwrite(f'\n=== {rel} ===', 'cyan')

        all_nodes, all_edges, all_problems = {}, [], []
        definitions = 0
        graph_files = 0
        for f in sorted(set_dir.glob('*.md')):
            nodes, edges, problems = scan_file(f)
            if not nodes:
                continue
            graph_files += 1
            definitions += len(nodes)
            all_nodes.update(nodes)
            all_edges.extend(edges)
            all_problems.extend(f'{f.name}: {p}' for p in problems)

            if not args.quiet:
                counts = {k: 0 for k in MARKER_COLOR}
                for state in nodes.values():
                    counts[state] += 1
                total = len(nodes)
                pct = (counts['committed'] * 100) // total if total else 0
                bar = ' · '.join(
                    color(f"{counts[s]} {s}", MARKER_COLOR[s]) for s in ('committed', 'draft', 'open')
                )
                cwrite(f'  {f.name}')
                cwrite(f'    {total} nodes — {bar}   ({pct}% committed)')

        if not all_nodes:
            cwrite('  no marked nodes found', 'yellow')
            continue

        # Blockers: a committed node whose upstream is not committed.
        blockers = [
            (a, b) for a, b in all_edges
            if all_nodes.get(b) == 'committed' and all_nodes.get(a, 'draft') != 'committed'
        ]

        totals = {k: 0 for k in MARKER_COLOR}
        for state in all_nodes.values():
            totals[state] += 1
        total = len(all_nodes)
        pct = (totals['committed'] * 100) // total if total else 0

        shared = definitions - total
        shared_note = f'  ({shared} drawn at two zoom levels)' if shared else ''
        cwrite(f'\n  TOTAL  {total} unique beats across {graph_files} graphs{shared_note}')
        cwrite('  ' + ' · '.join(
            color(f"{totals[s]} {s}", MARKER_COLOR[s]) for s in ('committed', 'draft', 'open')
        ) + f'   ({pct}% committed)')

        if blockers:
            cwrite(f'\n  {len(blockers)} committed node(s) sit downstream of uncommitted work:', 'red')
            shown = blockers if args.blockers else blockers[:5]
            for a, b in shown:
                cwrite(f'    {b} [committed] <- {a} [{all_nodes.get(a, "missing")}]', 'red')
            if not args.blockers and len(blockers) > len(shown):
                cwrite(f'    ... and {len(blockers) - len(shown)} more (--blockers to list)', 'gray')

        if all_problems:
            cwrite(f'\n  {len(all_problems)} id/label mismatch(es):', 'red')
            for p in all_problems[:10]:
                cwrite(f'    {p}', 'red')
            if len(all_problems) > 10:
                cwrite(f'    ... and {len(all_problems) - 10} more', 'gray')

        if not blockers and not all_problems:
            cwrite('\n  integrity OK', 'green')

    return 0


if __name__ == '__main__':
    sys.exit(main())
