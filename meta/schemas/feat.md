---
tags:
  - schema
---

# Feat Schema

Extends: `entity.md`

Covers 5e feats from the Player's Handbook and major supplements. Feat files are reference material — they stay in `data/feats/` and do not move to `historian/`. Use them during character creation, NPC building, and session planning.

---

## Player Form

*DM-facing. Required answers marked with \*.*

**\* Name:** What is the feat called?

**\* Effect:** What does the feat do mechanically? (1–3 sentences)

**Prerequisite (optional):** Ability score minimum, race, proficiency, or other requirement?

**Source (optional):** Book and page number.

---

## Schema

The machine-readable version is [`feat.schema.yaml`](feat.schema.yaml).

### Canonical Path

`data/feats/{name}.md`

### Valid State Values

<!-- generated: states from feat.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `available` | Legal in this campaign |
| `banned` | Disallowed for this campaign |
| `homebrew` | Custom or modified version |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from feat.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: feat
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: available | banned | homebrew
tags:
  - feat

# --- MANDATORY (feat) ---
effect: ""

# --- OPTIONAL (entity base) ---
description: ""
aliases: []             # Other names or titles this is known by.

# --- OPTIONAL (feat) ---
prerequisite: ""        # What the feat requires, or "none".
source: ""
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Effect | `effect` |
| Prerequisite | `prerequisite` |
| Source | `source` |
