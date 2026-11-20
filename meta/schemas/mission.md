---
tags:
  - schema
---

# Mission Schema

A mission is a self-contained objective — the atomic unit of story. It has a clear goal, a reason the party cares, and meaningful consequences for both success and failure. A mission typically spans one to three sessions.

---

## DM Form

**\* Name:** What is this mission called?

**\* Act:** Which act does this mission belong to?

**\* Objective:** What does the party need to do? State it as a concrete goal.

**\* Hook:** Why does the party care — or why are they compelled to act? What pulls them in?

**\* Key locations:** Where does this mission take place?

**\* Key NPCs:** Who does the party interact with? Who drives or opposes the mission?

**Obstacles (optional):** What stands between the party and success — enemies, puzzles, moral dilemmas, time pressure?

**Success consequences (optional):** What changes if the party succeeds?

**Failure consequences (optional):** What changes if the party fails or walks away?

**Reward (optional):** What do they gain — gold, items, information, allies, narrative progress?

---

## Schema

The machine-readable version is [`mission.schema.yaml`](mission.schema.yaml).

### Canonical Path

`scheduler/missions/{name}.md`
Moves to `historian/missions/{name}.md` when resolved.

### Valid State Values

<!-- generated: states from mission.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
| State | Meaning |
|---|---|
| `draft` | Being written, not ready to run |
| `planned` | Ready, queued behind an active mission |
| `active` | Currently being pursued by the party |
| `on-hiatus` | Paused with its campaign; picks up when the campaign resumes |
| `completed` | Resolved successfully |
| `failed` | Resolved with failure — consequences applied |
| `abandoned` | Dropped from the story |
<!-- end generated -->

### Frontmatter Template

<!-- generated: template from mission.schema.yaml by scripts/gen-schema-docs.py; edit the schema, not this block -->
```yaml
---
# --- MANDATORY (entity base) ---
name: ""
type: mission
exists: false           # true = real/canon in the world; false = homebrew draft not yet canonized.
state: draft | planned | active | on-hiatus | completed | failed | abandoned
tags:
  - mission/
  - act/

# --- MANDATORY (mission) ---
act: "[[Act Name]]"
objective: ""
hook: ""

# --- OPTIONAL (entity base) ---
relates_to:
  - "[[Entity Name]] (relationship)"
importance: critical | major | minor | background
active: true | false    # Currently in play; false = retired or dormant, importance unchanged.
last_updated: "[[Session NN - Title]]"
description: ""

# --- OPTIONAL (mission) ---
sessions:
  - "[[Session NN - Title]]"
locations:
  - "[[Location Name]]"
key_npcs:
  - "[[NPC Name]] (role)"
obstacles: []
success_consequences: ""
failure_consequences: ""
reward: ""

# --- HISTORIAN ONLY (mandatory when moved) ---
# outcome: completed | failed
# outcome_detail: ""      # What actually happened.
# sessions_played:
#   - "[[Session NN - Title]]"
---
```
<!-- end generated -->

### Notes

- Both `success_consequences` and `failure_consequences` should be filled in before a mission goes `active` — failure should matter, not just be a dead end.
- When resolved, move to `historian/missions/` and fill in the historian fields before archiving.
