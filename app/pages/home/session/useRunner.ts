// The runner's walk state as a reducer over store.ts's RunnerState: the path walked
// so far (history), the Tokens box, enemy HP, the HP log and each scene's round. It
// loads from localStorage per session folder and saves after every change, so a
// reload mid-session (the dev server reloads on every entity edit) lands back on the
// same card. The hp-log.ts helpers edit state in place, so each action edits a copy.

import { useEffect, useReducer } from "react";
import type { Graph } from "./flow.js";
import { recordHit, recordReset, undo } from "./hp-log.js";
import { loadState, saveState, type RunnerState } from "./store.js";

export type RunnerAction =
  | { type: "go"; id: string }
  | { type: "back" }
  | { type: "restart"; start: string; at?: number }
  | { type: "tokens"; open: boolean }
  | {
      type: "hit";
      entry: string;
      input: string;
      before: number;
      after: number;
      start: number;
      round?: number;
      at?: number;
    }
  | { type: "reset"; before: Record<string, number>; at?: number }
  | { type: "undo"; index: number }
  | { type: "round"; scene: string; round: number };

export function runnerReducer(s: RunnerState, a: RunnerAction): RunnerState {
  switch (a.type) {
    case "go":
      return { ...s, history: [...s.history, a.id] };
    case "back":
      return s.history.length > 1 ? { ...s, history: s.history.slice(0, -1) } : s;
    case "tokens":
      return { ...s, tokensOpen: a.open };
    case "round":
      return { ...s, rounds: { ...s.rounds, [a.scene]: a.round } };
  }
  const x = structuredClone(s);
  if (a.type === "hit")
    recordHit(x, a.entry, a.input, a.before, a.after, a.start, a.at ?? Date.now(), a.round);
  else if (a.type === "reset") recordReset(x, "Reset HP", a.before, a.at ?? Date.now());
  else if (a.type === "undo") return undo(x, a.index) ? x : s;
  else {
    // Restart: back to the first card, HP to its start and rounds cleared; the log keeps the old numbers.
    x.history = [a.start];
    recordReset(x, "Restart", { ...x.hp }, a.at ?? Date.now());
    x.rounds = {};
  }
  return x;
}

// The saved walk, with ids no longer in the flow dropped. #S1_FIGHT deep-links to a
// card (appended to the walked path).
export function initialState(folder: string, g: Graph, hash: string): RunnerState {
  const s = loadState(folder);
  s.history = s.history.filter((id) => g.byId.has(id));
  if (!s.history.length && g.start) s.history = [g.start];
  if (g.byId.has(hash) && s.history[s.history.length - 1] !== hash) s.history.push(hash);
  return s;
}

export function useRunner(folder: string, g: Graph) {
  const [state, dispatch] = useReducer(runnerReducer, null, () =>
    initialState(folder, g, decodeURIComponent(location.hash.slice(1))),
  );
  const current = state.history[state.history.length - 1];
  useEffect(() => {
    saveState(folder, state);
  }, [folder, state]);
  useEffect(() => {
    history.replaceState(null, "", `#${current}`);
  }, [current]);
  return { state, current, dispatch };
}
