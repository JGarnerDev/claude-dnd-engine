// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { withMysteries } from "./Mysteries.js";
import { questions, searchMysteries } from "./mystery-list.js";
import type { DeckSlide } from "./deck.js";

const md =
  "- Who is *Harrow Bane*?\n- Who pressed the charm into the hearth, and why smother\n  the fire?\n- Who sent [[Nella|the archer]]?";
const deck: DeckSlide[] = [
  { title: "Title", md: "" },
  { title: "Mysteries", md },
  { title: "Next", md: "Down the hill." },
];
const dom = (s: DeckSlide) => render(<>{s.body}</>).container;

afterEach(cleanup);

describe("questions", () => {
  it("reads bullets and joins wrapped lines", () => {
    expect(questions(md)).toEqual([
      "Who is *Harrow Bane*?",
      "Who pressed the charm into the hearth, and why smother the fire?",
      "Who sent [[Nella|the archer]]?",
    ]);
  });
});

describe("withMysteries", () => {
  it("draws the Mysteries slide as cards, inline markup kept, links unlinked; others untouched", () => {
    const out = withMysteries(deck);
    expect(out[0]).toBe(deck[0]);
    expect(out[2]).toBe(deck[2]);
    const cards = dom(out[1]).querySelectorAll(".my-card");
    expect(cards).toHaveLength(3);
    expect(cards[0].querySelector("em")!.textContent).toBe("Harrow Bane");
    expect(cards[2].querySelector("a")).toBeNull();
    expect(cards[2].textContent).toContain("the archer");
  });

  it("recognises the new title and the old one", () => {
    for (const title of ["Mysteries & Loose Ends", "Mysteries and loose ends", "Mysteries"]) {
      const out = withMysteries([{ title, md }]);
      expect(dom(out[0]).querySelectorAll(".my-card")).toHaveLength(3);
      cleanup();
    }
  });

  it("shows only the top eight; the rest stay in reserve", () => {
    const many = [
      { title: "Mysteries", md: Array.from({ length: 11 }, (_, i) => `- Q${i + 1}?`).join("\n") },
    ];
    const cards = dom(withMysteries(many)[0]).querySelectorAll(".my-card");
    expect(cards).toHaveLength(8);
    expect(cards[7].textContent).toBe("Q8?");
  });

  it("leaves a Mysteries slide with no bullets as written", () => {
    const plain = [{ title: "Mysteries", md: "Nothing open." }];
    expect(withMysteries(plain)[0]).toBe(plain[0]);
  });
});

describe("searchMysteries", () => {
  const answers = [
    { title: "Who is Harrow Bane?", md: "An ex-soldier." },
    { title: "Where are we?", md: "Ashford, in [[Aethryn]]." },
  ];
  it('"myst…" lists every answer; otherwise matches question or answer', () => {
    expect(searchMysteries("mysteries", answers)).toEqual(answers);
    expect(searchMysteries("Myst", answers)).toEqual(answers);
    expect(searchMysteries("harrow", answers).map((s) => s.title)).toEqual(["Who is Harrow Bane?"]);
    expect(searchMysteries("aethryn", answers).map((s) => s.title)).toEqual(["Where are we?"]);
    expect(searchMysteries("  ", answers)).toEqual([]);
  });
});
