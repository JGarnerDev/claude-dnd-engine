// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, jsx } from './canon.js';
import * as N from '../Stats.js';
import { statsSlides } from '../legacy/stats.js';
import type { Stats } from '../types.js';

const cat = (id: string, icon: string) => ({ id, award: `${id} award`, label: `${id} label`, icon, family: 'combat', kind: 'count' });

const stats: Stats = {
  session: 30,
  campaign: 'homebrew',
  season: { first: 29, last: 30 },
  awards: [
    { ...cat('killing-blows', '⚔️'), pcs: ['Dip', 'Luci'], value: 3, rough: false, best: ['Dip'] },
    { ...cat('damage-dealt', '🗡️'), pcs: ['Dip'], value: 84, rough: true, best: [] },
  ],
  leaderboards: [{ ...cat('killing-blows', '⚔️'), rows: [
    { pc: 'Dip', value: 5, rough: false }, { pc: 'Luci', value: 3, rough: false }] }],
  lifetime: [{ ...cat('hp-healed', '❤️'), pcs: ['Iggy'], value: 212, rough: false }],
  previousSeason: null,
  warnings: [],
};

describe('stats parity', () => {
  it('statsSlides(stats)', () => {
    const a = statsSlides(stats); const b = N.statsSlides(stats);
    expect(b.length).toBe(a.length);
    a.forEach((s, i) => {
      expect(b[i].title).toBe(s.title);
      expect(!!b[i].bare).toBe(!!s.bare);
      if (s.html) expect(jsx(b[i].body)).toBe(html(s.html));
      else expect(b[i].body).toBeUndefined();
    });
  });
  it("statsSlides(stats, 'light')", () => {
    const a = statsSlides(stats, 'light'); const b = N.statsSlides(stats, 'light');
    expect(b.length).toBe(a.length);
    a.forEach((s, i) => {
      expect(b[i].title).toBe(s.title);
      expect(!!b[i].bare).toBe(!!s.bare);
      if (s.html) expect(jsx(b[i].body)).toBe(html(s.html));
      else expect(b[i].body).toBeUndefined();
    });
  });
});
