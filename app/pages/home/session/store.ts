// Runner state persistence. The path walked so far lives in localStorage per
// session folder, so a page reload mid-session (the dev server reloads on every
// entity edit) lands back on the same card. Fail-soft: storage can be blocked.

export interface RunnerState {
  history: string[];
  sceneNotesOpen: boolean;
}

const key = (folder: string) => `session-runner:${folder}:v1`;

export function loadState(folder: string, storage: Storage | undefined = globalThis.localStorage): RunnerState {
  const empty: RunnerState = { history: [], sceneNotesOpen: true };
  try {
    const raw = storage?.getItem(key(folder));
    if (!raw) return empty;
    const v = JSON.parse(raw) as Partial<RunnerState>;
    return {
      history: Array.isArray(v.history) ? v.history.filter((x): x is string => typeof x === 'string') : [],
      sceneNotesOpen: v.sceneNotesOpen !== false,
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
