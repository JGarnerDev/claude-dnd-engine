// A beat's prose as a prompt book: one block per bullet, paragraph or read-aloud
// quote (prompt-blocks.ts), each tagged in the gutter with a voice the DM can see at
// a glance, in plan order:
//
//   You      for the DM to read: what's true, what happens, how to run it (plain sans)
//   Say      for the players: read-aloud quotes and spoken lines (serif italic)
//   Do       at the table or in Roll20: tokens, music, title cards, HP to set (mono)
//   Watch    conditional: "When …", "If …", "Once …", what triggers what
//   Choice   a real choice (`Choice (party):`, `Choice (Iggy):`)
//   Private  a message for one player, one Copy button per outcome
//   Introduce  a character's first appearance: look, sound, impression
//   Fight    where a fight or a boss fight starts and ends (`Combat starts:`, `Boss fight ends:`)

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from 'jeff-ui';
import { itemLit, watchCue, type Lit } from './fight-cues.js';
import { useFightLit } from './FightContext.js';
import { extractCallouts } from './markdown.js';
import { InlineMd, ItemClassContext, Markdown } from './MarkdownView.js';
import { promptBlocks, VOICE_NAME, type PbBlock } from './prompt-blocks.js';
import { stripProvenance } from './provenance.js';

// Copies one message; says so for a moment.
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onClick = () => {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <Button className={`sr-copy${copied ? ' is-copied' : ''}`} data-copy={text} title="Copy this message" onClick={onClick}>
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}

function Intros({ md }: { md: string }) {
  return extractCallouts(md).intros.map((x, i) => (
    <Fragment key={i}>
      <h3 className="sr-intro-name"><InlineMd md={stripProvenance(x.name)} /></h3>
      <div className="sr-md"><Markdown md={x.md} /></div>
    </Fragment>
  ));
}

// One box per message, a Copy button per outcome, so the DM sends the right
// version to one player without retyping it.
function Private({ md }: { md: string }) {
  const p = extractCallouts(md).privates[0];
  if (!p) return null;
  return (
    <>
      {p.when && <div className="sr-private-when"><InlineMd md={stripProvenance(p.when)} /></div>}
      <ul className="sr-private-list">
        {p.outcomes.map((o, i) => (
          <li key={i}>
            {o.label && <span className="sr-private-label"><InlineMd md={o.label} /></span>}
            <span className="sr-private-text">{o.text}</span>
            <CopyButton text={o.text} />
          </li>
        ))}
      </ul>
    </>
  );
}

// A Watch block in a scene lights when its condition comes true, and so do its items.
function Watched({ lit, children }: { lit: Lit; children: ReactNode }) {
  return <ItemClassContext.Provider value={(it) => (itemLit(it, lit) ? 'is-now' : undefined)}>{children}</ItemClassContext.Provider>;
}

export function PbBlockView({ b }: { b: PbBlock }) {
  const lit = useFightLit();
  let label = b.label;
  if (b.voice === 'private') {
    const to = extractCallouts(b.md).privates[0]?.to;
    label = to ? `→ ${to}` : '';
  }
  const watch = b.voice === 'watch' && lit;
  const md = <div className="sr-md"><Markdown md={b.md} spoken /></div>;
  return (
    <div className={`sr-pb sr-pb-${b.voice}${watch && watchCue(b.label, b.md, lit).lit ? ' is-now' : ''}`}>
      <div className="sr-pb-gut">
        <span className="sr-pb-voice">{VOICE_NAME[b.voice]}</span>
        {label && <small><InlineMd md={label} /></small>}
      </div>
      <div className="sr-pb-text">
        {b.voice === 'private' ? <Private md={b.md} />
          : b.voice === 'intro' ? <Intros md={b.md} />
          : watch ? <Watched lit={lit}>{md}</Watched> : md}
      </div>
    </div>
  );
}

export function PromptBook({ prose }: { prose: string }) {
  return <div className="sr-pbook">{promptBlocks(prose).map((b, i) => <PbBlockView key={i} b={b} />)}</div>;
}
