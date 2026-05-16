# TODO — Campaign Engine Setup

Progress tracker for getting this project ready to generate sessions and run campaigns.

---

## Infrastructure

- [x] `CLAUDE.md` — project instructions, entity protocol, reading strategy, free entity rule
- [x] `/inventory` command — free entity status report
- [x] `meta/references.md` — external API and wiki lookup guide
- [x] `meta/worldbuilding-approach.md` — worldbuilding philosophy for Claude

---

## Meta Configuration
*These files exist as placeholders. They need actual campaign content before session generation will be meaningful.*

- [ ] `meta/worldbuilding.md` — fill in tone, themes, setting pillars, what to avoid
- [ ] `meta/difficulty.md` — fill in party profile, encounter mix, DC ranges
- [ ] `meta/rewards.md` — fill in gold ranges, magic item philosophy, leveling pace
- [ ] Create per-player files in `meta/players/` (copy `player-template.md` per player)

---

## Schemas
*Defines how entities are created. Add new schemas here as new entity types are needed.*

- [x] Base entity schema (`meta/schemas/entity.md`)
- [x] Faction (`meta/schemas/faction.md`)
- [x] Location — Region (`meta/schemas/location-region.md`)
- [x] Location — City (`meta/schemas/location-city.md`)
- [x] Location — Shop (`meta/schemas/location-shop.md`)
- [x] Location — Dungeon (`meta/schemas/location-dungeon.md`)
- [x] Location — Wilderness (`meta/schemas/location-wilderness.md`)
- [x] Character — NPC (`meta/schemas/character-npc.md`)
- [x] Character — PC (`meta/schemas/character-pc.md`)
- [x] Item — Magic (`meta/schemas/item-magic.md`)
- [x] Event (`meta/schemas/event.md`)
- [x] Deity (`meta/schemas/deity.md`)
- [x] Rumor (`meta/schemas/rumor.md`)
- [x] Race (`meta/schemas/race.md`)
- [x] Campaign (`meta/schemas/campaign.md`)
- [x] Act (`meta/schemas/act.md`)
- [x] Mission (`meta/schemas/mission.md`)
- [x] Session (`meta/schemas/session.md`)
- [x] Item — Mundane (for significant non-magic objects: heirlooms, quest items, relics)
- [x] Creature (for notable monsters with personality and recurring presence, distinct from stat blocks)

---

## Data — Canonical D&D
*Source material seeded from the 5e API or training knowledge. Forms the base creative pool.*

- [x] Deities — Faerûnian pantheon (56)
- [x] Deities — Greyhawk pantheon (23, including shared)
- [x] Deities — Nonhuman racial deities (23, including shared)
- [x] Races — all PHB and major supplement races (38)
- [ ] Monsters — seed `data/creatures/` with notable monsters from the 5e API (good for dungeon population and encounter planning)
- [ ] Magic items — seed `data/items/magic/` with canonical items from the 5e API
- [ ] Spells — consider a `data/spells/` reference or inline on NPC/item files
- [x] Backgrounds — seed `data/backgrounds/` for PC/NPC creation reference
- [x] Classes — seed `data/classes/` for PC/NPC creation reference

---

## Data — Campaign-Specific
*World-building work that requires creative input. These populate the free entity pool for session generation.*

### World Structure
- [ ] Create at least one **Region** — the area where the campaign takes place
- [ ] Create a **starting city** — the home base or first major location
- [ ] Create 2–3 **factions** — powers that shape local politics and conflict
- [ ] Create key **wilderness areas** — roads, forests, or landmarks near the starting city
- [ ] Create 1–2 **dungeons** — available adventure sites within reach

### Characters
- [ ] Create **PC files** for each player character (`data/characters/pcs/`)
- [ ] Create **key NPC files** — at minimum: quest-giver, innkeeper, local authority, recurring contact

### History & Hooks
- [ ] Create 2–3 **historical events** that shaped the current world state
- [ ] Create a handful of **rumors** — in-world hooks players can discover
- [ ] Create at least one **faction** with clear motives, tensions, and opposition

### Shops & Services
- [ ] Populate the starting city with at minimum: an inn, a mundane shop, and a magic shop (each chains to an NPC proprietor)

---

## Historian
- [x] Folder structure mirrors `data/` — ready to receive canonized entities
- [x] `historian/sessions/` and `historian/missions/` created for post-play records
- [x] Sessions 1–10 backfilled from D&D Notes.docx (with reliability annotations)
- [x] PC files created: Iggy, Luci, Odibli, Dip (reliability flags on unconfirmed details)
- [x] NPC files created: Strahd, Rose, Thorn, Nursemaid, Gustav, Elisabeth, Walter Durst
- [x] Location files created: Death House (dungeon, cleared), Black Sheep Inn (shop, banned)
- [x] Party entity created: `historian/characters/parties/The Party.md` — skeleton only
- [ ] Add detail to current party (`historian/characters/parties/The Party.md`) — formation story, reputation, goals; confirm full names and classes for Luci and Dip with DM
- [ ] Confirm unresolved details with DM/players — see reliability notes in each file
- [ ] Backfill additional entities invented at the table as they're confirmed

---

## Scheduler
- [x] Folder structure created (`acts/`, `missions/`, `sessions/`)
- [x] Story hierarchy defined: Campaign → Act → Mission → Session
- [x] `scheduler/campaign.md` — root campaign document created
- [ ] Create **first act** now that campaign document exists
- [ ] Create **first mission(s)** once the opening act is defined
- [ ] Draft the **first session plan** once meta configuration and starting data are in place

---

## Obsidian Health

### 1. Rename remaining entity files to match frontmatter `name:` fields
**Why:** Obsidian resolves `[[wikilinks]]` by filename. Kebab-case or lowercase filenames break graph edges. Fixed `data/classes/` and `data/deities/` — remaining dirs need same audit.

**Dirs to audit:**
- `data/characters/npcs/`, `data/characters/pcs/`, `data/factions/`, `data/locations/**`, `data/items/**`, `data/races/`, `data/events/`, `data/rumors/`, `data/creatures/`
- `historian/` — all subdirs

**How:** Compare `basename(file)` to frontmatter `name:` field. Rename where they differ.

- [x] `data/` dirs audited and renamed
- [x] `historian/` dirs audited and renamed

---

### 2. Fix malformed frontmatter (`--- OPTIONAL ---` pattern)
**Why:** `--- OPTIONAL ---` inside a YAML block is a document separator — breaks Obsidian parsing. Fields after it may be silently dropped.

**What to do:**
- Audit all entity files for `--- OPTIONAL ---` inside frontmatter
- Remove the marker; keep the fields (make them always-present with `unknown` default)
- Fix source templates in `meta/schemas/` so new entities don't inherit the problem

- [x] Schema templates fixed
- [x] Existing entity files fixed

---

### 3. Audit tags — replace entity-ref tags with wikilinks
**Why:** CLAUDE.md rule: don't tag things that have entity files. Tags like `faction/barovia` are dead strings with no graph edge. `[[Barovia]]` wikilink in body creates a real graph edge.

**What to do:**
- Search all files for tags matching `faction/*`, `location/*`, `campaign/*`
- Remove tag; add `[[EntityName]]` wikilink in document body under relevant section
- Keep categorical tags (`character/npc`, `state/alive`) — these have no entity counterpart

- [x] Audit complete
- [x] Entity-ref tags replaced with wikilinks

---

### 4. Install Obsidian community plugins
**Why:** Rich structured frontmatter but no tooling to query or template it.

- [ ] **Dataview** — query entity pools as live tables in Obsidian (replaces `/inventory` for browsing)
  ```dataview
  TABLE importance, state, location FROM "data/characters/npcs" WHERE exists = false SORT importance DESC
  ```
- [ ] **Templater** — wire `meta/schemas/` templates so new entities auto-populate mandatory frontmatter
- [ ] **DB Folder** *(optional)* — spreadsheet view for bulk-editing `importance`, `state`, `active` fields

**Install:** Obsidian → Settings → Community Plugins → Browse → search → Install → Enable.
