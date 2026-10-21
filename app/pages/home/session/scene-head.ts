// The top of a scene page: what the scene is doing, where, who is in it, the
// enemies as compact rows that expand to their stat blocks, and the DCs.

import { escapeHtml, inline, renderMarkdown } from './markdown.js';
import type { Known } from './markdown.js';
import { matchEnemy } from './combatants.js';
import type { StatBlock } from './combatants.js';
import type { SceneHeader } from './scene-header.js';
import { stripProvenance } from './provenance.js';

const row = (label: string, body: string, isChips = false) =>
  body ? `<div class="sr-sh-row"><span class="sr-sh-label">${label}</span><div class="sr-sh-val${isChips ? ' is-chips' : ''}">${body}</div></div>` : '';

// The compact row keeps what the DM reaches for mid-round; skills live in the full block.
export const rowStats = (stats: string) =>
  stats.split(' · ').filter((x) => /^(\*\*)?(AC|HP|Speed|CR)\b/.test(x.trim())).join(' · ') || stats;

const chips = (items: string[], known: Known) =>
  items.map((x) => `<span class="sr-sh-chip">${inline(x, known)}</span>`).join('');

function enemyHtml(entry: string, blocks: StatBlock[], known: Known): string {
  const b = matchEnemy(entry, blocks);
  if (!b) return `<div class="sr-enemy is-unmatched"><span class="sr-enemy-name">${inline(entry, known)}</span></div>`;
  return `
    <details class="sr-enemy">
      <summary>
        <span class="sr-enemy-name">${inline(entry, known)}</span>
        <span class="sr-enemy-stats">${inline(rowStats(b.stats), known)}</span>
        ${b.attack ? `<span class="sr-enemy-atk">${inline(b.attack, known)}</span>` : ''}
      </summary>
      <div class="sr-md sr-enemy-block"><div class="sr-enemy-title">${escapeHtml(b.title)}</div>${renderMarkdown(stripProvenance(b.md), known)}</div>
    </details>`;
}

export function sceneHeadHtml(h: SceneHeader, blocks: StatBlock[], known: Known): string {
  const p = (s: string) => inline(stripProvenance(s), known);
  return `
    ${h.summary ? `<p class="sr-sh-summary">${p(h.summary)}</p>` : ''}
    <div class="sr-sh-grid">
      ${row('Where', h.where ? p(h.where) : '')}
      ${row('Who’s here', h.cast ? (h.cast.includes(' · ') ? chips(h.cast.split(' · '), known) : p(h.cast)) : '', h.cast.includes(' · '))}
      ${row('DCs', h.dcs.length ? chips(h.dcs, known) : '', true)}
    </div>
    ${h.enemies.length ? `
    <div class="sr-enemies">
      <div class="sr-sh-label">Enemies</div>
      ${h.enemies.map((e) => enemyHtml(e, blocks, known)).join('')}
      ${h.tactics ? `<p class="sr-tactics">${p(h.tactics)}</p>` : ''}
    </div>` : ''}`;
}
