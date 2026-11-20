// The "Previously on…" card (pure). Every session the runner loads opens on a
// recap of the session before it, pulled from historian (the `recap`,
// `cliffhanger` and `description` fields /recap writes), so nobody has to write
// one by hand. Shape follows CLAUDE.md's Recap Format: a short narrative, then
// TL;DR bullets — party status, open threads, cliffhanger.
//
// When that session belongs to the other season, the extractor also sends the
// last session played in this season, shown as "Last time in this world".
//
// When the previous session has a party-facing deck (_slides.md), the card
// carries a Slides button that opens it fullscreen (slides.ts).
//
// A plan may carry its own `## Recap` section — a hand-written, read-aloud
// version. It leads the card, and the plan panel leaves it out.

import type { SessionData } from "./types.js";

export const RECAP_ID = "PREVIOUSLY";
export const RECAP_SCENE = "PREV";

// Prepend the recap as a synthetic first card with its own rail group. A no-op
// when historian has no earlier session (the campaign's very first night).
export function withRecap(data: SessionData): SessionData {
  const prev = data.previously?.[0];
  const first = data.nodes[0];
  if (!prev || !first) return data;
  return {
    ...data,
    nodes: [
      {
        id: RECAP_ID,
        marker: null,
        kind: "recap",
        scene: RECAP_SCENE,
        title: `Previously on… ${prev.name}`,
        lines: [],
        notes: [],
      },
      ...data.nodes,
    ],
    scenes: [{ id: RECAP_SCENE, key: "prev", title: "Previously on…", md: "" }, ...data.scenes],
    edges: [{ from: RECAP_ID, to: first.id, label: "", dashed: false }, ...data.edges],
  };
}

export const isRecapSection = (title: string) => /^recap$/i.test(title.trim());

export const writtenRecap = (data: SessionData) =>
  data.sections.find((s) => isRecapSection(s.title))?.md ?? "";

// All the recap's prose, for finding the entities it mentions.
export function recapText(data: SessionData): string {
  return [
    writtenRecap(data),
    ...data.previously.flatMap((p) => [p.description, p.cliffhanger, p.recap]),
  ].join("\n");
}
