---
tags:
  - schema
---

# Character — PC Schema

Extends: `entity.md`

Covers player characters. Unlike NPCs, PCs are owned by a player and link to that player's preference file. This schema captures the narrative and relational layer — mechanical stats live in the character sheet.

---

## Player Form

*Fill this out for your own character. Required answers are marked with \*.*

**\* Character name:**

**\* Your name (or handle):**

**\* Race and class(es):** Include level if known.

**\* Where are you from:** Homeland, birthplace, or the place that shaped you most.

**\* Why are you adventuring:** What drove you out into the world?

**\* What do you want:** Your character's goals — short term and long term.

**What secret or burden do you carry (optional):** Something others don't know, or something that weighs on you.

**Who matters to you (optional):** Allies, family, rivals, enemies — anyone with a relationship worth tracking.

---

## Schema

The machine-readable version is [`character.schema.yaml`](character.schema.yaml) (all three subtypes).

### Canonical Path

`data/characters/pcs/{name}.md`

### Valid State Values

<!-- generated: states from character.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `active` | Currently playing |
| `dead` | Deceased |
| `retired` | Out of active play by choice |
| `missing` | Whereabouts unknown in-world |
| `transformed` | Significantly altered — undead, polymorphed, etc. |
| `away` | Out of the story for a stretch and coming back, usually while their player DMs (Dip on pilgrimage during Ben's run). The body says where and why in one line. Briefs and spotlight skip them; their PC arc pauses (`meta/dm-rotation.md`) |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from character.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: character
subtype: pc
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: active | dead | retired | missing | transformed | away
tags:
  - character
  - character/pc
  - player/  # player/jeff, player/ben, etc.

# --- MANDATORY (pc) ---
race: ""                # A link to a race entry, or a plain note.
class: ""               # A link to a class entry, or a plain note (multiclass, subclass,
                        # "Unknown").
level:                  # Integer, 1-20.
player: "[[meta/players/player-name]]"  # Links to meta/players/{name}.md.

# --- OPTIONAL (entity base) ---
aliases: []             # Other names or titles this is known by.
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
last_updated: "[[Session NN - Title]]"
relates_to:
  - "[[Entity Name]] (relationship)"
known_by:
  - "[[Character Name]] (partial | full)"
description: ""

# --- OPTIONAL (pc) ---
background: ""
pronouns: ""            # E.g. "they/them".
goals: []
allies:
  - "[[Character or Faction Name]] (nature of relationship)"
enemies:
  - "[[Character or Faction Name]] (nature of conflict)"
family:                 # Relatives, as annotated links or plain notes for people with no entry.
  - "[[Character Name]] (relation)"
character_sheet: ""     # Path to a sheet file, an external link, or an inline summary.
homeland: "[[Location Name]]"
motivation: ""
secrets: []
affinity:               # Per-target liking, integer -10..+10; see meta/affinity.md.
                        # Subject->target; absence = neutral (0)
  - "[[Character Name]] (n)"
level_confirmed:        # Last played session the level was checked at (stamp); see
                        # scripts/party-status.py.
spotlight: normal       # low = tactics-first player, never flagged overdue
                        # (meta/character-focus.md).
spotlight_hooks:        # Queryable backstory, values and goal material that /session surfaces; each
                        # hook is a one-line story hook (a fear, wound, goal, unresolved thread).
  - hook: ""
    status: open | seeded | paid
---
```
<!-- end generated -->

### Spotlight Fields

Drive the character-focus ledger — `meta/character-focus.md` defines the full semantics
(lifecycle, rotation, appetite). Both optional; omitting them = a normal-appetite PC with no
hooks yet.

- **`spotlight`** — `normal` (default, rotation tracks the PC) or `low` (tactics-first player,
  excluded from rotation/overdue).
- **`spotlight_hooks`** — list of `{ hook, status: open | seeded | paid }`, the addressable
  form of the backstory material `/session` surfaces. Populated by
  `.claude/commands/pc-backstory.md`, not by hand.

### Body Template

Every `[[wiki-link]]` in frontmatter must also appear in the body. Include a reference block near the top:

```markdown
Campaign: [[Campaign Name]] | Player: [[Player Name]]

Race: [[Races]] | Class: [[Class Name]] | Background: [[Background Name]]
```

Omit any line for values that are unknown — do not create dead placeholder links.

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Character name | `name`, filename |
| Your name/handle | `player` (link to their `meta/players/` file — create one if it doesn't exist) |
| Race and class | `race`, `class`, `level` |
| Background | `background` |
| Where from | `homeland` |
| Why adventuring | `motivation` |
| What you want | `goals` |
| Secret or burden | `secrets`, `spotlight_hooks` (derives hooks) |
| Why adventuring / What you want | `motivation`, `goals`, `spotlight_hooks` (derives hooks) |
| Who matters to you | `allies`, `family`, `enemies` |
