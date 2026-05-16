# Tag Registry

Authoritative list of all valid tags. **Before tagging any entity, check here.** Before using a tag that isn't listed, add it here first. This prevents tag drift (e.g. `race/elf` vs `elf` vs `elven`).

---

## Rules

- Tags follow `namespace/value` hierarchy for Obsidian/Foam nested tag support
- Do not use frontmatter tags for values that correspond to existing entity documents. If a race, class, faction, location, or other entity already exists as a markdown file, reference it in the document body with `[[wiki-link]]` syntax instead of adding it as a tag.
- `session/NN` tags increment with each session — add the new tag here when a session file is created

---

## Registry

| Tag | Applies to | Meaning |
|---|---|---|
| **class** | | |
| `class` | class entity | Entity type: playable class — flat tag, no subtype |
| `class/bard` | character | Character is a Bard |
| `class/wizard` | character | Character is a Wizard |
| **campaign/** | | |
| `campaign/curse-of-strahd` | any | Entity belongs to the Curse of Strahd campaign |
| **character/** | | |
| `character/npc` | character | Entity subtype: non-player character |
| `character/pc` | character | Entity subtype: player character |
| **deity/** | | |
| `deity/greater` | deity | Power tier: greater deity |
| `deity/intermediate` | deity | Power tier: intermediate deity |
| `deity/lesser` | deity | Power tier: lesser deity |
| `deity/demigod` | deity | Power tier: demigod |
| **domain/** | | |
| `domain/arcana` | deity | Divine domain: Arcana |
| `domain/death` | deity | Divine domain: Death |
| `domain/forge` | deity | Divine domain: Forge |
| `domain/grave` | deity | Divine domain: Grave |
| `domain/knowledge` | deity | Divine domain: Knowledge |
| `domain/life` | deity | Divine domain: Life |
| `domain/light` | deity | Divine domain: Light |
| `domain/nature` | deity | Divine domain: Nature |
| `domain/order` | deity | Divine domain: Order |
| `domain/peace` | deity | Divine domain: Peace |
| `domain/tempest` | deity | Divine domain: Tempest |
| `domain/trickery` | deity | Divine domain: Trickery |
| `domain/twilight` | deity | Divine domain: Twilight |
| `domain/war` | deity | Divine domain: War |
| **faction/** | | |
| `faction/barovia` | character, location | Member or seat of the Barovia ruling faction |
| `faction/durst-cult` | character | Member of the Durst death cult |
| **location/** | | |
| `location/dungeon` | location entity | Entity subtype: dungeon |
| `location/shop` | location entity | Entity subtype: shop (covers inns, taverns, and establishments) |
| `location/city` | location entity | Entity subtype: city or town |
| `location/region` | location entity | Entity subtype: region or territory |
| `location/wilderness` | location entity | Entity subtype: wilderness area |
| `location/death-house` | non-location entity | Association: entity is tied to Death House |
| **pantheon/** | | |
| `pantheon/faerûnian` | deity | Belongs to the Faerûnian pantheon |
| `pantheon/greyhawk` | deity | Belongs to the Greyhawk pantheon |
| `pantheon/nonhuman` | deity | Belongs to the nonhuman deity grouping |
| **player/** | | |
| `player/ben` | pc | Character played by Ben |
| `player/jeff` | pc | Character played by Jeff |
| `player/miguel` | pc | Character played by Miguel |
| `player/paul` | pc | Character played by Paul |
| **race** | | |
| `race` | race entity | Entity type: playable race — flat tag, no subtype |
| `race/aasimar` | character | Character is an Aasimar |
| `race/gnome` | character | Character is a Gnome |
| **session/** | | |
| `session/NN` | session | Identifies the session number — e.g. `session/01`, `session/11` |
| **size/** | | |
| `size/small` | race | Race size category: Small |
| `size/medium` | race | Race size category: Medium |
| `size/large` | race | Race size category: Large |
