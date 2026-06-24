#!/usr/bin/env python3
# entity-graph.py -- show 1-hop relation graph for a named entity
# consumers: CLAUDE.md -- update these if usage, flags, or output format change.
# Usage: python scripts/entity-graph.py --name "Strahd Von Zarovich"
# Searches both ./data and ./historian

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, get_frontmatter

WIKI_RE = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]')
FM_BLOCK_RE = re.compile(r'^---\r?\n(.+?)\r?\n---', re.DOTALL)
AFFINITY_KEY_RE = re.compile(r'^affinity:\s*$')
AFFINITY_ITEM_RE = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]\s*\(\s*(-?\d+)\s*\)')


def get_wiki_links(text):
    links = {m.group(1).strip() for m in WIKI_RE.finditer(text)}
    return sorted(links)


def get_affinity_band(n):
    """Map an affinity integer (-10..10) to its band label + display color. See meta/affinity.md."""
    if n <= -6:
        return 'hostile', 'red'
    if n <= -1:
        return 'cool', 'darkyellow'
    if n == 0:
        return 'neutral', 'gray'
    if n <= 5:
        return 'warm', 'green'
    return 'devoted', 'cyan'


def get_affinity_entries(fm_block):
    """Parse 'affinity:' list items from a raw frontmatter block into (target, int) pairs.
    get_frontmatter drops the paren suffix, so the int is parsed here from the raw lines.
    Line-by-line scan: enter on the affinity key, collect indented '- [[Name]] (n)' items,
    exit on the next top-level key (avoids regex dotall over-consumption)."""
    entries = []
    in_block = False
    for line in fm_block.split('\n'):
        line = line.rstrip('\r')
        if AFFINITY_KEY_RE.match(line):
            in_block = True
            continue
        if not in_block:
            continue
        if line and not line[0].isspace():   # next top-level key ends the block
            break
        m = AFFINITY_ITEM_RE.search(line)
        if m:
            entries.append((m.group(1).strip(), int(m.group(2))))
    return entries


def main():
    parser = argparse.ArgumentParser(description='1-hop relation graph for an entity')
    parser.add_argument('--name', required=True)
    args = parser.parse_args()
    name = args.name

    all_files = []
    for d in ('data', 'historian', 'scheduler'):
        all_files.extend((ROOT / d).rglob('*.md'))

    target = next((f for f in all_files if f.stem.lower() == name.lower()), None)
    if not target:
        target = next((f for f in all_files if name.lower() in f.stem.lower()), None)

    if not target:
        cwrite(f"Entity not found: '{name}'", 'red')
        sys.exit(1)

    content = target.read_text(encoding='utf-8')
    fm = get_frontmatter(target)
    rel = str(target.relative_to(ROOT))

    entity_name = fm.get('name') or target.stem
    cwrite(f"\n=== {entity_name} ===", 'cyan')
    cwrite(f"  File: {rel}", 'gray')
    sub = f"/{fm['subtype']}" if fm.get('subtype') else ""
    cwrite(f"  Type: {fm.get('type', '')}{sub}", 'white')
    cwrite(f"  Exists: {fm.get('exists', '')} | State: {fm.get('state', '')} | "
           f"Importance: {fm.get('importance', '')}", 'white')
    if fm.get('description'):
        cwrite(f"  Desc: {fm['description']}", 'gray')

    m = FM_BLOCK_RE.search(content)
    if m:
        links = get_wiki_links(m.group(1))
        if links:
            cwrite("\n  Relations (from frontmatter):", 'yellow')
            for link in links:
                linked = next((f for f in all_files if f.stem.lower() == link.lower()), None)
                if linked:
                    lfm = get_frontmatter(linked)
                    exists = lfm.get('exists')
                    clr = 'green' if exists == 'true' else 'darkyellow' if exists == 'false' else 'gray'
                    lsub = f"/{lfm['subtype']}" if lfm.get('subtype') else ""
                    cwrite(f"    -> [[{link}]] ({lfm.get('type', '')}{lsub}, exists:{exists})", clr)
                else:
                    cwrite(f"    -> [[{link}]] (not found)", 'darkgray')

    # Affinity block: per-target liking with band (see meta/affinity.md)
    m = FM_BLOCK_RE.search(content)
    if m:
        aff_entries = get_affinity_entries(m.group(1))
        if aff_entries:
            cwrite("\n  Affinity (toward):", 'yellow')
            for target_name, value in sorted(aff_entries, key=lambda e: e[1], reverse=True):
                label, clr = get_affinity_band(value)
                sign = f"+{value}" if value > 0 else f"{value}"
                cwrite(f"    -> [[{target_name}]] ({sign}, {label})", clr)

    cwrite("\n  Referenced by:", 'yellow')
    reverse_name = fm.get('name') or target.stem
    ref_pattern = re.compile(r'\[\[' + re.escape(reverse_name))
    ref_count = 0
    for f in all_files:
        if f == target:
            continue
        fc = f.read_text(encoding='utf-8')
        if ref_pattern.search(fc):
            rfm = get_frontmatter(f)
            r_rel = str(f.relative_to(ROOT))
            r_name = rfm.get('name') or f.stem
            cwrite(f"    <- {r_name} ({r_rel})", 'darkcyan')
            ref_count += 1
    if ref_count == 0:
        cwrite("    (none found)", 'darkgray')


if __name__ == '__main__':
    main()
