# World Map Todo

## Decisions Made

- **Scale:** Full world map
- **Wind direction:** West to East (prevailing westerlies)
  - West-facing coasts and west sides of mountain ranges = wet, lush, forested
  - East sides of mountain ranges = dry (rain shadow) — deserts and scrubland go here
  - East-facing coasts = drier, especially if cut off by inland mountains
- **Climate bands:** Both poles cold, equator at map center, standard Earth-like
  - Top = arctic/tundra → upper quarter = cold temperate → upper-middle = warm temperate → middle = tropical → mirrors back to bottom

---

---

## Step 10 — Labeling

- [x] Name the seas and oceans between landmasses
- [x] Name major mountain ranges
- [x] Name major rivers (A–M+ added; unnamed but placed)
- [ ] Name the Struck Side / Arc Side hemispheres (or leave for player discovery)
- [x] Name regions by biome or culture zone (forests, plains, deserts, tundra all labeled)
- [ ] Add a compass rose

---

## Step 11 — Player Contributions

- [x] Jeff — Serhari (plains vine, ritual preparations) — find geographic home
- [x] Ben — world naming questionnaire complete (18 features named)
- [x] Miguel — 20 entities ingested (19 named features + Ashreaches); see below for map label updates needed
- [x] Paul — world naming answers ingested 2026-06-13 (6 features: Crystalline Vast, Tempered Parting, The Great Carve, Hell's Reign, Watler's Way, Caldera's Brace); see Paul's section below for map label work
- [x] Kellan — world naming questionnaire ingested 2026-06-14 (17 features); see Kellan's section below for map label work

---

## Current Pass — Map Improvements

### Contrast fixes (labels exist, just hard to read)
- [x] Invert label color on Tundra (north Erevast fringe)
- [x] Invert label color on Azel Samarat (~Col 7–8, Row 6–7)

### Plainslands — add terrain labels
- [x] Plains east of Gordrathi Mountains (~Col 8–9, Row 6–7) — rain shadow zone, strongest candidate
- [x] Plains interior of Sub Continent A (~Col 9–11, Row 4–6) — broad flat zone between mountain ranges
- [x] Plains west of Hightalon (~Col 9–10, Row 3–4) — open terrain before Watchwall/Irongate
- [x] Plains interior of Continent B (~Col 5–7, Row 7–8) — between central mountain ranges

### Forest labels — add 2–3
- [x] Forest label in Erevast interior (draft confirms "forested interior")
- [x] Forest label in eastern jungles / Virethorn Range zone
- [x] Forest label in south Continent B (if terrain texture confirms)

### Virethorn Range
- [x] Replace Jade Jaw Spikes label with Virethorn Range (~Col 14–15, Row 4–6)

### Rivers — optional but high worldbuilding value
- [x] Add 2–3 major unlabeled river marks draining east/southeast off mountain ranges
- [x] River mouth cities implied by economic notes — mark key mouths

### Far east (Continent H cluster)
- [x] Add terrain character beyond continent-level labels — forest, jungle, or plains as terrain warrants

---

## Miguel's Map Label Updates

Replace placeholder labels with Miguel's canonical names.
**Verified against tiles 2026-06-10** — the 2026-06-08 image replacement landed nearly all of these:

- [x] Continent B → **Caldrath**
- [x] Continent E → **The Pale Reach**
- [x] Sub Continent A → **The Narrows**
- [x] Sub Continent C → **The Greyback** *(superseded — now renames to Solmara, see Label Corrections below)*
- [x] Mountains B → **The Stormwall** *(superseded — now renames to Ardenwall, see Label Corrections below)*
- [x] Mountains F → **The Broken Back**
- [x] Mountains H → **The Pale Spire**
- [x] Mountains M → **The Divide**
- [x] Desert E → **The Cinder Plain**
- [x] Desert G → **The Hidden Desert**
- [x] Islands E → **The Pale Isles**
- [x] Islands H → **The Warm Isles**
- [x] Islift C → **The Hearth** *(superseded — now renames to Darkling's Perch, see Sky Layer below)*
- [x] Islift F → **The Landing**
- [x] Sea C → **The Amber Sea**
- [x] Bay B → **The Greymaw** *(superseded — now renames to Calenmere, see Label Corrections below)*
- [x] Bay E → **Cindermouth Bay**
- [x] **Merchant's Run** — label on map (se tile, strait between Continent F and Mori, ~col 12–13, row 9; confirmed by DM + tile read 2026-06-10)
- [x] **Merchant's Run placement vs. canon mismatch — resolved 2026-06-10.** Map won per protocol: entity `region` corrected to [[Mori]], description re-anchored to the Continent F ↔ Mori strait (DM approved). Consequence: questionnaire's **Channel B** (Narrows southern approach, pairs with Channel C) is still unnamed — back in the naming pool.
- [x] Channel H → **The Southern Throat**
- [x] **Islands A — volcanic peak added** — crater + lava texture visible center-north of Islands A (verified 2026-06-10 crop)
- [x] **The Ashreaches label placed** on Islands A slopes between the peak and Cindermouth Bay
- [x] Name **Mountains P** → **Hell's Reign** (Paul, 2026-06-13) — entity created
- [x] Name **Islands A** → **Watler's Way** (Paul, 2026-06-13) — entity renamed

---

## Paul's Map Label Updates (answers ingested 2026-06-13)

Entities created/renamed in `data/`. Map tiles **not yet updated** — these are placeholder map letters awaiting labels on `world-names.png`:

- [ ] **Ocean A** → **Crystalline Vast** (western ocean; phosphorescent on Showering nights)
- [ ] **Channel I** → **Tempered Parting** (was placeholder-labeled "Channel I"; far-left, separates Watler's Way from Struck Side)
- [ ] **Mountains O** → **The Great Carve** (outer rim of the Caldera's Struck Side)
- [ ] **Mountains P** → **Hell's Reign** (inner crater wall, deeper into Struck Side)
- [ ] **Islands A** → **Watler's Way** (western volcanic chain; hosts the Ashreaches)
- [ ] **Islands D** → **Caldera's Brace** (far-right / eastern wrap-seam edge; magma-splash ejecta — note this is the *same meridian* as the Caldera per the projection wrap)

### Deferred — `/region` detailing
The 4 newly-created stubs are **name-only** (`exists: false`, body flagged "awaits /region pass"). Degrades until detailed: no geography, settlements, encounters, or routes for the western Struck Side waters / Struck Side ranges / eastern ejecta islands.

- [ ] `/region` pass — western Struck Side (Crystalline Vast, Great Carve, Hell's Reign, Watler's Way cluster)
- [ ] `/region` pass — Caldera's Brace / eastern Parhelion Ocean edge

---

## Kellan's Map Label Updates (answers ingested 2026-06-14)

Entities created in `data/`. Map tiles **not yet updated** — these are placeholder map letters awaiting labels on `world-names.png` (ground) and `world-sky.png` (islifts):

- [ ] **Continent F** → **Kethara** (lower-right arid landmass)
- [ ] **Continent G** → **Greywood** (eastern forested island-continent)
- [ ] **Sub Continent E** → **The Reach** (upper-right, faces main continent)
- [ ] **Mountains G** → **The Scorched Rim** (southern range of Kethara)
- [ ] **Mountains I** → **The Greymast** (eastern spine of The Reach)
- [ ] **Mountains K** → **The Elderspine** (Greywood southern forest range)
- [ ] **Mountains Q** → **The Ashwall** (Continent C volcanic range)
- [ ] **Desert F** → **The Amber Plain** (center-right, The Narrows area)
- [ ] **Islands I** → **The Pale Shore** (upper-right, north of The Reach)
- [ ] **Islands J** → **The Westward Stones** (lower-left, near Continent C/D)
- [ ] **Sea F** → **The Ashen Sea** (southwest volcanic sea)
- [ ] **Bay D** → **The Maw** (Greywood west coast)
- [ ] **Channel C** → **The Collar** (northern approach between main continent and Greywood)
- [ ] **Channel E** → **The Ember Strait** (far right of Greywood, volcanic island across)
- [ ] **Channel J** → **The Rift** (lower-center gap in main continent)
- [ ] **Islift D** → **The Watcher** (upper-left, high altitude) — on `world-sky.png`
- [ ] **Islift E** → **The Companion** (upper center-right, paired with The Watcher) — on `world-sky.png`

### Deferred — `/region` detailing

All 17 entities are **name-only** (`exists: false`, body flagged "awaits /region pass"). Degrades until detailed: no geography, settlements, encounters, or routes.

- [ ] `/region` pass — Kethara (Continent F) + The Scorched Rim
- [ ] `/region` pass — Greywood (Continent G) + The Elderspine + The Maw + The Ember Strait
- [ ] `/region` pass — The Reach (Sub Continent E) + The Greymast
- [ ] `/region` pass — northern waters (The Pale Shore, The Collar)
- [ ] `/region` pass — southwestern waters (The Ashen Sea, The Westward Stones)
- [ ] `/region` pass — sky layer (The Watcher, The Companion)
- [ ] Continent C needs naming before The Ashwall's region link can be resolved

---

## Label Corrections — World Layer (Miguel's correction, 2026-06-09)

*New ground image ingested 2026-06-10, all three renames verified on regenerated nw tile:*

- [x] Rename "The Greyback" → **Solmara** (sub-continent label)
- [x] Rename "The Stormwall" → **Ardenwall** (mountain range label)
- [x] Rename "The Greymaw" → **Calenmere** (bay label)
- [x] Tiles regenerated (`gen-tiles.py`), `index.md` positions (Solmara, Ardenwall, Calenmere) and Status line updated (2026-06-10)

---

## Sky Layer (`world-sky.png`)

*New sky image ingested 2026-06-10, all five renames verified at full res:*

- [x] Rename "Slice A" → **The Stellar Daughter** (Paul)
- [x] Rename "Islift A" → **Arclight's Seat** (far left cluster, low altitude)
- [x] Rename "Islift B" → **The Grey Reaches** (left cluster, mid-altitude)
- [x] Rename "The Hearth" (Islift C) → **Darkling's Perch** (Paul's name wins; 2026-06-09)
- [x] Rename "Islift G" → **The Hearth** (Miguel; reassigned from Islift C; nearest-to-surface right cluster)
- [x] Add **Islift D, E** labels once names are assigned — **The Watcher** (D, Kellan), **The Companion** (E, Kellan); Islift F already labeled **The Landing** ✓
- [x] Update `maps/world/index.md` Status line (2026-06-10)

---

## Questions Still Open

- [ ] Struck Side / Arc Side — Scoping and balancing for world impact
- [ ] Struck Side / Arc Side — label on map or leave as in-world knowledge?
- [ ] Does the Caldera need an island rim or does it sit on an existing landmass?

### Plains alignment (questionnaire vs. map)

- [x] **Plains A** — confirmed: northwest of Azel Samarat (~col 6–7, row 5–6). Southern Erevast forest margin / desert transition. Questionnaire updated.
- [x] **Plains B** — confirmed: southeast of Mountains M, western edge of the Irongate Sea (~col 9–10, row 4–5). Eastern Erevast. Also matches TODO's "plains west of Hightalon." Questionnaire updated.
- [x] **Plains C** — confirmed: south of Oathmark (~col 11, row 3–4). Coastal plain between Oathmark and Hightalon/Watchwall. Questionnaire updated.
- [x] Plains count reconciled — 5 questionnaire entries match 5 real map features. No phantom entries.

### Rivers alignment (questionnaire vs. map)

- [x] **River count reconciled** — confirmed via high-res map crop: Rivers A, B, C, D, E, F, G, H, I, K, M placed on map. Questionnaire updated with all confirmed rivers; descriptions corrected to match actual positions. Previous descriptions (A–G) were all fabricated from geography, not read from map.
- [x] **Plains count reconciled** — confirmed via high-res map crop: Plains A–J placed on map. Questionnaire updated with all 10 entries. Plains D corrected to upper-right Erevast (was mislabeled as Continent B). Plains F, G, H, I, J added. Plains J = what was previously mislabeled as questionnaire Plains D (Continent B interior near Mountains F).

---

## World Notes — Geography Consequences

### Political
- Separate landmasses = civilizations developed in isolation — first contact is a major historical event, not gradual
- Mountain ranges are hard political borders — kingdoms form on one side, rarely spanning both
- Narrow sea passages are the most fought-over territory — whoever controls them controls everything
- The right narrow island flanks a major sea lane — small nation, outsized political influence
- The northern large continent is most likely to produce an empire
- Mountain passes are chokepoints — small kingdoms holding one can punch far above their weight

### Social
- West coast vs east coast peoples develop radically different cultures on the same landmass
- Mountain communities are insular and traditional
- River valley settlements are cosmopolitan — rivers mix peoples
- The dramatic central peaks are visible from enormous distances — likely sacred across multiple cultures
- Desert peoples develop nomadic or oasis-based societies
- Every landmass being an island means seafaring is universal, not specialized
- The Slices dominate the night sky — every culture has myths and religions built around them
- Islifts cast periodic shadows — feared or celebrated depending on culture

### Economic
- Every major river mouth becomes a city
- Mountain passes become toll points
- West coasts agriculturally rich; east dry zones produce pastoral goods and luxury exports
- Internal seas are trade highways — sea travel easier than crossing mountains
- Desert regions must import food, export rare goods — creates dependency relationships
- The narrow right island could be the wealthiest place on the map from transit fees
- Whatwill trade dominates the Arc Side economy — proximity to Showering sites determines power
