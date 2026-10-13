"""Stats standings -- the math behind meta/stats.md.

consumers: scripts/stats-standings.py, scripts/session-cards.py -- update those if the
standings shape changes.

Reads the category catalog (the fenced block under `## Catalog` in meta/stats.md) and the
one shared ledger (historian/sessions/_stats.md), orders sessions by number, splits them
into seasons by runs of the `campaign:` tag, and computes for one session: its awards,
the season leaderboards so far, the lifetime leaders, and -- when the session opens a
season -- the previous season's final standings.
"""

import re
from pathlib import Path

from lib.common import entity_md_files, get_frontmatter, read_text_no_bom, try_int

CATALOG_FILE = Path('meta') / 'stats.md'
LEDGER_FILE = Path('historian') / 'sessions' / '_stats.md'
TOP_N = 3

_CATALOG_RE = re.compile(r'^## Catalog\s*$.*?^```text\r?\n(.*?)^```', re.S | re.M)
_SESSION_RE = re.compile(r'^##\s+Session\s+(\d+)\s*$')
_PC_RE = re.compile(r'^###\s+(.+?)\s*$')
_STAT_RE = re.compile(r'^\s*-\s+([a-z0-9-]+)\s*:\s*(~?)\s*(\d+)\s*$')


def load_catalog(root: Path) -> list:
    """[{id, award, label, icon, family, kind}] in catalog order."""
    m = _CATALOG_RE.search(read_text_no_bom(root / CATALOG_FILE))
    if not m:
        return []
    out = []
    for line in m.group(1).splitlines():
        cols = [c.strip() for c in line.split('|')]
        if len(cols) == 6 and cols[0]:
            out.append(dict(zip(('id', 'award', 'label', 'icon', 'family', 'kind'), cols)))
    return out


def load_ledger(root: Path, known: set) -> tuple:
    """({session: {pc: {id: (value, rough)}}}, [warnings])."""
    f = root / LEDGER_FILE
    ledger, warnings = {}, []
    if not f.is_file():
        return ledger, warnings
    session = pc = None
    for i, line in enumerate(read_text_no_bom(f).splitlines(), 1):
        if m := _SESSION_RE.match(line):
            session, pc = int(m.group(1)), None
            ledger.setdefault(session, {})
        elif session is not None and (m := _PC_RE.match(line)):
            pc = m.group(1)
            ledger[session].setdefault(pc, {})
        elif pc and (m := _STAT_RE.match(line)):
            cid, rough, n = m.group(1), bool(m.group(2)), int(m.group(3))
            if cid not in known:
                warnings.append(f'line {i}: unknown category "{cid}" (Session {session}, {pc})')
                continue
            ledger[session][pc][cid] = (n, rough)
    return ledger, warnings


def session_campaigns(root: Path) -> dict:
    """{session number: campaign tag} for every played session in historian/sessions/."""
    out = {}
    for f in entity_md_files(root / 'historian' / 'sessions'):
        fm = get_frontmatter(f)
        n = try_int(fm.get('session_number'))
        if n is not None:
            out[n] = (fm.get('campaign') or '').strip().lower()
    return out


def seasons(campaigns: dict) -> list:
    """[{campaign, sessions: [n...]}]: consecutive runs of one tag, in number order."""
    out = []
    for n in sorted(campaigns):
        if out and out[-1]['campaign'] == campaigns[n]:
            out[-1]['sessions'].append(n)
        else:
            out.append({'campaign': campaigns[n], 'sessions': [n]})
    return out


def _totals(ledger: dict, sessions: list, cid: str) -> dict:
    """{pc: (sum, rough)} for one category over the given sessions."""
    tot = {}
    for s in sessions:
        for pc, stats in ledger.get(s, {}).items():
            if cid in stats:
                v, r = stats[cid]
                pv, pr = tot.get(pc, (0, False))
                tot[pc] = (pv + v, pr or r)
    return tot


def _ranked(tot: dict) -> list:
    return sorted(({'pc': pc, 'value': v, 'rough': r} for pc, (v, r) in tot.items() if v > 0),
                  key=lambda x: (-x['value'], x['pc'].lower()))


def _leaders(rows: list) -> dict:
    """Top value shared by every PC who has it (ties share)."""
    top = [x for x in rows if x['value'] == rows[0]['value']]
    return {'pcs': [x['pc'] for x in top], 'value': top[0]['value'],
            'rough': any(x['rough'] for x in top)}


def _boards(catalog: list, ledger: dict, sessions: list) -> list:
    out = []
    for c in catalog:
        rows = _ranked(_totals(ledger, sessions, c['id']))[:TOP_N]
        if rows:
            out.append({**c, 'rows': rows})
    return out


def standings(root: Path, number: int) -> dict:
    """Everything the stats slides need for session `number`. None when that session has
    no ledger section."""
    catalog = load_catalog(root)
    ledger, warnings = load_ledger(root, {c['id'] for c in catalog})
    if number not in ledger:
        return None
    campaigns = session_campaigns(root)
    campaigns.setdefault(number, '')
    runs = seasons(campaigns)
    idx = next(i for i, r in enumerate(runs) if number in r['sessions'])
    season = runs[idx]['sessions']
    so_far = [s for s in season if s <= number]
    earlier = [s for s in ledger if s < number]

    awards = []
    for c in catalog:
        rows = _ranked(_totals(ledger, [number], c['id']))
        if not rows:
            continue
        win = _leaders(rows)
        best = [pc for pc in win['pcs']
                if any(pc in ledger[s] for s in earlier)
                and win['value'] > max((ledger[s][pc][c['id']][0] for s in earlier
                                         if c['id'] in ledger[s].get(pc, {})), default=0)]
        awards.append({**c, **win, 'best': best})

    lifetime = []
    for c in catalog:
        rows = _ranked(_totals(ledger, [s for s in ledger if s <= number], c['id']))
        if rows:
            lifetime.append({**c, **_leaders(rows)})

    previous = None
    if so_far == season[:1] and idx > 0:
        prev = runs[idx - 1]
        boards = _boards(catalog, ledger, prev['sessions'])
        if boards:
            previous = {'campaign': prev['campaign'], 'first': prev['sessions'][0],
                        'last': prev['sessions'][-1], 'leaderboards': boards}

    return {
        'session': number,
        'campaign': runs[idx]['campaign'],
        'season': {'first': season[0], 'last': so_far[-1]},
        'awards': awards,
        'leaderboards': _boards(catalog, ledger, so_far),
        'lifetime': lifetime,
        'previousSeason': previous,
        'warnings': warnings,
    }
