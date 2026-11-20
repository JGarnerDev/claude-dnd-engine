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

| State | Meaning |
|---|---|
| `draft` | Being written or awaiting questionnaire answers; treat as open questions, not settled canon |
| `stable` | Ratified by the DM; settled canon |

### Frontmatter Template

```yaml
---
# --- MANDATORY (entity base) ---
name: "World {Domain}"
type: lore
subtype: calendar | geography | history | magic | religion
exists: false            # true once the DM ratifies it
state: draft | stable
tags:
  - lore
  - lore/{subtype}

# --- OPTIONAL (entity base) ---
aliases: []
campaign: homebrew
importance: major
contributed_by: pending  # player handle, party, or pending
description: ""
relates_to:
  - "[[Entity Name]] (relationship)"
---
```
