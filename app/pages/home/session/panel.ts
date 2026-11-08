// The side panel. Search box on top; below it either search results, an open
// entity (with a back stack), or the default view: party, entities on this card,
// entities in this scene, the act roster, what's established about the town,
// region and world, the DM's answers to the deck's mysteries, and the plan's other sections.
// Search matches entities and those mystery answers.

import { escapeHtml, inline, plainText, renderMarkdown } from './markdown.js';
import type { Known } from './markdown.js';
import { searchEntities } from './entities.js';
import { searchMysteries } from './mysteries.js';
import { isRecapSection } from './recap.js';
import type { Resolver } from './entities.js';
import { entityBody, entityHeader, fetchEntity, LAYER_LABEL } from './entity-view.js';
import type { EntityRef, Section, SessionData } from './types.js';

export interface PanelContext {
  onCard: EntityRef[];
  inScene: EntityRef[];
}

export interface Panel {
  setContext(ctx: PanelContext): void;
  open(name: string): void;
  focusSearch(): void;
  escape(): void;
}

export function mountPanel(aside: HTMLElement, data: SessionData, resolve: Resolver, known: Known): Panel {
  aside.innerHTML = `
    <input class="sr-search" type="search" placeholder="Search entities, mysteries  ( / )" aria-label="Search entities and mysteries" />
    <div class="sr-panel-body"></div>`;
  const input = aside.querySelector<HTMLInputElement>('.sr-search')!;
  const body = aside.querySelector<HTMLElement>('.sr-panel-body')!;
  let ctx: PanelContext = { onCard: [], inScene: [] };
  const stack: EntityRef[] = [];

  const row = (e: EntityRef) => `
    <button type="button" class="sr-ent" data-entity="${escapeHtml(e.name)}">
      <span class="sr-ent-name">${escapeHtml(e.name)}</span>
      <span class="sr-ent-type">${escapeHtml([e.type, e.subtype].filter(Boolean).join(' · '))} · ${LAYER_LABEL[e.path.split('/')[0]] ?? ''}</span>
      ${e.description ? `<span class="sr-ent-sub">${escapeHtml(plainText(e.description))}</span>` : ''}
    </button>`;
  const details = (s: Section) =>
    `<details class="sr-section"><summary>${escapeHtml(s.title)}</summary><div class="sr-md">${renderMarkdown(s.md, known)}</div></details>`;
  const mysteries = (list: Section[], open = false) => (list.length
    ? `<h3 class="sr-group">Mysteries</h3>${list.map((s) => (open ? details(s).replace('<details', '<details open') : details(s))).join('')}`
    : '');
  const group = (title: string, list: EntityRef[]) => (list.length ? `<h3 class="sr-group">${title}</h3>${list.map(row).join('')}` : '');

  const renderDefault = () => {
    const party = data.party.map((p) => `
      <button type="button" class="sr-pc" data-entity="${escapeHtml(p.name)}">
        <span class="sr-pc-line"><span class="sr-pc-name">${escapeHtml(p.name)}</span>
        <span class="sr-pc-class">${escapeHtml(p.raceClass)} · L${escapeHtml(p.level)} · ${escapeHtml(p.player)}</span></span>
        ${p.status ? `<span class="sr-pc-status">${inline(p.status)}</span>` : ''}
      </button>`).join('');
    const cardSet = new Set(ctx.onCard);
    const roster = data.roster.map((n) => resolve(n)).filter((e): e is EntityRef => !!e);
    const sections = data.sections.filter((s) => !isRecapSection(s.title)).map(details).join('');
    const established = (data.established ?? []).map(details).join('');
    body.innerHTML = `
      <h3 class="sr-group">Party</h3><div class="sr-party">${party}</div>
      ${group('On this card', ctx.onCard)}
      ${group('In this scene', ctx.inScene.filter((e) => !cardSet.has(e)))}
      ${group('Act roster', roster)}
      ${established ? `<h3 class="sr-group">Established</h3>${established}` : ''}
      ${mysteries(data.mysteries ?? [])}
      <h3 class="sr-group">Session plan</h3>${sections}`;
  };

  const renderEntity = (e: EntityRef) => {
    body.innerHTML = `
      <button type="button" class="sr-back">← ${stack.length > 1 ? escapeHtml(stack[stack.length - 2].name) : 'Back'}</button>
      ${entityHeader(e, data.session.root, data.quickRefs[e.name], known)}
      <div class="sr-ent-body">Loading…</div>`;
    const target = body.querySelector<HTMLElement>('.sr-ent-body')!;
    fetchEntity(e.path).then(
      (text) => { if (stack[stack.length - 1] === e) target.innerHTML = entityBody(text, known); },
      () => { target.textContent = 'Could not load this file.'; },
    );
  };

  const renderResults = () => {
    const hits = searchEntities(input.value, data.entities);
    const answers = searchMysteries(input.value, data.mysteries ?? []);
    body.innerHTML = hits.length || answers.length
      ? `${hits.map(row).join('')}${mysteries(answers, answers.length <= 3)}`
      : '<p class="sr-empty">No matches.</p>';
  };

  const render = () => {
    if (input.value.trim()) renderResults();
    else if (stack.length) renderEntity(stack[stack.length - 1]);
    else renderDefault();
    aside.scrollTop = 0;
  };

  const open = (name: string) => {
    const e = resolve(name);
    if (!e) {
      input.value = name;
      render();
      return;
    }
    input.value = '';
    stack.push(e);
    render();
  };

  input.addEventListener('input', render);
  aside.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement;
    if (t.closest('.sr-back')) {
      stack.pop();
      render();
      return;
    }
    const link = t.closest<HTMLElement>('[data-entity]');
    if (link) open(link.dataset.entity!);
  });

  render();
  return {
    setContext(next) {
      ctx = next;
      if (!stack.length && !input.value.trim()) render();
    },
    open,
    focusSearch: () => input.focus(),
    escape() {
      if (input.value) input.value = '';
      else stack.length = 0;
      input.blur();
      render();
    },
  };
}
