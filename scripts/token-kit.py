#!/usr/bin/env python3
# token-kit.py
# consumers: maps/battlemaps/CLAUDE.md, scripts/prep-status.py -- update these if usage, flags, or output format change.
# Pull a session's Roll20 token kit out of the FA Tokens Library zip, inside a storage budget.
#
# Roll20's free tier holds 100 MB of uploads, and the library is ~730 MB. A kit is filled from a
# tiered manifest: tier 1 first, then tier 2, and so on, round-robin across the roles in a tier
# so every role gets a token before any role gets its second. The shared evergreen manifest
# (maps/battlemaps/tokens-common.txt) fills last, so leftover budget goes on tokens that turn up
# in any session. A token that would overflow the budget is skipped and smaller ones still fit.
#
# Tokens are downscaled from FA's 400 px per square to --px (default 280: 4x Roll20's 70 px grid,
# still crisp at full zoom), which roughly halves each file. Each file is renamed
# <role>__<FA name>.png so the role is searchable in the Roll20 art library.
#
# Manifest: maps/roll20 assets/session-<n>/tokens.txt, one rule per line, "#" comments:
#   <tier> <role> <max> <regex>  ; note for the README
#   1  rider-archer  3  Bandit_Archer|Elf_Scout   ; Ilsa Thorn, human Scout, mounted bow
# The role is the plan's party-facing label, lowercased and hyphenated (it reaches Roll20 as the
# file name); real names go in the note.
# The regex is matched case-insensitively against the path inside the zip. Desert_* tokens are
# skipped unless the regex says "desert". If a rule matches more than <max>, picks are spread
# evenly over the matches. A file already taken by an earlier rule is not taken twice.
#
# Output: one flat folder per session, maps/roll20 assets/session-<n>/tokens/, holding only the
# images so they can all be selected and dragged into Roll20 at once, plus tokens-README.md beside
# it (roles, notes, files, and each token's Roll20 size in squares). The folder is rebuilt on
# every run.
#
# Upload ledger: maps/battlemaps/tokens-uploaded.txt lists the tokens already in the Roll20 art
# library, one "<session> <role> <FA file name>" line each. A kit never re-adds a token an earlier
# session uploaded; it counts toward the role's <max> and the README lists it under its role as
# already in Roll20. After uploading, record the kit with --uploaded. After a Roll20 purge
# (maps/battlemaps/roll20-purge.js), drop what it deleted with --forget.
#
# Usage:
#   uv run scripts/token-kit.py --session 30 --count       (dry run: matches and picks per rule)
#   uv run scripts/token-kit.py --session 30                (build, 30 MB budget)
#   uv run scripts/token-kit.py --session 30 --budget 40 --px 200 --no-common
#   uv run scripts/token-kit.py --session 30 --uploaded     (record the built kit in the ledger)
#   uv run scripts/token-kit.py --session 30 --uploaded --from "<dir>"  (record another folder)
#   uv run scripts/token-kit.py --forget 30                 (or --forget all, after a purge)

import argparse
import io
import re
import shutil
import sys
import zipfile
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parent.parent
ASSETS = REPO / 'maps' / 'roll20 assets'
ZIP = ASSETS / 'FA_Tokens_Library_v1.14.zip'
COMMON = REPO / 'maps' / 'battlemaps' / 'tokens-common.txt'
LEDGER = REPO / 'maps' / 'battlemaps' / 'tokens-uploaded.txt'
LEDGER_HEAD = ('# Tokens already uploaded to the Roll20 art library. Kept by scripts/token-kit.py:\n'
               '# --uploaded adds a session, --forget removes one (or all, after a purge).\n'
               '# <session> <role> <FA file name>\n')
NATIVE_PX = 400
COMMON_TIER_OFFSET = 100
SIZE_SQUARES = {'tiny': 1, 'small': 1, 'medium': 1, 'large': 2, 'huge': 3, 'gargantuan': 4}


def parse_manifest(path, tier_offset=0):
    rules = []
    for ln, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        body, _, note = line.partition(' ; ')
        parts = body.split(None, 3)
        if len(parts) < 4 or not parts[0].isdigit() or not parts[2].isdigit():
            sys.exit(f'{path.name}:{ln}: expected "<tier> <role> <max> <regex>  ; note"')
        tier, role, mx, rx = parts
        rules.append({'tier': int(tier) + tier_offset, 'role': role, 'max': int(mx),
                      'rx': re.compile(rx.strip(), re.I), 'desert': 'desert' in rx.lower(),
                      'note': note.strip(), 'src': path.name})
    return rules


def read_ledger(path=LEDGER):
    """[(session, role, name)] from the upload ledger; a missing file is empty."""
    rows = []
    if path.exists():
        for line in path.read_text(encoding='utf-8').splitlines():
            parts = line.split(None, 2)
            if len(parts) == 3 and parts[0].isdigit():
                rows.append((int(parts[0]), parts[1], parts[2].strip()))
    return rows


def write_ledger(rows, path=LEDGER):
    rows = sorted(set(rows), key=lambda r: (r[0], r[1], r[2].lower()))
    path.write_text(LEDGER_HEAD + ''.join(f'{s}  {role}  {name}\n' for s, role, name in rows),
                    encoding='utf-8')


def kit_files(folder):
    """[(role, FA name)] for every PNG under a folder. The role is the '<role>__' prefix, or
    the parent folder's name for a file without one (older per-role kits)."""
    out = []
    for f in sorted(Path(folder).rglob('*.png')):
        role, sep, name = f.name.partition('__')
        out.append((role, name) if sep else (f.parent.name, f.name))
    return out


def basename(info):
    return info.filename.rsplit('/', 1)[-1]


def choose(rules, members, resident):
    """Fill each rule's 'resident' (already uploaded) and 'picks' (new), in rule order.

    `resident` maps FA file name -> the session it was uploaded in. Resident matches count
    toward the rule's max, and no file is picked twice across rules."""
    taken = set()
    for r in rules:
        hits = [i for i in members if r['rx'].search(i.filename)
                and (r['desert'] or 'desert_' not in i.filename.lower())]
        r['hits'] = len(hits)
        r['resident'] = [(basename(i), resident[basename(i)])
                         for i in hits if basename(i) in resident][:r['max']]
        fresh = [i for i in hits if basename(i) not in resident]
        room = r['max'] - len(r['resident'])
        r['picks'] = [i for i in spread(fresh, room) if i.filename not in taken][:room]
        taken.update(i.filename for i in r['picks'])


def spread(items, k):
    """k items spread evenly over a sorted list, then the rest (fallbacks for dedup)."""
    if k <= 0:
        return []
    if len(items) <= k:
        return list(items)
    idx = [round(i * (len(items) - 1) / max(k - 1, 1)) for i in range(k)]
    first = [items[i] for i in dict.fromkeys(idx)]
    return first + [x for x in items if x not in first]


def roll20_size(name):
    m = re.search(r'_(Tiny|Small|Medium|Large|Huge|Gargantuan)(?=_|$)', name, re.I)
    sq = SIZE_SQUARES[m.group(1).lower()] if m else 1
    s = re.search(r'Scale(\d+)', name)
    total = sq * (int(s.group(1)) / 100 if s else 1)
    return f'{total:g}x{total:g}'


def shrink(data, px):
    if px >= NATIVE_PX:
        return data
    im = Image.open(io.BytesIO(data))
    f = px / NATIVE_PX
    im = im.resize((max(1, round(im.width * f)), max(1, round(im.height * f))), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, 'PNG', optimize=True)
    return out.getvalue()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--session', type=int)
    ap.add_argument('--budget', type=float, default=30, help='MB (default 30)')
    ap.add_argument('--px', type=int, default=280, help='pixels per 5-ft square (FA native 400)')
    ap.add_argument('--count', action='store_true', help='dry run: matches and picks per rule')
    ap.add_argument('--no-common', action='store_true', help='skip tokens-common.txt')
    ap.add_argument('--uploaded', action='store_true',
                    help="record the session's kit (or --from) in the upload ledger")
    ap.add_argument('--from', dest='src', help='with --uploaded: a folder to record instead of the kit')
    ap.add_argument('--forget', metavar='SESSION|all', help='drop ledger lines (after a Roll20 purge)')
    a = ap.parse_args()

    if a.forget:
        rows = read_ledger()
        keep = [] if a.forget == 'all' else [r for r in rows if str(r[0]) != a.forget]
        write_ledger(keep)
        print(f'Forgot {len(rows) - len(keep)} ledger lines; {len(keep)} left in '
              f'{LEDGER.relative_to(REPO)}')
        return
    if a.session is None:
        sys.exit('--session is required')
    kit = ASSETS / f'session-{a.session}'
    if a.uploaded:
        src = Path(a.src) if a.src else kit / 'tokens'
        files = kit_files(src)
        if not files:
            sys.exit(f'No PNGs under {src}')
        # Re-recording the kit replaces the session's lines; --from adds to them.
        rows = [r for r in read_ledger() if a.src or r[0] != a.session]
        write_ledger(rows + [(a.session, role, name) for role, name in files])
        print(f'Recorded {len(files)} tokens from {src} as uploaded in session {a.session}')
        return

    manifest = kit / 'tokens.txt'
    if not manifest.exists():
        sys.exit(f'No manifest at {manifest.relative_to(REPO)}')
    if not ZIP.exists():
        sys.exit(f'No token library at {ZIP.relative_to(REPO)}')
    rules = parse_manifest(manifest)
    if not a.no_common and COMMON.exists():
        rules += parse_manifest(COMMON, COMMON_TIER_OFFSET)
    rules.sort(key=lambda r: r['tier'])  # stable: manifest order within a tier

    z = zipfile.ZipFile(ZIP)
    members = sorted((i for i in z.infolist() if i.filename.lower().endswith('.png')),
                     key=lambda i: i.filename)
    resident = {name: s for s, _, name in read_ledger() if s != a.session}
    choose(rules, members, resident)

    est = (a.px / NATIVE_PX) ** 2 * 1.05 if a.px < NATIVE_PX else 1
    if a.count:
        tot = 0
        for r in rules:
            mb = sum(i.file_size for i in r['picks']) * est / 2**20
            tot += mb
            tier = 'common' if r['tier'] >= COMMON_TIER_OFFSET else f"t{r['tier']}"
            flag = '  <-- NO MATCH' if not r['hits'] else ''
            have = f"  +{len(r['resident'])} in Roll20" if r['resident'] else ''
            print(f"{tier:>6} {r['role']:<22} {len(r['picks'])}/{r['hits']:<4} ~{mb:5.1f} MB{have}{flag}")
            for i in r['picks']:
                print(f"         {basename(i)}")
            for name, s in r['resident']:
                print(f"         (in Roll20 since session {s}) {name}")
        print(f'\nAll picks ~{tot:.1f} MB at {a.px} px (estimate); budget {a.budget:g} MB.')
        return

    out = kit / 'tokens'
    if out.exists():
        shutil.rmtree(out)
    budget, used, skipped = a.budget * 2**20, 0, []
    for r in rules:
        r['kept'] = []
    for tier in sorted({r['tier'] for r in rules}):
        group = [r for r in rules if r['tier'] == tier]
        for k in range(max(len(r['picks']) for r in group)):
            for r in group:
                if k >= len(r['picks']):
                    continue
                info = r['picks'][k]
                data = shrink(z.read(info), a.px)
                name = info.filename.rsplit('/', 1)[-1]
                if used + len(data) > budget:
                    skipped.append(f"{r['role']}: {name}")
                    continue
                dest = out / f"{r['role']}__{name}"
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(data)
                used += len(data)
                r['kept'].append(name)

    n = sum(len(r['kept']) for r in rules)
    res = sum(len(r['resident']) for r in rules)
    lines = [f'# Session {a.session} tokens', '',
             f'{n} tokens, {used / 2**20:.1f} MB of a {a.budget:g} MB budget, at {a.px} px per '
             f'square. Built by `scripts/token-kit.py` from `tokens.txt` (session) and '
             f'`maps/battlemaps/tokens-common.txt` (evergreen). Upload everything in `tokens/`; '
             f'swap at the table.', '',
             f'{res} more are already in your Roll20 library from earlier sessions, listed under '
             f'their role (from `maps/battlemaps/tokens-uploaded.txt`). After uploading, run '
             f'`uv run scripts/token-kit.py --session {a.session} --uploaded`.', '',
             'Set each token\'s Roll20 size (in squares) from the size after its name. Files are '
             '`<role>__<FA name>`, so search the art library by role.', '']
    tier_seen = None
    for r in rules:
        if not r['kept'] and not r['resident'] and r['hits']:
            continue
        label = 'Evergreen' if r['tier'] >= COMMON_TIER_OFFSET else f"Tier {r['tier']}"
        if label != tier_seen:
            lines += [f'## {label}', '']
            tier_seen = label
        note = f" — {r['note']}" if r['note'] else ''
        if not r['hits']:
            lines.append(f"- **{r['role']}**{note}. **No token in the library**")
            continue
        lines.append(f"- **{r['role']}**{note}")
        lines += [f'  - `{f}` {roll20_size(f)}' for f in r['kept']]
        lines += [f'  - already in Roll20 (session {s}): `{f}` {roll20_size(f)}'
                  for f, s in r['resident']]
    if skipped:
        lines += ['', '## Over budget', '', 'Matched but left out. Raise `--budget` or lower `--px` to fit them.', '']
        lines += [f'- `{s}`' for s in skipped]
    out.mkdir(parents=True, exist_ok=True)
    (kit / 'tokens-README.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')

    print(f'{n} tokens, {used / 2**20:.1f} MB / {a.budget:g} MB -> {out.relative_to(REPO)}'
          + (f' ({res} already in Roll20, not re-added)' if res else ''))
    for r in rules:
        if not r['hits']:
            print(f"  no match: {r['role']}")
    if skipped:
        print(f'  {len(skipped)} over budget (listed in README)')


if __name__ == '__main__':
    main()
