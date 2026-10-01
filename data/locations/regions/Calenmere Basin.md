---
# --- MANDATORY (entity base) ---
name: "Calenmere Basin"
type: location
subtype: region
exists: false
state: frontier
tags:
  - location
  - location/region

# --- MANDATORY (region) ---
geography: "Spans world grid cols 3–6, rows 3–5 — anchored on the Solmara peninsula, the Calenmere bay, and the river-fed plains of west Erevast, from the southwest ocean coast up to the southern base of Mountains C. Rocky storm coast west, sheltered warm bay south, fertile river plains center, mountain wall north, forest margin east."
controlling_faction: unknown

# --- OPTIONAL (entity base) ---
aliases:
  - "Solmara Strip"
importance: major
active: true
relates_to:
  - "[[Solmara]] (peninsula sub-continent forming the region's western zone)"
  - "[[Calenmere]] (central bay — the region's trade heart)"
  - "[[Ardenwall]] (peninsula mountain range)"
  - "[[The Myriad]] (island waypoints on the southwest sea lane)"
description: "Draft region document for the homebrew-world starting area: 12 anchor cities selected from 48 registry markers, grouped into four geographic zones, seeding seven small nations around the Calenmere bay."

# --- OPTIONAL (region) ---
climate: "Warm temperate maritime shading Mediterranean at the bay — wet winters, dry summers, west-to-east prevailing winds. Outer west coast wet and storm-prone; bay shore sunny and sheltered; rain shadow east of Ardenwall's ridge."
biome: [coastal, temperate-forest, grassland, alpine]
tensions:
  - "Control of the bay mouth strait"
  - "Bay-head port dependence on plains grain"
  - "Mountain ore must transit river-fork tolls"
  - "Island waypoints on the southwest lane held by no one"
notable_features:
  - "Bayward River"
  - "River F / Deepwend confluence"
  - "Trillindra River estuary"
  - "Mountains C southern wall"
---

# Calenmere Basin — Region Draft

**Status:** Phase 4 draft ("Calenmere Basin" is a working name — final name belongs to the DM/players). World position: grid cols 3–6, rows 3–5 (bay-and-strip core on cols 4–5, row 4; anchors reach into the neighboring cells), west coast of the Erevast landmass, northern hemisphere (~3 cells above the equator row). Scale: ~2000km east–west. Water: [[Calenmere]], an ocean-connected bay opening west-southwest; drainage sink for every river in the strip. Sea passage runs north toward Watcher's Way waters and southwest past [[The Myriad]] toward the open ocean.

Canon constraints honored: [[Solmara]] (~8 settlements, moderate density — caps the peninsula zone), [[Ardenwall]] (difficult passes, never sealed), [[Calenmere]] (main trading hub at the bay mouth, fishing fleets year-round).

Travel baseline (from region scale): sea ship ~150km/day, river barge 80 down / 30 up, horse 60, foot 30. Anchor spacing averages ~580km — neighbors are typically 3–5 days by ship, 8–12 by horse.

---

## Zone A — Bay & Rivers (the trade heart)

### Bay-Head Hub (1) — C05-04h (col 5.2, row 4.2)

- **Geography:** North shore of [[Calenmere]] where the Bayward River meets salt water. Green river-silt water, gentle shore, the largest natural harbor in the bay. This is the "main settlement at the bay mouth" of the Calenmere draft *(miguel's terrain-feature)*.
- **Role:** Primary trade port and the region's de facto commercial capital.
- **Suggested resources:** [[Fish]], [[Timber]] (floated down the Bayward), [[Grain]] (re-export from the plains), [[Salt]]; imported [[Coffee]] *(miguel's resource — Ashreaches monopoly good, arrives by sea; a coffeehouse quarter is plausible, suggested)*.
- **Transportation:** Sea ship + river barge + coastal road. Ship: ~3 days to East-Shore Port (3), ~3–4 days to Strait jaws (4)/(5). Barge upriver to Plains Center (10): ~8 days down / ~21 up.
- **Racial composition (suggested):** Cosmopolitan — human majority, halfling rivermen, dwarf and half-elf merchant minorities. Rationale: biggest port, river-and-sea junction.
- **Military:** Moderate — customs revenue funds a harbor fleet and walls; depends on food imports, so it fights short wars.
- **Diplomatic relations (inferred):** Dependent on Plains Center (10) for grain — friendly by necessity. Rival of East-Shore Port (3) for bay carriage. Wary of whoever holds the strait (4)/(5) — its entire trade exits through their water.

### River-Fork Toll (2) — C06-04b (col 5.6, row 3.9)

- **Geography:** The River F / Deepwend confluence above the bay — two navigable rivers becoming one. Every barge from the northern interior passes this fork.
- **Role:** River toll city; inland gateway.
- **Suggested resources:** Toll revenue over goods; [[Grain]], [[Timber]] rafts in transit, [[Clay]] (riverbank), [[Hides]].
- **Transportation:** River barge both forks + road along either bank. Downstream to Bay-Head Hub (1): ~6 days. Upstream toward Mountain Gate (11): ~13 days down from the mountains, far longer up.
- **Racial composition (suggested):** Mixed river-trade population — human, halfling, gnome clerks. Rationale: toll cities collect people the way they collect fees.
- **Military:** Moderate — tolls fund a standing garrison and river chains; no field army.
- **Diplomatic relations (inferred):** Structural friction with Mountain Gate (11) and Forest Edge (12) — their exports pay its tolls. Bay-Head Hub (1) needs its river open; alliance or absorption both plausible.

### East-Shore Port (3) — C06-04g (col 5.9, row 4.2)

- **Geography:** Northeast shore of the bay where Forest A meets the water — timber country with a harbor.
- **Role:** Secondary port; timber outlet.
- **Suggested resources:** [[Timber]] (primary), [[Hides]], [[Amber]] (forest resin), [[Stonecap Mushroom]] *(jeff's resource — forest-floor staple, suggested)*, [[Fish]].
- **Transportation:** Sea ship + forest tracks. Ship: ~3 days to Bay-Head Hub (1). Overland to Forest Edge (12): ~12–15 days by horse through forest margin.
- **Racial composition (suggested):** Human loggers with elf and firbolg forest-folk presence. Rationale: working forest edge, not deep wood.
- **Military:** Weak-moderate — shipwright capacity matters more than soldiers; can build fleets it cannot crew.
- **Diplomatic relations (inferred):** Rival of Bay-Head Hub (1) for carriage; natural supplier to every navy on the bay — courted by all, trusted by none.

### Trillindra Mouth (6) — C06-05a (col 5.6, row 4.6)

- **Geography:** Southeast corner of the bay where the Trillindra River enters through a wide muddy estuary (east-coast estuary rule).
- **Role:** Estuary market town — wool and grain from the southeast hinterland.
- **Suggested resources:** [[Wool]], [[Grain]], [[Clay]], [[Sand]], [[Fish]] (estuary shellfish); workshop industries — pottery and glass from estuary clay and sand, dyed cloth from local wool and bay [[Dyes and Pigments]] — turning the mud-town into N7's second export engine (suggested).
- **Transportation:** River barge up the Trillindra + coastal ship. Ship: ~3 days to East-Shore Port (3), ~4 to Bay-Head Hub (1).
- **Racial composition (suggested):** Homogenous rural human with halfling market families. Rationale: hinterland market town, not a crossroads.
- **Military:** Weak — mudflats defend the approach better than its levies do.
- **Diplomatic relations (inferred):** Orbits whichever bay power protects its shipping; the estuary is the obvious soft target in any bay war.
- **Off-map note:** The Trillindra's headwaters rise southeast toward the Koom Mountains, outside the strip — whoever lives upstream can foul or tax this town's whole livelihood.

---

## Zone B — The Strait (the region's throat)

### Strait North Jaw (4) — C04-04b (col 4.1, row 4.4)

- **Geography:** Inner peninsula coast at the bay mouth's north side — rocky, elevated, commanding the channel where all bay trade exits to the ocean.
- **Role:** Strait control; naval seat.
- **Suggested resources:** [[Fish]], [[Stone]] (cliff quarry), [[Timber]] (naval grade from Solmara's oak), [[Salt]].
- **Transportation:** Sea ship only mode that matters. ~3–4 days across/along the mouth to South Jaw (5); ~7 days along the north shore to Bay-Head Hub (1); ~10 days around the peninsula to Outer-Coast Port (8).
- **Racial composition (suggested):** Human-dominant garrison town, dwarf stonewrights. Rationale: fortress economy.
- **Military:** Strong — elevation, quarried walls, and every passing hull paying anchorage. The map's single best military position.
- **Diplomatic relations (inferred):** Everyone's problem. Bay powers (1), (3), (6) need its channel; Highland Seat (7) claims it as the peninsula's port-fort. Contested by geography itself.

### Strait South Jaw (5) — C05-05b (col 4.6, row 4.6)

- **Geography:** South side of the mouth approach, warm south-facing shore. *(Swapped from C05-05g mid-bay during Phase 4 coordinate check — this dot actually flanks the mouth.)*
- **Role:** Rival strait fort and sunward harbor.
- **Suggested resources:** [[Fish]], [[Salt]], [[Grapes]] (south-facing Mediterranean shore — wine terraces), [[Stone]]; [[Dyes and Pigments]] (shellfish-purple beds in the warm shallows — luxury export, guild-guarded; suggested).
- **Transportation:** Sea ship. ~3–4 days to North Jaw (4); ~4 days to Bay-Head Hub (1).
- **Racial composition (suggested):** Human fisher-farmers, half-elf traders. Rationale: pleasant coast, modest harbor.
- **Military:** Moderate — paired battery with (4) in any competent defense of the bay; weaker walls, better weather.
- **Diplomatic relations (inferred):** Locked in permanent pairing with North Jaw (4) — allies against outside fleets, rivals for toll rights. Geography forces both at once.

---

## Zone C — Peninsula & West Coast (Solmara proper)

*Canon cap: [[Solmara]] counts ~8 settlements total on the sub-continent — this zone's three anchors plus background dots must respect that.*

### Highland Seat (7) — C04-04a (col 4.0, row 4.0)

- **Geography:** Eastern slopes of [[Ardenwall]] — sun-warmed stone terraces above the forested hills, positioned where the range's passes descend.
- **Role:** Defensible ridge capital of the peninsula.
- **Suggested resources:** [[Stone]], [[Iron Ore]], [[Copper Ore]] (Ardenwall), [[Wool]] (upland flocks), [[Stonecap Mushroom]] *(jeff's — foothill shade, suggested)*; [[Sky Coral]] (grows on Ardenwall's sheer storm-charged high faces — perilous harvest, rare; suggested).
- **Transportation:** Mountain track + road down to the coasts. ~8–10 days by horse to North Jaw (4); ~10 days to Storm Coast Harbor (9).
- **Racial composition (suggested):** Homogenous highland human with dwarf and goliath mining enclaves. Rationale: remote, defensible, extractive.
- **Military:** Strong defensively — altitude and Ardenwall's filtering passes; projects power poorly beyond the peninsula.
- **Diplomatic relations (inferred):** Considers the peninsula coast (4), (8), (9) its natural vassals; the coast disagrees. Indifferent to bay politics until strait tolls touch its ore exports.

### Outer-Coast Port (8) — C03-05a (col 3.0, row 5.3)

- **Geography:** Southwest tip of the Solmara peninsula, facing the open ocean and the island scatter beyond.
- **Role:** Ocean-lane harbor — first and last landfall for southwest shipping.
- **Suggested resources:** [[Fish]], [[Pearl]] (warm shallows), [[Salt]], ship refit and provisioning as the true trade; import stream off the southwest lane — [[Silk]], [[Spices]], [[Coffee]] — making this an entrepôt, not a waystation (suggested).
- **Transportation:** Sea ship. ~10–11 days around the peninsula to North Jaw (4); ~4–6 days out to [[The Myriad]] waypoints *(ben's terrain-feature — uninhabited resupply islands)*.
- **Racial composition (suggested):** Most cosmopolitan site in the region — human, half-elf, dragonborn and stranger sailors off the long lanes. Rationale: ocean-facing port of call.
- **Military:** Weak walls, strong distance — nobody marches here; fleets are its only threat and its only shield.
- **Diplomatic relations (inferred):** Faces away from the bay entirely; profits from traffic the strait powers tax, making it the natural smuggler's alternative to the mouth.
- **Off-map note:** Faces southwest down the sea lane past The Myriad toward Crystalline Vast waters — whatever powers use that lane arrive here first.

### Storm Coast Harbor (9) — C04-03b (col 4.1, row 3.4)

- **Geography:** West-facing outer coast north of the peninsula — rocky cliffs, sea stacks, full exposure to prevailing westerlies (no beaches at this latitude, per world coast rules).
- **Role:** Fishing and weather-refuge port.
- **Suggested resources:** [[Fish]] (rich cold upwelling), [[Timber]] (wet western slopes), [[Amber]] (storm-cast), [[Hides]] (sea-mammal); [[Stormglass]] (lightning-fused glass off the high storm faces — rare, arcane, and the coast's one secret worth killing for; suggested).
- **Transportation:** Sea ship, seasonal — winter storms close the coast. ~10 days by horse over the hills to Highland Seat (7); coastal sailing south to (8) risky, north unknown.
- **Racial composition (suggested):** Homogenous — hard-weather human fisherfolk, half-orc crews. Rationale: nobody moves to a storm coast for opportunity.
- **Military:** Weak — the weather is the garrison.
- **Diplomatic relations (inferred):** Too poor to covet, too tough to hold; nominal fealty to Highland Seat (7) costs it little.
- **Off-map note:** Faces north up a coast that runs toward the Witch's Tit tundra fringe — anything coming south along that shore makes landfall here first.

---

## Zone D — North Plains & Mountain Wall

### Plains Center (10) — C05-04c (col 4.7, row 3.8)

- **Geography:** Middle of Plains H — flat, river-fed farmland between the Bayward's headwater branches. No natural defenses in any direction.
- **Role:** Agrarian breadbasket and road crossroads.
- **Suggested resources:** [[Grain]] (primary — feeds the bay ports), [[Livestock]], [[Horses]], [[Wool]], [[Hemp]]; [[Ale and Beer]] (grain-surplus brewing — beer barges are the daily face of the river trade; suggested); [[Serhari]] *(jeff's resource — plains vine, western margin under the Ardenwall foothills; cultural asset of the plains peoples, not open trade — suggested)*.
- **Transportation:** Road hub + barge on the Bayward. ~8 days downstream to Bay-Head Hub (1); ~14 days by horse to Mountain Gate (11).
- **Racial composition (suggested):** Human farm majority, halfling villages, centaur bands on the open plain margins. Rationale: open grain country.
- **Military:** Weak walls, deep manpower — loses battles, wins sieges of attrition; everyone needs its harvest intact.
- **Diplomatic relations (inferred):** The prize, not the player. Bay-Head Hub (1) and Mountain Gate (11) both depend on it; its independence lasts exactly as long as their rivalry does.

### Mountain Gate (11) — C05-03b (col 5.0, row 3.0)

- **Geography:** Southern base of Mountains C where a pass descends to the plains — scree slopes, lake-dotted footing (mountain-base lakes per world rules).
- **Role:** Mining town and pass gateway.
- **Suggested resources:** [[Iron Ore]], [[Copper Ore]], [[Silver Ore]], [[Coal]], [[Stone]], [[Stonecap Mushroom]] *(jeff's — cave-mouth growth, suggested)*; smithy-finished goods — [[Bladed Weapons]], [[Artisan Tools]], [[Farming Tools]] — iron and coal co-located means finished metal beats raw ore past the fork's per-weight tolls (toll arbitrage, suggested); [[Gold Ore]] and [[Gemstones]] — unproven veins rumored deeper in Mountains C; a confirmed strike rewrites the N6/N4 toll politics overnight (suggested, DM lever).
- **Transportation:** Mountain track north over the pass; road/river south. ~13 days by barge down River F to the fork (2); ~14 days by horse to Plains Center (10).
- **Racial composition (suggested):** Dwarf-heavy for the region — dwarf mining clans alongside human smelter families, kobold labor in the deep galleries. Rationale: ore town at a mountain root.
- **Military:** Moderate-strong — narrow approaches, armed miners, metal to spare.
- **Diplomatic relations (inferred):** Hostage to River-Fork Toll (2) for exports; natural grievance and natural target. Watches the pass behind it as much as the plains before it.
- **Off-map note:** The pass leads north over Mountains C toward the tundra band and the Still Cold Sea coast — the far side is undefined, and this town is the region's doorkeeper to it.

### Forest Edge (12) — C06-04j (col 6.4, row 3.7)

- **Geography:** Eastern margin where Plains H grades into Forest A and the Erevast interior — frontier country, last cleared land before the trees.
- **Role:** Frontier post and forest-trade head.
- **Suggested resources:** [[Timber]], [[Hides]], [[Alchemical Herbs]] (forest margin), honey and forage goods; [[Whatwill]] *(paul's resource — a historic Showering scattered debris across the eastern Plains H / Forest A margin; salvage trickles through this post, suggested)*.
- **Transportation:** Overland only — road west to the fork (2) ~10 days by horse; forest tracks east, unmapped.
- **Racial composition (suggested):** Mixed frontier — human settlers, elf and firbolg wood-kin trading across the treeline, goblin bands in the deep forest as pressure. Rationale: edge settlements mix or die.
- **Military:** Weak — palisade and rangers; depth of forest is its retreat.
- **Diplomatic relations (inferred):** Sends its goods through River-Fork Toll (2) and resents it; too far for any bay power to protect, which makes it the loosest piece on the board.
- **Off-map note:** Faces east into the Erevast interior — the whole landward half of its identity depends on what's under those trees, which the map does not say.

---

## Nation Seeds (7 — proposed borders & characteristics)

*Geography-derived only; names, governments, and histories are still open. Each nation absorbs nearby background dots from the 48-marker pool via `claimed_by` in the city registry.*

- **N1 — Peninsula Highland realm:** Highland Seat (7) + Outer-Coast Port (8) + Ardenwall spine. Border: the ridge and the west coast. Character: defensive, extractive, ocean-facing through (8); claims the strait forts and is refused.
- **N2 — Storm Coast:** Storm Coast Harbor (9) + northwest outer shore. Border: the cliff line and the hills behind it. Character: poorest and hardest nation; fishing fleets double as raiders in lean years; its cliff-scavengers know where [[Stormglass]] forms, which is the one thing here worth an outsider's fleet. Could fold into N1 as a province if the DM prefers 6 nations.
- **N3 — Strait Compact:** North Jaw (4) + South Jaw (5). Border: both shores of the mouth. Character: small, rich, armed — a toll state living on everyone else's trade; internally split between its two jaws.
- **N4 — Bay-Head river power:** Bay-Head Hub (1) + River-Fork Toll (2). Border: the Bayward corridor and the north shore. Character: commercial hegemon; controls river and harbor but imports its food — expansionist toward the plains by hunger.
- **N5 — Plains nation:** Plains Center (10) + surrounding farm dots. Border: the open grain country between river branches. Character: populous, unfortified, courted; its harvest is the region's true currency. Holds the [[Serhari]] patches on its western margin — a cultural asset arcane institutions covet, giving the "weak" nation quiet leverage no army provides.
- **N6 — Mountain nation:** Mountain Gate (11) + Mountains C foothill dots. Border: the mountain base line. Character: metal-rich, transit-poor; perpetually squeezed by N4's river tolls, perpetually arming because of it.
- **N7 — East Forest league:** East-Shore Port (3) + Trillindra Mouth (6) + Forest Edge (12). Border: the bay's east shore and the forest margin. Character: loose timber-and-wool league rather than a state; holds the shipbuilding capacity every other nation's navy requires.

---

## Rare & Arcane Resources (regional layer)

*Presence ≠ access — these exist in the region whether or not anyone can reach, refine, or afford them.*

- **[[Stormglass]]** — high storm faces above the west coast; forms where lightning meets airborne silica. Known to cliff-scavengers at (9); no organized extraction.
- **[[Sky Coral]]** — Ardenwall's sheer upper faces, storm-charged. The floating islands northwest ([[The Watcher]], The Companion, [[The Stellar Daughter]] — *paul's/kellan's entities, visible from the storm coast skies*) would carry richer growths on their undersides, for anyone who can get there.
- **[[Whatwill]]** *(paul's)* — a historic Showering left a debris field across the eastern Plains H / Forest A margin near (12). The Kerning whistle has been heard since within living memory. Paul's contesting factions (Partenariats, Courts Superior) have reason to send agents here.
- **[[Arcane Crystal]]** — grows along leylines; the region's leylines are unmapped. If one runs through Ardenwall's ancient stone or under the Serhari ruins on the plains margin (both plausible anchors), crystals grow where it surfaces. DM decides the line; geography suggests those two candidates.
- **[[Starfall Ore]]** — unique-tier meteorite metal. Rumor-tier only: a strike remembered in Mountains C's deep country beyond the pass. Nobody holds it; the rumor itself is the resource.

## Regional Tensions (structural, from geography)

- **The Throat:** every bay nation's trade exits through the strait (N3). One toll state astride six economies — the region's standing casus belli.
- **Grain vs. Gold:** N4 has money and no food; N5 has food and no walls. Absorption, alliance, or puppet-rule are all one bad harvest away.
- **Ore pays twice:** N6's metal transits N4's fork tolls before reaching any market. Mountain armament is the predictable result.
- **The shipwright problem:** N7 builds hulls for all sides; every naval buildup on the bay starts with courting or coercing the east shore.
- **The open lane:** [[The Myriad]] waypoints are held by no one. Whoever garrisons them chokes Outer-Coast Port (8) and the whole southwest approach — an external or player-faction hook the map leaves deliberately open.
- **The fuel problem:** [[Coal]] comes out of the ground in exactly one place — N6's Mountain Gate (11). Every glasshouse at (6), forge at (1), and shipyard steambox at (3) either buys N6 coal down the tolled river or burns charcoal cut from Forest A — which puts N7's foresters and (12)'s frontier in the fuel business. Cheap fuel is the quiet input under every other tension; cut it and the workshops go cold before the armies march.

## Trade Routes & Transportation

- **Bayward Corridor:** grain, ale, livestock, hemp downriver from (10) to (1); tools, salt, coffee upriver. Barge, 8 days down. Controlled by N4; threatened by nothing except N5's leverage to stop planting.
- **Bay Circuit:** timber (3), wool/glass/dyed cloth (6), wine/purple dye/salt (5), fish (everywhere) circulating between bay ports. Coastal ship, 3–4 days per leg. No single controller — the pirate opportunity of the region.
- **Ore Run:** raw metal, [[Coal]], and smithy-finished goods from (11) down River F through the fork (2) to bay markets — finished goods dodge the per-weight tolls, a running fight between N6 smiths and N4 toll clerks. Coal is the bulk cargo: heavy, cheap per ton, and the one shipment every bay workshop notices when it stops. Barge, ~13 + 6 days. Controlled by N4's tolls; threatened by N6's resentment.
- **Southwest Lane:** ocean traffic from beyond The Myriad making landfall at (8), transshipping toward the strait or bypassing it. Sea ship, 4–6 days per hop. Controlled by no one; the smuggling route around N3's tolls.
- **North Shore Road:** overland fallback from (1) west toward the strait forts — slow (7+ days horse) but toll-free; matters exactly when the strait closes.

## Military Overview (relative ranking)

- Strait North Jaw (4): strongest single position — elevation, walls, paid fleet.
- Highland Seat (7): strongest defensive interior — passes filter every approach.
- Mountain Gate (11): strong — narrow ground, armed population, metal surplus.
- Bay-Head Hub (1): rich, walled, fleet-capable — but starves under blockade.
- Strait South Jaw (5): moderate battery, weaker twin of (4).
- River-Fork Toll (2): moderate garrison, river chains.
- East-Shore Port (3): weak walls, decisive shipyards.
- Plains Center (10): weak walls, inexhaustible levies.
- Trillindra Mouth (6), Storm Coast Harbor (9), Forest Edge (12), Outer-Coast Port (8): weak — defended by mud, weather, trees, and distance respectively.

## Open Questions (for questionnaires)

*These are now tracked one-per-file under `questionnaires/calenmere-basin/` — `region-wide/`, `whatwill-seam/`, and each nation's folder. The list below is the original geography-derived set and is kept for provenance; the question tree is authoritative.*

> **Scheme mismatch — unresolved.** This draft predates the painted political map. It proposes **7** nation seeds (N1–N7) on an **older dot numbering**; the map and the question tree use **9** colored territories on dots 1–29. Brown (southern reach) and Orange (far-east forest interior) have no seed here, and only North Jaw (4) keeps the same number across both schemes. Reconcile before treating any `(number)` in this file as current.

- Region's true name ("Calenmere Basin" is a working label), and each nation's name/government.
- Who actually holds the strait today — one power, two rivals, or a shared compact?
- Is The Myriad claimed, garrisoned, or lawless? (the island entity says uninhabited by preference — by whose preference?)
- What is on the far side of Mountains C, and does Mountain Gate (11) fear or trade with it?
- What lives in deep Forest A east of (12)?
- Non-human polities: do the dwarf clans at (11), forest-kin at (3)/(12), or plains centaurs at (10) have their own nations inside these borders?
- [[Fargrsh]] *(grows on well-trodden ground, controlled by [[The Deorful Domas]])*: present in the bay cities? Which one is the distribution hub?
- Whatwill activity and arcane-institution presence — which city hosts the region's magical center?
- Does the [[Coffee]] monopoly operate a factor-house here, and at which port?
