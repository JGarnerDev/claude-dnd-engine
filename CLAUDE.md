# CLAUDE.md

This file provides operational guidance to Claude Code (claude.ai/code) for working with this campaign engine.

**For project overview, quick start, and user-facing documentation:** See [README.md](./README.md)

---

## Project

This engine generates D&D sessions by synthesizing creative material, campaign history, design principles, and session planning into coherent, playable content.

**Roles:** Kellan is the DM. Jeff and the other players contribute creative material as seeds for him. Generation rules for this split live in `meta/worldbuilding-approach.md`.

## Folder Roles

- `./data` — Creative source material (lore, worldbuilding, inspiration). Informational "food" that shapes story flavor and content, but is not authoritative.
- `./historian` — The authoritative record of the campaign. Past and current in-world facts (events, NPCs, locations, outcomes) live here. When `data` and `historian` conflict, `historian` wins.
- `./meta` — Principles, guidelines, and rules governing the campaign design (e.g. challenge/reward balance, pacing, tone). These govern *how* sessions are constructed, not *what* happened.
- `./scheduler` — The active story layer. Contains the campaign document, acts, missions, and session plans. Files here have `exists: false` and move to `historian/` when completed or played.

## Story Hierarchy

Documented in `scheduler/CLAUDE.md` — auto-loaded when working with scheduler files.

## Working Protocol

**Progressive disclosure:** This project uses subdirectory `CLAUDE.md` files to load domain rules only when relevant. Root CLAUDE.md stays lean. Do not load or re-derive subdirectory rules unless the task touches that domain. Trust that the right rules are in context when you need them.

**Reading** — read in this order, stopping as soon as the task is satisfied:

1. **Frontmatter only** — check `description`, `type`, `state`, `exists` before opening the body
2. **Body** — only if frontmatter doesn't answer the question
3. **Linked files** — follow `relates_to`, `known_by`, `resources`, etc. at most **1 hop** from the focal entity; go deeper only when explicitly required by the task

Before pulling any files for a generation or planning task, declare scope: what you intend to read and why. This keeps context bounded and gives the user a chance to redirect.

Meta files (`meta/worldbuilding-approach.md`, `meta/difficulty.md`, etc.) are read **once per task**, not re-read for each sub-task or entity created within it.

Scan commands (e.g. `/inventory`) read **frontmatter only** — never the body.

**Writing** — before editing any existing file, read its frontmatter to confirm `state` and `exists`. Never overwrite without knowing current state. Before creating new content, declare what you're creating and why — same discipline as declaring read scope.

## Placeholder Files

Blank or incomplete files (meta templates, draft lore, unfilled player files) are intentional placeholders the group fills later. When an audit or task surfaces one, the only required action is ensuring the `/todo` dashboard (`todo-dashboard.md`) carries an entry for filling it — as a backlog item with a note on what degrades until then. Don't flag them as defects, don't propose detection heuristics or workarounds to skip them, and don't score them as gaps beyond the todo entry.

## Entity Selection

Entity protocol (free entity rule, data transparency, contribution balance) documented in `data/CLAUDE.md` — auto-loaded when working with data files.

## Campaign Separation

This repo spans two campaigns: `strahd` (Curse of Strahd, sessions 1–present) and a future homebrew new world (name TBD). The transition will be a narrative device — a deliberate story beat, not a soft drift.

**`campaign` field** — historian and scheduler entities carry `campaign: strahd` or `campaign: <new-world-name>`. Data entities are campaign-agnostic by default (no tag) unless they are explicitly tied to one world.

**Session planning rules:**

- Identify the active campaign from `scheduler/campaign/` — the campaign file with `state: active`
- Do not pull `campaign: strahd` entities into new-world sessions unless the DM explicitly requests a crossover
- Strahd-tagged entities are still visible and searchable — they just don't surface automatically in new-world content
- Crossover is always allowed when the DM asks for it (throwbacks, callbacks, deliberate bleed)

**New entities** created during or after the world transition should carry the new-world campaign tag. Entities created now, during seeding, are untagged (agnostic) unless clearly Strahd-specific.

## Command Audits

`tests/` holds command audit specs, rubrics, and run logs — engine QA, not campaign content. Read `tests/CLAUDE.md` before running or writing a command audit. Files in `tests/` are never entities; they are excluded from `validate.ps1` and the semantic index.

## New Campaign Setup

When starting a new campaign, read `meta/new-campaign-setup.md` before generating any content.

## Entity Creation

When creating any entity, read `meta/entity-creation.md` before proceeding. It contains the full protocol, known schemas, Obsidian frontmatter rules, and gameplay mechanics guidance.

## Affinity

PC/NPC files carry an optional `affinity:` field — a per-target liking score (integer −10..+10) toward specific characters, distinct from `relates_to` and `disposition`. When working with character sentiment (proposing nudges, reading relationships, backfilling), read `meta/affinity.md` once per task for scale, bands, scope, and frontmatter shape. `/recap` proposes nudges; `scripts/entity-graph.py` reads them.

## Graph Configuration

When adding a new type, subtype, or entity folder, read `meta/graph-settings.md` before touching any config files.

## World Map

Map rules, tile protocol, and crop scripts documented in `maps/CLAUDE.md` — auto-loaded when working with map files.

## Scripts

Helper scripts in `./scripts/` replace repetitive multi-file reads. **Run these via Bash before manual file reads — they collapse 5–10 tool calls into one.** (Scripts are being migrated from PowerShell to Python 3.14, run via `uv run`; both extensions appear in the table during the transition.)

| Script | When to use | Usage |
|---|---|---|
| `session-brief.py` | Start of every `/session` | `uv run scripts/session-brief.py` |
| `session-state.py` | Quick campaign/act/mission check | `uv run scripts/session-state.py` |
| `todo-brief.py` | Start of every `/todo` — all DM action-item signals in one call | `uv run scripts/todo-brief.py` |
| `inventory-brief.py` | Start of every `/inventory` — free entity pool grouped by type, with gaps | `uv run scripts/inventory-brief.py [--type <type>]` |
| `threads-brief.py` | Start of every `/threads` Phase 2 — unresolved states, hostiles, pending seeds | `uv run scripts/threads-brief.py` |
| `party-status.py` | PC stats + afflictions | `uv run scripts/party-status.py` |
| `spotlight-balance.py` | Character-focus ledger — spotlight/agnostic balance, rotation, overdue PC, missing hooks (see `meta/character-focus.md`) | `uv run scripts/spotlight-balance.py [--section]` |
| `free-entities.py` | Find available entities by type or player | `uv run scripts/free-entities.py [--type <type>] [--player <name>]` |
| `contribution-balance.py` | Player contribution counts (pool vs. canonized) | `uv run scripts/contribution-balance.py` |
| `entity-graph.py` | 1-hop relations for any entity | `uv run scripts/entity-graph.py --name "<name>"` |
| `location-entities.py` | All historian entities near a location | `uv run scripts/location-entities.py --location "<name>"` |
| `pitch-brief.py` | Start of every `/pitch` | `uv run scripts/pitch-brief.py [--type <type>]` |
| `monster-lookup.py` | Find monsters by CR, creature type, or habitat | `uv run scripts/monster-lookup.py [--type <type>] [--cr-min <n>] [--cr-max <n>] [--habitat <name>]` |
| `route-cities.py` | Find all cities served by a trade route (uses city `routes` field) | `uv run scripts/route-cities.py --route "<route name>"` |
| `count-markers.ps1` | Count undetailed cities (red dots) in a map region | `.\scripts\count-markers.ps1 -Feature "<name>"` or `-ColMin <n> -ColMax <n> -RowMin <n> -RowMax <n>` |
| `region-world-context.py` | Start of every `/region` Phase 1 — climate, wind rules, water checklist | `uv run scripts/region-world-context.py --col <n> --row <n>` |
| `region-scale.py` | Start of every `/region` Phase 2 — travel times and city spacing from grid span | `uv run scripts/region-scale.py --span-grids <n> --water-body <sea\|river\|both\|none> [--locations <n>]` |
| `region-brief.py` | Resume a `/region` session — compressed draft summary | `uv run scripts/region-brief.py [--region <slug>]` |
| `naming-status.py` | Show named vs. unnamed entries in world-naming questionnaire | `uv run scripts/naming-status.py [--section <name>]` |
| `map-crop.ps1` | Crop world map by feature name or col/row; saves to `maps/locations/` | `.\scripts\map-crop.ps1 -Feature "<name>"` or `-ColMin <n> -ColMax <n> -RowMin <n> -RowMax <n> [-Margin <px>] [-Temp]` |
| `fetch-maps.ps1` | Pull gitignored master map images from the Inkarnate CDN (manifest `maps/sources.tsv`) into `maps/world/masters/`. Run after a clone, or with `-Force` after updating a manifest url | `.\scripts\fetch-maps.ps1 [-Force] [-List]` |
| `gen-tiles.py` | Regenerate all world map tiles (base, markers, sky) from the masters in `maps/world/masters/` after fetching a new export. Cell size is derived from each master's actual resolution | `uv run scripts/gen-tiles.py` |
| `index-entities.py` | Build/rebuild the semantic vector index (run after adding new entities) | `uv run scripts/index-entities.py [--reset]` |
| `semantic-search.py` | Semantic similarity search — find entities by meaning, not keywords | `uv run scripts/semantic-search.py "<text>" [--type <type>] [--subtype <sub>] [--exists true\|false] [--source data\|historian\|scheduler] [-k <n>]` |
| `validate.ps1` | Graph integrity check — dangling `[[links]]`, missing/invalid `exists`/`name`/`type`, broken canon. Run before canonizing or after bulk edits | `.\scripts\validate.ps1 [-Scope all\|links\|frontmatter] [-Quiet]` |
| `validate-refs.ps1` | Instruction-file reference lint — finds path refs in CLAUDE.md files, commands, meta, tests, and todo files that point at renamed/deleted files. Run after renaming, moving, or deleting any instruction file or script | `.\scripts\validate-refs.ps1 [-Quiet]` |
| `refs.ps1` | Reverse dependency lookup — every file:line that references a target file. Run before renaming a file or changing a script's flags/output format, then update what it lists | `.\scripts\refs.ps1 -Target <path-or-filename>` |

**Script dependents:** each consumed script carries a `# consumers:` header line listing the instruction files that reference it. When changing a script's usage, flags, or output format, update those files in the same change.

Scripts output plain text; parse with your own judgment. They read frontmatter only (except `session-brief.py` which also reads the last session body for cliffhanger).

**Semantic index:** `vector-index/` (gitignored, rebuilt from source). Build once with `uv run scripts/index-entities.py`, re-run after bulk entity additions. Use `semantic-search.py` to surface entities by thematic relevance — betrayal arcs, forgotten NPCs, callback hooks, contradiction checks.

**Index staleness check:** At the start of any session, read `vector-index/.index-built` (line 1: ISO timestamp, line 2: git commit SHA). Then run `git log --oneline <sha>..HEAD -- data/ historian/ scheduler/`. If any commits appear, flag it: "Semantic index stale since `<sha[:7]>` — run `uv run scripts/index-entities.py`." Ignore commits that touch only non-indexed files (`CLAUDE.md`, `README.md`) — the indexer skips them, so they cannot stale the index. Do not rebuild automatically; prompt the user. If `.index-built` is missing, index has never been built — prompt to run it.

## Stamp Pattern

Recurring engine idiom for drift-prone state: stamp the state with the marker it was last confirmed at (session number or git SHA), restamp on every `/recap` even when nothing changed, and let a script flag when the stamp lags the latest played session. A stale stamp means reconstruct-with-DM — never trust the old numbers. Current instances: `vector-index/.index-built` (git SHA), PC `level_confirmed`, the campaign Rest Clock header. Use this pattern for any new state that can go silently stale.

## Player Entity Submissions

**Auto-ingestion trigger:** If any message, pasted content, or file contains a `<!-- CLAUDE-INGEST type: entity-questionnaire -->` block, treat it as a filled player questionnaire awaiting ingestion. Read `.claude/commands/entity-ingest.md` for the full flow. Never create an entity directly from raw player input.

## Session Notes Ingestion (Recap Inbox)

**Auto-ingestion trigger:** any markdown file in `recaps/inbox/` is raw session notes awaiting canonization — the DM drops rough notes there after play. When one exists at session start (`session-brief.py` flags it, along with any session whose `planned_date` has passed with no historian record), offer to run `/recap` using that file as the what-happened notes. Never canonize without the DM walking the `/recap` flow; after canonization completes, delete the inbox file — its content lives in the historian record.

## PC Backstory Ingestion

**Trigger:** Any of the following activate this flow:

- A file is placed in `historian/characters/pcs/` that lacks proper PC frontmatter (`exists: true`, `type: character`, `subtype: pc`)
- A message or pasted content contains raw backstory text that names a known PC

Read `.claude/commands/pc-backstory.md` for the full ingestion flow, gap analysis, and entity sourcing rules. **Do not write anything until DM confirms.**

## Campaign Transition Detection

**Trigger:** Any message containing language that suggests the party is leaving the current campaign context. Watch for:

- Leaving/ending the current campaign: "leaving Strahd", "done with Strahd", "finished with Barovia", "we're out of Barovia", "end of the Strahd arc"
- Starting fresh: "new world", "new campaign", "clean slate", "starting the homebrew", "transition"
- Narrative clean-slate signals: "the portal closes", "we're through", "no going back"

These phrases may appear casually — do not trigger on obvious metaphor or out-of-game chatter. When in doubt, ask once: *"Is the campaign transitioning to the new world? I can walk you through the handoff if so."*

If confirmed, read `.claude/commands/transition.md` and follow the full transition flow. Do not make any changes until the DM confirms each step.

## Output Style

No markdown tables in chat responses or generated campaign documents — use bullet lists with inline formatting instead. Existing tables inside instruction files (like the scripts table in this file) are exempt.

## Markdown Linting

Rules live in `.markdownlint.json` (root). A pre-commit hook auto-fixes staged `.md` and re-stages — so don't hand-format or run a lint pass after small edits; the hook handles whitespace-class rules (blank lines, indent, trailing spaces) mechanically.

Only three rules can't be auto-fixed — write with these reflexes so the hook never has to surface them:

- Tag every fenced code block with a language (` ```powershell `, ` ```text `, ` ```json `) — never a bare ` ``` ` (MD040)
- Use real `###` headings, never bold text as a pseudo-heading (MD036)
- Backtick `` `<placeholders>` `` so angle brackets aren't parsed as inline HTML (MD033)

Run an explicit `markdownlint-cli2 "*.md" "**/*.md" "!node_modules/**"` pass only after **bulk** generation (many entities/docs at once), where one systemic mistake repeats — not after routine single-file edits.

## Followup Suggestions

When a task reaches a natural endpoint, suggest at most **one** followup command — and only when the current state actually warrants it (e.g. entities just written → index rebuild; gap surfaced → fill command). Name the command and the reason in a single line: "Run `/x` to `<reason>`." Never append a boilerplate suggestion tail to every response; no state signal, no suggestion. Command files may specify their own closing suggestions — those take precedence.

## Recap Format

Whenever presenting a session recap — whether via `/session` Phase 1 orientation, a direct "what's the recap" prompt, or any other context — use this two-part format:

1. **Narrative prose** — 2–4 sentences, story-flavor, "previously on..." voice. Past tense, third person.
2. **TL;DR bullets** — party status (afflictions, notable conditions), open threads, cliffhanger. One line per item.

No DM brief card needed. No other formats unless explicitly requested.

## Commands

- `/commands` — `.claude/commands/commands.md` — list all available slash commands with descriptions
- `/inventory` — `.claude/commands/inventory.md` — scan all entities in `./data` and report what's in the pool
- `/session` — `.claude/commands/session.md` — plan the next session from campaign state, threads, and scheduler
- `/recap` — `.claude/commands/recap.md` — canonize a played session and write it to historian
- `/entity-questionnaire` — `.claude/commands/entity-questionnaire.md` — generate a player-facing questionnaire to design a new world entity
- `/find <query>` — `.claude/commands/find.md` — semantic entity search; surfaces entities by meaning
- `/threads` — `.claude/commands/threads.md` — surfaces forgotten/unresolved campaign threads
- `/voice <npc name>` — `.claude/commands/voice.md` — DM voice brief grounded in established canon
- `/rumor [count] [theme]` — `.claude/commands/rumor.md` — surface pool rumors as session-opener flavor; read-only
- `/check <claim>` — `.claude/commands/check.md` — contradiction check against historian before canonizing
- `/transition` — `.claude/commands/transition.md` — guided campaign transition flow; also auto-triggered by language cues
- `/todo` — `.claude/commands/todo.md` — plain-language DM dashboard of everything needing attention or action
- `/idea [rough idea] [--build]` — `.claude/commands/idea.md` — develop a rough engine idea into a grounded, executable change via the staged idea-process flow; read-only until `--build`
