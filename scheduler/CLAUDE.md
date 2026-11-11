# Scheduler

## Story Hierarchy

Content is organized from largest to smallest narrative unit:

| Level | File location | Moves to historian when… |
|---|---|---|
| **Campaign** | `scheduler/campaign/{name}.md` — exactly one `state: active` at a time | Campaign fully concludes |
| **Act** | `scheduler/acts/{name}.md` | Act completes |
| **Mission** | `scheduler/missions/{name}.md` | Mission resolves (success or failure) |
| **Session** | `scheduler/sessions/Session {NN} {Name}/Session {NN} {Name}.md` | Session is played |

Each level references the one above it and the ones below it via wiki-links. Sessions advance missions; missions build acts; acts serve the campaign.

## Campaign Trackers

`scheduler/campaign/_*.md` files with an `(as of: Session NN)` header are campaign trackers:
DM-only running state that a rule needs between sessions (the first is `_citadel-clock.md`, Odibli's
casting in Aethryn). Each carries an `## Engine` section saying what `/transcript` mines, what
`/recap` asks and writes, and what `/session` checks. The `_` prefix keeps them out of
`validate.ps1` and the semantic index. A new tracker needs only that header and section; the
commands find it by the glob.

## The Handover Page

`scheduler/campaign/_handover.md`, written by `/handover` at a DM rotation (`meta/dm-rotation.md`),
is **not a tracker**: it has no `(as of: Session NN)` header, so `/recap` and `/session` skip it. The
`_` keeps it out of `validate.ps1` and the search index.

## PC Arcs

`scheduler/arcs/{PC} PC Arc.md` — one provisional direction per PC (`meta/pc-arcs.md`). The
exception to "moves to historian": a PC arc is never played, so it stays here as long as the PC
plays, and a finished or dropped one goes `state: retired` in place. No `campaign` tag; both
seasons use them.

## Session Battlemaps

A session folder can hold `maps/*.txt` battle-map layouts. Before editing or rendering one, read `maps/battlemaps/CLAUDE.md`. It does not auto-load from here.
