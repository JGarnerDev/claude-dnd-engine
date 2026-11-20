// Shared time-axis math. Pure. Both charts (World view and Tracks view) index
// the events the same way and read them through the same jeff-ui TimeScale:
// the per-world ruler rows, ticks windowed to the visible slice, and the zoom
// reach. jeff-ui/charts owns the date→x mapping, padding and content width.

import type { AxisTick, TimeScale, TickWindow } from "jeff-ui/charts";
import { calendarTables, DEFAULT_CALENDAR } from "./calendar.js";
import { segmentEvents } from "./segments.js";
import type { SegmentedEvent } from "./segments.js";
import {
  TICK_LABEL_PAD,
  ANCHOR_GAP_PX,
  LABEL_CHAR_PX,
  LABEL_GAP_PX,
  BREAK_CHIP_PAD,
  MONTH_VIEW_FRAC,
  DAY_VIEW_FRAC,
} from "../constants.js";
import { buildTicks } from "./ticks.js";
import type {
  AxisBreak,
  AxisOptions,
  AxisPiece,
  AxisRuler,
  BreakMark,
  Calendar,
  Tick,
  TimelineEvent,
} from "../types.js";

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
// zoom. Compute once per data change and hand timeScaleFor's scale to the chart.
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

export function indexEvents(
  rawEvents: TimelineEvent[],
  cal: Calendar = DEFAULT_CALENDAR,
  opts: AxisOptions = {},
): IndexedEvents {
  const { events, pieces, breaks, rulers, daysPerYear } = segmentEvents(rawEvents, cal, opts);
  if (events.length === 0)
    return {
      events,
      daysPerYear: calendarTables(cal).daysPerYear,
      minIdx: 0,
      maxIdx: 0,
      pieces,
      breaks,
      rulers,
    };
  return {
    events,
    daysPerYear,
    minIdx: events[0]._idx,
    maxIdx: events[events.length - 1]._idx,
    pieces,
    breaks,
    rulers,
  };
}

// The engine's TimeScale over indexed events (units: virtual day index). One
// ruler row per world (idx.rulers), each in its own calendar, all spanning the
// full width: a tick's row says which world's dates it reads. Each row is drawn
// piece by piece, windowed to the piece's share of the canvas (up to each
// neighbouring break) so a ruler never runs across a cut. A piece after a break
// too short to earn a tick at this density still gets one at its start, so
// every stretch says when it is. Tick granularity adapts to the density (days /
// months / years / multi-year), clipped a label-pad in from both canvas edges.
//
// reach: the deepest zoom always shows a month filling ~MONTH_VIEW_FRAC of the
// view and, one tier finer, a day filling ~DAY_VIEW_FRAC. A lone beat gets a
// year of room (minSpan).
export function timeScaleFor(idx: IndexedEvents, cal: Calendar = DEFAULT_CALENDAR): TimeScale {
  const { daysPerYear } = idx;
  const rulerDpy = idx.rulers.map((r) => calendarTables(r.cal).daysPerYear);
  const multi = idx.rulers.length > 1;
  const ticks = ({ from, to, xOf, pxPerUnit, width }: TickWindow): AxisTick[] => {
    const pxPerYear = pxPerUnit * daysPerYear;
    const out: Tick[] = [];
    idx.pieces.forEach((p, k) => {
      const loV = Math.max(from, k > 0 ? idx.breaks[k - 1].idx : -Infinity);
      const hiV = Math.min(to, k < idx.breaks.length ? idx.breaks[k].idx : Infinity);
      if (loV > hiV) return;
      idx.rulers.forEach((r, row) => {
        const shift = p.offset + r.offset; // virtual index = this ruler's day index + shift
        const xOfRaw = (q: number) => xOf(q + shift);
        const rulerPxPerYear = (pxPerYear * rulerDpy[row]) / daysPerYear;
        // Only a multi-world axis needs every stretch to say its year (see buildTicks).
        const ticks = buildTicks(
          p.rawMin - r.offset,
          p.rawMax - r.offset,
          r.cal,
          rulerPxPerYear,
          xOfRaw,
          width,
          TICK_LABEL_PAD,
          loV - shift,
          hiV - shift,
          multi,
        );
        // Every stretch says when it starts. A row with no tick in this stretch (it
        // falls between two of the world's month starts, or follows a break) gets one
        // at its start; on a multi-world axis so does a row whose first tick is far
        // in (another world's ruler would otherwise read blank over a long stretch).
        const start = p.rawMin - r.offset;
        const x = xOfRaw(start);
        const wanted =
          ticks.length === 0 ? k > 0 || multi : multi && ticks[0].x - x > ANCHOR_GAP_PX;
        if (
          wanted &&
          start + shift >= loV &&
          start + shift <= hiV &&
          x >= TICK_LABEL_PAD &&
          x <= width - TICK_LABEL_PAD
        ) {
          ticks.unshift({ label: dateLabel(start, r.cal, rulerDpy[row], multi), x });
        }
        for (const t of ticks) out.push(row ? { ...t, row } : t);
      });
    });
    return multi || idx.breaks.length
      ? declutter(
          out,
          idx.breaks.map((b) => ({ x: xOf(b.idx), label: b.label })),
        )
      : out;
  };
  return {
    ticks,
    rows: idx.rulers.map((r) => r.label),
    minSpan: daysPerYear,
    reach: [
      { span: daysPerYear / (cal.months.length || 12), frac: MONTH_VIEW_FRAC },
      { span: 1, frac: DAY_VIEW_FRAC },
    ],
  };
}
