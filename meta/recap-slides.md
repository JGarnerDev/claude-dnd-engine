---
type: meta
tags: [guideline]
---

# Recap Slides

A **deck** is a short, party-facing slide recap of one played session. The DM screen-shares it at
the start of the next session from the session runner: the **Slides** button on the "Previously on…"
card opens a fullscreen carousel. Players see a consistent opener every session, and nothing on
screen spoils anything.

Read once per task by `/recap` (Phase 8 writes the deck). `scripts/session-cards.py` reads it into
the runner.

## Scope

- **Homebrew sessions only.** Strahd recaps keep the plain card and the group-chat blurb.
- **DM-approved.** The deck is drafted at `/recap`, and the DM edits and approves it before it is
  saved. The carousel only displays what was approved; it never decides what is safe.
- **Written once.** Saved when the session is canonized and never rebuilt from the historian record
  on the fly. That record is DM-facing (`table_notes`, behind-the-screen remarks, secrets).
- **No deck, no button.** A session without `_slides.md` shows the card as before.

## File

`_slides.md` in the session's historian folder, beside `_established.md`. The leading `_` keeps it
out of the entity scan, so validate, the index and the inventory never see it. Not an entity, no
frontmatter.

- Each `##` heading is one slide's **headline**. The text under it is the **body**.
- Body: **about 40 words or fewer**, short lines or bullets. Built for screen-share; the DM
  narrates the rest.
- Text before the first `##` is a note to the DM and is never shown.
- No `[[wikilinks]]`: slides are for players, not a way into the entity graph.

## Slide order

Every deck follows the same order, so players know where to look:

1. **Title**: the session's name and the date played.
2. **Previously on…**: 2–4 sentences of narrative from the `recap:` field, rewritten for players.
3. **Scenes as played**: one slide per scene that ran. Use the plan's `### Scene` sections,
   corrected by `## As Played`. A skipped scene gets no slide.
4. **Choices**: what the party chose, from the `choices:` field (see `meta/player-agency.md`).
   When the field is missing, use the forks in `## As Played`. Leave the slide out if none
   mattered.
5. **The party**: one line per PC, covering a standout moment plus loot, levels or conditions
   gained. Levels and conditions come from `uv run scripts/party-status.py`; loot from `## Rewards`
   corrected by `## As Played`.
6. **Next time…**: the hook from the `cliffhanger:` field, as a teaser.

## Party-safe

Only what the party saw, heard or was told on screen, written the way they would tell it. The full
rules are `/transcript` Phase 6 "No spoilers" and "No conclusions" (`.claude/commands/transcript.md`):
follow them, don't restate them. Never draw from `table_notes`, `new_entities`, `Reliability`
flags, flow graphs, the scheduler or spitball. When unsure, leave it out and tell the DM.

**The sources are DM-facing.** The `recap:` and `cliffhanger:` fields and the plan use canon names
freely, even for people and places the party has never been introduced to. Never copy a name from
them on trust.

### Names check

Run this on every draft before showing it:

1. List every proper noun on the slides: people, places, factions, items, ales, gods.
2. **Seen is not known.** Watching someone, fighting beside them or rescuing them doesn't teach
   their name. Neither does a name the DM's sources say was spoken in passing. A name stays only
   when it is the party's own (PCs, things a PC named) or the DM confirms the party learned it. A
   `known_by` entry naming a PC (`meta/schemas/entity.md`) counts as confirmation; most entities
   don't have one yet.
3. Replace each unknown name with what the characters would call it: "a bound woman", "a
   long-haired archer", "the town across the river".
4. Show the DM the kept names next to the draft so each one can be confirmed or cut.

**Private PC moments stay.** A scene only one PC experienced (a vision, a voice, a solo encounter)
belongs in the deck: the players watched it at the table, and what their characters know is theirs
to roleplay. The names check still applies inside it.

**Session titles stay** as the plan named them, even when the title points at something the party
hasn't learned yet.
