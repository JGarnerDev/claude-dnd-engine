// A scene's beats as a step list: done steps greyed with a tick, the current step
// open with its prose (introductions first, then private messages ready to copy;
// token cues and planning history taken out), upcoming steps collapsed to one line. Any step row jumps to that beat.

import { escapeHtml, extractCallouts, inline, renderMarkdown, stripCallouts } from './markdown.js';
import type { Known } from './markdown.js';
import { mergeLabelLines } from './flow.js';
import { stripProvenance } from './provenance.js';
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

function introsHtml(prose: string, known: Known): string {
  return extractCallouts(prose).intros.map((x) => `
    <section class="sr-intro">
      <h3 class="sr-intro-name"><span class="sr-callout-label">Introduce</span> ${inline(stripProvenance(x.name), known)}</h3>
      <div class="sr-md">${renderMarkdown(x.md, known)}</div>
    </section>`).join('');
}

// Private rolls and whispers: one box per message, a Copy button per outcome, so the
// DM sends the right version to one player without retyping it.
function privatesHtml(prose: string, known: Known): string {
  return extractCallouts(prose).privates.map((p) => `
    <section class="sr-private">
      <h3 class="sr-private-head"><span class="sr-callout-label">Private</span>${p.to ? ` → ${inline(p.to, known)}` : ''}</h3>
      ${p.when ? `<div class="sr-private-when">${inline(stripProvenance(p.when), known)}</div>` : ''}
      <ul class="sr-private-list">${p.outcomes.map((o) => `
        <li>
          ${o.label ? `<span class="sr-private-label">${inline(o.label, known)}</span>` : ''}
          <span class="sr-private-text">${escapeHtml(o.text)}</span>
          <button type="button" class="sr-copy" data-copy="${escapeHtml(o.text)}" title="Copy this message">Copy</button>
        </li>`).join('')}
      </ul>
    </section>`).join('');
}

// Choice bullets get their own class, so they stand out in the open step.
const markChoices = (html: string) => html.replace(/<li><strong>Choice \(/g, '<li class="sr-choice"><strong>Choice (');

function bodyHtml(n: FlowNode, prose: string, known: Known): string {
  if (!prose) return `<ul class="sr-md">${mergeLabelLines(n.lines).map((l) => `<li>${inline(l, known)}</li>`).join('')}</ul>`;
  return introsHtml(prose, known) + privatesHtml(prose, known) + `<div class="sr-md">${markChoices(renderMarkdown(stripProvenance(stripCallouts(prose)), known))}</div>`;
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
      <button type="button" class="sr-step-head" data-to="${n.id}">
        <span class="sr-step-num">${state === 'done' ? '✓' : i + 1}</span>
        <span class="sr-step-title">${inline(stepTitle(n, v.headings), v.known)}</span>
        ${stepMark(n, prose)}
      </button>`;
    return `<li class="sr-step is-${state}" data-id="${escapeHtml(n.id)}">${head}${
      state === 'current' ? `<div class="sr-step-body">${bodyHtml(n, prose, v.known)}${v.optionsHtml}</div>` : ''
    }</li>`;
  }).join('')}</ol>`;
}
