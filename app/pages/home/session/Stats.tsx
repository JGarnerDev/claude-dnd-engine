// Stats slides for the recap deck (meta/stats.md): award cards for the session,
// then the season standings with a hall-of-fame strip, plus a one-time
// previous-season slide when this session opened a new season. Off a heavy deck, one
// compact "Worth noting" slide instead, or none (meta/recap-slides.md → Deck weight).

import type { ReactNode } from "react";
import {
  Badge,
  Card,
  Column,
  Grid,
  List,
  ProgressBar,
  Row,
  Stat,
  Table,
  Text,
  type TableColumn,
} from "jeff-ui";
import "./stats.css";
import { beforeLast, type DeckSlide } from "./deck.js";
import { KIND_HUE } from "./hues.js";
import type { DeckWeight, StatBoard, StatRow, Stats } from "./types.js";

const num = (x: { value: number; rough: boolean }) => `${x.rough ? "~" : ""}${x.value}`;
const names = (pcs: string[]) => pcs.join(" & ");
// "Killing blows" -> "killing blows", but "HP healed" keeps its acronym.
const lower = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

function Awards({ s }: { s: Stats }) {
  return (
    <Grid min="18rem" gap={4} className="st-cards">
      {s.awards.map((a, i) => (
        <Card
          key={i}
          hue={a.best.length ? "var(--ui-accent)" : undefined}
          className={`st-card${a.best.length ? " is-best" : ""}`}
        >
          <Row gap={4} align="start">
            <span className="st-icon">{a.icon}</span>
            <Column gap={1} className="st-card-text">
              <Text size="xs" caps strong tone="muted" className="st-award">
                {a.award}
              </Text>
              <Text size="xl" strong className="st-pc">
                {names(a.pcs)}
              </Text>
              <Stat className="st-value" value={num(a)} label={lower(a.label)} />
              {a.best.length > 0 && (
                <Text size="xs" tone="accent" className="st-best">
                  ⭐ Personal best{a.pcs.length > 1 ? `: ${names(a.best)}` : ""}
                </Text>
              )}
            </Column>
          </Row>
        </Card>
      ))}
    </Grid>
  );
}

// One board's standings: name, a bar against the leader, and the value.
function standingColumns(top: number): TableColumn<StatRow>[] {
  return [
    { key: "pc", width: "7em", className: "st-row-pc", cell: (r) => r.pc, title: (r) => r.pc },
    {
      key: "bar",
      cell: (r) => (
        <ProgressBar
          className="st-bar"
          value={top ? Math.max(0.04, r.value / top) : 0}
          hue={r.value === top ? "var(--ui-accent)" : KIND_HUE.recap}
        />
      ),
    },
    {
      key: "value",
      width: "3.5em",
      align: "end",
      cell: (r) => (
        <Text as="span" strong numeric>
          {num(r)}
        </Text>
      ),
    },
  ];
}

function Boards({ boards }: { boards: StatBoard[] }) {
  return (
    <Grid min="20rem" gap={4} className="st-boards">
      {boards.map((b, i) => (
        <Card
          key={i}
          className="st-board"
          title={
            <Text as="span" tone="muted">
              {b.icon} {b.label}
            </Text>
          }
        >
          <Table
            variant="plain"
            columns={standingColumns(b.rows[0]?.value ?? 0)}
            rows={b.rows}
            rowKey={(r) => r.pc}
            rowProps={(r) => ({
              className: r.value === b.rows[0].value ? "st-row is-top" : "st-row",
            })}
          />
        </Card>
      ))}
    </Grid>
  );
}

function Fame({ s }: { s: Stats }) {
  if (!s.lifetime.length) return null;
  return (
    <Row gap={2} align="center" wrap className="st-fame">
      <Text as="span" size="xs" caps strong tone="accent">
        Hall of fame
      </Text>
      {s.lifetime.map((h, i) => (
        <Badge key={i} className="st-chip" title={h.label}>
          {h.icon} {names(h.pcs)} <b>{num(h)}</b>
        </Badge>
      ))}
    </Row>
  );
}

const Notable = ({ s }: { s: Stats }) => (
  <List variant="plain" gap={3} className="st-notable">
    {(s.notable ?? []).map((n, i) => (
      <li key={i}>
        <span className="st-icon">{n.icon}</span>
        {n.text}
      </li>
    ))}
  </List>
);

const wrap = (title: string, body: ReactNode): DeckSlide => ({
  title,
  md: "",
  body: (
    <Column gap={5} className="st-wrap">
      {body}
    </Column>
  ),
});

// The stats slides for one session, in deck order. Gated by deck weight
// (meta/recap-slides.md → Deck weight): the full honors + standings on a heavy deck or a
// season's first session; otherwise one compact "Worth noting" slide when something is
// notable, else nothing. A missing weight is heavy, so older decks keep the full set.
export function statsSlides(
  s: Stats | null | undefined,
  weight: DeckWeight = "heavy",
): DeckSlide[] {
  if (!s) return [];
  const out: DeckSlide[] = [];
  const prev = s.previousSeason;
  if (prev?.leaderboards.length) {
    out.push(
      wrap(
        prev.campaign === "strahd" ? "While you were in Barovia…" : "Last season’s standings",
        <Boards boards={prev.leaderboards} />,
      ),
    );
  }
  if (weight !== "heavy" && !s.firstOfSeason) {
    if (s.notable?.length) out.push(wrap("Worth noting", <Notable s={s} />));
    return out;
  }
  if (s.awards.length) out.push(wrap("Last session’s honors", <Awards s={s} />));
  if (s.leaderboards.length || s.lifetime.length)
    out.push(
      wrap(
        "The standings",
        <>
          <Boards boards={s.leaderboards} />
          <Fame s={s} />
        </>,
      ),
    );
  return out;
}

export const withStats = (
  deck: DeckSlide[],
  s: Stats | null | undefined,
  weight?: DeckWeight,
): DeckSlide[] => beforeLast(deck, statsSlides(s, weight));
