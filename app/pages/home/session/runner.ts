// Session runner host: header, map rail, the card column and the side panel.
// Owns the walked path (history) and the keyboard.
//
// Keys: → / Enter / Space take the first branch · 1–9 pick a branch or aside ·
// ← / Backspace step back · / focuses search · Esc clears search or closes an entity.

import './session.css';
import { buildGraph, nextOptions } from './flow.js';
import { findMentions, makeResolver, mentionIndex } from './entities.js';
import { renderScene } from './scene.js';
import { parseCombatants } from './combatants.js';
import { renderRail } from './rail.js';
import { mountPanel } from './panel.js';
import { loadState, saveState } from './store.js';
import { escapeHtml } from './markdown.js';
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
        <div class="sr-actions">
          <button type="button" data-act="back" title="Step back (←)">← Back</button>
          <button type="button" data-act="copy" title="Copy the path walked so far">Copy path</button>
          <button type="button" data-act="restart">Restart</button>
          <a href="/">Timeline</a>
        </div>
      </header>
      <nav class="sr-rail"></nav>
      <div class="sr-body"><main class="sr-main"></main><aside class="sr-panel"></aside></div>
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
  const panel = mountPanel(root.querySelector<HTMLElement>('.sr-panel')!, data, resolve, known);
  const sceneOf = (id: string | null) => data.scenes.find((x) => x.id === id);
  const combatants = parseCombatants(data.sections.find((x) => /^combatants$/i.test(x.title.trim()))?.md ?? '');
  const titleOf = (id: string) => g.byId.get(id)?.title ?? id;

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
      closingHook: s.closingHook,
      combatants,
      tokensOpen: state.tokensOpen,
      onGo: go,
      onTokensToggle: (open) => { state.tokensOpen = open; saveState(s.folder, state); },
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
    if (act === 'restart' && confirm('Restart the session from the first card? The path walked so far is cleared.')) {
      state.history = [g.start!];
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
    const link = (ev.target as HTMLElement).closest<HTMLElement>('a.sr-wiki[data-entity]');
    if (link) panel.open(link.dataset.entity!);
  });

  document.addEventListener('keydown', (ev) => {
    const t = ev.target instanceof Element ? ev.target : document.body;
    if (ev.key === 'Escape') { panel.escape(); return; }
    if (t.matches('input, textarea') || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.key === '/') { ev.preventDefault(); panel.focusSearch(); return; }
    if (t.matches('button, summary') && (ev.key === 'Enter' || ev.key === ' ')) return;
    const primary = options.find((o) => o.kind !== 'aside');
    if ((ev.key === 'ArrowRight' || ev.key === 'Enter' || ev.key === ' ') && primary) { ev.preventDefault(); go(primary.to); }
    else if (ev.key === 'ArrowLeft' || ev.key === 'Backspace') { ev.preventDefault(); back(); }
    else if (/^[1-9]$/.test(ev.key) && options[Number(ev.key) - 1]) go(options[Number(ev.key) - 1].to);
  });

  render();
}
