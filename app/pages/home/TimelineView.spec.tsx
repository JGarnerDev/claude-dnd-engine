// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { TimelineView, type View } from "./TimelineView.js";
import type { TimelineData } from "../../components/charts/_common/types.js";

describe("TimelineView", () => {
  let container: HTMLElement;
  beforeEach(() => localStorage.clear());

  const mount = (d: TimelineData | null, initial?: View) => {
    container = render(<TimelineView data={d} initial={initial} />).container;
  };

  const data: TimelineData = {
    calendar: null,
    events: [
      { date: "1340-02-15", label: "War begins", track: "world", major: true },
      { date: "1341-06-01", label: "Aelith born", track: "character:Aelith" },
    ],
  };

  const tab = (label: string) =>
    [...container.querySelectorAll<HTMLElement>(".chart-viewtab")].find(
      (b) => b.textContent === label,
    )!;
  const isSelected = (label: string) => tab(label).getAttribute("aria-selected") === "true";

  it("renders a World and Campaign tab", () => {
    mount(data);
    const labels = [...container.querySelectorAll(".chart-viewtab")].map((b) => b.textContent);
    expect(labels).toEqual(["World", "Campaign"]);
  });

  it("shows the world view by default (single-axis markers, no swimlanes)", () => {
    mount(data);
    expect(container.querySelector(".ui-chart-canvas")).toBeTruthy();
    expect(container.querySelector(".ui-chart-swim-canvas")).toBeFalsy();
    expect(isSelected("World")).toBe(true);
  });

  it("honors an explicit initial view", () => {
    mount(data, "tracks");
    expect(container.querySelector(".ui-chart-swim-canvas")).toBeTruthy();
    expect(isSelected("Campaign")).toBe(true);
  });

  it("swaps to the swimlane view when Campaign is clicked", () => {
    mount(data);
    fireEvent.click(tab("Campaign"));
    expect(container.querySelector(".ui-chart-swim-canvas")).toBeTruthy();
    expect(container.querySelector(".ui-chart-canvas")).toBeFalsy();
    expect(isSelected("Campaign")).toBe(true);
    expect(isSelected("World")).toBe(false);
  });

  it("swaps back to the world view", () => {
    mount(data, "tracks");
    fireEvent.click(tab("World"));
    expect(container.querySelector(".ui-chart-canvas")).toBeTruthy();
    expect(container.querySelector(".ui-chart-swim-canvas")).toBeFalsy();
  });

  it("mounts Save · Load · Settings in the header actions, in that order", () => {
    mount(data);
    const actions = container.querySelector(".chart-actions")!;
    const btns = [...actions.querySelectorAll<HTMLButtonElement>("button[title]")].map(
      (b) => b.title,
    );
    expect(btns).toEqual(["Save view", "Load view", "Settings"]);
  });

  it("hosts the active chart's controls in the settings panel", () => {
    mount(data);
    // Each chart portals its own panel, so re-query after every swap.
    const groups = () =>
      container.querySelectorAll(".chart-settings-panel .chart-settings-group").length;
    const before = groups();
    expect(before).toBeGreaterThan(0);
    // Swapping charts swaps the controls with them, not appends.
    fireEvent.click(tab("Campaign"));
    expect(container.querySelectorAll(".chart-settings-panel")).toHaveLength(1);
    fireEvent.click(tab("World"));
    expect(container.querySelectorAll(".chart-settings-panel")).toHaveLength(1);
    expect(groups()).toBe(before);
  });

  it("saves the current view and restores its tab via Load", () => {
    mount(data); // world tab active
    fireEvent.change(container.querySelector(".chart-sv-name")!, { target: { value: "home" } });
    fireEvent.click(container.querySelector(".chart-sv-confirm")!);
    fireEvent.click(tab("Campaign")); // drift away
    expect(container.querySelector(".ui-chart-swim-canvas")).toBeTruthy();
    fireEvent.click(container.querySelectorAll(".chart-sv-btn")[1]); // open Load
    fireEvent.click(container.querySelector(".chart-sv-load")!); // apply 'home'
    expect(container.querySelector(".ui-chart-canvas")).toBeTruthy();
    expect(container.querySelector(".ui-chart-swim-canvas")).toBeFalsy();
    expect(isSelected("World")).toBe(true);
  });

  it("renders the empty state (no tabs/canvas) when there are no events", () => {
    for (const empty of [null, { calendar: null, events: [] } as TimelineData]) {
      mount(empty);
      expect(container.querySelector(".chart-empty")).toBeTruthy();
      expect(container.querySelector(".chart-viewtab")).toBeFalsy();
      expect(container.querySelector(".ui-chart-canvas")).toBeFalsy();
    }
  });

  it("shows no campaign selector when the graph knows no campaigns", () => {
    mount(data); // no `campaigns`
    expect(container.querySelector(".chart-campaign-select")).toBeFalsy();
  });

  describe("campaign selector", () => {
    const multi: TimelineData = {
      calendar: null,
      campaigns: [
        { slug: "strahd", label: "Curse of Strahd", active: true },
        { slug: "homebrew", label: "Homebrew Campaign", active: false },
      ],
      events: [
        { date: "1340-02-15", label: "War begins", track: "world", campaign: "strahd" },
        { date: "1341-06-01", label: "A timeless myth", track: "world" }, // agnostic
      ],
    };
    const pick = () => container.querySelector<HTMLSelectElement>(".chart-campaign-select")!;
    const choose = (slug: string) => fireEvent.change(pick(), { target: { value: slug } });
    const markers = (sel: string) =>
      [...container.querySelectorAll<HTMLElement>(sel)].map((m) => m.dataset.label);

    it("mounts a selector defaulting to the active campaign", () => {
      mount(multi);
      expect(pick().value).toBe("strahd");
      expect([...pick().options].map((o) => o.textContent)).toEqual([
        "Curse of Strahd",
        "Homebrew Campaign",
      ]);
    });

    it("renders the active campaign plus agnostic beats, not other campaigns", () => {
      mount(multi);
      const labels = markers(".ui-chart-marker");
      expect(labels).toContain("War begins"); // strahd
      expect(labels).toContain("A timeless myth"); // agnostic — shows under every campaign
    });

    it("scopes out other campaigns when one is selected, keeping agnostic beats", () => {
      mount(multi);
      choose("homebrew");
      // Homebrew has no own dated beats, but the agnostic beat still shows.
      expect(markers(".ui-chart-marker")).toEqual(["A timeless myth"]);
      expect(pick().value).toBe("homebrew");
    });

    it("renders the chart empty state when a campaign has no visible beats", () => {
      mount({
        calendar: null,
        campaigns: multi.campaigns,
        events: [{ date: "1340-02-15", label: "War begins", track: "world", campaign: "strahd" }],
      });
      choose("homebrew");
      expect(container.querySelector(".ui-chart-canvas")).toBeFalsy();
      expect(container.querySelector(".chart-empty")).toBeTruthy();
      // Header + selector stay so the DM can switch back.
      expect(container.querySelector(".chart-campaign-select")).toBeTruthy();
    });

    it("Campaign (tracks) view spans all campaigns regardless of the selector", () => {
      mount(multi);
      choose("homebrew"); // would scope the World view to agnostic-only
      fireEvent.click(tab("Campaign"));
      const labels = markers(".ui-chart-swim-marker");
      expect(labels).toContain("War begins"); // strahd beat still shows on the cross-campaign view
      expect(labels).toContain("A timeless myth");
    });

    it("hides the selector on the Campaign view and shows it on World", () => {
      mount(multi, "tracks");
      expect(pick().hidden).toBe(true);
      fireEvent.click(tab("World"));
      expect(pick().hidden).toBe(false);
    });
  });
});
