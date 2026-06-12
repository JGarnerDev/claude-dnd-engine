# Engine Review — Suggestions & Improvements

*Generated 2026-06-11 by a full repo audit. Findings are suggestions, not defects — the engine is in genuinely good shape. Items marked ⚠ are concrete bugs or drift; everything else is opportunity. Numbering is continuous across all sections so items can be referenced by number.*

---

## 1. Fun & Table Experience

1. **The fun infrastructure isn't firing.** 15 design preferences, 17 twists, and 21 literary devices all sit at `Deployed: —` / `Last used: —` after 13 played sessions. The tracking machinery is excellent, but nothing has ever been stamped. Root cause: most preferences target the homebrew world, the Strahd campaign is module-driven, and the "check aging at act transitions" trigger never fires because Strahd acts were never formally defined (`current_act: TBD`). Suggestions:
   - Add a one-line **drought counter** to `session-brief.ps1` / `todo-brief.ps1` output: *"0/15 preferences deployed, 0 devices stamped, 13 sessions played"* — makes the silence visible at every planning session.
   - Permit **Strahd-era seeding of homebrew preferences** explicitly (the banded-crow breadcrumb idea already hints at this). A seed planted in Barovia that pays off in the new world is a strong transition stitch.
   - Hook the aging check to something that actually happens — e.g. every 5th session via `/todo` — rather than act transitions that don't exist in this campaign.

Lit devices were a recent addition and not intended for Stradh!

2. **`table_notes` is collected but never read back.** `/recap` Phase 2 asks "what landed, what fell flat?" and stores it per session — but no command ever aggregates it. This is the highest-signal fun data in the repo, lying fallow. Suggestions:
   - `/session` Phase 1: skim the last 2–3 sessions' `table_notes` (cheap — one grep) and let it bias scene design.
   - A `/retrospective` command (or a `/threads` section) every ~5 sessions: aggregate all `table_notes` into a running "what this table loves / what falls flat" digest, optionally persisted to `meta/` as a living preference file the players never had to fill in.

I don't think we'll do retros or stuff like that as a party. I think we'll include what we like in session notes organically.

3. **Player-facing recap export.** `/recap` could end by offering a short, spoiler-free "previously on…" blurb formatted for the group chat. The two-part recap format already exists; this is one extra rendering of work already done. Cheap, high-delight.

Yes

4. **`/voice` is read-only and re-derives the same brief every time.** Offer (DM-approved) write-back of the synthesized voice brief into the NPC's file (e.g. a `## Voice` section). Repeat invocations become a single file read, and the NPC's voice stays consistent across sessions instead of being re-synthesized.

Yes

5. **Milestone awareness.** `session-brief.ps1` already computes the next session number — have it flag milestones (session 15, 20, 25; campaign anniversary; first level-up of a new tier) as a "worth celebrating at the table" line.

Yes

6. **Rumor-of-the-day.** `data/rumors/` exists as a pool but nothing surfaces it casually. A tiny `/rumor` command (or `/pitch --type rumor` pulling from the pool first) gives the DM a session-opener ritual and keeps the rumor pool circulating.

Yes

7. **Gorilla guerillas will never fire on their own.** It's a mission-scale, comedy-break preference gated behind a tone the Strahd campaign can't host. Park it explicitly as an Act 1–2 homebrew candidate during transition planning so it doesn't rust for another 20 sessions.

No

---

## 2. Honoring the Spirit of /meta

8. **`meta/difficulty.md` — Non-Combat Stakes is the highest-value blank in the repo.** The `/session` command now routes roleplay-only sessions entirely through Non-Combat Stakes, and this table plays roleplay-heavy. The combat axes are fully built; the dial that governs the sessions you actually run most is an HTML comment. (Already in `todo.md` — this is a priority elevation, not a new item.)

Ok, we will do later

9. **`meta/rewards.md` is blank at a live decision point.** Party is level 3 after 13 sessions — leveling-pace and magic-item philosophy questions are no longer hypothetical. Until filled, any treasure or level-up planning is generic D&D math, which contradicts the repo's whole premise of tailored generation.

Ok, we will do later

10. **`meta/mysteries.md` has no Strahd entries.** Both registered mysteries are homebrew-world. Sessions 1–13 generated obvious load-bearing unknowns (the Face in the Fire, Strahd's intent in retrieving Luci from death, the shadow/whisper afflictions) that are protected by nothing — `/session` and `/check` can't preserve what isn't registered. Suggest a one-time backfill pass over the 13 historian recaps with the DM.

Not needed

11. **Transition flow doesn't reference the tone reset.** `meta/worldbuilding.md`'s "What to Avoid" explicitly warns against gothic horror bleeding forward — but `.claude/commands/transition.md` never tells the executor to read `worldbuilding.md` or do a tone-reset checklist. Add a Phase (or a line in Phase 4's tone/themes question) pointing at the avoid-list so the new campaign file is written against it.

Yes

12. **Player-agency principle has no feedback loop.** `campaign-design-preferences.md` says party choices carry above-average weight — the `table_notes` aggregation (item 2) is also the cheapest way to verify the table *feels* that, rather than asserting it.

Yes

---

## 3. Commands — Utility & Token Performance

13. ⚠ **`/inventory` is the most expensive command in the repo and the only scan with no script backbone.** `data/` now holds **1,283** markdown files; the command says "scan every markdown file inside ./data" with frontmatter-only reads — that's hundreds of tool calls. `free-entities.ps1` already does 90% of this. Either extend it (add type-group counts + the Gaps section, e.g. a `-Inventory` flag) or write `inventory-brief.ps1`, then rewrite the command to be a one-script call plus formatting. Single biggest token win available.

Yes, then ensure it gets used correctly wherever and whenever appropriate

14. **`/threads` Phase 2 duplicates logic that already exists in script form.** The manual frontmatter state-scan (`missing`/`imprisoned`/`transformed`) is the same `Select-String` sweep `todo-brief.ps1` performs. Extract a small `threads-brief.ps1` (state scan + pending-seeds scan from the two meta files) so `/threads` becomes script + two semantic searches + formatting.

Yes

15. **`/pitch` anti-repetition is running blind.** `pitch-log/pitch-history.md` exists but is **empty**, while the auto-memory ("Pitch History") records archetypes already generated. Pitches predating the log were never backfilled, so the file-based forbidden-list does nothing. Backfill the file from memory once; the repo copy should be the source of truth, not session memory.

That's because I deleted the contents manually

16. **`tests/` harness has never produced a run.** Spec, rubric, personas, and fixture rules all exist; `tests/runs/` is empty. Without a baseline run log, the before/after comparison the persona harness was designed for can't happen. Run one `/session` audit with `dm-basic` to establish the baseline, and add specs for `/recap` and `/todo` — the two other highest-traffic commands.

don't worry

17. **`/recap` could offer the chat-paste recap** (see item 3) — closing the loop in the same command that already synthesizes the prose.

Yes

18. **`transition.md` Phase 4 points at a destination that doesn't exist.** It says the concluding campaign moves "to historian per the scheduler lifecycle," but there is no `historian/campaign/` folder and `meta/graph-settings.md` governs new entity folders. Decide the destination now (and whether `graph-settings.md` needs the folder registered) so the transition doesn't stall on a structural question mid-ceremony.

historian files should be populated as Kellan starts using this. Work with him to make sure they get filled with some help 

---

## 4. Scripts — Bugs & Performance

19. ⚠ **`session-brief.ps1:153` reads the wrong campaign for afflictions.** The party-affliction block uses `$campaignFiles | Select-Object -First 1` (alphabetical) instead of the `$activeCampaign` already computed for the Rest Clock. Works today only because "Curse of Strahd.md" sorts first; breaks the moment the homebrew campaign activates while both files exist. One-line fix: reuse `$activeCampaign`.

Yes

20. ⚠ **`todo-brief.ps1:39` keys the DM name on `active: true` while everything else keys `state: active`.** The campaign files carry both fields (two sources of truth), and `transition.md` Phase 4 only flips `state` — so post-transition, the DM-name lookup silently dies. Unify on `state: active` everywhere and drop (or stop trusting) the `active:` boolean.

Yes

21. **`todo-brief.ps1` spawns a nested PowerShell to run `validate.ps1`** (`powershell -NoProfile -File …`), paying full interpreter startup on every `/todo`. Run it in-process instead: `& "$PSScriptRoot\validate.ps1" -Quiet`.

Yes

22. **`Get-Frontmatter` is copy-pasted into 8 scripts.** Any frontmatter-format change (e.g. multiline values, new wikilink forms) now needs 8 synchronized edits. Extract to `scripts/lib/common.ps1` and dot-source. The `# consumers:` header idiom shows the repo already thinks about this class of drift — apply it to the parser itself.

Yes

23. **One-off scripts are crowding the live toolset.** Roughly a third of `scripts/` is completed one-time work: `fill-descriptions-chunk-a..e.py`, `seed-monsters*.ps1/py`, `seed-feats.py`, `seed-habitat-archetypes.ps1`, `backfill-core-exists.ps1`, `_fix-encoding.ps1`, `fix-ps1-encoding.py`. Move them to `scripts/archive/` so the directory listing matches the CLAUDE.md scripts table (the live contract).

Clean them

24. **`validate-refs.ps1` doesn't lint todo files** — which is how `todo.md:22`'s reference to the deleted `scripts/update-monster-fields-chunk-a.py` survived. Either add `todo*.md` to its scan set or rewrite that todo line to name a script that still exists (`fill-descriptions-chunk-a.py` appears to be the surviving pattern-donor).

Yes

---

## 5. Consistency & Drift (the repo's own stamp-pattern, audited)

25. ⚠ **The active campaign file violates the stamp pattern it pioneered.** `## Current State (after Session 10)` — latest played session is 13. Either recaps 11–13 skipped the Current State update or updated content without restamping the header. Worse: no script checks this stamp (only the Rest Clock is checked). Add a Current State staleness check to `session-brief.ps1` alongside the Rest Clock check, and reconstruct with the DM at the next `/recap`.

Yes

26. ⚠ **Rest Clock reads `(as of: never recorded)`** — it has never been initialized despite three sessions played since the mechanism landed. The scripts flag it correctly; this is just the reminder that the two-question reconstruction should actually happen at the next `/session`.

that's fine, consider us reminded

27. ⚠ **Orphan file: `session notes.md` at repo root.** It's the raw Session 13 notes (committed as "session 13"), and Session 13 is already canonized (`historian/sessions/Session 13 Dream Pastries.md`). It predates/bypassed the `recaps/inbox/` flow, so the delete-after-canonization rule never triggered. Verify nothing in it was missed during canonization, then delete — its content lives in the historian record.

you can delete it if it's ingested

28. **`scheduler/CLAUDE.md` documents a session filename pattern that's never been used.** It says `session-{nn}-{name}.md`; the actual convention (and what `/session` Phase 6 writes) is `Session NN Name.md`. Fix the doc before something trusts it.

Yes

29. **Gitignored player data exists only on this machine.** `questionnaires/*` and `pitch-log/` are ignored — filled player answers (witchweed, exotic mounts, naming sheets) have no backup. The repo treats player contributions as precious everywhere else; losing a disk loses them. Consider un-ignoring `questionnaires/answers/` (or the whole folder), or documenting an explicit backup step. If privacy is the concern, that's the same problem as the "private player→DM questionnaires" todo item — solve them together.

That's ok

---

## 6. Quick Wins (smallest effort, real payoff)

In suggested order: **19** (one-line script fix) → **20** (unify `state: active`) → **27** (delete orphan notes after cross-check) → **15** (backfill pitch history) → **28** (fix filename pattern doc) → **26** + **25** (restamp clock and Current State at next `/recap` or `/session`) → **23** (archive one-off scripts) → **16** (first baseline audit run).
