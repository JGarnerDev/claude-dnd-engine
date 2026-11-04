"""Reputation -- the math behind meta/reputation.md.

consumers: scripts/reputation-standings.py, scripts/session-cards.py -- update those if the
standings shape changes.

Reads the catalog (the fenced block under `## Catalog` in meta/reputation.md: sizes,
multipliers, tiers) and the one ledger (historian/sessions/_reputation.md): `## Session <n>`,
then `### <PC>`, then one bullet per deed,
`- <fame|infamy> · <scope> · <size> [× <mult>...] · lvl <n> = <points>: <text>`, and at most one
`- known · <fame|infamy>: <text>` per track: what the PC is known for, carried forward until a
later session rewrites it.
Points are stored, never recomputed; a mismatch with the formula is only a warning.

For one homebrew session it computes each PC's world fame and infamy (all deeds up to it),
the gain that session, tiers and tier-ups, local scores with the diluted rollup through each
location's `global_location:`, that session's top deeds, the latest known-for line per track, and
party fame (the roster average).
"""

import math
import re
from pathlib import Path

from lib.common import entity_md_files, get_frontmatter, read_text_no_bom
from lib.stats import session_campaigns

CATALOG_FILE = Path('meta') / 'reputation.md'
LEDGER_FILE = Path('historian') / 'sessions' / '_reputation.md'
CAMPAIGN = 'homebrew'
TRACKS = ('fame', 'infamy')
TOP_N = 3
KNOWN_MAX_WORDS = 10

_CATALOG_RE = re.compile(r'^## Catalog\s*$.*?^```text\r?\n(.*?)^```', re.S | re.M)
_SESSION_RE = re.compile(r'^##\s+Session\s+(\d+)\s*$')
_H2_RE = re.compile(r'^##\s')
_PC_RE = re.compile(r'^###\s+(.+?)\s*$')
_DEED_RE = re.compile(
    r'^-\s+(fame|infamy)\s*·\s*(.+?)\s*·\s*([a-z-]+)((?:\s*[×x*]\s*[a-z-]+)*)\s*·\s*'
    r'lvl\s*(\d+)\s*=\s*([\d,]+)\s*:\s*(.*)$', re.I)
_KNOWN_RE = re.compile(r'^-\s+known\s*·\s*(fame|infamy)\s*:\s*(.*)$', re.I)
_MULT_SPLIT_RE = re.compile(r'\s*[×x*]\s*')
_CONT_RE = re.compile(r'^\s+(\S.*)$')


def load_catalog(root: Path) -> dict:
    """{sizes: {id: base}, mults: {id: {factor, label}}, tiers: [{rank, threshold, fame, infamy}]}."""
    cat = {'sizes': {}, 'mults': {}, 'tiers': []}
    f = root / CATALOG_FILE
    m = _CATALOG_RE.search(read_text_no_bom(f)) if f.is_file() else None
    if not m:
        return cat
    for line in m.group(1).splitlines():
        cols = [c.strip() for c in line.split('|')]
        if cols[0] == 'size' and len(cols) == 3:
            cat['sizes'][cols[1]] = int(cols[2])
        elif cols[0] == 'mult' and len(cols) == 4:
            cat['mults'][cols[1]] = {'factor': float(cols[2]), 'label': cols[3]}
        elif cols[0] == 'tier' and len(cols) == 5:
            cat['tiers'].append({'rank': int(cols[1]), 'threshold': int(cols[2]),
                                 'fame': cols[3], 'infamy': cols[4]})
    cat['tiers'].sort(key=lambda t: t['threshold'])
    return cat


def points(cat: dict, size: str, mults: list, level: int):
    """The formula: size base x level^2 x every multiplier, rounded half up. None when the
    size or a multiplier is not in the catalog."""
    if size not in cat['sizes'] or any(x not in cat['mults'] for x in mults):
        return None
    v = cat['sizes'][size] * level * level
    for x in mults:
        v *= cat['mults'][x]['factor']
    return math.floor(v + 0.5 + 1e-9)


def load_ledger(root: Path) -> dict:
    """{session: {pc: [deed]}}; deed = {track, scope, size, mults, level, points, text, line}."""
    return _parse(root)[0]


def load_known(root: Path) -> dict:
    """{session: {pc: {track: {text, line}}}}: the known-for lines, as written in each session."""
    return _parse(root)[1]


def _parse(root: Path) -> tuple:
    f = root / LEDGER_FILE
    ledger, known = {}, {}
    if not f.is_file():
        return ledger, known
    session = pc = deed = None
    for i, line in enumerate(read_text_no_bom(f).splitlines(), 1):
        if m := _SESSION_RE.match(line):
            session, pc, deed = int(m.group(1)), None, None
            ledger.setdefault(session, {})
        elif _H2_RE.match(line):
            session, pc, deed = None, None, None
        elif session is not None and (m := _PC_RE.match(line)):
            pc, deed = m.group(1), None
            ledger[session].setdefault(pc, [])
        elif pc and (m := _DEED_RE.match(line)):
            mults = [x.lower() for x in _MULT_SPLIT_RE.split(m.group(4)) if x]
            deed = {'track': m.group(1).lower(), 'scope': m.group(2).strip(),
                    'size': m.group(3).lower(), 'mults': mults, 'level': int(m.group(5)),
                    'points': int(m.group(6).replace(',', '')), 'text': m.group(7).strip(),
                    'line': i}
            ledger[session][pc].append(deed)
        elif pc and (m := _KNOWN_RE.match(line)):
            deed = {'text': m.group(2).strip(), 'line': i}
            known.setdefault(session, {}).setdefault(pc, {})[m.group(1).lower()] = deed
        elif deed and (m := _CONT_RE.match(line)):
            deed['text'] = (deed['text'] + ' ' + m.group(1).strip()).strip()
        elif not line.strip():
            deed = None
    return ledger, known


def location_parents(root: Path) -> dict:
    """{casefolded name: (name, parent name or '')} for every historian location."""
    out = {}
    for f in entity_md_files(root / 'historian' / 'locations'):
        fm = get_frontmatter(f)
        name = (fm.get('name') or f.stem).strip()
        out[name.casefold()] = (name, (fm.get('global_location') or '').strip())
    return out


def scope_chain(parents: dict, scope: str) -> list:
    """[(place, share)]: the scope at full share, then each parent at half the last.
    Stops at a missing link or a loop."""
    out, seen = [], set()
    name, share = scope, 1.0
    while name and name.casefold() not in seen:
        seen.add(name.casefold())
        known = parents.get(name.casefold())
        out.append((known[0] if known else name, share))
        if not known:
            break
        name, share = known[1], share / 2
    return out


def tier(cat: dict, track: str, score: int) -> dict:
    """{rank, name, threshold} of the highest tier `score` meets."""
    best = {'rank': 1, 'name': '', 'threshold': 0}
    for t in cat['tiers']:
        if score >= t['threshold']:
            best = {'rank': t['rank'], 'name': t[track], 'threshold': t['threshold']}
    return best


def roster(root: Path) -> list:
    """PC short names in Aethryn: every PC file tagged homebrew or untagged."""
    out = []
    for f in sorted((root / 'historian' / 'characters' / 'pcs').glob('*.md')):
        fm = get_frontmatter(f)
        if fm.get('campaign') and fm['campaign'].strip().lower() != CAMPAIGN:
            continue
        out.append((fm.get('name') or f.stem).strip())
    return out


def _scores(ledger: dict, sessions: list, parents: dict) -> dict:
    """{pc: {'world': {track: n}, 'local': {place: {track: n}}}} over the given sessions."""
    out = {}
    for s in sessions:
        for pc, deeds in ledger.get(s, {}).items():
            row = out.setdefault(pc.casefold(), {'world': dict.fromkeys(TRACKS, 0), 'local': {}})
            for d in deeds:
                row['world'][d['track']] += d['points']
                for place, share in scope_chain(parents, d['scope']):
                    loc = row['local'].setdefault(place, dict.fromkeys(TRACKS, 0))
                    loc[d['track']] += math.floor(d['points'] * share + 0.5)
    return out


def reputation(root: Path, number: int) -> dict:
    """Everything the reputation slide needs for session `number`. None when the session is
    not homebrew or no deed has been ledgered up to it."""
    campaigns = session_campaigns(root)
    if campaigns.get(number, CAMPAIGN) != CAMPAIGN:
        return None
    ledger, known = _parse(root)
    warnings = []
    for s in sorted(ledger):
        if campaigns.get(s, CAMPAIGN) != CAMPAIGN:
            warnings.append(f'Session {s} is {campaigns[s]}, not {CAMPAIGN}: its deeds are ignored')
    sessions = [s for s in sorted(ledger) if campaigns.get(s, CAMPAIGN) == CAMPAIGN]
    upto = [s for s in sessions if s <= number]
    if not any(ledger[s].get(pc) for s in upto for pc in ledger[s]):
        return None

    cat = load_catalog(root)
    parents = location_parents(root)
    before = _scores(ledger, [s for s in upto if s < number], parents)
    after = _scores(ledger, upto, parents)

    for pc, deeds in ledger.get(number, {}).items():
        for d in deeds:
            want = points(cat, d['size'], d['mults'], d['level'])
            if want is None:
                warnings.append(f"line {d['line']}: unknown size or multiplier ({pc})")
            elif want != d['points']:
                warnings.append(f"line {d['line']}: {pc} stored {d['points']:,}, formula gives {want:,}")
            if d['scope'].casefold() not in parents:
                warnings.append(f"line {d['line']}: scope \"{d['scope']}\" is no historian location; no rollup ({pc})")
    for pc, lines in known.get(number, {}).items():
        for t, k in lines.items():
            if len(k['text'].split()) > KNOWN_MAX_WORDS:
                warnings.append(f"line {k['line']}: {pc}'s known-for {t} runs over {KNOWN_MAX_WORDS} words")

    # Known-for: the latest line per PC and track up to this session.
    latest = {}
    for s in upto:
        for pc, lines in known.get(s, {}).items():
            for t, k in lines.items():
                latest.setdefault(pc.casefold(), {})[t] = k['text']

    names = roster(root)
    for s in upto:
        for pc in ledger[s]:
            if pc.casefold() not in {n.casefold() for n in names}:
                names.append(pc)

    empty = {'world': dict.fromkeys(TRACKS, 0), 'local': {}}
    pcs, crossings = [], []
    for pc in names:
        a, b = after.get(pc.casefold(), empty), before.get(pc.casefold(), empty)
        row = {'pc': pc, 'known': {t: latest.get(pc.casefold(), {}).get(t, '') for t in TRACKS}}
        for t in TRACKS:
            now, was = tier(cat, t, a['world'][t]), tier(cat, t, b['world'][t])
            row[t] = {'score': a['world'][t], 'gain': a['world'][t] - b['world'][t],
                      'tier': now['name'], 'rank': now['rank'], 'up': now['rank'] > was['rank']}
            if row[t]['up']:
                crossings.append({'pc': pc, 'track': t, 'scope': 'world', 'tier': now['name'], 'rank': now['rank']})
        row['local'] = []
        for place, sc in sorted(a['local'].items(), key=lambda kv: (-kv[1]['fame'] - kv[1]['infamy'], kv[0])):
            old = b['local'].get(place, dict.fromkeys(TRACKS, 0))
            loc = {'place': place}
            for t in TRACKS:
                now, was = tier(cat, t, sc[t]), tier(cat, t, old[t])
                loc[t] = {'score': sc[t], 'tier': now['name'], 'rank': now['rank']}
                if now['rank'] > was['rank']:
                    crossings.append({'pc': pc, 'track': t, 'scope': place, 'tier': now['name'], 'rank': now['rank']})
            row['local'].append(loc)
        deeds = next((v for k, v in ledger.get(number, {}).items() if k.casefold() == pc.casefold()), [])
        row['deeds'] = [{'track': d['track'], 'scope': d['scope'], 'points': d['points'], 'text': d['text']}
                        for d in sorted(deeds, key=lambda d: -d['points'])[:TOP_N]]
        pcs.append(row)

    pcs.sort(key=lambda r: (-r['fame']['score'], -r['infamy']['score'], r['pc'].lower()))
    party = math.floor(sum(r['fame']['score'] for r in pcs) / len(pcs) + 0.5) if pcs else 0
    return {
        'session': number,
        'campaign': CAMPAIGN,
        'partyFame': party,
        'partyTier': tier(cat, 'fame', party)['name'],
        'pcs': pcs,
        'crossings': crossings,
        'warnings': warnings,
    }
