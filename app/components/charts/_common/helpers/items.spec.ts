import { describe, it, expect } from 'vitest';
import { breaksOf, itemsOf, spansOf } from './items.js';
import { indexEvents, type IndexedEvent } from './axis.js';
import type { TimelineEvent } from '../types.js';

const beat = (over: Partial<IndexedEvent> = {}): IndexedEvent => ({ _idx: 10, date: '1340', label: 'Beat', ...over });

describe('itemsOf', () => {
  it('maps a beat onto a chart item at its day index', () => {
    const [item] = itemsOf([beat({ track: 'faction:Cult', major: true, draft: true, source: 'factions/cult.md' })]);
    expect(item).toMatchObject({
      at: 10,
      label: 'Beat',
      weight: 'major',
      tone: 'var(--track-faction)',
      dashed: true,
      href: 'factions/cult.md',
      group: 'faction:Cult',
      meta: '1340 · faction:Cult',
    });
    expect(item.lane).toBeUndefined();
  });

  it('defaults the track to world', () => {
    const [item] = itemsOf([beat({ minor: true })]);
    expect(item.group).toBe('world');
    expect(item.weight).toBe('minor');
    expect(item.meta).toBe('1340 · world');
  });

  it('asks laneOf for each lane', () => {
    const items = itemsOf([beat({ track: 'party' }), beat({ track: 'npc' })], (e) => `lane-${e.track}`);
    expect(items.map((i) => i.lane)).toEqual(['lane-party', 'lane-npc']);
  });
});

describe('spansOf', () => {
  const ev = (date: string, label: string, session = false, extra: Partial<TimelineEvent> = {}): TimelineEvent => ({ date, label, session, ...extra });

  it('turns only sessions into spans, in order, abutting', () => {
    const idx = indexEvents([ev('1340', 'S1', true), ev('1340-06', 'Beat'), ev('1341', 'S2', true, { major: true, source: 's2.md' })]);
    const spans = spansOf(idx);
    expect(spans.map((s) => s.label)).toEqual(['S1', 'S2']);
    expect(spans[0].end).toBe(spans[1].start);
    expect(spans[1]).toMatchObject({ weight: 'major', href: 's2.md' });
  });

  it('gives no spans without sessions', () => {
    expect(spansOf(indexEvents([ev('1340', 'Beat')]))).toEqual([]);
  });
});

describe('breaksOf', () => {
  it('maps each axis break to its index and label', () => {
    const idx = indexEvents([{ date: '1340', label: 'a' }]);
    expect(breaksOf({ ...idx, breaks: [{ idx: 42, label: '~900 yrs' }] })).toEqual([{ at: 42, label: '~900 yrs' }]);
  });
});
