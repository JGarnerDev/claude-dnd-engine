// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { achievementSlides, withAchievements } from './achievements.js';
import { withStats } from './stats.js';
import type { PcAchievements, Slide, Stats } from './types.js';

const ach: PcAchievements[] = [
  { pc: 'Iggy', items: [
    { title: "Gravity's Favorite", text: 'You landed on your *back*.', times: 1 },
    { title: 'Encore II', text: 'Again, [[Sable Wren|the brewer]] wept.', times: 2 },
  ] },
  { pc: 'Dip', items: [] },
  { pc: 'Luci', items: [{ title: 'Moon Namer', text: '', times: 1 }] },
];
const deck: Slide[] = [
  { title: 'Title', md: '' },
  { title: 'The party', md: '' },
  { title: 'Next time…', md: '' },
];
const dom = (html: string) => { const el = document.createElement('div'); el.innerHTML = html; return el; };

describe('achievementSlides', () => {
  it('one slide per PC with achievements, titled with the PC', () => {
    expect(achievementSlides(null)).toEqual([]);
    expect(achievementSlides(ach).map((s) => s.title)).toEqual(['Iggy', 'Luci']);
  });

  it('marks repeats, renders inline markup, never links', () => {
    const el = dom(achievementSlides(ach)[0].html!);
    const cards = el.querySelectorAll('.ac-card');
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector('.ac-eyebrow')!.textContent).toBe('New achievement!');
    expect(cards[0].querySelector('.ac-text em')!.textContent).toBe('back');
    expect(cards[1].classList.contains('is-repeat')).toBe(true);
    expect(cards[1].querySelector('.ac-eyebrow')!.textContent).toContain('×2');
    expect(cards[1].querySelector('a')).toBeNull();
    expect(cards[1].textContent).toContain('the brewer');
  });

  it('omits an empty description', () => {
    expect(dom(achievementSlides(ach)[1].html!).querySelector('.ac-text')).toBeNull();
  });
});

describe('withAchievements', () => {
  it('slots before the last slide, and before stats when both run', () => {
    const stats = { session: 30, campaign: 'homebrew', season: { first: 29, last: 30 }, awards: [
      { id: 'crits', award: 'Crit Machine', label: 'Critical hits', icon: '💥', family: 'combat', kind: 'count',
        pcs: ['Luci'], value: 1, rough: false, best: [] }],
    leaderboards: [], lifetime: [], previousSeason: null, warnings: [] } as Stats;
    const titles = withStats(withAchievements(deck, ach), stats).map((s) => s.title);
    expect(titles).toEqual(['Title', 'The party', 'Iggy', 'Luci', 'Last session’s honors', 'Next time…']);
  });

  it('leaves a missing deck alone', () => {
    expect(withAchievements([], ach)).toEqual([]);
    expect(withAchievements(deck, null)).toBe(deck);
  });
});
