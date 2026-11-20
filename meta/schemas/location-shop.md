---
tags:
  - schema
---

# Location — Shop Schema

Extends: `entity.md`, `location.md` (when created)

Covers any commercial or service establishment: inns, general stores, magic shops, smithies, etc.

---

## Player Form

*Answer these questions and give them to your DM or paste them into chat. Required answers are marked with \*.*

**\* Name:** What is the shop called?

**\* City:** Which city or settlement is this shop in?

**\* Proprietor:** Who runs it? (If the proprietor doesn't have an NPC file yet, note their name and any details — one will be created.)

**\* Why it exists:** What is the shop's driving purpose — pure commerce, a political front, tied to a faction, a family legacy, something else?

**\* How it exists:**

- Who are its typical customers?
- What does it stock or offer — where does that supply come from?

**Location within the city (optional):** Where in the city is it — market district, back alley, dockside, etc.?

---

## Schema

The machine-readable version is [`location.schema.yaml`](location.schema.yaml) (all eight subtypes).

### Canonical Path

`data/locations/shops/{name}.md`

### Valid State Values

<!-- generated: states from location.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `open` | Operating normally |
| `closed` | Temporarily shut |
| `under-new-management` | Ownership or character changed |
| `destroyed` | Burned, collapsed, or demolished |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from location.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: location
subtype: shop
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: open | closed | under-new-management | destroyed
tags:
  - location
  - location/shop
  - location/shop/inn  # use a more specific tag when applicable

# --- MANDATORY (shop) ---
city: "[[City Name]]"
proprietor: "[[NPC Name]]"
purpose: commerce | political | front | religious | criminal | other

# --- OPTIONAL (entity base) ---
aliases: []             # Other names or titles this is known by.
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
last_updated: "[[Session NN - Title]]"
relates_to:
  - "[[Entity Name]] (relationship)"
resources:
  - "[[Resource Name]]"
known_by:
  - "[[Character Name]] (partial | full)"
owner: "[[Player Character Name]]"
description: ""

# --- OPTIONAL (shop) ---
map_location: ""        # Where within the city.
customers: ""
supply:                 # Raw materials or trade goods the shop sources; wiki-link when a resource
                        # entity exists.
  - "[[Resource Name]]"
specialty: ""           # One-liner for what this shop is known for, e.g. "cold-forged iron
                        # weapons", "imported silk garments".
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| City | `city` |
| Proprietor | `proprietor` (create NPC file if one doesn't exist) |
| Why it exists | `purpose` |
| Customers | `customers` |
| Supply | `supply` |
| Location in city | `map_location` |
