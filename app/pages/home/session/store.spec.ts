import { describe, expect, it } from 'vitest';
import { loadState, saveState } from './store.js';

function memory(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    get length() { return m.size; },
  };
}

describe('store', () => {
  it('round-trips state per session folder', () => {
    const s = memory();
    const hpLog = [{ kind: 'hit' as const, at: 1, entry: 'Drover (Varrick Tenn)', input: '8', before: 20, after: 12 }];
    saveState('a', { history: ['X', 'Y'], tokensOpen: true, hp: { 'Drover (Varrick Tenn)': 12 }, hpLog, rounds: { SC3: 4 } }, s);
    expect(loadState('a', s)).toEqual({ history: ['X', 'Y'], tokensOpen: true, hp: { 'Drover (Varrick Tenn)': 12 }, hpLog, rounds: { SC3: 4 } });
    expect(loadState('b', s)).toEqual({ history: [], tokensOpen: false, hp: {}, hpLog: [], rounds: {} });
  });

  it('fails soft on junk or a throwing storage', () => {
    const s = memory();
    s.setItem('session-runner:a:v1', '{nope');
    expect(loadState('a', s).history).toEqual([]);
    const thrower = () => { throw new Error('blocked'); };
    const broken = { ...memory(), getItem: thrower, setItem: thrower } as Storage;
    expect(loadState('a', broken).history).toEqual([]);
    expect(() => saveState('a', { history: [], tokensOpen: false, hp: {}, hpLog: [], rounds: {} }, broken)).not.toThrow();
  });

  it('loads state saved before the HP tracker, and drops junk HP', () => {
    const s = memory();
    s.setItem('session-runner:a:v1', JSON.stringify({ history: ['X'], tokensOpen: false }));
    expect(loadState('a', s).hp).toEqual({});
    expect(loadState('a', s).hpLog).toEqual([]);
    s.setItem('session-runner:a:v1', JSON.stringify({ history: [], hp: { ok: 3, bad: 'x', neg: -1 } }));
    expect(loadState('a', s).hp).toEqual({ ok: 3 });
  });
});
