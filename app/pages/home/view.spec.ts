// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderTimelineView } from './view.js';
import type { TimelineData } from '../../components/charts/_common/types.js';

describe('renderTimelineView', () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    localStorage.clear();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  const data: TimelineData = {
    calendar: null,
    events: [
      { date: '1340-02-15', label: 'War begins', track: 'world', major: true },
      { date: '1341-06-01', label: 'Aelith born', track: 'character:Aelith' },
    ],
  };

  const tab = (label: string) =>
    [...container.querySelectorAll<HTMLElement>('.chart-viewtab')].find((b) => b.textContent === label)!;

  it('renders a World and Campaign tab', () => {
    renderTimelineView(container, data);
    const labels = [...container.querySelectorAll('.chart-viewtab')].map((b) => b.textContent);
    expect(labels).toEqual(['World', 'Campaign']);
  });

  it('shows the world view by default (single-axis markers, no swimlanes)', () => {
    renderTimelineView(container, data);
    expect(container.querySelector('.chart-canvas')).toBeTruthy();
    expect(container.querySelector('.chart-swim-canvas')).toBeFalsy();
    expect(tab('World').classList.contains('is-active')).toBe(true);
  });

  it('honors an explicit initial view', () => {
    renderTimelineView(container, data, 'tracks');
    expect(container.querySelector('.chart-swim-canvas')).toBeTruthy();
    expect(tab('Campaign').classList.contains('is-active')).toBe(true);
  });

  it('swaps to the swimlane view when Campaign is clicked', () => {
    renderTimelineView(container, data);
    tab('Campaign').click();
    expect(container.querySelector('.chart-swim-canvas')).toBeTruthy();
    expect(container.querySelector('.chart-canvas')).toBeFalsy();
    expect(tab('Campaign').classList.contains('is-active')).toBe(true);
    expect(tab('World').classList.contains('is-active')).toBe(false);
  });

  it('swaps back to the world view', () => {
    renderTimelineView(container, data, 'tracks');
    tab('World').click();
    expect(container.querySelector('.chart-canvas')).toBeTruthy();
    expect(container.querySelector('.chart-swim-canvas')).toBeFalsy();
  });

  it('mounts Save · Load · Settings in the header actions, in that order', () => {
    renderTimelineView(container, data);
    const actions = container.querySelector('.chart-actions')!;
    const btns = [...actions.querySelectorAll<HTMLButtonElement>('button[title]')].map((b) => b.title);
    expect(btns).toEqual(['Save view', 'Load view', 'Settings']);
  });

  it('saves the current view and restores its tab via Load', () => {
    renderTimelineView(container, data); // world tab active
    container.querySelector<HTMLInputElement>('.chart-sv-name')!.value = 'home';
    container.querySelector<HTMLButtonElement>('.chart-sv-confirm')!.click();
    tab('Campaign').click(); // drift away
    expect(container.querySelector('.chart-swim-canvas')).toBeTruthy();
    container.querySelectorAll<HTMLButtonElement>('.chart-sv-btn')[1].click(); // open Load
    container.querySelector<HTMLButtonElement>('.chart-sv-load')!.click(); // apply 'home'
    expect(container.querySelector('.chart-canvas')).toBeTruthy();
    expect(container.querySelector('.chart-swim-canvas')).toBeFalsy();
    expect(tab('World').classList.contains('is-active')).toBe(true);
  });

  it('renders the empty state (no tabs/canvas) when there are no events', () => {
    for (const empty of [null, { calendar: null, events: [] } as TimelineData]) {
      renderTimelineView(container, empty);
      expect(container.querySelector('.chart-empty')).toBeTruthy();
      expect(container.querySelector('.chart-viewtab')).toBeFalsy();
      expect(container.querySelector('.chart-canvas')).toBeFalsy();
    }
  });

  it('shows no campaign selector when the graph knows no campaigns', () => {
    renderTimelineView(container, data); // no `campaigns`
    expect(container.querySelector('.chart-campaign-select')).toBeFalsy();
  });

  describe('campaign selector', () => {
    const multi: TimelineData = {
      calendar: null,
      campaigns: [
        { slug: 'strahd', label: 'Curse of Strahd', active: true },
        { slug: 'homebrew', label: 'Homebrew Campaign', active: false },
      ],
      events: [
        { date: '1340-02-15', label: 'War begins', track: 'world', campaign: 'strahd' },
        { date: '1341-06-01', label: 'A timeless myth', track: 'world' }, // agnostic
      ],
    };
    const pick = () => container.querySelector<HTMLSelectElement>('.chart-campaign-select')!;

    it('mounts a selector defaulting to the active campaign', () => {
      renderTimelineView(container, multi);
      const sel = pick();
      expect(sel).toBeTruthy();
      expect(sel.value).toBe('strahd');
      const opts = [...sel.options].map((o) => o.textContent);
      expect(opts).toEqual(['Curse of Strahd', 'Homebrew Campaign']);
    });

    it('renders the active campaign plus agnostic beats, not other campaigns', () => {
      renderTimelineView(container, multi);
      const labels = [...container.querySelectorAll<HTMLElement>('.chart-marker')].map((m) => m.dataset.label);
      expect(labels).toContain('War begins'); // strahd
      expect(labels).toContain('A timeless myth'); // agnostic — shows under every campaign
    });

    it('scopes out other campaigns when one is selected, keeping agnostic beats', () => {
      renderTimelineView(container, multi);
      const sel = pick();
      sel.value = 'homebrew';
      sel.dispatchEvent(new Event('change'));
      // Homebrew has no own dated beats, but the agnostic beat still shows.
      const labels = [...container.querySelectorAll<HTMLElement>('.chart-marker')].map((m) => m.dataset.label);
      expect(labels).toEqual(['A timeless myth']);
      expect(labels).not.toContain('War begins');
    });

    it('renders the chart empty state when a campaign has no visible beats', () => {
      const strahdOnly: TimelineData = {
        calendar: null,
        campaigns: multi.campaigns,
        events: [{ date: '1340-02-15', label: 'War begins', track: 'world', campaign: 'strahd' }],
      };
      renderTimelineView(container, strahdOnly);
      pick().value = 'homebrew';
      pick().dispatchEvent(new Event('change'));
      expect(container.querySelector('.chart-canvas')).toBeFalsy();
      expect(container.querySelector('.chart-empty')).toBeTruthy();
      // Header + selector stay so the DM can switch back.
      expect(container.querySelector('.chart-campaign-select')).toBeTruthy();
    });

    it('Campaign (tracks) view spans all campaigns regardless of the selector', () => {
      renderTimelineView(container, multi);
      const sel = pick();
      sel.value = 'homebrew'; // would scope the World view to agnostic-only
      sel.dispatchEvent(new Event('change'));
      tab('Campaign').click();
      const labels = [...container.querySelectorAll<HTMLElement>('.chart-swim-marker')].map((m) => m.dataset.label);
      expect(labels).toContain('War begins'); // strahd beat still shows on the cross-campaign view
      expect(labels).toContain('A timeless myth');
    });

    it('hides the selector on the Campaign view and shows it on World', () => {
      renderTimelineView(container, multi, 'tracks');
      expect(pick().hidden).toBe(true);
      tab('World').click();
      expect(pick().hidden).toBe(false);
    });

  });
});
