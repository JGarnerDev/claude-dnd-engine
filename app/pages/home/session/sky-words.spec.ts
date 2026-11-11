import { describe, expect, it } from 'vitest';
import { crawlWords, darkWords, elapsedWords, eraWords, fidaWords, glisteningWords, hourWords, ordinal, roman } from './sky-words.js';

describe('sky words', () => {
  it('says the time since last session in plain units', () => {
    expect(elapsedWords(null)).toBe('');
    expect(elapsedWords(0)).toBe('');
    expect(elapsedWords(0.5)).toBe('Under an hour since last session');
    expect(elapsedWords(1)).toBe('1 hour since last session');
    expect(elapsedWords(24)).toBe('1 day since last session');
    expect(elapsedWords(62)).toBe('2 days, 14 hours since last session');
    expect(elapsedWords(24 * 12)).toBe('12 days since last session');
    expect(elapsedWords(24 * 95)).toBe('About 3 months since last session');
    expect(elapsedWords(24 * 720)).toBe('About 2 years since last session');
  });

  it('says the hour plainly', () => {
    expect(hourWords(10)).toBe('About ten in the morning');
    expect(hourWords(22)).toBe('About ten at night');
    expect(hourWords(23.5)).toBe('Around midnight');
    expect(hourWords(12)).toBe('Around noon');
    expect(hourWords(15)).toBe('About three in the afternoon');
    expect(hourWords(3)).toBe('About three in the small hours');
  });

  it('says how dark tonight is', () => {
    expect(darkWords(0)).toMatch(/^No true dark/);
    expect(darkWords(5.3)).toBe('About five hours of true dark tonight');
    expect(darkWords(12)).toBe('A full twelve hours of dark tonight');
    expect(darkWords(1.3)).toBe('Barely an hour of true dark tonight');
  });

  it("names Fida's phase like Earth's moon", () => {
    expect(fidaWords(0.017)).toBe('Fida, the moon: full');
    expect(fidaWords(0.5)).toBe('Fida, the moon: new');
    expect(fidaWords(0.25)).toBe('Fida, the moon: last quarter');
    expect(fidaWords(0.62)).toBe('Fida, the moon: waxing crescent');
    expect(fidaWords(0.9)).toBe('Fida, the moon: waxing gibbous');
  });

  it('counts the Crawl and the Glistening', () => {
    expect(crawlWords(5, 27)).toBe('The fifth Crawl, day 27');
    expect(crawlWords(null, null)).toBe('');
    expect(glisteningWords(7, 257)).toBe('Astra swings back like a comet in 257 years: the Seventh Glistening');
    expect(ordinal(21)).toBe('21st');
    expect(ordinal(112)).toBe('112th');
    expect(roman(6)).toBe('VI');
    expect(eraWords(6, 743)).toBe('743 years since the Sixth Glistening');
    expect(eraWords(7, 1)).toBe('1 year since the Seventh Glistening');
    expect(eraWords(7, 0)).toBe('The year of the Seventh Glistening');
    expect(eraWords(0, 40)).toBe('40 years since the Impact, before any Glistening');
  });
});
