# TODO: schema migration

Plan: [PLAN.md](PLAN.md). Claude keeps this list current.

**Status (2026-11-18):** steps 1–4 done and pushed (engine v0.72.2). Every entity file's frontmatter is strict YAML with quoted links, and `get_frontmatter` reads it with a YAML parser.

**Next:** step 5, write `scripts/validate.py`, a Python port of `scripts/validate.ps1`. Details under step 5 below.

## Resuming in a new session

1. Read [PLAN.md](PLAN.md) (goal, decisions D1–D5, steps), then this file.
2. Check the starting point: `uv run tasks/schema-migration/scripts/audit.py | head -7` should show 1,586 entity files, all strict YAML, 0 unquoted links. If new files have unquoted links, run `quote-links.py` on them first.
3. Take a baseline before changing any parser or script: `uv run tasks/schema-migration/scripts/snapshot.py <scratch>/before`. After the change, snapshot to `<scratch>/after` and `diff -r` the two folders. Every difference must be explained as a fix.

### Temporary tools (`tasks/schema-migration/scripts/`, deleted in step 8)

- `audit.py`: read-only survey. No flags: summary plus fields and values per type. `--type <type>`: every field and value for one type (input for step 6). `--files`: files that fail strict YAML.
- `quote-links.py <folder>... [--apply] [--quiet]`: quotes unquoted frontmatter links. Dry run by default.
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
- [ ] 5. `scripts/validate.py` matches `validate.ps1`'s results, then `validate.ps1` is retired:
  - [ ] Baseline: `powershell -NoProfile -File scripts/validate.ps1 > <scratch>/val-ps1.txt` gives 1,585 files checked, 15 errors, 667 warnings (2026-11-18). Exit code 1 when there are errors
  - [ ] Port every check. **Errors:** dangling `[[links]]` (no matching file or alias); missing `name`, `type` or `exists`; `exists: false` in `historian/`. **Warnings:** a reference-catalog type (monster, spell, deity, feat, race, class, background, skill) with `exists: false`; a historian file missing `source_session` or `confirmed_date`; `name` different from the filename; a frontmatter link not repeated in the body (Foam graph gap). Same scope (`data/`, `historian/`, `scheduler/`; skip `CLAUDE.md`, templates, pool docs, `_` files; `tests/` and `spitball/` excluded from the link check), same flags (`--scope all|links|frontmatter`, `--quiet`) and the same output format
  - [ ] Reuse `get_frontmatter` and `entity_md_files` from `scripts/lib/common.py`. Add a `# consumers:` header and a `# Usage:` line like the other scripts
  - [ ] Compare its output with the baseline line by line until they match, or every difference is explained as a fix
  - [ ] Point everything that names `validate.ps1` at the new script. The script's own `# consumers:` header lists only four files; a search on 2026-11-18 found more:
    - Instructions: `CLAUDE.md`, `README.md`, `scheduler/CLAUDE.md`, `tests/CLAUDE.md`, `.claude/commands/recap.md`, `.claude/commands/handover.md`, `tests/commands/recap/spec.md`, `meta/flow-graphs.md`, `meta/dm-rotation.md`, `meta/spitball.md`, `meta/schemas/session.md`, `spitball/README.md`
    - Code: `scripts/lib/common.py` (comment), `scripts/validate-refs.ps1`
    - Campaign trackers `scheduler/campaign/_mysteries.md`, `_sky-clock.md`, `_citadel-clock.md`, `_reputation.md`: update them too
    - Played session files (`historian/sessions/Session 29–34 …/_flow.md`, `_tasks.md`, `_world-questions.md`): these are records, so leave them alone
    - Recheck with `.\scripts\refs.ps1 -Target validate.ps1`, and run `.\scripts\validate-refs.ps1` after deleting the old script
  - [ ] Delete `validate.ps1`. MINOR version bump (a script replaced), with a changelog entry
  - [ ] Only after the port matches: add schema checks (D5). A type with a `meta/schemas/<type>.schema.yaml` is validated with `jsonschema` (typed values, so load with `yaml.safe_load`, not `BaseLoader`); its violations are errors once the type is marked enforced, warnings before that
- [ ] 6. Schemas per type (enforced when done). Start each one from `audit.py --type <type>` plus the prose schema in `meta/schemas/<type>.md`:
  - [ ] entity (base)
  - [ ] character (pc, npc, antagonist)
  - [ ] location (each subtype)
  - [ ] faction
  - [ ] event
  - [ ] deity
  - [ ] other campaign types (session, act, campaign, culture, item, resource, route, rumor, mission, party, player, pc-arc, creature, skill)
  - [ ] reference catalogs (monster, spell, feat, race, class, background)
- [ ] 7. `scripts/gen-schema-docs.py` generates `meta/schemas/*.md`; check that generated files are up to date
- [ ] 8. Rules and docs updated (quote frontmatter links; edit schemas, not the generated docs), template synced with `/sync`, collaborators told, `tasks/schema-migration/scripts/` deleted
