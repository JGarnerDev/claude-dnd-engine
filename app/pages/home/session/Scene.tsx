// The main column: one page per scene. The scene header (summary, where, cast,
// DCs, enemies), any read-aloud text from the setup, the beats as steps (each a
// prompt book), and a Tokens toggle with the scene's Roll20 cues. While a fight
// runs, a fight bar sits pinned at the top (FightBar.tsx). The recap card keeps its
// own body. Beat ids and "Scene N" become chips under the runner's RefContext.
//
// HP typed in the Enemies box or the fight bar goes to the runner, which stores it
// and the HP log. After every HP entry and every round, Watch items and `When:` pills
// whose condition has come true light up (fight-cues.ts), and the fight bar lists them.
// The roll log, the picked chip, spent legendary actions and the HP log's open state
// are the page's own: they survive moving between steps, not a reload.

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Disclosure, Kbd } from 'jeff-ui';
import { applyHp, matchEnemy, type StatBlock } from './combatants.js';
import { RollContext, type LoggedRoll } from './Dice.js';
import { FightBar, type FightChip } from './FightBar.js';
import { FightContext } from './FightContext.js';
import { fightAlerts, litTest } from './fight-cues.js';
import type { NextOption } from './flow.js';
import type { HpLogEntry } from './hp-log.js';
import { extractCallouts, nodeHeadings, splitNodeSections } from './markdown.js';
import { InlineMd, Markdown } from './MarkdownView.js';
import { PromptBook } from './PromptBook.js';
import { stripProvenance } from './provenance.js';
import { NoSceneLinks } from './RefChips.js';
import { parseSceneHeader } from './scene-header.js';
import { SceneHead, type HpMap } from './SceneHead.js';
import { beatPosition, fightSpans, inSpan } from './step-info.js';
import { Steps } from './Steps.js';
import type { FlowNode, Scene as SceneData } from './types.js';

const LOG_SIZE = 6;

export interface SceneProps {
  node: FlowNode;
  scene: SceneData | undefined;
  sceneNodes: FlowNode[]; // the scene's beats in flow order
  visited: ReadonlySet<string>;
  position: string; // "step 2 of 4"
  options: NextOption[];
  titleOf: (id: string) => string;
  closingHook: string;
  combatants: StatBlock[];
  hp: HpMap; // current enemy HP by enemy entry; missing = its known starting HP
  hpLog: readonly HpLogEntry[]; // every HP entry (hp-log.ts); the runner owns it
  tokensOpen: boolean;
  body?: ReactNode; // the recap card's body, in place of steps
  round: number; // this scene's round counter
  onGo: (id: string) => void;
  onTokensToggle: (open: boolean) => void;
  onHpHit: (entry: string, input: string, before: number, after: number, start: number) => void;
  onHpReset: (before: Record<string, number>) => void; // the values the reset wipes
  onHpUndo: (index: number) => void;
  onRound: (round: number) => void;
}

function Options({ options, current, titleOf, closingHook, onGo }: Pick<SceneProps, 'options' | 'titleOf' | 'closingHook' | 'onGo'> & { current: string }) {
  const branches = options.filter((o) => o.kind !== 'aside');
  const asides = options.filter((o) => o.kind === 'aside');
  const fork = branches.length > 1;
  const btn = (o: NextOption, i: number) => {
    const label = !fork && o.kind === 'edge' ? `Next — ${titleOf(o.to)}` : o.label;
    return (
      <button key={i} type="button" className={`sr-opt${i === 0 && o.kind !== 'aside' ? ' is-primary' : ''}`} data-kind={o.kind} data-to={o.to}
        onClick={() => { if (o.to !== current) onGo(o.to); }}>
        <Kbd>{i + 1}</Kbd><span className="sr-opt-label"><InlineMd md={label} /></span>
        {fork && o.label !== titleOf(o.to) && <span className="sr-opt-to">→ <InlineMd md={titleOf(o.to)} /></span>}
      </button>
    );
  };
  return (
    <NoSceneLinks>
      <div className="sr-options">
        {branches.length ? branches.map(btn) : <div className="sr-end"><strong>End of the plan.</strong> <InlineMd md={closingHook} /></div>}
      </div>
      {asides.length > 0 && <div className="sr-asides"><span className="sr-asides-label">If it comes up</span>{asides.map((o, i) => btn(o, branches.length + i))}</div>}
    </NoSceneLinks>
  );
}

// Read-aloud blocks in the setup stay open; the rest of the setup folds away.
const aloudOf = (rest: string) => rest.split('\n').filter((l) => l.trimStart().startsWith('>')).join('\n');
const notesOf = (rest: string) => rest.split('\n').filter((l) => !l.trimStart().startsWith('>')).join('\n').trim();

function Setup({ rest, open }: { rest: string; open: boolean }) {
  if (!rest) return null;
  const aloud = aloudOf(rest);
  const other = notesOf(rest);
  return (
    <>
      {aloud && <div className="sr-md sr-aloud"><Markdown md={aloud} /></div>}
      {other && <Disclosure className="sr-setup" title="Scene notes" open={open}><PromptBook prose={other} /></Disclosure>}
    </>
  );
}

function Tokens({ nodes, prose, open, onToggle }: { nodes: FlowNode[]; prose: Map<string, string>; open: boolean; onToggle: (open: boolean) => void }) {
  const cues = nodes.flatMap((n, i) => extractCallouts(prose.get(n.id) ?? '').tokens.map((t) => ({ i, t })));
  if (!cues.length) return null;
  return (
    <Disclosure className="sr-tokens-box" title="Tokens" open={open} onToggle={(ev) => { if (ev.currentTarget.open !== open) onToggle(ev.currentTarget.open); }}>
      <ol>{cues.map((c, k) => <li key={k}><span className="sr-tok-step">{c.i + 1}</span> <InlineMd md={stripProvenance(c.t)} /></li>)}</ol>
    </Disclosure>
  );
}

export function Scene(v: SceneProps) {
  const [rolls, setRolls] = useState<LoggedRoll[]>([]);
  const [pick, setPick] = useState('');
  const [spent, setSpent] = useState<ReadonlyMap<string, number>>(new Map());
  const [logOpen, setLogOpen] = useState(false);

  const md = v.scene?.md ?? '';
  const { setup, nodes: prose } = useMemo(() => splitNodeSections(md), [md]);
  const header = useMemo(() => parseSceneHeader(setup, md), [setup, md]);
  const headings = useMemo(() => nodeHeadings(md), [md]);
  const round = Math.max(1, v.round);

  // One HP box per enemy whose block carries HP: what the boxes and the bar show.
  const chips: FightChip[] = header.enemies.flatMap((entry) => {
    const block = matchEnemy(entry, v.combatants);
    if (!block || block.hp === null) return [];
    const start = block.start ?? block.hp;
    return [{ entry, cur: Math.min(v.hp[entry] ?? start, block.hp), max: block.hp, due: header.arrivals[entry] ?? 0, block }];
  });
  const lit = litTest(header.enemies, {
    round,
    hp: Object.fromEntries(chips.map((c) => [c.entry, c.cur])),
    arrives: Object.fromEntries(chips.map((c) => [c.entry, c.due])),
  });

  // The fight bar shows on the steps a fight runs over, and only with enemies to track.
  const spans = fightSpans(v.sceneNodes, prose, header.enemies.length > 0);
  const at = v.sceneNodes.findIndex((n) => n.id === v.node.id);
  const fighting = header.enemies.length > 0 && inSpan(spans.fight, at);
  if (pick && !chips.some((c) => c.entry === pick)) setPick('');

  const onHit = (entry: string, typed: string): boolean => {
    const c = chips.find((x) => x.entry === entry);
    const next = c ? applyHp(c.cur, c.max, typed) : null;
    if (!c || next === null) return false;
    v.onHpHit(entry, typed.trim(), c.cur, next, c.block.start ?? c.max);
    return true;
  };
  const onReset = () => v.onHpReset(Object.fromEntries(chips.filter((c) => c.cur !== (c.block.start ?? c.max)).map((c) => [c.entry, c.cur])));
  const onRound = (delta: number) => {
    const next = Math.max(1, round + delta);
    if (next > round) setSpent(new Map());
    v.onRound(next);
  };
  const logRoll = (r: LoggedRoll) => setRolls((rs) => [r, ...rs].slice(0, LOG_SIZE));

  // Same scene: keep the DM's scroll and bring the open step into view. New scene: top.
  const article = useRef<HTMLElement>(null);
  const shown = useRef<string | null>(null);
  const sceneId = v.scene?.id ?? '';
  useLayoutEffect(() => {
    const main = article.current?.parentElement;
    if (!main) return;
    if (shown.current === sceneId) main.querySelector('.sr-step.is-current')?.scrollIntoView?.({ block: 'nearest' });
    else main.scrollTop = 0;
    shown.current = sceneId;
  }, [sceneId, v.node.id]);

  const options = <Options options={v.options} current={v.node.id} titleOf={v.titleOf} closingHook={v.closingHook} onGo={v.onGo} />;
  const body = v.body !== undefined
    ? <><h1 className="sr-card-title"><InlineMd md={v.node.title} /></h1><div className="sr-card-body">{v.body}</div>{options}</>
    : (
      <>
        {fighting && (
          <FightBar mode={inSpan(spans.boss, at) ? 'boss' : 'fight'} round={round} chips={chips} pick={pick} spent={spent} rolls={rolls}
            alerts={fightAlerts({
              entries: header.enemies, arrivals: header.arrivals, round, lit,
              proses: [notesOf(header.rest), prose.get(v.node.id) ?? ''].filter(Boolean),
              steps: v.sceneNodes, prose, headings, current: v.node.id, visited: v.visited,
              num: (n, i) => beatPosition(n.id) || String(i + 1),
            })}
            onRound={onRound} onPick={setPick} onSpend={(entry, n) => setSpent((m) => new Map(m).set(entry, n))}
            onGo={v.onGo} onHit={onHit} onClearRolls={() => setRolls([])} />
        )}
        <SceneHead h={header} blocks={v.combatants} hp={v.hp} log={v.hpLog} logOpen={logOpen} onLogToggle={setLogOpen}
          rolls={rolls} onClearRolls={() => setRolls([])} round={round} onHit={onHit} onReset={onReset} onUndo={v.onHpUndo} />
        <Setup rest={header.rest} open={prose.size === 0} />
        <Steps nodes={v.sceneNodes} prose={prose} headings={headings} current={v.node.id} visited={v.visited} options={options} spans={spans} onGo={v.onGo} />
        <Tokens nodes={v.sceneNodes} prose={prose} open={v.tokensOpen} onToggle={v.onTokensToggle} />
      </>
    );
  return (
    <article ref={article} className="sr-scene" data-kind={v.node.kind} data-current={v.node.id}>
      <header className="sr-scene-bar">
        <h2 className="sr-scene-title">{v.scene?.title ?? 'Aside — outside the scene boxes'}</h2>
        <span className="sr-scene-pos">{header.time && <span className="sr-scene-time">{header.time}</span>}{v.position}</span>
      </header>
      <RollContext.Provider value={logRoll}>
        <FightContext.Provider value={v.body === undefined ? lit : null}>{body}</FightContext.Provider>
      </RollContext.Provider>
    </article>
  );
}
