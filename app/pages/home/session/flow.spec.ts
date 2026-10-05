import { describe, expect, it } from 'vitest';
import { buildGraph, mergeLabelLines, nextOptions } from './flow.js';
import { fixture } from './fixture-data.js';

const g = buildGraph(fixture());
const title = (id: string) => `T(${id})`;
const opts = (cur: string, visited: string[]) => nextOptions(g, cur, new Set([...visited, cur]), title);

describe('buildGraph', () => {
  it('starts on the first defined node and records scene starts in plan order', () => {
    expect(g.start).toBe('S1_OPEN');
    expect(g.sceneStart.get('SC1B')).toBe('S1_WOODS');
    expect(g.sceneOrder).toEqual(['SC1', 'SC1B', 'SC2', 'SC3']);
  });
});

describe('nextOptions', () => {
  it('follows a single in-scene edge', () => {
    expect(opts('S1_OPEN', [])).toEqual([{ to: 'S1_REST', label: 's1_rest', kind: 'edge' }]);
  });

  it('offers the unvisited parallel scene first when the edge leaves the scene', () => {
    const o = opts('S1_REST', ['S1_OPEN']);
    expect(o[0]).toEqual({ to: 'S1_WOODS', label: 'Cut to T(SC1B)', kind: 'scene' });
    expect(o[1]).toMatchObject({ to: 'S1_FIGHT', kind: 'edge' });
  });

  it('drops the scene cut once that scene has been visited', () => {
    const o = opts('S1_DEAL', ['S1_OPEN', 'S1_REST', 'S1_WOODS', 'S1_ANSWER']);
    expect(o.map((x) => x.to)).toEqual(['S1_FIGHT']);
    expect(o[0].label).toBe('he arrives');
  });

  it('labels fork branches from their edges', () => {
    expect(opts('S1_ANSWER', ['S1_WOODS']).map((x) => x.label)).toEqual(['yes', 'no']);
  });

  it('lists dashed out-edges as asides', () => {
    expect(opts('S1_FIGHT', [])).toContainEqual({ to: 'S1_NELLA', label: 's1_nella', kind: 'aside' });
  });

  it('surfaces a pending aside into this scene from a visited card', () => {
    expect(opts('S1_OFFER', ['S1_BITE', 'S1_FIGHT'])).toContainEqual({ to: 'S1_ANTIDOTE', label: 's1_antidote', kind: 'aside' });
    expect(opts('S1_OFFER', ['S1_FIGHT']).some((x) => x.to === 'S1_ANTIDOTE')).toBe(false);
  });

  it('returns nothing at the end of the plan', () => {
    expect(opts('S1_BOON', ['S1_OFFER'])).toEqual([]);
  });
});

describe('mergeLabelLines', () => {
  it('rejoins lines that continue a sentence', () => {
    expect(mergeLabelLines(['Save Sable now,', 'and later help her', 'The offer: protection', '— as the Spear']))
      .toEqual(['Save Sable now, and later help her', 'The offer: protection — as the Spear']);
  });
});
