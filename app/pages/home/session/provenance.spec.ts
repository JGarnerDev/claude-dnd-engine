import { describe, expect, it } from 'vitest';
import { stripProvenance } from './provenance.js';

describe('stripProvenance', () => {
  it('drops dated decider parentheticals', () => {
    expect(stripProvenance('- **Odibli\'s deed and level-up** (Jeff, 2026-10-07).')).toBe('- **Odibli\'s deed and level-up**.');
    expect(stripProvenance('**Show the track (engine 2026-10-09, committed 2026-10-13).** Put coins down.'))
      .toBe('**Show the track.** Put coins down.');
    expect(stripProvenance('**Tactics (Jeff, 2026-10-07): wound and pin.**')).toBe('**Tactics: wound and pin.**');
  });

  it('keeps parentheticals that are not provenance', () => {
    expect(stripProvenance('Arcana (DC 13) reads it.')).toBe('Arcana (DC 13) reads it.');
    expect(stripProvenance('the fox (Halsby has met it)')).toBe('the fox (Halsby has met it)');
  });

  it('drops a provenance-only bullet and trims a provenance lead', () => {
    expect(stripProvenance('- **Engine, 2026-10-09; committed 2026-10-13.**\n- keep')).toBe('- keep');
    expect(stripProvenance('- **Engine, 2026-10-09; committed 2026-10-13.** A small choice.')).toBe('- A small choice.');
    expect(stripProvenance('- **Draft (engine, 2026-10-21).** ben missed it.')).toBe('- Ben missed it.');
  });
});
