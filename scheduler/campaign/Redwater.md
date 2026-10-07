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
| Kellan | Halsby | Half-Elf Sorcerer (Shadow Magic) 4 | Joined in Session 29 — on the Nightveil's errand, owed the fox's boon |

> **Reliability:** carried over from the Strahd roster plus the Session 28 seam pass. Afflictions cross **dormant** (the mists fed them; away, they are muted) — `workshop/first-homebrew-act/notes/the-seam.md`. Odibli's poison and Dip's mold were cured on screen and are gone; do not reuse them. Party level is unset pending the starting-level ruling.

## Current State (after Session 29)

The party is in Aethryn. At night they stand in the raided yard of [[The Golden Lioness]] in
[[Ashford]], with all six of [[Nella]]'s raiders dead around them. [[Act 1 - The Hearth at Ashford]]
is the live act and [[The Stolen Casks]] is **active**.
[[Session 29 The Mistake]] played Scenes 1–3. Scenes 4–5 carry into the next session.

- **[[Sable Wren]]** is on the ground beside a spooked horse, **still bound and gagged**. She
  has not spoken to the party.
- **Nella's cart**, with the barrels already loaded, escaped south under the trees toward
  Duskwater. The party stopped the raiders present from taking anything more.
- **Not yet played:** the bodies (coin, plus an Earshot Crystal on every raider, `S1_LOOT`) ·
  the town's other raids · [[Mara Tull]] and [[Silas Crubb]] · Sable's thanks and the offer of
  a 10% stake · Iggy's viol-song beat · the beat where [[The Wanderer's Boon]] is shown inert.
- **[[Halsby]]** has joined. He was on [[The Nightveil]]'s errand to [[Tassad]] for
  [[Sister Maerith]] until Asher's fox turned him aside. He took the job without bargaining. The
  fox owes him [[The Shadowless Spear]], which the DM plans to deliver around Session 30–31.
- **Levels:** Dip and Luci are 5. Halsby, Iggy and Odibli are 4. Levels come one PC at a time,
  with everyone at 5 before the December finale.
- **The sky:** a single vast **broken moon**, shedding shards. Luci named it **Fida** in the
  Dead Sun tongue, and her voice, louder here than in Barovia, answered "Closer." This
  conflicts with `data/lore/calendar-proposal.md` (two suns, three moons; not canon), which
  needs reconciling before it is canonized.

### Rest Clock (as of: Session 29)

Tracks the adventuring day across session boundaries — `/session` subtracts this from the attrition budget in `meta/difficulty.md`; `/recap` updates it every canonization (reset on long rest, else accumulate) and restamps the header to the canonized session number. The in-world time fields drive the long-rest 24-hour gate (`meta/difficulty.md` -> Long Rest Rules).

- In-world time now: **"Day 1, Ashford reckoning", night, just after the raid.** This is a working label, not a date, because Aethryn has no settled calendar (`questionnaires/world/history/`, `data/lore/calendar-proposal.md` both open)
- Last long rest (in-world): **the transit itself**, given in fiction at Session 29's landing (DM ruling, 2026-10-01)
- Hours since last long rest: ~1 (~estimate). The transit landed straight into the fight
- Long rest available: **no, not for ~23 more in-world hours**
- Rounds of combat since: **~3** (two full rounds plus Dip's finishing turn)
- Short rests since: **0**
- Notable burns:
  - [[Halsby]]: Invisibility, a twinned Chromatic Orb (slot + sorcery points), and Magic Missile upcast for 5 darts (~3rd level; ~estimate)
  - [[Odibli]]: Hold Person (2nd)
  - [[Luci]]: ki/focus for the flurry, plus her radiant emanation
  - [[Iggy]]: 1 Bardic Inspiration
  - [[Dip]]: 1 rage (granted free), and took 8 fire
  - Permanent losses that still apply: Luci's **Sacred Flame**, and Odibli's **familiar** (Session 25)
  - Afflictions are still **dormant** (Iggy's shadow, Dip's whispers)

> **Reliability:** spell levels and the sorcery-point spend come from a machine transcript of a Roll20 night when sheets were failing. Confirm with Kellan and Miguel if a resource question decides anything.

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
