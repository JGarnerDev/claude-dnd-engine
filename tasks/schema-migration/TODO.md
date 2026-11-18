# TODO: schema migration

Plan: [PLAN.md](PLAN.md). Claude keeps this list current.

**Next:** step 2, tests for `get_frontmatter`, then make it accept quoted links.

- [x] 1. Audit script (`tasks/schema-migration/scripts/audit.py`) and first report (2026-11-18): 1,586 entity files; 1,303 are strict YAML today, 259 more parse once links are quoted, 24 need fixing by hand (below); 2,161 unquoted links in 349 files; every entity file has frontmatter (the plan's "20 without" counted non-entity files)
- [ ] 2. Tests for `get_frontmatter`, then make it accept quoted links; compare the 29 scripts before and after
- [ ] 3. `quote-links.py`, applied one folder per commit until the audit shows 0 unquoted links
- [ ] 4. Fix the 24 files that strict YAML rejects, then switch the parser to `yaml.safe_load`:
  - [ ] 11 region files in `data/locations/regions/`: a stray line holding only a `\x01` control character (line 13), left by commit `4ee9834`. Delete the line
  - [ ] `historian/characters/npcs/Dunny Marsh.md` line 17: unescaped `"` inside a quoted `personality`
  - [ ] Sessions 01–12 in `historian/sessions/`: a broken comment `# \n--- HISTORIAN ---` splits the frontmatter. `get_frontmatter` stops reading at that line too, so scripts don't see `played_date`, `recap` or the other fields below it in those 12 files today. Fix to `# --- HISTORIAN ---`
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
