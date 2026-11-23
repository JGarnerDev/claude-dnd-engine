// What the side panel shows for a beat or a scene opened from a chip or a search: a
// look that doesn't move the walk, with a button that does. A beat peek is its prompt
// book; a scene peek is its header (summary, where, DCs, enemies, time) and its steps
// as beat chips.

import { Fragment, type ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Column,
  DescriptionList,
  EmptyState,
  Heading,
  List,
  Row,
  Text,
  type DescriptionItem,
} from "jeff-ui";
import type { FlowData } from "./flow-search.js";
import { splitNodeSections } from "./markdown.js";
import { VOICE_HUE } from "./hues.js";
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
  return here ? noteBox("You’re on this step.") : noteBox(`You’re still on ${where}.`, children);
}

function noteBox(text: string, action?: ReactNode) {
  return (
    <Box hue={VOICE_HUE.watch} padding={2} className="sr-pn-note">
      <Row justify="between" gap={2}>
        <Text as="span" size="sm" tone="muted">
          {text}
        </Text>
        {action}
      </Row>
    </Box>
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
        <Heading level={2} className="sr-pn-title">
          <Badge solid hue={VOICE_HUE.watch}>
            {b.num}
          </Badge>{" "}
          <InlineMd md={b.title} />
        </Heading>
      </NoSceneLinks>
      {note(
        b.here,
        where,
        <Button size="sm" variant="primary" data-jump={b.id} onClick={() => onJump(b.id)}>
          Jump here
        </Button>,
      )}
      <BeatBody n={n} prose={prose} />
    </>
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
  const fields: DescriptionItem[] = [];
  if (h.where) fields.push({ term: "Where", value: p(h.where) });
  if (h.dcs.length > 0)
    fields.push({
      term: "DCs",
      value: (
        <Row gap={1}>
          {h.dcs.map((x, i) => (
            <Badge key={i}>{p(x)}</Badge>
          ))}
        </Row>
      ),
    });
  if (h.enemies.length > 0)
    fields.push({
      term: "Enemies",
      value: h.enemies.map((x, i) => (
        <Fragment key={i}>
          {i > 0 && " · "}
          {p(x)}
        </Fragment>
      )),
    });
  if (h.time) fields.push({ term: "Time", value: h.time });
  return (
    <Column gap={2}>
      <Heading level={2} className="sr-pn-title">
        Scene {s.key} — {s.title}
      </Heading>
      {s.here
        ? noteBox("You’re in this scene.")
        : note(
            false,
            where,
            <Button size="sm" variant="primary" data-jump={first} onClick={() => onJump(first)}>
              Cut to Scene {s.key}
            </Button>,
          )}
      {h.summary && <Text className="sr-pn-summary">{p(h.summary)}</Text>}
      {fields.length > 0 && <DescriptionList layout="inline" items={fields} />}
      <List variant="plain" gap={1} className="sr-pn-steps">
        {nodes.map((n) => {
          const b = refs.beat(n.id);
          return (
            b && (
              <li key={n.id}>
                <Box surface padding={2}>
                  <BeatChip b={b} /> {b.title}
                </Box>
              </li>
            )
          );
        })}
      </List>
    </Column>
  );
}
