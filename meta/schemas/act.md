---
tags:
  - schema
---

# Act Schema

An act is a story arc — a collection of thematically connected missions that build toward a major turning point. Think of it as a chapter: it has an opening state, a closing state, and a clear change between them.

---

## DM Form

**\* Name:** What is this act called?

**\* Campaign:** Which campaign does this belong to?

**\* Central conflict:** What is the specific tension this act revolves around — distinct from but serving the larger campaign conflict?

**\* Goal:** What does the party need to accomplish for this act to be complete?

**\* Opening state:** What is true about the world at the start of this act?

**\* Closing state:** What is true about the world when this act ends — win or lose?

**Missions (optional):** What missions make up this act? These can be added as they're created.

**Estimated sessions (optional):** Rough number of sessions this act is expected to span.

---

## Schema

The machine-readable version is [`act.schema.yaml`](act.schema.yaml).

### Canonical Path

`scheduler/acts/{name}.md`
Moves to `historian/acts/{name}.md` when completed.

### Valid State Values

<!-- generated: states from act.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `draft` | Being written, not ready to run |
| `planned` | Finalized, queued up but not yet started |
| `active` | Currently being played through |
| `completed` | All missions resolved, act concluded |
| `abandoned` | Dropped from the story |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from act.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: act
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: draft | planned | active | completed | abandoned
tags:
  - act/
  - campaign/

# --- MANDATORY (act) ---
central_conflict: ""
goal: ""
opening_state: ""       # What is true at the start of this act.
closing_state: ""       # What is true when this act ends.

# --- OPTIONAL (entity base) ---
campaign: strahd | homebrew  # The campaign this belongs to; acts and the party link the campaign
                             # entry.
relates_to:
  - "[[Entity Name]] (relationship)"
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
last_updated: "[[Session NN - Title]]"
description: ""

# --- OPTIONAL (act) ---
missions:
  - "[[Mission Name]]"
themes: []
estimated_sessions:

# --- HISTORIAN ONLY (mandatory when moved) ---
# outcome: ""             # What actually happened; win, loss, or something in between.
# sessions_played:        # Actual number of sessions.
---
```
<!-- end generated -->

### Notes

- Each act should feel meaningfully different from the last — the party's situation, the stakes, or the nature of the conflict should shift.
- When an act completes, add `outcome` and `sessions_played` before moving to `historian/`.
