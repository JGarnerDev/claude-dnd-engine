---
type: meta
tags: [guideline]
---

# PC Arcs

A PC arc is one player character's provisional direction: where their story and growth could go
over the next few sessions. It exists so session choices keep landing on who each character is,
and so backstory comes back on purpose and in order. The single source of truth for PC arcs;
commands and scripts reference this file rather than re-teaching it. File shape:
`meta/schemas/pc-arc.md`.

## What it is

- **A direction, not a plot.** No ending is planned. Being wrong is cheap; correcting is routine.
- **Short horizon.** The next few sessions, plus one loose "someday" line.
- **The player decides.** What a player says they want beats anything the engine drafted.
- **DM-facing.** A PC arc may lean on truths the character doesn't know yet. Mark those parts
  `(DM-only)`.
- **Both seasons.** No `campaign` tag. Any DM, Strahd included, reads the same files, and
  `/recap` in either campaign can shift them.

## Always "PC arc"

Write **PC arc**, never bare "arc". The engine already uses "arc" for four other things:

- the `arc` **beat weight** (9, a pivotal payoff) in `meta/character-focus.md` and session `beats:`
- an **act**, "a story arc" (`meta/schemas/act.md`)
- the `arc` rung of the **Scale** ladder in `meta/literary-devices.md`
- an NPC **voice arc shift** (`meta/voice.md`)

They connect (a PC arc's payoff is usually tagged an `arc`-weight beat) but are not the same thing.

## Parts

- **Logline** — one to three plain sentences on what makes the character interesting: the wound,
  the drive, the cost. Human stakes, no lore words. *"Lied to his whole life by the grandmother
  who loved him..."*, not *"raised inside a Sharran rite..."*
- **Growth / Fall** — the two directions the PC arc leans: what the character becomes if things go
  well, and the worse thing they could become. Both stay open. Neither is the plan.
- **Next step** — one or two of the PC's `spotlight_hooks:`, copied word for word, that the PC arc
  wants seeded soon. This is what `/session` reaches for first.
- **Player wants** — a pointer to the PC file's `## Looking Ahead (Player Intent)` section, plus how
  the PC arc answers it. Never copied. No section yet means "not asked yet" and a todo entry.
- **Someday** — one loose line about where the character might end up. Never planned toward.
- **Shifts** — the log of changes, one line each: session, cause, what changed.

## Hooks stay on the PC file

`spotlight_hooks:` and their `status` (`open | seeded | paid`) live only on the PC file, created by
`/pc-backstory`, seeded by `/session`, paid by `/recap` (`meta/character-focus.md`). A PC arc
**orders** hooks; it never owns them or copies their status. When a Next step hook goes `paid`, the
PC arc needs a new Next step.

## Touching a PC arc

A planned beat or choice **touches** a PC arc when it seeds or pays one of its named hooks, or
puts the character in front of their growth or fall. Each plan's `Choice (<PC>):` should touch
that PC's arc when one exists (`meta/player-agency.md`). `/review` notes a present PC whose arc
nothing in the plan touches. It is a note, never a block, and spotlight balance
(`meta/character-focus.md`) still decides whether this week leans spotlight at all.

## Shifts

Play bends PC arcs: a choice that went the other way, a player saying what they want, another
DM's season. `/recap` proposes shifts after the voice step, numbered `A1.`, `A2.`, each citing
its cause, and the DM approves by number. Only a cause from play or from a player counts. Never
shift a PC arc because the engine thought of something better.

- Growth, Fall, Next step and Someday may shift.
- The Logline shifts only when the DM calls it. It is the group's agreed pitch.
- An approved shift edits the section and appends one line to `## Shifts`.

## The stamp

`arc_checked: <session>` records the session the PC arc was last reviewed at (stamp pattern, root
`CLAUDE.md`). `/recap` restamps every active PC arc, in both campaigns, even when nothing shifts.
A stamp behind the latest played session means a recap skipped it: review the PC arc with the DM
before planning on it. `scripts/spotlight-balance.py` flags it.

## Lifecycle

PC arcs live in `scheduler/arcs/` as long as the PC plays. They never move to `historian/`. A
PC arc that finished or was dropped goes `state: retired` and stays put, so its Shifts log
remains readable. A retired PC's arc retires with them. An `away` PC's arc stays `active` but pauses: the briefs list it as paused, and `/recap` restamps it without proposing shifts until the PC returns.
