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
- `uv run scripts/diarize-track.py --session <n> --track <stem> --speakers "A,B" [--refs "<n>,<n>"] [--export-key <N>] [--dry-run]` — split one track that carries two or more speakers. Embeds each cached utterance with ECAPA-TDNN. With `--refs`, matches each line to voiceprints from those sessions' solo tracks. Without it, clusters by voice and names clusters from DM turn-anchors and class vocabulary
- `uv run scripts/diarize-bench.py --session <n> --tracks "<stem>,<stem>" [--method cluster|refs] [--ref-sessions "<n>,<n>"]` — scores a split method on a fake shared mic, built by mixing solo tracks, so every line has a known speaker. Use it before changing any split setting

**A transcript is a source, not canon.** It mishears proper nouns, drops quiet speakers, and cannot tell a joke from a plan. Everything derived from one carries confidence marks (`(?)`, `(??)`) into the inbox note, and the DM resolves them during `/recap`. Never canonize straight from a transcript.

## Speaker labels

Optional `recaps/audio/<session>/speakers.tsv` maps a track filename stem to a display name (`eljeffe0024` → `Jeff`), so Discord handles don't end up as speaker labels.

**Resolving unknown handles:** a Craig handle that doesn't obviously map to a player is usually identifiable from the audio itself — a player self-identifying ("my name is Odibli"), or class vocabulary that matches exactly one PC (rage/reckless/greataxe → the barbarian; ki/Step of the Wind → the monk). Confirm the mapping, write it into `speakers.tsv`, then re-run `transcribe.py` — the per-track cache makes a relabel instant, with no re-decoding. Note the evidence in a comment in the file so the next person doesn't re-derive it.

## Shared microphones

One track normally means one speaker, which is why the pipeline needs no diarization. When two players sit together and share a mic, that assumption breaks and every line on that track is falsely attributed to the track's owner. Handle it in two steps:

1. Set the track's `speakers.tsv` label to **both** names (`Jeff (Iggy) + Paul (Luci)`) so nothing is attributed to one player on no evidence, and record in a comment how you know
2. Optionally run `diarize-track.py` to split it by voice. It writes `.cache/<slug>/<stem>.speakers.json`, which the next `transcribe.py` run stamps onto each utterance — cache-only, no re-decode

**Prefer `--refs`** whenever every speaker on the track had their own track in an earlier session. It names the sessions to take voiceprints from (`--refs "26,28,29"`), and it finds each player's Craig handle from those sessions' `speakers.tsv`. On the bench it cut confident-wrong labels from 9% to 1% (session 29 mix) and from 72% to 0.2% (session 28 mix). It avoids clustering's worst failure, where the voices separate cleanly but the clusters get the wrong names. Short lines are estimated from their own short crop plus the confident lines around them, and are scored as estimates, never as measured.

**Answer key.** A real shared track has no ground truth, and the bench runs optimistic because each voice in the mix keeps its own mic. `--export-key 40` cuts 40 clips (half under a second) into the session's `label-key/` folder, with a blank `label-key.tsv`. The DM tags the `who` column by ear (first initial, `?` or `x`), and every later run prints its score against those tags. The key is committed; the clips are not.

Until a split has scored well on a real key, treat `--refs` labels like any other split: strong but not certain.

Do not try to split a shared track by reading the text. Measured on session 27, class vocabulary plus DM turn-anchors attribute only ~20% of utterances; the rest is `"yeah"` and `"that misses"`, identical between two players. The voice is the signal, the words are not. Lines the split leaves unresolved keep the joint label, and the DM settles them at `/recap`.

## Long runs must be detached

A transcription launched with the Bash tool's background mode dies when the Claude Code process restarts, losing the whole run. For a full session, launch it detached so it survives — on Windows, `Start-Process` with `-RedirectStandardOutput`/`-RedirectStandardError` into `recaps/transcripts/.cache/<session>/` — then watch the log. The per-track JSON cache means an interrupted run resumes without redoing finished tracks.
