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

This repo spans two campaigns: `strahd` (Curse of Strahd) and a homebrew new world (name TBD). The group **alternates** between them like TV seasons — swapping back and forth, not a one-way handoff. The party of characters persists across both worlds and shifts between them via a shallow in-narrative device (a deliberate story beat, not a soft drift). The two worlds stay mostly separate.

**Engine role differs by campaign:**

- **`strahd`** — record-only. Kellan DMs and plans Strahd sessions *outside* this repo. Here, the engine only canonizes what was played: `/recap` → historian. Do **not** run `/session` planning for Strahd, and do not expect scheduler planning artifacts for it.
- **`homebrew`** — full engine. The active-DM (Jeff first, then rotating) plans and records here: `/session` planning, scheduler acts/missions, plus `/recap` canonization.

**`campaign` field** — historian and scheduler entities carry `campaign: strahd` or `campaign: <new-world-name>`. Data entities are campaign-agnostic by default (no tag) unless they are explicitly tied to one world.

**Session planning rules:**

- Identify the active campaign from `scheduler/campaign/` — the campaign file with `state: active`
- Do not pull `campaign: strahd` entities into new-world sessions unless the DM explicitly requests a crossover
- Strahd-tagged entities are still visible and searchable — they just don't surface automatically in new-world content
- Crossover is always allowed when the DM asks for it (throwbacks, callbacks, deliberate bleed)

**New entities** created during a homebrew season carry that world's campaign tag. Entities created now, during seeding, are untagged (agnostic) unless clearly Strahd-specific. Because seasons alternate, a swap is never final — the party will return to the other world later, so preserve the shared party roster across every swap.

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
| `transcribe.py` | Turn a session recording into a speaker-labeled transcript. Multi-track (one file per speaker) needs no diarization; biases decoding toward canon names | `uv run scripts/transcribe.py [--session <n>] [--list] [--force]` |
| `diarize-track.py` | Split one track that carries two speakers (two players sharing a mic). Embeds each cached utterance with ECAPA-TDNN, clusters by voice, names clusters from DM turn-anchors + class vocabulary | `uv run scripts/diarize-track.py --session <n> --track <stem> --speakers "A,B" [--dry-run]` |
| `session-state.py` | Quick campaign/act/mission check | `uv run scripts/session-state.py` |
| `todo-brief.py` | Start of every `/todo` — all DM action-item signals in one call | `uv run scripts/todo-brief.py` |
| `inventory-brief.py` | Start of every `/inventory` — free entity pool grouped by type, with gaps | `uv run scripts/inventory-brief.py [--type <type>]` |
| `questions-brief.py` | Open world-design questions in `questionnaires/`, counted by topic and priority. The tree is one question per file in topic subfolders, and gitignored — ripgrep tools can't see it | `uv run scripts/questions-brief.py [--topic <prefix>] [--required] [--list]` |
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
| `count-markers.py` | Count undetailed cities (red dots) in a map region | `uv run scripts/count-markers.py --feature "<name>"` or `--col-min <n> --col-max <n> --row-min <n> --row-max <n>` |
| `region-world-context.ps1` | Start of every `/region` Phase 1 — climate, wind rules, water checklist | `.\scripts\region-world-context.ps1 -Col <n> -Row <n>` |
| `region-scale.ps1` | Start of every `/region` Phase 2 — travel times and city spacing from grid span | `.\scripts\region-scale.ps1 -SpanGrids <n> -WaterBody <sea\|river\|both\|none> [-Locations <n>]` |
| `region-brief.ps1` | Resume a `/region` session — compressed draft summary | `.\scripts\region-brief.ps1 [-Region <slug>]` |
| `naming-status.py` | Show named vs. unnamed entries in world-naming questionnaire | `uv run scripts/naming-status.py [--section <name>]` |
| `map-crop.py` | Crop world map by feature name or col/row; saves to `maps/locations/` | `uv run scripts/map-crop.py --feature "<name>"` or `--col-min <n> --col-max <n> --row-min <n> --row-max <n> [--margin <px>] [--temp]` |
| `fetch-maps.py` | Pull gitignored master map images from the Inkarnate CDN (manifest `maps/sources.tsv`) into `maps/world/masters/`. Run after a clone, or with `--force` after updating a manifest url | `uv run scripts/fetch-maps.py [--force] [--list]` |
| `gen-tiles.py` | Regenerate all world map tiles (base, markers, sky) from the masters in `maps/world/masters/` after fetching a new export. Cell size is derived from each master's actual resolution | `uv run scripts/gen-tiles.py` |
| `index-entities.py` | Build/rebuild the semantic vector index (run after adding new entities) | `uv run scripts/index-entities.py [--reset]` |
| `semantic-search.py` | Semantic similarity search — find entities by meaning, not keywords | `uv run scripts/semantic-search.py "<text>" [--type <type>] [--subtype <sub>] [--exists true\|false] [--source data\|historian\|scheduler] [-k <n>]` |
| `validate.ps1` | Graph integrity check — dangling `[[links]]`, missing/invalid `exists`/`name`/`type`, broken canon. Run before canonizing or after bulk edits | `.\scripts\validate.ps1 [-Scope all\|links\|frontmatter] [-Quiet]` |
| `validate-refs.ps1` | Instruction-file reference lint — finds path refs in CLAUDE.md files, commands, meta, tests, and todo files that point at renamed/deleted files. Run after renaming, moving, or deleting any instruction file or script | `.\scripts\validate-refs.ps1 [-Quiet]` |
| `version-check.py` | Session start / before a bump — flag engine changes since the last version bump (see `meta/versioning.md`) | `uv run scripts/version-check.py` |
| `refs.ps1` | Reverse dependency lookup — every file:line that references a target file. Run before renaming a file or changing a script's flags/output format, then update what it lists | `.\scripts\refs.ps1 -Target <path-or-filename>` |

**Script dependents:** each consumed script carries a `# consumers:` header line listing the instruction files that reference it. When changing a script's usage, flags, or output format, update those files in the same change.

Scripts output plain text; parse with your own judgment. They read frontmatter only (except `session-brief.py` which also reads the last session body for cliffhanger).

**Semantic index:** `vector-index/` (gitignored, rebuilt from source). Build once with `uv run scripts/index-entities.py`, re-run after bulk entity additions. Use `semantic-search.py` to surface entities by thematic relevance — betrayal arcs, forgotten NPCs, callback hooks, contradiction checks.

**Index staleness check:** At the start of any session, read `vector-index/.index-built` (line 1: ISO timestamp, line 2: git commit SHA). Then run `git log --oneline <sha>..HEAD -- data/ historian/ scheduler/`. If any commits appear, flag it: "Semantic index stale since `<sha[:7]>` — run `uv run scripts/index-entities.py`." Ignore commits that touch only non-indexed files (`CLAUDE.md`, `README.md`) — the indexer skips them, so they cannot stale the index. Do not rebuild automatically; prompt the user. If `.index-built` is missing, index has never been built — prompt to run it.

## Stamp Pattern

Recurring engine idiom for drift-prone state: stamp the state with the marker it was last confirmed at (session number or git SHA), restamp on every `/recap` even when nothing changed, and let a script flag when the stamp lags the latest played session. A stale stamp means reconstruct-with-DM — never trust the old numbers. Current instances: `vector-index/.index-built` (git SHA), PC `level_confirmed`, the campaign Rest Clock header, the project `VERSION` (last bump commit — see Versioning below). Use this pattern for any new state that can go silently stale.

## Versioning

The project carries a single semver `MAJOR.MINOR.PATCH` in root `VERSION`; notable engine changes are logged in `CHANGELOG.md`. The version tells collaborators and their Claude agents *what important thing changed* — not that there was activity. Routine campaign content (new entities, canonized sessions) stays below the bump bar and is not versioned. When a change clears the bar (engine behavior/interaction/view changes, or structural/retcon content changes), bump `VERSION` and prepend a `CHANGELOG.md` entry. Full tier rules and the bump procedure: `meta/versioning.md` (read once per task when bumping).

**Version orientation:** At the start of any session, read root `VERSION` and the top entry or two of `CHANGELOG.md`, and orient the DM/agent: "Engine v`<x.y.z>` — since last worked here: `<recent changelog highlights>`." Run `uv run scripts/version-check.py` to surface whether engine files changed without a version bump (non-blocking — a flag means "decide whether this cleared the bump bar," not "something broke").

## Player Entity Submissions

**Auto-ingestion trigger:** If any message, pasted content, or file contains a `<!-- CLAUDE-INGEST type: entity-questionnaire -->` block, treat it as a filled player questionnaire awaiting ingestion. Read `.claude/commands/entity-ingest.md` for the full flow. Never create an entity directly from raw player input.

## Session Notes Ingestion (Recap Inbox)

**Auto-ingestion trigger:** any markdown file in `recaps/inbox/` is raw session notes awaiting canonization — the DM drops rough notes there after play. When one exists at session start (`session-brief.py` flags it, along with any session whose `planned_date` has passed with no historian record), offer to run `/recap` using that file as the what-happened notes. Never canonize without the DM walking the `/recap` flow; after canonization completes, delete the inbox file — its content lives in the historian record.

## Session Recordings (Audio)

The group records sessions instead of taking notes. Audio lands in `recaps/audio/` — either a folder of per-speaker tracks (`recaps/audio/session-26/`, Craig-style multi-track) or a single mixed file. Audio is gitignored; it stays on the DM's machine.

The pipeline is three steps, each with a human checkpoint:

1. `uv run scripts/transcribe.py --session <n>` → `recaps/transcripts/session-<n>.md` — machine transcript, speaker-labeled, committed as the record of what was said
2. `/transcript <n>` → `recaps/inbox/session-<n>.md` — digested notes shaped for `/recap`'s Phase 2 questions
3. `/recap` → historian — canonization, DM-supervised as always

**Auto-detection trigger:** a folder or audio file in `recaps/audio/` with no matching transcript in `recaps/transcripts/` is an untranscribed recording. Offer `/transcript <n> --transcribe`; never start a transcription run unprompted — a four-hour session is 15–25 minutes of GPU time.

**A transcript is a source, not canon.** It mishears proper nouns, drops quiet speakers, and cannot tell a joke from a plan. Everything derived from one carries confidence marks (`(?)`, `(??)`) into the inbox note, and the DM resolves them during `/recap`. Never canonize straight from a transcript.

Optional `recaps/audio/<session>/speakers.tsv` maps a track filename stem to a display name (`eljeffe0024` → `Jeff`), so Discord handles don't end up as speaker labels.

**Resolving unknown handles:** a Craig handle that doesn't obviously map to a player is usually identifiable from the audio itself — a player self-identifying ("my name is Odibli"), or class vocabulary that matches exactly one PC (rage/reckless/greataxe → the barbarian; ki/Step of the Wind → the monk). Confirm the mapping, write it into `speakers.tsv`, then re-run `transcribe.py` — the per-track cache makes a relabel instant, with no re-decoding. Note the evidence in a comment in the file so the next person doesn't re-derive it.

**Shared microphones.** One track normally means one speaker, which is why the pipeline needs no diarization. When two players sit together and share a mic, that assumption breaks and every line on that track is falsely attributed to the track's owner. Handle it in two steps:

1. Set the track's `speakers.tsv` label to **both** names (`Jeff (Iggy) + Paul (Luci)`) so nothing is attributed to one player on no evidence, and record in a comment how you know
2. Optionally run `uv run scripts/diarize-track.py --session <n> --track <stem> --speakers "A,B"` to split it by voice. It writes `.cache/<slug>/<stem>.speakers.json`, which the next `transcribe.py` run stamps onto each utterance — cache-only, no re-decode

Do not try to split a shared track by reading the text. Measured on session 27, class vocabulary plus DM turn-anchors attribute only ~20% of utterances; the rest is `"yeah"` and `"that misses"`, identical between two players. The voice is the signal, the words are not. Lines the split leaves unresolved keep the joint label, and the DM settles them at `/recap`.

**Long runs must be detached.** A transcription launched with the Bash tool's background mode dies when the Claude Code process restarts, losing the whole run. For a full session, launch it detached so it survives — on Windows, `Start-Process` with `-RedirectStandardOutput`/`-RedirectStandardError` into `recaps/transcripts/.cache/<session>/` — then watch the log. The per-track JSON cache means an interrupted run resumes without redoing finished tracks.

**Sharing a digest outside the repo:** `/transcript` Phase 6 covers publishing the inbox note as a Google-Docs-pasteable artifact — light theme only, top heading `H3`, Docs-available typefaces. Read it before building one.

## PC Backstory Ingestion

**Trigger:** Any of the following activate this flow:

- A file is placed in `historian/characters/pcs/` that lacks proper PC frontmatter (`exists: true`, `type: character`, `subtype: pc`)
- A message or pasted content contains raw backstory text that names a known PC

Read `.claude/commands/pc-backstory.md` for the full ingestion flow, gap analysis, and entity sourcing rules. **Do not write anything until DM confirms.**

## Campaign Transition Detection

**Trigger:** Any message suggesting the party is swapping campaigns — in **either** direction (campaigns alternate like seasons). Watch for:

- Pausing the current campaign: "leaving Strahd", "done with Strahd for now", "wrapping the Strahd season", "we're out of Barovia", "pausing the homebrew", "back to Strahd"
- Starting/resuming the other: "new world", "new campaign", "starting the homebrew", "next season", "returning to Barovia", "resume Strahd", "swap campaigns", "transition"
- Narrative swap signals: "the portal closes", "we step through", "the mists take us"

These phrases may appear casually — do not trigger on obvious metaphor or out-of-game chatter. When in doubt, ask once: *"Is this a campaign season-swap? I can walk you through the handoff if so."*

If confirmed, read `.claude/commands/transition.md` and follow the full flow. Do not make any changes until the DM confirms each step.

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
- `/transition` — `.claude/commands/transition.md` — guided campaign season-swap flow (bidirectional Strahd ↔ homebrew); also auto-triggered by language cues
- `/transcript [session] [--transcribe]` — `.claude/commands/transcript.md` — digest a session recording's transcript into `recaps/inbox/` notes ready for `/recap`
- `/todo` — `.claude/commands/todo.md` — plain-language DM dashboard of everything needing attention or action
- `/idea [rough idea] [--build]` — `.claude/commands/idea.md` — develop a rough engine idea into a grounded, executable change via the staged idea-process flow; read-only until `--build`
