Guide a campaign season-swap — pausing the current campaign and (re)activating the other. Campaigns alternate like TV seasons (Strahd ↔ homebrew); the party persists across both worlds and shifts between them via a shallow in-narrative device. A swap is never final: the paused campaign resumes in a later season.

Do not begin this flow until the DM explicitly confirms the swap is happening. Ask one clarifying question at a time. Do not write anything without confirmation at each step.

**Engine role by campaign** (affects what this flow scaffolds):

- `strahd` — record-only. Kellan plans Strahd sessions outside this repo; here it is `/recap` → historian only. Swapping *into* Strahd means no scheduler planning artifacts to build.
- `homebrew` — full engine. The active DM plans here (`/session`, scheduler acts/missions) plus records. Swapping *into* homebrew means scaffolding/reactivating its scheduler layer.

---

## Phase 1 — Confirm Direction

Ask:

1. "Confirmed — swapping now, or just planning ahead?"
2. "Which way — pausing Strahd to start/resume homebrew, or pausing homebrew to return to Strahd?"
3. If entering a homebrew world for the first time: "What's the name of the new world? (Placeholder is fine.)"

Wait for answers before continuing.

---

## Phase 2 — Party and Carry-Over

The party of characters **persists by default** — the roster carries across every swap. Do not retag or move PCs/companions unless the DM explicitly says one stays behind, dies, or leaves the party in the narrative.

Read `historian/characters/pcs/` — list PCs and companions so the DM can confirm the roster. Ask:

> "Same party carries over, yes? Anyone staying behind, dying in the swap, or being left in the world we're pausing?"

Then ask about non-party carry-over:

> "Any NPCs, items, or factions from the paused world explicitly coming with the party? List them and I'll update their tags."

Wait for the DM's response. Note party exceptions and any entities crossing over.

---

## Phase 3 — Update Tags

For the party PCs and companions: leave their tags alone (they belong to no single world) unless Phase 2 flagged an exception.

For each non-party entity confirmed as crossing over:

- Set `campaign:` to the world being entered (or remove the tag entirely if it is genuinely campaign-agnostic now)

For each entity staying behind:

- Leave its existing `campaign:` tag unchanged

Show the DM the list of changes before writing.

---

## Phase 4 — Swap Campaign States

Campaign files live in `scheduler/campaign/` — one per campaign, exactly one `state: active` at a time. Read both the outgoing file (`state: active`) and the incoming file. Propose:

- **Outgoing campaign** → `state: paused` and `active: false`. **Leave it in `scheduler/campaign/`** — it resumes next season; do NOT move it to `historian/`. (Only move a campaign to `historian/campaign/` if the group declares it permanently, narratively concluded — a rare event, not a routine swap.)
- **Incoming campaign** → `state: active` and `active: true` (both fields must flip — scripts key on `active`, but `state` must not contradict it). If it was `paused` from a prior season, this simply resumes it.
- If entering a homebrew world for the first time: set `description` → brief premise (ask DM for 1–2 sentences), and `tone`/`themes` → ask if new or carried. **Tone reset:** before writing these, read `meta/worldbuilding.md`'s "What to Avoid" list — gothic horror must not bleed into a homebrew world. Flag any carry-over that violates an avoid-list item.

Do not write until the DM approves the proposed content.

---

## Phase 5 — Scheduler Layer

The scheduler planning layer (`scheduler/acts/`, `scheduler/missions/`, `scheduler/sessions/`) only ever holds artifacts for the **homebrew** campaign — Strahd is planned outside this repo.

- **Swapping into Strahd:** nothing to scaffold. If homebrew acts/missions/sessions are sitting in the scheduler mid-arc, confirm with the DM whether to leave them in place (they resume when homebrew returns) — do not delete them.
- **Swapping into homebrew (first time):** create a new Act 1 placeholder in `scheduler/acts/` with fields for the DM to fill (`central_conflict: TBD`, `goal: TBD`, `opening_state: TBD`, `closing_state: TBD`). Ask: "Create the Act 1 scaffold now, or wait until you're ready to fill it in?"
- **Swapping into homebrew (resuming):** its prior acts/missions should already be in the scheduler — confirm they're intact rather than re-scaffolding.

---

## Phase 6 — Index and Wrap Up

After all file changes are confirmed and written:

1. Remind the DM to rebuild the semantic index: `uv run scripts/index-entities.py`
2. Summarize what changed: campaign states swapped, any entities retagged, scheduler layer scaffolded/left-in-place
3. Note any entities the DM flagged as potential crossovers but left unresolved — list them as open items

---

**Throughout:** Never write silently. Each phase ends with a confirmation before the next begins. The DM may pause mid-swap and resume later — that's fine.
