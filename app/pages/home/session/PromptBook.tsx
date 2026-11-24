// A beat's prose as a prompt book: one block per bullet, paragraph or read-aloud
// quote (prompt-blocks.ts), each labelled above its text with a voice the DM can see at
// a glance, in plan order:
//
//   You      for the DM to read: what's true, what happens, how to run it (plain sans)
//   Say      for the players: read-aloud quotes and spoken lines (upright serif)
//   Time     the clock moves: `Time passes:` (night falls, the next morning, two weeks)
//   Do       at the table or in Roll20: tokens, music, title cards, HP to set (mono)
//   Watch    conditional: "When …", "If …", "Once …", what triggers what
//   Choice   a real choice (`Choice (party):`, `Choice (Iggy):`)
//   Private  a message for one player, one Copy button per outcome
//   Introduce  a character's first appearance: look, sound, impression
//   Fight    where a fight or a boss fight starts and ends (`Combat starts:`, `Boss fight ends:`)

import { Fragment, type CSSProperties, type ReactNode } from "react";
import { CopyButton, Heading, List, Prose, Text } from "jeff-ui";
import { VOICE_HUE } from "./hues.js";
import { itemLit, watchCue, type Lit } from "./fight-cues.js";
import { rollableInline } from "./Dice.js";
import { useFightLit } from "./FightContext.js";
import { extractCallouts } from "./markdown.js";
import { InlineMd, ItemClassContext, Markdown } from "./MarkdownView.js";
import { promptBlocks, VOICE_NAME, type PbBlock } from "./prompt-blocks.js";
import { stripProvenance } from "./provenance.js";

function Intros({ md }: { md: string }) {
  return extractCallouts(md).intros.map((x, i) => (
    <Fragment key={i}>
      <Heading level={3} size="md" className="sr-intro-name">
        <InlineMd md={stripProvenance(x.name)} />
      </Heading>
      <Prose className="sr-md">
        <Markdown md={x.md} />
      </Prose>
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
      {p.when && (
        <Text as="div" size="sm" tone="muted" className="sr-private-when">
          <InlineMd md={stripProvenance(p.when)} />
        </Text>
      )}
      <List variant="divided" gap={2} className="sr-private-list">
        {p.outcomes.map((o, i) => (
          <li key={i}>
            {o.label && (
              <Text as="span" size="xs" caps hue={VOICE_HUE.private} className="sr-private-label">
                <InlineMd md={o.label} />
              </Text>
            )}
            <Text as="span" className="sr-private-text">
              {o.text}
            </Text>
            <CopyButton
              size="sm"
              className="sr-copy"
              data-copy={o.text}
              title="Copy this message"
              text={o.text}
            />
          </li>
        ))}
      </List>
    </>
  );
}

// A Watch block in a scene lights when its condition comes true, and so do its items.
function Watched({ lit, children }: { lit: Lit; children: ReactNode }) {
  return (
    <ItemClassContext.Provider value={(it) => (itemLit(it, lit) ? "is-now" : undefined)}>
      {children}
    </ItemClassContext.Provider>
  );
}

export function PbBlockView({ b }: { b: PbBlock }) {
  const lit = useFightLit();
  let label = b.label;
  if (b.voice === "private") {
    const to = extractCallouts(b.md).privates[0]?.to;
    label = to ? `→ ${to}` : "";
  }
  const watch = b.voice === "watch" && lit;
  // Dice in the DM's text become buttons; read-aloud lines stay plain.
  const md = (
    <Prose className="sr-md">
      <Markdown md={b.md} spoken text={b.voice === "say" ? undefined : rollableInline} />
    </Prose>
  );
  const hue = { "--ui-hue": VOICE_HUE[b.voice] } as CSSProperties;
  return (
    <div
      className={`sr-pb sr-pb-${b.voice}${watch && watchCue(b.label, b.md, lit).lit ? " is-now" : ""}`}
      style={hue}
    >
      <div className="sr-pb-gut">
        <Text as="span" size="xs" caps hue={VOICE_HUE[b.voice]} className="sr-pb-voice">
          {VOICE_NAME[b.voice]}
        </Text>
        {label && (
          <small>
            <InlineMd md={label} />
          </small>
        )}
      </div>
      <div className="sr-pb-text">
        {b.voice === "private" ? (
          <Private md={b.md} />
        ) : b.voice === "intro" ? (
          <Intros md={b.md} />
        ) : watch ? (
          <Watched lit={lit}>{md}</Watched>
        ) : (
          md
        )}
      </div>
    </div>
  );
}

export function PromptBook({ prose }: { prose: string }) {
  return (
    <div className="sr-pbook">
      {promptBlocks(prose).map((b, i) => (
        <PbBlockView key={i} b={b} />
      ))}
    </div>
  );
}
