// The recap-slides carousel: a fullscreen, party-facing deck for the session
// before this one, opened from the "Previously on…" card and screen-shared at
// the table. The deck is DM-approved text from the folder's _slides.md
// (meta/recap-slides.md); this module only shows it.
//
// Keys: → / Space / Enter next · ← / Backspace previous · Home / End · Esc closes ·
// F toggles browser fullscreen. Keys are caught at the document's capture phase
// so the runner underneath never sees them while the deck is open.

import './slides.css';
import { escapeHtml, renderMarkdown } from './markdown.js';
import type { Slide } from './types.js';

// Slides are for players, not a way into the entity graph: [[Name|alias]] shows
// as plain alias text.
const unlink = (md: string) => md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, n: string, a?: string) => a ?? n);

// Pure: one slide's markup. The empty art column is reserved for the deferred
// per-slide pixel art, so text never reflows when images arrive.
export function slideHtml(deck: Slide[], i: number, label: string): string {
  const s = deck[i];
  return `
    <div class="sr-slides-stage" data-index="${i}">
      <div class="sr-slide-text">
        <h1 class="sr-slide-title">${escapeHtml(s.title)}</h1>
        <div class="sr-slide-body">${renderMarkdown(unlink(s.md))}</div>
      </div>
      <div class="sr-slide-art" aria-hidden="true"></div>
    </div>
    <footer class="sr-slides-foot">
      <span class="sr-slides-label">${escapeHtml(label)}</span>
      <span class="sr-slides-count">${i + 1} / ${deck.length}</span>
      <button type="button" data-act="close" title="Close (Esc)">Close</button>
    </footer>`;
}

// Opens the deck over the page; returns a function that closes it.
export function openSlides(deck: Slide[], label: string): () => void {
  if (!deck.length) return () => {};
  const el = document.createElement('div');
  el.className = 'sr-slides';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', label);
  document.body.appendChild(el);
  let i = 0;
  const show = (n: number) => {
    i = Math.max(0, Math.min(deck.length - 1, n));
    el.innerHTML = slideHtml(deck, i, label);
  };

  const close = () => {
    document.removeEventListener('keydown', onKey, true);
    if (document.fullscreenElement) void document.exitFullscreen?.();
    el.remove();
  };
  const onKey = (ev: KeyboardEvent) => {
    // Overlay removed some other way (page re-render): let go of the keyboard.
    if (!el.isConnected) return document.removeEventListener('keydown', onKey, true);
    ev.stopPropagation();
    const k = ev.key;
    if (k === 'Escape') close();
    else if (k === 'ArrowRight' || k === ' ' || k === 'Enter') show(i + 1);
    else if (k === 'ArrowLeft' || k === 'Backspace') show(i - 1);
    else if (k === 'Home') show(0);
    else if (k === 'End') show(deck.length - 1);
    else if (k === 'f' || k === 'F') {
      if (document.fullscreenElement) void document.exitFullscreen?.();
      else void el.requestFullscreen?.();
    } else return;
    ev.preventDefault();
  };
  document.addEventListener('keydown', onKey, true);
  // Click the right two-thirds to advance, the left third to go back.
  el.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement;
    if (t.closest('[data-act="close"]')) return close();
    if (t.closest('.sr-slides-foot')) return;
    show(ev.clientX < el.clientWidth / 3 ? i - 1 : i + 1);
  });
  show(0);
  return close;
}
