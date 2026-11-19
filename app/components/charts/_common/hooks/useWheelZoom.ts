// Mouse-wheel zoom. Wheel up zooms in, down zooms out; cursor x is passed so
// the caller can anchor the zoom under the pointer. Port of controls.ts'
// enableWheelZoom. The listener is native and non-passive: React's onWheel is
// passive, so its preventDefault could not stop the viewport also scrolling.

import { useEffect, useEffectEvent, type RefObject } from 'react';
import type { ZoomKind } from '../types.js';

export function useWheelZoom(
  viewportRef: RefObject<HTMLElement | null>,
  onZoom: (kind: ZoomKind, clientX?: number) => void,
): void {
  const zoom = useEffectEvent(onZoom);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      zoom(e.deltaY < 0 ? 'in' : 'out', e.clientX);
    };
    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [viewportRef]);
}
