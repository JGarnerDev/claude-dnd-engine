# TODO — Campaign Engine Setup

Progress tracker for getting this project ready to generate sessions and run campaigns.

---

## Schemas
*These files exist as placeholders. They need actual campaign content before session generation will be meaningful.*

- [x] Make a biome schema (terrain types to shape flora, fauna, and logistics of a region) — added `biome` enum field to `location-region.md`
- [x] Make a terrain feature schema (forests, rivers, roads, or anything on a map that effects the populations around them) — `meta/schemas/location-terrain-feature.md`
- [x] Make a natural resource schema (what locations consume, including abrstract location, rarity, accessibility, trade) — `meta/schemas/resource.md`
- [x] Make a culture schema (what certain peoples, factions, etc. from certain regions are generally shaped by) — `meta/schemas/culture.md`
- [x] Make a gameplay mechanic schema (mini games that can constitute a session/mission, make .claude\commands\session.md aware of it) — `meta/mechanics/_template.md`; session command updated

---

## Meta Configuration
*These files exist as placeholders. They need actual campaign content before session generation will be meaningful.*

- [ ] `meta/worldbuilding.md` — fill in tone, themes, setting pillars, what to avoid
- [ ] `meta/difficulty.md` — fill in party profile, encounter mix, DC ranges
- [ ] `meta/rewards.md` — fill in gold ranges, magic item philosophy, leveling pace
- [ ] Create per-player files in `meta/players/` (copy `player-template.md` per player)

---

## Data — Canonical D&D
*Source material seeded from the 5e API or training knowledge. Forms the base creative pool.*

- [x] Monsters — CR tags added as `cr/<decimal>` (1/4→cr/0.25, etc.) on all 435 monster files via `scripts/update-monster-cr-tags.ps1`; schema and tag registry updated
- [x] Monsters — habitats converted from plain strings to `[[wiki-link]]` relations on all 433 non-empty files via `scripts/update-monster-habitats.ps1`; 26 generic habitat archetype entities created in `data/locations/` (9 wilderness, 4 dungeon, 1 city, 12 region/plane) via `scripts/seed-habitat-archetypes.ps1`
- [x] Monsters — descriptions missing on 351 of 435 files (`description: ""`). Fill in 5 alphabetical batches (~70 each). For each: generate 1–2 sentence flavor descriptions and write them back.
  - [x] Chunk A — Adult Black Dragon → Ettercap (A–Et)
  - [x] Chunk B — Ettin → Grimlock (Et–G)
  - [x] Chunk C — Guardian Naga → Myconid Sovereign (G–My)
  - [x] Chunk D — Myconid Sprout → Slaad Tadpole (My–Sl)
  - [x] Chunk E — Smoke Mephit → Yuan-ti Pureblood (Sm–Y)
- [x] Monsters — new `monster` type added (`data/monsters/`, schema, tags, graph config); `creature` schema cleaned up (archetype field removed). Full MM seeded via `scripts/seed-monsters.ps1` (433 total files). Hand-crafted chunks 1-5 preserved. Seed in 5 chunks by campaign relevance:
  - [x] Chunk 1 — Core Undead: Zombie, Skeleton, Ghoul, Ghast, Wight, Shadow, Specter, Wraith, Vampire Spawn
  - [x] Chunk 2 — Wilderness Beasts: Wolf, Dire Wolf, Swarm of Bats, Giant Spider, Swarm of Ravens, Brown Bear
  - [x] Chunk 3 — Humanoids & Cultists: Guard, Cultist, Cult Fanatic, Bandit, Scout, Scarecrow
  - [x] Chunk 4 — Elite Undead & Horrors: Vampire, Strahd Zombie, Flesh Golem, Night Hag, Banshee, Death Knight
  - [x] Chunk 5 — Dragons, Fiends, Stragglers: Nightmare, Imp, Young Silver Dragon, Revenant, Will-o'-Wisp
- [x] Magic items — seeded `data/items/magic/` with 4 CoS artifacts (Sunsword, Holy Symbol of Ravenkind, Icon of Ravenloft, Tome of Strahd) + 7 canonical items (Bag of Holding, Cloak of Protection, Ring of Protection, Wand of Magic Missiles, Potion of Healing, Potion of Greater Healing, Sending Stones)
- [x] Spells — created `meta/schemas/spell.md`, registered `spell` type + 9 school tags; seeded `data/spells/` with 280 spells (42 cantrips, 60 L1, 59 L2, 46 L3, 29 L4, 43 L5, 1 L6)
- [ ] feats
- [ ] skills


---

## Data — Campaign-Specific
*World-building work that requires creative input. These populate the free entity pool for session generation.*

### World Structure
- [ ] Create **Regions** — the area where the campaign takes place
- [ ] Create a **starting city** — the home base or first major location
- [ ] Create **factions** — powers that shape local politics and conflict
- [ ] Create key **wilderness areas** — roads, forests, or landmarks near the starting city
- [ ] Create **dungeons** — available adventure sites within reach

### Characters
- [ ] Create **PC files** for each player character (`data/characters/pcs/`)
- [ ] Create **key NPC files** — at minimum: quest-giver, innkeeper, local authority, recurring contact

### History & Hooks
- [ ] Create **historical events** that shaped the current world state
- [ ] Create a handful of **rumors** — in-world hooks players can discover
- [ ] Create at least one **faction** with clear motives, tensions, and opposition

### Shops & Services
- [ ] Populate the starting city with at minimum: an inn, a mundane shop, and a magic shop (each chains to an NPC proprietor)

---

## Historian
- [x] Party entity created: `historian/characters/parties/The Party.md` — skeleton only
- [ ] Add detail to current party (`historian/characters/parties/The Party.md`) — formation story, reputation, goals
- [ ] Prompt Claude with each player's backstory, allowing it to create new entities with DM's approval
- [ ] Confirm unresolved details with DM/players — see reliability notes in each file
- [ ] Backfill additional entities invented at the table as they're confirmed

---

## Scheduler
- [ ] Create **first act** now that campaign document exists. An act splits the whole campaign into a sort of "chapter", and has goals and leveling brackets. 
- [ ] Create **first mission(s)** once the opening act is defined. A mission is a variable-sized story unit, with mini-goals that either contribute to the act, or can be completely side-quests.
- [ ] Draft the **first session plan** once meta configuration and starting data are in place. Sessions are the times the players come together to play.

