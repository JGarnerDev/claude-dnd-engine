// The chart viewport's live size. null until the first measure (a layout
// effect, so before paint): the charts derive their fit density from the width,
// so they render an empty viewport until it is known rather than guess.
//
// A ResizeObserver on the root and the viewport keeps it current, coalesced to
// one update per frame. Watching the viewport too catches a vertical scrollbar
// appearing, which narrows it without resizing the root. onResize runs just
// before a live resize applies, so the chart can hold its on-screen center.

import { useEffectEvent, useLayoutEffect, useState, type RefObject } from 'react';

export interface ViewportSize {
  width: number;
  height: number;
}

// Fallbacks for a viewport that reports no size (happy-dom, a hidden tab).
const FALLBACK: ViewportSize = { width: 800, height: 600 };

export function useViewportSize(
  rootRef: RefObject<HTMLElement | null>,
  viewportRef: RefObject<HTMLElement | null>,
  onResize?: () => void,
): ViewportSize | null {
  const [size, setSize] = useState<ViewportSize | null>(null);
  const beforeResize = useEffectEvent(() => onResize?.());

  useLayoutEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!root || !viewport) return;
    // Height is read once: the label tiers it sizes are fixed for the chart's life.
    const height = root.clientHeight || FALLBACK.height;
    const width = (): number => viewport.clientWidth || root.clientWidth;
    let last = width() || FALLBACK.width;
    setSize({ width: last, height });

    if (typeof ResizeObserver === 'undefined') return;
    let raf = 0;
    const obs = new ResizeObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const w = width();
        if (!w || w === last) return;
        last = w;
        beforeResize();
        setSize({ width: w, height });
      });
    });
    obs.observe(root);
    obs.observe(viewport);
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [rootRef, viewportRef]);

  return size;
}
