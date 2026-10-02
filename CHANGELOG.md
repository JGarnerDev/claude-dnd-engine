# Changelog

All notable engine changes are recorded here. This file tracks the **engine** — commands, scripts, schemas, meta rules, the charting app, and structural campaign changes (new acts, campaign transitions, canon retcons). Routine campaign content (new entities, normal session canonization) is **not** logged here; it lives in git history and the historian.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning rules live in [`meta/versioning.md`](./meta/versioning.md).

The version in [`VERSION`](./VERSION) always matches the top entry below.

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
