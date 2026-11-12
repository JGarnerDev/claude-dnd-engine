// Runner state persistence. The path walked so far lives in localStorage per
// session folder, so a page reload mid-session (the dev server reloads on every
// entity edit) lands back on the same card. Enemy HP rides along, keyed by the
// scene's enemy entry, so a reload mid-fight keeps the numbers, and so does the HP
// change log (hp-log.ts), which no reset clears, and each scene's round counter.
// Fail-soft: storage can be blocked.

import { sanitizeLog } from './hp-log.js';
import type { HpLogEntry } from './hp-log.js';

export interface RunnerState {
  history: string[];
  tokensOpen: boolean;
  hp: Record<string, number>;
  hpLog: HpLogEntry[];
  rounds: Record<string, number>; // round counter by scene id
}

const key = (folder: string) => `session-runner:${folder}:v1`;

export function loadState(folder: string, storage: Storage | undefined = globalThis.localStorage): RunnerState {
  const empty: RunnerState = { history: [], tokensOpen: false, hp: {}, hpLog: [], rounds: {} };
  try {
    const raw = storage?.getItem(key(folder));
    if (!raw) return empty;
    const v = JSON.parse(raw) as Partial<RunnerState>;
    return {
      history: Array.isArray(v.history) ? v.history.filter((x): x is string => typeof x === 'string') : [],
      tokensOpen: v.tokensOpen === true,
      hp: v.hp && typeof v.hp === 'object'
        ? Object.fromEntries(Object.entries(v.hp).filter((e): e is [string, number] => typeof e[1] === 'number' && e[1] >= 0))
        : {},
      hpLog: sanitizeLog(v.hpLog),
      rounds: v.rounds && typeof v.rounds === 'object'
        ? Object.fromEntries(Object.entries(v.rounds).filter((e): e is [string, number] => Number.isInteger(e[1]) && e[1] >= 1))
        : {},
    };
  } catch {
    return empty;
  }
}

export function saveState(folder: string, state: RunnerState, storage: Storage | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(key(folder), JSON.stringify(state));
  } catch {
    // storage blocked or full — the runner still works, it just forgets on reload
  }
}
