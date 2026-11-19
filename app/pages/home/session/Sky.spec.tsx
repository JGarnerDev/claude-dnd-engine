// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { skySlides, withSky } from './Sky.js';
import { SKY_TITLE } from './sky-time.js';
import type { DeckSlide } from './deck.js';
import type { Sky, SkyMoment } from './types.js';

const moment = (over: Partial<SkyMoment> = {}): SkyMoment => ({
  date: '6743-05-21', time: '10:00', year: 6743, dayOfYear: 141, hour: 10,
  sun: { phase: 5, offset: 6.67, trueDark: 5.3 },
  fida: { age: 0.017, lit: 0.997, waxing: false },
  astra: { yearInCycle: 743, toGlistening: 257, next: 7, trueAnomaly: 188.9, radius: 1.632 },
  ...over,
});
const sky: Sky = { ...moment(), crawl: 5, crawlYear: 6743, crawlDay: 27, prev: moment({ time: '07:00', hour: 7 }) };
const deck: DeckSlide[] = [{ title: 'Title', md: '' }, { title: 'Previously on…', md: '' }, { title: 'Next time…', md: '' }];
const dom = (s: Sky) => render(<>{skySlides(s)[0].body}</>).container;

afterEach(cleanup);

describe('sky slide', () => {
  it('slots in right after the Title slide', () => {
    const out = withSky(deck, sky);
    expect(out.map((s) => s.title)).toEqual(['Title', SKY_TITLE, 'Previously on…', 'Next time…']);
  });

  it('leaves the deck alone for Strahd or an undated session, and an empty deck empty', () => {
    expect(withSky(deck, null)).toBe(deck);
    expect(withSky([], sky)).toEqual([]);
    expect(skySlides(undefined)).toEqual([]);
  });

  it('writes the date in the cartouche', () => {
    const el = dom(sky);
    const card = el.querySelector('.sk-card')!.textContent!;
    expect(card).toContain('Year 6743');
    expect(card).toContain('since the Impact');
    expect(card).toContain('The fifth Crawl, day 27');
    expect(card).toContain('About ten in the morning');
    expect(card).toContain('About five hours of true dark tonight');
    expect(card).toContain('Fida, the moon: full');
    expect(card).toContain('Astra swings back like a comet in 257 years: the Seventh Glistening');
    expect(card).toContain('743 years since the Sixth Glistening');
    expect(el.querySelector('.sk-seal')).toBeNull();
  });

  it('is a bare slide: no headline, the plate gets the stage', () => {
    expect(skySlides(sky)[0].bare).toBe(true);
  });

  it('drops the Crawl line when the Sky Clock has no log for the session', () => {
    const el = dom({ ...sky, crawl: null, crawlDay: null });
    expect(el.querySelector('.sk-crawl')).toBeNull();
  });

  it('draws the plate with every ring label and sweeps the gold sun forward from last session', () => {
    const el = dom(sky);
    const labels = [...el.querySelectorAll('textPath')].map((t) => t.textContent);
    expect(labels).toEqual(expect.arrayContaining(['II · Fida, the broken moon', 'VII · The Blanket, fixed and unmoving']));
    expect(el.querySelector('.sk-astra-label')!.textContent).toBe('VI · Astra');
    const gold = el.querySelector('.sk-gold')!.getAttribute('style')!;
    expect(gold).toMatch(/--from:\s*285deg/);
    expect(gold).toMatch(/--to:\s*330deg/);
    expect(el.querySelectorAll('.sk-wanderer')).toHaveLength(9);
  });

  it('says how much in-world time passed since last session, above the card', () => {
    const el = dom(sky);
    expect(el.querySelector('.sk-since')!.textContent).toBe('3 hours since last session');
    expect(el.querySelector('.sk-side-col')!.firstElementChild!.className).toBe('sk-since');
    cleanup();
    const later = { ...sky, prev: moment({ date: '6743-05-18', time: '20:00', hour: 20 }) };
    expect(dom(later).querySelector('.sk-since')!.textContent).toBe('2 days, 14 hours since last session');
    cleanup();
    expect(dom({ ...sky, prev: null }).querySelector('.sk-since')).toBeNull();
  });

  it('never shows the next Kerning', () => {
    expect(dom(sky).innerHTML).not.toMatch(/Kerning/i);
  });
});
