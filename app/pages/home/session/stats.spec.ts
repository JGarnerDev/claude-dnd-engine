// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { statsSlides, withStats } from './stats.js';
import type { Slide, Stats } from './types.js';

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
const deck: Slide[] = [
  { title: 'Title', md: '' },
  { title: 'The party', md: '' },
  { title: 'Next time…', md: '' },
];
const dom = (html: string) => { const el = document.createElement('div'); el.innerHTML = html; return el; };

describe('statsSlides', () => {
  it('builds honors then standings, nothing for no stats', () => {
    expect(statsSlides(null)).toEqual([]);
    expect(statsSlides(stats).map((s) => s.title)).toEqual(['Last session’s honors', 'The standings']);
  });

  it('award cards share ties, mark rough sums and personal bests', () => {
    const el = dom(statsSlides(stats)[0].html!);
    const cards = el.querySelectorAll('.st-card');
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector('.st-pc')!.textContent).toBe('Dip & Luci');
    expect(cards[0].classList.contains('is-best')).toBe(true);
    expect(cards[0].querySelector('.st-best')!.textContent).toContain('Dip');
    expect(cards[1].querySelector('.st-value')!.textContent).toMatch(/^~84/);
  });

  it('scales standings bars to the leader and shows the hall of fame', () => {
    const el = dom(statsSlides(stats)[1].html!);
    const bars = [...el.querySelectorAll<HTMLElement>('.st-bar i')].map((b) => b.style.width);
    expect(bars).toEqual(['100%', '60%']);
    expect(el.querySelector('.st-row.is-top .st-row-pc')!.textContent).toBe('Dip');
    expect(el.querySelector('.st-fame .st-chip')!.textContent).toContain('Iggy');
  });

  it('off a heavy deck: one compact Worth noting slide, or none', () => {
    expect(statsSlides(stats, 'light')).toEqual([]);
    const notable = { ...stats, notable: [{ icon: '⚔️', text: 'Dip: personal best, 3 killing blows' }] };
    const slides = statsSlides(notable, 'medium');
    expect(slides.map((s) => s.title)).toEqual(['Worth noting']);
    expect(dom(slides[0].html!).querySelectorAll('.st-notable li')).toHaveLength(1);
    expect(statsSlides(notable, 'heavy').map((s) => s.title)).toEqual(['Last session’s honors', 'The standings']);
  });

  it('full set on a season opener at any weight; a missing weight is heavy', () => {
    expect(statsSlides({ ...stats, firstOfSeason: true }, 'light')).toHaveLength(2);
    expect(statsSlides(stats)).toHaveLength(2);
  });

  it('opens with the Barovia slide after a Strahd season', () => {
    const s = { ...stats, previousSeason: { campaign: 'strahd', first: 1, last: 28, leaderboards: stats.leaderboards } };
    expect(statsSlides(s)[0].title).toBe('While you were in Barovia…');
  });
});

describe('withStats', () => {
  it('slots stats before the last slide so the deck ends on the hook', () => {
    expect(withStats(deck, stats).map((s) => s.title)).toEqual(
      ['Title', 'The party', 'Last session’s honors', 'The standings', 'Next time…']);
  });

  it('leaves the deck alone with no stats, and adds nothing to no deck', () => {
    expect(withStats(deck, null)).toBe(deck);
    expect(withStats([], stats)).toEqual([]);
  });
});
