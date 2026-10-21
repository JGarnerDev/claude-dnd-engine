"""Achievements -- the ledger behind meta/achievements.md.

consumers: scripts/session-cards.py -- update it if the session shape changes.

Reads the one shared ledger (historian/sessions/_achievements.md): `## Session <n>`, then
`### <PC>`, then one bullet per achievement, `- **<Title>**: <description>`. An indented
line under a bullet continues its description. For one session it returns each PC's
achievements in ledger order, with how many times that PC has now earned the same title
(a tally card at a higher threshold: "Fireplace Inspector", then "Fireplace Inspector II").
Any other `##` section (`## Tallies`) is skipped: tallies are DM-side until they unlock a card.
"""

import re
from pathlib import Path

from lib.common import read_text_no_bom

LEDGER_FILE = Path('historian') / 'sessions' / '_achievements.md'

_SESSION_RE = re.compile(r'^##\s+Session\s+(\d+)\s*$')
_H2_RE = re.compile(r'^##\s')
_PC_RE = re.compile(r'^###\s+(.+?)\s*$')
_ITEM_RE = re.compile(r'^-\s+\*\*(.+?)\*\*\s*[:—-]?\s*(.*)$')
_CONT_RE = re.compile(r'^\s+(\S.*)$')
_ROMAN_RE = re.compile(r'\s+[IVX]+$')


def title_key(title: str) -> str:
    """Repeat key: case-folded, trailing roman numeral dropped ("Gravity's Favorite II")."""
    return _ROMAN_RE.sub('', title.strip()).casefold()


def load_ledger(root: Path) -> dict:
    """{session: {pc: [{title, text}]}} in ledger order."""
    f = root / LEDGER_FILE
    ledger = {}
    if not f.is_file():
        return ledger
    session = pc = item = None
    for line in read_text_no_bom(f).splitlines():
        if m := _SESSION_RE.match(line):
            session, pc, item = int(m.group(1)), None, None
            ledger.setdefault(session, {})
        elif _H2_RE.match(line):
            session, pc, item = None, None, None
        elif session is not None and (m := _PC_RE.match(line)):
            pc, item = m.group(1), None
            ledger[session].setdefault(pc, [])
        elif pc and (m := _ITEM_RE.match(line)):
            item = {'title': m.group(1).strip(), 'text': m.group(2).strip()}
            ledger[session][pc].append(item)
        elif item and (m := _CONT_RE.match(line)):
            item['text'] = (item['text'] + ' ' + m.group(1).strip()).strip()
        elif not line.strip():
            item = None
    return ledger


def achievements(root: Path, number: int) -> list:
    """[{pc, items: [{title, text, times}]}] for session `number`, PCs in ledger order.
    `times` counts this PC's earnings of the same title up to and including this session.
    None when the session has no ledger section."""
    ledger = load_ledger(root)
    if number not in ledger:
        return None
    upto = [s for s in sorted(ledger) if s <= number]
    out = []
    for pc, items in ledger[number].items():
        if not items:
            continue
        seen = {}
        for s in upto:
            for it in ledger[s].get(pc, []):
                k = title_key(it['title'])
                seen[k] = seen.get(k, 0) + 1
        out.append({'pc': pc, 'items': [{**it, 'times': seen[title_key(it['title'])]} for it in items]})
    return out
