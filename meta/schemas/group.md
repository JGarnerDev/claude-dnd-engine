# Group Schema

Covers the shared table preferences file at `meta/players/group.md`. There is only one group file per campaign — this schema defines its structure and how to fill it out.

Group preferences are the default for all session generation. Individual player files (`meta/players/{name}.md`) may add to or override these on a per-player basis.

---

## Canonical Path
`meta/players/group.md`

## Frontmatter Template

```yaml
---
type: meta
description: ""   # optional one-line summary

players:
  - [[Player Name]]   # wiki-link to each meta/players/{name}.md
---
```

Group files are singletons — no `name`, `role`, `status`, or `characters` fields. The body sections carry all meaningful content.

## Body Structure

```markdown
# Group

Members: [[Player Name]], [[Player Name]]   # repeat frontmatter links here — Foam requires body links

## What the Table Enjoys
<!-- Kinds of sessions, moments, or story beats the whole group has responded well to. -->

## What the Table Prefers to Avoid
<!-- Content, tropes, or situations that don't land well or make anyone uncomfortable. -->

## Pacing Preferences
<!-- How does the group like sessions to flow? -->
<!-- e.g. "one big set piece per session", "lots of downtime roleplay", "always end on a cliffhanger" -->

## Tone Guardrails
<!-- Where does the table draw the line on dark content, comedy, romance, horror, etc. -->

## Table Culture
<!-- Anything about how this group plays that affects how sessions should be written. -->
<!-- e.g. "players love to be surprised", "group prefers agency over railroading", "comedy is welcome but not at the expense of drama" -->
```

## Notes

- Group preferences apply to all sessions unless a player file explicitly overrides them.
- When group and individual player preferences conflict, individual preference wins for that player's spotlight moments; group preference governs shared scenes.
- This is a meta file, not an entity. Do not add entity schema fields.
- **Every `[[wiki-link]]` in frontmatter must also appear in the body.** The `Members:` line under the heading satisfies this for Foam. Obsidian reads both.
