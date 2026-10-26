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

## Session Battlemaps

A session folder can hold `maps/*.txt` battle-map layouts. Before editing or rendering one, read `maps/battlemaps/CLAUDE.md`. It does not auto-load from here.
