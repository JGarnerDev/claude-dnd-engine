---
name: "Redwater"
aliases:
  - "Homebrew Campaign"
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
description: "Active campaign document for the first homebrew season — named Redwater for the red/purple border-river (the Moorthistle, named 2026-10-05) the opening act turns on. Opened 2026-09-30 when the party left Barovia via the Wanderer's Boon. Jeff DMs. The *world* is Aethryn, named 2026-10-01; Redwater names the campaign, not the planet."
relates_to:
  - "[[Aethryn]] (setting — the world)"
  - "[[Curse of Strahd]] (predecessor campaign)"
  - "[[Act 1 - The Hearth at Ashford]] (first act)"
---

# Redwater

Draft root document for the homebrew campaign that alternates with [[Curse of Strahd]] like TV seasons. The party carries across both worlds and shifts between them via a deliberate narrative device — a story beat, not a soft drift (see `.claude/commands/transition.md` for the season-swap flow). Jeff DMs the first homebrew season; the homebrew DM rotates thereafter. Unlike Strahd (planned outside this repo, record-only here), homebrew uses the full engine — planning and recording both happen here.

**Status: active** as of 2026-09-30 — the season swap ran via `/transition`, pausing [[Curse of Strahd]]. The party arrived through [[The Wanderer's Boon]], the relic [[Davian Martikov]] gave them in Session 28; it is now campaign-agnostic and is also the route back to Barovia. The setting is [[Aethryn]], named 2026-10-01. The first act is [[Act 1 - The Hearth at Ashford]].

> **Naming note:** campaign and world are named separately and both are now settled. The *campaign* is **Redwater**, after the red/purple border-river (the Moorthistle, named 2026-10-05), with `"Homebrew Campaign"` kept as an alias so older links resolve. The *world* is **Aethryn** (AITH-rin; Greek *aithēr* "upper air" + Welsh *bryn* "hill"), named 2026-10-01 — `data/locations/regions/Aethryn.md`, keeping `"Homebrew World"` and `"The World"` as aliases. Multiple campaigns may run in Aethryn; Redwater is only the first.

## Party

Five PCs this season. The four who crossed from Barovia persist across both worlds; **Halsby is homebrew-only** — Kellan DMs the Strahd season, so he can only hold a player seat here. That is why Halsby's file carries `campaign: homebrew` while the other four are deliberately campaign-agnostic (see `todo-dashboard.md` item 16).

| Player | Character | Race/Class | Status |
|---|---|---|---|
| Jeff | Iggadron "Iggy" Wallaed | Aasimar (Celestial), Bard 3 / Paladin 1 | Alive — shadow affliction, dormant in this world |
| Paul | Luci | Aasimar (Scourge) Monk | Alive — sacrificed Sacred Flame permanently |
| Miguel | Odibli (also "ODB") | Gnome Wizard | Alive — poison cured by Davian Martikov, Session 28 |
| Ben | Dip | Half-Orc Barbarian/Sage | Alive — whisper affliction, dormant in this world |
| Kellan | Halsby | TBD, Sorcerer (Shadow Magic) | Joins at Session 1 — race/background TBD; level 4 per the 2026-10-01 ruling, stamps at Session 1's `/recap` |

> **Reliability:** carried over from the Strahd roster plus the Session 28 seam pass. Afflictions cross **dormant** (the mists fed them; away, they are muted) — `workshop/first-homebrew-act/notes/the-seam.md`. Odibli's poison and Dip's mold were cured on screen and are gone; do not reuse them. Party level is unset pending the starting-level ruling.

## Current State (after Session 28)

The party arrived in [[Ashford]] through [[The Wanderer's Boon]] and has not yet played a
session in this world. [[Act 1 - The Hearth at Ashford]] is the live act;
[[The Stolen Casks]] is the opening mission, and [[Session 29 The Mistake]] is planned for
2026-10-06. Nothing in Aethryn is canon yet — every entity the first session touches still
carries `exists: false` until `/recap` graduates it.

### Rest Clock (as of: Session 28)

Tracks the adventuring day across session boundaries — `/session` subtracts this from the attrition budget in `meta/difficulty.md`; `/recap` updates it every canonization (reset on long rest, else accumulate) and restamps the header to the canonized session number. The in-world time fields drive the long-rest 24-hour gate (`meta/difficulty.md` -> Long Rest Rules).

- In-world time now: **working label "Day 1, Ashford reckoning"** — deliberately not a date. Aethryn has no settled calendar (`questionnaires/world/history/`, `data/lore/calendar-proposal.md` both open), so no in-world date is asserted until those land
- Last long rest (in-world): **the transit itself.** Per the DM ruling of 2026-10-01, passing through [[The Wanderer's Boon]] counts as a long rest, told to the party in fiction as they teleport rather than announced as a mechanic
- Hours since last long rest: 0 — the party arrives rested
- Long rest available: **not for ~24 in-world hours** from arrival. The 24-hour gate restarts at the transit, so Session 29 has no second reset in it
- Rounds of combat since: **0**
- Short rests since: **0**
- Notable burns: **none carried.** The transit cleared the Barovian ledger — all slots, hit dice and HP restored. Afflictions cross **dormant** ([[Iggy]]'s shadow, [[Dip]]'s whispers). [[Odibli]]'s poisonings and Dip's spore infection were cured on screen by [[Davian Martikov]] in Session 28 and are **gone — do not reuse them.** Permanent losses that do persist: Luci's **Sacred Flame**, sacrificed permanently, and Odibli's **familiar**, destroyed in Session 25

> **Reliability:** this clock was **initialized at the season swap**, not carried across it — exactly the reset the paused [[Curse of Strahd]] clock suggested considering. Barovia's ~35 rounds and ~17-24 hours-since figures are retired with that campaign and are not inherited here; they remain in `scheduler/campaign/Curse of Strahd.md` for when the Strahd season resumes. The header stamp reads Session 28 because that is the last played session of either campaign; Session 29's `/recap` is the first to restamp it from actual homebrew play.

## Setup TODO

Master checklist is the `/todo` dashboard (`todo-dashboard.md`); this list tracks only the files that must be completed before this campaign can start.

### Name the world and campaign

- [x] World named **Aethryn** 2026-10-01, decided directly with the DM rather than through the questionnaire. `data/locations/regions/Homebrew World.md` → `data/locations/regions/Aethryn.md`, `state: draft` lifted to `stable`.
- [x] Campaign named **Redwater** 2026-10-01. *(This file — renamed from `Homebrew Campaign.md`.)*
- [ ] `questionnaires/world/naming/world-naming.md` — the remaining naming entries (regions, factions, provisional map labels). Still not created; `scripts/naming-status.py` reads this path and errors until it exists. The world's own name no longer waits on it.
  *(Per-player naming sheets are no longer planned — `questionnaires/` is a single DM-facing tree with no name designations.)*

### Fill the lore drafts (blocked on questionnaires)

- [ ] `data/lore/calendar.md` — awaiting `questionnaires/world/history/calendar/` + `calendar-proposal/`
- [ ] `data/lore/history.md` — awaiting `questionnaires/world/history/`
- [ ] `data/lore/magic.md` — awaiting `questionnaires/world-magic.md`
- [ ] `data/lore/religion.md` — awaiting `questionnaires/world/religion/`

### Meta configuration

- [ ] `meta/difficulty.md` — party profile, encounter mix, DC ranges (blank)
- [ ] `meta/rewards.md` — gold ranges, magic item philosophy, leveling pace (blank)
- [ ] `meta/players/` — all 4 core player files (Jeff, Ben, Miguel, Paul) are blank templates

### Outstanding player questionnaires

- [x] `questionnaires/ben-witchweed.md` — Ben's plant/resource entity → ingested 2026-06-12 as [[Fargrsh]] + [[The Deorful Domas]]
- [ ] `questionnaires/kellan-exotic-mounts.md` — Kellan's mounts entity

### Starting content (data pool)

- [x] Starting city entity — [[Ashford]], graduated 2026-10-01 with [[The Golden Lioness]] as its pub. A dedicated mundane shop and magic shop are still unmade; [[Silas Crubb]] covers general goods as an NPC, and there is no magic shop in a town this size by design
- [x] Faction entities — [[House Cael]] and [[House Marlow]], the two sides of the Act 1 feud
- [x] Key NPC files — [[Sable Wren]] (the offer), [[Mara Tull]] (local authority), [[Silas Crubb]], [[Richmond Ellesine]], [[Elowen Rimetusk]], [[Lord Corren Cael]], and the antagonist side: [[Lady Sorcha Marlow]], [[Harrow Bane]], [[Jorn]], [[Wick]], [[Nella]]
- [ ] Wilderness areas and dungeons near the starting city
- [ ] Historical events and rumors
- [ ] PC files for each character (`data/characters/pcs/`)

### Story structure

- [x] Fill in this file — premise, central conflict, tone, and themes written 2026-09-30 from the Whatwill cosmology; `end_condition` still open pending Act 1. **`central_conflict` deliberately untouched:** Act 1 runs the Cael–Marlow feud while the campaign file still reads "Control of Whatwill", and reconciling the two is a pinned group discussion, not a decision to make here
- [x] `scheduler/acts/Act 1 - The Hearth at Ashford.md` — written 2026-10-01: the Cael–Marlow feud as backdrop, the Golden Lioness foothold as the spine, four designed sessions inside eight slots
- [ ] First mission(s) once the opening act is defined
- [ ] First session plan once meta configuration and starting data are in place

### Transition

- [x] Run the `/transition` flow (`.claude/commands/transition.md`) — ran 2026-09-30: Strahd paused, this file flipped to `state: active`/`active: true`, `dm: Jeff`, Act 1 retagged, the Wanderer's Boon made campaign-agnostic
