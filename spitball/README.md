# Spitballs

Loose story ideas, captured without commitment. **Nothing here is canon.**

Filed by `/spitball`, usually from a phone. Conventions, frontmatter schema and lifecycle live in
[`meta/spitball.md`](../meta/spitball.md).

## Layout

One folder per target act, using the act's full slug — `act-1-the-hearth-at-ashford/`, not a bare
`act-1/`, because both campaigns currently have an Act 1. Ideas with no home yet go to
`unassigned/`, which is expected to be the biggest folder.

Assigning a target **moves the file**. The folder is the target, so a stale folder is a lie.

## Finding things

```powershell
uv run scripts/spitball-brief.py                      # the live pile, grouped by target
uv run scripts/spitball-brief.py --min-heat 4         # only the ones worth getting excited about
uv run scripts/spitball-brief.py --target unassigned  # the homeless pile
uv run scripts/spitball-brief.py --count              # totals by state and kind
```

Used and killed ideas are hidden by default; pass `--all` to see them.

> Spitball documents may be deleted at any time - do not rely on linking them. If the information seems important, suggest relocating it.

By meaning rather than by field:

```powershell
uv run scripts/semantic-search.py "betrayal in a small town" --source spitball
```

## Rules that matter

- **Never consulted as fact.** Not a source for `/recap`, `/check`, `/voice`, or anything that
  speaks about what is true.
- **Broken links are fine.** `spitball/` is excluded from `validate.ps1`'s link check so an idea
  can name something that does not exist yet.
- **Promotion lands at `[?]`.** `/spitball --promote` adds an idea to an act's flow graph as an
  open node, never a committed one. Becoming a node is not approval.
