# Recaps

Domain rules for session recordings, transcripts and the recap inbox. Auto-loaded when working in `recaps/`; root CLAUDE.md keeps only the triggers.

## Layout

- `recaps/audio/` — recordings, gitignored, kept on the DM's machine. Either a folder of per-speaker tracks (`recaps/audio/session-26/`, Craig-style multi-track) or a single mixed file
- `recaps/transcripts/` — machine transcripts, speaker-labeled, committed as the record of what was said. Per-track decode cache in `recaps/transcripts/.cache/<session>/`
- `recaps/inbox/` — raw session notes awaiting `/recap`, from the DM or from `/transcript`

## Pipeline

Three steps, each with a human checkpoint:

1. `uv run scripts/transcribe.py --session <n>` → `recaps/transcripts/session-<n>.md`
2. `/transcript <n>` → `recaps/inbox/session-<n>.md`, digested notes shaped for `/recap`'s Phase 2 questions
3. `/recap` → historian, DM-supervised as always

Scripts:

- `uv run scripts/transcribe.py [--session <n>] [--list] [--force]` — speaker-labeled transcript. Multi-track needs no diarization; decoding is biased toward canon names
- `uv run scripts/diarize-track.py --session <n> --track <stem> --speakers "A,B" [--dry-run]` — split one track that carries two speakers. Embeds each cached utterance with ECAPA-TDNN, clusters by voice, names clusters from DM turn-anchors and class vocabulary

**A transcript is a source, not canon.** It mishears proper nouns, drops quiet speakers, and cannot tell a joke from a plan. Everything derived from one carries confidence marks (`(?)`, `(??)`) into the inbox note, and the DM resolves them during `/recap`. Never canonize straight from a transcript.

## Speaker labels

Optional `recaps/audio/<session>/speakers.tsv` maps a track filename stem to a display name (`eljeffe0024` → `Jeff`), so Discord handles don't end up as speaker labels.

**Resolving unknown handles:** a Craig handle that doesn't obviously map to a player is usually identifiable from the audio itself — a player self-identifying ("my name is Odibli"), or class vocabulary that matches exactly one PC (rage/reckless/greataxe → the barbarian; ki/Step of the Wind → the monk). Confirm the mapping, write it into `speakers.tsv`, then re-run `transcribe.py` — the per-track cache makes a relabel instant, with no re-decoding. Note the evidence in a comment in the file so the next person doesn't re-derive it.

## Shared microphones

One track normally means one speaker, which is why the pipeline needs no diarization. When two players sit together and share a mic, that assumption breaks and every line on that track is falsely attributed to the track's owner. Handle it in two steps:

1. Set the track's `speakers.tsv` label to **both** names (`Jeff (Iggy) + Paul (Luci)`) so nothing is attributed to one player on no evidence, and record in a comment how you know
2. Optionally run `diarize-track.py` to split it by voice. It writes `.cache/<slug>/<stem>.speakers.json`, which the next `transcribe.py` run stamps onto each utterance — cache-only, no re-decode

Do not try to split a shared track by reading the text. Measured on session 27, class vocabulary plus DM turn-anchors attribute only ~20% of utterances; the rest is `"yeah"` and `"that misses"`, identical between two players. The voice is the signal, the words are not. Lines the split leaves unresolved keep the joint label, and the DM settles them at `/recap`.

## Long runs must be detached

A transcription launched with the Bash tool's background mode dies when the Claude Code process restarts, losing the whole run. For a full session, launch it detached so it survives — on Windows, `Start-Process` with `-RedirectStandardOutput`/`-RedirectStandardError` into `recaps/transcripts/.cache/<session>/` — then watch the log. The per-track JSON cache means an interrupted run resumes without redoing finished tracks.
