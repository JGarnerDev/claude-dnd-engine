---
description: "Polish a session plan before it runs: fill thin scenes, make lines plain and cued, keep names and cuts consistent, list new canon, check for real choices, check prose against the anti-slop guide."
argument-hint: "[session] [--ready]"
---

Review a session plan before it runs: fill what is thin, make lines plain and cued, keep names and cuts consistent, list the new canon the plan sets, and make sure the party has real choices to make.

**Arguments:**

- `[session]` — session number or folder name (default: the newest plan in `scheduler/sessions/` with `state: draft` or `planned`)
- `--ready` — after the review is applied, set the plan to `state: planned`

---

## Behavior

`/session` builds a plan; `/review` polishes one that already exists. Run it before marking a draft ready, after a round of DM edits, or whenever lines read vague at the table.

Two modes:

- **Called by `/session` Phase 6** (plan being written for the first time): run the passes and apply them directly. No findings list. The DM already approved the spine, so never add a beat in this mode: a new beat a pass wants, such as a Pass 5 choice, goes back to `/session` as a proposed spine change.
- **Run by the DM** (standalone): run the passes, present the findings as a numbered list in plain language, and apply what the DM approves ("all" is a fine answer). Keep the numbers stable across follow-up turns, so the DM can answer by number from a phone.

Read once, at the start: the plan file, its `_flow.md` if present, `meta/player-agency.md` (for Pass 5), `meta/prose-style.md` (for Pass 1's additions and Pass 6), the files of every NPC who speaks and every location a scene is set in (1 hop, frontmatter first), and the PC arc of every PC present (`scheduler/arcs/`, frontmatter plus Growth / Fall, for Pass 5). Do not re-read the plan between passes.

---

## Pass 1 — Description & Dialogue

A plan that has rules but no voice leaves the DM improvising cold. Walk every scene and every `####` node and fill what is thin. **Everything added is guidance, not script.** The DM improvises from it. Say so once, at the top of `## Scenes`.

Look for, and fill:

- **Scenes the players must choose from, with no picture.** If a roll, stance or fork depends on what the party can see, give a short `> *"..."*` read-aloud first (3–5 sentences). Read-aloud boxes only when `depth: narrated`
- **NPCs with a voice note but no lines.** Give 2–4 sample lines per speaking NPC, each in their voice from the NPC Quick-Reference: the first line they say, plus one per likely player push ("who are you", "why me", a refusal)
- **Branch outcomes with no response.** Every success, failure or refusal node gets the NPC's reaction in a line
- **Discoveries with no sensory detail:** an item's first touch, what a successful Perception or Read roll notices (offer 3–5 options), a creature hidden for a blindsight or Perception check. Food and drink the party will consume get a look, a taste and any catch
- **Names planted with no delivery.** For each thread seed, say who says it and how (secondhand description, a silence, a gesture) and where to stop
- **Combatants with no visible kit.** Every combat-capable enemy and NPC gets a `Kit (player-facing):` line under its entry: one italic sentence of the armour and weapons the party can see, matching the stat block, with no name in it (see `/session` Phase 6, Encounters)
- **Mid-fight beats:** a few flat lines for the enemies, a morale-break line, and what a bound or sidelined NPC does while the party fights
- **Contingencies whose tone changes** (a colder NPC, a worse deal). Give one sample line for the changed tone

Rules:

- Ground every voice in the entity's file (`personality`, `description`, `voice`, the Quick-Reference). Never invent a look or a voice that the file contradicts. Where the file has a `## Voice` section, sample lines keep its core (Signature, Never) and play its now lines (`meta/voice.md`)
- **Plain over clever.** Each line states its point outright, so the DM gets it on a cold read at the table. No subtext to decode, no wordplay that needs explaining. If a line needs a gloss, rewrite the line rather than adding the gloss. The DM riffs from it anyway
- **Every line has a cue.** Note what in the scene prompts it: something the NPC sees, a question, an event. A character tangent needs a concrete object or moment to set it off, ideally drawn from the location's file, never a musing out of nowhere
- **Leave unset canon unset.** Numbers, names and facts that canon has not fixed go in as backticked placeholders (`` `<a big number>` ``) for the DM to set at the table and `/recap` to record. When the DM asks for the detail instead, write it and log it in Pass 4
- Respect the plan's own limits: do not narrate a PC's inner experience, do not name what a scene says stays unnamed, and do not front-load a feud past its stated budget
- Add under the existing node headings, so the session runner shows each addition on the right step. Never rename or reorder nodes
- **Check each scene header** (`/session` Phase 6): Summary, Where, Cast, Enemies, DCs, Time and Trigger are present. Every DC in the scene's nodes is also listed in DCs, and every Enemies entry matches a `## Combatants` stat block. Add or fix what's missing. Move provenance (`(Jeff, <date>)`, `Engine, …; committed …`) out of scene prose and into the Engine notes
- **Check the cues** (`/session` Phase 6 → Say when things happen): a beat that fires on a condition opens with a `When:` line, an enemy who joins mid-fight carries `arrives round N` on its Enemies entry, an HP threshold in a Watch item names the enemy and gives the number in HP, and a fight whose combat beats don't bracket it carries `Combat starts:` / `Combat ends:` markers. Add what's missing
- Skip anything already covered. A node with a working read-aloud or lines needs nothing

---

## Pass 2 — Names & People

For every named person the plan introduces who has no entity file:

- **No collisions.** Check the name against `historian/` and `data/` (`uv run scripts/entity-graph.py --name "<name>"` or a grep). Avoid surnames already in use, so the table never hears two Harrows
- **Free entities are a choice, not a filler.** If a `data/` entity would fit the role, name it to the DM as an option rather than pulling it in silently (`data/CLAUDE.md`)
- **Introduce once, at first appearance.** Every character the party meets has an `Introduce:` block (Look, Sound, Impression) on the node where they first appear in the plan's running order (`/session` Phase 6, Introduce). Write missing ones from the entity file, the cast list and the combatant Kit lines; move any that sit on a later node. Keep Impression to what the party can observe. Later mentions use the name only
- **Every token has a cue.** Everyone who gets a token (`tokens.txt`, or anyone in NPCs present) is put on a map by a `Tokens:` bullet on the node where they arrive, naming the map and roughly where, and taken off by one where they leave (`/session` Phase 6, Tokens). Add missing cues on the node itself, not in a separate list
- **Every private moment is ready to send.** Any secret roll, vision, whisper, passive check or note to one player has a `Private (<PC>):` block (`/session` Phase 6, Private) with a complete message for every outcome. Write missing ones from the beat. Split stacked bands into messages that each stand alone, and move DM notes out of the messages into the beat
- **Everyone has a real name.** Every person or named animal the plan puts in front of the party has one, walk-ons included (`/session` Phase 6, NPCs present). Backfill missing ones in the cast list or the scene's NPCs-present line, and leave the narration alone: "a villager" and "someone mutters" stay as written, so who carries a line does not change. List the names you added in Pass 4
- **Every combatant has a party-facing label.** Each one gets a `Label (party-facing):` line next to its `Kit (player-facing):` line (`/session` Phase 6, Encounters). The label names a job or a look, never a stat block, a bare weapon or a name the party has not learned. It is unique within its encounter, and only true lookalikes are numbered. The Combatants at-a-glance list leads with it. If the session has a `tokens.txt` or battlemap layouts, run `uv run scripts/label-check.py --session {NN}`: its roles are the labels in lowercase with hyphens, and layout token lines lead with the label. Fix what it lists in the same pass, in the plan or in the file that drifted

---

## Pass 3 — Cuts & Renames

When a node is removed or renamed (in this review or in the DM's edits since the last one), sweep everything that names it:

- `_flow.md`: the node line, every edge through it (reconnect its neighbours), and its `class` line
- The plan's own references: Engine notes (spotlight lines especially), frontmatter summaries (`threads_planned`, `description` and similar), and later nodes that call back to it
- If a cut removes a PC's spotlight beat, say so in the findings. The spotlight balance may need a replacement
- `spitball/` files that mention the node are not canon; leave them, and mention them only once

---

## Pass 4 — New Canon

List every fact the plan sets that canon has not: a fruit, a price, a new townsperson, an object's history. Write the list into the plan's `## Engine notes` under **For `/recap`**, as a bullet named **New canon if played**, so `/recap` knows what to confirm. Refresh it on each review; drop anything the plan no longer contains.

---

## Pass 5 — Choices

The party should feel they steer the story, not ride it. Check the plan against
`meta/player-agency.md`:

- **Count the real choices.** Party and character choices, each meeting that file's four-part
  test. Is there about two or three party choices and one character choice, and does at least one
  scene visibly pay off a choice from an earlier session?
- **Look for the warning signs** listed under Railroad warning signs: a run of reaction-only
  scenes, a chain of skill checks with nothing to decide, a guaranteed outcome with no
  counterplay, failure that costs nothing, a stack of gifts, steering text in the plan
- **Propose a fix for each sign found:** a small choice with a cost, added around the beat. Never
  reopen a DM-committed (`[x]`) beat. New choice beats go in as draft: a `[-]` node in
  `_flow.md` (a diamond if it's a real fork), dated "draft, engine `<date>`" in the plan
- **Check each present PC's arc** (`meta/pc-arcs.md` → Touching a PC arc). A present PC whose
  PC arc nothing in the plan touches gets a note and one fix: a one-line beat on their
  `next_step:` hook, or a `Choice (<PC>):` aimed at their growth or fall, added as draft like any
  new choice. A note, never a block; skip it when the spotlight trend says lean agnostic. A
  `Choice (<PC>):` that ignores an existing PC arc gets the same note
- **Mark what's there.** Start every choice bullet with `Choice (party):` or
  `Choice (<PC name>):`, and keep the **Choices** bullet in `## Engine notes` up to date
- A plan that already meets the bar needs nothing. Don't add forks for their own sake

---

## Pass 6 — Prose

Check the plan's prose against `meta/prose-style.md`, after Pass 1 so its additions are checked too.

- **What to check:** every read-aloud box, every NPC line, every `Introduce:` block, every
  `Private` message, every `Kit (player-facing):` line, and the Closing. DM-facing notes get the plain-and-scannable
  register only; don't polish rules text
- **Read each one, don't grep.** A search for stock phrases is a fine first sweep, but the pass is
  reading every item against the tell lists, the structural tells (including the same picture
  twice in one scene) and the audience calibration for read-aloud
- **Run each candidate through the validation questions.** Keep what survives, and anything the
  What to keep list protects: an NPC's `## Voice` core, a deliberate clue, a running joke
- **Never touch** lines quoted from the table (`Said at the table`) or the plan's fixed facts.
  A DM's name and date (`Jeff, <date>`) marks a **decision**, not wording: rewrite the prose
  around a decision freely, as long as the decision still stands. Wording is protected only where
  the plan says it is locked (for example "verbatim" or "word for word")
- **Findings** follow the format in `meta/prose-style.md` → Review findings: node, quoted text,
  the tell, the full rewrite. List what you checked and kept on purpose once, briefly, with why
- Called by `/session`: apply the rewrites directly, except to committed wording

---

## Close

1. Confirm the plan still parses: `uv run scripts/session-cards.py --session {NN}`
2. If `_flow.md` exists: `uv run scripts/flow-status.py --set "<session folder>" --quiet`. Report only problems this review caused or touched
3. With `--ready`: set `state: planned` in the plan's frontmatter, then run `uv run scripts/prep-status.py --session {NN}` for what is still left before game night (maps, tokens, draft beats, hand-kept tasks)
4. In chat, list what changed, grouped by scene, plus any placeholders the DM must set, the new-canon list, the choice count, and the Pass 6 result (prose findings, and what was kept on purpose). With `--ready`, add the prep-status TODO lines after them. Plain language, numbered. Do not commit
