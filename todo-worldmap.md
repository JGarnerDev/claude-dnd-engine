# World Map Todo

> Wind, climate bands, and geography consequences moved to [[World Geography]] (`data/lore/geography.md`) — reference, not a task.

## Step 10 — Labeling (remaining)

- [ ] Name the Struck Side / Arc Side hemispheres (or leave for player discovery)
- [ ] Add a compass rose

---

## Calenmere — names from Session 29 prep (2026-10-05)

Session 29 prep named **Velmora** (purple), **Riolgatha** (red), the **Moorthistle** (the border-river between them), and the fiefs **Stonemarch** and **Duskwater**. Nothing here blocks Tuesday's game; Silas's road sketch is the in-game map.

- [ ] **Decide which river is the Moorthistle** (blocks the label below). On the world master, the river between Plains H and the Ardenwall that runs into Calenmere is labeled **Bayward River**, and it lines up with the purple/red border on `maps/locations/calenmere-political.png`. But `data/locations/regions/Calenmere Basin.md` puts the Bayward's mouth at Bay-Head Hub (dot 6, blue), further east. Pick one:
  1. The Moorthistle *is* the river now labeled Bayward. Relabel it and move the Bayward name onto the dot-6 river.
  2. The Moorthistle is a separate river. Fix whichever label or draft is wrong.
- [ ] **Label the Moorthistle in Inkarnate** once decided. Follow the re-export steps in `maps/CLAUDE.md`: re-export, put the new url in `maps/sources.tsv`, run `fetch-maps.py --force` then `gen-tiles.py`, and add a Moorthistle row to `maps/world/index.md` → Known Region Positions.
- [ ] **Place Ashford on the world grid** at the Calenmere `/region` pass. Record its col/row in `maps/world/index.md`. It is newly placed, so it gets no city-registry ID (`data/locations/cities/Ashford.md` → Open).
- [ ] **Stonemarch/Duskwater regional map in Inkarnate**: a new overview map, not an update. It shows the Cael and Marlow fiefs, the Ashford ford, the Moorthistle stretch, and the raiders' overland routes up from Duskwater. Needed for Session 2's pursuit, not Session 1 (dashboard item 35).
- [ ] *(Optional)* **Put the nation names on the political overlay.** `calenmere-political.png` is a local colored overlay, not an Inkarnate export, so this is a local touch-up. Nations are not labeled on the world master, which only carries terrain and water.

---

## Deferred — `/region` detailing

All newly-created stubs are **name-only** (`exists: false`, body flagged "awaits /region pass"). Degrades until detailed: no geography, settlements, encounters, or routes.

### Paul's cluster (western Struck Side)

- [ ] `/region` pass — western Struck Side (Crystalline Vast, Great Carve, Hell's Reign, Watler's Way cluster)
- [ ] `/region` pass — Caldera's Brace / eastern Parhelion Ocean edge

### Kellan's cluster

- [ ] `/region` pass — Kethara (Continent F) + The Scorched Rim
- [ ] `/region` pass — Greywood (Continent G) + The Elderspine + The Maw + The Ember Strait
- [ ] `/region` pass — The Reach (Sub Continent E) + The Greymast
- [ ] `/region` pass — northern waters (The Pale Shore, The Collar)
- [ ] `/region` pass — southwestern waters (The Ashen Sea, The Westward Stones)
- [ ] `/region` pass — sky layer (The Watcher, The Companion)
- [ ] Continent C needs naming before The Ashwall's region link can be resolved

---

## Questions Still Open

- [ ] Struck Side / Arc Side — Scoping and balancing for world impact
- [ ] Struck Side / Arc Side — label on map or leave as in-world knowledge?
- [ ] Does the Caldera need an island rim or does it sit on an existing landmass?
