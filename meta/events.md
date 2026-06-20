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

A beat's `track` is `category` or `category:member`. Shipped categories (`app/components/charts/swimlane/helpers/tracks.ts`): `party`, `character`, `faction`, `continent`, `world`. A lane appears once a beat references it.

- **Explicit wins.** Set `track:` on the event to place it exactly (e.g. `track: faction:The Partenariats`).
- **Auto-fan fallback.** When an event has **no** explicit `track`, the extractor fans it onto member lanes derived from its `participants` / `relates_to` (factions → `faction:<name>`, NPCs → `character:<name>`); failing that it lands on `world:<campaign>`. Curate when you care, automatic when you don't.

## Canon-pending (unratified lore)

Lore not yet ratified by the DM (e.g. Paul's Whatwill corpus) is ingested as **`exists: false`**. This is an *out-of-world* "the DM hasn't confirmed canon" status — **not** `state: disputed`, which is an *in-world* "accounts conflict" quality.

- The extractor **drops `exists: false` events** from player-safe exports and **shows them only under `-Full`** (the home page) marked as a **draft** beat — visible to the DM, never leaked to players.
- The DM graduates one by flipping `exists: true`.

## Where it lands

- Whatwill / homebrew world events → `data/events/` (campaign-agnostic or homebrew-tagged), `exists: false` until ratified.
- Strahd / played-session events → `historian/events/`, `campaign: strahd`, `exists: true`.
