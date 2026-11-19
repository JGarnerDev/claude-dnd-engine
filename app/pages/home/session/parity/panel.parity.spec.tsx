// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { html } from './canon.js';
import { Panel } from '../Panel.js';
import { usePanel, type PanelApi, type PanelContext } from '../usePanel.js';
import { SessionContext } from '../SessionContext.js';
import { mountPanel, type Panel as LegacyPanel } from '../legacy/panel.js';
import { peekBeat, peekScene } from '../legacy/peeks.js';
import { linkRefs } from '../legacy/refs.js';
import { buildRefIndex } from '../ref-index.js';
import { searchFlow } from '../flow-search.js';
import { makeResolver } from '../entities.js';
import { fixture } from '../fixture-data.js';
import type { SessionData } from '../types.js';

const data = (): SessionData => {
  const d = fixture();
  d.mysteries = [{ title: 'Who rang the bell?', md: 'Nella did, in `S1_FIGHT` during Scene 2.' }];
  d.established = [{ title: 'Town — Ashford', md: '- A ford-town on the [[Ashford]] creek' }];
  d.sections = [{ title: 'Recap', md: 'Read aloud.' }, ...d.sections, { title: 'Pacing', md: 'Cut to Scene 3 by the hour, after `S1_DEAL`.' }];
  d.scenes[1].md = [
    '- **Summary:** Meet [[Sable Wren]] in the *woods*.',
    '- **Where:** [[Ashford]]',
    '- **DCs:** Insight 12 · Stealth 14',
    '- **Enemies:** Wolf · Bandit',
    '- **Time:** dusk',
    '',
    '#### S1_ANSWER — The answer',
    '',
    '- **When:** she asks',
    '- She wants an answer, see `S1_DEAL` and Scene 3.',
  ].join('\n');
  return d;
};

const CURRENT = 'S1_OPEN';

function setup() {
  const d = data();
  const resolve = makeResolver(d.entities);
  const known = (n: string) => !!resolve(n);
  const refs = buildRefIndex(d.nodes, d.scenes, CURRENT, d.cards);
  const b = refs.beat(CURRENT);
  const where = b ? `step ${b.num}, ${b.short}` : 'the current card';
  const ctx: PanelContext = { onCard: [d.entities[0]], inScene: [d.entities[0], d.entities[1]] };
  const legacyGo = vi.fn();
  const reactGo = vi.fn();

  const aside = document.createElement('aside');
  document.body.append(aside);
  const lp: LegacyPanel = mountPanel(aside, d, resolve, known, {}, {
    link: (h) => linkRefs(h, refs),
    beat: (id) => peekBeat(d, refs, id, known),
    scene: (key) => peekScene(d, refs, key, known),
    where: () => where,
    searchFlow: (q) => searchFlow(d, refs, q),
    onGo: legacyGo,
  });
  lp.setContext(ctx);

  const api: { p?: PanelApi } = {};
  function Harness() {
    const p = usePanel(resolve);
    api.p = p;
    return (
      <SessionContext.Provider value={{ known, openEntity: () => {} }}>
        <input className="sr-search" value={p.query} ref={p.search} onChange={p.onSearchInput} onKeyDown={p.onSearchKey} />
        <Panel p={p} data={d} resolve={resolve} refs={refs} ctx={ctx} where={where} onGo={reactGo} />
      </SessionContext.Provider>
    );
  }
  const out = render(<Harness />).container;
  return { lp, aside, out, api: () => api.p!, legacyGo, reactGo };
}

// Head and body: the legacy panel makes its own search box, the React one leaves it to the runner.
const shown = (el: Element) => ['.sr-pn-head', '.sr-panel-body'].map((s) => html(el.querySelector(s)!.innerHTML.split(' class=""').join('')).trim()).join('|');
const same = (a: Element, b: Element) => {
  const [x, y] = [shown(a), shown(b)];
  let i = 0;
  while (i < x.length && x[i] === y[i]) i++;
  expect(y.slice(Math.max(0, i - 150), i + 150)).toBe(x.slice(Math.max(0, i - 150), i + 150));
};

describe('panel parity', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('---\nname: Sable Wren\n---\nBody about [[Ashford]] and `S1_FIGHT`.')));
  });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); document.body.innerHTML = ''; });

  it('home, items, peeks, search and Back stay the same', async () => {
    const { lp, aside, out, api } = setup();
    let seen = '';
    const check = () => { same(aside, out); seen += shown(out); };
    const click = (sel: string) => {
      aside.querySelector<HTMLElement>(sel)!.click();
      act(() => { fireEvent.click(out.querySelector(sel)!); });
      check();
    };
    const both = (f: (p: LegacyPanel) => void, g: (p: PanelApi) => void) => { f(lp); act(() => g(api())); check(); };
    const type = (q: string) => {
      const a = aside.querySelector<HTMLInputElement>('.sr-search')!;
      a.value = q;
      a.dispatchEvent(new Event('input'));
      act(() => { fireEvent.change(out.querySelector('.sr-search')!, { target: { value: q } }); });
      check();
    };
    const enter = () => {
      aside.querySelector<HTMLInputElement>('.sr-search')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      act(() => { fireEvent.keyDown(out.querySelector('.sr-search')!, { key: 'Enter' }); });
      check();
    };

    check();
    click('[data-pn="section|0"]'); // established
    click('.sr-back');
    click('[data-pn="section|2"]'); // plan, with a beat chip and a scene chip
    click('[data-beat="S1_DEAL"]');
    click('.sr-back');
    click('[data-scene="3"]');
    click('.sr-back');
    click('.sr-back');
    click('[data-pn="mystery|0"]');
    click('.sr-back');

    type('s1_');
    enter(); // the first beat
    click('.sr-back');
    type('wood');
    click('[data-scene="1b"]');
    click('[data-beat="S1_ANSWER"]'); // a step chip in the scene peek
    click('.sr-back');
    click('[data-jump]'); // Cut to Scene 1b
    type('bell');
    click('[data-pn="mystery|0"]');
    type('zzz');
    both((p) => p.escape(), (p) => p.escape());

    both((p) => p.openBeat('S1_FIGHT'), (p) => p.openBeat('S1_FIGHT'));
    click('[data-jump]');
    both((p) => p.openBeat('NOPE'), (p) => p.openBeat('NOPE'));
    both((p) => p.openScene('9'), (p) => p.openScene('9'));
    both((p) => p.open('Nobody Real'), (p) => p.openEntity('Nobody Real'));
    both((p) => p.escape(), (p) => p.escape());

    both((p) => p.open('Sable Wren', true), (p) => p.openEntity('Sable Wren', true));
    await waitFor(() => expect(out.querySelector('.sr-ent-body')!.textContent).toContain('Body about'));
    await vi.waitFor(() => expect(aside.querySelector('.sr-ent-body')!.textContent).toContain('Body about'));
    check();
    click('.sr-ent-body [data-beat="S1_FIGHT"]');
    click('.sr-back');
    both((p) => p.escape(), (p) => p.escape());
    both((p) => p.escape(), (p) => p.escape());

    for (const c of ['sr-pn-fold', 'sr-pn-note', 'sr-pn-go', 'sr-pn-steps', 'sr-pn-field', '<mark', 'sr-chiptag', 'data-layer=scheduler', 'sr-ent-head', 'No matches', 'sr-empty'])
      expect(seen).toContain(c);
  });
});
