// What the side panel shows for a beat or a scene opened from a chip or a search: a
// look that doesn't move the walk, with a button that does. A beat peek is its prompt
// book; a scene peek is its header (summary, where, DCs, enemies, time) and its steps
// as beat chips.

import { Fragment, type ReactNode } from "react";
import { Badge, Button, EmptyState } from "jeff-ui";
import type { FlowData } from "./flow-search.js";
import { splitNodeSections } from "./markdown.js";
import { InlineMd } from "./MarkdownView.js";
import { stripProvenance } from "./provenance.js";
import { BeatChip, NoSceneLinks } from "./RefChips.js";
import type { RefIndex } from "./ref-index.js";
import { parseSceneHeader } from "./scene-header.js";
import { BeatBody } from "./Steps.js";

interface PeekProps {
  d: FlowData;
  refs: RefIndex;
  where: string; // where the DM is: "step 2, Riders on the south road"
  onJump: (id: string) => void;
}

// Under a peek: where the DM stands, and the way to get to what's shown.
function note(here: boolean, where: string, children: ReactNode) {
  return (
    <div className="sr-pn-note">
      {here ? (
        <span>You’re on this step.</span>
      ) : (
        <>
          <span>You’re still on {where}.</span>
          {children}
        </>
      )}
    </div>
  );
}

export function BeatPeek({ d, refs, where, onJump, id }: PeekProps & { id: string }) {
  const n = d.nodes.find((x) => x.id === id);
  const b = refs.beat(id);
  if (!n || !b)
    return (
      <EmptyState className="sr-empty">No beat with this id in this session’s flow.</EmptyState>
    );
  const scene = d.scenes.find((s) => s.id === n.scene);
  const prose = splitNodeSections(scene?.md ?? "").nodes.get(id) ?? "";
  return (
    <>
      <NoSceneLinks>
        <h2 className="sr-pn-title">
          <span className="sr-pn-num">{b.num}</span> <InlineMd md={b.title} />
        </h2>
      </NoSceneLinks>
      {note(
        b.here,
        where,
        <Button
          variant="primary"
          className="sr-pn-go"
          data-jump={b.id}
          onClick={() => onJump(b.id)}
        >
          Jump here
        </Button>,
      )}
      <BeatBody n={n} prose={prose} />
    </>
  );
}

function field(label: string, children: ReactNode) {
  return (
    <div className="sr-pn-field">
      <span className="sr-sh-label">{label}</span>
      <span>{children}</span>
    </div>
  );
}

export function ScenePeek({ d, refs, where, onJump, sceneKey }: PeekProps & { sceneKey: string }) {
  const s = refs.scene(sceneKey);
  const scene = d.scenes.find((x) => x.id === s?.id);
  if (!s || !scene)
    return <EmptyState className="sr-empty">No such scene in this plan.</EmptyState>;
  const nodes = d.nodes.filter((n) => n.scene === scene.id);
  const h = parseSceneHeader(splitNodeSections(scene.md).setup, scene.md);
  const p = (x: string) => <InlineMd md={stripProvenance(x)} />;
  const first = nodes[0]?.id ?? "";
  return (
    <>
      <h2 className="sr-pn-title">
        Scene {s.key} — {s.title}
      </h2>
      {s.here ? (
        <div className="sr-pn-note">
          <span>You’re in this scene.</span>
        </div>
      ) : (
        note(
          false,
          where,
          <Button
            variant="primary"
            className="sr-pn-go"
            data-jump={first}
            onClick={() => onJump(first)}
          >
            Cut to Scene {s.key}
          </Button>,
        )
      )}
      {h.summary && <p className="sr-pn-summary">{p(h.summary)}</p>}
      {h.where && field("Where", p(h.where))}
      {h.dcs.length > 0 &&
        field(
          "DCs",
          h.dcs.map((x, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <Badge className="sr-sh-chip">{p(x)}</Badge>
            </Fragment>
          )),
        )}
      {h.enemies.length > 0 &&
        field(
          "Enemies",
          h.enemies.map((x, i) => (
            <Fragment key={i}>
              {i > 0 && " · "}
              {p(x)}
            </Fragment>
          )),
        )}
      {h.time && field("Time", h.time)}
      <ol className="sr-pn-steps">
        {nodes.map((n) => {
          const b = refs.beat(n.id);
          return (
            b && (
              <li key={n.id}>
                <BeatChip b={b} /> {b.title}
              </li>
            )
          );
        })}
      </ol>
    </>
  );
}
