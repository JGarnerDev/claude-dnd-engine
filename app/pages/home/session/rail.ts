// The map rail under the header: every step as a numbered chip, grouped by scene,
// colored by kind. Current step ringed, visited steps filled. Click any chip to jump.
// Chips carry step numbers, not ids: ids are for planning, not for the table.

import { escapeHtml } from './markdown.js';
import type { FlowNode, Scene } from './types.js';

export function renderRail(rail: HTMLElement, nodes: FlowNode[], scenes: Scene[], current: string, visited: ReadonlySet<string>, onJump: (id: string) => void): void {
  const groups: Array<{ label: string; title: string; nodes: FlowNode[] }> = scenes.map((s) => ({
    label: s.key ? s.key : s.id,
    title: s.title,
    nodes: nodes.filter((n) => n.scene === s.id),
  }));
  const loose = nodes.filter((n) => !n.scene || !scenes.some((s) => s.id === n.scene));
  if (loose.length) groups.push({ label: '·', title: 'Asides — outside the scene boxes', nodes: loose });

  rail.innerHTML = groups
    .filter((g) => g.nodes.length)
    .map((g) => `
      <div class="sr-rail-group${g.nodes.some((n) => n.id === current) ? ' is-current' : ''}" title="${escapeHtml(g.title)}">
        <span class="sr-rail-label">${escapeHtml(g.label)}</span>
        ${g.nodes.map((n, i) => `<button type="button" class="sr-chip${n.id === current ? ' is-current' : ''}${visited.has(n.id) ? ' is-visited' : ''}" data-kind="${n.kind}" data-id="${n.id}" title="${escapeHtml(n.title)}">${i + 1}</button>`).join('')}
      </div>`)
    .join('');
  rail.querySelectorAll<HTMLButtonElement>('.sr-chip').forEach((b) => b.addEventListener('click', () => onJump(b.dataset.id!)));
  rail.querySelector('.sr-chip.is-current')?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
}
