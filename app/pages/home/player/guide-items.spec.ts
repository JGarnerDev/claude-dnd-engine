import { describe, expect, it } from "vitest";
import {
  byLevel,
  groupItems,
  isParallel,
  levelTitle,
  searchTree,
  searchWords,
  spellLead,
  treeOf,
} from "./guide-items.js";
import { splitSections } from "./guide-sections.js";

const BODY = `## Turn

Read this first.

### Ask

1. **Ally down?** Heal them.
2. **Free?** Inspire
   someone close.

### Action

- **Attack:** the rapier.
- Move first.

## Strategies

### Flyers

- **Team:** ground them.
- **Me:** Command.

### Casters

- **Team:** close fast.
- **Me:** Bless saves.`;

const tree = treeOf(splitSections(BODY).sections);

describe("groupItems", () => {
  it("splits a section into its groups, with a note group for text before the first ###", () => {
    const turn = tree[0].groups;
    expect(turn.map((g) => g.title)).toEqual(["Turn", "Ask", "Action"]);
    expect(turn[0]).toMatchObject({ note: "Read this first.", items: [] });
  });

  it("reads bold leads, joins wrapped lines and marks numbered lists", () => {
    const ask = tree[0].groups[1];
    expect(ask.ordered).toBe(true);
    expect(ask.items[1]).toMatchObject({ lead: "Free?", detail: "Inspire someone close." });
    expect(tree[0].groups[2].items.map((i) => i.lead)).toEqual(["Attack", null]);
  });

  it("gives every item a unique id", () => {
    const ids = tree.flatMap((s) => s.groups.flatMap((g) => g.items.map((i) => i.id)));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("makes no empty group for a section that starts with a heading", () => {
    const groups = groupItems({ title: "X", slug: "x", body: "\n### A\n\n- **B:** c" });
    expect(groups.map((g) => g.title)).toEqual(["A"]);
  });
});

describe("spellLead", () => {
  it("splits a level and concentration off the name, in either order", () => {
    expect(spellLead("Bless (1st, concentration)")).toEqual({
      name: "Bless",
      level: "1st",
      concentration: true,
    });
    expect(spellLead("Heat Metal (concentration, 2nd)")).toEqual({
      name: "Heat Metal",
      level: "2nd",
      concentration: true,
    });
    expect(spellLead("Vicious Mockery (cantrip)")).toEqual({
      name: "Vicious Mockery",
      level: "cantrip",
      concentration: false,
    });
    expect(spellLead("Bane (concentration)")).toEqual({
      name: "Bane",
      level: null,
      concentration: true,
    });
  });

  it("keeps the lead whole when any part of the parentheses isn't a spell tag", () => {
    for (const lead of [
      "Radiant Soul (once per long rest)",
      "Bless (1st, at the table)",
      "Bless (1st, 2nd)",
      "Bless (1th)",
      "Attack",
    ])
      expect(spellLead(lead)).toEqual({ name: lead, level: null, concentration: false });
  });
});

describe("groupItems upcast", () => {
  it("splits the text after Upcast: into its own field", () => {
    const [g] = groupItems({
      title: "Turn",
      slug: "turn",
      body: [
        "### Action",
        "",
        "- **Bless (1st, concentration):** 3 allies add 1d4. Upcast: +1 ally per slot level above 1st.",
        "- **Attack:** hit it.",
      ].join("\n"),
    });
    expect(g.items[0]).toMatchObject({
      lead: "Bless",
      level: "1st",
      detail: "3 allies add 1d4.",
      upcast: "+1 ally per slot level above 1st.",
    });
    expect(g.items[1]).toMatchObject({ lead: "Attack", level: null, upcast: null });
  });
});

describe("byLevel", () => {
  it("keeps non-spells apart and lists spells by level from cantrips up, in guide order", () => {
    const [g] = groupItems({
      title: "Turn",
      slug: "turn",
      body: [
        "- **Shatter (2nd):** boom.",
        "- **Attack:** hit it.",
        "- **Bless (1st):** d4s.",
        "- **Mockery (cantrip):** insult.",
        "- **Command (1st):** grovel.",
      ].join("\n"),
    });
    const { others, levels } = byLevel(g.items);
    expect(others.map((i) => i.lead)).toEqual(["Attack"]);
    expect(levels.map((l) => [levelTitle(l.level), l.items.map((i) => i.lead)])).toEqual([
      ["Cantrips", ["Mockery"]],
      ["1st level", ["Bless", "Command"]],
      ["2nd level", ["Shatter"]],
    ]);
  });
});

describe("isParallel", () => {
  it("calls groups parallel only when their leads match", () => {
    expect(isParallel(tree[1].groups)).toBe(true);
    expect(isParallel(tree[0].groups)).toBe(false);
  });
});

describe("searchTree", () => {
  it("keeps only matching plays, across sections, matching every word", () => {
    const hits = searchTree(tree, searchWords("  Close  FAST "));
    expect(hits.map((h) => [h.section, h.group.title, h.items.length])).toEqual([
      ["Strategies", "Casters", 1],
    ]);
  });

  it("keeps a whole group when its title matches", () => {
    const hits = searchTree(tree, searchWords("flyers"));
    expect(hits).toHaveLength(1);
    expect(hits[0].items).toHaveLength(2);
  });

  it("finds nothing for words that never appear together", () => {
    expect(searchTree(tree, searchWords("rapier bless"))).toEqual([]);
  });
});
