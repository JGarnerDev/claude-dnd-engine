// Shared time-axis math. Pure. Both the world-view layout (lanes) and the
// swimlane layout (track rows) need the same date→x mapping, domain padding,
// content width, and year ticks — this is the one source for all of it.

import { parseDate, calendarTables, dayIndexWith, createScale, DEFAULT_CALENDAR, DAYPART_WINDOWS } from './calendar.js';
import { PX_PER_YEAR, MARGIN, EDGE_PAD, TICK_LABEL_PAD } from '../constants.js';
import { buildTicks } from './ticks.js';
import type { Calendar, Tick, TimelineEvent } from '../types.js';

export interface IndexedEvent extends TimelineEvent {
  _idx: number;
}

// Zoom-invariant prefix of the axis: events sorted + day-indexed once, plus the
// calendar's daysPerYear and the index domain. Only this part touches every
// event; everything below (scale, ticks, contentWidth) is cheap and re-runs per
// zoom. Compute once per render and feed it to computeAxisFrom on each zoom step.
export interface IndexedEvents {
  events: IndexedEvent[]; // sorted ascending by _idx
  daysPerYear: number;
  minIdx: number;
  maxIdx: number;
}

export function indexEvents(rawEvents: TimelineEvent[], cal: Calendar = DEFAULT_CALENDAR): IndexedEvents {
  // Calendar is constant across the set, so build the lookup tables once; the
  // per-event index is then O(1) (no month loop, no daysPerYear recompute).
  const tables = calendarTables(cal);
  const daysPerYear = tables.daysPerYear;
  const events: IndexedEvent[] = rawEvents.map((e) => ({ ...e, _idx: dayIndexWith(parseDate(e.date), tables) }));
  // Add a sub-day fraction to coincident-day beats that opted in (daypart/order)
  // so they no longer share an x. Done before the sort: the fraction becomes part
  // of _idx, so ordering by _idx orders within the day too.
  applySubDayOffsets(events);
  events.sort((a, b) => a._idx - b._idx);
  if (events.length === 0) return { events, daysPerYear, minIdx: 0, maxIdx: 0 };
  return { events, daysPerYear, minIdx: events[0]._idx, maxIdx: events[events.length - 1]._idx };
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
function applySubDayOffsets(events: IndexedEvent[]): void {
  const byDay = new Map<number, IndexedEvent[]>();
  for (const e of events) {
    if (e.daypart == null && e.order == null) continue; // opt-in only
    const arr = byDay.get(e._idx);
    if (arr) arr.push(e);
    else byDay.set(e._idx, [e]);
  }
  for (const group of byDay.values()) {
    const buckets = new Map<string, IndexedEvent[]>();
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

// Padded domain → span in years. Density-invariant, so the renderer can size the
// fit-zoom and max-zoom without computing a full layout first. rightPad is the
// after-last-beat breathing fraction (left always EDGE_PAD); world view passes
// WORLD_RIGHT_PAD for extra headroom, others keep the symmetric EDGE_PAD.
export function spanYearsOf(idx: IndexedEvents, rightPad: number = EDGE_PAD): number {
  if (idx.events.length === 0) return 0;
  const span = idx.maxIdx - idx.minIdx || idx.daysPerYear;
  return Math.max(1, (idx.maxIdx + span * rightPad - (idx.minIdx - span * EDGE_PAD)) / idx.daysPerYear);
}

export interface Axis {
  isEmpty: boolean;
  events: IndexedEvent[]; // sorted ascending by _idx
  daysPerYear: number;
  minIdx: number;
  maxIdx: number;
  contentWidth: number;
  spanYears: number;
  xOf: (idx: number) => number;
  ticks: Tick[]; // every tick across the canvas ([] when computed with eagerTicks=false)
  // Ticks whose x falls within [x0, x1] only — what a renderer that draws just the
  // visible slice of a very wide canvas asks for.
  ticksIn: (x0: number, x1: number) => Tick[];
}

// pxPerYear is the axis density (driven by zoom); higher = stretched. Width is
// purely density-driven — no spread-to-fill — so a given pxPerYear always maps
// to the same px/year regardless of viewport.
export function computeAxis(
  rawEvents: TimelineEvent[],
  cal: Calendar = DEFAULT_CALENDAR,
  pxPerYear: number = PX_PER_YEAR,
  rightPad: number = EDGE_PAD,
): Axis {
  return computeAxisFrom(indexEvents(rawEvents, cal), cal, pxPerYear, rightPad);
}

// Zoom step: takes the pre-indexed (sorted, day-indexed) events and recomputes
// only the density-driven parts — scale, xOf, contentWidth, ticks. No re-sort.
// eagerTicks=false skips the full tick walk (ticks: []) for a caller that draws
// only the visible slice via ticksIn — at day granularity over a long span the
// full walk is hundreds of thousands of ticks.
export function computeAxisFrom(
  idx: IndexedEvents,
  cal: Calendar = DEFAULT_CALENDAR,
  pxPerYear: number = PX_PER_YEAR,
  rightPad: number = EDGE_PAD,
  eagerTicks: boolean = true,
): Axis {
  const { events, daysPerYear, minIdx, maxIdx } = idx;

  if (events.length === 0) {
    return { isEmpty: true, events: [], daysPerYear, minIdx: 0, maxIdx: 0, contentWidth: 0, spanYears: 0, xOf: () => MARGIN, ticks: [], ticksIn: () => [] };
  }

  // Pad the date domain so the first and last beats sit inset from the canvas
  // edges. Left is always EDGE_PAD of the span; right uses rightPad (world view
  // passes WORLD_RIGHT_PAD for >= 50% headroom past the latest beat). Single-event
  // timelines fall back to a year of span so the lone beat doesn't divide by zero.
  const span = maxIdx - minIdx || daysPerYear;
  const domMin = minIdx - span * EDGE_PAD;
  const domMax = maxIdx + span * rightPad;

  const spanYears = Math.max(1, (domMax - domMin) / daysPerYear);
  const contentWidth = Math.ceil(spanYears * pxPerYear) + MARGIN * 2;
  const scale = createScale(domMin, domMax, contentWidth - MARGIN * 2);
  const xOf = (i: number) => MARGIN + scale(i);
  // Inverse of xOf, for windowing ticks by canvas x.
  const idxOf = (x: number) => domMin + ((x - MARGIN) / (contentWidth - MARGIN * 2)) * (domMax - domMin);

  // Tick granularity adapts to the current density (months / years / multi-year).
  // Clip the tick band a label-pad in from both edges so the first/last tick label
  // keeps equal breathing room from each canvas edge and never spills past the bound
  // (which would trip the horizontal scrollbar).
  const ticksIn = (x0: number, x1: number): Tick[] =>
    buildTicks(minIdx, maxIdx, cal, pxPerYear, xOf, contentWidth, TICK_LABEL_PAD, idxOf(x0), idxOf(x1));
  const ticks: Tick[] = eagerTicks ? buildTicks(minIdx, maxIdx, cal, pxPerYear, xOf, contentWidth, TICK_LABEL_PAD) : [];

  return { isEmpty: false, events, daysPerYear, minIdx, maxIdx, contentWidth, spanYears, xOf, ticks, ticksIn };
}
