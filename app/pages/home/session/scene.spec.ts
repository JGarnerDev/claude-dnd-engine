// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { renderScene } from './scene.js';
import type { SceneView } from './scene.js';
import { parseCombatants } from './combatants.js';
import { recordHit, recordReset } from './hp-log.js';
import type { HpState } from './hp-log.js';
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
    expect(main.querySelector('.sr-setup')!.textContent).toContain('use the indoors map');
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

  it('opens only the current step, with intro and choice, and hides tokens and provenance', () => {
    const main = document.createElement('main');
    renderScene(main, view());
    const steps = [...main.querySelectorAll<HTMLElement>('.sr-step')];
    expect(steps.map((s) => s.className)).toEqual(['sr-step is-done', 'sr-step is-current', 'sr-step is-todo']);
    expect(steps[0].querySelector('.sr-step-num')!.textContent).toBe('✓');
    const body = steps[1].querySelector('.sr-step-body')!;
    expect(body.querySelector('.sr-intro-name')!.textContent).toContain('Mara, sheriff');
    expect(body.querySelector('li.sr-choice')!.textContent).toContain('go or stay');
    expect(body.textContent).not.toContain('Mara at the door');
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
