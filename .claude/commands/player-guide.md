---
description: "Write or refresh a player's guide to their own PC (turn, combos, strategies, build), shown on the app's Player guide page."
argument-hint: "<PC name>"
---

Write or refresh `meta/player-guides/<PC>.md`: a player-facing guide to playing one PC well. It
is read on a phone at the table, at `http://localhost:5177/player.html`
(`npm --prefix app run app`). The format and what the player provides are in
`meta/player-guides/_template.md`; `meta/player-guides/Iggy.md` is the model.

**Arguments:**

- `<PC name>`: the PC, as named in `historian/characters/pcs/` (required; fuzzy match).

---

## Who this is for

The person running this is usually a **player**, not the DM. Read their `meta/players/<name>.md`
→ `## Working with` first. Everything in the guide must be safe for that player to read.

**Never read or use DM-only material:** scheduler plans and acts, `DM-only` blocks in any file,
`scheduler/campaign/_*.md`, `scheduler/arcs/`, `meta/loot-options/`, spitballs. Halsby's file (and
any PC file) can hold DM-only blocks: skip them, never quote them. Strategies cover enemy types
the party has met (historian sessions) or common ones, never what the DM has planned.

## Phase 1 — Gather (read only)

Declare the read scope first, then read:

1. `meta/player-guides/_template.md` and, if it exists, the current `meta/player-guides/<PC>.md`.
2. The PC file: frontmatter, `## Character Sheet (Roll20)`, features, gear, `## Looking Ahead
   (Player Intent)`. Note `level`, `level_confirmed` and anything the sheet section has out of
   date (a level it predates).
3. The other active PCs' frontmatter and sheet sections only (`uv run scripts/party-status.py`
   first), for the combos.
4. The active campaign file's frontmatter (`scheduler/campaign/`, `state: active`) for the DM and
   party. Not its body.

## Phase 2 — Ask (one question per message, options first)

Only what the files don't answer. Skip any the existing guide already settles:

1. **Rules edition:** 2024 (recommended when the table plays it) or 2014.
2. **What they want from the PC:** damage, support, staying alive, or a mix.
3. **Their build plan**, if any: a class level they stop at, a feat they want.
4. **House rules or homebrew items** the guide should know about.

If the sheet is stale (it predates the PC's level), say so and offer to work the numbers out
from the level, with a to-do about it in the guide's `## Notes`. Re-ingesting a Roll20 export
(`/pc-backstory` → Character Sheets) is the better fix.

## Phase 3 — Write

Write `meta/player-guides/<PC>.md` with the template's frontmatter (`pc`, `player`, `rules`,
`level` = the PC file's `level`, `class`, `guide_confirmed` = the latest played session) and its
sections: `## Turn`, `## Combos`, `## Strategies`, `## Build`, then `## Notes` (`### To do`,
`### Remember` and `### Currently`), then `## Roleplay` (`### Your tells`, then one `###` per party member or
companion: hooks that work with them). The page makes one tab per `##` except Notes and Roleplay,
which it shows as panels beside them. Roleplay draws only on table-visible events and behaviour,
never other PCs' private backstories or DM-only material.

- **Rules accuracy over flavor.** Use the chosen edition's rules exactly: action costs, the
  one-slot-per-turn rule (2024), concentration, multiclass slots. Flag anything you're unsure of
  as a question for the DM in `## Build` → Ask the DM.
- **No Roll20 overlap:** no full sheet, dice rolling, HP or inventory. Each play does carry its
  rules, paraphrased in our own words (never copied book text): casting time, range, target,
  duration, the save and its effect, with the PC's numbers. Then `Tip: …` (when and why), then
  `Upcast: …` for a leveled spell. The page puts the tip and the upcast on lines of their own.
- **Short bullets, phone-sized.** `###` subsections, bullets and numbered lists. No tables, no
  wikilinks (the page doesn't follow them).
- Read `meta/prose-style.md` once and run its **While drafting** checklist before writing.

## Phase 4 — Show

Tell the player what changed in a few bullets, and that the page reloads on its own. If the PC
file's sheet section is stale, add a `todo-dashboard.md` backlog item to re-ingest it (unless one
exists). Don't commit unless asked.

## Refresh

A guide goes stale when the PC levels up or the party changes. `/recap` Phase 6.5 proposes
small updates after each session the PC plays and restamps `guide_confirmed`. The page warns when
the PC file's `level` is past the guide's `level`, or when the PC has played two or more sessions
(`pcs_present` on completed session records) past `guide_confirmed`. On a refresh, keep what the player has said in earlier
runs (their plan, their picks), redo the numbers and the build paths, and restamp `level` and
`guide_confirmed`.
