// Dice rollers for enemy stat lines (pure). `rollableHtml` wraps every rollable token in
// rendered HTML in a button: "+4 to hit" and "beak +6, 1d8+4" roll a d20 attack,
// "1d6+2" and "+2d6 (7)" roll damage, "Perception +5", "WIS +3" and a save note
// ("WIS save DC 13 (it has +3)") roll a d20 check. scene.ts wires the buttons and
// keeps the roll log.

export type RollKind = 'hit' | 'dmg' | 'check';
export type RollMode = 'normal' | 'adv' | 'dis' | 'crit';

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
  const mod = m[4] ? Number(m[4]) * (m[3] === '-' ? -1 : 1) : 0;
  return { n, sides, mod };
}

// Advantage and disadvantage apply to d20 rolls; crit doubles damage dice, never the modifier.
export function roll(expr: string, kind: RollKind, mode: RollMode = 'normal', rng: () => number = Math.random): Roll | null {
  const p = parseExpr(expr);
  if (!p) return null;
  const die = () => 1 + Math.floor(rng() * p.sides);
  const isD20 = kind !== 'dmg';
  let dice: number[];
  let kept: number[];
  if (isD20 && (mode === 'adv' || mode === 'dis')) {
    dice = [die(), die()];
    kept = [mode === 'adv' ? Math.max(...dice) : Math.min(...dice)];
  } else {
    const count = kind === 'dmg' && mode === 'crit' ? p.n * 2 : p.n;
    dice = Array.from({ length: count }, die);
    kept = dice;
  }
  const sum = kept.reduce((a, b) => a + b, 0) + p.mod;
  const nat = isD20 && (kept[0] === 20 || kept[0] === 1) ? (kept[0] as 20 | 1) : null;
  const applies = isD20 ? mode === 'adv' || mode === 'dis' : mode === 'crit';
  return { expr, kind, mode: applies ? mode : 'normal', dice, kept, mod: p.mod, total: isD20 ? sum : Math.max(0, sum), nat };
}

// "d20 (14, 6) +4" — both dice shown for adv/dis, the kept one bold.
export function rollDetailHtml(r: Roll): string {
  const p = parseExpr(r.expr)!;
  const dieName = `${r.kind === 'dmg' ? (r.mode === 'crit' ? p.n * 2 : p.n) : 1}d${p.sides}`;
  const faces = r.dice.length > r.kept.length
    ? r.dice.map((d) => (d === r.kept[0] ? `<b>${d}</b>` : `<s>${d}</s>`)).join(', ')
    : r.dice.join(', ');
  const mod = r.mod ? ` ${r.mod > 0 ? '+' : '−'}${Math.abs(r.mod)}` : '';
  return `${dieName} (${faces})${mod}`;
}

const SKILLS = 'Acrobatics|Animal Handling|Arcana|Athletics|Deception|History|Insight|Intimidation|Investigation|Medicine|Nature|Perception|Performance|Persuasion|Religion|Sleight of Hand|Stealth|Survival|Initiative';
const ABILITIES = 'Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma|STR|DEX|CON|INT|WIS|CHA|Str|Dex|Con|Int|Wis|Cha';

// One pass, first match wins at each position: to-hit, bonus-before-dice, skill or
// ability, save note, then bare dice.
const TOKEN_RE = new RegExp([
  String.raw`(?<hit>[+-]\d+ to hit)`,
  String.raw`(?<hit2>(?<![\w+-])[+-]\d+(?=,\s*\d*d\d+))`,
  String.raw`(?<check>\b(?:${SKILLS}|${ABILITIES})\s+[+-]\d+\b)`,
  String.raw`(?<save>(?<=\((?:it|he|she|they) ha(?:s|ve) )[+-]\d+(?=\)))`,
  String.raw`(?<dmg>(?<![\w])\d*d\d+(?:\s*[+-]\s*\d+(?![\d.]|d\d))?)`,
].join('|'), 'g');

const bonusOf = (s: string) => Number(/([+-]\d+)/.exec(s)![1]);
const d20 = (b: number) => `1d20${b >= 0 ? '+' : '-'}${Math.abs(b)}`;

function wrapText(text: string): string {
  return text.replace(TOKEN_RE, (match, ...args) => {
    const g = args[args.length - 1] as Record<string, string | undefined>;
    let kind: RollKind;
    let expr: string;
    let label = '';
    if (g.hit || g.hit2) { kind = 'hit'; expr = d20(bonusOf(match)); }
    else if (g.check) { kind = 'check'; expr = d20(bonusOf(match)); label = match.replace(/\s+[+-]\d+$/, ''); }
    else if (g.save) { kind = 'check'; expr = d20(bonusOf(match)); label = 'save'; }
    else { kind = 'dmg'; expr = match.replace(/\s+/g, ''); if (/^d/i.test(expr)) expr = '1' + expr; }
    if (!parseExpr(expr)) return match;
    const tip = kind === 'dmg' ? 'Roll damage · Shift: critical' : 'Roll d20 · Shift: advantage · Alt: disadvantage';
    return `<button type="button" class="sr-roll" data-roll="${expr}" data-kind="${kind}"${label ? ` data-label="${label}"` : ''} title="${tip}">${match}</button>`;
  });
}

// Wraps tokens in text only: never inside a tag, a link or an existing button.
export function rollableHtml(html: string): string {
  let skip = 0;
  return html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith('<')) {
      if (/^<(a|button|code)\b/i.test(part)) skip++;
      else if (/^<\/(a|button|code)>/i.test(part)) skip = Math.max(0, skip - 1);
      return part;
    }
    return skip ? part : wrapText(part);
  }).join('');
}
