# Schema migration: prose schemas to JSON Schema

**Status:** steps 1–4 done (2026-11-18, engine v0.72.2); step 5 next. Progress and how to resume: [TODO.md](TODO.md).

## Goal

Every entity type gets a machine-checked schema in the standard format shared by all of Jeff's projects: **JSON Schema draft 2020-12, written in YAML** (`meta/schemas/<type>.schema.yaml`). Frontmatter becomes strict YAML, so a real parser and validator can read it. The Player Forms stay, but they are generated from the schemas instead of written by hand.

## Decisions

- **D1 Format:** JSON Schema 2020-12 in YAML, the same as Cooking and Battletech. Decided by Jeff 2026-11-18 (hub `TODO.md`).
- **D2 Incremental:** one step at a time, one entity type at a time. Each step leaves the engine working and gets committed on its own, so collaborators can pull between steps.
- **D3 Links in frontmatter are quoted:** `location: "[[Duskwater]]"`, `- "[[Harrow Bane]] (his captain)"`. That makes the frontmatter valid YAML, and it is the form Obsidian needs to treat a frontmatter link as a link.
- **D4 Temporary scripts** live in `tasks/schema-migration/scripts/` and are deleted when the migration is done. Permanent tools go in `scripts/`.
- **D5 Warn, then enforce:** the validator reports a type without a finished schema as a warning. Once a type's schema is done, violations of it become errors.

## Starting state (surveyed 2026-11-18, before step 1)

- 36 prose schemas in `meta/schemas/*.md`: Player Form, frontmatter template, form-to-field table, valid states.
- About 1,600 entity files in `data/` and `historian/`. 368 files have 2,276 unquoted frontmatter links; 1,907 links are already quoted. 20 files have no frontmatter.
- Largest types: monster 545, spell 280, location 168, deity 108, character 97, resource 71, event 54.
- `scripts/lib/common.py` reads frontmatter with regexes (`get_frontmatter`), and 29 scripts call it. **It doesn't handle quoted links:** `- "[[X]] (note)"` comes back with the brackets still on, so this parser has to be fixed before any link is quoted.
- `scripts/validate.ps1` checks only that `name`, `type` and `exists` are present, plus links, name against filename, and frontmatter links being repeated in the body.

## Steps

### 1. Audit (temporary script)

`scripts/audit.py`: for each type, list the file count, the fields used and how often, each field's distinct values (to find enums), unquoted links, files with no frontmatter, and files that strict `yaml.safe_load` rejects. Its output is the input for every later step. Rerun it after each step to measure progress.

### 2. Make the parser accept quoted links

Change `get_frontmatter` so quoted and unquoted links come back the same way (`"[[X|alias]] (note)"` gives `X`). Write tests first in `scripts/test_common.py` covering both forms, and run the 29 scripts that use the parser before and after to compare. Nothing changes in the data during this step.

### 3. Quote links (temporary script)

`scripts/quote-links.py --dry-run | --apply <folder>`: wraps unquoted frontmatter links in quotes and touches only the frontmatter. Run it one folder per commit (`data/characters`, `data/locations`, …). Afterwards, step 1 should report 0 unquoted links.

### 4. Strict YAML

Fix the files that still fail `yaml.safe_load` (the audit lists them), and add frontmatter to the 20 files that have none or mark them as non-entities. Then switch `get_frontmatter` to `yaml.safe_load` plus the link helper, keeping its return shape (`fm[key]`, `fm['_list_<key>']`) so the 29 scripts don't change.

### 5. Validator

Write a permanent `scripts/validate.py` (`uv run`, with `pyyaml` and `jsonschema`). It ports every check in `validate.ps1`, then adds schema checks under D5. Keep `validate.ps1` until both report the same results, then delete it and update the docs that mention it.

### 6. Schemas, one type at a time

For each type: `scripts/draft-schema.py <type>` (temporary) builds a first `meta/schemas/<type>.schema.yaml` from the prose frontmatter template plus the audit's field and value data. Jeff or Claude reviews it, existing files are fixed until the validator passes, and the type moves to enforced.

Order: `entity` (the shared base, through `$ref`/`allOf`), then character, location, faction, event, deity and the other campaign types. The reference catalogs (monster, spell, feat, race, class, background) come last because they are bulk and rarely edited.

Player Form content moves into the schema: each field's `description`, plus custom keys `x-form-question`, `x-form-required` and `x-form-order`. Valid-state tables become `enum` values with descriptions.

### 7. Generate the forms and docs

`scripts/gen-schema-docs.py` (permanent) turns each `.schema.yaml` back into the readable `meta/schemas/<type>.md`: Player Form, frontmatter template, valid states. Each generated file carries a "generated, do not edit" line. Once the generated files match today's, the prose files stop being edited by hand.

### 8. Rules, template and cleanup

- Update `meta/entity-creation.md`, `CLAUDE.md` and the folder `CLAUDE.md` files: quote frontmatter links, run the validator after creating an entity, and edit the schema, not the generated `.md`.
- Optionally make the pre-commit hook run the validator (non-blocking, like the markdownlint hook).
- `/sync` the schemas, validator, parser and rules to `claude-dnd-engine-template`.
- Tell collaborators about the link-quoting rule.
- Delete `tasks/schema-migration/scripts/`. Mark this plan done.

## Risks

- **Merge conflicts:** step 3 touches 368 files. Run it per folder, when collaborators have no open work there.
- **Script regressions:** steps 2 and 4 change a parser that 29 scripts depend on. That's why tests come first and the scripts are compared before and after.
- **Generated docs drifting from the schemas:** step 7 is the only way to edit the docs, and the validator can check that each generated `.md` is up to date.
