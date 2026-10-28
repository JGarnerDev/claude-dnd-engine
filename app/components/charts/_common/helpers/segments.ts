// Lived-time axis (pure). The time axis is the party's own lived time: every
// campaign's dates are shifted onto one shared day index by that campaign's SYNC
// OFFSET, so beats from two worlds sit on one line in the order the party lived
// them, and each world draws its own ruler row across the full width (read any
// moment in either world's dates).
//
// Sync: the first campaign played is the reference (offset 0). At each swap in
// play order, a campaign not yet anchored is placed so its first session lands the
// day after the last session of the campaign the party just left. One offset per
// campaign: a day passes in every world at the same rate, so a return season keeps
// the offset its world got at the first crossing.
//
// Dead stretches (thousands of empty years between an ancient beat and the
// present) are then cut out: the sorted beats split into PIECES at each dead gap,
// and the pieces are shifted end to end with a fixed-width labelled break between
// them. Inside a piece, distance is true time. The layouts keep one linear scale
// over the resulting "virtual" index; only the rulers (axis.ts) and the breaks
// need to know the offsets.
//
// With default options (no rulers, offsets or compression) everything is one
// piece at offset 0 on the shared calendar: the virtual index is the plain day index.

import { parseDate, calendarTables, dayIndexWith, DEFAULT_CALENDAR, DAYPART_WINDOWS } from './calendar.js';
import type { CalendarTables } from './calendar.js';
import { GAP_MIN_YEARS, GAP_SPAN_FRAC, BREAK_FRAC, BREAK_MIN_YEARS } from '../constants.js';
import type { AxisBreak, AxisOptions, AxisPiece, AxisRuler, Calendar, TimelineData, TimelineEvent } from '../types.js';

export interface SegmentedEvent extends TimelineEvent {
  _idx: number; // virtual day index
}

export interface Segmentation {
  events: SegmentedEvent[]; // sorted ascending by virtual _idx
  pieces: AxisPiece[]; // in order; breaks[k] sits between pieces[k] and pieces[k+1]
  breaks: AxisBreak[];
  rulers: AxisRuler[]; // row 0 first; never empty
  daysPerYear: number; // row 0's calendar (the axis's density unit)
}

// Day index of an event's date on a calendar, with the tables memoized per calendar.
function dayIndexer(): (date: string, cal: Calendar) => number {
  const tables = new Map<Calendar, CalendarTables>();
  return (date, cal) => {
    let t = tables.get(cal);
    if (!t) tables.set(cal, (t = calendarTables(cal)));
    return dayIndexWith(parseDate(date), t);
  };
}

// Play order of a session beat: its sessionNumber, else the "S29 ..." label prefix.
function sessionNo(e: TimelineEvent): number {
  if (typeof e.sessionNumber === 'number') return e.sessionNumber;
  const m = /^S(\d+)\b/.exec(e.label ?? '');
  return m ? parseInt(m[1], 10) : Infinity;
}

// Lived-time sync offsets per campaign slug, from the session beats in play order
// (see the header). A campaign with no session beats gets none: its dates can't be
// tied to the party's line.
export function syncOffsets(events: TimelineEvent[], cal: Calendar = DEFAULT_CALENDAR, calendars: Record<string, Calendar> = {}): Record<string, number> {
  const dayIndex = dayIndexer();
  const sessions = events
    .filter((e) => e.session && e.campaign)
    .map((e) => ({ campaign: e.campaign!, n: sessionNo(e), raw: dayIndex(e.date, calendars[e.campaign!] ?? cal) }))
    .sort((a, b) => a.n - b.n);
  const offsets: Record<string, number> = {};
  let prev: (typeof sessions)[number] | undefined;
  for (const s of sessions) {
    if (offsets[s.campaign] === undefined) {
      offsets[s.campaign] = prev ? prev.raw + offsets[prev.campaign] + 1 - s.raw : 0;
    }
    prev = s;
  }
  return offsets;
}

// The axis options a chart derives from its data: per-campaign calendars, the sync
// offsets (handed down from pages/home when the data is scoped, else derived here),
// gap compression, and one ruler per synced campaign. The primary campaign (the one
// selected, else the active one) takes row 0, nearest the axis. A graph with fewer
// than two synced campaigns gets no ruler list, so it keeps the single shared ruler.
export function axisOptionsFor(data: TimelineData): AxisOptions {
  const cal = data.calendar || DEFAULT_CALENDAR;
  const calendars: Record<string, Calendar> = {};
  for (const c of data.campaigns ?? []) if (c.calendar) calendars[c.slug] = c.calendar;
  const offsets = data.sync ?? syncOffsets(data.events, cal, calendars);
  const primary = data.primary ?? (data.campaigns ?? []).find((c) => c.active)?.slug;
  const synced = (data.campaigns ?? []).filter((c) => offsets[c.slug] !== undefined);
  synced.sort((a, b) => Number(b.slug === primary) - Number(a.slug === primary));
  const rulers: AxisRuler[] | undefined =
    synced.length > 1 ? synced.map((c) => ({ slug: c.slug, label: c.label, cal: calendars[c.slug] ?? cal, offset: offsets[c.slug] })) : undefined;
  return { compressGaps: true, calendars, offsets, rulers };
}

// Spread same-day beats within their calendar day by sub-day `daypart` + `order`,
// mutating `_idx` in place (adds a fraction in [-0.5, 0.5) to the integer day
// index). The fraction is CENTERED on the day: a beat's session band is centered
// on its session's day index and spans ±half the gap to each neighbour (see
// deriveSessionBands), so beats must straddle the day point to stay inside the
// band — pushing them all into [0,1) would spill the afternoon/evening half past
// the band's right edge.
//
// Only beats carrying a daypart or order opt in — a beat with neither keeps the
// bare integer index (day center), so world/historical beats stay put and a lone
// dated beat is unaffected. Within a day, beats are bucketed by daypart window (an
// unknown/absent daypart falls in the full-day window), then ordered by `order`
// and spread evenly inside the window. Distinct windows never overlap, so
// cross-daypart beats can't collide; the even spread inside a window keeps
// same-daypart beats apart.
function applySubDayOffsets(events: SegmentedEvent[]): void {
  const byDay = new Map<number, SegmentedEvent[]>();
  for (const e of events) {
    if (e.daypart == null && e.order == null) continue; // opt-in only
    const arr = byDay.get(e._idx);
    if (arr) arr.push(e);
    else byDay.set(e._idx, [e]);
  }
  for (const group of byDay.values()) {
    const buckets = new Map<string, SegmentedEvent[]>();
    for (const e of group) {
      const key = e.daypart && DAYPART_WINDOWS[e.daypart] ? e.daypart : '';
      const b = buckets.get(key);
      if (b) b.push(e);
      else buckets.set(key, [e]);
    }
    for (const [key, bucket] of buckets) {
      const [start, end] = key ? DAYPART_WINDOWS[key] : [0, 1];
      bucket.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.label.localeCompare(b.label));
      bucket.forEach((e, k) => {
        // window position in [0,1), then recenter to [-0.5, 0.5) so beats straddle
        // the day point and stay within the session band centered on it.
        e._idx += start + ((k + 1) / (bucket.length + 1)) * (end - start) - 0.5;
      });
    }
  }
}

// Indices (into the sorted events) after which a dead stretch starts. Greedy from
// the largest gap: a gap is dead when it is >= GAP_MIN_YEARS and >= GAP_SPAN_FRAC
// of the span left once the dead gaps found so far are removed. Re-measuring
// against the shrinking span lets several deep-time holes all go, while a lull
// inside a live campaign (short, or small next to the span) stays.
function deadGaps(sorted: SegmentedEvent[], daysPerYear: number): Set<number> {
  const dead = new Set<number>();
  if (sorted.length < 2) return dead;
  const gaps = sorted.slice(1).map((e, i) => ({ i, size: e._idx - sorted[i]._idx })).sort((a, b) => b.size - a.size);
  let left = sorted[sorted.length - 1]._idx - sorted[0]._idx;
  for (const g of gaps) {
    if (g.size < GAP_MIN_YEARS * daysPerYear || g.size < GAP_SPAN_FRAC * left) break;
    dead.add(g.i);
    left -= g.size;
  }
  return dead;
}

function yearsLabel(days: number, daysPerYear: number): string {
  const years = Math.round(days / daysPerYear);
  return `${years.toLocaleString('en-US')} ${years === 1 ? 'year' : 'years'}`;
}

export function segmentEvents(rawEvents: TimelineEvent[], cal: Calendar = DEFAULT_CALENDAR, opts: AxisOptions = {}): Segmentation {
  const rulers: AxisRuler[] = opts.rulers?.length ? opts.rulers : [{ slug: '', label: '', cal, offset: 0 }];
  const daysPerYear = calendarTables(rulers[0].cal).daysPerYear;
  const calOf = (slug?: string) => (slug && opts.calendars?.[slug]) || cal;
  const offsetOf = (slug?: string) => (slug && opts.offsets?.[slug]) || 0;

  // Onto the shared lived-time index: each beat on its own world's calendar, plus
  // its world's sync offset. Untagged beats ride the shared calendar at offset 0.
  const dayIndex = dayIndexer();
  const evs: SegmentedEvent[] = rawEvents.map((e) => ({ ...e, _idx: dayIndex(e.date, calOf(e.campaign)) + offsetOf(e.campaign) }));
  applySubDayOffsets(evs);
  evs.sort((a, b) => a._idx - b._idx);

  // Cut at dead stretches.
  const dead = opts.compressGaps ? deadGaps(evs, daysPerYear) : new Set<number>();
  const pieces: (AxisPiece & { members: SegmentedEvent[] })[] = [];
  let start = 0;
  for (let i = 0; i < evs.length; i++) {
    if (i === evs.length - 1 || dead.has(i)) {
      const members = evs.slice(start, i + 1);
      pieces.push({ rawMin: members[0]._idx, rawMax: members[members.length - 1]._idx, offset: 0, members });
      start = i + 1;
    }
  }

  // Lay the pieces end to end, one fixed-width break between neighbours. The first
  // piece keeps offset 0, so an uncut axis is the plain shared index.
  const kept = pieces.reduce((sum, p) => sum + (p.rawMax - p.rawMin), 0);
  const breakDays = Math.max(BREAK_MIN_YEARS * daysPerYear, BREAK_FRAC * kept);
  const breaks: AxisBreak[] = [];
  let cursor = 0;
  pieces.forEach((p, k) => {
    if (k > 0) {
      p.offset = cursor + breakDays - p.rawMin;
      breaks.push({ idx: cursor + breakDays / 2, label: yearsLabel(p.rawMin - pieces[k - 1].rawMax, daysPerYear) });
    }
    for (const e of p.members) e._idx += p.offset;
    cursor = p.rawMax + p.offset;
  });

  return { events: evs, pieces: pieces.map(({ members: _m, ...piece }) => piece), breaks, rulers, daysPerYear };
}
