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

// Pure: one slide's markup.
export function slideHtml(deck: Slide[], i: number, label: string): string {
  const s = deck[i];
  return `
    <div class="sr-slides-stage${s.bare ? ' is-bare' : ''}" data-index="${i}"${s.bare ? ` aria-label="${escapeHtml(s.title)}"` : ''}>
      <div class="sr-slide-text">
        ${s.bare ? '' : `<h1 class="sr-slide-title">${escapeHtml(s.title)}</h1>`}
        <div class="sr-slide-body">${s.html ?? renderMarkdown(unlink(s.md))}</div>
      </div>
    </div>
    <footer class="sr-slides-foot">
      <span class="sr-slides-label">${escapeHtml(label)}</span>
      <span class="sr-slides-count">${i + 1} / ${deck.length}</span>
      <button type="button" data-act="close" title="Close (Esc)">Close</button>
    </footer>`;
}

// Auto-scroll for a slide taller than its box (the standings, a long
// achievements list): creep down, hold at the bottom, glide back up, hold at the
// top, repeat. Pure, so the loop below is just frames feeding it.
export type Scroll = { phase: 'down' | 'up'; wait: number; pos: number };
export const SCROLL = { speed: 40, back: 600, hold: 2.5, manual: 3, hover: 1 }; // px/s, px/s, then holds in s

export function stepScroll(s: Scroll, dt: number, max: number): Scroll {
  if (max <= 0) return s;
  if (s.wait > 0) return { ...s, wait: s.wait - dt };
  if (s.phase === 'down') {
    const pos = Math.min(max, s.pos + SCROLL.speed * dt);
    return pos >= max ? { phase: 'up', wait: SCROLL.hold, pos } : { ...s, pos };
  }
  const pos = Math.max(0, s.pos - SCROLL.back * dt);
  return pos <= 0 ? { phase: 'down', wait: SCROLL.hold, pos } : { ...s, pos };
}

// Runs the loop on every overflowing scroll box in the slide; returns a stop
// function. A scroll the loop didn't make (wheel, scrollbar drag) takes over:
// the loop waits SCROLL.manual seconds, then carries on down from there.
function autoScroll(root: HTMLElement): () => void {
  const boxes = [...root.querySelectorAll<HTMLElement>('.sr-slide-body *')].filter((b) =>
    /auto|scroll/.test(getComputedStyle(b).overflowY) && b.scrollHeight > b.clientHeight + 2);
  if (!boxes.length || matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {};
  const st = boxes.map((): Scroll => ({ phase: 'down', wait: SCROLL.hold, pos: 0 }));
  // Hovering anything with a tooltip (a hall-of-fame chip) holds the scroll, so
  // the thing being inspected doesn't slide out from under the pointer.
  let held = false;
  const onOver = (ev: PointerEvent) => { held = !!(ev.target as Element).closest?.('.sr-slide-body [title]'); };
  root.addEventListener('pointerover', onOver);
  let last = performance.now();
  let raf = requestAnimationFrame(function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    boxes.forEach((b, k) => {
      if (Math.abs(b.scrollTop - st[k].pos) > 2) st[k] = { phase: 'down', wait: SCROLL.manual, pos: b.scrollTop };
      if (held) st[k] = { ...st[k], wait: Math.max(st[k].wait, SCROLL.hover) };
      st[k] = stepScroll(st[k], dt, b.scrollHeight - b.clientHeight);
      b.scrollTop = st[k].pos;
    });
    raf = requestAnimationFrame(frame);
  });
  return () => { cancelAnimationFrame(raf); root.removeEventListener('pointerover', onOver); };
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
  let stopScroll = () => {};
  const show = (n: number) => {
    i = Math.max(0, Math.min(deck.length - 1, n));
    stopScroll();
    el.innerHTML = slideHtml(deck, i, label);
    stopScroll = autoScroll(el);
  };
  // The wheel scrolls the slide's scroll box from anywhere on the slide, not
  // only with the pointer over the box itself.
  el.addEventListener('wheel', (ev) => {
    const box = [...el.querySelectorAll<HTMLElement>('.sr-slide-body *')].find((b) => b.scrollHeight > b.clientHeight + 2
      && /auto|scroll/.test(getComputedStyle(b).overflowY));
    if (!box || box.contains(ev.target as Node)) return;
    box.scrollTop += ev.deltaY;
    ev.preventDefault();
  }, { passive: false });

  const close = () => {
    stopScroll();
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
