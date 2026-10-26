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
| Jeff | Iggadron "Iggy" Wallaed | Aasimar (Protector), Bard 3 (Valor) / Paladin 2 — level 5 | Alive — shadow affliction, dormant in this world |
| Paul | Luci (Lucitania) | Aasimar (Scourge), Monk 2 / Warlock 1 / Transcendent 1 + one more — level 5 | Alive — sacrificed Sacred Flame permanently |
| Miguel | Odibli (also "ODB") | Forest Gnome, Wizard 4 (Evoker) | Alive — poison cured by Davian Martikov, Session 28 |
| Ben | Dip | Orc, Barbarian 5 (Berserker), Sage background | Alive — whisper affliction, dormant in this world |
| Kellan | Halsby | Half-Elf Sorcerer (Shadow Magic) 4 | Joined in Session 29 — on the Nightveil's errand, owed the fox's boon |

> **Reliability:** carried over from the Strahd roster plus the Session 28 seam pass. Afflictions cross **dormant** (the mists fed them; away, they are muted) — `workshop/first-homebrew-act/notes/the-seam.md`. Odibli's poison and Dip's mold were cured on screen and are gone; do not reuse them. Builds synced to the PC files 2026-10-25; the PC files and Roll20 sheets win. Which class took Luci's fifth level is unrecorded (confirm with Paul). Odibli and Halsby level to 5 in Session 31.

## Current State (after Session 30)

The party is in Aethryn, in the one surviving room of [[The Golden Lioness]] in [[Ashford]], late
on the night of their arrival. [[Act 1 - The Hearth at Ashford]] is the live act and
[[The Stolen Casks]] is **active**. [[Session 30 Keep the Ale]] played only Scenes 1–3; the rest
of the night and the whole pursuit carry into [[Session 31 The Red Trail]] (a draft).

- **The job is taken.** [[Sable Wren]] offered rooms, meals, a stay of a month or two and 10% of
  the bar if the party brings back her stock. They agreed; no deed formally taken. She owes
  [[Silas Crubb]] about 650 gp of a ~1,000 gp loan, and the stock was meant to pay it.
- **The Golden Lioness was retconned** to a week-old venture, Ashford's first tavern, half-built
  and now half-wrecked. Sable runs it alone for now.
- **Nella's cart** went southeast on deep ruts ([[Jory Pike]]). The raiders are one part of a
  larger, organized force camped about a day across the river, all shod by the same cobbler.
  [[Wick]] (a branded elf commander) and [[Harrow Bane]] (a name that hushes a room) are known
  by word only.
- **The hearth** feeds itself, is linked to something absent, and went still during Iggy's song
  (`meta/mysteries.md`). Its link stays open, to be settled in play; the Session 31 threat to it is Tallis's smother-charm.
- **The party carries [[Earshot Crystals]]**, one each. **Dip** holds the ~150 gp off the raiders
  (confirm with Ben). [[Sergei Rubelgerd]] and [[Bosco]] are back with the party.
- **Not yet played:** Mara's statement · [[The Wanderer's Boon]] shown inert · the dying-hearth
  beat · dawn, the horses, [[The Shadowless Spear]] for [[Halsby]] · the chase, the fork, the
  waystation, the man in the cell.
- **Levels:** Dip, Luci and Iggy are 5 (Iggy took Paladin 2). Halsby and Odibli are 4; their
  level-ups wait on the Spear and the hearth. Everyone is at 5 before the December finale.
- **The sky:** a single vast **broken moon**, shedding shards. Luci named it **Fida** in the
  Dead Sun tongue, and her voice answered "Closer." This conflicts with
  `data/lore/calendar-proposal.md` (two suns, three moons; not canon), which needs reconciling
  before it is canonized.

### Rest Clock (as of: Session 30)

Tracks the adventuring day across session boundaries — `/session` subtracts this from the attrition budget in `meta/difficulty.md`; `/recap` updates it every canonization (reset on long rest, else accumulate) and restamps the header to the canonized session number. The in-world time fields drive the long-rest 24-hour gate (`meta/difficulty.md` -> Long Rest Rules).

- In-world time now: **"Day 1, Ashford reckoning", late night, after dinner and the song.** This is a working label, not a date, because Aethryn has no settled calendar (`questionnaires/world/history/`, `data/lore/calendar-proposal.md` both open)
- Last long rest (in-world): **the transit itself**, given in fiction at Session 29's landing (DM ruling, 2026-10-01)
- Hours since last long rest: ~4 (~estimate). The transit landed into the fight, then about three hours of dinner, drinks and song
- Long rest available: **no, not for ~20 more in-world hours**
- Rounds of combat since: **~3** (all Session 29; Session 30 had no combat)
- Short rests since: **0**
- Notable burns:
  - [[Halsby]]: Invisibility, a twinned Chromatic Orb (slot + sorcery points), and Magic Missile upcast for 5 darts (~3rd level; ~estimate)
  - [[Odibli]]: Hold Person (2nd); Speak with Animals (Session 30; ritual or slot, unconfirmed)
  - [[Luci]]: ki/focus for the flurry, plus her radiant emanation; her healing hands (Session 30, on Dunny)
  - [[Iggy]]: 1 Bardic Inspiration; some Lay on Hands (Session 30, on Dunny)
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
