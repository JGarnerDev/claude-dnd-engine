// One guide section, or a search's hits, as cards of tappable plays. Tapping a play
// opens its text inside the card, under the tiles; tapping it again closes it. Only
// one play is open at a time. A section whose groups share the same leads
// (Strategies: Team / the PC) shows one big tile per group, opening all its lines.
// The turn's yes/no checklist runs as a DecisionFlow.

import { Badge, Card } from "jeff-ui";
import { InlineMd } from "../session/MarkdownView.js";
import { DecisionFlow } from "./DecisionFlow.js";
import {
  isParallel,
  type GroupHit,
  type GuideGroup,
  type GuideItem,
  type TreeSection,
} from "./guide-items.js";

/** What an open tile shows. */
export interface Opened {
  /** The tile that opened it: an item id, or a group's section/slug for a whole-group tile. */
  key: string;
  crumb: string;
  items: GuideItem[];
}

interface Tile {
  key: string;
  label: string;
  concentration?: boolean;
  opens: Opened;
}

const CONCENTRATION_HUE = "var(--ui-hue-plum)";

/** The mark on a spell that needs concentration: "C" on a tile, spelled out in the open text. */
function ConcentrationMark({ short }: { short: boolean }) {
  return (
    <span
      className={`pg-conc ${short ? "pg-conc-tile" : "pg-conc-open"}`}
      title="Needs concentration"
    >
      <Badge hue={CONCENTRATION_HUE}>{short ? "C" : "concentration"}</Badge>
    </span>
  );
}

interface OpenProps {
  open: Opened | null;
  onTap: (o: Opened) => void;
}

function OpenText({ opened }: { opened: Opened }) {
  return (
    <div className="pg-open">
      <p className="pg-crumb">{opened.crumb}</p>
      {opened.items.map((i) => (
        <p key={i.id} className="pg-open-item">
          {i.lead && <strong>{i.lead}: </strong>}
          {i.concentration && <ConcentrationMark short={false} />}
          <InlineMd md={i.detail} />
        </p>
      ))}
    </div>
  );
}

function Tiles({ tiles, big = false, open, onTap }: { tiles: Tile[]; big?: boolean } & OpenProps) {
  const mine = tiles.find((t) => t.key === open?.key);
  return (
    <>
      <div className="pg-tiles">
        {tiles.map((t) => {
          const on = t.key === open?.key;
          return (
            <button
              key={t.key}
              type="button"
              className={`pg-tile${big ? " pg-tile-big" : ""}${on ? " pg-tile-on" : ""}`}
              aria-expanded={on}
              onClick={() => onTap(t.opens)}
            >
              {t.label}
              {t.concentration && <ConcentrationMark short />}
            </button>
          );
        })}
      </div>
      {mine && open && <OpenText opened={open} />}
    </>
  );
}

/** A group's card: its note, a tile per play with a lead, and lead-less lines as plain text. */
function GroupCard({ hit, title, ...p }: { hit: GroupHit; title: string } & OpenProps) {
  const crumb = `${hit.section} › ${hit.group.title}`;
  const plays = hit.items.filter((i) => i.lead);
  const lines = hit.items.filter((i) => !i.lead);
  return (
    <Card title={title} actions={<Badge>{hit.items.length}</Badge>} className="pg-card">
      {hit.group.note && (
        <p className="pg-note">
          <InlineMd md={hit.group.note} />
        </p>
      )}
      {plays.length > 0 && (
        <Tiles
          tiles={plays.map((i) => ({
            key: i.id,
            label: i.lead ?? "",
            concentration: i.concentration,
            opens: { key: i.id, crumb, items: [i] },
          }))}
          {...p}
        />
      )}
      {lines.length > 0 && (
        <ul className="pg-lines">
          {lines.map((i) => (
            <li key={i.id}>
              <InlineMd md={i.detail} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ParallelCard({ section, ...p }: { section: TreeSection } & OpenProps) {
  return (
    <Card title={`${section.title}: pick one`}>
      <Tiles
        big
        tiles={section.groups.map((g) => {
          const key = `${section.slug}/${g.slug}`;
          return { key, label: g.title, opens: { key, crumb: section.title, items: g.items } };
        })}
        {...p}
      />
    </Card>
  );
}

/** One section of the guide, as the page shows it under its tab. */
export function SectionPlays({
  section,
  flow,
  ...p
}: { section: TreeSection; flow: GuideGroup | null } & OpenProps) {
  if (isParallel(section.groups)) return <ParallelCard section={section} {...p} />;
  return section.groups.map((g) =>
    g === flow ? (
      <DecisionFlow
        key={g.slug}
        steps={g.items.map((i) => ({ question: i.lead ?? "", answer: i.detail }))}
      />
    ) : (
      <GroupCard
        key={g.slug}
        hit={{ section: section.title, group: g, items: g.items }}
        title={g.title}
        {...p}
      />
    ),
  );
}

/**
 * The play a search should open by itself: its only hit, when there is exactly one and it
 * is a tile (a lead-less line already shows its text). Otherwise null.
 */
export function onlyHit(hits: readonly GroupHit[]): Opened | null {
  const [hit, ...rest] = hits;
  const item = hit?.items[0];
  if (!hit || rest.length > 0 || hit.items.length !== 1 || !item?.lead) return null;
  return { key: item.id, crumb: `${hit.section} › ${hit.group.title}`, items: [item] };
}

/** A search's hits across every section, each card titled with where it lives. */
export function SearchPlays({
  hits,
  query,
  ...p
}: { hits: GroupHit[]; query: string } & OpenProps) {
  if (hits.length === 0) return <p className="pg-crumb">Nothing matches “{query}”.</p>;
  return hits.map((h) => (
    <GroupCard
      key={`${h.section}/${h.group.slug}`}
      hit={h}
      title={`${h.section} › ${h.group.title}`}
      {...p}
    />
  ));
}
