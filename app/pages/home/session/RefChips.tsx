// Chips for beats, scenes and handout cards named in campaign prose (ref-index.ts
// resolves them). In the runner each beat or scene chip opens it in the side panel
// without moving the walk; beat chips are violet, numbered by the id's position
// ("7A"), or for older ids by step ("3", or "4.2" in another scene); scene chips are
// gold. A card opens its published artifact in a new tab. An id that matches nothing,
// or a card with no recorded link, stays plain and dotted, so a typo shows as such.
//
// <Markdown> links refs only under a RefContext, so prose outside the runner's main
// column and panel (the recap slides) stays plain. "Scene N" is linked in text only,
// never inside a link, a button, code or a top heading (NoSceneLinks); a beat id or
// card path only as a whole `code` span.

import { createContext, Fragment, useContext, type ReactNode } from "react";
import { Badge, Button, Link } from "jeff-ui";
import { VOICE_HUE } from "./hues.js";
import type { BeatRef, RefIndex, SceneRef } from "./ref-index.js";
import type { CardRef } from "./types.js";

export interface RefLinks {
  ix: RefIndex;
  onBeat: (b: BeatRef) => void;
  onScene: (s: SceneRef) => void;
}

export const RefContext = createContext<RefLinks | null>(null);

const NoScenesContext = createContext(false);

// Text inside here never turns "Scene N" into a chip (option buttons, step heads, h1/h2).
export function NoSceneLinks({ children }: { children: ReactNode }) {
  return <NoScenesContext.Provider value>{children}</NoScenesContext.Provider>;
}

export function BeatChip({ b }: { b: BeatRef }) {
  const links = useContext(RefContext);
  const where = /\./.test(b.num)
    ? `Scene ${b.num.split(".")[0]}, step ${b.num.split(".")[1]}`
    : `step ${b.num}`;
  return (
    <Button
      size="sm"
      hue={VOICE_HUE.watch}
      className={`sr-bref${b.here ? " is-here" : ""}`}
      data-beat={b.id}
      title={`${b.id} · ${where} · ${b.title}${b.here ? " (you are here)" : ""}`}
      onClick={() => links?.onBeat(b)}
    >
      <Badge solid hue={VOICE_HUE.watch} className="sr-bref-n">
        {b.num}
      </Badge>
      {b.short}
    </Button>
  );
}

export function SceneChip({ s }: { s: SceneRef }) {
  const links = useContext(RefContext);
  return (
    <Button
      size="sm"
      hue="var(--ui-accent)"
      className={`sr-bref is-scene${s.here ? " is-here" : ""}`}
      data-scene={s.key}
      title={`Scene ${s.key} · ${s.title}${s.here ? " (you are here)" : ""}`}
      onClick={() => links?.onScene(s)}
    >
      <Badge solid tone="accent" className="sr-bref-n">
        S{s.key}
      </Badge>
      {s.title}
    </Button>
  );
}

export function CardLink({ c }: { c: CardRef }) {
  return (
    <Link
      className="sr-cardref"
      href={c.url}
      target="_blank"
      rel="noopener"
      title={`Open the published card · ${c.path}`}
    >
      {c.title}
    </Link>
  );
}

const BEAT_CODE_RE = /^[A-Z][A-Z0-9]*_[A-Z0-9_]+$/;
const CARD_CODE_RE = /^(?:\S*\/)?handouts\/\S+\.html$/;
const SCENE_RE = /\bScene (\d+[a-z]?)\b/g;

// A `code` span: a beat chip or card link when it names one, flagged when it names none.
export function CodeRef({ s }: { s: string }) {
  const links = useContext(RefContext);
  if (links && CARD_CODE_RE.test(s)) {
    const c = links.ix.card(s);
    if (c?.url) return <CardLink c={c} />;
    const why = c
      ? "Card not published yet: no artifact link in the file"
      : "No such card in this session's handouts/";
    return (
      <code className="sr-ref-missing" title={why}>
        {s}
      </code>
    );
  }
  if (links && BEAT_CODE_RE.test(s)) {
    const b = links.ix.beat(s);
    return b ? (
      <BeatChip b={b} />
    ) : (
      <code className="sr-ref-missing" title="No beat with this id in this session's flow">
        {s}
      </code>
    );
  }
  return <code>{s}</code>;
}

function linkScenes(s: string, ix: RefIndex): ReactNode {
  if (!s.includes("Scene ")) return s;
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of s.matchAll(SCENE_RE)) {
    const sc = ix.scene(m[1]);
    if (!sc) continue;
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(<SceneChip key={m.index} s={sc} />);
    last = m.index + m[0].length;
  }
  if (!out.length) return s;
  if (last < s.length) out.push(s.slice(last));
  return out;
}

// For <Markdown>: a function that turns "Scene N" in a rendered text run into chips,
// or null where scenes aren't linked. Only the run's plain strings are touched, so
// dice buttons and the like pass through.
export function useSceneLinker(): ((node: ReactNode) => ReactNode) | null {
  const links = useContext(RefContext);
  const off = useContext(NoScenesContext);
  if (!links || off) return null;
  return (node) => {
    if (typeof node === "string") return linkScenes(node, links.ix);
    if (Array.isArray(node))
      return node.map((x, i) =>
        typeof x === "string" ? <Fragment key={`s${i}`}>{linkScenes(x, links.ix)}</Fragment> : x,
      );
    return node;
  };
}
