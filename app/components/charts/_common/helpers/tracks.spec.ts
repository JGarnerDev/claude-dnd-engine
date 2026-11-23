import { describe, it, expect } from "vitest";
import {
  parseTrack,
  buildTrackTree,
  toneFor,
  lanesFor,
  laneFor,
  DEFAULT_CATEGORIES,
} from "./tracks.js";
import type { TimelineEvent } from "../types.js";

describe("parseTrack", () => {
  it("splits category:member on the first colon", () => {
    expect(parseTrack("faction:The Ashen Cult")).toEqual({
      category: "faction",
      member: "The Ashen Cult",
    });
  });

  it("treats a bare string as a parent category with no member", () => {
    expect(parseTrack("world")).toEqual({ category: "world", member: null });
  });

  it("defaults blank/undefined to the world lane", () => {
    expect(parseTrack("")).toEqual({ category: "world", member: null });
    expect(parseTrack(undefined)).toEqual({ category: "world", member: null });
  });

  it("keeps colons inside the member name", () => {
    expect(parseTrack("faction:Cult: of the Hollow")).toEqual({
      category: "faction",
      member: "Cult: of the Hollow",
    });
  });
});

describe("buildTrackTree", () => {
  const ev = (track: string | undefined, label = "x"): TimelineEvent => ({
    date: "1340",
    label,
    track,
  });

  it("emits only categories that carry beats, in config order", () => {
    const tree = buildTrackTree([ev("world"), ev("party"), ev("faction:Cult")]);
    expect(tree.map((c) => c.key)).toEqual(["party", "faction", "world"]);
  });

  it("derives child members in first-seen order, deduped", () => {
    const tree = buildTrackTree([ev("character:Mara"), ev("character:Iggy"), ev("character:Mara")]);
    const characters = tree.find((c) => c.key === "character")!;
    expect(characters.members.map((m) => m.member)).toEqual(["Mara", "Iggy"]);
  });

  it("flags a category that has a beat sitting directly on the parent", () => {
    const tree = buildTrackTree([ev("party"), ev("party:Alpha Squad")]);
    const party = tree.find((c) => c.key === "party")!;
    expect(party.hasParentBeats).toBe(true);
    expect(party.members.map((m) => m.member)).toEqual(["Alpha Squad"]);
  });

  it("carries config label/color/collapse onto the category", () => {
    const tree = buildTrackTree([ev("faction:Cult")]);
    const faction = tree.find((c) => c.key === "faction")!;
    expect(faction.label).toBe("Factions");
    expect(faction.hue).toBe("var(--ui-cat-2)");
    expect(faction.collapsed).toBe(true);
  });

  it("appends unknown categories after configured ones with sane fallbacks", () => {
    const tree = buildTrackTree([ev("world"), ev("deity:Pelor")]);
    expect(tree.map((c) => c.key)).toEqual(["world", "deity"]);
    const deity = tree.find((c) => c.key === "deity")!;
    expect(deity.label).toBe("deity");
    expect(deity.hue).toBe("var(--ui-cat-1)");
  });

  it("defaults untagged events to the world parent", () => {
    const tree = buildTrackTree([ev(undefined)]);
    expect(tree.map((c) => c.key)).toEqual(["world"]);
    expect(tree[0].hasParentBeats).toBe(true);
  });

  it("ships the documented default categories in order", () => {
    expect(DEFAULT_CATEGORIES.map((c) => c.key)).toEqual([
      "party",
      "character",
      "npc",
      "antagonist",
      "faction",
      "continent",
      "world",
    ]);
  });
});

describe("toneFor", () => {
  it("uses the category's track color, members included", () => {
    expect(toneFor("faction:Cult")).toBe("var(--ui-cat-2)");
    expect(toneFor("party")).toBe("var(--ui-cat-7)");
  });

  it("gives blank and unknown tracks the World look", () => {
    expect(toneFor(undefined)).toBe("var(--ui-cat-1)");
    expect(toneFor("deity:Pelor")).toBe("var(--ui-cat-1)");
  });
});

describe("lanesFor", () => {
  const ev = (track: string): TimelineEvent => ({ date: "1340", label: "x", track });
  const tree = buildTrackTree([ev("party"), ev("character:Mara"), ev("character:Iggy")]);

  it("gives a leaf category one row with no toggle", () => {
    const party = lanesFor(tree, new Set()).find((l) => l.key === "party")!;
    expect(party.toggle).toBeUndefined();
    expect(party.tone).toBe("var(--ui-cat-7)");
  });

  it("opens a parent into a header row then one child row per member", () => {
    const lanes = lanesFor(tree, new Set()).filter((l) => l.key.startsWith("character"));
    expect(lanes.map((l) => [l.key, l.toggle, l.depth])).toEqual([
      ["character", "open", undefined],
      ["character:Mara", undefined, 1],
      ["character:Iggy", undefined, 1],
    ]);
  });

  it("rolls a collapsed parent up into one row", () => {
    const lanes = lanesFor(tree, new Set(["character"])).filter((l) =>
      l.key.startsWith("character"),
    );
    expect(lanes.map((l) => [l.key, l.toggle])).toEqual([["character", "closed"]]);
  });
});

describe("laneFor", () => {
  it("puts a member beat on its child row when it's shown", () => {
    expect(laneFor("character:Mara", new Set(["character", "character:Mara"]))).toBe(
      "character:Mara",
    );
  });

  it("falls back to the category row when the child is hidden or absent", () => {
    expect(laneFor("character:Mara", new Set(["character"]))).toBe("character");
    expect(laneFor("party", new Set(["party"]))).toBe("party");
    expect(laneFor(undefined, new Set())).toBe("world");
  });
});
