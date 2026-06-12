# TODO — Campaign Engine Setup

Progress tracker for getting this project ready to generate sessions and run campaigns.

---

## Meta Configuration
*These files exist as placeholders. They need actual campaign content before session generation will be meaningful.*

- [x] `meta/worldbuilding.md` — fill in tone, themes, setting pillars, what to avoid
- [x] `meta/difficulty.md` — **resolved 2026-06-11, confirmed:** rebuilt as two-axis spectrum (attrition × lethality) with frontmatter defaults, Rest Clock tracking in campaign Current State, level/rest staleness checks, and `/session` Phase 4 difficulty pick after hook selection
- [ ] `meta/difficulty.md` remaining gaps — fill Skill Challenge DC numbers, Non-Combat Stakes (load-bearing for roleplay-only sessions), and the party power-level note
- [ ] `meta/rewards.md` — fill in gold ranges, magic item philosophy, leveling pace *(still blank as of 2026-06-10)*
- [x] Create per-player files in `meta/players/` (copy `player-template.md` per player)
- [x] ~~Fill per-player files in `meta/players/`~~ — **obsolete 2026-06-11:** preference sections removed from player files by Jeff; cameo files (Tyler Miller, Elijah Fisch) deleted. Session generation draws on campaign tone/themes and `campaign-design-preferences.md` instead.

---

## Data — Canonical D&D
*Source material seeded from the 5e API or training knowledge. Forms the base creative pool.*

- [x] Monsters — 5 new fields on all ~544 files: `weaknesses`, `resistances`, `immunities`, `legendary`, `movement`. Schema updated. The one-off chunk scripts that did this were cleaned from `scripts/` after completion — they live in git history if the pattern is ever needed again (key gotcha preserved: MM files have UTF-8 BOM; read with `utf-8-sig` detection to handle both).
  - [x] Chunk B — Cultist → Gnoll Fang of Yeenoghu (Cu–Gn)
  - [x] Chunk C — Gnoll Pack Lord → Needle Blight (Go–N)
  - [x] Chunk D — Night Hag → Scarecrow (Ni–Sc)
  - [x] Chunk E — Sea Hag → Zombie (Se–Z)
- [x] Skills

---

## Map

All map work tracked in `todo-worldmap.md`. As of 2026-06-10: all label renames done and ingested (world + sky). Open: names from Paul (Mountains P, Islands A, plus unassigned Islift D/E, Channel B), compass rose, Struck/Arc Side decision.

---

## Optional / Stretch

- [ ] **Sea currents** — layer onto maritime trade routes for mechanical depth (speed/cost variance by direction, dominant port logic, seasonal shifts). High value if naval gameplay becomes recurring; skip if routes stay background flavor.
- [ ] **Private player→DM questionnaires** — players may want to submit secret backstory/motivation content that only Kellan (DM) sees. Current questionnaire flow assumes everything passes through the shared repo. No flow built yet — needs a private submission channel and a place for DM-only material.

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
