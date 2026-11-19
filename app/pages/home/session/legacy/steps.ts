// A scene's beats as a step list: done steps greyed with a tick, the current step
// open with its prose as a prompt book (prompt-book.ts: each block tagged for the DM,
// for the players, for the table, or to watch for), upcoming steps collapsed to one
// line. Any step row jumps to that beat.
//
// Steps inside a fight carry a red rail down their left edge, and a boss fight a
// second, salmon one, so the DM sees where a battle starts and ends. A beat's
// `When:` line rides on its row as a pill the scene page lights once it comes true.

import { escapeHtml, inline } from '../markdown.js';
import type { Known } from '../markdown.js';
import { mergeLabelLines } from '../flow.js';
import { promptBookHtml } from './prompt-book.js';
import { beatPosition, inSpan, stepTitle, whenOf } from '../step-info.js';
import type { Span, Spans } from '../step-info.js';
import type { FlowNode } from '../types.js';

export { beatPosition, fightSpans, inSpan, stepTitle, whenOf } from '../step-info.js';
export type { Span, Spans } from '../step-info.js';

export interface StepsView {
  nodes: FlowNode[];
  prose: Map<string, string>;
  headings: Map<string, string>; // the plan's `#### ID — title` lines
  current: string;
  visited: ReadonlySet<string>;
  known: Known;
  optionsHtml: string; // branch buttons, shown under the open step
  spans?: Spans;
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

function railsHtml(s: Spans, i: number, last: number): string {
  const rail = (kind: 'fight' | 'boss', span: Span | null) => (inSpan(span, i)
    ? `<i class="sr-r sr-r-${kind}${i === span![0] ? ' is-start' : ''}${i === span![1] && span![1] < last ? ' is-end' : ''}" title="${kind === 'boss' ? 'Boss fight' : 'Fight'}"></i>`
    : '');
  return `<span class="sr-rails" aria-hidden="true">${rail('fight', s.fight)}${rail('boss', s.boss)}</span>`;
}

function edgeTag(s: Spans, i: number, last: number): string {
  const tags: string[] = [];
  for (const [kind, span, name] of [['fight', s.fight, 'fight'], ['boss', s.boss, 'boss fight']] as const) {
    if (!span) continue;
    if (i === span[0] && (span[0] > 0 || kind === 'boss')) tags.push(`<span class="sr-edge sr-edge-${kind}">${name} starts</span>`);
    if (i === span[1] && span[1] < last) tags.push(`<span class="sr-edge sr-edge-${kind}">${name} ends</span>`);
  }
  return tags.join('');
}

export function stepsHtml(v: StepsView): string {
  const spans = v.spans ?? { fight: null, boss: null };
  const rails = !!(spans.fight || spans.boss);
  const last = v.nodes.length - 1;
  return `<ol class="sr-steps${rails ? ' has-rails' : ''}">${v.nodes.map((n, i) => {
    const prose = v.prose.get(n.id) ?? '';
    const state = n.id === v.current ? 'current' : v.visited.has(n.id) ? 'done' : 'todo';
    const when = whenOf(prose);
    const head = `
      <button type="button" class="sr-step-head" data-to="${n.id}" title="${escapeHtml(n.id)}">
        <span class="sr-step-num">${state === 'done' ? '✓' : beatPosition(n.id) || i + 1}</span>
        <span class="sr-step-title">${inline(stepTitle(n, v.headings), v.known)}</span>
        ${rails ? edgeTag(spans, i, last) : ''}
        ${when ? `<span class="sr-when" data-when="${escapeHtml(when)}" title="When: ${escapeHtml(when)}">${escapeHtml(when.length > 42 ? `${when.slice(0, 40)}…` : when)}</span>` : ''}
        ${stepMark(n, prose)}
      </button>`;
    return `<li class="sr-step is-${state}" data-id="${escapeHtml(n.id)}" id="step-${escapeHtml(n.id)}">${rails ? railsHtml(spans, i, last) : ''}${head}${
      state === 'current' ? `<div class="sr-step-body">${beatBodyHtml(n, prose, v.known)}${v.optionsHtml}</div>` : ''
    }</li>`;
  }).join('')}</ol>`;
}
