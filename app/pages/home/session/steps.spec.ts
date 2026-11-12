// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { stepMark, stepsHtml, stepTitle } from './steps.js';
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

describe('stepTitle', () => {
  it('prefers the plan heading, else rejoins a wrapped flow label', () => {
    const node = { ...n('A', 'social', ['a horse tied out', 'Next line']), title: 'Scout first: the blind,' };
    expect(stepTitle(node, new Map([['A', 'Scout the ridge']]))).toBe('Scout the ridge');
    expect(stepTitle(node, new Map())).toBe('Scout first: the blind, a horse tied out');
  });
});
