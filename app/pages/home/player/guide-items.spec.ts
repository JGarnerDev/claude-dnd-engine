import { describe, expect, it } from "vitest";
import {
  groupItems,
  isParallel,
  questionGroup,
  searchTree,
  searchWords,
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

describe("questionGroup and isParallel", () => {
  it("finds the numbered all-question group", () => {
    expect(questionGroup(tree)?.title).toBe("Ask");
  });

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
