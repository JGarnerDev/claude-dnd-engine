# Events & the Timeline Journal

How events become entities and how they surface on the home-page charts (`app/`, `npm run home`). This is the single source for what an *event* is; the schema (`meta/schemas/event.md`) holds the frontmatter mechanics, the extractor (`scripts/timeline-data.ps1`) reads them, and `/recap` mints them.

## What an event is

An **event** is a `type: event` entity (event schema) in `data/events/` or `historian/events/` carrying a **`timeline_date`** so it plots on a chart. It is a *committed* beat in world or party history — distinct from:

- a **session beat** — the auto-plotted dot for a played session (`historian/sessions/`, extractor handles it); events are the *moments inside or behind* sessions, not the session itself.
- a **chronicle row** — a lightweight `chronicle:` line embedded in another entity; good for a quick member-lane beat that doesn't warrant its own file.
- a **pool entry** — un-committed text in `data/world-events-pool.md`; inspiration only. A pool entry graduates to an event via `/event`'s "commit as world entity" path.
- a **lore note** — descriptive worldbuilding with no fixed point in time.

If it has a *when* and a future session would point back to it, it's an event.

## The promotion rule (hybrid — rule of cool OR consequence)

The charts are a player/DM **journal**, not a strict ledger. A moment earns its own event entity if **either**:

- **Consequence** — it changed canon: a death, a pact, a location lost or founded, a faction shift a later session references. This is the world-history spine.
- **Rule of cool** — it was simply memorable at the table: a great fight, a betrayal, a clutch reveal. This is the journal's color.

Favor inclusion. Use `importance:` to scale how loud a beat draws (`major` bolds + enlarges, `minor` dims) — a fun-but-low-stakes beat rides as `minor` rather than being cut.

## Scope: World tab vs Party tab

- **World tab** (`timeline` chart) — world-scale history. Events default here. Campaign-separated by track prefix: **`world:strahd`**, **`world:<homebrew>`** (derived from the entity's `campaign` field). Lets Strahd-era world beats and homebrew deep-time coexist without bleeding.
- **Party tab** (`swimlane` chart) — history around and starting with the party. Carries session beats, promoted significant beats, secret beats, and **member lanes** for key NPCs / antagonists / factions.

## Track conventions

A beat's `track` is `category` or `category:member`. Shipped categories (`app/components/charts/swimlane/helpers/tracks.ts`): `party`, `character` (PCs), `npc`, `antagonist`, `faction`, `continent`, `world`. A lane appears once a beat references it. The character family is split by entity **subtype** — PCs → `character`, `subtype: npc` → `npc`, `subtype: antagonist` → `antagonist` — so the Campaign view's lanes don't lump every named person under one "Characters" heading. The auto-fan derives this split from the participant's subtype automatically.

- **Prefer explicit single-owner `track:`.** Give every event **one** owning lane (`character:<pc>`, `npc:<name>`, `antagonist:<name>`, `faction:<name>`, `party`, or `world:<campaign>`) so it plots exactly once. Choose the entity with primary ownership of the beat — a PC for their own choice, the NPC or antagonist for their act, a faction for a group beat (e.g. *Ireena Is Not a Blood Relative* → `faction:The Kolyanovich Family`). World-scale beats → `world:<campaign>`.
- **Tabs & the campaign floor.** The **World** tab plots everything on one axis; the **Campaign** (swimlane) tab locks its left edge to the first session beat, so pre-campaign deep history (e.g. a `world:` beat dated before session 1) is hidden there by default. A DM-only **History** toggle in the Campaign settings reveals it — breaking the lock is a deliberate choice, so leave it locked unless the DM asks.
- **Auto-fan fallback (only when `track:` is empty).** With no explicit `track`, the extractor fans the event onto a lane for **every** faction/NPC in `participants` / `relates_to` — which **multi-plots one event across several lanes** (duplicates). Use this only when you actually want a beat mirrored on each participant's lane; otherwise set a single-owner `track:`.

## Dating events (`timeline_date`)

Every event needs a numeric `timeline_date` (`YYYY-MM-DD`) to plot — the chart sort key. The prose `date:` is for humans; `timeline_date` is for the math.

- **Strahd campaign — synthetic Barovian anchor.** Barovia has no fixed present-year in the module, so the engine uses a **synthetic anchor**: the party's arrival = **`0735-10-20`** (autumn mist-season; year is an engine-chosen placeholder, not module canon). The axis advances **one in-world day per session** (a charting convenience for legible spacing, not a literal claim about in-world duration — the Death House delve was shorter): S1 `10-20`, S2 `10-21`, … S14 `0735-11-02`. **A session carries `in_world_end_date`** (read by the extractor before any real-world `played_date`) so its dot plots on the in-world axis, not at 2026; **each promoted event takes its source session's date** so events sit beside the session that contains them.
- **Sub-day spread (`daypart` + `order`).** Because every promoted event of a session shares that session's `timeline_date`, same-day beats would stack on one point on the interactive timeline. Two optional sibling fields spread them (the mermaid gantt stays day-granular and ignores both):
  - **`order`** — 1-based intra-day sequence. `/recap` assigns it as it walks the session's beats in narrative order (1, 2, 3…). Free to produce — it's just the order beats are minted.
  - **`daypart`** — coarse time-of-day (`dawn|morning|midday|afternoon|evening|night|late`), *inferred* so the DM never has to note a time. Read the session notes for cues: explicit words ("that night", "at dawn", "dusk"), or activity (burial/funeral → morning; daytime travel → morning/afternoon; a long rest advances to the next dawn; an ambush or sleep scene → night). No cue → inherit the previous beat's daypart; a session with no cue at all opens at `morning`. Time only moves forward within a session — never an earlier daypart than a prior beat unless the notes flag a flashback.
  - Big single-date world/historical events take **neither** field — they don't share a day and shouldn't spread. Full contract: `meta/calendar-template.md` "Sub-day placement".
- **World-history / deep-time (Whatwill et al.)** — relative "millennia ago" dates need a chosen epoch before they sort. That calendar decision is a separate gated task; until then, deep-time events may omit `timeline_date` (they won't plot) rather than guess.

## Canon-pending (unratified lore)

Lore not yet ratified by the DM (e.g. Paul's Whatwill corpus) is ingested as **`exists: false`**. This is an *out-of-world* "the DM hasn't confirmed canon" status — **not** `state: disputed`, which is an *in-world* "accounts conflict" quality.

- The extractor **drops `exists: false` events** from player-safe exports and **shows them only under `-Full`** (the home page) marked as a **draft** beat — visible to the DM, never leaked to players.
- The DM graduates one by flipping `exists: true`.

## Where it lands

- Whatwill / homebrew world events → `data/events/` (campaign-agnostic or homebrew-tagged), `exists: false` until ratified.
- Strahd / played-session events → `historian/events/`, `campaign: strahd`, `exists: true`.
