// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { rowStats, sceneHeadHtml } from './scene-head.js';
import { parseCombatants } from './combatants.js';
import type { SceneHeader } from './scene-header.js';

const blank: SceneHeader = { summary: '', where: '', cast: '', enemies: [], dcs: [], tactics: '', time: '', rest: '' };
const blocks = parseCombatants('### Wolf — Cinder\n\n- AC 13 · HP 11\n- **Bite** +4 to hit, 2d4+2\n- **Tactics (Jeff, 2026-10-07):** legs first');

describe('sceneHeadHtml', () => {
  it('leaves out empty rows and shows a plain cast when it is not a · list', () => {
    const el = document.createElement('div');
    el.innerHTML = sceneHeadHtml({ ...blank, cast: '[[Silas Crubb]]; the fox.' }, [], () => true);
    expect(el.querySelectorAll('.sr-sh-row')).toHaveLength(1);
    expect(el.querySelector('.sr-sh-chip')).toBeNull();
    expect(el.querySelector('.sr-sh-val a.sr-wiki')!.textContent).toBe('Silas Crubb');
  });

  it('shows enemy rows that expand to the stat block, unmatched ones plain, and tactics', () => {
    const el = document.createElement('div');
    el.innerHTML = sceneHeadHtml({ ...blank, enemies: ['Wolf (Cinder)', 'Dragon'], tactics: 'they run at two' }, blocks, () => true);
    const rows = el.querySelectorAll('.sr-enemy');
    expect(rows).toHaveLength(2);
    expect(rows[0].querySelector('.sr-enemy-atk')!.textContent).toContain('+4 to hit');
    expect(rows[0].querySelector('.sr-enemy-block')!.textContent).not.toContain('2026');
    expect(rows[1].classList.contains('is-unmatched')).toBe(true);
    expect(el.querySelector('.sr-tactics')!.textContent).toBe('they run at two');
  });
});

describe('rowStats', () => {
  it('keeps AC, HP, speed and CR, and drops skills', () => {
    expect(rowStats('AC 12 · HP 27 · Speed 30 ft · CR 1 · Deception +5, Insight +4')).toBe('AC 12 · HP 27 · Speed 30 ft · CR 1');
    expect(rowStats('AC 15 (studded leather) · **HP 49** · Speed 35 ft')).toBe('AC 15 (studded leather) · **HP 49** · Speed 35 ft');
  });
});
