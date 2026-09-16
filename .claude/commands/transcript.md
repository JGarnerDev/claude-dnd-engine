Digest a recorded session's transcript into session notes ready for `/recap`. Bridges raw audio and canon: the transcript is what was *said*, the inbox note is what *happened*, and `/recap` turns that into canon.

**Arguments:**

- `[session]` — session number or slug (e.g. `12` or `session-12`). Default: the newest transcript in `recaps/transcripts/`
- `--transcribe` — run `scripts/transcribe.py` first, then digest (use when only audio exists)
- `--quotes-only` — extract memorable verbatim lines and stop; no inbox note written

---

## Behavior

Reads a machine transcript and writes **one** file: `recaps/inbox/<slug>.md`. Writes nothing to `historian/`, `data/`, or `scheduler/` — canonization is `/recap`'s job, and it stays a DM-supervised step. The transcript is a *source*, not canon.

The transcript is large (a four-hour session runs 30–50k words). Read it in chunks and build a running ledger; do not attempt to hold the whole document in working memory at once.

---

## Phase 1 — Locate the Transcript

```text
uv run scripts/transcribe.py --list
```

- If a transcript exists at `recaps/transcripts/<slug>.md`, use it.
- If only audio exists and `--transcribe` was passed, run it now — a four-hour multi-track session takes roughly 15–25 minutes on GPU:

  ```text
  uv run scripts/transcribe.py --session <n>
  ```

- If only audio exists and `--transcribe` was *not* passed, say so and stop. Do not start a long transcription run the DM did not ask for.

Read the transcript's frontmatter only at this stage. Report to the DM: session slug, duration, word count, speaker list, and any name fixups the script applied. If `device` reads `cpu`, mention it — a CPU run is far slower and slightly less accurate, and the DM may want to rerun on GPU.

Cross-check the speaker list against the active campaign's party roster. If a speaker label looks like a raw filename rather than a person (`Track 2`, `1699999999`), tell the DM they can fix it permanently with a `speakers.tsv` in the audio folder, then proceed using the labels as-is.

---

## Phase 2 — Chunked Read and Scene Ledger

Read the transcript body in sequential chunks of roughly 500–800 lines. After each chunk, append to a running ledger held in working notes — never re-read a chunk you have already ledgered.

For each chunk record only:

- **Scenes** — one line each: where the party was, who was present, what changed
- **Decisions** — choices the party made, and what they turned down
- **Named entities** — every person, place, faction, or item named aloud, with the timestamp of first mention
- **Mechanics** — combats (rough round count), rests (short or long), level-ups, damage taken, resources burned
- **In-world time** — any stated time of day, date, or elapsed-travel reference
- **Quotable lines** — verbatim NPC or PC lines worth keeping, with speaker and timestamp
- **Table talk** — out-of-character reactions worth noting; keep these separate from in-fiction events

Discard: rules arguments, snack logistics, side conversations, and repeated crosstalk. A multi-track recording captures everything anyone said, and most of it is not the session.

**Attribution discipline.** The transcript labels the *player*, not the *character*. Kellan's track speaking as an NPC is still Kellan's track. When a line is in-fiction, attribute it to the character; when you cannot tell whether a line was in-character or table talk, mark it uncertain rather than guessing.

---

## Phase 3 — Synthesize the Six Answers

Collapse the ledger into answers to `/recap` Phase 2's questions. Write only what the transcript supports.

1. **Date played** — from the transcript's `generated` frontmatter if the audio was transcribed promptly; otherwise leave blank for the DM
2. **Recap** — what happened, in order, past tense, third person; scene by scene
3. **Cliffhanger** — where the session ended; the open question carried forward
4. **State changes** — deaths, level-ups, afflictions, items gained or lost, relationship shifts
5. **Rests, rounds, and in-world time** — long and short rests, rough combat rounds, in-world time elapsed and the time the party ends on, notable resource burns
6. **New entities** — anything named at the table that may not have a file yet

Add a seventh section, **Table reaction**, from the out-of-character moments — what landed, what fell flat.

**Confidence marking is mandatory.** For every item that the transcript does not state plainly, mark it inline:

- `(?)` — inferred from context, not stated
- `(??)` — genuinely unclear; the DM must resolve it
- `(heard as "<x>")` — a name the transcriber may have mangled

Under-marking is the failure mode that matters. A machine transcript mishears names, drops quiet speakers, and cannot tell a joke from a plan. Every unmarked line in this note becomes canon in `/recap` without further scrutiny, so mark generously.

Run a contradiction check on the synthesized recap before writing:

```text
uv run scripts/semantic-search.py "<recap summary>" --source historian -k 6
```

Surface anything that looks like it conflicts with existing canon as a `(??)` item rather than silently resolving it.

---

## Phase 4 — Write the Inbox Note

Write `recaps/inbox/<slug>.md`:

```markdown
---
source: transcript
transcript: "recaps/transcripts/<slug>.md"
session_guess: <n>
digested: "<ISO date>"
---

# Session Notes — <slug> (from transcript)

> Digested from a machine transcript. Items marked `(?)` are inferred and `(??)`
> need DM resolution. Confirm before canonizing.

## Date played

## Recap

## Cliffhanger

## State changes

## Rests, rounds & in-world time

## New entities

## Table reaction

## Open questions for the DM

## Quotable lines
```

Fill every section. Leave `Open questions for the DM` as a short numbered list of only the `(??)` items — that list is what the DM actually has to answer, and keeping it short is what makes the note usable.

`Quotable lines` holds verbatim lines with speaker and timestamp. These feed `/voice` later; they are the one part of the note where exact wording matters more than summary.

Do not delete the transcript. `/recap` deletes the inbox file after canonizing; the transcript stays as the record behind it.

---

## Phase 5 — Hand Off

Report to the DM in plain language:

- Session and duration digested, and how many scenes the ledger holds
- The count of `(??)` items awaiting resolution
- Anything the contradiction check flagged

Then: "Run `/recap` to canonize this — it will pick the note up from `recaps/inbox/` automatically."

---

## Phase 6 — Shareable Export (only when asked)

The DM sometimes wants the digest as a document to share with the table — pasted into **Google Docs**. Do this only on request; the inbox note is the default deliverable.

Publish the digest as an HTML artifact, then hand over the URL with the instruction to open it, select all, copy, and paste. Do **not** suggest "paste without formatting" — the formatting is the deliverable.

Google Docs keeps headings, bold, italics, text color, highlight color, lists, blockquotes, links, and horizontal rules. It discards grid and flex layout, backgrounds on containers, left accent bars, and `::before` content. Build the hierarchy out of what survives, not out of boxes and panels.

Four rules, learned the hard way:

- **Light theme only — no dark variant.** The clipboard carries the `body` background. A dark-themed page drops a black block into a white document while Docs discards the light text colors sitting on it. Set the ground to pure `#FFFFFF` so it pastes invisibly onto Doc paper, and state every color explicitly.
- **Top heading is `H3`.** The digest nests under the host document's own hierarchy, so it must start below it. Sections are `H4`, subsections `H5`. Scale the type to match — a heading that is semantically `H3` but visually the largest thing on the page fights the Doc's real headings above it.
- **Pick typefaces that exist in the Google Docs font menu** so the identity survives instead of falling back to Arial. Spectral, Lora, and IBM Plex Mono are all in both Google Fonts and Docs, and pair well for this material.
- **Give the confidence markers the color system.** `(?)` and `(??)` become colored inline spans — text color plus highlight both survive the paste. Resolving them is what the document is *for*, so they should be findable at a scroll. Include a short legend near the top explaining both marks.

---

## Notes

- `--quotes-only` stops after Phase 2, printing the quotable lines with timestamps. Nothing is written.
- Re-running on a session that already has an inbox note overwrites that note. Say so before overwriting if the existing note has DM edits in it (check its frontmatter for `source: transcript` — a note without that marker was written by hand and must not be overwritten without asking).
