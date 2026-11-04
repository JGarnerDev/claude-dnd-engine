// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { withAchievements } from './achievements.js';
import { reputationSlides, withReputation } from './reputation.js';
import { withStats } from './stats.js';
import type { PcAchievements, PcReputation, Reputation, Slide, Stats } from './types.js';

const zero = { score: 0, gain: 0, tier: 'Unremarked', rank: 1, up: false };
const pc = (over: Partial<PcReputation>): PcReputation => ({
  pc: 'X', fame: { ...zero, tier: 'Unknown' }, infamy: zero, local: [], deeds: [], ...over,
});
const rep: Reputation = {
  session: 30, campaign: 'homebrew', partyFame: 1898, partyTier: 'Unknown', crossings: [], warnings: [],
  pcs: [
    pc({ pc: 'Dip', fame: { score: 5696, gain: 272, tier: 'Noticed', rank: 2, up: true },
      infamy: { score: 272, gain: 272, tier: 'Unremarked', rank: 1, up: false },
      deeds: [
        { track: 'fame', scope: 'Ashford', points: 5424, text: 'Felled [[Harrow Bane|the captain]] in the *square*.' },
        { track: 'infamy', scope: 'Ashford', points: 272, text: 'Threw him in the well.' },
      ] }),
    pc({ pc: 'Luci' }),
  ],
};
const deck: Slide[] = [
  { title: 'Title', md: '' },
  { title: 'The party', md: '' },
  { title: 'Next time…', md: '' },
];
const dom = (html: string) => { const el = document.createElement('div'); el.innerHTML = html; return el; };

describe('reputationSlides', () => {
  it('one slide, PCs with no score left out', () => {
    expect(reputationSlides(null)).toEqual([]);
    const slides = reputationSlides(rep);
    expect(slides.map((s) => s.title)).toEqual(['Reputation']);
    expect(dom(slides[0].html!).querySelectorAll('.rp-pc')).toHaveLength(1);
  });

  it('shows party fame, scores with separators, gains, tier-up banner', () => {
    const el = dom(reputationSlides(rep)[0].html!);
    expect(el.querySelector('.rp-party b')!.textContent).toBe('1,898');
    expect(el.querySelector('.rp-track.is-fame .rp-score')!.textContent).toBe('5,696');
    expect(el.querySelector('.rp-track.is-fame .rp-gain')!.textContent).toBe('+272');
    expect(el.querySelector('.rp-banner')!.textContent).toBe('Dip is now Noticed');
    expect(el.querySelectorAll('.rp-banner')).toHaveLength(1);
  });

  it('lists deeds with points, inline markup, never links', () => {
    const deeds = dom(reputationSlides(rep)[0].html!).querySelectorAll('.rp-deed');
    expect(deeds).toHaveLength(2);
    expect(deeds[0].querySelector('.rp-pts')!.textContent).toBe('+5,424');
    expect(deeds[0].querySelector('em')!.textContent).toBe('square');
    expect(deeds[0].querySelector('a')).toBeNull();
    expect(deeds[0].textContent).toContain('the captain');
    expect(deeds[1].classList.contains('is-infamy')).toBe(true);
  });

  it('no slide when every PC is at zero', () => {
    expect(reputationSlides({ ...rep, pcs: [pc({ pc: 'Luci' })] })).toEqual([]);
  });
});

describe('withReputation', () => {
  it('lands between achievements and stats', () => {
    const ach: PcAchievements[] = [{ pc: 'Iggy', items: [{ title: 'Encore', text: '', times: 1 }] }];
    const stats = { session: 30, campaign: 'homebrew', season: { first: 29, last: 30 }, awards: [
      { id: 'crits', award: 'Crit Machine', label: 'Critical hits', icon: '💥', family: 'combat', kind: 'count',
        pcs: ['Luci'], value: 1, rough: false, best: [] }],
    leaderboards: [], lifetime: [], previousSeason: null, warnings: [] } as Stats;
    const titles = withStats(withReputation(withAchievements(deck, ach), rep), stats).map((s) => s.title);
    expect(titles).toEqual(['Title', 'The party', 'Iggy', 'Reputation', 'Last session’s honors', 'Next time…']);
  });

  it('leaves a missing deck alone', () => {
    expect(withReputation([], rep)).toEqual([]);
    expect(withReputation(deck, null)).toBe(deck);
  });
});
