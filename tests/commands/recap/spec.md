# Spec: /recap

Contract for what a correct, efficient `/recap` run looks like. The command doc (`.claude/commands/recap.md`) describes the flow; this spec defines the measurable budget and checkpoints an audit scores against. Where the two disagree, that is a finding for `gaps.md`, not a license to deviate mid-run.

`/recap` writes canon. It is the highest-stakes command in the engine: an error here becomes a fact every later session builds on. Audits weight rubric 7 (interaction economy) below correctness — a missing confirmation is worse than an extra one.

## Trigger

`/recap`, no arguments. Also offered (never auto-run) when the session-start orientation or `session-brief.py` flags notes in `recaps/inbox/` or a planned session whose date has passed.

## Required scripts (before any manual file reads they replace)

1. `scripts/party-status.py` — Phase 2 level confirmation and Phase 2.5 attendance roster. Opening PC files to read `level` before the Phase 5 restamp is a rubric-1 failure.
2. `scripts/semantic-search.py` — Phase 3 fuzzy fallback (`-k 3`) for any planned entity found in neither `historian/` nor `data/`. Declaring an entity missing without it is a finding.
3. `/check <recap summary>` — Phase 4, before the session record is written.
4. `scripts/validate.ps1 -Scope links -Quiet` — Phase 7, after all writes. Report only errors in files this run wrote; pre-existing errors are not this run's to fix.

## Read budget

- **Full-body allowed:**
  - The inbox notes file, when one exists (it replaces most Phase 2 questions)
  - The played session plan (Phase 1)
  - `meta/player-agency.md` (Phase 2 choices), `meta/character-focus.md` and `meta/schemas/session.md` → Spotlight Beats (Phase 2.5, skipped before cold-start clears), `meta/affinity.md` (Phase 5, only if relationships shifted), `meta/events.md` and `meta/schemas/event.md` (Phase 5.5, only if a beat is promoted)
  - The active campaign file (Phase 6: Current State and Rest Clock)
  - Conditional, only when triggered: `meta/types.md` (an entity moves `data/` → `historian/`), `meta/settlements.md` (improvised settlement or road), `meta/entity-creation.md` (DM approves creating a missing entity), `meta/campaign-design-preferences.md` / `meta/literary-devices.md` (the plan notes a deployed or seeded item), `meta/mysteries.md` (a new unknown is flagged)
- **Frontmatter-only:** entities named in the plan's `locations` / `key_npcs` (Phase 3 state check); PC files for the Phase 5 `level_confirmed` restamp and `spotlight_hooks` advance
- **Never read:** `spitball/` (never canon), raw transcripts in `recaps/transcripts/` (the inbox note is the digested source)
- **Hard cap:** ~30 file reads before the first write, excluding script calls. Past the cap, declare scope to the DM.
- **Meta read-once:** each `meta/` file at most once per run (rubric 5).

## Interaction checkpoints (exhaustive)

1. **Phase 1 session pick** — only if zero or several plans in `scheduler/sessions/` have `state: draft` or `planned`. One candidate: state it, no question.
2. **Phase 2 gather** — one batched message. With an inbox note, ask only what it leaves unanswered. Always includes the explicit level check ("still level N?") and a proposed `choices:` list to confirm.
3. **Phase 2.5 attendance** — any PC absent from the recap: "absent, or just quiet?" Batched into one message, and may ride with checkpoint 2's follow-up.
4. **Phase 3 entity report** — canonize / state-change / missing lists, plus confirmation of any fuzzy match scoring > 0.45.
5. **Phase 4 conflicts** — CONFLICT and POSSIBLE results from `/check`. Skipped if `/check` is clean.
6. **Phase 5 confirm-lists** — elaboration offers for newly canonized entities with no `personality`/`motivation`, missing-entity creation, affinity nudges, and whether an improvised settlement earned a file.
7. **Phase 5.5 event candidates** — skipped silently if no beat clears the bar.
8. **Phase 6 campaign state** — proposed Current State, Rest Clock and preference-line changes.
9. **Phase 8 player-facing blurb** — offered once.

Checkpoints 6–8 are adjacent confirm-lists; batching them into one message is allowed and scores better on rubric 7. Any question outside these nine is a rubric-7 finding. Any write made before its checkpoint confirms is a **fail**, regardless of whether the content was right.

## Output contract

- Session file: historian fields added (`exists: true`, `state: completed`, `played_date`, `in_world_end_date` always set, `recap`, `cliffhanger`, `entities_canonized`, `new_entities`; `table_notes`, `choices`, `beats`, `pcs_present` when they apply), no existing field removed, `> **Reliability:**` flags where details are inferred
- The whole session folder (plan, `_flow.md`, encounter files) moved from `scheduler/sessions/` to `historian/sessions/`
- Canonized entities moved `data/` → `historian/` with `exists: true`, `source_session`, `confirmed_date`, and the active campaign tag
- Every active PC restamped `level_confirmed: {session_number}`, even with no level-up
- Rest Clock block restamped `(as of: Session {NN})`, even if nothing changed
- Event files in `historian/events/` only for DM-confirmed beats, each with `timeline_date`, `order` and `daypart`
- Inbox notes file deleted, only after Phases 4–6 are written
- Phase 7 summary in chat, ending with the one-line index-stale note
- Player-facing blurb only on a yes: 3–5 sentences, spoiler-safe, no file written

## Out of scope

- No semantic index rebuild — the summary prompts for it
- No spitball reads or writes
- No canonizing from a raw transcript — only from the inbox note or the DM's account
- No new `spotlight_hooks` (those come from `/pc-backstory`); only `seeded → paid` advances
- No entity created without explicit DM confirmation (free entity rule)
- No scheduler edits beyond moving the played session's folder and the campaign file's Current State / Rest Clock
- No `campaign: strahd` tag on homebrew canon, or vice versa
