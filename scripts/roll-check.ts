// Lists the rolls in a session plan as the session runner sees them: the ones it turns into
// dice buttons, and the lines that name a roll with no dice or bonus to roll (a DM roll the
// runner can't button). /review Pass 1 → Check the dice reads its output.
// It is a lister, not a gate: a player's roll needs only a DC, so some "no dice" lines are fine.
// Usage: node scripts/roll-check.ts --session <n> | <plan.md>
// consumers: .claude/commands/review.md, .claude/commands/session.md
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { rollTokens, type RollToken } from "../app/pages/home/session/dice-roll.ts";

export class RollCheckError extends Error {}

export interface PlanLine {
  line_no: number;
  text: string;
}
export interface LineRolls extends PlanLine {
  rolls: RollToken[];
}
export interface RollReport {
  buttons: LineRolls[];
  no_dice: PlanLine[];
}

// Sections the runner already buttons from stat blocks, or never shows at the table.
const SKIPPED_SECTIONS = new Set(["Combatants", "Engine notes"]);
// Words that say a roll happens. A line with one of these and no roll token is reported.
const ROLL_WORD_RE =
  /\b(?:save|saves|saving throw|damage|to hit|attack roll|concentration|heals?|regains?)\b/i;
// Phrases with a roll word that never need dice: a PC's death saves, "no damage".
const NOT_A_ROLL_RE = /\bdeath saves?\b|\bno damage\b/gi;

// Read-aloud text, which the prompt book shows with no buttons (prompt-blocks.ts → Say):
// a `>` quote, a bullet labelled Say / read aloud / line(s), or a bullet opening on a quote.
export function isSay(line: string): boolean {
  const t = line.trimStart();
  if (t.startsWith(">")) return true;
  const label = /^[-*]\s+\*\*([^*]+?):?\*\*:?/.exec(t)?.[1] ?? "";
  if (/\b(?:say|read aloud|lines?)\b/i.test(label)) return true;
  return /^[-*]\s+\*?["“]/.test(t);
}

// The text the runner's dice renderer sees: code spans and wiki-links are never rolled.
const rollableText = (line: string) => line.replace(/`[^`]*`|\[\[[^\]]*\]\]/g, "");

// A wrapped line carries on the bullet or paragraph above it, as markdown reads it.
const continues = (line: string) =>
  line.trim() !== "" && !/^\s*(?:[-*+]\s|\d+\.\s|#|>|```)/.test(line);

// The plan after the frontmatter, minus the skipped sections, with each wrapped bullet or
// paragraph joined into one line numbered where it starts, so a roll split by a wrap still reads.
export function tableLines(md: string): PlanLine[] {
  const lines = md.split(/\r?\n/);
  let i = 0;
  if (lines[0] === "---") i = lines.indexOf("---", 1) + 1;
  const out: PlanLine[] = [];
  let skipping = false;
  let joinable = false;
  for (; i < lines.length; i++) {
    const h2 = /^## (.+?)\s*$/.exec(lines[i]);
    if (h2) skipping = SKIPPED_SECTIONS.has(h2[1]);
    if (h2 || skipping) {
      joinable = false;
      continue;
    }
    if (joinable && continues(lines[i])) out[out.length - 1].text += ` ${lines[i].trim()}`;
    else out.push({ line_no: i + 1, text: lines[i] });
    joinable = lines[i].trim() !== "" && !lines[i].trimStart().startsWith("#");
  }
  return out;
}

export function checkRolls(md: string): RollReport {
  const report: RollReport = { buttons: [], no_dice: [] };
  for (const l of tableLines(md)) {
    if (isSay(l.text)) continue;
    const text = rollableText(l.text);
    const rolls = rollTokens(text).filter((t): t is RollToken => typeof t !== "string");
    if (rolls.length) report.buttons.push({ ...l, rolls });
    else if (ROLL_WORD_RE.test(text.replace(NOT_A_ROLL_RE, ""))) report.no_dice.push(l);
  }
  return report;
}

// `--session 35` → that session's plan; anything else must be an existing .md file.
export function resolvePlan({ args, root }: { args: string[]; root: string }): string {
  if (args.length === 2 && args[0] === "--session") {
    if (!/^\d+$/.test(args[1]))
      throw new RollCheckError(`--session takes a number, got "${args[1]}"`);
    const prefix = `Session ${args[1].padStart(2, "0")} `;
    const sessions = join(root, "scheduler", "sessions");
    const dir = readdirSync(sessions).find((d) => d.startsWith(prefix));
    if (!dir) throw new RollCheckError(`no folder starting "${prefix}" in scheduler/sessions`);
    return join(sessions, dir, `${dir}.md`);
  }
  if (
    args.length === 1 &&
    args[0].endsWith(".md") &&
    statSync(args[0], { throwIfNoEntry: false })?.isFile()
  )
    return args[0];
  throw new RollCheckError("usage: node scripts/roll-check.ts --session <n> | <plan.md>");
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const describe = (t: RollToken) => `${t.match} → ${t.expr}${t.label ? ` (${t.label})` : ""}`;

export function formatReport(report: RollReport): string {
  const out = [`Dice buttons: ${report.buttons.reduce((n, l) => n + l.rolls.length, 0)}`];
  for (const l of report.buttons) out.push(`  ${l.line_no}: ${l.rolls.map(describe).join(" · ")}`);
  out.push(
    "",
    `Names a roll, no dice (fine for a player's DC; a DM roll needs its bonus or dice): ${report.no_dice.length}`,
  );
  for (const l of report.no_dice) out.push(`  ${l.line_no}: ${clip(l.text.trim(), 140)}`);
  return out.join("\n");
}

if (import.meta.main) {
  try {
    const plan = resolvePlan({
      args: process.argv.slice(2),
      root: join(import.meta.dirname, ".."),
    });
    console.log(formatReport(checkRolls(readFileSync(plan, "utf8"))));
  } catch (e) {
    if (!(e instanceof RollCheckError)) throw e;
    console.error(e.message);
    process.exitCode = 2;
  }
}
