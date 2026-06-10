---
name: Homebrew World
aliases:
  - "The World"
type: location
subtype: region
exists: false
state: stable
campaign: homebrew
tags:
  - location
  - location/region
geography: "The entire homebrew setting — multiple continents and sub-continents, open oceans and inland seas, sky-borne islifts, and connected outer planes."
controlling_faction: unknown
importance: critical
biome: [temperate-forest, desert, tundra, coastal, aerial]
description: "The world-root of the homebrew campaign — the whole setting that contains its continents, seas, skies, and the powers that vie across them."
relates_to:
  - [[Solmara]] (sub-continent)
  - [[Solrath]] (region)
  - [[Caldrath]] (region)
  - [[Erevast]] (region)
---

# Homebrew World

The world-root entity for the **homebrew campaign** — the top-level setting that every continent, sea, sky-island, faction, and trade route in `data/` ultimately belongs to. Factions and resources that operate "across the world" link here via the alias **The World**.

This world is **separate and distinct from the Curse of Strahd campaign**. Barovia and its mists belong to `campaign: strahd`; this setting is `campaign: homebrew`. The two do not bleed together except where the DM deliberately stages a crossover.

## Major regions

The world spans several landmasses and a sky layer, including:

- [[Solmara]] — warm, forested sub-continent on the western edge
- [[Solrath]]
- [[Caldrath]]
- [[Erevast]] — the heartland mix of peoples

Additional continents, seas, rivers, and islifts are detailed (or still pending detail) under `data/locations/regions/` and `data/locations/terrain-features/`. Provisional map labels (e.g. "Continent G", "Ocean A") in `data/routes/` are placeholders awaiting reconciliation to their named entities.
