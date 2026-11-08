#!/usr/bin/env python3
# sky.py -- Aethryn's sky on a date: day of year, sun phase and hours of true dark, Fida, Astra,
#   and (with --crawl-start) the day of the Crawl. Maths in scripts/lib/sky.py.
# consumers: scheduler/campaign/_sky-clock.md (the Sky Clock's /session and /recap steps)
# Usage: uv run scripts/sky.py <YYYY-MM-DD> [--time HH:MM] [--crawl-start <YYYY-MM-DD>] [--days <n>]
#   --days: also print the next n nights' true dark (planning a journey or a wait)

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.sky import ASTRA_E, SUN_CYCLE, absolute_day, at, sun_phase, true_dark  # noqa: E402

FIDA_NAMES = [(0.03, 'full'), (0.22, 'waning gibbous'), (0.28, 'last quarter'), (0.47, 'waning crescent'),
              (0.53, 'new'), (0.72, 'waxing crescent'), (0.78, 'first quarter'), (0.97, 'waxing gibbous'),
              (1.01, 'full')]


def fida_name(age: float) -> str:
    return next(n for edge, n in FIDA_NAMES if age < edge)


def main() -> None:
    ap = argparse.ArgumentParser(description='Aethryn sky on a date.')
    ap.add_argument('date')
    ap.add_argument('--time', default='12:00')
    ap.add_argument('--crawl-start')
    ap.add_argument('--days', type=int, default=0)
    a = ap.parse_args()

    s = at(a.date, a.time)
    print(f"{s['date']} {s['time']} · year {s['year']}, day {s['dayOfYear']} of 360")
    if a.crawl_start:
        print(f"Crawl day: {absolute_day(a.date) - absolute_day(a.crawl_start) + 1}")
    sun = s['sun']
    print(f"Sun phase: {sun['phase']} of {SUN_CYCLE} · red sun trails by {sun['offset']}h · "
          f"true dark tonight: {sun['trueDark']}h")
    f = s['fida']
    print(f"Fida: {fida_name(f['age'])} ({round(f['lit'] * 100)}% lit)")
    ast = s['astra']
    out = round(100 * ast['radius'] / (1 + ASTRA_E))
    print(f"Astra: year {ast['yearInCycle']} of the cycle, {out}% of the way out to its far point · "
          f"Glistening {ast['next']} in {ast['toGlistening']} years")
    if a.days:
        base = absolute_day(a.date)
        nights = [f"+{i}: {true_dark(sun_phase(base + i)):.1f}h" for i in range(1, a.days + 1)]
        print('Next nights, true dark: ' + ', '.join(nights))


if __name__ == '__main__':
    main()
