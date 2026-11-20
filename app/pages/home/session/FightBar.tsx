// The fight bar, pinned at the top of the notes while a fight runs (step-info.ts →
// fightSpans): the round counter, what's due now, and one HP chip per enemy, colored
// by how hurt it is. A chip click opens a damage box right in the bar, so damage goes
// in wherever the DM has scrolled, and under it a card for that enemy: its stats, its
// attacks as dice, a boss's legendary actions and phases, and the full block folded.
// The card rolls into the same log as the Enemies box. An enemy that "arrives round
// 3" waits greyed out until then.
//
// The alerts are what has come true (fight-cues.ts). A `Ready:` alert jumps to its step.
//
// A boss chip carries a thin HP meter with a tick at each phase ("Bloodied, at 47 HP"),
// and names the phase once it's in it. Its legendary actions sit beside it as pips: a
// click spends one, a click on a spent one gives it back, and the next round refills
// them all (they come back on its turn, which the runner doesn't track).

import { useEffect, useRef, type KeyboardEvent } from "react";
import { Button, Disclosure, IconButton } from "jeff-ui";
import type { Phase, StatBlock } from "./combatants.js";
import { rollable, RollLog, type LoggedRoll } from "./Dice.js";
import { allItems, inlineText, type Alert } from "./fight-cues.js";
import { plainText } from "./markdown.js";
import { parseMarkdown } from "./markdown-tokens.js";
import { InlineMd, Markdown, MdItems } from "./MarkdownView.js";
import { stripProvenance } from "./provenance.js";
import { rowStats } from "./SceneHead.js";

export interface FightChip {
  entry: string;
  cur: number;
  max: number;
  due: number; // the round it arrives, 0 = from the start
  block: StatBlock;
}

const shortName = (entry: string) => plainText(/\(([^)]+)\)\s*$/.exec(entry)?.[1] ?? entry);
const band = (cur: number, max: number) =>
  cur <= 0 ? "down" : cur <= max / 4 ? "low" : cur <= max / 2 ? "hurt" : "ok";

function Chip({
  c,
  round,
  picked,
  onPick,
}: {
  c: FightChip;
  round: number;
  picked: boolean;
  onPick: () => void;
}) {
  const phases: readonly Phase[] = c.block.phases;
  const coming = c.due > round;
  const phase = c.cur > 0 ? phases.filter((p) => c.cur <= p.hp).pop() : undefined;
  const tip = phases.map((p) => `${p.name} at ${p.hp}`).join(", ");
  return (
    <Button
      className={`sr-hpchip is-${band(c.cur, c.max)}${coming ? " is-coming" : ""}${phase ? " is-phase" : ""}${picked ? " is-picked" : ""}`}
      data-entry={c.entry}
      title={`${plainText(c.entry)}${coming ? `, arrives round ${c.due}` : ""}${tip ? ` (${tip})` : ""}: type damage`}
      onClick={onPick}
    >
      <i></i>
      {shortName(c.entry)} <b>{c.cur}</b>/{c.max}
      {phases.length > 0 && (
        <span className="sr-meter" aria-hidden="true">
          <span
            className="sr-meter-fill"
            style={{ width: `${Math.max(0, Math.min(100, (c.cur / c.max) * 100))}%` }}
          ></span>
          {phases.map((p, i) => (
            <span
              key={i}
              className="sr-meter-tick"
              style={{ left: `${(p.hp / c.max) * 100}%` }}
            ></span>
          ))}
        </span>
      )}
      {phase && (
        <>
          {" "}
          <small className="sr-phase">{phase.name}</small>
        </>
      )}
      {coming && (
        <>
          {" "}
          <small>R{c.due}</small>
        </>
      )}
    </Button>
  );
}

function Legend({
  entry,
  n,
  spent,
  onSpend,
}: {
  entry: string;
  n: number;
  spent: number;
  onSpend: (n: number) => void;
}) {
  return (
    <span
      className="sr-legend"
      data-entry={entry}
      aria-label={`Legendary actions, ${n - spent} left`}
    >
      {Array.from({ length: n }, (_, i) => (
        <Button
          key={i}
          unstyled
          className={`sr-pip${i < spent ? " is-spent" : ""}`}
          data-pip={i}
          aria-pressed={i < spent}
          title={`Legendary action ${i + 1} of ${n}: click to spend, click again to give back. A new round refills them.`}
          onClick={() => onSpend(i < spent ? i : i + 1)}
        ></Button>
      ))}
    </span>
  );
}

const BOSS_LINE = /^legendary actions|\b\d+ HP\b/i;

// The picked enemy's card: what its Enemies row shows, its boss lines, its block folded.
function Card({
  c,
  rolls,
  onClearRolls,
}: {
  c: FightChip;
  rolls: readonly LoggedRoll[];
  onClearRolls: () => void;
}) {
  const b = c.block;
  const md = stripProvenance(b.md);
  const boss = allItems(parseMarkdown(md)).filter((it) => {
    const lead = it.c.find((n) => n.t === "strong");
    return lead?.t === "strong" && BOSS_LINE.test(inlineText(lead.c));
  });
  return (
    <div className="sr-strip-card" data-who={plainText(c.entry)}>
      <div className="sr-strip-card-stats">
        <InlineMd md={rowStats(b.stats)} />
      </div>
      {b.attacks.length > 0 && (
        <div className="sr-strip-card-atk">
          {b.attacks.map((a, i) => (
            <span key={i} className="sr-atk">
              <InlineMd md={stripProvenance(a)} text={rollable} />
            </span>
          ))}
        </div>
      )}
      <div className="sr-strip-card-rolls">
        <RollLog rolls={rolls} />
        <Button
          variant="ghost"
          className="sr-roll-clear"
          title="Clear the roll log"
          hidden={!rolls.length}
          onClick={onClearRolls}
        >
          Clear rolls
        </Button>
      </div>
      {boss.length > 0 && (
        <ul className="sr-md sr-strip-card-boss">
          <MdItems items={boss} text={rollable} />
        </ul>
      )}
      <Disclosure className="sr-strip-card-more" title="Full block">
        <div className="sr-md">
          <div className="sr-enemy-title">{b.title}</div>
          <Markdown md={md} text={rollable} />
        </div>
      </Disclosure>
    </div>
  );
}

export interface FightBarProps {
  mode: "fight" | "boss";
  round: number;
  chips: readonly FightChip[];
  alerts: readonly Alert[];
  pick: string; // the chip whose damage box is open, or ''
  spent: ReadonlyMap<string, number>; // legendary actions spent this round
  rolls: readonly LoggedRoll[];
  onRound: (delta: number) => void;
  onPick: (entry: string) => void;
  onSpend: (entry: string, n: number) => void;
  onGo: (id: string) => void;
  onHit: (entry: string, typed: string) => boolean;
  onClearRolls: () => void;
}

export function FightBar({
  mode,
  round,
  chips,
  alerts,
  pick,
  spent,
  rolls,
  onRound,
  onPick,
  onSpend,
  onGo,
  onHit,
  onClearRolls,
}: FightBarProps) {
  const picked = chips.find((c) => c.entry === pick);
  const input = useRef<HTMLInputElement>(null);
  // A chip click focuses its box; a box that comes back on a re-render leaves focus be.
  const focus = useRef(false);
  useEffect(() => {
    if (focus.current) input.current?.focus();
    focus.current = false;
  }, [pick]);
  const onKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Escape") {
      ev.stopPropagation();
      onPick("");
      return;
    }
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    const el = ev.currentTarget;
    if (onHit(pick, el.value)) {
      el.value = "";
      el.focus();
    }
  };
  return (
    <div className={`sr-strip${mode === "boss" ? " is-boss" : ""}`} aria-label="The fight">
      <div className="sr-strip-top">
        <span className="sr-strip-mode">{mode === "boss" ? "Boss fight" : "Fight"}</span>
        <span className="sr-round">
          <IconButton data-round="-1" label="Previous round" onClick={() => onRound(-1)}>
            −
          </IconButton>
          <span>
            Round <output>{round}</output>
          </span>
          <IconButton data-round="1" label="Next round" onClick={() => onRound(1)}>
            +
          </IconButton>
        </span>
        <div className="sr-strip-alerts" aria-live="polite">
          {alerts.map((a, i) =>
            a.kind === "ready" ? (
              <Button
                key={i}
                variant="primary"
                className="sr-alert is-ready"
                data-to={a.to}
                onClick={() => onGo(a.to)}
              >
                {a.text}
              </Button>
            ) : (
              <span key={i} className="sr-alert is-now">
                {a.text}
              </span>
            ),
          )}
        </div>
      </div>
      <div className="sr-strip-chips">
        {chips.map((c) => {
          const chip = (
            <Chip
              key={c.entry}
              c={c}
              round={round}
              picked={c.entry === pick}
              onPick={() => {
                focus.current = true;
                onPick(c.entry === pick ? "" : c.entry);
              }}
            />
          );
          const n = c.block.legendary;
          if (!n || c.cur <= 0) return chip;
          return (
            <span key={c.entry} className="sr-hpchip-wrap">
              {chip}
              <Legend
                entry={c.entry}
                n={n}
                spent={Math.min(spent.get(c.entry) ?? 0, n)}
                onSpend={(k) => onSpend(c.entry, k)}
              />
            </span>
          );
        })}
      </div>
      <div className="sr-strip-quickbox">
        {picked && (
          <>
            <label className="sr-strip-quick">
              <span>{plainText(picked.entry)}</span>
              <input
                key={picked.entry}
                ref={input}
                className="sr-strip-in"
                data-entry={picked.entry}
                type="text"
                inputMode="numeric"
                size={5}
                placeholder="dmg"
                title="12 or -12 deals damage · +5 heals · =40 sets · Enter applies · Esc closes"
                aria-label={`Damage or heal for ${plainText(picked.entry)}`}
                onKeyDown={onKeyDown}
              />
            </label>
            <Card c={picked} rolls={rolls} onClearRolls={onClearRolls} />
          </>
        )}
      </div>
    </div>
  );
}
