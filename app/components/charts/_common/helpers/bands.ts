// Pure: turn the session beats into time-range bands. Shared by both charts — the
// world view draws each band straddling the axis behind its beats; the swimlane
// draws it as a full-height column passing through every lane. A session stores
// only its date (`_idx`), so each band is CENTERED on its session and its edges
// are the midpoints to the neighbouring sessions — the band wraps the beats that
// happened around that session instead of ending on its date (which would pin
// those beats to the band's seam). Bands still abut (a midpoint is the shared edge
// of the two bands it splits). Outer edges (and a lone session) fall back to a
// half-month so the end bands aren't lopsided. A session on the far side of an axis
// break (a squeezed dead stretch) isn't a neighbour: the band stops
// as if it were an outer edge instead of reaching across the break. No DOM — the caller maps the day
// indices to px via the shared axis scale.

import type { IndexedEvent } from './axis.js';
import type { SessionBand } from '../types.js';

export function deriveSessionBands(
  sessions: IndexedEvent[], // sorted ascending by _idx
  xOf: (idx: number) => number,
  daysPerYear: number,
  breaks: number[] = [], // virtual day indices of axis breaks
): SessionBand[] {
  if (sessions.length === 0) return [];
  const halfFallback = daysPerYear / 24; // ~half a month for an outer/lone edge
  const across = (a: number, b: number) => breaks.some((v) => v > a && v < b);
  return sessions.map((s, i) => {
    const prev = i > 0 && !across(sessions[i - 1]._idx, s._idx) ? sessions[i - 1] : undefined;
    const next = i < sessions.length - 1 && !across(s._idx, sessions[i + 1]._idx) ? sessions[i + 1] : undefined;
    // Half-width to each side = half the gap to that neighbour; mirror the other
    // side at the ends so a first/last/lone band stays centered on its session.
    const leftHalf = prev ? (s._idx - prev._idx) / 2 : next ? (next._idx - s._idx) / 2 : halfFallback;
    const rightHalf = next ? (next._idx - s._idx) / 2 : prev ? (s._idx - prev._idx) / 2 : halfFallback;
    // Never past a break: the half-month fallback beside one could reach into it.
    const lo = Math.max(s._idx - leftHalf, ...breaks.filter((v) => v < s._idx));
    const hi = Math.min(s._idx + rightHalf, ...breaks.filter((v) => v > s._idx));
    return { x0: xOf(lo), x1: xOf(hi), label: s.label, major: !!s.major, source: s.source };
  });
}
