import { describe, expect, it } from 'vitest';
import { anyMet, enemyNames, parseConds } from './cues.js';

const entries = ['Sniper ([[Nella]])', 'Griffon (Tithe)', 'Relief Captain (Garran Vey)', 'Relief Rider 1 (Dace Morrow)', 'Relief Rider 2 (Pim Ostler)'];
const names = enemyNames(entries);

describe('enemyNames', () => {
  it('answers to the real name, either half of it, and the label', () => {
    const vey = names.filter((n) => n.entry === 'Relief Captain (Garran Vey)').map((n) => n.name);
    expect(vey.sort()).toEqual(['Garran', 'Garran Vey', 'Relief Captain', 'Vey']);
    expect(names.find((n) => n.name === 'Nella')!.entry).toBe('Sniper ([[Nella]])');
  });
});

describe('parseConds', () => {
  it('reads rounds, HP thresholds and drops the way plans write them', () => {
    expect(parseConds('round 3, the second round after Iggy\'s first turn', names)).toEqual([{ kind: 'round', n: 3 }]);
    expect(parseConds('If Nella drops to half (24 HP):', names)).toEqual([{ kind: 'hp', entry: 'Sniper ([[Nella]])', n: 24 }]);
    expect(parseConds('If Tithe goes bloodied (47 HP):', names)).toEqual([{ kind: 'hp', entry: 'Griffon (Tithe)', n: 47 }]);
    expect(parseConds('Garran Vey drops, or the crew is down to two.', names)).toEqual([{ kind: 'down', entry: 'Relief Captain (Garran Vey)' }, { kind: 'left', n: 2, except: [] }]);
    expect(parseConds('If Tithe drops to 0 while hunting:', names)).toEqual([{ kind: 'down', entry: 'Griffon (Tithe)' }]);
    expect(parseConds('Tithe snatches someone and carries them up.', names)).toEqual([]);
  });

  it('comes true on any one of its cues', () => {
    const conds = parseConds('after the rout, or once Nella drops to half (24 HP); round 5 at the latest', names);
    expect(anyMet(conds, { round: 2, hp: { 'Sniper ([[Nella]])': 49 } })).toBe(false);
    expect(anyMet(conds, { round: 2, hp: { 'Sniper ([[Nella]])': 24 } })).toBe(true);
    expect(anyMet(conds, { round: 5, hp: {} })).toBe(true);
    const down = parseConds('Vey drops', names);
    expect(anyMet(down, { round: 1, hp: { 'Relief Captain (Garran Vey)': 3 } })).toBe(false);
    expect(anyMet(down, { round: 1, hp: { 'Relief Captain (Garran Vey)': 0 } })).toBe(true);
  });

  it('counts who is still standing, leaving out the ones named after "but"', () => {
    const conds = parseConds('Garran Vey drops, or the crew (everyone but Nella and Tithe) is down to two.', names);
    expect(conds).toEqual([
      { kind: 'down', entry: 'Relief Captain (Garran Vey)' },
      { kind: 'left', n: 2, except: ['Sniper ([[Nella]])', 'Griffon (Tithe)'] },
    ]);
    const hp = { 'Sniper ([[Nella]])': 49, 'Griffon (Tithe)': 95, 'Relief Captain (Garran Vey)': 58, 'Relief Rider 1 (Dace Morrow)': 11, 'Relief Rider 2 (Pim Ostler)': 0 };
    const arrives = { 'Relief Captain (Garran Vey)': 3, 'Relief Rider 1 (Dace Morrow)': 3, 'Relief Rider 2 (Pim Ostler)': 3 };
    // Round 2: the riders aren't here yet, so nobody but Nella and Tithe stands.
    expect(anyMet(conds, { round: 2, hp, arrives })).toBe(true);
    // Round 3: Vey and Dace are up, Pim is down: two left.
    expect(anyMet(conds, { round: 3, hp, arrives })).toBe(true);
    expect(anyMet(conds, { round: 3, hp: { ...hp, 'Relief Rider 2 (Pim Ostler)': 7 }, arrives })).toBe(false);
    expect(parseConds('enemies down to 3', names)).toEqual([{ kind: 'left', n: 3, except: [] }]);
  });
});
