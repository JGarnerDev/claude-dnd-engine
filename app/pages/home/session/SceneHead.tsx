// The top of a scene page: what the scene is doing, where, who is in it, the
// enemies as compact rows that expand to their stat blocks, and the DCs. Each
// enemy row carries every attack line and an HP box (current / max) the DM types
// damage into; Scene applies it and the runner stores the numbers. To-hit
// bonuses, damage dice, checks and saves are dice buttons (Dice.tsx), rolled into
// the roll log under the Enemies heading. Under the enemies sits the HP log
// (hp-log.ts): every entry, newest first, each one undoable.
//
// The stat blocks are uncontrolled <details>, so one the DM opened stays open
// while HP changes around it.

import { useState, type KeyboardEvent } from "react";
import {
  Badge,
  Box,
  Button,
  DescriptionList,
  Disclosure,
  EmptyState,
  Heading,
  List,
  Row,
  Text,
  TextInput,
  type DescriptionItem,
} from "jeff-ui";
import { matchEnemy } from "./combatants.js";
import type { Phase, StatBlock } from "./combatants.js";
import { rollable, RollLog, type LoggedRoll } from "./Dice.js";
import { touches, undoable } from "./hp-log.js";
import { KIND_HUE, VOICE_HUE } from "./hues.js";
import type { HpLogEntry } from "./hp-log.js";
import { plainText } from "./markdown.js";
import { InlineMd, Markdown } from "./MarkdownView.js";
import { stripProvenance } from "./provenance.js";
import type { SceneHeader } from "./scene-header.js";

// Current HP per enemy entry ("Drover (Varrick Tenn)"), so two enemies sharing one
// block (both cask-hands are Thugs) keep their own numbers. Missing = the block's known
// starting HP ("HP 10/27" carries damage from an earlier session), else full.
export type HpMap = Readonly<Record<string, number>>;

// The compact row keeps what the DM reaches for mid-round; skills live in the full block.
export const rowStats = (stats: string) =>
  stats
    .split(" · ")
    .filter((x) => /^(\*\*)?(AC|HP|Speed|CR)\b/.test(x.trim()))
    .join(" · ") || stats;

// The newest reset touching this scene, if it can still be undone; else -1.
export function undoResetIndex(log: readonly HpLogEntry[], entries: readonly string[]): number {
  const mine = new Set(entries);
  for (let i = log.length - 1; i >= 0; i--) {
    const e = log[i];
    if (e.kind === "reset" && touches(e).some((k) => mine.has(k))) return undoable(log, i) ? i : -1;
  }
  return -1;
}

// What the HP boxes and buttons ask of the scene. `onHit` returns false when the
// typed entry isn't a number the box understands, so the box keeps it.
export interface HpActions {
  onHit: (entry: string, typed: string) => boolean;
  onReset: () => void;
  onUndo: (i: number) => void;
}

const Chips = ({ items }: { items: string[] }) => (
  <Row gap={1}>
    {items.map((x, i) => (
      <Badge key={i} className="sr-sh-chip">
        <InlineMd md={x} />
      </Badge>
    ))}
  </Row>
);

interface HpBoxProps {
  entry: string;
  max: number;
  hp: HpMap;
  start?: number;
  boss?: { legendary?: number; phases?: readonly Phase[] };
  onHit: HpActions["onHit"];
}

// A boss carries its legendary actions and phases on the box, for the fight bar.
export function HpBox({ entry, max, hp, start = max, boss = {}, onHit }: HpBoxProps) {
  const cur = Math.min(hp[entry] ?? start, max);
  const [typed, setTyped] = useState("");
  const onKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    if (onHit(entry, typed)) setTyped("");
  };
  return (
    <span
      className="sr-hp"
      data-entry={entry}
      data-max={max}
      data-start={start}
      data-legendary={boss.legendary || undefined}
      data-phases={boss.phases?.length ? JSON.stringify(boss.phases) : undefined}
      onClick={(ev) => ev.preventDefault()}
    >
      <span className="sr-hp-val">
        <b>{cur}</b>/{max}
      </span>
      <TextInput
        className="sr-hp-in"
        value={typed}
        onChange={setTyped}
        inputMode="numeric"
        size={4}
        placeholder="dmg"
        title="12 or -12 deals damage · +5 heals · =40 sets · Enter applies"
        label="Damage or heal"
        onKeyUp={(ev) => {
          if (ev.key === " ") ev.preventDefault();
        }}
        onKeyDown={onKeyDown}
      />
    </span>
  );
}

function Enemy({
  entry,
  blocks,
  hp,
  arrives = 0,
  round,
  onHit,
}: {
  entry: string;
  blocks: StatBlock[];
  hp: HpMap;
  arrives?: number;
  round?: number;
  onHit: HpActions["onHit"];
}) {
  // An enemy that joins later waits greyed out until its round.
  const coming = round !== undefined && arrives > round ? " is-coming" : "";
  const tag = arrives ? (
    <>
      {" "}
      <Text as="span" size="xs" strong hue={VOICE_HUE.watch} className="sr-arrives">
        arrives round {arrives}
      </Text>
    </>
  ) : null;
  const at = arrives || undefined;
  const b = matchEnemy(entry, blocks);
  if (!b)
    return (
      <div className={`sr-enemy is-unmatched${coming}`} data-arrives={at}>
        <span className="sr-enemy-name">
          <InlineMd md={entry} />
          {tag}
        </span>
      </div>
    );
  const down = b.hp !== null && (hp[entry] ?? b.start ?? b.hp) <= 0;
  return (
    <Disclosure
      variant="flush"
      className={`sr-enemy${down ? " is-down" : ""}${coming}`}
      data-arrives={at}
      title={
        <span className="sr-enemy-row">
          <span className="sr-enemy-name">
            <InlineMd md={entry} />
            {tag}
          </span>
          <span className="sr-enemy-stats">
            <InlineMd md={rowStats(b.stats)} />
          </span>
          <span className="sr-enemy-atk">
            {b.attacks.map((a, i) => (
              <span key={i} className="sr-atk">
                <InlineMd md={stripProvenance(a)} text={rollable} />
              </span>
            ))}
          </span>
          {b.hp !== null ? (
            <HpBox
              entry={entry}
              max={b.hp}
              hp={hp}
              start={b.start ?? b.hp}
              boss={b}
              onHit={onHit}
            />
          ) : (
            <span />
          )}
        </span>
      }
    >
      <Box hue={KIND_HUE.combat} edge="start" className="sr-md sr-enemy-block">
        <Heading level={4} size="sm">
          {b.title}
        </Heading>
        <Markdown md={stripProvenance(b.md)} text={rollable} />
      </Box>
    </Disclosure>
  );
}

const clock = (at: number) =>
  new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

// This scene's entries in the HP log, newest first. A reset row lists the values it
// wiped. Undo is offered while nothing newer has touched that enemy.
export function HpLog({
  log,
  entries,
  open,
  onToggle,
  onUndo,
}: {
  log: readonly HpLogEntry[];
  entries: readonly string[];
  open: boolean;
  onToggle: (open: boolean) => void;
  onUndo: (i: number) => void;
}) {
  const mine = new Set(entries);
  const rows = log
    .map((e, i) => ({ e, i }))
    .filter(({ e }) => touches(e).some((k) => mine.has(k)))
    .reverse();
  const live = rows.filter(({ e }) => !e.undone).length;
  return (
    <Disclosure
      className="sr-hplog"
      title={`HP log (${live})`}
      open={open}
      onToggle={(ev) => onToggle(ev.currentTarget.open)}
    >
      {rows.length ? (
        <List ordered variant="plain" gap={1}>
          {rows.map(({ e, i }) => (
            <li key={i} className={e.undone ? "is-undone" : ""}>
              <span className="sr-hplog-at">
                {clock(e.at)}
                {e.kind === "hit" && e.round ? (
                  <>
                    {" "}
                    <Text as="span" strong hue={KIND_HUE.combat} className="sr-hplog-round">
                      R{e.round}
                    </Text>
                  </>
                ) : null}
              </span>
              <span className="sr-hplog-what">
                {e.kind === "hit" ? (
                  <>
                    <b>{plainText(e.entry)}</b> <code>{e.input}</code> {e.before} → {e.after}
                  </>
                ) : (
                  <>
                    <b>{e.label}</b>{" "}
                    {Object.entries(e.before)
                      .filter(([k]) => mine.has(k))
                      .map(([k, v]) => `${plainText(k)} was ${v}`)
                      .join(" · ")}
                  </>
                )}
              </span>
              {e.undone ? (
                <Text as="span" size="xs" tone="muted">
                  undone
                </Text>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="sr-hplog-undo"
                  data-undo={i}
                  disabled={!undoable(log, i)}
                  title={undoable(log, i) ? undefined : "Changed since: undo the newer entry first"}
                  onClick={() => onUndo(i)}
                >
                  Undo
                </Button>
              )}
            </li>
          ))}
        </List>
      ) : (
        <EmptyState className="sr-hplog-empty">
          Every HP entry lands here, and Reset HP never clears it.
        </EmptyState>
      )}
    </Disclosure>
  );
}

export interface SceneHeadProps extends HpActions {
  h: SceneHeader;
  blocks: StatBlock[];
  hp: HpMap;
  log: readonly HpLogEntry[];
  logOpen: boolean;
  onLogToggle: (open: boolean) => void;
  rolls: readonly LoggedRoll[];
  onClearRolls: () => void;
  round?: number; // the scene's round, once the page tracks one
}

export function SceneHead({
  h,
  blocks,
  hp,
  log,
  logOpen,
  onLogToggle,
  rolls,
  onClearRolls,
  round,
  onHit,
  onReset,
  onUndo,
}: SceneHeadProps) {
  const undoAt = undoResetIndex(log, h.enemies);
  const p = (s: string) => <InlineMd md={stripProvenance(s)} />;
  const castList = h.cast.includes(" · ");
  const fields: DescriptionItem[] = [];
  if (h.where)
    fields.push({ term: "Where", value: <span className="sr-sh-val">{p(h.where)}</span> });
  if (h.cast)
    fields.push({
      term: "Who’s here",
      value: castList ? (
        <Chips items={h.cast.split(" · ")} />
      ) : (
        <span className="sr-sh-val">{p(h.cast)}</span>
      ),
    });
  if (h.dcs.length > 0) fields.push({ term: "DCs", value: <Chips items={h.dcs} /> });
  return (
    <>
      {h.summary && (
        <Text size="lg" className="sr-sh-summary">
          {p(h.summary)}
        </Text>
      )}
      {fields.length > 0 && (
        <DescriptionList layout="inline" termWidth="6rem" className="sr-sh-grid" items={fields} />
      )}
      {h.enemies.length > 0 && (
        <Box hue={KIND_HUE.combat} className="sr-enemies">
          <Row justify="between">
            <Heading level={3} variant="eyebrow">
              Enemies
            </Heading>
            <Row gap={1}>
              <Button
                size="sm"
                variant="ghost"
                className="sr-roll-clear"
                title="Clear the roll log"
                hidden={!rolls.length}
                onClick={onClearRolls}
              >
                Clear rolls
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="sr-hp-undo-reset"
                data-undo={undoAt}
                title="Put back the HP the last reset wiped"
                hidden={undoAt < 0}
                onClick={() => {
                  if (undoAt >= 0) onUndo(undoAt);
                }}
              >
                Undo reset
              </Button>
              <Button
                size="sm"
                variant="danger"
                className="sr-hp-reset"
                title="Put every enemy back to its known HP at the start of the session. The HP log keeps the old numbers."
                onClick={onReset}
              >
                Reset HP
              </Button>
            </Row>
          </Row>
          <RollLog rolls={rolls} />
          {h.enemies.map((e, i) => (
            <Enemy
              key={i}
              entry={e}
              blocks={blocks}
              hp={hp}
              arrives={h.arrivals[e]}
              round={round}
              onHit={onHit}
            />
          ))}
          {h.tactics && (
            <Text size="sm" tone="muted" className="sr-tactics">
              {p(h.tactics)}
            </Text>
          )}
          <HpLog
            log={log}
            entries={h.enemies}
            open={logOpen}
            onToggle={onLogToggle}
            onUndo={onUndo}
          />
        </Box>
      )}
    </>
  );
}
