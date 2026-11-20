// Indexed events → the jeff-ui chart shapes. Pure. Both charts plot the same
// items; only the Tracks view gives each one a lane.
//
// Sessions are not dots: they become spans (a band behind the World view's axis,
// a full-height column in the Tracks view) running from the previous session to
// this one (bands.ts). Everything else is an item at its day index.

import type { ChartBreak, ChartItem, ChartSpan } from "jeff-ui/charts";
import { deriveSessionBands } from "./bands.js";
import { toneFor } from "./tracks.js";
import type { IndexedEvent, IndexedEvents } from "./axis.js";

export function itemsOf(
  beats: readonly IndexedEvent[],
  laneOf?: (e: IndexedEvent) => string,
): ChartItem[] {
  return beats.map((e) => {
    const track = e.track || "world";
    return {
      at: e._idx,
      label: e.label,
      lane: laneOf?.(e),
      weight: e.major ? "major" : e.minor ? "minor" : undefined,
      tone: toneFor(e.track),
      dashed: e.draft,
      href: e.source,
      // The tooltip reads "date · track"; jeff-ui adds "click to open" when there's an href.
      meta: [e.date, track].filter(Boolean).join(" · "),
      group: track,
    };
  });
}

export function spansOf(idx: IndexedEvents): ChartSpan[] {
  const sessions = idx.events.filter((e) => e.session);
  return deriveSessionBands(
    sessions,
    (i) => i,
    idx.daysPerYear,
    idx.breaks.map((b) => b.idx),
  ).map((b) => ({
    start: b.x0,
    end: b.x1,
    label: b.label,
    weight: b.major ? "major" : undefined,
    href: b.source,
  }));
}

export function breaksOf(idx: IndexedEvents): ChartBreak[] {
  return idx.breaks.map((b) => ({ at: b.idx, label: b.label }));
}
