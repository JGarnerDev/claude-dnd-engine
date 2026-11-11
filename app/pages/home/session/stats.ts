// Stats slides for the recap deck (meta/stats.md): award cards for the session,
// then the season standings with a hall-of-fame strip, plus a one-time
// previous-season slide when this session opened a new season. Off a heavy deck, one
// compact "Worth noting" slide instead, or none (meta/recap-slides.md → Deck weight). Pure: builds
// Slide objects whose `html` replaces the markdown body; slides.ts shows them.

import './stats.css';
import { escapeHtml } from './markdown.js';
import type { DeckWeight, Slide, StatBoard, StatRow, Stats } from './types.js';

const num = (x: { value: number; rough: boolean }) => `${x.rough ? '~' : ''}${x.value}`;
const names = (pcs: string[]) => pcs.map(escapeHtml).join(' &amp; ');
// "Killing blows" -> "killing blows", but "HP healed" keeps its acronym.
const lower = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

function awardsHtml(s: Stats): string {
  const cards = s.awards.map((a) => `
    <div class="st-card${a.best.length ? ' is-best' : ''}">
      <div class="st-icon">${escapeHtml(a.icon)}</div>
      <div class="st-card-text">
      <div class="st-award">${escapeHtml(a.award)}</div>
      <div class="st-pc">${names(a.pcs)}</div>
      <div class="st-value">${num(a)} <span>${escapeHtml(lower(a.label))}</span></div>
      ${a.best.length ? `<div class="st-best">⭐ Personal best${a.pcs.length > 1 ? `: ${names(a.best)}` : ''}</div>` : ''}
      </div>
    </div>`);
  return `<div class="st-cards">${cards.join('')}</div>`;
}

function rowHtml(r: StatRow, top: number): string {
  const w = top ? Math.max(4, Math.round((r.value / top) * 100)) : 0;
  return `<div class="st-row${r.value === top ? ' is-top' : ''}"><span class="st-row-pc">${escapeHtml(r.pc)}</span>`
    + `<span class="st-bar"><i style="width:${w}%"></i></span><span class="st-row-v">${num(r)}</span></div>`;
}

function boardsHtml(boards: StatBoard[]): string {
  return `<div class="st-boards">${boards.map((b) => `
    <div class="st-board">
      <div class="st-board-h">${escapeHtml(b.icon)} ${escapeHtml(b.label)}</div>
      ${b.rows.map((r) => rowHtml(r, b.rows[0].value)).join('')}
    </div>`).join('')}</div>`;
}

function fameHtml(s: Stats): string {
  if (!s.lifetime.length) return '';
  const chips = s.lifetime.map((h) =>
    `<span class="st-chip" title="${escapeHtml(h.label)}">${escapeHtml(h.icon)} ${names(h.pcs)} <b>${num(h)}</b></span>`);
  return `<div class="st-fame"><span class="st-fame-h">Hall of fame</span>${chips.join('')}</div>`;
}

function notableHtml(s: Stats): string {
  return `<ul class="st-notable">${(s.notable ?? []).map((n) =>
    `<li><span class="st-icon">${escapeHtml(n.icon)}</span>${escapeHtml(n.text)}</li>`).join('')}</ul>`;
}

// Pure: the stats slides for one session, in deck order. Gated by deck weight
// (meta/recap-slides.md → Deck weight): the full honors + standings on a heavy deck or a
// season's first session; otherwise one compact "Worth noting" slide when something is
// notable, else nothing. A missing weight is heavy, so older decks keep the full set.
export function statsSlides(s: Stats | null | undefined, weight: DeckWeight = 'heavy'): Slide[] {
  if (!s) return [];
  const out: Slide[] = [];
  const prev = s.previousSeason;
  if (prev?.leaderboards.length) {
    out.push({
      title: prev.campaign === 'strahd' ? 'While you were in Barovia…' : 'Last season’s standings',
      md: '',
      html: `<div class="st-wrap">${boardsHtml(prev.leaderboards)}</div>`,
    });
  }
  if (weight !== 'heavy' && !s.firstOfSeason) {
    if (s.notable?.length) out.push({ title: 'Worth noting', md: '', html: `<div class="st-wrap">${notableHtml(s)}</div>` });
    return out;
  }
  if (s.awards.length) {
    out.push({ title: 'Last session’s honors', md: '', html: `<div class="st-wrap">${awardsHtml(s)}</div>` });
  }
  if (s.leaderboards.length || s.lifetime.length) {
    out.push({ title: 'The standings', md: '', html: `<div class="st-wrap">${boardsHtml(s.leaderboards)}${fameHtml(s)}</div>` });
  }
  return out;
}

// Pure: the deck with stats slotted in before its last slide (Next, or "Next time…" on
// older decks), so the deck still ends on the hook. No deck, no stats: the button stays hidden.
export function withStats(deck: Slide[], s: Stats | null | undefined, weight?: DeckWeight): Slide[] {
  const extra = statsSlides(s, weight);
  if (!deck.length || !extra.length) return deck;
  return [...deck.slice(0, -1), ...extra, deck[deck.length - 1]];
}
