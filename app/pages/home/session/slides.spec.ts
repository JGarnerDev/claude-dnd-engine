// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { openSlides, slideHtml } from './slides.js';
import type { Slide } from './types.js';

const deck: Slide[] = [
  { title: 'Session 8 The Raid', md: 'Played 2026-10-06' },
  { title: 'Previously on…', md: 'The party fell out of the light.\n\n- **Dip** took the big one' },
  { title: 'Next time…', md: 'Sable has not spoken yet.' },
];
const overlay = () => document.querySelector<HTMLElement>('.sr-slides');
const title = () => overlay()!.querySelector('.sr-slide-title')!.textContent;
const key = (k: string) => document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

afterEach(() => { document.body.innerHTML = ''; });

describe('slideHtml', () => {
  it('renders the headline, markdown body and the counter', () => {
    const el = document.createElement('div');
    el.innerHTML = slideHtml(deck, 1, 'Session 8');
    expect(el.querySelector('.sr-slide-title')!.textContent).toBe('Previously on…');
    expect(el.querySelector('.sr-slide-body li strong')!.textContent).toBe('Dip');
    expect(el.querySelector('.sr-slides-count')!.textContent).toBe('2 / 3');
  });

  it('uses a generated slide’s html in place of its markdown body', () => {
    const el = document.createElement('div');
    el.innerHTML = slideHtml([{ title: 'Stats', md: 'ignored', html: '<div class="st-cards"></div>' }], 0, '');
    expect(el.querySelector('.sr-slide-body .st-cards')).not.toBeNull();
    expect(el.querySelector('.sr-slide-body')!.textContent).not.toContain('ignored');
  });

  it('shows wikilinks as plain text, never entity links', () => {
    const el = document.createElement('div');
    el.innerHTML = slideHtml([{ title: 'T', md: 'Met [[Sable Wren]] at [[Ashford|the ford]]' }], 0, '');
    expect(el.querySelector('a')).toBeNull();
    expect(el.querySelector('.sr-slide-body')!.textContent!.trim()).toBe('Met Sable Wren at the ford');
  });
});

describe('openSlides', () => {
  it('does nothing for an empty deck', () => {
    openSlides([], 'none');
    expect(overlay()).toBeNull();
  });

  it('steps with the arrow keys, clamped at both ends, and Home / End jump', () => {
    openSlides(deck, 'Session 8');
    expect(title()).toBe('Session 8 The Raid');
    key('ArrowLeft');
    expect(title()).toBe('Session 8 The Raid');
    key('ArrowRight');
    key(' ');
    expect(title()).toBe('Next time…');
    key('ArrowRight');
    expect(overlay()!.querySelector('.sr-slides-count')!.textContent).toBe('3 / 3');
    key('Home');
    expect(title()).toBe('Session 8 The Raid');
    key('End');
    expect(title()).toBe('Next time…');
  });

  it('keeps its keys from reaching the page underneath', () => {
    let seen = 0;
    const onPage = () => { seen++; };
    document.addEventListener('keydown', onPage);
    const close = openSlides(deck, 'Session 8');
    key('ArrowRight');
    expect(seen).toBe(0);
    close();
    key('ArrowRight');
    expect(seen).toBe(1);
    document.removeEventListener('keydown', onPage);
  });

  it('closes on Esc and on the close button', () => {
    openSlides(deck, 'Session 8');
    key('Escape');
    expect(overlay()).toBeNull();
    openSlides(deck, 'Session 8');
    overlay()!.querySelector<HTMLButtonElement>('[data-act="close"]')!.click();
    expect(overlay()).toBeNull();
  });
});
