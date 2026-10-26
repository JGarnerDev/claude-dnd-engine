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
- `./spitball` — Loose story ideas, captured without commitment and kept searchable so they can be mined later. **Never canon**, never a source of fact; excluded from `validate.ps1`'s link check so an idea may name things that do not exist. See `meta/spitball.md`.
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

This repo spans two campaigns: `strahd` (Curse of Strahd) and `homebrew` — the world **Aethryn**, where the campaign **Redwater** is the first season. The group **alternates** between them like TV seasons — swapping back and forth, not a one-way handoff. The party of characters persists across both worlds and shifts between them via a shallow in-narrative device (a deliberate story beat, not a soft drift). The two worlds stay mostly separate.

**Engine role differs by campaign:**

- **`strahd`** — record-only. Kellan DMs and plans Strahd sessions *outside* this repo. Here, the engine only canonizes what was played: `/recap` → historian. Do **not** run `/session` planning for Strahd, and do not expect scheduler planning artifacts for it.
- **`homebrew`** — full engine. The active-DM (Jeff first, then rotating) plans and records here: `/session` planning, scheduler acts/missions, plus `/recap` canonization.

**`campaign` field** — historian and scheduler entities carry `campaign: strahd` or `campaign: homebrew`. The value names the **season axis**, not the world or the campaign document: everything set in Aethryn is tagged `homebrew` regardless of which campaign runs there, so a second Aethryn campaign after Redwater reuses the same tag. Data entities are campaign-agnostic by default (no tag) unless they are explicitly tied to one world.

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

## Prose Style

Generated prose (read-aloud text, plans, historian records, player-facing notes, lore) follows an anti-slop pass: no stock AI phrasing, no stock fantasy tells, register matched to the audience, and voice kept rather than flattened. Read `meta/prose-style.md` once per task whenever a task writes or edits prose, and run its **While drafting** checklist before prose goes to disk. `/session`, `/recap`, `/transcript` (Drive notes) and `/pitch` load it at their writing step; `/review` Pass 6 checks plans against it.

## Affinity

PC/NPC files carry an optional `affinity:` field — a per-target liking score (integer −10..+10) toward specific characters, distinct from `relates_to` and `disposition`. When working with character sentiment (proposing nudges, reading relationships, backfilling), read `meta/affinity.md` once per task for scale, bands, scope, and frontmatter shape. `/recap` proposes nudges; `scripts/entity-graph.py` reads them.

## Stats

Table-side **stats** (killing blows, nat 1s, HP healed, songs performed) celebrate what each PC did, as award and standings slides in the recap deck. They're mechanical, never spotlight, and never a perk. `/transcript` mines them (sums are rough, `~n`), `/recap` confirms them into one ledger, `historian/sessions/_stats.md`, for both campaigns, and proposes in-world **fame** that the DM must approve. Read `meta/stats.md` once per task for the catalog, rules and ledger shape.

## Achievements

Homebrew recap decks carry one **achievement** slide per PC: short, snarky "New achievement!" cards for in-fiction deeds, addressed to the PC as "you", with running jokes drawn from each PC's history. No rewards, no perks, never padded. `/transcript` spots candidates, `/recap` drafts them for DM approval into `historian/sessions/_achievements.md`, and the runner builds the slides. Read `meta/achievements.md` once per task.

## NPC Voice

NPC and antagonist files can carry a `## Voice` section: a **core** (how they speak, which changes only by correction or a DM-called arc shift) and a **now** layer (what sessions have done to them, every line citing its cause), plus lines actually said at the table. Frontmatter `voice:` holds the core in one line; `voice_confirmed:` stamps it. When writing, updating or playing a voice, read `meta/voice.md` once per task. `/recap` proposes voice shifts after the affinity nudges; `/voice` caches new ones; `todo-brief.py` flags stale stamps.

## Player Agency

The party should steer the story, not ride it. Each session plan carries a few **real choices**, about two or three for the party and one for a single character, marked `Choice (party):` / `Choice (<PC>):`. Each act carries at least one choice that changes where the story goes. Committed beats stay; choices are added around them (how, at what cost, a visible way to beat a set outcome). `/session` plans them, `/review` Pass 5 checks for railroading, and `/recap` records what was chosen in the session's `choices:` field so later sessions can pay it off. Read `meta/player-agency.md` once per task when planning, reviewing or recapping.

## Spitballs

`spitball/` holds loose story ideas — things that might become an act, a session, an encounter, a twist, or nothing. Filed by `/spitball`, usually from a phone over `claude remote-control`, so the capture rule is **file first, develop second**: the idea hits disk on the first turn, before any riffing, and follow-up turns update that same file. Do not interrogate the DM for fields — infer `subtype`, `campaign` and `target`, and be wrong cheaply. **One exception to file-first:** a bare entity name (`/spitball Nella`) is a lookup, not an idea — answer with about four lines on where that entity stands, ask what to explore, and write nothing until the next message. **A spitball is never canon** and is never consulted by `/recap`, `/check`, `/voice` or anything else that speaks about what is true. **Spitball documents may be deleted at any time - do not rely on linking them. If the information seems important, suggest relocating it.** Read `meta/spitball.md` once per task when writing, developing or mining them.

## Flow Graphs

An act can carry a **flow graph set** — a folder of mermaid maps, one graph per file, showing the
act's sessions, the beats inside each, the real branches, and which beats are committed enough to
run. Every node prints a commitment marker and its own id (`[x]`/`[-]`/`[?]` plus `S1_EXAMPLE`), so
beats can be named in conversation and found with a grep. When building or editing one, read
`meta/flow-graphs.md` once per task. **Never flip a node to `[x]` on your own judgment** — the
engine proposes, the DM commits. Built by `/flow`; coverage reported by `scripts/flow-status.py`.

## Graph Configuration

When adding a new type, subtype, or entity folder, read `meta/graph-settings.md` before touching any config files.

## World Map

Map rules auto-load from `maps/`: shared rules in `maps/CLAUDE.md`, the world map (tiles, grid, climate, crop and region scripts) in `maps/world/CLAUDE.md`, battle maps and Roll20 kits in `maps/battlemaps/CLAUDE.md`.

## Session Start

A SessionStart hook (`.claude/settings.json`) runs `scripts/session-start.py` and puts its output in context: the engine version with recent changelog highlights, engine commits since the last version bump, search-index staleness, notes waiting in `recaps/inbox/`, and untranscribed recordings. Pass its `!` flags to the user in a line or two, framed as "Engine v`<x.y.z>` — since last worked here: …". Never rebuild the index or start a transcription unprompted; prompt instead. If the orientation block is missing (hook not installed, `uv` absent), run `uv run scripts/session-start.py` by hand.

## Scripts

Helper scripts in `./scripts/` replace repetitive multi-file reads. **Run these via Bash before manual file reads — they collapse 5–10 tool calls into one.** Run them with `uv run` (Python 3.14); the three `.ps1` files are the last PowerShell holdouts.

Only cross-cutting scripts are listed here. Scripts that one command or domain uses are named where they are used: each command's `*-brief.py` in its command file, map and region scripts in `maps/world/CLAUDE.md`, the battlemap renderer in `maps/battlemaps/CLAUDE.md`, transcription scripts in `recaps/CLAUDE.md`. For anything else, each script's header carries a `# Usage:` line.

| Script | When to use | Usage |
|---|---|---|
| `session-brief.py` | Start of every `/session` | `uv run scripts/session-brief.py` |
| `session-state.py` | Quick campaign/act/mission check | `uv run scripts/session-state.py` |
| `prep-status.py` | What is left before a planned session can run: placeholders, draft beats, loot, maps, tokens, levels, `_tasks.md` | `uv run scripts/prep-status.py [--session <n>]` |
| `party-status.py` | PC stats + afflictions | `uv run scripts/party-status.py` |
| `free-entities.py` | Find available entities by type or player | `uv run scripts/free-entities.py [--type <type>] [--player <name>]` |
| `contribution-balance.py` | Player contribution counts (pool vs. canonized) | `uv run scripts/contribution-balance.py` |
| `entity-graph.py` | 1-hop relations for any entity | `uv run scripts/entity-graph.py --name "<name>"` |
| `location-entities.py` | All historian entities near a location | `uv run scripts/location-entities.py --location "<name>"` |
| `monster-lookup.py` | Find monsters by CR, creature type, or habitat | `uv run scripts/monster-lookup.py [--type <type>] [--cr-min <n>] [--cr-max <n>] [--habitat <name>]` |
| `questions-brief.py` | Open world-design questions in `questionnaires/`, counted by topic and priority. The tree is one question per file in topic subfolders, and gitignored — ripgrep tools can't see it | `uv run scripts/questions-brief.py [--topic <prefix>] [--required] [--list]` |
| `index-entities.py` | Build/rebuild the semantic vector index (run after adding new entities) | `uv run scripts/index-entities.py [--reset]` |
| `semantic-search.py` | Semantic similarity search — find entities by meaning, not keywords | `uv run scripts/semantic-search.py "<text>" [--type <type>] [--subtype <sub>] [--exists true\|false] [--source data\|historian\|scheduler] [-k <n>]` |
| `session-start.py` | Start-of-conversation orientation (run by the SessionStart hook) | `uv run scripts/session-start.py` |
| `version-check.py` | Before a bump — engine changes since the last version bump (see `meta/versioning.md`) | `uv run scripts/version-check.py` |
| `validate.ps1` | Graph integrity check — dangling `[[links]]`, missing/invalid `exists`/`name`/`type`, broken canon. Run before canonizing or after bulk edits | `.\scripts\validate.ps1 [-Scope all\|links\|frontmatter] [-Quiet]` |
| `validate-refs.ps1` | Instruction-file reference lint — finds path refs in CLAUDE.md files, commands, meta, tests, and todo files that point at renamed/deleted files. Run after renaming, moving, or deleting any instruction file or script | `.\scripts\validate-refs.ps1 [-Quiet]` |
| `refs.ps1` | Reverse dependency lookup — every file:line that references a target file. Run before renaming a file or changing a script's flags/output format, then update what it lists | `.\scripts\refs.ps1 -Target <path-or-filename>` |

**Script dependents:** each consumed script carries a `# consumers:` header line listing the instruction files that reference it. When changing a script's usage, flags, or output format, update those files in the same change.

Scripts output plain text; parse with your own judgment. They read frontmatter only (except `session-brief.py` which also reads the last session body for cliffhanger).

**Semantic index:** `vector-index/` (gitignored, rebuilt from source). Build once with `uv run scripts/index-entities.py`, re-run after bulk entity additions. Use `semantic-search.py` to surface entities by thematic relevance — betrayal arcs, forgotten NPCs, callback hooks, contradiction checks. Staleness is computed in `scripts/lib/common.py` (`INDEXED_DIRS` must match the indexer's dirs) and reported at session start, by `session-brief.py` and by `todo-brief.py`. Commits that touch only non-indexed files (`CLAUDE.md`, `README.md`) do not stale it. Never rebuild automatically; prompt the user.

## Stamp Pattern

Recurring engine idiom for drift-prone state: stamp the state with the marker it was last confirmed at (session number or git SHA), restamp on every `/recap` even when nothing changed, and let a script flag when the stamp lags the latest played session. A stale stamp means reconstruct-with-DM — never trust the old numbers. Current instances: `vector-index/.index-built` (git SHA), PC `level_confirmed`, NPC `voice_confirmed`, the campaign Rest Clock header, campaign tracker headers (`scheduler/campaign/_*.md`, e.g. the Citadel Clock), the project `VERSION` (last bump commit — see Versioning below). Use this pattern for any new state that can go silently stale.

## Versioning

The project carries a single semver `MAJOR.MINOR.PATCH` in root `VERSION`; notable engine changes are logged in `CHANGELOG.md`. The version tells collaborators and their Claude agents *what important thing changed* — not that there was activity. Routine campaign content (new entities, canonized sessions) stays below the bump bar and is not versioned. When a change clears the bar (engine behavior/interaction/view changes, or structural/retcon content changes), bump `VERSION` and prepend a `CHANGELOG.md` entry. Full tier rules and the bump procedure: `meta/versioning.md` (read once per task when bumping).

## Player Entity Submissions

**Auto-ingestion trigger:** If any message, pasted content, or file contains a `<!-- CLAUDE-INGEST type: entity-questionnaire -->` block, treat it as a filled player questionnaire awaiting ingestion. Run the Ingestion Mode section of `.claude/commands/entity-questionnaire.md`. Never create an entity directly from raw player input.

## Session Notes and Recordings

Pipeline rules (speaker labels, shared mics, detached runs) live in `recaps/CLAUDE.md`, auto-loaded when working in `recaps/`. Triggers that can fire from anywhere:

- **Recap inbox:** any markdown file in `recaps/inbox/` is raw session notes awaiting canonization. When the session-start orientation or `session-brief.py` flags one (or a session whose `planned_date` passed with no historian record), offer `/recap` with that file as the what-happened notes. Never canonize without the DM walking the `/recap` flow; `/recap` deletes the inbox file when it finishes
- **Untranscribed recording:** a folder or audio file in `recaps/audio/` with no matching transcript in `recaps/transcripts/`. Offer `/transcript <n> --transcribe`; never start a transcription unprompted — a four-hour session is 15–25 minutes of GPU time
- **A transcript is a source, not canon.** Never canonize straight from one; confidence marks (`(?)`, `(??)`) carry into the inbox note and the DM resolves them at `/recap`
- **Google Drive notes:** when the DM asks for "google drive notes" (or notes to share with the table), read `/transcript` Phase 6 first. They are written **for the players to read**: no spoilers, no conclusions drawn for the party, built fresh from the ledger, not copied from the DM-facing inbox note. Published as a Google-Docs-pasteable artifact: light theme only, top heading `H3`, Docs-available typefaces

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

Slash commands live in `.claude/commands/`. Claude Code lists them every turn from each file's frontmatter, and `/commands` prints full usage via `scripts/commands-list.py`, so no hand-kept list lives here to drift. Every command file opens with YAML frontmatter: a quoted `description:` (what it does, plus any auto-trigger) and, when it takes arguments, a quoted `argument-hint:`. Add both to any new command.
