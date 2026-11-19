// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, jsx } from './canon.js';
import * as N from '../Reputation.js';
import { reputationSlides } from '../legacy/reputation.js';
import type { PcReputation, Reputation } from '../types.js';

const zero = { score: 0, gain: 0, tier: 'Unremarked', rank: 1, up: false };
const pc = (over: Partial<PcReputation>): PcReputation => ({
  pc: 'X', fame: { ...zero, tier: 'Unknown' }, infamy: zero, local: [], deeds: [], ...over,
});
const rep: Reputation = {
  session: 30, campaign: 'homebrew', partyFame: 1898, partyTier: 'Unknown', crossings: [], warnings: [],
  pcs: [
    pc({ pc: 'Dip', fame: { score: 5696, gain: 272, tier: 'Noticed', rank: 2, up: true },
      infamy: { score: 272, gain: 272, tier: 'Unremarked', rank: 1, up: false },
      known: { fame: 'Cut down [[Harrow Bane|three raiders]] in two breaths.', infamy: '' },
      deeds: [
        { track: 'fame', scope: 'Ashford', points: 5424, text: 'Felled [[Harrow Bane|the captain]] in the *square*.' },
        { track: 'infamy', scope: 'Ashford', points: 272, text: 'Threw him in the well.' },
      ] }),
    pc({ pc: 'Luci' }),
  ],
};

describe('reputation parity', () => {
  it('reputationSlides(rep)', () => {
    const a = reputationSlides(rep); const b = N.reputationSlides(rep);
    expect(b.length).toBe(a.length);
    a.forEach((s, i) => {
      expect(b[i].title).toBe(s.title);
      expect(!!b[i].bare).toBe(!!s.bare);
      if (s.html) expect(jsx(b[i].body)).toBe(html(s.html));
      else expect(b[i].body).toBeUndefined();
    });
  });
});
