---
tags:
  - schema
---

# Deity Schema

Extends: `entity.md`

Covers gods, demigods, dead gods, primordials, and other divine or cosmic entities. Deities are distinct from factions — they are cosmic forces with material consequences, not just organizations with power.

---

## Player Form

*Answer these questions and give them to your DM or paste them into chat. Required answers are marked with \*.*

**\* Name:** What is this deity called? Include titles or epithets if any.

**\* Domain(s):** What does this god represent or govern — war, death, harvest, trickery, knowledge, etc.?

**\* Moral character:** How would you describe their alignment or disposition?

**\* Current status:** Are they active and present, silent and distant, dead, imprisoned, or something else?

**\* Who worships them:** What peoples, factions, or cultures follow this deity and why?

**\* What do they want from mortals:** What do they ask, demand, or reward?

**Symbol, holy day, or sacred practice (optional):** How is worship expressed?

**Myths or divine history (optional):** Any known stories, wars between gods, or defining divine acts.

---

## Schema

The machine-readable version is [`deity.schema.yaml`](deity.schema.yaml).

### Canonical Path

`data/deities/{name}.md`

### Valid State Values

<!-- generated: states from deity.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `active` | Present and responsive to worship |
| `dormant` | Exists but silent or unreachable |
| `diminished` | Weakened — fewer followers, less power |
| `dead` | Slain; may still have effects on the world |
| `imprisoned` | Bound by another force |
| `ascended` | Recently became divine |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from deity.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: deity
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: active | dormant | diminished | dead | imprisoned | ascended
tags:
  - deity
  - deity/war  # add one per domain — e.g. deity/war, deity/death, deity/trickery

# --- MANDATORY (deity) ---
tier: greater | intermediate | lesser | demigod | unknown
                        # Divine rank; "unknown" while the table has not fixed it.
domains: []
moral_character: ""     # Alignment or disposition in plain language.
worshippers:            # Faction or culture links; may be empty.
  - "[[Faction or Culture Name]]"
wants: ""

# --- OPTIONAL (entity base) ---
aliases: []             # Other names or titles this is known by.
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
last_updated: "[[Session NN - Title]]"
relates_to:
  - "[[Entity Name]] (relationship)"
known_by:
  - "[[Character Name]] (partial | full)"
description: ""

# --- OPTIONAL (deity) ---
symbol: ""
holy_day: ""
sacred_practices: []
myths: []
divine_conflicts:
  - "[[Deity Name]] (nature of conflict)"
affinity:               # Deities that deal with the party in person (a patron, a bargainer).
                        # Per-target liking, -10..+10; see meta/affinity.md.
  - "[[PC Name]] (n)"
voice: ""               # Core cadence and register in one line, for deities that speak at the
                        # table; see meta/voice.md.
voice_confirmed:        # Number of the last played session at which the voice was checked.
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Domain(s) | `domains` |
| Moral character | `moral_character` |
| Current status | `state` |
| Who worships them | `worshippers` |
| What they want | `wants` |
| Symbol/holy day/practice | `symbol`, `holy_day`, `sacred_practices` |
| Myths or history | `myths`, body prose |
