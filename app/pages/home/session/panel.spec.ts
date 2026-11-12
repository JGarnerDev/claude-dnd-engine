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
    expect(groups).toEqual(['Party', 'On this step', 'In this scene', 'More']);
    expect(aside.querySelector('.sr-pc-name')!.textContent).toBe('Iggy');
    // "In this scene" omits what is already on the card; the roster skips unresolved names.
    expect(aside.querySelectorAll('.sr-ent')).toHaveLength(1 + 1 + 2);
    // The roster and the plan sections fold away under More.
    expect([...aside.querySelectorAll('.sr-pn-fold > summary')].map((x) => x.textContent)).toEqual(['Act roster 2', 'Session plan 1']);
    aside.querySelector<HTMLButtonElement>('[data-pn="section|0"]')!.click();
    expect(aside.querySelector('.sr-pn-title')!.textContent).toBe('Orientation');
    expect(aside.querySelector('.sr-md')!.textContent).toBe('Five PCs.');
  });

  it('shows the established town / region / world facts above the plan sections', () => {
    const d = fixture();
    d.established = [{ title: 'Town — Ashford', md: '- A ford-town on the [[Ashford]] creek' }];
    const resolve = makeResolver(d.entities);
    const aside = document.createElement('aside');
    mountPanel(aside, d, resolve, (n) => !!resolve(n));
    const folds = [...aside.querySelectorAll('.sr-pn-fold > summary')].map((x) => x.textContent);
    expect(folds.slice(-2)).toEqual(['Established 1', 'Session plan 1']);
    aside.querySelector<HTMLButtonElement>('[data-pn="section|0"]')!.click();
    expect(aside.querySelector('.sr-pn-title')!.textContent).toBe('Town — Ashford');
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

  it('peeks at a beat with one Back stack, and Jump here moves the walk', () => {
    const d = fixture();
    const resolve = makeResolver(d.entities);
    const aside = document.createElement('aside');
    const onGo = vi.fn();
    const panel = mountPanel(aside, d, resolve, (n) => !!resolve(n), {}, {
      link: (h) => h,
      beat: (id) => ({ id, title: `Beat ${id}`, num: '2', html: '<p class="peek">Body.</p>', here: false }),
      scene: () => null,
      where: () => 'step 1, Open',
      searchFlow: (q) => (q === 'fig' ? [{ kind: 'beat', id: 'S1_FIGHT', title: 'The fight', sub: 'step 3' }] : []),
      onGo,
    });
    panel.open('Sable Wren');
    panel.openBeat('S1_FIGHT');
    expect(aside.querySelector('.sr-pn-title')!.textContent).toBe('2 Beat S1_FIGHT');
    expect(aside.querySelector('.sr-pn-note')!.textContent).toContain('still on step 1, Open');
    aside.querySelector<HTMLButtonElement>('.sr-back')!.click();
    expect(aside.querySelector('.sr-ent-head h2')!.textContent).toBe('Sable Wren');
    panel.openBeat('S1_FIGHT', true); // from the notes: a fresh trail
    aside.querySelector<HTMLButtonElement>('[data-jump]')!.click();
    expect(onGo).toHaveBeenCalledWith('S1_FIGHT');
    expect(aside.querySelector('.sr-group')!.textContent).toBe('Party');
    // Search finds beats, and Enter opens the top result.
    const input = aside.querySelector<HTMLInputElement>('.sr-search')!;
    input.value = 'fig';
    input.dispatchEvent(new Event('input'));
    expect(aside.querySelector('[data-beat="S1_FIGHT"]')).not.toBeNull();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(aside.querySelector('.sr-pn-crumb')!.textContent).toBe('S1_FIGHT');
  });

  it('docks on a wide window or slides over on a narrow one, and the pin overrides and is kept', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: () => {} }));
    localStorage.clear();
    const d = fixture();
    const resolve = makeResolver(d.entities);
    const shell = document.createElement('div');
    const aside = document.createElement('aside');
    const pin = document.createElement('button');
    const panel = mountPanel(aside, d, resolve, (n) => !!resolve(n), { shell, pin });
    expect(shell.className).toBe('');
    panel.open('Sable Wren');
    expect(shell.classList.contains('is-open')).toBe(true);
    panel.escape();
    expect(shell.classList.contains('is-open')).toBe(false);
    expect(aside.querySelector('.sr-ent-head h2')!.textContent).toBe('Sable Wren'); // still there to slide back to
    pin.click();
    expect(shell.classList.contains('is-docked')).toBe(true);
    expect(pin.textContent).toContain('Hide panel');
    const again = document.createElement('div');
    mountPanel(document.createElement('aside'), d, resolve, (n) => !!resolve(n), { shell: again });
    expect(again.classList.contains('is-docked')).toBe(true);
    localStorage.clear();
  });

  it('an unknown name falls through to a search', () => {
    const { aside, panel } = setup();
    panel.open('Nobody Real');
    expect(aside.querySelector<HTMLInputElement>('.sr-search')!.value).toBe('Nobody Real');
    expect(aside.querySelector('.sr-empty')).not.toBeNull();
  });
});
