// The "Previously on…" card: the session before this one, from historian (the
// `recap`, `cliffhanger` and `description` fields /recap writes), shaped as
// CLAUDE.md's Recap Format: a short narrative, then TL;DR bullets for party
// status, open threads and the cliffhanger. A plan's own `## Recap` leads it, and
// when that session sits in the other season, the last one in this season follows
// as "Last time in this world". A Slides button opens the previous session's
// party-facing deck (_slides.md) fullscreen.

import { Button, Column, Disclosure, Divider, Heading, List, Prose, Row, Text } from "jeff-ui";
import { KIND_HUE } from "./hues.js";
import { InlineMd, Markdown } from "./MarkdownView.js";
import { writtenRecap } from "./recap-data.js";
import type { PreviousSession, SessionData } from "./types.js";

function meta(p: PreviousSession) {
  return (
    <Text as="div" size="sm" tone="muted" className="sr-recap-meta">
      {[p.date && `played ${p.date}`, p.campaign].filter(Boolean).join(" · ")}
    </Text>
  );
}

function Full({ p }: { p: PreviousSession }) {
  return (
    p.recap && (
      <Disclosure className="sr-recap-full" title={`Full recap — ${p.name}`}>
        <Prose>
          <p>
            <InlineMd md={p.recap} />
          </p>
        </Prose>
      </Disclosure>
    )
  );
}

export function Recap({ data, onSlides }: { data: SessionData; onSlides: () => void }) {
  const [prev, inSeason] = data.previously;
  if (!prev) return null;
  const written = writtenRecap(data);
  const threads = data.session.looseThreads;
  return (
    <Column gap={3}>
      <Row justify="between" align="center" gap={3}>
        {meta(prev)}
        {prev.slides.length > 0 && (
          <Button
            size="sm"
            hue={KIND_HUE.recap}
            className="sr-slides-open"
            data-act="slides"
            title="Show the party-facing slides"
            onClick={onSlides}
          >
            Slides
          </Button>
        )}
      </Row>
      {written && (
        <Prose className="sr-recap-written sr-md">
          <Markdown md={written} />
        </Prose>
      )}
      {prev.description && !written && (
        <Text className="sr-recap-lead">
          <InlineMd md={prev.description} />
        </Text>
      )}
      <Heading level={3} variant="eyebrow" className="sr-recap-h">
        TL;DR
      </Heading>
      <List gap={2} className="sr-recap-tldr">
        {data.party.length > 0 && (
          <li>
            <strong>Party</strong>
            <ul>
              {data.party.map((pc, i) => (
                <li key={i}>
                  <strong>{pc.name}</strong>
                  {pc.status && (
                    <>
                      {" "}
                      — <InlineMd md={pc.status} />
                    </>
                  )}
                </li>
              ))}
            </ul>
          </li>
        )}
        {threads.length > 0 && (
          <li>
            <strong>Open threads</strong>
            <ul>
              {threads.map((t, i) => (
                <li key={i}>
                  <InlineMd md={t} />
                </li>
              ))}
            </ul>
          </li>
        )}
        {prev.cliffhanger && (
          <li>
            <strong>Cliffhanger</strong> — <InlineMd md={prev.cliffhanger} />
          </li>
        )}
      </List>
      <Full p={prev} />
      {inSeason && (
        <Column gap={2} className="sr-recap-season">
          <Divider />
          <Heading level={3} variant="eyebrow" className="sr-recap-h">
            Last time in this world — {inSeason.name}
          </Heading>
          {meta(inSeason)}
          {inSeason.description && (
            <Text>
              <InlineMd md={inSeason.description} />
            </Text>
          )}
          {inSeason.cliffhanger && (
            <Text>
              <strong>Left off</strong> — <InlineMd md={inSeason.cliffhanger} />
            </Text>
          )}
          <Full p={inSeason} />
        </Column>
      )}
    </Column>
  );
}
