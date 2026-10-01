# Versioning

The project carries a single semantic version, `MAJOR.MINOR.PATCH`, in the root [`VERSION`](../VERSION) file. Every bump prepends an entry to [`CHANGELOG.md`](../CHANGELOG.md). This is the canonical home for the bump rules — `CLAUDE.md`, commands, and the changelog reference it; they do not restate it.

The version exists so collaborators and their Claude agents can tell, at a glance, **what important thing changed** since they last worked here. It is not an activity counter.

## What the version covers

The whole repo is in scope, but a change must clear the **bump bar** to move the version. The version answers "did the engine or campaign *shape* change," not "was there activity."

**Below the bump bar (no version change):** routine campaign content authored through normal play — new entities, canonized sessions, pool submissions, lore drafts, map crops. Tracked by git and the historian, not the version.

## Tiers

### MAJOR — breaking

A change that makes a prior consumer (a human collaborator, their Claude agent, or a script) **wrong** if they don't re-read.

- Engine: command renamed or removed; script flags or output format changed; frontmatter field renamed/removed or its meaning changed; folder role redefined; a meta rule reversed.
- Content: a **retcon** — canon overturned (campaign transition, a death undone, a location renamed, an established fact contradicted).

### MINOR — non-breaking, additive

New capability or structure that invalidates nothing existing.

- Engine: new command; new script; new *optional* frontmatter field; new meta rule that adds without reversing.
- Content: **structural** additions only — a new act, new mission arc, campaign-transition setup. (Routine entities/sessions stay below the bump bar.)

### PATCH — fixes/tweaks

No structural or behavioral change.

- Engine: script bugfix; typo; doc clarification; lint.
- Content: fixing a typo or broken link; small touchup.

## Bump procedure

When a change clears the bump bar:

1. Edit `VERSION` to the new number.
2. Prepend a dated entry to `CHANGELOG.md` under the new version heading, grouped `Added` / `Changed` / `Removed` / `Fixed`. Keep entries terse and collaborator-facing — what moved and whether it breaks anything.
3. Commit `VERSION` + `CHANGELOG.md` together (the bump commit). `version-check.py` derives the "last bump" from the most recent commit touching `VERSION`.

`scripts/version-check.py` flags when engine files changed but `VERSION` did not — non-blocking, same spirit as the index-staleness check. A flag means "decide whether this cleared the bump bar," not "you broke something."

## Stamp Pattern

Versioning is an instance of the [Stamp Pattern](../CLAUDE.md) (drift-prone state, stamped with a marker, flagged by a script when it lags). The marker is the bump commit on `VERSION`.
