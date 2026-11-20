// Test-only: lay an index out at a fixed density the way the charts do (jeff-ui's
// timeAxis for x, the engine's timeScaleFor for ticks), with the whole canvas as
// the tick window.

import { timeAxis } from "jeff-ui/charts";
import { timeScaleFor, type IndexedEvents } from "./axis.js";
import { EDGE_PAD, PX_PER_YEAR } from "../constants.js";

export function axisAt(
  idx: IndexedEvents,
  pxPerYear: number = PX_PER_YEAR,
  rightPad: number = EDGE_PAD,
) {
  const pxPerUnit = pxPerYear / idx.daysPerYear;
  const axis = timeAxis(
    { domain: [idx.minIdx, idx.maxIdx], pad: [EDGE_PAD, rightPad], minSpan: idx.daysPerYear },
    pxPerUnit,
  );
  const scale = timeScaleFor(idx);
  const ticks = scale.ticks({
    from: axis.atOf(0),
    to: axis.atOf(axis.contentWidth),
    xOf: axis.xOf,
    pxPerUnit,
    width: axis.contentWidth,
  });
  return {
    ...axis,
    ticks,
    rulers: scale.rows ?? [],
    breaks: idx.breaks.map((b) => ({ x: axis.xOf(b.idx), label: b.label })),
  };
}
