// One entity, opened in the side panel: layer badge, description, this session's
// quick-ref for it (when the plan has one), frontmatter fields, then the body.
// Bodies are fetched from the dev server's /__entity endpoint and cached.

import { escapeHtml, inline, renderMarkdown } from './markdown.js';
import type { Known } from './markdown.js';
import { splitEntity } from './frontmatter.js';
import type { EntityRef } from './types.js';

// What a layer means at the table: historian is canon, data is unplayed pool,
// scheduler is the plan.
export const LAYER_LABEL: Record<string, string> = { historian: 'canon', data: 'pool', scheduler: 'plan', meta: 'loot' };

const cache = new Map<string, Promise<string>>();

export function fetchEntity(path: string): Promise<string> {
  let p = cache.get(path);
  if (!p) {
    p = fetch(`/__entity?path=${encodeURIComponent(path)}`).then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))));
    p.catch(() => cache.delete(path));
    cache.set(path, p);
  }
  return p;
}

export function entityHeader(e: EntityRef, root: string, quickRef: string | undefined, known: Known): string {
  const layer = e.path.split('/')[0];
  const chips = [e.type, e.subtype, e.campaign].filter(Boolean).map((c) => `<span class="sr-chiptag">${escapeHtml(c)}</span>`).join('');
  return `
    <div class="sr-ent-head">
      <h2>${escapeHtml(e.name)}</h2>
      <div class="sr-ent-tags"><span class="sr-layer" data-layer="${layer}">${LAYER_LABEL[layer] ?? layer}</span>${chips}</div>
      ${e.description ? `<p class="sr-ent-desc">${inline(e.description, known)}</p>` : ''}
      ${quickRef ? `<div class="sr-quickref"><div class="sr-quickref-label">This session</div>${renderMarkdown(quickRef, known)}</div>` : ''}
      <a class="sr-openfile" href="vscode://file/${encodeURI(`${root}/${e.path}`)}">Open in VS Code</a>
    </div>`;
}

export function entityBody(text: string, known: Known): string {
  const { fields, body } = splitEntity(text);
  const dl = fields
    .map(([k, v]) => `<dt>${escapeHtml(k.replace(/_/g, ' '))}</dt><dd>${Array.isArray(v) ? `<ul>${v.map((x) => `<li>${inline(x, known)}</li>`).join('')}</ul>` : inline(v, known)}</dd>`)
    .join('');
  return `${dl ? `<details class="sr-fields"><summary>Fields</summary><dl>${dl}</dl></details>` : ''}<div class="sr-md">${renderMarkdown(body, known)}</div>`;
}
