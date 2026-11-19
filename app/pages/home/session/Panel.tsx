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
//
// usePanel.ts holds the panel's state and what the runner calls (open, escape, …).

import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { searchEntities, type Resolver } from './entities.js';
import { EntityView } from './EntityView.js';
import { LAYER_LABEL } from './entity-fetch.js';
import { searchFlow, type FlowHit } from './flow-search.js';
import { plainText } from './markdown.js';
import { InlineMd, Markdown } from './MarkdownView.js';
import { searchMysteries } from './mystery-list.js';
import { BeatPeek, ScenePeek } from './Peeks.js';
import { isRecapSection } from './recap-data.js';
import { RefContext } from './RefChips.js';
import type { RefIndex } from './ref-index.js';
import { SessionContext, useSession } from './SessionContext.js';
import type { EntityRef, Section, SessionData } from './types.js';
import { crumb, type Item, type PanelApi, type PanelContext } from './usePanel.js';

// A search hit's text with the match marked.
function Hl({ s, q }: { s: string; q: string }) {
  const i = s.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{s}</>;
  return <>{s.slice(0, i)}<mark>{s.slice(i, i + q.length)}</mark>{s.slice(i + q.length)}</>;
}

function Group({ title, children }: { title: string; children: ReactNode[] }) {
  return children.length > 0 && <><h3 className="sr-group">{title}</h3>{children}</>;
}

function Fold({ title, children }: { title: string; children: ReactNode[] }) {
  return children.length > 0 && (
    <details className="sr-pn-fold"><summary>{title} <span className="sr-pn-count">{children.length}</span></summary>{children}</details>
  );
}

export interface PanelProps {
  p: PanelApi;
  data: SessionData;
  resolve: Resolver;
  refs: RefIndex;
  ctx: PanelContext;
  where: string; // where the DM is: "step 2, Riders on the south road"
  onGo: (id: string) => void;
}

export function Panel({ p, data, resolve, refs, ctx, where, onGo }: PanelProps) {
  const { known } = useSession();
  const plan = useMemo(() => data.sections.filter((s) => !isRecapSection(s.title)), [data]);
  const sections: Section[] = useMemo(() => [...(data.established ?? []), ...plan], [data, plan]);
  const mysteries = data.mysteries ?? [];
  const q = p.query.trim();
  const top = p.stack[p.stack.length - 1];
  const fresh = !!q; // a search result starts a new trail

  const row = (e: EntityRef, name: ReactNode = e.name, key: string | number = e.name) => (
    <button key={key} type="button" className="sr-ent" data-entity={e.name} onClick={() => p.openEntity(e.name, fresh)}>
      <span className="sr-ent-name">{name}</span>
      <span className="sr-ent-type">{[e.type, e.subtype].filter(Boolean).join(' · ')} · {LAYER_LABEL[e.path.split('/')[0]] ?? ''}</span>
      {e.description && <span className="sr-ent-sub">{plainText(e.description)}</span>}
    </button>
  );
  const pnRow = (key: string | number, attr: Record<string, string>, onClick: () => void, title: ReactNode, sub?: ReactNode) => (
    <button key={key} type="button" className="sr-pn-row" {...attr} onClick={onClick}>
      <span className="sr-pn-name">{title}</span>{sub && <span className="sr-pn-sub">{sub}</span>}
    </button>
  );
  const sectionRow = (kind: 'mystery' | 'section', i: number, title: ReactNode) =>
    pnRow(`${kind}${i}`, { 'data-pn': `${kind}|${i}` }, () => p.openSection(kind, i, fresh), title);

  const home = () => {
    const onCard = new Set(ctx.onCard);
    const roster = data.roster.map((n) => resolve(n)).filter((e): e is EntityRef => !!e);
    const established = data.established ?? [];
    const more = [
      <Fold key="r" title="Act roster">{roster.map((e) => row(e))}</Fold>,
      <Fold key="e" title="Established">{established.map((s) => sectionRow('section', sections.indexOf(s), s.title))}</Fold>,
      <Fold key="m" title="Mysteries">{mysteries.map((s, i) => sectionRow('mystery', i, s.title))}</Fold>,
      <Fold key="p" title="Session plan">{plan.map((s) => sectionRow('section', sections.indexOf(s), s.title))}</Fold>,
    ].filter((_, i) => [roster, established, mysteries, plan][i].length > 0);
    return (
      <>
        <h3 className="sr-group">Party</h3>
        <div className="sr-party">{data.party.map((m) => (
          <button key={m.name} type="button" className="sr-pc" data-entity={m.name} onClick={() => p.openEntity(m.name, fresh)}>
            <span className="sr-pc-line"><span className="sr-pc-name">{m.name}</span><span className="sr-pc-class">{m.raceClass} · L{m.level} · {m.player}</span></span>
            {m.status && <span className="sr-pc-status"><InlineMd md={m.status} /></span>}
          </button>
        ))}</div>
        <Group title="On this step">{ctx.onCard.map((e) => row(e))}</Group>
        <Group title="In this scene">{ctx.inScene.filter((e) => !onCard.has(e)).map((e) => row(e))}</Group>
        <Group title="More">{more}</Group>
      </>
    );
  };

  const results = () => {
    const hl = (s: string) => <Hl s={s} q={q} />;
    const ents = searchEntities(q, data.entities, 12); // few enough that the beats below stay in reach
    const flow = searchFlow(data, refs, q);
    const answers = searchMysteries(q, mysteries);
    const ql = q.toLowerCase();
    const secs = sections.filter((s) => s.title.toLowerCase().includes(ql) || s.md.toLowerCase().includes(ql));
    const hit = (h: FlowHit, i: number) => (h.kind === 'scene'
      ? pnRow(i, { 'data-scene': h.key }, () => p.openScene(h.key, fresh), hl(`Scene ${h.key} — ${h.title}`))
      : pnRow(i, { 'data-beat': h.id }, () => p.openBeat(h.id, fresh), hl(h.title), <><span className="sr-pn-id">{hl(h.id)}</span> · {h.sub}</>));
    if (!ents.length && !flow.length && !answers.length && !secs.length) return <p className="sr-empty">No matches for “{q}”.</p>;
    return (
      <>
        <Group title="People and places">{ents.map((e) => row(e, hl(e.name)))}</Group>
        <Group title="Beats and scenes">{flow.map(hit)}</Group>
        <Group title="Mysteries">{answers.map((s) => sectionRow('mystery', mysteries.indexOf(s), hl(s.title)))}</Group>
        <Group title="Plan">{secs.map((s) => sectionRow('section', sections.indexOf(s), hl(s.title)))}</Group>
      </>
    );
  };

  const jump = (id: string) => { p.jump(); onGo(id); };
  const item = (it: Item) => {
    const peek = { d: data, refs, where, onJump: jump };
    if (it.kind === 'beat') return <BeatPeek {...peek} id={it.id} />;
    if (it.kind === 'scene') return <ScenePeek {...peek} sceneKey={it.key} />;
    if (it.kind === 'entity') return <EntityView key={it.e.path} e={it.e} root={data.session.root} quickRef={data.quickRefs[it.e.name]} />;
    const mystery = it.kind === 'mystery';
    const s = mystery ? mysteries[it.i] : sections[it.i];
    return (
      <>
        <h2 className="sr-pn-title">{s.title}</h2>
        <div className="sr-ent-tags">{mystery ? <span className="sr-chiptag">mystery · DM answer</span> : <span className="sr-layer" data-layer="scheduler">plan</span>}</div>
        <div className="sr-md"><Markdown md={s.md} /></div>
      </>
    );
  };

  const close = p.docked ? null : <button type="button" className="sr-pn-btn" data-pn-close="" aria-label="Close the panel" onClick={p.close}>×</button>;
  const head = q
    ? <><span className="sr-pn-crumb">Search · “{q}”</span><button type="button" className="sr-pn-btn" data-pn-clear="" onClick={() => p.setQuery('')}>Clear</button>{close}</>
    : top
      ? <><button type="button" className="sr-pn-btn sr-back" onClick={p.back}>← Back</button><span className="sr-pn-crumb">{crumb(top)}</span>
        {p.docked ? <button type="button" className="sr-pn-btn" data-pn-home="" onClick={p.home}>Home</button> : close}</>
      : <><span className="sr-pn-crumb">This session</span>{close}</>;

  // Back to the top whenever what's shown changes; home and peeks also follow the walk.
  const aside = useRef<HTMLElement>(null);
  const follows = !q && (!top || top.kind === 'beat' || top.kind === 'scene');
  useLayoutEffect(() => { if (aside.current) aside.current.scrollTop = 0; }, [q, top, follows ? ctx : null]);

  // Inside the panel a beat, scene or entity link opens here, on the same Back stack.
  const links = useMemo(() => ({ ix: refs, onBeat: (b: { id: string }) => p.openBeat(b.id, fresh), onScene: (s: { key: string }) => p.openScene(s.key, fresh) }), [refs, p, fresh]);
  const session = useMemo(() => ({ known, openEntity: (name: string) => p.openEntity(name, fresh) }), [known, p, fresh]);
  return (
    <aside ref={aside} className="sr-panel" aria-label="Side panel">
      <SessionContext.Provider value={session}>
        <RefContext.Provider value={links}>
          <div className="sr-pn-head">{head}</div>
          <div ref={p.body} className="sr-panel-body">{q ? results() : top ? item(top) : home()}</div>
        </RefContext.Provider>
      </SessionContext.Provider>
    </aside>
  );
}
