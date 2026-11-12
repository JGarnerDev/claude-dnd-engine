// Links to beats and scenes (pure). Plans name beats by id in backticks (`S2_ESCAPE`)
// and scenes by number ("Scene 4"); in the runner each becomes a chip that opens the
// beat or scene in the side panel without moving the walk. Beat chips are violet,
// numbered by step ("3", or "4.2" in another scene); scene chips are gold. An id that
// matches no beat in this session's flow stays plain, underlined dotted, so a typo
// or a beat from a later session shows as such.

import { escapeHtml, nodeHeadings } from './markdown.js';
import { stepTitle } from './steps.js';
import type { FlowNode, Scene } from './types.js';

export interface BeatRef {
  id: string;
  scene: string | null; // scene id
  num: string; // "3", or "4.2" outside the current scene
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

export function buildRefIndex(nodes: readonly FlowNode[], scenes: readonly Scene[], currentId: string): RefIndex {
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
      num: same || !n.scene ? String(step) : `${keyOf.get(n.scene) ?? '?'}.${step}`,
      title,
      short: shortTitle(title),
      here: n.id === currentId,
    });
  }
  const byKey = new Map(scenes.map((s) => [s.key.toLowerCase(), { id: s.id, key: s.key, title: sceneName(s.title), here: s.id === current?.scene }]));
  return { beat: (id) => beats.get(id), scene: (key) => byKey.get(key.toLowerCase()) };
}

export function beatChip(b: BeatRef): string {
  const where = /\./.test(b.num) ? `Scene ${b.num.split('.')[0]}, step ${b.num.split('.')[1]}` : `step ${b.num}`;
  return `<button type="button" class="sr-bref${b.here ? ' is-here' : ''}" data-beat="${escapeHtml(b.id)}" title="${escapeHtml(`${b.id} · ${where} · ${b.title}`)}${b.here ? ' (you are here)' : ''}"><span class="sr-bref-n">${escapeHtml(b.num)}</span>${escapeHtml(b.short)}</button>`;
}

export function sceneChip(s: SceneRef): string {
  return `<button type="button" class="sr-bref is-scene${s.here ? ' is-here' : ''}" data-scene="${escapeHtml(s.key)}" title="${escapeHtml(`Scene ${s.key} · ${s.title}`)}${s.here ? ' (you are here)' : ''}"><span class="sr-bref-n">S${escapeHtml(s.key)}</span>${escapeHtml(s.title)}</button>`;
}

const BEAT_CODE_RE = /<code>([A-Z][A-Z0-9]*_[A-Z0-9_]+)<\/code>/g;
const SCENE_RE = /\bScene (\d+[a-z]?)\b/g;

// Rendered HTML in, chips out. "Scene N" is matched in text only, never inside a
// tag, a link, a button or code; a beat id only as a whole `code` span.
export function linkRefs(html: string, ix: RefIndex): string {
  let skip = 0;
  const parts = html.split(/(<[^>]+>)/);
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.startsWith('<')) {
      if (/^<(code|a|button|h1|h2|textarea)\b/i.test(p)) skip++;
      else if (/^<\/(code|a|button|h1|h2|textarea)>/i.test(p)) skip = Math.max(0, skip - 1);
      continue;
    }
    if (!skip && p.includes('Scene ')) {
      parts[i] = p.replace(SCENE_RE, (m, key: string) => {
        const s = ix.scene(key);
        return s ? sceneChip(s) : m;
      });
    }
  }
  return parts.join('').replace(BEAT_CODE_RE, (_, id: string) => {
    const b = ix.beat(id);
    return b ? beatChip(b) : `<code class="sr-ref-missing" title="No beat with this id in this session's flow">${id}</code>`;
  });
}
