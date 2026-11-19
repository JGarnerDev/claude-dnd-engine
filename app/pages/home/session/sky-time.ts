// The sky slide's title and the in-world time between sessions (pure; Sky.tsx draws the slide).

import type { Sky, SkyMoment } from './types.js';

export const SKY_TITLE = 'As the sky stood';

// Hours since the impact on Aethryn's 12 x 30-day calendar (scripts/lib/sky.py absolute_day).
function absHours(m: SkyMoment): number {
  const [y, mo, d] = m.date.split('-').map(Number);
  return (y * 360 + (mo - 1) * 30 + d - 1) * 24 + m.hour;
}

// In-world hours from the previous session's moment to this one, or null with no earlier session.
export function elapsedHours(s: Sky): number | null {
  return s.prev ? absHours(s) - absHours(s.prev) : null;
}
