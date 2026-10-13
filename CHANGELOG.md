# Changelog

All notable engine changes are recorded here. This file tracks the **engine** — commands, scripts, schemas, meta rules, the charting app, and structural campaign changes (new acts, campaign transitions, canon retcons). Routine campaign content (new entities, normal session canonization) is **not** logged here; it lives in git history and the historian.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning rules live in [`meta/versioning.md`](./meta/versioning.md).

The version in [`VERSION`](./VERSION) always matches the top entry below.

## [0.32.0] — 2026-10-12

### Added

- **Party-facing labels.** `/session` (Phase 5) gives every combatant a `Label (party-facing):` line beside its kit line: the one-to-three-word name the party uses before learning the real one (a job or a look, never a stat block or a bare weapon, unique per encounter, numbered only for lookalikes). The Combatants at-a-glance list leads with it. The label is the Roll20 token label, the `tokens.txt` role (lowercase, hyphenated) and the first word of a map layout's token line. `/review` Pass 2 checks it.

### Changed

- **Everyone gets a real name.** `/session` and `/review` Pass 2 now name every person and animal the plan puts in front of the party, walk-ons included, so anyone can talk. Narration can still leave them unnamed. This replaces the old rule of naming anonymous speakers only on request. Session 30's plan, layouts and token kit use the new labels.

## [0.31.0] — 2026-10-12

### Added

- **Budgeted token kits.** `scripts/token-kit.py` builds a session's Roll20 token kit from the FA Tokens Library zip inside a storage budget (default 30 MB of the free tier's 100 MB). It reads a tiered per-session manifest (`maps/roll20 assets/session-<n>/tokens.txt`: combatants, then named NPCs, then walk-ons) and tops up from the evergreen `maps/battlemaps/tokens-common.txt`. It downscales to 280 px per square and names files by role so they can be searched in the art library. It also writes a README with Roll20 sizes. Session 30's kit: 269 tokens, 22.8 MB. `maps/battlemaps/CLAUDE.md` documents the workflow.

## [0.30.0] — 2026-10-12

### Added

- **Roll20 upload purge.** `maps/battlemaps/roll20-purge.js` is a browser-console script that bulk-deletes uploaded Roll20 assets to get back under the free 100 MB storage quota. It works through Roll20's internal list and delete endpoints. `maps/battlemaps/CLAUDE.md` points to it from the kit workflow.

## [0.29.0] — 2026-10-12

### Added

- **Player-facing kit lines.** `/session` (Phase 5, Encounters) now writes a `Kit (player-facing):` line for every combat-capable enemy and NPC: one italic sentence of the armour and weapons the party can see, matching the stat block, with no name in it. `/review` Pass 1 backfills missing ones. Session 30's combatants and Mara Tull carry them.

## [0.28.0] — 2026-10-12

### Added

- **Recap slides: Voice rules.** `meta/recap-slides.md` gains a `## Voice` section: tell it as a story, not mechanics (no check-, damage- or rules-sounding words); only what an NPC actually said, so a reward the plan names stays off the slides until it was promised out loud; "the party", not "you"; vary verbs; plain words that read well aloud.

### Fixed

- **Session 29 deck** reworded to the new rules. The fox's promise no longer names the spear, which the fox never said.

## [0.27.1] — 2026-10-12

### Removed

- **Recap slides' empty art column.** It was held for pixel art, which is dropped: the group doesn't want AI-generated art. Slide text now spans the stage, capped at 1200px wide so lines stay readable when screen-shared. The reserved-image note is gone from `meta/recap-slides.md`.

### Fixed

- **`.template-sync`** now ships `meta/recap-slides.md`, which `/recap` Phase 8 reads.

## [0.27.0] — 2026-10-10

### Added

- **Recap slides.** The session runner's "Previously on…" card has a **Slides** button that opens a fullscreen, party-facing carousel of the previous session, built for screen-sharing at the table. Arrow keys, Space or click move; Home and End jump; Esc closes; F toggles browser fullscreen. Each slide leaves an empty column for the per-character pixel art planned for later. New `app/pages/home/session/slides.ts` (+ CSS and spec).
- **`meta/recap-slides.md`.** The deck rules: homebrew only, DM-approved, written once. Covers the fixed slide order (title, previously-on, scenes as played, choices, the party, next time), about 40 words per slide, and party-safe sources. Every draft gets a names check: seen is not known, so a name the DM's sources mention stays off the slides until the DM confirms the party learned it. Private PC moments stay in. The deck lives in `_slides.md` in the session's historian folder, which the entity scan skips.
- **Session 29 deck.** A one-time `_slides.md` written by hand, so Session 30 opens with slides.

### Changed

- **`/recap` Phase 8** now drafts a homebrew session's deck as a numbered list. The DM edits it by number and approves it, then `/recap` writes `_slides.md`. The group-chat blurb is still offered afterwards, drawn from the approved deck. Strahd recaps are unchanged. `tests/commands/recap/spec.md` gains the matching checkpoint and output contract.
- **`session-cards.py`** emits `slides: [{title, md}]` on each `previously` entry, read from the folder's `_slides.md` (empty when there's none). `PreviousSession` in the runner's `types.ts` gains the field.

## [0.26.2] — 2026-10-10

### Fixed

- **Campaign view froze when zoomed in.** The swimlane built one tick node for every day across the whole timeline: about 940,000 DOM nodes and 14–23 s per wheel step at deep zoom. It now draws ticks only for the visible slice plus a buffer, and refills them as you pan. `buildTicks` takes an optional day-index window, and `Axis` gains `ticksIn(x0, x1)`. Zoom steps hold at about 70 ms.
- **Wheel zoom redrew at max/min zoom.** It no longer redraws when the level is pinned.
- **Campaign view canvas could pass the browser layout limit** (80M px; Chrome breaks past about 33.5M). Max zoom is now capped at a 16M px canvas (`MAX_CONTENT_PX`).
- **Session 29 stretched the Campaign view to 1,291 years.** A session in a campaign with no in-world dates fell back to its real-world `played_date` (2026) next to Strahd's year 735. `timeline-data.py` now uses the real-world fallback only when no campaign has in-world dates. Otherwise it places the session one day after the previous dated session and warns on stderr that the date is a placeholder, not canon.

## [0.26.1] — 2026-10-10

### Added

- **`tests/commands/recap/spec.md`.** An audit contract for `/recap`, the command that writes canon. It sets the required scripts, read budget, nine interaction checkpoints and output contract, and treats any write made before its confirmation as a fail. It ships in the template.

### Fixed

- **`/recap` couldn't find a plan readied with `/review --ready`.** Phase 1 only looked for `state: draft`, but `--ready` sets `state: planned` (as Session 30 is now), so `/recap` would have reported that no session exists. It now accepts both.
- **`/recap` reads party levels from `party-status.py`** instead of opening each PC file.
- **`/recap` now runs `validate.ps1 -Scope links`** after its writes, as root CLAUDE.md requires before canonizing, and reports only errors in files it touched.

## [0.26.0] — 2026-10-09

### Added

- **`session-brief.py` prints a CAMEO PLAYERS block:** every active `role: cameo` player in `meta/players/` with availability, preferences and description, plus a flag for any filled cameo questionnaire not yet ingested.
- **`meta/settlements.md` → Travel Legs.** The travel-leg procedure (paces, clock advance, 1–3 geography-derived stops) moved here from `/session`, which now points to it only when a plan includes travel.

### Fixed

- **`/session` Cameo Candidates never found ingested cameo players.** It grepped `questionnaires/` for `filled: true`, but ingestion writes cameo players to `meta/players/`, so MacLeod (`role: cameo`) could never surface. It now reads the brief's CAMEO PLAYERS block, with no greps or file reads.

### Changed

- **`/recap` no longer copies rules from meta files.** The affinity magnitudes and bands now come from `meta/affinity.md`, and the daypart cue rules from `meta/events.md` → Dating events. Each rule lives in one place.

## [0.25.1] — 2026-10-09

### Fixed

- **`.template-sync` ships a working engine again.** It listed 15 `.ps1` scripts that the Python migration had deleted, and it was missing 26 `.py` scripts (`session-brief`, `todo-brief`, `party-status` and others the commands call), four commands (`/flow`, `/review`, `/spitball`, `/transcript`), and five engine meta files (`affinity`, `events`, `flow-graphs`, `player-agency`, `spitball`). Commands and scripts now sync by wildcard (`.claude/commands/*.md`, `scripts/*.py`, `scripts/*.ps1`, `scripts/lib/*.py`), so new ones ship without an edit. The pytest suite (`tests/scripts/*.py`) and the shared `.claude/settings.json` hook now ship too. The orphaned `scripts/inkarnate-fetch.py` (replaced by `fetch-maps.py`) and its test are excluded.

## [0.25.0] — 2026-10-09

### Changed

- **`maps/CLAUDE.md` split into three files, so map work loads only the rules it needs.**
  - `maps/CLAUDE.md` (about 3KB) keeps the shared rules: no committed images, the two kinds of map, and handing map work to Jeff.
  - `maps/world/CLAUDE.md` (about 11KB) holds masters and tiles, the four hard rules, re-export and city graduation, Grid Scale, Climate Rules, City Marker ID Format, and the map/region scripts.
  - `maps/battlemaps/CLAUDE.md` (about 7KB) holds layouts and renders, standing location maps, and Roll20 asset kits.

  World-map work now loads about 14KB of rules instead of 19KB, and battle-map work about 10KB. **Grid Scale, Climate Rules, City Marker ID Format and the graduation checklist now live in `maps/world/CLAUDE.md`**, and every reference in meta, templates, scripts and README is updated.
- **`scheduler/CLAUDE.md` points to the battlemap rules.** Session layouts (`<Session folder>/maps/*.txt`) live under `scheduler/`, where `maps/` rules never auto-loaded.

### Removed

- **The "Current maps" list in `maps/CLAUDE.md`.** It was a status list inside an instruction file and would have gone out of date; `ls maps/battlemaps/` gives the same answer. Its one design note, that the Golden Lioness outdoors map stays a 5-ft battle map, moved into the battlemap rules.

### Fixed

- **`.template-sync`** now ships the new `maps/world/`, `maps/battlemaps/` and `recaps/` CLAUDE.md files, and no longer lists the deleted `entity-ingest.md`.

## [0.24.0] — 2026-10-09

### Added

- **SessionStart hook in a shared `.claude/settings.json`.** It runs the new `scripts/session-start.py`, which prints the engine version, recent changelog highlights, unbumped engine commits, search-index staleness, recap-inbox notes and untranscribed recordings. This replaces the hand-run start-of-session ritual of four or five tool calls. Collaborators get it on clone; it needs `uv`.
- **`recaps/CLAUDE.md`.** The audio pipeline rules (speaker labels, shared microphones, detached runs) moved out of root and load only when working in `recaps/`.
- **Map Scripts section in `maps/CLAUDE.md`.** Lists the ten map, region and naming scripts that used to sit in the root table.

### Changed

- **Root CLAUDE.md is down from about 31KB to about 22KB** (roughly 2.3k fewer tokens a turn). The scripts table keeps only cross-cutting scripts; command-specific briefs are named in their command files. The index-staleness and version-orientation rituals collapse into a Session Start section. The recap inbox and recording triggers shrink to four bullets.
- **`version-check.py` exposes `engine_status()`** for reuse. Its output is unchanged.
- **`# consumers:` headers** now name the file that actually references each script.

## [0.23.0] — 2026-10-09

### Added

- **Command frontmatter.** Every file in `.claude/commands/` now opens with a quoted `description:` and, where it takes arguments, an `argument-hint:`. Claude Code's command list and model invocation read these, so `pc-backstory` and `entity-questionnaire` now say what triggers them. New commands need both fields.
- **`scripts/commands-list.py`.** `/commands` now builds its list from the command files, so it can't drift. Replaces two hand-kept lists that had each lost six or seven commands.
- **`session-brief.py` reports search-index staleness** (`SEARCH INDEX STALE` / `NEVER BUILT`). `/session` Step 2 relays the line instead of reading the stamp and running `git log` by hand.
- **`threads-brief.py` prints each entry's `[campaign: …]` tag**, so a homebrew `/session` can drop Strahd threads without opening files. The tag is appended; existing fields are unchanged.

### Changed

- **`/session` Phase 3B Step 1 runs `threads-brief.py`** instead of sweeping historian frontmatter by hand.
- **The index staleness check lives once in `scripts/lib/common.py`** and covers `spitball/`, matching the indexer. `todo-brief.py` used to miss it.
- **`/recap` Phase 7 deletes the `recaps/inbox/` notes file** once Phases 4–6 are written. The summary reported this before, but no step actually did it.
- **The root CLAUDE.md command list is gone.** It now points to command frontmatter and `/commands`, and saves about 2KB a turn.

### Removed

- **`.claude/commands/entity-ingest.md`.** The `CLAUDE-INGEST` auto-trigger now runs the full Ingestion Mode in `entity-questionnaire.md`. The stub skipped the `filled: true` marker, so questionnaires taken in through it never surfaced as `/session` cameo candidates. Nobody typed it, and its only caller is updated, so nothing breaks.

### Fixed

- **Stale `.ps1` references.** The `region-*` rows in the scripts table and `/event`'s semantic-search call now use the `.py` scripts.

## [0.22.0] — 2026-10-09

### Added

- **Player agency has its own rules: `meta/player-agency.md`.** It sets out what counts as a real choice (the players know they're choosing, more than one option works, the options cost different things, the consequence shows up), and party choices versus character choices. It gives a light cadence: about two or three party choices and one character choice a session, no run of more than about three reaction-only scenes, and at least one choice per act that changes where the story goes. Committed beats stay; choices are added around them. It also lists the railroad warning signs.
- **`/review` Pass 5 — Choices.** It counts the plan's real choices, flags the railroad warning signs, and proposes a draft fix for each one. It never reopens committed beats.
- **`choices:` historian session field (optional).** `/recap` asks a new Phase 2 question 8 and records what the party or a player decided and what it set in motion. `/session` greps recent `choices:` and pays at least one off visibly.

### Changed

- **`/session` reads `meta/player-agency.md` every run.** Choice bullets are marked `Choice (party):` / `Choice (<PC>):`, the plan is checked against the cadence before it's written, and a **Choices** bullet in the Engine notes lists every choice point.

## [0.21.0] — 2026-10-08

### Added

- **Red dots on the world map are big cities.** Every city-registry marker stands for a city of thousands or more. A graduated dot gets `importance: major` or `critical`, a population to match, and a trade route. Towns, villages and hamlets stay below map resolution and never get a dot. Stated in `maps/CLAUDE.md`, `meta/settlements.md` and the registry header.

### Changed

- **Calenmere's river names are settled.** The Moorthistle is the upper border branch (purple/red), a tributary of the **Broadwend**, the big river to the bay (red/navy). River F is now the **Bayward**, which reaches the bay at Tassad. The world master's old "Bayward River" label sat on the Broadwend, and its Inkarnate relabel is pending (`todo-worldmap.md`).
- **Registry IDs in the Calenmere Basin draft re-matched.** Nine of the twelve anchors pointed at the wrong dot. Each now comes from its political-overlay number. Tassad's alias moved from `C05-04h` to `C06-05a` (overlay dot 17, where its label now sits).

## [0.20.0] — 2026-10-08

### Added

- **`/review` polishes a session plan before it runs.** `/session` builds a plan; `/review [session] [--ready]` reviews one that already exists, in four passes. **Description & Dialogue** fills thin scenes and keeps lines plain and cued. **Names & People** checks new names for collisions and describes each person once, where they first appear. **Cuts & Renames** sweeps a removed or renamed node out of `_flow.md`, the Engine notes and the frontmatter. **New Canon** lists every fact the plan sets under *For `/recap`*. Standalone runs present numbered findings and apply what the DM approves; `--ready` sets `state: planned`.

### Changed

- **The Description & Dialogue Pass moved out of `/session` into `/review`.** `/session` Phase 6 now reads `review.md` and runs its passes when it writes the plan, so `/session` no longer loads the pass on every run. Behavior is unchanged, apart from the three new passes now also running at write time.

## [0.19.0] — 2026-10-08

### Added

- **NPC lines are plain and cued.** `/session`'s Description & Dialogue Pass gains two rules. **Plain over clever:** each line states its point outright, so the DM gets it on a cold read. If a line needs a gloss, rewrite the line instead. **Every line has a cue:** the plan says what in the scene prompts the line, and a character tangent is set off by a concrete object or moment, ideally from the location's file. Prompted by Session 30's review, where several lines read as vague and one tangent came from nowhere.

## [0.18.0] — 2026-10-07

### Added

- **Difficulty checks the party's offense, not just the monsters'.** Session 29's fight was planned at Standard lethality and ended in two rounds with almost no damage taken. Most raiders died before acting. `meta/difficulty.md` gains **rounds-to-clear (RTC)**: total monster HP ÷ party damage per round. Under 2 means the fight ends before rounds-to-down (RTD) matters. It also adds a **one-hit body** rule: a monster with HP at or below one average PC hit counts as half a body. Fights meant to sting need RTC 3+ and at least one creature that survives two hits.
- **Light attrition sizes the main fight at Hard or Deadly.** A fresh party facing one fight goes all-out, so few fights means each must be harder.
- **Encounter writeups state their DMG XP band** before the RTD and RTC checks (`/session` updated to match). Session 29's ~500 XP sat under Easy and nothing flagged it.
- **Budget at the level the party fights at.** Level-ups planned before or during a fight count in its math.

## [0.17.0] — 2026-10-07

### Added

- **Session runner shows a written recap.** A session plan may carry its own `## Recap` section, a hand-written read-aloud version. The runner's recap card leads with it in place of the previous session's one-line description, and the plan panel leaves it out so it isn't shown twice. Entities it mentions are picked up like the rest of the recap. Plans without the section render as before.

## [0.16.0] — 2026-10-05

### Changed

- **Spitballs may be deleted at any time.** This reverses the old "nothing is ever deleted" rule in `meta/spitball.md`. Nothing outside `spitball/` may link to a spitball: canon, plans, player files and `/todo` must carry the substance themselves, and anything important gets relocated (suggest it to the DM). Every spitball now opens with that instruction as a blockquote. `/spitball` writes it into new files, and `--promote` copies the idea into the flow node instead of linking back. Stated in `CLAUDE.md`, `meta/spitball.md`, `spitball/README.md` and the command. **Breaking for anything that links into `spitball/`.** The existing links (Session 29's plan, MacLeod's player file, `/todo` item 69) were replaced with the content itself.

## [0.15.0] — 2026-10-05

### Added

- **Session runner shows what's established.** A session folder can carry an optional `_established.md`: table-safe facts about the town, region and world, one `##` section per scale. `scripts/session-cards.py` sends it as `established`, and the runner's side panel lists it under **Established**, above the session plan, with wikilinks opening their entities. Session 29 has one, built from its `_world-questions.md` prep (Ashford; Stonemarch and the Moorthistle; Velmora and Aethryn), with DM-only lines marked.

## [0.14.0] — 2026-10-05

### Added

- **Battlemaps, rendered from text.** A session's maps are now text grids kept beside the plan (`<session folder>/maps/*.txt`, one char per 5-ft square, gitignored as local reference), with tokens, zones and labels by grid ref. `scripts/battlemap.py --session <n>` renders each one twice into `maps/battlemaps/session-<n>/` (gitignored): a clean VTT image, 70 px a square (`--px 100` for Foundry), and a DM key with grid refs, tokens, zones and a legend. Session 29 has three: the New Wing fight, Halsby's woods, and the Lioness's old core. Its plan now names each position by grid ref.
- **Standing location maps.** `maps/battlemaps/<location>/` holds maps of a place that are kept and grown across sessions, rendered beside their layout (`battlemap.py <folder>`). The Golden Lioness has two: indoors (ground floor, core and wing) and outdoors (the lot, with open ground west, southwest and south for base building, down to a dock on the tributary). Grid refs now run past Z (AA, AB…).
- **Two map kinds, no hybrids** (`maps/CLAUDE.md`). Battle maps (5-ft squares) are built in Roll20, where walls, doors, fog, lights and GM-layer reveals live. Overview maps (world, region, town; anything coarser) are built in Inkarnate. A map is never both: a place that needs both gets two maps.
- **Town-scale maps.** A layout can set `scale: <feet per square>` (default 5). Ashford has a first draft at 25 ft a square (`maps/battlemaps/ashford/`): the tributary bending behind the Lioness and south past the ford, the market square, and markers for the named places. Most placements on it are not canon yet, and the map says which.

## [0.13.1] — 2026-10-05

### Fixed

- **Session runner froze on cards with indented quotes or headings.** The markdown renderer never moved past an indented `>` or `#` line (Scene 5's read-aloud box in Session 29), which hung the tab. Indented quotes and headings now render, and no line can stall the renderer again.
- **Session runner search now finds confirmed loot.** Items in `meta/loot-options/` with `status: confirmed` (The Shadowless Spear, Earshot Crystals, The Unfinished Binding) are indexed as items, open in the side panel labeled "loot", and resolve the plan's `[[wikilinks]]` to them. Options still under discussion stay out.

## [0.13.0] — 2026-10-05

### Added

- **Description & Dialogue Pass in `/session`.** It runs when a plan is saved to `scheduler/`, and again when the DM confirms a draft as `planned`. The pass walks every scene and flow node and fills the thin spots: a read-aloud box before any choice the players make from what they see, 2–4 sample lines per speaking NPC (plus their replies to likely pushes and to each branch outcome), what a discovery feels like, how each planted name gets said, lines for the enemies mid-fight, and a line for each contingency whose tone changes. Everything it adds is marked as guidance for the DM to improvise from, not a script. It is grounded in the entity files, leaves unset canon as `<placeholders>`, and files each addition under the existing node heading so the session runner shows it on the right card. Session 29's plan got the first pass.

## [0.12.0] — 2026-10-05

### Added

- **Session runner page** (`app/pages/home/session.html`; `npm run home`, then the **Run session** button or `/session.html`). It walks the next planned session one card at a time, one card per flow-chart node. Each card shows the node text, any plan notes from `_flow.md` that name it, branch buttons for the real forks, and the scene's written prose underneath. When a scene runs in parallel with no arrow into it (Halsby's intro), the runner offers "Cut to Scene 1b" first. Dashed edges show up as asides. A map rail jumps to any card. The side panel holds entity search, the party strip, entities on the current card and scene, the act roster, and the plan's other sections. An entity opens with its canon/pool/plan layer and the session's NPC quick-ref. Keys: → / Enter go forward, 1–9 pick a branch, ← steps back, `/` searches. The walked path survives reloads and can be copied for `/recap`. Auto-surfacing skips the other season's entities and PCs; search still finds everything. `$SESSION` picks a different session folder.
- **"Previously on…" card.** Every session the runner loads now opens on a recap of the session before it. The card is built from that historian record's `description`, `recap` and `cliffhanger` fields, in the CLAUDE.md recap format: a narrative lead, then TL;DR bullets (party status, the plan's `loose_threads`, the cliffhanger), then the full recap, collapsed. Nothing needs writing by hand: it appears once `/recap` has canonized the previous session. When the previous session belongs to the other season, a "Last time in this world" block adds the last session played in this one.
- **Scene notes grouped by card.** A scene's written prose shows as one collapsed dropdown per flow-chart node, in flow order: number, kind, id and title on the closed row, the prose inside, and a jump button. Prose is filed by `#### S1_ID — title` headings in the plan's `### Scene` sections; text above the first one becomes a Setup dropdown, and a node with no prose shows its flow-chart lines. A plan without node headings falls back to one dropdown per bold label (`**Beats:**`, `**The fork:**`). Session 29's plan is re-filed this way, lines moved but not reworded.
- **`scripts/session-cards.py`**: the extractor behind the page. It reads frontmatter only for entities, and the page fetches bodies on demand.

### Fixed

- The home page's Python runner (`app/pages/home/run-python.ts`, now shared by both data plugins) tries `uv run` first and moves to the next interpreter on any failure. Before, a Windows Store `python3` stub stopped the search, so the timeline page loaded no data.
- **Timeline axis no longer mixes in real-world dates.** Before, a session with no `in_world_end_date` was plotted at its real-world `played_date`, so the Strahd axis ran from year 734 to 2026 and crushed every beat. `scripts/timeline-data.py` now uses the real-world fallback only for a campaign that has no in-world session dates at all. Otherwise a session missing the field takes the previous session's in-world date, and the script prints a warning to stderr. Sessions 16–28 now carry `in_world_end_date`, worked out from their canon event dates.

## [0.11.0] — 2026-10-04

### Changed

- **"Google Drive notes" are written for the players.** `/transcript` Phase 6 now builds party-facing notes when the DM asks for "google drive notes": nothing the characters didn't experience at the table (no DM asides, NPC secrets, unlearned names, or foreshadowing), and no conclusions drawn for the party (NPC statements reported as claims, theories credited to whoever voiced them, open questions left open). Possible spoilers are listed for the DM in the hand-off message, not in the document. The `(??)` mark and its legend are dropped from the export. The root `CLAUDE.md` pointer is updated to match.

## [0.10.0] — 2026-10-04

### Added

- **`meta/loot-options/Party/` holds shared party items**, one copy per PC. It has no README and sits outside the nine-per-character composition rule. Item files use `character: Party` and `player: all`. Documented in `meta/loot-options/README.md`.
- **The Earshot Crystals** (`Party/misc/`), the first party item, `status: confirmed` for Session 29: touch-to-speak telepathy, words only and past language, to one holder in sight or to "all" holders within 300 ft, with unlimited use. Common, per crystal.

### Changed

- `scheduler/sessions/Session 29 The Mistake/`: the session's item is now the Earshot Crystals, looted from Nella's raiders, who carry them but never use them. Nella and a few of her crew keep theirs and can overhear "all" messages, a hidden twist revealed only after many fights with her. Dip's Common is removed, and no personalised item lands in Session 29. The act's `## Loot`, the `S1_LOOT` flow node (now `[-]`), `The Stolen Casks`, `Nella` and todo item 15 follow suit.

## [0.9.0] — 2026-10-04

### Added

- **Loot menu items are `draft` or `confirmed`.** Every item file in `meta/loot-options/` now carries `status: draft`. The DM flips an item to `confirmed`, and adds `confirmed_for: "Session NN Name"`, once it is committed to a specific handout. Confirmed is still not canon; that happens at `/recap`. All 45 existing items start at `draft`.
- **A draft item is never named outside `meta/loot-options/`.** Plans, flow graphs, missions, acts, the todo dashboard, questionnaires and notes refer to a draft by character and slot ("a Common from Dip's folder"). A name in a plan reads as a decision and gets carried forward as one. Only the DM confirms an item; a recommendation does not. Written into `meta/loot-options/README.md` (the canonical home), `meta/rewards.md`, the `/session` reading list, and `meta/flow-graphs.md`'s honesty rules.
- **Act-level loot rules for Act 1.** `scheduler/acts/Act 1 - The Hearth at Ashford.md` gained `## Loot`, which overrides `meta/rewards.md` for the act: the party reaches level 5 by the December finale with levels granted one PC at a time, five Uncommons plus one Rare, surprise handouts, and an item history of at most three sentences. The clash between per-PC levels and the rewards file's announce-the-trigger rule is recorded as unresolved.

### Changed

- `scheduler/sessions/Session 29 The Mistake/`: the raid's Common now goes to Dip, not Iggy, and names no item until one is confirmed. The Second String is no longer the recommendation. Iggy keeps his viol spotlight beat.

## [0.8.0] — 2026-10-04

### Added

- **Every session gets its own folder.** `scheduler/sessions/Session {NN} {Name}/` holds the plan as `Session {NN} {Name}.md`, its flow chart as `_flow.md`, and (for `scope: linked`) its encounter files. The whole folder moves to `historian/sessions/` at `/recap`. Previously only `scope: linked` sessions got a folder and inline ones were a bare file. The main file keeps its folder's name, so `[[Session {NN} {Name}]]` resolves either way. **Breaking for anything that globbed `scheduler/sessions/*.md` one level deep** — see Fixed.
- **`_flow.md` — a per-session flow chart in the repo.** A mermaid graph of one session's scenes, forks and fail paths, living beside the plan it maps and travelling with it into the historian. Not an entity: the `_` prefix keeps it out of `validate.ps1`'s entity checks and the semantic index, and it carries no frontmatter. It is a graduated snapshot of the matching file in the act's flow graph set, which stays the live source and the one `flow-status.py` reads; `/flow --session <n>` regenerates the pair.
- **`entity_md_files()` in `scripts/lib/common.py`** — recursive entity discovery that skips `_*` and `CLAUDE.md`, matching the exclusions `validate.ps1` already applied. Every script reading a session directory now goes through it.
- **A plain-language rule for flow graph labels.** Node labels are written as sentences carrying the runnable detail — the roll, the DC, the round count, who wants what — and branch edges are labelled with the choice in the words a player would use. A node reading `casks or Sable?` is a worse map than one that says two bandits are walking the last cask to a cart while the big one is two rounds from dragging Sable out the door. Recorded in `meta/flow-graphs.md` alongside the snapshot convention.
- **`scheduler/missions/The Stolen Casks.md`** — Act 1's opening mission, covering act sessions 1 and 2 (campaign sessions 29 and 30). The Golden Lioness's undelivered ale is carried off during the raid the party lands in; the party runs the cart down before it reaches a Duskwater fence. Both outcome branches are filled, and Nella escapes both times by design.
- **`scheduler/sessions/Session 29 The Mistake/`** — the first homebrew session plan, for Tuesday 2026-10-06. Five scenes, `state: draft`. Numbered **29 continuous**, not "Session 1": act-relative numbering is shorthand only, and a second "Session 1" would collide with Strahd's and break `session-brief.py`'s counter.
- **Rest Clock initialised for Redwater.** `scheduler/campaign/Redwater.md` gained `## Current State (after Session 28)` with a `### Rest Clock (as of: Session 28)` block. The 2026-10-01 long-rest ruling makes it determinate — the transit *is* the rest — so the clock opens at 0 rounds, 0 short rests, freshly rested, with the 24-hour gate restarting at the transit. The clock was initialised at the season swap, not carried across it; Barovia's rounds stay in `Curse of Strahd.md` for when that season resumes.

### Changed

- `meta/schemas/session.md` — canonical paths rewritten for the folder layout; scene blocks are `### Scene N — [Title]`, not `####`. The old spec nested `####` under `##` and tripped MD001 on every session file, and MD001 is not in the pre-commit hook's auto-fixable set, so the prescribed layout could never pass lint.
- `.claude/commands/session.md` — always creates the session folder; offers `_flow.md` alongside the plan.
- `.claude/commands/recap.md` — moves the session's whole folder to `historian/`, not just the file.
- `.claude/commands/flow.md` — Phase 4 mirrors each designed session's graph into its session folder, with the graduation ask spelled out for sets living under a gitignored working directory.
- `scripts/session-brief.py` — the `## Current State` stamp check now accepts `(after Session N)` **and** `(as of: Session N)`. The two campaign files had drifted to different spellings and only one could satisfy the regex.
- `scheduler/acts/Act 1 - The Hearth at Ashford.md` — `campaign: [[Redwater]]` → `campaign: homebrew`, matching the documented season-axis rule. The Redwater edge survives through `relates_to`. Its `## Open` section no longer claims the missions are unwritten.
- `historian/characters/pcs/Iggy.md` — the viol hook ("decode the unfinished final song trapped in the viol") moved `open` → `seeded`, because the Session 29 plan commits a beat to it. Becomes `paid` at `/recap` if it lands.
- `todo-dashboard.md` — item 15 is down to the loot pick; the mission and session plan it asked for now exist.

### Fixed

- **`session-brief.py` reported the wrong next session.** It computed `max(session_number) + 1` across both session directories, so a planned-but-unplayed scheduler artifact pushed the counter past itself — with Session 29 drafted and Session 28 the last played, the brief announced "Next session: #30" and flagged a false milestone. It now reports the first *unplayed* session and names its existing plan.
- **Four scripts globbed session directories one level deep** and found nothing once sessions moved into folders: `session-brief.py`, `session-state.py`, `todo-brief.py`, `party-status.py`. All four now use `entity_md_files()`. `timeline-data.py`, `timeline-gantt.py` and `get_played_spotlight_sessions()` already recursed.
- `meta/loot-options/` is not short of items. A prior audit recorded Iggy's folder as holding 1 weapon against the documented 3; all five PC folders are full at 3 weapons / 3 armor / 3 misc. The Second String sits in `misc/`, not `weapons/`.

## [0.7.0] — 2026-10-02

### Added

- **`/spitball` — non-committal story idea capture.** `.claude/commands/spitball.md` files a loose idea the moment it is spoken, develops it as far as interest carries, and keeps it searchable for later mining. Built for a phone over `claude remote-control`: the capture rule is **file first, develop second** — the file hits disk on the first turn, before any riffing, so a dropped connection costs nothing, and follow-up turns update that same file. The command is forbidden from interrogating the DM for fields; it infers `subtype`, `campaign` and `target` and is wrong cheaply.
- **`spitball/` — a new tracked folder role.** One folder per target act, keyed to the act's full slug rather than a bare `act-1/` (both campaigns currently have an Act 1), plus `unassigned/` for ideas with no home yet. Tracked in git, unlike `workshop/` and `pitch-log/`, because the whole point is reading them back months later from a different machine.
- **Entity mode.** `/spitball <entity name>` is a lookup rather than a capture: it answers with about four lines on where that entity currently stands — what it is, its situation, the two or three relations that matter, anything unresolved — plus a line naming any spitballs or flow-graph nodes that already reference it, then asks one open question and stops. Nothing is written; the *next* message is the idea, filed with the entity pre-populated in `relates_to`. A name inside a proposition (`what if Nella turns on Bane`) is still an idea, and ties are broken toward filing.
- **`meta/spitball.md`** — frontmatter schema, the five-state lifecycle (`raw` / `developed` / `used` / `parked` / `killed`), the capture rule, and the honesty rules. Nothing is ever deleted: a killed idea is cheaper to keep than to re-think.
- **`scripts/spitball-brief.py`** — the pile filtered by frontmatter: target act, kind, campaign, state, heat. Hides `used` and `killed` by default so the live pile is not buried.
- **Mining routes, all four live.** Spitballs are indexed with `source_dir: spitball` so `semantic-search.py --source spitball` finds them by meaning; `/session` Phase 1 and `/flow` Phase 1 surface the ideas aimed at the act being planned, as candidates only; and `/spitball --promote` lands an idea in the act's flow graph as a `[?]` **open** node — becoming a node is not approval.

### Changed

- `scripts/validate.ps1` — `spitball/` excluded from the link check. Half-formed ideas are expected to name things that do not exist; that is the point of them, and without the exclusion every spitball would break graph validation.
- `scripts/index-entities.py` — `spitball` added to the default `--dirs` and to the orphan-prune guard set.
- `scripts/semantic-search.py` — `spitball` added to `--source` choices, so canon searches can also deliberately exclude it. **A spitball must never surface as if it were canon.**
- `meta/flow-graphs.md` — seventh node class `fail` (dusty red, dashed) for designed setbacks and fail floors. Previously these took the grey `open` class, which means *undesigned* — miscoloring documented work as a gap.

## [0.6.0] — 2026-10-02

### Added

- **`/flow` — act flow graph sets.** `.claude/commands/flow.md` builds or refreshes a folder of mermaid maps for an act: an act spine with one subgraph per session, one graph per designed session, and a payoff-slots graph for undesigned room. Branches are drawn where the design actually forks, fail states route back into the spine instead of dead-ending, and inferred material is marked rather than presented as designed. Regeneration preserves existing markers by node id.
- **`meta/flow-graphs.md` — the conventions.** Id scheme, the seven node classes with their exact `classDef` lines, drawing rules, and honesty rules. Previously these lived only inside one gitignored workshop folder's README, so they could not survive a clone or be reused for a second act.
- **Commitment markers.** Every flow graph node prints `[x]` committed / `[-]` draft / `[?]` open before its id, so the chart doubles as a readiness tracker. `[x]` requires a four-part gate: the DM said so, backing notes exist, no open upstream, and the beat is repo-conformant. **The engine never self-commits** — it proposes, the DM flips. Each graph file ends with a commitment ledger naming the backing source for every committed beat.
- **Node ids are printed in the labels.** A node's visible first line is its literal mermaid node id (`S1_EXAMPLE`), which makes a beat nameable in conversation and findable with a grep — the id is otherwise invisible in a rendered diagram.
- **`scripts/flow-status.py`** — commitment coverage per graph, plus two integrity checks: committed beats sitting downstream of uncommitted work, and labels whose printed id does not match the mermaid node id. Discovers sets repo-wide, or scans one with `--set`.

## [0.5.0] — 2026-10-01

### Changed

- **The world is named: `data/locations/regions/Homebrew World.md` → `data/locations/regions/Aethryn.md`.** **Aethryn** (AITH-rin) — Greek *aithēr* "upper air" + Welsh *bryn* "hill" — chosen 2026-10-01 from a shortlist built on Latin/Greek/Germanic/Welsh roots, deliberately carrying **no** tie to the Whatwill cosmology so the name commits the setting to no biome, faction, or founding event. `"Homebrew World"` and `"The World"` are both kept as aliases, so existing `[[Homebrew World]]` links still resolve; the nine entities that used the old link were repointed to `[[Aethryn]]` anyway. The entity's `state: draft` — held only until the world had a name — is lifted to `stable`.
- **World and campaign names are separate layers.** **Aethryn** is the world; **Redwater** is the first campaign run in it. A later season in the same world gets its own campaign document and does not rename the world.
- **`campaign:` field clarified in `CLAUDE.md`** — the value is the **season axis** (`strahd` / `homebrew`), not the world name and not the campaign document. Everything set in Aethryn stays tagged `homebrew` no matter which campaign runs there, so the 46 existing `campaign: homebrew` entities were left untouched by the rename. This replaces the old `campaign: <new-world-name>` wording, which implied a repo-wide retag on naming day.
- `scheduler/campaign/Redwater.md` — naming note rewritten (both layers now settled), setting link repointed, and the "Name the world and campaign" checklist closed except for the still-missing naming questionnaire.
- `todo-dashboard.md` — item 19 (world has no name) deleted per the open-items-only rule. Item 26 rewritten: `questionnaires/world/naming/world-naming.md` still does not exist and `naming-status.py` still errors, but what it owes now is the *remaining* naming work (regions, factions, provisional map labels), not the world's own name.

## [0.4.0] — 2026-10-01

### Added

- **`meta/rewards.md` filled.** The file was a blank template; every section now carries real rules. Gold is stated as **party totals** calibrated to five PCs at level 4–5 (minor 10–50 gp · standard session 100–250 · major 300–700 · exceptional 1,000–2,500), with a ×2.5-per-tier scaling rule and the base-building numbers (250–500 gp/room, ~25 gp/PC/downtime) named as the anchors they were tuned against. Magic items are scarce-but-present with a Common ceiling and ~one Uncommon per PC per act, strict RAW attunement, and no magic shops — permanent items come from loot, payoff, or a station the party built. Narrative rewards carry a recordability test: if it can't be written into an entity's frontmatter, it was flavour, not a reward.
- **Leveling system decided: hybrid milestone with an announced track** (Jeff, 2026-10-01). The DM decides *when* a level lands and paces it on the fly; naming the next trigger out loud is the part that is **not** optional. No XP bookkeeping, so a roleplay-only session can still level the party. Soft band of 2–4 sessions per level at tier 1–2. This is the standing answer to the Session-28 levelling complaint, and it pairs with the deliberate level-4 hold on arrival — when a level is held, loot carries the weight, and a held level with no item compensation is the failure mode the file names outright.
- **`meta/loot-options/`** — a five-option item menu per PC (Iggy, Dip, Luci, Odibli, Halsby) — one folder per character, with `weapons/`, `armor/` and `misc/` subfolders and **one item per file**, each carrying `class`/`form`/`rarity`/`attunement` frontmatter so the folder can be filtered or scripted without parsing prose. The character's own `README.md` holds the character and player read, pick order, and caveats. Each character gets **one weapon, one piece of armor, three misc**, and every option is stamped for the current **levels 4–5** bracket with rarity, attunement, and an **At 6–8** scaling line. **Items carry no plot** — nothing is tied to a location, NPC, faction, or open thread, so the story picks items rather than items committing the story; where an item comes from is a session-planning decision and is deliberately not recorded. Every option is argued from the character's sheet and the player's observed table behavior, since `meta/players/` is still blank templates. **Not canon and not entities** — `meta/` is outside the entity dirs, so nothing here is validated, indexed, or in the world until it is handed over at the table and canonized.

## [0.3.0] — 2026-10-01

### Added

- **`scheduler/acts/Act 1 - The Hearth at Ashford.md`** — the first homebrew act, filled from the workshop design. The Cael–Marlow feud is the `central_conflict` but runs as discoverable backdrop; the spine is the Golden Lioness foothold and its three-tick stake ladder (10% → 25% → 40%). Carries the act-level difficulty curve (5/10 → 8/10 with opt-in escalation), which lives here and deliberately **not** in the campaign-agnostic `meta/difficulty.md`. Four designed sessions inside the season's eight slots. Missions are still unwritten.
- The Act 1 entity spine, graduated out of `workshop/` into `data/`: [[Ashford]] as a city, [[Aashal-Groon Mellenegon Borak]] ("Asher") as a `tier: lesser` deity, the two feuding lords, Harrow Bane's band, and the four Ashford townsfolk. The Golden Lioness gained `city: Ashford` and an unopened brewery wing **added on top of** its existing character.

### Changed

- **`scheduler/campaign/Homebrew Campaign.md` → `scheduler/campaign/Redwater.md`.** The campaign is named Redwater, after the red/purple border-river the opening act turns on. `"Homebrew Campaign"` is kept as an alias, so existing `[[Homebrew Campaign]]` links still resolve — nothing needs updating. The **world** is still unnamed; that rename, when it comes, applies to `data/locations/regions/Homebrew World.md`.
- Sable Wren's patron reskinned from the unnamed hearth spirit to Asher, the deep-water being under Ashford. Her pact, her tenure, and how she got the building are unchanged.

### Fixed

- **`Act 1 - Placeholder` was retagged `campaign: strahd`.** The 2026-09-30 `/transition` run retagged it `homebrew` on the assumption it would become the first homebrew act — but four Strahd historian sessions (11–14) and the paused mission `Find the Wine Wizard` reference it as their act, so a homebrew tag pointed five Strahd records at a homebrew act. The file is now explicitly a Strahd stand-in, and the homebrew act is a separate file. No Strahd record was edited; their links still resolve.
- **`scripts/session-state.py` reported the wrong party.** It read the party table from `campaign_files[0]` — whichever campaign file globs first, which alphabetically is `Curse of Strahd.md` — so `[PARTY]` listed the paused campaign's four PCs instead of the active campaign's five, omitting Halsby entirely. It now picks the file with `state: active`. Same class of bug as `9fbdbaa`, which fixed it in `session-brief.py` and left this script alone.

## [0.2.1] — 2026-10-01

### Fixed

- `Halsby.md`'s `campaign: homebrew` tag was invisible to every script. `get_frontmatter` in `scripts/lib/common.py` only accepts a scalar line that ends immediately after its value — an inline `#` comment makes the whole line fail to match, so the field is **silently dropped** while still looking correct in the file and in Obsidian. The campaign-separation tag the comment was explaining was the thing the comment broke. Comments moved to full lines above their fields; `level: 4` now parses too.

### Added

- `meta/entity-creation.md` → Obsidian Frontmatter Rules: never put an inline `#` comment on a frontmatter scalar; put the note on its own full line above the field.

## [0.2.0] — 2026-10-01

### Added

- Sub-day timeline placement: optional `daypart` (`dawn|morning|midday|afternoon|evening|night|late`) and `order` (1-based intra-day sequence) sibling fields on events, so the beats a session mints spread across the day instead of stacking on one point. Contract in `meta/calendar-template.md`; inference rules in `meta/events.md`; `/recap` assigns both. Chronicle rows carry them as flag tokens (`daypart=evening order=3`).
- `daypart`/`order` support in `scripts/timeline-data.py` and the interactive renderer (`applySubDayOffsets` in `app/components/charts/_common/helpers/axis.ts`, windows in `calendar.ts`). The mermaid `/timeline` gantt stays day-granular and ignores both.
- Companion affinity: `affinity:` on the creature schema, and affinity scope widened to **PC↔creature-companion** (bi-directional). Backfilled on Bosco and Sergei Rubelgerd.
- Affinity band-crossing → timeline: a nudge that moves a pair into a new band is flagged as an automatic event-promotion candidate in `/recap` Phase 5.5.
- `## Party` roster on `scheduler/campaign/Homebrew Campaign.md`, which had none. All five PCs, with afflictions carried per the Session 28 seam ruling. The roster is the per-season source of truth for party membership; PC files keep only their debut-campaign link.

### Changed

- `/recap` now always sets `in_world_end_date` on the session record — without it the timeline plots the session by real-world `played_date` and it lands in the wrong era.
- `scripts/contribution-balance.py` derives its player list from `meta/players/` instead of a hardcoded four names, so adding a player no longer needs a script edit.

### Fixed

- `scripts/party-status.py` selected the campaign file **first alphabetically** rather than the one with `state: active`, so the active homebrew season read its party table out of the paused `Curse of Strahd.md`.
- The hardcoded player list in `scripts/contribution-balance.py` counted a fifth player's contributions but never rendered their row — 22 existing `contributed_by: kellan` entities had been invisible in the ledger.

## [0.1.0] — 2026-10-01

### Added

- Project versioning: `VERSION` anchor, this changelog, and bump rules in `meta/versioning.md`.
- `scripts/version-check.py` — flags when engine files changed since the last version bump.
- Session-start orientation: agents read `VERSION` + recent changelog entries to report what changed since they last worked here.

This is the engine baseline. Pre-`0.1.0` history is in git.
