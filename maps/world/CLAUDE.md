# World Map

Rules for the world map: masters, tiles, grid, climate and city markers. Shared map rules (two kinds of map, delegation, no committed images) are in `maps/CLAUDE.md`.

## Masters and tiles

The three world masters are large Inkarnate WebP exports in `maps/world/masters/`. They are gitignored and fetched on demand, and the tiles and crops are generated locally from them. The only committed map artifact is the manifest `maps/sources.tsv`.

**Cold-start sequence (fresh clone has no images):**

1. `uv run scripts/fetch-maps.py` — pull masters into `maps/world/masters/`. `--list` shows present/missing; `--force` re-downloads. It rejects non-image / truncated responses, so a stale CDN url fails loudly instead of corrupting the pipeline.
2. `uv run scripts/gen-tiles.py` — slice masters into `maps/world/tiles/` (creates the dir).

Until both run, `map-crop.py` and `count-markers.py` will stop with a guard error telling you to fetch (`scripts/lib/map_common.py` → `require_master`). **A revoked/expired CDN url means no master and no tiles — there is no committed fallback.** If `fetch-maps.py` rejects a url, re-export the map in Inkarnate and update `maps/sources.tsv` (re-export workflow below).

- The masters can be **any resolution** — Inkarnate picks the export size. Never assume a pixel size. Every script derives cell size from the master's actual `img.size` at run time (`cellW = W/16`, `cellH = H/13`).
- The Read tool downsamples large images, so master labels are unreadable at full scale — always read a pre-cropped tile.

**Three master images — ground, sky, markers:**

- `maps/world/masters/world-names.webp` — all surface features: continents, mountains, rivers, plains, seas, cities, etc.
- `maps/world/masters/world-sky.webp` — all air-situated features: Islifts, Slices, and anything else floating above the surface. These are **not** in `world-names.webp`. Tiled separately as `sky-{nw,n,...}.png`; scripts that pull from `world-names.webp` will not show sky features.
- `maps/world/masters/city-markers.webp` — a **flattened base+dots export**: the full surface map with red dots burned in over it (not a transparent overlay). Red dots mark cities that exist but are unnamed and undetailed — they mean "work needed here." **Every red dot is a big city**, thousands of people or more. A graduated dot is `importance: major` or `critical`. Towns, villages and hamlets sit below map resolution and never get a dot (`meta/settlements.md`).

**Always use pre-cropped tiles.** Nine tiles per master cover the full map with overlap. Read the tile that contains your area of interest. Tile coverage and key content are documented in `maps/world/index.md`.

- Base: `maps/world/tiles/{nw,n,ne,w,c,e,sw,s,se}.png`
- Markers: `maps/world/tiles/markers-{nw,...}.png` — read alongside the base tile to see which cities in an area are undetailed
- Sky: `maps/world/tiles/sky-{nw,...}.png` — read for air-situated features

Use `map-crop.py --markers` to crop the base and markers layers for a region at once.

## Four hard rules

1. **Read a tile before describing any feature's position.** Never infer position from geography alone — always read the label from the map.
2. **Letter assignments come from the map, never invented.** If a section of the questionnaire needs letters (Plains A, River B, etc.), crop the relevant tile and count what's actually labeled before writing entries.
3. **When a tile isn't precise enough**, use `uv run scripts/map-crop.py --feature "<name>" --temp` for a targeted crop. Read it, then delete `maps/world/temp-crop.png`. Pixel formula is in **Grid Scale** below if you need to crop manually via PIL.
4. **If a feature isn't found in the primary tile, check all adjacent tiles before concluding it's absent.** Features near tile boundaries are often labeled on the neighboring tile. Never declare a feature missing after checking only one tile.

## Editing a master (re-export workflow)

Masters are not edited in-repo — they are edited in Inkarnate and re-exported. To change the map (add a label, move a marker, edit sky features):

1. Edit the map in Inkarnate and re-export it. **The CDN url changes on every re-export.**
2. Copy the new `cdn2.inkarnate.com/...?disposition=attachment` url into the matching row of `maps/sources.tsv`.
3. Run `uv run scripts/fetch-maps.py --force` to pull the new master into `maps/world/masters/`.
4. Run `uv run scripts/gen-tiles.py` to regenerate all tiles, then read the affected tiles to diff labels before updating `index.md`.

**City graduation — when a city is named and detailed:**

1. In Inkarnate, add its label to the world map and remove its dot from the markers map, then re-export both and update their `sources.tsv` urls (re-export workflow above)
2. Run `uv run scripts/fetch-maps.py --force` then `uv run scripts/gen-tiles.py` to refresh masters and tiles
3. Add the city/region to the Known Region Positions table in `maps/world/index.md` if it warrants a permanent crop entry
4. Remove the city's entry from `maps/world/city-registry.md` — add its registry ID (e.g. `C05-04a`) to the entity's `aliases:` field so existing cross-references resolve

After graduation the city appears in base tile reads and no longer appears in markers tile reads. `world-names.webp` is the source of truth — if a label is there, the city is canonical.

**Index maintenance:** `maps/world/index.md` → Known Region Positions is the lookup table for `map-crop.py --feature`. Add an entry whenever you identify a named feature's col/row from a tile or crop — bays, forests, plains, mountain ranges, rivers, sub-continents. One line per feature; col/row can be approximate. If a feature lacks a draft, use `—`. Update this proactively rather than waiting until a feature is formally worked.

Region and location drafts can have their own permanent crop. Use `uv run scripts/map-crop.py --feature "<name>"` — looks up col/row from the index and saves to `maps/locations/<slug>-map.png` automatically.

## Scripts

Run each as `uv run scripts/<name>`.

- `fetch-maps.py [--force] [--list]` — pull the gitignored masters from the Inkarnate CDN (manifest `maps/sources.tsv`) into `maps/world/masters/`. Run after a clone, or with `--force` after updating a manifest url
- `gen-tiles.py` — regenerate all world map tiles (base, markers, sky) from the masters. Cell size is derived from each master's actual resolution
- `map-crop.py --feature "<name>"` or `--col-min <n> --col-max <n> --row-min <n> --row-max <n> [--margin <px>] [--temp]` — crop the world map; saves to `maps/locations/`
- `count-markers.py --feature "<name>"` or the same col/row flags — count undetailed cities (red dots) in a map region
- `route-cities.py --route "<route name>"` — every city served by a trade route (city `routes` field)
- `naming-status.py [--section <name>]` — named vs. unnamed entries in the world-naming questionnaire
- `region-world-context.py --col <n> --row <n>` — `/region` Phase 1: climate, wind rules, water checklist
- `region-scale.py --span-grids <n> [--water-body <sea|river|both|none>] [--locations <n>]` — `/region` Phase 2: travel times and city spacing from grid span
- `region-brief.py [--region <slug>]` — resume a `/region` session from a compressed draft summary

## Grid Scale

**Structural (always true):** places are addressed by a 1-indexed column/row grid laid over `world-names.webp`. A cell's pixel box is `cellW × cellH`; left edge of col N = `(N−1) × cellW`, top edge of row N = `(N−1) × cellH`. Cell distance (km) drives all `/region` travel-time and city-spacing math.

**Cell pixel size is never hardcoded.** It is derived per-image from the master's actual resolution at run time: `cellW = imageWidth / 16`, `cellH = imageHeight / 13`. `map-crop.py`, `count-markers.py`, and `gen-tiles.py` all open the master and read `img.size` before computing crop boxes, so any export resolution works without edits. Re-exporting at a different size needs no script change.

**Per-world values — set at setup, not universal.** The grid count and the per-cell distance are *one campaign's choice* — a new world picks its own (see `meta/new-campaign-setup.md` → Map & geography setup). Only the **km-per-cell** distance is hardcoded, in `region-scale.py` and `region-world-context.py` (`GRID_KM`); changing a world's scale means updating this section **and** those two scripts together.

- Distance per cell: **1000km × 1000km** (`$GRID_KM`)
- Grid dimensions: ~16 columns × ~13 rows (the `16 × 13` divisor used to derive cell pixels)
- Equator row: ~7 / Poles: row 1 (north), row 13 (south)
- Cell pixel size: derived at run time from the master's resolution (not a fixed number)

## Climate Rules

**Structural (the method):** derive a region's climate, coastline, and drainage from three inputs — its latitude (distance from the equator row), the world's prevailing wind direction, and which way a coast/slope faces relative to that wind. Windward coasts are wet; leeward coasts are dry (rain shadow behind mountains); maritime latitudes are mild, high latitudes stormy/grey.

**Per-world model — confirm or replace at setup.** The default below assumes an **Earth-like world with west-to-east prevailing winds and the equator near row 7**. A world with different prevailing winds, multiple suns, magical climate, or no clear latitude bands needs its own model here — and `region-world-context.py` encodes this default, so update the script if you change it. Capture the world's actual biomes in `maps/world/index.md` → Biome Census and reconcile them against whatever model you keep here.

*Default model (west-to-east winds, equator row 7; latitude = distance from row 7):*

- West-facing (windward) coasts/slopes vary by latitude:
  - Tropical (dist ≤1): warm and humid; wet/dry seasons; NOT persistently grey
  - Subtropical (dist 2): Mediterranean — hot dry summers, mild wet winters; sunny, not grey
  - Warm temperate (dist 3): mild maritime; reliable moisture; can be overcast but not cold
  - Temperate/cold (dist ≥4): maximum moisture, frequent storms; grey skies common
- East-facing (leeward) coasts/slopes: drier; rain shadow if mountains present
- Rivers drain east/southeast off mountain ranges
- West coasts (tropical/subtropical): warm water, beaches possible, rocky headlands between bays
- West coasts (temperate/cold): rocky cliffs, sea stacks, no beaches
- East coasts: sandy beaches / river mouths: wide estuaries

## City Marker ID Format

Unnamed city markers carry stable IDs in `maps/world/city-registry.md` (campaign data) until they graduate.

- **ID format:** `C{col}-{row}{letter}` — col/row are map grid cells (1-indexed), letter disambiguates within the same cell (e.g. `C05-04a`).
- IDs persist until a city is named and graduated (see **City graduation** above). On graduation, remove the registry entry and add the ID to the entity's `aliases:` field so cross-references resolve.
