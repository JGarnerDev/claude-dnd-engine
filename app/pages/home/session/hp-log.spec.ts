import { describe, expect, it } from 'vitest';
import { recordHit, recordReset, sanitizeLog, undo, undoable } from './hp-log.js';
import type { HpState } from './hp-log.js';

const fresh = (): HpState => ({ hp: {}, hpLog: [] });
const ILSA = 'Archer Rider (Ilsa Hask)';
const BRASK = 'Half-orc Cask-hand (Brask)';

describe('hp log', () => {
  it('records each hit with what was typed and before → after, and forgets HP back at its start', () => {
    const s = fresh();
    recordHit(s, ILSA, '3', 5, 2, 5, 1);
    expect(s.hp).toEqual({ [ILSA]: 2 });
    expect(s.hpLog).toEqual([{ kind: 'hit', at: 1, entry: ILSA, input: '3', before: 5, after: 2 }]);
    recordHit(s, ILSA, '+3', 2, 5, 5, 2);
    expect(s.hp).toEqual({});
    expect(s.hpLog).toHaveLength(2);
  });

  it('keeps the log through a reset, and the reset itself can be undone', () => {
    const s = fresh();
    recordHit(s, ILSA, '3', 5, 2, 5, 1);
    recordHit(s, BRASK, '10', 15, 5, 15, 2);
    recordReset(s, 'Reset HP', { [ILSA]: 2, [BRASK]: 5 }, 3);
    expect(s.hp).toEqual({});
    expect(s.hpLog).toHaveLength(3);
    expect(undo(s, 2)).toBe(true);
    expect(s.hp).toEqual({ [ILSA]: 2, [BRASK]: 5 });
    expect(s.hpLog[2].undone).toBe(true);
  });

  it('skips a reset that touched nothing', () => {
    const s = fresh();
    recordReset(s, 'Restart', {}, 1);
    expect(s.hpLog).toEqual([]);
  });

  it('undoes only while nothing newer has touched that enemy, so undo walks back in order', () => {
    const s = fresh();
    recordHit(s, ILSA, '3', 5, 2, 5, 1);
    recordHit(s, BRASK, '4', 15, 11, 15, 2);
    recordHit(s, ILSA, '2', 2, 0, 5, 3);
    expect(undoable(s.hpLog, 0)).toBe(false); // Ilsa was hit again after
    expect(undoable(s.hpLog, 1)).toBe(true); // Brask's hit stands alone
    expect(undo(s, 0)).toBe(false);
    expect(undo(s, 2)).toBe(true);
    expect(s.hp[ILSA]).toBe(2);
    expect(undoable(s.hpLog, 0)).toBe(true);
    expect(undo(s, 0)).toBe(true);
    expect(s.hp[ILSA]).toBe(5);
    expect(undo(s, 0)).toBe(false); // already undone
  });

  it('blocks undoing a hit that a later reset wiped, until the reset is undone', () => {
    const s = fresh();
    recordHit(s, ILSA, '3', 5, 2, 5, 1);
    recordReset(s, 'Reset HP', { [ILSA]: 2 }, 2);
    expect(undoable(s.hpLog, 0)).toBe(false);
    undo(s, 1);
    expect(undoable(s.hpLog, 0)).toBe(true);
  });

  it('caps the log and drops junk from storage', () => {
    const s = fresh();
    for (let i = 0; i < 310; i++) recordHit(s, ILSA, '1', 5, 4, 5, i);
    expect(s.hpLog).toHaveLength(300);
    expect(s.hpLog[0].at).toBe(10);
    expect(sanitizeLog('nope')).toEqual([]);
    expect(sanitizeLog([
      { kind: 'hit', at: 1, entry: ILSA, input: '3', before: 5, after: 2, undone: true },
      { kind: 'hit', at: 'x' },
      { kind: 'reset', at: 2, label: 'Restart', before: { [ILSA]: 2, bad: 'x' } },
      null,
    ])).toEqual([
      { kind: 'hit', at: 1, entry: ILSA, input: '3', before: 5, after: 2, undone: true },
      { kind: 'reset', at: 2, label: 'Restart', before: { [ILSA]: 2 } },
    ]);
  });
});
