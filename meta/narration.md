---
type: meta
tags: [guideline, narration]
---

# Narration

How a planned scene becomes an audiobook-style MP3 the DM listens to while reviewing a session.
The single source for narration rules; `/narrate` and `scripts/narrate.py` reference this file.
Read once per task when writing an ear script or casting a voice.

## What a take is

- **Take**: one MP3 of one scene (`### Scene N`) or one beat (`#### S2_CELL`) of a planned
  session, made on demand with `/narrate`. Never a whole session. Named
  `session-<n>.scene-<key>.mp3` or `session-<n>.<beat id>.mp3`, in `narration/takes/`.
- **For the DM only.** Takes are made from DM-facing plans and carry spoilers. Never give one to
  a player of the active campaign.
- **Not canon, not a plan edit.** The plan stays the source. A take is a way to hear it; if the
  take shows a problem, fix the plan and re-narrate.
- **Per-machine.** Clips, ear scripts and takes are gitignored and rebuilt by `/narrate`. Only
  `narration/cast.md` is committed.

## The ear script

The plan rewritten to be heard: `narration/scripts/<take>.md`, the text `narrate.py` reads.

- **Story prose, present tense, third person** for the narrator: what happens, in the
  order it happens. Read-aloud boxes keep their wording but move from "you" to the party's names
  when that reads better aloud ("The griffon lands an arm's reach from Dip").
- **No ids, tables, markdown, brackets or stage directions.** Beat ids, `[x]` markers, HP lines,
  initiative lists and stat blocks are dropped.
- **Mechanics as light cues,** said in passing: "Nella fires twice a round", "a DC 14 Strength
  save, or Tithe carries them up". One cue where the DM needs to remember it; no numbers the
  narrator wouldn't say aloud.
- **NPC lines verbatim** from the plan, spoken by that NPC's cast voice. Don't invent dialogue the
  plan doesn't have; the take tests the plan's lines, not new ones.
- **Short sentences, varied length.** Long sentences with nested clauses lose the listener. One
  idea per sentence where the plan crams two. Spell numbers as words ("forty-seven").
- **`meta/prose-style.md` applies** (anti-slop pass, While drafting checklist), with one extra
  test: read each line as if hearing it once, with no way to scroll back.

## Spine and forks

- **Spine**: the scene's most likely path. Follow its beats in story order (solid flow edges, then
  plan order; `scripts/narrate-brief.py` prints it). Committed `[x]` beats are always on it; `[-]`
  beats are on it unless a fork says otherwise; `[?]` beats become asides. At a choice, the spine
  takes the outcome the plan calls likely, or the first one listed.
- **Forks**: every `Choice (...)`, `Private (...)` outcome, roll band, contingency, and dashed or
  labelled flow edge in the target.
- **Asides**: at each fork, after the spine's outcome is told, one `[aside]` per other outcome:
  "If instead they leave the banner, Silas never sees it, and the feud waits." One or two
  sentences each, then back to the spine. A `Private (<PC>)` block's messages are each an aside
  that names the player who gets it.
- A fork with many outcomes (a d6 table) gets one aside summing up the spread, not one per row.

## Ear-script format

One utterance per line. Blank lines and `#` comments are skipped.

```text
# Session 34, Scene 4 — The Man in the Cell
[narrator] The casks come home on the camp's own wagon, and Tithe's body rides with them.
[Mara Tull] Three of yours, two of theirs. Get it off the street.
[aside] If instead they leave the banner on its pole, Silas never sees it, and the feud waits.
[pause 1.5]
```

- `[narrator]` and `[aside]` are the narrator; an aside is a touch slower and calmer and has a
  longer pause either side.
- `[<NPC name>]` must match a row in `narration/cast.md`, case-insensitive.
- `[pause <seconds>]` for a beat change the line breaks don't already give.

## Casting

`narration/cast.md` gives every speaker one voice, kept the same across takes.

- **Narrator**: Kokoro's `bm_lewis` seed, cloned by Chatterbox (Jeff's pick, 2026-11-14). The
  clip is gitignored; on a new machine, remake it with `--seed narrator --voices bm_lewis`, then
  `--keep narrator=bm_lewis`. Change it only by the DM's choice.
- **NPCs**: every named NPC with lines in the take gets a clip. Unnamed walk-ons are voiced by the
  narrator ("the cask-hand says…") unless they carry a scene.
- **Seeding a new NPC**: `narrate.py --seed "<NPC>" --voices a,b,c --line "<one of their plan
  lines>"` reads one line in three candidate Kokoro voices. Pick candidates to fit the NPC's
  `voice:` core and age (Kokoro voices: `am_*`/`af_*` American male/female, `bm_*`/`bf_*` British).
  The DM picks one; `--keep "<NPC>=<voice>"` makes it the clip, and Chatterbox clones it from then
  on. Kokoro only seeds; every take is rendered by Chatterbox.
- **Settings follow the core:** `exaggeration` (0.25 flat to 1.0 wild; 0.5 is neutral) and
  `cfg_weight` (pace: 0.3 slow and deliberate, 0.5 neutral, 0.6 quick). A dry, patient voice runs
  low on both; a breathless one runs high. Record the `voice:` core in the row's `from:` so a
  later voice shift (`meta/voice.md`) shows the cast may need a look.
- **Recast only on the DM's word,** or when the NPC's `voice:` core changes.
