// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, jsx } from './canon.js';
import * as N from '../Sky.js';
import { skySlides } from '../legacy/sky.js';
import type { Sky, SkyMoment } from '../types.js';

const moment = (over: Partial<SkyMoment> = {}): SkyMoment => ({
  date: '6743-05-21', time: '10:00', year: 6743, dayOfYear: 141, hour: 10,
  sun: { phase: 5, offset: 6.67, trueDark: 5.3 },
  fida: { age: 0.017, lit: 0.997, waxing: false },
  astra: { yearInCycle: 743, toGlistening: 257, next: 7, trueAnomaly: 188.9, radius: 1.632 },
  ...over,
});
const sky: Sky = { ...moment(), crawl: 5, crawlYear: 6743, crawlDay: 27, prev: moment({ time: '07:00', hour: 7 }) };

describe('sky parity', () => {
  it('skySlides(sky)', () => {
    const a = skySlides(sky); const b = N.skySlides(sky);
    expect(b.length).toBe(a.length);
    a.forEach((s, i) => {
      expect(b[i].title).toBe(s.title);
      expect(!!b[i].bare).toBe(!!s.bare);
      if (s.html) expect(jsx(b[i].body)).toBe(html(s.html));
      else expect(b[i].body).toBeUndefined();
    });
  });
});
