// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { rollable, rollableInline } from "./Dice.js";
import { PromptBook } from "./PromptBook.js";
import { parseExpr, roll } from "./dice-roll.js";
import { InlineMd } from "./MarkdownView.js";

// Fixed die faces in order: rng value v gives face 1 + floor(v * sides).
const faces = (sides: number, ...f: number[]) => {
  let i = 0;
  return () => (f[i++ % f.length] - 1) / sides;
};
// Each dice button as "text | expr | kind | label", as a stat line renders it.
const tokens = (md: string) =>
  [
    ...render(<InlineMd md={md} text={rollable} />).container.querySelectorAll<HTMLElement>(
      ".sr-roll",
    ),
  ].map((b) =>
    [b.textContent, b.dataset.roll, b.dataset.kind, b.dataset.label].filter(Boolean).join(" | "),
  );

afterEach(cleanup);

describe("parseExpr", () => {
  it("reads count, sides and modifier", () => {
    expect(parseExpr("1d8+4")).toEqual({ n: 1, sides: 8, mod: 4 });
    expect(parseExpr("2d6")).toEqual({ n: 2, sides: 6, mod: 0 });
    expect(parseExpr("1d20-1")).toEqual({ n: 1, sides: 20, mod: -1 });
    expect(parseExpr("banana")).toBeNull();
  });
});

describe("roll", () => {
  it("adds the modifier and flags a natural 20", () => {
    const r = roll("1d20+4", "hit", "normal", faces(20, 20))!;
    expect(r.total).toBe(24);
    expect(r.nat).toBe(20);
  });
  it("keeps the higher d20 on advantage, the lower on disadvantage", () => {
    expect(roll("1d20+4", "hit", "adv", faces(20, 3, 15))!.total).toBe(19);
    expect(roll("1d20+4", "hit", "dis", faces(20, 3, 15))!.total).toBe(7);
  });
  it("doubles damage dice on a crit, not the modifier", () => {
    const r = roll("1d8+4", "dmg", "crit", faces(8, 5, 6))!;
    expect(r.dice).toEqual([5, 6]);
    expect(r.total).toBe(15);
  });
  it("ignores a mode that does not fit the roll", () => {
    expect(roll("1d6+2", "dmg", "adv", faces(6, 1))!.mode).toBe("normal");
    expect(roll("1d20+2", "check", "crit", faces(20, 1))!.mode).toBe("normal");
  });
  it("never deals negative damage", () => {
    expect(roll("1d4-3", "dmg", "normal", faces(4, 1))!.total).toBe(0);
  });
});

// The Session 34 stat lines, as the runner shows them.
describe("rollable", () => {
  it("rolls to-hit and damage on a weapon line", () => {
    expect(tokens("**Hand crossbow** +4 to hit, range 30/120, 1d6+2 piercing (avg 5)")).toEqual([
      "+4 to hit | 1d20+4 | hit",
      "1d6+2 | 1d6+2 | dmg",
    ]);
  });
  it("reads a bare bonus before dice as an attack (the griffon, Nella's shortsword)", () => {
    expect(
      tokens("**Multiattack:** beak +6, 1d8+4 piercing, and claws +6, 2d6+4 slashing"),
    ).toEqual([
      "+6 | 1d20+6 | hit",
      "1d8+4 | 1d8+4 | dmg",
      "+6 | 1d20+6 | hit",
      "2d6+4 | 2d6+4 | dmg",
    ]);
  });
  it("rolls extra damage dice (Sneak Attack, Marked Quarry)", () => {
    expect(tokens("**Sneak Attack (1/turn):** +2d6 (7) when he has advantage")).toEqual([
      "2d6 | 2d6 | dmg",
    ]);
  });
  it("rolls skills, abilities and a save note, and leaves bare DCs and AC alone", () => {
    expect(tokens("AC 13 · HP 5/16 · Perception +5, Stealth +6")).toEqual([
      "Perception +5 | 1d20+5 | check | Perception",
      "Stealth +6 | 1d20+6 | check | Stealth",
    ]);
    expect(
      tokens("WIS save DC 13 (it has +3). Morale DC 12 WIS. +2 AC against one melee hit"),
    ).toEqual(["+3 | 1d20+3 | check | save"]);
  });
  it("rolls a bonus in brackets, with or without 'save' (beat prose)", () => {
    expect(tokens("concentration: CON save (+1), DC 10, against her Stealth (+8)")).toEqual([
      "CON save (+1) | 1d20+1 | check | CON save",
      "Stealth (+8) | 1d20+8 | check | Stealth",
    ]);
    expect(tokens("Nine squares at 2d4: 18d4, then a d6 per horse")).toEqual([
      "2d4 | 2d4 | dmg",
      "18d4 | 18d4 | dmg",
      "d6 | 1d6 | dmg",
    ]);
  });
  it("leaves bare DCs, passive scores and grid refs alone", () => {
    expect(tokens("Perception DC 13 · passive Perception 13 · J9:N17 · S35_07_CHASE")).toEqual([]);
  });
  it("never wraps inside a link or code", () => {
    expect(tokens("[[1d6|Dex +2]] `1d4`")).toEqual([]);
  });
});

// Beat prose: the DM's lines get dice, read-aloud lines don't, and a click shows its result.
describe("dice in the prompt book", () => {
  const prose = [
    "- **The thorns:** 2d4 for every 5 ft moved. Nella makes a CON save (+1), DC 10.",
    "",
    '> *"The grass is greener than it should be. Roll 2d4 in your head."*',
  ].join("\n");
  it("puts buttons in the DM's text and none in a Say block", () => {
    const { container } = render(<PromptBook prose={prose} />);
    const rolls = [...container.querySelectorAll<HTMLElement>(".sr-roll")];
    expect(rolls.map((b) => b.dataset.roll)).toEqual(["2d4", "1d20+1"]);
    expect(container.querySelector(".sr-pb-say .sr-roll")).toBeNull();
  });
  it("shows the latest result beside the button", () => {
    const { container } = render(<InlineMd md="2d4 per 5 ft" text={rollableInline} />);
    expect(container.querySelector(".sr-roll-last")).toBeNull();
    fireEvent.click(container.querySelector(".sr-roll")!);
    const total = Number(/\d+/.exec(container.querySelector(".sr-roll-last")!.textContent!)![0]);
    expect(total).toBeGreaterThanOrEqual(2);
    expect(total).toBeLessThanOrEqual(8);
  });
});
