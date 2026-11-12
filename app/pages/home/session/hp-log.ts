// Enemy HP change log (pure). Root CLAUDE.md → Enemy HP: every HP entry is noted
// where a misclick can't erase it. Each hit records the enemy, what the DM typed and
// before → after; Reset HP and Restart are entries too, holding the values they wiped,
// so either can be undone. The log is never cleared by a reset.
//
// An entry can be undone while nothing later (and still standing) has touched the
// same enemy, so undoing walks back one enemy's history in order and never
// overwrites a newer number.

export interface HpHit { kind: 'hit'; at: number; entry: string; input: string; before: number; after: number; undone?: boolean }
export interface HpReset { kind: 'reset'; at: number; label: string; before: Record<string, number>; undone?: boolean }
export type HpLogEntry = HpHit | HpReset;

export interface HpState {
  hp: Record<string, number>; // current HP by enemy entry; missing = its known starting HP
  hpLog: HpLogEntry[];
}

export const LOG_MAX = 300;

function push(s: HpState, e: HpLogEntry): void {
  s.hpLog.push(e);
  if (s.hpLog.length > LOG_MAX) s.hpLog.splice(0, s.hpLog.length - LOG_MAX);
}

export function recordHit(s: HpState, entry: string, input: string, before: number, after: number, start: number, at = Date.now()): void {
  if (after === start) delete s.hp[entry];
  else s.hp[entry] = after;
  push(s, { kind: 'hit', at, entry, input, before, after });
}

// `before` holds every enemy the reset touched, at the value it had.
export function recordReset(s: HpState, label: string, before: Record<string, number>, at = Date.now()): void {
  if (!Object.keys(before).length) return;
  for (const k of Object.keys(before)) delete s.hp[k];
  push(s, { kind: 'reset', at, label, before: { ...before } });
}

export const touches = (e: HpLogEntry): string[] => (e.kind === 'hit' ? [e.entry] : Object.keys(e.before));

export function undoable(log: readonly HpLogEntry[], i: number): boolean {
  const e = log[i];
  if (!e || e.undone) return false;
  const mine = new Set(touches(e));
  return !log.slice(i + 1).some((l) => !l.undone && touches(l).some((k) => mine.has(k)));
}

export function undo(s: HpState, i: number): boolean {
  if (!undoable(s.hpLog, i)) return false;
  const e = s.hpLog[i];
  if (e.kind === 'hit') s.hp[e.entry] = e.before;
  else Object.assign(s.hp, e.before);
  e.undone = true;
  return true;
}

// Storage is untrusted: keep only well-formed entries.
export function sanitizeLog(v: unknown): HpLogEntry[] {
  if (!Array.isArray(v)) return [];
  const num = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
  return v.flatMap((x): HpLogEntry[] => {
    if (!x || typeof x !== 'object') return [];
    const o = x as Record<string, unknown>;
    const undone = o.undone === true ? { undone: true } : {};
    if (o.kind === 'hit' && num(o.at) && typeof o.entry === 'string' && typeof o.input === 'string' && num(o.before) && num(o.after)) {
      return [{ kind: 'hit', at: o.at, entry: o.entry, input: o.input, before: o.before, after: o.after, ...undone }];
    }
    if (o.kind === 'reset' && num(o.at) && typeof o.label === 'string' && o.before && typeof o.before === 'object') {
      const before = Object.fromEntries(Object.entries(o.before as object).filter((e): e is [string, number] => num(e[1])));
      return [{ kind: 'reset', at: o.at, label: o.label, before, ...undone }];
    }
    return [];
  }).slice(-LOG_MAX);
}
