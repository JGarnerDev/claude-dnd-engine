---
# World-Scale Location Entity Schema
# Seed entries here ONLY after the world map is finalized (Step 10 — Labeling complete)
# See: todo-worldmap.md
#
# Required fields:
#   name          — descriptive working name (proper nouns come from Step 10 labeling)
#   type          — always "location"
#   subtype       — world-sea | world-range | world-river | world-plains | world-pass | world-feature
#   exists        — always "true" (these are real world facts, not free entities)
#   world_col     — grid column on the world map (approximate center for large features)
#   world_row     — grid row on the world map (approximate center for large features)
#   description   — one sentence; used by region-world-context.ps1 output
#
# Optional fields:
#   world_col_2   — second reference point for elongated features (e.g. a mountain range)
#   world_row_2   — second reference point for elongated features
#   contributed_by — paul | ben | miguel | jeff (if a player named or designed this feature)
#   known_by      — wikilinks to factions or entities whose lore is tied to this feature
#
# Queried by: scripts/region-world-context.ps1
#   Entities within 2 grid squares of the requested col/row are surfaced.
#
# Upgrade path for existing world-scale entities:
#   data/locations/regions/Caldera.md   — add world_col / world_row once map is finalized
#   data/locations/regions/Astra.md     — same
#   data/locations/regions/The Slices.md — same
#
# Example entry (do not use until map is finalized):
#
# ---
# name: The Northern Inland Sea
# type: location
# subtype: world-sea
# exists: true
# world_col: 5
# world_row: 5
# description: Large inland sea on the western face of the northern continent, ocean-connected to the southwest
# contributed_by:
# ---
---
