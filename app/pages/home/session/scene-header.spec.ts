import { describe, expect, it } from 'vitest';
import { findDcs, parseSceneHeader } from './scene-header.js';

describe('parseSceneHeader', () => {
  it('reads an authored header and leaves the rest', () => {
    const setup = [
      '- **Summary:** The night closes out.',
      '- **Cast:** [[Sable Wren]] · Dunny Marsh',
      '- **Enemies:** Archer Rider (Ilsa Hask) · Wolf (Cinder)',
      '- **DCs:** Arcana 13 — read the charm · DEX 13 save — half',
      '- **Tactics:** they go for the horses',
      '- **Time:** ~30 min',
      '- **Trigger:** the song ends',
      '',
      '> Read this aloud.',
    ].join('\n');
    const h = parseSceneHeader(setup, setup);
    expect(h.summary).toBe('The night closes out.');
    expect(h.cast).toBe('[[Sable Wren]] · Dunny Marsh');
    expect(h.enemies).toEqual(['Archer Rider (Ilsa Hask)', 'Wolf (Cinder)']);
    expect(h.dcs).toEqual(['Arcana 13 — read the charm', 'DEX 13 save — half']);
    expect(h.tactics).toBe('they go for the horses');
    expect(h.time).toBe('~30 min');
    expect(h.rest).toBe('> Read this aloud.');
  });

  it('treats "none" as no enemies, and joins wrapped lines', () => {
    const h = parseSceneHeader('- **Enemies:** none\n- **Summary:** one\n  two', '');
    expect(h.enemies).toEqual([]);
    expect(h.summary).toBe('one two');
  });

  it('falls back on the old setup bullets and finds DCs in the prose', () => {
    const setup = '- **Trigger:** first light.\n- **Location:** the ford.\n- **NPCs present:** [[Silas Crubb]]; the fox.\n- **Time:** ~15 minutes.';
    const h = parseSceneHeader(setup, setup + '\n\nAthletics DC 13 to swim. A DC 12 WIS save.');
    expect(h.summary).toBe('first light.');
    expect(h.where).toBe('the ford.');
    expect(h.cast).toBe('[[Silas Crubb]]; the fox.');
    expect(h.dcs).toEqual(['Athletics 13', 'WIS 12']);
    expect(h.rest).toBe('');
  });
});

describe('findDcs', () => {
  it('names the check before or after the DC, dedupes, and keeps bare DCs', () => {
    expect(findDcs('Reading it (Arcana DC 13). INT with calligrapher\'s supplies, DC 14. Arcana DC 13 again. DC 9 flat.'))
      .toEqual(['Arcana 13', 'INT 14', 'DC 9']);
  });
});
