// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { renderRail } from './rail.js';
import { fixture } from './fixture-data.js';

describe('renderRail', () => {
  it('groups chips by scene, adds loose nodes last, and marks current and visited', () => {
    const d = fixture();
    const rail = document.createElement('nav');
    const onJump = vi.fn();
    renderRail(rail, d.nodes, d.scenes, 'S1_REST', new Set(['S1_OPEN', 'S1_REST']), onJump);
    const labels = [...rail.querySelectorAll('.sr-rail-label')].map((l) => l.textContent);
    expect(labels).toEqual(['1', '1b', '2', '3', '·']);
    expect(rail.querySelector('.sr-chip.is-current')!.getAttribute('data-id')).toBe('S1_REST');
    expect(rail.querySelectorAll('.sr-chip.is-visited')).toHaveLength(2);
    expect(rail.querySelector('.sr-chip.is-current')!.textContent).toBe('2'); // step number, not the id
    rail.querySelector<HTMLButtonElement>('[data-id="S1_FIGHT"]')!.click();
    expect(onJump).toHaveBeenCalledWith('S1_FIGHT');
  });
});
