// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { fireEvent } from "@testing-library/react";
import { Timeline } from "./Timeline.js";
import { mountChart, wheel, px, stubResize } from "../_common/chart.test-helper.js";
import type { ChartState, TimelineData } from "../_common/types.js";

const data: TimelineData = {
  calendar: null,
  events: [
    {
      date: "1340-02-15",
      label: "Winter begins",
      track: "world",
      major: true,
      source: "historian/events/winter.md",
    },
    { date: "1341-06-01", label: "Trade pact", track: "faction" },
    { date: "1342-06-20", label: "Tax revolt", track: "world", minor: true },
  ],
};

// 50 beats packed into one month: at fit density they share pixel buckets and roll
// into density bars rather than 50 markers. Half on each of two tracks.
const dense: TimelineData = {
  calendar: null,
  events: Array.from({ length: 50 }, (_, i) => ({
    date: `1340-01-${String((i % 28) + 1).padStart(2, "0")}`,
    label: `beat ${i}`,
    track: i % 2 === 0 ? "world" : "party",
  })),
};

function mount(d: TimelineData, initialState?: ChartState) {
  const chart = mountChart(Timeline, d, initialState);
  const { container, all } = chart;
  const viewport = () => container.querySelector<HTMLElement>(".ui-chart-viewport")!;
  return {
    ...chart,
    viewport,
    width: () => px(container.querySelector<HTMLElement>(".ui-chart-canvas")),
    markers: () => all(".ui-chart-marker"),
    visible: () => all(".ui-chart-marker:not(.ui-chart-hidden)"),
    barSum: () =>
      all(".ui-chart-bar:not(.ui-chart-hidden)").reduce((s, b) => s + Number(b.dataset.count), 0),
    // Matching beats shown: visible individual markers plus visible bar members.
    shown: () =>
      all(".ui-chart-marker:not(.ui-chart-hidden)").length +
      all(".ui-chart-bar:not(.ui-chart-hidden)").reduce((s, b) => s + Number(b.dataset.count), 0),
    wheel: (deltaY: number) => wheel(viewport(), deltaY),
  };
}

describe("Timeline", () => {
  it("renders one marker per event", () => {
    expect(mount(data).markers()).toHaveLength(3);
  });

  it("shows an empty state when there are no events", () => {
    const { container, state } = mount({ events: [] });
    expect(container.querySelector(".chart-empty")).toBeTruthy();
    expect(container.querySelector(".ui-chart-canvas")).toBeNull();
    expect(state().zoomLevel).toBe(1);
  });

  it("adds the host className to its .chart-root", () => {
    const { container } = mount(data);
    expect(container.firstElementChild!.classList.contains("chart-root")).toBe(true);
  });

  it("refits the canvas to the container width when it resizes", async () => {
    const stub = stubResize(800);
    try {
      const { width } = mount(data);
      const before = width();
      await stub.resize(1600);
      // Fit density tracks width, so the level-1 canvas grows with the viewport.
      expect(width()).toBeGreaterThan(before);
    } finally {
      stub.restore();
    }
  });

  it("sizes the fit-zoom canvas to stay within the viewport width", () => {
    const stub = stubResize(900);
    try {
      // Both MARGIN gutters stay visible at zoom 1: no horizontal scroll.
      expect(mount(data).width()).toBeLessThanOrEqual(900);
    } finally {
      stub.restore();
    }
  });

  it("renders sessions as bands (not dots) and opens their source on click", () => {
    const { container, all, markers } = mount({
      calendar: null,
      events: [
        {
          date: "1340-01-01",
          label: "S1 The Inn",
          track: "party",
          session: true,
          source: "historian/sessions/s1.md",
        },
        { date: "1340-02-01", label: "A world beat", track: "world" },
        { date: "1340-03-01", label: "S2 Death House", track: "party", session: true },
      ],
    });
    const bands = all(".ui-chart-band");
    expect(bands.map((b) => b.dataset.label)).toEqual(["S1 The Inn", "S2 Death House"]);
    expect(markers()).toHaveLength(1); // sessions aren't on-axis dots

    let opened = "";
    window.open = ((url?: string) => {
      opened = url ?? "";
      return null;
    }) as typeof window.open;
    fireEvent.click(container.querySelector(".ui-chart-band.has-href")!);
    expect(opened).toBe("historian/sessions/s1.md");
  });

  it("hides session bands too narrow to read (zoomed-out slivers)", () => {
    // Two sessions on one in-world date collapse to ~0-width bands.
    const { all } = mount({
      calendar: null,
      events: [
        { date: "1340-06-01", label: "S1", track: "party", session: true },
        { date: "1340-06-01", label: "S2", track: "party", session: true },
      ],
    });
    expect(all(".ui-chart-band")).toHaveLength(0);
  });

  it("shows session bands once they are wide enough", () => {
    const { all } = mount({
      calendar: null,
      events: [
        { date: "1340-06-01", label: "S1", track: "party", session: true },
        { date: "1342-06-01", label: "S2", track: "party", session: true },
      ],
    });
    expect(all(".ui-chart-band").length).toBeGreaterThan(0);
  });

  it("gives each marker a dot, leader, and label", () => {
    for (const marker of mount(data).markers()) {
      expect(marker.querySelector(".ui-chart-dot")).toBeTruthy();
      expect(marker.querySelector(".ui-chart-leader")).toBeTruthy();
      expect(marker.querySelector(".ui-chart-label")).toBeTruthy();
    }
  });

  it("places each marker above or below the axis, with its offset and shift", () => {
    for (const marker of mount(data).markers()) {
      expect(marker.classList.contains("above") !== marker.classList.contains("below")).toBe(true);
      expect(marker.style.getPropertyValue("--ui-chart-offset")).toMatch(/px$/);
      expect(marker.style.getPropertyValue("--ui-chart-shift")).toMatch(/px$/);
    }
  });

  it("tags markers with their track", () => {
    const tracks = mount(data)
      .markers()
      .map((m) => m.dataset.group);
    expect(tracks).toContain("world");
    expect(tracks).toContain("faction");
  });

  it("marks major events with a star and weight class", () => {
    const { container } = mount(data);
    const major = container.querySelector(".ui-chart-marker.is-major")!;
    expect(major.querySelector(".ui-chart-label")!.textContent).toMatch(/^★ /);
  });

  it("dims minor events with the minor weight class", () => {
    expect(mount(data).container.querySelector(".ui-chart-marker.is-minor")).toBeTruthy();
  });

  it("renders year tick labels across the span", () => {
    const ticks = mount(data)
      .all(".ui-chart-tick-label")
      .map((t) => t.textContent);
    expect(ticks).toContain("1340");
    expect(ticks).toContain("1342");
  });

  it("widens the canvas when zooming in with the wheel", async () => {
    const chart = mount(data);
    const before = chart.width();
    await chart.wheel(-120);
    await chart.wheel(-120);
    expect(chart.width()).toBeGreaterThan(before);
    expect(chart.markers()).toHaveLength(3);
    expect(chart.state().zoomLevel).toBeGreaterThan(1);
  });

  it("narrows the canvas back when zooming out, floored at fit", async () => {
    const chart = mount(data);
    const base = chart.width();
    await chart.wheel(-120);
    await chart.wheel(-120);
    expect(chart.width()).toBeGreaterThan(base);
    await chart.wheel(120);
    await chart.wheel(120);
    await chart.wheel(120);
    expect(chart.width()).toBe(base);
  });

  it("holds canvas height steady across zoom", async () => {
    const chart = mount(data);
    const height = () =>
      chart.container.querySelector<HTMLElement>(".ui-chart-canvas")!.style.height;
    const before = height();
    await chart.wheel(-120);
    await chart.wheel(-120);
    expect(height()).toBe(before);
  });

  it("portals a search box and one chip per track into the settings slot", () => {
    const { slot, all } = mount(data);
    expect(slot.querySelector(".chart-settings-panel .chart-search")).toBeTruthy();
    expect(all(".chart-chip").map((c) => c.dataset.track)).toEqual(["world", "faction"]);
  });

  it("filters markers by search text (hiding in place, not relaying out)", () => {
    const chart = mount(data);
    chart.search("revolt");
    expect(chart.markers()).toHaveLength(3); // x/y never shift; non-matches hide
    expect(chart.visible().map((m) => m.dataset.label)).toEqual(["Tax revolt"]);
  });

  it("re-gates labels to the filtered set: a lone search hit regains its label", () => {
    // 30 year-apart beats: at fit density their labels collide, so many go bare.
    const chart = mount({
      calendar: null,
      events: Array.from({ length: 30 }, (_, i) => ({
        date: `${1340 + i}-06-01`,
        label: `beat ${i}`,
        track: "world",
      })),
    });
    expect(chart.all(".ui-chart-marker.ui-chart-bare").length).toBeGreaterThan(0);
    chart.search("beat 5");
    const visible = chart.visible();
    expect(visible).toHaveLength(1);
    expect(visible[0].classList.contains("ui-chart-bare")).toBe(false);
    expect(visible[0].dataset.label).toBe("beat 5");
  });

  it("selects a track to show only its markers", () => {
    const chart = mount(data);
    fireEvent.click(chart.chip("world"));
    expect(chart.visible().map((m) => m.dataset.group)).toEqual(["world", "world"]);
  });

  it("keeps the time axis fixed when filtering", () => {
    const chart = mount(data);
    const width = chart.width();
    const ticks = chart.all(".ui-chart-tick-label").length;
    const xs = chart.markers().map((m) => m.style.left);
    chart.search("e");
    fireEvent.click(chart.chip("world"));
    expect(chart.width()).toBe(width);
    expect(chart.all(".ui-chart-tick-label").length).toBe(ticks);
    expect(chart.markers().map((m) => m.style.left)).toEqual(xs);
  });

  it("keeps the chart (axis + ticks) even when filters exclude every beat", () => {
    const chart = mount(data);
    chart.search("nothing matches this");
    expect(chart.container.querySelector(".ui-chart-axis")).toBeTruthy();
    expect(chart.all(".ui-chart-tick-label").length).toBeGreaterThan(0);
    expect(chart.container.querySelector(".chart-empty")).toBeNull();
    expect(chart.visible()).toHaveLength(0);
  });

  it("exposes the source path on markers that have one", () => {
    const sourced = mount(data).container.querySelector<HTMLElement>(".ui-chart-marker.has-href")!;
    expect(sourced.dataset.href).toBe("historian/events/winter.md");
    expect(sourced.dataset.label).toBe("Winter begins");
  });

  it("renders density bars for crowded beats instead of a marker each", () => {
    const chart = mount(dense);
    expect(chart.all(".ui-chart-bar").length).toBeGreaterThan(0);
    expect(chart.markers().length).toBeLessThan(50);
    expect(Number(chart.all(".ui-chart-bar")[0].dataset.count)).toBeGreaterThan(1);
    expect(chart.shown()).toBe(50);
  });

  it("recounts and hides density bars to match the active filter", () => {
    const chart = mount(dense);
    const barSum = chart.barSum();
    expect(barSum).toBeGreaterThan(0);
    fireEvent.click(chart.chip("world")); // whitelist half the beats
    expect(chart.shown()).toBe(25);
    expect(chart.barSum()).toBeLessThan(barSum);
    chart.search("nothing matches this");
    expect(chart.all(".ui-chart-bar:not(.ui-chart-hidden)")).toHaveLength(0);
    expect(chart.shown()).toBe(0);
  });

  it("zooms in when a density bar is clicked", () => {
    const chart = mount(dense);
    const before = chart.width();
    fireEvent.click(chart.all(".ui-chart-bar:not(.ui-chart-hidden)")[0]);
    expect(chart.width()).toBeGreaterThan(before);
  });

  it("getState() snapshots the live query and track selection", () => {
    const chart = mount(data);
    chart.search("pact");
    fireEvent.click(chart.chip("faction"));
    const state = chart.state();
    expect(state.query).toBe("pact");
    expect(state.tracks).toEqual(["faction"]);
    expect(state.zoomLevel).toBe(1);
  });

  it("seeds the filter UI from initialState and round-trips through getState()", () => {
    const chart = mount(data, {
      query: "pact",
      tracks: ["faction"],
      zoomLevel: 1,
      scrollLeft: 0,
      audiences: [],
    });
    expect(chart.container.querySelector<HTMLInputElement>(".chart-search")!.value).toBe("pact");
    expect(chart.chip("faction").classList.contains("is-on")).toBe(true);
    expect(chart.visible().map((m) => m.dataset.group)).toEqual(["faction"]);
    expect(chart.state()).toMatchObject({ query: "pact", tracks: ["faction"] });
  });

  it("seeds zoom from initialState", () => {
    const chart = mount(data, {
      query: "",
      tracks: [],
      zoomLevel: 2,
      scrollLeft: 0,
      audiences: [],
    });
    expect(chart.state().zoomLevel).toBe(2);
  });

  it("drops a seeded track that no longer exists in the data (fail soft)", () => {
    const chart = mount(data, {
      query: "",
      tracks: ["gone"],
      zoomLevel: 1,
      scrollLeft: 0,
      audiences: [],
    });
    expect(chart.state().tracks).toEqual([]);
    expect(chart.visible()).toHaveLength(3);
  });

  describe("Known-by viewpoint beats", () => {
    const withKnowledge: TimelineData = {
      calendar: null,
      events: [
        ...data.events, // 3 public beats
        { date: "1343-01-01", label: "Mara overhears", track: "world", knownBy: ["Mara"] },
        { date: "1343-06-01", label: "The nameless rite", track: "world", secret: true }, // DM-only
      ],
    };
    const audChip = (chart: ReturnType<typeof mount>, label: string) =>
      chart.all(".chart-chip-audience").find((c) => c.textContent === label);
    const labels = (chart: ReturnType<typeof mount>) => chart.visible().map((m) => m.dataset.label);

    it("shows everything by default and exposes DM + character chips", () => {
      const chart = mount(withKnowledge);
      expect(chart.shown()).toBe(5);
      expect(audChip(chart, "DM")).toBeTruthy();
      expect(audChip(chart, "Mara")).toBeTruthy();
    });

    it("scopes to a character's knowledge (public + their knownBy, no secret)", () => {
      const chart = mount(withKnowledge);
      fireEvent.click(audChip(chart, "Mara")!);
      expect(labels(chart)).toContain("Mara overhears");
      expect(labels(chart)).not.toContain("The nameless rite");
      expect(chart.shown()).toBe(4);
      expect(chart.state().audiences).toEqual(["Mara"]);
    });

    it("shows every beat incl. the secret when the DM chip is clicked", () => {
      const chart = mount(withKnowledge);
      fireEvent.click(audChip(chart, "DM")!);
      expect(chart.shown()).toBe(5);
      expect(labels(chart)).toContain("The nameless rite");
    });

    it("shows no viewpoint chips when no beat has knownBy or is secret", () => {
      expect(mount(data).container.querySelector(".chart-chip-audience")).toBeNull();
    });
  });
});
