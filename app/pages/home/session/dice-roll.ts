// Dice rollers for stat lines and beat prose (pure). `rollTokens` finds every rollable
// token in a run of text: "+4 to hit" and "beak +6, 1d8+4" roll a d20 attack, "1d6+2",
// "+2d6 (7)" and "a d6" roll damage, "Perception +5", "WIS +3", "CON save (+1)",
// "Stealth (+8)" and a save note ("WIS save DC 13 (it has +3)") roll a d20 check.
// Dice.tsx draws them as buttons; Scene keeps the log.

export type RollKind = "hit" | "dmg" | "check";
export type RollMode = "normal" | "adv" | "dis" | "crit";

export interface Roll {
  expr: string; // "1d20+4", "2d6+3"
  kind: RollKind;
  mode: RollMode;
  dice: number[]; // every die rolled; for adv/dis, both d20s
  kept: number[]; // the dice that count
  mod: number;
  total: number;
  nat: 20 | 1 | null; // a d20 roll's natural 20 or 1
}

const EXPR_RE = /^\s*(\d*)d(\d+)\s*(?:([+-])\s*(\d+))?\s*$/i;

export function parseExpr(expr: string): { n: number; sides: number; mod: number } | null {
  const m = EXPR_RE.exec(expr);
  if (!m) return null;
  const n = m[1] ? Number(m[1]) : 1;
  const sides = Number(m[2]);
  if (n < 1 || n > 100 || sides < 2) return null;
  const mod = m[4] ? Number(m[4]) * (m[3] === "-" ? -1 : 1) : 0;
  return { n, sides, mod };
}

// Advantage and disadvantage apply to d20 rolls; crit doubles damage dice, never the modifier.
export function roll(
  expr: string,
  kind: RollKind,
  mode: RollMode = "normal",
  rng: () => number = Math.random,
): Roll | null {
  const p = parseExpr(expr);
  if (!p) return null;
  const die = () => 1 + Math.floor(rng() * p.sides);
  const isD20 = kind !== "dmg";
  let dice: number[];
  let kept: number[];
  if (isD20 && (mode === "adv" || mode === "dis")) {
    dice = [die(), die()];
    kept = [mode === "adv" ? Math.max(...dice) : Math.min(...dice)];
  } else {
    const count = kind === "dmg" && mode === "crit" ? p.n * 2 : p.n;
    dice = Array.from({ length: count }, die);
    kept = dice;
  }
  const sum = kept.reduce((a, b) => a + b, 0) + p.mod;
  const nat = isD20 && (kept[0] === 20 || kept[0] === 1) ? (kept[0] as 20 | 1) : null;
  const applies = isD20 ? mode === "adv" || mode === "dis" : mode === "crit";
  return {
    expr,
    kind,
    mode: applies ? mode : "normal",
    dice,
    kept,
    mod: p.mod,
    total: isD20 ? sum : Math.max(0, sum),
    nat,
  };
}

const SKILLS =
  "Acrobatics|Animal Handling|Arcana|Athletics|Deception|History|Insight|Intimidation|Investigation|Medicine|Nature|Perception|Performance|Persuasion|Religion|Sleight of Hand|Stealth|Survival|Initiative";
const ABILITIES =
  "Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma|STR|DEX|CON|INT|WIS|CHA|Str|Dex|Con|Int|Wis|Cha";

// One pass, first match wins at each position: to-hit, bonus-before-dice, skill or
// ability, save note, then bare dice.
const TOKEN_RE = new RegExp(
  [
    String.raw`(?<hit>[+-]\d+ to hit)`,
    String.raw`(?<hit2>(?<![\w+-])[+-]\d+(?=,\s*\d*d\d+))`,
    String.raw`(?<check>\b(?:${SKILLS}|${ABILITIES})(?:\s+save)?\s+(?:[+-]\d+\b|\([+-]\d+\)))`,
    String.raw`(?<save>(?<=\((?:it|he|she|they) ha(?:s|ve) )[+-]\d+(?=\)))`,
    String.raw`(?<dmg>(?<![\w])\d*d\d+(?:\s*[+-]\s*\d+(?![\d.]|d\d))?)`,
  ].join("|"),
  "g",
);

const bonusOf = (s: string) => Number(/([+-]\d+)/.exec(s)![1]);
const d20 = (b: number) => `1d20${b >= 0 ? "+" : "-"}${Math.abs(b)}`;

export interface RollToken {
  match: string;
  expr: string;
  kind: RollKind;
  label: string;
}

// A run of text split into plain strings and roll tokens, in order.
export function rollTokens(text: string): Array<string | RollToken> {
  const out: Array<string | RollToken> = [];
  let at = 0;
  for (const m of text.matchAll(TOKEN_RE)) {
    const g = m.groups!;
    const match = m[0];
    let kind: RollKind;
    let expr: string;
    let label = "";
    if (g.hit || g.hit2) {
      kind = "hit";
      expr = d20(bonusOf(match));
    } else if (g.check) {
      kind = "check";
      expr = d20(bonusOf(match));
      label = match.replace(/\s+\(?[+-]\d+\)?$/, "");
    } else if (g.save) {
      kind = "check";
      expr = d20(bonusOf(match));
      label = "save";
    } else {
      kind = "dmg";
      expr = match.replace(/\s+/g, "");
      if (/^d/i.test(expr)) expr = "1" + expr;
    }
    if (!parseExpr(expr)) continue;
    if (m.index > at) out.push(text.slice(at, m.index));
    out.push({ match, expr, kind, label });
    at = m.index + match.length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}
