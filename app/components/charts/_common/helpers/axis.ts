// Shared time-axis math. Pure. Both the world-view layout (lanes) and the
// swimlane layout (track rows) need the same date→x mapping, domain padding,
// content width, and year ticks — this is the one source for all of it.

import { calendarTables, createScale, DEFAULT_CALENDAR } from './calendar.js';
import { segmentEvents } from './segments.js';
import type { SegmentedEvent } from './segments.js';
import { PX_PER_YEAR, MARGIN, EDGE_PAD, TICK_LABEL_PAD, ANCHOR_GAP_PX, LABEL_CHAR_PX, LABEL_GAP_PX, BREAK_CHIP_PAD } from '../constants.js';
import { buildTicks } from './ticks.js';
import type { AxisBreak, AxisOptions, AxisPiece, AxisRuler, BreakMark, Calendar, Tick, TimelineEvent } from '../types.js';

export type IndexedEvent = SegmentedEvent;

// "Month Year" for a day index (just the year when month is false), for the start
// anchor of a stretch that earned no ruler tick.
function dateLabel(dayIdx: number, cal: Calendar, daysPerYear: number, month: boolean): string {
  const year = Math.floor(dayIdx / daysPerYear);
  const yearText = cal.epochLabel ? `${year} ${cal.epochLabel}` : `${year}`;
  if (!month) return yearText;
  let rest = dayIdx - year * daysPerYear;
  let m = 0;
  while (m < cal.months.length - 1 && rest >= cal.months[m].days) rest -= cal.months[m++].days;
  return `${cal.months[m].name} ${yearText}`;
}

// Drop ruler labels that would overlap: within a row, a label that runs into the
// one kept before it, and in every row, a label under a break's chip. Widths are
// estimated from the label length (no DOM here). Only runs when it can matter: a
// multi-world axis (anchors and year-carrying first ticks are wider than the
// granularity was picked for) or one with breaks. A single plain ruler is left as is.
function declutter(ticks: Tick[], breaks: BreakMark[]): Tick[] {
  const width = (label: string) => label.length * LABEL_CHAR_PX;
  const blocked = breaks.map((b) => ({ x: b.x, half: width(b.label) / 2 + BREAK_CHIP_PAD }));
  const lastRight = new Map<number, number>();
  return [...ticks]
    .sort((a, b) => a.x - b.x)
    .filter((t) => {
      const half = width(t.label) / 2;
      if (blocked.some((b) => Math.abs(t.x - b.x) < b.half + half)) return false;
      const row = t.row ?? 0;
      if (t.x - half < (lastRight.get(row) ?? -Infinity) + LABEL_GAP_PX) return false;
      lastRight.set(row, t.x + half);
      return true;
    });
}

// Zoom-invariant prefix of the axis: events sorted + day-indexed once, plus the
// calendar's daysPerYear and the index domain. Only this part touches every
// event; everything below (scale, ticks, contentWidth) is cheap and re-runs per
// zoom. Compute once per render and feed it to computeAxisFrom on each zoom step.
// The index is the lived-time "virtual" day index (segments.ts): pieces are the
// stretches left after dead gaps are cut, breaks the gaps laid between them, and
// rulers the per-world ruler rows.
export interface IndexedEvents {
  events: IndexedEvent[]; // sorted ascending by _idx
  daysPerYear: number;
  minIdx: number;
  maxIdx: number;
  pieces: AxisPiece[];
  breaks: AxisBreak[];
  rulers: AxisRuler[];
}

export function indexEvents(rawEvents: TimelineEvent[], cal: Calendar = DEFAULT_CALENDAR, opts: AxisOptions = {}): IndexedEvents {
  const { events, pieces, breaks, rulers, daysPerYear } = segmentEvents(rawEvents, cal, opts);
  if (events.length === 0) return { events, daysPerYear: calendarTables(cal).daysPerYear, minIdx: 0, maxIdx: 0, pieces, breaks, rulers };
  return { events, daysPerYear, minIdx: events[0]._idx, maxIdx: events[events.length - 1]._idx, pieces, breaks, rulers };
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
  breaks: BreakMark[]; // squeezed dead stretches, placed
  rulers: string[]; // ruler row captions, row 0 first (one blank caption = the single shared ruler)
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
// full walk is hundreds of thousands of ticks. The calendar argument is kept for
// call-site compatibility; each piece's ruler uses the calendar it was indexed on.
export function computeAxisFrom(
  idx: IndexedEvents,
  _cal: Calendar = DEFAULT_CALENDAR,
  pxPerYear: number = PX_PER_YEAR,
  rightPad: number = EDGE_PAD,
  eagerTicks: boolean = true,
): Axis {
  const { events, daysPerYear, minIdx, maxIdx } = idx;

  if (events.length === 0) {
    return { isEmpty: true, events: [], daysPerYear, minIdx: 0, maxIdx: 0, contentWidth: 0, spanYears: 0, xOf: () => MARGIN, ticks: [], breaks: [], rulers: [], ticksIn: () => [] };
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
  //
  // One ruler row per world (idx.rulers), each in its own calendar, all spanning
  // the full width: a tick's row says which world's dates it reads. Each row is
  // drawn piece by piece, windowed to the piece's share of the canvas (up to the
  // midpoint of each neighbouring break) so a ruler never runs across a cut. A
  // piece after a break too short to earn a tick at this density still gets one
  // at its start, so every stretch says when it is.
  const rulerDpy = idx.rulers.map((r) => calendarTables(r.cal).daysPerYear);
  const multi = idx.rulers.length > 1;
  const ticksBetween = (fromV: number, toV: number): Tick[] => {
    const out: Tick[] = [];
    idx.pieces.forEach((p, k) => {
      const loV = Math.max(fromV, k > 0 ? idx.breaks[k - 1].idx : -Infinity);
      const hiV = Math.min(toV, k < idx.breaks.length ? idx.breaks[k].idx : Infinity);
      if (loV > hiV) return;
      idx.rulers.forEach((r, row) => {
        const shift = p.offset + r.offset; // virtual index = this ruler's day index + shift
        const xOfRaw = (q: number) => xOf(q + shift);
        const rulerPxPerYear = (pxPerYear * rulerDpy[row]) / daysPerYear;
        // Only a multi-world axis needs every stretch to say its year (see buildTicks).
        const ticks = buildTicks(p.rawMin - r.offset, p.rawMax - r.offset, r.cal, rulerPxPerYear, xOfRaw, contentWidth, TICK_LABEL_PAD, loV - shift, hiV - shift, multi);
        // Every stretch says when it starts. A row with no tick in this stretch (it
        // falls between two of the world's month starts, or follows a break) gets one
        // at its start; on a multi-world axis so does a row whose first tick is far
        // in (another world's ruler would otherwise read blank over a long stretch).
        const start = p.rawMin - r.offset;
        const x = xOfRaw(start);
        const wanted = ticks.length === 0 ? k > 0 || multi : multi && ticks[0].x - x > ANCHOR_GAP_PX;
        if (wanted && start + shift >= loV && start + shift <= hiV && x >= TICK_LABEL_PAD && x <= contentWidth - TICK_LABEL_PAD) {
          ticks.unshift({ label: dateLabel(start, r.cal, rulerDpy[row], multi), x });
        }
        for (const t of ticks) out.push(row ? { ...t, row } : t);
      });
    });
    return multi || idx.breaks.length ? declutter(out, idx.breaks.map((b) => ({ x: xOf(b.idx), label: b.label }))) : out;
  };
  const ticksIn = (x0: number, x1: number): Tick[] => ticksBetween(idxOf(x0), idxOf(x1));
  const ticks: Tick[] = eagerTicks ? ticksBetween(-Infinity, Infinity) : [];
  const breaks: BreakMark[] = idx.breaks.map((b) => ({ x: xOf(b.idx), label: b.label }));
  const rulers = idx.rulers.map((r) => r.label);

  return { isEmpty: false, events, daysPerYear, minIdx, maxIdx, contentWidth, spanYears, xOf, ticks, breaks, rulers, ticksIn };
}
