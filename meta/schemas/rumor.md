---
tags:
  - schema
---

# Rumor Schema

Extends: `entity.md`

Covers information circulating in the world — true, false, or somewhere in between. Rumors are hooks, world texture, and an information economy. They drive investigation and let players discover the world through unreliable narrators.

---

## Player Form

*This form is primarily DM-facing. Required answers are marked with \*.*

**\* The rumor:** What is being said? Write it as someone might actually say it in a tavern or on the street.

**\* Where is it circulating:** Which city, region, faction, or social circle is spreading this?

**\* Truth value:** Is this true, false, partially true, or unknown even to you?

**Source (optional):** Who started it, or where did it originate? Can be unknown.

**Related entities (optional):** Which people, places, factions, or events does this rumor concern?

**Who would know it (optional):** Is this common knowledge, or does it take specific contacts or social circles to hear?

---

## Schema

The machine-readable version is [`rumor.schema.yaml`](rumor.schema.yaml).

### Canonical Path

`data/rumors/{name}.md`

### Valid State Values

<!-- generated: states from rumor.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `spreading` | Actively circulating |
| `believed` | Widely accepted as true |
| `doubted` | Circulating but met with skepticism |
| `debunked` | Proven false, fading |
| `confirmed` | Proven true in play |
| `forgotten` | No longer circulating |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from rumor.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""                # A short slug name for the rumor, e.g. "dead-king-lives".
type: rumor
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: spreading | believed | doubted | debunked | confirmed | forgotten
tags:
  - rumor/
  - region/

# --- MANDATORY (rumor) ---
content: ""             # The rumor text as it would be heard in the world.
truth: true | false | partial | unknown
circulating_in:
  - "[[Location or Faction Name]]"

# --- OPTIONAL (entity base) ---
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
last_updated: "[[Session NN - Title]]"
relates_to:
  - "[[Entity Name]] (relationship)"
known_by:
  - "[[Character Name]] (partial | full)"
description: ""

# --- OPTIONAL (rumor) ---
source: "[[Entity Name]]"  # A link, or "unknown".
truth_detail: ""        # The real story, if different from the rumor — DM eyes only.
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| The rumor | `content` |
| Where circulating | `circulating_in` |
| Truth value | `truth` |
| Source | `source` |
| Related entities | `relates_to` |
| Who would know it | `known_by` |

### Notes

- `name` is a slug for the file, not the rumor text — use `content` for the actual rumor.
- `description` is a DM-facing one-liner summary; `content` is the in-world text.
- `truth_detail` can hold the real story without revealing it in `content` — useful when the rumor is partially true.
