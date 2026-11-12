---
description: "Plan the next homebrew session from campaign state, threads, and the scheduler: a beat spine the DM edits first, then the full plan."
argument-hint: "[--depth narrated|notes] [--scope inline|linked]"
---

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

```text
uv run scripts/session-brief.py
```

It reports: next session number (with a milestone flag every 5th session — worth marking at the table), campaign/act/mission names and states, last session summary + cliffhanger + played date, Rest Clock state, Current State stamp staleness, the party roster with afflictions, and the design-preference drought counter (undeployed/seeded wishlist items), and the spotlight readout (lifetime balance, recent trend, overdue PC, missing-hooks flags — from `spotlight-balance.py`; says "insufficient history" before 3 sessions), search-index staleness, and active cameo players. Do not manually re-read anything it already covers.

**Step 2 — Index staleness.** If the brief printed `SEARCH INDEX STALE` or `NEVER BUILT`, pass that line to the DM. Never rebuild automatically — the searches in this command degrade silently on a stale index, so the DM should decide.

**Step 3 — Targeted manual reads** (only what the script doesn't cover):

1. Active mission file body (`state: active` in `scheduler/missions/`) — objective, hook, obstacles, last_updated session
2. Last session file — `new_entities` and recap detail (cliffhanger and summary already came from the script)
3. Active campaign file body (`state: active` in `scheduler/campaign/`) — tone, central conflict, themes
4. `data/lore/` — frontmatter scan only; open a lore body only when that domain is directly relevant to this session; treat `state: draft` sections as open questions, not settled canon
5. Table feedback — one grep, no file reads: `grep -A2 "table_notes:" historian/sessions/*.md | tail -20` (last 2–3 sessions' worth). What landed and what fell flat at recent sessions should bias scene design — more of what the table loved, less of what dragged. This is also the live check on the player-agency principle: if recent notes suggest choices aren't landing as consequential, weight the plan toward visible consequences of past party decisions.
6. Recent party choices — one grep, no file reads: `grep -rA6 "^choices:" historian/sessions/ | tail -30`. These are the decisions the world should remember. Pick at least one whose consequence this session can show (see `meta/player-agency.md` → Remember what they chose). An empty result is normal for sessions recorded before the field existed.

**Step 4 — Meta reference files.** Each is read **once per run**, never re-read per sub-task. Tiered — do not read a conditional file unless its trigger applies:

Always:

- `meta/difficulty.md` — two-axis difficulty spectrum (attrition × lethality), Non-Combat Stakes, DC ranges. Note the frontmatter defaults here, but **do not resolve tiers yet** — the picks happen in Phase 4, after the story hook is chosen, so the difficulty answer can push back on the story (and vice versa). Exception: tiers given in the DM's prompt are settled immediately. The combat axes apply only if the session ends up planning combat — for a roleplay-only shape they sit inert and Non-Combat Stakes is the operative difficulty guidance.
- `meta/worldbuilding.md` — tone, themes, setting pillars, what to avoid
- `meta/mysteries.md` — load-bearing unknowns; do not accidentally answer these in session content
- `meta/player-agency.md` — what counts as a real choice, how many a session needs, and how to mark them in the plan

Conditional:

- `meta/rewards.md` — only if the session will include treasure, magic items, or a level-up. If it draws on `meta/loot-options/`, name only `status: confirmed` items in the plan, and refer to drafts by character and slot ("a Common from Dip's folder")
- `meta/players/*.md` (excluding `player-template.md`) — TRANSITION mode, roleplay-heavy shape, or the hook centers on a specific player's PC
- `meta/party-relationships.md` — only when planning scenes with PC-to-PC stakes
- `meta/campaign-design-preferences.md` — TRANSITION mode, or a CONTINUATION session that introduces a new antagonist, event, or mission element; note which items have `Deployed: —` (not yet used)
- `meta/worldbuilding-approach.md` — only when the session creates new world detail (new locations, factions, lore-adjacent content)
- `meta/literary-devices.md` — only when constructing hooks or scenes (Phase 3 onward); a palette of devices (reusable, `Last used:`) and twists (one-shot, `Deployed:`); both can carry pending `Seeded:` lines. Entries are scale-tagged (`scene`–`campaign`) — suggest at most one per session, never force, respect scale
- `meta/references.md` — only when an external D&D stat lookup is needed

**Step 5 — State the orientation aloud**, using the two-part recap format from root CLAUDE.md (narrative prose first, then TL;DR bullets):

- Party level and size (from PC frontmatter `level` fields — `party-status.py` or a quick frontmatter scan) — ask the DM to confirm or correct; the confirmed level feeds the RTD math in `meta/difficulty.md`. If any PC's `level_confirmed` is older than the last played session number (party-status flags this as LEVEL STALE), call it out explicitly — it means a `/recap` skipped the level question and a level-up may have been missed
- Rest Clock state (from the session brief): in-world time now, rounds and short rests since the last long rest, and whether a long rest is currently available. If the brief shows REST CLOCK STALE or NOT INITIALIZED, reconstruct it with the DM now — three questions ("what's the in-world date/time? when did they last long rest? roughly how many rounds since?"), write the answers back to the campaign file's `### Rest Clock` block with the current stamp, then continue
- Long-rest availability (`meta/difficulty.md` → Long Rest Rules): compute from the clock — a long rest is offerable only if ≥24 in-world hours have passed since the last one started, the party can reach a safe spot for 8 uninterrupted hours, and no PC is at 0 HP. State this plainly ("party long-rested ~14h ago — no fresh reset available this session without 10h more in-world") so it shapes pacing before any beats are written
- Campaign trackers (homebrew): for each `scheduler/campaign/_*.md` file with an `(as of: Session NN)` header, read its `## Engine` section and state its current state in one line. If its stamp is older than the last played session, say so and reconstruct with the DM, as for the Rest Clock. Do what its `## Engine` section says `/session` checks
- What the current act is (or "no act defined yet")
- What active mission(s) exist (or "no active mission")
- What the last session ended on (cliffhanger or final recap note)
- What the next session number will be
- Spotlight state (from the brief, once ≥3 sessions): lifetime balance and recent trend (whether the campaign owes spotlight or agnostic material this week), the overdue PC if any, and any PC flagged as missing hooks. State it as a lean, never a mandate — it biases hook selection in Phase 3, it doesn't dictate it

**Step 6 — Callback search** on the cliffhanger or active mission hook, to surface historian entities the story may be ready to revisit:

```text
uv run scripts/semantic-search.py "<cliffhanger or mission hook text>" --source historian -k 5
```

Note any results with score > 0.35 — these are callback candidates. Do not force them into the plan; use only if they fit naturally.

### Spitballs aimed at this act

Pull the loose ideas filed for the act being planned:

```text
uv run scripts/spitball-brief.py --target <act-slug>
uv run scripts/spitball-brief.py --target unassigned --campaign <campaign>
```

List what comes back as **candidates only** — a spitball is not canon and has not been approved (see `meta/spitball.md`). Surface them so the DM can reach for one; never adopt one into the plan unprompted. If an idea gets used, set its `state: used`.

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
- **Spotlight opportunities** (once ≥3 sessions): if the brief named an overdue PC and the trend owes spotlight, thread one of that PC's open/seeded `spotlight_hooks:` into the mission, preferring the hooks named in their PC arc's `next_step:` (`scheduler/arcs/`, `meta/pc-arcs.md`) — a 1–2 line opportunity, never a forced detour (same shaping as Phase 3B; lean agnostic instead if the trend says so)

---

## Phase 3B — TRANSITION (3 hooks)

When there is no active mission or the arc has reached a conclusion, surface options from three sources. Do not generate a full session plan yet — only brief hooks.

### Step 1 — Scan historian/ for unresolved threads

```text
uv run scripts/threads-brief.py
```

It lists historian entities in unresolved states, forgotten hostiles, and pending `Seeded:` lines, each tagged with its `[campaign: …]`. Drop entries tagged for the other season unless the DM asked for a crossover. Do not sweep historian frontmatter by hand. Add what the script can't see: PC afflictions (already in the Phase 1 brief) and unresolved cliffhangers from recent sessions.

### Step 2 — Find free entities

First identify the active campaign (`state: active` file in `scheduler/campaign/`). When surfacing entities, exclude historian entities tagged `campaign: strahd` unless the active campaign is Strahd or the DM explicitly requests a crossover. Untagged data entities are campaign-agnostic and always eligible.

Run semantic search using the themes of the current session direction (from cliffhanger, mission hook, or chosen thread):

```text
uv run scripts/semantic-search.py "<themes from cliffhanger or direction>" --exists false -k 8
```

Then surface importance-flagged entities the semantic search may not rank highly:

```text
uv run scripts/free-entities.py
```

Filter its output to `importance: major` or `critical` with `active: true`. Combine both lists — semantic results for thematic fit, script output for importance-flagged entities. Do not manually sweep `data/` frontmatter; the script replaces that.

### Step 3 — Check meta preferences

Use `meta/worldbuilding.md` (already read in Phase 1). Player files in `meta/players/` carry identity and character links only — no preference sections — so group-level desires come from `meta/campaign-design-preferences.md`; fall back to the `themes` and `tone` in the active campaign file (already read in Phase 1) for anything not covered.

Also check `meta/campaign-design-preferences.md` (conditional-tier file — TRANSITION is its trigger): identify items with `Deployed: —` that haven't fired yet. If any are aging (many sessions have passed without use), flag the most relevant one as a candidate for Option C. Do not force a preference into a hook — only suggest it if the current story state creates a plausible opening.

Also check `meta/literary-devices.md`: if the story state creates a natural opening for one device or twist, name it as a light suggestion alongside the hooks (e.g. *"this hook would support a cold open"* or *"the patron thread is ripe for The patron's true face"*). At most one suggestion; skip silently when nothing fits. Twist suggestions must pass the file's safety check (no contradiction with historian canon, no accidental answer to a `meta/mysteries.md` unknown). Avoid devices whose `Last used:` points at the immediately previous session.

**Spotlight hooks (once ≥3 sessions):** if the brief flagged an overdue, present, normal-appetite PC and the trend owes spotlight material, read that PC's open/seeded `spotlight_hooks:` and shape **Option C** around one that fits the story state. If the PC has a PC arc (`scheduler/arcs/`, rules in `meta/pc-arcs.md`), offer its `next_step:` hooks first, framed by its logline; when the brief flags the PC arc stale, say so in one line and fall back to choosing by fit. Surface 1–2 candidates, not a mandate. No hooks → surface *"[Name] has no spotlight hooks — needs a backstory pass"* instead. If the trend says lean agnostic, bias all three hooks toward `party-centric`/`world` and skip the spotlight push this session.

Respect the `Scale:` tags when picking:

- `scene`/`session`-scale entries are the default pool for session suggestions
- `mission`-scale entries fire only when this session creates or launches a mission — they shape the mission's structure, not one session's beats
- `arc`/`campaign`-scale entries fire only when the session sits at an act boundary or opens a new act; their cost is runway — committing means placing `Seeded:` breadcrumbs over multiple sessions before the payoff
- **Pending seeds outrank new suggestions:** before proposing anything new, check for `Seeded:` lines (devices and twists both) whose payoff this session could land or advance. Paying off a planted seed is almost always better than planting another.

### Step 4 — Present 3 hooks

Present exactly three options. Label their source so the DM knows where each came from. Keep each hook to 2–4 sentences — enough to understand the direction, not a full plan.

**Option B fallback:** if the free pool has no genuine fit for the active campaign (best semantic score below ~0.30 and no importance-flagged entity that matches tone), do not force a weak pool entity into Option B. Substitute a second historian thread or reference-catalog material and label it honestly (*from: historian/fallback — pool has no campaign fit*). Note the pool gap to the DM — it is meaningful signal.

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
2. **Session shape** — Roleplay-only (no combat planned), roleplay-heavy, combat-heavy, exploration-heavy, or balanced?
3. **Difficulty** — attrition and lethality tiers for the adventuring day (`meta/difficulty.md`; moot if shape is roleplay-only). Don't ask cold: propose tiers that fit the chosen hook, note the frontmatter defaults, and **flag any discrepancy** between what the story implies and what the defaults say (a boss confrontation on soft lethality, a dungeon crawl on light attrition, a hook that ignores a nearly-spent Rest Clock). The DM's answer settles it — and may reshape the story beats, not just the encounter math. Skip the question entirely only if the DM's prompt already specified tiers.
4. **Depth** — (only if `--depth` not provided) `narrated` (read-aloud blockquotes for key moments) or `notes` (DM bullet notes only)?
5. **Scope** — (only if `--scope` not provided) `inline` (single file) or `linked` (folder with separate encounter files)?
6. **Elaboration decisions** — for each sparse key entity: draft the elaboration, or leave it to the DM?
7. At most **one** hook-specific question, only if something genuinely warrants it (e.g. "Is the party expected to find Strahd's location this session, or is that still a mystery to preserve?").

Do not ask questions that the established context already answers. Do not split these into multiple messages.

Wait for the DM's response before continuing.

**Checkpoint 3b — draft approval (conditional).** If the DM delegates any elaboration drafting, the elaboration protocol (`data/CLAUDE.md`) requires drafts to come back for confirm/tweak/reject before any file is written. This is one additional wait — batch **all** delegated drafts (elaborations, new entities) into a single approval message. Do not send drafts one at a time.

---

## Phase 5 — Spine

Settle the shape before writing any prose. Prose written for a beat the DM later cuts is wasted, so the full plan waits until the DM has seen and edited the skeleton.

**Start from what exists.** If the act's flow graph set or an existing `_flow.md` already draws this session, build the spine from its nodes. Keep their ids and markers, and add only what the session still needs.

Present the spine in chat:

- **Header** — the proposed session name and the node id prefix `S<k>_`, where k is this session's place in the active act (Session 30 is the act's second session, so its ids start `S2_`)
- **Scenes** — `Scene N — Title`, then the scene's trigger in one line. Scale the scene count to session length (Short: 3–4, Standard: 4–6, Long: 6–8)
- **Beats** — one numbered line per beat under its scene: `<n>. S<k>_SLUG — what happens, in one line [kind]`. The kind is the beat's flow graph class: combat, social, decision, stake, seed, fail, or open for a beat waiting on a decision
- **Choices** — real choices start their line with `Choice (party):` or `Choice (<PC name>):` and give each option's cost on the same line
- **Fights** — one line under each combat beat: who and how many, the tier and XP band against the party, and the rounds expected. Stat blocks, kits and labels come in Phase 6
- **Choice check** — a closing line counting the choices against `meta/player-agency.md` → How often (about two or three party choices and one character choice, no run of more than about three reaction-only scenes), naming the beat that pays off a past choice from Phase 1 Step 3, item 6, and naming any spotlight beat. A `Choice (<PC name>):` should face that PC's growth or fall when they have a PC arc (read its Growth / Fall sections). If the spine falls short, add choices around its beats before showing it

Number the beats across the whole session, not per scene. **Numbers are stable:** a cut beat retires its number and an added beat takes the next free one, so the DM can answer by number from a phone across turns. The free entity rule applies already: flag any entity a beat needs that is not in `data/` or `historian/`.

End with: *"Edit by number (cut, change, add after), or say **go** to write the folder and flesh it. Say **chat** to flesh it here without writing files."*

Apply each round of edits, re-show only the changed and added lines, and wait again. Approving the spine is not committing it: every beat stays `[-]`, or `[?]` while it waits on a decision, until Phase 7.

---

## Phase 6 — Flesh

On **go** or **chat**, write the full plan for the approved spine.

**Prose:** read `meta/prose-style.md` once before writing. Draft every read-aloud box, NPC line, `Introduce:` block, `Private` message and Kit line to it, and run its **While drafting** checklist before the plan goes to disk. Phase 7's `/review` run checks it again in Pass 6.

**Pre-step:** run the party dashboard for the Orientation paragraph and encounter balance:

```text
uv run scripts/party-status.py
```

**The spine is fixed.** Each beat becomes a `#### S<k>_SLUG — <one line>` node heading under its `### Scene N — Title`, in spine order, so the session runner shows each beat as its own step on the scene page. Do not rename, reorder or add beats while fleshing. If fleshing shows a missing beat, or a review pass wants a new choice, list it in the Phase 7 report as a proposed spine change.

**Frontmatter fields to populate:**

- **Session name** — the name from the spine (the DM can change it)
- **Key locations** — use `[[wiki-link]]` to entities in `historian/locations/` or `data/locations/` only; not factions (e.g., `[[Domain of Barovia]]` is a faction; the region is `[[Barovia]]`)
- **Key NPCs** — note if free (`data/`) or canon (`historian/`)
- **Encounters** — for a roleplay-only shape, write `none planned` and stop; never invent encounters to satisfy a budget. Otherwise, list planned encounters sized to the resolved attrition tier (encounter count, round budget) and lethality tier (CR targets, tactics note per encounter); state the DMG XP band, then sanity-check with RTD and RTC math per `meta/difficulty.md`. RTC counts area spells per body they reach in the plan's own positions, and takes round 0 (readied actions, surprise, the party's planned opener) off monster HP first. The attrition budget belongs to the **adventuring day**, not the session: subtract the Rest Clock's rounds-since-long-rest from the tier budget and size to the remainder. If the remainder is near zero, the long rest is the content — plan it as a scene, or flag that pushing past budget bumps effective lethality a tier. Every combat-capable enemy and NPC in the plan gets a **`Kit (player-facing):`** line: one italic sentence of the armour and weapons the party can see, matching the stat block (studded leather for AC 15, no armour for the light ACs) and written without the creature's name, so it is safe to say before an introduction. Monsters with no gear get what they wear instead (a collar, a brand), or nothing. Each also gets a real name (the same rule as NPCs present below) and a **`Label (party-facing):`** line: the one-to-three-word name the party uses for it before they learn the real one. That name is the Roll20 token label and the `tokens.txt` role. A label names a job or what the party can see (*Drover*, *Tally-man*, *Roof Guard*), never a stat block (*Bandit Captain*) or a bare weapon (*Crossbow*). Labels are unique within an encounter. Number them only for true lookalikes (*Mastiff 1*, *Mastiff 2*). The Combatants at-a-glance list leads with the label: **Drover** — Varrick Tenn (human, Bandit Captain). Once the party learns a name, the DM renames the token at the table
- **Loose threads** — unresolved promises, player action items, or dangling beats from prior sessions
- **Opening scene** — where the party is, what's immediately in front of them
- **Closing hook** — the cliffhanger or question that sends players home wanting more

**Body structure — produce the following sections in order:**

### Orientation

- One-paragraph party state: current location, known afflictions, resources expended, mood/tone coming out of the last session (sourced from `party-status.py` and the last session recap)
- Bullet list: any unresolved `new_entities` from the last session that need acknowledgment

### Scenes

One `### Scene N — [Title]` block per spine scene, with the spine's beats as its `####` node headings.

**Travel legs:** if the plan moves the party overland or by water between known points, read `meta/settlements.md` → Travel Legs first. It sizes the leg, advances the in-world clock (which feeds the Rest Clock and the long-rest gate), and keeps stops to 1–3 geography-derived working labels.

Each scene block opens with the **scene header**, the bullets the session runner shows at the top of the scene page so the DM can take in the scene at a glance while running it. Write them first, in this order, before the first `####` node:

- **Summary:** 2–3 plain sentences on what the scene is for and how it usually goes. The DM reads this cold mid-game, so state the point outright
- **Where:** `[[wiki-link]]` plus one line on what the space looks and feels like. Keep long terrain and Roll20 rulings out of it and put them in their own setup bullet (e.g. `- **The ground:**`), which the runner folds under "Scene notes"
- **Cast:** everyone present, separated by ` · `, wikilinked when they have a file (`[[Sable Wren]] · [[Mara Tull]] · Dunny Marsh`). Goals and voice notes stay in the NPC Quick-Reference and in the nodes
- **Enemies:** the combat labels with real names in parentheses, separated by ` · ` (`Archer Rider (Ilsa Hask) · Wolf (Cinder)`), or `none`. Each must match a stat block in `## Combatants`, either by its real name in the block's `###` title or by its `Label (party-facing):` line. The runner turns them into compact rows that expand to the stat block
- **DCs:** every roll the scene asks for, separated by ` · `, each as `<check> <DC> — <what it's for>` (`Arcana 13 — read the charm · DEX 13 save — half damage`), or `none`. If a DC sits in a node, it goes here too
- **Tactics:** combat scenes only. One line: how the enemies fight and when they break
- **Time:** the scene's rough length (`~30 min`)
- **Trigger:** what causes this scene to begin (party action, NPC move, time passing)

Everyone the plan puts in front of the party gets a real name, walk-ons and named animals included, so anyone can be spoken to or talk to each other without the DM inventing a name at the table. The narration can still leave them unnamed until someone says it. Then, under the header and the node headings:

- **Introduce** — on the node where a character first appears to the party (NPCs, walk-ons, combatants, named animals, and anyone last seen but never heard), an `- **Introduce:** <Name>, <role>` bullet near the top of the node, with three nested bullets: **Look:** (what the party sees, including the token's look for walk-ons), **Sound:** (how they talk or what you hear), **Impression:** (the gut read in one line, observable, never a secret). Combatants lead with their label: `Introduce: Drover (Varrick Tenn)`. Once per character, at first appearance only. The session runner shows these at the top of the open step, so the DM reads them at the moment of introduction instead of hunting the scene notes. A deliberate silhouette (a figure the plan keeps faceless) gets none
- **Tokens** — on any node where someone with a token arrives, leaves or moves to another map, a `- **Tokens:**` bullet at the top of that node: which map (the session layout or a standing location map such as the Lioness `outdoors`/`indoors`), who goes on and roughly where, and who comes off. Cover every token, walk-ons and companions included, and clear the board when a scene empties. The runner gathers them behind the scene's Tokens toggle, numbered by step
- **Private** — whenever a beat gives one player something the rest of the table shouldn't hear (a secret roll, a vision, a whisper, a passive check, a note slipped to one PC, a choice made in private), write the message the DM sends, ready to copy. Put a `- **Private (<PC>):** <when it fires, and the roll>` bullet where it happens in the node, with one nested bullet per outcome: `- **<roll band, choice or situation>:** <the message>`. Cover every outcome the beat allows: each roll band, each option, the miss. When the player rolls in secret, the first bullet is `**Ask:**`, the roll to request. Each message stands on its own, because the DM sends one and never stacks two. It speaks to the player as "you", gives only what their character perceives (no conclusions drawn for them), uses party-facing names only, and leaves out DM notes and mechanics the player doesn't need. DM guidance about the moment (what it means, what not to name) stays in the beat outside the block. The runner shows the block at the top of the open step, with a Copy button on each outcome
- **Beats** — under each node heading, what happens; branch points noted inline (e.g., *"if party refuses → …"*). Real choices start their bullet with `Choice (party):` or `Choice (<PC name>):` and give each option's cost (`meta/player-agency.md` → Mark choices in the plan)
- **Narration** — if `depth: narrated`, include a `> *"..."*` blockquote for the key moment of the scene; if `depth: notes`, omit
- **Transition** — one line on what triggers the move to the next scene or a likely detour

**Labels set the voice.** The session runner shows each node as a prompt book, one block per bullet, tagged by its bold label: `Tokens:`, `Music:`, `Title card:` or `Set HP…:` is **Do** (the table or Roll20); a label with *read aloud*, *say* or *line(s)*, a bullet that opens on a quoted line, or a `>` quote is **Say**; `When …:`, `If …:`, `Once …:` or `After …:` is **Watch**; `Choice (…):` is **Choice**; anything else is for the DM. So give each bullet a short label ending in a colon, and put spoken lines in `*"…"*`. Backticked beat ids (`` `S2_ESCAPE` ``) and "Scene N" become links that open in the side panel.

**No provenance in scenes.** Who decided a beat and when (`(Jeff, 2026-10-07)`, `Engine, …; committed …`) goes in the Engine notes, not in scene prose. The runner strips any it finds, but a beat should read clean in the file too.

**Choices bullet:** the count was settled at the spine. List every choice point by node in a **Choices** bullet in the plan's Engine notes.

If `scope: linked`, replace the full encounter detail with a one-line reference: `→ see [[encounter-{slug}]]` and note that the encounter file will be written separately.

### NPC Quick-Reference

One entry per key NPC appearing this session. For canon NPCs, run `/voice <name>` first — **capped at the 2–3 NPCs carrying the most dialogue this session**. Skip `/voice` entirely for any NPC whose file was already read in full earlier in this run — derive the voice note from the in-context `personality`/`charm_hook` fields and body instead; a sub-command re-reading the same files adds nothing. Remaining canon NPCs get voice notes from their file's frontmatter and description only. Never invent fresh voice from scratch where history exists. Where a file has a `voice:` field, that line is the NPC's core voice (`meta/voice.md`): carry it into the voice note unchanged, and bend it only by the `## Voice` section's now lines when the file was read in full.

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

Use the brief's **CAMEO PLAYERS** block from Phase 1. Do not grep `questionnaires/` or open player files: the block lists every active cameo player (`role: cameo` in `meta/players/`) with availability, `preferred_alignment`, `preferred_archetypes` and description. It also flags filled cameo questionnaires that haven't been ingested yet. Those get ingested first (`entity-questionnaire.md` → Ingestion Mode), never matched raw.

For each cameo player, compare:

- `preferred_alignment` against the role and disposition of NPCs in this session
- `preferred_archetypes` against NPC archetypes and scene types
- with no stated preferences, the description (a player earmarked for a role is a match whenever that role is in this session)

Surface up to 3 strong matches as a short block:

> **Cameo Candidates**
>
> - **{Name}** — fits [{NPC or role}] ({one-line reason based on their stated preferences})

Omit this block if the brief printed no CAMEO PLAYERS section. Do not force matches — only surface genuinely good fits. If nothing fits well, skip silently.

---

**Apply the free entity rule:** if the session requires an entity not in `data/` or `historian/`, **stop and flag it** rather than inventing one. Ask the DM whether to create it or proceed differently.

**Deployment tracking:** if a preference item from `meta/campaign-design-preferences.md` or a device/twist from `meta/literary-devices.md` is used in this session, note it in the session plan. After the session is played and canonized via `/recap`, update that item's `Deployed:` line (or a device's `Last used:` line) with a wikilink to the session file.

For non-standard encounter types (chase, puzzle, trade negotiation, performance, mini-game), check `meta/mechanics/` for an applicable mechanic file before writing the scene.

If meta preference files are blank, note: *"Group preferences and worldbuilding details are not yet filled in — session is based on campaign tone and themes only. Consider filling in meta/ files for more tailored generation."*

---

### Writing

On **chat**: present the plan in chat, write no files, and stop after it. Phase 7 does not run.

On **go**:

1. Read `meta/schemas/session.md` to confirm the frontmatter template, then read `.claude/commands/review.md` and run its passes over the plan in its `/session` mode (applied directly, no findings list)
2. Determine path based on scope (filename = exact display name, matching canon precedent — e.g. `Session 14 The Road Remembers.md`):
   - Always create the folder `scheduler/sessions/Session {NN} {Name}/` and write the plan inside it as `Session {NN} {Name}.md`
   - `scope: linked` → also write each encounter into that folder as `Encounter {Name}.md`
   - Write `_flow.md`, the session's mermaid flow chart, in the same folder, drawn from the spine. Read `meta/flow-graphs.md` once for its conventions. Every node is `[-]` or `[?]` unless it came from an existing set already marked `[x]`, and the Commitment ledger says "nothing committed yet" when nothing is
3. Populate all mandatory frontmatter fields from the plan above
4. Write the full body (Orientation, Scenes, NPC Quick-Reference, Contingencies, Closing) into the main file
5. Leave historian-only fields commented out (they are filled after play)
6. **Spotlight commitment:** if the plan builds a scene on a PC's `spotlight_hooks:` entry, advance that entry's `status` from `open → seeded` on the PC file (it becomes `paid` later, at `/recap`, when the beat lands). Only seed hooks the plan actually commits to — surfacing one as an option in Phase 3 is not a commitment.

Do not paste the written plan into chat. The report is the `/review` close list (changes by scene, placeholders the DM must set, the new-canon list, the choice count), followed by Phase 7.

---

## Phase 7 — Commit pass

Walk the plan's `[-]` nodes against the commit gate (`meta/flow-graphs.md` → The commit gate, already read in Phase 6). Present, numbered:

- the beats that now meet the gate, each with the plan heading that backs it
- the beats that do not, each with what is missing
- any spine changes proposed in Phase 6

The DM approves by number ("all" is a fine answer). Flip only the approved beats to `[x]` in `_flow.md` and add their Commitment ledger lines. **Never flip a beat on your own judgment.** Approved spine changes go in as new `[-]` beats with their prose, and come back to this list.

Before the DM marks a draft ready to run (`state: draft → planned`), suggest `/review {NN} --ready`.
