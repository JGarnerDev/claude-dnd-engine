#!/usr/bin/env python3
"""timeline-gantt.py -- generate the world-history and party-history gantt charts.
consumers: .claude/commands/timeline.md

Reads entity frontmatter (timeline_date / in_world_end_date) and emits ONE mermaid
gantt per chart file, plus a reference doc. Each chart auto-scales to its OWN span
(no shared axis). Goal is rough orientation, not true scale -- the tick-count
resolver targets ~10 readable ticks. Secret events excluded unless --full.

Usage: python scripts/timeline-gantt.py [--full] [--root <repo root>]
"""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (  # noqa: E402
    ROOT, ci_eq, digits_int, get_calendar, get_date_parts, get_date_precision,
    get_date_sort_key, get_plot_date, get_precision_duration, get_axis_config,
    get_frontmatter,
)


def write_no_bom(path: Path, text: str) -> None:
    """Write UTF-8 WITHOUT a BOM (the leading ```mermaid fence / markdownlint break on one)."""
    path.write_text(text, encoding='utf-8')


def format_label(s, max_len: int = 30) -> str:
    """Sanitize a task label: strip mermaid-breaking chars, truncate."""
    if not s:
        return 'Unnamed'
    for ch in ':#;':
        s = s.replace(ch, ' ')
    s = s.strip()
    if len(s) > max_len:
        s = s[:max_len - 2].rstrip() + '..'
    return s


def format_date_label(s, cal) -> str:
    """Human label for a timeline_date, honoring precision + calendar month names."""
    y, m, d = get_date_parts(s)
    suffix = f" {cal.year_suffix}" if cal.year_suffix else ''
    yr = f"{y}{suffix}"
    prec = get_date_precision(s)
    if prec == 'year':
        return yr
    month_name = cal.months[m - 1][0] if len(cal.months) >= m else f"M{m}"
    if prec == 'month':
        return f"{month_name} {yr}"
    if prec == 'day':
        return f"{month_name} {d}, {yr}"
    return s


def is_secret(fm) -> bool:
    """Is this entity secret? (hidden unless --full)"""
    return ci_eq(fm.get('state'), 'secret') or ci_eq(fm.get('awareness'), 'secret')


def collect_world_events(root: Path, full: bool) -> list:
    """Collect world events from data/ + historian/ events."""
    out = []
    for sub in ('data/events', 'historian/events'):
        dir_path = root / sub
        if not dir_path.exists():
            continue
        for f in sorted(dir_path.rglob('*.md')):
            fm = get_frontmatter(f)
            if not ci_eq(fm.get('type'), 'event'):
                continue
            if not fm.get('timeline_date'):
                continue
            secret = is_secret(fm)
            if secret and not full:
                continue
            out.append({
                'name': fm.get('name'),
                'date': fm['timeline_date'],
                'secret': secret,
                'state': fm.get('state'),
                'kind': 'event',
                'end': None,
                'sort': get_date_sort_key(fm['timeline_date']),
            })
    out.sort(key=lambda it: it['sort'])
    return out


def collect_party_items(root: Path) -> list:
    """Collect party history: sessions (milestones) + acts (span bars)."""
    out = []
    sdir = root / 'historian' / 'sessions'
    if sdir.exists():
        for f in sorted(sdir.rglob('*.md')):
            fm = get_frontmatter(f)
            if not ci_eq(fm.get('type'), 'session'):
                continue
            if not fm.get('in_world_end_date'):
                continue
            num = digits_int(fm.get('session_number'), default=0)
            label = f"S{num} {fm.get('name')}" if num else fm.get('name')
            out.append({
                'name': label,
                'date': fm['in_world_end_date'],
                'kind': 'session',
                'end': None,
                'secret': False,
                'state': fm.get('state'),
                'sort': get_date_sort_key(fm['in_world_end_date']),
            })
    adir = root / 'historian' / 'acts'
    if adir.exists():
        for f in sorted(adir.rglob('*.md')):
            fm = get_frontmatter(f)
            if not ci_eq(fm.get('type'), 'act'):
                continue
            if not fm.get('timeline_start'):
                continue
            out.append({
                'name': fm.get('name'),
                'date': fm['timeline_start'],
                'kind': 'act',
                'end': fm.get('timeline_end'),
                'secret': False,
                'state': fm.get('state'),
                'sort': get_date_sort_key(fm['timeline_start']),
            })
    out.sort(key=lambda it: it['sort'])
    return out


# mermaid theme/sizing init (the locked look)
INIT = """%%{init: {'theme':'base','themeVariables':{
  'fontFamily':'sans-serif',
  'sectionBkgColor':'#1f2937','altSectionBkgColor':'#111827',
  'taskBkgColor':'#3b82f6','taskBorderColor':'#93c5fd','taskTextColor':'#ffffff',
  'taskTextOutsideColor':'#cbd5e1',
  'activeTaskBkgColor':'#14b8a6','activeTaskBorderColor':'#5eead4',
  'doneTaskBkgColor':'#f59e0b','doneTaskBorderColor':'#fcd34d',
  'critBkgColor':'#ef4444','critBorderColor':'#fca5a5','gridColor':'#243042'
},'gantt':{
  'barHeight':30,'barGap':8,'fontSize':14,'sectionFontSize':16,
  'leftPadding':140,'topPadding':45,'gridLineStartPadding':40
}}}%%"""


def _add_months(d, months: int):
    """Add whole months to a date, clamping the day (mirrors PowerShell AddMonths)."""
    from datetime import date as _date
    total = (d.year * 12 + (d.month - 1)) + months
    year, month = divmod(total, 12)
    month += 1
    return _date(year, month, min(d.day, 28))


def build_gantt(title: str, section: str, items: list, cal) -> str:
    """Build one gantt block from task rows."""
    if not items:
        return "_(no dated entries yet)_"
    dates = [get_plot_date(it['date']) for it in items]
    dmin = min(dates)
    dmax = max(dates)
    for it in items:
        if it['end']:
            e = get_plot_date(it['end'])
            if e > dmax:
                dmax = e
    axis = get_axis_config(dmin, dmax)

    # Mermaid's tickInterval grammar caps at small month-multiples; a span needing a coarser
    # tick (> ~1 year/tick) can't be ticked, so a real axis floods with gridlines. Switch to
    # COMPRESSED SEQUENCE mode: even spacing, one tick per event, real date in the label.
    compressed = axis['days'] > 365

    lines = ['```mermaid', INIT, 'gantt', f"    title {title}", '    dateFormat YYYY-MM-DD']
    if compressed:
        lines.append('    axisFormat  ')       # blank: synthetic dates are meaningless
        lines.append('    tickInterval 1month')
    else:
        lines.append(f"    axisFormat {_axis_fmt(axis['axis_format'])}")
        lines.append(f"    tickInterval {axis['tick_interval']}")
    lines.append(f"    section {section}")

    from datetime import date as _date
    synth_base = _date(2000, 1, 1)
    for i, it in enumerate(items, start=1):
        task_id = f"t{i}"
        if compressed:
            start = _add_months(synth_base, i - 1).strftime('%Y-%m-%d')
            label = f"{format_label(it['name'], 24)} ({format_date_label(it['date'], cal)})"
            tag = 'crit, ' if it['secret'] else ('done, ' if _is_ancient(it['state']) else '')
            lines.append(f"    {label} :{tag}milestone, {task_id}, {start}, 0d")
            continue
        label = format_label(it['name'])
        start = get_plot_date(it['date']).strftime('%Y-%m-%d')
        if it['kind'] == 'act':
            end = get_plot_date(it['end']) if it['end'] else _add_days(get_plot_date(it['date']), 30)
            dur = max(1, (end - get_plot_date(it['date'])).days)
            lines.append(f"    {label} :active, {task_id}, {start}, {int(dur)}d")
        elif it['kind'] == 'session':
            lines.append(f"    {label} :milestone, {task_id}, {start}, 0d")
        else:
            tag = 'crit, ' if it['secret'] else ('done, ' if _is_ancient(it['state']) else '')
            if get_date_precision(it['date']) == 'day':
                lines.append(f"    {label} :{tag}milestone, {task_id}, {start}, 0d")
            else:
                dur = get_precision_duration(it['date'], cal)
                lines.append(f"    {label} :{tag}{task_id}, {start}, {dur}")
    # axis pad: one slot past the last so edge labels have room
    if compressed:
        pad_date = _add_months(synth_base, len(items)).strftime('%Y-%m-%d')
    else:
        pad_date = _add_days(dmax, axis['days']).strftime('%Y-%m-%d')
    lines.append(f"    . :pad, {pad_date}, 0d")
    lines.append('```')
    return '\n'.join(lines) + '\n'


def _is_ancient(state) -> bool:
    return ci_eq(state, 'ancient') or ci_eq(state, 'legendary')


def _add_days(d, days: int):
    from datetime import timedelta
    return d + timedelta(days=days)


def _axis_fmt(py_fmt: str) -> str:
    """common.py's get_axis_config returns strftime tokens (%d %b / %b %Y / %Y);
    mermaid axisFormat wants the same %-tokens, so pass through unchanged."""
    return py_fmt


REF_TEMPLATE = """# Campaign Timeline

Generated {stamp} - mode: {mode}. Regenerated by `/timeline` (script: `scripts/timeline-gantt.py`).
Do not hand-edit the chart files - they are overwritten each run. This reference doc is yours to keep.

## World history

![[world-history]]

## Party history

![[party-history]]

## Legend

- **blue bar** - world event (width = date precision: year-wide / month-wide)
- **amber** - completed major event
- **teal bar** - party act span
- **red** - secret event (only in `--full`)
- **diamond** - milestone: a day-precise point (battles, sessions)

Axes are independent: world history scales to its own span (may be millennia), party
history to its own (months/years). Ticks give rough orientation, not true proportion.
"""


def main() -> None:
    parser = argparse.ArgumentParser(description='Generate world/party gantt charts.')
    parser.add_argument('--full', action='store_true',
                        help='include secret events')
    parser.add_argument('--root', default=str(ROOT), help='repo root')
    args = parser.parse_args()

    root = Path(args.root).resolve()
    cal = get_calendar(root)

    world = collect_world_events(root, args.full)
    party = collect_party_items(root)

    out_dir = root / 'historian' / 'timeline'
    out_dir.mkdir(parents=True, exist_ok=True)

    write_no_bom(out_dir / 'world-history.md', build_gantt('World History', 'World', world, cal))
    write_no_bom(out_dir / 'party-history.md', build_gantt('Party History', 'Party', party, cal))

    from datetime import date as _date
    stamp = _date.today().strftime('%Y-%m-%d')
    mode = 'FULL (includes secret events)' if args.full else 'player-safe (secret events hidden)'
    write_no_bom(out_dir / 'timeline.md', REF_TEMPLATE.format(stamp=stamp, mode=mode))

    print(f"Wrote timeline to {out_dir}")
    print(f"  world-history.md  ({len(world)} event(s))")
    print(f"  party-history.md  ({len(party)} item(s))")
    print(f"  timeline.md       (reference doc)")


if __name__ == '__main__':
    main()
