Build a voice brief for an NPC — grounds new dialogue and characterization in established canon.

**Arguments:**
- `<npc name>` — name of the NPC (required); fuzzy match against historian and data

---

## Behavior

Read-only. No generation, no file writes. Output is a compact DM reference card for playing the NPC.

---

## Phase 1 — Locate Entity

Search `historian/` then `data/` for the NPC by name. Check `aliases` field if exact match fails. If still not found:

```powershell
.\scripts\semantic-search.ps1 -Query "<npc name>" -Type character -K 3
```

Confirm match with DM if ambiguous.

---

## Phase 2 — Read Entity File

Read the NPC's full file. Extract:
- `personality`, `disposition`, `livelihood`
- Any dialogue or speech examples in the body
- Relationship notes from `relates_to`
- Current `state` and `location`

---

## Phase 3 — Surface Past Appearances

Find sessions where this NPC appeared or was referenced:

```powershell
.\scripts\semantic-search.ps1 -Query "<npc name> <personality summary>" -Source historian -K 5
```

For results with score > 0.40, read the NPC quick-reference section of those session files for established voice notes.

---

## Phase 4 — Find Voice Parallels

Surface similar NPCs for texture reference — same archetype or disposition:

```powershell
.\scripts\semantic-search.ps1 -Query "<personality summary>" -Type character -Source historian -K 4
```

Use as texture only. Do not copy voice patterns wholesale.

---

## Phase 5 — Synthesize Voice Brief

```
## Voice Brief: [Name]

**Speaks like:** [cadence, vocabulary, register — 1–2 sentences]
**Wants right now:** [current motivation given campaign state]
**Knows:** [information they can reveal — bullet list]
**Won't say:** [what they conceal or deflect]
**Tell:** [one physical or verbal habit that signals lying, nervousness, or interest]
**Callback:** [one specific past moment to reference if the party brings it up]
```

Keep each field to one line or a short bullet list. This is a DM reference card, not prose.
