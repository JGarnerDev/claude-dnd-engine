---
tags:
  - schema
---

# Race Schema

Extends: `entity.md`

Covers playable and non-playable races. Each file represents the race as it exists in this campaign world — the DM may override canonical defaults to fit the setting.

---

## Player Form

*Use this when defining how a race exists in your world. Required answers are marked with \*.*

**\* Name:** What is this race called in your world?

**\* How common are they:** Are they widespread, regional, rare, reclusive, or typically encountered as monsters?

**Homeland:** Do they have a recognized homeland or region? If scattered, where do concentrations exist?

**Prejudices or alliances:** How do other races typically regard them, and vice versa?

**World-specific variations:** Anything about this race that differs from the canonical D&D description in your world?

**Patron deity (optional):** Which god or gods do they commonly worship?

---

## Schema

The machine-readable version is [`race.schema.yaml`](race.schema.yaml).

### Canonical Path

`data/races/{name}.md`

### Valid State Values

<!-- generated: states from race.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `widespread` | Common across many regions |
| `regional` | Found primarily in specific areas |
| `rare` | Infrequently encountered |
| `reclusive` | Mostly keeps to themselves, avoids outsiders |
| `scattered` | No homeland; found in small numbers everywhere |
| `monstrous` | Typically encountered as enemies; rare as player characters in this world |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from race.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: race
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: widespread | regional | rare | reclusive | scattered | monstrous
tags:
  - race/
  - size/medium  # size/small, size/medium, size/large

# --- MANDATORY (race) ---
size: Small | Medium | Large
speed: 30               # Base walking speed in feet.

# --- OPTIONAL (entity base) ---
aliases: []             # Other names or titles this is known by.
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
last_updated: "[[Session NN - Title]]"
relates_to:
  - "[[Entity Name]] (relationship)"
description: ""

# --- OPTIONAL (race) ---
subraces: []
typical_alignment: ""
languages:
  - Common
homeland: ""            # A region link, or a plain description.
patron_deity:
  - "[[Deity Name]]"
source: ""              # PHB, VGtM, MotM, etc.
key_traits: []          # Brief list of notable racial traits; full detail goes in the body.
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| How common | `state` |
| Homeland | `homeland` |
| Prejudices or alliances | `relates_to` or body prose |
| World-specific variations | body prose |
| Patron deity | `patron_deity` |
