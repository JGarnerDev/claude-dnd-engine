// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import { SettingsPanel } from "jeff-ui";
import { useFilterSections, seedFilter, type FilterValue } from "./FilterBar.js";
import type { TimelineEvent } from "./types.js";

const events: TimelineEvent[] = [
  { date: "1340-01-01", label: "Winter begins", track: "world" },
  { date: "1341-01-01", label: "Trade pact", track: "faction" },
  { date: "1342-01-01", label: "Party forms", track: "party" },
];

const withKnowledge: TimelineEvent[] = [
  ...events,
  { date: "1343-01-01", label: "Mara overhears", track: "world", knownBy: ["Mara"] },
  { date: "1344-01-01", label: "Borin and Mara", track: "world", knownBy: ["Borin", "Mara"] },
  { date: "1345-01-01", label: "Nameless rite", track: "world", secret: true }, // DM-only
];

// The chart's side: owns the value, hosts the sections in the settings panel.
function mount(data: TimelineEvent[], initial = seedFilter(data)) {
  const changes: FilterValue[] = [];
  function Chart() {
    const [value, setValue] = useState(initial);
    const sections = useFilterSections(data, value, (next) => {
      changes.push(next);
      setValue(next);
    });
    return <SettingsPanel sections={sections} />;
  }
  const { container } = render(<Chart />);
  const all = <T extends HTMLElement>(sel: string) => [...container.querySelectorAll<T>(sel)];
  const group = () => container.querySelector<HTMLElement>(".chart-audiences");
  const chip = (label: string) =>
    all(".chart-chip-audience").find((c) => c.textContent?.replace("🔒", "").trim() === label)!;
  const track = (name: string) => all(".chart-chip").find((c) => c.dataset.track === name)!;
  return { container, changes, all, group, chip, track };
}

const onKeys = (chips: HTMLElement[], attr: "track" | "audience") =>
  chips.filter((c) => c.getAttribute("aria-pressed") === "true").map((c) => c.dataset[attr]);

describe("useFilterSections", () => {
  it("labels the panel groups Search and Filter", () => {
    const { all } = mount(events);
    expect(all(".ui-settings-grouplabel").map((g) => g.textContent)).toEqual(["Search", "Filter"]);
  });

  it("renders a search box and one chip per track, all off by default", () => {
    const { container, all } = mount(events);
    expect(container.querySelector(".chart-search")).toBeTruthy();
    const chips = all(".chart-chip");
    expect(chips.map((c) => c.dataset.track)).toEqual(["world", "faction", "party"]);
    expect(onKeys(chips, "track")).toEqual([]);
    expect(chips.every((c) => c.getAttribute("aria-pressed") === "false")).toBe(true);
  });

  it("updates the query through onChange on input", () => {
    const { container, changes } = mount(events);
    const search = container.querySelector<HTMLInputElement>(".chart-search")!;
    fireEvent.change(search, { target: { value: "pact" } });
    expect(changes.map((c) => c.query)).toEqual(["pact"]);
    expect(search.value).toBe("pact");
  });

  it("shows the query box and chips from the value it is given", () => {
    const { container, all } = mount(
      events,
      seedFilter(events, { query: "pact", tracks: ["faction"] }),
    );
    expect(container.querySelector<HTMLInputElement>(".chart-search")!.value).toBe("pact");
    expect(onKeys(all(".chart-chip"), "track")).toEqual(["faction"]);
  });

  it("toggles a track on then off, firing onChange each time", () => {
    const { track, changes } = mount(events);
    fireEvent.click(track("faction"));
    expect(track("faction").getAttribute("aria-pressed") === "true").toBe(true);
    expect(track("faction").getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(track("faction"));
    expect(track("faction").getAttribute("aria-pressed") === "true").toBe(false);
    expect(changes.map((c) => [...c.tracks])).toEqual([["faction"], []]);
  });

  describe("Known-by viewpoint group", () => {
    const chipText = (group: HTMLElement) =>
      [...group.querySelectorAll<HTMLElement>(".chart-chip-audience")].map((c) =>
        c.textContent?.replace("🔒", "").trim(),
      );

    it("is absent when no beat has knownBy and none is secret", () => {
      const { group, all } = mount(events);
      expect(group()).toBeNull();
      expect(all(".ui-settings-grouplabel").map((g) => g.textContent)).not.toContain("Known by");
    });

    it("builds a DM chip (secrets present) + one chip per character, all off", () => {
      const { group, all } = mount(withKnowledge);
      expect(chipText(group()!)).toEqual(["DM", "Mara", "Borin"]);
      expect(group()!.querySelector(".chart-chip-dm")).toBeTruthy();
      expect(onKeys(all(".chart-chip-audience"), "audience")).toEqual([]);
      expect(all(".ui-settings-grouplabel").map((g) => g.textContent)).toEqual([
        "Search",
        "Filter",
        "Known by",
      ]);
    });

    it("omits the DM chip when there are no secret beats", () => {
      const noSecret = [
        ...events,
        { date: "1343-01-01", label: "Mara overhears", track: "world", knownBy: ["Mara"] },
      ];
      const { group } = mount(noSecret);
      expect(chipText(group()!)).toEqual(["Mara"]);
    });

    it("toggles an audience into the set and fires onChange", () => {
      const { chip, changes } = mount(withKnowledge);
      fireEvent.click(chip("Mara"));
      expect(chip("Mara").getAttribute("aria-pressed") === "true").toBe(true);
      fireEvent.click(chip("Mara"));
      expect(chip("Mara").getAttribute("aria-pressed") === "true").toBe(false);
      expect(changes.map((c) => [...c.audiences])).toEqual([["Mara"], []]);
    });

    it("shows selected audiences from the value it is given", () => {
      const { chip } = mount(
        withKnowledge,
        seedFilter(withKnowledge, { query: "", tracks: [], audiences: ["Borin"] }),
      );
      expect(chip("Borin").getAttribute("aria-pressed") === "true").toBe(true);
      expect(chip("Mara").getAttribute("aria-pressed") === "true").toBe(false);
    });
  });
});

describe("seedFilter", () => {
  it("starts empty with no snapshot", () => {
    const v = seedFilter(events);
    expect([v.query, [...v.tracks], [...v.audiences]]).toEqual(["", [], []]);
  });

  it("keeps the snapshot query, tracks and audiences", () => {
    const v = seedFilter(withKnowledge, {
      query: "rite",
      tracks: ["world"],
      audiences: ["\0dm", "Mara"],
    });
    expect([v.query, [...v.tracks], [...v.audiences]]).toEqual([
      "rite",
      ["world"],
      ["\0dm", "Mara"],
    ]);
  });

  it("drops a seeded track or audience that no longer exists in the data", () => {
    const v = seedFilter(events, {
      query: "",
      tracks: ["gone", "party"],
      audiences: ["\0dm", "Mara"],
    });
    expect([...v.tracks]).toEqual(["party"]);
    expect([...v.audiences]).toEqual([]);
  });
});
