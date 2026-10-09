# World Map

### Master images live in `maps/world/masters/` and are fetched, not committed

The three world masters are large Inkarnate WebP exports. **No map images are committed** — the masters are gitignored and fetched on demand, and the tiles/crops are generated locally from them. The only committed map artifact is the manifest `maps/sources.tsv`.

> **Never commit generated images.** The `.gitignore` blankets `maps/**/*.{png,webp,jpg,jpeg,gif}`, so every default output path is covered automatically. The one gap: `map-crop.py --output <path>` lets you write a crop *outside* `maps/`, which the ignore rules do not catch. Always keep `--output` inside `maps/` (the default `maps/locations/` is correct). If you ever crop elsewhere, `git status` it before any commit and discard it — image files do not belong in version control.

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

Use `map-crop.py --markers` to crop the base and markers layers for a region at once. Regenerate every tile set with `uv run scripts/gen-tiles.py`.

### Editing a master (re-export workflow)

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

**Four hard rules:**

1. **Read a tile before describing any feature's position.** Never infer position from geography alone — always read the label from the map.
2. **Letter assignments come from the map, never invented.** If a section of the questionnaire needs letters (Plains A, River B, etc.), crop the relevant tile and count what's actually labeled before writing entries.
3. **When a tile isn't precise enough**, use `uv run scripts/map-crop.py --feature "<name>" --temp` for a targeted crop. Read it, then delete `maps/world/temp-crop.png`. Pixel formula is in the **Grid Scale** section below if you need to crop manually via PIL.
4. **If a feature isn't found in the primary tile, check all adjacent tiles before concluding it's absent.** Features near tile boundaries are often labeled on the neighboring tile. Never declare a feature missing after checking only one tile.

**When a master changes**, follow the re-export workflow above — update the `sources.tsv` url, `fetch-maps.py --force`, then `gen-tiles.py` to regenerate every tile, and read affected tiles to diff labels before updating `index.md`.

Region and location drafts can have their own permanent crop. Use `uv run scripts/map-crop.py --feature "<name>"` — looks up col/row from the index and saves to `maps/locations/<slug>-map.png` automatically.

**Map work delegation:** Jeff (player, original world-builder) is available for manual map-making — world map edits, region/city/derivative maps. When manual map or image work comes up, remind the DM it can be handed to Jeff **unless the map is a secret** (content players should only see when they discover it in play — Jeff is a player and would be spoiled). The DM decides which maps are safe to delegate; spoiler-free maps default to "Jeff can do this."

To hand work off, copy `maps/map-request-template.md` to `questionnaires/jeff-map-<slug>.md`, fill the DM sections (the spoiler check is mandatory), and send it to Jeff. Claude can draft the fill from canon — pull must-include features from the relevant tiles, drafts, and registry entries rather than asking the DM to recall them.

---

## Map Scripts

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
- `battlemap.py --session <n>` or `battlemap.py maps/battlemaps/<location>` `[--px <n>] [--vtt-grid]` — render text layouts (one char per 5-ft square) into a VTT image plus a DM key, in `maps/battlemaps/session-<n>/`

---

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
- IDs persist until a city is named and graduated (see the **City graduation** steps above). On graduation, remove the registry entry and add the ID to the entity's `aliases:` field so cross-references resolve.

### Two kinds of map, two tools, no hybrids

Every map is exactly one of two kinds. The scale decides which, and the kind decides the tool.

- **Battle map**: 5-ft squares, made for tokens moving on a grid (fights, and scenes the party plays out on a grid). **Built in Roll20.** Doors and windows on Dynamic Lighting walls, fog of war, light sources and GM-layer reveals all live there. Background art comes from the `-vtt.png` render, or from Inkarnate if a nicer picture is worth the time. Either way the map is finished in Roll20, because Roll20 holds what players interact with.
- **Overview map**: anything coarser than 5 ft a square (world, region, town). Made for orientation and travel, with nothing to interact with. **Built in Inkarnate.** The world map already lives there (see above).

**No hybrids.** A map never serves both jobs. If a place needs both, such as a town to find your way around and a street fight inside it, make two maps: an overview of the town and a battle map of the street. Never put a battle map's grid, walls or tokens on an overview, or an overview's sprawl on a battle map.

A layout's `scale:` line says which kind it is. Default 5 means a battle map. Anything larger means an overview, and its `.txt` and renders are a draft blueprint for Inkarnate, not a deliverable.

Current maps:

- **Battle maps:** Session 29's New Wing, Halsby's woods and old core, and the Golden Lioness's indoors and outdoors. The outdoors map stays a 5-ft battle map, so base-building is planned on the same grid a raid would be fought on.
- **Overview maps:** the world map, and the Ashford town draft (`maps/battlemaps/ashford/`, 25 ft a square).

### Battlemaps

Session battlemaps are **text layouts kept beside the session plan, gitignored** (`scheduler/sessions/<Session folder>/maps/<name>.txt`, one char per 5-ft square, A1 top-left) and rendered by `uv run scripts/battlemap.py --session <n>`. The script's header documents the layout format and terrain chars. Output goes to `maps/battlemaps/session-<n>/` as `<name>-vtt.png` (clean, for Roll20/Foundry/Owlbear; `--px 100` for Foundry) and `<name>-key.png` (DM copy). Both are gitignored like every map image. Layouts are local planning reference, not record: anything the table needs (grid refs, distances) goes into the session plan itself. Edit the `.txt` and re-render; never hand-edit the PNGs.

**Standing location maps** — maps of a place the party keeps coming back to, grown over time (the Golden Lioness's `indoors.txt` and `outdoors.txt`) — live in `maps/battlemaps/<location>/` and render beside their layout: `uv run scripts/battlemap.py maps/battlemaps/golden-lioness`. Each carries a `note: State:` line naming the session it reflects. After a `/recap` that changes the place (a room fitted out, a structure built), edit the grid and restamp that line. They are gitignored like the session layouts.

A layout can set `scale: <feet per square>` (default 5) to draft an overview map, such as `maps/battlemaps/ashford/`, a town drawn at 25 ft a square. Overview drafts are blueprints for Inkarnate (see above). Placements on a draft overview are not canon until confirmed. Each draft says in its notes which placements are canon and which are only drawn.

### Roll20 asset packs

Purchased VTT asset packs (Forgotten Adventures, ~4 GB zips) live in `maps/roll20 assets/`, which is gitignored as a whole folder. They are licensed and huge: **never commit them, and never unpack a whole pack.** Pull a small per-session kit instead.

**Kit workflow (worked on Session 29's maps):**

1. Read the session's layouts (`scheduler/sessions/<Session folder>/maps/*.txt`) and grep the session plan for set dressing (casks, hearth, smoke, stage). Together they are the shopping list.
2. List the zip **once** into the scratchpad: `unzip -Z1 "<zip>" | grep -v '/$' > <scratchpad>/fa.txt`. That's 64k lines, so grep that file from then on and never re-list the zip.
3. Write a manifest of `<scene>/<group>` + filename regex, one rule per line, and count each rule's matches before extracting. Retune rules that hit 0 or hundreds.
4. Extract with Python `zipfile` (`uv run --no-project python`), flattening into `maps/roll20 assets/session-<n>/<n>-<scene>/<group>/`. **Don't pass member names to `unzip` on the command line:** FA's folders start with `!` (`!Core_Settlements`, `!Effects`), and shell escaping mangles them.
5. Write a `README.md` in the kit mapping each group to grid refs. **Count the squares in the `.txt` to get a ref.** Never guess one: A1 is top-left, and each character is one column.

Target ~400 files / ~40 MB per session. Enough choice to dress the maps, small enough to upload to Roll20 by hand.

**Forgotten Adventures naming (Core Mapmaking Pack Part 1):**

- Tree: `FA_Assets/!Core_Settlements/<Category>/<Subcategory>/...` (Clutter, Decor, Furniture, Lightsources, Workplace_Equipment, Combat, Textures, Vehicles, Burial_and_Graves, Natural_Decor), and `FA_Assets/!Effects/` (Fire, Smoke, Blast_Marks, Lightning, Magic, Webs, and animated `.webm`).
- **Footprint suffix** `_<W>x<H>`: the size in 5-ft squares (`_2x3` is 10x15 ft). Set the Roll20 token size from it.
- **Material/tone tokens** in the name: `Wood_Walnut|Ashen|Dark|Light|Red`, `Metal_Gray|Rusty|Brass|Bronze|Gold|Black|Silver`; fire comes in `Red|Blue|Green|Purple|Yellow`. Filter with these tokens so one location gets a single matching tone. The Golden Lioness uses Walnut.
- Variant letters/numbers (`A1`, `B2`) are alternate drawings of the same object. Floor and wall textures are `.jpg` tiles under `Textures/`; everything else is transparent `.png`.
- **Names are literal, not thematic. Search synonyms:** no `Cask` (use `Barrel`, `Keg`), no `Hearth`/`Fireplace` (use `Coals_Hot`, `Firewood`, `Cooking_Pit`), no `Stage`, no `Rubble` (use `Blast_Mark_Debris`), no `Stair`/`Trapdoor`.
- **Part 1 has no** trees, grass, water, dirt yard texture, walls, doors, stairs or fireplaces. Those are presumably in Part 2 (not yet checked). Say what's missing in the kit README so the gap is known before game night.

**Forgotten Adventures Tokens Library (v1.14):** 1,446 PNGs, ~750 MB. Pull tokens into the same per-session kit, under `tokens/<role>/`, a few choices per role. Keep every choice in the kit, since Jeff swaps tokens at the table rather than picking ahead.

- Tree: `FA_Tokens/Adventurers/<Ancestry>/` (PC-style classes, e.g. `Tiefling_Wizard_B1_Wand_Magic`), `FA_Tokens/Adversaries/<Faction>/` (Bandits, Guards, Cultists, Pirates, Undead, Goblinoids…), `FA_Tokens/Creatures/<5e creature type>/` (Beast has subfolders such as `Mammals`, `Birds`, `Aquatic`; also `Mounts`), and `FA_Tokens/NPCs/{Commoners,Nobles,Workers}/`.
- Name pattern: `<Role>_<Variant>_<Gear>_<Size>_Scale<NNN>_<CreatureType>_01.png`. Gear names what the token holds (`Crossbow`, `Sword_Shield`, `Magic_Fire`), so match it to the stat block's attacks. Commoners and nobles are `<Ancestry>_Commoner_<F|M|A>_<NNN><A|B>`. Workers are trades (`Barkeep`, `Cook`, `Server`, `Apprentice_Wizard`, `Minstrel`, `Stablehand`).
- **Sizing:** 400 px is one 5-ft square. Tiny, Small and Medium are drawn on a 1x1 canvas, Large on 2x2. `Scale<NNN>` means the canvas is NNN% oversized (`Riding_Horse_A1_Large_Scale200` is 1600 px, i.e. 4x4). Set the Roll20 token to the category size × NNN/100, and the art overhangs its base as intended.
- Pick tokens from canon. Check each NPC's `race`, livelihood and description in its entity file (Sable Wren is a tiefling, so tiefling tokens), and from the session plan the stat block and gear (the screen has sword and shield, the crossbow raider has a crossbow). Leave choices open where the plan does (*"Kellan picks the animal"*) by pulling several candidates.
- Skip the `Desert_*` variants unless the setting calls for them. A regex like `Guard_Fighter` matches `Desert_Guard_Fighter` too.
