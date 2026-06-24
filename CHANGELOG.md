# Changelog

All notable engine changes are recorded here. This file tracks the **engine** — commands, scripts, schemas, meta rules, the charting app, and structural campaign changes (new acts, campaign transitions, canon retcons). Routine campaign content (new entities, normal session canonization) is **not** logged here; it lives in git history and the historian.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning rules live in [`meta/versioning.md`](./meta/versioning.md).

The version in [`VERSION`](./VERSION) always matches the top entry below.

## [0.1.0] — 2026-06-24

### Added

- Project versioning: `VERSION` anchor, this changelog, and bump rules in `meta/versioning.md`.
- `scripts/version-check.ps1` — flags when engine files changed since the last version bump.
- Session-start orientation: agents read `VERSION` + recent changelog entries to report what changed since they last worked here.

This is the engine baseline. Pre-`0.1.0` history is in git.
