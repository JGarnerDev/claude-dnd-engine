---
description: "Narrate one scene or beat of a planned session as an audiobook-style MP3 take, for the DM to review by ear."
argument-hint: "<scene number | beat id> [--session <n>] [--force]"
---

Turn one scene (or beat) of a planned homebrew session into a spoken MP3: narrator plus cast NPC
voices, branches told as asides. Rules: `meta/narration.md` (read once).

**Arguments:**

- `<scene number | beat id>`: `4` for `### Scene 4`, or `S35_09_CELL` for one beat (required)
- `--session <n>`: which planned session; defaults to the next unplayed one
- `--force`: re-render every line, ignoring the per-line cache

---

## Phase 1: Gate and brief

- **DM only.** If the person at the keyboard is a player in the active campaign rather than its
  DM, stop: takes carry the whole plan. Say so in one line.
- **Homebrew only.** Strahd sessions have no plans here (root `CLAUDE.md` → Campaign Separation).
- Run the brief:

```powershell
uv run scripts/narrate-brief.py <target> [--session <n>]
```

It prints the plan lines to read, the spine, the forks with line numbers, the cast with each
`voice:` core and whether it is cast, the take name and a length estimate.

## Phase 2: Cast anyone new

For each named NPC marked `NOT CAST` who has lines in the target:

1. Pick three Kokoro voices that fit the `voice:` core (`meta/narration.md` → Casting), and one of
   the NPC's own plan lines, then run:

   ```powershell
   uv run scripts/narrate.py --seed "<NPC>" --voices <a,b,c> --line "<their line>"
   ```

2. Give the DM the three candidate MP3 paths and ask which to keep: one question, the three
   voices plus "narrator voices them for now".
3. On a pick, run `uv run scripts/narrate.py --keep "<NPC>=<voice>"` and add the NPC's row to
   `narration/cast.md` with settings from the core and `from:` set to the core.

Several new NPCs: seed them all in one go, then ask about them one per message.

## Phase 3: Write the ear script

1. Read `meta/prose-style.md` once.
2. Read the plan lines the brief named (only those), plus the `## NPC Quick-Reference` entries
   for the cast.
3. Write `narration/scripts/<take>.md` in the ear-script format: spine in story order, an
   `[aside]` per non-spine outcome at each fork, mechanics as light cues, NPC lines verbatim.
   Run the prose-style While drafting checklist on it, read as if heard once.

Don't show the script to the DM first; the take is how they review it. They can edit the script
by hand and re-render.

## Phase 4: Render

Run in the background (a 5-minute take renders in a few minutes on the GPU; the first run also
downloads the models):

```powershell
uv run scripts/narrate.py --script narration/scripts/<take>.md [--force]
```

When it finishes, report the take path and length, and a line on what the forks covered. A
re-render after an edit only re-renders the changed lines.

## Closing

If the take shows a problem in the plan, suggest `/review` for that scene.
