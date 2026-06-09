# World Map

## Status

Updated 2026-06-09: Miguel naming ingested — 19 surface features renamed/added; world-sky.jpg replaced with world-sky.png — Slice A, The Hearth, The Landing added to sky layer.

## Images

- `world-names.png` — consolidated label map; all land features (continents, sub-continents, mountain ranges, deserts, tundra, islands, plains, rivers) and water features (oceans, seas, bays, channels). Primary orientation reference. **8192×6144px.**
- `world-sky.png` — sky layer with Opticon's Fade, Slice A, The Hearth (Islift C), The Landing (Islift F), and other air-situated features labeled.
- `city-registry.md` — stable ID index for all 378 unnamed city markers. IDs survive until a city graduates (is named). Use for player assignments and cross-references.
- `city-markers.png` — transparent PNG overlay; red dots mark cities that exist in the world but are unnamed and undetailed. No labels. Tiled as `tiles/markers-{name}.png`. Use alongside base tiles to see undetailed cities in any area.

## Grid Scale

- **1 cell = 1000km × 1000km**
- Grid dimensions: ~16 columns × ~13 rows
- Equator: approximately row 7
- Poles: row 1 (north), row 13 (south)
- Cell pixel size: 512px wide × 472px tall
- Col N left edge: (N−1) × 512px / Row N top edge: (N−1) × 472px

## Climate Rules (west-to-east winds)

- West-facing coasts/slopes vary by latitude:
  - Tropical (dist ≤1 from equator row 7): warm and humid; wet/dry seasons; NOT persistently grey
  - Subtropical (dist 2): Mediterranean pattern — hot dry summers, mild wet winters; sunny, not grey
  - Warm temperate (dist 3): mild maritime; reliable moisture; can be overcast but not cold
  - Temperate/cold (dist ≥4): maximum moisture, frequent storms; grey skies common
- East-facing coasts/slopes: drier; rain shadow if mountains present
- Rivers drain east/southeast off mountain ranges
- West coasts (tropical/subtropical): warm water, beaches possible, rocky headlands between bays
- West coasts (temperate/cold): rocky cliffs, sea stacks, no beaches
- East coasts: sandy beaches / River mouths: wide estuaries

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
| Erevast | ~5–10 | ~2–6 | `drafts/regions/Erevast.md` |
| Karath Ut'll | ~2–4 | ~5–8 | `drafts/regions/Karath Ut'll.md` |
| Hightalon | ~10–12 | ~3–5 | `drafts/regions/Hightalon.md` |
| Solrath | ~7–9 | ~7–9 | `drafts/regions/Solrath.md` |
| The Saltbreak Isles | ~11–12 | ~6–8 | `drafts/regions/The Saltbreak Isles.md` |
| Oathmark | ~11 | ~2–3 | `drafts/regions/Oathmark.md` |
| Opticon's Fade | ~1–2 | ~1–2 | `drafts/regions/Opticon's Fade.md` |
| Ilurak Qeth | ~6–10 | ~11–13 | `drafts/regions/Ilurak Qeth.md` |
| Gordrathi Mountains | ~5–7 | ~5–7 | `drafts/regions/Gordrathi Mountains.md` |
| Watchwall Mountains | ~10–11 | ~4–5 | `drafts/regions/Watchwall Mountains.md` |
| Virethorn Range | ~14–15 | ~4–6 | `drafts/regions/Virethorn Range.md` |
| The Grey Fathers | ~8–9 | ~3–4 | `drafts/regions/The Grey Fathers.md` |
| Azel Samarat | ~7–8 | ~6–7 | `drafts/regions/Azel Samarat.md` |
| Ut'karr | ~2–3 | ~6–7 | `drafts/regions/Ut'karr.md` |
| The Still Cold | ~3–11 | ~1–2 | `drafts/regions/The Still Cold.md` |
| The Irongate | ~10–12 | ~4–5 | `drafts/regions/The Irongate.md` |
| Essaur Bay | ~7–8 | ~8–9 | `drafts/regions/Essaur Bay.md` |
| The Grey Crossing | ~9–10 | ~10–11 | `drafts/regions/The Grey Crossing.md` |
| Veth's Gate | ~3–4 | ~7–8 | `drafts/regions/Veth's Gate.md` |
| The Dustbreak Plains | ~6–8 | ~5–6 | `drafts/regions/The Dustbreak Plains.md` |
| Bayward River | ~4-5 | ~3-4 | — |
| Deepwend River | ~5 | ~3-4 | — |
| Thelindra River | ~5 | ~4-5 | — |
| Bay B (The Greymaw) | ~5-6 | ~4-5 | — |
| Bay E (Cindermouth Bay) | ~1-2 | ~4-5 | — |
| Mountains P | ~1-2 | ~4-5 | — |
| Islands A | ~1-3 | ~6-8 | — |
| The Ashreaches | ~1-2 | ~4-5 | — |
| Bay F | ~7-8 | ~5-6 | — |
| Sub Continent C | ~3-5 | ~4-6 | — |
| Mountains B | ~4-5 | ~3-5 | — |
| Mountains C | ~5-7 | ~2-4 | — |
| Forest A | ~6-7 | ~4-5 | — |
| Forest B | ~6 | ~5-6 | — |
| Forest C | ~4-5 | ~2-3 | — |
| Plains H | ~5 | ~3-4 | — |
| Plains E | ~7 | ~5-6 | — |
| Plains G | ~7-8 | ~4-5 | — |
| Desert B | ~7-8 | ~5-7 | — |
| Ocean A | ~1-5 | ~5-9 | — |
| Deorum Ostium | ~11-13 | ~1-2 | `drafts/regions/Deorum Ostium.md` |
| Skoud Sea | ~12-14 | ~2-3 | `drafts/regions/Skoud Sea.md` |
| Witches Tit | ~6-8 | ~2 | `drafts/regions/Witches Tit.md` |
| Frisian Bay | ~9-10 | ~3-4 | `drafts/regions/Frisian Bay.md` |
| The Rip | ~10-11 | ~3-4 | `drafts/regions/The Rip.md` |
| Koom Mountains | ~5-6 | ~4-5 | `drafts/regions/Koom Mountains.md` |
| Slor Bay | ~7-8 | ~5-6 | `drafts/regions/Slor Bay.md` |
| Sgaile Desert | ~6-7 | ~6 | `drafts/regions/Sgaile Desert.md` |
| Loess Mountains | ~10-11 | ~6 | `drafts/regions/Loess Mountains.md` |
| The Myriad | ~4 | ~6-7 | `drafts/regions/The Myriad.md` |
| Fairway Sea | ~11-13 | ~6-7 | `drafts/regions/Fairway Sea.md` |
| Bonny Islands | ~9-10 | ~6-7 | `drafts/regions/Bonny Islands.md` |
| Klein Zand | ~8-9 | ~8 | `drafts/regions/Klein Zand.md` |
| Torpid Channel | ~5 | ~8 | `drafts/regions/Torpid Channel.md` |
| The Thrum | ~6-7 | ~8-9 | `drafts/regions/The Thrum.md` |
| Iargulta | ~3-4 | ~9-10 | `drafts/regions/Iargulta.md` |
| Mori | ~14-15 | ~8-9 | `drafts/regions/Mori.md` |
| Parhelion Ocean | ~14-16 | ~7-10 | `drafts/regions/Parhelion Ocean.md` |

## Cosmology Notes

- **Struck Side** — west/east wrap seam; Caldera is here
- **Arc Side** — center of map
- **Islifts** — floating geode masses over the western ocean
- **Slices** — large orbital island masses cast up by the Astra impact
- **Astra** — returns on ~1000-year elliptical cycle (Glistening)
