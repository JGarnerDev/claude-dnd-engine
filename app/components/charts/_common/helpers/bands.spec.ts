import { describe, it, expect } from 'vitest';
import { deriveSessionBands } from './bands.js';
import type { IndexedEvent } from './axis.js';

// A trivial 1:1 scale so x positions equal day indices — keeps the assertions
// about band geometry readable.
const xOf = (i: number) => i;
const DPY = 360;

function session(idx: number, label: string, major = false): IndexedEvent {
  return { _idx: idx, date: '', label, major };
}

describe('deriveSessionBands', () => {
  it('returns no bands for no sessions', () => {
    expect(deriveSessionBands([], xOf, DPY)).toEqual([]);
  });

  it('centers each band on its session, with edges at the midpoints to neighbours', () => {
    const bands = deriveSessionBands([session(100, 'S1'), session(140, 'S2'), session(150, 'S3')], xOf, DPY);
    expect(bands.map((b) => [b.x0, b.x1])).toEqual([
      [80, 120], // first mirrors the next gap (40) on its left → [100-20, 100+20]
      [120, 145], // midpoints: (100+140)/2 .. (140+150)/2
      [145, 155], // last mirrors the prev gap (10) on its right → [150-5, 150+5]
    ]);
  });

  it('keeps each session strictly inside its band (off the seam) so its beats sit within', () => {
    const idxs = [100, 140, 150];
    const bands = deriveSessionBands(idxs.map((n, i) => session(n, `S${i}`)), xOf, DPY);
    bands.forEach((b, i) => {
      expect(b.x0).toBeLessThan(idxs[i]);
      expect(b.x1).toBeGreaterThan(idxs[i]);
    });
  });

  it('makes adjacent bands abut (no gaps)', () => {
    const bands = deriveSessionBands([session(0, 'a'), session(30, 'b'), session(45, 'c')], xOf, DPY);
    for (let i = 1; i < bands.length; i++) expect(bands[i].x0).toBe(bands[i - 1].x1);
  });

  it('gives a lone session a one-month fallback width, centered on it', () => {
    const [band] = deriveSessionBands([session(200, 'only')], xOf, DPY);
    expect((band.x0 + band.x1) / 2).toBe(200);
    expect(band.x1 - band.x0).toBeCloseTo(DPY / 12, 5); // ~one month
  });

  it('carries the session label and major flag', () => {
    const [band] = deriveSessionBands([session(10, 'Big one', true)], xOf, DPY);
    expect(band.label).toBe('Big one');
    expect(band.major).toBe(true);
  });
});
