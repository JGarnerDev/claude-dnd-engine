---
type: meta
tags: [guideline]
---

# Achievements

**Achievements** are short, snarky "New achievement!" popups, one slide per PC in the recap deck,
for the things each character actually *achieved* in a played session. Loosely inspired by
*Dungeon Crawler Carl*: a funny title and a brief jab, nothing more. They sit beside the stats
(`meta/stats.md`): stats count what was rolled, achievements name what was *done*.

Read once per task by `/transcript` (spotting candidates), `/recap` (drafting and confirming), and
anyone editing these rules. `scripts/lib/achievements.py` reads the ledger;
`scripts/session-cards.py` hands it to the runner's slides (`app/pages/home/session/achievements.ts`).

## Rules

- **Homebrew decks only.** Strahd sessions have no deck, so they get no achievements.
- **In-fiction deeds only.** What the character did in the story. No dice (nat 1s and crits are
  stats), no table talk, no player jokes, no rules arguments.
- **Rare by design.** Most sessions give most PCs nothing. Expect zero or one card per PC, and a
  deck with one card is a normal deck. Never invent a deed to fill a slot.
- **No reward line.** No loot boxes, no perks, no mechanical effect. Bragging rights only.
- **Not spotlight, not fame.** Achievements never feed `meta/character-focus.md` or
  `spotlight-balance.py`, and they are not in-world reputation. Fame stays the DM-approved
  `/recap` proposal it is in `meta/stats.md`.
- **DM-approved.** Drafted at `/recap`, edited and approved by the DM, then written to the ledger.
  The runner only shows what was approved.
- **Never "feat".** In this engine that word means a D&D feat.

## The bar

There are exactly two ways to earn a card:

1. **A big result from a deliberate action.** The PC chose to do something, and it caused a
   clear, visible result in the world: a spectacular success or a spectacular backfire. The
   bigger the swing from what they meant to happen, the better. Luci fighting a fire with a
   windstorm and spreading it up the wall is the model.
2. **A tally reaching a threshold.** A quiet habit, repeated across sessions until it adds up
   (see Tallies below).

Then cut any candidate that is:

- **Minor.** A small failure with flavor-only fallout (an eye-roll, an awkward moment) is not an
  achievement. It becomes one only if the failure turns major.
- **Just a good roll.** A high check that reveals lore or confirms a suspicion is the game working
  as normal. It earns a card only if what was found is majorly new, not a detail.
- **Something that happened *to* the scene.** A mystery beat, a DM reveal, or a strange event
  that nobody can explain yet is not a PC accomplishment, even if it happened around them.
- **Routine.** Looting, splitting or handing out loot, shopping, resting, healing between fights,
  a utility cantrip, an ordinary check. These happen every session.
- **A fizzle.** A failure nothing came of: a pitch nobody bought and nobody will remember.
- **Too contextual.** A player who has forgotten the scene should get the joke from the card. If
  it only lands because you remember one line of dialogue, cut it.
- **A reaction.** Cheering at news, being shocked, feeling something. The card needs a deed.

The lessons came from DM feedback on Session 30 (2026-10-21): fourteen drafts were cut to one.
Habits that don't clear the bar on their own are what tallies are for.

## Tallies

A **tally** counts a quirky habit a PC keeps repeating, such as examining suspicious fireplaces,
making fires worse, or pitching get-rich schemes to officials. It is invisible to players until it
unlocks.

- **What counts:** a distinctive, repeatable behavior of that PC, worth a laugh once it adds up.
  Not a routine action every PC does (attacking, looting, resting).
- **Name it plainly** and keep the name stable: `fireplaces examined`, not a joke.
- **Thresholds: 3, 5, 10, 20.** When a tally reaches one, it unlocks a card in that session's
  list: "Fireplace Inspector: examined 3 suspicious fireplaces, all of them in the same week." Each
  higher threshold repeats the title with a numeral (`Fireplace Inspector II` at 5), and the
  runner shows "Achievement earned again ×2".
- **`/recap` proposes increments**, citing the moment, and the DM approves them like the cards.
  Never add one the session doesn't show.

## Voice

- **"You", to the PC.** Each slide is titled with the PC's name, so the card talks straight to
  them. This is the one place a deck slide says "you"; the rest of the deck stays third person
  (`meta/recap-slides.md`).
- **Snarky, not cruel.** Dry, a little backhanded, affectionate underneath. A jab at the deed, never
  at the player.
- **Short.** Title of about two to six words. Description of one or two sentences, about 30 words
  or fewer.
- **No host persona.** No unhinged AI announcer, no catchphrases, no fourth-wall commentary about
  the System or its sponsors. Borrow the format, not the character.
- **Plain spoken words.** These are read off a screen-share, often aloud. If it trips on the
  tongue, rewrite it. Say what happened literally before any joke: "the fire spread up the
  wall", not "the fire said thank you".
- **Vary the shape.** Don't open every card with "You…". Mix in a terse report ("Fought a fire
  with a windstorm."), a verdict or score ("Paranoia 1, fireplace 0."), a quoted line, or a
  plain consequence. Across one deck, no two cards should share a sentence pattern.

```markdown
- **Firefighter (Derogatory)**: Fought a fire with a windstorm. The fire spread up the wall.
  Wind is not water.
```

## Party-safe

Same rules as the deck: only what the party saw, heard or was told, and the **names check** in
`meta/recap-slides.md` runs on every draft. A private PC moment (a vision, a solo scene) is fine on
that PC's own slide, names check still applied.

## Ledger

One file, `historian/sessions/_achievements.md`. The leading `_` keeps it out of validate, the
index and the inventory. Not an entity, no frontmatter, no `[[wikilinks]]`.

- Text before the first `##` is a DM note.
- `## Tallies` comes first: one `### <PC name>` per PC, one line per tally,
  `- <tally name>: <n> (S30, S32)`, with the sessions that added to it. `/recap` edits these in
  place.
- Then `## Session <n>` per session, newest at the bottom. `### <PC name>` per PC under it, using
  the PC's short name as the stats ledger does (`Iggy`, `Odibli`).
- One bullet per card: `- **<Title>**: <description>`. A longer description may wrap onto
  indented continuation lines. A tally card goes here too, in the session it unlocked.
- A PC with no cards that session is simply left out.

```markdown
## Tallies

### Odibli

- fireplaces examined: 1 (S30)

## Session 30

### Luci

- **Firefighter (Derogatory)**: Fought a fire with a windstorm. The fire spread up the wall.
  Wind is not water.
```

Written by `/recap` after the DM approves the list. The slides appear on the *next* session's
"Previously on…" deck, after "The party" and before the stats slides.
