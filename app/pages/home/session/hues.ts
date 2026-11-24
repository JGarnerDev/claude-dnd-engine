// The runner's meanings, as theme colors passed to jeff-ui's `hue` props. All
// come from the theme's muted hue family (`--ui-hue-*`), with gold (the accent)
// kept for forks and choices; `--ui-cat-*` is for charts only. No CSS sets
// them, so the theme owns every color on the page.
//
// Kinds are the flow chart's node classes (meta/flow-graphs.md legend: red
// combat, teal social, gold fork, green payoff, blue thread, magenta setback,
// grey undecided), plus the recap card. Voices are the prompt book's lines.

import type { Voice } from "./prompt-blocks.js";

/** A scene kind's color, by the flow chart's classDef name. */
export const KIND_HUE = {
  combat: "var(--ui-hue-ember)",
  social: "var(--ui-hue-verdigris)",
  decision: "var(--ui-accent)",
  stake: "var(--ui-hue-moss)",
  seed: "var(--ui-hue-sky)",
  fail: "var(--ui-hue-rose)",
  open: "var(--ui-muted)",
  recap: "var(--ui-hue-plum)",
} as const;

export type Kind = keyof typeof KIND_HUE;

/** A kind's color; a card with no class, or one the legend doesn't know, reads as social. */
export function kindHue(kind: string | undefined): string {
  return kind && kind in KIND_HUE ? KIND_HUE[kind as Kind] : KIND_HUE.social;
}

/** A prompt-book voice's color: who a line is for, or what it is. */
export const VOICE_HUE: Record<Voice, string> = {
  you: "var(--ui-hue-sky)",
  say: "var(--ui-accent)",
  intro: "var(--ui-accent)",
  time: "var(--ui-hue-amber)",
  do: "var(--ui-hue-moss)",
  watch: "var(--ui-hue-plum)",
  choice: "var(--ui-accent)",
  private: "var(--ui-hue-plum)",
  fight: "var(--ui-hue-ember)",
};

/** The boss's color in the fight bar, its meter and its rails. */
export const BOSS_HUE = "var(--ui-hue-rose)";

/** An entity's layer badge: what the world holds, the story so far, the DM's plans. */
export const LAYER_HUE: Record<string, string> = {
  historian: "var(--ui-hue-moss)",
  data: "var(--ui-hue-amber)",
  scheduler: "var(--ui-hue-plum)",
};
