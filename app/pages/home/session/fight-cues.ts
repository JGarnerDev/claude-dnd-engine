// What the fight has made true, worked out from the scene's own words (pure). The
// trackers (cues.ts) read conditions out of plain text; this walks the same
// markdown tokens the page renders, so a Watch block, each of its items and each
// step's `When:` pill light from data, and the fight bar lists what lit:
//
//   arrivals first ("Vey arrives this round"), then Watch blocks and items, then
//   steps not yet run whose `When:` came true ("Ready: 4 · Riders on the road").
//
// A Watch block with items lights from its label, each item from its lead or its
// whole text; a block without items lights from its label and text together. A
// step's own `When` block lights but stays out of the list: its pill already says so.

import { anyMet, enemyNames, parseConds, type Cond, type FightNow } from './cues.js';
import { parseInline, parseMarkdown, type Block, type Inline, type ListItem } from './markdown-tokens.js';
import { plainText } from './markdown.js';
import { promptBlocks } from './prompt-blocks.js';
import { stepTitle, whenOf } from './step-info.js';
import type { FlowNode } from './types.js';

// Whether a piece of plan text has come true now.
export type Lit = (text: string) => boolean;

export function litTest(entries: readonly string[], now: FightNow): Lit {
  const names = enemyNames(entries);
  const memo = new Map<string, Cond[]>();
  return (text) => {
    if (!memo.has(text)) memo.set(text, parseConds(text, names));
    return anyMet(memo.get(text)!, now);
  };
}

// The text a reader sees, as the page's textContent would give it.
export const inlineText = (c: readonly Inline[]): string => c.map((n) =>
  n.t === 'text' || n.t === 'code' ? n.s : n.t === 'wiki' ? n.label || n.name : inlineText(n.c)).join('');

const itemText = (it: ListItem): string => inlineText(it.c) + it.sub.map(itemText).join('');

const blockText = (b: Block): string => (b.t === 'pre' ? b.s
  : b.t === 'quote' ? b.c.map(blockText).join('\n')
  : b.t === 'list' ? b.items.map(itemText).join('')
  : inlineText(b.c));

// Every list item at any depth, in page order.
export function allItems(blocks: readonly Block[]): ListItem[] {
  const out: ListItem[] = [];
  const walk = (items: readonly ListItem[]) => items.forEach((it) => { out.push(it); walk(it.sub); });
  for (const b of blocks) {
    if (b.t === 'list') walk(b.items);
    if (b.t === 'quote') out.push(...allItems(b.c));
  }
  return out;
}

const lead = (it: ListItem): string => {
  const f = it.c[0];
  return !f ? itemText(it) : f.t === 'text' || f.t === 'code' ? f.s : f.t === 'wiki' ? f.label || f.name : inlineText(f.c);
};

export const itemLit = (it: ListItem, lit: Lit) => lit(lead(it)) || lit(itemText(it));

const clip = (s: string, n = 90) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export interface WatchCue { lit: boolean; alerts: string[] }

export function watchCue(label: string, md: string, lit: Lit): WatchCue {
  const blocks = parseMarkdown(md);
  const items = allItems(blocks);
  const labelText = inlineText(parseInline(label));
  const text = blocks.map(blockText).join('\n');
  const on = lit(items.length ? labelText : `${labelText} ${text}`);
  const alerts: string[] = [];
  if (on && labelText !== 'When') alerts.push(clip(labelText || text.trim()));
  if (!on) for (const it of items) if (itemLit(it, lit)) alerts.push(clip(itemText(it).trim()));
  return { lit: on, alerts };
}

export type Alert = { kind: 'now'; text: string } | { kind: 'ready'; to: string; text: string };

export interface CueInput {
  entries: readonly string[]; // the scene's enemies
  arrivals: Readonly<Record<string, number>>;
  round: number;
  lit: Lit;
  proses: readonly string[]; // every prompt book on the page: the setup notes, the open step
  steps: readonly FlowNode[];
  prose: Map<string, string>;
  headings: Map<string, string>;
  current: string;
  visited: ReadonlySet<string>;
  num: (n: FlowNode, i: number) => string; // the step number its row shows
}

const shortName = (entry: string) => plainText(/\(([^)]+)\)\s*$/.exec(entry)?.[1] ?? entry);

export function fightAlerts(v: CueInput): Alert[] {
  const out: Alert[] = [];
  const arriving = v.entries.filter((e) => v.arrivals[e] && v.arrivals[e] === v.round).map(shortName);
  if (arriving.length) out.push({ kind: 'now', text: `${arriving.join(', ')} ${arriving.length > 1 ? 'arrive' : 'arrives'} this round` });
  for (const md of v.proses) {
    for (const b of promptBlocks(md)) {
      if (b.voice === 'watch') out.push(...watchCue(b.label, b.md, v.lit).alerts.map((text) => ({ kind: 'now' as const, text })));
    }
  }
  v.steps.forEach((n, i) => {
    const when = whenOf(v.prose.get(n.id) ?? '');
    if (!when || n.id === v.current || v.visited.has(n.id) || !v.lit(when)) return;
    out.push({ kind: 'ready', to: n.id, text: `Ready: ${v.num(n, i)} · ${clip(inlineText(parseInline(stepTitle(n, v.headings))), 60)}` });
  });
  return out.slice(0, 5);
}
