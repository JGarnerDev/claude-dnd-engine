import { describe, expect, it } from 'vitest';
import { matchEnemy, parseCombatants } from './combatants.js';

const md = [
  '### At a glance',
  '',
  '- **Archer Rider** — Ilsa Hask',
  '',
  '### Bandit — Fennel Dray (fork) and Clatter (camp)',
  '',
  '- AC 12 · HP 11 · Speed 30 ft · CR 1/8',
  '- **Scimitar** +3 to hit, 1d6+1 slashing (avg 4)',
  '- **Fennel Dray** (human): wiry.',
  '  - **Label (party-facing):** Crossbow Rider',
  '',
  '### Scout — Ilsa Hask, the rear guard\'s rider',
  '',
  '- AC 13 · HP 16 · Speed 30 ft · CR 1/2',
  '- **Multiattack:** two attacks',
  '- **Longbow** +4 to hit, range 150/600, 1d8+2 piercing (avg 6)',
  '  - **Label (party-facing):** Archer Rider',
  '',
  '### Nella — veteran sniper',
  '',
  '- AC 15 (studded leather) · **HP 49** · Speed 35 ft',
  '- **Label (party-facing):** Sniper',
].join('\n');

describe('parseCombatants', () => {
  it('keeps only subsections with an AC line, with stats and the first attack', () => {
    const blocks = parseCombatants(md);
    expect(blocks.map((b) => b.title)).toEqual([
      'Bandit — Fennel Dray (fork) and Clatter (camp)', 'Scout — Ilsa Hask, the rear guard\'s rider', 'Nella — veteran sniper',
    ]);
    expect(blocks[1].stats).toBe('AC 13 · HP 16 · Speed 30 ft · CR 1/2');
    expect(blocks[1].attack).toBe('**Longbow** +4 to hit, range 150/600, 1d8+2 piercing (avg 6)');
    expect(blocks[2].attack).toBe('');
  });
});

describe('matchEnemy', () => {
  const blocks = parseCombatants(md);
  it('matches by real name, then by label', () => {
    expect(matchEnemy('Archer Rider (Ilsa Hask)', blocks)!.title).toMatch(/^Scout/);
    expect(matchEnemy('Roof Guard (Clatter)', blocks)!.title).toMatch(/^Bandit/);
    expect(matchEnemy('Sniper ([[Nella]])', blocks)!.title).toMatch(/^Nella/);
    expect(matchEnemy('Crossbow Rider', blocks)!.title).toMatch(/^Bandit/);
    expect(matchEnemy('Dragon (Smaug)', blocks)).toBeUndefined();
  });

  it('prefers a name in a block title over a mention in another block', () => {
    const mixed = parseCombatants('### Bandit — Fennel\n\n- AC 12 · HP 11\n- loves Cinder.\n\n### Wolf — Cinder\n\n- AC 13 · HP 11');
    expect(matchEnemy('Wolf (Cinder)', mixed)!.title).toBe('Wolf — Cinder');
  });
});
