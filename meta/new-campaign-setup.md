# New Campaign Setup

Before generating any content for a new campaign, create the four campaign-specific meta files below and populate `meta/worldbuilding.md` from player input. These files are intentionally excluded from `.template-sync` — they carry this group's specific content, not engine structure.

---

## Step 1 — Collect player worldbuilding preferences

Ask players:

- Tone and inspirations (books, games, films)
- Biomes or settings they want to explore
- Magic: how rare, how it works, who has access
- Notable resources, economies, or factions of interest
- Anything they want to avoid

---

## Step 2 — Create these four files before any entity or session work

### `meta/worldbuilding.md`

The creative contract for this campaign. Fill from player answers above. Required sections: Tone, Core Themes, Setting Pillars, World Textures (key textures and economies), What to Avoid. See the existing campaign's `meta/worldbuilding.md` as a format reference.

### `meta/campaign-design-preferences.md`

Player-sourced design desires — story beats, antagonist archetypes, mission structures the group wants to experience. Required sections: Desired Major Events, Antagonist Archetypes, Mission Preferences, Session Preferences, Player Agency Principle. Each item needs a `Deployed: —` tracking line. See existing file for format. Start empty; fill as players express desires during Session 0 and early play.

### `meta/mysteries.md`

Load-bearing unknowns the DM is protecting. Required sections: Active Mysteries (with `Revealed: —` lines), How to Add a Mystery, Principles. Start with one or two mysteries established during campaign design; add more as play reveals them. See existing file for format.

### `meta/party-relationships.md`

DM's read on bonds, tensions, and shared history between PCs. Not canon history (that's `historian/`) — the relational texture of the group. Start sparse; fill in as play develops. No fixed schema required; free-form sections per relationship pair or group dynamic.

---

## Step 3 — Map & geography setup *(optional, recommended)*

The engine runs mapless (theater-of-the-mind, or a module's own map) — but a world map keeps travel, adjacency, and `/region` math consistent. Ask the DM up front, before any region or city work:

- **Providing a map at all?** If no, skip this step entirely — pool entities don't need coordinates. If yes, continue.
- **Which layers, and when** — `world-names.webp` (base, required), `world-sky.webp` (optional aerial), `city-markers.webp` (optional flattened base+dots export). Note which exist now vs. coming later; build only from what's present. Masters are fetched from a CDN, not committed (see below).
- **World & grid scale** — real-world distance per cell, grid dimensions (cols × rows), equator row, pole rows. Record these in `maps/CLAUDE.md` → Grid Scale. Cell *pixel* size is derived per-image at run time, so only the km-per-cell distance (`GRID_KM` in `region-scale.py` / `region-world-context.py`) is hardcoded — update it if it differs from the template default.
- **Biome census** — what biomes / climate zones the world contains and roughly where. Captured into the **Biome Census** section of `index.md` below; it feeds `/region` and entity generation.

**Fetch the masters (not committed):** map masters are large binaries pulled on demand from the Inkarnate CDN. For each layer, paste its `cdn2.inkarnate.com/...?disposition=attachment` url into `maps/sources.tsv`, then run `uv run scripts/fetch-maps.py` to download them into `maps/world/masters/` (gitignored).

**Build from skeletons (do not pre-fill, do not ship a foreign world's data):** once the masters are fetched, build this world's data files from the synced skeletons:

1. Copy `maps/world/index-template.md` → `maps/world/index.md`; fill Status, Images, Biome Census. Leave Tile Coverage / Known Region Positions to populate as features are read.
2. Copy `maps/world/city-registry-template.md` → `maps/world/city-registry.md` (only if a markers layer exists).
3. Run `uv run scripts/gen-tiles.py` to slice every layer into the nine legible tiles (plus `markers-*` / `sky-*` sets).
4. Read the tiles to fill Tile Coverage and seed Known Region Positions.

The skeletons, `maps/CLAUDE.md`, and `maps/sources.tsv` are the map files that ship in the template; `index.md`, `city-registry.md`, all fetched `.webp` masters, and every generated tile/crop are this world's data and are never committed or shipped pre-filled (no map images live in git).

---

## Step 4 — Proceed to campaign and act creation

Once the four meta files exist and `meta/worldbuilding.md` is filled (and the map is set up, if used), run `/session` to begin. The engine's commands assume these files are present; a missing `meta/worldbuilding.md` will produce thin or off-tone output.
