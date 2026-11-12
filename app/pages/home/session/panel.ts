// The side panel: everything the DM opens lands here, with one Back stack. People
// and places, beats and scenes (a peek that doesn't move the walk, with Jump here),
// mystery answers and plan sections. With nothing open it shows home: party, who
// is on this step and in this scene, then the roster, established facts, mysteries
// and plan sections folded away.
//
// Search sits in the runner's header (`/`) and finds all of those; Enter opens the
// top result. On a wide window the panel docks beside the notes; on a narrow one it
// folds to a thin rail and slides over the notes when something opens. The pin
// button (or `\`) docks or hides it whatever the width, and is remembered.

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

export interface PeekBeat { id: string; title: string; num: string; html: string; here: boolean }
export interface PeekScene { key: string; title: string; html: string; here: boolean; first: string }
export type FlowHit = { kind: 'beat'; id: string; title: string; sub: string } | { kind: 'scene'; key: string; title: string };

// What the panel asks of the runner: beat and scene peeks, links, and moving the walk.
export interface PanelHooks {
  link(html: string): string;
  beat(id: string): PeekBeat | null;
  scene(key: string): PeekScene | null;
  where(): string; // where the DM is: "step 2, Riders on the south road"
  searchFlow(q: string): FlowHit[];
  onGo(id: string): void;
}

export interface PanelDom {
  search?: HTMLInputElement; // the header search box; without one the panel makes its own
  shell?: HTMLElement; // gets is-docked / is-open
  pin?: HTMLButtonElement;
  rail?: HTMLElement;
}

export interface Panel {
  setContext(ctx: PanelContext): void;
  open(name: string, fresh?: boolean): void;
  openBeat(id: string, fresh?: boolean): void;
  openScene(key: string, fresh?: boolean): void;
  focusSearch(): void;
  toggleDock(): void;
  escape(): void;
}

type Item =
  | { kind: 'entity'; e: EntityRef }
  | { kind: 'beat'; id: string }
  | { kind: 'scene'; key: string }
  | { kind: 'mystery'; i: number }
  | { kind: 'section'; i: number };

const NO_HOOKS: PanelHooks = { link: (h) => h, beat: () => null, scene: () => null, where: () => '', searchFlow: () => [], onGo: () => {} };
const DOCK_KEY = 'session-runner:panel-dock';
const WIDE = '(min-width: 1100px)';

function readPin(): boolean | null {
  try {
    const v = localStorage.getItem(DOCK_KEY);
    return v === 'docked' ? true : v === 'hidden' ? false : null;
  } catch { return null; }
}
function writePin(v: boolean | null): void {
  try {
    if (v === null) localStorage.removeItem(DOCK_KEY);
    else localStorage.setItem(DOCK_KEY, v ? 'docked' : 'hidden');
  } catch { /* per-viewer convenience only */ }
}

export function mountPanel(aside: HTMLElement, data: SessionData, resolve: Resolver, known: Known, dom: PanelDom = {}, hooks: PanelHooks = NO_HOOKS): Panel {
  aside.innerHTML = `${dom.search ? '' : '<input class="sr-search" type="search" placeholder="Search" aria-label="Search" />'}
    <div class="sr-pn-head"></div><div class="sr-panel-body"></div>`;
  const input = dom.search ?? aside.querySelector<HTMLInputElement>('.sr-search')!;
  const head = aside.querySelector<HTMLElement>('.sr-pn-head')!;
  const body = aside.querySelector<HTMLElement>('.sr-panel-body')!;
  let ctx: PanelContext = { onCard: [], inScene: [] };
  const stack: Item[] = [];
  const plan = data.sections.filter((s) => !isRecapSection(s.title));
  const sections: Section[] = [...(data.established ?? []), ...plan];
  const mysteryList = data.mysteries ?? [];

  // Docked or sliding: the pin wins, else the window width decides.
  let pinned = readPin();
  let slid = false;
  const media = typeof matchMedia === 'function' ? matchMedia(WIDE) : null;
  const docked = () => pinned ?? media?.matches ?? true;
  const applyDock = () => {
    dom.shell?.classList.toggle('is-docked', docked());
    dom.shell?.classList.toggle('is-open', !docked() && slid);
    if (dom.pin) dom.pin.innerHTML = `${docked() ? 'Hide panel' : 'Pin panel'}<kbd>\\</kbd>`;
  };
  media?.addEventListener?.('change', () => { slid = false; applyDock(); render(); });
  const reveal = () => { if (!docked()) { slid = true; applyDock(); } };

  const link = (html: string) => hooks.link(html);
  const row = (e: EntityRef, name = escapeHtml(e.name)) => `
    <button type="button" class="sr-ent" data-entity="${escapeHtml(e.name)}">
      <span class="sr-ent-name">${name}</span>
      <span class="sr-ent-type">${escapeHtml([e.type, e.subtype].filter(Boolean).join(' · '))} · ${LAYER_LABEL[e.path.split('/')[0]] ?? ''}</span>
      ${e.description ? `<span class="sr-ent-sub">${escapeHtml(plainText(e.description))}</span>` : ''}
    </button>`;
  const pnRow = (attr: string, title: string, sub = '') =>
    `<button type="button" class="sr-pn-row" ${attr}><span class="sr-pn-name">${title}</span>${sub ? `<span class="sr-pn-sub">${sub}</span>` : ''}</button>`;
  const group = (title: string, inner: string) => (inner ? `<h3 class="sr-group">${title}</h3>${inner}` : '');
  const fold = (title: string, n: number, inner: string) =>
    (n ? `<details class="sr-pn-fold"><summary>${title} <span class="sr-pn-count">${n}</span></summary>${inner}</details>` : '');
  const mysteryRow = (s: Section) => pnRow(`data-pn="mystery|${mysteryList.indexOf(s)}"`, escapeHtml(s.title));
  const sectionRow = (s: Section) => pnRow(`data-pn="section|${sections.indexOf(s)}"`, escapeHtml(s.title));

  const homeHtml = () => {
    const party = data.party.map((p) => `
      <button type="button" class="sr-pc" data-entity="${escapeHtml(p.name)}">
        <span class="sr-pc-line"><span class="sr-pc-name">${escapeHtml(p.name)}</span>
        <span class="sr-pc-class">${escapeHtml(p.raceClass)} · L${escapeHtml(p.level)} · ${escapeHtml(p.player)}</span></span>
        ${p.status ? `<span class="sr-pc-status">${inline(p.status)}</span>` : ''}
      </button>`).join('');
    const cardSet = new Set(ctx.onCard);
    const roster = data.roster.map((n) => resolve(n)).filter((e): e is EntityRef => !!e);
    const established = data.established ?? [];
    const more = fold('Act roster', roster.length, roster.map((e) => row(e)).join(''))
      + fold('Established', established.length, established.map(sectionRow).join(''))
      + fold('Mysteries', mysteryList.length, mysteryList.map(mysteryRow).join(''))
      + fold('Session plan', plan.length, plan.map(sectionRow).join(''));
    return `
      <h3 class="sr-group">Party</h3><div class="sr-party">${party}</div>
      ${group('On this step', ctx.onCard.map((e) => row(e)).join(''))}
      ${group('In this scene', ctx.inScene.filter((e) => !cardSet.has(e)).map((e) => row(e)).join(''))}
      ${group('More', more)}`;
  };

  const resultsHtml = (q: string) => {
    const ql = q.toLowerCase();
    const hl = (s: string) => {
      const i = s.toLowerCase().indexOf(ql);
      return i < 0 ? escapeHtml(s) : `${escapeHtml(s.slice(0, i))}<mark>${escapeHtml(s.slice(i, i + q.length))}</mark>${escapeHtml(s.slice(i + q.length))}`;
    };
    const ents = searchEntities(q, data.entities, 12); // few enough that the beats below stay in reach
    const flow = hooks.searchFlow(q);
    const answers = searchMysteries(q, mysteryList);
    const secs = sections.filter((s) => s.title.toLowerCase().includes(ql) || s.md.toLowerCase().includes(ql));
    const html = group('People and places', ents.map((e) => row(e, hl(e.name))).join(''))
      + group('Beats and scenes', flow.map((h) => (h.kind === 'scene'
        ? pnRow(`data-scene="${escapeHtml(h.key)}"`, hl(`Scene ${h.key} — ${h.title}`))
        : pnRow(`data-beat="${escapeHtml(h.id)}"`, hl(h.title), `<span class="sr-pn-id">${hl(h.id)}</span> · ${escapeHtml(h.sub)}`))).join(''))
      + group('Mysteries', answers.map((s) => pnRow(`data-pn="mystery|${mysteryList.indexOf(s)}"`, hl(s.title))).join(''))
      + group('Plan', secs.map((s) => pnRow(`data-pn="section|${sections.indexOf(s)}"`, hl(s.title))).join(''));
    return html || `<p class="sr-empty">No matches for “${escapeHtml(q)}”.</p>`;
  };

  const crumb = (it: Item) => (it.kind === 'entity' ? it.e.name
    : it.kind === 'beat' ? it.id
    : it.kind === 'scene' ? `Scene ${it.key}`
    : it.kind === 'mystery' ? 'Mystery' : 'Plan');

  const note = (here: boolean, go: string) =>
    `<div class="sr-pn-note">${here ? '<span>You’re on this step.</span>' : `<span>You’re still on ${escapeHtml(hooks.where())}.</span>${go}`}</div>`;

  const itemHtml = (it: Item): string => {
    if (it.kind === 'beat') {
      const b = hooks.beat(it.id);
      if (!b) return '<p class="sr-empty">No beat with this id in this session’s flow.</p>';
      return `<h2 class="sr-pn-title"><span class="sr-pn-num">${escapeHtml(b.num)}</span> ${inline(b.title, known)}</h2>
        ${note(b.here, `<button type="button" class="sr-pn-go" data-jump="${escapeHtml(b.id)}">Jump here</button>`)}
        ${link(b.html)}`;
    }
    if (it.kind === 'scene') {
      const s = hooks.scene(it.key);
      if (!s) return '<p class="sr-empty">No such scene in this plan.</p>';
      return `<h2 class="sr-pn-title">Scene ${escapeHtml(s.key)} — ${escapeHtml(s.title)}</h2>
        ${s.here ? '<div class="sr-pn-note"><span>You’re in this scene.</span></div>' : note(false, `<button type="button" class="sr-pn-go" data-jump="${escapeHtml(s.first)}">Cut to Scene ${escapeHtml(s.key)}</button>`)}
        ${link(s.html)}`;
    }
    if (it.kind === 'mystery') {
      const s = mysteryList[it.i];
      return `<h2 class="sr-pn-title">${escapeHtml(s.title)}</h2><div class="sr-ent-tags"><span class="sr-chiptag">mystery · DM answer</span></div>
        <div class="sr-md">${link(renderMarkdown(s.md, known))}</div>`;
    }
    if (it.kind === 'section') {
      const s = sections[it.i];
      return `<h2 class="sr-pn-title">${escapeHtml(s.title)}</h2><div class="sr-ent-tags"><span class="sr-layer" data-layer="scheduler">plan</span></div>
        <div class="sr-md">${link(renderMarkdown(s.md, known))}</div>`;
    }
    return `${link(entityHeader(it.e, data.session.root, data.quickRefs[it.e.name], known))}<div class="sr-ent-body">Loading…</div>`;
  };

  const render = () => {
    const q = input.value.trim();
    const top = stack[stack.length - 1];
    const close = docked() ? '' : '<button type="button" class="sr-pn-btn" data-pn-close aria-label="Close the panel">×</button>';
    if (q) {
      head.innerHTML = `<span class="sr-pn-crumb">Search · “${escapeHtml(q)}”</span><button type="button" class="sr-pn-btn" data-pn-clear>Clear</button>${close}`;
      body.innerHTML = resultsHtml(q);
    } else if (top) {
      head.innerHTML = `<button type="button" class="sr-pn-btn sr-back">← Back</button><span class="sr-pn-crumb">${escapeHtml(crumb(top))}</span>${docked() ? '<button type="button" class="sr-pn-btn" data-pn-home>Home</button>' : close}`;
      body.innerHTML = itemHtml(top);
      if (top.kind === 'entity') {
        const target = body.querySelector<HTMLElement>('.sr-ent-body')!;
        fetchEntity(top.e.path).then(
          (text) => { if (stack[stack.length - 1] === top) target.innerHTML = link(entityBody(text, known)); },
          () => { target.textContent = 'Could not load this file.'; },
        );
      }
    } else {
      head.innerHTML = `<span class="sr-pn-crumb">This session</span>${close}`;
      body.innerHTML = homeHtml();
    }
    if (dom.rail) {
      const last = dom.rail.querySelector<HTMLElement>('[data-rail="last"]');
      if (last) last.hidden = !stack.length;
      const n = dom.rail.querySelector('.sr-rail-n');
      if (n) n.textContent = stack.length ? String(stack.length) : '';
    }
    aside.scrollTop = 0;
  };

  const push = (it: Item, fresh: boolean) => {
    if (fresh) stack.length = 0;
    input.value = '';
    const top = stack[stack.length - 1];
    if (!top || crumb(top) !== crumb(it) || it.kind === 'mystery' || it.kind === 'section') stack.push(it);
    reveal();
    render();
  };

  const open = (name: string, fresh = false) => {
    const e = resolve(name);
    if (!e) {
      input.value = name;
      reveal();
      render();
      return;
    }
    push({ kind: 'entity', e }, fresh);
  };
  const openBeat = (id: string, fresh = false) => push({ kind: 'beat', id }, fresh);
  const openScene = (key: string, fresh = false) => push({ kind: 'scene', key }, fresh);

  input.addEventListener('input', () => { if (input.value.trim()) reveal(); render(); });
  input.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    body.querySelector<HTMLElement>('[data-entity], [data-beat], [data-scene], [data-pn]')?.click();
  });
  aside.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement;
    const b = t.closest<HTMLElement>('button, a[data-entity], [data-entity]');
    if (!b) return;
    const d = b.dataset;
    const fresh = !!input.value.trim(); // a search result starts a new trail
    if (b.matches('.sr-copy')) { void navigator.clipboard?.writeText(d.copy ?? ''); b.textContent = 'Copied'; }
    else if (b.matches('.sr-back')) { stack.pop(); render(); }
    else if (d.pnHome !== undefined) { stack.length = 0; render(); }
    else if (d.pnClear !== undefined) { input.value = ''; render(); }
    else if (d.pnClose !== undefined) { slid = false; applyDock(); render(); }
    else if (d.jump) {
      if (stack[stack.length - 1]?.kind !== 'entity') stack.pop();
      slid = false;
      applyDock();
      hooks.onGo(d.jump);
      render();
    }
    else if (d.beat) openBeat(d.beat, fresh);
    else if (d.scene) openScene(d.scene, fresh);
    else if (d.pn) {
      const [kind, i] = d.pn.split('|');
      push(kind === 'mystery' ? { kind: 'mystery', i: Number(i) } : { kind: 'section', i: Number(i) }, fresh);
    }
    else if (d.entity) open(d.entity, fresh);
  });
  dom.pin?.addEventListener('click', () => toggleDock());
  dom.rail?.addEventListener('click', (ev) => {
    const r = (ev.target as Element).closest<HTMLElement>('[data-rail]')?.dataset.rail;
    if (!r) return;
    if (r === 'home') { stack.length = 0; input.value = ''; }
    slid = true;
    applyDock();
    render();
    if (r === 'search') input.focus();
  });

  const toggleDock = () => {
    const next = !docked();
    pinned = next === (media?.matches ?? true) ? null : next; // back to the width's own choice clears the pin
    writePin(pinned);
    slid = false;
    applyDock();
    render();
  };

  applyDock();
  render();
  return {
    setContext(next) {
      ctx = next;
      const top = stack[stack.length - 1];
      if (!input.value.trim() && (!top || top.kind === 'beat' || top.kind === 'scene')) render();
    },
    open,
    openBeat,
    openScene,
    focusSearch: () => { reveal(); input.focus(); input.select(); },
    toggleDock,
    escape() {
      if (input.value) input.value = '';
      else if (!docked() && slid) { slid = false; applyDock(); }
      else stack.length = 0;
      input.blur();
      render();
    },
  };
}
