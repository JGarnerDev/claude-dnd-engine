// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { fireEvent } from "@testing-library/react";
import { Swimlane } from "./Swimlane.js";
import { mountChart, wheel, px, stubResize } from "../_common/chart.test-helper.js";
import type { ChartState, TimelineData } from "../_common/types.js";

// 'character' is expanded by default (so its child rows show); 'faction' is
// collapsed by default (so it rolls up). 'world' is the untagged fallback.
const data: TimelineData = {
  calendar: null,
  events: [
    {
      date: "1340-02-15",
      label: "War begins",
      track: "world",
      major: true,
      source: "historian/events/war.md",
    },
    { date: "1341-06-01", label: "Aelith born", track: "character:Aelith" },
    { date: "1342-06-20", label: "Borin sworn", track: "character:Borin", minor: true },
    { date: "1343-01-10", label: "Cult rises", track: "faction:Ashen Cult" },
  ],
};

// Beats spread evenly over a long span (no dead stretch to squeeze into an axis break).
const spread = (years: number[]): TimelineData => ({
  calendar: null,
  events: years.map((y, i) => ({
    date: `${String(y).padStart(4, "0")}-10-20`,
    label: `beat ${i}`,
    track: "world",
  })),
});

function mount(d: TimelineData, initialState?: ChartState) {
  const chart = mountChart(Swimlane, d, initialState);
  const { container, all } = chart;
  return {
    ...chart,
    width: () => px(container.querySelector<HTMLElement>(".ui-chart-swim-canvas")),
    markers: () => all(".ui-chart-swim-marker"),
    names: () => all(".ui-chart-swim-lanename").map((n) => n.textContent),
    row: (name: string) =>
      all(".ui-chart-swim-lane").find(
        (r) => r.querySelector(".ui-chart-swim-lanename")!.textContent === name,
      )!,
    barSum: () =>
      all(".ui-chart-swim-bar:not(.ui-chart-hidden)").reduce(
        (s, b) => s + Number(b.dataset.count),
        0,
      ),
    wheel: (deltaY: number) =>
      wheel(container.querySelector<HTMLElement>(".ui-chart-swim")!, deltaY),
  };
}

describe("Swimlane", () => {
  it("renders one swim marker per event", () => {
    expect(mount(data).markers()).toHaveLength(4);
  });

  it("gives each marker a colored dot and track dataset", () => {
    for (const m of mount(data).markers()) {
      expect(m.querySelector(".ui-chart-dot")).toBeTruthy();
      expect(m.dataset.group).toBeTruthy();
    }
  });

  it("builds a gutter with a row label per track row", () => {
    const chart = mount(data);
    const labels = chart.all(".ui-chart-swim-lane");
    expect(labels.length).toBeGreaterThan(0);
    expect(labels.length).toBe(chart.all(".ui-chart-swim-row").length);
  });

  it("expands a category with children into a header + child rows", () => {
    const names = mount(data).names();
    expect(names).toContain("Characters"); // header row
    expect(names).toContain("Aelith"); // child row
    expect(names).toContain("Borin");
  });

  it("rolls a collapsed category up to a single row (no child rows)", () => {
    const names = mount(data).names();
    expect(names).toContain("Factions"); // present as roll-up
    expect(names).not.toContain("Ashen Cult"); // child hidden while collapsed
  });

  it("toggles a collapsed category open via its gutter toggle", () => {
    const chart = mount(data);
    fireEvent.click(chart.row("Factions").querySelector(".ui-chart-swim-toggle")!);
    expect(chart.names()).toContain("Ashen Cult");
  });

  it("toggles when the row name itself is clicked (whole label is the hit area)", () => {
    const chart = mount(data);
    const factions = chart.row("Factions");
    expect(factions.tagName).toBe("BUTTON"); // toggleable rows are buttons
    fireEvent.click(factions.querySelector(".ui-chart-swim-lanename")!); // the name, not the arrow
    expect(chart.names()).toContain("Ashen Cult");
  });

  it("collapses an expanded category back to its roll-up", () => {
    const chart = mount(data);
    fireEvent.click(chart.row("Characters"));
    expect(chart.names()).toContain("Characters");
    expect(chart.names()).not.toContain("Aelith");
    expect(chart.markers()).toHaveLength(4); // beats stay, rolled into the header row
  });

  it("leaves leaf rows as plain non-button labels", () => {
    expect(mount(data).row("World").tagName).toBe("DIV");
  });

  it("portals a search box and track chips into the settings slot", () => {
    const { slot, all } = mount(data);
    expect(slot.querySelector(".ui-settings-panel .chart-search")).toBeTruthy();
    expect(all(".chart-chip").length).toBeGreaterThan(0);
  });

  it("hides markers in place when a track is filtered off (scale stable)", () => {
    const chart = mount(data);
    const before = chart.width();
    fireEvent.click(chart.chip("world"));
    expect(chart.markers()).toHaveLength(4); // all stay in the DOM
    expect(chart.all(".ui-chart-swim-marker.ui-chart-hidden").length).toBeGreaterThan(0);
    expect(chart.width()).toBe(before);
  });

  it("widens the canvas when zooming in with the wheel", async () => {
    const chart = mount(data);
    const before = chart.width();
    await chart.wheel(-120);
    await chart.wheel(-120);
    expect(chart.width()).toBeGreaterThan(before);
    expect(chart.markers()).toHaveLength(4);
    expect(chart.state().zoomLevel).toBeGreaterThan(1);
  });

  it("draws ticks only for the visible slice, not the whole canvas", async () => {
    // Eight centuries: at deep zoom a full tick walk would build hundreds of thousands of nodes.
    const chart = mount(spread([735, 935, 1135, 1335, 1535]));
    for (let i = 0; i < 60; i++) await chart.wheel(-120);
    expect(chart.width()).toBeGreaterThan(1_000_000);
    expect(chart.all(".ui-chart-swim-grid").length).toBeLessThan(200);
  });

  it("caps the canvas width at deep zoom and stays pinned there", async () => {
    const chart = mount(spread([1, 500, 1000, 1500, 2000]));
    for (let i = 0; i < 80; i++) await chart.wheel(-120);
    const capped = chart.width();
    expect(capped).toBeLessThanOrEqual(16_000_000);
    await chart.wheel(-120);
    expect(chart.width()).toBe(capped);
  });

  it("exposes the source path on markers that have one", () => {
    const sourced = mount(data).container.querySelector<HTMLElement>(
      ".ui-chart-swim-marker.has-href",
    )!;
    expect(sourced.dataset.href).toBe("historian/events/war.md");
    expect(sourced.dataset.label).toBe("War begins");
  });

  it("renders inline labels on density-gated markers", () => {
    const labels = mount(data)
      .all(".ui-chart-swim-label")
      .map((l) => l.textContent);
    // At fit density rows are sparse here, so every beat gets its label.
    expect(labels).toContain("★ War begins"); // major → star prefix
    expect(labels).toContain("Aelith born");
  });

  it("shows an empty state when there are no events", () => {
    const { container } = mount({ events: [] });
    expect(container.querySelector(".chart-empty")).toBeTruthy();
    expect(container.querySelector(".ui-chart-swim-canvas")).toBeNull();
  });

  it("renders per-row density bars for crowded tracks and recounts them on filter", () => {
    const chart = mount({
      calendar: null,
      events: Array.from({ length: 40 }, (_, i) => ({
        date: `1340-01-${String((i % 28) + 1).padStart(2, "0")}`,
        label: `b${i}`,
        track: i % 2 === 0 ? "world" : "faction", // not 'party': that would set a campaign floor
      })),
    });
    expect(chart.all(".ui-chart-swim-bar").length).toBeGreaterThan(0);
    expect(chart.markers().length).toBeLessThan(40); // crowd aggregated
    const shown = () =>
      chart.all(".ui-chart-swim-marker:not(.ui-chart-hidden)").length + chart.barSum();
    expect(shown()).toBe(40);
    const before = chart.barSum();
    fireEvent.click(chart.chip("faction")); // drop half the beats
    expect(chart.barSum()).toBeLessThan(before);
    expect(shown()).toBe(20);
  });

  it("hides pre-campaign history behind the History toggle", () => {
    const chart = mount({
      calendar: null,
      events: [
        { date: "1300-01-01", label: "Old war", track: "world" },
        { date: "1340-01-01", label: "S1", track: "party" },
        { date: "1341-01-01", label: "Later", track: "world" },
      ],
    });
    const labels = () => chart.markers().map((m) => m.dataset.label);
    expect(labels()).not.toContain("Old war"); // before the first party beat
    const history = chart.slot.querySelector<HTMLInputElement>(".chart-swim-deephistory input")!;
    fireEvent.click(history);
    expect(labels()).toContain("Old war");
  });

  it("refits the canvas to the container width when it resizes", async () => {
    const stub = stubResize(800);
    try {
      const chart = mount(data);
      const before = chart.width();
      await stub.resize(1600);
      // Fit density tracks width, so the level-1 canvas grows with the viewport.
      expect(chart.width()).toBeGreaterThan(before);
    } finally {
      stub.restore();
    }
  });

  it("getState() snapshots the live query and track selection", () => {
    const chart = mount(data);
    chart.search("aelith");
    fireEvent.click(chart.chip("world"));
    const state = chart.state();
    expect(state.query).toBe("aelith");
    expect(state.tracks).toEqual(["world"]);
    expect(state.zoomLevel).toBe(1);
  });

  it("seeds the filter UI from initialState and round-trips through getState()", () => {
    const chart = mount(data, {
      query: "war",
      tracks: ["world"],
      zoomLevel: 1,
      scrollLeft: 0,
      audiences: [],
    });
    expect(chart.container.querySelector<HTMLInputElement>(".chart-search")!.value).toBe("war");
    expect(chart.chip("world").getAttribute("aria-pressed") === "true").toBe(true);
    expect(chart.state()).toMatchObject({ query: "war", tracks: ["world"] });
  });
});
