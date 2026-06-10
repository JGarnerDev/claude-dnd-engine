Plan the next session.

**Arguments (optional):**
- `--depth narrated` — key scenes include read-aloud blockquote narration
- `--depth notes` — DM-facing bullet notes only
- `--scope inline` — full session in a single file
- `--scope linked` — session folder; encounter files live alongside the main file

If `--depth` or `--scope` are not provided, ask in Phase 4.

---

## Phase 1 — Orient

Do not generate any content yet.

**Step 1 — Run the dashboard script:**

```powershell
.\scripts\session-brief.ps1
```

It reports: next session number, campaign/act/mission names and states, last session summary + cliffhanger + played date, and the party roster with afflictions. Do not manually re-read anything it already covers.

**Step 2 — Index staleness check.** Read `vector-index/.index-built` (line 1: ISO timestamp, line 2: commit SHA), then run `git log --oneline <sha>..HEAD -- data/ historian/ scheduler/`. If any commits appear, flag: *"Semantic index stale since `<sha[:7]>` — run `py -3.10 scripts\index-entities.py`."* If the file is missing, prompt to build. Never rebuild automatically — the searches in this command degrade silently on a stale index, so the DM should decide.

**Step 3 — Targeted manual reads** (only what the script doesn't cover):

1. Active mission file body (`state: active` in `scheduler/missions/`) — objective, hook, obstacles, last_updated session
2. Last session file — `new_entities` and recap detail (cliffhanger and summary already came from the script)
3. `scheduler/campaign.md` body — tone, central conflict, themes
4. `data/lore/` — frontmatter scan only; open a lore body only when that domain is directly relevant to this session; treat `state: draft` sections as open questions, not settled canon

**Step 4 — Meta reference files.** Each is read **once per run**, never re-read per sub-task. Tiered — do not read a conditional file unless its trigger applies:

Always:
- `meta/difficulty.md` — encounter tiers, DC ranges, session mix
- `meta/worldbuilding.md` — tone, themes, setting pillars, what to avoid
- `meta/mysteries.md` — load-bearing unknowns; do not accidentally answer these in session content

Conditional:
- `meta/rewards.md` — only if the session will include treasure, magic items, or a level-up
- `meta/players/*.md` (excluding `player-template.md`) — TRANSITION mode, roleplay-heavy shape, or the hook centers on a specific player's PC
- `meta/party-relationships.md` — only when planning scenes with PC-to-PC stakes
- `meta/campaign-design-preferences.md` — TRANSITION mode, or a CONTINUATION session that introduces a new antagonist, event, or mission element; note which items have `Deployed: —` (not yet used)
- `meta/worldbuilding-approach.md` — only when the session creates new world detail (new locations, factions, lore-adjacent content)
- `meta/references.md` — only when an external D&D stat lookup is needed

**Step 5 — State the orientation aloud**, using the two-part recap format from root CLAUDE.md (narrative prose first, then TL;DR bullets):
- What the current act is (or "no act defined yet")
- What active mission(s) exist (or "no active mission")
- What the last session ended on (cliffhanger or final recap note)
- What the next session number will be

**Step 6 — Callback search** on the cliffhanger or active mission hook, to surface historian entities the story may be ready to revisit:

```powershell
.\scripts\semantic-search.ps1 -Query "<cliffhanger or mission hook text>" -Source historian -K 5
```

Note any results with score > 0.35 — these are callback candidates. Do not force them into the plan; use only if they fit naturally.

---

## Phase 2 — Mode Detection

**CONTINUATION mode** — use when: an active mission exists in `scheduler/missions/` AND the last session's cliffhanger is unresolved (story is mid-arc).

**TRANSITION mode** — use when: no active mission exists, OR the last session reached a natural conclusion (mission completed, major beat landed, party at a resting point between arcs).

If the mode is ambiguous, default to TRANSITION and say so — the DM can redirect.

---

## Phase 3A — CONTINUATION

The session advances the active mission. Proceed directly to Phase 4.

Keep the following in scope:
- Active mission: objective, hook, listed obstacles
- Last session cliffhanger
- Key NPCs and locations already established in the mission or recent sessions
- Any unresolved `new_entities` from the last session (things invented at the table that should be revisited)

---

## Phase 3B — TRANSITION (3 hooks)

When there is no active mission or the arc has reached a conclusion, surface options from three sources. Do not generate a full session plan yet — only brief hooks.

**Step 1 — Scan historian/ for unresolved threads**

Run `/threads` for a full standalone view, or inline the same logic here:

Read frontmatter only (state, description) across `historian/characters/`, `historian/locations/`, and `historian/sessions/`. Look for:
- NPCs with `state: missing`, `state: imprisoned`, or `state: transformed`
- PC afflictions noted in historian PC files
- Stranded or abandoned entities called out in session recaps (e.g. Rose and Thorn)
- Cliffhangers from any recent session that were never resolved

**Step 2 — Find free entities**

First identify the active campaign from `scheduler/campaign.md`. When surfacing entities, exclude historian entities tagged `campaign: strahd` unless the active campaign is Strahd or the DM explicitly requests a crossover. Untagged data entities are campaign-agnostic and always eligible.

Run semantic search using the themes of the current session direction (from cliffhanger, mission hook, or chosen thread):

```powershell
.\scripts\semantic-search.ps1 -Query "<themes from cliffhanger or direction>" -Exists false -K 8
```

Then surface importance-flagged entities the semantic search may not rank highly:

```powershell
.\scripts\free-entities.ps1
```

Filter its output to `importance: major` or `critical` with `active: true`. Combine both lists — semantic results for thematic fit, script output for importance-flagged entities. Do not manually sweep `data/` frontmatter; the script replaces that.

**Step 3 — Check meta preferences**

Use `meta/worldbuilding.md` (already read in Phase 1) and read any filled `meta/players/*.md` files (excluding the template) if not already read. Note which sections are populated and which are blank. If all are blank, fall back to the campaign's `themes` and `tone` from `scheduler/campaign.md`.

Also check `meta/campaign-design-preferences.md` (conditional-tier file — TRANSITION is its trigger): identify items with `Deployed: —` that haven't fired yet. If any are aging (many sessions have passed without use), flag the most relevant one as a candidate for Option C. Do not force a preference into a hook — only suggest it if the current story state creates a plausible opening.

**Step 4 — Present 3 hooks**

Present exactly three options. Label their source so the DM knows where each came from. Keep each hook to 2–4 sentences — enough to understand the direction, not a full plan.

Format:

> **Option A — [Short title]** *(from: historian/unresolved)*
> [Hook text]
>
> **Option B — [Short title]** *(from: data/free entity)*
> [Hook text]
>
> **Option C — [Short title]** *(from: campaign themes / meta preferences)*
> [Hook text]

Then ask: *"Which direction? You can also give me a different hook entirely."*

Wait for the DM's response before continuing.

---

## Phase 4 — Scoping + Elaboration (one message)

After the hook is chosen (or confirmed in CONTINUATION mode), do the **Elaboration Check first**, then ask all questions in a single batched message.

**Elaboration Check (before generating anything):** identify the session's likely key NPCs and locations from the hook, mission, and callback candidates. Check every key `./data` and `./historian` entity against the elaboration protocol in `data/CLAUDE.md`. Historian entities can be just as sparse as data entities — canonized does not mean ready for detailed play. **Do not fill gaps silently.** Sparse key entities are flagged at the **Immediate** tier and resolved via the batched questions below — before any scene is written, so elaboration answers can't invalidate finished scenes.

**Batched questions — one message, wait once:**

1. **Session length** — Short (~1.5 hr), Standard (~2 hr), or Long (~2.5 hr+)?
2. **Session shape** — Roleplay-heavy, combat-heavy, exploration-heavy, or balanced?
3. **Depth** — (only if `--depth` not provided) `narrated` (read-aloud blockquotes for key moments) or `notes` (DM bullet notes only)?
4. **Scope** — (only if `--scope` not provided) `inline` (single file) or `linked` (folder with separate encounter files)?
5. **Elaboration decisions** — for each sparse key entity: draft the elaboration, or leave it to the DM?
6. At most **one** hook-specific question, only if something genuinely warrants it (e.g. "Is the party expected to find Strahd's location this session, or is that still a mystery to preserve?").

Do not ask questions that the established context already answers. Do not split these into multiple messages.

Wait for the DM's response before continuing.

---

## Phase 5 — Generate Session Plan

**Pre-step:** run the party dashboard for the Orientation paragraph and encounter balance:

```powershell
.\scripts\party-status.ps1
```

Using all context gathered, produce a session plan in chat.

**Frontmatter fields to populate:**
- **Session name** — propose a name (the DM can change it)
- **Key locations** — use `[[wiki-link]]` to entities in `historian/locations/` or `data/locations/` only; not factions (e.g., `[[Domain of Barovia]]` is a faction; the region is `[[Barovia]]`)
- **Key NPCs** — note if free (`data/`) or canon (`historian/`)
- **Encounters** — list planned encounters; note difficulty tier if relevant
- **Loose threads** — unresolved promises, player action items, or dangling beats from prior sessions
- **Opening scene** — where the party is, what's immediately in front of them
- **Closing hook** — the cliffhanger or question that sends players home wanting more

**Body structure — produce the following sections in order:**

### Orientation
- One-paragraph party state: current location, known afflictions, resources expended, mood/tone coming out of the last session (sourced from `party-status.ps1` and the last session recap)
- Bullet list: any unresolved `new_entities` from the last session that need acknowledgment

### Scenes
One `#### Scene N — [Title]` block per beat. Scale count to session length (Short: 3–4, Standard: 4–6, Long: 6–8).

Each scene block contains:
- **Trigger** — what causes this scene to begin (party action, NPC move, time passing)
- **Location** — `[[wiki-link]]`; one-line description of what the space looks/feels like
- **NPCs present** — name, one-line goal for this scene, one-line voice note (how they talk/carry themselves)
- **Beats** — ordered bullet list of what happens; branch points noted inline (e.g., *"if party refuses → …"*)
- **Narration** — if `depth: narrated`, include a `> *"..."*` blockquote for the key moment of the scene; if `depth: notes`, omit
- **Transition** — one line on what triggers the move to the next scene or a likely detour

If `scope: linked`, replace the full encounter detail with a one-line reference: `→ see [[encounter-{slug}]]` and note that the encounter file will be written separately.

### NPC Quick-Reference
One entry per key NPC appearing this session. For canon NPCs, run `/voice <name>` first — **capped at the 2–3 NPCs carrying the most dialogue this session**. Remaining canon NPCs get voice notes from their file's frontmatter and description only; do not run `/voice` for every NPC. Never invent fresh voice from scratch where history exists.

- **Name** — `[[wiki-link]]`
- **Motivation** — what they want right now
- **Knows** — bullet list of information they can reveal
- **Voice** — one sentence on speech pattern, demeanor, tells

### Contingencies
2–3 likely detours the party might take. For each: what triggers it, how to handle it without derailing the session, how to redirect.

### Closing
- How to land the closing hook (specific DM move or line)
- What to leave unresolved going into the next session

### Approaching Entities

Scan the active mission's `obstacles` field for entity references not already covered by the Phase 4 Elaboration Check. For each sparse entity named there that is **not** key this session but plausibly key within 1–2 sessions:

- Flag it as **Approaching** (light elaboration tier — see `data/CLAUDE.md`): *"[Name] appears in the mission's obstacles and is sparse. Consider a light sketch (personality + motivation) before they become immediate."*

These are lead-time flags, never blockers — the DM can defer or delegate at any point. Omit the section if nothing qualifies.

### Cameo Candidates

Detect filled questionnaires with a **single search, not per-file reads**: grep `questionnaires/` for the pattern `^> \S` (answer lines with actual text), files-with-matches mode. Intersect the hits with cameo questionnaires (`entity_type: player` in the `CLAUDE-INGEST` block, or `-cameo` filenames).

For each filled cameo questionnaire, compare:
- `preferred_alignment` against the role and disposition of NPCs in this session
- `preferred_archetypes` against NPC archetypes and scene types

Surface up to 3 strong matches as a short block:

> **Cameo Candidates**
> - **{Name}** — fits [{NPC or role}] ({one-line reason based on their stated preferences})

Omit this block entirely if no questionnaires are filled. Do not force matches — only surface genuinely good fits. If nothing fits well, skip silently.

---

**Apply the free entity rule:** if the session requires an entity not in `data/` or `historian/`, **stop and flag it** rather than inventing one. Ask the DM whether to create it or proceed differently.

**Deployment tracking:** if a preference item from `meta/campaign-design-preferences.md` is used in this session, note it in the session plan. After the session is played and canonized via `/recap`, update that item's `Deployed:` line with a wikilink to the session file.

For non-standard encounter types (chase, puzzle, trade negotiation, performance, mini-game), check `meta/mechanics/` for an applicable mechanic file before writing the scene.

If meta preference files are blank, note: *"Group preferences and worldbuilding details are not yet filled in — session is based on campaign tone and themes only. Consider filling in meta/ files for more tailored generation."*

---

## Phase 6 — Offer to Write

After presenting the plan, ask:

> "Should I save this as a session file with `state: draft`?"

If yes:
1. Read `meta/schemas/session.md` to confirm the frontmatter template
2. Determine path based on scope:
   - `scope: inline` → write `scheduler/sessions/session-{nn}-{name}.md`
   - `scope: linked` → create folder `scheduler/sessions/session-{nn}-{name}/`; write main file as `scheduler/sessions/session-{nn}-{name}/session-{nn}-{name}.md`; write each encounter as `scheduler/sessions/session-{nn}-{name}/encounter-{slug}.md`
3. Populate all mandatory frontmatter fields from the plan above
4. Write the full body (Orientation, Scenes, NPC Quick-Reference, Contingencies, Closing) into the main file
5. Leave historian-only fields commented out (they are filled after play)

If no: leave the plan in chat for the DM to use or adapt manually.
