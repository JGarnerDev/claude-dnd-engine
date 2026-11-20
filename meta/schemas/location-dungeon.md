---
tags:
  - schema
---

# Location — Dungeon Schema

Extends: `entity.md`

Covers any adventuring location with internal structure: ruins, caves, towers, crypts, sewers, sunken temples, abandoned fortresses.

---

## Player Form

*Answer these questions and give them to your DM or paste them into chat. Required answers are marked with \*.*

**\* Name:** What is this place called, or what do locals call it?

**\* Location:** Where is it — near which settlement or region?

**\* Origin:** What was this before it became what it is now? (e.g. a dwarven mine, a wizard's tower, a temple to a forgotten god, a natural cave system)

**\* Current inhabitants or threat:** What lives or lurks here now?

**\* The hook:** Why would adventurers go here — treasure, a rescue, a mystery, a quest objective?

**Known entrances (optional):** How do people get in?

**Notable areas or levels (optional):** Any known rooms, wings, or floors worth naming — rough description, not a full map.

**Known dangers (optional):** Traps, hazards, or specific threats beyond the general inhabitants.

---

## Schema

The machine-readable version is [`location.schema.yaml`](location.schema.yaml) (all eight subtypes).

### Canonical Path

`data/locations/dungeons/{name}.md`

### Valid State Values

<!-- generated: states from location.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `unknown` | Existence rumored but unconfirmed |
| `known` | Located and documented, not yet entered |
| `active` | Currently inhabited by a threat |
| `partially-explored` | Some areas cleared or mapped |
| `cleared` | Threat removed, at least temporarily |
| `repopulated` | Cleared but something moved back in |
| `sealed` | Deliberately closed off |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from location.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: location
subtype: dungeon
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: unknown | known | active | partially-explored | cleared | repopulated | sealed
tags:
  - location
  - location/dungeon
  - location/dungeon/ruin  # use a more specific tag where applicable

# --- MANDATORY (dungeon) ---
location: "[[Region or City Name]]"
origin: ""
current_threat: ""
hook: ""

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

# --- OPTIONAL (dungeon) ---
entrances: []
levels: ""
known_dangers: []
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Location | `location` |
| Origin | `origin` |
| Current inhabitants/threat | `current_threat` |
| The hook | `hook` |
| Known entrances | `entrances` |
| Notable areas/levels | `levels` |
| Known dangers | `known_dangers` |
