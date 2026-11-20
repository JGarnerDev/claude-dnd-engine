---
tags:
  - schema
---

# Session Schema

A session is a single play session — typically three to four hours. The session file starts as a plan in `scheduler/sessions/` and moves to `historian/sessions/` after play, updated with what actually happened.

---

## DM Form

**\* Session number:** What number is this session?

**\* Mission:** Which mission does this session primarily advance?

**\* Planned date:** When is this session scheduled?

**\* Opening scene:** How does the session begin — where are the players, what's immediately in front of them?

**\* Closing hook:** How should the session end — what cliffhanger or question sends players home wanting more?

**Key locations:** Where does the session take place?

**Key NPCs:** Who do the players interact with this session?

**Encounters (optional):** Any planned combat, social, or exploration encounters.

**Loose threads to address (optional):** Any unresolved questions or promises from previous sessions.

---

## Schema

The machine-readable version is [`session.schema.yaml`](session.schema.yaml).

### Canonical Paths

Filenames use the exact display name, matching `name:` per `entity.md` (e.g. `Session 13 Dream Pastries.md`).

**Every session gets its own folder**, inline or linked:

`scheduler/sessions/Session {NN} {Name}/Session {NN} {Name}.md` — the plan
`scheduler/sessions/Session {NN} {Name}/_flow.md` — the session's mermaid flow chart
`scheduler/sessions/Session {NN} {Name}/Encounter {Name}.md` — one per encounter, `scope: linked` only

The entire folder moves to `historian/sessions/Session {NN} {Name}/` after play. The main file
always uses the same `Session {NN} {Name}` naming convention, matching its folder, so
`[[Session {NN} {Name}]]` resolves whether the file sits in a folder or not.

**`_flow.md` is not an entity.** It is a derived view of the plan — the session's beats, forks and
fail paths as a mermaid graph, written in plain sentences for reading at the table. The `_` prefix
is what keeps it out of `validate.py`'s entity checks and the semantic index; it carries no
frontmatter. Conventions for the graph itself live in `meta/flow-graphs.md`, and it is a graduated
snapshot of the act's flow graph set — regenerate with `/flow --session {NN}` rather than
hand-editing both copies.

Scripts that read sessions must **recurse** (`entity_md_files` in `scripts/lib/common.py`), since
one level of globbing no longer finds anything.

### Valid State Values

<!-- generated: states from session.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `draft` | Being planned, not finalized |
| `planned` | Finalized and ready to run |
| `completed` | Played — file should be moved to historian |
| `skipped` | Scheduled but not played |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from session.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: session
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: draft | planned | completed | skipped
tags:
  - session/
  - act/
  - mission/

# --- MANDATORY (session) ---
session_number:
mission: "[[Mission Name]]"  # Mission link, an act placeholder link, or `none` for a transition
                             # session.

# --- OPTIONAL (entity base) ---
relates_to:
  - "[[Entity Name]] (relationship)"
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
description: ""

# --- OPTIONAL (session) ---
act: "[[Act Name]]"
party: "[[Party Name]]"
planned_date: ""        # Real-world date the session is planned for, or "TBD".
difficulty_attrition: standard  # Attrition tier (meta/difficulty.md); missing means the file's
                                # default.
difficulty_lethality: standard  # Lethality tier (meta/difficulty.md); missing means the file's
                                # default.
depth: narrated         # Narrated | notes.
scope: inline           # Inline | linked.
locations:              # Links to historian/locations/ or data/locations/ entities only — not
                        # factions.
  - "[[Location Name]]"
key_npcs:               # Annotated links, or a plain note for an NPC with no file.
  - "[[NPC Name]] (role)"
encounters: []
loose_threads: []
opening_scene: ""
closing_hook: ""

# --- HISTORIAN ONLY (mandatory when moved) ---
# played_date: ""         # Real-world date the session was played.
# in_world_end_date: ""   # In-world date the session ended, YYYY[-MM[-DD]] (meta/events.md).
# in_world_end_time: ""   # HH:MM the session ended in-world (homebrew; drives the recap sky slide).
# table_notes: ""         # DM-facing remarks; never shown to players.
# recap: ""               # What actually happened — may differ from the plan.
# entities_canonized:     # Data/ entities that became real this session.
#   - "[[Entity Name]]"
# new_entities:           # Annotated links, or a plain note for something kept as narration only.
#   - "[[Entity Name]]"
# cliffhanger: ""         # What the party is left with going into next session.
# beats:                  # Spotlight ledger, one line per beat (session.md, Spotlight Beats).
#   - "spotlight(PC Name): beat"
#   - "shared(PC One,PC Two): arc"
#   - "party-centric: touch"
#   - "world: touch"
# pcs_present:            # PCs at the table this session — drives present-only rotation.
#   - "PC Name"
# choices:                # Decisions the world should remember (meta/player-agency.md)
#   - "party: what they chose → what it set in motion"
#   - "PC Name: what they chose → what it set in motion"
# deck_weight: light      # Light | medium | heavy — recap deck size (meta/recap-slides.md → Deck
#                         # weight); homebrew, written by /recap Phase 8; missing = heavy.
---
```
<!-- end generated -->

### Spotlight Beats

`beats:` is the data source for the character-focus ledger (`meta/character-focus.md`).
Written at `/recap` from the per-scene tagging pass; absent on the pre-play plan. Every beat
of the session is tagged — touches included — so the balance ratio isn't biased.

Each beat is **one quoted list entry** in the compact form `classification: weight` (a flat
string, not a nested YAML map — the script parsers in `scripts/lib/common.py` read lists,
not maps):

```text
"<classification>: <weight>"
```

- **classification** — one of:
  - `spotlight(<PC>)` — solo individual focus on one PC.
  - `shared(<PC>,<PC>)` — a two-hander advancing two PCs' arcs at once (max two).
  - `party-centric` — the party as a group is the focus (agnostic).
  - `world` — plot indifferent to the party (agnostic).
- **weight** — `touch` (1) | `beat` (3) | `arc` (9). Narrative magnitude; applies to agnostic
  beats too.
- **`<PC>`** names must match the PC's `name:` field exactly (no wikilink brackets — these are
  ledger tokens, not graph edges) so rotation can attribute turns to the right character.

Example:

```yaml
beats:
  - "spotlight(Mara Vell): arc"
  - "shared(Mara Vell,Kuro): beat"
  - "party-centric: touch"
  - "world: touch"
```

A beat naming 3+ PCs violates the shared cap — `/recap` flags it rather than writing it.

`pcs_present:` lists the PCs who were at the table this session (names matching their `name:`
field). Written alongside `beats:` at `/recap` from the Phase 2.5 attendance check. Rotation
counts a PC only in sessions where they appear here, so an absent PC is never scored as
"starved." When the field is missing on an older record, the ledger falls back to treating
all active PCs as present and says so.

### Body Structure (pre-play)

The body is the DM-facing runnable document. Each section below is a real `##` heading;
scene blocks nest under `## Scenes` as `###`. Sections in order:

**Orientation** — party state paragraph (location, afflictions, resources, tone coming out of last session); bullet list of unresolved `new_entities` from the last session.

**Scenes** — one `### Scene N — [Title]` block per scene, each beat a `#### S<n>_NN_SLUG — <one line>` node heading under it, in position order (`meta/flow-graphs.md` → Positions). Count scales to length (Short: 3–4, Standard: 4–6, Long: 6–8). Each block:

- **Scene header** — first, before any node: `- **Summary:**` · `- **Where:**` · `- **Cast:**` (` · `-separated) · `- **Enemies:**` (combat labels with real names, or `none`; `arrives round N` after one who joins mid-fight) · `- **DCs:**` (`<check> <DC> — <what for>`, ` · `-separated, or `none`) · `- **Tactics:**` (combat only) · `- **Time:**` · `- **Trigger:**`. The session runner reads these for the top of the scene page; full rules in `/session` Phase 6
- **Beats** — ordered bullets; branch points inline (*"if party refuses → …"*)
- **Narration** — `> *"..."*` blockquote for key moment (depth: narrated only; omit for depth: notes)
- **Transition** — what moves to next scene or likely detour
- If scope is linked: `→ see [[encounter-{slug}]]` replaces inline encounter detail

**NPC Quick-Reference** — one entry per key NPC: `[[wiki-link]]`, motivation, what they know (bullets), voice (one sentence).

**Contingencies** — 2–3 likely detours: trigger, how to handle, how to redirect.

**Closing** — how to land the closing hook; what to leave unresolved.

### Notes

- The plan and the recap live in the same file — the body holds the planned content, and `recap` captures what actually happened after play.
- `entities_canonized` tracks which `data/` entities were used and should now have matching `historian/` files created with `exists: true`.
- `new_entities` tracks anything invented at the table that needs to be backfilled into `historian/` as canon.
- For linked sessions, encounter files are part of the same session unit — they move with the folder, not independently.
