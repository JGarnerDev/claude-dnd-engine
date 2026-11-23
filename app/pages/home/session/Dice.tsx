// Dice buttons for enemy stat lines, and the roll log they feed. `rollable` is a
// text renderer for <Markdown>/<InlineMd>: it turns each rollable token
// (dice-roll.ts) into a button. A click rolls (Shift: advantage or crit, Alt:
// disadvantage) and logs it. The log lives in Scene, not the runner's store:
// rolls are for the moment, and survive re-renders but not a reload.

import { createContext, Fragment, useContext, type MouseEvent } from "react";
import { InlineButton, List, Text, type TextProps } from "jeff-ui";
import { KIND_HUE } from "./hues.js";
import {
  parseExpr,
  roll,
  rollTokens,
  type Roll,
  type RollMode,
  type RollToken,
} from "./dice-roll.js";

export interface LoggedRoll {
  who: string;
  what: string;
  r: Roll;
}

export const RollContext = createContext<(entry: LoggedRoll) => void>(() => {});

// Who rolled is the enemy row's name, or the nearest [data-who] (the fight bar card);
// what is the button's label, or the bold lead of its attack line.
function logEntry(b: HTMLElement, r: Roll, label: string): LoggedRoll {
  const enemy = b.closest(".sr-enemy");
  const who =
    enemy?.querySelector(".sr-enemy-name")?.textContent?.trim() ??
    b.closest<HTMLElement>("[data-who]")?.dataset.who ??
    "";
  const line = b.closest(".sr-atk, li");
  const what =
    label || (line?.querySelector("strong")?.textContent?.replace(/:$/, "").trim() ?? "");
  return { who, what, r };
}

function RollButton({ tok }: { tok: RollToken }) {
  const log = useContext(RollContext);
  const tip =
    tok.kind === "dmg"
      ? "Roll damage · Shift: critical"
      : "Roll d20 · Shift: advantage · Alt: disadvantage";
  // Dice sit in the enemy rows' <summary> too, so a click must not toggle the block.
  const onClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const mode: RollMode =
      tok.kind === "dmg"
        ? ev.shiftKey
          ? "crit"
          : "normal"
        : ev.shiftKey
          ? "adv"
          : ev.altKey
            ? "dis"
            : "normal";
    const r = roll(tok.expr, tok.kind, mode);
    if (r) log(logEntry(ev.currentTarget, r, tok.label));
  };
  return (
    <InlineButton
      className="sr-roll"
      hue={KIND_HUE.combat}
      data-roll={tok.expr}
      data-kind={tok.kind}
      data-label={tok.label || undefined}
      title={tip}
      onClick={onClick}
    >
      {tok.match}
    </InlineButton>
  );
}

export const rollable = (text: string) =>
  rollTokens(text).map((t, i) => (typeof t === "string" ? t : <RollButton key={i} tok={t} />));

// "d20 (14, 6) +4" — both dice shown for adv/dis, the kept one bold.
export function RollDetail({ r }: { r: Roll }) {
  const p = parseExpr(r.expr)!;
  const dieName = `${r.kind === "dmg" ? (r.mode === "crit" ? p.n * 2 : p.n) : 1}d${p.sides}`;
  const faces =
    r.dice.length > r.kept.length
      ? r.dice.map((d, i) => (
          <Fragment key={i}>
            {i > 0 && ", "}
            {d === r.kept[0] ? <b>{d}</b> : <s>{d}</s>}
          </Fragment>
        ))
      : r.dice.join(", ");
  const mod = r.mod ? ` ${r.mod > 0 ? "+" : "−"}${Math.abs(r.mod)}` : "";
  return (
    <>
      {dieName} ({faces}){mod}
    </>
  );
}

export function RollLog({ rolls }: { rolls: readonly LoggedRoll[] }) {
  return (
    <List ordered variant="plain" gap={1} className="sr-roll-log" aria-live="polite">
      {rolls.map(({ who, what, r }, i) => {
        const tag = r.nat === 20 ? " is-nat20" : r.nat === 1 ? " is-nat1" : "";
        const tone: TextProps["tone"] =
          r.nat === 20 ? "ok" : r.nat === 1 ? "err" : i === 0 ? "accent" : undefined;
        const mode =
          r.mode === "adv"
            ? " · adv"
            : r.mode === "dis"
              ? " · dis"
              : r.mode === "crit"
                ? " · crit"
                : "";
        const kind = r.kind === "hit" ? "to hit" : r.kind === "dmg" ? "damage" : "roll";
        return (
          <li key={i} className={`sr-roll-entry${tag}${i === 0 ? " is-latest" : ""}`}>
            <Text as="span" size="lg" strong numeric tone={tone} className="sr-roll-total">
              {r.total}
            </Text>{" "}
            <Text as="span" size="sm" className="sr-roll-what">
              {who} · {what} · {kind}
              {mode}
            </Text>{" "}
            <Text as="span" size="sm" tone="muted" numeric className="sr-roll-detail">
              <RollDetail r={r} />
            </Text>
          </li>
        );
      })}
    </List>
  );
}
