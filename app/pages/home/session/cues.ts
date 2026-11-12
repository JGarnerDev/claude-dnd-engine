// Cues the trackers can check (pure). Plans say when things happen in plain words:
// "round 3", "If Nella drops to half (24 HP)", "Tithe at 47 HP", "Vey drops". Each
// becomes a condition on the fight: the round counter, or an enemy's current HP.
// An enemy is named the way the plan names it: its real name, either half of it,
// or its label ("Relief Captain (Garran Vey)" answers to Garran Vey, Garran, Vey and
// Relief Captain). A name two enemies share names neither.
//
// The scene page checks every Watch item and every step's `When:` line against the
// fight after each HP entry and each round, and lights the ones that have come true.

import { plainText } from './markdown.js';

export type Cond =
  | { kind: 'round'; n: number } // the round counter reached n
  | { kind: 'hp'; entry: string; n: number } // the enemy is at n HP or less
  | { kind: 'down'; entry: string }; // the enemy is at 0

export interface FightNow {
  round: number;
  hp: Readonly<Record<string, number>>; // current HP by enemy entry
}

export interface EnemyName { entry: string; name: string }

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function enemyNames(entries: readonly string[]): EnemyName[] {
  const all: EnemyName[] = [];
  for (const entry of entries) {
    const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(plainText(entry));
    const label = (m ? m[1] : plainText(entry)).trim();
    const real = m ? m[2].trim() : '';
    const words = real.split(/\s+/).filter((w) => /^[A-Z][\w'’-]{2,}$/.test(w));
    for (const name of new Set([real, ...(words.length > 1 ? words : []), label].filter(Boolean))) all.push({ entry, name });
  }
  const count = new Map<string, Set<string>>();
  for (const { entry, name } of all) count.set(name, (count.get(name) ?? new Set()).add(entry));
  // Longest first, so "Garran Vey" wins over "Vey" when both match the same words.
  return all.filter((x) => count.get(x.name)!.size === 1).sort((a, b) => b.name.length - a.name.length);
}

export function parseConds(text: string, enemies: readonly EnemyName[]): Cond[] {
  const t = plainText(text).replace(/\*/g, '');
  const out: Cond[] = [];
  for (const m of t.matchAll(/\brounds? (\d+)\b/gi)) out.push({ kind: 'round', n: Number(m[1]) });
  for (const { entry, name } of enemies) {
    const n = esc(name);
    for (const m of t.matchAll(new RegExp(String.raw`\b${n}\b[^.;:!?\n]{0,40}?\(?(\d+) HP\b`, 'g'))) out.push({ kind: 'hp', entry, n: Number(m[1]) });
    if (new RegExp(String.raw`\b${n}\b(?:'s)?\s+(?:drops|dies|is down|goes down|falls|is dead)\b(?!\s+to\b)`).test(t)
      || new RegExp(String.raw`\b${n}\b[^.;:!?\n]{0,20}?\b(?:to|at) 0\b`).test(t)) out.push({ kind: 'down', entry });
  }
  const seen = new Set<string>();
  return out.filter((c) => { const k = JSON.stringify(c); return !seen.has(k) && !!seen.add(k); });
}

const met = (c: Cond, f: FightNow) => (c.kind === 'round' ? f.round >= c.n
  : c.kind === 'hp' ? (f.hp[c.entry] ?? Infinity) <= c.n
  : (f.hp[c.entry] ?? Infinity) <= 0);

// Plans join cues with "or" ("Vey drops, or the crew is down to two"): any one will do.
export const anyMet = (conds: readonly Cond[], f: FightNow) => conds.some((c) => met(c, f));
