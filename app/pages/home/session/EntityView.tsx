// One entity, opened in the side panel: layer badge, description, this session's
// quick-ref for it (when the plan has one), frontmatter fields, then the body,
// fetched (entity-fetch.ts) once the header is up. The body's "Key: value | …" lines
// show as definition lists (field-lines.ts).

import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Column,
  Prose,
  DescriptionList,
  Disclosure,
  Heading,
  Link,
  List,
  Row,
  Text,
} from "jeff-ui";
import { fetchEntity, LAYER_LABEL } from "./entity-fetch.js";
import { splitFieldLines } from "./field-lines.js";
import { splitEntity } from "./frontmatter.js";
import { LAYER_HUE } from "./hues.js";
import { InlineMd, Markdown } from "./MarkdownView.js";
import type { EntityRef } from "./types.js";

export function EntityHeader({
  e,
  root,
  quickRef,
}: {
  e: EntityRef;
  root: string;
  quickRef?: string;
}) {
  const layer = e.path.split("/")[0];
  const chips = [e.type, e.subtype, e.campaign].filter(Boolean);
  return (
    <Column gap={2} className="sr-ent-head">
      <Heading level={2}>{e.name}</Heading>
      <Row gap={1} className="sr-ent-tags">
        <Badge className="sr-layer" data-layer={layer} hue={LAYER_HUE[layer]}>
          {LAYER_LABEL[layer] ?? layer}
        </Badge>
        {chips.map((c, i) => (
          <Badge key={i} className="sr-chiptag">
            {c}
          </Badge>
        ))}
        <Link
          className="sr-openfile"
          href={`vscode://file/${encodeURI(`${root}/${e.path}`)}`}
          title={e.path}
        >
          Open in VS Code
        </Link>
      </Row>
      {e.description && (
        <Text>
          <InlineMd md={e.description} />
        </Text>
      )}
      {quickRef && (
        <Box hue="var(--ui-accent)" edge="start" className="sr-quickref">
          <Heading level={3} variant="eyebrow" hue="var(--ui-accent)">
            This session
          </Heading>
          <Markdown md={quickRef} />
        </Box>
      )}
    </Column>
  );
}

export function EntityBody({ text }: { text: string }) {
  const { fields, body } = splitEntity(text);
  return (
    <>
      {fields.length > 0 && (
        <Disclosure variant="flush" className="sr-fields" title="Fields">
          <DescriptionList
            items={fields.map(([k, v]) => ({
              term: k.replace(/_/g, " "),
              value: Array.isArray(v) ? (
                <List>
                  {v.map((x, i) => (
                    <li key={i}>
                      <InlineMd md={x} />
                    </li>
                  ))}
                </List>
              ) : (
                <InlineMd md={v} />
              ),
            }))}
          />
        </Disclosure>
      )}
      {splitFieldLines(body).map((part, i) =>
        part.kind === "md" ? (
          <Prose key={i} className="sr-md">
            <Markdown md={part.md} />
          </Prose>
        ) : (
          <DescriptionList
            key={i}
            layout="inline"
            className="sr-ent-fields"
            items={part.items.map(([term, value]) => ({ term, value: <InlineMd md={value} /> }))}
          />
        ),
      )}
    </>
  );
}

type Load = { path: string; text?: string; failed?: boolean };

// The header now, the body once its file arrives.
export function EntityView({
  e,
  root,
  quickRef,
}: {
  e: EntityRef;
  root: string;
  quickRef?: string;
}) {
  const [load, setLoad] = useState<Load>({ path: e.path });
  useEffect(() => {
    let live = true;
    fetchEntity(e.path).then(
      (text) => {
        if (live) setLoad({ path: e.path, text });
      },
      () => {
        if (live) setLoad({ path: e.path, failed: true });
      },
    );
    return () => {
      live = false;
    };
  }, [e.path]);
  const mine = load.path === e.path ? load : { path: e.path };
  return (
    <>
      <EntityHeader e={e} root={root} quickRef={quickRef} />
      <div className="sr-ent-body">
        {mine.text !== undefined ? (
          <EntityBody text={mine.text} />
        ) : mine.failed ? (
          "Could not load this file."
        ) : (
          "Loading…"
        )}
      </div>
    </>
  );
}
