// What the side panel shows for a beat or a scene opened from a link or a search,
// and the flow half of search (pure). A beat peek is its prompt book; a scene peek
// is its header (summary, where, DCs, enemies, time) and its steps as beat chips.

import { escapeHtml, inline, splitNodeSections } from './markdown.js';
import type { Known } from './markdown.js';
import { parseSceneHeader } from './scene-header.js';
import { stripProvenance } from './provenance.js';
import { beatBodyHtml } from './steps.js';
import { beatChip } from './refs.js';
import type { RefIndex } from './refs.js';
import type { FlowHit, PeekBeat, PeekScene } from './panel.js';
import type { FlowNode, Scene } from './types.js';

export interface FlowData {
  nodes: readonly FlowNode[];
  scenes: readonly Scene[];
}

export function peekBeat(d: FlowData, refs: RefIndex, id: string, known: Known): PeekBeat | null {
  const n = d.nodes.find((x) => x.id === id);
  const r = refs.beat(id);
  if (!n || !r) return null;
  const scene = d.scenes.find((s) => s.id === n.scene);
  const prose = splitNodeSections(scene?.md ?? '').nodes.get(id) ?? '';
  return { id, title: r.title, num: r.num, html: beatBodyHtml(n, prose, known), here: r.here };
}

export function peekScene(d: FlowData, refs: RefIndex, key: string, known: Known): PeekScene | null {
  const s = refs.scene(key);
  const scene = d.scenes.find((x) => x.id === s?.id);
  if (!s || !scene) return null;
  const nodes = d.nodes.filter((n) => n.scene === scene.id);
  const h = parseSceneHeader(splitNodeSections(scene.md).setup, scene.md);
  const p = (x: string) => inline(stripProvenance(x), known);
  const field = (label: string, html: string) => (html ? `<div class="sr-pn-field"><span class="sr-sh-label">${label}</span><span>${html}</span></div>` : '');
  const html = `
    ${h.summary ? `<p class="sr-pn-summary">${p(h.summary)}</p>` : ''}
    ${field('Where', h.where ? p(h.where) : '')}
    ${field('DCs', h.dcs.map((x) => `<span class="sr-sh-chip">${p(x)}</span>`).join(' '))}
    ${field('Enemies', h.enemies.length ? h.enemies.map(p).join(' · ') : '')}
    ${field('Time', h.time ? escapeHtml(h.time) : '')}
    <ol class="sr-pn-steps">${nodes.map((n) => { const b = refs.beat(n.id); return b ? `<li>${beatChip(b)} ${escapeHtml(b.title)}</li>` : ''; }).join('')}</ol>`;
  return { key: s.key, title: s.title, html, here: s.here, first: nodes[0]?.id ?? '' };
}

// Beats by id or heading, scenes by number or title.
export function searchFlow(d: FlowData, refs: RefIndex, q: string): FlowHit[] {
  const ql = q.trim().toLowerCase();
  if (!ql) return [];
  const scenes: FlowHit[] = d.scenes.flatMap((s) => {
    const r = refs.scene(s.key);
    return r && (`scene ${s.key}`.startsWith(ql) || r.title.toLowerCase().includes(ql)) ? [{ kind: 'scene' as const, key: s.key, title: r.title }] : [];
  });
  const beats: FlowHit[] = d.nodes.flatMap((n) => {
    const r = refs.beat(n.id);
    if (!r || !(n.id.toLowerCase().includes(ql) || r.title.toLowerCase().includes(ql))) return [];
    const where = /\./.test(r.num) ? `Scene ${r.num.replace('.', ', step ')}` : `step ${r.num}`;
    return [{ kind: 'beat' as const, id: n.id, title: r.title, sub: where }];
  });
  return [...scenes, ...beats].slice(0, 20);
}
