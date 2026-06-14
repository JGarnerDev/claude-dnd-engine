# World Map

## Status

Updated 2026-06-10: both layers ingested. Sky — The Stellar Daughter (was Slice A), Arclight's Seat (Islift A), The Grey Reaches (Islift B), Darkling's Perch (Islift C, was The Hearth), The Hearth (Islift G); Islift D/E remain placeholders. World — Solmara (was The Greyback), Ardenwall (was The Stormwall), Calenmere (was The Greymaw); tiles regenerated.

## Images

- `world-names.png` — consolidated label map; all land features (continents, sub-continents, mountain ranges, deserts, tundra, islands, plains, rivers) and water features (oceans, seas, bays, channels). Primary orientation reference. **8192×6144px.**
- `world-sky.png` — sky layer with Opticon's Fade, Slice A, The Hearth (Islift C), The Landing (Islift F), and other air-situated features labeled.
- `city-registry.md` — stable ID index for all 378 unnamed city markers. IDs survive until a city graduates (is named). Use for player assignments and cross-references.
- `city-markers.png` — transparent PNG overlay; red dots mark cities that exist in the world but are unnamed and undetailed. No labels. Tiled as `tiles/markers-{name}.png`. Use alongside base tiles to see undetailed cities in any area.

## Conventions

Grid scale (cell size, pixel formula), the west-to-east climate model, and the city marker ID format are structural engine rules — they live in `maps/CLAUDE.md` (Grid Scale / Climate Rules / City Marker ID Format). This file holds only this world's data.

## Tile Coverage

Nine pre-cropped tiles in `maps/world/tiles/` cover the full map with overlap. Read instructions in CLAUDE.md → World Map.

| Tile | File | Cols | Rows | Key content |
|---|---|---|---|---|
| Northwest | `tiles/nw.png` | 1–6 | 1–5 | The Caldera, Sub Continent C, Mountains B/C/D/O/P, Bayward River, Deepwend River, Thelindra River |
| North | `tiles/n.png` | 5–12 | 1–5 | Erevast, Still Cold Sea, Tundra A, Grey Fathers, Mountains M |
| Northeast | `tiles/ne.png` | 10–16 | 1–5 | Hightalon, Oathmark, Continent G north, Watchwall, Virethorn |
| West | `tiles/w.png` | 1–6 | 4–9 | Karath Ut'll, Ocean A, Islands A/B, Channel F/I |
| Center | `tiles/c.png` | 5–12 | 4–9 | Continent B, Gordrathi, Azel Samarat, Essaur Bay, Sea C, The Dustbreak Plains |
| East | `tiles/e.png` | 10–16 | 4–9 | Sub Continent A, Continent G, Sea B, Channel E |
| Southwest | `tiles/sw.png` | 1–6 | 8–13 | Sea F, Continent C, Islands A/J, Channel F lower |
| South | `tiles/s.png` | 5–12 | 8–13 | Channel H, Islands E/J, Continent E north, Mountains H |
| Southeast | `tiles/se.png` | 10–16 | 8–13 | The Grey Crossing, Continent E, Ocean B, Sub Continent F |

## Known Region Positions

| Feature | Col | Row | Draft |
|--------|-----|-----|-------|
| Erevast | ~5–10 | ~2–6 | `data/locations/regions/Erevast.md` |
| Karath Ut'll | ~2–4 | ~5–8 | `data/locations/regions/Karath Ut'll.md` |
| Hightalon | ~10–12 | ~3–5 | `data/locations/regions/Hightalon.md` |
| Solrath | ~7–9 | ~7–9 | `data/locations/regions/Solrath.md` |
| The Saltbreak Isles | ~11–12 | ~6–8 | `data/locations/regions/The Saltbreak Isles.md` |
| Oathmark | ~11 | ~2–3 | `data/locations/regions/Oathmark.md` |
| Opticon's Fade | ~1–2 | ~1–2 | `data/locations/regions/Opticon's Fade.md` |
| Ilurak Qeth | ~6–10 | ~11–13 | `data/locations/regions/Ilurak Qeth.md` |
| Gordrathi Mountains | ~5–7 | ~5–7 | `data/locations/terrain-features/Gordrathi Mountains.md` |
| Watchwall Mountains | ~10–11 | ~4–5 | `data/locations/terrain-features/Watchwall Mountains.md` |
| Virethorn Range | ~14–15 | ~4–6 | `data/locations/terrain-features/Virethorn Range.md` |
| The Grey Fathers | ~8–9 | ~3–4 | `data/locations/terrain-features/The Grey Fathers.md` |
| Azel Samarat | ~7–8 | ~6–7 | `data/locations/terrain-features/Azel Samarat.md` |
| Ut'karr | ~2–3 | ~6–7 | `data/locations/terrain-features/Ut'karr.md` |
| The Still Cold | ~3–11 | ~1–2 | `data/locations/terrain-features/The Still Cold.md` |
| The Irongate Sea | ~10–12 | ~4–5 | `data/locations/terrain-features/The Irongate Sea.md` |
| Essaur Bay | ~7–8 | ~8–9 | `data/locations/terrain-features/Essaur Bay.md` |
| The Grey Crossing | ~9–10 | ~10–11 | `data/locations/terrain-features/The Grey Crossing.md` |
| Veth's Gate | ~3–4 | ~7–8 | `data/locations/terrain-features/Veth's Gate.md` |
| The Dustbreak Plains | ~6–8 | ~5–6 | — |
| Bayward River | ~4-5 | ~3-4 | — |
| Deepwend River | ~5 | ~3-4 | — |
| Thelindra River | ~5 | ~4-5 | — |
| Kethara | ~11–15 | ~9–13 | `data/locations/regions/Kethara.md` |
| Greywood | ~12–16 | ~2–9 | `data/locations/regions/Greywood.md` |
| The Reach | ~13–16 | ~3–6 | `data/locations/regions/The Reach.md` |
| The Watcher | ~1–3 | ~1–3 | `data/locations/regions/The Watcher.md` |
| The Companion | ~7–9 | ~1–3 | `data/locations/regions/The Companion.md` |
| The Scorched Rim | ~12–15 | ~11–13 | `data/locations/terrain-features/The Scorched Rim.md` |
| The Greymast | ~14–16 | ~3–5 | `data/locations/terrain-features/The Greymast.md` |
| The Elderspine | ~13–15 | ~6–9 | `data/locations/terrain-features/The Elderspine.md` |
| The Ashwall | ~2–4 | ~9–12 | `data/locations/terrain-features/The Ashwall.md` |
| The Amber Plain | ~9–12 | ~5–8 | `data/locations/terrain-features/The Amber Plain.md` |
| The Pale Shore | ~14–16 | ~1–2 | `data/locations/terrain-features/The Pale Shore.md` |
| The Westward Stones | ~2–5 | ~9–12 | `data/locations/terrain-features/The Westward Stones.md` |
| The Ashen Sea | ~2–6 | ~8–12 | `data/locations/terrain-features/The Ashen Sea.md` |
| The Maw | ~13–14 | ~5–7 | `data/locations/terrain-features/The Maw.md` |
| The Collar | ~12–13 | ~2–4 | `data/locations/terrain-features/The Collar.md` |
| The Ember Strait | ~15–16 | ~5–7 | `data/locations/terrain-features/The Ember Strait.md` |
| The Rift | ~7–9 | ~8–10 | `data/locations/terrain-features/The Rift.md` |
| Calenmere (Bay B) | ~5-6 | ~4-5 | `data/locations/terrain-features/Calenmere.md` |
| Bay E (Cindermouth Bay) | ~1-2 | ~4-5 | — |
| Mountains P | ~1-2 | ~4-5 | — |
| Islands A | ~1-3 | ~6-8 | — |
| The Ashreaches | ~1-2 | ~4-5 | — |
| Bay F | ~7-8 | ~5-6 | — |
| Solmara (Sub Continent C) | ~3-5 | ~4-6 | `data/locations/regions/Solmara.md` |
| Ardenwall (Mountains B) | ~4-5 | ~3-5 | `data/locations/terrain-features/Ardenwall.md` |
| Mountains C | ~5-7 | ~2-4 | — |
| Forest A | ~6-7 | ~4-5 | — |
| Forest B | ~6 | ~5-6 | — |
| Forest C | ~4-5 | ~2-3 | — |
| Plains H | ~5 | ~3-4 | — |
| Plains E | ~7 | ~5-6 | — |
| Plains G | ~7-8 | ~4-5 | — |
| Desert B | ~7-8 | ~5-7 | — |
| Ocean A | ~1-5 | ~5-9 | — |
| Deorum Ostium | ~11-13 | ~1-2 | `data/locations/regions/Deorum Ostium.md` |
| Skoud Sea | ~12-14 | ~2-3 | `data/locations/terrain-features/Skoud Sea.md` |
| Witch's Tit | ~6-8 | ~2 | `data/locations/terrain-features/Witch's Tit.md` |
| Frisian Bay | ~9-10 | ~3-4 | `data/locations/terrain-features/Frisian Bay.md` |
| The Rip | ~10-11 | ~3-4 | `data/locations/terrain-features/The Rip.md` |
| Koom Mountains | ~5-6 | ~4-5 | `data/locations/terrain-features/Koom Mountains.md` |
| Slor Bay | ~7-8 | ~5-6 | `data/locations/terrain-features/Slor Bay.md` |
| Sgaile Desert | ~6-7 | ~6 | `data/locations/terrain-features/Sgaile Desert.md` |
| Loess Mountains | ~10-11 | ~6 | `data/locations/terrain-features/Loess Mountains.md` |
| The Myriad | ~4 | ~6-7 | `data/locations/terrain-features/The Myriad.md` |
| Fairway Sea | ~11-13 | ~6-7 | `data/locations/terrain-features/Fairway Sea.md` |
| Bonny Islands | ~9-10 | ~6-7 | `data/locations/terrain-features/Bonny Islands.md` |
| Klein Zand | ~8-9 | ~8 | `data/locations/terrain-features/Klein Zand.md` |
| Torpid Channel | ~5 | ~8 | `data/locations/terrain-features/Torpid Channel.md` |
| The Thrum | ~6-7 | ~8-9 | `data/locations/terrain-features/The Thrum.md` |
| Iargulta | ~3-4 | ~9-10 | `data/locations/regions/Iargulta.md` |
| Mori | ~14-15 | ~8-9 | `data/locations/regions/Mori.md` |
| Parhelion Ocean | ~14-16 | ~7-10 | `data/locations/terrain-features/Parhelion Ocean.md` |
| Merchant's Run | ~12-13 | ~9 | `data/locations/terrain-features/Merchant's Run.md` |

## Cosmology Notes

- **Struck Side** — west/east wrap seam; Caldera is here
- **Arc Side** — center of map
- **Islifts** — floating geode masses over the western ocean
- **Slices** — large orbital island masses cast up by the Astra impact
- **Astra** — returns on ~1000-year elliptical cycle (Glistening)
