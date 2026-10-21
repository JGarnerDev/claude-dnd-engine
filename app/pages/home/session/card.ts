// The main column: scene bar, the current card, its branch buttons, and the
// scene's full written prose underneath.

import { extractCallouts, inline, renderMarkdown, escapeHtml, splitNodeSections, splitSections } from './markdown.js';
import { chipText } from './rail.js';
import type { Known } from './markdown.js';
import { mergeLabelLines } from './flow.js';
import type { NextOption } from './flow.js';
import type { FlowNode, Scene } from './types.js';

export const KIND_LABEL: Record<string, string> = {
  combat: 'Combat',
  social: 'Scene',
  decision: 'Fork',
  stake: 'Payoff',
  seed: 'Thread',
  fail: 'Setback',
  open: 'Undecided',
  recap: 'Recap',
};

export interface CardView {
  node: FlowNode;
  scene: Scene | undefined;
  sceneIndex: string; // "card 3 of 9"
  sceneNodes: FlowNode[]; // the scene's cards in flow order
  options: NextOption[];
  titleOf: (id: string) => string;
  known: Known;
  closingHook: string;
  notesOpen: boolean;
  bodyHtml?: string; // replaces the label lines and plan notes (the recap card)
  onGo: (id: string) => void;
  onNotesToggle: (open: boolean) => void;
}

export function renderCard(main: HTMLElement, v: CardView): void {
  const { node } = v;
  const branches = v.options.filter((o) => o.kind !== 'aside');
  const asides = v.options.filter((o) => o.kind === 'aside');
  const optBtn = (o: NextOption, i: number) => `
    <button type="button" class="sr-opt${i === 0 && o.kind !== 'aside' ? ' is-primary' : ''}" data-kind="${o.kind}" data-to="${o.to}">
      <kbd>${i + 1}</kbd><span class="sr-opt-label">${inline(o.label)}</span>
      <span class="sr-opt-to">${escapeHtml(o.to)}${o.label === v.titleOf(o.to) ? '' : ` · ${inline(v.titleOf(o.to))}`}</span>
    </button>`;

  main.innerHTML = `
    <div class="sr-scenebar">
      <span class="sr-scenebar-title">${escapeHtml(v.scene?.title ?? 'Aside — outside the scene boxes')}</span>
      <span class="sr-scenebar-pos">${escapeHtml(v.sceneIndex)}</span>
    </div>
    <article class="sr-card" data-kind="${node.kind}">
      <div class="sr-card-meta">
        <span class="sr-kind">${KIND_LABEL[node.kind] ?? node.kind}</span>
        <code class="sr-id">${escapeHtml(node.id)}</code>
        ${node.marker && node.marker !== 'committed' ? `<span class="sr-marker">${node.marker}</span>` : ''}
      </div>
      <h1 class="sr-card-title">${inline(node.title, v.known)}</h1>
      ${v.bodyHtml !== undefined ? `<div class="sr-card-body">${v.bodyHtml}</div>` : `
      <ul class="sr-card-lines">${mergeLabelLines(node.lines).map((l) => `<li>${inline(l, v.known)}</li>`).join('')}</ul>
      ${node.notes.map((n) => `<p class="sr-note">${inline(n, v.known)}</p>`).join('')}
      ${calloutsHtml(v)}`}
      <div class="sr-options">
        ${branches.length ? branches.map(optBtn).join('') : `<div class="sr-end"><strong>End of the plan.</strong> ${inline(v.closingHook, v.known)}</div>`}
      </div>
      ${asides.length ? `<div class="sr-asides"><span class="sr-asides-label">Asides</span>${asides.map((o, i) => optBtn(o, branches.length + i)).join('')}</div>` : ''}
    </article>
    ${v.scene?.md ? `
    <details class="sr-scenenotes"${v.notesOpen ? ' open' : ''}>
      <summary>Scene notes — the written plan</summary>
      ${renderSceneGroups(v)}
    </details>` : ''}`;

  main.querySelectorAll<HTMLButtonElement>('.sr-opt, .sr-gn-go').forEach((b) => b.addEventListener('click', () => v.onGo(b.dataset.to!)));
  const details = main.querySelector<HTMLDetailsElement>('.sr-scenenotes');
  details?.addEventListener('toggle', (e) => { if (e.target === details) v.onNotesToggle(details.open); });
  main.querySelectorAll<HTMLDetailsElement>('.sr-group-notes').forEach((g) => g.addEventListener('toggle', () => {
    if (g.open) openGroups.add(g.dataset.group!);
    else openGroups.delete(g.dataset.group!);
  }));
  main.scrollTop = 0;
}

// Groups the DM has expanded, by node id (or setup/label key). Kept for the
// page's lifetime, so an open group stays open as the DM moves card to card.
const openGroups = new Set<string>();

function group(key: string, summary: string, body: string, cls = ''): string {
  return `
      <details class="sr-group-notes${cls}" data-group="${escapeHtml(key)}"${openGroups.has(key) ? ' open' : ''}>
        <summary>${summary}</summary>
        <div class="sr-md">${body}</div>
      </details>`;
}

// Scene prose filed under `#### S1_ID` headings renders as one dropdown per flow
// node, in flow order, all collapsed until the DM opens one. Prose without node
// headings falls back to dropdowns per bold label ("Beats", "The fork").
function renderSceneGroups(v: CardView): string {
  const md = v.scene!.md;
  const { setup, nodes } = splitNodeSections(md);
  if (!nodes.size) {
    const groups = splitSections(md);
    if (groups.length === 1 && groups[0].title === 'Setup') return `<div class="sr-md">${renderMarkdown(md, v.known)}</div>`;
    return groups.map((g) => group(g.title, inline(g.title, v.known), renderMarkdown(g.md, v.known))).join('');
  }
  const ordered = [...v.sceneNodes];
  for (const id of nodes.keys()) if (!ordered.some((n) => n.id === id)) ordered.push({ id, title: v.titleOf(id) } as FlowNode);
  return [
    setup ? group(`setup:${v.scene!.id}`, 'Setup — trigger, place, who is here', renderMarkdown(setup, v.known)) : '',
    ...ordered.map((n, i) => {
      const current = n.id === v.node.id;
      const prose = nodes.get(n.id);
      const body = (current ? '' : `<button type="button" class="sr-gn-go" data-to="${n.id}">Go to this card →</button>`)
        + (prose ? renderMarkdown(prose, v.known)
          : `<ul class="sr-gn-flow">${mergeLabelLines(n.lines ?? []).map((l) => `<li>${inline(l, v.known)}</li>`).join('')}</ul>`);
      const summary = `<span class="sr-gn-num">${i + 1}</span>`
        + (n.kind ? `<span class="sr-gn-kind" data-kind="${n.kind}">${KIND_LABEL[n.kind] ?? n.kind}</span>` : '')
        + `<code class="sr-gn-id">${escapeHtml(chipText(n.id))}</code> <span class="sr-gn-title">${inline(n.title, v.known)}</span>`;
      return group(n.id, summary, body, current ? ' is-current' : '');
    }),
  ].join('');
}

// Token cues and introductions from the current node's prose (`/session` Phase 6),
// lifted onto the card so the DM reads them at the moment they're needed.
function calloutsHtml(v: CardView): string {
  const prose = v.scene?.md ? splitNodeSections(v.scene.md).nodes.get(v.node.id) : undefined;
  if (!prose) return '';
  const { intros, tokens } = extractCallouts(prose);
  return [
    ...tokens.map((t) => `<p class="sr-tokens"><span class="sr-callout-label">Tokens</span> ${inline(t, v.known)}</p>`),
    ...intros.map((x) => `
      <section class="sr-intro">
        <h2 class="sr-intro-name"><span class="sr-callout-label">Introduce</span> ${inline(x.name, v.known)}</h2>
        <div class="sr-md">${renderMarkdown(x.md, v.known)}</div>
      </section>`),
  ].join('');
}
