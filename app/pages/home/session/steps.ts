// A scene's beats as a step list: done steps greyed with a tick, the current step
// open with its prose as a prompt book (prompt-book.ts: each block tagged for the DM,
// for the players, for the table, or to watch for), upcoming steps collapsed to one
// line. Any step row jumps to that beat.

import { escapeHtml, inline } from './markdown.js';
import type { Known } from './markdown.js';
import { mergeLabelLines } from './flow.js';
import { promptBookHtml } from './prompt-book.js';
import type { FlowNode } from './types.js';

export interface StepsView {
  nodes: FlowNode[];
  prose: Map<string, string>;
  headings: Map<string, string>; // the plan's `#### ID — title` lines
  current: string;
  visited: ReadonlySet<string>;
  known: Known;
  optionsHtml: string; // branch buttons, shown under the open step
}

// One mark per step, only for what changes how the DM runs it.
export function stepMark(n: FlowNode, prose: string): string {
  if (n.kind === 'combat') return '<span class="sr-mark" data-mark="combat" title="Combat">⚔</span>';
  if (/\bChoice \(/.test(prose) || n.kind === 'decision') return '<span class="sr-mark" data-mark="choice" title="A real choice">◆ choice</span>';
  if (n.kind === 'stake') return '<span class="sr-mark" data-mark="payoff" title="Payoff">★</span>';
  return '';
}

// A beat's body: its prose as a prompt book, else the flow chart's lines.
export function beatBodyHtml(n: FlowNode, prose: string, known: Known): string {
  if (!prose) return `<ul class="sr-md">${mergeLabelLines(n.lines).map((l) => `<li>${inline(l, known)}</li>`).join('')}</ul>`;
  return promptBookHtml(prose, known);
}

// The plan's heading for the beat, else the flow label with its wrapped lines rejoined.
export function stepTitle(n: FlowNode, headings: Map<string, string>): string {
  return headings.get(n.id) ?? mergeLabelLines([n.title, ...n.lines])[0];
}

export function stepsHtml(v: StepsView): string {
  return `<ol class="sr-steps">${v.nodes.map((n, i) => {
    const prose = v.prose.get(n.id) ?? '';
    const state = n.id === v.current ? 'current' : v.visited.has(n.id) ? 'done' : 'todo';
    const head = `
      <button type="button" class="sr-step-head" data-to="${n.id}" title="${escapeHtml(n.id)}">
        <span class="sr-step-num">${state === 'done' ? '✓' : i + 1}</span>
        <span class="sr-step-title">${inline(stepTitle(n, v.headings), v.known)}</span>
        ${stepMark(n, prose)}
      </button>`;
    return `<li class="sr-step is-${state}" data-id="${escapeHtml(n.id)}" id="step-${escapeHtml(n.id)}">${head}${
      state === 'current' ? `<div class="sr-step-body">${beatBodyHtml(n, prose, v.known)}${v.optionsHtml}</div>` : ''
    }</li>`;
  }).join('')}</ol>`;
}
