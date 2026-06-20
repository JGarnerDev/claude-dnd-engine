import { describe, it, expect } from 'vitest';
import { computeLayout } from './layout.js';
import { MARGIN } from '../../_common/constants.js';
import type { TimelineEvent } from '../../_common/types.js';

const events: TimelineEvent[] = [
  { date: '1340-02-15', label: 'Winter begins', track: 'world', major: true },
  { date: '1341-06-01', label: 'Trade pact', track: 'faction' },
  { date: '1342-06-20', label: 'Tax revolt', track: 'world', minor: true },
];

describe('computeLayout', () => {
  it('orders items chronologically regardless of input order', () => {
    const out = computeLayout([events[2], events[0], events[1]]);
    expect(out.items.map((i) => i.label)).toEqual(['Winter begins', 'Trade pact', 'Tax revolt']);
  });

  it('assigns ascending x positions', () => {
    const xs = computeLayout(events).items.map((i) => i.x);
    expect(xs[0]).toBeLessThan(xs[1]);
    expect(xs[1]).toBeLessThan(xs[2]);
  });

  it('classifies weight from major/minor flags', () => {
    const out = computeLayout(events);
    expect(out.items[0].weight).toBe('is-major');
    expect(out.items[1].weight).toBe('is-normal');
    expect(out.items[2].weight).toBe('is-minor');
  });

  it('prefixes major labels with a star', () => {
    expect(computeLayout(events).items[0].text).toBe('★ Winter begins');
  });

  it('defaults a missing track to world', () => {
    const out = computeLayout([{ date: '1340-01-01', label: 'x' }]);
    expect(out.items[0].track).toBe('world');
  });

  it('emits one tick per year across the span', () => {
    const ticks = computeLayout(events).ticks.map((t) => t.label);
    expect(ticks).toEqual(['1340', '1341', '1342']);
  });

  it('labels ticks with the calendar epoch when present', () => {
    const cal = { epochLabel: 'AE', months: Array.from({ length: 12 }, () => ({ name: '', days: 30 })) };
    const out = computeLayout([{ date: '5-01-01', label: 'x' }], cal);
    expect(out.ticks[0].label).toBe('5 AE');
  });

  it('reports empty for no events', () => {
    const out = computeLayout([]);
    expect(out.isEmpty).toBe(true);
    expect(out.items).toHaveLength(0);
  });

  it('renders sessions as bands, not dots, and keeps other beats as items', () => {
    const mixed: TimelineEvent[] = [
      { date: '1340-01-01', label: 'S1', track: 'party', session: true },
      { date: '1340-02-01', label: 'a beat', track: 'world' },
      { date: '1340-03-01', label: 'S2', track: 'party', session: true },
    ];
    const out = computeLayout(mixed);
    expect(out.sessionBands.map((b) => b.label)).toEqual(['S1', 'S2']);
    expect(out.items.map((i) => i.label)).toEqual(['a beat']); // sessions excluded from dots
    // every band ends at or before it starts is wrong — bands have positive width
    for (const b of out.sessionBands) expect(b.x1).toBeGreaterThan(b.x0);
  });

  it('still defines the time domain from sessions even when they are bands', () => {
    const onlySessions: TimelineEvent[] = [
      { date: '1340-01-01', label: 'S1', session: true },
      { date: '1342-01-01', label: 'S2', session: true },
    ];
    const out = computeLayout(onlySessions);
    expect(out.items).toHaveLength(0);
    expect(out.sessionBands).toHaveLength(2);
    expect(out.spanYears).toBeGreaterThan(2); // the 2yr session span still drives the axis
  });

  it('drives content width purely from density (no viewport floor)', () => {
    const narrow = computeLayout(events, undefined, 80);
    const wide = computeLayout(events, undefined, 320);
    expect(wide.contentWidth).toBeGreaterThan(narrow.contentWidth);
    // span ~2.35yr (+ the world right-pad headroom): at low density content is
    // still well under any sane viewport, proving the old max(viewport, …) clamp
    // is gone.
    expect(narrow.contentWidth).toBeLessThan(600);
  });

  it('keeps item x positions proportional to density', () => {
    const lo = computeLayout(events, undefined, 80).items.map((i) => i.x);
    const hi = computeLayout(events, undefined, 320).items.map((i) => i.x);
    expect(hi[2] - hi[0]).toBeGreaterThan(lo[2] - lo[0]);
  });

  it('reports span in years', () => {
    expect(computeLayout(events).spanYears).toBeGreaterThan(2);
  });

  it('insets the first beat and extends the right edge >=50% of the beat span past the last', () => {
    const out = computeLayout(events, undefined, 200);
    const xs = out.items.map((i) => i.x);
    const beatSpan = xs[xs.length - 1] - xs[0];
    const firstGap = xs[0]; // left inset: MARGIN + EDGE_PAD of the span
    const lastGap = out.contentWidth - xs[xs.length - 1]; // MARGIN + WORLD_RIGHT_PAD of the span
    // Left stays a modest EDGE_PAD inset; right carries the headroom for sessions
    // to come — the axis max sits at least 50% of the beat span past the latest.
    expect(firstGap - MARGIN).toBeLessThan(beatSpan * 0.2);
    expect(lastGap - MARGIN).toBeGreaterThanOrEqual(beatSpan * 0.5 - 1);
    expect(lastGap).toBeGreaterThan(firstGap * 2);
  });

  it('puts a single beat left of center, leaving right-edge headroom', () => {
    const out = computeLayout([{ date: '1340-06-01', label: 'lone' }], undefined, 200);
    expect(out.items[0].x).toBeLessThan(out.contentWidth / 2);
  });

  // Density gating: crowded beats drop their labels (bare on-axis dots) and only
  // reappear as the axis stretches. Keeps dense timelines readable.
  // `crowd` packs 40 beats into one month — at any sane density they all fall into
  // the same few pixel buckets, so the LOD pass rolls them into density bars.
  const crowd: TimelineEvent[] = Array.from({ length: 40 }, (_, i) => ({
    // unique dates across two months, so at high density they actually spread out
    date: `1340-${String(Math.floor(i / 28) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    label: `beat ${i}`,
    track: 'world',
  }));

  // `spaced` puts 12 beats one year apart: far enough to land in separate pixel
  // buckets (so they stay individual markers, not bars) yet close enough that
  // their 150px labels collide — exercising the per-individual label gate.
  const spaced: TimelineEvent[] = Array.from({ length: 12 }, (_, i) => ({
    date: `${1340 + i}-06-01`,
    label: `year beat ${i}`,
    track: 'world',
  }));

  it('gates labels off for crowded individuals at low density', () => {
    // px=20 → ~20px between year-apart beats, so a 156px label window holds far
    // more than the tier budget → the gate must drop some (still individual, no bars).
    const out = computeLayout(spaced, undefined, 20);
    const labelled = out.items.filter((i) => i.showLabel).length;
    expect(out.bars).toHaveLength(0); // 20px apart > cluster-off gap → still individual
    expect(labelled).toBeLessThan(out.items.length);
    expect(labelled).toBeGreaterThan(0);
  });

  it('reveals more labels as density rises (zoom in)', () => {
    const lo = computeLayout(spaced, undefined, 20).items.filter((i) => i.showLabel).length;
    const hi = computeLayout(spaced, undefined, 2000).items.filter((i) => i.showLabel).length;
    expect(hi).toBeGreaterThan(lo);
  });

  it('rolls crowded beats into density bars at low density', () => {
    const out = computeLayout(crowd, undefined, 50);
    expect(out.bars.length).toBeGreaterThan(0);
    // most of the 40 beats are aggregated into bars, not individual markers
    expect(out.items.length).toBeLessThan(crowd.length / 2);
  });

  it('dissolves bars back into individual markers as density rises', () => {
    const lo = computeLayout(crowd, undefined, 50);
    const hi = computeLayout(crowd, undefined, 8000); // beats now > a bucket apart
    expect(hi.items.length).toBeGreaterThan(lo.items.length);
    expect(hi.bars.length).toBeLessThan(lo.bars.length);
  });

  it('drops ALL bars once zoomed in enough to resolve beats (even coincident dates)', () => {
    // crowd + a duplicate of one date → a coincident pair that shares an x at any
    // zoom, so it would otherwise stay a bar forever.
    const withDup: TimelineEvent[] = [...crowd, { date: crowd[0].date, label: 'dup', track: 'world' }];
    const lo = computeLayout(withDup, undefined, 50); // crowded overview → bars
    const hi = computeLayout(withDup, undefined, 100000); // zoomed in → gate off
    expect(lo.bars.length).toBeGreaterThan(0);
    expect(hi.bars).toHaveLength(0);
    // the coincident pair now renders as two (overlapping) individual markers
    expect(hi.items.length).toBe(withDup.length);
  });

  it('rolls a crowded major into a flagged bar, but labels an isolated major', () => {
    const withMajor = [...crowd];
    withMajor[20] = { ...withMajor[20], major: true };
    const crowded = computeLayout(withMajor, undefined, 50);
    // crowded: the major is inside a density bar (flagged), not an individual label
    expect(crowded.bars.some((b) => b.hasMajor)).toBe(true);

    // isolated: a major in the spaced set still claims its label
    const sp = [...spaced];
    sp[5] = { ...sp[5], major: true };
    const out = computeLayout(sp, undefined, 50);
    expect(out.items.find((i) => i.major)!.showLabel).toBe(true);
  });

  it('puts bare (unlabelled) individuals on the axis with no offset', () => {
    const out = computeLayout(spaced, undefined, 50);
    for (const item of out.items.filter((i) => !i.showLabel)) {
      expect(item.offset).toBe(0);
    }
  });

  it('only labelled beats consume collision lanes', () => {
    const sparse = computeLayout(events).laneCount; // 3 well-spaced beats
    const dense = computeLayout(spaced, undefined, 50).laneCount;
    // Gating keeps lane stacking bounded even with crowded labels.
    expect(dense).toBeLessThan(spaced.length);
    expect(sparse).toBeGreaterThan(0);
  });
});
