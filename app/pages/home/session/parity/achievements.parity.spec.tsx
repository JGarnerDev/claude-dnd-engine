// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, jsx } from './canon.js';
import * as N from '../Achievements.js';
import { achievementSlides } from '../legacy/achievements.js';
import type { PcAchievements } from '../types.js';

const ach: PcAchievements[] = [
  { pc: 'Iggy', items: [
    { title: "Gravity's Favorite", text: 'You landed on your *back*.', times: 1 },
    { title: 'Encore II', text: 'Again, [[Sable Wren|the brewer]] wept.', times: 2 },
  ] },
  { pc: 'Dip', items: [] },
  { pc: 'Luci', items: [{ title: 'Moon Namer', text: '', times: 1 }] },
];

describe('achievements parity', () => {
  it('achievementSlides(ach)', () => {
    const a = achievementSlides(ach); const b = N.achievementSlides(ach);
    expect(b.length).toBe(a.length);
    a.forEach((s, i) => {
      expect(b[i].title).toBe(s.title);
      expect(!!b[i].bare).toBe(!!s.bare);
      if (s.html) expect(jsx(b[i].body)).toBe(html(s.html));
      else expect(b[i].body).toBeUndefined();
    });
  });
});
