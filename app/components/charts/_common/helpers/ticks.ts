// Responsive axis ticks (pure). Picks tick granularity from the pixel density so
// labels stay readable at any zoom: day ticks at the deepest zoom, month ticks
// when deeply zoomed in, single
// years at mid zoom, and multi-year steps (2/5/10/25…) when zoomed out far enough
// that yearly ticks would crowd below MIN_TICK_PX. One source for both the world
// view and the swimlane (both go through computeAxis).

import { MIN_TICK_PX } from '../constants.js';
import { calendarTables } from './calendar.js';
import type { Calendar, Tick } from '../types.js';

// "Nice" year steps so multi-year ticks land on round numbers (…, 1950, 1960).
const NICE_YEAR_STEPS = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000];

// Smallest step whose pixel spacing clears MIN_TICK_PX; extends past the table by
// ×10 for extreme zoom-outs (millennia).
export function yearStepFor(pxPerYear: number): number {
  for (const step of NICE_YEAR_STEPS) {
    if (step * pxPerYear >= MIN_TICK_PX) return step;
  }
  let step = NICE_YEAR_STEPS[NICE_YEAR_STEPS.length - 1];
  while (step * pxPerYear < MIN_TICK_PX) step *= 10;
  return step;
}

// contentWidth clips ticks to the canvas: the year/month loops walk whole calendar
// years (firstYear→lastYear), so a sub-year data domain (e.g. one month, scaled to
// fill the canvas) would otherwise place the other months' ticks far past the
// canvas edge — inflating scrollWidth and leaving dead space.
//
// inset pulls the live tick band in from BOTH canvas edges by that many px (the
// caller passes the MARGIN gutter): a tick shows only when its x lands within
// [inset, contentWidth - inset]. Tick labels are centered (translateX(-50%)), so a
// tick sitting flush at the canvas edge would spill its label past the bound and
// trip the horizontal scrollbar; clipping to the gutter keeps the first/last label
// the same comfortable distance from each view edge (MARGIN >= half a label, see
// constants). Defaults: contentWidth Infinity + inset 0 so pure callers/tests stay
// unclipped.
//
// fromIdx/toIdx window the walk to a day-index range (the visible slice of the
// canvas): years outside it are never visited, ticks outside it never emitted. A
// deep zoom over a long span would otherwise walk — and the renderer draw — one
// tick per day across centuries. Defaults: unwindowed.
//
// yearOnFirst: the first tick emitted carries its year even when it is a month or
// day tick ("March 1487"), so a short stretch that never reaches a new year still
// says when it is. The lived-time axis (axis.ts) turns it on for every ruler row:
// with two worlds' rulers stacked, a bare "March" would not say which year in
// which world. Default off.
export function buildTicks(
  minIdx: number,
  maxIdx: number,
  cal: Calendar,
  pxPerYear: number,
  xOf: (idx: number) => number,
  contentWidth: number = Infinity,
  inset: number = 0,
  fromIdx: number = -Infinity,
  toIdx: number = Infinity,
  yearOnFirst: boolean = false,
): Tick[] {
  const { daysPerYear } = calendarTables(cal);
  const monthsPerYear = cal.months.length;
  const firstYear = Math.max(Math.floor(minIdx / daysPerYear), Math.floor(fromIdx / daysPerYear));
  const lastYear = Math.min(Math.floor(maxIdx / daysPerYear), Math.floor(toIdx / daysPerYear));
  const yearLabel = (y: number) => (cal.epochLabel ? `${y} ${cal.epochLabel}` : `${y}`);
  const ticks: Tick[] = [];
  // firstLabel: what the tick says instead when it is the first one emitted and
  // yearOnFirst is on (the same tick with its year added).
  const push = (idx: number, label: string, firstLabel: string = label) => {
    if (idx < fromIdx || idx > toIdx) return;
    const x = xOf(idx);
    if (x < inset || x > contentWidth - inset) return;
    ticks.push({ label: yearOnFirst && ticks.length === 0 ? firstLabel : label, x });
  };

  // Day granularity — finest tier, only when a single day is wide enough to label.
  // The first day of the year carries the year number, the first day of each month
  // the month name, and every other day its day-of-month number.
  if (daysPerYear > 0 && pxPerYear / daysPerYear >= MIN_TICK_PX) {
    for (let y = firstYear; y <= lastYear; y++) {
      let dayAcc = y * daysPerYear;
      for (let m = 0; m < monthsPerYear; m++) {
        for (let d = 0; d < cal.months[m].days; d++) {
          if (m === 0 && d === 0) push(dayAcc, yearLabel(y));
          else if (d === 0) push(dayAcc, cal.months[m].name, `${cal.months[m].name} ${yearLabel(y)}`);
          else push(dayAcc, `${d + 1}`, `${cal.months[m].name} ${d + 1}, ${yearLabel(y)}`);
          dayAcc += 1;
        }
      }
    }
    return ticks;
  }

  // Month granularity — only when an average month is wide enough to label. The
  // first month of each year carries the year number; the rest the month name.
  if (monthsPerYear > 0 && pxPerYear / monthsPerYear >= MIN_TICK_PX) {
    for (let y = firstYear; y <= lastYear; y++) {
      let dayAcc = y * daysPerYear;
      for (let m = 0; m < monthsPerYear; m++) {
        if (m === 0) push(dayAcc, yearLabel(y));
        else push(dayAcc, cal.months[m].name, `${cal.months[m].name} ${yearLabel(y)}`);
        dayAcc += cal.months[m].days;
      }
    }
    return ticks;
  }

  // Year / multi-year granularity, aligned to the chosen nice step.
  const step = yearStepFor(pxPerYear);
  for (let y = firstYear; y <= lastYear; y++) {
    if ((((y % step) + step) % step) !== 0) continue; // keep multiples of step (negatives too)
    push(y * daysPerYear, yearLabel(y));
  }
  return ticks;
}
