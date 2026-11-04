// Achievement slides for the recap deck (meta/achievements.md): one slide per PC,
// titled with the PC's name, each achievement a "New achievement!" popup. Pure:
// builds Slide objects whose `html` replaces the markdown body; slides.ts shows them.

import './achievements.css';
import { inline } from './markdown.js';
import type { PcAchievements, Slide } from './types.js';

// Slides are for players: [[Name|alias]] shows as plain alias text, never a link.
const unlink = (s: string) => s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, n: string, a?: string) => a ?? n);

function cardHtml(title: string, text: string, times: number): string {
  const again = times > 1;
  return `
    <div class="ac-card${again ? ' is-repeat' : ''}">
      <div class="ac-eyebrow">${again ? `Achievement earned again <b>×${times}</b>` : 'New achievement!'}</div>
      <div class="ac-title">${inline(unlink(title))}</div>
      ${text ? `<div class="ac-text">${inline(unlink(text))}</div>` : ''}
    </div>`;
}

// Pure: one slide per PC with at least one achievement, in ledger order.
export function achievementSlides(a: PcAchievements[] | null | undefined): Slide[] {
  return (a ?? []).filter((p) => p.items.length).map((p) => ({
    title: p.pc,
    md: '',
    html: `<div class="ac-wrap">${p.items.map((i) => cardHtml(i.title, i.text, i.times)).join('')}</div>`,
  }));
}

// Pure: the deck with achievement slides slotted in before its last slide
// ("Next time…"). Run before withReputation and withStats, so those land after them.
// No deck, no slides.
export function withAchievements(deck: Slide[], a: PcAchievements[] | null | undefined): Slide[] {
  const extra = achievementSlides(a);
  if (!deck.length || !extra.length) return deck;
  return [...deck.slice(0, -1), ...extra, deck[deck.length - 1]];
}
