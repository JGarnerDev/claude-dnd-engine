// The runner's two palettes of meaning, as theme colors passed to jeff-ui's
// `hue` props. No CSS sets them, so the theme owns every color on the page.
//
// Kinds are the flow chart's node classes (meta/flow-graphs.md legend: red
// combat, orange social, gold fork, green payoff, blue thread, magenta setback,
// grey undecided), plus the recap card. Voices are the prompt book's lines.

import type { Voice } from "./prompt-blocks.js";

/** A scene kind's color, by the flow chart's classDef name. */
export const KIND_HUE = {
  combat: "var(--ui-err)",
  social: "var(--ui-cat-2)",
  decision: "var(--ui-accent)",
  stake: "var(--ui-ok)",
  seed: "var(--ui-cat-1)",
  fail: "var(--ui-cat-5)",
  open: "var(--ui-muted)",
  recap: "var(--ui-cat-7)",
} as const;

export type Kind = keyof typeof KIND_HUE;

/** A kind's color; a card with no class, or one the legend doesn't know, reads as social. */
export function kindHue(kind: string | undefined): string {
  return kind && kind in KIND_HUE ? KIND_HUE[kind as Kind] : KIND_HUE.social;
}

/** A prompt-book voice's color: who a line is for, or what it is. */
export const VOICE_HUE: Record<Voice, string> = {
  you: "var(--ui-muted)",
  say: "var(--ui-cat-4)",
  intro: "var(--ui-cat-4)",
  time: "var(--ui-warn)",
  do: "var(--ui-cat-3)",
  watch: "var(--ui-cat-7)",
  choice: "var(--ui-accent)",
  private: "var(--ui-cat-1)",
  fight: "var(--ui-err)",
};

/** The boss's color in the fight bar, its meter and its rails. */
export const BOSS_HUE = "var(--ui-cat-8)";

/** An entity's layer badge: what the world holds, the story so far, the DM's plans. */
export const LAYER_HUE: Record<string, string> = {
  historian: "var(--ui-ok)",
  data: "var(--ui-warn)",
  scheduler: "var(--ui-cat-1)",
};
