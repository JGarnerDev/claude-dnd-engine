// Session runner host: header (with search), map rail, the card column and the
// side panel. Owns the walked path (history) and the keyboard.
//
// Keys: → / Enter / Space take the first branch · 1–9 pick a branch or aside ·
// ← / Backspace step back · / focuses search · \ docks or hides the panel ·
// Esc clears search, closes the slide-over, then closes what's open.

import './session.css';
import { buildGraph, nextOptions } from './flow.js';
import { findMentions, makeResolver, mentionIndex } from './entities.js';
import { renderScene } from './scene.js';
import { parseCombatants } from './combatants.js';
import { renderRail } from './rail.js';
import { mountPanel } from './panel.js';
import { loadState, saveState } from './store.js';
import { recordHit, recordReset, undo } from './hp-log.js';
import { escapeHtml } from './markdown.js';
import { buildRefIndex, linkRefs } from './refs.js';
import { peekBeat, peekScene, searchFlow } from './peeks.js';
import { RECAP_ID, recapHtml, recapText, withRecap } from './recap.js';
import { openSlides } from './slides.js';
import { withAchievements } from './achievements.js';
import { withReputation } from './reputation.js';
import { withMysteries } from './mysteries.js';
import { withSky } from './sky.js';
import { withStats } from './stats.js';
import type { EntityRef, SessionData } from './types.js';

const WIKI_RE = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;

export function renderRunner(root: HTMLElement, raw: SessionData | null): void {
  if (!raw || !raw.nodes.length) {
    root.innerHTML = `<div class="sr-emptypage"><h1>No session to run</h1>
      <p>The runner walks a session folder in <code>scheduler/sessions/</code> that has a
      <code>_flow.md</code> flow chart. Build one with <code>/flow</code>, then this page reloads on its own.</p></div>`;
    return;
  }
  const data = withRecap(raw);
  const s = data.session;
  root.innerHTML = `
    <div class="sr-root">
      <header class="sr-header">
        <div class="sr-title"><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.date)}</span></div>
        <div class="sr-searchbox"><input class="sr-search" type="search" autocomplete="off" placeholder="Search people, places, beats, mysteries" aria-label="Search people, places, beats and mysteries" /><kbd>/</kbd></div>
        <div class="sr-actions">
          <button type="button" data-act="back" title="Step back (←)">← Back</button>
          <button type="button" data-act="copy" title="Copy the path walked so far">Copy path</button>
          <button type="button" data-act="restart">Restart</button>
          <a href="/">Timeline</a>
          <button type="button" class="sr-pin" title="Dock or hide the side panel (\\)"></button>
        </div>
      </header>
      <nav class="sr-rail"></nav>
      <div class="sr-body">
        <main class="sr-main"></main>
        <nav class="sr-siderail" aria-label="Side panel">
          <button type="button" data-rail="search" title="Search ( / )" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg></button>
          <button type="button" data-rail="home" title="Party and this scene" aria-label="Party and this scene"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.8 3.4-6 6.5-6s5.7 2.2 6.5 6"/><circle cx="17" cy="9" r="2.6"/><path d="M17 14c2.4 0 4 1.6 4.6 4.4"/></svg></button>
          <button type="button" data-rail="last" title="Last opened" aria-label="Last opened" hidden><svg viewBox="0 0 24 24"><path d="M5 4h10l4 4v12H5z"/><path d="M9 12h7M9 16h5"/></svg><span class="sr-rail-n"></span></button>
        </nav>
        <aside class="sr-panel" aria-label="Side panel"></aside>
      </div>
    </div>`;
  const rail = root.querySelector<HTMLElement>('.sr-rail')!;
  const main = root.querySelector<HTMLElement>('.sr-main')!;

  const g = buildGraph(data);
  const resolve = makeResolver(data.entities);
  const known = (n: string) => !!resolve(n);
  // Auto-surfacing skips the other season's entities (CLAUDE.md campaign separation)
  // and PCs, which the party strip already shows. Search still finds everything.
  const quiet = (e: EntityRef) => (!!e.campaign && !!s.campaign && e.campaign !== s.campaign) || e.subtype === 'pc';
  const idx = mentionIndex(data.entities, quiet);
  // The recap card talks about the previous session, which may be the other
  // season's — there, only PCs stay quiet.
  const recapIdx = mentionIndex(data.entities, (e) => e.subtype === 'pc');
  const sceneOf = (id: string | null) => data.scenes.find((x) => x.id === id);
  const combatants = parseCombatants(data.sections.find((x) => /^combatants$/i.test(x.title.trim()))?.md ?? '');
  const titleOf = (id: string) => g.byId.get(id)?.title ?? id;
  // Beat and scene links are numbered from where the DM stands, so rebuilt per render.
  let refs = buildRefIndex(data.nodes, data.scenes, '');
  const panel = mountPanel(root.querySelector<HTMLElement>('.sr-panel')!, data, resolve, known, {
    search: root.querySelector<HTMLInputElement>('.sr-header .sr-search')!,
    shell: root.querySelector<HTMLElement>('.sr-body')!,
    pin: root.querySelector<HTMLButtonElement>('.sr-pin')!,
    rail: root.querySelector<HTMLElement>('.sr-siderail')!,
  }, {
    link: (html) => linkRefs(html, refs),
    beat: (id) => peekBeat(data, refs, id, known),
    scene: (key) => peekScene(data, refs, key, known),
    where: () => {
      const b = refs.beat(state.history[state.history.length - 1]);
      return b ? `step ${b.num}, ${b.short}` : 'the current card';
    },
    searchFlow: (q) => searchFlow(data, refs, q),
    onGo: (id) => go(id),
  });

  const state = loadState(s.folder);
  state.history = state.history.filter((id) => g.byId.has(id));
  if (!state.history.length) state.history = [g.start!];
  // #S1_FIGHT deep-links to a card (appended to the walked path).
  const hash = decodeURIComponent(location.hash.slice(1));
  if (g.byId.has(hash) && state.history[state.history.length - 1] !== hash) state.history.push(hash);
  let options: ReturnType<typeof nextOptions> = [];

  const render = () => {
    const current = state.history[state.history.length - 1];
    const node = g.byId.get(current)!;
    const visited = new Set(state.history);
    const scene = sceneOf(node.scene);
    options = nextOptions(g, current, visited, (id) => sceneOf(id)?.title ?? id);
    const inScene = data.nodes.filter((n) => n.scene === node.scene);
    refs = buildRefIndex(data.nodes, data.scenes, current);
    renderRail(rail, data.nodes, data.scenes, current, visited, go);
    renderScene(main, {
      node,
      scene,
      sceneNodes: inScene,
      visited,
      position: node.scene && current !== RECAP_ID ? `step ${inScene.indexOf(node) + 1} of ${inScene.length}` : '',
      options,
      titleOf,
      known,
      refs,
      closingHook: s.closingHook,
      combatants,
      hp: state.hp,
      hpLog: state.hpLog,
      tokensOpen: state.tokensOpen,
      onGo: go,
      onTokensToggle: (open) => { state.tokensOpen = open; saveState(s.folder, state); },
      onHpHit: (entry, input, before, after, start) => {
        recordHit(state, entry, input, before, after, start, Date.now(), node.scene ? state.rounds[node.scene] ?? 1 : undefined);
        saveState(s.folder, state);
      },
      round: (node.scene && state.rounds[node.scene]) || 1,
      onRound: (r) => {
        if (!node.scene) return;
        state.rounds[node.scene] = r;
        saveState(s.folder, state);
      },
      onHpReset: (before) => {
        recordReset(state, 'Reset HP', before);
        saveState(s.folder, state);
      },
      onHpUndo: (i) => { if (undo(state, i)) render(); },
      bodyHtml: current === RECAP_ID ? recapHtml(data, known) : undefined,
    });
    const isRecap = current === RECAP_ID;
    const cardText = isRecap ? recapText(data) : [node.title, ...node.lines, ...node.notes].join('\n');
    const onCard = findMentions(cardText, isRecap ? recapIdx : idx);
    const linked = [...(scene?.md ?? '').matchAll(WIKI_RE)].map((m) => resolve(m[1])).filter((e): e is EntityRef => !!e);
    const inSceneEnts = [...new Set([...linked, ...findMentions(scene?.md ?? '', idx)])];
    panel.setContext({ onCard, inScene: inSceneEnts });
    saveState(s.folder, state);
    history.replaceState(null, '', `#${current}`);
  };

  function go(id: string) {
    if (!g.byId.has(id)) return;
    state.history.push(id);
    render();
  }
  const back = () => {
    if (state.history.length > 1) state.history.pop();
    render();
  };

  root.querySelector('.sr-actions')!.addEventListener('click', (ev) => {
    const act = (ev.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (act === 'back') back();
    if (act === 'restart' && confirm('Restart the session from the first card? The path walked so far is cleared and enemy HP goes back to its start. The HP log keeps the old numbers, and Undo there brings them back.')) {
      state.history = [g.start!];
      recordReset(state, 'Restart', { ...state.hp });
      state.rounds = {};
      render();
    }
    if (act === 'copy') {
      const text = state.history.map((id) => `${id} — ${titleOf(id)}`).join('\n');
      void navigator.clipboard?.writeText(text);
    }
  });
  main.addEventListener('click', (ev) => {
    const prev = data.previously[0];
    if ((ev.target as HTMLElement).closest('[data-act="slides"]') && prev) {
      openSlides(withSky(withStats(withReputation(withAchievements(withMysteries(prev.slides), prev.achievements), prev.reputation), prev.stats, prev.deckWeight), prev.sky), prev.name);
      return;
    }
    const t = ev.target as HTMLElement;
    const link = t.closest<HTMLElement>('a.sr-wiki[data-entity]');
    if (link) { panel.open(link.dataset.entity!, true); return; }
    // A beat or scene chip peeks in the panel; the beat the DM is on just scrolls into view.
    const beat = t.closest<HTMLElement>('.sr-bref[data-beat]')?.dataset.beat;
    if (beat && beat === state.history[state.history.length - 1]) {
      main.querySelector(`.sr-step[data-id="${beat}"]`)?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
    } else if (beat) panel.openBeat(beat, true);
    const scene = t.closest<HTMLElement>('.sr-bref[data-scene]')?.dataset.scene;
    if (scene) panel.openScene(scene, true);
  });

  document.addEventListener('keydown', (ev) => {
    const t = ev.target instanceof Element ? ev.target : document.body;
    if (ev.key === 'Escape') { panel.escape(); return; }
    if (t.matches('input, textarea') || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.key === '/') { ev.preventDefault(); panel.focusSearch(); return; }
    if (ev.key === '\\') { ev.preventDefault(); panel.toggleDock(); return; }
    if (t.matches('button, summary') && (ev.key === 'Enter' || ev.key === ' ')) return;
    const primary = options.find((o) => o.kind !== 'aside');
    if ((ev.key === 'ArrowRight' || ev.key === 'Enter' || ev.key === ' ') && primary) { ev.preventDefault(); go(primary.to); }
    else if (ev.key === 'ArrowLeft' || ev.key === 'Backspace') { ev.preventDefault(); back(); }
    else if (/^[1-9]$/.test(ev.key) && options[Number(ev.key) - 1]) go(options[Number(ev.key) - 1].to);
  });

  render();
}
