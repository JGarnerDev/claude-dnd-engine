// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { renderScene } from './scene.js';
import type { SceneView } from './scene.js';
import { parseCombatants } from './combatants.js';
import { recordHit, recordReset } from './hp-log.js';
import type { HpState } from './hp-log.js';
import { buildRefIndex } from './refs.js';
import type { FlowNode } from './types.js';

const n = (id: string, kind = 'social', title = id): FlowNode => ({ id, marker: 'committed', kind, scene: 'SC1', title, lines: [], notes: [] });
const ask = n('S1_ASK', 'decision', 'Mara asks');
const fight = n('S1_FIGHT', 'combat', 'The fork');
const md = [
  '- **Summary:** The night closes out.',
  '- **Cast:** [[Sable Wren]] · Dunny',
  '- **Enemies:** Archer Rider (Ilsa Hask)',
  '- **DCs:** Arcana 13 — read it',
  '- **Time:** ~30 min',
  '',
  '> Read this aloud.',
  '',
  '- **Location:** the inn',
  '- **Roll20:** use the indoors map.',
  '',
  '#### S1_ASK — Mara asks',
  '',
  '- **Tokens:** Mara at the door.',
  '- **Introduce:** Mara, sheriff',
  '  - **Look:** a star.',
  '- **Choice (party):** go or stay.',
  '- **Engine, 2026-10-09; committed 2026-10-13.** A small choice (Jeff, 2026-10-07).',
  '',
  '#### S1_FIGHT — The fork',
  '',
  '- **Tokens:** riders by the tree.',
].join('\n');
const combatants = parseCombatants('### Scout — Ilsa Hask\n\n- AC 13 · HP 16\n- **Longbow** +4 to hit, 1d8+2');

function view(over: Partial<SceneView> = {}): SceneView {
  return {
    node: ask,
    scene: { id: 'SC1', key: '1', title: 'Scene 1 · The Night', md },
    sceneNodes: [n('S1_OPEN', 'social', 'Open'), ask, fight],
    visited: new Set(['S1_OPEN', 'S1_ASK']),
    position: 'step 2 of 3',
    options: [{ to: 'S1_FIGHT', label: 'go', kind: 'edge' }, { to: 'S1_OPEN', label: 'stay', kind: 'edge' }],
    titleOf: (id) => `title of ${id}`,
    known: () => true,
    refs: buildRefIndex([n('S1_OPEN', 'social', 'Open'), ask, fight], [{ id: 'SC1', key: '1', title: 'Scene 1 · The Night', md }], 'S1_ASK'),
    closingHook: 'The end.',
    combatants,
    hp: {},
    hpLog: [],
    tokensOpen: false,
    onGo: vi.fn(),
    onTokensToggle: vi.fn(),
    onHpHit: vi.fn(),
    onHpReset: vi.fn(),
    onHpUndo: vi.fn(),
    round: 1,
    onRound: vi.fn(),
    ...over,
  };
}

describe('renderScene', () => {
  it('shows the header: summary, cast chips, DCs, time, and enemies matched to stat blocks', () => {
    const main = document.createElement('main');
    renderScene(main, view());
    expect(main.querySelector('.sr-sh-summary')!.textContent).toBe('The night closes out.');
    expect([...main.querySelectorAll('.sr-sh-chip')].map((c) => c.textContent)).toEqual(['Sable Wren', 'Dunny', 'Arcana 13 — read it']);
    expect(main.querySelector('.sr-scene-pos')!.textContent).toBe('~30 minstep 2 of 3');
    expect(main.querySelector('.sr-enemy-stats')!.textContent).toBe('AC 13 · HP 16');
    expect(main.querySelector('.sr-aloud blockquote')!.textContent).toContain('Read this aloud.');
    expect(main.querySelector('.sr-sh-val')!.textContent).toBe('the inn');
    expect(main.querySelector('.sr-setup')!.textContent).toContain('Use the indoors map');
  });

  it('tracks enemy HP in place: damage, down at 0, saved per entry, and reset', () => {
    const main = document.createElement('main');
    const onHpHit = vi.fn();
    const onHpReset = vi.fn();
    renderScene(main, view({ onHpHit, onHpReset, hp: { 'Archer Rider (Ilsa Hask)': 9 } }));
    const box = main.querySelector<HTMLElement>('.sr-hp')!;
    expect(box.querySelector('.sr-hp-val')!.textContent).toBe('9/16');
    expect(main.querySelector('.sr-enemy-atk')!.textContent).toContain('+4 to hit');
    const input = box.querySelector<HTMLInputElement>('.sr-hp-in')!;
    input.value = '11';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(box.querySelector('.sr-hp-val b')!.textContent).toBe('0');
    expect(main.querySelector('.sr-enemy')!.classList.contains('is-down')).toBe(true);
    expect(onHpHit).toHaveBeenLastCalledWith('Archer Rider (Ilsa Hask)', '11', 9, 0, 16);
    main.querySelector<HTMLButtonElement>('.sr-hp-reset')!.click();
    expect(box.querySelector('.sr-hp-val b')!.textContent).toBe('16');
    expect(main.querySelector('.sr-enemy')!.classList.contains('is-down')).toBe(false);
    expect(onHpReset).toHaveBeenLastCalledWith({ 'Archer Rider (Ilsa Hask)': 0 });
  });

  it('starts and resets each enemy at its known HP, not full, when the plan carries damage', () => {
    const main = document.createElement('main');
    const onHpHit = vi.fn();
    const onHpReset = vi.fn();
    const hurt = parseCombatants('### Scout — Ilsa Hask\n\n- AC 13 · HP 5/16\n- **Longbow** +4 to hit, 1d8+2');
    renderScene(main, view({ onHpHit, onHpReset, combatants: hurt }));
    const box = main.querySelector<HTMLElement>('.sr-hp')!;
    expect(box.querySelector('.sr-hp-val')!.textContent).toBe('5/16');
    const input = box.querySelector<HTMLInputElement>('.sr-hp-in')!;
    input.value = '3';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(onHpHit).toHaveBeenLastCalledWith('Archer Rider (Ilsa Hask)', '3', 5, 2, 5);
    main.querySelector<HTMLButtonElement>('.sr-hp-reset')!.click();
    expect(box.querySelector('.sr-hp-val b')!.textContent).toBe('5');
    expect(onHpReset).toHaveBeenLastCalledWith({ 'Archer Rider (Ilsa Hask)': 2 });
  });

  it('logs every HP entry under the enemies, redraws the log in place, and offers undo', () => {
    const main = document.createElement('main');
    const st: HpState = { hp: {}, hpLog: [] };
    const onHpUndo = vi.fn();
    renderScene(main, view({
      hp: st.hp,
      hpLog: st.hpLog,
      onHpHit: (e, input, before, after, start) => recordHit(st, e, input, before, after, start),
      onHpReset: (before) => recordReset(st, 'Reset HP', before),
      onHpUndo,
    }));
    expect(main.querySelector('.sr-hplog summary')!.textContent).toBe('HP log (0)');
    expect(main.querySelector<HTMLButtonElement>('.sr-hp-undo-reset')!.hidden).toBe(true);
    const input = main.querySelector<HTMLInputElement>('.sr-hp-in')!;
    input.value = '4';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(main.querySelector('.sr-hplog summary')!.textContent).toBe('HP log (1)');
    expect(main.querySelector('.sr-hplog li')!.textContent).toContain('16 → 12');
    main.querySelector<HTMLButtonElement>('.sr-hp-reset')!.click();
    expect(main.querySelector('.sr-hplog summary')!.textContent).toBe('HP log (2)');
    expect(main.querySelector('.sr-hplog li')!.textContent).toContain('was 12');
    // The hit sits under the reset, so it waits until the reset is undone.
    expect(main.querySelector<HTMLButtonElement>('.sr-hplog li:last-child .sr-hplog-undo')!.disabled).toBe(true);
    const undoReset = main.querySelector<HTMLButtonElement>('.sr-hp-undo-reset')!;
    expect(undoReset.hidden).toBe(false);
    undoReset.click();
    expect(onHpUndo).toHaveBeenCalledWith(1);
  });

  it('mirrors enemy HP in the strip, where damage goes in without scrolling back to the box', () => {
    const main = document.createElement('main');
    const onHpHit = vi.fn();
    renderScene(main, view({ onHpHit }));
    expect(main.querySelector('.sr-strip')).toBeNull(); // step 2 is before the fight
    renderScene(main, view({ onHpHit, node: fight }));
    const chip = () => main.querySelector<HTMLButtonElement>('.sr-strip .sr-hpchip')!;
    expect(chip().textContent!.replace(/\s+/g, ' ').trim()).toBe('Ilsa Hask 16/16');
    chip().click();
    const quick = main.querySelector<HTMLInputElement>('.sr-strip-in')!;
    quick.value = '10';
    quick.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onHpHit).toHaveBeenLastCalledWith('Archer Rider (Ilsa Hask)', '10', 16, 6, 16);
    expect(main.querySelector('.sr-enemies .sr-hp-val b')!.textContent).toBe('6');
    expect(chip().classList.contains('is-hurt')).toBe(true);
    expect(main.querySelector('.sr-hplog summary')!.textContent).toBe('HP log (0)'); // the view's log is the runner's
    // Damage typed in the box shows on the chip too.
    const input = main.querySelector<HTMLInputElement>('.sr-enemies .sr-hp-in')!;
    input.value = '6';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(chip().classList.contains('is-down')).toBe(true);
  });

  it('drives the notes from the fight bar: rounds, arrivals, Watch items and When pills', () => {
    const fmd = [
      '- **Enemies:** Archer Rider (Ilsa Hask) · Relief Captain (Garran Vey) arrives round 2',
      '',
      '#### S1_HOLD — Hold the yard',
      '',
      '- **Combat starts:** mid-fight',
      '- **If they hurt her:**',
      '  - **If Ilsa drops to half (8 HP):** she runs.',
      '  - **Garran Vey drops:** the riders break.',
      '',
      '#### S1_RIDE — Riders',
      '',
      '- **When:** round 2',
    ].join('\n');
    const hold = n('S1_HOLD', 'combat', 'Hold the yard');
    const ride = n('S1_RIDE', 'combat', 'Riders');
    const blocks = parseCombatants('### Scout — Ilsa Hask\n\n- AC 13 · HP 16\n- **Longbow** +4 to hit, 1d8+2\n\n### Veteran — Garran Vey\n\n- AC 17 · HP 58\n- **Longsword** +5 to hit, 1d8+3');
    const main = document.createElement('main');
    const onRound = vi.fn();
    const onGo = vi.fn();
    renderScene(main, view({
      node: hold, sceneNodes: [hold, ride], visited: new Set(['S1_HOLD']), combatants: blocks, onRound, onGo,
      scene: { id: 'SC1', key: '1', title: 'Scene 1', md: fmd },
    }));
    const bar = main.querySelector<HTMLElement>('.sr-strip')!;
    expect(bar.querySelector('.sr-strip-mode')!.textContent).toBe('Fight');
    expect(main.querySelector('.sr-step[data-id="S1_HOLD"] .sr-edge')).toBeNull(); // starts at the top: nothing to mark
    // Vey waits for round 2.
    const vey = main.querySelector<HTMLElement>('.sr-enemy[data-arrives="2"]')!;
    expect(vey.querySelector('.sr-arrives')!.textContent).toBe('arrives round 2');
    expect(vey.classList.contains('is-coming')).toBe(true);
    expect(bar.querySelectorAll('.sr-hpchip.is-coming')).toHaveLength(1);
    const pill = main.querySelector('.sr-step[data-id="S1_RIDE"] .sr-when')!;
    expect(pill.classList.contains('is-ready')).toBe(false);
    bar.querySelector<HTMLButtonElement>('[data-round="1"]')!.click();
    expect(onRound).toHaveBeenLastCalledWith(2);
    expect(bar.querySelector('.sr-round output')!.textContent).toBe('2');
    expect(vey.classList.contains('is-coming')).toBe(false);
    expect(pill.classList.contains('is-ready')).toBe(true);
    const alerts = [...bar.querySelectorAll('.sr-alert')].map((a) => a.textContent);
    expect(alerts).toEqual(['Garran Vey arrives this round', 'Ready: 2 · Riders']);
    bar.querySelector<HTMLButtonElement>('.sr-alert[data-to]')!.click();
    expect(onGo).toHaveBeenCalledWith('S1_RIDE');
    // Ilsa to 8 lights her Watch item; the block's label carries no cue of its own.
    const items = () => [...main.querySelectorAll('.sr-pb-watch li')].map((li) => li.classList.contains('is-now'));
    expect(items()).toEqual([false, false]);
    const ilsa = main.querySelector<HTMLInputElement>('.sr-hp[data-entry="Archer Rider (Ilsa Hask)"] .sr-hp-in')!;
    ilsa.value = '8';
    ilsa.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(items()).toEqual([true, false]);
    expect([...bar.querySelectorAll('.sr-alert')].map((a) => a.textContent)).toContain('If Ilsa drops to half (8 HP): she runs.');
  });

  it('opens an enemy card under the damage box: stats, dice that roll, and the full block', () => {
    const main = document.createElement('main');
    renderScene(main, view({ node: fight }));
    // The picked chip outlives renders; start from none.
    main.querySelector<HTMLButtonElement>('.sr-strip .sr-hpchip.is-picked')?.click();
    expect(main.querySelector('.sr-strip-card')).toBeNull();
    main.querySelector<HTMLButtonElement>('.sr-strip .sr-hpchip')!.click();
    const card = main.querySelector<HTMLElement>('.sr-strip-card')!;
    expect(card.querySelector('.sr-strip-card-stats')!.textContent).toBe('AC 13 · HP 16');
    expect(card.querySelector('.sr-strip-card-more summary')!.textContent).toBe('Full block');
    card.querySelector<HTMLButtonElement>('.sr-strip-card-atk .sr-roll')!.click();
    expect(card.querySelector('.sr-roll-log li')!.textContent).toContain('Ilsa Hask');
    expect(main.querySelector('.sr-enemies .sr-roll-log li')).not.toBeNull(); // the Enemies box logs it too
    const clear = card.querySelector<HTMLButtonElement>('.sr-roll-clear')!;
    expect(clear.hidden).toBe(false);
    clear.click();
    expect(card.querySelector('.sr-roll-log li')).toBeNull();
    expect(main.querySelector('.sr-enemies .sr-roll-log li')).toBeNull();
    expect(clear.hidden).toBe(true);
    expect(main.querySelector<HTMLButtonElement>('.sr-enemies .sr-roll-clear')!.hidden).toBe(true);
    main.querySelector<HTMLButtonElement>('.sr-strip .sr-hpchip')!.click(); // the same chip closes it
    expect(main.querySelector('.sr-strip-card')).toBeNull();
  });

  it('gives a boss chip its phase ticks and legendary pips, and counts the crew for morale', () => {
    const fmd = [
      '- **Enemies:** Archer Rider (Ilsa Hask) · Griffon (Tithe) · Relief Captain (Garran Vey) arrives round 2',
      '',
      '#### S1_HUNT — It hunts',
      '',
      '- **Boss fight starts:** on the scream.',
      '',
      '#### S1_BREAK — They break',
      '',
      '- **When:** Vey drops, or the crew (everyone but Tithe) is down to zero.',
    ].join('\n');
    const hunt = n('S1_HUNT', 'combat', 'It hunts');
    const brk = n('S1_BREAK', 'combat', 'They break');
    const blocks = parseCombatants([
      '### Scout — Ilsa Hask', '', '- AC 13 · HP 16', '',
      '### Griffon — Tithe', '', '- AC 12 · **HP 95** · fly 80 ft',
      '- **Boss.** Legendary actions below.', '  - **Legendary actions: 2 a round,** one at a time.',
      '  - **Bloodied, at 47 HP or less: the second phase.** It lands.', '',
      '### Veteran — Garran Vey', '', '- AC 17 · HP 58',
    ].join('\n'));
    const main = document.createElement('main');
    renderScene(main, view({
      node: hunt, sceneNodes: [hunt, brk], visited: new Set(['S1_HUNT']), combatants: blocks,
      scene: { id: 'SC1', key: '1', title: 'Scene 1', md: fmd },
    }));
    const bar = main.querySelector<HTMLElement>('.sr-strip')!;
    expect(bar.classList.contains('is-boss')).toBe(true);
    const tithe = () => bar.querySelector<HTMLElement>('.sr-hpchip[data-entry="Griffon (Tithe)"]')!;
    expect(tithe().querySelector<HTMLElement>('.sr-meter-tick')!.style.left).toMatch(/^49\.4/);
    expect(tithe().querySelector('.sr-phase')).toBeNull();
    const pips = () => [...bar.querySelectorAll<HTMLButtonElement>('.sr-legend .sr-pip')].map((p) => p.classList.contains('is-spent'));
    expect(pips()).toEqual([false, false]);
    bar.querySelectorAll<HTMLButtonElement>('.sr-pip')[1].click(); // a 2-cost action spends both
    expect(pips()).toEqual([true, true]);
    bar.querySelectorAll<HTMLButtonElement>('.sr-pip')[1].click(); // give one back
    expect(pips()).toEqual([true, false]);
    bar.querySelector<HTMLButtonElement>('[data-round="1"]')!.click(); // a new round refills
    expect(pips()).toEqual([false, false]);
    const hp = (entry: string, typed: string) => {
      const input = main.querySelector<HTMLInputElement>(`.sr-hp[data-entry="${entry}"] .sr-hp-in`)!;
      input.value = typed;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    };
    hp('Griffon (Tithe)', '=40');
    expect(tithe().classList.contains('is-phase')).toBe(true);
    expect(tithe().querySelector('.sr-phase')!.textContent).toBe('Bloodied');
    // Round 2: Vey is on the field, so the crew isn't down to zero until Ilsa and Vey are.
    const pill = main.querySelector('.sr-step[data-id="S1_BREAK"] .sr-when')!;
    hp('Archer Rider (Ilsa Hask)', '=0');
    expect(pill.classList.contains('is-ready')).toBe(false);
    hp('Relief Captain (Garran Vey)', '=1');
    expect(pill.classList.contains('is-ready')).toBe(false);
    hp('Relief Captain (Garran Vey)', '=0');
    expect(pill.classList.contains('is-ready')).toBe(true);
    // A dead boss loses its pips.
    hp('Griffon (Tithe)', '=0');
    expect(bar.querySelector('.sr-legend')).toBeNull();
  });

  it('links beat ids in the notes to their steps', () => {
    const main = document.createElement('main');
    renderScene(main, view({ scene: { id: 'SC1', key: '1', title: 'Scene 1 · The Night', md: md.replace('go or stay.', 'go (`S1_FIGHT`) or stay.') } }));
    const chip = main.querySelector<HTMLElement>('.sr-pb-choice .sr-bref')!;
    expect(chip.dataset.beat).toBe('S1_FIGHT');
    expect(chip.querySelector('.sr-bref-n')!.textContent).toBe('3');
  });

  it('rolls an enemy attack into the log without opening its stat block, and keeps the log across renders', () => {
    const main = document.createElement('main');
    renderScene(main, view());
    const hit = main.querySelector<HTMLButtonElement>('.sr-enemy-atk .sr-roll[data-kind="hit"]')!;
    expect(hit.textContent).toBe('+4 to hit');
    hit.click();
    expect(main.querySelector('details.sr-enemy')!.hasAttribute('open')).toBe(false);
    const entry = main.querySelector('.sr-roll-log .sr-roll-entry')!;
    expect(entry.querySelector('.sr-roll-what')!.textContent).toBe('Archer Rider (Ilsa Hask) · Longbow · to hit');
    const total = Number(entry.querySelector('.sr-roll-total')!.textContent);
    expect(total).toBeGreaterThanOrEqual(5);
    expect(total).toBeLessThanOrEqual(24);
    renderScene(main, view());
    expect(main.querySelectorAll('.sr-roll-log .sr-roll-entry').length).toBeGreaterThanOrEqual(1);
    const clear = main.querySelector<HTMLButtonElement>('.sr-roll-clear')!;
    expect(clear.hidden).toBe(false);
    clear.click();
    expect(main.querySelectorAll('.sr-roll-log .sr-roll-entry').length).toBe(0);
    expect(clear.hidden).toBe(true);
  });

  it('opens only the current step as a prompt book, in plan order, without provenance', () => {
    const main = document.createElement('main');
    renderScene(main, view());
    const steps = [...main.querySelectorAll<HTMLElement>('.sr-step')];
    expect(steps.map((s) => s.className)).toEqual(['sr-step is-done', 'sr-step is-current', 'sr-step is-todo']);
    expect(steps[0].querySelector('.sr-step-num')!.textContent).toBe('✓');
    const body = steps[1].querySelector('.sr-step-body')!;
    expect([...body.querySelectorAll('.sr-pb')].map((b) => b.className)).toEqual(['sr-pb sr-pb-do', 'sr-pb sr-pb-intro', 'sr-pb sr-pb-choice', 'sr-pb sr-pb-you']);
    expect(body.querySelector('.sr-pb-do')!.textContent).toContain('Mara at the door');
    expect(body.querySelector('.sr-intro-name')!.textContent).toContain('Mara, sheriff');
    expect(body.querySelector('.sr-pb-choice .sr-pb-text')!.textContent).toBe('Go or stay.');
    expect(body.querySelector('.sr-pb-choice small')!.textContent).toBe('party');
    expect(body.textContent).not.toContain('2026');
    expect(body.textContent).toContain('A small choice.');
    expect(steps[2].querySelector('.sr-mark')!.textContent).toBe('⚔');
    expect(steps[1].querySelector('.sr-mark')!.textContent).toBe('◆ choice');
  });

  it('puts fork buttons under the open step and wires clicks; step rows jump', () => {
    const main = document.createElement('main');
    const v = view();
    renderScene(main, v);
    const btns = [...main.querySelectorAll<HTMLButtonElement>('.sr-step.is-current .sr-opt')];
    expect(btns.map((b) => b.querySelector('kbd')!.textContent)).toEqual(['1', '2']);
    btns[1].click();
    expect(v.onGo).toHaveBeenCalledWith('S1_OPEN');
    main.querySelector<HTMLButtonElement>('.sr-step.is-todo .sr-step-head')!.click();
    expect(v.onGo).toHaveBeenCalledWith('S1_FIGHT');
  });

  it('labels a single way on as Next, and shows the closing hook at the end', () => {
    const main = document.createElement('main');
    renderScene(main, view({ options: [{ to: 'S1_FIGHT', label: 'The fork', kind: 'edge' }] }));
    expect(main.querySelector('.sr-opt-label')!.textContent).toBe('Next — title of S1_FIGHT');
    renderScene(main, view({ options: [] }));
    expect(main.querySelector('.sr-end')!.textContent).toContain('The end.');
  });

  it('gathers the scene\'s token cues behind one toggle, numbered by step', () => {
    const main = document.createElement('main');
    const v = view();
    renderScene(main, v);
    const box = main.querySelector<HTMLDetailsElement>('.sr-tokens-box')!;
    expect(box.open).toBe(false);
    expect([...box.querySelectorAll('li')].map((l) => l.textContent!.trim())).toEqual(['2 Mara at the door.', '3 riders by the tree.']);
  });

  it('renders the recap body in place of steps', () => {
    const main = document.createElement('main');
    renderScene(main, view({ bodyHtml: '<p class="x">Recap.</p>', sceneNodes: [ask] }));
    expect(main.querySelector('.sr-card-body .x')).not.toBeNull();
    expect(main.querySelector('.sr-steps')).toBeNull();
  });
});
