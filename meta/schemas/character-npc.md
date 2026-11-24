---
tags:
  - schema
---

# Character — NPC Schema

Extends: `entity.md`

Covers any non-player character: townsfolk, antagonists, merchants, quest-givers, etc.

---

## Player Form

*Answer these questions and give them to your DM or paste them into chat. Required answers are marked with \*.*

**\* Name:** What is this character's name?

**\* Location:** Where are they based or most often found?

**\* Personality:** Describe them in a few words or sentences — what's the immediate impression?

**\* How they make a living:** What do they do day-to-day to survive or thrive?

**\* Goals and motives:** What do they want, and why do they want it?

**Friends, family, enemies (optional):** Who are the important people in their life, and what is the relationship?

**Character sheet detail (optional):** Race, class, level, any notable stats or abilities.

---

## Schema

The machine-readable version is [`character.schema.yaml`](character.schema.yaml) (all three subtypes).

### Canonical Path

`data/characters/npcs/{name}.md`

### Valid State Values

<!-- generated: states from character.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `alive` | Living and active |
| `dead` | Deceased |
| `missing` | Whereabouts unknown |
| `imprisoned` | Captive or restrained |
| `transformed` | Significantly altered — undead, polymorphed, etc. |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from character.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: character
subtype: npc
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: alive | dead | missing | imprisoned | transformed
tags:
  - character
  - character/npc

# --- MANDATORY (npc) ---
location: "[[Location Name]]"  # A link to a location, or a plain note such as "unknown" or "TBD".
personality: ""
livelihood: ""

# --- OPTIONAL (entity base) ---
aliases: []             # Other names or titles this is known by.
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
last_updated: "[[Session NN - Title]]"
relates_to:
  - "[[Entity Name]] (relationship)"
known_by:
  - "[[Character Name]] (partial | full)"
owner: "[[Player Character Name]]"
description: ""

# --- OPTIONAL (npc) ---
background: ""
race: ""                # A link to a race entry, or a plain note.
class: ""               # A link to a class entry, or a plain note (multiclass, subclass,
                        # "Unknown").
level:                  # Integer, 1-20.
pronouns: ""            # E.g. "they/them".
goals: []
allies:
  - "[[Character or Faction Name]] (nature of relationship)"
enemies:
  - "[[Character or Faction Name]] (nature of conflict)"
family:                 # Relatives, as annotated links or plain notes for people with no entry.
  - "[[Character Name]] (relation)"
character_sheet: ""     # Path to a sheet file, an external link, or an inline summary.
disposition: hostile | neutral | friendly | unknown
motives: []
voice: ""               # Core cadence and register in one line; see meta/voice.md.
voice_confirmed:        # Last played session the voice was checked at (stamp); set by /recap.
stats_confirmed:        # Last played session the `## Stat block` was checked at (stamp); set by
                        # /recap. See meta/npc-stats.md.
human_detail: ""        # One comprehensible motive, mundane habit, or thing they protect.
charm_hook: ""          # One flaw, habit, fear or absurdity that makes players root for them.
sells:                  # Goods or services this NPC trades in, as links or plain notes.
  - "[[Resource or Good Name]]"
affinity:               # Per-target liking, integer -10..+10; see meta/affinity.md.
                        # Subject->target; absence = neutral (0)
  - "[[Player Character Name]] (n)"
---
```
<!-- end generated -->

### Body Template

Every `[[wiki-link]]` in frontmatter must also appear in the body. Include a reference block near the top:

```markdown
Location: [[Location Name]] | Campaign: [[Campaign Name]]

Race: [[Race Name]] | Class: [[Class Name]] | Background: [[Background Name]]
```

Omit any line for values that are unknown — do not create dead placeholder links.

For `disposition: friendly` or `importance: major` NPCs, consider a `charm_hook` — one specific detail (flaw, habit, fear, absurdity) that makes players want to root for them rather than just use them.

Once the NPC has spoken at the table, `/recap` adds a `## Voice` section at the end of the body (core, now, lines said at the table, arc) and sets `voice` and `voice_confirmed`. Shape and rules: `meta/voice.md`.

Once a recurring NPC with a custom or tuned stat block has fought the party, `/recap` adds a `## Stat block` section before `## Voice` (current block, what was shown at the table, changes) and sets `stats_confirmed`. What the table has seen is locked. A stock block gets one line naming it instead. Shape and rules: `meta/npc-stats.md`.

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Location | `location` |
| Personality | `personality` |
| How they make a living | `livelihood` |
| Background | `background` |
| Race | `race` |
| Class/level | `class`, `level` |
| Disposition toward party | `disposition` |
| Goals | `goals` |
| Motives | `motives` |
| Friends | `allies` |
| Family | `family` |
| Enemies | `enemies` |
| Character sheet detail | `character_sheet` |
