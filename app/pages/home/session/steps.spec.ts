// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { fightSpans, stepMark, stepsHtml, stepTitle, whenOf } from './steps.js';
import type { FlowNode } from './types.js';

const n = (id: string, kind = 'social', lines: string[] = []): FlowNode => ({ id, marker: 'committed', kind, scene: 'SC1', title: id, lines, notes: [] });

describe('stepMark', () => {
  it('marks combat, real choices and payoffs, and nothing else', () => {
    expect(stepMark(n('A', 'combat'), '')).toContain('⚔');
    expect(stepMark(n('A'), '- **Choice (Dip):** keep it')).toContain('choice');
    expect(stepMark(n('A', 'decision'), '')).toContain('choice');
    expect(stepMark(n('A', 'stake'), '')).toContain('★');
    expect(stepMark(n('A', 'seed'), '')).toBe('');
  });
});

describe('stepsHtml', () => {
  it('falls back on the flow lines when a step has no prose, and opens only the current step', () => {
    const el = document.createElement('div');
    el.innerHTML = stepsHtml({
      nodes: [n('A'), n('B', 'social', ['a line', 'continued here'])],
      prose: new Map(),
      headings: new Map(),
      current: 'B',
      visited: new Set(['B']),
      known: () => true,
      optionsHtml: '<div class="opts"></div>',
    });
    expect(el.querySelectorAll('.sr-step-body')).toHaveLength(1);
    expect(el.querySelector('.sr-step.is-current li')!.textContent).toBe('a line continued here');
    expect(el.querySelector('.sr-step.is-current .opts')).not.toBeNull();
    expect(el.querySelector('.sr-step.is-todo .sr-step-num')!.textContent).toBe('1');
  });

  it('shows a private message in its own block with a Copy button per outcome', () => {
    const el = document.createElement('div');
    el.innerHTML = stepsHtml({
      nodes: [n('A')],
      prose: new Map([['A', '- **Private (Dip):** Insight, in secret\n  - **15+:** It is "real" & hollow.\n- The rest of the beat.']]),
      headings: new Map(),
      current: 'A',
      visited: new Set(['A']),
      known: () => true,
      optionsHtml: '',
    });
    const box = el.querySelector('.sr-pb-private')!;
    expect(box.querySelector('.sr-pb-gut small')!.textContent).toBe('→ Dip');
    expect(box.querySelector('.sr-private-when')!.textContent).toBe('Insight, in secret');
    expect(box.querySelector<HTMLButtonElement>('.sr-copy')!.dataset.copy).toBe('It is "real" & hollow.');
    expect(el.querySelector('.sr-pb-you')!.textContent).toBe('YouThe rest of the beat.');
  });
});

describe('fightSpans', () => {
  const nodes = [n('A'), n('B', 'combat'), n('C', 'decision'), n('D', 'combat'), n('E')];

  it('runs the fight from the first combat beat to the last when the plan marks nothing', () => {
    expect(fightSpans(nodes, new Map(), true)).toEqual({ fight: [1, 3], boss: null });
    expect(fightSpans([n('A'), n('B')], new Map(), true).fight).toEqual([0, 1]);
    expect(fightSpans([n('A'), n('B')], new Map(), false).fight).toBeNull();
  });

  it('follows the plan\'s markers, and a start with no end runs to the last step', () => {
    const prose = new Map([
      ['A', '- **Combat starts:** mid-fight'],
      ['C', '- **Boss fight starts:** on the scream'],
      ['D', '- **Boss fight ends.**\n- **Combat ends:** the rout'],
    ]);
    expect(fightSpans(nodes, prose, true)).toEqual({ fight: [0, 3], boss: [2, 3] });
    expect(fightSpans(nodes, new Map([['B', '- **Combat starts:** now']]), true).fight).toEqual([1, 4]);
  });

  it('draws the rails and tags where a fight starts and ends, with each step\'s When pill', () => {
    const el = document.createElement('div');
    el.innerHTML = stepsHtml({
      nodes,
      prose: new Map([['C', '- **When:** round 3, after the riders'], ['D', '- **Boss fight starts:** x']]),
      headings: new Map(),
      current: 'A',
      visited: new Set(['A']),
      known: () => true,
      optionsHtml: '',
      spans: { fight: [1, 3], boss: [3, 4] },
    });
    expect(el.querySelector('.sr-steps')!.classList.contains('has-rails')).toBe(true);
    const step = (id: string) => el.querySelector(`.sr-step[data-id="${id}"]`)!;
    expect(step('A').querySelector('.sr-r')).toBeNull();
    expect(step('B').querySelector('.sr-r-fight')!.classList.contains('is-start')).toBe(true);
    expect(step('B').querySelector('.sr-edge')!.textContent).toBe('fight starts');
    expect(step('D').querySelector('.sr-r-fight')!.classList.contains('is-end')).toBe(true);
    expect([...step('D').querySelectorAll('.sr-edge')].map((e) => e.textContent)).toEqual(['fight ends', 'boss fight starts']);
    expect(step('E').querySelector('.sr-r-boss')!.classList.contains('is-end')).toBe(false); // runs off the end
    expect(step('C').querySelector<HTMLElement>('.sr-when')!.dataset.when).toBe('round 3, after the riders');
    expect(whenOf('- **When:** after the rout, or once Nella\n  drops to half (24 HP). (Jeff, 2026-11-12)\n  - **Not this.**')).toBe('after the rout, or once Nella drops to half (24 HP).');
  });
});

describe('stepTitle', () => {
  it('prefers the plan heading, else rejoins a wrapped flow label', () => {
    const node = { ...n('A', 'social', ['a horse tied out', 'Next line']), title: 'Scout first: the blind,' };
    expect(stepTitle(node, new Map([['A', 'Scout the ridge']]))).toBe('Scout the ridge');
    expect(stepTitle(node, new Map())).toBe('Scout first: the blind, a horse tied out');
  });
});
