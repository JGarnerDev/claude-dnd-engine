// Achievement slides for the recap deck (meta/achievements.md): one slide per PC,
// titled with the PC's name, each achievement a "New achievement!" popup.

import "./achievements.css";
import { Card, Column, Heading, Text } from "jeff-ui";
import { beforeLast, unlink, type DeckSlide } from "./deck.js";
import { KIND_HUE } from "./hues.js";
import { InlineMd } from "./MarkdownView.js";
import type { PcAchievements } from "./types.js";

function AchievementCard({ title, text, times }: { title: string; text: string; times: number }) {
  const again = times > 1;
  return (
    <Card
      variant="glow"
      hue={again ? KIND_HUE.recap : undefined}
      className={`ac-card${again ? " is-repeat" : ""}`}
    >
      <Heading
        level={3}
        variant="eyebrow"
        hue={again ? KIND_HUE.recap : "var(--ui-accent)"}
        className="ac-eyebrow"
      >
        {again ? (
          <>
            Achievement earned again <b>×{times}</b>
          </>
        ) : (
          "New achievement!"
        )}
      </Heading>
      <Heading level={4} size="lg" className="ac-title">
        <InlineMd md={unlink(title)} />
      </Heading>
      {text && (
        <Text tone="muted" className="ac-text">
          <InlineMd md={unlink(text)} />
        </Text>
      )}
    </Card>
  );
}

// One slide per PC with at least one achievement, in ledger order.
export function achievementSlides(a: PcAchievements[] | null | undefined): DeckSlide[] {
  return (a ?? [])
    .filter((p) => p.items.length)
    .map((p) => ({
      title: p.pc,
      md: "",
      body: (
        <Column gap={4} className="ac-wrap">
          {p.items.map((i, k) => (
            <AchievementCard key={k} title={i.title} text={i.text} times={i.times} />
          ))}
        </Column>
      ),
    }));
}

// The deck with achievement slides slotted in before its last slide
// ("Next time…"). Run before withReputation and withStats, so those land after them.
// No deck, no slides.
export const withAchievements = (
  deck: DeckSlide[],
  a: PcAchievements[] | null | undefined,
): DeckSlide[] => beforeLast(deck, achievementSlides(a));
