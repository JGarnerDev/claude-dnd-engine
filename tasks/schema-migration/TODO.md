# TODO: schema migration

Plan: [PLAN.md](PLAN.md). Claude keeps this list current.

**Status (2026-11-18):** steps 1–5 done (engine v0.73.0). Every entity file's frontmatter is strict YAML with quoted links, and `get_frontmatter` reads it with a YAML parser.

**Status (2026-11-20):** step 6 done (engine v0.94.0): every entity type has an enforced schema. Done: `entity` base (v0.79.0), `character` (v0.80.0), `location` (v0.81.0), `faction` (v0.82.0), `event` (v0.83.0), `deity` (v0.84.0), `session` (v0.85.0), `item` (v0.86.0), `route` (v0.87.0), `resource` (v0.88.0), `creature` (v0.89.0), `monster` (v0.90.0), `spell` (v0.91.0), `feat`, `skill`, `race`, `background`, `class` (v0.92.0), `rumor`, `pc-arc`, `culture`, `act`, `campaign`, `mission`, `party` (v0.93.0), `lore` (v0.94.0).

**Status (2026-11-20):** step 7 done (engine v0.95.0): `scripts/gen-schema-docs.py` writes each schema doc's state table and frontmatter template from its schema, and `validate.py` errors on a stale doc.

**Status (2026-11-20):** step 8 done (engine v0.96.0): the rules are in `meta/entity-creation.md` and `CLAUDE.md`, and the temporary scripts are deleted. Two items are left: Jeff tells the collaborators about the link-quoting rule, and the template sync waits (see below).

**Next:** Jeff sends the collaborator note. The template sync is on hold (2026-11-20, Jeff's call): the template is far behind (266 new, 391 changed, 206 stale files), a full sync would ship campaign content such as `data/deities/Aedra.md` into the public repo, so it needs a leak review first. Also, `notes-kit` is private and the template is public, so the template has no `pyproject.toml` and `validate.py` can't run there; Jeff decides whether to make `notes-kit` public. `.template-sync` now lists `meta/schemas/*.schema.yaml`.

## Resuming in a new session

1. Read [PLAN.md](PLAN.md) (goal, decisions D1–D5, steps), then this file.

The temporary scripts (`audit.py`, `quote-links.py`, `fill-provenance.py`, `snapshot.py`) were deleted in step 8; git history has them (engine v0.95.0).

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
  - [x] Schema checks (D5), done in step 6 (every type enforced, no `warn-types`): notes-kit validates a type that has `meta/schemas/<type>.schema.yaml` (it loads frontmatter with typed YAML). Add each finished type to enforcement; until then list unfinished types under `warn-types` in `[tool.notes-kit]`
- [x] 6. Schemas per type (enforced when done). Start each one from `audit.py --type <type>` plus the prose schema in `meta/schemas/<type>.md`:
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
  - [x] creature: `meta/schemas/creature.schema.yaml` (v0.89.0), enforced. `challenge_rating` is pattern-checked (a CR, or `TBD` / `unknown`). Documented `size`, `alignment` and `breed` (used by the three companions). No content fixes
  - [x] skill: `meta/schemas/skill.schema.yaml` (v0.92.0), enforced. `ability` takes any of the six scores. No content fixes
  - [x] rumor: `meta/schemas/rumor.schema.yaml` (v0.93.0), enforced. `truth` is a boolean or `partial` / `unknown`. No content fixes
  - [x] pc-arc: `meta/schemas/pc-arc.schema.yaml` (v0.93.0), enforced. `pc` is a link; `arc_checked` an integer. No content fixes
  - [x] culture: `meta/schemas/culture.schema.yaml` (v0.93.0), enforced. `region`, `associated_factions` and `associated_races` are links; `language` takes plain notes. No content fixes
  - [x] act: `meta/schemas/act.schema.yaml` (v0.93.0), enforced. `goal`, `opening_state` and `closing_state` take `TBD` while an act is a draft. No content fixes
  - [x] campaign: `meta/schemas/campaign.schema.yaml` (v0.93.0), enforced. `current_act` takes a placeholder note while acts are undefined. Fixed: Curse of Strahd `paused` → `on-hiatus` (the state the docs already use)
  - [x] mission: `meta/schemas/mission.schema.yaml` (v0.93.0), enforced. Added `on-hiatus` to `state` (a mission paused with its campaign). Fixed: Find the Wine Wizard `paused` → `on-hiatus`
  - [x] party: `meta/schemas/party.schema.yaml` (v0.93.0), enforced. `state` is active, restructured or disbanded; `members` links. No content fixes
  - [x] player: no schema. Player files are not entities (no `exists` or in-world `state`) and live in `meta/players/`, outside the folders `validate.py` checks; `player.md` stays the reference
  - [x] monster: `meta/schemas/monster.schema.yaml` (v0.90.0), enforced. All 545 passed as they were. `challenge_rating` is pattern-checked; added `celestial` to `creature_type` (seven monsters use it), on creatures too. No content fixes
  - [x] spell: `meta/schemas/spell.schema.yaml` (v0.91.0), enforced. All 280 passed as they were. `level` is 0-9 and `components` a set of V, S, M. No content fixes
  - [x] lore: `meta/schemas/lore.schema.yaml` (v0.94.0), enforced. Lore had no prose schema; its frontmatter is the entity base plus `subtype` (calendar, geography, history, magic, religion) and `state` (`draft`, `stable`), taken from the five files. New `meta/schemas/lore.md`, and a `lore` row in `meta/types.md`. No content fixes
  - [x] feat: `meta/schemas/feat.schema.yaml` (v0.92.0), enforced. Fixed: 30 empty `prerequisite: ""` set to `none`
  - [x] race: `meta/schemas/race.schema.yaml` (v0.92.0), enforced. `size` is Small, Medium or Large; `speed` an integer. No content fixes
  - [x] background: `meta/schemas/background.schema.yaml` (v0.92.0), enforced. Fixed: seven empty `language_proficiencies: ""` set to `none`
  - [x] class: `meta/schemas/class.schema.yaml` (v0.92.0), enforced. `hit_die` is 6, 8, 10 or 12; `saving_throws` two abilities. The proficiency fields are one-line text (as every class file has them), not lists; prose updated. Fixed: four `spellcasting_ability: null` removed from non-casters
- [x] 7. `scripts/gen-schema-docs.py` generates `meta/schemas/*.md`; check that generated files are up to date (v0.95.0). Only the Valid State Values table and the Frontmatter Template are generated, between marker comments; forms, body templates and notes stay hand-written. The text comes from schema keys the validator ignores: `x-states`, `description`, `x-placeholder`, `x-doc`. `validate.py` errors on a stale doc (`gen.sync(write=False)`); `tests/scripts/test_schema_docs.py` covers it. Fixed on the way: feat states, act and mission historian fields
- [x] 8. Rules and docs updated (quote frontmatter links; run `validate.py` after creating an entity; edit schemas, not the generated docs) in `meta/entity-creation.md`, `CLAUDE.md` and `data/CLAUDE.md`, `tasks/schema-migration/scripts/` deleted (v0.96.0). The pre-commit validator hook was skipped: a full `validate.py` run takes minutes
- [ ] Jeff tells the collaborators about the link-quoting rule
- [ ] `/sync` to the template, after a leak review of `data/` and Jeff's call on `notes-kit` (see **Next**)
