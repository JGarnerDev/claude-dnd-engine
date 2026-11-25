import { describe, expect, it } from "vitest";
import {
  frontmatterList,
  frontmatterValue,
  isBehind,
  isSessionsBehind,
  parseGuide,
  sessionsSince,
} from "./guide-file.js";

const TEXT = [
  "---",
  'pc: "Iggy"',
  'player: "Jeff"',
  "level: 5",
  "guide_confirmed: 35",
  "empty:",
  "---",
  "Intro.",
  "",
  "## Turn",
  "- Attack",
].join("\n");

describe("frontmatterValue", () => {
  it("reads and unquotes a scalar", () => {
    expect(frontmatterValue(TEXT, "pc")).toBe("Iggy");
    expect(frontmatterValue(TEXT, "level")).toBe("5");
  });

  it("returns null for missing or empty keys and for text without frontmatter", () => {
    expect(frontmatterValue(TEXT, "nope")).toBeNull();
    expect(frontmatterValue(TEXT, "empty")).toBeNull();
    expect(frontmatterValue("level: 5", "level")).toBeNull();
  });
});

describe("parseGuide", () => {
  it("builds the guide from frontmatter and body", () => {
    const g = parseGuide({ file: "Iggy.md", text: TEXT, pcLevel: 6, sessionsPlayed: [] });
    expect(g).toMatchObject({ pc: "Iggy", player: "Jeff", level: 5, pcLevel: 6, confirmed: "35" });
    expect(g).not.toHaveProperty("intro");
    expect(g.sections.map((s) => s.title)).toEqual(["Turn"]);
  });

  it("falls back to the file name for the PC and null for a bad level", () => {
    const g = parseGuide({
      file: "Shaw.md",
      text: "---\nlevel: five\n---\n",
      pcLevel: null,
      sessionsPlayed: [],
    });
    expect(g.pc).toBe("Shaw");
    expect(g.level).toBeNull();
  });
});

describe("isBehind", () => {
  it("is true only when the PC file's level is past the guide's", () => {
    expect(isBehind({ level: 5, pcLevel: 6 })).toBe(true);
    expect(isBehind({ level: 5, pcLevel: 5 })).toBe(false);
    expect(isBehind({ level: null, pcLevel: 6 })).toBe(false);
    expect(isBehind({ level: 5, pcLevel: null })).toBe(false);
  });
});

describe("frontmatterList", () => {
  const text = ["---", "pcs_present:", '  - "Iggy"', "  - Luci", "act: x", "---", "body"].join(
    "\n",
  );
  it("reads a list's items, unquoted, and stops at the next key", () => {
    expect(frontmatterList(text, "pcs_present")).toEqual(["Iggy", "Luci"]);
  });
  it("is empty for a missing key or a scalar", () => {
    expect(frontmatterList(text, "beats")).toEqual([]);
    expect(frontmatterList(text, "act")).toEqual([]);
  });
});

describe("sessionsSince and isSessionsBehind", () => {
  it("lists the sessions the PC played after guide_confirmed", () => {
    expect(sessionsSince({ confirmed: "35", sessionsPlayed: [34, 35, 36, 38] })).toEqual([36, 38]);
  });
  it("counts every played session when guide_confirmed is unset", () => {
    expect(sessionsSince({ confirmed: "", sessionsPlayed: [1, 2] })).toEqual([1, 2]);
  });
  it("is stale from two missed sessions, not one", () => {
    expect(isSessionsBehind({ confirmed: "35", sessionsPlayed: [35, 36] })).toBe(false);
    expect(isSessionsBehind({ confirmed: "35", sessionsPlayed: [35, 36, 37] })).toBe(true);
  });
});
