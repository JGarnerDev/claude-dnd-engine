// Reputation slide for the recap deck (meta/reputation.md): party fame up top, then each PC's
// fame and infamy with tier names, the gain last session, what the PC is known for, its top
// deeds, and a banner on a tier-up. Only PCs who gained; nobody gained, no slide. Never the rewards.

import { Badge, Box, Card, Column, Grid, Heading, hueStyle, List, Row, Text } from "jeff-ui";
import "./reputation.css";
import { beforeLast, unlink, type DeckSlide } from "./deck.js";
import { KIND_HUE } from "./hues.js";
import { InlineMd } from "./MarkdownView.js";
import type { PcReputation, RepTrack, Reputation } from "./types.js";

const num = (n: number) => n.toLocaleString("en-US");

// Fame is the accent; infamy is the combat hue (Decision J).
const TRACK_HUE = { fame: "var(--ui-accent)", infamy: KIND_HUE.combat } as const;
type TrackKind = keyof typeof TRACK_HUE;

// One track: the score row, with the known-for line under it.
function Track({ kind, t, known = "" }: { kind: TrackKind; t: RepTrack; known?: string }) {
  if (!t.score) return null;
  const hue = TRACK_HUE[kind];
  return (
    <div className={`rp-track is-${kind}${t.up ? " is-up" : ""}`}>
      <Row gap={2} align="baseline" wrap>
        <Text as="span" size="xs" caps strong hue={hue}>
          {kind === "fame" ? "Fame" : "Infamy"}
        </Text>
        <Text as="span" size="xl" strong numeric hue={hue} className="rp-score">
          {num(t.score)}
        </Text>
        <Text as="span" strong>
          {t.tier}
        </Text>
        {t.gain ? (
          <Badge hue={KIND_HUE.stake} className="rp-gain">
            +{num(t.gain)}
          </Badge>
        ) : null}
      </Row>
      {known && (
        <Box hue={hue} edge="start" className="rp-known">
          <InlineMd md={unlink(known)} />
        </Box>
      )}
    </div>
  );
}

function Pc({ p }: { p: PcReputation }) {
  const ups = (["fame", "infamy"] as const).filter((k) => p[k].up);
  // Name in the left column; tracks, then deeds, stacked on the right.
  return (
    <Card className="rp-pc">
      {ups.length > 0 && (
        <Row gap={2} wrap className="rp-banners">
          {ups.map((k) => (
            <span key={k} className={`rp-banner is-${k}`} style={hueStyle(TRACK_HUE[k])}>
              {p.pc} is now <b>{p[k].tier}</b>
            </span>
          ))}
        </Row>
      )}
      <Heading level={3} size="lg" className="rp-name">
        {p.pc}
      </Heading>
      <Column gap={2} className="rp-body">
        <Track kind="fame" t={p.fame} known={p.known?.fame} />
        <Track kind="infamy" t={p.infamy} known={p.known?.infamy} />
        {p.deeds.length > 0 && (
          <List variant="plain" gap={1} className="rp-deeds">
            {p.deeds.map((d, i) => {
              const kind: TrackKind = d.track === "infamy" ? "infamy" : "fame";
              return (
                <li key={i} className={`rp-deed is-${kind}`}>
                  <Text as="span" strong numeric hue={TRACK_HUE[kind]} className="rp-pts">
                    +{num(d.points)}
                  </Text>
                  <span className="rp-text">
                    <InlineMd md={unlink(d.text)} />
                  </span>
                </li>
              );
            })}
          </List>
        )}
      </Column>
    </Card>
  );
}

const moved = (t: RepTrack) => t.gain > 0 || t.up;

// The reputation slide, or none when nobody gained (meta/recap-slides.md → Deck weight:
// changed slides only). PCs who gained nothing on either track are left out.
export function reputationSlides(r: Reputation | null | undefined): DeckSlide[] {
  const pcs = (r?.pcs ?? []).filter((p) => moved(p.fame) || moved(p.infamy));
  if (!r || !pcs.length) return [];
  return [
    {
      title: "Reputation",
      md: "",
      body: (
        <Column gap={4} className="rp-wrap">
          <Text size="lg" caps strong tone="muted" className="rp-party">
            Party fame{" "}
            <Text as="span" numeric hue={TRACK_HUE.fame}>
              <b>{num(r.partyFame)}</b>
            </Text>
            {r.partyTier && (
              <>
                {" "}
                <span className="rp-party-tier">{r.partyTier}</span>
              </>
            )}
          </Text>
          <Grid min="28rem" gap={4} className="rp-grid">
            {pcs.map((p, i) => (
              <Pc key={i} p={p} />
            ))}
          </Grid>
        </Column>
      ),
    },
  ];
}

// The deck with the reputation slide slotted in before its last slide ("Next time…").
// Run after withAchievements and before withStats, so it lands between them.
export const withReputation = (deck: DeckSlide[], r: Reputation | null | undefined): DeckSlide[] =>
  beforeLast(deck, reputationSlides(r));
