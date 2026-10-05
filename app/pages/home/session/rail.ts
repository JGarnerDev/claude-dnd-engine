// The map rail under the header: every card as a chip, grouped by scene, colored
// by kind. Current card ringed, visited cards filled. Click any chip to jump.

import { escapeHtml } from './markdown.js';
import type { FlowNode, Scene } from './types.js';

// Strip the act-relative prefix ("S1_") that every id in a set shares, for chip text.
export function chipText(id: string): string {
  return id.replace(/^S\d+_/, '');
}

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
        ${g.nodes.map((n) => `<button type="button" class="sr-chip${n.id === current ? ' is-current' : ''}${visited.has(n.id) ? ' is-visited' : ''}" data-kind="${n.kind}" data-id="${n.id}" title="${escapeHtml(n.id + ' — ' + n.title)}">${escapeHtml(chipText(n.id))}</button>`).join('')}
      </div>`)
    .join('');
  rail.querySelectorAll<HTMLButtonElement>('.sr-chip').forEach((b) => b.addEventListener('click', () => onJump(b.dataset.id!)));
  rail.querySelector('.sr-chip.is-current')?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
}
