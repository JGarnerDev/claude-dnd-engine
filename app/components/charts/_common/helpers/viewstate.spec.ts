import { describe, it, expect } from "vitest";
import { resolveTracks, serializeState, applyDefaults, DEFAULT_STATE } from "./viewstate.js";

describe("resolveTracks", () => {
  it("keeps only saved names still present, in saved order", () => {
    expect(resolveTracks(["b", "a", "gone"], ["a", "b", "c"])).toEqual(["b", "a"]);
  });
  it("returns empty when nothing resolves", () => {
    expect(resolveTracks(["x", "y"], ["a", "b"])).toEqual([]);
  });
  it("returns empty for an empty saved selection", () => {
    expect(resolveTracks([], ["a", "b"])).toEqual([]);
  });
});

describe("serializeState", () => {
  it("snapshots live parts, draining the track Set to an array", () => {
    const state = serializeState(
      "siege",
      new Set(["world", "factions"]),
      4,
      120,
      new Set(["Mara"]),
    );
    expect(state).toEqual({
      query: "siege",
      tracks: ["world", "factions"],
      zoomLevel: 4,
      scrollLeft: 120,
      audiences: ["Mara"],
    });
  });
});

describe("applyDefaults", () => {
  it("returns a fresh default copy for null/garbage", () => {
    expect(applyDefaults(null)).toEqual(DEFAULT_STATE);
    expect(applyDefaults(undefined)).toEqual(DEFAULT_STATE);
    // a fresh copy, not the shared constant
    expect(applyDefaults(null)).not.toBe(DEFAULT_STATE);
  });
  it("fills missing fields and keeps valid ones", () => {
    expect(applyDefaults({ query: "a" })).toEqual({
      query: "a",
      tracks: [],
      zoomLevel: 1,
      scrollLeft: 0,
      audiences: [],
    });
  });
  it("drops wrong-typed fields and non-string tracks/audiences", () => {
    const raw = {
      query: 7,
      tracks: ["ok", 3, null],
      zoomLevel: "x",
      scrollLeft: NaN,
      audiences: ["Mara", 5, null],
    } as unknown;
    expect(applyDefaults(raw as Partial<typeof DEFAULT_STATE>)).toEqual({
      query: "",
      tracks: ["ok"],
      zoomLevel: 1,
      scrollLeft: 0,
      audiences: ["Mara"],
    });
  });
  it("keeps a valid audiences list", () => {
    expect(applyDefaults({ audiences: ["Mara", "Borin"] }).audiences).toEqual(["Mara", "Borin"]);
  });
});
