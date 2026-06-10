---
name: Homebrew World
aliases:
  - "The World"
type: location
subtype: region
exists: false
state: draft
campaign: homebrew
tags:
  - location
  - location/region
geography: "The entire homebrew setting — multiple continents and sub-continents, open oceans and inland seas, sky-borne islifts, orbital Slices, and connected outer planes."
controlling_faction: unknown
importance: critical
biome: [temperate-forest, desert, tundra, coastal, aerial]
description: "Draft world-root of the homebrew campaign — the whole setting that contains its continents, seas, skies, and the powers that vie across them. True name TBD, pending the world-naming questionnaires."
relates_to:
  - "[[Homebrew Campaign]] (campaign played in this world)"
  - "[[Solmara]] (surface — sub-continent)"
  - "[[Erevast]] (surface — region)"
  - "[[Caldrath]] (surface — region)"
  - "[[Solrath]] (surface — region)"
  - "[[Hightalon]] (surface — region)"
  - "[[Oathmark]] (surface — region)"
  - "[[Karath Ut'll]] (surface — region)"
  - "[[Ilurak Qeth]] (surface — region)"
  - "[[Iargulta]] (surface — region)"
  - "[[Mori]] (surface — region)"
  - "[[Deorum Ostium]] (surface — region)"
  - "[[The Narrows]] (surface — region)"
  - "[[The Ashreaches]] (surface — region)"
  - "[[The Cinder Plain]] (surface — region)"
  - "[[The Hidden Desert]] (surface — region)"
  - "[[The Pale Reach]] (surface — region)"
  - "[[The Pale Isles]] (surface — islands)"
  - "[[The Warm Isles]] (surface — islands)"
  - "[[The Saltbreak Isles]] (surface — islands)"
  - "[[Islands A]] (surface — islands)"
  - "[[The Landing]] (sky — islift)"
  - "[[The Hearth]] (sky — islift)"
  - "[[Arclight's Seat]] (sky — islift)"
  - "[[The Grey Reaches]] (sky — islift)"
  - "[[Darkling's Perch]] (sky — islift)"
  - "[[Opticon's Fade]] (sky — orbital colony)"
  - "[[Opticon's Rest]] (sky — rumored)"
  - "[[The Slices]] (orbital)"
  - "[[The Stellar Daughter]] (orbital — Slice)"
  - "[[Astra]] (celestial body)"
---

# Homebrew World

The world-root entity for the **homebrew campaign** — the top-level setting that every continent, sea, sky-island, faction, and trade route in `data/` ultimately belongs to. Factions and resources that operate "across the world" link here via the alias **The World**.

**Draft status:** this entity stays in `state: draft` until the world receives its true name from the world-naming questionnaires (`questionnaires/world-naming*.md`). When named, rename this file and `name:` field to match, keeping "Homebrew World" and "The World" as aliases.

This world is **separate and distinct from the Curse of Strahd campaign**. Barovia and its mists belong to `campaign: strahd`; this setting is `campaign: homebrew`. The two do not bleed together except where the DM deliberately stages a crossover. The campaign played in this world is [[Homebrew Campaign]].

## Surface regions

Landmasses, sub-continents, and island chains on the world map (`maps/world/world-names.png`):

- [[Solmara]] — warm, forested sub-continent on the western edge
- [[Erevast]] — mixed-race civilized heartland
- [[Caldrath]] — lower main landmass; desert interior, tallest mountains in the world
- [[Solrath]] — desert trade chokepoint guarding central ocean routes
- [[Hightalon]] — dwarven-influenced industrial sub-continent; sky pirates and guilds
- [[Oathmark]] — hard seafaring noble raiders bound by their code
- [[Karath Ut'll]] — desert continent of decentralized lizard-people tribes
- [[Ilurak Qeth]] — ancient arctic peoples; something buried under the ice
- [[Iargulta]] — remote volcanic island cluster seeded by Astra impact ash
- [[Mori]] — dense ancient forest sub-continent in the remote southeast
- [[Deorum Ostium]] — the Gods' Door, all-religion pilgrimage site in the ice
- [[The Narrows]] — contested transitional sub-continent between the main landmasses
- [[The Ashreaches]] — volcanic ash terraces, sole source of ashwake (coffee)
- [[The Cinder Plain]] — volcanic desert of ash-dark sand
- [[The Hidden Desert]] — mountain-enclosed desert sunken into a sub-continent's interior
- [[The Pale Reach]] — pale, permanently glaciated southernmost landmass
- [[The Pale Isles]] — cold scattered islands halfway to the ice
- [[The Warm Isles]] — relatively warm islands off the southwestern reach
- [[The Saltbreak Isles]] — pirate-dominated crossroads with no formal law
- [[Islands A]] — frontier island chain in the western ocean *(provisional map letter, awaiting name)*

## Sky and orbital regions

Air-situated features live on the sky layer (`maps/world/world-sky.png`), not the surface map:

- [[The Landing]] — lowest, most accessible eastern islift; primary sky–surface interface
- [[The Hearth]] — lowest right-side islift cluster, first-contact point in the east
- [[Arclight's Seat]] — low-altitude islift cluster, seat of the Climbers
- [[The Grey Reaches]] — mid-altitude neutral trade cluster between Climbers and Divers
- [[Darkling's Perch]] — high-altitude islift cluster, the Divers' seat of power
- [[Opticon's Fade]] — less prosperous orbital colony with a Mintner dust-economy
- [[Opticon's Rest]] — rumored location beyond a portal; nothing else known
- [[The Slices]] — large orbital island masses cast up by the Astra impact
- [[The Stellar Daughter]] — lower of the two great orbital Slices, bleeding water onto the islifts
- [[Astra]] — the returning astral body itself, on its thousand-year Glistening cycle

## Outer planes

The standard D&D planar regions in `data/locations/regions/` (Underdark, Feywild, the Outer and Inner Planes, etc.) are shared cosmology reference material, campaign-agnostic — connected to this world but not part of its map. They are deliberately not listed as children here.

## Pending detail

Additional continents, seas, rivers, and islifts are detailed (or still pending detail) under `data/locations/regions/` and `data/locations/terrain-features/`. Provisional map labels (e.g. "Continent G", "Ocean A") in `data/routes/` are placeholders awaiting reconciliation to their named entities.
