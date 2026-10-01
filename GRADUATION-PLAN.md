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

- [ ] `data/locations/cities/Ashford.md` — `location/city`, `exists: false`,
      `campaign: homebrew`, `state: troubled`, `global_location: [[Stonemarch]]`
- [ ] Verify the 4 dangling `[[Ashford]]` links resolve (House Cael, House Marlow,
      Stonemarch, Duskwater) — `.\scripts\validate.ps1 -Scope links`

Facts that must survive the write: riverside borderlands town on the small tributary
feeding the red/purple border-river · named for its **ford** (the southern crossing, and
the Session-1 raid vector from Duskwater, E15a) · in **Stonemarch**, Lord Corren Cael's
fief · preyed on by deniable overland raids · western bones / fantasy skin (G20).

No registry ID — Ashford was newly placed between political-map markers 10 and 9, so
City Registry Graduation is skipped per `meta/settlements.md`. World-grid col/row stays
unresolved until a `/region` pass.

### Stage 2 — the Golden Lioness layer

- [ ] `data/locations/shops/The Golden Lioness.md` — fill `city: unknown` → `Ashford`,
      drop the "Missing: city" callout
- [ ] Add the **renovation layer** (C10/R2): old characterful core stays true, plus a new
      brewery wing built-but-not-open. **Add, do not strip** — the existing pool character
      is Jeff's contribution and stays
- [ ] Patron swap: hearth spirit → **Asher** in both the Lioness and `Sable Wren.md`; the
      pact, tenure, and uncanny safety stay true, only the patron's nature reskins
- [ ] **Decision needed (Jeff):** `Asher` is a novel `patron` type. Either register
      `patron` in `meta/types.md` + both graph configs per `meta/graph-settings.md`, or
      fold him under the existing `deity` type. Do not invent the type silently.

### Stage 3 — the people

Lords and antagonists first (the feud spine), then the townsfolk who speak in Session 1.

- [ ] `Lord Corren Cael` · `Lady Sorcha Marlow`
- [ ] `Harrow Bane` + lieutenants `Jorn`, `Wick`, `Nella` (antagonist schema)
- [ ] `Mara Tull` (sheriff) · `Richmond Ellesine` (smith) · `Silas Crubb` (logistics) ·
      `Elowen Rimetusk` (old mage)

### Already on master — do not redo

Cherry-picked from `feat/redwater-act1-graduation` on 2026-10-01 (`ff62992`):
`House Cael`, `House Marlow`, `Stonemarch`, `Duskwater`.

### Closing out

- [ ] `.\scripts\validate.ps1` clean
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
