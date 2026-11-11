// Sky slide for the recap deck (data/lore/calendar.md, meta/recap-slides.md): the in-world date and
// time the session ended, as a geocentric orrery plate beside a small date card. Homebrew only.
// Pure: builds a Slide whose `html` replaces the markdown body; slides.ts shows it.

import './sky.css';
import { escapeHtml } from './markdown.js';
import { plateSvg } from './sky-plate.js';
import { crawlWords, darkWords, elapsedWords, eraWords, fidaWords, glisteningWords, hourWords } from './sky-words.js';
import type { Sky, SkyMoment, Slide } from './types.js';

export const SKY_TITLE = 'As the sky stood';

// Hours since the impact on Aethryn's 12 x 30-day calendar (scripts/lib/sky.py absolute_day).
function absHours(m: SkyMoment): number {
  const [y, mo, d] = m.date.split('-').map(Number);
  return (y * 360 + (mo - 1) * 30 + d - 1) * 24 + m.hour;
}

// In-world hours from the previous session's moment to this one, or null with no earlier session.
export function elapsedHours(s: Sky): number | null {
  return s.prev ? absHours(s) - absHours(s.prev) : null;
}

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
  const since = elapsedWords(elapsedHours(s));
  const side = `<div class="sk-side-col">${since ? `<div class="sk-since">${escapeHtml(since)}</div>` : ''}${cartouche(s)}</div>`;
  return [{ title: SKY_TITLE, md: '', bare: true, html: `<div class="sk-wrap">${plateSvg(s)}${side}</div>` }];
}

// Pure: the deck with the sky slide right after the Title slide.
export function withSky(deck: Slide[], s: Sky | null | undefined): Slide[] {
  const extra = skySlides(s);
  if (!deck.length || !extra.length) return deck;
  return [deck[0], ...extra, ...deck.slice(1)];
}
