// Flow navigation (pure). Turns the node/edge lists into "where can the table go
// from this card" — the buttons under each card.
//
// Rules, in order:
// 1. Solid out-edges are the branches (labelled from the edge, else the target).
// 2. When every solid edge leaves the current scene (or there are none), the next
//    scene in plan order that the table has not visited is offered FIRST. That is
//    how a parallel scene with no arrow into it (Halsby's intro) gets played: the
//    plan says "cut away now", even though the graph joins it up later. Not when
//    an unvisited solid target sits at or before that scene: the arrow wins.
// 3. Dashed edges are asides — out of this card, or from any visited card into an
//    unvisited card of this scene (an "if bitten" payoff waiting downstream).

import type { FlowEdge, FlowNode, SessionData } from './types.js';

export type OptionKind = 'edge' | 'scene' | 'aside';

export interface NextOption {
  to: string;
  label: string;
  kind: OptionKind;
}

export interface Graph {
  byId: Map<string, FlowNode>;
  out: Map<string, FlowEdge[]>;
  sceneOrder: string[];
  sceneStart: Map<string, string>;
  start: string | null;
}

export function buildGraph(data: Pick<SessionData, 'nodes' | 'edges' | 'scenes'>): Graph {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const out = new Map<string, FlowEdge[]>();
  for (const e of data.edges) {
    if (!byId.has(e.from) || !byId.has(e.to)) continue;
    out.set(e.from, [...(out.get(e.from) ?? []), e]);
  }
  const sceneOrder = data.scenes.map((s) => s.id);
  const sceneStart = new Map<string, string>();
  for (const n of data.nodes) {
    if (n.scene && !sceneStart.has(n.scene)) sceneStart.set(n.scene, n.id);
  }
  return { byId, out, sceneOrder, sceneStart, start: data.nodes[0]?.id ?? null };
}

// Mermaid labels wrap long sentences across <br/> for diagram width. A line that
// opens lowercase (or with a dash/paren) continues the previous one, so rejoin
// those before showing them as separate bullets.
export function mergeLabelLines(lines: string[]): string[] {
  const out: string[] = [];
  for (const l of lines) {
    if (out.length && /^[a-z(—–-]/.test(l)) out[out.length - 1] += ' ' + l;
    else out.push(l);
  }
  return out;
}

export function nextOptions(g: Graph, current: string, visited: ReadonlySet<string>, sceneTitle: (id: string) => string): NextOption[] {
  const node = g.byId.get(current);
  if (!node) return [];
  const edges = g.out.get(current) ?? [];
  const solid = edges.filter((e) => !e.dashed);
  const opts: NextOption[] = solid.map((e) => ({
    to: e.to,
    label: e.label || g.byId.get(e.to)!.title,
    kind: 'edge',
  }));

  const leaves = solid.every((e) => g.byId.get(e.to)!.scene !== node.scene);
  if (leaves && node.scene) {
    const from = g.sceneOrder.indexOf(node.scene);
    const next = g.sceneOrder.slice(from + 1).find((s) => {
      const ids = [...g.byId.values()].filter((n) => n.scene === s).map((n) => n.id);
      return ids.length > 0 && !ids.some((id) => visited.has(id));
    });
    const to = next && g.sceneStart.get(next);
    // Cut only when the arrows would skip that scene. An arrow back into an
    // earlier scene (the chase's last stage after the fork fight) or into the cut
    // scene itself is the path the plan means, so the cut would leapfrog it.
    const at = (id: string) => g.sceneOrder.indexOf(g.byId.get(id)!.scene ?? '');
    const skipsIt = solid.every((e) => visited.has(e.to) || at(e.to) > g.sceneOrder.indexOf(next!));
    if (to && skipsIt && !opts.some((o) => o.to === to)) {
      opts.unshift({ to, label: `Cut to ${sceneTitle(next!)}`, kind: 'scene' });
    }
  }

  const asides = edges.filter((e) => e.dashed).map((e) => e.to);
  for (const [from, list] of g.out) {
    if (!visited.has(from) || from === current) continue;
    for (const e of list) {
      const t = g.byId.get(e.to)!;
      if (e.dashed && node.scene && t.scene === node.scene && !visited.has(t.id)) asides.push(t.id);
    }
  }
  for (const to of new Set(asides)) {
    if (opts.some((o) => o.to === to)) continue;
    const e = edges.find((x) => x.to === to);
    opts.push({ to, label: e?.label || g.byId.get(to)!.title, kind: 'aside' });
  }
  return opts;
}
