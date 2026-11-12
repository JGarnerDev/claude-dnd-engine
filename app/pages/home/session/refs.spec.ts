// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { buildRefIndex, linkRefs, shortTitle } from './refs.js';
import type { FlowNode, Scene } from './types.js';

const n = (id: string, scene: string): FlowNode => ({ id, marker: 'committed', kind: 'social', scene, title: id, lines: [], notes: [] });
const nodes = [n('S2_HUNT', 'SC3'), n('S2_RELIEF', 'SC3'), n('S2_HOME', 'SC4'), n('S2_CELL', 'SC4')];
const scenes: Scene[] = [
  { id: 'SC3', key: '3', title: 'Scene 3 — The Waystation', md: '#### S2_HUNT — Nella takes the ridge and sets the griffon loose\n\n#### S2_RELIEF — Riders on the south road' },
  { id: 'SC4', key: '4', title: 'Scene 4 — The Man in the Cell', md: '#### S2_HOME — The casks come home: on their own cart\n\n#### S2_CELL — The cell' },
];
const ix = buildRefIndex(nodes, scenes, 'S2_RELIEF');
const dom = (html: string) => { const el = document.createElement('div'); el.innerHTML = html; return el; };

describe('linkRefs', () => {
  it('turns a backticked beat id into a chip numbered by step, here or in another scene', () => {
    const el = dom(linkRefs('<p>Then <code>S2_HUNT</code>, later <code>S2_HOME</code>, now <code>S2_RELIEF</code>.</p>', ix));
    const chips = [...el.querySelectorAll<HTMLElement>('.sr-bref')];
    expect(chips.map((c) => c.dataset.beat)).toEqual(['S2_HUNT', 'S2_HOME', 'S2_RELIEF']);
    expect(chips.map((c) => c.textContent)).toEqual(['1Nella takes the ridge and…', '4.1The casks come home', '2Riders on the south road']);
    expect(chips[2].classList.contains('is-here')).toBe(true);
  });

  it('turns "Scene N" into a scene chip, but never inside code or a link', () => {
    const el = dom(linkRefs('<p>In Scene 4, not Scene 9. <code>Scene 4</code> <a class="sr-wiki">Scene 4</a></p>', ix));
    const chips = el.querySelectorAll<HTMLElement>('.sr-bref.is-scene');
    expect(chips).toHaveLength(1);
    expect(chips[0].dataset.scene).toBe('4');
    expect(chips[0].textContent).toBe('S4The Man in the Cell');
    expect(el.textContent).toContain('not Scene 9');
  });

  it('leaves an id with no beat plain and dotted, so a typo shows', () => {
    const el = dom(linkRefs('<p><code>S2_GOODBYE</code> and <code>=10</code></p>', ix));
    expect(el.querySelector('code.sr-ref-missing')!.textContent).toBe('S2_GOODBYE');
    expect(el.querySelectorAll('code')).toHaveLength(2);
  });
});

describe('shortTitle', () => {
  it('cuts at the first break if enough is left, else at a word', () => {
    expect(shortTitle('"Up, Wallaed": Iggy flies, and Sah shows himself')).toBe('"Up, Wallaed"');
    expect(shortTitle('The rest of it: the floor, the ridge')).toBe('The rest of it');
    expect(shortTitle('Riders on the south road')).toBe('Riders on the south road');
  });
});
