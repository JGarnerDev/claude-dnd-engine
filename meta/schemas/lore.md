---
tags:
  - schema
---

# Lore Schema

Extends: `entity.md`

Covers world-rules documents: one file per domain (how time is kept, how magic works, what the gods did). Lore files hold the rules the rest of the world follows; the substance lives in the body, so the frontmatter is only the entity base plus `subtype` and `state`. Some pending domains wait on answers from `questionnaires/world/<domain>/` (history, religion).

---

## Schema

The machine-readable version is [`lore.schema.yaml`](lore.schema.yaml).

### Canonical Path

`data/lore/{subtype}.md`

### Valid Subtypes

`calendar`, `geography`, `history`, `magic`, `religion`

### Valid State Values

<!-- generated: states from lore.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `draft` | Being written or awaiting questionnaire answers; treat as open questions, not settled canon |
| `stable` | Ratified by the DM; settled canon |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from lore.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: "World {Domain}"
type: lore
subtype: calendar | geography | history | magic | religion
exists: false           # true once the DM ratifies it.
state: draft | stable
tags:
  - lore
  - lore/{subtype}

# --- OPTIONAL (entity base) ---
aliases: []             # Other names or titles this is known by.
campaign: homebrew      # The campaign this belongs to; acts and the party link the campaign entry.
importance: major
contributed_by: pending  # A player handle, party, or pending.
description: ""
relates_to:
  - "[[Entity Name]] (relationship)"
---
```
<!-- end generated -->
