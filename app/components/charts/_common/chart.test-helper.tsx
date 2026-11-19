// Test harness for the chart components: mounts one with a settings slot and a
// handle, and drives what happy-dom can't (rAF-batched wheel zoom, element
// widths, ResizeObserver). Shared by the chart specs; not a spec itself.

import { act, createRef, type ComponentType } from 'react';
import { render, fireEvent } from '@testing-library/react';
import type { ChartHandle, ChartProps } from './ChartSettings.js';
import type { ChartState, TimelineData } from './types.js';

export const flush = (): Promise<void> => new Promise((r) => requestAnimationFrame(() => r()));

export function mountChart(Chart: ComponentType<ChartProps>, data: TimelineData, initialState?: ChartState) {
  const handle = createRef<ChartHandle>();
  const slot = document.createElement('div');
  const { container } = render(<Chart ref={handle} data={data} initialState={initialState} settingsSlot={slot} />);
  container.appendChild(slot); // the portal target, inside the container so cleanup() drops it too
  const all = <T extends HTMLElement>(sel: string): T[] => [...container.querySelectorAll<T>(sel)];
  return {
    container,
    slot,
    all,
    state: () => handle.current!.getState(),
    chip: (track: string) => all('.chart-chip').find((c) => c.dataset.track === track)!,
    search: (value: string) => fireEvent.change(container.querySelector<HTMLInputElement>('.chart-search')!, { target: { value } }),
  };
}

// One wheel notch on the chart's scroll viewport, then the frame it batches into.
// deltaY < 0 zooms in.
export async function wheel(viewport: HTMLElement, deltaY: number): Promise<void> {
  viewport.dispatchEvent(new WheelEvent('wheel', { deltaY, clientX: 100, bubbles: true, cancelable: true }));
  await act(flush);
}

// px of an inline style length ("1234px" → 1234).
export const px = (el: HTMLElement | null): number => parseFloat(el?.style.width ?? '') || 0;

// happy-dom reports clientWidth 0 and never fires ResizeObserver. This gives every
// .chart-root a settable width and captures the observer callback; restore() undoes both.
export function stubResize(initial: number) {
  let width = initial;
  let fire: (() => void) | null = null;
  const RealRO = globalThis.ResizeObserver;
  globalThis.ResizeObserver = class {
    constructor(cb: () => void) {
      fire = cb;
    }
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
  const proto = HTMLElement.prototype;
  const own = Object.getOwnPropertyDescriptor(proto, 'clientWidth');
  Object.defineProperty(proto, 'clientWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList.contains('chart-root') ? width : 0;
    },
  });
  return {
    async resize(next: number) {
      width = next;
      fire!();
      await act(flush); // the observer coalesces into a rAF
    },
    restore() {
      globalThis.ResizeObserver = RealRO;
      if (own) Object.defineProperty(proto, 'clientWidth', own);
      else delete (proto as { clientWidth?: number }).clientWidth;
    },
  };
}
