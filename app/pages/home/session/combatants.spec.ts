import { describe, expect, it } from 'vitest';
import { applyHp, attackLines, matchEnemy, parseCombatants } from './combatants.js';

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
  it('keeps only subsections with an AC line, with stats, max HP and every attack', () => {
    const blocks = parseCombatants(md);
    expect(blocks.map((b) => b.title)).toEqual([
      'Bandit — Fennel Dray (fork) and Clatter (camp)', 'Scout — Ilsa Hask, the rear guard\'s rider', 'Nella — veteran sniper',
    ]);
    expect(blocks[1].stats).toBe('AC 13 · HP 16 · Speed 30 ft · CR 1/2');
    expect(blocks[1].attacks).toEqual(['**Multiattack:** two attacks', '**Longbow** +4 to hit, range 150/600, 1d8+2 piercing (avg 6)']);
    expect(blocks[1].hp).toBe(16);
    expect(blocks[2].attacks).toEqual([]);
    expect(blocks[2].hp).toBe(49); // bold "**HP 49**"
  });
});

describe('attackLines', () => {
  // Session 33: the compact row showed only the first "to hit" line, so the Thugs'
  // heavy crossbow, Varrick's dagger and Parry, the griffon's claws and Sacred Flame hid.
  it('keeps every weapon, dice feature, save spell and reaction, and skips kit and notes', () => {
    const md = [
      '- AC 15 · HP 65',
      '- **Multiattack:** two cart-whip attacks and one dagger',
      '- **Cart-whip** (scimitar) +5 to hit, 1d6+3 slashing (avg 6)',
      '- **Dagger** +5 to hit, reach 5 ft or range 20/60, 1d4+3 piercing (avg 5)',
      '- **Parry (reaction):** +2 AC against one melee attack he can see',
      '- **Multiattack:** beak +6, 1d8+4 piercing, and claws +6, 2d6+4 slashing',
      '- **Spellcasting** (WIS, save DC 12): *sacred flame* (1d8 radiant, DEX save)',
      '- **Sneak Attack (1/turn):** +2d6 (7) with advantage',
      '- **Pack Tactics:** advantage if an ally is within 5 ft',
      '- **Kit (player-facing):** *a heavy crossbow, 1d10 of bolts*',
      '- **Tactics (Jeff, 2026-10-07):** wound and pin, never kill',
      '- **Varrick Tenn** (human): leathery, barks orders.',
      '  - **Label (party-facing):** Drover',
    ].join('\n');
    expect(attackLines(md).map((l) => /^\*\*([^*:(]+)/.exec(l)![1].trim())).toEqual([
      'Multiattack', 'Cart-whip', 'Dagger', 'Parry', 'Multiattack', 'Spellcasting', 'Sneak Attack',
    ]);
  });
});

describe('applyHp', () => {
  it('takes damage, heals, sets, and clamps to 0..max', () => {
    expect(applyHp(65, 65, '12')).toBe(53);
    expect(applyHp(65, 65, '-12')).toBe(53);
    expect(applyHp(10, 65, '+5')).toBe(15);
    expect(applyHp(10, 65, '=40')).toBe(40);
    expect(applyHp(10, 65, '30')).toBe(0);
    expect(applyHp(60, 65, '+20')).toBe(65);
    expect(applyHp(60, 65, 'lots')).toBeNull();
    expect(applyHp(60, 65, '')).toBeNull();
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
