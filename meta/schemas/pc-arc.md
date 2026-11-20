---
tags:
  - schema
---

# PC Arc Schema

One player character's provisional direction: logline, growth and fall, the next hooks to seed,
and a log of how play has bent it. Rules and meaning: `meta/pc-arcs.md`.

---

## DM Form

**\* PC:** Which player character is this for?

**\* Logline:** In one to three plain sentences, what makes this character interesting? Wound, drive, cost. No lore words.

**\* Growth:** What does the character become if things go well?

**\* Fall:** What worse thing could they become?

**\* Next step:** Which one or two of the PC's spotlight hooks should be seeded soon, and why now?

**Someday (optional):** One loose line about where they might end up.

---

## Schema

The machine-readable version is [`pc-arc.schema.yaml`](pc-arc.schema.yaml).

### Canonical Path

`scheduler/arcs/{PC} PC Arc.md` — e.g. `scheduler/arcs/Dip PC Arc.md`. Never the bare PC name,
which would collide with the PC file's wikilink. Never moves to `historian/`.

### Valid State Values

<!-- generated: states from pc-arc.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `active` | The PC is playing; the PC arc steers planning |
| `retired` | Finished, dropped, or the PC left. Kept for its Shifts log |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from pc-arc.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: "{PC} PC Arc"
type: pc-arc
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: active | retired
tags:
  - pc-arc

# --- MANDATORY (pc-arc) ---
pc: "[[PC Name]]"
arc_checked: 0          # Session number last reviewed; /recap restamps every session.
next_step:              # 1-2 hook strings, copied word for word from the PC's spotlight_hooks.
  - ""

# --- OPTIONAL (entity base) ---
description: ""         # The logline, player-safe part only.
---
```
<!-- end generated -->

### Body

Sections in this order:

```markdown
## Logline

Full logline. DM-only parts marked *(DM-only)*.

## Growth

## Fall

## Next step

Why these hooks, why now. One line per hook.

## Player wants

Pointer to [[PC Name]] → Looking Ahead (Player Intent), plus how this PC arc answers it.
"Not asked yet" when the PC file has no such section.

## Someday

## Shifts

- S{nn} — {cause} — {what changed}
```

### Notes

- `next_step` strings must match a `hook:` on the PC file exactly. `scripts/spotlight-balance.py` looks up their status and flags a mismatch.
- `arc_checked` lagging the latest played session means stale: review with the DM before planning on it.
- No `campaign` tag: PC arcs serve both seasons.
