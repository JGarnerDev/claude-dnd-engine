---
description: "List every slash command in this campaign engine, built from each command file's frontmatter."
---

List all available slash commands for this campaign engine.

Run the list script (no manual file reads):

```text
uv run scripts/commands-list.py
```

It prints one line per file in `.claude/commands/`, with usage and the `description:` from its frontmatter. Output that list as-is: an unordered list, one line per command, no headers, no sections, no tables. Swap the script's `--` separator for an em dash.

If a line says `MISSING description frontmatter`, list the command anyway and add one line at the end: that file needs a `description:` field.
