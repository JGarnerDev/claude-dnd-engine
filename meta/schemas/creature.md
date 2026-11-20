---
tags:
  - schema
---

# Creature Schema

Extends: `entity.md`

Covers **named creatures** — individuals with personality, recurring presence, or narrative significance. A random goblin patrol does not need a file; a named villain's mount does. For generic Monster Manual templates, use `meta/schemas/monster.md` instead.

---

## Player Form

*This form is primarily DM-facing. Required answers are marked with \*.*

**\* Name:** What is this creature called?

**\* Creature type:** What 5e creature type is it — undead, beast, humanoid, aberration, fiend, monstrosity, dragon, construct, elemental, fey, giant, ooze, plant, or other?

**\* Challenge rating:** What is its CR? Approximate is fine.

**\* Where it lives:** Where is it based or most often encountered?

**\* Why it matters:** What makes this creature significant — is it a recurring antagonist, a named guardian, a companion, a mystery, or something else?

**Personality (optional):** Does it have distinct behavioral traits, drives, or quirks?

**Goals (optional):** What does it want, if anything?

**Weaknesses (optional):** Narrative or mechanical vulnerabilities worth flagging.

---

## Schema

The machine-readable version is [`creature.schema.yaml`](creature.schema.yaml).

### Canonical Path

`data/creatures/{name}.md`

### Valid State Values

<!-- generated: states from creature.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `alive` | Active in the world |
| `dead` | Confirmed destroyed or slain |
| `dormant` | Sleeping, hibernating, or otherwise inactive |
| `imprisoned` | Captured, bound, or otherwise contained |
| `transformed` | Significantly altered — polymorphed, corrupted, etc. |
| `unknown` | Status unclear |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from creature.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: creature
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: alive | dead | dormant | imprisoned | transformed | unknown
tags:
  - creature

# --- MANDATORY (creature) ---
creature_type: undead | beast | humanoid | aberration | celestial | fiend | monstrosity | dragon | construct | elemental | fey | giant | ooze | plant | other
challenge_rating: ""    # CR as a string ("5", "1/2"), or "TBD" / "unknown".
location: "[[Location Name]]"  # A location link or a plain note.

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

# --- OPTIONAL (creature) ---
size: tiny | small | medium | large | huge | gargantuan
alignment: ""
breed: ""               # For animals with a known breed.
personality: ""
goals: []
motives: []
lair: "[[Location Name]]"  # Specific lair if distinct from location.
allies:
  - "[[Character or Creature Name]] (nature of relationship)"
enemies:
  - "[[Character or Faction Name]] (nature of conflict)"
tactics: ""             # Brief combat or behavioral notes.
weaknesses: ""          # Narrative or mechanical vulnerabilities.
stat_block: ""          # Link to an external stat block, or "inline" if appended to the body.
affinity:               # Party companions only. Per-target liking, -10..+10; see meta/affinity.md.
  - "[[Owner or PC Name]] (n)"
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Creature type | `creature_type` |
| Challenge rating | `challenge_rating` |
| Where it lives | `location` |
| Why it matters | `description` |
| Personality | `personality` |
| Goals | `goals` |
| Weaknesses | `weaknesses` |
