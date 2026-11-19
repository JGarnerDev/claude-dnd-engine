// The recap deck as Slides.tsx shows it: the folder's _slides.md slides (types.ts
// Slide, markdown only) plus the slides the runner builds from the ledgers
// (stats, reputation, achievements, sky), which carry a rendered `body` instead.

import type { ReactNode } from 'react';
import type { Slide } from './types.js';

export interface DeckSlide extends Omit<Slide, 'html'> {
  body?: ReactNode; // replaces the markdown body
}

// Slides are for players, not a way into the entity graph: [[Name|alias]] shows
// as plain alias text, never a link.
export const unlink = (s: string): string => s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, n: string, a?: string) => a ?? n);

// The deck with `extra` slotted in before its last slide (Next, or "Next time…" on
// older decks), so the deck still ends on the hook. No deck, nothing added.
export function beforeLast(deck: DeckSlide[], extra: DeckSlide[]): DeckSlide[] {
  if (!deck.length || !extra.length) return deck;
  return [...deck.slice(0, -1), ...extra, deck[deck.length - 1]];
}
