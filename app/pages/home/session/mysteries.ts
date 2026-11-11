// Mysteries & Loose Ends slide for the recap deck (meta/recap-slides.md → Mysteries & Loose Ends
// slide): the party's eight open questions, written as `- ` bullets in _slides.md under
// `## Mysteries & Loose Ends` (older decks: `## Mysteries`), ranked. Only the top
// MAX_SHOWN show; any below wait in reserve for a later deck. The runner lays them
// out as a numbered grid of cards so eight questions read at a glance when screen-shared. Pure:
// returns the deck with that slide's `html` filled; slides.ts shows it.

import './mysteries.css';
import { inline } from './markdown.js';
import type { Section, Slide } from './types.js';

export const MAX_SHOWN = 8;

const isMysteries = (s: Slide) => !s.html && /^mysteries(\s*(&|and)\s*loose ends)?$/i.test(s.title.trim());

// Pure: the questions in a markdown bullet list; an indented line continues the bullet above it.
export function questions(md: string): string[] {
  const out: string[] = [];
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (m) out.push(m[1].trim());
    else if (line.trim() && out.length) out[out.length - 1] += ` ${line.trim()}`;
  }
  return out;
}

const unlink = (s: string) => s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, n: string, a?: string) => a ?? n);

export function mysteriesHtml(qs: string[]): string {
  return `<ol class="my-grid">${qs.map((q) => `<li class="my-card"><span class="my-q">${inline(unlink(q))}</span></li>`).join('')}</ol>`;
}

// Pure: the deck with its Mysteries slide drawn as cards. A slide with no bullets is left as written.
export function withMysteries(deck: Slide[]): Slide[] {
  return deck.map((s) => {
    if (!isMysteries(s)) return s;
    const qs = questions(s.md).slice(0, MAX_SHOWN);
    return qs.length ? { ...s, html: mysteriesHtml(qs) } : s;
  });
}

// Pure: the DM answer key's entries (scheduler/campaign/_mysteries.md) a sidebar search matches.
// "myst…" lists them all; otherwise a hit on the question or the answer, case-insensitive.
export function searchMysteries(query: string, answers: Section[]): Section[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  if (q.length >= 3 && 'mysteries'.startsWith(q)) return answers;
  return answers.filter((s) => s.title.toLowerCase().includes(q) || s.md.toLowerCase().includes(q));
}
