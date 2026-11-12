// Cues the trackers can check (pure). Plans say when things happen in plain words:
// "round 3", "If Nella drops to half (24 HP)", "Tithe at 47 HP", "Vey drops", "the crew
// (everyone but Nella and Tithe) is down to two". Each becomes a condition on the fight:
// the round counter, an enemy's current HP, or how many enemies are still standing.
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
  | { kind: 'down'; entry: string } // the enemy is at 0
  | { kind: 'left'; n: number; except: string[] }; // n or fewer enemies standing, not counting these

export interface FightNow {
  round: number;
  hp: Readonly<Record<string, number>>; // current HP by enemy entry
  arrives?: Readonly<Record<string, number>>; // the round an enemy joins, if not from the start
}

export interface EnemyName { entry: string; name: string }

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const WORDS: Record<string, number> = { none: 0, zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
// "the crew is down to two", "the crew (everyone but Nella and Tithe) is down to 2",
// "enemies down to three": a head count. Names after "but" or "except" don't count.
const LEFT_RE = /\b(?:crew|enemies|foes)\b([^.;:!?\n]{0,80}?)\bdown to (\d+|none|zero|one|two|three|four|five|six|seven|eight|nine|ten)\b/gi;

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
  for (const m of t.matchAll(LEFT_RE)) {
    const but = /\b(?:but|except)\b(.*)/i.exec(m[1])?.[1] ?? '';
    const except = [...new Set(enemies.filter(({ name }) => new RegExp(String.raw`\b${esc(name)}\b`).test(but)).map((x) => x.entry))];
    out.push({ kind: 'left', n: WORDS[m[2].toLowerCase()] ?? Number(m[2]), except });
  }
  const seen = new Set<string>();
  return out.filter((c) => { const k = JSON.stringify(c); return !seen.has(k) && !!seen.add(k); });
}

// Standing: above 0 HP and already on the field.
const standing = (c: { except: string[] }, f: FightNow) => Object.entries(f.hp)
  .filter(([e, hp]) => hp > 0 && !c.except.includes(e) && (f.arrives?.[e] ?? 0) <= f.round).length;

const met = (c: Cond, f: FightNow) => (c.kind === 'round' ? f.round >= c.n
  : c.kind === 'hp' ? (f.hp[c.entry] ?? Infinity) <= c.n
  : c.kind === 'left' ? standing(c, f) <= c.n
  : (f.hp[c.entry] ?? Infinity) <= 0);

// Plans join cues with "or" ("Vey drops, or the crew is down to two"): any one will do.
export const anyMet = (conds: readonly Cond[], f: FightNow) => conds.some((c) => met(c, f));
