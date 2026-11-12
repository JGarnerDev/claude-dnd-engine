// A scene's beats as a step list: done steps greyed with a tick, the current step
// open with its prose as a prompt book (prompt-book.ts: each block tagged for the DM,
// for the players, for the table, or to watch for), upcoming steps collapsed to one
// line. Any step row jumps to that beat.
//
// Steps inside a fight carry a red rail down their left edge, and a boss fight a
// second, salmon one, so the DM sees where a battle starts and ends. A beat's
// `When:` line rides on its row as a pill the scene page lights once it comes true.

import { escapeHtml, inline, plainText } from './markdown.js';
import type { Known } from './markdown.js';
import { mergeLabelLines } from './flow.js';
import { FIGHT_RE, promptBookHtml } from './prompt-book.js';
import { stripProvenance } from './provenance.js';
import type { FlowNode } from './types.js';

export type Span = readonly [number, number]; // first and last step index, inclusive
export interface Spans { fight: Span | null; boss: Span | null }

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

// Where the fights run. The plan marks them with bullets on the beats
// (`- **Combat starts:** …`, `- **Combat ends:** …`, `- **Boss fight starts:** …`);
// a start with no end runs to the last step, an end with no start from the first.
// With no markers, the fight runs from the first combat beat to the last, or over
// the whole scene when it has enemies but no combat beats.
const MARK_RE = /^\s*[-*]\s+\*\*([^*:]+?)[:.]?\*\*/gm;

export function fightSpans(nodes: readonly FlowNode[], prose: Map<string, string>, hasEnemies: boolean): Spans {
  const marks = { fight: { start: -1, end: -1 }, boss: { start: -1, end: -1 } };
  nodes.forEach((n, i) => {
    for (const m of (prose.get(n.id) ?? '').matchAll(MARK_RE)) {
      const f = FIGHT_RE.exec(m[1].trim());
      if (!f) continue;
      const k = /^boss/i.test(f[1]) ? marks.boss : marks.fight;
      if (/ends/i.test(f[2])) { if (k.end < 0) k.end = i; } else if (k.start < 0) k.start = i;
    }
  });
  const span = (k: { start: number; end: number }): Span | null => (k.start < 0 && k.end < 0 ? null
    : [Math.max(0, k.start), k.end >= Math.max(0, k.start) ? k.end : nodes.length - 1]);
  let fight = span(marks.fight);
  if (!fight) {
    const combat = nodes.map((n, i) => (n.kind === 'combat' ? i : -1)).filter((i) => i >= 0);
    fight = combat.length ? [combat[0], combat[combat.length - 1]] : hasEnemies && nodes.length ? [0, nodes.length - 1] : null;
  }
  return { fight, boss: span(marks.boss) };
}

export const inSpan = (s: Span | null, i: number) => !!s && i >= s[0] && i <= s[1];

// A beat's `- **When:** …` line: when it comes due.
export function whenOf(prose: string): string {
  // The line and its wrapped continuation, up to the next bullet.
  const m = /^\s*[-*]\s+\*\*When:\*\*\s*(.+(?:\n[ \t]+(?![-*]\s|\d+\.\s)\S.*)*)/m.exec(prose.replace(/\r/g, ''));
  return m ? plainText(stripProvenance(m[1].replace(/\s*\n\s*/g, ' '))).replace(/\*/g, '').trim() : '';
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
        <span class="sr-step-num">${state === 'done' ? '✓' : i + 1}</span>
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
