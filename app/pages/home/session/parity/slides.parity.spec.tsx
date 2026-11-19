// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { html, jsx } from './canon.js';
import { Slide, Slides } from '../Slides.js';
import { openSlides, slideHtml } from '../legacy/slides.js';
import type { DeckSlide } from '../deck.js';

const deck: DeckSlide[] = [
  { title: 'Session 8 The Raid', md: 'Played 2026-10-06' },
  { title: 'Previously on…', md: 'The party fell out of the light with [[Sable Wren|Sable]] and [[Ashford]].\n\n- **Dip** took the big one, see `S1_FIGHT` in Scene 2' },
  { title: 'As the sky stood', md: '', bare: true },
  { title: 'Next time…', md: 'Sable has not spoken yet.' },
];
const noop = () => {};
const key = (k: string) => document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

afterEach(() => { cleanup(); document.body.innerHTML = ''; });

describe('slides parity', () => {
  it('each slide', () => {
    for (let i = 0; i < deck.length; i++) {
      expect(jsx(<Slide deck={deck} i={i} label="Session 8" onClose={noop} />)).toBe(html(slideHtml(deck as never, i, 'Session 8')));
    }
  });

  it('keys walk the deck the same, and the page underneath never sees them', () => {
    const under = vi.fn();
    document.addEventListener('keydown', under);
    const shot = () => html(document.querySelector('.sr-slides')?.innerHTML ?? '');
    const legacy: string[] = [];
    const close = openSlides(deck as never, 'Session 8');
    for (const k of ['ArrowRight', ' ', 'End', 'ArrowRight', 'Backspace', 'Home', 'ArrowLeft', 'Enter']) { key(k); legacy.push(shot()); }
    close();

    const onClose = vi.fn();
    render(<Slides deck={deck} label="Session 8" onClose={onClose} />);
    for (const [n, k] of ['ArrowRight', ' ', 'End', 'ArrowRight', 'Backspace', 'Home', 'ArrowLeft', 'Enter'].entries()) {
      act(() => key(k));
      expect(shot()).toBe(legacy[n]);
    }
    act(() => key('Escape'));
    expect(onClose).toHaveBeenCalledOnce();
    expect(under).not.toHaveBeenCalled();
    document.removeEventListener('keydown', under);
  });

  it('an empty deck shows nothing', () => {
    render(<Slides deck={[]} label="x" onClose={noop} />);
    expect(document.querySelector('.sr-slides')).toBeNull();
  });
});
