---
type: meta
tags: [guideline]
---

# Player Agency

How the engine gives the party real control over the story, so a session never plays like a
conveyor belt. This file puts the **Player Agency Principle** in
`meta/campaign-design-preferences.md` into practice: party choices carry above-average weight,
they are consequential but not all-powerful, and the world reacts to them without always giving
way.

Read once per task by `/session` (planning), `/review` (the Choices pass) and `/recap` (the
choices ledger).

**Light touch.** This is not a quota to fill every scene with. A couple of real choices a
session, made visible and then remembered, does more than a fork in every room.

## What counts as a real choice

A choice is real when all four hold:

1. **The players know they're choosing.** The options are visible in the fiction, or one good
   question away. A hidden branch the DM tracks silently is not their choice.
2. **More than one option works.** No option is the "right answer" the plan secretly needs.
   Saying no, waiting, or going around is allowed.
3. **The options cost or change different things,** such as time, a horse, a favour, a
   relationship, a reward, or what someone thinks of them. Two doors into the same room with
   nothing different behind them is a fake choice.
4. **The consequence shows up,** this session or later, and `/recap` records it.

Convergent outs are fine (`meta/flow-graphs.md`): talk, sneak and fight can all reach the
casks. The choice is still real if each path costs and gains something different.

## Two kinds

- **Party choices** are made by the group: the route, the approach, who to trust, which deal
  to take, whether to go at all, what to do with a prisoner or a prize.
- **Character choices** belong to one PC and are made by that player, not the table: a
  personal offer, a secret only they hold, a loyalty tested, a thing they could keep or give
  up. These pair naturally with spotlight beats (`meta/character-focus.md`), so the
  spotlight is something the PC *does* rather than something that happens to them. Ask that
  player directly, in the fiction ("Odibli, she's holding the page out to you. What do you
  do?").

## How often

- **Each session:** aim for **two or three party choices** and **one character choice**.
  Spread them out: no more than about three scenes in a row where the party only reacts.
- **Each act:** at least **one choice that changes where the story goes**: which mission
  comes next, whose side the party takes, what gets lost. Most choices change *how* and *at
  what cost*; this one changes *what happens next*.
- Below these numbers is a flag for `/review`, not a failure. A roleplay-heavy night can carry
  fewer forks if the conversations themselves are open.

## Committed beats stay

DM-committed beats (`[x]` in a flow graph) are not reopened for the sake of agency. Add the
choice around the beat instead:

- **How, not whether.** The Spear is delivered at the ford, but Halsby decides what to ask
  the fox.
- **At what cost.** The party always finds the camp, but they choose whether a horse or the
  daylight pays for the shortcut.
- **A visible way to beat a set outcome.** If an NPC is planned to escape, show the escape
  route early, so stopping it is something the party can plan for. If they do stop it, the
  table wins and the arc gets re-planned. Never cheat to keep a planned outcome.

## Railroad warning signs

`/review` looks for these and proposes a fix for each one:

- **A run of reaction scenes:** three or more scenes in a row where things happen to the
  party and their only input is rolling or watching. Fix: add one small choice with a cost
  inside the run (a volunteer for an errand, a question only one PC can answer, an offer).
- **A chain of skill checks with nothing to decide:** a chase or journey where only the roll
  matters. Fix: give one or two stages a route choice: an easier DC that costs something,
  or a harder one that's safe.
- **A guaranteed outcome with no counterplay:** an escape, an arrival or an ambush that
  happens whatever they do. Fix: plant a visible way to change it.
- **Failure that costs nothing:** "fail forward" with no price makes the choice before it
  meaningless. Fix: a lost check still moves the story but takes something.
- **A stack of gifts:** reward and spotlight beats delivered back to back with no decisions
  between them. Fix: put one choice between them, or let one gift come with a condition.
- **Steering text in the plan:** "expect the yes", "make sure they go", "lead them to". Keep
  the expectation as a DM note, and add what happens if they refuse.

## Mark choices in the plan

So that choices can be counted at a glance and found with a grep:

- In the plan body, start the bullet with **`Choice (party):`** or **`Choice (<PC name>):`**,
  list the options in plain words, and give each option's cost or consequence in a line.
- In `_flow.md`, a real fork is a decision diamond (`meta/flow-graphs.md` → Drawing rules).
- In `## Engine notes`, a **Choices** bullet lists each choice point by node id, so the DM
  sees the count before the table.

## Remember what they chose

A choice only feels real if the world remembers it.

- `/recap` records the choices that mattered in the historian session's `choices:` field
  (`meta/schemas/session.md`), with what each one set in motion.
- `/session` reads the last few sessions' `choices:` and pays at least one off visibly: an
  NPC who remembers, a cost that comes due, a door that opened because of it. Say where it
  comes from in the plan, so the DM can point at it at the table.
