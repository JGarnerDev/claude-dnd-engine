// Session runner host: header (with search), map rail, the card column and the
// side panel. Owns the walked path (useRunner) and the keyboard (useKeys).
//
// A wiki link in the notes opens that person or place in the panel; a beat or
// scene chip peeks there without moving the walk, and the beat the DM is on just
// scrolls into view. The "Previously on…" card opens the recap slides.

import './session.css';
import { useMemo, useRef, useState } from 'react';
import { buildGraph, nextOptions } from './flow.js';
import { findMentions, makeResolver, mentionIndex } from './entities.js';
import { parseCombatants } from './combatants.js';
import { Panel } from './Panel.js';
import { Rail } from './Rail.js';
import { Recap } from './Recap.js';
import { RECAP_ID, recapText, withRecap } from './recap-data.js';
import { RefContext } from './RefChips.js';
import { buildRefIndex } from './ref-index.js';
import { RunnerHeader } from './RunnerHeader.js';
import { Scene } from './Scene.js';
import { SessionContext } from './SessionContext.js';
import { SideRail } from './SideRail.js';
import { Slides } from './Slides.js';
import { useKeys } from './useKeys.js';
import { usePanel, type PanelContext } from './usePanel.js';
import { useRunner } from './useRunner.js';
import { withAchievements } from './Achievements.js';
import { withMysteries } from './Mysteries.js';
import { withReputation } from './Reputation.js';
import { withSky } from './Sky.js';
import { withStats } from './Stats.js';
import type { EntityRef, SessionData } from './types.js';

const WIKI_RE = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;

export function Runner({ data: raw }: { data: SessionData | null }) {
  if (!raw || !raw.nodes.length) {
    return (
      <div className="sr-emptypage">
        <h1>No session to run</h1>
        <p>The runner walks a session folder in <code>scheduler/sessions/</code> that has a <code>_flow.md</code> flow chart. Build one
          with <code>/flow</code>, then this page reloads on its own.</p>
      </div>
    );
  }
  return <Walk raw={raw} />;
}

function Walk({ raw }: { raw: SessionData }) {
  const fixed = useMemo(() => {
    const data = withRecap(raw);
    const s = data.session;
    const resolve = makeResolver(data.entities);
    return {
      data,
      g: buildGraph(data),
      resolve,
      known: (n: string) => !!resolve(n),
      // Auto-surfacing skips the other season's entities (CLAUDE.md campaign separation)
      // and PCs, which the party strip already shows. Search still finds everything.
      idx: mentionIndex(data.entities, (e) => (!!e.campaign && !!s.campaign && e.campaign !== s.campaign) || e.subtype === 'pc'),
      // The recap card talks about the previous session, which may be the other
      // season's — there, only PCs stay quiet.
      recapIdx: mentionIndex(data.entities, (e) => e.subtype === 'pc'),
      combatants: parseCombatants(data.sections.find((x) => /^combatants$/i.test(x.title.trim()))?.md ?? ''),
    };
  }, [raw]);
  const { data, g, resolve, known, idx, recapIdx, combatants } = fixed;
  const s = data.session;
  const { state, current, dispatch } = useRunner(s.folder, g);
  const p = usePanel(resolve);
  const main = useRef<HTMLElement>(null);
  const [slides, setSlides] = useState(false);

  const node = g.byId.get(current)!;
  const isRecap = current === RECAP_ID;
  const visited = useMemo(() => new Set(state.history), [state.history]);
  const sceneOf = (id: string | null) => data.scenes.find((x) => x.id === id);
  const scene = sceneOf(node.scene);
  const titleOf = (id: string) => g.byId.get(id)?.title ?? id;
  const options = nextOptions(g, current, visited, (id) => sceneOf(id)?.title ?? id);
  const inScene = data.nodes.filter((n) => n.scene === node.scene);
  // Beat and scene links are numbered from where the DM stands.
  const refs = useMemo(() => buildRefIndex(data.nodes, data.scenes, current, data.cards), [data, current]);
  const b = refs.beat(current);
  const where = b ? `step ${b.num}, ${b.short}` : 'the current card';

  const ctx: PanelContext = useMemo(() => {
    const cardText = isRecap ? recapText(data) : [node.title, ...node.lines, ...node.notes].join('\n');
    const md = scene?.md ?? '';
    const linked = [...md.matchAll(WIKI_RE)].map((m) => resolve(m[1])).filter((e): e is EntityRef => !!e);
    return { onCard: findMentions(cardText, isRecap ? recapIdx : idx), inScene: [...new Set([...linked, ...findMentions(md, idx)])] };
  }, [data, node, scene, isRecap, resolve, idx, recapIdx]);

  const go = (id: string) => { if (g.byId.has(id)) dispatch({ type: 'go', id }); };
  const back = () => dispatch({ type: 'back' });
  const restart = () => {
    if (confirm('Restart the session from the first card? The path walked so far is cleared and enemy HP goes back to its start. The HP log keeps the old numbers, and Undo there brings them back.'))
      dispatch({ type: 'restart', start: g.start! });
  };
  const copy = () => { void navigator.clipboard?.writeText(state.history.map((id) => `${id} — ${titleOf(id)}`).join('\n')); };
  useKeys({ options, go, back, escape: p.escape, focusSearch: p.focusSearch, toggleDock: p.toggleDock });

  // In the notes, links open in the panel as a fresh trail.
  const session = useMemo(() => ({ known, openEntity: (name: string) => p.openEntity(name, true) }), [known, p]);
  const links = useMemo(() => ({
    ix: refs,
    onBeat: ({ id }: { id: string }) => {
      if (id === current) main.current?.querySelector(`.sr-step[data-id="${id}"]`)?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
      else p.openBeat(id, true);
    },
    onScene: ({ key }: { key: string }) => p.openScene(key, true),
  }), [refs, current, p]);

  const prev = data.previously[0];
  const deck = useMemo(() => (prev
    ? withSky(withStats(withReputation(withAchievements(withMysteries(prev.slides), prev.achievements), prev.reputation), prev.stats, prev.deckWeight), prev.sky)
    : []), [prev]);
  const round = (node.scene && state.rounds[node.scene]) || 1;
  const shell = ['sr-body', p.docked && 'is-docked', p.open && 'is-open'].filter(Boolean).join(' ');

  return (
    <div className="sr-root">
      <RunnerHeader name={s.name} date={s.date} p={p} onBack={back} onCopy={copy} onRestart={restart} />
      <nav className="sr-rail"><Rail nodes={data.nodes} scenes={data.scenes} current={current} visited={visited} onJump={go} /></nav>
      <div className={shell}>
        <main ref={main} className="sr-main">
          <SessionContext.Provider value={session}>
            <RefContext.Provider value={links}>
              <Scene
                node={node}
                scene={scene}
                sceneNodes={inScene}
                visited={visited}
                position={node.scene && !isRecap ? `step ${inScene.indexOf(node) + 1} of ${inScene.length}` : ''}
                options={options}
                titleOf={titleOf}
                closingHook={s.closingHook}
                combatants={combatants}
                hp={state.hp}
                hpLog={state.hpLog}
                tokensOpen={state.tokensOpen}
                body={isRecap ? <Recap data={data} onSlides={() => setSlides(true)} /> : undefined}
                round={round}
                onGo={go}
                onTokensToggle={(open) => dispatch({ type: 'tokens', open })}
                onHpHit={(entry, input, before, after, start) =>
                  dispatch({ type: 'hit', entry, input, before, after, start, round: node.scene ? state.rounds[node.scene] ?? 1 : undefined })}
                onHpReset={(before) => dispatch({ type: 'reset', before })}
                onHpUndo={(index) => dispatch({ type: 'undo', index })}
                onRound={(r) => { if (node.scene) dispatch({ type: 'round', scene: node.scene, round: r }); }}
              />
            </RefContext.Provider>
          </SessionContext.Provider>
        </main>
        <SideRail p={p} />
        <SessionContext.Provider value={session}>
          <Panel p={p} data={data} resolve={resolve} refs={refs} ctx={ctx} where={where} onGo={go} />
        </SessionContext.Provider>
      </div>
      {slides && prev && <Slides deck={deck} label={prev.name} onClose={() => setSlides(false)} />}
    </div>
  );
}
