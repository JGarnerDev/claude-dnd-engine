---
tags:
  - schema
---

# Skill Schema

**Canonical path:** `data/skills/{Skill Name}.md`
**Historian path:** `historian/skills/{Skill Name}.md`
**Type:** `skill` (no subtype)

The machine-readable version is [`skill.schema.yaml`](skill.schema.yaml).

---

## Valid State Values

<!-- generated: states from skill.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `available` | Legal in this campaign |
<!-- end generated -->

## Frontmatter Template

<!-- generated: template from skill.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: skill
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: available
tags:
  - skill

# --- MANDATORY (skill) ---
ability: STR | DEX | CON | INT | WIS | CHA
use_cases: []

# --- OPTIONAL (entity base) ---
description: ""

# --- OPTIONAL (skill) ---
source: PHB
---
```
<!-- end generated -->

## Field Reference

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Exact PHB name |
| `type` | yes | Always `skill` |
| `exists` | yes | `false` in data pool |
| `state` | yes | Always `available` |
| `tags` | yes | Always `[skill]` |
| `ability` | yes | Governing ability score abbreviation |
| `source` | yes | Always `PHB` |
| `description` | yes | One-sentence summary of what the skill covers |
| `use_cases` | yes | 3–6 concrete DM prompts for when to call for a check |

## Valid `ability` Values

`STR` · `DEX` · `CON` · `INT` · `WIS` · `CHA`
