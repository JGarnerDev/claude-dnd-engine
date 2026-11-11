"""common.py -- shared helpers imported by the scripts in scripts/.
consumers: scripts/entity-graph.py, scripts/free-entities.py, scripts/location-entities.py,
  scripts/party-status.py, scripts/route-cities.py, scripts/session-brief.py,
  scripts/session-state.py, scripts/todo-brief.py, scripts/inventory-brief.py,
  scripts/threads-brief.py, scripts/spotlight-balance.py,
  scripts/timeline-gantt.py, scripts/timeline-data.py,
  scripts/monster-lookup.py, scripts/naming-status.py, scripts/pitch-brief.py,
  scripts/contribution-balance.py, scripts/region-world-context.py,
  scripts/region-scale.py, scripts/region-brief.py, scripts/transcribe.py,
  scripts/commands-list.py
-- update those scripts if a function signature or output shape changes here.
"""

import os
import re
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Optional


# -- Output encoding ----------------------------------------------------------
# On Windows, non-tty stdout (every captured/piped run -- the agent's path) is
# encoded with the locale codepage (cp1252), which crashes on emoji and mangles
# non-ASCII. Force UTF-8 once so the em-dash and 🎲/🐉 glyphs round-trip. Mirrors
# the `[Console]::OutputEncoding = UTF8` the PowerShell originals set.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


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


def color(text: str, name: str) -> str:
    """Wrap text in an ANSI color (matching a PowerShell -ForegroundColor name)."""
    if not _USE_COLOR:
        return text
    code = _ANSI.get(name.lower())
    if not code:
        return text
    return f"\033[{code}m{text}\033[0m"


def cwrite(text: str = '', name: str = None, end: str = '\n') -> None:
    """Print one line, optionally colored. Mirror of Write-Host."""
    if name:
        text = color(text, name)
    print(text, end=end)


# -- Entity file discovery ----------------------------------------------------
def entity_md_files(base) -> list:
    """Every entity .md under `base`, recursive, sorted case-insensitively by filename.

    Sessions get a folder each (`scheduler/sessions/Session 29 The Mistake/...`), so every
    consumer has to recurse rather than glob one level. Names starting with `_` are derived
    views -- flow charts, scratch -- and are never entities; this is the same exclusion
    `validate.ps1` applies.
    """
    base = Path(base)
    if not base.exists():
        return []
    return sorted(
        (f for f in base.rglob('*.md')
         if not f.name.startswith('_') and f.name != 'CLAUDE.md'),
        key=lambda f: f.name.lower())


# -- File reading -------------------------------------------------------------
# A UTF-8 BOM breaks `^`-anchored / first-line regex matches (frontmatter fence,
# cliffhanger, thread-state), so every reader strips it here rather than each
# script remembering to.
def read_text_no_bom(path) -> str:
    """Read a file as UTF-8 with any leading BOM stripped."""
    raw = Path(path).read_text(encoding='utf-8')
    if raw and raw[0] == '﻿':
        raw = raw[1:]
    return raw


# -- Frontmatter --------------------------------------------------------------
_FM_BLOCK_RE = re.compile(r'^---\r?\n(.+?)\r?\n---', re.DOTALL)
_WIKI_SCALAR_RE = re.compile(r'^(\w[\w_]*):\s*\[\[([^\]]+)\]\]')
_SCALAR_RE = re.compile(r'^(\w[\w_]*):\s*"?([^"#\r\n]*)"?\s*$')
_LIST_WIKI_RE = re.compile(r'^\s+-\s+\[\[([^\]]+)\]\]')
_LIST_PLAIN_RE = re.compile(r'^\s+-\s+"?([^"#\r\n]+)"?\s*$')


def get_frontmatter(path) -> dict:
    """Parse a file's YAML-ish frontmatter into a dict. See get_frontmatter_from_text."""
    return get_frontmatter_from_text(read_text_no_bom(path))


def get_frontmatter_from_text(raw: str) -> dict:
    """Parse YAML-ish frontmatter from already-read text (no second disk read).

    Scalars: fm['key']. Wikilink scalars are unwrapped and alias-stripped
    ([[Name|alias]] -> Name). List items (plain or wikilink) accumulate under
    fm['_list_<key>'].
    """
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


# -- Session recordings -------------------------------------------------------
# The group records sessions instead of taking notes (see recaps/CLAUDE.md). A
# recording in recaps/audio/ with no matching transcript is an
# untranscribed session; both briefs and session-start.py surface it, so the check
# lives here once.
AUDIO_EXTS = {'.aac', '.m4a', '.mp3', '.wav', '.flac', '.ogg', '.opus', '.webm', '.mp4', '.mkv'}


def pending_recordings(root) -> list:
    """Recordings awaiting transcription. Returns [(slug, track_count), ...].

    A folder of per-speaker tracks counts its audio files; a single mixed file counts 1.
    """
    audio_dir = Path(root) / 'audio' if Path(root).name == 'recaps' else Path(root) / 'recaps' / 'audio'
    out_dir = audio_dir.parent / 'transcripts'
    if not audio_dir.exists():
        return []
    pending = []
    for p in sorted(audio_dir.iterdir()):
        if p.name.startswith('.'):
            continue
        if p.is_dir():
            slug, n = p.name, len([q for q in p.iterdir() if q.suffix.lower() in AUDIO_EXTS])
        elif p.suffix.lower() in AUDIO_EXTS:
            slug, n = p.stem, 1
        else:
            continue
        if not (out_dir / (slug + '.md')).exists():
            pending.append((slug, n))
    return pending


# -- Semantic index staleness -------------------------------------------------
# Must match index-entities.py's default --dirs, or a commit to an indexed dir that
# isn't listed here leaves the index silently stale. Both briefs report it, so the
# check lives here once.
INDEXED_DIRS = ('data/', 'historian/', 'scheduler/', 'spitball/')


def index_staleness(root) -> Optional[tuple]:
    """Semantic index freshness. Returns None if never built, else (built_date, sha, commits).

    `commits` lists `git log --oneline` lines touching INDEXED_DIRS since the stamped
    build SHA; empty means fresh. Stamp file: vector-index/.index-built (line 1 ISO
    timestamp, line 2 commit SHA).
    """
    stamp = Path(root) / 'vector-index' / '.index-built'
    if not stamp.exists():
        return None
    lines = read_text_no_bom(stamp).splitlines()
    built = lines[0][:10] if lines else ''
    sha = lines[1].strip() if len(lines) > 1 else ''
    commits = []
    if sha:
        try:
            out = subprocess.run(
                ['git', '-C', str(root), 'log', '--oneline', f'{sha}..HEAD', '--', *INDEXED_DIRS],
                capture_output=True, text=True, check=False)
            commits = [ln for ln in out.stdout.splitlines() if ln.strip()]
        except Exception:
            pass
    return built, sha, commits


# -- Comparison helpers -------------------------------------------------------
# PowerShell's -eq/-ne/-like/-match fold case by default; these restore that at
# comparison time (values keep their original case for display).
def ci_eq(a, b) -> bool:
    """Case-insensitive equality, matching PowerShell -eq. None-safe."""
    if a is None or b is None:
        return a is b
    return str(a).lower() == str(b).lower()


def ci_contains(haystack, needle) -> bool:
    """Case-insensitive substring test, matching PowerShell -like '*needle*'."""
    if haystack is None or needle is None:
        return False
    return str(needle).lower() in str(haystack).lower()


# -- Active campaign + DM -----------------------------------------------------
def get_active_campaign(root) -> Optional[dict]:
    """The campaign file with `state: active` in scheduler/campaign/ (trackers, the
    `_*.md` files, skipped), as {'name', 'dm', 'path'}; None when no campaign is active.
    Its `dm:` field is the only record of who the DM is (meta/dm-rotation.md)."""
    camp_dir = Path(root) / 'scheduler' / 'campaign'
    if not camp_dir.exists():
        return None
    for f in sorted(camp_dir.glob('*.md')):
        if f.name.startswith('_'):
            continue
        fm = get_frontmatter(f)
        if ci_eq(fm.get('state'), 'active'):
            return {'name': fm.get('name') or f.stem,
                    'dm': (fm.get('dm') or '').strip().strip('"') or None,
                    'path': f}
    return None


# -- Numeric coercion + formatting --------------------------------------------
_DIGITS_RE = re.compile(r'[^0-9]')


def digits_int(s, default: int = 0) -> int:
    """Int from a string after stripping non-digits (e.g. 'S12' -> 12)."""
    stripped = _DIGITS_RE.sub('', str(s or ''))
    return int(stripped) if stripped else default


def try_int(s) -> Optional[int]:
    """Int if s is a clean integer string, else None (mirror of [int]::TryParse)."""
    try:
        return int(str(s).strip())
    except (TypeError, ValueError):
        return None


def fmt_num(n: float) -> str:
    """Render a float as an int when whole (1.0 -> '1', 0.5 -> '0.5')."""
    return str(int(n)) if float(n).is_integer() else str(n)


# -- Date parsing -------------------------------------------------------------
_DATE_FORMATS = ('%Y-%m-%d', '%m/%d/%Y', '%Y/%m/%d', '%d-%m-%Y',
                 '%Y-%m-%dT%H:%M', '%Y-%m-%dT%H:%M:%S', '%B %d, %Y', '%B %d %Y')


def try_parse_date(s) -> Optional[date]:
    """Parse a planned_date string to a date, or None. Broadened toward
    PowerShell [datetime]::TryParse (ISO datetimes + 'July 1, 2026' forms)."""
    if not s:
        return None
    text = str(s).strip()
    for fmt in _DATE_FORMATS:
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    return None


# -- Party table --------------------------------------------------------------
_PARTY_BLOCK_RE = re.compile(r'## Party\r?\n([\s\S]+?)(\r?\n##|\Z)')


def parse_party_table(campaign_file) -> list:
    """Parse the '## Party' markdown table into a list of column-lists (one per
    PC row, header and separator excluded). Rows with <4 cells are kept as-is;
    callers guard on length. Returns [] when there is no Party section."""
    content = read_text_no_bom(campaign_file)
    m = _PARTY_BLOCK_RE.search(content)
    if not m:
        return []
    rows = []
    for line in m.group(1).split('\n'):
        line = line.rstrip('\r')
        if not line.startswith('|') or line.startswith('|---'):
            continue
        cols = [c.strip() for c in line.split('|') if c != '']
        if not cols or ci_eq(cols[0], 'Player'):
            continue
        rows.append(cols)
    return rows


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


def parse_spotlight_beat(s: str) -> Optional['Beat']:
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


def get_played_spotlight_sessions(root) -> list:
    """Collect played sessions (historian/sessions, recursive) with parsed beats +
    attendance. Returns a list of PlayedSession sorted by num ascending.
    """
    sessions_dir = Path(root) / 'historian' / 'sessions'
    out = []
    if sessions_dir.exists():
        for f in sessions_dir.rglob('*.md'):
            fm = get_frontmatter(f)
            if not ci_eq(fm.get('type'), 'session'):
                continue
            beats = []
            for b in fm.get('_list_beats', []):
                parsed = parse_spotlight_beat(b)
                if parsed:
                    beats.append(parsed)
            present = list(fm.get('_list_pcs_present', []))
            num = digits_int(fm.get('session_number', ''))
            out.append(PlayedSession(
                num=num,
                name=fm.get('name'),
                beats=beats,
                present=present,
                has_presence=bool(fm.get('_list_pcs_present')),
            ))
    return sorted(out, key=lambda s: s.num)


def get_spotlight_rotation(sessions: list, window: int, active_names: list) -> dict:
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
# Consumed by the timeline scripts (timeline-gantt.py, timeline-data.py). True
# scale is NOT a goal -- these support rough orientation: ordering + display +
# a plottable date. A timeline_date is a flat string "YYYY[-MM[-DD]]".


class Calendar:
    __slots__ = ('months', 'epoch_year', 'year_suffix', 'year_days')

    def __init__(self, months, epoch_year, year_suffix, year_days):
        self.months = months          # list of (name, days) tuples
        self.epoch_year = epoch_year
        self.year_suffix = year_suffix
        self.year_days = year_days


_INT_RE = re.compile(r'^-?\d+$')


def campaign_calendar_path(root, campaign: str) -> Path:
    """Where a campaign's own calendar lives: meta/calendar-<slug>.md. Each world
    (season axis) may keep its own months; one without falls back to get_calendar's
    shared file."""
    return Path(root) / 'meta' / f'calendar-{campaign}.md'


def get_calendar(root, campaign: Optional[str] = None) -> Calendar:
    """Read the calendar: the campaign's own (meta/calendar-<slug>.md) when one is
    named and exists, else the shared meta/calendar.md, else the synced template."""
    path = campaign_calendar_path(root, campaign) if campaign else None
    if path is None or not path.exists():
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


def split_date(s: str) -> list:
    """Split a "YYYY[-MM[-DD]]" timeline_date into its string parts. A leading
    minus is a pre-epoch year ("-5256-02" -> ["-5256", "02"]), not a separator."""
    neg = s.startswith('-')
    p = s[1:].split('-') if neg else s.split('-')
    if neg:
        p[0] = '-' + p[0]
    return p


def get_date_precision(s) -> Optional[str]:
    """Precision of a timeline_date string: 'year' | 'month' | 'day' | None."""
    if not s:
        return None
    return {1: 'year', 2: 'month', 3: 'day'}.get(len(split_date(s)))


def get_date_parts(s: str) -> tuple:
    """Split a timeline_date into clamped (year, month, day) ints (clamped so
    custom calendars with >12 months / long months still produce a valid date)."""
    p = split_date(s)
    y = int(p[0])
    m = min(12, max(1, int(p[1]))) if len(p) >= 2 else 1
    d = min(28, max(1, int(p[2]))) if len(p) >= 3 else 1
    return y, m, d


def get_plot_date(s: str) -> date:
    """A date object that can be plotted. Year clamped to >=1 (date's minimum)."""
    y, m, d = get_date_parts(s)
    return date(max(1, y), m, d)


def get_date_sort_key(s: str) -> int:
    """Numeric sort key honoring graded precision (missing month/day sort first)."""
    y, m, d = get_date_parts(s)
    return y * 10000 + m * 100 + d


def get_precision_duration(s: str, cal: Calendar) -> str:
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


def get_axis_config(min_date: date, max_date: date) -> dict:
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
