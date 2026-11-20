---
tags:
  - schema
---

# Event Schema

Extends: `entity.md`

Covers named historical events that shaped the present: battles, disasters, treaties, founding moments, divine interventions, catastrophes. Events are causes — use them to explain why the world is the way it is.

For *what qualifies* as an event, the promotion rule, and how events surface on the home-page charts, see `meta/events.md` — this file is the frontmatter mechanics only.

---

## Player Form

*Answer these questions and give them to your DM or paste them into chat. Required answers are marked with \*.*

**\* Name:** What is this event called or remembered as?

**\* When:** In-world date, era, or relative time (e.g. "300 years ago", "before the Sundering", "last winter").

**\* What happened:** A brief description of the event itself.

**\* Who was involved:** Major participants, factions, or actors. Each significant one should have or get their own entity file.

**\* Outcome:** How did it end? Who won, lost, survived, or was changed?

**\* Consequences:** What about the current world exists because of this event? Be specific — this is the most important field.

**How well known is it (optional):** Is this common knowledge, regional lore, a secret, or a matter of historical debate?

---

## Schema

The machine-readable version is [`event.schema.yaml`](event.schema.yaml).

### Canonical Path

`data/events/{name}.md`

### Valid State Values

<!-- generated: states from event.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `recent` | Within living memory |
| `historical` | Known but not within living memory |
| `ancient` | Known only through records or ruins |
| `legendary` | May be mythologized or partially fictional |
| `disputed` | Accounts conflict; truth unclear |
| `secret` | Occurred but not publicly known |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from event.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: event
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: recent | historical | ancient | legendary | disputed | secret
tags:
  - event/
  - event/battle  # use a more specific tag where applicable
  - region/

# --- MANDATORY (event) ---
date: ""                # In-world date, era or relative time, in prose.
outcome: ""
consequences: []        # What about the present world exists because of this.

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

# --- OPTIONAL (event) ---
timeline_date: ""       # Plot key "YYYY[-MM[-DD]]", year may be negative or short (meta/events.md).
                        # Needs a numeric epoch (meta/calendar.md) to appear on the timeline. Omit
                        # when no date can be fixed.
track: ""               # Lane override, "category" or "category:member" (meta/events.md). Omit to
                        # auto-fan.
daypart: dawn | morning | midday | afternoon | evening | night | late
                        # Sub-day tier. Spreads same-day beats on the interactive timeline so events
                        # minted at one session's date don't stack. See meta/calendar-template.md.
order:                  # 1-based sequence among beats sharing a date and daypart; /recap assigns it
                        # in narrative order. Omit for big single-date events.
participants:
  - "[[Entity Name]] (role)"
awareness: widely-known | regional | local | party | secret | forgotten | disputed
---
```
<!-- end generated -->

### Form → Frontmatter Mapping

| Form answer | Field |
|---|---|
| Name | `name`, filename |
| When | `date` (prose) + `timeline_date` (numeric `YYYY[-MM[-DD]]`) |
| What happened | `description` + body prose |
| Who was involved | `participants` |
| Outcome | `outcome` |
| Consequences | `consequences` |
| How well known | `awareness`, `state` |

### Canon-pending

Lore the DM hasn't ratified (e.g. player-contributed homebrew) is ingested with `exists: false` — an *out-of-world* "not yet confirmed canon" status, distinct from `state: disputed` (an *in-world* "accounts conflict" quality). The extractor drops `exists: false` events from player-safe exports and shows them only under `-Full` as **draft** beats. Flip `exists: true` to ratify. See `meta/events.md`.
