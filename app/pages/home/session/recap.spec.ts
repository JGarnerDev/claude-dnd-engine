// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { RECAP_ID, recapHtml, recapText, withRecap } from './recap.js';
import { fixture } from './fixture-data.js';
import type { PreviousSession } from './types.js';

const prev = (n: number, campaign: string): PreviousSession => ({
  name: `Session ${n} Before`, number: n, date: '2026-09-29', campaign,
  description: `What happened in ${n}.`, recap: `Long recap of ${n}.`, cliffhanger: `Left hanging in ${n}.`, path: `historian/sessions/Session ${n}.md`, slides: [],
});

describe('withRecap', () => {
  it('is a no-op without a previous session', () => {
    const d = fixture();
    expect(withRecap(d)).toBe(d);
  });

  it('prepends the recap card, its rail group and an edge into the first card', () => {
    const d = withRecap({ ...fixture(), previously: [prev(8, 'strahd')] });
    expect(d.nodes[0]).toMatchObject({ id: RECAP_ID, kind: 'recap', title: 'Previously on… Session 8 Before' });
    expect(d.scenes[0].key).toBe('prev');
    expect(d.edges[0]).toEqual({ from: RECAP_ID, to: 'S1_OPEN', label: '', dashed: false });
  });
});

describe('recapHtml', () => {
  it('leads with the narrative, then TL;DR party, threads and cliffhanger, then the full recap', () => {
    const el = document.createElement('div');
    el.innerHTML = recapHtml({ ...fixture(), previously: [prev(8, 'homebrew')] }, () => true);
    expect(el.querySelector('.sr-recap-lead')!.textContent).toBe('What happened in 8.');
    const tldr = [...el.querySelectorAll('.sr-recap-tldr > li > strong')].map((s) => s.textContent);
    expect(tldr).toEqual(['Party', 'Open threads', 'Cliffhanger']);
    expect(el.querySelector('.sr-recap-tldr a.sr-wiki')!.getAttribute('data-entity')).toBe('Ashford');
    expect(el.querySelector('.sr-recap-full p')!.textContent).toBe('Long recap of 8.');
    expect(el.querySelector('.sr-recap-season')).toBeNull();
  });

  it('adds "last time in this world" when the season changed', () => {
    const el = document.createElement('div');
    el.innerHTML = recapHtml({ ...fixture(), previously: [prev(8, 'strahd'), prev(5, 'homebrew')] }, () => true);
    expect(el.querySelector('.sr-recap-season h3')!.textContent).toContain('Session 5 Before');
  });
});

describe('recap slides button', () => {
  it('shows only when the previous session has a deck', () => {
    const el = document.createElement('div');
    el.innerHTML = recapHtml({ ...fixture(), previously: [prev(8, 'homebrew')] }, () => true);
    expect(el.querySelector('[data-act="slides"]')).toBeNull();
    const withDeck = { ...prev(8, 'homebrew'), slides: [{ title: 'Session 8', md: 'Played.' }] };
    el.innerHTML = recapHtml({ ...fixture(), previously: [withDeck] }, () => true);
    expect(el.querySelector('[data-act="slides"]')!.textContent).toBe('Slides');
  });
});

describe('recapText', () => {
  it('joins every previous session’s prose', () => {
    expect(recapText({ ...fixture(), previously: [prev(8, 'strahd')] })).toContain('Left hanging in 8.');
  });
});
