# Maps

Shared rules for every map. Domain rules load from the subfolder you work in:

- `maps/world/CLAUDE.md` — world masters and tiles, the four hard rules for reading the map, re-export and city graduation, grid scale, climate model, city marker IDs, and the map/region scripts
- `maps/battlemaps/CLAUDE.md` — battle-map layouts and renders, standing location maps, Roll20 asset kits. Session layouts live under `scheduler/sessions/`, where it does not auto-load, so read it before touching one

## No committed images

**No map images are committed.** The `.gitignore` blankets `maps/**/*.{png,webp,jpg,jpeg,gif}`, so every default output path is covered automatically. The one gap: `map-crop.py --output <path>` lets you write a crop *outside* `maps/`, which the ignore rules do not catch. Always keep `--output` inside `maps/` (the default `maps/locations/` is correct). If you ever crop elsewhere, `git status` it before any commit and discard it — image files do not belong in version control.

## Two kinds of map, two tools, no hybrids

Every map is exactly one of two kinds. The scale decides which, and the kind decides the tool.

- **Battle map**: 5-ft squares, made for tokens moving on a grid (fights, and scenes the party plays out on a grid). **Built in Roll20.** Doors and windows on Dynamic Lighting walls, fog of war, light sources and GM-layer reveals all live there. Background art comes from the `-vtt.png` render, or from Inkarnate if a nicer picture is worth the time. Either way the map is finished in Roll20, because Roll20 holds what players interact with.
- **Overview map**: anything coarser than 5 ft a square (world, region, town). Made for orientation and travel, with nothing to interact with. **Built in Inkarnate.** The world map already lives there.

**No hybrids.** A map never serves both jobs. If a place needs both, such as a town to find your way around and a street fight inside it, make two maps: an overview of the town and a battle map of the street. Never put a battle map's grid, walls or tokens on an overview, or an overview's sprawl on a battle map.

## Map work delegation

Jeff (player, original world-builder) is available for manual map-making — world map edits, region/city/derivative maps. When manual map or image work comes up, remind the DM it can be handed to Jeff **unless the map is a secret** (content players should only see when they discover it in play — Jeff is a player and would be spoiled). The DM decides which maps are safe to delegate; spoiler-free maps default to "Jeff can do this."

To hand work off, copy `maps/map-request-template.md` to `questionnaires/jeff-map-<slug>.md`, fill the DM sections (the spoiler check is mandatory), and send it to Jeff. Claude can draft the fill from canon — pull must-include features from the relevant tiles, drafts, and registry entries rather than asking the DM to recall them.
