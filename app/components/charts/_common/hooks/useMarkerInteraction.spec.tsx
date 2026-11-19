// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { useMarkerInteraction } from './useMarkerInteraction.js';
import { Viewport } from './viewport.test-helper.js';

describe('useMarkerInteraction', () => {
  let marker: HTMLElement;
  let dragged: { current: boolean };
  let opened: string[];
  let unmount: () => void;

  beforeEach(() => {
    opened = [];
    dragged = { current: false };
    ({ unmount } = render(
      <Viewport wire={(ref) => useMarkerInteraction(ref, dragged, (src) => opened.push(src))}>
        <div
          className="chart-marker"
          data-label="Redfen burns"
          data-date="1342-08-01"
          data-track="world"
          data-source="historian/events/redfen-burns.md"
        />
      </Viewport>,
    ));
    marker = document.querySelector('.chart-marker')!;
  });

  const fire = (type: string, target: Element = marker) =>
    target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: 50, clientY: 60 }));

  const tooltip = () => document.querySelector<HTMLElement>('.chart-tooltip')!;

  it('shows a tooltip with the full label and meta on hover', () => {
    fire('mouseover');
    expect(tooltip().hidden).toBe(false);
    expect(tooltip().querySelector('.chart-tooltip-title')!.textContent).toBe('Redfen burns');
    expect(tooltip().querySelector('.chart-tooltip-meta')!.textContent).toBe('1342-08-01 · world · click to open');
  });

  it('hides the tooltip on mouseout', () => {
    fire('mouseover');
    fire('mouseout');
    expect(tooltip().hidden).toBe(true);
  });

  it('opens the source on a plain click', () => {
    fire('click');
    expect(opened).toEqual(['historian/events/redfen-burns.md']);
  });

  it('does not open when the click followed a drag (pan)', () => {
    dragged.current = true;
    fire('click');
    expect(opened).toEqual([]);
  });

  it('ignores clicks on a marker with no source', () => {
    delete marker.dataset.source;
    fire('click');
    expect(opened).toEqual([]);
  });

  it('removes its tooltip on unmount', () => {
    unmount();
    expect(document.querySelector('.chart-tooltip')).toBeNull();
  });
});
