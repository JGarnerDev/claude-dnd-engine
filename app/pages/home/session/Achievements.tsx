// Achievement slides for the recap deck (meta/achievements.md): one slide per PC,
// titled with the PC's name, each achievement a "New achievement!" popup.

import "./achievements.css";
import { Card } from "jeff-ui";
import { beforeLast, unlink, type DeckSlide } from "./deck.js";
import { InlineMd } from "./MarkdownView.js";
import type { PcAchievements } from "./types.js";

function AchievementCard({ title, text, times }: { title: string; text: string; times: number }) {
  const again = times > 1;
  return (
    <Card unstyled className={`ac-card${again ? " is-repeat" : ""}`}>
      <div className="ac-eyebrow">
        {again ? (
          <>
            Achievement earned again <b>×{times}</b>
          </>
        ) : (
          "New achievement!"
        )}
      </div>
      <div className="ac-title">
        <InlineMd md={unlink(title)} />
      </div>
      {text && (
        <div className="ac-text">
          <InlineMd md={unlink(text)} />
        </div>
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
        <div className="ac-wrap">
          {p.items.map((i, k) => (
            <AchievementCard key={k} title={i.title} text={i.text} times={i.times} />
          ))}
        </div>
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
