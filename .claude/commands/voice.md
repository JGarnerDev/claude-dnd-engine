---
description: "Build a DM voice brief for an NPC, grounded in established canon."
argument-hint: "<npc name>"
---

Build a voice brief for an NPC — grounds new dialogue and characterization in established canon.

**Arguments:**

- `<npc name>` — name of the NPC (required); fuzzy match against historian and data

---

## Behavior

Read-only by default. Output is a compact DM reference card for playing the NPC. The only write this command may perform is the Phase 6 voice cache (the `## Voice` section plus the `voice` and `voice_confirmed` fields), and only with DM approval.

---

## Phase 1 — Locate Entity

Search `historian/` then `data/` for the NPC by name. Check `aliases` field if exact match fails. If still not found:

```text
uv run scripts/semantic-search.py "<npc name>" --type character -k 3
```

Confirm match with DM if ambiguous.

---

## Phase 2 — Read Entity File

Read the NPC's full file. Extract:

- `personality`, `disposition`, `livelihood`
- Any dialogue or speech examples in the body
- Relationship notes from `relates_to`
- Current `state` and `location`
- `voice`, `voice_confirmed`, and the `## Voice` section if present (`meta/voice.md` — read once). Its core is fixed for this brief; its now lines and `Said at the table` are the strongest evidence you have. If `voice_confirmed` is older than the latest played session the NPC appeared in, the now layer is stale: rebuild it from the sessions after the stamp in Phase 3 and say so in the brief.

---

## Phase 3 — Surface Past Appearances

Find sessions where this NPC appeared or was referenced:

```text
uv run scripts/semantic-search.py "<npc name> <personality summary>" --source historian -k 5
```

For results with score > 0.40, read the NPC quick-reference section of those session files for established voice notes. Those notes are what was *planned*; where they disagree with the file's `Said at the table` lines, the played lines win.

---

## Phase 4 — Find Voice Parallels

Surface similar NPCs for texture reference — same archetype or disposition:

```text
uv run scripts/semantic-search.py "<personality summary>" --type character --source historian -k 4
```

Use as texture only. Do not copy voice patterns wholesale.

---

## Phase 5 — Synthesize Voice Brief

```markdown
## Voice Brief: [Name]

**Speaks like:** [cadence, vocabulary, register — 1–2 sentences]
**Wants right now:** [current motivation given campaign state]
**Knows:** [information they can reveal — bullet list]
**Won't say:** [what they conceal or deflect]
**Tell:** [one physical or verbal habit that signals lying, nervousness, or interest]
**Callback:** [one specific past moment to reference if the party brings it up]
```

Keep each field to one line or a short bullet list. This is a DM reference card, not prose.

---

## Phase 6 — Offer to Cache the Brief

**If the file already has a layered `## Voice` section,** skip the offer. Phase 2 read it and this brief built on it. List any drift between the section and newer session evidence, and leave it for `/recap` to resolve. A brief never edits an existing voice.

**If it has a legacy `## Voice`** (not in the `meta/voice.md` shape, such as a single line) **or none,** offer once:

> "Save this as [Name]'s `## Voice` section? Future /voice calls (and /session NPC quick-reference) become a single file read, and /recap keeps it current."

If yes: write the section at the end of the file (historian or data, wherever it lives) in the `meta/voice.md` shape. **Speaks like** becomes the `voice:` frontmatter line. **Tell** goes under Core, with a Signature and a Never where the evidence supports them; leave out any it does not. **Callback** goes under `Said at the table` only if it quotes words actually spoken. **Wants right now** becomes a now line only if it cites its session. A legacy section is replaced, and its old wording is kept under `### Arc` as `before S{nn}: <old text>`. Set `voice_confirmed: {latest played session}`. Leave **Knows** and **Won't say** in chat; they go stale too fast to store. If no: leave the brief in chat only.
