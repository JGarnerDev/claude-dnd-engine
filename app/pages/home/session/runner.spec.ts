// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { renderRunner } from './runner.js';
import { fixture } from './fixture-data.js';

const current = (root: HTMLElement) => root.querySelector<HTMLElement>('.sr-scene')!.dataset.current;
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
    d.previously = [{ name: 'Session 8 Before', number: 8, date: '', campaign: 'strahd', description: 'Before.', recap: '', cliffhanger: 'Hanging.', path: '', slides: [] }];
    renderRunner(root, d);
    expect(current(root)).toBe('PREVIOUSLY');
    expect(root.querySelector('.sr-recap-lead')!.textContent).toBe('Before.');
    key('ArrowRight');
    expect(current(root)).toBe('S1_OPEN');
  });

  it('opens the previous session’s slides from the recap card, and Esc returns to it', () => {
    const d = fixture();
    d.previously = [{ name: 'Session 8 Before', number: 8, date: '', campaign: 'homebrew', description: 'Before.', recap: '', cliffhanger: '', path: '', slides: [{ title: 'Session 8 Before', md: 'Played.' }, { title: 'Next time…', md: 'Hanging.' }] }];
    renderRunner(root, d);
    root.querySelector<HTMLButtonElement>('[data-act="slides"]')!.click();
    expect(document.querySelector('.sr-slides .sr-slide-title')!.textContent).toBe('Session 8 Before');
    key('ArrowRight');
    expect(document.querySelector('.sr-slides .sr-slide-title')!.textContent).toBe('Next time…');
    expect(current(root)).toBe('PREVIOUSLY');
    key('Escape');
    expect(document.querySelector('.sr-slides')).toBeNull();
    expect(current(root)).toBe('PREVIOUSLY');
  });

  it('a beat chip in the notes peeks in the panel without moving, and Jump here moves', () => {
    const d = fixture();
    d.scenes[1].md += ' If it turns ugly, `S1_FIGHT`.';
    renderRunner(root, d);
    root.querySelector<HTMLButtonElement>('.sr-chip[data-id="S1_WOODS"]')!.click();
    root.querySelector<HTMLButtonElement>('.sr-main .sr-bref[data-beat="S1_FIGHT"]')!.click();
    expect(current(root)).toBe('S1_WOODS');
    expect(root.querySelector('.sr-panel .sr-pn-crumb')!.textContent).toBe('S1_FIGHT');
    root.querySelector<HTMLButtonElement>('.sr-panel [data-jump="S1_FIGHT"]')!.click();
    expect(current(root)).toBe('S1_FIGHT');
  });

  it('searches from the header, and \\ docks or hides the panel', () => {
    renderRunner(root, fixture());
    const body = root.querySelector<HTMLElement>('.sr-body')!;
    const docked = body.classList.contains('is-docked');
    key('\\');
    expect(body.classList.contains('is-docked')).toBe(!docked);
    key('\\');
    expect(body.classList.contains('is-docked')).toBe(docked);
    key('/');
    const input = root.querySelector<HTMLInputElement>('.sr-header .sr-search')!;
    expect(document.activeElement).toBe(input);
    input.value = 'ash';
    input.dispatchEvent(new Event('input'));
    expect(root.querySelector('.sr-panel .sr-ent-name')!.textContent).toBe('Ashford');
  });

  it('jumps from the rail, and wikilinks in the scene open the panel', () => {
    renderRunner(root, fixture());
    root.querySelector<HTMLButtonElement>('.sr-chip[data-id="S1_WOODS"]')!.click();
    expect(current(root)).toBe('S1_WOODS');
    root.querySelector<HTMLElement>('.sr-scene a.sr-wiki[data-entity="Ashford"]')!.click();
    expect(root.querySelector('.sr-ent-head h2')!.textContent).toBe('Ashford');
  });
});
