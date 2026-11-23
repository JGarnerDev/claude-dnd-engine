// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SettingsPanel } from "jeff-ui";
import { SavedViews } from "./SavedViews.js";
import { listViews, saveView } from "./helpers/viewstore.js";
import type { ChartState, SavedView } from "./types.js";

const state = (over: Partial<ChartState> = {}): ChartState => ({
  query: "",
  tracks: [],
  zoomLevel: 1,
  scrollLeft: 0,
  audiences: [],
  ...over,
});

// The header row as the chart lays it out: Save, Load, then the gear.
function mount(over: { tab?: SavedView["tab"]; state?: ChartState } = {}) {
  const apply = vi.fn();
  const getCurrent = vi.fn(() => ({ tab: over.tab ?? "world", state: over.state ?? state() }));
  const { container } = render(
    <div className="chart-actions">
      <SavedViews getCurrent={getCurrent} apply={apply} />
      <SettingsPanel
        sections={[{ label: "Zoom", content: <button className="sec-zoom">+</button> }]}
      />
    </div>,
  );
  const q = <T extends HTMLElement>(sel: string) => container.querySelector<T>(sel)!;
  const all = <T extends HTMLElement>(sel: string) => [...container.querySelectorAll<T>(sel)];
  const [save, load, gear] = all<HTMLButtonElement>(".ui-popover-btn");
  const [savePanel, loadPanel, settings] = all(".ui-popover-panel");
  const typeName = (name: string) =>
    fireEvent.change(q(".chart-sv-name"), { target: { value: name } });
  return { apply, q, all, save, load, savePanel, loadPanel, gear, settings, typeName };
}

const isOpen = (panel: HTMLElement) => panel.hasAttribute("data-open");

describe("SavedViews", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders Save and Load buttons in that order, both closed", () => {
    const { all, savePanel, loadPanel } = mount();
    expect(all<HTMLButtonElement>(".ui-popover-btn").map((b) => b.title)).toEqual([
      "Save view",
      "Load view",
      "Settings",
    ]);
    expect([isOpen(savePanel), isOpen(loadPanel)]).toEqual([false, false]);
  });

  it("focuses the name field when Save opens", () => {
    const { save, q } = mount();
    fireEvent.click(save);
    expect(document.activeElement).toBe(q(".chart-sv-name"));
  });

  it("saves the current view under a typed name and closes", () => {
    const { save, savePanel, q, typeName } = mount({
      tab: "tracks",
      state: state({ query: "siege", zoomLevel: 4 }),
    });
    fireEvent.click(save);
    typeName("Act 2");
    fireEvent.click(q(".chart-sv-confirm"));
    expect(listViews()).toEqual([
      { name: "Act 2", tab: "tracks", state: state({ query: "siege", zoomLevel: 4 }) },
    ]);
    expect(isOpen(savePanel)).toBe(false);
  });

  it("saves on Enter in the name field", () => {
    const { q, typeName } = mount();
    typeName("Quick");
    fireEvent.keyDown(q(".chart-sv-name"), { key: "Enter" });
    expect(listViews().map((v) => v.name)).toEqual(["Quick"]);
  });

  it("ignores a blank name", () => {
    const { q, typeName } = mount();
    typeName("   ");
    fireEvent.click(q(".chart-sv-confirm"));
    expect(listViews()).toEqual([]);
  });

  it("requires a second confirm to overwrite an existing name", () => {
    saveView({ name: "dup", tab: "world", state: state() });
    const { q, typeName } = mount({ state: state({ zoomLevel: 7 }) });
    typeName("dup");
    fireEvent.click(q(".chart-sv-confirm"));
    expect(q(".chart-sv-confirm").textContent).toBe("Overwrite?"); // staged, not yet written
    expect(q(".chart-sv-msg").textContent).toBe('"dup" already exists.');
    expect(listViews()[0].state.zoomLevel).toBe(1);
    fireEvent.click(q(".chart-sv-confirm"));
    expect(listViews()).toHaveLength(1);
    expect(listViews()[0].state.zoomLevel).toBe(7);
  });

  it("cancels a staged overwrite when the name is edited", () => {
    saveView({ name: "dup", tab: "world", state: state() });
    const { q, typeName } = mount();
    typeName("dup");
    fireEvent.click(q(".chart-sv-confirm"));
    typeName("dup2");
    expect(q(".chart-sv-confirm").textContent).toBe("Save");
  });

  it("lists saved views on Load and applies one on click", () => {
    saveView({ name: "A", tab: "world", state: state() });
    saveView({ name: "B", tab: "tracks", state: state({ query: "x" }) });
    const { all, load, loadPanel, apply } = mount();
    fireEvent.click(load);
    const rows = all<HTMLButtonElement>(".chart-sv-load");
    // Each row names its view, with the tab it opens on the line under it.
    expect(rows.map((r) => r.textContent)).toEqual(["AWorld view", "BCampaign view"]);
    fireEvent.click(rows[1]);
    expect(apply).toHaveBeenCalledWith(expect.objectContaining({ name: "B", tab: "tracks" }));
    expect(isOpen(loadPanel)).toBe(false);
  });

  it("re-reads the store each time Load opens", () => {
    const { load, all } = mount();
    saveView({ name: "Late", tab: "world", state: state() });
    fireEvent.click(load);
    expect(all(".chart-sv-load").map((r) => r.textContent)).toEqual(["LateWorld view"]);
  });

  it("deletes a view from the Load list via its ×, staying open", () => {
    saveView({ name: "A", tab: "world", state: state() });
    saveView({ name: "B", tab: "world", state: state() });
    const { all, load, loadPanel } = mount();
    fireEvent.click(load);
    const del = all<HTMLButtonElement>(".chart-sv-del")[0];
    expect(del.getAttribute("aria-label")).toBe("Delete A");
    fireEvent.click(del);
    expect(listViews().map((v) => v.name)).toEqual(["B"]);
    expect(all(".chart-sv-load").map((r) => r.textContent)).toEqual(["BWorld view"]);
    expect(isOpen(loadPanel)).toBe(true);
  });

  it("shows an empty-state message when nothing is saved", () => {
    const { load, q } = mount();
    fireEvent.click(load);
    expect(q(".chart-sv-empty").textContent).toMatch(/no saved views/i);
  });
});

// One popover open at a time across the header: Save, Load and the gear.
describe("header popovers", () => {
  it("opening one closes the others; the opener stays open", () => {
    const { save, load, gear, savePanel, loadPanel, settings } = mount();
    fireEvent.click(save);
    expect(isOpen(savePanel)).toBe(true);
    fireEvent.click(load);
    expect([isOpen(savePanel), isOpen(loadPanel)]).toEqual([false, true]);
    fireEvent.click(gear);
    expect([isOpen(loadPanel), isOpen(settings)]).toEqual([false, true]);
    expect(load.getAttribute("aria-expanded")).toBe("false");
    expect(gear.getAttribute("aria-expanded")).toBe("true");
  });

  it("toggles closed on a second click of its button", () => {
    const { gear, settings } = mount();
    fireEvent.click(gear);
    fireEvent.click(gear);
    expect(isOpen(settings)).toBe(false);
  });

  it("hosts the settings sections under their labels", () => {
    const { q, settings } = mount();
    expect(q(".ui-settings-grouplabel").textContent).toBe("Zoom");
    expect(settings.querySelector(".sec-zoom")).toBeTruthy();
  });

  it("closes on an outside click but stays open on a click inside its panel", () => {
    const { gear, settings, q } = mount();
    fireEvent.click(gear);
    fireEvent.click(q(".sec-zoom"));
    expect(isOpen(settings)).toBe(true);
    fireEvent.click(document.body);
    expect(isOpen(settings)).toBe(false);
  });

  it("closes on Escape", () => {
    const { save, savePanel } = mount();
    fireEvent.click(save);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(isOpen(savePanel)).toBe(false);
  });

  it("makes closed panels inert", () => {
    const { save, savePanel, loadPanel } = mount();
    fireEvent.click(save);
    expect(savePanel.inert).toBe(false);
    expect(loadPanel.inert).toBe(true);
  });
});
