import { describe, it, expect } from 'vitest';
import { segmentEvents, syncOffsets, axisOptionsFor } from './segments.js';
import { computeAxisFrom, indexEvents } from './axis.js';
import { DEFAULT_CALENDAR } from './calendar.js';
import type { Calendar, TimelineData, TimelineEvent } from '../types.js';

const DPY = 360; // DEFAULT_CALENDAR: twelve 30-day months

// A second world's calendar: ten 40-day months, so a mix-up with the default
// (360-day) calendar shows up as a wrong day index.
const AETHRYN: Calendar = { epochLabel: 'AR', months: Array.from({ length: 10 }, (_, i) => ({ name: `M${i + 1}`, days: 40 })) };

const session = (n: number, date: string, campaign: string): TimelineEvent => ({
  date, label: `S${n} Session ${n}`, track: 'party', session: true, sessionNumber: n, campaign,
});

// Two worlds, one crossing: Strahd S1–S2 in Barovian 735, then Redwater S3 in
// Aethryn 1487, plus an ancient Aethryn beat 6,743 years before the present.
const graph = (extra: TimelineEvent[] = []): TimelineData => ({
  calendar: null,
  campaigns: [
    { slug: 'strahd', label: 'Curse of Strahd', active: false },
    { slug: 'homebrew', label: 'Redwater', active: true, calendar: AETHRYN },
  ],
  events: [
    session(1, '0735-10-20', 'strahd'),
    session(2, '0735-11-10', 'strahd'),
    { date: '0735-11-01', label: 'Strahd beat', campaign: 'strahd' },
    session(3, '1487-03-05', 'homebrew'),
    { date: '1487-03-05', label: 'Ashford beat', campaign: 'homebrew' },
    { date: '-5256', label: 'Collision', campaign: 'homebrew' },
    ...extra,
  ],
});

describe('segmentEvents — defaults', () => {
  it('is one piece at offset 0 on one ruler: the plain day index, no breaks', () => {
    const seg = segmentEvents([{ date: '0002', label: 'b' }, { date: '0001', label: 'a' }]);
    expect(seg.pieces).toHaveLength(1);
    expect(seg.pieces[0].offset).toBe(0);
    expect(seg.breaks).toEqual([]);
    expect(seg.rulers).toEqual([{ slug: '', label: '', cal: DEFAULT_CALENDAR, offset: 0 }]);
    expect(seg.events.map((e) => [e.label, e._idx])).toEqual([['a', DPY], ['b', 2 * DPY]]);
  });

  it('leaves a deep-time hole alone unless compressGaps is on', () => {
    const seg = segmentEvents([{ date: '-5256', label: 'a' }, { date: '1487', label: 'b' }]);
    expect(seg.breaks).toEqual([]);
  });
});

describe('segmentEvents — dead stretches', () => {
  const ancient: TimelineEvent[] = [
    { date: '-5256', label: 'Collision' },
    { date: '-5255', label: 'Dawn' },
    { date: '1487', label: 'Ashford' },
  ];

  it('squeezes a 6,742-year hole into one labelled break', () => {
    const seg = segmentEvents(ancient, DEFAULT_CALENDAR, { compressGaps: true });
    expect(seg.pieces).toHaveLength(2);
    expect(seg.breaks).toEqual([expect.objectContaining({ label: '6,742 years' })]);
    // Inside a piece, true spacing survives: Collision → Dawn is still one year.
    const [c, d, a] = seg.events;
    expect(d._idx - c._idx).toBe(DPY);
    // Across the break, the stretch is a small fraction of the original hole.
    expect(a._idx - d._idx).toBeLessThan(DPY);
    expect(seg.breaks[0].idx).toBeGreaterThan(d._idx);
    expect(seg.breaks[0].idx).toBeLessThan(a._idx);
  });

  it('keeps a lull inside a live campaign (short next to the 10-year floor)', () => {
    const seg = segmentEvents(
      [{ date: '0734-08-15', label: 'backstory' }, { date: '0735-10-20', label: 'S1' }, { date: '0735-11-10', label: 'S28' }],
      DEFAULT_CALENDAR,
      { compressGaps: true },
    );
    expect(seg.breaks).toEqual([]);
  });

  it('squeezes several deep-time holes, measuring each against what is left', () => {
    const seg = segmentEvents(
      [{ date: '-5000', label: 'a' }, { date: '-2000', label: 'b' }, { date: '1487', label: 'c' }],
      DEFAULT_CALENDAR,
      { compressGaps: true },
    );
    expect(seg.breaks.map((b) => b.label)).toEqual(['3,000 years', '3,487 years']);
  });
});

describe('syncOffsets', () => {
  it('anchors the first world played at 0 and lands the next world the day after the crossing', () => {
    const { events } = graph();
    const off = syncOffsets(events, DEFAULT_CALENDAR, { homebrew: AETHRYN });
    expect(off.strahd).toBe(0);
    // S2 ends on Barovian 735-11-10; S3 (Aethryn 1487-03-05) lands one day later.
    const s2 = 735 * DPY + 10 * 30 + 9;
    const s3 = 1487 * 400 + 2 * 40 + 4;
    expect(s3 + off.homebrew).toBe(s2 + 1);
  });

  it('keeps one offset per world: a return season does not re-anchor', () => {
    const { events } = graph([session(4, '0735-12-01', 'strahd')]);
    const off = syncOffsets(events, DEFAULT_CALENDAR, { homebrew: AETHRYN });
    expect(off.strahd).toBe(0);
  });

  it('orders by the label prefix when sessionNumber is absent', () => {
    const events = graph().events.map(({ sessionNumber: _n, ...e }) => e);
    expect(syncOffsets(events, DEFAULT_CALENDAR, { homebrew: AETHRYN })).toEqual(syncOffsets(graph().events, DEFAULT_CALENDAR, { homebrew: AETHRYN }));
  });

  it('gives no offset to a world without sessions', () => {
    const off = syncOffsets([...graph().events, { date: '0100', label: 'x', campaign: 'elsewhere' }], DEFAULT_CALENDAR, { homebrew: AETHRYN });
    expect(off.elsewhere).toBeUndefined();
  });
});

describe('lived-time axis', () => {
  it('puts both worlds on one line in the order the party lived them', () => {
    const data = graph();
    const idx = indexEvents(data.events, DEFAULT_CALENDAR, axisOptionsFor(data));
    const order = idx.events.map((e) => e.label);
    expect(order.indexOf('S2 Session 2')).toBeLessThan(order.indexOf('S3 Session 3'));
    // The ancient Aethryn beat is lived-time history: before Barovia's S1.
    expect(order[0]).toBe('Collision');
    expect(idx.breaks.map((b) => b.label)).toEqual(['6,743 years']);
  });

  it('builds one ruler row per synced world, the active (or primary) one first', () => {
    const data = graph();
    expect(axisOptionsFor(data).rulers?.map((r) => r.label)).toEqual(['Redwater', 'Curse of Strahd']);
    expect(axisOptionsFor({ ...data, primary: 'strahd' }).rulers?.map((r) => r.label)).toEqual(['Curse of Strahd', 'Redwater']);
  });

  it('keeps the single shared ruler when fewer than two worlds are synced', () => {
    const data: TimelineData = { events: [session(1, '0735-10-20', 'strahd')], campaigns: [{ slug: 'strahd', label: 'Curse of Strahd', active: true }] };
    expect(axisOptionsFor(data).rulers).toBeUndefined();
  });

  it('uses the sync handed down by a scoped view instead of re-deriving it', () => {
    const scoped: TimelineData = { ...graph(), events: [session(3, '1487-03-05', 'homebrew')], sync: { strahd: 0, homebrew: -1234 }, primary: 'homebrew' };
    const opts = axisOptionsFor(scoped);
    expect(opts.offsets).toEqual({ strahd: 0, homebrew: -1234 });
    expect(opts.rulers?.map((r) => [r.label, r.offset])).toEqual([['Redwater', -1234], ['Curse of Strahd', 0]]);
  });

  it('labels every row across the full width, each in its own calendar, aligned at the crossing', () => {
    const data = graph();
    const idx = indexEvents(data.events.filter((e) => e.label !== 'Collision'), DEFAULT_CALENDAR, axisOptionsFor(data));
    const axis = computeAxisFrom(idx, DEFAULT_CALENDAR, 3000);
    const rows = new Map<number, string[]>();
    for (const t of axis.ticks) rows.set(t.row ?? 0, [...(rows.get(t.row ?? 0) ?? []), t.label]);
    // Row 0 = Redwater (Aethryn, epoch label AR); row 1 = Curse of Strahd (default).
    expect(rows.get(0)?.some((l) => l.endsWith('AR'))).toBe(true);
    expect(rows.get(1)?.some((l) => l.endsWith('AR'))).toBe(false);
    expect(axis.rulers).toEqual(['Redwater', 'Curse of Strahd']);
    // The rows are synced: Barovia's month tick (row 1) sits on the beat dated that
    // same Barovian day, and Aethryn's (row 0) four days before S3 (1487-03-05).
    const xOfLabel = (label: string) => axis.xOf(idx.events.find((e) => e.label === label)!._idx);
    const tick = (row: number, label: string) => axis.ticks.find((t) => (t.row ?? 0) === row && t.label === label)!;
    expect(tick(1, 'Month 11 735').x).toBeCloseTo(xOfLabel('Strahd beat'));
    const dayPx = xOfLabel('S3 Session 3') - xOfLabel('S2 Session 2'); // the crossing: one day
    expect(xOfLabel('S3 Session 3') - tick(0, 'M3 1487 AR').x).toBeCloseTo(4 * dayPx);
  });

  it('drops ruler labels that would overlap in a row or sit under a break chip', () => {
    const data = graph();
    const idx = indexEvents(data.events, DEFAULT_CALENDAR, axisOptionsFor(data));
    const axis = computeAxisFrom(idx, DEFAULT_CALENDAR, 2000);
    const w = (l: string) => l.length * 6.5;
    for (const row of [0, 1]) {
      const ts = axis.ticks.filter((t) => (t.row ?? 0) === row).sort((a, b) => a.x - b.x);
      ts.slice(1).forEach((t, i) => expect(t.x - w(t.label) / 2).toBeGreaterThanOrEqual(ts[i].x + w(ts[i].label) / 2));
    }
    const chip = axis.breaks[0];
    expect(axis.ticks.every((t) => Math.abs(t.x - chip.x) >= w(chip.label) / 2 + w(t.label) / 2)).toBe(true);
  });

  it('never runs a ruler row across a break', () => {
    const data = graph();
    const idx = indexEvents(data.events, DEFAULT_CALENDAR, axisOptionsFor(data));
    const axis = computeAxisFrom(idx, DEFAULT_CALENDAR, 2000, 0.05, false);
    const bx = axis.breaks[0].x;
    const all = axis.ticksIn(0, axis.contentWidth);
    const ancient = all.filter((t) => /-\d{3,}/.test(t.label));
    const present = all.filter((t) => /\b(735|1487)\b/.test(t.label));
    expect(ancient.length).toBeGreaterThan(0);
    expect(present.length).toBeGreaterThan(0);
    expect(ancient.every((t) => t.x < bx)).toBe(true);
    expect(present.every((t) => t.x > bx)).toBe(true);
  });
});
