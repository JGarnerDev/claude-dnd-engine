// Entity lookup (pure): resolve a [[link]] to an entity, find entities a card's
// plain text mentions, and rank a search query.
//
// Resolution precedence mirrors the folder rules: historian wins over scheduler,
// scheduler over data (data is food, historian is canon).

import type { EntityRef } from './types.js';

const LAYER_RANK: Record<string, number> = { historian: 0, scheduler: 1, data: 2 };
const rank = (e: EntityRef) => LAYER_RANK[e.path.split('/')[0]] ?? 3;
const stem = (p: string) => p.replace(/^.*\//, '').replace(/\.md$/, '');

// Leading words that are titles, not names — never treated as a short name.
const TITLES = new Set(['lord', 'lady', 'sister', 'brother', 'captain', 'king', 'queen', 'father', 'mother', 'master', 'sir', 'dame', 'old', 'young', 'the', 'saint']);

// Types never surfaced by a plain-text mention: story scaffolding (sessions,
// acts...) and rules vocabulary, whose names are everyday words ("Wizard").
const QUIET_TYPES = new Set(['session', 'act', 'mission', 'campaign', 'class', 'race', 'background']);

export type Resolver = (name: string) => EntityRef | undefined;

export function makeResolver(entities: EntityRef[]): Resolver {
  const map = new Map<string, EntityRef>();
  for (const e of [...entities].sort((a, b) => rank(a) - rank(b))) {
    for (const key of [e.name, stem(e.path), ...e.aliases]) {
      const k = key.trim().toLowerCase();
      if (k && !map.has(k)) map.set(k, e);
    }
  }
  return (name) => map.get(name.trim().toLowerCase());
}

// Phrase index for mention-finding: full names and aliases (4+ chars), plus a
// character's first name when it is unambiguous. `exclude` drops entities that
// must not surface on their own (another season's campaign).
export function mentionIndex(entities: EntityRef[], exclude: (e: EntityRef) => boolean): Map<string, EntityRef> {
  const idx = new Map<string, EntityRef>();
  const short = new Map<string, EntityRef | null>();
  for (const e of [...entities].sort((a, b) => rank(a) - rank(b))) {
    if (exclude(e) || QUIET_TYPES.has(e.type)) continue;
    for (const n of [e.name, ...e.aliases]) {
      const k = n.trim().toLowerCase();
      if (k.length >= 4 && !idx.has(k)) idx.set(k, e);
    }
    const first = e.name.trim().split(/\s+/)[0];
    if (e.type === 'character' && e.name.includes(' ') && first.length >= 4 && !TITLES.has(first.toLowerCase())) {
      const k = first.toLowerCase();
      short.set(k, short.has(k) && short.get(k) !== e ? null : e);
    }
  }
  for (const [k, e] of short) if (e && !idx.has(k)) idx.set(k, e);
  return idx;
}

const WORD_RE = /[A-Za-z][A-Za-z'’-]*/g;
const MAX_WORDS = 6;

// Entities named in `text`, in first-mention order. A match must start with a
// capital letter in the text, so common words that happen to be entity names
// ("the hearth") stay quiet; the longest phrase at each position wins.
export function findMentions(text: string, idx: Map<string, EntityRef>): EntityRef[] {
  const words = [...text.matchAll(WORD_RE)].map((m) => m[0].replace(/['’]s$/, ''));
  const found: EntityRef[] = [];
  for (let i = 0; i < words.length; i++) {
    if (!/^[A-Z]/.test(words[i])) continue;
    for (let n = Math.min(MAX_WORDS, words.length - i); n >= 1; n--) {
      const e = idx.get(words.slice(i, i + n).join(' ').toLowerCase());
      if (e) {
        if (!found.includes(e)) found.push(e);
        i += n - 1;
        break;
      }
    }
  }
  return found;
}

export function searchEntities(query: string, entities: EntityRef[], limit = 30): EntityRef[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const score = (e: EntityRef): number => {
    const name = e.name.toLowerCase();
    if (name === q) return 0;
    if (name.startsWith(q)) return 1;
    if (name.includes(q)) return 2;
    if (e.aliases.some((a) => a.toLowerCase().includes(q))) return 3;
    if (e.description.toLowerCase().includes(q)) return 4;
    return -1;
  };
  return entities
    .map((e) => ({ e, s: score(e) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => a.s - b.s || rank(a.e) - rank(b.e) || a.e.name.localeCompare(b.e.name))
    .slice(0, limit)
    .map((x) => x.e);
}
