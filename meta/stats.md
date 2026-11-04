---
type: meta
tags: [guideline]
---

# Stats

Table-side **stats**: countable things each PC did in a played session (killing blows, nat 1s,
HP healed), kept as a celebration and a friendly rivalry. They're shown to players in the recap
deck between "The party" and "Next time…" (`meta/recap-slides.md`).

Read once per task by `/transcript` (mining), `/recap` (confirming), and anyone editing the
catalog. `scripts/lib/stats.py` reads the catalog and the ledger. `scripts/stats-standings.py`
prints the standings; `scripts/session-cards.py` hands them to the runner's slides.

## Rules

- **Not spotlight.** Stats are mechanical and table-side. They never feed `meta/character-focus.md`
  or `spotlight-balance.py`, and spotlight never feeds them.
- **No mechanical effect.** No perks, inspiration or rerolls. Bragging rights only.
- **Fame is DM-approved.** A standout moment can become in-world word ("the one who felled the
  drake"), but only as a `/recap` proposal the DM approves. It's then canonized like any event. When the deed already has an event, fame goes in as a `Fame:` consequence on that event (plus `known_by` for who heard), not a duplicate.
  In homebrew it is also a scored **deed** with fame or infamy points: `meta/reputation.md`.
  Not "renown" (`meta/warfare.md`) or "standing" (`meta/rewards.md`).
- **Both seasons count.** Strahd sessions get a ledger too, but no deck. A Strahd season's final
  standings show once in the next homebrew deck, as "While you were in Barovia…".
- **Never "feat".** In this engine that word means a D&D feat.

## Terms

- **Stat:** one category's value for one PC in one session.
- **Count / sum:** a stat is either a **count** of moments (reliable) or a **sum** of numbers
  (damage, HP). A sum mined from a transcript is **rough**: write it `~n`. Many rolls are never
  said aloud, so rough sums undercount. The DM corrects them at `/recap`, and a corrected sum
  drops the `~`. A total that includes any rough value is rough.
- **Lane:** a category that only some builds can realistically win (healing, performing,
  unarmed, spells). It's there so every build has somewhere to shine.
- **Award:** the top PC in one category for one session. **Winners only**: a category nobody
  scored in gets no card, and a PC can win nothing. **Ties share** the card.
- **Personal best (⭐):** a stat higher than every earlier value that PC has in that category.
  Only counts once the PC has at least one earlier ledgered session, so the first ledger doesn't
  star everything.
- **Season:** one unbroken run of one `campaign:` tag in session-number order.
- **Season total / leaderboard:** sum per PC per category across the season so far. The
  leaderboard shows the top three. It resets at each world swap and freezes when the season ends.
- **Lifetime total / hall of fame:** sum across every ledgered session, both worlds, never reset.
  The hall of fame shows the lifetime leader per category.

## Catalog

Counting notes: **performances** includes each Bardic Inspiration given. **Spells cast** includes cantrips.

One line per category: `id | award | label | icon | family | kind`. `family` is `combat`, `dice`,
`roleplay` or `lane`; `kind` is `count` or `sum`. Add a category by adding a line. Changing an
`id` orphans its old ledger lines, so add new ones instead of renaming.

```text
killing-blows  | Killing Blow       | Killing blows      | ⚔️ | combat   | count
crits          | Crit Machine       | Critical hits      | 💥 | combat   | count
damage-dealt   | Heavy Hitter       | Damage dealt       | 🗡️ | combat   | sum
knocked-down   | Back From the Brink | Dropped to 0 HP    | 💀 | combat   | count
nat-20s        | Lucky Dice         | Natural 20s        | 🎲 | dice     | count
nat-1s         | Cursed Dice        | Natural 1s         | 🤦 | dice     | count
heals-cast     | Field Medic        | Heals cast         | ✨ | lane     | count
hp-healed      | Most Healing       | HP healed          | ❤️ | lane     | sum
performances   | Showstopper        | Performances       | 🎵 | lane     | count
unarmed-hits   | Iron Fists         | Unarmed hits       | 👊 | lane     | count
unarmed-damage | Fists of Fury      | Unarmed damage     | 🥊 | lane     | sum
spells-cast    | Spell Slinger      | Spells cast        | 🔥 | lane     | count
deals-struck   | Silver Tongue      | Deals struck       | 🤝 | roleplay | count
npcs-won-over  | Charmer            | NPCs won over      | 💬 | roleplay | count
```

## Ledger

One file for every session, both campaigns: `historian/sessions/_stats.md`. The leading `_` keeps
it out of validate, the index and the inventory. Strahd sessions are flat files with no folder,
so one shared ledger fits both. Not an entity, no frontmatter, no `[[wikilinks]]`.

- Text before the first `##` is a DM note.
- `## Session <n>` per session, newest at the bottom. `### <PC name>` per PC under it.
- One line per non-zero stat: `- <id>: <n>`, or `- <id>: ~<n>` for a rough sum. Leave zeros out.
- An unknown `id` is ignored by the script and reported as a warning.

```markdown
## Session 30

### Dip

- killing-blows: 3
- damage-dealt: ~84

### Iggy

- heals-cast: 4
- hp-healed: 38
- performances: 2
```

Written by `/recap` after the DM confirms the list. A session with no confirmed stats gets no
section. That's not a zero, so it doesn't break personal-best history.
