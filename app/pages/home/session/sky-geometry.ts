// Pure geometry for the sky slide (sky.ts): a geocentric orrery on a 1000 × 1000 plate with
// Aethryn at the centre. Angles are degrees clockwise from the top of the plate. The sky maths
// itself (phases, Astra's anomaly) comes from scripts/lib/sky.py; this only places it.

export const C = 500;
export const R = { slices: 58, fida: 108, suns: 162, shards: 216, wanderers: 272, blanket: 404, dial: 438 } as const;
export const ASTRA = { e: 0.94, far: 380, tilt: 128 } as const; // far point radius; direction of the far point

const rad = (deg: number) => (deg * Math.PI) / 180;
const f = (n: number) => Math.round(n * 10) / 10;

// A point at `r` from the centre, at `deg` clockwise from the top.
export function polar(r: number, deg: number): { x: number; y: number } {
  return { x: f(C + r * Math.sin(rad(deg))), y: f(C - r * Math.cos(rad(deg))) };
}

// A full circle as a path starting at the left and running over the top, for <textPath>.
export function ringPath(r: number): string {
  return `M ${C - r},${C} A ${r} ${r} 0 1 1 ${C + r},${C} A ${r} ${r} 0 1 1 ${C - r},${C}`;
}

// The bright sun: noon at the top, sunrise at the left, sunset at the right.
export const sunAngle = (hour: number) => (((hour - 12) * 15) % 360 + 360) % 360;

// The red sun trails the bright one by `offset` hours.
export const redAngle = (hour: number, offset: number) => sunAngle(hour - offset);

// Fida: full (age 0) stands opposite the bright sun, new (age 0.5) beside it.
export const fidaAngle = (sun: number, age: number) => (((sun + 180 - 360 * age) % 360) + 360) % 360;

// Fida's lit part as a path centred on 0,0 with the lit side toward +x. `lit` is 0..1.
export function phasePath(r: number, lit: number): string {
  if (lit <= 0.005) return '';
  const rx = f(r * Math.abs(2 * lit - 1));
  return `M 0,${-r} A ${r} ${r} 0 0 1 0,${r} A ${rx} ${r} 0 0 ${lit > 0.5 ? 1 : 0} 0,${-r} Z`;
}

// Astra's ellipse, one focus on Aethryn, far point toward ASTRA.tilt.
export function astraEllipse(): { cx: number; cy: number; rx: number; ry: number; rot: number } {
  const a = ASTRA.far / (1 + ASTRA.e);
  const c = polar(a * ASTRA.e, ASTRA.tilt);
  return { cx: c.x, cy: c.y, rx: f(a), ry: f(a * Math.sqrt(1 - ASTRA.e ** 2)), rot: ASTRA.tilt - 90 };
}

// Astra at true anomaly `nu` (0 = the Glistening, at the near point).
export function astraPoint(nu: number): { x: number; y: number } {
  const a = ASTRA.far / (1 + ASTRA.e);
  const r = (a * (1 - ASTRA.e ** 2)) / (1 + ASTRA.e * Math.cos(rad(nu)));
  return polar(r, ASTRA.tilt + 180 + nu);
}

// Nine wanderers: decorative, each on its own slow period, so the plate shifts year to year.
const PERIODS = [88, 225, 687, 1300, 2100, 4333, 7600, 10759, 30687];
export function wanderers(absDay: number): number[] {
  return PERIODS.map((p, i) => (((i * 97 + (360 * absDay) / p) % 360) + 360) % 360);
}

// The sweep target: `to`, unwound so a body always turns forward (clockwise) from `from`.
export const forward = (from: number, to: number) => from + ((((to - from) % 360) + 360) % 360);

// The calendar dial: day 1 at the top, the year running clockwise.
export const dialAngle = (dayOfYear: number) => ((dayOfYear - 1) / 360) * 360;
