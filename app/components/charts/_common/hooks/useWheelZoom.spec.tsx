// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { useWheelZoom } from './useWheelZoom.js';
import { Viewport } from './viewport.test-helper.js';
import type { ZoomKind } from '../types.js';

describe('useWheelZoom', () => {
  it('maps wheel up to zoom-in and down to zoom-out, passing cursor x', () => {
    const calls: [ZoomKind, number | undefined][] = [];
    const { container } = render(
      <Viewport wire={(ref) => useWheelZoom(ref, (kind, x) => calls.push([kind, x]))} />,
    );
    const el = container.querySelector('.viewport')!;
    // happy-dom's WheelEvent ctor drops deltaY/clientX, so set them on the instance.
    const wheel = (deltaY: number, clientX: number) => {
      const e = new Event('wheel', { cancelable: true });
      Object.assign(e, { deltaY, clientX });
      el.dispatchEvent(e);
      return e;
    };
    expect(wheel(-1, 250).defaultPrevented).toBe(true); // the viewport doesn't also scroll
    wheel(1, 80);
    expect(calls).toEqual([['in', 250], ['out', 80]]);
  });
});
