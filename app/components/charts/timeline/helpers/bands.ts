// Pure: turn the session beats into time-range bands for the world view. A
// session stores only its date (`_idx`), so each band is CENTERED on its session
// and its edges are the midpoints to the neighbouring sessions — the band wraps
// the beats that happened around that session instead of ending on its date (which
// would pin those beats to the band's seam). Bands still abut (a midpoint is the
// shared edge of the two bands it splits). Outer edges (and a lone session) fall
// back to a half-month so the end bands aren't lopsided. No DOM — layout.ts maps
// the day indices to px via the shared axis scale.

import type { IndexedEvent } from '../../_common/helpers/axis.js';
import type { SessionBand } from '../../_common/types.js';

export function deriveSessionBands(
  sessions: IndexedEvent[], // sorted ascending by _idx
  xOf: (idx: number) => number,
  daysPerYear: number,
): SessionBand[] {
  if (sessions.length === 0) return [];
  const halfFallback = daysPerYear / 24; // ~half a month for an outer/lone edge
  return sessions.map((s, i) => {
    const prev = sessions[i - 1];
    const next = sessions[i + 1];
    // Half-width to each side = half the gap to that neighbour; mirror the other
    // side at the ends so a first/last/lone band stays centered on its session.
    const leftHalf = prev ? (s._idx - prev._idx) / 2 : next ? (next._idx - s._idx) / 2 : halfFallback;
    const rightHalf = next ? (next._idx - s._idx) / 2 : prev ? (s._idx - prev._idx) / 2 : halfFallback;
    return { x0: xOf(s._idx - leftHalf), x1: xOf(s._idx + rightHalf), label: s.label, major: !!s.major, source: s.source };
  });
}
