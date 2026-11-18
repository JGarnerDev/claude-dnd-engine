# TODO: schema migration

Plan: [PLAN.md](PLAN.md). Claude keeps this list current.

**Next:** step 5, write `scripts/validate.py` (port of `validate.ps1`, plus schema checks that warn until a type has a schema). Compare its output with `validate.ps1`'s (15 errors, 667 warnings as of 2026-11-18).

- [x] 1. Audit script (`tasks/schema-migration/scripts/audit.py`) and first report (2026-11-18): 1,586 entity files; 1,303 are strict YAML today, 259 more parse once links are quoted, 24 need fixing by hand (below); 2,161 unquoted links in 349 files; every entity file has frontmatter (the plan's "20 without" counted non-entity files)
- [x] 2. Tests for `get_frontmatter` (`scripts/test_common.py`), then make it accept quoted links (2026-11-18). `snapshot.py` runs the 24 scripts that use the parser with fixed arguments (28 runs) for before/after diffs. Only fixes changed: `location-entities` finds the neighbours linked through quoted links, and timeline keywords lose their `[[ ]]` and notes. Quoted prose that starts with a link (`"[[Miguel]]'s PC. …"`) is kept whole. `session-cards.py` read the act's `relates_to` through the brackets the parser used to leave in place; it now reads the names directly
- [x] 3. `quote-links.py` quoted 2,161 links in 349 files (2026-11-18). The audit now shows all 1,586 entity files as strict YAML with 0 unquoted links. All 28 `snapshot.py` outputs and `validate.ps1`'s results are unchanged
- [x] 4. Fix the 24 files that strict YAML rejects (done in `ffeec9a`), then switch the parser to YAML (2026-11-18). `get_frontmatter` reads with PyYAML's `BaseLoader`, so values stay strings, and falls back to the line parser for frontmatter that isn't valid YAML (command and meta files). Snapshot diffs show only fixes: values containing `#` (a session description) and inline lists (`aliases: ["the crone"]`) are now read:
  - [x] 11 region files in `data/locations/regions/`: a stray line holding only a `\x01` control character (line 13), left by commit `4ee9834`. Delete the line
  - [x] `historian/characters/npcs/Dunny Marsh.md` line 17: unescaped `"` inside a quoted `personality`
  - [x] Sessions 01–12 in `historian/sessions/`: a broken comment `# \n--- HISTORIAN ---` splits the frontmatter. `get_frontmatter` stops reading at that line too, so scripts don't see `played_date`, `recap` or the other fields below it in those 12 files today. Fix to `# --- HISTORIAN ---`
- [ ] 5. `scripts/validate.py` matches `validate.ps1`'s results; retire `validate.ps1`
- [ ] 6. Schemas per type (enforced when done):
  - [ ] entity (base)
  - [ ] character (pc, npc, antagonist)
  - [ ] location (each subtype)
  - [ ] faction
  - [ ] event
  - [ ] deity
  - [ ] other campaign types (session, act, campaign, culture, item, resource, route, rumor, mission, party, player, pc-arc, creature, skill)
  - [ ] reference catalogs (monster, spell, feat, race, class, background)
- [ ] 7. `scripts/gen-schema-docs.py` generates `meta/schemas/*.md`; check that generated files are up to date
- [ ] 8. Rules and docs updated, template synced, collaborators told, temporary scripts deleted
