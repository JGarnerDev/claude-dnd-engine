---
tags:
  - schema
---

# Monster Schema

Monster Manual templates — encounter archetypes, not tracked individuals. Named creatures with personality, recurring presence, or narrative significance use `meta/schemas/creature.md` instead.

These files never move to `historian/` — monsters are perpetually free templates.

---

## Player Form

*DM-facing only.*

**\* Name:** Exact MM name for this monster.

**\* Creature type:** What 5e creature type? (undead, beast, humanoid, aberration, fiend, monstrosity, dragon, construct, elemental, fey, giant, ooze, plant, other)

**\* Challenge rating:** CR value.

**Source (optional):** Book and page number.

**Size (optional):** tiny, small, medium, large, huge, or gargantuan.

**Habitats (optional):** Where is this monster typically encountered?

---

## Schema

The machine-readable version is [`monster.schema.yaml`](monster.schema.yaml).

### Canonical Path

`data/monsters/{name}.md`

### Frontmatter Template

<!-- generated: template from monster.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: monster
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
tags:
  - monster
  - monster/<creature_type>
  - cr/<decimal>  # e.g. cr/0.25 for CR 1/4, cr/0.5 for CR 1/2, cr/5 for CR 5

# --- MANDATORY (monster) ---
creature_type: undead | beast | humanoid | aberration | celestial | fiend | monstrosity | dragon | construct | elemental | fey | giant | ooze | plant | other
challenge_rating: ""    # CR as a string, e.g. "5" or "1/2".

# --- OPTIONAL (entity base) ---
description: ""

# --- OPTIONAL (monster) ---
size: tiny | small | medium | large | huge | gargantuan
alignment: ""
source: ""              # Book and page, e.g. "Monster Manual p.298".
stat_block: ""          # URL, or "inline" if appended to the body.
habitats: []            # Environments where typically encountered.
weaknesses: []          # Damage vulnerabilities + special (sunlight, silver, running water)
resistances: []         # Damage resistances (e.g. "bludgeoning from nonmagical attacks")
immunities: []          # Damage immunities + condition immunities (e.g. "poison", "charmed")
legendary: false        # True if has legendary actions or lair actions.
movement: []            # Special movement with speed, e.g. "fly 60".
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Creature type | `creature_type`, tag `monster/<creature_type>` |
| Challenge rating | `challenge_rating` |
| Source | `source` |
| Size | `size` |
| Habitats | `habitats` |
