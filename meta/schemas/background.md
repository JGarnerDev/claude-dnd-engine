---
tags:
  - schema
---

# Background Schema

Extends: `entity.md`

Covers character backgrounds. Each file represents a background as available in this campaign — the DM may restrict options. For standard PHB backgrounds, files are pre-populated.

---

## Player Form

*Use this when adding a custom or modified background. For standard PHB backgrounds, files are pre-populated.*

**\* Name:** What is this background called?

**\* Availability:** Is it open to players, restricted (DM approval needed), or unavailable?

**Restrictions or modifications:** Anything about this background that differs from canonical rules in your campaign?

---

## Schema

The machine-readable version is [`background.schema.yaml`](background.schema.yaml).

### Canonical Path

`data/backgrounds/{name}.md`

### Valid State Values

<!-- generated: states from background.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `available` | Open to players without restriction |
| `restricted` | Allowed with DM approval |
| `unavailable` | Not permitted in this campaign |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from background.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: background
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: available | restricted | unavailable
tags:
  - background

# --- MANDATORY (background) ---
skill_proficiencies: []  # Exactly two skills.
feature: ""             # Name of the background feature.

# --- OPTIONAL (entity base) ---
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
description: ""

# --- OPTIONAL (background) ---
tool_proficiencies: []  # Tools, instruments, or gaming sets.
language_proficiencies: ""  # e.g. "Any two languages", or "none".
equipment: []           # Starting equipment list.
variants: []            # Official variant names (e.g. Spy for Criminal)
source: PHB
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Availability | `state` |
| Restrictions or modifications | body prose |
