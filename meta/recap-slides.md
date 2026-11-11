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

## Deck weight

A deck is as big as the story change behind it. A travel night gets a short deck; a mission
finished gets the full run. Every deck, at every weight, is about one thing first: **where the
party stands in the story right now**.

- **Deck weight**: `light`, `medium` or `heavy`, one per deck, written to the session record as
  `deck_weight:`. Always "deck weight", never bare "weight", which means spotlight beat weight
  (`meta/character-focus.md`). A session without the field is treated as `heavy`.
- **Story change**: what the session did to canon beyond itself. Travel and talk that moved no
  thread are not story change.
  - **Heavy** if any: a mission resolved (success or failure), an act advanced or completed, a PC
    death, or a reveal the DM calls critical.
  - **Medium** if no heavy signal but any: a choice that changed where the story goes (`choices:`:
    a new destination or goal, an ally or enemy made or lost), a level-up, a lasting condition
    gained or lost, a Phase 5.5 event that changed canon (not only memorable), or a beat tagged at
    `arc` weight.
  - **Light**: none of the above. Choices about *how* the party does something (a shortcut, a
    charge instead of a parley, who gets the oats) stay light.
- **Proposed, then confirmed.** `/recap` proposes one weight with the signals that set it ("medium:
  Odibli level 5; turned back for Ashford"). The DM confirms or overrides; the override wins.
  The session's planned `importance:` is a prior, not an outcome: use it only to break a tie.
- **Story position**: where the party stands in the active act. Structure (the act, the mission,
  how far through it, e.g. "the cart is caught; the woman leading it got away") plus one so-far
  line. Act and mission names may show, through the names check like any proper noun.
- **Orientation**: four points every deck opens with: **last time**, **story position**,
  **whereabouts** (where the party physically is) and **heading** (what the *party* means to do
  next, never what the plan has waiting).
- **No repeats.** Each fact appears on one slide. If orientation said it, no later slide says it
  again.
- **Changed slides only.** A slide shows only if its content changed in a relevant way since the
  last deck. Two **always-on** slides break the rule: the sky slide situates the players, and the
  Mysteries slide keeps them curious.
- **Mysteries slide**: eight open questions the party would be asking about the world, the NPCs
  and the mission, ranked by how much they matter to the party now. Party-voice questions built
  only from what the party saw, heard or was told: never a question that hints at the answer, names
  someone they haven't learned, or points at something they haven't noticed. Not the DM's
  `meta/mysteries.md` (load-bearing unknowns the DM guards); a guarded mystery appears only as the
  question the party already has. Carry the last deck's list forward: drop only what was answered,
  add what this session raised, re-rank. The list may run past eight: the runner shows the top
  eight and the rest wait in reserve, so a question is never lost just because it fell in rank.
  In a new world, keep questions about the world itself (where are we, how is it different, why
  does the sky look wrong) until the party has real answers. The DM's answer key is the tracker
  `scheduler/campaign/_mysteries.md`, which the runner shows in its sidebar; `/recap` keeps it in
  step with the slide (its `## Engine` section). One short line each; the 40-word body limit doesn't apply.

**Hand-written slide budget** (soft caps, counting the Title):

- **Light**: 5–6. Title, Last time…, Where you stand, Mysteries, Next. No scene slides. The Party slide
  only if someone gained something.
- **Medium**: 6–8. Orientation and Mysteries, then the 1–3 scenes that moved something, Choices only if one
  mattered.
- **Heavy**: 8–11. Orientation, Mysteries, the scenes that moved something, Choices, and **What changed**:
  the mission or act payoff, said the way the party would tell it.

**Generated-slide gates** (the runner decides from the ledgers):

- **Sky**: always.
- **Achievements**: only the session's own cards, as before.
- **Reputation**: only PCs who gained fame or infamy or tiered up this session; none, no slide.
- **Stats**: on a heavy deck or the first session of a season, the full honors and standings. On
  any other deck, one compact **Worth noting** slide when something notable happened (a personal
  best, or a new season leader in a category); otherwise no stats slides.

## Slide order

Every deck follows the same order, so players know where to look. Orientation always leads:

1. **Title**: the session's name and the date played.
2. **Last time…**: 1–4 sentences of narrative from the `recap:` field, rewritten for players.
   Light decks keep it to one or two.
3. **Where you stand**: story position and whereabouts on one slide.
4. **Mysteries**: every deck. Eight open questions, as bullets, most important first (see Deck
   weight → Mysteries slide). Write plain `-` bullets; the runner draws them as a numbered grid
   of cards (`app/pages/home/session/mysteries.ts`).
5. **Scenes that moved something** (medium and heavy only): one slide per scene that changed
   something. Use the plan's `### Scene` sections, corrected by `## As Played`. A skipped scene, or
   one that only repeats orientation, gets no slide.
6. **Choices**: what the party chose, from the `choices:` field (see `meta/player-agency.md`).
   When the field is missing, use the forks in `## As Played`. Leave the slide out if none
   mattered.
7. **What changed** (heavy only): the payoff of a resolved mission or advanced act.
8. **The party**: one line per PC who gained loot, a level or a condition, and nobody else. Levels
   and conditions come from `uv run scripts/party-status.py`; loot from `## Rewards` corrected by
   `## As Played`. Leave the slide out if nobody gained.
9. **Next**: where the party means to go and what they mean to do this session, from what they
   said at the table (`## As Played`, the DM's notes). It may close on the `cliffhanger:` as a
   teaser, but only what the party saw. Always the last slide.

Decks written before deck weight end on **Next time…** instead of Next; the runner treats the
last slide the same either way.

**Stats slides** come right before Next when the stats gate opens: award cards, then the
season standings, opened by a "While you were in Barovia…" slide after a Strahd season; or the
single Worth noting slide. They are **generated, not written**: the runner builds them from
`historian/sessions/_stats.md`, which the DM confirmed at `/recap`. Never put them in `_slides.md`.
Rules and categories: `meta/stats.md`.

**Achievement slides** come right before the stats slides: one per PC, titled with the PC's name,
built by the runner from `historian/sessions/_achievements.md`. Also generated, never written into
`_slides.md`. They are the one deck slide that says "you". Rules and voice: `meta/achievements.md`.

**The reputation slide** comes after the achievement slides and before the stats slides (homebrew
only), when someone gained: party fame, and for each PC who gained, fame and infamy with tier
names, last session's gains and top deeds, and a banner on a tier-up. Built by the runner from
`historian/sessions/_reputation.md`, never written into `_slides.md`. Rules: `meta/reputation.md`.

**The sky slide** comes right after the Title (homebrew only): the in-world date and time the
session ended, drawn as an old ring plate with Aethryn at the centre and each body where it stood,
beside a cartouche with the year, the Crawl, the hour, tonight's dark, Fida and the Glistening
countdown. Above the cartouche, a short line says how much in-world time passed since the previous
dated homebrew session ended ("2 days, 14 hours since last session"); it drops out when there is no
earlier session. Built by the runner from the session's `in_world_end_date` / `in_world_end_time` and the
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
5. **Say what happened.** No cute shorthand (`meta/prose-style.md`): "saved the hearth with a
   paper airplane" means nothing to a player who forgot the scene. Name who did what and what came
   of it; the funny detail can ride along.
6. **Plain words, said aloud.** "The gap in the wall", not "the breach"; "agreed", not "accepted
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

1. List every proper noun on the slides: people, places, factions, items, ales, gods, and act or
   mission names. An act or mission name stays unless the name itself spoils something; then use
   the party's own words for the goal ("chasing the stolen casks").
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
