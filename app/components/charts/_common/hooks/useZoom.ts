// Zoom level plus the scroll anchoring that goes with it, shared by both charts.
// Port of the zoom/anchor/wheel parts of the old renderers.
//
// The level is state, clamped to the chart's live maxZoom (1 = whole span fits).
// A zoom holds a point fixed: { frac } along the content and { x } px from the
// viewport's left edge, captured from the layout on screen before the change and
// applied once the rescaled canvas is in the DOM. Wheel zoom coalesces a fling's
// many events into one render per frame, anchored where the batch began. A press
// at a bound changes nothing, so it renders nothing.

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { useWheelZoom } from './useWheelZoom.js';
import { clampZoom } from '../helpers/viewstate.js';
import { ZOOM_FACTOR } from '../constants.js';
import type { ZoomKind } from '../types.js';

interface Anchor {
  frac: number;
  x: number;
}

export interface ZoomOptions {
  maxZoom: number;
  // Content width of the layout at a zoom level; 0 = nothing to lay out yet. Called
  // every render, so back it with the chart's layout cache.
  widthAt(zoom: number): number;
  initialZoom?: number; // from a loaded view, clamped like any level
  initialScroll?: number; // from a loaded view, applied once there is content
}

export interface Zoom {
  zoom: number;
  // Step once, anchored at clientX (the viewport center when omitted).
  zoomBy(kind: ZoomKind, clientX?: number): void;
  // Hold the on-screen center across the next render (a live resize).
  keepCenter(): void;
}

export function useZoom(
  viewportRef: RefObject<HTMLElement | null>,
  { maxZoom, widthAt, initialZoom = 1, initialScroll }: ZoomOptions,
): Zoom {
  const [level, setLevel] = useState(initialZoom);
  const zoom = clampZoom(level, maxZoom);
  const contentWidth = widthAt(zoom);

  // What the event handlers need from the last commit.
  const live = useRef({ zoom, maxZoom, contentWidth });
  useLayoutEffect(() => {
    live.current = { zoom, maxZoom, contentWidth };
  });

  // An anchor, or an absolute scrollLeft (a loaded view), for the next commit.
  const pending = useRef<Anchor | number | null>(initialScroll ?? null);
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const p = pending.current;
    if (!viewport || p === null || !contentWidth) return;
    pending.current = null;
    // The browser clamps an over-range value, so a stale saved pan fails soft.
    viewport.scrollLeft = typeof p === 'number' ? p : p.frac * contentWidth - p.x;
  });

  const anchorAt = useCallback(
    (clientX?: number): Anchor => {
      const viewport = viewportRef.current!;
      const left = viewport.getBoundingClientRect?.().left || 0;
      const x = clientX != null ? clientX - left : viewport.clientWidth / 2;
      const width = live.current.contentWidth;
      return { frac: width ? (viewport.scrollLeft + x) / width : 0.5, x };
    },
    [viewportRef],
  );

  const step = (base: number, kind: ZoomKind): number =>
    kind === 'in' ? Math.min(live.current.maxZoom, base * ZOOM_FACTOR) : Math.max(1, base / ZOOM_FACTOR);

  const zoomBy = (kind: ZoomKind, clientX?: number): void => {
    const base = live.current.zoom;
    const next = step(base, kind);
    if (next === base) return;
    pending.current = anchorAt(clientX);
    setLevel(next);
  };

  const wheel = useRef({ raf: 0, level: 1, anchor: null as Anchor | null });
  useWheelZoom(viewportRef, (kind, clientX) => {
    const w = wheel.current;
    const base = w.raf ? w.level : live.current.zoom;
    const next = step(base, kind);
    if (next === base) return;
    if (!w.raf) {
      w.anchor = anchorAt(clientX);
      w.raf = requestAnimationFrame(() => {
        w.raf = 0;
        if (w.level === live.current.zoom) return; // the batch netted out
        pending.current = w.anchor;
        setLevel(w.level);
      });
    }
    w.level = next;
  });
  useEffect(() => {
    const w = wheel.current;
    return () => cancelAnimationFrame(w.raf);
  }, []);

  const keepCenter = useCallback(() => {
    if (viewportRef.current) pending.current = anchorAt();
  }, [viewportRef, anchorAt]);

  return { zoom, zoomBy, keepCenter };
}
