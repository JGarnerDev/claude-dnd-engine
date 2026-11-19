// Sky slide for the recap deck (data/lore/calendar.md, meta/recap-slides.md): the in-world date and
// time the session ended, as a geocentric orrery plate beside a small date card. Homebrew only.

import './sky.css';
import type { DeckSlide } from './deck.js';
import { SkyPlate } from './SkyPlate.js';
import { SKY_TITLE, elapsedHours } from './sky-time.js';
import { crawlWords, darkWords, elapsedWords, eraWords, fidaWords, glisteningWords, hourWords } from './sky-words.js';
import type { Sky } from './types.js';

function Cartouche({ s }: { s: Sky }) {
  const era = Math.floor(s.year / 1000);
  const lines = [darkWords(s.sun.trueDark), fidaWords(s.fida.age), glisteningWords(s.astra.next, s.astra.toGlistening)];
  const crawl = crawlWords(s.crawl, s.crawlDay);
  return (
    <div className="sk-card">
      <div className="sk-year">Year {s.year}<span>since the Impact</span></div>
      <div className="sk-era">{eraWords(era, s.astra.yearInCycle)}</div>
      {crawl && <div className="sk-crawl">{crawl}</div>}
      <div className="sk-hour">{hourWords(s.hour)}</div>
      <ul className="sk-notes">{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </div>
  );
}

// The sky slide, or none for a Strahd session or one with no in-world date.
export function skySlides(s: Sky | null | undefined): DeckSlide[] {
  if (!s) return [];
  const since = elapsedWords(elapsedHours(s));
  return [{
    title: SKY_TITLE,
    md: '',
    bare: true,
    body: (
      <div className="sk-wrap">
        <SkyPlate s={s} />
        <div className="sk-side-col">{since && <div className="sk-since">{since}</div>}<Cartouche s={s} /></div>
      </div>
    ),
  }];
}

// The deck with the sky slide right after the Title slide.
export function withSky(deck: DeckSlide[], s: Sky | null | undefined): DeckSlide[] {
  const extra = skySlides(s);
  if (!deck.length || !extra.length) return deck;
  return [deck[0], ...extra, ...deck.slice(1)];
}
