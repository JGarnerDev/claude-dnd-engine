# TODO — Campaign Engine Setup

Progress tracker for getting this project ready to generate sessions and run campaigns.

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

- [x] Monsters — 5 new fields on all ~544 files: `weaknesses`, `resistances`, `immunities`, `legendary`, `movement`. Schema updated. Script pattern: copy `scripts/update-monster-fields-chunk-a.py`, replace `MONSTER_DATA` dict and chunk filter line. MM files have UTF-8 BOM — script handles both BOM and non-BOM via `utf-8-sig` detection.
  - [x] Chunk B — Cultist → Gnoll Fang of Yeenoghu (Cu–Gn)
  - [x] Chunk C — Gnoll Pack Lord → Needle Blight (Go–N)
  - [x] Chunk D — Night Hag → Scarecrow (Ni–Sc)
  - [x] Chunk E — Sea Hag → Zombie (Se–Z)
- [x] Skills

---

## Optional / Stretch

- [ ] **Sea currents** — layer onto maritime trade routes for mechanical depth (speed/cost variance by direction, dominant port logic, seasonal shifts). High value if naval gameplay becomes recurring; skip if routes stay background flavor.

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

## Player Contribution Balance Check

*Run before canonizing any batch of player-contributed entities. Flags power imbalances, narrative overreach, and uneven contribution counts.*

- [ ] **Run `.\scripts\contribution-balance.ps1`** — confirm no player dominates the canonized pool. Target: no single player above ~40% of canonized entities.
- [ ] **Spot-check for scope creep** — does any single contribution control too much of one domain (economy, geography, power structure)? A cluster of tightly linked entities (faction + resource + route + location) may need to be staggered across sessions rather than canonized at once.
- [ ] **Check naming conflicts** — when multiple players have named features, confirm no two names collide and no adjacency creates an implicit narrative claim one player didn't intend.
- [ ] **Resolve TBD fields before play** — any entity with `TBD`, `unknown`, or unassigned mandatory details should be flagged and filled before it appears in a session plan.

---

## Party Worldbuilding Questions
*DM-free session work. Each questionnaire below is a collaborative deep-dive. Fill, paste back, and the engine ingests into the relevant draft files.*

- [ ] **Calendar & History** — `questionnaires/world-history-calendar.md` — eras, year system, defining events, Glistening cycle scope, remnant ruins, tech/faith history
- [ ] **Religion & Pantheon** — `questionnaires/world-religion.md` — named gods, portfolios, dominant faiths by region, Deorum Ostium's sealing, how divine magic works in this world
- [ ] **Peoples & Cultures** — *(questionnaire pending)* — deep-dive on major civilizations: Karath Ut'll lizardfolk, Oathmark oath-raiders, Hightalon dwarven-industrial, arctic Ilurak Qeth peoples, Erevast heartland mix
- [ ] **Factions — Internal Life** — *(questionnaire pending)* — internal culture, leadership, and conflict for the 5 established factions (Vitricants, Mintners, Partenariats, Lifted, Courts Superior)
- [ ] **Magic & the Arcane** — `questionnaires/world-magic.md` — how magic is acquired, guild structure and leverage, unlicensed casters, arcane vs. divine, remnant tech shadow

---

## Historian
- [ ] Add detail to current party (`historian/characters/parties/The Party.md`) — formation story, reputation, goals
- [ ] Prompt Claude with each player's backstory, allowing it to create new entities with DM's approval
- [ ] Confirm unresolved details with DM/players — see reliability notes in each file
- [ ] Backfill additional entities invented at the table as they're confirmed

---

## Scheduler
- [ ] Create **first act** now that campaign document exists. An act splits the whole campaign into a sort of "chapter", and has goals and leveling brackets.
- [ ] Create **first mission(s)** once the opening act is defined. A mission is a variable-sized story unit, with mini-goals that either contribute to the act, or can be completely side-quests.
- [ ] Draft the **first session plan** once meta configuration and starting data are in place. Sessions are the times the players come together to play.
