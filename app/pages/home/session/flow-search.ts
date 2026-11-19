// The flow half of the side panel's search (pure): beats by id or heading, scenes by
// number or title. People, places, mysteries and plan sections are searched in Panel.tsx.

import type { RefIndex } from './ref-index.js';
import type { FlowNode, Scene } from './types.js';

export type FlowHit = { kind: 'beat'; id: string; title: string; sub: string } | { kind: 'scene'; key: string; title: string };

export interface FlowData {
  nodes: readonly FlowNode[];
  scenes: readonly Scene[];
}

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
