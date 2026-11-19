// The "Previously on…" card: the session before this one, from historian (the
// `recap`, `cliffhanger` and `description` fields /recap writes), shaped as
// CLAUDE.md's Recap Format: a short narrative, then TL;DR bullets for party
// status, open threads and the cliffhanger. A plan's own `## Recap` leads it, and
// when that session sits in the other season, the last one in this season follows
// as "Last time in this world". A Slides button opens the previous session's
// party-facing deck (_slides.md) fullscreen.

import { InlineMd, Markdown } from './MarkdownView.js';
import { writtenRecap } from './recap-data.js';
import type { PreviousSession, SessionData } from './types.js';

function Meta({ p }: { p: PreviousSession }) {
  return <div className="sr-recap-meta">{[p.date && `played ${p.date}`, p.campaign].filter(Boolean).join(' · ')}</div>;
}

function Full({ p }: { p: PreviousSession }) {
  return p.recap && (
    <details className="sr-recap-full"><summary>Full recap — {p.name}</summary><p><InlineMd md={p.recap} /></p></details>
  );
}

export function Recap({ data, onSlides }: { data: SessionData; onSlides: () => void }) {
  const [prev, inSeason] = data.previously;
  if (!prev) return null;
  const written = writtenRecap(data);
  const threads = data.session.looseThreads;
  return (
    <>
      {prev.slides.length > 0 && <button type="button" className="sr-slides-open" data-act="slides" title="Show the party-facing slides" onClick={onSlides}>Slides</button>}
      <Meta p={prev} />
      {written && <div className="sr-recap-written sr-md"><Markdown md={written} /></div>}
      {prev.description && !written && <p className="sr-recap-lead"><InlineMd md={prev.description} /></p>}
      <h3 className="sr-recap-h">TL;DR</h3>
      <ul className="sr-recap-tldr">
        {data.party.length > 0 && (
          <li><strong>Party</strong><ul>{data.party.map((pc, i) => (
            <li key={i}><strong>{pc.name}</strong>{pc.status && <> — <InlineMd md={pc.status} /></>}</li>
          ))}</ul></li>
        )}
        {threads.length > 0 && <li><strong>Open threads</strong><ul>{threads.map((t, i) => <li key={i}><InlineMd md={t} /></li>)}</ul></li>}
        {prev.cliffhanger && <li><strong>Cliffhanger</strong> — <InlineMd md={prev.cliffhanger} /></li>}
      </ul>
      <Full p={prev} />
      {inSeason && (
        <div className="sr-recap-season">
          <h3 className="sr-recap-h">Last time in this world — {inSeason.name}</h3>
          <Meta p={inSeason} />
          {inSeason.description && <p><InlineMd md={inSeason.description} /></p>}
          {inSeason.cliffhanger && <p><strong>Left off</strong> — <InlineMd md={inSeason.cliffhanger} /></p>}
          <Full p={inSeason} />
        </div>
      )}
    </>
  );
}
