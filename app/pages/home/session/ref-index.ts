// Links to beats, scenes and handout cards (pure; RefChips.tsx draws the chips). Plans
// name beats by id in backticks (`S2_ESCAPE`), scenes by number ("Scene 4") and cards
// by path (`handouts/tithe-title-card.html`); this resolves each against the session.

import { nodeHeadings } from './markdown.js';
import { beatPosition, stepTitle } from './step-info.js';
import type { CardRef, FlowNode, Scene } from './types.js';

export interface BeatRef {
  id: string;
  scene: string | null; // scene id
  num: string; // the id's position ("7A"); older ids: "3", or "4.2" outside the current scene
  title: string; // the plan's heading
  short: string; // chip text
  here: boolean; // the beat the DM is on
}

export interface SceneRef {
  id: string;
  key: string; // "4"
  title: string; // without the "Scene 4 —" lead
  here: boolean;
}

export interface RefIndex {
  beat(id: string): BeatRef | undefined;
  scene(key: string): SceneRef | undefined;
  card(path: string): CardRef | undefined;
}

// Chip text: the heading up to its first break, if that leaves enough to read, else
// the heading cut at a word near 28 characters.
export function shortTitle(t: string): string {
  const cuts = [t.indexOf(':'), t.indexOf(' — '), t.indexOf(',')].filter((i) => i >= 8).sort((a, b) => a - b);
  const s = cuts.length ? t.slice(0, cuts[0]) : t;
  if (s.length <= 30) return s;
  const cut = s.slice(0, 28);
  return cut.slice(0, cut.lastIndexOf(' ') > 12 ? cut.lastIndexOf(' ') : 28) + '…';
}

export const sceneName = (title: string) => title.replace(/^Scene\s+\w+\s*[—–·:-]\s*/, '');

// Cards are matched by file name, so `handouts/x.html` and a longer path to it both resolve.
const fileName = (p: string) => p.slice(p.lastIndexOf('/') + 1).toLowerCase();

export function buildRefIndex(nodes: readonly FlowNode[], scenes: readonly Scene[], currentId: string, cards: readonly CardRef[] = []): RefIndex {
  const headings = new Map<string, string>();
  for (const s of scenes) for (const [id, t] of nodeHeadings(s.md)) if (!headings.has(id)) headings.set(id, t);
  const current = nodes.find((n) => n.id === currentId);
  const keyOf = new Map(scenes.map((s) => [s.id, s.key]));
  const beats = new Map<string, BeatRef>();
  for (const n of nodes) {
    const inScene = nodes.filter((x) => x.scene === n.scene);
    const step = inScene.indexOf(n) + 1;
    const title = stepTitle(n, headings);
    const same = n.scene === current?.scene;
    beats.set(n.id, {
      id: n.id,
      scene: n.scene,
      num: beatPosition(n.id) || (same || !n.scene ? String(step) : `${keyOf.get(n.scene) ?? '?'}.${step}`),
      title,
      short: shortTitle(title),
      here: n.id === currentId,
    });
  }
  const byKey = new Map(scenes.map((s) => [s.key.toLowerCase(), { id: s.id, key: s.key, title: sceneName(s.title), here: s.id === current?.scene }]));
  const byFile = new Map(cards.map((c) => [fileName(c.path), c]));
  return { beat: (id) => beats.get(id), scene: (key) => byKey.get(key.toLowerCase()), card: (p) => byFile.get(fileName(p)) };
}
