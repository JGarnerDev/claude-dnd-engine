// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { plateSvg } from './sky-plate.js';
import type { Sky } from './types.js';

const sky: Sky = {
  date: '6743-05-21', time: '10:00', year: 6743, dayOfYear: 141, hour: 10,
  sun: { phase: 5, offset: 6.67, trueDark: 5.3 },
  fida: { age: 0.017, lit: 0.997, waxing: false },
  astra: { yearInCycle: 743, toGlistening: 257, next: 7, trueAnomaly: 188.9, radius: 1.632 },
  crawl: 5, crawlYear: 6743, crawlDay: 27, prev: null,
};
const svg = (s: Sky) => { const el = document.createElement('div'); el.innerHTML = plateSvg(s); return el.querySelector('svg')!; };

describe('sky plate', () => {
  it('holds still when there is no previous session to sweep from', () => {
    const style = svg(sky).querySelector('.sk-gold')!.getAttribute('style')!;
    expect(style).toContain('--from:330deg');
    expect(style).toContain('--to:330deg');
  });

  it('points the dial at the day of the year', () => {
    const el = svg(sky);
    expect(el.querySelector('.sk-pointer')!.getAttribute('transform')).toBe('rotate(140 500 500)');
    expect(el.querySelector('.sk-day')!.textContent).toBe('141');
  });

  it('draws Fida with a lit side, a crack and shards', () => {
    const el = svg(sky);
    expect(el.querySelector('.sk-fida-lit')).not.toBeNull();
    expect(el.querySelector('.sk-crack')).not.toBeNull();
    expect(el.querySelectorAll('.sk-shard')).toHaveLength(3);
  });

  it('names the plate for screen readers', () => {
    expect(svg(sky).getAttribute('aria-label')).toBe("Aethryn's sky on 6743-05-21");
  });
});
