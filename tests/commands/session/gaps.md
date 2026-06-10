# Gaps: /session

Findings log. Static = from reading the command doc. Run = from an executed audit (cite run log). Mark resolved with date + commit when the command doc is fixed.

## Static review — 2026-06-09

**All 10 resolved 2026-06-09** — command doc rewritten (uncommitted as of writing). Resolution notes inline per item. Verify fixes hold on first run audit.

### S1 — Phase 1 ignores `session-brief.ps1` (severity: high, token)

Root CLAUDE.md mandates `session-brief.ps1` at start of every `/session`; the command doc instead lists 4 manual read steps (campaign, acts, missions, last session) that duplicate the script's output. A literal follower does both or skips the script. Fix: Phase 1 step 1 becomes "run `session-brief.ps1`", manual reads only for what it doesn't emit.

*RESOLVED: Phase 1 Step 1 runs the script; manual reads cut to mission body, `new_entities`, campaign body, lore frontmatter.*

### S2 — Nine meta full-body reads every run (severity: high, token)

Phase 1 step 6 requires 9 `meta/` files read in full on every run, even CONTINUATION runs mid-arc where most (e.g. `new-campaign-setup` adjacents, blank player files) change nothing. No script summarizes them. Candidates: (a) a `session-meta-brief.ps1` that extracts the load-bearing fields, (b) tiering — difficulty/rewards/mysteries always, others only on TRANSITION or when scenes touch their domain.

*RESOLVED via (b): always-tier = difficulty/worldbuilding/mysteries; conditional with stated triggers = rewards, players, party-relationships, campaign-design-preferences, worldbuilding-approach, references.*

### S3 — No `party-status.ps1` call (severity: medium, token)

Orientation section requires party state (afflictions, resources, mood) but the doc never invokes `party-status.ps1`. Likely outcome: opening PC files manually or pulling stale facts from the last recap.

*RESOLVED: Phase 5 pre-step runs `party-status.ps1`.*

### S4 — `/voice` per canon NPC is unbounded (severity: medium, token)

Phase 5 NPC Quick-Reference mandates running `/voice <name>` for every NPC with historian canon. A 5-NPC session triggers 5 full sub-command runs, each with its own read scope. No cap, no "reuse if voiced recently". Candidate: cap at 2–3 key speakers; minor NPCs get voice from frontmatter/description only.

*RESOLVED: cap adopted as written.*

### S5 — Phase 3B Step 2 manual frontmatter sweep (severity: medium, token)

"read frontmatter only ... across `data/`" duplicates `free-entities.ps1`. Doc should name the script.

*RESOLVED: Phase 3B Step 2 names the script; manual sweep explicitly forbidden.*

### S6 — No index staleness check (severity: low, correctness)

Root CLAUDE.md requires the `.index-built` staleness check at session start; command doc never mentions it, yet Phase 1 and 3B depend on semantic search. Stale index silently degrades callback quality.

*RESOLVED: Phase 1 Step 2 is the `.index-built` staleness check; prompt-only, never auto-rebuild.*

### S7 — Recap format not referenced (severity: low, consistency)

Phase 1 "state aloud" omits the mandatory two-part recap format (root CLAUDE.md, Recap Format section). Risk of drift to ad-hoc summaries.

*RESOLVED: Phase 1 Step 5 cites the two-part recap format from root CLAUDE.md.*

### S8 — Elaboration Check placement forces rework (severity: low, structure)

Body structure orders Scenes *before* Elaboration Check, but elaboration decisions ("do not fill gaps silently... resolve before NPC Quick-Reference") can invalidate scene content already written. Either move the check before Scenes or scope it to detail layers only.

*RESOLVED: Elaboration Check moved into Phase 4, before scene generation; Approaching Entities stays a non-blocking output section.*

### S9 — Cameo questionnaire scan is body-read (severity: low, token)

"A file is filled if any `> ` answer lines contain actual text" requires opening every questionnaire body every run. Violates frontmatter-first; cheap fix is a `filled: true/false` frontmatter flag set at ingestion, or a one-line script.

*RESOLVED (different fix): questionnaires carry `CLAUDE-INGEST` comment blocks, not YAML frontmatter, so no flag added — detection is one grep (`^> \S`, files-with-matches) intersected with cameo files.*

### S10 — Interaction count unbounded in Phase 4/5 (severity: low, interaction)

Phase 4 allows "one more question" plus Elaboration Check questions plus free-entity stops — a worst case of 4+ separate wait-for-DM round trips per run. Doc never says to batch. Spec requires batching (checkpoint 4); doc should too.

*RESOLVED: Phase 4 batches scoping + elaboration + the one hook-specific question into a single message, wait once; splitting forbidden. Spec checkpoints merged 6 → 5.*

## Run findings

*(none yet — first audit run pending)*
