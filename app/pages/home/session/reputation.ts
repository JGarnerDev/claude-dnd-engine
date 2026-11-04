// Reputation slide for the recap deck (meta/reputation.md): party fame up top, then each PC's
// fame and infamy with tier names, the gain last session, its top deeds, and a banner on a
// tier-up. Never the rewards. Pure: builds a Slide whose `html` replaces the markdown body;
// slides.ts shows it.

import './reputation.css';
import { escapeHtml, inline } from './markdown.js';
import type { PcReputation, RepTrack, Reputation, Slide } from './types.js';

// Slides are for players: [[Name|alias]] shows as plain alias text, never a link.
const unlink = (s: string) => s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, n: string, a?: string) => a ?? n);
const num = (n: number) => n.toLocaleString('en-US');

function trackHtml(kind: 'fame' | 'infamy', t: RepTrack): string {
  if (!t.score) return '';
  return `
      <div class="rp-track is-${kind}${t.up ? ' is-up' : ''}">
        <span class="rp-label">${kind === 'fame' ? 'Fame' : 'Infamy'}</span>
        <span class="rp-score">${num(t.score)}</span>
        <span class="rp-tier">${escapeHtml(t.tier)}</span>
        ${t.gain ? `<span class="rp-gain">+${num(t.gain)}</span>` : ''}
      </div>`;
}

function pcHtml(p: PcReputation): string {
  const ups = (['fame', 'infamy'] as const).filter((k) => p[k].up)
    .map((k) => `<div class="rp-banner is-${k}">${escapeHtml(p.pc)} is now <b>${escapeHtml(p[k].tier)}</b></div>`);
  const deeds = p.deeds.map((d) => `
      <li class="rp-deed is-${d.track === 'infamy' ? 'infamy' : 'fame'}">
        <span class="rp-pts">+${num(d.points)}</span>
        <span class="rp-text">${inline(unlink(d.text))}</span>
      </li>`);
  return `
    <div class="rp-pc">
      ${ups.join('')}
      <div class="rp-head"><span class="rp-name">${escapeHtml(p.pc)}</span>${trackHtml('fame', p.fame)}${trackHtml('infamy', p.infamy)}</div>
      ${deeds.length ? `<ul class="rp-deeds">${deeds.join('')}</ul>` : ''}
    </div>`;
}

// Pure: the reputation slide, or none when nothing is ledgered. PCs with nothing on either
// track are left out.
export function reputationSlides(r: Reputation | null | undefined): Slide[] {
  const pcs = (r?.pcs ?? []).filter((p) => p.fame.score || p.infamy.score);
  if (!r || !pcs.length) return [];
  return [{
    title: 'Reputation',
    md: '',
    html: `<div class="rp-wrap">
      <div class="rp-party">Party fame <b>${num(r.partyFame)}</b>${r.partyTier ? ` <span>${escapeHtml(r.partyTier)}</span>` : ''}</div>
      ${pcs.map(pcHtml).join('')}
    </div>`,
  }];
}

// Pure: the deck with the reputation slide slotted in before its last slide ("Next time…").
// Run after withAchievements and before withStats, so it lands between them.
export function withReputation(deck: Slide[], r: Reputation | null | undefined): Slide[] {
  const extra = reputationSlides(r);
  if (!deck.length || !extra.length) return deck;
  return [...deck.slice(0, -1), ...extra, deck[deck.length - 1]];
}
