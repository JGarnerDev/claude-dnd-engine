import { describe, expect, it } from 'vitest';
import {
  ASTRA, C, astraEllipse, astraPoint, dialAngle, fidaAngle, forward, phasePath, polar, redAngle, sunAngle, wanderers,
} from './sky-geometry.js';

const dist = (p: { x: number; y: number }) => Math.hypot(p.x - C, p.y - C);

describe('sky geometry', () => {
  it('places points clockwise from the top', () => {
    expect(polar(100, 0)).toEqual({ x: 500, y: 400 });
    expect(polar(100, 90)).toEqual({ x: 600, y: 500 });
  });

  it('puts noon at the top, sunrise left, sunset right', () => {
    expect(sunAngle(12)).toBe(0);
    expect(sunAngle(6)).toBe(270);
    expect(sunAngle(18)).toBe(90);
    expect(sunAngle(10)).toBe(330);
  });

  it('trails the red sun by its offset', () => {
    expect(redAngle(12, 6)).toBe(sunAngle(6));
    expect(redAngle(10, 0)).toBe(sunAngle(10));
  });

  it('sets full Fida opposite the gold sun and new Fida beside it', () => {
    expect(fidaAngle(0, 0)).toBe(180);
    expect(fidaAngle(30, 0.5)).toBe(30);
  });

  it('draws no lit part for a new moon and a whole disc when full', () => {
    expect(phasePath(17, 0)).toBe('');
    expect(phasePath(17, 1)).toContain('A 17 17 0 0 1 0,-17');
    expect(phasePath(17, 0.5)).toContain('A 0 17');
  });

  it('runs Astra from its near point at the Glistening to its far point', () => {
    const near = dist(astraPoint(0));
    const far = dist(astraPoint(180));
    expect(far).toBeCloseTo(ASTRA.far, 0);
    expect(near).toBeCloseTo((ASTRA.far * (1 - ASTRA.e)) / (1 + ASTRA.e), 0);
    const el = astraEllipse();
    expect(el.rx).toBeGreaterThan(el.ry);
  });

  it('always sweeps forward', () => {
    expect(forward(350, 10)).toBe(370);
    expect(forward(10, 350)).toBe(350);
    expect(forward(40, 40)).toBe(40);
  });

  it('gives nine wanderers that move with the days', () => {
    const a = wanderers(1000);
    const b = wanderers(1010);
    expect(a).toHaveLength(9);
    expect(a[0]).not.toBe(b[0]);
    a.forEach((d) => { expect(d).toBeGreaterThanOrEqual(0); expect(d).toBeLessThan(360); });
  });

  it('starts the dial at the top on day 1', () => {
    expect(dialAngle(1)).toBe(0);
    expect(dialAngle(181)).toBe(180);
  });
});
