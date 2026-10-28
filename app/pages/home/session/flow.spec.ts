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

  // Shaped like Session 31: the chase scene's last stage comes after the fork
  // fight (an arrow back), then leads straight into the camp scene.
  const chase = buildGraph({
    nodes: [
      { id: 'FORK', scene: 'CHASE' }, { id: 'APPROACH', scene: 'CHASE' },
      { id: 'RIDER', scene: 'FIGHT' },
      { id: 'SCOUT', scene: 'CAMP' }, { id: 'CHOICE', scene: 'CAMP' },
    ].map((n) => ({ ...n, marker: 'committed', kind: 'social', title: n.id, lines: [], notes: [] })),
    edges: [
      { from: 'FORK', to: 'RIDER', label: '', dashed: false },
      { from: 'RIDER', to: 'APPROACH', label: '', dashed: false },
      { from: 'APPROACH', to: 'CHOICE', label: '', dashed: false },
      { from: 'APPROACH', to: 'SCOUT', label: 'they scout', dashed: true },
    ],
    scenes: ['CHASE', 'FIGHT', 'CAMP'].map((id) => ({ id, key: id, title: id, md: '' })),
  });
  const chaseOpts = (cur: string, visited: string[]) => nextOptions(chase, cur, new Set([...visited, cur]), title);

  it('follows an arrow back into an earlier scene instead of cutting past it', () => {
    expect(chaseOpts('RIDER', ['FORK']).map((x) => x.to)).toEqual(['APPROACH']);
  });

  it('follows an arrow into the next scene instead of cutting to its first card', () => {
    const o = chaseOpts('APPROACH', ['FORK', 'RIDER']);
    expect(o[0]).toEqual({ to: 'CHOICE', label: 'CHOICE', kind: 'edge' });
    expect(o.some((x) => x.kind === 'scene')).toBe(false);
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
