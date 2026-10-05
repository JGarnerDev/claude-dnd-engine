// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mountPanel } from './panel.js';
import { makeResolver } from './entities.js';
import { fixture } from './fixture-data.js';

function setup() {
  const d = fixture();
  const resolve = makeResolver(d.entities);
  const aside = document.createElement('aside');
  const panel = mountPanel(aside, d, resolve, (n) => !!resolve(n));
  return { d, aside, panel };
}

describe('mountPanel', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('default view lists party, card and scene entities, the resolvable roster, and plan sections', () => {
    const { d, aside, panel } = setup();
    panel.setContext({ onCard: [d.entities[0]], inScene: [d.entities[0], d.entities[1]] });
    const groups = [...aside.querySelectorAll('.sr-group')].map((g) => g.textContent);
    expect(groups).toEqual(['Party', 'On this card', 'In this scene', 'Act roster', 'Session plan']);
    expect(aside.querySelector('.sr-pc-name')!.textContent).toBe('Iggy');
    // "In this scene" omits what is already on the card; the roster skips unresolved names.
    expect(aside.querySelectorAll('.sr-ent')).toHaveLength(1 + 1 + 2);
    expect(aside.querySelector('.sr-section summary')!.textContent).toBe('Orientation');
  });

  it('search shows ranked results, and Escape clears it', () => {
    const { aside, panel } = setup();
    const input = aside.querySelector<HTMLInputElement>('.sr-search')!;
    input.value = 'ash';
    input.dispatchEvent(new Event('input'));
    expect([...aside.querySelectorAll('.sr-ent-name')].map((e) => e.textContent)).toEqual(['Ashford']);
    panel.escape();
    expect(input.value).toBe('');
    expect(aside.querySelector('.sr-group')!.textContent).toBe('Party');
  });

  it('opens an entity with its session quick-ref, and back returns to the default view', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('---\nname: Sable Wren\n---\nBody text.')));
    const { aside, panel } = setup();
    panel.open('Sable Wren');
    expect(aside.querySelector('.sr-ent-head h2')!.textContent).toBe('Sable Wren');
    expect(aside.querySelector('.sr-quickref')).not.toBeNull();
    await vi.waitFor(() => expect(aside.querySelector('.sr-ent-body')!.textContent).toContain('Body text.'));
    aside.querySelector<HTMLButtonElement>('.sr-back')!.click();
    expect(aside.querySelector('.sr-group')!.textContent).toBe('Party');
  });

  it('an unknown name falls through to a search', () => {
    const { aside, panel } = setup();
    panel.open('Nobody Real');
    expect(aside.querySelector<HTMLInputElement>('.sr-search')!.value).toBe('Nobody Real');
    expect(aside.querySelector('.sr-empty')).not.toBeNull();
  });
});
