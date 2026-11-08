// Sky slide for the recap deck (data/lore/calendar.md, meta/recap-slides.md): the in-world date and
// time the session ended, as a geocentric orrery plate beside a small date card. Homebrew only.
// Pure: builds a Slide whose `html` replaces the markdown body; slides.ts shows it.

import './sky.css';
import { escapeHtml } from './markdown.js';
import { plateSvg } from './sky-plate.js';
import { crawlWords, darkWords, eraWords, fidaWords, glisteningWords, hourWords } from './sky-words.js';
import type { Sky, Slide } from './types.js';

export const SKY_TITLE = 'As the sky stood';

function cartouche(s: Sky): string {
  const era = Math.floor(s.year / 1000);
  const lines = [darkWords(s.sun.trueDark), fidaWords(s.fida.age),
    glisteningWords(s.astra.next, s.astra.toGlistening)];
  const crawl = crawlWords(s.crawl, s.crawlDay);
  return `
    <div class="sk-card">
      <div class="sk-year">Year ${s.year}<span>since the Impact</span></div>
      <div class="sk-era">${escapeHtml(eraWords(era, s.astra.yearInCycle))}</div>
      ${crawl ? `<div class="sk-crawl">${escapeHtml(crawl)}</div>` : ''}
      <div class="sk-hour">${escapeHtml(hourWords(s.hour))}</div>
      <ul class="sk-notes">${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>
    </div>`;
}

// Pure: the sky slide, or none for a Strahd session or one with no in-world date.
export function skySlides(s: Sky | null | undefined): Slide[] {
  if (!s) return [];
  return [{ title: SKY_TITLE, md: '', bare: true, html: `<div class="sk-wrap">${plateSvg(s)}${cartouche(s)}</div>` }];
}

// Pure: the deck with the sky slide right after the Title slide.
export function withSky(deck: Slide[], s: Sky | null | undefined): Slide[] {
  const extra = skySlides(s);
  if (!deck.length || !extra.length) return deck;
  return [deck[0], ...extra, ...deck.slice(1)];
}
