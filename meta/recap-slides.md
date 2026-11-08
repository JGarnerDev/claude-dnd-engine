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

**Stats slides** come between 5 and 6 when the session has a stats ledger: award cards, then the
season standings, opened by a "While you were in Barovia…" slide after a Strahd season. They are
**generated, not written**: the runner builds them from `historian/sessions/_stats.md`, which the DM
confirmed at `/recap`. Never put them in `_slides.md`. Rules and categories: `meta/stats.md`.

**Achievement slides** come right before the stats slides: one per PC, titled with the PC's name,
built by the runner from `historian/sessions/_achievements.md`. Also generated, never written into
`_slides.md`. They are the one deck slide that says "you". Rules and voice: `meta/achievements.md`.

**The reputation slide** comes after the achievement slides and before the stats slides (homebrew
only): party fame, each PC's fame and infamy with tier names, last session's gains and top deeds,
and a banner on a tier-up. Built by the runner from `historian/sessions/_reputation.md`, never
written into `_slides.md`. Rules: `meta/reputation.md`.

**The sky slide** comes right after the Title (homebrew only): the in-world date and time the
session ended, drawn as an old ring plate with Aethryn at the centre and each body where it stood,
beside a cartouche with the year, the Crawl, the hour, tonight's dark, Fida and the Glistening
countdown. Built by the runner from the session's `in_world_end_date` / `in_world_end_time` and the
Sky Clock's log (`scripts/lib/sky.py`), never written into `_slides.md`. It never shows the next
Kerning. Rules: `data/lore/calendar.md` and `scheduler/campaign/_sky-clock.md`.

## Voice

Slides are read aloud to the table, so write them like a story told by someone who was there.

1. **Story, not mechanics.** Say what the characters saw, not what was rolled. No words that sound
   like checks, damage or rules: "read the yard" (Perception), "landed hidden" (Stealth), "hit
   hard", "took the job", "the gift", "haggling". **Exception:** the generated stats and reputation
   slides, whose numbers are the point. Achievement slides follow their own voice (`meta/achievements.md`).
2. **Only what was said.** When an NPC was vague, the slide stays vague. A reward the plan names is
   not one an NPC promised out loud: the fox said it would make it worth Halsby's while, so the
   slide says that, not "fuse his spear". The names check does this for names; do the same for
   promises, motives and rewards.
3. **"The party", not "you".** Write in the third person, like the "Previously on…" slide: "What
   the party chose", "the party went after both".
4. **Vary the verbs.** When a slide walks the PCs one by one, give each their own verb; don't
   repeat "landed" four times.
5. **Plain words, said aloud.** "The gap in the wall", not "the breach"; "agreed", not "accepted
   terms". If a line sounds stiff spoken, rewrite it.

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
