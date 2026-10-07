// The "Previously on…" card (pure). Every session the runner loads opens on a
// recap of the session before it, pulled from historian (the `recap`,
// `cliffhanger` and `description` fields /recap writes), so nobody has to write
// one by hand. Shape follows CLAUDE.md's Recap Format: a short narrative, then
// TL;DR bullets — party status, open threads, cliffhanger.
//
// When that session belongs to the other season, the extractor also sends the
// last session played in this season, shown as "Last time in this world".
//
// A plan may carry its own `## Recap` section — a hand-written, read-aloud
// version. It leads the card, and the plan panel leaves it out.

import { escapeHtml, inline, renderMarkdown } from './markdown.js';
import type { Known } from './markdown.js';
import type { PreviousSession, SessionData } from './types.js';

export const RECAP_ID = 'PREVIOUSLY';
const RECAP_SCENE = 'PREV';

// Prepend the recap as a synthetic first card with its own rail group. A no-op
// when historian has no earlier session (the campaign's very first night).
export function withRecap(data: SessionData): SessionData {
  const prev = data.previously?.[0];
  const first = data.nodes[0];
  if (!prev || !first) return data;
  return {
    ...data,
    nodes: [{ id: RECAP_ID, marker: null, kind: 'recap', scene: RECAP_SCENE, title: `Previously on… ${prev.name}`, lines: [], notes: [] }, ...data.nodes],
    scenes: [{ id: RECAP_SCENE, key: 'prev', title: 'Previously on…', md: '' }, ...data.scenes],
    edges: [{ from: RECAP_ID, to: first.id, label: '', dashed: false }, ...data.edges],
  };
}

export const isRecapSection = (title: string) => /^recap$/i.test(title.trim());

const writtenRecap = (data: SessionData) => data.sections.find((s) => isRecapSection(s.title))?.md ?? '';

// All the recap's prose, for finding the entities it mentions.
export function recapText(data: SessionData): string {
  return [writtenRecap(data), ...data.previously.flatMap((p) => [p.description, p.cliffhanger, p.recap])].join('\n');
}

const meta = (p: PreviousSession) =>
  `<div class="sr-recap-meta">${escapeHtml([p.date && `played ${p.date}`, p.campaign].filter(Boolean).join(' · '))}</div>`;

const full = (p: PreviousSession, known: Known) =>
  p.recap ? `<details class="sr-recap-full"><summary>Full recap — ${escapeHtml(p.name)}</summary><p>${inline(p.recap, known)}</p></details>` : '';

export function recapHtml(data: SessionData, known: Known): string {
  const [prev, inSeason] = data.previously;
  if (!prev) return '';
  const party = data.party
    .map((pc) => `<li><strong>${escapeHtml(pc.name)}</strong>${pc.status ? ` — ${inline(pc.status, known)}` : ''}</li>`)
    .join('');
  const threads = data.session.looseThreads.map((t) => `<li>${inline(t, known)}</li>`).join('');
  const written = writtenRecap(data);
  return `
    ${meta(prev)}
    ${written ? `<div class="sr-recap-written sr-md">${renderMarkdown(written, known)}</div>` : ''}
    ${prev.description && !written ? `<p class="sr-recap-lead">${inline(prev.description, known)}</p>` : ''}
    <h3 class="sr-recap-h">TL;DR</h3>
    <ul class="sr-recap-tldr">
      ${party ? `<li><strong>Party</strong><ul>${party}</ul></li>` : ''}
      ${threads ? `<li><strong>Open threads</strong><ul>${threads}</ul></li>` : ''}
      ${prev.cliffhanger ? `<li><strong>Cliffhanger</strong> — ${inline(prev.cliffhanger, known)}</li>` : ''}
    </ul>
    ${full(prev, known)}
    ${inSeason ? `
    <div class="sr-recap-season">
      <h3 class="sr-recap-h">Last time in this world — ${escapeHtml(inSeason.name)}</h3>
      ${meta(inSeason)}
      ${inSeason.description ? `<p>${inline(inSeason.description, known)}</p>` : ''}
      ${inSeason.cliffhanger ? `<p><strong>Left off</strong> — ${inline(inSeason.cliffhanger, known)}</p>` : ''}
      ${full(inSeason, known)}
    </div>` : ''}`;
}
