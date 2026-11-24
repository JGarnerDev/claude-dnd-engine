// The side panel: everything the DM opens lands here, with one Back stack. People
// and places, beats and scenes (a peek that doesn't move the walk, with Jump here),
// mystery answers and plan sections. With nothing open it shows home: party, who
// is on this step and in this scene, then the roster, established facts, mysteries
// and plan sections folded away.
//
// Search sits in the runner's header (`/`) and finds all of those; Enter opens the
// top result. On a wide window the panel docks beside the notes; on a narrow one it
// folds to a thin rail and slides over the notes when something opens. The pin
// button (or `\`) docks or hides it whatever the width, and is remembered.
//
// Rows are flush, in divided lists (style pass step 8): one line per row, a muted
// line under it, no box per row.
//
// usePanel.ts holds the panel's state and what the runner calls (open, escape, …).

import { Children, useLayoutEffect, useRef, type ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Disclosure,
  Drawer,
  EmptyState,
  Heading,
  Icon,
  IconButton,
  List,
  Prose,
  Row,
  RowButton,
  Text,
} from "jeff-ui";
import { entityMatch, excerptAround, searchEntities, type Resolver } from "./entities.js";
import { EntityView } from "./EntityView.js";
import { LAYER_HUE, VOICE_HUE } from "./hues.js";
import { LAYER_LABEL } from "./entity-fetch.js";
import { searchFlow, type FlowHit } from "./flow-search.js";
import { plainText } from "./markdown.js";
import { InlineMd, Markdown } from "./MarkdownView.js";
import { searchMysteries } from "./mystery-list.js";
import { BeatPeek, ScenePeek } from "./Peeks.js";
import { isRecapSection } from "./recap-data.js";
import { RefContext } from "./RefChips.js";
import type { RefIndex } from "./ref-index.js";
import { SessionContext, useSession } from "./SessionContext.js";
import type { EntityRef, Section, SessionData } from "./types.js";
import { crumb, type Item, type PanelApi, type PanelContext, type PanelRefs } from "./usePanel.js";

// A search hit's text with the match marked.
function marked(s: string, q: string): ReactNode {
  const i = s.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{s}</>;
  return (
    <>
      {s.slice(0, i)}
      <mark>{s.slice(i, i + q.length)}</mark>
      {s.slice(i + q.length)}
    </>
  );
}

// Where the panel is, in its header: one line, in the panel's voice.
function crumbText(text: string) {
  return (
    <Text as="span" size="xs" mono lines={1} hue={VOICE_HUE.watch} className="sr-pn-crumb">
      {text}
    </Text>
  );
}

function group(title: string, children: ReactNode[]) {
  return (
    children.length > 0 && (
      <>
        <Heading level={3} variant="eyebrow" className="sr-group">
          {title}
        </Heading>
        <Rows>{children}</Rows>
      </>
    )
  );
}

// Panel rows: flush RowButtons, one per item of a divided list.
function Rows({ children }: { children: ReactNode[] }) {
  return (
    <List variant="divided" gap={0} className="sr-rows">
      {Children.map(children, (c) => (
        <li>{c}</li>
      ))}
    </List>
  );
}

function Fold({ title, children }: { title: string; children: ReactNode[] }) {
  return (
    children.length > 0 && (
      <Disclosure className="sr-pn-fold" title={title} count={children.length}>
        <Rows>{children}</Rows>
      </Disclosure>
    )
  );
}

export interface PanelProps {
  p: PanelApi;
  body: PanelRefs["body"];
  data: SessionData;
  resolve: Resolver;
  refs: RefIndex;
  ctx: PanelContext;
  where: string; // where the DM is: "step 2, Riders on the south road"
  onGo: (id: string) => void;
  /** Beside the panel while it is not docked: the buttons that open it. */
  rail?: ReactNode;
  /** The notes, which the panel docks beside or slides over. */
  children: ReactNode;
}

export function Panel(props: PanelProps) {
  const { p, body, data, resolve, refs, ctx, where, onGo, rail, children } = props;
  const { known } = useSession();
  const plan = data.sections.filter((s) => !isRecapSection(s.title));
  const sections: Section[] = [...(data.established ?? []), ...plan];
  const mysteries = data.mysteries ?? [];
  const q = p.query.trim();
  const top = p.stack[p.stack.length - 1];
  const fresh = !!q; // a search result starts a new trail

  // Name and key default inside the body: React Compiler cannot compile a
  // default parameter that reads another parameter's field.
  const row = (e: EntityRef, name?: ReactNode, sub?: ReactNode) => (
    <RowButton
      key={e.name}
      variant="flush"
      className="sr-ent"
      data-entity={e.name}
      onClick={() => p.openEntity(e.name, fresh)}
      title={<span className="sr-ent-name">{name ?? e.name}</span>}
      sub={sub ?? (e.description ? plainText(e.description) : undefined)}
      end={
        <Text as="span" size="xs" tone="muted">
          {[e.type, e.subtype, LAYER_LABEL[e.path.split("/")[0]]].filter(Boolean).join(" · ")}
        </Text>
      }
    />
  );
  const pnRow = (
    key: string | number,
    attr: Record<string, string>,
    onClick: () => void,
    title: ReactNode,
    sub?: ReactNode,
  ) => (
    <RowButton
      key={key}
      variant="flush"
      className="sr-pn-row"
      {...attr}
      onClick={onClick}
      title={title}
      sub={sub}
    />
  );
  const sectionRow = (kind: "mystery" | "section", i: number, title: ReactNode) =>
    pnRow(`${kind}${i}`, { "data-pn": `${kind}|${i}` }, () => p.openSection(kind, i, fresh), title);

  const home = () => {
    const onCard = new Set(ctx.onCard);
    const roster = data.roster.map((n) => resolve(n)).filter((e): e is EntityRef => !!e);
    const established = data.established ?? [];
    const more = [
      <Fold key="r" title="Act roster">
        {roster.map((e) => row(e))}
      </Fold>,
      <Fold key="e" title="Established">
        {established.map((s) => sectionRow("section", sections.indexOf(s), s.title))}
      </Fold>,
      <Fold key="m" title="Mysteries">
        {mysteries.map((s, i) => sectionRow("mystery", i, s.title))}
      </Fold>,
      <Fold key="p" title="Session plan">
        {plan.map((s) => sectionRow("section", sections.indexOf(s), s.title))}
      </Fold>,
    ].filter((_, i) => [roster, established, mysteries, plan][i].length > 0);
    return (
      <>
        {group(
          "Party",
          data.party.map((m) => (
            <RowButton
              key={m.name}
              variant="flush"
              className="sr-pc"
              data-entity={m.name}
              onClick={() => p.openEntity(m.name, fresh)}
              title={<span className="sr-pc-name">{m.name}</span>}
              sub={
                <>
                  {m.status && (
                    <span className="sr-pc-status">
                      <InlineMd md={m.status} />
                    </span>
                  )}
                  <span className="sr-pc-class">
                    {m.raceClass} · L{m.level} · {m.player}
                  </span>
                </>
              }
            />
          )),
        )}
        {group(
          "On this step",
          ctx.onCard.map((e) => row(e)),
        )}
        {group(
          "In this scene",
          ctx.inScene.filter((e) => !onCard.has(e)).map((e) => row(e)),
        )}
        {group("More", more)}
      </>
    );
  };

  const results = () => {
    const hl = (s: string) => marked(s, q);
    // Sessions fold away under their own heading, so a run of "Session 31 The Red
    // Trail", "Session 32 The Red Trail", … can't push people and places out of reach.
    const isSession = (e: EntityRef) => e.type === "session";
    const ents = searchEntities(
      q,
      data.entities.filter((e) => !isSession(e)),
      12,
    ); // few enough that the beats below stay in reach
    const sessionHits = searchEntities(q, data.entities.filter(isSession), 12);
    // A row's muted line says why it matched: the alias, or the description around the hit.
    const why = (e: EntityRef) => {
      const m = entityMatch(e, q);
      if (m?.field === "alias") return <>aka {hl(m.text)}</>;
      if (m?.field === "description") return hl(excerptAround(plainText(m.text), q));
      return undefined;
    };
    const flow = searchFlow(data, refs, q);
    const answers = searchMysteries(q, mysteries);
    const ql = q.toLowerCase();
    const secs = sections.filter(
      (s) => s.title.toLowerCase().includes(ql) || s.md.toLowerCase().includes(ql),
    );
    const hit = (h: FlowHit, i: number) =>
      h.kind === "scene"
        ? pnRow(
            i,
            { "data-scene": h.key },
            () => p.openScene(h.key, fresh),
            hl(`Scene ${h.key} — ${h.title}`),
          )
        : pnRow(
            i,
            { "data-beat": h.id },
            () => p.openBeat(h.id, fresh),
            hl(h.title),
            <>
              <Text as="span" mono>
                {hl(h.id)}
              </Text>{" "}
              · {h.sub}
            </>,
          );
    if (!ents.length && !sessionHits.length && !flow.length && !answers.length && !secs.length)
      return <EmptyState className="sr-empty">No matches for “{q}”.</EmptyState>;
    return (
      <>
        {group(
          "People and places",
          ents.map((e) => row(e, hl(e.name), why(e))),
        )}
        {sessionHits.length > 0 && (
          <Fold title="Sessions">{sessionHits.map((e) => row(e, hl(e.name), why(e)))}</Fold>
        )}
        {group("Beats and scenes", flow.map(hit))}
        {group(
          "Mysteries",
          answers.map((s) => sectionRow("mystery", mysteries.indexOf(s), hl(s.title))),
        )}
        {group(
          "Plan",
          secs.map((s) => sectionRow("section", sections.indexOf(s), hl(s.title))),
        )}
      </>
    );
  };

  const jump = (id: string) => {
    p.jump();
    onGo(id);
  };
  const item = (it: Item) => {
    const peek = { d: data, refs, where, onJump: jump };
    if (it.kind === "beat") return <BeatPeek {...peek} id={it.id} />;
    if (it.kind === "scene") return <ScenePeek {...peek} sceneKey={it.key} />;
    if (it.kind === "entity")
      return (
        <EntityView
          key={it.e.path}
          e={it.e}
          root={data.session.root}
          quickRef={data.quickRefs[it.e.name]}
        />
      );
    const mystery = it.kind === "mystery";
    const s = mystery ? mysteries[it.i] : sections[it.i];
    return (
      <>
        <Heading level={2} className="sr-pn-title">
          {s.title}
        </Heading>
        <Row gap={1}>
          {mystery ? (
            <Badge className="sr-chiptag">mystery · DM answer</Badge>
          ) : (
            <Badge className="sr-layer" data-layer="scheduler" hue={LAYER_HUE.scheduler}>
              plan
            </Badge>
          )}
        </Row>
        <Prose className="sr-md">
          <Markdown md={s.md} />
        </Prose>
      </>
    );
  };

  const close = p.docked ? null : (
    <IconButton data-pn-close="" label="Close the panel" onClick={p.close}>
      <Icon name="close" />
    </IconButton>
  );
  const head = q ? (
    <>
      {crumbText(`Search · “${q}”`)}
      <Button size="sm" variant="ghost" data-pn-clear="" onClick={() => p.setQuery("")}>
        Clear
      </Button>
      {close}
    </>
  ) : top ? (
    <>
      <Button size="sm" variant="ghost" className="sr-back" onClick={p.back}>
        ← Back
      </Button>
      {crumbText(crumb(top))}
      {p.docked ? (
        <Button size="sm" variant="ghost" data-pn-home="" onClick={p.home}>
          Home
        </Button>
      ) : (
        close
      )}
    </>
  ) : (
    <>
      {crumbText("This session")}
      {close}
    </>
  );

  // Back to the top whenever what's shown changes; home and peeks also follow the walk.
  const aside = useRef<HTMLElement>(null);
  const follows = !q && (!top || top.kind === "beat" || top.kind === "scene");
  const followed = follows ? ctx : null;
  useLayoutEffect(() => {
    if (aside.current) aside.current.scrollTop = 0;
  }, [q, top, followed]);

  // Inside the panel a beat, scene or entity link opens here, on the same Back stack.
  const links = {
    ix: refs,
    onBeat: (b: { id: string }) => p.openBeat(b.id, fresh),
    onScene: (s: { key: string }) => p.openScene(s.key, fresh),
  };
  const session = { known, openEntity: (name: string) => p.openEntity(name, fresh) };
  return (
    <Drawer
      label="Side panel"
      className={["sr-body", p.docked && "is-docked", p.open && "is-open"]
        .filter(Boolean)
        .join(" ")}
      docked={p.docked}
      open={p.open}
      rail={rail}
      panelRef={aside}
      header={
        <Row gap={2} wrap={false} className="sr-pn-head">
          {head}
        </Row>
      }
      panel={
        <SessionContext.Provider value={session}>
          <RefContext.Provider value={links}>
            <Box ref={body} padding={3} className="sr-panel-body">
              {q ? results() : top ? item(top) : home()}
            </Box>
          </RefContext.Provider>
        </SessionContext.Provider>
      }
    >
      {children}
    </Drawer>
  );
}
