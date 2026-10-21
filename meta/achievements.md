---
type: meta
tags: [guideline]
---

# Achievements

**Achievements** are short, snarky "New achievement!" popups, one slide per PC in the recap deck,
for the things each character did in a played session. Loosely inspired by *Dungeon Crawler
Carl*: a funny title and a brief jab, nothing more. They sit beside the stats (`meta/stats.md`):
stats count what was rolled, achievements name what was *done*.

Read once per task by `/transcript` (spotting candidates), `/recap` (drafting and confirming), and
anyone editing these rules. `scripts/lib/achievements.py` reads the ledger;
`scripts/session-cards.py` hands it to the runner's slides (`app/pages/home/session/achievements.ts`).

## Rules

- **Homebrew decks only.** Strahd sessions have no deck, so they get no achievements.
- **In-fiction deeds only.** What the character did in the story. No dice (nat 1s and crits are
  stats), no table talk, no player jokes, no rules arguments.
- **Earned, not padded.** As many as the session honestly supports, and no more. A PC with nothing
  worth a laugh or a nod gets no slide that session. Never invent a deed to fill a slot, and never
  write one that only restates "you were there".
- **Not lackluster.** Each one names a specific moment. "Fought bravely" fails; "Made a raider
  regret the word 'gnome'" passes.
- **No reward line.** No loot boxes, no perks, no mechanical effect. Bragging rights only.
- **Not spotlight, not fame.** Achievements never feed `meta/character-focus.md` or
  `spotlight-balance.py`, and they are not in-world reputation. Fame stays the DM-approved
  `/recap` proposal it is in `meta/stats.md`.
- **DM-approved.** Drafted at `/recap`, edited and approved by the DM, then written to the ledger.
  The runner only shows what was approved.
- **Never "feat".** In this engine that word means a D&D feat.

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
  tongue, rewrite it.

```markdown
- **Gravity's Favorite**: You fell out of a holy light into a raid and landed flat on your back.
  Most heroes land on their feet. Most heroes are not you.
```

## Running jokes

Before drafting, read each PC's history in the ledger. When a theme recurs (the same PC keeps
falling, keeps talking to animals, keeps setting things on fire), lean into it:

- **Repeat a title** when the PC does the same kind of thing again: add a roman numeral
  (`Gravity's Favorite II`). The runner counts repeats by title (numeral ignored) and shows
  "Achievement earned again ×2" on the card.
- **Call back** in a new title or description ("Still not on your feet").
- A running joke needs at least one earlier entry; never claim a pattern the ledger doesn't show.

## Party-safe

Same rules as the deck: only what the party saw, heard or was told, and the **names check** in
`meta/recap-slides.md` runs on every draft. A private PC moment (a vision, a solo scene) is fine on
that PC's own slide, names check still applied.

## Ledger

One file, `historian/sessions/_achievements.md`. The leading `_` keeps it out of validate, the
index and the inventory. Not an entity, no frontmatter, no `[[wikilinks]]`.

- Text before the first `##` is a DM note.
- `## Session <n>` per session, newest at the bottom. `### <PC name>` per PC under it, using the
  PC's short name as the stats ledger does (`Iggy`, `Odibli`).
- One bullet per achievement: `- **<Title>**: <description>`. A longer description may wrap onto
  indented continuation lines.
- A PC with no achievements that session is simply left out.

```markdown
## Session 30

### Iggy

- **Gravity's Favorite**: You fell out of a holy light into a raid and landed flat on your back.
- **Room Service**: You played one song and the whole tavern forgot it had just been robbed.
```

Written by `/recap` after the DM approves the list. The slides appear on the *next* session's
"Previously on…" deck, after "The party" and before the stats slides.
