// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { renderRunner } from './runner.js';
import { fixture } from './fixture-data.js';

const current = (root: HTMLElement) => root.querySelector('.sr-id')!.textContent;
const key = (k: string) => document.dispatchEvent(new KeyboardEvent('keydown', { key: k }));

describe('renderRunner', () => {
  let root: HTMLElement;
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, '', location.pathname); // drop the #card hash a prior test left
    document.body.innerHTML = '';
    root = document.createElement('div');
    document.body.append(root);
  });

  it('shows the empty page without data', () => {
    renderRunner(root, null);
    expect(root.querySelector('.sr-emptypage h1')!.textContent).toBe('No session to run');
  });

  it('walks branches by click and key, steps back, and persists the path', () => {
    renderRunner(root, fixture());
    expect(current(root)).toBe('S1_OPEN');
    root.querySelector<HTMLButtonElement>('.sr-opt')!.click();
    expect(current(root)).toBe('S1_REST');
    key('ArrowRight'); // primary = cut to the parallel scene
    expect(current(root)).toBe('S1_WOODS');
    key('ArrowLeft');
    expect(current(root)).toBe('S1_REST');
    key('2'); // second option = the edge straight to the fight
    expect(current(root)).toBe('S1_FIGHT');

    const again = document.createElement('div');
    renderRunner(again, fixture());
    expect(current(again)).toBe('S1_FIGHT');
  });

  it('opens on the recap card when historian has a previous session', () => {
    const d = fixture();
    d.previously = [{ name: 'Session 8 Before', number: 8, date: '', campaign: 'strahd', description: 'Before.', recap: '', cliffhanger: 'Hanging.', path: '' }];
    renderRunner(root, d);
    expect(current(root)).toBe('PREVIOUSLY');
    expect(root.querySelector('.sr-recap-lead')!.textContent).toBe('Before.');
    key('ArrowRight');
    expect(current(root)).toBe('S1_OPEN');
  });

  it('jumps from the rail, and wikilinks in scene notes open the panel', () => {
    renderRunner(root, fixture());
    root.querySelector<HTMLButtonElement>('.sr-chip[data-id="S1_WOODS"]')!.click();
    expect(current(root)).toBe('S1_WOODS');
    root.querySelector<HTMLElement>('.sr-scenenotes a.sr-wiki[data-entity="Ashford"]')!.click();
    expect(root.querySelector('.sr-ent-head h2')!.textContent).toBe('Ashford');
  });
});
