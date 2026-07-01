#!/usr/bin/env python3
"""timeline-data.py -- extract the timeline data blob and inject it into the
self-contained HTML artifact (M2 of the timeline-view overhaul).
consumers: .claude/commands/timeline.md, CLAUDE.md (scripts table)

Reads entity frontmatter (events, sessions, acts, chronicle beats) and builds
the JSON shape app/components/charts/timeline/timeline.js consumes:
  { calendar:{epochLabel,months:[{name,days}]}, events:[...], spans:[...] }
Then rewrites the data sentinel inside the prebuilt shell
(app/pages/demo/dist/timeline.html, produced by `npm run build:timeline`) and
writes the result to historian/timeline/timeline.html.

No node needed here -- the JS/CSS are already bundled into the shell; this only
swaps the data line. Secret events are dropped entirely in the default
(player-safe) export so they can't leak from the artifact; with --full they are
emitted carrying `secret: true` (only the DM viewpoint shows them). Every beat
with a known_by also carries `knownBy`, which drives the chart's "Known by"
viewpoint filter -- pick a character to scope the chart to what they know.

Usage: python scripts/timeline-data.py [--full] [--json-only] [--root <repo root>] [--shell <path>]
"""

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (  # noqa: E402
    ROOT, ci_eq, digits_int, get_calendar, get_frontmatter,
)


def is_secret(fm) -> bool:
    return ci_eq(fm.get('state'), 'secret') or ci_eq(fm.get('awareness'), 'secret')


def dedupe_ci(items: list) -> list:
    """Order-preserving case-insensitive dedup, keeping first-seen casing.
    Mirror of PowerShell Select-Object -Unique (which folds case)."""
    seen = set()
    out = []
    for it in items:
        key = it.lower()
        if key not in seen:
            seen.add(key)
            out.append(it)
    return out


def get_beat_sort(s: str) -> int:
    """Unclamped chronological sort key for the JSON array. (common.py's
    get_date_sort_key clamps day<=28 for date safety, which ties days 29-31.
    render.js re-sorts by true day index, so this is purely for a tidy JSON order.)"""
    p = s.split('-')
    y = int(p[0])
    m = int(p[1]) if len(p) >= 2 else 0
    d = int(p[2]) if len(p) >= 3 else 0
    return y * 10000 + m * 100 + d


def get_rel_source(full_path: Path, root: Path) -> str:
    """Path to a source .md, relative to the output dir (historian/timeline/).
    The click-to-open handler resolves it against the artifact's own URL."""
    rel = full_path.resolve().relative_to(root).as_posix()
    return f"../../{rel}"


def get_keywords(fm) -> list:
    """Related-entity names for search: union of relates_to + participants
    (already unwrapped from [[wikilinks]] and alias-stripped). Lets a beat be
    found by a name not in its label."""
    names = []
    for k in ('_list_relates_to', '_list_participants'):
        for v in fm.get(k, []) or []:
            if v:
                names.append(v)
    return dedupe_ci(names)


def add_weight(obj: dict, fm) -> None:
    """importance -> render weight flags (major bolds + enlarges, minor dims)."""
    imp = fm.get('importance')
    if ci_eq(imp, 'major') or ci_eq(fm.get('state'), 'ancient') or ci_eq(fm.get('state'), 'legendary'):
        obj['major'] = True
    elif ci_eq(imp, 'minor'):
        obj['minor'] = True


def _unwrap_wikilink(s: str) -> str:
    return re.sub(r'\[\[|\]\]', '', s).strip()


def add_campaign(obj: dict, fm) -> None:
    """campaign tag -> beat (slug). Wikilink-wrapped values ([[Name]]) are unwrapped;
    agnostic beats (no campaign field) carry none, so the app's campaign selector
    shows them under every campaign."""
    c = fm.get('campaign')
    if c:
        obj['campaign'] = _unwrap_wikilink(c)


def get_campaigns(root: Path) -> list:
    """Known campaigns (type:campaign under scheduler/ + historian/), for the app's
    campaign selector. Each carries slug, display label, and whether it's active."""
    out = []
    for sub in ('scheduler/campaign', 'historian/campaign'):
        dir_path = root / sub
        if not dir_path.exists():
            continue
        for f in sorted(dir_path.rglob('*.md')):
            fm = get_frontmatter(f)
            if not ci_eq(fm.get('type'), 'campaign'):
                continue
            slug = _unwrap_wikilink(fm['campaign']) if fm.get('campaign') else ''
            active = ci_eq(str(fm.get('active', '')).strip(), 'true') or ci_eq(fm.get('state'), 'active')
            out.append({'slug': slug, 'label': fm.get('name'), 'active': active})
    return out


class _NameTypeCache:
    """Lazy name -> {type, subtype} map across the three graph layers, so the event
    auto-fan can tell a participant faction from an NPC. Built once and cached."""

    def __init__(self, root: Path):
        self.root = root
        self._map = None

    def get(self) -> dict:
        if self._map is not None:
            return self._map
        m = {}
        for layer in ('data', 'historian', 'scheduler'):
            dir_path = self.root / layer
            if not dir_path.exists():
                continue
            for f in sorted(dir_path.rglob('*.md')):
                fm = get_frontmatter(f)
                n, t = fm.get('name'), fm.get('type')
                if n and t and n not in m:
                    m[n] = {'type': t, 'subtype': fm.get('subtype')}
        self._map = m
        return m


def get_lane_category(info) -> str:
    """Lane category for an auto-fanned participant: factions -> faction; characters
    split by subtype. Returns None for types that don't get their own lane."""
    if not info:
        return None
    if ci_eq(info['type'], 'faction'):
        return 'faction'
    if ci_eq(info['type'], 'character'):
        sub = info.get('subtype')
        if ci_eq(sub, 'npc'):
            return 'npc'
        if ci_eq(sub, 'antagonist'):
            return 'antagonist'
        return 'character'
    return None


def resolve_event_tracks(fm, name_types: _NameTypeCache) -> list:
    """Resolve the lane(s) a world event plots on (meta/events.md "Track conventions"):
    explicit track: wins; else auto-fan onto member lanes from participants/relates_to;
    else fall back to the campaign-prefixed world lane."""
    if fm.get('track'):
        return [fm['track']]
    name_map = name_types.get()
    tracks = []
    for k in ('_list_participants', '_list_relates_to'):
        for name in fm.get(k, []) or []:
            if not name:
                continue
            cat = get_lane_category(name_map.get(name))
            if cat:
                tracks.append(f"{cat}:{name}")
    uniq = dedupe_ci(tracks)
    if uniq:
        return uniq
    campaign = fm.get('campaign') or ''
    return [f"world:{campaign}"] if campaign else ['world']


def collect_event_beats(root: Path, full: bool, name_types: _NameTypeCache) -> list:
    """World events: type:event with a timeline_date."""
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
            # Canon-pending (exists:false): out-of-world "not yet ratified". Dropped
            # from player-safe exports; under --full it rides as a `draft` beat.
            draft = ci_eq(str(fm.get('exists', '')).strip(), 'false')
            if draft and not full:
                continue
            kb = [v for v in (fm.get('_list_known_by') or []) if v]
            kw = get_keywords(fm)
            for track in resolve_event_tracks(fm, name_types):
                beat = {
                    'date': fm['timeline_date'],
                    'label': fm.get('name'),
                    'track': track,
                    'source': get_rel_source(f, root),
                }
                if secret:
                    beat['secret'] = True
                if draft:
                    beat['draft'] = True
                if kb:
                    beat['knownBy'] = list(kb)
                add_weight(beat, fm)
                add_campaign(beat, fm)
                if kw:
                    beat['keywords'] = list(kw)
                out.append({'beat': beat, 'sort': get_beat_sort(beat['date'])})
    return out


def collect_session_beats(root: Path) -> tuple:
    """Party sessions: in_world_end_date, falling back to played/planned_date.
    Returns (beats, fallback_count)."""
    out = []
    fallback = 0
    dir_path = root / 'historian' / 'sessions'
    if not dir_path.exists():
        return out, fallback
    for f in sorted(dir_path.rglob('*.md')):
        fm = get_frontmatter(f)
        if not ci_eq(fm.get('type'), 'session'):
            continue
        date = fm.get('in_world_end_date')
        if not date:
            date = fm.get('played_date') or fm.get('planned_date')
            if date:
                fallback += 1
        if not date:
            continue
        num = digits_int(fm.get('session_number'), default=0)
        beat = {
            'date': date,
            'label': f"S{num} {fm.get('name')}" if num else fm.get('name'),
            'track': 'party',
            'session': True,
            'source': get_rel_source(f, root),
        }
        add_weight(beat, fm)
        add_campaign(beat, fm)
        kw = get_keywords(fm)
        if kw:
            beat['keywords'] = list(kw)
        out.append({'beat': beat, 'sort': get_beat_sort(date)})
    return out, fallback


def collect_chronicle_beats(root: Path) -> list:
    """Chronicle beats: a `chronicle:` list of 'category | member | date | label | flags'
    embedded in an entity. Track = 'category:member'. Scoped to historian/scheduler."""
    out = []
    for layer in ('historian', 'scheduler'):
        dir_path = root / layer
        if not dir_path.exists():
            continue
        for f in sorted(dir_path.rglob('*.md')):
            fm = get_frontmatter(f)
            rows = fm.get('_list_chronicle')
            if not rows:
                continue
            for row in rows:
                p = [c.strip() for c in row.split('|')]
                if len(p) < 4:
                    continue
                category, member, date, label = p[0], p[1], p[2], p[3]
                flags = p[4] if len(p) >= 5 else ''
                if not date:
                    continue
                beat = {
                    'date': date,
                    'label': label,
                    'track': f"{category}:{member}" if member else category,
                    'source': get_rel_source(f, root),
                }
                if re.search(r'\bmajor\b', flags, re.IGNORECASE):
                    beat['major'] = True
                elif re.search(r'\bminor\b', flags, re.IGNORECASE):
                    beat['minor'] = True
                add_campaign(beat, fm)
                out.append({'beat': beat, 'sort': get_beat_sort(date)})
    return out


def collect_spans(root: Path, full: bool) -> list:
    """Acts/missions: span bars (timeline_start..timeline_end). render.js ignores
    `spans` until the M4 multi-track tree lands."""
    out = []
    for sub in ('historian/acts', 'historian/missions', 'scheduler/acts'):
        dir_path = root / sub
        if not dir_path.exists():
            continue
        for f in sorted(dir_path.rglob('*.md')):
            fm = get_frontmatter(f)
            if not fm.get('timeline_start'):
                continue
            if is_secret(fm) and not full:
                continue
            span = {
                'start': fm['timeline_start'],
                'end': fm.get('timeline_end') or fm['timeline_start'],
                'label': fm.get('name'),
                'track': fm.get('track') or 'party',
                'source': get_rel_source(f, root),
            }
            add_campaign(span, fm)
            out.append(span)
    return out


def build_data(root: Path, full: bool) -> tuple:
    """Assemble the full data blob. Returns (data_dict, event_count, span_count, fallback_count)."""
    name_types = _NameTypeCache(root)
    session_beats, fallback = collect_session_beats(root)
    event_rows = collect_event_beats(root, full, name_types) + session_beats + collect_chronicle_beats(root)
    event_rows.sort(key=lambda r: r['sort'])
    events = [r['beat'] for r in event_rows]
    spans = collect_spans(root, full)

    # Null when there's no usable calendar -- render.js then uses DEFAULT_CALENDAR.
    # An empty months array would break its day-index math (divide by zero).
    cal_json = None
    if (root / 'meta' / 'calendar.md').exists() or (root / 'meta' / 'calendar-template.md').exists():
        cal = get_calendar(root)
        if cal.months:
            cal_json = {
                'epochLabel': cal.year_suffix if cal.year_suffix else '',
                'months': [{'name': n, 'days': d} for n, d in cal.months],
            }

    data = {
        'calendar': cal_json,
        'campaigns': get_campaigns(root),
        'events': events,
        'spans': spans,
    }
    return data, len(events), len(spans), fallback


def main() -> None:
    parser = argparse.ArgumentParser(description='Extract timeline data + inject into HTML shell.')
    parser.add_argument('--full', action='store_true',
                        help='include secret + canon-pending beats (DM viewpoint)')
    parser.add_argument('--json-only', action='store_true',
                        help='print the JSON blob and exit (no HTML injection)')
    parser.add_argument('--root', default=str(ROOT), help='repo root')
    parser.add_argument('--shell', default='',
                        help='prebuilt single-file shell to inject into')
    args = parser.parse_args()

    root = Path(args.root).resolve()
    data, event_count, span_count, fallback = build_data(root, args.full)

    # Compact single line so the sentinel swap is a clean one-liner.
    blob = json.dumps(data, separators=(',', ':'), ensure_ascii=False)

    if args.json_only:
        print(blob)
        return

    shell = Path(args.shell) if args.shell else root / 'app' / 'pages' / 'demo' / 'dist' / 'timeline.html'
    if not shell.exists():
        sys.stderr.write(f"Shell not built: {shell}\nRun `npm run build:timeline` first.\n")
        sys.exit(1)
    html = shell.read_text(encoding='utf-8')
    pattern = re.compile(r'/\*TL_DATA_START\*/.*?/\*TL_DATA_END\*/', re.DOTALL)
    if not pattern.search(html):
        sys.stderr.write(f"Data sentinel not found in {shell} -- was the shell rebuilt from timeline.html?\n")
        sys.exit(1)
    replacement = f"/*TL_DATA_START*/{blob}/*TL_DATA_END*/"
    # Use a function replacement so backslashes/\g in the blob aren't treated as group refs.
    html = pattern.sub(lambda m: replacement, html)

    out_dir = root / 'historian' / 'timeline'
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / 'timeline.html'
    out_file.write_text(html, encoding='utf-8')

    print(f"Wrote interactive timeline to {out_file}")
    mode = 'FULL (incl. secret beats, DM-viewpoint only)' if args.full else 'player-safe'
    print(f"  events: {event_count}   spans: {span_count}   mode: {mode}")
    if fallback > 0:
        print(f"  note: {fallback} session(s) have no in_world_end_date -- plotted by real-world "
              f"played/planned_date. Backfill in_world_end_date for a true in-world axis.")


if __name__ == '__main__':
    main()
