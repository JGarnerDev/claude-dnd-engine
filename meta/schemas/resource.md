---
tags:
  - schema
---

# Resource Schema

Extends: `entity.md`

Covers named natural or economic resources: ore deposits, timber stands, fishing grounds, arcane leylines, trade commodities, skilled labor pools. Resources drive faction conflict, trade routes, and session hooks — whoever controls a scarce resource controls leverage.

---

## Player Form

*Answer these questions and give them to your DM or paste them into chat. Required answers are marked with \*.*

**\* Name:** What is this resource called? (e.g. the Barovian Amber Fields, the Tser Pool Salmon Run, Iron Veins of Mount Ghakis)

**\* Type:** What category — ore, timber, food, fresh water, stone, arcane material, livestock, textiles, alchemical components, labor, or something else?

**\* Where it comes from:** Which location, region, or terrain feature does this resource originate from or pass through?

**\* Rarity:** Is this common (found everywhere), uncommon (regionally significant), rare (hard to obtain anywhere), or unique (only one source exists)?

**Who controls it (optional):** Which faction, NPC, or power owns or restricts access?

**Trade value (optional):** Is this low-value bulk goods, moderate staple trade, high-value specialty, or priceless?

**Accessibility (optional):** Is access open, restricted by faction, hidden/undiscovered, or monopolized?

---

## Schema

The machine-readable version is [`resource.schema.yaml`](resource.schema.yaml).

### Canonical Path

`data/resources/{name}.md`

### Valid State Values

<!-- generated: states from resource.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `abundant` | Plentiful; easily accessed; low scarcity pressure |
| `scarce` | Limited supply relative to demand; creates pressure |
| `depleted` | Nearly or fully exhausted; historical significance only |
| `hidden` | Not yet discovered or publicly known |
| `monopolized` | Single controller dominates all access |
| `contested` | Multiple parties fighting for control or access |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from resource.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: resource
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: abundant | scarce | depleted | hidden | monopolized | contested
tags:
  - resource

# --- MANDATORY (resource) ---
resource_type: ore | timber | food | fresh-water | stone | arcane | livestock | textiles | alchemical | labor | goods | other
rarity: common | uncommon | rare | unique
location:               # Location or region links; may be empty while unplaced.
  - "[[Location or Region Name]]"

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

# --- OPTIONAL (resource) ---
controlled_by: "[[Faction or NPC Name]]"  # One controller (a link or a plain note), or a list of
                                          # annotated links.
trade_value: negligible | low | moderate | high | priceless | varies
accessibility: open | restricted | hidden | monopolized | contested
consumers:              # Annotated links, or a plain note for a group with no file.
  - "[[Faction or Location Name]] (nature of dependency)"
depends_on:             # Sync rule: if A depends_on B, B should list A in consumers. Keep both ends
                        # updated.
  - "[[Resource Name]] (what this resource requires to be produced or sustained)"
hook: ""
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| Type | `resource_type` |
| Where it comes from | `location` |
| Rarity | `rarity` |
| Who controls it | `controlled_by` |
| Trade value | `trade_value` |
| Accessibility | `accessibility` |
