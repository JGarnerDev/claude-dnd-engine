# World Map Todo

> Wind, climate bands, and geography consequences moved to [[World Geography]] (`data/lore/geography.md`) — reference, not a task.

## Step 10 — Labeling (remaining)

- [ ] Name the Struck Side / Arc Side hemispheres (or leave for player discovery)
- [ ] Add a compass rose

---

## Calenmere — names from Session 29 prep (2026-10-05)

Session 29 prep named **Velmora** (purple), **Riolgatha** (red), the **Moorthistle** (the border-river between them), and the fiefs **Stonemarch** and **Duskwater**. Nothing here blocks Tuesday's game; Silas's road sketch is the in-game map.

- [x] **Rivers decided (2026-10-08).** The **Moorthistle** is the upper branch: it runs from dot 10's lake east past Ashford, then loops south past dot 9 to the junction with a western branch. It is a tributary, and it is the purple/red border. Below the junction, the big river to the bay is the **Broadwend**, the red/navy border. Its old "Bayward River" label is already removed. **Bayward** moves to River F, whose mouth is at Tassad.
- [ ] **Label the rivers in Inkarnate**, in one export: add *Moorthistle* on the upper branch only (lake to junction), add *Broadwend* from the junction to the bay, and rename River F to *Bayward River*. Label **Orrend** on dot 9 (`C05-04d`). Graduate Tassad (`C06-05a`) and Orrend in the same pass by removing their dots from the markers map. Then follow the re-export steps in `maps/CLAUDE.md`: put the new url in `maps/sources.tsv`, run `fetch-maps.py --force` then `gen-tiles.py`, and re-check the river rows in `maps/world/index.md` against the new tiles.
- [ ] **Place Ashford on the world grid** at the Calenmere `/region` pass. Record its col/row in `maps/world/index.md`. It is newly placed, so it gets no city-registry ID (`data/locations/cities/Ashford.md` → Open).
- [ ] **Stonemarch/Duskwater regional map in Inkarnate**: a new overview map, not an update. It shows the Cael and Marlow fiefs, the Ashford ford, the Moorthistle stretch, and the raiders' overland routes up from Duskwater. Needed for Session 2's pursuit, not Session 1 (dashboard item 35).
- [ ] **Build Silas's road sketch**, the party's first map, as a layered player handout. Brief: `maps/handouts/silas-road-sketch.md` (Layer 1 Silas, Layer 2 Sable's road east; it lists 6 proposed canon items to confirm). Handed over in Session 30 at `S2_HORSES`. It covers the same ground as the Stonemarch/Duskwater overview below; build the DM overview from it, or drop that one.
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
