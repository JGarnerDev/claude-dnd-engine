---
description: "Digest a session recording's transcript into recaps/inbox/ notes ready for /recap."
argument-hint: "[session] [--transcribe] [--quotes-only]"
---

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

**A track labelled with two names is a shared microphone** (`Jeff (Iggy) + Paul (Luci)`) — two players sat together and spoke through one mic, so the track cannot be split on voice alone by the transcriber. Check the frontmatter for a `# diarized:` line under that track:

- **Present** — `diarize-track.py` has split it by voiceprint and each line carries one name. Treat those labels as strong but not certain, and keep `(?)` on any attribution that decides something mechanical (who cast what, who took damage)
- **Absent** — every line on that track is genuinely ambiguous between the two players. Attribute by content only where a line is decisive (class vocabulary, the DM naming someone in the preceding line) and mark everything else `(?)`. Do **not** guess from turn order alone; measured on session 27, text-side signals resolve only ~20% of such a track

Either way, flag to the DM that one player's participation is voice-invisible, because participation feeds `spotlight-balance.py` and the rotation ledger. A player who shared a mic looks absent to every downstream script until `/recap` writes the session record with both PCs present.

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

`Quotable lines` holds verbatim lines with speaker and timestamp. `/recap` files the NPC lines into each speaker's `## Voice` section (`meta/voice.md`), so name the character, not the player, and favour lines that show how an NPC talks over lines that only carry plot. They are the one part of the note where exact wording matters more than summary.

Do not delete the transcript. `/recap` deletes the inbox file after canonizing; the transcript stays as the record behind it.

---

## Phase 5 — Hand Off

Report to the DM in plain language:

- Session and duration digested, and how many scenes the ledger holds
- The count of `(??)` items awaiting resolution
- Anything the contradiction check flagged

Then: "Run `/recap` to canonize this — it will pick the note up from `recaps/inbox/` automatically."

---

## Phase 6 — Party Notes for Google Drive (only when asked)

**Trigger:** the DM asks for "google drive notes", "drive notes", "notes for the party", or otherwise wants the session as a document to share with the table — pasted into **Google Docs**. Do this only on request; the inbox note is the default deliverable.

**The audience is the players.** Write as if every player will read it, because they will. The inbox note is a DM document; this is not a copy of it. Build it fresh from the ledger, keeping only what the characters experienced at the table.

### No spoilers

Leave out anything the party did not see, hear, or learn in play:

- DM asides, rules talk, and out-of-character planning chatter ("I'll have her show up next week", "he's actually lying")
- NPC secrets, true motives, hidden allegiances, and anything the party has not discovered — even when the transcript, historian, or scheduler makes it plain
- Names the party never learned. Use what the characters would call them ("the hooded woman at the gate")
- Links to historian, scheduler, or spitball entities, the contradiction check, and every `(??)` item that turns on DM-side knowledge
- Hints about what comes next, foreshadowing, or "this will matter later"

When unsure whether the party knows something, leave it out and list it for the DM in the hand-off message, not in the document.

### No conclusions

Report what happened; let the party interpret it:

- What an NPC said is a claim, not a fact: "Asher said the debt was paid", never "the debt was paid"
- No motives, no reading of NPC intent, no "this suggests" or "it seems that"
- Party theories stay attributed to whoever voiced them: "Iggy suspects the crystals are being overheard". Never promote one to the narrative
- Open questions are listed as the party left them, unanswered and unranked
- Use the characters' names, not the players', in narration

Keep transcription doubt light: a `(?)` after a misheard name or an unclear "who did it" is fine and invites players to correct it. Drop the `(??)` mark and its legend entirely.

### Publishing

Publish the notes as an HTML artifact, then hand over the URL with the instruction to open it, select all, copy, and paste. Do **not** suggest "paste without formatting" — the formatting is the deliverable. In the hand-off message (not the document), list anything held back as a possible spoiler, so the DM can add it back if it was in fact revealed.

Google Docs keeps headings, bold, italics, text color, highlight color, lists, blockquotes, links, and horizontal rules. It discards grid and flex layout, backgrounds on containers, left accent bars, and `::before` content. Build the hierarchy out of what survives, not out of boxes and panels.

Four rules, learned the hard way:

- **Light theme only — no dark variant.** The clipboard carries the `body` background. A dark-themed page drops a black block into a white document while Docs discards the light text colors sitting on it. Set the ground to pure `#FFFFFF` so it pastes invisibly onto Doc paper, and state every color explicitly.
- **Top heading is `H3`.** The digest nests under the host document's own hierarchy, so it must start below it. Sections are `H4`, subsections `H5`. Scale the type to match — a heading that is semantically `H3` but visually the largest thing on the page fights the Doc's real headings above it.
- **Pick typefaces that exist in the Google Docs font menu** so the identity survives instead of falling back to Arial. Spectral, Lora, and IBM Plex Mono are all in both Google Fonts and Docs, and pair well for this material.
- **Keep the `(?)` marks quiet.** Color them as a muted inline span so players can spot a name to correct, but don't make them the document's focus. No legend needed beyond one line: "`(?)` means the recording was unclear; tell the DM if you remember it differently."

---

## Notes

- `--quotes-only` stops after Phase 2, printing the quotable lines with timestamps. Nothing is written.
- Re-running on a session that already has an inbox note overwrites that note. Say so before overwriting if the existing note has DM edits in it (check its frontmatter for `source: transcript` — a note without that marker was written by hand and must not be overwritten without asking).
