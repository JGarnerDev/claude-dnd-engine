// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { html } from './canon.js';
import { Runner } from '../Runner.js';
import { renderRunner } from '../legacy/runner.js';
import { fixture } from '../fixture-data.js';

// The same walk both ways: keys, the rail, a branch button, Back, the header actions.
type Step = ['key', string] | ['click', string];
const walk: Step[] = [
  ['key', 'ArrowRight'], ['key', 'ArrowRight'], ['key', 'Backspace'], ['key', 'Enter'],
  ['click', '.sr-rail [data-id="S1_WOODS"]'], ['key', '1'], ['key', '2'], ['key', 'ArrowLeft'],
  ['click', '.sr-opt[data-to="S1_BITE"]'], ['key', '\\'], ['key', '\\'], ['key', '/'], ['key', 'Escape'],
  ['click', '[data-act="back"]'], ['click', '[data-rail="home"]'], ['click', '[data-act="restart"]'],
];

const press = (k: string) => (document.activeElement ?? document.body).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
// React leaves the controlled search box's value as an attribute; legacy marks
// <main> with the scene it drew, to tell a new scene from the same one (Scene.tsx keeps that itself).
const shot = (root: Element) => html(root.innerHTML.split(' class=""').join('')
  .replace(/(<input class="sr-search"[^>]*?) value="[^"]*"/, '$1').replace(/(<main class="sr-main") data-scene="[^"]*"/, '$1'));
const same = (x: string, y: string, step: number) => {
  let i = 0;
  while (i < x.length && x[i] === y[i]) i++;
  expect(`${step}: ${y.slice(Math.max(0, i - 150), i + 150)}`).toBe(`${step}: ${x.slice(Math.max(0, i - 150), i + 150)}`);
};

describe('runner parity', () => {
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, '', '#');
    vi.stubGlobal('confirm', () => true);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('')));
  });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); document.body.innerHTML = ''; });

  it('walks the same', () => {
    const shots: string[] = [];
    const r = render(<Runner data={fixture()} />).container;
    shots.push(shot(r));
    for (const [how, what] of walk) {
      act(() => { if (how === 'key') press(what); else fireEvent.click(r.querySelector(what)!); });
      shots.push(shot(r));
    }
    expect(new Set(shots).size).toBeGreaterThan(8); // the walk really moved
    const hash = location.hash;
    cleanup();
    localStorage.clear();
    history.replaceState(null, '', '#');

    // Last: the legacy runner's key listener never comes off.
    const l = document.createElement('div');
    document.body.append(l);
    renderRunner(l, fixture());
    same(shots[0], shot(l), 0);
    walk.forEach(([how, what], n) => {
      if (how === 'key') press(what); else l.querySelector<HTMLElement>(what)!.click();
      same(shots[n + 1], shot(l), n + 1);
    });
    expect(location.hash).toBe(hash);
  });

  it('no session shows the empty page', () => {
    const l = document.createElement('div');
    renderRunner(l, null);
    expect(shot(render(<Runner data={null} />).container)).toBe(shot(l));
  });
});
