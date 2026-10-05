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
    saveState('a', { history: ['X', 'Y'], sceneNotesOpen: false }, s);
    expect(loadState('a', s)).toEqual({ history: ['X', 'Y'], sceneNotesOpen: false });
    expect(loadState('b', s)).toEqual({ history: [], sceneNotesOpen: true });
  });

  it('fails soft on junk or a throwing storage', () => {
    const s = memory();
    s.setItem('session-runner:a:v1', '{nope');
    expect(loadState('a', s).history).toEqual([]);
    const thrower = () => { throw new Error('blocked'); };
    const broken = { ...memory(), getItem: thrower, setItem: thrower } as Storage;
    expect(loadState('a', broken).history).toEqual([]);
    expect(() => saveState('a', { history: [], sceneNotesOpen: true }, broken)).not.toThrow();
  });
});
