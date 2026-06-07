# World Map

The world map lives at `maps/world/world-names.png` (8192×6144px). The Read tool downsamples it — labels are unreadable at full scale.

**Always use pre-cropped tiles.** Nine tiles cover the full map with overlap: `maps/world/tiles/nw.png`, `n.png`, `ne.png`, `w.png`, `c.png`, `e.png`, `sw.png`, `s.png`, `se.png`. Read the tile that contains your area of interest. Tile coverage and key content are documented in `maps/world/index.md`.

**Four hard rules:**
1. **Read a tile before describing any feature's position.** Never infer position from geography alone — always read the label from the map.
2. **Letter assignments come from the map, never invented.** If a section of the questionnaire needs letters (Plains A, River B, etc.), crop the relevant tile and count what's actually labeled before writing entries.
3. **When a tile isn't precise enough**, use `.\scripts\map-crop.ps1 -Feature "<name>" -Temp` for a targeted crop. Read it, then delete `maps/world/temp-crop.png`. Pixel formula is in `maps/world/index.md` → Grid Scale if you need to crop manually via PIL.
4. **If a feature isn't found in the primary tile, check all adjacent tiles before concluding it's absent.** Features near tile boundaries are often labeled on the neighboring tile. Never declare a feature missing after checking only one tile.

Region and location drafts can have their own permanent crop. Use `.\scripts\map-crop.ps1 -Feature "<name>"` — looks up col/row from the index and saves to `maps/locations/<slug>-map.png` automatically.
