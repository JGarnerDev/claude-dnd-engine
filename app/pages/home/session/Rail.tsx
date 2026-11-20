// The map rail under the header: every step as a numbered chip, grouped by scene,
// colored by kind. Current step ringed, visited steps filled. Click any chip to jump.
// Chips carry step numbers, not ids: ids are for planning, not for the table.

import { useEffect, useRef } from "react";
import { Button } from "jeff-ui";
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
    label: s.key ? s.key : s.id,
    title: s.title,
    nodes: nodes.filter((n) => n.scene === s.id),
  }));
  const loose = nodes.filter((n) => !n.scene || !scenes.some((s) => s.id === n.scene));
  if (loose.length)
    groups.push({ label: "·", title: "Asides — outside the scene boxes", nodes: loose });
  return groups
    .filter((g) => g.nodes.length)
    .map((g, gi) => (
      <div
        key={gi}
        className={`sr-rail-group${g.nodes.some((n) => n.id === current) ? " is-current" : ""}`}
        title={g.title}
      >
        <span className="sr-rail-label">{g.label}</span>
        {g.nodes.map((n, i) => (
          <Button
            key={n.id}
            unstyled
            ref={n.id === current ? here : undefined}
            className={`sr-chip${n.id === current ? " is-current" : ""}${visited.has(n.id) ? " is-visited" : ""}`}
            data-kind={n.kind}
            data-id={n.id}
            title={n.title}
            onClick={() => onJump(n.id)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    ));
}
