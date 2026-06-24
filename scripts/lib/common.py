"""common.py -- shared helpers imported by the scripts in scripts/.
consumers: scripts/entity-graph.py, scripts/free-entities.py, scripts/location-entities.py,
  scripts/party-status.py, scripts/route-cities.py, scripts/session-brief.py,
  scripts/session-state.py, scripts/todo-brief.py, scripts/inventory-brief.py,
  scripts/threads-brief.py, scripts/spotlight-balance.py
-- update those scripts if a function signature or output shape changes here.
"""

import os
import re
import sys
from pathlib import Path


# -- Repo root + script-path resolution ---------------------------------------
# scripts/ on sys.path so `from lib.common import ...` resolves no matter the CWD.
SCRIPTS_DIR = Path(__file__).resolve().parent.parent
ROOT = SCRIPTS_DIR.parent


# -- Color output (PowerShell Write-Host -ForegroundColor equivalent) ---------
# ANSI codes, stripped when piped/redirected or when NO_COLOR is set so the
# plain text consumers parse stays clean.
_ANSI = {
    'cyan': '36', 'darkcyan': '36', 'yellow': '33', 'darkyellow': '33',
    'white': '37', 'gray': '90', 'darkgray': '90', 'red': '31',
    'green': '32', 'magenta': '35',
}
_USE_COLOR = sys.stdout.isatty() and not os.environ.get('NO_COLOR')


def color(text, name):
    """Wrap text in an ANSI color (matching a PowerShell -ForegroundColor name)."""
    if not _USE_COLOR:
        return text
    code = _ANSI.get(name.lower())
    if not code:
        return text
    return f"\033[{code}m{text}\033[0m"


def cwrite(text='', name=None, end='\n'):
    """Print one line, optionally colored. Mirror of Write-Host."""
    if name:
        text = color(text, name)
    print(text, end=end)


# -- Frontmatter --------------------------------------------------------------
_FM_BLOCK_RE = re.compile(r'^---\r?\n(.+?)\r?\n---', re.DOTALL)
_WIKI_SCALAR_RE = re.compile(r'^(\w[\w_]*):\s*\[\[([^\]]+)\]\]')
_SCALAR_RE = re.compile(r'^(\w[\w_]*):\s*"?([^"#\r\n]*)"?\s*$')
_LIST_WIKI_RE = re.compile(r'^\s+-\s+\[\[([^\]]+)\]\]')
_LIST_PLAIN_RE = re.compile(r'^\s+-\s+"?([^"#\r\n]+)"?\s*$')


def get_frontmatter(path):
    """Parse YAML-ish frontmatter into a dict.

    Scalars: fm['key']. Wikilink scalars are unwrapped and alias-stripped
    ([[Name|alias]] -> Name). List items (plain or wikilink) accumulate under
    fm['_list_<key>'].
    """
    raw = Path(path).read_text(encoding='utf-8')
    if raw and raw[0] == '﻿':
        raw = raw[1:]
    m = _FM_BLOCK_RE.search(raw)
    if not m:
        return {}
    block = m.group(1)
    fm = {}
    current_key = None
    for line in block.split('\n'):
        line = line.rstrip('\r')
        mw = _WIKI_SCALAR_RE.match(line)
        ms = _SCALAR_RE.match(line)
        mlw = _LIST_WIKI_RE.match(line)
        mlp = _LIST_PLAIN_RE.match(line)
        if mw:
            current_key = mw.group(1).strip()
            fm[current_key] = mw.group(2).split('|')[0].strip()
        elif ms:
            current_key = ms.group(1).strip()
            fm[current_key] = ms.group(2).strip()
        elif mlw:
            if current_key:
                fm.setdefault(f'_list_{current_key}', []).append(
                    mlw.group(1).split('|')[0].strip())
        elif mlp:
            if current_key:
                fm.setdefault(f'_list_{current_key}', []).append(mlp.group(1).strip())
    return fm


# -- Spotlight ledger helpers (meta/character-focus.md) -----------------------
# Shared by spotlight-balance.py and party-status.py so the rotation tally has
# one source.

SPOTLIGHT_WEIGHT = {'touch': 1, 'beat': 3, 'arc': 9}

_BEAT_RE = re.compile(
    r'^\s*(spotlight|shared|party-centric|world)\s*(?:\(([^)]*)\))?\s*:\s*(touch|beat|arc)\s*$')


class Beat:
    __slots__ = ('cls', 'pcs', 'weight', 'value')

    def __init__(self, cls, pcs, weight, value):
        self.cls = cls
        self.pcs = pcs
        self.weight = weight
        self.value = value


def parse_spotlight_beat(s):
    """Parse one beat token '<class>(<PCs>): <weight>' -> Beat, or None if malformed."""
    m = _BEAT_RE.match(s)
    if not m:
        return None
    pcs = []
    if m.group(2):
        pcs = [p.strip() for p in m.group(2).split(',') if p.strip()]
    return Beat(m.group(1), pcs, m.group(3), SPOTLIGHT_WEIGHT[m.group(3)])


class PlayedSession:
    __slots__ = ('num', 'name', 'beats', 'present', 'has_presence')

    def __init__(self, num, name, beats, present, has_presence):
        self.num = num
        self.name = name
        self.beats = beats
        self.present = present
        self.has_presence = has_presence


def get_played_spotlight_sessions(root):
    """Collect played sessions (historian/sessions, recursive) with parsed beats +
    attendance. Returns a list of PlayedSession sorted by num ascending.
    """
    sessions_dir = Path(root) / 'historian' / 'sessions'
    out = []
    if sessions_dir.exists():
        for f in sessions_dir.rglob('*.md'):
            fm = get_frontmatter(f)
            if fm.get('type') != 'session':
                continue
            beats = []
            for b in fm.get('_list_beats', []):
                parsed = parse_spotlight_beat(b)
                if parsed:
                    beats.append(parsed)
            present = list(fm.get('_list_pcs_present', []))
            num = int(re.sub(r'[^0-9]', '', fm.get('session_number', '') or '') or 0)
            out.append(PlayedSession(
                num=num,
                name=fm.get('name'),
                beats=beats,
                present=present,
                has_presence=bool(fm.get('_list_pcs_present')),
            ))
    return sorted(out, key=lambda s: s.num)


def get_spotlight_rotation(sessions, window, active_names):
    """Windowed per-PC rotation tally: solo >= beat = 1.0, shared >= beat = 0.5 each,
    present-only, touches excluded. Returns dict with keys 'turns' (name->float),
    'present' (name->bool), 'fallback' (bool). active_names feeds the fallback when a
    session lacks pcs_present.
    """
    window_sessions = sessions[-window:] if window else list(sessions)
    turns = {}
    present = {}
    fallback = False
    for s in window_sessions:
        if s.has_presence:
            here = s.present
        else:
            fallback = True
            here = active_names
        for n in here:
            present[n] = True
        for b in s.beats:
            if b.value < SPOTLIGHT_WEIGHT['beat']:
                continue
            if b.cls == 'spotlight' and len(b.pcs) >= 1:
                pc = b.pcs[0]
                if pc in here:
                    turns[pc] = turns.get(pc, 0.0) + 1.0
            elif b.cls == 'shared':
                for pc in b.pcs:
                    if pc in here:
                        turns[pc] = turns.get(pc, 0.0) + 0.5
    return {'turns': turns, 'present': present, 'fallback': fallback}


# -- Calendar + timeline helpers (meta/calendar.md) ---------------------------
# Mirror of the calendar block in lib/common.ps1, for the timeline scripts'
# eventual Python conversion (tracked in #5). True scale is NOT a goal -- these
# support rough orientation: ordering + display + a plottable date. A
# timeline_date is a flat string "YYYY[-MM[-DD]]".


class Calendar:
    __slots__ = ('months', 'epoch_year', 'year_suffix', 'year_days')

    def __init__(self, months, epoch_year, year_suffix, year_days):
        self.months = months          # list of (name, days) tuples
        self.epoch_year = epoch_year
        self.year_suffix = year_suffix
        self.year_days = year_days


_INT_RE = re.compile(r'^-?\d+$')


def get_calendar(root):
    """Read the campaign calendar (falls back to the synced template)."""
    path = Path(root) / 'meta' / 'calendar.md'
    if not path.exists():
        path = Path(root) / 'meta' / 'calendar-template.md'
    fm = get_frontmatter(path)
    months = []
    for m in fm.get('_list_months', []):
        parts = m.split(':', 1)
        months.append((parts[0].strip(), int(parts[1].strip())))
    epoch = int(fm['epoch_year']) if fm.get('epoch_year') and _INT_RE.match(fm['epoch_year']) else 0
    year_days = sum(d for _, d in months) if months else 365
    return Calendar(months, epoch, fm.get('year_suffix'), year_days)


def get_date_precision(s):
    """Precision of a timeline_date string: 'year' | 'month' | 'day' | None."""
    if not s:
        return None
    return {1: 'year', 2: 'month', 3: 'day'}.get(len(s.split('-')))


def get_date_parts(s):
    """Split a timeline_date into clamped (year, month, day) ints (clamped so
    custom calendars with >12 months / long months still produce a valid date)."""
    p = s.split('-')
    y = int(p[0])
    m = min(12, max(1, int(p[1]))) if len(p) >= 2 else 1
    d = min(28, max(1, int(p[2]))) if len(p) >= 3 else 1
    return y, m, d


def get_plot_date(s):
    """A date object that can be plotted. Year clamped to >=1 (date's minimum)."""
    from datetime import date as _date
    y, m, d = get_date_parts(s)
    return _date(max(1, y), m, d)


def get_date_sort_key(s):
    """Numeric sort key honoring graded precision (missing month/day sort first)."""
    y, m, d = get_date_parts(s)
    return y * 10000 + m * 100 + d


def get_precision_duration(s, cal):
    """Bar duration string by precision: year -> whole year, month -> that month,
    day -> milestone (0d)."""
    prec = get_date_precision(s)
    if prec == 'year':
        return f"{cal.year_days}d"
    if prec == 'month':
        mi = get_date_parts(s)[1]
        days = cal.months[mi - 1][1] if len(cal.months) >= mi else 30
        return f"{days}d"
    return '0d'


_AXIS_STEPS = [
    (7, '1week'), (14, '2week'), (30, '1month'), (91, '3month'),
    (182, '6month'), (365, '12month'), (730, '24month'), (1825, '60month'),
    (3650, '120month'), (18250, '600month'), (36500, '1200month'),
]


def get_axis_config(min_date, max_date):
    """Tick-count axis resolver: target ~10 ticks, snap to a mermaid-safe value.
    Returns dict with 'tick_interval', 'axis_format', 'days'."""
    span_days = max(1, (max_date - min_date).days)
    raw = span_days / 10
    pick = next((step for step in _AXIS_STEPS if step[0] >= raw), _AXIS_STEPS[-1])
    days, interval = pick
    if days < 30:
        fmt = '%d %b'
    elif days < 365:
        fmt = '%b %Y'
    else:
        fmt = '%Y'
    return {'tick_interval': interval, 'axis_format': fmt, 'days': days}
