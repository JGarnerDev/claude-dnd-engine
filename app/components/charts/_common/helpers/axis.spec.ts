import { describe, it, expect } from "vitest";
import { indexEvents, timeScaleFor } from "./axis.js";
import { axisAt } from "./axis.test-helper.js";
import type { TimelineEvent } from "../types.js";

const events: TimelineEvent[] = [
  { date: "1340-01-01", label: "a" },
  { date: "1341-06-01", label: "b" },
  { date: "1342-11-20", label: "c" }, // within the default 360-day year
];

describe("indexEvents", () => {
  it("has no events for no input", () => {
    expect(indexEvents([]).events).toEqual([]);
  });

  it("sorts events ascending by day index", () => {
    const idx = indexEvents([events[2], events[0], events[1]]);
    expect(idx.events.map((e) => e.label)).toEqual(["a", "b", "c"]);
  });
});

describe("timeScaleFor", () => {
  const idx = indexEvents(events);

  it("maps later dates to larger x", () => {
    const a = axisAt(idx);
    const xs = idx.events.map((e) => a.xOf(e._idx));
    expect(xs[0]).toBeLessThan(xs[1]);
    expect(xs[1]).toBeLessThan(xs[2]);
  });

  it("emits one year tick per year across the span", () => {
    expect(axisAt(idx).ticks.map((t) => t.label)).toEqual(["1340", "1341", "1342"]);
  });

  it("scales contentWidth with density", () => {
    expect(axisAt(idx, 200).contentWidth).toBeGreaterThan(axisAt(idx, 100).contentWidth);
  });

  it("gives a lone beat a year of room and reaches day ticks at full zoom", () => {
    const scale = timeScaleFor(idx);
    expect(scale.minSpan).toBe(idx.daysPerYear);
    expect(scale.reach?.map((r) => r.span)).toEqual([idx.daysPerYear / 12, 1]);
  });
});

describe("sub-day spread (daypart + order)", () => {
  const day = "0735-11-01";

  it("leaves beats with no daypart/order at the bare integer day index", () => {
    const idx = indexEvents([{ date: day, label: "plain" }]);
    expect(Number.isInteger(idx.events[0]._idx)).toBe(true);
  });

  it("gives coincident-day beats distinct indices once they opt in", () => {
    const idx = indexEvents([
      { date: day, label: "a", daypart: "morning", order: 1 },
      { date: day, label: "b", daypart: "morning", order: 2 },
      { date: day, label: "c", daypart: "evening", order: 3 },
    ]);
    const xs = idx.events.map((e) => e._idx);
    expect(new Set(xs).size).toBe(3); // no two share an x
  });

  it("orders by daypart first (morning < evening), order within a daypart", () => {
    const idx = indexEvents([
      { date: day, label: "evening-beat", daypart: "evening", order: 1 },
      { date: day, label: "morning-late", daypart: "morning", order: 2 },
      { date: day, label: "morning-early", daypart: "morning", order: 1 },
    ]);
    expect(idx.events.map((e) => e.label)).toEqual([
      "morning-early",
      "morning-late",
      "evening-beat",
    ]);
  });

  it("centers the fraction in [-0.5, 0.5) so beats straddle the day and stay in the band", () => {
    const base = indexEvents([{ date: day, label: "plain" }]).events[0]._idx;
    const dawn =
      indexEvents([{ date: day, label: "dawn", daypart: "dawn", order: 1 }]).events[0]._idx - base;
    const late =
      indexEvents([{ date: day, label: "late", daypart: "late", order: 1 }]).events[0]._idx - base;
    expect(dawn).toBeGreaterThanOrEqual(-0.5);
    expect(dawn).toBeLessThan(0); // early in the day -> left of the session point
    expect(late).toBeGreaterThan(0); // late -> right of it
    expect(late).toBeLessThan(0.5);
  });

  it("does not bleed across calendar days", () => {
    const idx = indexEvents([
      { date: "0735-11-01", label: "d1-late", daypart: "late", order: 1 },
      { date: "0735-11-02", label: "d2-dawn", daypart: "dawn", order: 1 },
    ]);
    expect(idx.events.map((e) => e.label)).toEqual(["d1-late", "d2-dawn"]);
  });
});
