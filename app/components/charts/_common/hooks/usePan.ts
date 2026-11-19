// Drag-to-pan: press and drag horizontally to scroll the viewport along the
// time axis. Native overflow scroll (wheel/trackpad) still works alongside it.
// Port of controls.ts' enablePan; listeners are native, not React state, so a
// drag never re-renders the chart.
//
// Deliberately does NOT use setPointerCapture: capturing the pointer on the
// viewport retargets the ensuing `click` to the viewport, which swallows clicks
// meant for markers (open source) and density bars (zoom in). Instead it listens
// for pointermove/up on `window` while dragging — that still tracks a drag past
// the viewport edge, but leaves the click event on its real target.

import { useEffect, useRef, type RefObject } from 'react';

// Returns a ref that is true once the pointer has moved >3px since the last
// press, so click handlers can tell a pan from a tap.
export function usePan(viewportRef: RefObject<HTMLElement | null>): RefObject<boolean> {
  const dragged = useRef(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    const onMove = (e: PointerEvent): void => {
      if (!dragging) return;
      if (Math.abs(e.clientX - startX) > 3) dragged.current = true;
      viewport.scrollLeft = startScroll - (e.clientX - startX);
    };

    const end = (): void => {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('chart-grabbing');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };

    const onDown = (e: PointerEvent): void => {
      // Don't pan when the press lands on an interactive control or the sticky
      // track gutter — let those receive their own clicks.
      if ((e.target as Element | null)?.closest('button, a, input, .chart-swim-gutter')) return;
      dragging = true;
      startX = e.clientX;
      startScroll = viewport.scrollLeft;
      dragged.current = false;
      viewport.classList.add('chart-grabbing');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
    };

    viewport.addEventListener('pointerdown', onDown);
    return () => {
      end();
      viewport.removeEventListener('pointerdown', onDown);
    };
  }, [viewportRef]);

  return dragged;
}
