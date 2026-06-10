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
- [ ] Channel B → **Merchant's Run** — **label not located 2026-06-10.** No "Channel B" or "Merchant's Run" found on any tile (saw Channels C, E, I, J). Entity file says: channel between The Narrows and an eastern island, southern approach, pairs with a northern channel ("Lower Gate" pairing). Candidate area: around The Narrows / Sub Continent E (~cols 11–13, rows 4–6) — Channel C sits there, still placeholder. Needs DM to locate/confirm which strait this is before labeling.
- [x] Channel H → **The Southern Throat**
- [x] **Islands A — volcanic peak added** — crater + lava texture visible center-north of Islands A (verified 2026-06-10 crop)
- [x] **The Ashreaches label placed** on Islands A slopes between the peak and Cindermouth Bay
- [ ] Name **Mountains P** (volcanic range on Struck Side adjacent to The Caldera — separate from the Ashreaches) — still placeholder 2026-06-10
- [ ] Name **Islands A** (western ocean island chain below Channel I) — still placeholder 2026-06-10

---

## Label Corrections — World Layer (Miguel's correction, 2026-06-09)

*Manually edited by user — Claude cannot write to image files. Verified against `tiles/nw.png` 2026-06-10: all three old labels still on map.*

- [ ] Rename "The Greyback" → **Solmara** (sub-continent label) — nw tile, ~col 4–5, row 4
- [ ] Rename "The Stormwall" → **Ardenwall** (mountain range label) — nw tile, ~col 4, row 4–5
- [ ] Rename "The Greymaw" → **Calenmere** (bay label) — nw tile, ~col 5–6, row 4–5
- [ ] After edits: run `python scripts\gen-tiles.py`, then update `maps/world/index.md` Known Region Positions (Bay B entry) and Status line

---

## Sky Layer (`world-sky.png`)

*Manually edited by user — Claude cannot write to image files. Verified against `world-sky.png` 2026-06-10: all renames still pending. Whole sky cluster sits top-left, ~cols 2–4, rows 2–4 (Opticon's Fade at top, Slice A at bottom) — all five edits doable in one pass.*

- [ ] Rename "Slice A" → **The Stellar Daughter** (Paul's name, ingested 2026-06-09)
- [ ] Rename "Islift A" → **Arclight's Seat** (far left cluster, low altitude)
- [ ] Rename "Islift B" → **The Grey Reaches** (left cluster, mid-altitude)
- [ ] Rename "The Hearth" (Islift C) → **Darkling's Perch** (Paul's name wins; 2026-06-09)
- [ ] Rename "Islift G" → **The Hearth** (Miguel; reassigned from Islift C; nearest-to-surface right cluster)
- [ ] Add/verify **Islift D, E** labels once names are assigned (currently unnamed in questionnaire) — Islift F already labeled **The Landing** on map ✓
- [ ] Update `maps/world/index.md` Status line after any sky layer edits

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
