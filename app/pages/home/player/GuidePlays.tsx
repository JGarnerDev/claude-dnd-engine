// One guide section, or a search's hits, as cards of tappable plays. Tapping a play
// opens its text inside the card, under the tiles; tapping it again closes it. Only
// one play is open at a time. A section whose groups share the same leads
// (Strategies: Team / the PC) shows one big tile per group, opening all its lines.
// A play can be starred from its open text: favorites go first in their card (or
// divider run) with an outline, kept per PC in this browser.
// A card's spells sit under a Spells divider, one sublist per level from cantrips up.
// A spell's tile shows a C when it needs concentration; its open text spells out its
// level and concentration and puts what upcasting does on a line of its own.

import { Badge, Card } from "jeff-ui";
import { InlineMd } from "../session/MarkdownView.js";
import type { StoredSet } from "./stored-set.js";
import {
  byLevel,
  isParallel,
  levelTitle,
  type GroupHit,
  type GuideItem,
  type TreeSection,
} from "./guide-items.js";

/** What an open tile shows. */
export interface Opened {
  /** The tile that opened it: an item id, or a group's section/slug for a whole-group tile. */
  key: string;
  crumb: string;
  items: GuideItem[];
  /** The favorite key of the one play it shows, or absent when it can't be starred. */
  favKey?: string;
}

interface Tile {
  key: string;
  label: string;
  /** The spell marks on the tile, or absent for a play that isn't a spell. */
  spell?: GuideItem;
  fav?: boolean;
  opens: Opened;
}

const CONCENTRATION_HUE = "var(--ui-hue-plum)";
const LEVEL_HUE = "var(--ui-hue-sky)";

function levelName(level: string): string {
  return level === "cantrip" ? "cantrip" : `${level} level`;
}

/**
 * A spell's marks. On a tile only a C when it needs concentration (its sublist says its
 * level); the open text spells out both ("1st level", "concentration").
 */
function SpellMarks({ item, short }: { item: GuideItem; short: boolean }) {
  return (
    <>
      {item.level && !short && (
        <span className="pg-mark pg-mark-open" title="Spell level">
          <Badge hue={LEVEL_HUE}>{levelName(item.level)}</Badge>
        </span>
      )}
      {item.concentration && (
        <span
          className={`pg-mark ${short ? "pg-mark-tile" : "pg-mark-open"}`}
          title="Needs concentration"
        >
          <Badge hue={CONCENTRATION_HUE}>{short ? "C" : "concentration"}</Badge>
        </span>
      )}
    </>
  );
}

interface OpenProps {
  open: Opened | null;
  onTap: (o: Opened) => void;
  /** The PC's favorite plays, by favKey. */
  favs: StoredSet;
}

function FavToggle({ favKey, favs }: { favKey: string; favs: StoredSet }) {
  const on = favs.has(favKey);
  return (
    <button
      type="button"
      className={`pg-fav-toggle${on ? " pg-fav-toggle-on" : ""}`}
      aria-pressed={on}
      onClick={() => favs.set(favKey, !on)}
    >
      <span aria-hidden="true">{on ? "★" : "☆"}</span> Favorite
    </button>
  );
}

function OpenText({ opened, favs }: { opened: Opened; favs: StoredSet }) {
  return (
    <div className="pg-open">
      <div className="pg-open-head">
        <p className="pg-crumb">{opened.crumb}</p>
        {opened.favKey && <FavToggle favKey={opened.favKey} favs={favs} />}
      </div>
      {opened.items.map((i) => (
        <div key={i.id} className="pg-open-item">
          <p>
            {i.lead && <strong>{i.lead}: </strong>}
            <SpellMarks item={i} short={false} />
            <InlineMd md={i.detail} />
          </p>
          {i.upcast && (
            <p className="pg-upcast">
              <strong>Upcast: </strong>
              <InlineMd md={i.upcast} />
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Tiles({
  tiles,
  big = false,
  open,
  onTap,
  favs,
}: { tiles: Tile[]; big?: boolean } & OpenProps) {
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
              className={`pg-tile${big ? " pg-tile-big" : ""}${on ? " pg-tile-on" : ""}${t.fav ? " pg-tile-fav" : ""}`}
              aria-expanded={on}
              onClick={() => onTap(t.opens)}
            >
              {t.label}
              {t.spell && <SpellMarks item={t.spell} short />}
            </button>
          );
        })}
      </div>
      {mine && open && <OpenText opened={open} favs={favs} />}
    </>
  );
}

/** Consecutive items under the same `#### ` divider, in order. */
function runsByPart(items: readonly GuideItem[]): { part: string | null; items: GuideItem[] }[] {
  const runs: { part: string | null; items: GuideItem[] }[] = [];
  for (const i of items) {
    const last = runs[runs.length - 1];
    if (last && last.part === i.part) last.items.push(i);
    else runs.push({ part: i.part, items: [i] });
  }
  return runs;
}

/** The items with favorites first, each side keeping guide order. */
function favoritesFirst(items: readonly GuideItem[], favs: StoredSet): GuideItem[] {
  return [...items.filter((i) => favs.has(i.favKey)), ...items.filter((i) => !favs.has(i.favKey))];
}

/** A group's card: its note, a tile per play with a lead, and lead-less lines as plain text. */
function GroupCard({ hit, title, ...p }: { hit: GroupHit; title: string } & OpenProps) {
  const crumb = `${hit.section} › ${hit.group.title}`;
  const plays = hit.items.filter((i) => i.lead);
  const lines = hit.items.filter((i) => !i.lead);
  const tilesOf = (items: readonly GuideItem[]): Tile[] =>
    favoritesFirst(items, p.favs).map((i) => ({
      key: i.id,
      label: i.lead ?? "",
      spell: i,
      fav: p.favs.has(i.favKey),
      opens: { key: i.id, crumb, items: [i], favKey: i.favKey },
    }));
  return (
    <Card title={title} actions={<Badge>{hit.items.length}</Badge>} className="pg-card">
      {hit.group.note && (
        <p className="pg-note">
          <InlineMd md={hit.group.note} />
        </p>
      )}
      {runsByPart(plays).map((run) => {
        const { others, levels } = byLevel(run.items);
        return (
          <div key={run.items[0].id} className="pg-run">
            {run.part && <p className="pg-divider">{run.part}</p>}
            {others.length > 0 && <Tiles tiles={tilesOf(others)} {...p} />}
            {levels.length > 0 && (
              <div className="pg-spells">
                <p className="pg-divider">Spells</p>
                {levels.map((l) => (
                  <div key={l.level} className="pg-level">
                    <p className="pg-level-title">{levelTitle(l.level)}</p>
                    <Tiles tiles={tilesOf(l.items)} {...p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
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
export function SectionPlays({ section, ...p }: { section: TreeSection } & OpenProps) {
  if (isParallel(section.groups)) return <ParallelCard section={section} {...p} />;
  return section.groups.map((g) => (
    <GroupCard
      key={g.slug}
      hit={{ section: section.title, group: g, items: g.items }}
      title={g.title}
      {...p}
    />
  ));
}

/**
 * The play a search should open by itself: its only hit, when there is exactly one and it
 * is a tile (a lead-less line already shows its text). Otherwise null.
 */
export function onlyHit(hits: readonly GroupHit[]): Opened | null {
  const [hit, ...rest] = hits;
  const item = hit?.items[0];
  if (!hit || rest.length > 0 || hit.items.length !== 1 || !item?.lead) return null;
  return {
    key: item.id,
    crumb: `${hit.section} › ${hit.group.title}`,
    items: [item],
    favKey: item.favKey,
  };
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
