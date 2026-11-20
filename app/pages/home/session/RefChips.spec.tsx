// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { RefContext } from "./RefChips.js";
import { buildRefIndex, shortTitle, type RefIndex } from "./ref-index.js";
import { Markdown } from "./MarkdownView.js";
import type { FlowNode, Scene } from "./types.js";

const n = (id: string, scene: string): FlowNode => ({
  id,
  marker: "committed",
  kind: "social",
  scene,
  title: id,
  lines: [],
  notes: [],
});
const nodes = [
  n("S2_HUNT", "SC3"),
  n("S2_RELIEF", "SC3"),
  n("S2_HOME", "SC4"),
  n("S2_CELL", "SC4"),
];
const scenes: Scene[] = [
  {
    id: "SC3",
    key: "3",
    title: "Scene 3 — The Waystation",
    md: "#### S2_HUNT — Nella takes the ridge and sets the griffon loose\n\n#### S2_RELIEF — Riders on the south road",
  },
  {
    id: "SC4",
    key: "4",
    title: "Scene 4 — The Man in the Cell",
    md: "#### S2_HOME — The casks come home: on their own cart\n\n#### S2_CELL — The cell",
  },
];
const ix = buildRefIndex(nodes, scenes, "S2_RELIEF");
const dom = (md: string, at: RefIndex = ix) =>
  render(
    <RefContext.Provider value={{ ix: at, onBeat: () => {}, onScene: () => {} }}>
      <Markdown md={md} />
    </RefContext.Provider>,
  ).container;

afterEach(cleanup);

describe("ref chips", () => {
  it("turns a backticked beat id into a chip numbered by step, here or in another scene", () => {
    const el = dom("Then `S2_HUNT`, later `S2_HOME`, now `S2_RELIEF`.");
    const chips = [...el.querySelectorAll<HTMLElement>(".sr-bref")];
    expect(chips.map((c) => c.dataset.beat)).toEqual(["S2_HUNT", "S2_HOME", "S2_RELIEF"]);
    expect(chips.map((c) => c.textContent)).toEqual([
      "1Nella takes the ridge and…",
      "4.1The casks come home",
      "2Riders on the south road",
    ]);
    expect(chips[2].classList.contains("is-here")).toBe(true);
  });

  it("numbers a positioned beat by its id, wherever it sits", () => {
    const pn = [
      n("S35_01_RELIEF", "SC3"),
      n("S35_02A_ESCAPE", "SC3"),
      n("S35_02B_CHASE", "SC3"),
      n("S35_03_HOME", "SC4"),
    ];
    const px = buildRefIndex(pn, scenes, "S35_01_RELIEF");
    expect(["S35_01_RELIEF", "S35_02B_CHASE", "S35_03_HOME"].map((id) => px.beat(id)!.num)).toEqual(
      ["1", "2B", "3"],
    );
  });

  it('turns "Scene N" into a scene chip, but never inside code or a link', () => {
    const el = dom("In Scene 4, not Scene 9. `Scene 4` [[Scene 4]]");
    const chips = el.querySelectorAll<HTMLElement>(".sr-bref.is-scene");
    expect(chips).toHaveLength(1);
    expect(chips[0].dataset.scene).toBe("4");
    expect(chips[0].textContent).toBe("S4The Man in the Cell");
    expect(el.textContent).toContain("not Scene 9");
  });

  it("leaves an id with no beat plain and dotted, so a typo shows", () => {
    const el = dom("`S2_GOODBYE` and `=10`");
    expect(el.querySelector("code.sr-ref-missing")!.textContent).toBe("S2_GOODBYE");
    expect(el.querySelectorAll("code")).toHaveLength(2);
  });
});

describe("ref chips, handout cards", () => {
  const cards = [
    {
      path: "handouts/tithe-title-card.html",
      title: "Tithe, the Borrowed Wing",
      url: "https://claude.ai/artifact/abc",
    },
    { path: "handouts/nella-tally.html", title: "Nella's Tally", url: "" },
  ];
  const cx = buildRefIndex(nodes, scenes, "S2_RELIEF", cards);

  it("turns a named card into a link to its published artifact, by file name", () => {
    const el = dom(
      "Show `handouts/tithe-title-card.html` or `scheduler/x/handouts/tithe-title-card.html`.",
      cx,
    );
    const links = [...el.querySelectorAll<HTMLAnchorElement>("a.sr-cardref")];
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe("https://claude.ai/artifact/abc");
    expect(links[0].getAttribute("target")).toBe("_blank");
    expect(links[0].textContent).toBe("Tithe, the Borrowed Wing");
  });

  it("leaves an unpublished or missing card plain and dotted", () => {
    const el = dom("`handouts/nella-tally.html` `handouts/nope.html`", cx);
    const missing = [...el.querySelectorAll<HTMLElement>("code.sr-ref-missing")];
    expect(missing.map((c) => c.textContent)).toEqual([
      "handouts/nella-tally.html",
      "handouts/nope.html",
    ]);
    expect(missing[0].title).toMatch(/not published/);
    expect(el.querySelector("a")).toBeNull();
  });
});

describe("shortTitle", () => {
  it("cuts at the first break if enough is left, else at a word", () => {
    expect(shortTitle('"Up, Wallaed": Iggy flies, and Sah shows himself')).toBe('"Up, Wallaed"');
    expect(shortTitle("The rest of it: the floor, the ridge")).toBe("The rest of it");
    expect(shortTitle("Riders on the south road")).toBe("Riders on the south road");
  });
});
