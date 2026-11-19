// Links to beats and scenes (pure). Plans name beats by id in backticks (`S2_ESCAPE`)
// and scenes by number ("Scene 4"); in the runner each becomes a chip that opens the
// beat or scene in the side panel without moving the walk. Beat chips are violet,
// numbered by the id's position ("7A"), or for older ids by step ("3", or "4.2" in
// another scene); scene chips are gold. An id that
// matches no beat in this session's flow stays plain, underlined dotted, so a typo
// or a beat from a later session shows as such. A handout card named by its path
// (`handouts/tithe-title-card.html`) opens its published artifact in a new tab; a
// card with no recorded link, or no such file, stays plain and dotted.

import { escapeHtml } from '../markdown.js';
import type { BeatRef, RefIndex, SceneRef } from '../ref-index.js';
import type { CardRef } from '../types.js';

export { buildRefIndex, sceneName, shortTitle } from '../ref-index.js';
export type { BeatRef, RefIndex, SceneRef } from '../ref-index.js';

export function beatChip(b: BeatRef): string {
  const where = /\./.test(b.num) ? `Scene ${b.num.split('.')[0]}, step ${b.num.split('.')[1]}` : `step ${b.num}`;
  return `<button type="button" class="sr-bref${b.here ? ' is-here' : ''}" data-beat="${escapeHtml(b.id)}" title="${escapeHtml(`${b.id} · ${where} · ${b.title}`)}${b.here ? ' (you are here)' : ''}"><span class="sr-bref-n">${escapeHtml(b.num)}</span>${escapeHtml(b.short)}</button>`;
}

export function sceneChip(s: SceneRef): string {
  return `<button type="button" class="sr-bref is-scene${s.here ? ' is-here' : ''}" data-scene="${escapeHtml(s.key)}" title="${escapeHtml(`Scene ${s.key} · ${s.title}`)}${s.here ? ' (you are here)' : ''}"><span class="sr-bref-n">S${escapeHtml(s.key)}</span>${escapeHtml(s.title)}</button>`;
}

export function cardLink(c: CardRef): string {
  return `<a class="sr-cardref" href="${escapeHtml(c.url)}" target="_blank" rel="noopener" title="${escapeHtml(`Open the published card · ${c.path}`)}">${escapeHtml(c.title)}</a>`;
}

const BEAT_CODE_RE = /<code>([A-Z][A-Z0-9]*_[A-Z0-9_]+)<\/code>/g;
const CARD_CODE_RE = /<code>((?:[^<\s]*\/)?handouts\/[^<\s]+\.html)<\/code>/g;
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
  return parts.join('').replace(CARD_CODE_RE, (_, p: string) => {
    const c = ix.card(p);
    if (c?.url) return cardLink(c);
    const why = c ? 'Card not published yet: no artifact link in the file' : "No such card in this session's handouts/";
    return `<code class="sr-ref-missing" title="${why}">${p}</code>`;
  }).replace(BEAT_CODE_RE, (_, id: string) => {
    const b = ix.beat(id);
    return b ? beatChip(b) : `<code class="sr-ref-missing" title="No beat with this id in this session's flow">${id}</code>`;
  });
}
