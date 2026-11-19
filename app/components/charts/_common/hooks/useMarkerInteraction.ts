// Hover detail + click-to-open for chart markers. Port of controls.ts'
// enableMarkerInteraction. Listeners are delegated on the viewport (which
// persists across redraws) rather than per marker, and the tooltip is one node
// on <body> whose text and position are set directly — hover never re-renders.
// Markers carry data-label/date/track/source.

import { useCallback, useEffect, useEffectEvent, useRef, type RefObject } from 'react';
import '../components/controls.css';

// Beat dots (both charts), the world view's axis-straddling session bands
// (.chart-band) and the swimlane's full-height session columns (.chart-swim-sband).
const MARKERS = '.chart-marker, .chart-band, .chart-swim-sband';

// onOpen(source) runs on a click that wasn't a pan (`dragged`, from usePan).
// Returns hideTip, for the chart to drop the tip when it rebuilds its markers
// under a still pointer (mouseout never fires for a removed node).
export function useMarkerInteraction(
  viewportRef: RefObject<HTMLElement | null>,
  dragged: RefObject<boolean>,
  onOpen: (source: string) => void,
): () => void {
  const open = useEffectEvent(onOpen);
  const tipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const tip = document.createElement('div');
    tip.className = 'chart-tooltip';
    tip.hidden = true;
    const title = document.createElement('div');
    title.className = 'chart-tooltip-title';
    const meta = document.createElement('div');
    meta.className = 'chart-tooltip-meta';
    tip.append(title, meta);
    document.body.appendChild(tip);
    tipRef.current = tip;

    const markerAt = (e: Event): HTMLElement | null =>
      (e.target as Element | null)?.closest<HTMLElement>(MARKERS) ?? null;

    const onOver = (e: MouseEvent): void => {
      const m = markerAt(e);
      if (!m) return;
      const { label, date, track, source } = m.dataset;
      title.textContent = label ?? '';
      // A dot reads "date · track · click to open", a band just "click to open".
      const parts = [date, track].filter(Boolean);
      if (source) parts.push('click to open');
      meta.textContent = parts.join(' · ');
      tip.hidden = false;
    };

    // mousemove fires at pointer rate and each style write forces a reflow, so
    // write the latest coords once per frame.
    let moveRaf = 0;
    let lastX = 0;
    let lastY = 0;
    const onMove = (e: MouseEvent): void => {
      if (tip.hidden) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (moveRaf) return;
      moveRaf = requestAnimationFrame(() => {
        moveRaf = 0;
        tip.style.left = `${lastX + 14}px`;
        tip.style.top = `${lastY + 14}px`;
      });
    };

    const onOut = (e: MouseEvent): void => {
      if (markerAt(e)) tip.hidden = true;
    };
    const onLeave = (): void => {
      tip.hidden = true;
    };
    const onClick = (e: MouseEvent): void => {
      if (dragged.current) return; // it was a pan, not a tap
      const source = markerAt(e)?.dataset.source;
      if (source) open(source);
    };

    viewport.addEventListener('mouseover', onOver);
    viewport.addEventListener('mousemove', onMove);
    viewport.addEventListener('mouseout', onOut);
    viewport.addEventListener('mouseleave', onLeave);
    viewport.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(moveRaf);
      viewport.removeEventListener('mouseover', onOver);
      viewport.removeEventListener('mousemove', onMove);
      viewport.removeEventListener('mouseout', onOut);
      viewport.removeEventListener('mouseleave', onLeave);
      viewport.removeEventListener('click', onClick);
      tip.remove();
      tipRef.current = null;
    };
  }, [viewportRef, dragged]);

  return useCallback(() => {
    if (tipRef.current) tipRef.current.hidden = true;
  }, []);
}
