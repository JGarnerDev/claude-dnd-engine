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

## Current State (after Session 33)

The party is in Aethryn, **mid-fight** in the yard of [[The Waystation]], Nella's camp at an old
drover's relay southeast of [[Ashford]], at about 11 a.m. on Day 2. [[Act 1 - The Hearth at Ashford]]
is the live act and [[The Stolen Casks]] is **active**. [[Session 33 The Red Trail]] played the
hill and the opening of the fight and stopped in round 2; the rest carries into
[[Session 34 The Red Trail]] (a draft, stepped up by the DM: Nella takes the ridge and sets her
griffon hunting, and relief riders come up the east road).

- **The cliffhanger.** The party charged the camp in Silas's cart. [[Halsby]]'s Lightning Bolt and
  [[Dip]]'s axe took the drover, the hedge priest, the big cask-hand and the wolf. Still fighting:
  the tally-man and the half-orc cask-hand (both on Halsby), the badly hurt archer from the fork
  (on Iggy) and the roof guard. [[Nella]] circles about 60 ft up on her griffon. [[Iggy]] was
  missed from initiative and acts first next session.
- **Silas's loan:** his five horses scattered at the charge but are nearby and can be rounded up
  (some may come back lame or unshod). **His cart is wrecked** against the shed. The camp's own
  wagon can carry the casks home.
- **The camp** still holds the casks (about 12) and a fine banner on the shed's pole. None of the
  crew are named to the party.
- **The crystals leak.** An all-holder message reaches anyone wearing an [[Earshot Crystals|earshot
  crystal]] within 300 ft, and Nella and the crew wear them. Halsby's "going dark" went to all of
  them.
- **Dip took the drover's cart-whip.** The drover's bracer is still on his body.
- **Pablo**, the dead crossbowman's horse, is on the hill. The cart's oats are gone.
- **The job is taken.** [[Sable Wren]] offered rooms, meals, a stay of a month or two and 10% of
  the bar if the party brings back her stock. Dip told her 10% was low; she offered a larger share,
  to be talked over when they return. Nothing is signed. She owes [[Silas Crubb]] about 650 gp of
  a ~1,000 gp loan, and the stock was meant to pay it.
- **The Golden Lioness** is a week-old venture, Ashford's first tavern, half-built and now
  half-wrecked. Sable runs it alone for now.
- **The wider band:** the raiders are one part of a larger, organized force camped about a day
  across the river, all shod by the same cobbler. [[Wick]] (a branded elf commander) and
  [[Harrow Bane]] (a name that hushes a room) are known by word only.
- **The hearth is saved.** The fire still feeds itself and is linked to something absent
  (`meta/mysteries.md`). Sable asked Odibli not to talk about the fire until she does.
- **Halsby has [[The Shadowless Spear]]:** +1 to attacks, spell attacks and spell save DC while he
  holds it (settled 2026-10-28). The fox's debt is paid ("perhaps we will talk again").
- **Dip holds a private vision** from the night of Iggy's song: the stillness led inward, to
  something inside [[Iggy]]. Mid-charge in Session 33, Dip shouted at Iggy that "a flame went
  inside" him; whether that shared it in character is unconfirmed, so it's still treated as Dip's.
- **[[The Wanderer's Boon]]** is inert, but holds the space where its magic will return.
- **The party carries** the crystals, one each (words only, 300 ft). Dip holds the ~150 gp off the
  raiders. [[Sergei Rubelgerd]] and [[Bosco]] ride with the party.
- **Borrowed:** five of Silas's horses (scattered) and a cart (wrecked). He wanted every shoe on.
- **Not yet played:** the rest of the camp fight, Iggy's wings and Sah's voice, Nella's escape and
  tally, the camp's intel (band size, Bane's ledger, the banner), the haul home, the man in the
  cell.
- **Levels:** all five PCs are level 5 (confirmed Session 33). Everyone is at 5 before the
  December finale.
- **The sky:** a single vast **broken moon**, shedding shards. Luci named it **Fida** in the
  Dead Sun tongue, and her voice answered "Closer." It is a true moon the Astra impact broke
  (canon since 2026-11-08). Two suns turn the night over 18 days, from 12 hours of real dark to none;
  the date, the Crawl and the next Kerning live in `scheduler/campaign/_sky-clock.md`, the system in
  [[World Calendar]].

### Rest Clock (as of: Session 33)

Tracks the adventuring day across session boundaries — `/session` subtracts this from the attrition budget in `meta/difficulty.md`; `/recap` updates it every canonization (reset on long rest, else accumulate) and restamps the header to the canonized session number. The in-world time fields drive the long-rest 24-hour gate (`meta/difficulty.md` -> Long Rest Rules).

- In-world time now: **`6743-05-21`, about 11 a.m.** (Ashford Day 2; DM's estimate, one hour on), mid-fight at [[The Waystation]]. The date itself is kept in `scheduler/campaign/_sky-clock.md`
- Last long rest (in-world): **overnight Day 1 → Day 2 at the Golden Lioness** (DM ruling at the table, Session 31, overriding the plan's 24-hour gate)
- Hours since last long rest: ~5 (~estimate): the ride southeast, the fork, the hill, the charge
- Long rest available: **no, not until the night of Day 2 at the earliest** (24-hour gate)
- Rounds of combat since: **3** (the fork 1, the waystation ~2 so far, mid-round)
- Short rests since: **0**
- Notable burns:
  - [[Halsby]]: Darkness (2nd level), with Subtle Spell (~1 sorcery point; ~estimate); Invisibility (2nd level), ended at the charge; Lightning Bolt (3rd) and Haste (3rd, still concentrating). Out of 3rd-level slots; sorcery points otherwise unspent
  - [[Odibli]]: 2 of 3 free racial Speak with Animals casts; Magic Missile (1st). Both Fireballs left
  - [[Luci]]: 1 focus point
  - [[Dip]]: Rage, still active
  - HP lost (rough): Iggy 22, Odibli 18, Halsby 9, Dip ~7
  - Permanent losses that still apply: Luci's **Sacred Flame**, and Odibli's **familiar** (Session 25)
  - Afflictions are still **dormant** (Iggy's shadow, Dip's whispers)

## Setup TODO

Master checklist is the `/todo` dashboard (`todo-dashboard.md`); this list tracks only the files that must be completed before this campaign can start.

### Name the world and campaign

- [x] World named **Aethryn** 2026-10-01, decided directly with the DM rather than through the questionnaire. `data/locations/regions/Homebrew World.md` → `data/locations/regions/Aethryn.md`, `state: draft` lifted to `stable`.
- [x] Campaign named **Redwater** 2026-10-01. *(This file — renamed from `Homebrew Campaign.md`.)*
- [ ] `questionnaires/world/naming/world-naming.md` — the remaining naming entries (regions, factions, provisional map labels). Still not created; `scripts/naming-status.py` reads this path and errors until it exists. The world's own name no longer waits on it.
  *(Per-player naming sheets are no longer planned — `questionnaires/` is a single DM-facing tree with no name designations.)*

### Fill the lore drafts (blocked on questionnaires)

- [x] `data/lore/calendar.md` — canon since 2026-11-08 (Miguel's system, ratified by Jeff)
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
