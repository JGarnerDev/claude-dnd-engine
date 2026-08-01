---
name: "Homebrew Campaign"
aliases:
  - "New World Campaign"
type: campaign
dm: "Kellan"
exists: false
state: draft
campaign: homebrew
premise: "TBD — the party leaves Barovia through a deliberate narrative transition and enters the homebrew world. Opening situation not yet designed."
central_conflict: "TBD — to be defined once worldbuilding questionnaires are answered and the first act is designed."
tone: "TBD — draw from meta/worldbuilding.md design preferences once deployed."
end_condition: "TBD"
themes: []
importance: critical
active: false
description: "Draft campaign document for the homebrew world campaign that follows Curse of Strahd. Not yet started; name TBD pending world naming."
relates_to:
  - "[[Homebrew World]] (setting)"
  - "[[Curse of Strahd]] (predecessor campaign)"
  - "[[Act 1 - Placeholder]] (first act, placeholder)"
---

# Homebrew Campaign

Draft root document for the homebrew campaign that alternates with [[Curse of Strahd]] like TV seasons. The party carries across both worlds and shifts between them via a deliberate narrative device — a story beat, not a soft drift (see `.claude/commands/transition.md` for the season-swap flow). Jeff DMs the first homebrew season; the homebrew DM rotates thereafter. Unlike Strahd (planned outside this repo, record-only here), homebrew uses the full engine — planning and recording both happen here.

**Status: not started.** This file stays `state: draft` and `active: false` until the transition happens. The setting is [[Homebrew World]] — itself a draft, awaiting its true name. The first act exists only as [[Act 1 - Placeholder]].

> **Naming note:** "Homebrew Campaign" is a placeholder. When the world is named via the naming questionnaires, rename this file and the `name:` field; keep the placeholder as an alias.

## Setup TODO

Master checklist is the `/todo` dashboard (`todo-dashboard.md`); this list tracks only the files that must be completed before this campaign can start.

### Name the world and campaign

- [ ] `questionnaires/world-naming.md` — general naming questionnaire (includes the world's name)
- [ ] `questionnaires/world-naming-ben.md`, `world-naming-kellan.md`, `world-naming-miguel.md`, `world-naming-paul.md` — per-player naming sheets
- [ ] Rename `data/locations/regions/Homebrew World.md` and this file once the name lands

### Fill the lore drafts (blocked on questionnaires)

- [ ] `data/lore/calendar.md` — awaiting `questionnaires/world-history-calendar.md`
- [ ] `data/lore/history.md` — awaiting `questionnaires/world-history-calendar.md`
- [ ] `data/lore/magic.md` — awaiting `questionnaires/world-magic.md`
- [ ] `data/lore/religion.md` — awaiting `questionnaires/world-religion.md`

### Meta configuration

- [ ] `meta/difficulty.md` — party profile, encounter mix, DC ranges (blank)
- [ ] `meta/rewards.md` — gold ranges, magic item philosophy, leveling pace (blank)
- [ ] `meta/players/` — all 4 core player files (Jeff, Ben, Miguel, Paul) are blank templates

### Outstanding player questionnaires

- [x] `questionnaires/ben-witchweed.md` — Ben's plant/resource entity → ingested 2026-06-12 as [[Fargrsh]] + [[The Deorful Domas]]
- [ ] `questionnaires/kellan-exotic-mounts.md` — Kellan's mounts entity

### Starting content (data pool)

- [ ] Starting city entity — home base, with inn, mundane shop, magic shop (each chains to an NPC)
- [ ] Faction entities — at least one with clear motives, tensions, opposition
- [ ] Key NPC files — quest-giver, innkeeper, local authority, recurring contact
- [ ] Wilderness areas and dungeons near the starting city
- [ ] Historical events and rumors
- [ ] PC files for each character (`data/characters/pcs/`)

### Story structure

- [ ] Fill in this file — premise, central conflict, tone, end condition, themes
- [ ] `scheduler/acts/Act 1 - Placeholder.md` — homebrew DM (Jeff, first season) to fill DM notes, mission structure, act goals
- [ ] First mission(s) once the opening act is defined
- [ ] First session plan once meta configuration and starting data are in place

### Transition

- [ ] Run the `/transition` flow (`.claude/commands/transition.md`) when swapping into the first homebrew season — pauses Strahd and flips this file to `state: active`, `active: true`
