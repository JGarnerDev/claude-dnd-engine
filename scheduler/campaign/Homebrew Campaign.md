---
name: "Homebrew Campaign"
aliases:
  - "New World Campaign"
type: campaign
dm: "Jeff"
exists: false
state: active
campaign: homebrew
premise: "The party steps out of Barovia's mists holding the Vintner Mage's relic and arrives in a world under a broken moon. Trillions of glass shards from the Astra Collision still fall as Whatwill — pearlescent, phosphorescent, volatile — in Showerings no one can predict, and every power in the world is built on getting to where it lands first."
central_conflict: "Control of Whatwill. The Vitricants revere it, the Mintners dissect it, the Partenariats steal it, the Courts Superior deadlock over who owns where it fell, and the Lifted stake their floating homes on it. Newcomers with no allegiance are the most useful — and most expendable — pieces on that board."
tone: "Epic mythic depth with dark political complexity — LotR scale, GoT intrigue, Warhammer cultural specificity. Magic is rare (~3/10) and socially stratifying. Optimism persists: warmth and wonder survive alongside the darkness."
end_condition: "TBD — settled once Act 1 defines the party's stake in the Whatwill economy"
themes:
  - "Political intrigue and power struggles"
  - "Resource scarcity and manufactured economic control"
  - "Ancient mystery — the world is older than anyone knows"
  - "Small people facing a vast world"
importance: critical
active: true
description: "Active campaign document for the first homebrew season, opened 2026-09-30 when the party left Barovia via the Wanderer's Boon. Jeff DMs. World name still TBD pending world naming."
relates_to:
  - "[[Homebrew World]] (setting)"
  - "[[Curse of Strahd]] (predecessor campaign)"
  - "[[Act 1 - Placeholder]] (first act, placeholder)"
---

# Homebrew Campaign

Draft root document for the homebrew campaign that alternates with [[Curse of Strahd]] like TV seasons. The party carries across both worlds and shifts between them via a deliberate narrative device — a story beat, not a soft drift (see `.claude/commands/transition.md` for the season-swap flow). Jeff DMs the first homebrew season; the homebrew DM rotates thereafter. Unlike Strahd (planned outside this repo, record-only here), homebrew uses the full engine — planning and recording both happen here.

**Status: active** as of 2026-09-30 — the season swap ran via `/transition`, pausing [[Curse of Strahd]]. The party arrived through [[The Wanderer's Boon]], the relic [[Davian Martikov]] gave them in Session 28; it is now campaign-agnostic and is also the route back to Barovia. The setting is [[Homebrew World]] — still awaiting its true name. The first act exists only as [[Act 1 - Placeholder]], now retagged to this campaign.

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

- [x] Fill in this file — premise, central conflict, tone, and themes written 2026-09-30 from the Whatwill cosmology; `end_condition` still open pending Act 1
- [ ] `scheduler/acts/Act 1 - Placeholder.md` — homebrew DM (Jeff, first season) to fill DM notes, mission structure, act goals
- [ ] First mission(s) once the opening act is defined
- [ ] First session plan once meta configuration and starting data are in place

### Transition

- [x] Run the `/transition` flow (`.claude/commands/transition.md`) — ran 2026-09-30: Strahd paused, this file flipped to `state: active`/`active: true`, `dm: Jeff`, Act 1 retagged, the Wanderer's Boon made campaign-agnostic
