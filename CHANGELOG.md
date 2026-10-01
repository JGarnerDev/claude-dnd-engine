# Changelog

All notable engine changes are recorded here. This file tracks the **engine** — commands, scripts, schemas, meta rules, the charting app, and structural campaign changes (new acts, campaign transitions, canon retcons). Routine campaign content (new entities, normal session canonization) is **not** logged here; it lives in git history and the historian.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning rules live in [`meta/versioning.md`](./meta/versioning.md).

The version in [`VERSION`](./VERSION) always matches the top entry below.

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
