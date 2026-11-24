// The map rail under the header: every step as a numbered chip, grouped by scene.
// Chips are neutral with a small mark in the kind's hue; the current step is the
// one gold chip, visited steps are filled. Click any chip to jump.
// Chips carry step numbers, not ids: ids are for planning, not for the table.

import { useEffect, useRef } from "react";
import { Box, Row, Text, Waypoint } from "jeff-ui";
import { kindHue } from "./hues.js";
import { RECAP_SCENE } from "./recap-data.js";
import type { FlowNode, Scene } from "./types.js";

export interface RailProps {
  nodes: FlowNode[];
  scenes: Scene[];
  current: string;
  visited: ReadonlySet<string>;
  onJump: (id: string) => void;
}

export function Rail({ nodes, scenes, current, visited, onJump }: RailProps) {
  const here = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    here.current?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [current]);
  const groups = scenes.map((s) => ({
    label: s.id === RECAP_SCENE ? "Recap" : s.key ? s.key : s.id,
    title: s.title,
    nodes: nodes.filter((n) => n.scene === s.id),
  }));
  const loose = nodes.filter((n) => !n.scene || !scenes.some((s) => s.id === n.scene));
  if (loose.length)
    groups.push({ label: "Asides", title: "Asides — outside the scene boxes", nodes: loose });
  return groups
    .filter((g) => g.nodes.length)
    .map((g, gi) => (
      <Box
        key={gi}
        padding={1}
        surface={g.nodes.some((n) => n.id === current)}
        className="sr-rail-group"
        title={g.title}
      >
        <Row gap={1}>
          <Text as="span" size="xs" tone="muted" caps className="sr-rail-label">
            {g.label}
          </Text>
          {g.nodes.map((n, i) => (
            <Waypoint
              key={n.id}
              ref={n.id === current ? here : undefined}
              variant="marked"
              className="sr-chip"
              current={n.id === current}
              visited={visited.has(n.id)}
              hue={kindHue(n.kind)}
              data-kind={n.kind}
              data-id={n.id}
              title={n.title}
              onClick={() => onJump(n.id)}
            >
              {i + 1}
            </Waypoint>
          ))}
        </Row>
      </Box>
    ));
}
