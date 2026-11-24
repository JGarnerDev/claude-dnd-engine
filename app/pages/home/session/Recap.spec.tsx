// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Recap } from "./Recap.js";
import { RECAP_ID, recapText, withRecap } from "./recap-data.js";
import { fixture } from "./fixture-data.js";
import type { PreviousSession, SessionData } from "./types.js";

const prev = (n: number, campaign: string): PreviousSession => ({
  name: `Session ${n} Before`,
  number: n,
  date: "2026-09-29",
  campaign,
  description: `What happened in ${n}.`,
  recap: `Long recap of ${n}.`,
  cliffhanger: `Left hanging in ${n}.`,
  path: `historian/sessions/Session ${n}.md`,
  slides: [],
});
const card = (data: SessionData) => render(<Recap data={data} onSlides={() => {}} />).container;

afterEach(cleanup);

describe("withRecap", () => {
  it("is a no-op without a previous session", () => {
    const d = fixture();
    expect(withRecap(d)).toBe(d);
  });

  it("prepends the recap card, its rail group and an edge into the first card", () => {
    const d = withRecap({ ...fixture(), previously: [prev(8, "strahd")] });
    expect(d.nodes[0]).toMatchObject({
      id: RECAP_ID,
      kind: "recap",
      title: "Session 8 · Before",
    });
    expect(d.scenes[0].key).toBe("prev");
    expect(d.edges[0]).toEqual({ from: RECAP_ID, to: "S1_OPEN", label: "", dashed: false });
  });
});

describe("Recap", () => {
  it("leads with the narrative, then TL;DR party, threads and cliffhanger, then the full recap", () => {
    const el = card({ ...fixture(), previously: [prev(8, "homebrew")] });
    expect(el.querySelector(".sr-recap-lead")!.textContent).toBe("What happened in 8.");
    const tldr = [...el.querySelectorAll(".sr-recap-tldr > li > strong")].map((s) => s.textContent);
    expect(tldr).toEqual(["Party", "Open threads", "Cliffhanger"]);
    expect(el.querySelector(".sr-recap-tldr .sr-wiki")!.getAttribute("data-entity")).toBe(
      "Ashford",
    );
    expect(el.querySelector(".sr-recap-full p")!.textContent).toBe("Long recap of 8.");
    expect(el.querySelector(".sr-recap-season")).toBeNull();
  });

  it('adds "last time in this world" when the season changed', () => {
    const el = card({ ...fixture(), previously: [prev(8, "strahd"), prev(5, "homebrew")] });
    expect(el.querySelector(".sr-recap-season h3")!.textContent).toContain("Session 5 Before");
  });
});

describe("recap slides button", () => {
  it("shows only when the previous session has a deck", () => {
    expect(
      card({ ...fixture(), previously: [prev(8, "homebrew")] }).querySelector(
        '[data-act="slides"]',
      ),
    ).toBeNull();
    cleanup();
    const withDeck = { ...prev(8, "homebrew"), slides: [{ title: "Session 8", md: "Played." }] };
    expect(
      card({ ...fixture(), previously: [withDeck] }).querySelector('[data-act="slides"]')!
        .textContent,
    ).toBe("Slides");
  });
});

describe("recapText", () => {
  it("joins every previous session’s prose", () => {
    expect(recapText({ ...fixture(), previously: [prev(8, "strahd")] })).toContain(
      "Left hanging in 8.",
    );
  });
});
