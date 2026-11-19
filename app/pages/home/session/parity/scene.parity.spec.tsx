// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import { html } from './canon.js';
import { RefContext } from '../RefChips.js';
import { buildRefIndex } from '../ref-index.js';
import { Scene, type SceneProps } from '../Scene.js';
import { renderScene, type SceneView } from '../legacy/scene.js';
import { parseCombatants } from '../combatants.js';
import { recordHit, recordReset, type HpLogEntry } from '../hp-log.js';
import type { NextOption } from '../flow.js';
import type { FlowNode, Scene as SceneData } from '../types.js';

const n = (id: string, kind = 'social', scene: string | null = 'SC5'): FlowNode => ({ id, marker: 'committed', kind, scene, title: `${id} title`, lines: ['a line'], notes: [] });
const nodes = [n('S5_A', 'combat'), n('S5_B', 'combat'), n('S5_C')];
const md = [
  '- **Summary:** The fight at the *ford*.',
  '- **Where:** [[Ashford]]',
  '- **Enemies:** Relief Captain (Garran Vey) · Wolf (Cinder) · Dragon, arrives round 2 · Ghost',
  '- **Time:** dusk',
  '',
  '> *"Hoofbeats."*',
  '',
  '- **If Vey drops:** the crew breaks.',
  '- **Watch:**',
  '  - round 2: the dragon lands.',
  '  - Cinder at 0: the howl.',
  '',
  '#### S5_A — The ford',
  '',
  '- **Combat starts:** now',
  '- **When the crew is down to two:**',
  '  - **Vey drops.** The rest run.',
  '  - Round 3 the bell rings, see `S5_C`.',
  '- **Tokens:** wolves at the ford.',
  '',
  '#### S5_B — The dragon',
  '',
  '- **When:** round 2, or Vey is down',
  '- **Boss fight starts:** the dragon',
  '- **Tokens:** dragon at H4.',
  '',
  '#### S5_C — Aftermath',
  '',
  '- **When:** Dragon at 0',
  '- Clean up in Scene 5.',
].join('\n');
const scene: SceneData = { id: 'SC5', key: '5', title: 'Scene 5 — The Ford', md };
const combatants = parseCombatants([
  '### Relief Captain', '', '- AC 15 · HP 30 · Speed 30 ft', '- **Longsword** +5 to hit, 1d8+3',
  '', '### Wolf — Cinder', '', '- AC 13 · HP 11', '- **Bite** +4 to hit, 2d4+2',
  '', '### Dragon', '', '- AC 18 · HP 100/120 · Speed 40 ft', '- **Bite** +9 to hit, 2d10+5',
  '- **Legendary Actions (3).** Tail swipe.', '- **Bloodied, 60 HP:** it flees.',
].join('\n'));
const ix = buildRefIndex(nodes, [scene], 'S5_A', []);
const titleOf = (id: string) => `${id} title`;
const noop = () => {};

interface Run { current: string; round: number; hp?: Record<string, number>; options?: NextOption[]; scene?: SceneData; body?: string }
const edge = (to: string): NextOption => ({ to, label: titleOf(to), kind: 'edge' }) as NextOption;

// The walk state both sides share; the legacy page updates in place, the React one re-renders.
interface State { hp: Record<string, number>; hpLog: HpLogEntry[]; rounds: Record<string, number> }
const fresh = (r: Run): State => ({ hp: { ...r.hp }, hpLog: [], rounds: { SC5: r.round } });

function legacy(r: Run) {
  const s = fresh(r);
  const main = document.createElement('main');
  document.body.append(main);
  const node = nodes.find((x) => x.id === r.current) ?? n(r.current, 'social', null);
  const v: SceneView = {
    node, scene: r.scene, sceneNodes: r.scene ? nodes : [node], visited: new Set(['S5_A']), position: 'step 1 of 3',
    options: r.options ?? [edge('S5_B')], titleOf, known: () => true, refs: ix, closingHook: 'Fade *out*.', combatants,
    hp: s.hp, hpLog: s.hpLog, tokensOpen: true, bodyHtml: r.body === undefined ? undefined : `<p>${r.body}</p>`,
    onGo: noop, onTokensToggle: noop,
    onHpHit: (entry, input, before, after, start) => recordHit(s, entry, input, before, after, start, 0, s.rounds.SC5),
    onHpReset: (before) => recordReset(s, 'Reset HP', before, 0),
    onHpUndo: noop, round: s.rounds.SC5, onRound: (x) => { s.rounds.SC5 = x; },
  };
  renderScene(main, v);
  return main;
}

function Harness({ r }: { r: Run }) {
  const [s, set] = useState(() => fresh(r));
  const node = nodes.find((x) => x.id === r.current) ?? n(r.current, 'social', null);
  const change = (f: (x: State) => void) => set((old) => { const x = structuredClone(old); f(x); return x; });
  const p: SceneProps = {
    node, scene: r.scene, sceneNodes: r.scene ? nodes : [node], visited: new Set(['S5_A']), position: 'step 1 of 3',
    options: r.options ?? [edge('S5_B')], titleOf, closingHook: 'Fade *out*.', combatants,
    hp: s.hp, hpLog: s.hpLog, tokensOpen: true, body: r.body === undefined ? undefined : <p>{r.body}</p>,
    onGo: noop, onTokensToggle: noop,
    onHpHit: (entry, input, before, after, start) => change((x) => recordHit(x, entry, input, before, after, start, 0, x.rounds.SC5)),
    onHpReset: (before) => change((x) => recordReset(x, 'Reset HP', before, 0)),
    onHpUndo: noop, round: s.rounds.SC5, onRound: (v) => change((x) => { x.rounds.SC5 = v; }),
  };
  return <main><RefContext.Provider value={{ ix, onBeat: noop, onScene: noop }}><Scene {...p} /></RefContext.Provider></main>;
}

const react = (r: Run) => render(<Harness r={r} />).container.querySelector('main')!;
// On a mismatch, show where the two pages part, not both pages whole.
const same = (a: Element, b: Element) => {
  // Legacy toggles classes in place, which leaves class="" behind; React leaves none.
  const bare = (el: Element) => html(el.innerHTML.split(' class=""').join(''));
  const [x, y] = [bare(a), bare(b)];
  let i = 0;
  while (i < x.length && x[i] === y[i]) i++;
  expect(y.slice(Math.max(0, i - 150), i + 150)).toBe(x.slice(Math.max(0, i - 150), i + 150));
};

describe('scene parity', () => {
  const cases: Array<[string, Run]> = [
    ['a fight at round 1', { current: 'S5_A', round: 1, scene }],
    ['round 2 with Vey down', { current: 'S5_A', round: 2, scene, hp: { 'Relief Captain (Garran Vey)': 0, 'Wolf (Cinder)': 0 } }],
    ['a boss fight in its phase', { current: 'S5_B', round: 3, scene, hp: { Dragon: 50 } }],
    ['the last step, past the fight', { current: 'S5_C', round: 1, scene, options: [] }],
    ['a fork with asides', { current: 'S5_A', round: 1, scene, options: [
      { to: 'S5_B', label: 'Chase the *dragon*', kind: 'branch' }, { to: 'S5_C', label: 'S5_C title', kind: 'branch' }, { to: 'S5_C', label: 'Ask around', kind: 'aside' },
    ] as NextOption[] }],
    ['the recap card', { current: 'RECAP', round: 1, body: 'Last time.' }],
  ];
  for (const [name, r] of cases) {
    it(name, () => {
      const out = react(r);
      same(legacy(r), out);
    });
  }

  it('the fight bar, picked, hit, pips, rounds and reset', () => {
    const r: Run = { current: 'S5_B', round: 1, scene };
    const a = legacy(r);
    const b = react(r);
    let seen = b.innerHTML;
    const both = (f: (el: Element) => void) => { f(a); act(() => f(b)); same(a, b); seen += b.innerHTML; };
    const click = (sel: string) => (el: Element) => fireEvent.click(el.querySelector(sel)!);
    const type = (sel: string, v: string) => (el: Element) => {
      const input = el.querySelector<HTMLInputElement>(sel)!;
      input.value = v;
      fireEvent.keyDown(input, { key: 'Enter' });
    };
    both(click('.sr-hpchip[data-entry="Wolf (Cinder)"]'));
    expect(b.innerHTML).toContain('sr-strip-card');
    both(type('.sr-strip-in', '11'));
    both(click('.sr-hpchip[data-entry="Dragon"]'));
    expect(b.innerHTML).toContain('sr-strip-card-boss');
    both(type('.sr-strip-in', '45'));
    both(click('.sr-pip[data-pip="1"]'));
    both(click('.sr-pip[data-pip="0"]'));
    both(click('[data-round="1"]'));
    both(click('[data-round="1"]'));
    both(click('[data-round="-1"]'));
    both(type('.sr-hp[data-entry="Relief Captain (Garran Vey)"] .sr-hp-in', '=0'));
    both(click('.sr-hpchip[data-entry="Dragon"]'));
    both(click('.sr-hp-reset'));
    for (const c of ['is-now', 'is-ready', 'is-coming', 'is-phase', 'is-spent', 'is-picked', 'sr-roll-log']) expect(seen).toContain(c);
  });
});
