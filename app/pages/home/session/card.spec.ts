// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { renderCard } from './card.js';
import type { CardView } from './card.js';
import type { FlowNode } from './types.js';

const node: FlowNode = {
  id: 'S1_FORK', marker: 'committed', kind: 'decision', scene: 'SC3', title: 'Pressure, not a lock',
  lines: ['Two bandits walk the cask', 'and the big one drags Sable'], notes: ['`S1_FORK` is the design.'],
};

function view(over: Partial<CardView> = {}): CardView {
  return {
    node,
    scene: { id: 'SC3', key: '3', title: 'Scene 3 · The New Wing', md: '> Read aloud.' },
    sceneIndex: 'card 2 of 9',
    sceneNodes: [],
    options: [
      { to: 'S1_CASKS', label: 'chase the cask', kind: 'edge' },
      { to: 'S1_SABLE', label: 'save Sable', kind: 'edge' },
      { to: 'S1_NELLA', label: 'Nella glimpsed', kind: 'aside' },
    ],
    titleOf: (id) => `title of ${id}`,
    known: () => true,
    closingHook: 'The stone is dead.',
    notesOpen: true,
    onGo: vi.fn(),
    onNotesToggle: vi.fn(),
    ...over,
  };
}

describe('renderCard', () => {
  it('shows the card, merged lines, plan notes and scene prose', () => {
    const main = document.createElement('main');
    renderCard(main, view());
    expect(main.querySelector('.sr-card')!.getAttribute('data-kind')).toBe('decision');
    expect(main.querySelector('.sr-kind')!.textContent).toBe('Fork');
    expect(main.querySelectorAll('.sr-card-lines li')).toHaveLength(1);
    expect(main.querySelector('.sr-note code')!.textContent).toBe('S1_FORK');
    expect(main.querySelector('.sr-scenenotes blockquote')).not.toBeNull();
    expect(main.querySelector('.sr-scenebar-pos')!.textContent).toBe('card 2 of 9');
  });

  it('numbers branches then asides, marks the first branch primary, and wires clicks', () => {
    const main = document.createElement('main');
    const v = view();
    renderCard(main, v);
    const btns = [...main.querySelectorAll<HTMLButtonElement>('.sr-opt')];
    expect(btns.map((b) => b.querySelector('kbd')!.textContent)).toEqual(['1', '2', '3']);
    expect(btns[0].classList.contains('is-primary')).toBe(true);
    expect(btns[2].closest('.sr-asides')).not.toBeNull();
    btns[1].click();
    expect(v.onGo).toHaveBeenCalledWith('S1_SABLE');
  });

  it('shows the closing hook when no branch remains', () => {
    const main = document.createElement('main');
    renderCard(main, view({ options: [] }));
    expect(main.querySelector('.sr-end')!.textContent).toContain('The stone is dead.');
  });
});

describe('renderCard scene notes by node', () => {
  it('shows one dropdown per scene node in flow order, all collapsed', () => {
    const main = document.createElement('main');
    const ask: FlowNode = { ...node, id: 'S1_ASK', kind: 'social', title: 'The ask', lines: ['save her'], notes: [] };
    const v = view({
      node: ask,
      sceneNodes: [{ ...node, id: 'S1_WOODS', kind: 'social', title: 'The woods', lines: ['a path'], notes: [] }, ask],
      scene: { id: 'SC1', key: '1', title: 'Scene 1', md: 'Setup text.\n\n#### S1_ASK — ask\n\nGo **now**.' },
    });
    renderCard(main, v);
    const groups = [...main.querySelectorAll<HTMLDetailsElement>('.sr-group-notes')];
    expect(groups.map((g) => g.dataset.group)).toEqual(['setup:SC1', 'S1_WOODS', 'S1_ASK']);
    expect(groups.map((g) => g.open)).toEqual([false, false, false]);
    expect(groups[1].querySelector('.sr-gn-flow li')!.textContent).toBe('a path');
    expect(groups[2].querySelector('strong')!.textContent).toBe('now');
    groups[1].querySelector<HTMLButtonElement>('.sr-gn-go')!.click();
    expect(v.onGo).toHaveBeenCalledWith('S1_WOODS');
  });
});
