# TODO: schema migration

Plan: [PLAN.md](PLAN.md). Claude keeps this list current.

**Status (2026-11-18):** steps 1–5 done (engine v0.73.0). Every entity file's frontmatter is strict YAML with quoted links, and `get_frontmatter` reads it with a YAML parser.

**Status (2026-11-20):** step 6 under way. Done: `entity` base (v0.79.0), `character` (v0.80.0), `location` (v0.81.0), `faction` (v0.82.0), `event` (v0.83.0), `deity` (v0.84.0), `session` (v0.85.0), `item` (v0.86.0), `route` (v0.87.0), `resource` (v0.88.0).

**Next:** the `creature` schema.

## Resuming in a new session

1. Read [PLAN.md](PLAN.md) (goal, decisions D1–D5, steps), then this file.
2. Check the starting point: `uv run tasks/schema-migration/scripts/audit.py | head -7` should show 1,586 entity files, all strict YAML, 0 unquoted links. If new files have unquoted links, run `quote-links.py` on them first.
3. Take a baseline before changing any parser or script: `uv run tasks/schema-migration/scripts/snapshot.py <scratch>/before`. After the change, snapshot to `<scratch>/after` and `diff -r` the two folders. Every difference must be explained as a fix.

### Temporary tools (`tasks/schema-migration/scripts/`, deleted in step 8)

- `audit.py`: read-only survey. No flags: summary plus fields and values per type. `--type <type>`: every field and value for one type (input for step 6). `--files`: files that fail strict YAML.
- `quote-links.py <folder>... [--apply] [--quiet]`: quotes unquoted frontmatter links. Dry run by default.
- `fill-provenance.py [--apply]`: fills missing `source_session` / `confirmed_date` in historian files (sessions exempt). Dry run by default; run it on new historian files if `validate.py` reports provenance errors.
- `snapshot.py <out_dir>`: runs the 24 scripts that use `get_frontmatter` (28 runs) and saves each output. It restores `historian/timeline/` afterwards, and briefly copies Session 34 into `scheduler/sessions/` for four session-plan scripts (that folder is empty between sessions).

### Things to know

- **Snapshot noise:** the search-index staleness line in `session-brief`, `prep-status` and `todo-brief` counts commits, so it changes whenever anything is committed between two snapshots. Ignore it.
- **Commits:** Jeff approves each commit and push. Show the commit message and file list first, and leave `.claude/commands/sync.md` out (his own uncommitted change).
- **Pre-commit hook:** markdownlint auto-fixes staged `.md` files (blank lines, trailing whitespace), so a commit can show a few more changed lines than the edit made. This is expected.
- **Line endings:** most entity files are CRLF. Edit them with byte-level replacements that keep the existing line endings.
- **Versioning** (`meta/versioning.md`): a script bugfix is a PATCH bump; a new script or a new rule is a MINOR bump. Each bump updates `VERSION` and adds a `CHANGELOG.md` entry.
- **Filename case:** git stores `historian/characters/npcs/rose.md`, `thorn.md` and `historian/characters/pcs/dip.md`, `luci.md`, `odibli.md` in lowercase, but the files on Jeff's disk are capitalised (`Rose.md`, …). Windows hides the mismatch. When comparing `validate.ps1` runs across checkouts, use `diff -i`. Fixing the case (one `git mv` per file) is unrelated to this migration and not done yet.

## Steps

- [x] 1. Audit script (`tasks/schema-migration/scripts/audit.py`) and first report (2026-11-18): 1,586 entity files; 1,303 were strict YAML, 259 more would parse once links were quoted, 24 needed fixing by hand (step 4); 2,161 unquoted links in 349 files; every entity file has frontmatter (the plan's "20 without" counted non-entity files)
- [x] 2. Tests for `get_frontmatter` (`scripts/test_common.py`), then make it accept quoted links (`4997e40`, v0.72.1). Only fixes changed: `location-entities` finds the neighbours linked through quoted links, and timeline keywords lose their `[[ ]]` and notes. Quoted prose that starts with a link (`"[[Miguel]]'s PC. …"`) is kept whole. `session-cards.py` read the act's `relates_to` through the brackets the parser used to leave in place; it now reads the names directly
- [x] 3. `quote-links.py` quoted 2,161 links in 349 files (`68f6c01` data, `6d7cdbc` historian, `5c224b8` scheduler). All 28 `snapshot.py` outputs and `validate.ps1`'s results were unchanged
- [x] 4. Strict YAML everywhere, and the parser switched to YAML:
  - [x] The 24 files strict YAML rejected (`ffeec9a`): 11 region files with a stray `\x01` line; `Dunny Marsh.md` with unescaped inner quotes; Sessions 01–12, where a split comment (`# \n--- HISTORIAN ---`) cut the frontmatter short, so scripts had never seen `played_date`, `recap` and the fields below it
  - [x] `get_frontmatter` reads with PyYAML's `BaseLoader` (`8be63ed`, v0.72.2): values stay strings and the return shape is unchanged. Frontmatter that isn't valid YAML (command and meta files) falls back to the line parser. Snapshot diffs showed only fixes: values containing `#` and inline lists (`aliases: ["the crone"]`) are now read
- [x] 5. `scripts/validate.py` replaces `validate.ps1` (v0.73.0). Built on notes-kit (pinned `v0.3.0`, `[tool.notes-kit]` in `pyproject.toml`) plus the engine's own checks. Compared line by line with `validate.ps1`: the only differences were fixes (3 duplicate filenames, now resolved by renaming the `Acolyte`/`Noble` backgrounds and merging `The Winery Druid`; `Tser Pool Encampment.md` now checked). Docs point at the new script; played session files still name `validate.ps1` and stay as records
  - [ ] Schema checks (D5), now part of step 6: notes-kit validates a type that has `meta/schemas/<type>.schema.yaml` (it loads frontmatter with typed YAML). Add each finished type to enforcement; until then list unfinished types under `warn-types` in `[tool.notes-kit]`
- [ ] 6. Schemas per type (enforced when done). Start each one from `audit.py --type <type>` plus the prose schema in `meta/schemas/<type>.md`:
  - [x] entity (base): `meta/schemas/entity.schema.yaml` (v0.79.0). All 1,584 entities pass it (`contributed_by` allows `party` for group work, as in `data/lore/magic.md`). It checks nothing by itself (no note has `type: entity`); each type schema pulls it in with `allOf: [{$ref: entity.schema.yaml}]` plus `unevaluatedProperties: false`, which needs notes-kit v0.5.0. `state` (545 files lack it) and `tags` (14 sessions lack them) are not required yet. Historian provenance is now an error in `validate.py`; `fill-provenance.py` filled 43 files and echoed the link under `## Sources`. Importance outliers fixed (`high` → `major`, `supporting` → `minor`)
  - [x] character (pc, npc, antagonist): `meta/schemas/character.schema.yaml` (v0.80.0), enforced. One file covers the three subtypes with an if/then branch each (states, mandatory fields, subtype-only fields). `location`, `race` and `class` stay free text, since many are plain notes ("unknown", "Wood elf"); `family` and `sells` allow plain notes too. `campaign` (in 15 types) went into the entity base. Fixed: Madame Eva `ambiguous` → `neutral`, Kranken Hammershaft's stray `awareness` removed
  - [x] location (each subtype): `meta/schemas/location.schema.yaml` (v0.81.0), enforced. One branch per subtype. Place fields stay free text ("Various", "None — …"); `controlling_faction` may be a list. Added `lair` (building purpose), `mediterranean` (region biome), `hook` on region, `controlling_faction` on city. Fixed 21 files with off-schema states, enums or stray fields (see CHANGELOG 0.81.0)
  - [x] faction: `meta/schemas/faction.schema.yaml` (v0.82.0), enforced. `allies` and `opposition` take plain notes as well as links. Added `family` to `purpose`, plus `members` and `hook`. Fixed: two stray `subtype` fields removed (The Hamlet Raiders, The Sage Enclave); a House Tomsen motive with an unquoted colon parsed as a mapping, now quoted
  - [x] event: `meta/schemas/event.schema.yaml` (v0.83.0), enforced. `timeline_date` takes `YYYY[-MM[-DD]]` (year-only dates are valid). Added `local` and `party` to `awareness`. Fixed: four empty `track: ""` removed
  - [x] deity: `meta/schemas/deity.schema.yaml` (v0.84.0), enforced. Added `unknown` to `tier` (two `TBD` tiers set to it); `voice` and `voice_confirmed` allowed for deities that speak at the table
  - [x] session: `meta/schemas/session.schema.yaml` (v0.85.0), enforced. A `completed` session also needs `played_date`, `recap` and `in_world_end_date`; dates are pattern-checked. `key_npcs` and `new_entities` take plain notes for things with no file. Documented `act`, `party`, the difficulty tiers, `depth`, `scope`, `in_world_end_time` and `table_notes` in `session.md`. Fixed: four `planned_date: null` removed
  - [x] item: `meta/schemas/item.schema.yaml` (v0.86.0), enforced. One branch per subtype (magic, mundane). Added `unknown` to magic `rarity` (already used by three items); `material` and `appearance` allowed on magic items too. No content fixes
  - [x] route: `meta/schemas/route.schema.yaml` (v0.87.0), enforced. All 14 routes passed as they were; `origin`, `destination` and `controlling_faction` take a link or a placeholder (`TBD`, `unknown`). No content fixes
  - [x] resource: `meta/schemas/resource.schema.yaml` (v0.88.0), enforced. Added `varies` to `trade_value` and `contested` to `accessibility` (Whatwill uses both). `controlled_by` may be a list; `consumers` takes plain notes for groups with no file. No content fixes
  - [ ] other campaign types (act, campaign, culture, rumor, mission, party, player, pc-arc, creature, skill)
  - [ ] reference catalogs (monster, spell, feat, race, class, background)
- [ ] 7. `scripts/gen-schema-docs.py` generates `meta/schemas/*.md`; check that generated files are up to date
- [ ] 8. Rules and docs updated (quote frontmatter links; edit schemas, not the generated docs), template synced with `/sync`, collaborators told, `tasks/schema-migration/scripts/` deleted
