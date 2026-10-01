# Graduation plan — todo item 13 (Act 1 → `data/` + `scheduler/`)

**Temporary file. Delete it in the last commit of this branch.** It exists only to carry
state across sessions while the Act 1 graduation runs. Completion detail belongs in git
history and `CHANGELOG.md`, not here.

- **Branch:** `feat/ashford-graduation`
- **Started:** 2026-10-01
- **Source of truth for content:** `workshop/first-homebrew-act/` (gitignored scratch —
  `FACTS.md`, `DECISIONS.md`, `characters/`, `drafts/`, `topics/`)
- **Gate:** `workshop/CLAUDE.md` — nothing leaves the workshop without Jeff's explicit
  per-batch graduation confirmation. Each stage below is its own confirmation point.
- **Why now:** Ashford is the only missing entity behind all 4 `validate.ps1` link errors,
  and it blocks todo items 14 (fill Act 1) and 15 (first mission → `/session`).

## Order of work

Stages are ordered by what unblocks what. `[ ]` open · `[~]` in progress · `[x]` done.

### Stage 1 — Ashford (unblocks the validate errors)

- [x] `data/locations/cities/Ashford.md` — `location/city`, `exists: false`,
      `campaign: homebrew`, `state: troubled`, `global_location: [[Stonemarch]]`.
      Landed in `c8b092e`
- [x] The 4 dangling `[[Ashford]]` links resolve. `validate.ps1` is down to 15 errors,
      all of them the pre-existing placeholder-geography class (todo item 46) — none
      from this act

Facts that must survive the write: riverside borderlands town on the small tributary
feeding the red/purple border-river · named for its **ford** (the southern crossing, and
the Session-1 raid vector from Duskwater, E15a) · in **Stonemarch**, Lord Corren Cael's
fief · preyed on by deniable overland raids · western bones / fantasy skin (G20).

No registry ID — Ashford was newly placed between political-map markers 10 and 9, so
City Registry Graduation is skipped per `meta/settlements.md`. World-grid col/row stays
unresolved until a `/region` pass.

### Stage 2 — the Golden Lioness layer

- [x] **Type decided (Jeff, 2026-10-01): minor deity.** Filed as `type: deity`,
      `tier: lesser` (the schema's enum has no `minor`), at the canonical deity path. No
      new type, so `meta/types.md` and the two graph configs are untouched and
      `meta/graph-settings.md` never comes into play
- [x] `data/deities/Aashal-Groon Mellenegon Borak.md` — `aliases: [Asher, the Red Beneath]`,
      `importance: major` (he gates the F17 brewhouse loop and carries the trust beat, so
      narrative weight stays high even at `tier: lesser`)
- [x] `data/locations/shops/The Golden Lioness.md` — `city: unknown` → `[[Ashford]]`,
      `campaign: homebrew` added, "Missing: city" callout dropped
- [x] Renovation layer added as a **new `### The new wing` section** (C10/R2). Nothing in
      the old description, staff, brews, kitchen, or regulars was cut — the undefended-new-half
      framing is layered on top of Jeff's pool text, not over it
- [x] Patron swap done in the Lioness (staff block, Origin, Story Hook) and in
      `Sable Wren.md`. Pact, tenure, and the uncanny safety of the old half all stay true;
      only the patron's nature reskins, and the safety explicitly does **not** extend to the
      new wing
- [x] `meta/trait-registry.md` — entries added for Ashford and Asher

Known warning, not a defect: `validate.ps1` flags the new deity as
`reference-catalog type 'deity' is exists:false`. `Orrowan` — the other homebrew deity —
carries the identical warning. `exists: false` is correct for ungraduated-to-canon content.

### Stage 3 — the people

Lords and antagonists first (the feud spine), then the townsfolk who speak in Session 1.

- [x] `data/characters/npcs/Lord Corren Cael.md` ·
      `data/characters/antagonists/Lady Sorcha Marlow.md`
- [x] `data/characters/antagonists/` — `Harrow Bane`, `Jorn`, `Wick`, `Nella`, each with
      `human_detail` filled per the antagonist schema's "fill it regardless of
      importance"
- [x] `data/characters/npcs/` — `Mara Tull`, `Richmond Ellesine`, `Silas Crubb`,
      `Elowen Rimetusk`
- [x] Ashford's role-only mentions became real wikilinks (the Stage 1 deferral), plus
      `rulership: [[Silas Crubb]]` and six new `relates_to` edges
- [x] Class pyramids placed before traits, per `meta/entity-creation.md`: Jorn at the
      druid working tier but disowned by the institution that defines it · Wick at the
      warlock broker tier with the deliberate wrinkle that a guild *does* sanction him ·
      Nella at the ranger working tier, come up through the poacher grade · Elowen a
      working wizard, which is more than a ford-town should have. No top-tier
      assignments — those stay DM-controlled
- [x] `meta/trait-registry.md` — five NPC lines, plus a new `## Antagonists` section
      with five more. The file had no antagonist section before, and characters belong
      under neither Factions nor Other
- [x] `validate.ps1` reports **zero** errors and **zero** warnings against any of the
      nine new files

### Already on master — do not redo

Cherry-picked from `feat/redwater-act1-graduation` on 2026-10-01 (`ff62992`):
`House Cael`, `House Marlow`, `Stonemarch`, `Duskwater`.

### Closing out

- [x] `.\scripts\validate.ps1` — 15 errors, every one of them pre-existing placeholder
      geography; nothing from this branch
- [ ] `uv run scripts/index-entities.py` — reindex, restamp `.index-built`
- [ ] `uv run scripts/version-check.py` — decide whether this clears the bump bar
      (`meta/versioning.md`); structural content graduation plausibly does
- [ ] Rewrite todo item 13 in `todo-dashboard.md` to whatever is actually left, per the
      dashboard's own maintenance rule (delete what's done, don't tick it)
- [ ] **Delete this file**

## Deliberately out of scope

- Item 4's pinned Whatwill ↔ Cael–Marlow reconciliation — group conversation, and
  `central_conflict` stays untouched until it happens
- Item 14 (fill `Act 1 - Placeholder`, rename campaign to Redwater) and item 15 (first
  mission + `/session`) — they follow this branch, they are not part of it
- Route coverage for Ashford. `meta/settlements.md` wants a route entity naming any
  `major` city, and the border-river is load-bearing lore (E14b: red's only navigable
  sea link). Worth a `route` entity later; not blocking Session 1
- Maps (items 8, 9) — human work, parallel
