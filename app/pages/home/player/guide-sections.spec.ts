import { describe, expect, it } from "vitest";
import { slugify, splitSections } from "./guide-sections.js";

describe("splitSections", () => {
  it("splits the intro from the ## sections", () => {
    const md = "Intro line.\n\n## Turn\n\n### Action\n\n- Attack\n\n## Build Path\n\n- Bard";
    const { intro, sections } = splitSections(md);
    expect(intro).toBe("Intro line.");
    expect(sections.map((s) => [s.title, s.slug])).toEqual([
      ["Turn", "turn"],
      ["Build Path", "build-path"],
    ]);
    expect(sections[0].body).toBe("### Action\n\n- Attack");
  });

  it("keeps ### headings inside their section", () => {
    const { sections } = splitSections("## A\n### B\ntext");
    expect(sections).toHaveLength(1);
    expect(sections[0].body).toBe("### B\ntext");
  });

  it("ignores ## inside fenced code", () => {
    const { sections } = splitSections("## A\n```text\n## not a heading\n```");
    expect(sections).toHaveLength(1);
  });

  it("returns no sections for a body without headings", () => {
    expect(splitSections("just text\r\nmore")).toEqual({ intro: "just text\nmore", sections: [] });
  });
});

describe("slugify", () => {
  it("drops punctuation and trims dashes", () => {
    expect(slugify(" Undead & Fiends! ")).toBe("undead-fiends");
  });
});
