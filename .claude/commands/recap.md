---
description: "Canonize a played session: gather what happened, write the historian session record, canonize entities, update campaign state."
---

Canonize a played session. Closes the loop on the session lifecycle: gathers what actually happened, updates the session file with historian fields, moves it to `historian/sessions/`, and audits entities for canonization.

---

## Phase 1 — Identify the Played Session

First check `recaps/inbox/` for a notes file — if one exists, it is the DM's raw account of the played session and usually identifies which session it was. Read it now; it feeds Phase 2.

Check `scheduler/sessions/` for session plans with `state: draft` or `state: planned` (`/review --ready` sets `planned`, so a plan that was readied before play is `planned`).

- If exactly one exists, use it. State its name and session number.
- If multiple exist, list them and ask the DM which one was just played.
- If none exist, ask the DM to specify the session number or file name.

Read the session file fully: note `session_number`, `mission`, `locations`, `key_npcs`, `encounters`, `opening_scene`, `closing_hook`.

---

## Phase 2 — Gather What Happened

**If an inbox notes file was found in Phase 1:** mine it for all the answers below first, then ask the DM only what the notes don't answer — in one batched message. Do not re-ask anything the notes already cover.

Otherwise, ask the DM the following. Keep it conversational — rough notes are fine.

1. **Date played** — What date was the session?
2. **Recap** — What actually happened? Walk me through it. (Free-form; DM can paste notes or speak informally.)
3. **Cliffhanger** — Where did things end? What question or situation carries into next session?
4. **State changes** — Any significant PC or NPC changes? (Deaths, level-ups, new afflictions, relationship shifts, items gained or lost.) Always confirm levels explicitly — state the current party level from `uv run scripts/party-status.py` (not by opening PC files) and ask "still correct?" rather than waiting for the DM to volunteer a level-up.
5. **Rests, rounds & in-world time** — Did the party take a long rest at any point (especially before the cliffhanger)? Any short rests? Roughly how many rounds of combat were fought? Roughly how much in-world time passed this session, and what's the in-world date/time the party ends on? (Rough estimates are fine — this feeds the Rest Clock, which only needs to distinguish fresh from half-spent from running-on-fumes, and to know the in-world time for the long-rest 24-hour gate. Zero rounds is a normal answer for a roleplay-only session; the clock still gets restamped.) Any notable resource burns worth recording (big spells gone, hit dice low)?
6. **New entities** — Anything invented at the table that doesn't have a file yet? (NPCs named on the fly, locations described, items handed out.)
7. **Table reaction** — What landed? Anything that fell flat or felt off? (One line is fine — this informs future planning, not canonization.)
8. **Choices** — What did the party (or one player) decide that should matter later? Propose the list yourself from the recap and the plan's `Choice (...)` bullets, and let the DM confirm, cut or add. One line each: who chose, what, and what it set in motion. (`meta/player-agency.md` → Remember what they chose.)
9. **Lines** — Any NPC line worth keeping word for word, or an NPC who came across differently from their file? Take the inbox note's `Quotable lines` first and ask only about NPCs it misses. Rough wording is fine; mark it `(?)`. This feeds the voice-shifts step in Phase 5.
10. **Stats** — Take the inbox note's `Stats` first. Without a note, ask: who landed killing blows, crits, nat 20s or 1s, who healed, performed, punched or cast the most? Rough numbers are fine. This feeds the stats step in Phase 5 (`meta/stats.md`).
11. **Achievements** (homebrew only) — Take the inbox note's `Achievement candidates` first. Without a note, ask: what did each character do that deserves a snarky "New achievement!" card? In-fiction deeds only. This feeds the achievements step in Phase 5 (`meta/achievements.md`).
12. **Trackers** (homebrew only) — for each campaign tracker (`scheduler/campaign/_*.md` with an `(as of: Session NN)` header), ask what its `## Engine` section says `/recap` asks. Take the inbox note's `Trackers` first. Hidden DM rolls are never on a recording, so always ask for those. This feeds the tracker step in Phase 6.

Wait for the DM's response before continuing.

---

## Phase 2.5 — Spotlight Tagging Pass

Tag the session for the character-focus ledger (`meta/character-focus.md`). Work from the
Phase 2 recap; this is a quick per-scene pass (~4–8 taps across a session), not one global
question. **Skip entirely if fewer than 3 sessions including this one are played** — the
ledger is inert before cold-start clears; note that and move on.

1. **Classify + weight every beat.** Walk the recap scene by scene and tag each beat in the
   `classification: weight` form defined in `meta/schemas/session.md` → Spotlight Beats
   (`spotlight`/`shared`/`party-centric`/`world` × `touch`/`beat`/`arc`). Tag touches too —
   dropping them biases the ratio. PC names must match each PC's `name:` exactly.
2. **Shared cap.** If a beat focuses 3+ PCs individually, it isn't spotlight — flag it and
   reclassify as `party-centric` with the DM rather than writing a 3-PC `shared`.
3. **Two-PC-party tiebreak.** In a two-PC party, decide `shared` vs `party-centric` by intent:
   two individual arcs advancing = `shared`; one collective stake = `party-centric`.
4. **Attendance.** Note which PCs appear in the recap. **Never silently assume absence** — for
   any PC who doesn't appear, ask the DM "absent this session, or just quiet?" before
   excluding them from rotation. Present-but-quiet still counts as present.
5. **Hook payoff.** For any `spotlight_hooks:` entry on a PC file currently at `status: seeded`
   (set by `/session` when it planned this session around the hook), check whether its beat
   actually landed. If yes, mark it to advance `seeded → paid` in Phase 5.

Hold the tagged beat list, the attendance note, and the hooks-to-advance list for Phases 4–5.

---

## Phase 3 — Entity Audit

For each entity listed in `locations` and `key_npcs` in the session plan:

1. Check `historian/` — if it already exists there, confirm its current state is still accurate given what happened.
2. Check `data/` — if it exists there with `exists: false`, flag it for canonization.
3. If it exists in neither place, run semantic search as a fuzzy fallback — the entity may exist under a different name than the session plan used:

   ```text
   uv run scripts/semantic-search.py "<entity name and any known description>" -k 3
   ```

   Any result with score > 0.45 is a likely match — confirm with DM before assuming missing. If no match found, flag as a **missing entity** — do not silently create it.

Report findings before proceeding:

- Entities to canonize: [list]
- Entities with state changes: [list]
- Missing entities (need creation): [list]

---

## Phase 4 — Write the Historian Session Record

**Prose:** read `meta/prose-style.md` once for this recap, before the first prose is written. The historian register applies to the session record and canonized entities (Phase 5); the player-facing register applies to the slides and the blurb (Phase 8). Run its **While drafting** checklist on each before showing the DM.

Before writing, run `/check <recap summary>` to flag any historian conflicts in the DM's account. Surface CONFLICT and POSSIBLE results to the DM; do not silently canonize content that contradicts existing canon. If the DM confirms the new account supersedes old canon, note the discrepancy in `table_notes`.

**Reliability flags:** in this session record and in any historian content written during this recap (Phase 5 included), add a `> **Reliability:**` blockquote whenever:

- a detail is inferred rather than stated in the notes
- the source used a nickname or abbreviation instead of a confirmed name
- two sources conflict with each other
- the notes are ambiguous about mechanics vs. fiction

End each flag with an explicit "Confirm with DM" or "Confirm with [player name]" so it's clear who verifies it. Err on the side of flagging — unconfirmed details are cheap to mark now and expensive to untangle later.

Update the session file with the following historian fields (do not remove any existing frontmatter fields):

```yaml
exists: true
state: completed
played_date: "{date from Phase 2}"
in_world_end_date: "{in-world calendar date the session ended, e.g. 0735-11-03 — set this always}"
in_world_end_time: "{HH:MM the session ended in-world, homebrew — from the Sky Clock step; omit for Strahd}"
recap: "{synthesized from DM's notes — concise, past tense, third person}"
cliffhanger: "{from Phase 2}"
entities_canonized:
  - [[Entity Name]]   # one per entity moved to historian this session
new_entities:
  - "{description}"     # one per thing invented at the table, not yet filed
table_notes: "{what landed, what didn't — from Phase 2 question 7. Omit field if no feedback given.}"
choices:                # from Phase 2 question 8; omit if none mattered
  - "party: {what they chose} → {what it set in motion}"
  - "PC Name: {what they chose} → {what it set in motion}"
beats:                  # from Phase 2.5 tagging pass; omit if cold-start not yet cleared
  - "spotlight(PC Name): beat"
  - "party-centric: touch"
pcs_present:            # PCs at the table this session — from the Phase 2.5 attendance check
  - "PC Name"
```

**Always set `in_world_end_date`** (the in-world calendar date the session ended, from Phase 2's timing). The campaign timeline plots sessions by this field; without it the extractor pins the session to the previous session's in-world date and warns (it only falls back to the real-world `played_date` for a campaign with no in-world session dates at all). Derive it from the prior session's date plus the days elapsed this session, or from any event dated during the session. Flag to the DM if the in-world date can't be determined. For homebrew, also set `in_world_end_time`: the recap deck's sky slide (`meta/recap-slides.md`) draws the sky at that hour.

Write `beats:` as one quoted line per tagged beat in the `classification: weight` form (see
`meta/schemas/session.md` → Spotlight Beats). Write `pcs_present:` as the DM-confirmed list of
PCs who were at the table (the Phase 2.5 attendance check). Omit both fields when the Phase 2.5
pass was skipped for cold-start.

Then move the session's whole folder from `scheduler/sessions/` to `historian/sessions/` — the plan, its `_flow.md` chart, and any encounter files travel together.

---

## Phase 5 — Canonize Entities

For each entity flagged for canonization in Phase 3:

**If the entity file is in `data/` with `exists: false`:**

- Update `exists: true`
- Add `source_session: [[Session {nn}]]`
- Add `confirmed_date: "{played_date}"`
- Move the file from its `data/` path to the corresponding `historian/` path (see `meta/types.md` for the mapping)
- **Elaboration check:** if the moved entity has no `personality` or `motivation` field, offer a minimal elaboration prompt — *"[Name] just became real. Want a personality hook and motivation sketched now while it's fresh?"* If yes, draft immediately (one-pass, Approaching tier from `data/CLAUDE.md`) and write back to the historian file before continuing. Do not do this silently.

**If the entity has a state change:**

- Update the relevant field (`state`, `location`, `last_updated`, etc.) in its `historian/` file

**Level restamp (every recap, even with no level-up):** for each active PC in `historian/characters/pcs/`, set `level_confirmed: {session_number}` — updating `level` first if the DM reported a change in Phase 2. The stamp records "level verified as of session N"; skipping it is what makes levels go silently stale.

**Spotlight hook advance (from Phase 2.5):** for each hook flagged as landed, edit that PC's `spotlight_hooks:` entry from `status: seeded` to `status: paid`. Only advance hooks whose beat actually paid off this session — a seeded hook that didn't land stays `seeded` and carries forward. Do not invent or add hooks here; new hooks come only from `.claude/commands/pc-backstory.md`.

**Affinity nudges (from Phase 2 relationship shifts):** read `meta/affinity.md` once (scale, magnitudes, bands, scope). Translate this session's relationship shifts into proposed nudges and surface them as a confirm-list before writing — `subject → target, ±n, one-line reason` (e.g. `Dip → Ireena +2 — shielded her from the specter`). On DM approval, add or update the `[[Target]] (n)` entry in each **subject's** `affinity:` field, clamped. Not mirrored: write a reverse entry only if the session evidenced the target's feeling too. Propose nothing for pairs with no shift this session; never invent a number.

For each confirmed nudge, check whether it **crosses a band** (an unrecorded prior value counts as neutral). A crossing is a relationship turning point. Note every crossing and carry the list to Phase 5.5 — the beat that caused it is an automatic event-promotion candidate there.

**Voice shifts (after the affinity nudges — uses their band crossings):** read `meta/voice.md` once (layers, rules, section shape). Cover every NPC or antagonist who spoke on screen this session, plus every `key_npcs` entry that already has a `## Voice` section. For each, propose only what this session gives evidence for:

- **Lines** — up to 3 verbatim lines for `Said at the table`, from Phase 2 question 9. Never write a line nobody said
- **Now** — a change only with a cause from this session: a band crossing, a state change, a betrayal, a loss, a rescue, a choice that hit them. Show it as `old → new (S{nn}: cause)`
- **Core** — only for a **correction** (the table played them against their file) or an **arc shift** the DM calls. A now change that would break their Never line is an arc shift by definition: flag it and ask, do not write it as now
- **New voice** — an NPC who spoke and has no section: draft the core from their lines and `personality`, marked as a draft for the DM to confirm

Present one numbered item per NPC, stable numbers, so the DM can answer from a phone ("2 ok, cut 4's line"). On approval, write the `## Voice` section at the end of the body in the `meta/voice.md` shape. Set `voice:` when the core is new or changed, and log an arc shift's old core under `### Arc`. Then set `voice_confirmed: {session_number}` on **every NPC in the list, even with no change** — the restamp is what keeps `todo-brief.py` from flagging them stale. A legacy single-line `## Voice` gets an upgrade proposed in the same list. Propose nothing for an NPC with no line and no cause.

**PC arc shifts (after the voice shifts, both campaigns):** read `meta/pc-arcs.md` once (parts, shift rules). For each active PC arc in `scheduler/arcs/`, propose a shift only with a cause from this session: a choice that leaned toward growth or fall, a player saying what they want, a hook paid (Phase 5's hook advance). Number them `A1.`, `A2.`, stable: `A1. Dip — walked out of the council vote (S{nn}): Fall leans closer. Next step stays. OK?` A next-step hook paid this session always gets an item proposing a new Next step from the PC's open hooks. The Logline shifts only when the DM calls it. Never shift for want of a better idea. On approval, edit the section, keep `next_step:` word for word with the PC's hooks, and append `- S{nn} — cause — what changed` to `## Shifts`. Then set `arc_checked: {session_number}` on **every active PC arc, even with no change**, including a PC who missed the session. If no PC arcs exist yet, skip silently.

**Stats (after the voice shifts, both campaigns):** read `meta/stats.md` once (catalog, count vs sum, ledger shape). From Phase 2 question 10, present one numbered line per PC, stable numbers, catalog labels, rough sums as `~n`: `3. Iggy — heals cast 4, HP healed ~31, performances 2`. The DM answers from a phone ("3: healed 38", "ok"). A corrected sum drops the `~`; a sum the DM confirms as-is stays `~`. Leave out zeros and ids not in the catalog. On approval, append `## Session {nn}` to `historian/sessions/_stats.md` in the ledger shape. If the DM skips stats, write nothing. Then run `uv run scripts/stats-standings.py --session {nn}` and show the awards, flagging any `!` warnings.

**Reputation (after stats, homebrew):** read `meta/reputation.md` once (scoring, cap, ledger shape). From the inbox note's `### Reputation` tracker candidates and the standout moments (a ⭐ personal best, a killing blow on a named foe, a crowd that saw it), propose up to 3 deeds per PC, stable numbered: `F1.` for fame, `I1.` for infamy. Each one gives PC, what happened, the scope place, size, multipliers, level (the PC's `level` unless it changed this session), and the points worked out: `F1. Dip — felled the raider captain in the square · Ashford · notable × named-foe × witnesses · lvl 5 = 8,475`. Never invent a deed to fill a slot. The DM answers from a phone ("F1 major", "cut I2"). With the deeds, propose a **known-for** line (ten words at most) for each PC and track the new deeds change, as `K1.`, `K2.`, and show the current line it replaces. Keep a line that still fits. On approval, append `## Session {nn}` to `historian/sessions/_reputation.md` in the ledger shape, known-for lines included, then run `uv run scripts/reputation-standings.py --session {nn}`, show the totals, and flag every `!` warning. For each tier crossing, follow `scheduler/campaign/_reputation.md` (reward proposal, log, restamp). Carry approved deeds to Phase 5.5 as event candidates. When the deed is already an event, add a `Fame:` consequence to it instead. If the DM skips, write nothing.

**Fame (after stats, Strahd):** no score. From the standout moments, propose up to three prose fame beats as `F1.`, `F2.`: what happened and who would hear of it (`F1. Dip's killing blow on the drake — word reaches Vallaki?`). Nothing is fame without DM approval. Approved ones go to Phase 5.5 the same way. Propose none when nothing stood out.

**Achievements (after reputation, homebrew only):** read `meta/achievements.md` once (the bar, tallies, voice, ledger shape), then the ledger `historian/sessions/_achievements.md`, its `## Tallies` first. From Phase 2 question 11, run every candidate against **The bar** before showing it, and expect most to fail: zero or one card per PC is normal. Draft per PC as stable numbered items, `A1.`, `A2.`, grouped under the PC's name: the title in bold, then the description. Then propose tally increments as `T1.`, `T2.`, each citing the moment, and flag any tally that would reach a threshold (3, 5, 10, 20) along with the card it unlocks. Run the names check in `meta/recap-slides.md` on the draft. The DM answers from a phone ("cut A3", "A5 funnier"). On approval, update `## Tallies` in place and append `## Session {nn}` to the ledger in its shape. If the DM skips, write nothing.

**If an entity is missing (no file anywhere):**

- Do not create it silently. Flag it clearly:
  > "**[Entity Name]** was referenced in this session but has no file. Create it now? If yes, I'll read `meta/entity-creation.md` first."
- Wait for DM confirmation before creating anything.

**Improvised minor settlements & roads** (hamlets, villages, waystations, connecting tracks the party visited — usually surfacing via Phase 2's new-entities question or a travel-leg stop in the session plan):

- These follow the Settlement & Road Tiers section of `meta/settlements.md`: DM-created canon, written **directly to `historian/`** with `exists: true`, `source_session`, `confirmed_date` — no `data/` pool detour, no registry ID.
- Apply the promotion ladder before creating any road file: a road the party merely traveled stays narration in the recap; a stop on an existing route becomes a `waypoints:` line on that route; only a road with real play weight gets its own entity.
- A settlement the party only passed through without consequence can also stay as recap narration — confirm with the DM whether it earned a file.

---

## Phase 5.5 — Promote Significant Beats to Events

The home-page charts (`npm run home`) are a player/DM journal plotted from `type: event` entities. After canonizing entities, scan this session's beats for ones worth a standalone event on the timeline.

Apply the **hybrid promotion rule** (`meta/events.md` — read it once if not already in context): a beat earns its own event if **either** it changed canon (a death, pact, location lost/founded, faction shift a later session will reference) **or** it was simply memorable at the table (a great fight, betrayal, clutch reveal). Favor inclusion; low-stakes-but-fun beats ride as `importance: minor`.

- Draw candidates from the Phase 2.5 tagged beats and the Phase 2 recap. Propose them as a short list — **do not write any event file without DM confirmation.**
- **Add every approved deed (Reputation step) or fame beat (Fame step)** as a candidate. Set `participants` to the PC and the people who heard; `importance: minor` unless the DM says otherwise.
- **Add every affinity band-crossing beat from the Affinity-nudges step** as a candidate here (a relationship that tipped into a new band is a turning point worth the timeline). Set `participants` to the subject and target so it fans onto their lanes; mark `importance: minor` unless the beat is independently major. The DM may still veto — the crossing only guarantees it surfaces.
- For each confirmed beat, create a `type: event` entity per `meta/schemas/event.md` in **`historian/events/`** with `exists: true`, `campaign: {active campaign}`, `source_session: [[Session {nn}]]`, and a numeric **`timeline_date`** (from the session's `in_world_end_date`, else flag that the in-world date is unknown). Set `participants`/`relates_to` to the NPCs/factions involved — the extractor auto-fans the beat onto their Party-tab lanes; set an explicit `track:` only to override.
- Mark a beat `secret: true` (via `state: secret`) only if it's DM-only knowledge the party doesn't have.
- **Set `order` + `daypart` on every minted beat** so this session's events don't stack on one timeline point (they all share the session's `timeline_date`). `order` is 1, 2, 3… in narrative order; `daypart` is inferred from the notes, never asked of the DM, using the cue rules in `meta/events.md` → Dating events.

Skip silently if no beat clears the bar — not every session mints an event.

---

## Phase 6 — Update Campaign State

Read the active campaign file (`state: active` in `scheduler/campaign/`). Propose updates to the `## Current State` section to reflect:

- New party location
- Any active afflictions or ongoing conditions
- Any resolved or newly opened threads

**Rest Clock (every recap, never skipped):** update the `### Rest Clock` block from Phase 2's rests-and-rounds answer, then restamp the header to `(as of: Session {NN})` even if nothing changed — the stamp is what `session-brief.py` checks for staleness:

- Always update `In-world time now` to where the party ends, and recompute `Hours since last long rest` and `Long rest available` (≥24h since last + safe location + no PC at 0 HP) from it — these drive the long-rest gate in `meta/difficulty.md`
- Long rest taken → reset: new `Last long rest (in-world)` anchor, `Hours since last long rest` to 0, rounds and short rests to 0, clear notable burns
- No long rest → add this session's rounds to `Rounds of combat since`, increment `Short rests since`, append notable burns
- DM unsure → record best estimate marked `(~estimate)`; never leave the old numbers standing unstamped

**Campaign trackers (every homebrew recap, never skipped):** for each `scheduler/campaign/_*.md` tracker, apply Phase 2's tracker answers the way its `## Engine` section says, then restamp its header to `(as of: Session {NN})` even if nothing changed. A tracker whose PC missed the session still gets restamped, with a one-line `absent` entry. Name any ideas the new state makes ready; never mark one used unless it was played.

**Preference tracking:** check the session plan's DM notes for deployed or seeded items from `meta/campaign-design-preferences.md`, and for devices or twists from `meta/literary-devices.md`. Update the item's `Deployed:` line (wikilink to the session), its `Seeded:` line (wikilink + one-phrase breadcrumb note — devices and twists both seed), or a device's `Last used:` line. When a session *pays off* a seeded device, stamp `Last used:` with this session and mark the seed note paid (e.g. `→ paid off [[Session NN]]`) so `/threads` stops surfacing it. Note the scale the item was used at if it differs from the obvious one. This closes the loop `/session` opens — if it isn't done here, it never happens.

**Mystery registration:** if the session plan or the DM's notes flag a new load-bearing unknown (e.g. a "register in mysteries.md after play" note), propose the `meta/mysteries.md` entry now.

Present the proposed changes and ask for confirmation before writing.

---

## Phase 7 — Summary

**Clear the inbox first.** If Phase 1 found a notes file in `recaps/inbox/`, delete it now — its content lives in the historian record, and a file left behind makes the next `/session` and `/todo` report this session as still uncanonized. Delete only that one file, and only once Phases 4–6 are written; if the DM stopped the recap early, leave it.

**Check the links.** Run `.\scripts\validate.ps1 -Scope links -Quiet`. Report only errors in files this recap wrote or moved (a `[[link]]` broken by a rename, a canonized entity pointing at a name that has no file); errors that were already there are not this run's to fix.

Report what was done:

- Session file: moved to `historian/sessions/Session {NN} {Name}.md` (filename = exact display name, per `meta/schemas/entity.md`)
- Entities canonized: [list with paths]
- Entities with state updates: [list]
- Voices updated / restamped: [list, marking any arc shift]
- PC arcs shifted / restamped: [list of `A` items applied; "all restamped, no shifts" otherwise]
- Missing entities still needing files: [list]
- Campaign state: updated / no changes needed
- Preference `Deployed:`/`Seeded:` lines updated: [list, or none]
- Inbox notes file deleted: [yes / n/a]

If any action items remain (unconfirmed entities, meta files to update), list them explicitly.

A recap always writes indexed files (the session record, plus any canonized entities), so the semantic index is now stale. End the summary with one line: "Semantic index is now stale — run `uv run scripts/index-entities.py` when convenient." Do not rebuild it yourself.

---

## Phase 8 — Player-Facing Recap

### Recap slides (homebrew only)

For a `campaign: homebrew` session, draft its party-facing deck. Read `meta/recap-slides.md` once for deck weight, the slide order, the size limit, what each slide is built from, and what counts as party-safe. Strahd sessions skip this step.

1. **Propose the deck weight.** Gather the story-change signals already in hand: mission resolved or act advanced (Phase 6), a PC death, `choices:` that changed where the story goes (not how the party did something), level-ups and conditions (`uv run scripts/party-status.py`), Phase 5.5 events that changed canon, `arc`-weight beats (Phase 2.5). Map them to light, medium or heavy per `meta/recap-slides.md` → Deck weight and propose one line: *"Deck weight: medium — Odibli level 5; turned back for Ashford. OK?"* Ask whether any reveal was critical only when a heavy call hinges on it. The DM confirms or overrides.
2. Draft the deck to that weight's budget as a **numbered list**, one item per slide: the headline in bold, then the body. Orientation leads (Title, Last time…, Where you stand), Mysteries follows on every deck (eight party-safe questions, carried forward from the last deck's list and re-ranked; then update the answer key `scheduler/campaign/_mysteries.md` per its `## Engine` section), and Next closes. No fact on two slides. Keep the numbers stable so the DM can answer "cut 4" or "reword 6" from a phone.
3. Run the **names check** in `meta/recap-slides.md` before showing the draft, act and mission names included. The `recap:` field names people the party has only seen. Under the deck, list every proper noun you kept, for the DM to confirm, and anything you left out because you weren't sure the party knew it.
4. Apply the DM's edits and show the deck again. Repeat until the DM approves it.
5. Write `_slides.md` into the session's folder, now in `historian/sessions/`: a one-line DM note naming the deck weight, then one `##` heading per slide. No frontmatter, no `[[wikilinks]]`. Set `deck_weight:` on the session record.

If the DM declines, write nothing. The session's card simply shows no **Slides** button.

Sky, achievement, reputation and stats slides are not drafted here. The runner builds them from their ledgers and gates them (`meta/recap-slides.md` → Deck weight): sky after the Title, the rest before Next, achievements first, then reputation, then stats.

### Group-chat blurb

Then offer once:

> "Want a player-facing 'previously on…' blurb for the group chat?"

If yes, render a short message: 3–5 sentences of narrative prose in the "previously on" voice (past tense, third person), closing on the cliffhanger as a teaser. If a deck was just approved, draw from the deck only and close on its Next slide. It is already party-safe. Otherwise draw from the canonized recap. **Spoiler-safe:** include only what the players witnessed at the table — no DM-side information, no `Reliability` flags, no mechanics, no unrevealed entity names. Output as a single copy-paste block in chat; no file is written.
