// What a scene's step list needs to know about its beats (pure; Steps.tsx draws it):
// where the fights run, when a beat comes due, its title, number and mark.

import { plainText } from "./markdown.js";
import { mergeLabelLines } from "./flow.js";
import { FIGHT_RE } from "./prompt-blocks.js";
import { stripProvenance } from "./provenance.js";
import type { FlowNode } from "./types.js";

// One mark per step, only for what changes how the DM runs it.
export type Mark = "combat" | "choice" | "payoff";
export function stepMarkKind(n: FlowNode, prose: string): Mark | null {
  if (n.kind === "combat") return "combat";
  if (/\bChoice \(/.test(prose) || n.kind === "decision") return "choice";
  if (n.kind === "stake") return "payoff";
  return null;
}

export type Span = readonly [number, number]; // first and last step index, inclusive
export interface Spans {
  fight: Span | null;
  boss: Span | null;
}

// Where the fights run. The plan marks them with bullets on the beats
// (`- **Combat starts:** …`, `- **Combat ends:** …`, `- **Boss fight starts:** …`);
// a start with no end runs to the last step, an end with no start from the first.
// With no markers, the fight runs from the first combat beat to the last, or over
// the whole scene when it has enemies but no combat beats.
const MARK_RE = /^\s*[-*]\s+\*\*([^*:]+?)[:.]?\*\*/gm;

export function fightSpans(
  nodes: readonly FlowNode[],
  prose: Map<string, string>,
  hasEnemies: boolean,
): Spans {
  const marks = { fight: { start: -1, end: -1 }, boss: { start: -1, end: -1 } };
  nodes.forEach((n, i) => {
    for (const m of (prose.get(n.id) ?? "").matchAll(MARK_RE)) {
      const f = FIGHT_RE.exec(m[1].trim());
      if (!f) continue;
      const k = /^boss/i.test(f[1]) ? marks.boss : marks.fight;
      if (/ends/i.test(f[2])) {
        if (k.end < 0) k.end = i;
      } else if (k.start < 0) k.start = i;
    }
  });
  const span = (k: { start: number; end: number }): Span | null =>
    k.start < 0 && k.end < 0
      ? null
      : [Math.max(0, k.start), k.end >= Math.max(0, k.start) ? k.end : nodes.length - 1];
  let fight = span(marks.fight);
  if (!fight) {
    const combat = nodes.map((n, i) => (n.kind === "combat" ? i : -1)).filter((i) => i >= 0);
    fight = combat.length
      ? [combat[0], combat[combat.length - 1]]
      : hasEnemies && nodes.length
        ? [0, nodes.length - 1]
        : null;
  }
  return { fight, boss: span(marks.boss) };
}

export const inSpan = (s: Span | null, i: number) => !!s && i >= s[0] && i <= s[1];

// A beat's `- **When:** …` line: when it comes due.
export function whenOf(prose: string): string {
  // The line and its wrapped continuation, up to the next bullet.
  const m = /^\s*[-*]\s+\*\*When:\*\*\s*(.+(?:\n[ \t]+(?![-*]\s|\d+\.\s)\S.*)*)/m.exec(
    prose.replace(/\r/g, ""),
  );
  return m
    ? plainText(stripProvenance(m[1].replace(/\s*\n\s*/g, " ")))
        .replace(/\*/g, "")
        .trim()
    : "";
}

// The plan's heading for the beat, else the flow label with its wrapped lines rejoined.
export function stepTitle(n: FlowNode, headings: Map<string, string>): string {
  return headings.get(n.id) ?? mergeLabelLines([n.title, ...n.lines])[0];
}

// A beat's position from its id (meta/flow-graphs.md -> Positions): `S35_07A_ESCAPE` -> `7A`.
// Empty for ids planned before the scheme (`S2_ESCAPE`), which number by their place instead.
const POS_ID_RE = /^S\d+_(\d{2})([A-Z]?)_[A-Z0-9_]+$/;
export function beatPosition(id: string): string {
  const m = POS_ID_RE.exec(id);
  return m ? `${Number(m[1])}${m[2]}` : "";
}
