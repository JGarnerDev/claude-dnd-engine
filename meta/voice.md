# NPC Voice Protocol

How an NPC sounds, and how that changes as sessions play out. The single source of truth for
voice records; commands reference this file rather than re-teaching the rules.

## What it is

A voice record says how an NPC **talks**. It sits beside fields that say other things:

- `personality` — how they behave and come across
- `charm_hook` / `human_detail` — the one detail that makes players care
- `affinity` — how much they like one specific character, as a number
- **voice** — cadence, words, habits, and what they will never say, plus how all of that is
  bent right now by what has happened

Scope: NPCs and antagonists. PCs are voiced by their players and never get one.

## The two layers

A voice has a **core** that stays put and a **now** layer that moves with outcomes. The split
is what keeps a character recognisable while still letting them react. The now layer bends the
core and never replaces it.

- **Core** — how they speak in any mood. Changes rarely, and only by a DM call (see Rules)
- **Now** — what the campaign has done to them: grief, a grudge, gratitude, fear, a debt
  paid. Every line cites the session that caused it

## Storage

Two optional frontmatter fields, on NPC and antagonist files:

```yaml
voice: "Clipped and quiet; counts things aloud; never wastes a word on anyone she can't use."
voice_confirmed: 29
```

- `voice` is the core cadence and register in one line. It lives in frontmatter so
  frontmatter-only scans can compare voices across NPCs
- `voice_confirmed` is the last played session at which the voice was checked. An instance of
  the Stamp Pattern (root `CLAUDE.md`)

The rest goes in a `## Voice` section at the end of the body:

```markdown
## Voice

### Core

- **Signature:** a habit of speech: a phrase, a word they lean on, a way of addressing people
- **Never:** one thing they will not say or do in speech: beg, swear, use a first name, lie outright
- **Tell:** what shows when they are lying, frightened, or interested

### Now

- **Stance:** their mood toward the party as a whole (S29: why)
- **Toward Odibli:** how they talk to one PC, only where it differs from the stance (S29: why)

### Said at the table

- S29: "the exact words" (to whom, and the moment)

### Arc

- S22: what the core was → what it became, because of what happened
```

Use plain names in this section, not `[[links]]`. Affinity already draws the graph edges.

## Rules

- **Every now line has a cause.** It names the session and the event that put it there. With
  no cause there is no change, and a planner never moves an NPC's mood on its own judgment
- **At most three now lines.** When a newer outcome replaces an older one, or the cause has
  been resolved, drop the old line at the next recap
- **Breaking a Never line is an arc shift.** A proposed now line that would break a Never
  line is an arc shift by definition. Flag it to the DM; never write it as a now line
- **The core changes in two ways only:**
  - **Correction.** The table played the NPC differently from what the file says, and the
    table wins. Rewrite the core with no arc entry, because the file was wrong, not the
    character
  - **Arc shift.** The DM says the character has changed in the fiction. Move the old core
    into an `### Arc` line with its session and cause, then write the new core. Arc shifts are
    rare: a handful per character across a campaign
- **Lines are verbatim or absent.** `Said at the table` holds only words someone actually
  said, taken from a transcript's `Quotable lines` or from the DM's notes. Never write a line
  nobody said. Uncertain wording keeps its `(?)`. Hold at most five lines: keep the first one
  ever recorded and the most recent, then cut the least characteristic
- **Played voice beats planned voice.** Sample lines in session plans are guidance. Only
  what was said at the table counts as evidence
- **Strahd NPCs record, never invent.** Kellan plays them outside this engine, so their voice
  comes only from his played lines. Confirm their core with the DM of that campaign

## Who gets one

Any NPC or antagonist who has spoken on screen, created at the first `/recap` that has a line
from them, or by `/voice` when the DM saves a brief. An NPC who has never spoken has no
section. The `/session` and `/review` guidance gives them voice notes as before.

A **legacy section** (an older `## Voice` that is not in the layered shape, such as a single
line) is still read. The next `/recap` or `/voice` to touch that NPC proposes upgrading it.

## Adjustment surface

`/recap` is the structured path, in Phase 5's voice-shifts step, run after the affinity
nudges because it uses their band crossings. It proposes lines, now changes, core changes and
new voices as a numbered confirm-list, and writes only what the DM approves. It restamps
`voice_confirmed` on every NPC with a voice who appeared, even when nothing changed.

## Staleness

`scripts/todo-brief.py` prints a `--- NPC VOICES ---` block. It flags an NPC whose last
appearance in a played session's `key_npcs` is later than their `voice_confirmed`, and a voice
section with no stamp. A stale voice means rebuild the now layer with the DM from the sessions
after the stamp. Never trust the old now lines.

## Read surface

- `/voice` builds its brief from the section, and caches a new one in this shape
- `/session` NPC Quick-Reference and `/review` sample lines take the core as fixed and play
  the now layer
