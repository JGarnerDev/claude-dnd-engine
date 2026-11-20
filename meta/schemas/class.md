---
tags:
  - schema
---

# Class Schema

Extends: `entity.md`

Covers playable character classes. Each file represents the class as available in this campaign — the DM may restrict or modify options from the canonical description.

---

## Player Form

*Use this when adding a custom or modified class to the campaign. For standard PHB classes, files are pre-populated from the 5e API.*

**\* Name:** What is this class called?

**\* Availability:** Is this class open to players, restricted (DM approval needed), or unavailable in this campaign?

**Restrictions or modifications:** Anything about this class that differs from the canonical description in your campaign?

---

## Schema

The machine-readable version is [`class.schema.yaml`](class.schema.yaml).

### Canonical Path

`data/classes/{name}.md`

### Valid State Values

<!-- generated: states from class.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `available` | Open to players without restriction |
| `restricted` | Allowed with DM approval |
| `unavailable` | Not permitted in this campaign |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from class.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: class
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: available | restricted | unavailable
tags:
  - class

# --- MANDATORY (class) ---
hit_die: 6 | 8 | 10 | 12
saving_throws: []       # Two ability abbreviations: STR CON DEX INT WIS CHA.

# --- OPTIONAL (entity base) ---
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
description: ""

# --- OPTIONAL (class) ---
spellcasting_ability: INT | WIS | CHA  # Omit for non-casters.
armor_proficiencies: ""  # Plain list in one line, e.g. "Light armor, shields", or "none".
weapon_proficiencies: ""
tool_proficiencies: ""
skill_choices: ""       # "Choose N from [list]".
multiclass_prerequisite: ""
subclasses: []          # PHB subclass(es); not exhaustive.
source: PHB
key_features: []        # Two or three defining features of the class.
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Availability | `state` |
| Restrictions or modifications | body prose |
