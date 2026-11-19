// Mysteries & Loose Ends slide for the recap deck (meta/recap-slides.md → Mysteries & Loose Ends
// slide): the party's eight open questions, written as `- ` bullets in _slides.md under
// `## Mysteries & Loose Ends` (older decks: `## Mysteries`), ranked. Only the top
// MAX_SHOWN show; any below wait in reserve for a later deck. The runner lays them
// out as a numbered grid of cards so eight questions read at a glance when screen-shared.

import './mysteries.css';
import { unlink, type DeckSlide } from './deck.js';
import { InlineMd } from './MarkdownView.js';
import { MAX_SHOWN, questions } from './mystery-list.js';

const isMysteries = (s: DeckSlide) => !s.body && /^mysteries(\s*(&|and)\s*loose ends)?$/i.test(s.title.trim());

export function MysteryGrid({ qs }: { qs: string[] }) {
  return (
    <ol className="my-grid">
      {qs.map((q, i) => <li key={i} className="my-card"><span className="my-q"><InlineMd md={unlink(q)} /></span></li>)}
    </ol>
  );
}

// The deck with its Mysteries slide drawn as cards. A slide with no bullets is left as written.
export function withMysteries(deck: DeckSlide[]): DeckSlide[] {
  return deck.map((s) => {
    if (!isMysteries(s)) return s;
    const qs = questions(s.md).slice(0, MAX_SHOWN);
    return qs.length ? { ...s, body: <MysteryGrid qs={qs} /> } : s;
  });
}
