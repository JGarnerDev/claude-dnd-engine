"""sky.py -- Aethryn's sky on a given date: day-of-year, the two suns' 18-day night, Fida's phase,
Astra's place on its thousand-year orbit, and the Crawl from the Sky Clock log.

The time system is canon in data/lore/calendar.md; machine values in meta/calendar-homebrew.md;
the running date and the per-session log in scheduler/campaign/_sky-clock.md.
consumers: scripts/sky.py, scripts/session-cards.py (the recap deck's sky slide)
"""

import math
import re
from pathlib import Path

from lib.common import entity_md_files, get_frontmatter, read_text_no_bom, try_int

CAMPAIGN = 'homebrew'
YEAR_DAYS = 360
MONTH_DAYS = 30
SUN_CYCLE = 18
SUN_DRIFT = 24 / SUN_CYCLE          # hours the dim sun slips per day of the cycle
SUN_ANCHOR = 2_427_615              # absolute day of phase 0 (6743-05-16)
FIDA_CYCLE = 29.5
FIDA_FULL = 2_427_619 + 22 / 24     # full on the night of Ashford Day 1 (6743-05-20, 22:00)
GLISTENING_YEARS = 1000
ASTRA_E = 0.94
DAYPART_HOURS = {'dawn': 6, 'morning': 9, 'midday': 12, 'afternoon': 15, 'evening': 19,
                 'night': 22, 'late': 23}
CLOCK = Path('scheduler') / 'campaign' / '_sky-clock.md'
LOG_LINE = re.compile(r'^- \*\*Session (\d+)\*\* · (\d+-\d\d-\d\d) (\d\d:\d\d) · Crawl (\d+) of (\d+) '
                      r'\(began (\d+-\d\d-\d\d)\)', re.M)


def parse_date(s: str) -> tuple:
    """'YYYY-MM-DD' on the 12 x 30-day positional months -> (year, day_of_year)."""
    y, m, d = (int(x) for x in s.split('-'))
    return y, (m - 1) * MONTH_DAYS + d


def absolute_day(s: str) -> int:
    """Days since the impact (year 0, day 1 = 0)."""
    y, doy = parse_date(s)
    return y * YEAR_DAYS + doy - 1


def sun_phase(abs_day: int) -> int:
    return (abs_day - SUN_ANCHOR) % SUN_CYCLE


def sun_offset(phase: int) -> float:
    """Hours the dim sun trails the bright one: 0 at phase 0, 12 at phase 9."""
    return SUN_DRIFT * min(phase, SUN_CYCLE - phase)


def true_dark(phase: int) -> float:
    """Hours of night with neither sun up (equator baseline)."""
    return max(0.0, 12 - sun_offset(phase))


def fida(abs_day: int, hour: float) -> dict:
    """age 0..1 through the cycle (0 = full, 0.5 = new); lit = illuminated fraction."""
    age = ((abs_day + hour / 24 - FIDA_FULL) / FIDA_CYCLE) % 1
    lit = (1 + math.cos(2 * math.pi * age)) / 2
    return {'age': round(age, 4), 'lit': round(lit, 3), 'waxing': age > 0.5}


def kepler(mean_anomaly: float, e: float) -> float:
    """Eccentric anomaly E for M = E - e sin E (Newton)."""
    E = mean_anomaly if e < 0.8 else math.pi
    for _ in range(50):
        d = (E - e * math.sin(E) - mean_anomaly) / (1 - e * math.cos(E))
        E -= d
        if abs(d) < 1e-12:
            break
    return E


def astra(year: int, doy: int) -> dict:
    """Astra on its orbit. Perihelion (the Glistening) at every thousandth year."""
    t = ((year % GLISTENING_YEARS) + (doy - 1) / YEAR_DAYS) / GLISTENING_YEARS
    E = kepler(2 * math.pi * t, ASTRA_E)
    nu = 2 * math.atan2(math.sqrt(1 + ASTRA_E) * math.sin(E / 2), math.sqrt(1 - ASTRA_E) * math.cos(E / 2))
    return {
        'yearInCycle': year % GLISTENING_YEARS,
        'toGlistening': GLISTENING_YEARS - year % GLISTENING_YEARS,
        'next': year // GLISTENING_YEARS + 1,
        'trueAnomaly': round(math.degrees(nu) % 360, 2),
        'radius': round(1 - ASTRA_E * math.cos(E), 4),   # in semi-major axes; 0.06 at the pass
    }


def at(date: str, time: str = '12:00') -> dict:
    """Everything the sky shows at one moment."""
    y, doy = parse_date(date)
    a = absolute_day(date)
    hh, mm = (int(x) for x in time.split(':'))
    hour = hh + mm / 60
    phase = sun_phase(a)
    return {
        'date': date, 'time': time, 'year': y, 'dayOfYear': doy, 'hour': hour,
        'sun': {'phase': phase, 'offset': round(sun_offset(phase), 2), 'trueDark': round(true_dark(phase), 1)},
        'fida': fida(a, hour),
        'astra': astra(y, doy),
    }


def clock_log(root: Path) -> dict:
    """{session: {date, time, crawl, crawlYear, began}} from the Sky Clock's ## Log."""
    path = Path(root) / CLOCK
    if not path.exists():
        return {}
    out = {}
    for m in LOG_LINE.finditer(read_text_no_bom(path)):
        out[int(m[1])] = {'date': m[2], 'time': m[3], 'crawl': int(m[4]), 'crawlYear': int(m[5]),
                          'began': m[6]}
    return out


def _session_moment(root: Path, number: int, log: dict):
    """(date, time) a homebrew session ended, or None. Frontmatter first, then the log."""
    for f in entity_md_files(Path(root) / 'historian' / 'sessions'):
        fm = get_frontmatter(f)
        if try_int(fm.get('session_number')) != number:
            continue
        if (fm.get('campaign') or '').strip().lower() != CAMPAIGN:
            return None
        date = (fm.get('in_world_end_date') or '').strip()
        if not re.fullmatch(r'\d+-\d\d-\d\d', date):
            date = log.get(number, {}).get('date', '')
        if not date:
            return None
        time = (fm.get('in_world_end_time') or '').strip() or log.get(number, {}).get('time', '')
        if not re.fullmatch(r'\d\d:\d\d', time):
            time = f"{DAYPART_HOURS.get((fm.get('daypart') or '').strip(), 12):02d}:00"
        return date, time
    return None


def sky(root: Path, number: int):
    """The recap deck's sky slide for session `number`, or None (Strahd, or no in-world date).
    `prev` is the latest earlier homebrew session with a date, so the slide can sweep from it."""
    log = clock_log(root)
    moment = _session_moment(root, number, log)
    if not moment:
        return None
    out = at(*moment)
    entry = log.get(number)
    if entry:
        out.update(crawl=entry['crawl'], crawlYear=entry['crawlYear'],
                   crawlDay=absolute_day(moment[0]) - absolute_day(entry['began']) + 1)
    else:
        out.update(crawl=None, crawlYear=None, crawlDay=None)
    out['prev'] = None
    for n in sorted((s for s in log if s < number), reverse=True):
        m = _session_moment(root, n, log)
        if m:
            out['prev'] = at(*m)
            break
    return out
