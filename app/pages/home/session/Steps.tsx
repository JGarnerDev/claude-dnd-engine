// A scene's beats as a step list: done steps greyed with a tick, the current step
// open with its prose as a prompt book (PromptBook.tsx), upcoming steps collapsed to
// one line. Any step row jumps to that beat.
//
// Steps inside a fight carry a red rail down their left edge, and a boss fight a
// second, salmon one, so the DM sees where a battle starts and ends. A beat's
// `When:` line rides on its row as a pill the fight bar lights once it comes true.

import type { ReactNode } from 'react';
import { Badge, Button } from 'jeff-ui';
import { mergeLabelLines } from './flow.js';
import { InlineMd } from './MarkdownView.js';
import { PromptBook } from './PromptBook.js';
import { useFightLit } from './FightContext.js';
import { NoSceneLinks } from './RefChips.js';
import { beatPosition, inSpan, stepMarkKind, stepTitle, whenOf, type Mark, type Span, type Spans } from './step-info.js';
import type { FlowNode } from './types.js';

const MARKS: Record<Mark, { title: string; text: string }> = {
  combat: { title: 'Combat', text: '⚔' },
  choice: { title: 'A real choice', text: '◆ choice' },
  payoff: { title: 'Payoff', text: '★' },
};

function StepMark({ n, prose }: { n: FlowNode; prose: string }) {
  const m = stepMarkKind(n, prose);
  return m && <Badge className="sr-mark" data-mark={m} title={MARKS[m].title}>{MARKS[m].text}</Badge>;
}

function Rails({ s, i, last }: { s: Spans; i: number; last: number }) {
  const rail = (kind: 'fight' | 'boss', span: Span | null) => inSpan(span, i) && (
    <i className={`sr-r sr-r-${kind}${i === span![0] ? ' is-start' : ''}${i === span![1] && span![1] < last ? ' is-end' : ''}`}
      title={kind === 'boss' ? 'Boss fight' : 'Fight'} />
  );
  return <span className="sr-rails" aria-hidden="true">{rail('fight', s.fight)}{rail('boss', s.boss)}</span>;
}

function EdgeTags({ s, i, last }: { s: Spans; i: number; last: number }) {
  const tags: ReactNode[] = [];
  for (const [kind, span, name] of [['fight', s.fight, 'fight'], ['boss', s.boss, 'boss fight']] as const) {
    if (!span) continue;
    if (i === span[0] && (span[0] > 0 || kind === 'boss')) tags.push(<Badge key={`${kind}-s`} tone="err" className={`sr-edge sr-edge-${kind}`}>{name} starts</Badge>);
    if (i === span[1] && span[1] < last) tags.push(<Badge key={`${kind}-e`} tone="err" className={`sr-edge sr-edge-${kind}`}>{name} ends</Badge>);
  }
  return tags;
}

// A beat's body: its prose as a prompt book, else the flow chart's lines.
export function BeatBody({ n, prose }: { n: FlowNode; prose: string }) {
  if (!prose) return <ul className="sr-md">{mergeLabelLines(n.lines).map((l, i) => <li key={i}><InlineMd md={l} /></li>)}</ul>;
  return <PromptBook prose={prose} />;
}

export interface StepsProps {
  nodes: FlowNode[];
  prose: Map<string, string>;
  headings: Map<string, string>; // the plan's `#### ID — title` lines
  current: string;
  visited: ReadonlySet<string>;
  options: ReactNode; // branch buttons, shown under the open step
  spans?: Spans;
  onGo: (id: string) => void;
}

export function Steps({ nodes, prose: proseOf, headings, current, visited, options, spans: given, onGo }: StepsProps) {
  const spans = given ?? { fight: null, boss: null };
  const rails = !!(spans.fight || spans.boss);
  const last = nodes.length - 1;
  const lit = useFightLit();
  return (
    <ol className={`sr-steps${rails ? ' has-rails' : ''}`}>
      {nodes.map((n, i) => {
        const prose = proseOf.get(n.id) ?? '';
        const state = n.id === current ? 'current' : visited.has(n.id) ? 'done' : 'todo';
        const when = whenOf(prose);
        return (
          <li key={n.id} className={`sr-step is-${state}`} data-id={n.id} id={`step-${n.id}`}>
            {rails && <Rails s={spans} i={i} last={last} />}
            <Button className="sr-step-head" data-to={n.id} title={n.id} onClick={() => { if (n.id !== current) onGo(n.id); }}>
              <span className="sr-step-num">{state === 'done' ? '✓' : beatPosition(n.id) || i + 1}</span>
              <span className="sr-step-title"><NoSceneLinks><InlineMd md={stepTitle(n, headings)} /></NoSceneLinks></span>
              {rails && <EdgeTags s={spans} i={i} last={last} />}
              {when && <span className={`sr-when${lit?.(when) ? ' is-ready' : ''}`} data-when={when} title={`When: ${when}`}>{when.length > 42 ? `${when.slice(0, 40)}…` : when}</span>}
              <StepMark n={n} prose={prose} />
            </Button>
            {state === 'current' && <div className="sr-step-body"><BeatBody n={n} prose={prose} />{options}</div>}
          </li>
        );
      })}
    </ol>
  );
}
