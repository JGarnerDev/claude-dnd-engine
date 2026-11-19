import { describe, expect, it } from 'vitest';
import { parseExpr, roll, rollableHtml } from './dice.js';

// Fixed die faces in order: rng value v gives face 1 + floor(v * sides).
const faces = (sides: number, ...f: number[]) => {
  let i = 0;
  return () => (f[i++ % f.length] - 1) / sides;
};
const tokens = (html: string) => [...html.matchAll(/data-roll="([^"]+)" data-kind="(\w+)"(?: data-label="([^"]+)")?[^>]*>([^<]+)</g)]
  .map((m) => [m[4], m[1], m[2], m[3]].filter(Boolean).join(' | '));

describe('parseExpr', () => {
  it('reads count, sides and modifier', () => {
    expect(parseExpr('1d8+4')).toEqual({ n: 1, sides: 8, mod: 4 });
    expect(parseExpr('2d6')).toEqual({ n: 2, sides: 6, mod: 0 });
    expect(parseExpr('1d20-1')).toEqual({ n: 1, sides: 20, mod: -1 });
    expect(parseExpr('banana')).toBeNull();
  });
});

describe('roll', () => {
  it('adds the modifier and flags a natural 20', () => {
    const r = roll('1d20+4', 'hit', 'normal', faces(20, 20))!;
    expect(r.total).toBe(24);
    expect(r.nat).toBe(20);
  });
  it('keeps the higher d20 on advantage, the lower on disadvantage', () => {
    expect(roll('1d20+4', 'hit', 'adv', faces(20, 3, 15))!.total).toBe(19);
    expect(roll('1d20+4', 'hit', 'dis', faces(20, 3, 15))!.total).toBe(7);
  });
  it('doubles damage dice on a crit, not the modifier', () => {
    const r = roll('1d8+4', 'dmg', 'crit', faces(8, 5, 6))!;
    expect(r.dice).toEqual([5, 6]);
    expect(r.total).toBe(15);
  });
  it('ignores a mode that does not fit the roll', () => {
    expect(roll('1d6+2', 'dmg', 'adv', faces(6, 1))!.mode).toBe('normal');
    expect(roll('1d20+2', 'check', 'crit', faces(20, 1))!.mode).toBe('normal');
  });
  it('never deals negative damage', () => {
    expect(roll('1d4-3', 'dmg', 'normal', faces(4, 1))!.total).toBe(0);
  });
});

// The Session 34 stat lines, as the runner shows them.
describe('rollableHtml', () => {
  it('rolls to-hit and damage on a weapon line', () => {
    expect(tokens(rollableHtml('<strong>Hand crossbow</strong> +4 to hit, range 30/120, 1d6+2 piercing (avg 5)')))
      .toEqual(['+4 to hit | 1d20+4 | hit', '1d6+2 | 1d6+2 | dmg']);
  });
  it('reads a bare bonus before dice as an attack (the griffon, Nella\'s shortsword)', () => {
    expect(tokens(rollableHtml('<strong>Multiattack:</strong> beak +6, 1d8+4 piercing, and claws +6, 2d6+4 slashing')))
      .toEqual(['+6 | 1d20+6 | hit', '1d8+4 | 1d8+4 | dmg', '+6 | 1d20+6 | hit', '2d6+4 | 2d6+4 | dmg']);
  });
  it('rolls extra damage dice (Sneak Attack, Marked Quarry)', () => {
    expect(tokens(rollableHtml('<strong>Sneak Attack (1/turn):</strong> +2d6 (7) when he has advantage')))
      .toEqual(['2d6 | 2d6 | dmg']);
  });
  it('rolls skills, abilities and a save note, and leaves bare DCs and AC alone', () => {
    expect(tokens(rollableHtml('AC 13 · HP 5/16 · Perception +5, Stealth +6')))
      .toEqual(['Perception +5 | 1d20+5 | check | Perception', 'Stealth +6 | 1d20+6 | check | Stealth']);
    expect(tokens(rollableHtml('WIS save DC 13 (it has +3). Morale DC 12 WIS. +2 AC against one melee hit')))
      .toEqual(['+3 | 1d20+3 | check | save']);
  });
  it('never wraps inside a tag or a link', () => {
    const html = '<a class="sr-wiki" data-entity="1d6">Dex +2</a> <span title="1d4">x</span>';
    expect(rollableHtml(html)).toBe(html);
  });
});
