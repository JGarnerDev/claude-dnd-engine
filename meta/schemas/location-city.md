---
tags:
  - schema
---

# Location — City Schema

Extends: `entity.md`, `location.md` (when created)

Covers cities, towns, villages, and any settled population center.

---

## Player Form

*Answer these questions and give them to your DM or paste them into chat. Required answers are marked with \*.*

**\* Name:** What is this settlement called?

**\* Location on the world map:** Where does it sit — region, coast, near what landmarks?

**\* Why it exists:** What gave rise to this settlement — trade route, military fort, holy site, natural resource, something else?

**\* How it exists:**

- What underlying conflicts or pressures shape daily life here (tensions)?
- Who lives here — rough mix of races, classes, wealth levels (composition)?
- What factions operate in or around the city?
- Who rules, and how stable is that rule (rulership)?

**\* Shops:** What are the key establishments? At minimum:

- Inn (name, proprietor)
- Mundane shop (name, proprietor, specialty)
- Magic shop — if any (name, proprietor)

**Map (optional):** Attach or describe a map of the city layout.

---

## Schema

The machine-readable version is [`location.schema.yaml`](location.schema.yaml) (all eight subtypes).

### Canonical Path

`data/locations/cities/{name}.md`

### Valid State Values

<!-- generated: states from location.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `thriving` | Growing, prosperous |
| `stable` | Normal operation |
| `troubled` | Unrest, decay, or crisis |
| `besieged` | Under active attack or blockade |
| `ruined` | Largely destroyed but not empty |
| `abandoned` | Empty or near-empty |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from location.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: location
subtype: city
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: thriving | stable | troubled | besieged | ruined | abandoned
tags:
  - location
  - location/city

# --- MANDATORY (city) ---
global_location: "[[Region or Area Name]]"
purpose: commerce | political | military | religious | other

# --- OPTIONAL (entity base) ---
aliases: []             # Other names or titles this is known by.
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
last_updated: "[[Session NN - Title]]"
relates_to:
  - "[[Entity Name]] (relationship)"
known_by:
  - "[[Character Name]] (partial | full)"
owner: "[[Player Character Name]]"
description: ""

# --- OPTIONAL (city) ---
map: ""                 # Path to map file or image.
population: ""          # Rough descriptor or number.
composition: ""
tensions: []
factions:
  - "[[Faction Name]]"
controlling_faction: "[[Faction Name]]"  # A list of links when control is shared.
rulership: "[[NPC Name]]"
shops:
  - "[[Shop Name]]"
trade_specialty: ""     # What this settlement is regionally known for producing or trading, e.g.
                        # "fine leatherwork", "dwarven arms".
routes:                 # Trade routes, highways or sea lanes serving the city (route-cities.py).
  - "[[Route Name]]"
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Location on world map | `global_location` |
| Why it exists | `purpose` |
| Tensions | `tensions` |
| Composition | `composition` |
| Factions | `factions` |
| Rulership | `rulership` |
| Shops | `shops` (each shop gets its own file per `location-shop.md`) |
| Map | `map` |
