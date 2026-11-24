# NPC stat blocks

A recurring NPC's mechanics are canon once the table has seen them. If Nella cast Spike Growth
in one fight, she still knows it in the next. A plan written later can't quietly swap it for
something else. So a recurring NPC with a custom stat block keeps that block in their historian
file, and every plan copies it from there, not from the last plan.

## Who gets one

- An NPC or antagonist with a **custom or tuned** stat block who has fought the party and is
  still in play, or whom a plan sets up to fight again.
- An NPC on an **untuned stock block** gets no section, only one line in the body naming it (`Uses
  the [[Scarecrow]] stat block.`).
- One-fight enemies (a nameless guard, a wolf) never get one.

## Shape

A `## Stat block` section in the NPC's historian file, placed before `## Voice`:

```markdown
## Stat block

### Current

- AC 15 (studded leather) · **HP 49** · Speed 40 ft · CR 3
- …the same bullets a plan's `## Combatants` block uses…
- **Kit (player-facing):** *dark studded leather under a long weathered cape, …*

### Shown at the table

- **Two longbow shots a turn** (S33, from the griffon)
- **Spike Growth** (S35, the river strip)

### Changes

- S35 plan: speed 35 → 40, swim 40 (Roving), Ranger spells. None of it shown before.
```

- **Current** is the block as last planned or played. It leaves out what belongs to one fight:
  tactics for that fight, its positions, the `Label (party-facing):` line, and HP as it stood at
  the end of that fight. The NPC's lasting tactics (*never shoots a downed PC*) stay.
- **Shown at the table** lists what the party has seen: attacks and how many a turn, damage they
  took, spells cast, traits that fired, movement shown (flying, swimming), any number the DM
  said aloud. Each item gives the session it was first shown, plus a word of where if it helps.
  When the notes don't say whether something fired, add a `> **Reliability:**` note.
- **Changes** logs every edit to Current after the section was first written, with the session
  or plan that made it.

Frontmatter `stats_confirmed:` stamps the last played session the section was checked at (the
[Stamp Pattern](../CLAUDE.md)).

## What's locked

- Anything under **Shown at the table** is locked. A plan never changes it. Changing it is a
  retcon the DM calls, logged under Changes with the reason.
- Everything else (hidden HP, saves, spells not yet cast, traits that haven't fired) is still
  open. A plan may tune it. Then `/recap` writes the tuned version back to Current.
- Growth is not a retcon. An NPC can gain something new between fights (a new spell, a new
  mount, a level) when the plan gives a reason. What they already showed stays.

## Who does what

- **`/session` Phase 6** copies a recurring NPC's block from their historian file into
  `## Combatants` and notes what it tunes. It never edits a Shown item.
- **`/review` Pass 1** checks every Combatants block for an NPC with a `## Stat block`
  against that section's **Shown at the table** list. It flags any locked item the plan changed.
- **`/recap` Phase 5** proposes what this session showed and any block changes the plan made,
  writes them on approval, and restamps `stats_confirmed` on every NPC with a section who
  appeared. It also proposes a section for a new recurring NPC.
- **`scripts/todo-brief.py`** prints `--- NPC STAT BLOCKS ---`. It flags a section whose stamp
  lags the NPC's last `key_npcs` appearance, or one with no stamp.
