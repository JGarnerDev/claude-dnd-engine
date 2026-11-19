// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import type { RefObject } from 'react';
import { render } from '@testing-library/react';
import { usePan } from './usePan.js';
import { Viewport } from './viewport.test-helper.js';

// Dispatch a pointer-type event with a clientX (MouseEvent carries clientX;
// the listener only cares about the type + clientX, not the constructor).
function pointer(type: string, clientX: number) {
  return new MouseEvent(type, { clientX, bubbles: true });
}

describe('usePan', () => {
  let viewport: HTMLDivElement;
  let dragged: RefObject<boolean>;
  beforeEach(() => {
    const { container } = render(
      <Viewport wire={(ref) => (dragged = usePan(ref))}>
        <button className="btn" />
        <div className="chart-swim-gutter" />
      </Viewport>,
    );
    viewport = container.querySelector('.viewport')!;
    viewport.scrollLeft = 200;
  });

  it('scrolls opposite the drag direction', () => {
    viewport.dispatchEvent(pointer('pointerdown', 100));
    window.dispatchEvent(pointer('pointermove', 60)); // dragged left 40px
    expect(viewport.scrollLeft).toBe(240); // 200 - (60 - 100)
    expect(dragged.current).toBe(true);
  });

  it('ignores movement before a press', () => {
    window.dispatchEvent(pointer('pointermove', 60));
    expect(viewport.scrollLeft).toBe(200);
  });

  it('stops panning after release', () => {
    viewport.dispatchEvent(pointer('pointerdown', 100));
    window.dispatchEvent(pointer('pointerup', 100));
    window.dispatchEvent(pointer('pointermove', 60));
    expect(viewport.scrollLeft).toBe(200);
  });

  it('does not count a jitter of 3px or less as a drag', () => {
    viewport.dispatchEvent(pointer('pointerdown', 100));
    window.dispatchEvent(pointer('pointermove', 97));
    expect(dragged.current).toBe(false);
  });

  it('toggles the grabbing class across a drag', () => {
    viewport.dispatchEvent(pointer('pointerdown', 100));
    expect(viewport.classList.contains('chart-grabbing')).toBe(true);
    window.dispatchEvent(pointer('pointerup', 100));
    expect(viewport.classList.contains('chart-grabbing')).toBe(false);
  });

  it('does not pan when the press lands on a button (so its click survives)', () => {
    viewport.querySelector('.btn')!.dispatchEvent(pointer('pointerdown', 100));
    window.dispatchEvent(pointer('pointermove', 60));
    expect(viewport.scrollLeft).toBe(200);
    expect(viewport.classList.contains('chart-grabbing')).toBe(false);
  });

  it('does not pan when the press lands in the track gutter', () => {
    viewport.querySelector('.chart-swim-gutter')!.dispatchEvent(pointer('pointerdown', 100));
    window.dispatchEvent(pointer('pointermove', 60));
    expect(viewport.scrollLeft).toBe(200);
  });
});
