# Changelog

All notable engine changes are recorded here. This file tracks the **engine** — commands, scripts, schemas, meta rules, the charting app, and structural campaign changes (new acts, campaign transitions, canon retcons). Routine campaign content (new entities, normal session canonization) is **not** logged here; it lives in git history and the historian.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning rules live in [`meta/versioning.md`](./meta/versioning.md).

The version in [`VERSION`](./VERSION) always matches the top entry below.

## [0.64.0] — 2026-11-12

### Added

- **Cards are artifacts too** (root `CLAUDE.md` → Working Rules; `meta/loot-options/README.md` → Item cards). Every handout card (item cards, title cards, any HTML page for the table) is written as a repo file and published as an artifact in the same turn, and edits republish to the same URL. A card built before its session is planned sits beside the item file and moves to that session's `handouts/` later.

### Changed

- **Non-owner commits go through a PR.** The Git working rule now sends anyone but the repo owner to a branch and `gh pr create` into `master`; a repo ruleset blocks their direct pushes, and the owner approves merges. The owner still commits straight to `master`.

## [0.63.0] — 2026-11-11

### Added

- **DM rotation and `/handover`.** Handing a world to a new DM is now its own flow, separate from a season swap (`/transition`): set the new `dm:` (or a new campaign file, the old one `on-hiatus`), step the incoming DM's PC out, choose which DM-only truths pass on or are held back, re-own the dashboard, and write the incoming DM a one-page `scheduler/campaign/_handover.md`. Rules in `meta/dm-rotation.md`; root `CLAUDE.md` → DM Rotation. `/transition` hands off to it when a world's next DM differs.
- **`scripts/handover-brief.py`** gathers the handover's sources: campaign and DM, campaign-file sections, PCs not active, trackers, the mysteries answer key (held-back entries marked), PC arcs, open threads, and dashboard items naming the outgoing DM (`tests/scripts/test_handover_brief.py`).
- **PC state `away`** (`meta/schemas/character-pc.md`): out of the story for a stretch and returning, usually while their player DMs. Briefs and spotlight skip the PC; the PC ARCS block lists its arc as paused.
- **The DM in the briefs.** The session-start orientation and `session-brief.py` print `DM: <name> (<campaign>)` from the active campaign's `dm:` (new `get_active_campaign` in `scripts/lib/common.py`), now documented in `meta/schemas/campaign.md` as the only record of who the DM is.

### Changed

- Role wording: `meta/worldbuilding-approach.md` and `maps/battlemaps/CLAUDE.md` say "the DM" instead of naming Kellan or Jeff. `/todo` flags a dashboard whose Scope line still names the previous DM.

### Fixed

- `scripts/gen-tiles.py` finds `maps/world/` from its own location instead of a hardcoded path under `C:\Users\Jeff`, so it runs on any machine.

## [0.62.0] — 2026-11-11

### Added

- **Working Rules** in root `CLAUDE.md`: commit only on go-ahead and straight to `master`; one question per message when the DM must answer (overrides any "batch" wording in command files); hidden rolls through `scripts/roll.py`; reference docs as repo files; lean working docs; reliability flags. Moved from Jeff's local Claude memory so the next DM's Claude has them.
- **Know who you're working with** (root `CLAUDE.md`): read the person's `meta/players/<name>.md` → `## Working with` section, and keep DM-only material from a player who isn't the active DM. `player-template.md` gains that section; Jeff's is filled, Ben's is todo 98.
- Roll20 character sheets ingest without a confirm diff (`/pc-backstory` → Character Sheets); renders are layout references only (`maps/battlemaps/CLAUDE.md`); blank questionnaire answers stay deliberately vague (`/entity-questionnaire`); unclear transcript stats get best guesses (`meta/stats.md`); the pitch log is never backfilled (`/pitch`).

### Changed

- Root `CLAUDE.md` Roles: Kellan DMs Strahd; the homebrew DM rotates (Jeff for Redwater, Ben next), read from the active campaign file's `dm:` field.

## [0.61.0] — 2026-11-11

### Changed

- **Mysteries slide renamed Mysteries & Loose Ends.** New decks write `## Mysteries & Loose Ends`; the slide also carries loose ends the party knows are hanging, not only questions. The runner still reads an older deck's `## Mysteries` (`app/pages/home/session/mysteries.ts`, `meta/recap-slides.md`, `/recap`, `scheduler/campaign/_mysteries.md`). Session 33's deck renamed.

## [0.60.0] — 2026-11-11

### Added

- **PC arcs.** Each PC can have a provisional direction in `scheduler/arcs/{PC} PC Arc.md`: a plain-language logline, growth and fall, the one or two `spotlight_hooks:` to seed next, a pointer to what the player wants, a someday line, and a log of shifts. DM-facing, no campaign tag, so both seasons share them. New type `pc-arc` (`meta/schemas/pc-arc.md`, `meta/types.md`, `meta/tags.md`, graph colors), rules in `meta/pc-arcs.md`, root `CLAUDE.md` → PC Arcs. Always written "PC arc", since "arc" already means four other things.
- **PC ARCS block** in `scripts/spotlight-balance.py`, so it shows in `session-brief.py` and `todo-brief.py`: each PC's `arc_checked` stamp and next-step hooks with their status, flagging a stale stamp, a next-step hook already paid or not found, and a PC with no PC arc (`tests/scripts/test_pc_arcs.py`).

### Changed

- `/session` reaches for the overdue PC's next-step hooks first, and aims `Choice (<PC>):` at that PC's growth or fall (`meta/player-agency.md`).
- `/review` Pass 5 notes a present PC whose PC arc nothing in the plan touches. A note, never a block.
- `/recap` proposes numbered PC arc shifts after the voice step, and restamps `arc_checked` on every active PC arc each session, both campaigns.
- `/todo` translates the `PC ARC:` flags; `meta/character-focus.md` and `scheduler/CLAUDE.md` point at the new layer (PC arcs never move to `historian/`).

## [0.59.0] — 2026-11-11

### Added

- **Enemy dice rollers.** In the session runner's enemy rows and stat blocks, to-hit bonuses ("+4 to hit", "beak +6, 1d8+4"), damage dice ("1d6+2", Sneak Attack's "+2d6"), skills and abilities ("Perception +5", "WIS +3") and save notes ("(it has +3)") are click-to-roll. Shift rolls with advantage (a crit on damage), Alt with disadvantage. Results land in a roll log under the Enemies heading with the dice shown; natural 20s and 1s are colored; **Clear rolls** empties it. Rolling never opens the stat block (`app/pages/home/session/dice.ts`, `scene.ts`, `scene-head.ts`, `session.css`).

## [0.58.0] — 2026-11-11

### Added

- **Carried-over enemy HP.** A plan's stat line can write known HP as `HP 10/27` (current/max) when a fight spans sessions. The runner starts that enemy at 10, and **Reset HP** returns it to 10, not full (`app/pages/home/session/combatants.ts`, `scene-head.ts`, `scene.ts`). Session 34's Tally-man, Brask and Ilsa Hask carry their session 33 damage.
- **Enemy HP rule** (`CLAUDE.md` → Enemy HP): HP is noted the moment it is given, somewhere a misclick can't erase; in chat, mid-session damage gets a running tally per enemy.

## [0.57.0] — 2026-11-11

### Added

- **Sky slide: time since last session.** A short line above the date card says how much in-world time passed since the previous dated homebrew session ended ("2 days, 14 hours since last session"), in hours, days, months or years. Hidden when there is no earlier session (`app/pages/home/session/sky.ts`, `sky-words.ts`, `sky.css`; `meta/recap-slides.md`).

### Changed

- **Closing slide renamed Heading → Next.** The last slide of a recap deck is now `## Next` (`meta/recap-slides.md`, `/recap`, `meta/stats.md`). Sessions 32 and 33 decks updated.

## [0.56.0] — 2026-11-10

### Added

- **Enemy HP tracker in the session runner.** Each enemy row in a scene's Enemies box carries a current/max HP box: type `12` or `-12` for damage, `+5` to heal, `=40` to set, Enter applies. At 0 the row dims and strikes through. HP is kept per enemy entry (two Thugs track separately), survives a page reload, and clears on **Reset HP** or **Restart** (`app/pages/home/session/combatants.ts`, `scene.ts`, `store.ts`).
- **Difficulty: area damage per body, and round 0** (`meta/difficulty.md` → Axis 2). Party damage now counts each area spell against every enemy it reaches in the plan's own positions, and takes the party's opener (readied actions, surprise, a planned set piece) off monster HP before RTC. A fight meant to sting wants RTC 3+ *after* round 0. Levers for a short RTC are listed. Party Profile's power level is filled: plays above the sheet. `/session`'s encounter step points at both.

### Fixed

- **Runner enemy rows showed only the first attack.** The compact row now lists every attack line in the stat block: each weapon, Multiattack, dice features (Sneak Attack, Marked Quarry), save spells (Sacred Flame) and reactions (Parry). `StatBlock.attack` became `attacks: string[]`, plus `hp`.

## [0.55.0] — 2026-11-08

### Added

- **Mysteries slide on every recap deck** (`meta/recap-slides.md` → Mysteries slide). Eight ranked, party-safe questions about the world, the NPCs and the mission, right after Where you stand. It always shows, like the sky slide. The list carries forward deck to deck: answered questions drop off, new ones join, and questions past eight wait in reserve (the runner shows the top eight). The runner draws them as a numbered two-column grid of cards (`app/pages/home/session/mysteries.ts`).
- **Mystery answer key** (`scheduler/campaign/_mysteries.md`), a DM-only campaign tracker: one `###` answer per question, tagged Canon, Planned or Open. `session-cards.py` emits it as `mysteries`, and the runner sidebar shows a **Mysteries** group whose answers are searchable ("myst…" lists them all). `/recap` Phase 8 keeps it in step with the slide.
- **Cute shorthand** tell in `meta/prose-style.md`, and slide Voice rule 5, **Say what happened**: recaps state who did what and what came of it, not a quirky stand-in ("saved the hearth with a paper airplane").

### Changed

- **Deck weight: choices.** Only a choice that changes where the story goes (a new destination or goal, an ally or enemy made or lost) makes a deck medium. Choices about how the party does something stay light.
- Session 32's deck rebuilt as a light deck (Title, Last time…, Where you stand, Mysteries, Heading); `deck_weight: light` set.

## [0.54.0] — 2026-11-08

### Added

- **Deck weight for recap decks** (`meta/recap-slides.md` → Deck weight). Each homebrew deck is `light`, `medium` or `heavy`, sized by how much the session changed the story: heavy for a mission resolved, an act advanced, a death or a critical reveal; medium for a choice with consequences, a level-up, a lasting condition, a canon-changing event or an `arc`-weight beat; light otherwise. `/recap` Phase 8 proposes the weight with its signals; the DM confirms or overrides. Stored as `deck_weight:` on the session record (missing = heavy).
- **Orientation-first slide order.** Every deck opens Title → Sky → **Last time…** → **Where you stand** (story position + whereabouts) and closes on **Heading** (what the party means to do next), replacing "Previously on…" / "Next time…". Scenes, Choices, The party and a heavy-only **What changed** slide fit a per-weight budget (light 4–5, medium 5–7, heavy 7–10). No fact on two slides. Act and mission names pass the names check.
- `scripts/lib/stats.py` returns `notable` (personal bests over a real earlier mark, new season leaders) and `firstOfSeason`; `session-cards.py` adds `deckWeight` per previous session.

### Changed

- **Generated slides show only on change.** Reputation shows only PCs who gained or tiered up, and no slide when nobody did. Stats show the full honors + standings only on a heavy deck or a season opener; otherwise one compact **Worth noting** slide, or none. The sky slide always shows. Older decks (no `deck_weight:`) render as before.

## [0.53.0] — 2026-11-08

### Added

- **Aethryn calendar (canon).** Miguel's timekeeping system, built on Paul's Whatwill/Astra lore and ratified by Jeff: a 24-hour day and 360-day year counted from the Astra impact (year 0, present **6743**); Showerings (about weekly, heralded by a Kerning) and Crawls (months ended by a major landing) that are recorded, never forecast; two suns whose 18-day swing shrinks true night from 12 hours to none; Fida, the moon the impact broke (29.5-day phases, flavour only); Astra on a thousand-year slingshot orbit, the Seventh Glistening due in 7000. Canon in `data/lore/calendar.md`; machine values in `meta/calendar-homebrew.md` (12 positional 30-day blocks, I–XII, no weekdays).
- **The Sky Clock** (`scheduler/campaign/_sky-clock.md`), a campaign tracker holding the running date, the Crawl tally, the next Kerning (rolled `1d6+4`) and a per-session log. `/transcript`, `/recap` and `/session` follow its `## Engine` section; no command edits.
- **`scripts/sky.py`** (maths in `scripts/lib/sky.py`): a date's day of year, sun phase, hours of true dark, Fida's phase, Astra's place, and with `--crawl-start` the day of the Crawl; `--days n` lists the coming nights.
- **Sky slide in the recap deck**, right after the Title (homebrew only): an old ring plate with Aethryn at the centre and each body where it stood when the session ended (the gold sun's angle is the hour, the red sun trails by the phase, Fida opposite at full, Astra on its ellipse, a dial on the day of the year), in a small card with the year, years since the last Glistening, Crawl, hour, tonight's dark, Fida's phase in Earth moon terms, and Astra's return (likened to a comet). The slide has no headline, so the plate takes the whole screen; the new `Slide.bare` flag drops the headline for any generated slide. The rings ink in and the bodies sweep from last session's sky. `app/pages/home/session/sky.ts`, `sky-plate.ts`, `sky-geometry.ts`, `sky-words.ts`; `session-cards.py` adds `sky` per previous session.
- **Optional `in_world_end_time: "HH:MM"`** on homebrew sessions, set by `/recap`; the sky slide draws that hour.
- **`historian/resources/`** now holds canon resources (Whatwill first).
- **`scripts/roll.py`** (shipped in 9470d9b, unbumped until now): hidden DM dice rolls, `NdM±K`, `adv`/`dis`, labels. The Citadel and Sky Clocks use it.

### Changed

- **Retcon: Aethryn's year count.** The present is **6743** counted from the Astra impact, replacing **1487** with the impact at −5256. The Astra Collision is year `0`, the Dawn of Whatwill year `1`, and the Ashford events and Sessions 29–32 now carry real days (`6743-05-20` / `-21`) instead of year-only `1487`. Don't plan from the old count.
- **Canonized:** `The Astra Collision` (→ `historian/events/`, now also broke the moon), `Astra` (→ `historian/locations/regions/`, slingshot orbit added) and `Whatwill` (→ `historian/resources/`). Whatwill's vocabulary wins: Showering = the weekly strike, Crawl = the month, Opticon = a new Islift.
- `meta/events.md`: deep-time events date from the impact epoch (`6743 − N` years ago).

### Removed

- `data/lore/calendar-proposal.md` (its Keening/decadal-Showering vocabulary, named weekdays and months, and the suns Aurel/Veska and moons Maru/Lethe/Ossin are overruled). Its fallibility hooks and cultural lenses were kept as a spitball.

## [0.52.0] — 2026-11-03

### Added

- **Reputation: known-for lines.** Each PC can carry one line per track, ten words at most, on what they're known for (`- known · fame: …` in `historian/sessions/_reputation.md`). The latest one carries forward. The recap slide shows it under the PC's scores, and `/recap` proposes rewrites (`K1.`) alongside new deeds. `reputation-standings.py` prints it and warns over ten words; `--json` gains `known` per PC. Backfilled for Dip, Halsby, Luci and Iggy.

### Changed

- **Reputation slide layout:** PC cards now sit two to a row, with the name on the left and each track's score stacked over its known-for line, so a full party fits on one screen without scrolling.

## [0.51.0] — 2026-11-03

### Added

- **Reputation: scored fame and infamy (homebrew).** Each PC has two up-only tracks, fame and infamy, built from DM-approved **deeds**: `size base × level² × multipliers` (named foe, witnesses, style, underdog). The numbers are big and odd on purpose, climbing past a million by level 20. Each PC has a world score plus local scores that roll up through `global_location:` (½ per step). There are 10 named tiers per track (Unknown → Legendary, Unremarked → Infamous), and party fame is the roster average. Rules and catalog: `meta/reputation.md`. Ledger: `historian/sessions/_reputation.md`.
- **Reputation slide in the recap deck**, between the achievement and stats slides: party fame, each PC's scores, tiers and gains, last session's top three deeds, and a banner on a tier-up. `app/pages/home/session/reputation.ts`.
- **DM-only tier rewards.** The tracker `scheduler/campaign/_reputation.md` holds a reward kind per tier (world and local, fame and infamy), the rewards given (`unspent`/`spent`) and current tiers. Its `## Engine` section has `/transcript` mine deed candidates and `/session` surface unspent rewards.
- **`scripts/reputation-standings.py`** (logic in `scripts/lib/reputation.py`): one session's scores, gains, top deeds, world and local tier crossings, and warnings (points that don't match the formula, unknown scope, non-homebrew sessions). `--json`. Tests in `tests/scripts/test_reputation.py`.

### Changed

- **`/recap` Fame step** is now a **Reputation** step in homebrew: up to 3 deeds per PC (`F1.` fame, `I1.` infamy) with the points worked out, written to the ledger on approval, and a reward proposed for each tier crossing. Strahd keeps the prose-only fame beat.
- Backfilled Sessions 29–31: six deeds. Dip and Halsby reach *Noticed*.

## [0.50.0] — 2026-10-27

### Added

- **`/transcript` resolves before it asks.** Before marking an item `(??)`, Phase 3 now checks the session plan (the beat, its `Private (<PC>):` outcome bands, its roster and rules), the previous session's historian record, and the files and trackers of the PCs in the moment, and writes the best reading as `(?)` with its source. What was said at the table outranks the plan: a divergence is recorded, not asked about, unless it has a mechanical knock-on (a long rest the later fights weren't sized for). Prompted by Session 31, where four of nine DM questions were answerable from files the engine already had.
- **Recap slides: tall slides auto-scroll.** A slide taller than the screen (the standings, a long achievements list) now creeps down, holds at the bottom, glides back to the top and repeats while it is on screen. The mouse wheel scrolls it from anywhere on the slide; the loop picks up again three seconds after a manual scroll, and holds while the pointer is on anything with a tooltip (the hall-of-fame chips). Off under reduced motion. The scrollbar is now a faint hint. `stepScroll` in `app/pages/home/session/slides.ts`.

## [0.49.0] — 2026-10-27

### Added

- **Timeline: the party's lived time, one ruler row per world.** Both views now run on the party's own lived time instead of one shared year axis, which had put Strahd (Barovian 735) and Aethryn (1487) about 750 meaningless years apart. Each world draws its own ruler row in its own calendar across the full width, so any moment reads in either world's dates (Barovia's November 735 sits over Aethryn's December 1486). The worlds are synced at the crossings: the first campaign played is the reference, and at each swap the new world's first session lands the day after the last session in the world just left. One sync per world, since a day passes at the same rate in both. The selected world (World view) or the active one (Campaign view) takes the row nearest the axis. The other rows are labels in their own colour, named by a legend under the World view and in the Campaign view's gutter. Every stretch on a multi-world axis says its year, and labels that would overlap are dropped. New module: `app/components/charts/_common/helpers/segments.ts`.
- **Timeline: dead stretches are squeezed into a labelled break**, in both views. A stretch counts as dead when it is at least 10 years long and at least half of what is left of the span. Aethryn's 6,742 years between the Dawn of Whatwill and Ashford become one "6,742 years" marker. The 14-month lull in Strahd stays as it is. Session bands stop at a break instead of reaching across it.
- **Per-world calendars.** `meta/calendar-<slug>.md` overrides the shared calendar for one campaign (`get_calendar(root, campaign)`). `timeline-data.py` sends it as `campaigns[].calendar`. Contract: `meta/calendar-template.md` → One calendar per world.
- `timeline-data.py` session beats carry `sessionNumber` (play order, which the sync reads).

### Fixed

- **Negative (pre-epoch) years crashed the timeline scripts.** `timeline-data.py` and the date helpers in `scripts/lib/common.py` split dates on `-`, so `-5256` broke apart. A shared `split_date` helper now reads a leading minus as part of the year, as the date contract always allowed.

## [0.48.0] — 2026-10-27

### Added

- **Private moments, ready to send.** A plan now writes the message for anything one player gets privately (a secret roll, a vision, a whisper, a note) as a `- **Private (<PC>):**` block: the trigger, then one nested bullet per outcome (`**Ask:**`, each roll band, each choice), and each outcome is a complete message that stands on its own. The session runner shows the block at the top of the open step, with a Copy button on each outcome that copies clean text (names for links, no markdown). Rules: `/session` Phase 6 → Private; `/review` Pass 2 fills in missing ones and Pass 6 checks their prose; `meta/prose-style.md` has the register. Session 31's `S2_DIP` is the first one.

### Fixed

- **Session runner: "Cut to" no longer jumps past the beat the arrow points at.** The scene cut was offered first (Enter, →, Space) whenever a card's arrows left its scene, even when the arrow ran back into an earlier scene or straight into the scene being cut to. In Session 31 that skipped chase stage 4 (`S2_APPROACH`) after the fork fight and landed on the optional scouting beat. The cut now appears only when the arrows would really skip that scene; Session 29's parallel-scene cut (Halsby's intro) still works.

## [0.47.0] — 2026-10-26

### Added

- **Voice-reference splits for shared microphones.** `diarize-track.py --refs "<sessions>"` matches each line on a shared track to voiceprints from the players' own solo tracks in earlier sessions, instead of clustering and then guessing names from DM name-calls. Handles come from those sessions' `speakers.tsv`; `--handles` overrides. Short lines are estimated from a padded short crop plus nearby confident lines, and marked as estimates. Clustering stays the default when `--refs` is not given.
- **`scripts/diarize-bench.py`.** Mixes solo tracks into a fake shared mic with a known answer and scores a split method on it. Against today's clustering: session 29 mix, 84% to 96% right, confident-wrong 9% to 1%; session 28 mix (held out), 28% to 96% right, confident-wrong 72% to 0.2%.
- **Answer keys.** `diarize-track.py --export-key N` cuts clips for the DM to tag by ear into `label-key.tsv`, which is committed (new `.gitignore` exception); every later run scores itself against the tags. Session 30's key is cut and waiting (todo item 84).

### Changed

- `diarize-track.py` result line `inherited:` is now `estimated:`. The sidecar format is unchanged, so `transcribe.py` needs nothing.

## [0.46.0] — 2026-10-26

### Added

- **`/review` Pass 6, Prose.** Every read-aloud box, NPC line, `Introduce:` block, Kit line and the Closing is read against `meta/prose-style.md`. Findings give the node, the quoted text, the tell and a full rewrite. Lines quoted from the table are never rewritten. A DM's name and date marks a decision, not wording, so the prose around it can be rewritten; only wording the plan marks as locked is protected.
- **The prose guide is loaded where prose is written:** `/session` Phase 6, `/recap` (record, entities, slides, blurb), `/transcript` Phase 6 (Drive notes) and `/pitch` Phase 3, each running the guide's new **While drafting** checklist before showing or saving.

### Changed

- **`meta/prose-style.md` is complete:** the source skill's plainer-word swaps and before/after examples are back, with fantasy examples added (one from Session 31), plus the While drafting checklist and the Review findings format.

## [0.45.0] — 2026-10-26

### Added

- **Prose style guide.** `meta/prose-style.md` sets an anti-slop pass for all generated prose, adapted from the MIT `anti-slop` skill in elithrar/dotfiles: the AI-tell catalog, fiction and fantasy tells (stock body language, "the weight of", adjective stacks, ominous one-line endings, default fantasy names), what to keep, register by audience (read-aloud, plans, historian, player notes, lore) and five questions to ask before cutting a phrase. Root `CLAUDE.md` says to read it once per task when writing prose. The example-passages section is empty until the group fills it (todo item 83).

## [0.44.0] — 2026-10-25

### Added

- **Campaign trackers.** A `scheduler/campaign/_*.md` file with an `(as of: Session NN)` header and an `## Engine` section is now read by `/transcript` (mines what the section names into a new `## Trackers` inbox section), `/recap` (Phase 2 question 12, then applies and restamps in Phase 6, every homebrew recap) and `/session` (states each tracker in the orientation and surfaces at most one ready idea). The first is `_citadel-clock.md`: Odibli's casts in Aethryn, a hidden d6 per leveled spell, three sensed casts bring a teardown attempt, plus an ideas sheet keyed to the results. Rules: `scheduler/CLAUDE.md` → Campaign Trackers.

### Changed

- **The Shadowless Spear slows the fade instead of stopping it** (not yet delivered): each dark-moon mourning rite now holds the fade off twice as long, so the rite stays the Nightveil's hook in Halsby.

## [0.43.0] — 2026-10-25

### Changed

- **Retcon: Odibli's backstory and the Citadel.** Miguel's 2026-10-25 handout answers and Citadel doc replace the 2026-10-04 layer. Odibli is a copy, an agent the original made for the Astra/Glistening experiment, who escaped by accident. The mist took him by bad luck. He does **not** know he is a copy, which overrides his Session 29 table line. The forty years at a desk were the original's. The Session 10 shadow was a failed attempt to shut him down remotely. The Citadel is now a research lab in Aethryn, not a vault for cursed texts. Retired: Strahd as the calling voice, the "endings" written into copies, the Tome of Strahd fragment, and Strahd listening in on the hearth. Kept: the Aethryn casting rule (odds are the DM's) and the fireplace, now a way for gnomes to talk to each other. Don't plan from the old layer.
- **Citadel cast named, files renamed:** `The Citadel Assistant` → Berle Kempwick, `The Citadel Colleague` → Elspeth Moorlin (she now knows everything), `The Master of the Citadel` → Wendrick Schulden. Old names are kept as aliases, so old links still resolve.

## [0.42.0] — 2026-10-21

### Changed

- **The session runner is scene-first.** One page per scene instead of one card per beat. The top of the page says what the scene is doing (summary), where, who's here, the DCs, and the enemies as compact rows (AC, HP, speed, CR, main attack) that expand to the full stat block from `## Combatants`. Under that, the beats are a step list: done steps greyed with a tick, the current step open, upcoming steps on one line, and fork buttons under the step that branches. Keys are unchanged.
- **Hidden at the table:** planning history (`(Jeff, <date>)`, `Engine, …; committed …`, `Draft (engine, …)`), node ids and kind tags. The rail shows step numbers, and steps carry only ◆ choice / ⚔ combat / ★ payoff marks. Token cues move behind one **Tokens** toggle per scene. Read-aloud text in a scene's setup stays open; the rest of the setup folds under "Scene notes".
- **Scene header in plans.** `/session` Phase 6 and `meta/schemas/session.md` open every `### Scene` with `Summary` · `Where` · `Cast` · `Enemies` · `DCs` · `Tactics` (combat) · `Time` · `Trigger` bullets, and planning history goes in the Engine notes, not in scene prose. `/review` Pass 1 checks the header. Plans without one still render: the runner falls back on Trigger, Location and NPCs present, and pulls DCs out of the prose.
- Session 31's six scenes have headers backfilled.

### Removed

- `app/pages/home/session/card.ts` (replaced by `scene.ts`, `scene-head.ts`, `steps.ts`, with the pure `scene-header.ts`, `combatants.ts`, `provenance.ts`). `session-cards.py`'s output is unchanged.

## [0.41.0] — 2026-10-21

### Added

- **Achievement tallies.** A `## Tallies` section in `historian/sessions/_achievements.md` counts a PC's quirky repeated habits (fireplaces examined, fires made worse). Tallies stay hidden until one reaches 3, 5, 10 or 20, which unlocks a card; higher tiers repeat the title with a numeral. `/recap` proposes increments as `T1.` items for DM approval. The parser skips the section (test added).

### Changed

- **`meta/achievements.md` has a real bar** (DM feedback on Session 30's first draft, which was cut from fourteen cards to one). There are two ways to earn a card: a big, visible result from a deliberate action, or a tally threshold. Cut if minor, just a good roll, a mystery beat that happened *to* the scene, routine, a fizzle, too contextual, or a reaction. Voice rules add "say it literally first" and "vary the sentence shape". Expect zero or one card per PC.
- **`/recap`** and **`/transcript`** apply the bar before drafting, and `/transcript` collects habits for tallies.

## [0.40.0] — 2026-10-20

### Added

- **Achievements (`meta/achievements.md`).** Homebrew recap decks gain one slide per PC, titled with the PC's name: short, snarky "New achievement!" cards for in-fiction deeds, addressed to the PC as "you". No reward line, no perks, never padded; a PC with nothing good gets no slide. Running jokes come from each PC's history, and a repeated title (`Gravity's Favorite II`) shows as "earned again ×2".
- **One ledger, `historian/sessions/_achievements.md`**, parsed by `scripts/lib/achievements.py` (tests in `tests/scripts/test_achievements.py`). History starts at Session 30; no backfill.
- **Achievement slides in the runner** (`app/pages/home/session/achievements.ts`), slotted after "The party" and before the stats slides.

### Changed

- **`/transcript`** ledgers achievement candidates per PC, and the inbox note gains `## Achievement candidates`.
- **`/recap`** asks about achievements in Phase 2 (question 11), drafts them as `A1.` items after fame in Phase 5, and writes the ledger on approval.
- **`meta/recap-slides.md`** places the achievement slides and exempts them from the third-person voice rule.
- **`session-cards.py`** adds `achievements` to each `previously[]` entry (additive; null when unledgered).

## [0.39.0] — 2026-10-20

### Added

- **Introductions in session plans.** Where a character first appears to the party, the node carries an `- **Introduce:** <Name>, <role>` bullet with **Look**, **Sound** and **Impression** sub-bullets. Combatants lead with their label. Once per character; a deliberate silhouette gets none.
- **Token cues in session plans.** A `- **Tokens:**` bullet on every node where someone with a token arrives, leaves or changes map: which map, who goes on and roughly where, who comes off.
- **The session runner shows both on the card**, above the branch buttons, so the DM reads them at the moment they're needed instead of opening the scene notes. Parsed from the node's prose by `extractCallouts` in `app/pages/home/session/markdown.ts`; no change to `session-cards.py` output.

### Changed

- **`/session`** Phase 6 scene blocks gain the Introduce and Tokens fields.
- **`/review`** Pass 2 checks both. The "describe once in 10 words or fewer" rule is replaced by the Introduce block.

## [0.38.0] — 2026-10-13

### Added

- **Character stats (`meta/stats.md`).** Table-side stats celebrate what each PC did (killing blows, crits, nat 1s, HP healed, performances, unarmed hits, spells cast and more), including **lanes** that only certain builds can win. Categories live in one catalog block in `meta/stats.md`. Stats are mechanical, never spotlight, and carry no perks. Counts are plain; sums mined from a transcript are rough (`~n`) until the DM corrects them.
- **One shared ledger, `historian/sessions/_stats.md`,** for both campaigns, so flat Strahd sessions are covered too. The `_` keeps it out of validate, the index and the inventory.
- **`scripts/stats-standings.py`** (logic in `scripts/lib/stats.py`): one session's awards (ties share, ⭐ personal bests), season leaderboards (top three, reset at each world swap), lifetime hall of fame, and the previous season's final standings when a session opens a season. `--json` for machines. Tests in `tests/scripts/test_stats_standings.py`.
- **Stats slides in the recap deck.** The runner builds them from the ledger and slots them in before "Next time…": "While you were in Barovia…" after a Strahd season, "Last session's honors" (award cards), and "The standings" (bars plus a hall-of-fame strip). Generated, never written into `_slides.md`.

### Changed

- **`/transcript`** ledgers stats per PC with catalog ids, and the inbox note gains a `## Stats` section.
- **`/recap`** asks about stats in Phase 2, confirms them as a numbered per-PC list in Phase 5 and writes the ledger, then proposes in-world **fame** beats (`F1.`) that only become canon as DM-approved Phase 5.5 events.
- **`meta/recap-slides.md`** places the stats slides and exempts them from the "story, not mechanics" voice rule.
- **`session-cards.py`** adds `stats` to each `previously[]` entry (additive; null when unledgered). The `Slide` type gains an optional `html`.

## [0.37.0] — 2026-10-12

### Added

- **NPC voice records (`meta/voice.md`).** NPCs and antagonists can carry a `## Voice` section with two layers: a **core** (Signature, Never, Tell) that changes only by correction or a DM-called arc shift, logged under `### Arc`, and a **now** layer of at most three lines, each citing the session that caused it. `Said at the table` keeps up to five verbatim lines. New optional frontmatter: `voice` (the core in one line) and `voice_confirmed` (a Stamp Pattern stamp). Both added to the NPC and antagonist schemas.
- **`/recap` voice shifts.** Phase 2 asks for lines worth keeping (from the inbox note's `Quotable lines` first). After the affinity nudges, Phase 5 proposes lines, now changes, core changes and new voices as a numbered confirm-list, and restamps `voice_confirmed` on every NPC on that list. Quotable lines from `/transcript` no longer vanish when the inbox note is deleted.
- **`todo-brief.py` `--- NPC VOICES ---` block.** Flags an NPC whose last `key_npcs` appearance is newer than their `voice_confirmed`, and a voice section with no stamp. `/todo` lists them as backlog. Tests in `tests/scripts/test_todo_brief.py`.

### Changed

- **`/voice` caches in the layered shape** and sets `voice` and `voice_confirmed`. It never edits an existing layered section; it reports drift for `/recap` to settle. A legacy `## Voice` (such as Strahd's single line) gets an upgrade offer. Played lines outrank planned Quick-Reference notes.
- **`/session` and `/review`** treat a file's `voice` line as the fixed core and play the now layer on top.

## [0.36.0] — 2026-10-12

### Added

- **`scripts/label-check.py`.** Checks that a session's combatant labels agree everywhere they are written: the plan's `Label (party-facing):` lines, its Combatants At a glance list, the roles in `tokens.txt`, and the token lines of its battlemap layouts. `--stub` appends a tier-1 `tokens.txt` rule for each label with no role (real name and stat block in the note, regex guessed from the stat block) and prints paste-ready layout token lines; it never edits layouts or picks art. `/review` Pass 2 runs it. Shared parsers live in `scripts/lib/labels.py`. Tests in `tests/scripts/test_labels.py`.

### Fixed

- **`prep-status.py` read labels from the whole plan,** so a known NPC labelled by name (Mara) showed up as a missing token role. It now reads only `## Combatants`, the same scope as the token rules, and points to `label-check.py --stub` when a role is missing.

## [0.35.0] — 2026-10-12

### Added

- **Token upload ledger.** `maps/battlemaps/tokens-uploaded.txt` (tracked) lists every token already in the Roll20 art library and the session it went up in. `token-kit.py` never re-adds one: it counts toward its role's choices and the README lists it under the role as already in Roll20. New flags: `--uploaded` records a session's kit after upload (`--from <dir>` records another folder), and `--forget <n|all>` drops lines after a Roll20 purge. `prep-status.py` flags a built kit that was never recorded. Tests in `tests/scripts/test_token_kit.py`.

### Changed

- **One flat token folder per session (kit layout changes).** `token-kit.py` now writes every image straight into `session-<n>/tokens/` (no per-role subfolders), so the whole kit drags into Roll20 at once, and the README moves beside it as `session-<n>/tokens-README.md`. Kits are never split per map. Kits built before this keep the old layout until rebuilt; `prep-status.py` reads both.

## [0.34.0] — 2026-10-12

### Added

- **`scripts/prep-status.py`.** A session's prep checklist built from its files instead of by hand: plan state and date, unset `<placeholders>` with the beat they sit under, flow beats by marker, linked loot that isn't confirmed, layouts with missing or stale renders, combatant labels with no `tokens.txt` rule, whether the token kit is built and current, stale PC levels, the search index, and unchecked lines in the folder's `_tasks.md`. `_tasks.md` now holds only what no file can show (cards, questions for players). `/review --ready` runs it, and `/todo` folds its lines into Do soon. Tests in `tests/scripts/test_prep_status.py`.

## [0.33.0] — 2026-10-12

### Added

- **Spine first.** `/session` Phase 5 now shows a numbered spine before any prose: scenes, one-line beats with their node ids and flow graph kind, choices with their costs, one line per fight and a choice-count line. The DM edits by number (numbers never shift) and says **go** to write the folder or **chat** to keep the plan in chat. If the act's flow set or an existing `_flow.md` already draws the session, the spine starts from its nodes.
- **Commit pass.** New `/session` Phase 7 lists which beats now meet the flow graph commit gate, which don't and why, and any spine changes fleshing turned up. The DM approves by number; nothing is flipped to `[x]` without that.

### Changed

- **`/session` Phase 6 fleshes only the approved spine.** Each beat becomes a `####` node heading; no beats are added, renamed or reordered while fleshing. On **go** it always writes `_flow.md` (previously offered) and reports the `/review` close list instead of pasting the plan into chat. The choice check moved to the spine. `/review` in `/session` mode no longer adds beats; it proposes them. `tests/commands/session/spec.md` gains the spine and commit-pass checkpoints.

## [0.32.0] — 2026-10-12

### Added

- **Party-facing labels.** `/session` (Phase 5) gives every combatant a `Label (party-facing):` line beside its kit line: the one-to-three-word name the party uses before learning the real one (a job or a look, never a stat block or a bare weapon, unique per encounter, numbered only for lookalikes). The Combatants at-a-glance list leads with it. The label is the Roll20 token label, the `tokens.txt` role (lowercase, hyphenated) and the first word of a map layout's token line. `/review` Pass 2 checks it.

### Changed

- **Everyone gets a real name.** `/session` and `/review` Pass 2 now name every person and animal the plan puts in front of the party, walk-ons included, so anyone can talk. Narration can still leave them unnamed. This replaces the old rule of naming anonymous speakers only on request. Session 30's plan, layouts and token kit use the new labels.

## [0.31.0] — 2026-10-12

### Added

- **Budgeted token kits.** `scripts/token-kit.py` builds a session's Roll20 token kit from the FA Tokens Library zip inside a storage budget (default 30 MB of the free tier's 100 MB). It reads a tiered per-session manifest (`maps/roll20 assets/session-<n>/tokens.txt`: combatants, then named NPCs, then walk-ons) and tops up from the evergreen `maps/battlemaps/tokens-common.txt`. It downscales to 280 px per square and names files by role so they can be searched in the art library. It also writes a README with Roll20 sizes. Session 30's kit: 269 tokens, 22.8 MB. `maps/battlemaps/CLAUDE.md` documents the workflow.

## [0.30.0] — 2026-10-12

### Added

- **Roll20 upload purge.** `maps/battlemaps/roll20-purge.js` is a browser-console script that bulk-deletes uploaded Roll20 assets to get back under the free 100 MB storage quota. It works through Roll20's internal list and delete endpoints. `maps/battlemaps/CLAUDE.md` points to it from the kit workflow.

## [0.29.0] — 2026-10-12

### Added

- **Player-facing kit lines.** `/session` (Phase 5, Encounters) now writes a `Kit (player-facing):` line for every combat-capable enemy and NPC: one italic sentence of the armour and weapons the party can see, matching the stat block, with no name in it. `/review` Pass 1 backfills missing ones. Session 30's combatants and Mara Tull carry them.

## [0.28.0] — 2026-10-12

### Added

- **Recap slides: Voice rules.** `meta/recap-slides.md` gains a `## Voice` section: tell it as a story, not mechanics (no check-, damage- or rules-sounding words); only what an NPC actually said, so a reward the plan names stays off the slides until it was promised out loud; "the party", not "you"; vary verbs; plain words that read well aloud.

### Fixed

- **Session 29 deck** reworded to the new rules. The fox's promise no longer names the spear, which the fox never said.

## [0.27.1] — 2026-10-12

### Removed

- **Recap slides' empty art column.** It was held for pixel art, which is dropped: the group doesn't want AI-generated art. Slide text now spans the stage, capped at 1200px wide so lines stay readable when screen-shared. The reserved-image note is gone from `meta/recap-slides.md`.

### Fixed

- **`.template-sync`** now ships `meta/recap-slides.md`, which `/recap` Phase 8 reads.

## [0.27.0] — 2026-10-10

### Added

- **Recap slides.** The session runner's "Previously on…" card has a **Slides** button that opens a fullscreen, party-facing carousel of the previous session, built for screen-sharing at the table. Arrow keys, Space or click move; Home and End jump; Esc closes; F toggles browser fullscreen. Each slide leaves an empty column for the per-character pixel art planned for later. New `app/pages/home/session/slides.ts` (+ CSS and spec).
- **`meta/recap-slides.md`.** The deck rules: homebrew only, DM-approved, written once. Covers the fixed slide order (title, previously-on, scenes as played, choices, the party, next time), about 40 words per slide, and party-safe sources. Every draft gets a names check: seen is not known, so a name the DM's sources mention stays off the slides until the DM confirms the party learned it. Private PC moments stay in. The deck lives in `_slides.md` in the session's historian folder, which the entity scan skips.
- **Session 29 deck.** A one-time `_slides.md` written by hand, so Session 30 opens with slides.

### Changed

- **`/recap` Phase 8** now drafts a homebrew session's deck as a numbered list. The DM edits it by number and approves it, then `/recap` writes `_slides.md`. The group-chat blurb is still offered afterwards, drawn from the approved deck. Strahd recaps are unchanged. `tests/commands/recap/spec.md` gains the matching checkpoint and output contract.
- **`session-cards.py`** emits `slides: [{title, md}]` on each `previously` entry, read from the folder's `_slides.md` (empty when there's none). `PreviousSession` in the runner's `types.ts` gains the field.

## [0.26.2] — 2026-10-10

### Fixed

- **Campaign view froze when zoomed in.** The swimlane built one tick node for every day across the whole timeline: about 940,000 DOM nodes and 14–23 s per wheel step at deep zoom. It now draws ticks only for the visible slice plus a buffer, and refills them as you pan. `buildTicks` takes an optional day-index window, and `Axis` gains `ticksIn(x0, x1)`. Zoom steps hold at about 70 ms.
- **Wheel zoom redrew at max/min zoom.** It no longer redraws when the level is pinned.
- **Campaign view canvas could pass the browser layout limit** (80M px; Chrome breaks past about 33.5M). Max zoom is now capped at a 16M px canvas (`MAX_CONTENT_PX`).
- **Session 29 stretched the Campaign view to 1,291 years.** A session in a campaign with no in-world dates fell back to its real-world `played_date` (2026) next to Strahd's year 735. `timeline-data.py` now uses the real-world fallback only when no campaign has in-world dates. Otherwise it places the session one day after the previous dated session and warns on stderr that the date is a placeholder, not canon.

## [0.26.1] — 2026-10-10

### Added

- **`tests/commands/recap/spec.md`.** An audit contract for `/recap`, the command that writes canon. It sets the required scripts, read budget, nine interaction checkpoints and output contract, and treats any write made before its confirmation as a fail. It ships in the template.

### Fixed

- **`/recap` couldn't find a plan readied with `/review --ready`.** Phase 1 only looked for `state: draft`, but `--ready` sets `state: planned` (as Session 30 is now), so `/recap` would have reported that no session exists. It now accepts both.
- **`/recap` reads party levels from `party-status.py`** instead of opening each PC file.
- **`/recap` now runs `validate.ps1 -Scope links`** after its writes, as root CLAUDE.md requires before canonizing, and reports only errors in files it touched.

## [0.26.0] — 2026-10-09

### Added

- **`session-brief.py` prints a CAMEO PLAYERS block:** every active `role: cameo` player in `meta/players/` with availability, preferences and description, plus a flag for any filled cameo questionnaire not yet ingested.
- **`meta/settlements.md` → Travel Legs.** The travel-leg procedure (paces, clock advance, 1–3 geography-derived stops) moved here from `/session`, which now points to it only when a plan includes travel.

### Fixed

- **`/session` Cameo Candidates never found ingested cameo players.** It grepped `questionnaires/` for `filled: true`, but ingestion writes cameo players to `meta/players/`, so MacLeod (`role: cameo`) could never surface. It now reads the brief's CAMEO PLAYERS block, with no greps or file reads.

### Changed

- **`/recap` no longer copies rules from meta files.** The affinity magnitudes and bands now come from `meta/affinity.md`, and the daypart cue rules from `meta/events.md` → Dating events. Each rule lives in one place.

## [0.25.1] — 2026-10-09

### Fixed

- **`.template-sync` ships a working engine again.** It listed 15 `.ps1` scripts that the Python migration had deleted, and it was missing 26 `.py` scripts (`session-brief`, `todo-brief`, `party-status` and others the commands call), four commands (`/flow`, `/review`, `/spitball`, `/transcript`), and five engine meta files (`affinity`, `events`, `flow-graphs`, `player-agency`, `spitball`). Commands and scripts now sync by wildcard (`.claude/commands/*.md`, `scripts/*.py`, `scripts/*.ps1`, `scripts/lib/*.py`), so new ones ship without an edit. The pytest suite (`tests/scripts/*.py`) and the shared `.claude/settings.json` hook now ship too. The orphaned `scripts/inkarnate-fetch.py` (replaced by `fetch-maps.py`) and its test are excluded.

## [0.25.0] — 2026-10-09

### Changed

- **`maps/CLAUDE.md` split into three files, so map work loads only the rules it needs.**
  - `maps/CLAUDE.md` (about 3KB) keeps the shared rules: no committed images, the two kinds of map, and handing map work to Jeff.
  - `maps/world/CLAUDE.md` (about 11KB) holds masters and tiles, the four hard rules, re-export and city graduation, Grid Scale, Climate Rules, City Marker ID Format, and the map/region scripts.
  - `maps/battlemaps/CLAUDE.md` (about 7KB) holds layouts and renders, standing location maps, and Roll20 asset kits.

  World-map work now loads about 14KB of rules instead of 19KB, and battle-map work about 10KB. **Grid Scale, Climate Rules, City Marker ID Format and the graduation checklist now live in `maps/world/CLAUDE.md`**, and every reference in meta, templates, scripts and README is updated.
- **`scheduler/CLAUDE.md` points to the battlemap rules.** Session layouts (`<Session folder>/maps/*.txt`) live under `scheduler/`, where `maps/` rules never auto-loaded.

### Removed

- **The "Current maps" list in `maps/CLAUDE.md`.** It was a status list inside an instruction file and would have gone out of date; `ls maps/battlemaps/` gives the same answer. Its one design note, that the Golden Lioness outdoors map stays a 5-ft battle map, moved into the battlemap rules.

### Fixed

- **`.template-sync`** now ships the new `maps/world/`, `maps/battlemaps/` and `recaps/` CLAUDE.md files, and no longer lists the deleted `entity-ingest.md`.

## [0.24.0] — 2026-10-09

### Added

- **SessionStart hook in a shared `.claude/settings.json`.** It runs the new `scripts/session-start.py`, which prints the engine version, recent changelog highlights, unbumped engine commits, search-index staleness, recap-inbox notes and untranscribed recordings. This replaces the hand-run start-of-session ritual of four or five tool calls. Collaborators get it on clone; it needs `uv`.
- **`recaps/CLAUDE.md`.** The audio pipeline rules (speaker labels, shared microphones, detached runs) moved out of root and load only when working in `recaps/`.
- **Map Scripts section in `maps/CLAUDE.md`.** Lists the ten map, region and naming scripts that used to sit in the root table.

### Changed

- **Root CLAUDE.md is down from about 31KB to about 22KB** (roughly 2.3k fewer tokens a turn). The scripts table keeps only cross-cutting scripts; command-specific briefs are named in their command files. The index-staleness and version-orientation rituals collapse into a Session Start section. The recap inbox and recording triggers shrink to four bullets.
- **`version-check.py` exposes `engine_status()`** for reuse. Its output is unchanged.
- **`# consumers:` headers** now name the file that actually references each script.

## [0.23.0] — 2026-10-09

### Added

- **Command frontmatter.** Every file in `.claude/commands/` now opens with a quoted `description:` and, where it takes arguments, an `argument-hint:`. Claude Code's command list and model invocation read these, so `pc-backstory` and `entity-questionnaire` now say what triggers them. New commands need both fields.
- **`scripts/commands-list.py`.** `/commands` now builds its list from the command files, so it can't drift. Replaces two hand-kept lists that had each lost six or seven commands.
- **`session-brief.py` reports search-index staleness** (`SEARCH INDEX STALE` / `NEVER BUILT`). `/session` Step 2 relays the line instead of reading the stamp and running `git log` by hand.
- **`threads-brief.py` prints each entry's `[campaign: …]` tag**, so a homebrew `/session` can drop Strahd threads without opening files. The tag is appended; existing fields are unchanged.

### Changed

- **`/session` Phase 3B Step 1 runs `threads-brief.py`** instead of sweeping historian frontmatter by hand.
- **The index staleness check lives once in `scripts/lib/common.py`** and covers `spitball/`, matching the indexer. `todo-brief.py` used to miss it.
- **`/recap` Phase 7 deletes the `recaps/inbox/` notes file** once Phases 4–6 are written. The summary reported this before, but no step actually did it.
- **The root CLAUDE.md command list is gone.** It now points to command frontmatter and `/commands`, and saves about 2KB a turn.

### Removed

- **`.claude/commands/entity-ingest.md`.** The `CLAUDE-INGEST` auto-trigger now runs the full Ingestion Mode in `entity-questionnaire.md`. The stub skipped the `filled: true` marker, so questionnaires taken in through it never surfaced as `/session` cameo candidates. Nobody typed it, and its only caller is updated, so nothing breaks.

### Fixed

- **Stale `.ps1` references.** The `region-*` rows in the scripts table and `/event`'s semantic-search call now use the `.py` scripts.

## [0.22.0] — 2026-10-09

### Added

- **Player agency has its own rules: `meta/player-agency.md`.** It sets out what counts as a real choice (the players know they're choosing, more than one option works, the options cost different things, the consequence shows up), and party choices versus character choices. It gives a light cadence: about two or three party choices and one character choice a session, no run of more than about three reaction-only scenes, and at least one choice per act that changes where the story goes. Committed beats stay; choices are added around them. It also lists the railroad warning signs.
- **`/review` Pass 5 — Choices.** It counts the plan's real choices, flags the railroad warning signs, and proposes a draft fix for each one. It never reopens committed beats.
- **`choices:` historian session field (optional).** `/recap` asks a new Phase 2 question 8 and records what the party or a player decided and what it set in motion. `/session` greps recent `choices:` and pays at least one off visibly.

### Changed

- **`/session` reads `meta/player-agency.md` every run.** Choice bullets are marked `Choice (party):` / `Choice (<PC>):`, the plan is checked against the cadence before it's written, and a **Choices** bullet in the Engine notes lists every choice point.

## [0.21.0] — 2026-10-08

### Added

- **Red dots on the world map are big cities.** Every city-registry marker stands for a city of thousands or more. A graduated dot gets `importance: major` or `critical`, a population to match, and a trade route. Towns, villages and hamlets stay below map resolution and never get a dot. Stated in `maps/CLAUDE.md`, `meta/settlements.md` and the registry header.

### Changed

- **Calenmere's river names are settled.** The Moorthistle is the upper border branch (purple/red), a tributary of the **Broadwend**, the big river to the bay (red/navy). River F is now the **Bayward**, which reaches the bay at Tassad. The world master's old "Bayward River" label sat on the Broadwend, and its Inkarnate relabel is pending (`todo-worldmap.md`).
- **Registry IDs in the Calenmere Basin draft re-matched.** Nine of the twelve anchors pointed at the wrong dot. Each now comes from its political-overlay number. Tassad's alias moved from `C05-04h` to `C06-05a` (overlay dot 17, where its label now sits).

## [0.20.0] — 2026-10-08

### Added

- **`/review` polishes a session plan before it runs.** `/session` builds a plan; `/review [session] [--ready]` reviews one that already exists, in four passes. **Description & Dialogue** fills thin scenes and keeps lines plain and cued. **Names & People** checks new names for collisions and describes each person once, where they first appear. **Cuts & Renames** sweeps a removed or renamed node out of `_flow.md`, the Engine notes and the frontmatter. **New Canon** lists every fact the plan sets under *For `/recap`*. Standalone runs present numbered findings and apply what the DM approves; `--ready` sets `state: planned`.

### Changed

- **The Description & Dialogue Pass moved out of `/session` into `/review`.** `/session` Phase 6 now reads `review.md` and runs its passes when it writes the plan, so `/session` no longer loads the pass on every run. Behavior is unchanged, apart from the three new passes now also running at write time.

## [0.19.0] — 2026-10-08

### Added

- **NPC lines are plain and cued.** `/session`'s Description & Dialogue Pass gains two rules. **Plain over clever:** each line states its point outright, so the DM gets it on a cold read. If a line needs a gloss, rewrite the line instead. **Every line has a cue:** the plan says what in the scene prompts the line, and a character tangent is set off by a concrete object or moment, ideally from the location's file. Prompted by Session 30's review, where several lines read as vague and one tangent came from nowhere.

## [0.18.0] — 2026-10-07

### Added

- **Difficulty checks the party's offense, not just the monsters'.** Session 29's fight was planned at Standard lethality and ended in two rounds with almost no damage taken. Most raiders died before acting. `meta/difficulty.md` gains **rounds-to-clear (RTC)**: total monster HP ÷ party damage per round. Under 2 means the fight ends before rounds-to-down (RTD) matters. It also adds a **one-hit body** rule: a monster with HP at or below one average PC hit counts as half a body. Fights meant to sting need RTC 3+ and at least one creature that survives two hits.
- **Light attrition sizes the main fight at Hard or Deadly.** A fresh party facing one fight goes all-out, so few fights means each must be harder.
- **Encounter writeups state their DMG XP band** before the RTD and RTC checks (`/session` updated to match). Session 29's ~500 XP sat under Easy and nothing flagged it.
- **Budget at the level the party fights at.** Level-ups planned before or during a fight count in its math.

## [0.17.0] — 2026-10-07

### Added

- **Session runner shows a written recap.** A session plan may carry its own `## Recap` section, a hand-written read-aloud version. The runner's recap card leads with it in place of the previous session's one-line description, and the plan panel leaves it out so it isn't shown twice. Entities it mentions are picked up like the rest of the recap. Plans without the section render as before.

## [0.16.0] — 2026-10-05

### Changed

- **Spitballs may be deleted at any time.** This reverses the old "nothing is ever deleted" rule in `meta/spitball.md`. Nothing outside `spitball/` may link to a spitball: canon, plans, player files and `/todo` must carry the substance themselves, and anything important gets relocated (suggest it to the DM). Every spitball now opens with that instruction as a blockquote. `/spitball` writes it into new files, and `--promote` copies the idea into the flow node instead of linking back. Stated in `CLAUDE.md`, `meta/spitball.md`, `spitball/README.md` and the command. **Breaking for anything that links into `spitball/`.** The existing links (Session 29's plan, MacLeod's player file, `/todo` item 69) were replaced with the content itself.

## [0.15.0] — 2026-10-05

### Added

- **Session runner shows what's established.** A session folder can carry an optional `_established.md`: table-safe facts about the town, region and world, one `##` section per scale. `scripts/session-cards.py` sends it as `established`, and the runner's side panel lists it under **Established**, above the session plan, with wikilinks opening their entities. Session 29 has one, built from its `_world-questions.md` prep (Ashford; Stonemarch and the Moorthistle; Velmora and Aethryn), with DM-only lines marked.

## [0.14.0] — 2026-10-05

### Added

- **Battlemaps, rendered from text.** A session's maps are now text grids kept beside the plan (`<session folder>/maps/*.txt`, one char per 5-ft square, gitignored as local reference), with tokens, zones and labels by grid ref. `scripts/battlemap.py --session <n>` renders each one twice into `maps/battlemaps/session-<n>/` (gitignored): a clean VTT image, 70 px a square (`--px 100` for Foundry), and a DM key with grid refs, tokens, zones and a legend. Session 29 has three: the New Wing fight, Halsby's woods, and the Lioness's old core. Its plan now names each position by grid ref.
- **Standing location maps.** `maps/battlemaps/<location>/` holds maps of a place that are kept and grown across sessions, rendered beside their layout (`battlemap.py <folder>`). The Golden Lioness has two: indoors (ground floor, core and wing) and outdoors (the lot, with open ground west, southwest and south for base building, down to a dock on the tributary). Grid refs now run past Z (AA, AB…).
- **Two map kinds, no hybrids** (`maps/CLAUDE.md`). Battle maps (5-ft squares) are built in Roll20, where walls, doors, fog, lights and GM-layer reveals live. Overview maps (world, region, town; anything coarser) are built in Inkarnate. A map is never both: a place that needs both gets two maps.
- **Town-scale maps.** A layout can set `scale: <feet per square>` (default 5). Ashford has a first draft at 25 ft a square (`maps/battlemaps/ashford/`): the tributary bending behind the Lioness and south past the ford, the market square, and markers for the named places. Most placements on it are not canon yet, and the map says which.

## [0.13.1] — 2026-10-05

### Fixed

- **Session runner froze on cards with indented quotes or headings.** The markdown renderer never moved past an indented `>` or `#` line (Scene 5's read-aloud box in Session 29), which hung the tab. Indented quotes and headings now render, and no line can stall the renderer again.
- **Session runner search now finds confirmed loot.** Items in `meta/loot-options/` with `status: confirmed` (The Shadowless Spear, Earshot Crystals, The Unfinished Binding) are indexed as items, open in the side panel labeled "loot", and resolve the plan's `[[wikilinks]]` to them. Options still under discussion stay out.

## [0.13.0] — 2026-10-05

### Added

- **Description & Dialogue Pass in `/session`.** It runs when a plan is saved to `scheduler/`, and again when the DM confirms a draft as `planned`. The pass walks every scene and flow node and fills the thin spots: a read-aloud box before any choice the players make from what they see, 2–4 sample lines per speaking NPC (plus their replies to likely pushes and to each branch outcome), what a discovery feels like, how each planted name gets said, lines for the enemies mid-fight, and a line for each contingency whose tone changes. Everything it adds is marked as guidance for the DM to improvise from, not a script. It is grounded in the entity files, leaves unset canon as `<placeholders>`, and files each addition under the existing node heading so the session runner shows it on the right card. Session 29's plan got the first pass.

## [0.12.0] — 2026-10-05

### Added

- **Session runner page** (`app/pages/home/session.html`; `npm run home`, then the **Run session** button or `/session.html`). It walks the next planned session one card at a time, one card per flow-chart node. Each card shows the node text, any plan notes from `_flow.md` that name it, branch buttons for the real forks, and the scene's written prose underneath. When a scene runs in parallel with no arrow into it (Halsby's intro), the runner offers "Cut to Scene 1b" first. Dashed edges show up as asides. A map rail jumps to any card. The side panel holds entity search, the party strip, entities on the current card and scene, the act roster, and the plan's other sections. An entity opens with its canon/pool/plan layer and the session's NPC quick-ref. Keys: → / Enter go forward, 1–9 pick a branch, ← steps back, `/` searches. The walked path survives reloads and can be copied for `/recap`. Auto-surfacing skips the other season's entities and PCs; search still finds everything. `$SESSION` picks a different session folder.
- **"Previously on…" card.** Every session the runner loads now opens on a recap of the session before it. The card is built from that historian record's `description`, `recap` and `cliffhanger` fields, in the CLAUDE.md recap format: a narrative lead, then TL;DR bullets (party status, the plan's `loose_threads`, the cliffhanger), then the full recap, collapsed. Nothing needs writing by hand: it appears once `/recap` has canonized the previous session. When the previous session belongs to the other season, a "Last time in this world" block adds the last session played in this one.
- **Scene notes grouped by card.** A scene's written prose shows as one collapsed dropdown per flow-chart node, in flow order: number, kind, id and title on the closed row, the prose inside, and a jump button. Prose is filed by `#### S1_ID — title` headings in the plan's `### Scene` sections; text above the first one becomes a Setup dropdown, and a node with no prose shows its flow-chart lines. A plan without node headings falls back to one dropdown per bold label (`**Beats:**`, `**The fork:**`). Session 29's plan is re-filed this way, lines moved but not reworded.
- **`scripts/session-cards.py`**: the extractor behind the page. It reads frontmatter only for entities, and the page fetches bodies on demand.

### Fixed

- The home page's Python runner (`app/pages/home/run-python.ts`, now shared by both data plugins) tries `uv run` first and moves to the next interpreter on any failure. Before, a Windows Store `python3` stub stopped the search, so the timeline page loaded no data.
- **Timeline axis no longer mixes in real-world dates.** Before, a session with no `in_world_end_date` was plotted at its real-world `played_date`, so the Strahd axis ran from year 734 to 2026 and crushed every beat. `scripts/timeline-data.py` now uses the real-world fallback only for a campaign that has no in-world session dates at all. Otherwise a session missing the field takes the previous session's in-world date, and the script prints a warning to stderr. Sessions 16–28 now carry `in_world_end_date`, worked out from their canon event dates.

## [0.11.0] — 2026-10-04

### Changed

- **"Google Drive notes" are written for the players.** `/transcript` Phase 6 now builds party-facing notes when the DM asks for "google drive notes": nothing the characters didn't experience at the table (no DM asides, NPC secrets, unlearned names, or foreshadowing), and no conclusions drawn for the party (NPC statements reported as claims, theories credited to whoever voiced them, open questions left open). Possible spoilers are listed for the DM in the hand-off message, not in the document. The `(??)` mark and its legend are dropped from the export. The root `CLAUDE.md` pointer is updated to match.

## [0.10.0] — 2026-10-04

### Added

- **`meta/loot-options/Party/` holds shared party items**, one copy per PC. It has no README and sits outside the nine-per-character composition rule. Item files use `character: Party` and `player: all`. Documented in `meta/loot-options/README.md`.
- **The Earshot Crystals** (`Party/misc/`), the first party item, `status: confirmed` for Session 29: touch-to-speak telepathy, words only and past language, to one holder in sight or to "all" holders within 300 ft, with unlimited use. Common, per crystal.

### Changed

- `scheduler/sessions/Session 29 The Mistake/`: the session's item is now the Earshot Crystals, looted from Nella's raiders, who carry them but never use them. Nella and a few of her crew keep theirs and can overhear "all" messages, a hidden twist revealed only after many fights with her. Dip's Common is removed, and no personalised item lands in Session 29. The act's `## Loot`, the `S1_LOOT` flow node (now `[-]`), `The Stolen Casks`, `Nella` and todo item 15 follow suit.

## [0.9.0] — 2026-10-04

### Added

- **Loot menu items are `draft` or `confirmed`.** Every item file in `meta/loot-options/` now carries `status: draft`. The DM flips an item to `confirmed`, and adds `confirmed_for: "Session NN Name"`, once it is committed to a specific handout. Confirmed is still not canon; that happens at `/recap`. All 45 existing items start at `draft`.
- **A draft item is never named outside `meta/loot-options/`.** Plans, flow graphs, missions, acts, the todo dashboard, questionnaires and notes refer to a draft by character and slot ("a Common from Dip's folder"). A name in a plan reads as a decision and gets carried forward as one. Only the DM confirms an item; a recommendation does not. Written into `meta/loot-options/README.md` (the canonical home), `meta/rewards.md`, the `/session` reading list, and `meta/flow-graphs.md`'s honesty rules.
- **Act-level loot rules for Act 1.** `scheduler/acts/Act 1 - The Hearth at Ashford.md` gained `## Loot`, which overrides `meta/rewards.md` for the act: the party reaches level 5 by the December finale with levels granted one PC at a time, five Uncommons plus one Rare, surprise handouts, and an item history of at most three sentences. The clash between per-PC levels and the rewards file's announce-the-trigger rule is recorded as unresolved.

### Changed

- `scheduler/sessions/Session 29 The Mistake/`: the raid's Common now goes to Dip, not Iggy, and names no item until one is confirmed. The Second String is no longer the recommendation. Iggy keeps his viol spotlight beat.

## [0.8.0] — 2026-10-04

### Added

- **Every session gets its own folder.** `scheduler/sessions/Session {NN} {Name}/` holds the plan as `Session {NN} {Name}.md`, its flow chart as `_flow.md`, and (for `scope: linked`) its encounter files. The whole folder moves to `historian/sessions/` at `/recap`. Previously only `scope: linked` sessions got a folder and inline ones were a bare file. The main file keeps its folder's name, so `[[Session {NN} {Name}]]` resolves either way. **Breaking for anything that globbed `scheduler/sessions/*.md` one level deep** — see Fixed.
- **`_flow.md` — a per-session flow chart in the repo.** A mermaid graph of one session's scenes, forks and fail paths, living beside the plan it maps and travelling with it into the historian. Not an entity: the `_` prefix keeps it out of `validate.ps1`'s entity checks and the semantic index, and it carries no frontmatter. It is a graduated snapshot of the matching file in the act's flow graph set, which stays the live source and the one `flow-status.py` reads; `/flow --session <n>` regenerates the pair.
- **`entity_md_files()` in `scripts/lib/common.py`** — recursive entity discovery that skips `_*` and `CLAUDE.md`, matching the exclusions `validate.ps1` already applied. Every script reading a session directory now goes through it.
- **A plain-language rule for flow graph labels.** Node labels are written as sentences carrying the runnable detail — the roll, the DC, the round count, who wants what — and branch edges are labelled with the choice in the words a player would use. A node reading `casks or Sable?` is a worse map than one that says two bandits are walking the last cask to a cart while the big one is two rounds from dragging Sable out the door. Recorded in `meta/flow-graphs.md` alongside the snapshot convention.
- **`scheduler/missions/The Stolen Casks.md`** — Act 1's opening mission, covering act sessions 1 and 2 (campaign sessions 29 and 30). The Golden Lioness's undelivered ale is carried off during the raid the party lands in; the party runs the cart down before it reaches a Duskwater fence. Both outcome branches are filled, and Nella escapes both times by design.
- **`scheduler/sessions/Session 29 The Mistake/`** — the first homebrew session plan, for Tuesday 2026-10-06. Five scenes, `state: draft`. Numbered **29 continuous**, not "Session 1": act-relative numbering is shorthand only, and a second "Session 1" would collide with Strahd's and break `session-brief.py`'s counter.
- **Rest Clock initialised for Redwater.** `scheduler/campaign/Redwater.md` gained `## Current State (after Session 28)` with a `### Rest Clock (as of: Session 28)` block. The 2026-10-01 long-rest ruling makes it determinate — the transit *is* the rest — so the clock opens at 0 rounds, 0 short rests, freshly rested, with the 24-hour gate restarting at the transit. The clock was initialised at the season swap, not carried across it; Barovia's rounds stay in `Curse of Strahd.md` for when that season resumes.

### Changed

- `meta/schemas/session.md` — canonical paths rewritten for the folder layout; scene blocks are `### Scene N — [Title]`, not `####`. The old spec nested `####` under `##` and tripped MD001 on every session file, and MD001 is not in the pre-commit hook's auto-fixable set, so the prescribed layout could never pass lint.
- `.claude/commands/session.md` — always creates the session folder; offers `_flow.md` alongside the plan.
- `.claude/commands/recap.md` — moves the session's whole folder to `historian/`, not just the file.
- `.claude/commands/flow.md` — Phase 4 mirrors each designed session's graph into its session folder, with the graduation ask spelled out for sets living under a gitignored working directory.
- `scripts/session-brief.py` — the `## Current State` stamp check now accepts `(after Session N)` **and** `(as of: Session N)`. The two campaign files had drifted to different spellings and only one could satisfy the regex.
- `scheduler/acts/Act 1 - The Hearth at Ashford.md` — `campaign: [[Redwater]]` → `campaign: homebrew`, matching the documented season-axis rule. The Redwater edge survives through `relates_to`. Its `## Open` section no longer claims the missions are unwritten.
- `historian/characters/pcs/Iggy.md` — the viol hook ("decode the unfinished final song trapped in the viol") moved `open` → `seeded`, because the Session 29 plan commits a beat to it. Becomes `paid` at `/recap` if it lands.
- `todo-dashboard.md` — item 15 is down to the loot pick; the mission and session plan it asked for now exist.

### Fixed

- **`session-brief.py` reported the wrong next session.** It computed `max(session_number) + 1` across both session directories, so a planned-but-unplayed scheduler artifact pushed the counter past itself — with Session 29 drafted and Session 28 the last played, the brief announced "Next session: #30" and flagged a false milestone. It now reports the first *unplayed* session and names its existing plan.
- **Four scripts globbed session directories one level deep** and found nothing once sessions moved into folders: `session-brief.py`, `session-state.py`, `todo-brief.py`, `party-status.py`. All four now use `entity_md_files()`. `timeline-data.py`, `timeline-gantt.py` and `get_played_spotlight_sessions()` already recursed.
- `meta/loot-options/` is not short of items. A prior audit recorded Iggy's folder as holding 1 weapon against the documented 3; all five PC folders are full at 3 weapons / 3 armor / 3 misc. The Second String sits in `misc/`, not `weapons/`.

## [0.7.0] — 2026-10-02

### Added

- **`/spitball` — non-committal story idea capture.** `.claude/commands/spitball.md` files a loose idea the moment it is spoken, develops it as far as interest carries, and keeps it searchable for later mining. Built for a phone over `claude remote-control`: the capture rule is **file first, develop second** — the file hits disk on the first turn, before any riffing, so a dropped connection costs nothing, and follow-up turns update that same file. The command is forbidden from interrogating the DM for fields; it infers `subtype`, `campaign` and `target` and is wrong cheaply.
- **`spitball/` — a new tracked folder role.** One folder per target act, keyed to the act's full slug rather than a bare `act-1/` (both campaigns currently have an Act 1), plus `unassigned/` for ideas with no home yet. Tracked in git, unlike `workshop/` and `pitch-log/`, because the whole point is reading them back months later from a different machine.
- **Entity mode.** `/spitball <entity name>` is a lookup rather than a capture: it answers with about four lines on where that entity currently stands — what it is, its situation, the two or three relations that matter, anything unresolved — plus a line naming any spitballs or flow-graph nodes that already reference it, then asks one open question and stops. Nothing is written; the *next* message is the idea, filed with the entity pre-populated in `relates_to`. A name inside a proposition (`what if Nella turns on Bane`) is still an idea, and ties are broken toward filing.
- **`meta/spitball.md`** — frontmatter schema, the five-state lifecycle (`raw` / `developed` / `used` / `parked` / `killed`), the capture rule, and the honesty rules. Nothing is ever deleted: a killed idea is cheaper to keep than to re-think.
- **`scripts/spitball-brief.py`** — the pile filtered by frontmatter: target act, kind, campaign, state, heat. Hides `used` and `killed` by default so the live pile is not buried.
- **Mining routes, all four live.** Spitballs are indexed with `source_dir: spitball` so `semantic-search.py --source spitball` finds them by meaning; `/session` Phase 1 and `/flow` Phase 1 surface the ideas aimed at the act being planned, as candidates only; and `/spitball --promote` lands an idea in the act's flow graph as a `[?]` **open** node — becoming a node is not approval.

### Changed

- `scripts/validate.ps1` — `spitball/` excluded from the link check. Half-formed ideas are expected to name things that do not exist; that is the point of them, and without the exclusion every spitball would break graph validation.
- `scripts/index-entities.py` — `spitball` added to the default `--dirs` and to the orphan-prune guard set.
- `scripts/semantic-search.py` — `spitball` added to `--source` choices, so canon searches can also deliberately exclude it. **A spitball must never surface as if it were canon.**
- `meta/flow-graphs.md` — seventh node class `fail` (dusty red, dashed) for designed setbacks and fail floors. Previously these took the grey `open` class, which means *undesigned* — miscoloring documented work as a gap.

## [0.6.0] — 2026-10-02

### Added

- **`/flow` — act flow graph sets.** `.claude/commands/flow.md` builds or refreshes a folder of mermaid maps for an act: an act spine with one subgraph per session, one graph per designed session, and a payoff-slots graph for undesigned room. Branches are drawn where the design actually forks, fail states route back into the spine instead of dead-ending, and inferred material is marked rather than presented as designed. Regeneration preserves existing markers by node id.
- **`meta/flow-graphs.md` — the conventions.** Id scheme, the seven node classes with their exact `classDef` lines, drawing rules, and honesty rules. Previously these lived only inside one gitignored workshop folder's README, so they could not survive a clone or be reused for a second act.
- **Commitment markers.** Every flow graph node prints `[x]` committed / `[-]` draft / `[?]` open before its id, so the chart doubles as a readiness tracker. `[x]` requires a four-part gate: the DM said so, backing notes exist, no open upstream, and the beat is repo-conformant. **The engine never self-commits** — it proposes, the DM flips. Each graph file ends with a commitment ledger naming the backing source for every committed beat.
- **Node ids are printed in the labels.** A node's visible first line is its literal mermaid node id (`S1_EXAMPLE`), which makes a beat nameable in conversation and findable with a grep — the id is otherwise invisible in a rendered diagram.
- **`scripts/flow-status.py`** — commitment coverage per graph, plus two integrity checks: committed beats sitting downstream of uncommitted work, and labels whose printed id does not match the mermaid node id. Discovers sets repo-wide, or scans one with `--set`.

## [0.5.0] — 2026-10-01

### Changed

- **The world is named: `data/locations/regions/Homebrew World.md` → `data/locations/regions/Aethryn.md`.** **Aethryn** (AITH-rin) — Greek *aithēr* "upper air" + Welsh *bryn* "hill" — chosen 2026-10-01 from a shortlist built on Latin/Greek/Germanic/Welsh roots, deliberately carrying **no** tie to the Whatwill cosmology so the name commits the setting to no biome, faction, or founding event. `"Homebrew World"` and `"The World"` are both kept as aliases, so existing `[[Homebrew World]]` links still resolve; the nine entities that used the old link were repointed to `[[Aethryn]]` anyway. The entity's `state: draft` — held only until the world had a name — is lifted to `stable`.
- **World and campaign names are separate layers.** **Aethryn** is the world; **Redwater** is the first campaign run in it. A later season in the same world gets its own campaign document and does not rename the world.
- **`campaign:` field clarified in `CLAUDE.md`** — the value is the **season axis** (`strahd` / `homebrew`), not the world name and not the campaign document. Everything set in Aethryn stays tagged `homebrew` no matter which campaign runs there, so the 46 existing `campaign: homebrew` entities were left untouched by the rename. This replaces the old `campaign: <new-world-name>` wording, which implied a repo-wide retag on naming day.
- `scheduler/campaign/Redwater.md` — naming note rewritten (both layers now settled), setting link repointed, and the "Name the world and campaign" checklist closed except for the still-missing naming questionnaire.
- `todo-dashboard.md` — item 19 (world has no name) deleted per the open-items-only rule. Item 26 rewritten: `questionnaires/world/naming/world-naming.md` still does not exist and `naming-status.py` still errors, but what it owes now is the *remaining* naming work (regions, factions, provisional map labels), not the world's own name.

## [0.4.0] — 2026-10-01

### Added

- **`meta/rewards.md` filled.** The file was a blank template; every section now carries real rules. Gold is stated as **party totals** calibrated to five PCs at level 4–5 (minor 10–50 gp · standard session 100–250 · major 300–700 · exceptional 1,000–2,500), with a ×2.5-per-tier scaling rule and the base-building numbers (250–500 gp/room, ~25 gp/PC/downtime) named as the anchors they were tuned against. Magic items are scarce-but-present with a Common ceiling and ~one Uncommon per PC per act, strict RAW attunement, and no magic shops — permanent items come from loot, payoff, or a station the party built. Narrative rewards carry a recordability test: if it can't be written into an entity's frontmatter, it was flavour, not a reward.
- **Leveling system decided: hybrid milestone with an announced track** (Jeff, 2026-10-01). The DM decides *when* a level lands and paces it on the fly; naming the next trigger out loud is the part that is **not** optional. No XP bookkeeping, so a roleplay-only session can still level the party. Soft band of 2–4 sessions per level at tier 1–2. This is the standing answer to the Session-28 levelling complaint, and it pairs with the deliberate level-4 hold on arrival — when a level is held, loot carries the weight, and a held level with no item compensation is the failure mode the file names outright.
- **`meta/loot-options/`** — a five-option item menu per PC (Iggy, Dip, Luci, Odibli, Halsby) — one folder per character, with `weapons/`, `armor/` and `misc/` subfolders and **one item per file**, each carrying `class`/`form`/`rarity`/`attunement` frontmatter so the folder can be filtered or scripted without parsing prose. The character's own `README.md` holds the character and player read, pick order, and caveats. Each character gets **one weapon, one piece of armor, three misc**, and every option is stamped for the current **levels 4–5** bracket with rarity, attunement, and an **At 6–8** scaling line. **Items carry no plot** — nothing is tied to a location, NPC, faction, or open thread, so the story picks items rather than items committing the story; where an item comes from is a session-planning decision and is deliberately not recorded. Every option is argued from the character's sheet and the player's observed table behavior, since `meta/players/` is still blank templates. **Not canon and not entities** — `meta/` is outside the entity dirs, so nothing here is validated, indexed, or in the world until it is handed over at the table and canonized.

## [0.3.0] — 2026-10-01

### Added

- **`scheduler/acts/Act 1 - The Hearth at Ashford.md`** — the first homebrew act, filled from the workshop design. The Cael–Marlow feud is the `central_conflict` but runs as discoverable backdrop; the spine is the Golden Lioness foothold and its three-tick stake ladder (10% → 25% → 40%). Carries the act-level difficulty curve (5/10 → 8/10 with opt-in escalation), which lives here and deliberately **not** in the campaign-agnostic `meta/difficulty.md`. Four designed sessions inside the season's eight slots. Missions are still unwritten.
- The Act 1 entity spine, graduated out of `workshop/` into `data/`: [[Ashford]] as a city, [[Aashal-Groon Mellenegon Borak]] ("Asher") as a `tier: lesser` deity, the two feuding lords, Harrow Bane's band, and the four Ashford townsfolk. The Golden Lioness gained `city: Ashford` and an unopened brewery wing **added on top of** its existing character.

### Changed

- **`scheduler/campaign/Homebrew Campaign.md` → `scheduler/campaign/Redwater.md`.** The campaign is named Redwater, after the red/purple border-river the opening act turns on. `"Homebrew Campaign"` is kept as an alias, so existing `[[Homebrew Campaign]]` links still resolve — nothing needs updating. The **world** is still unnamed; that rename, when it comes, applies to `data/locations/regions/Homebrew World.md`.
- Sable Wren's patron reskinned from the unnamed hearth spirit to Asher, the deep-water being under Ashford. Her pact, her tenure, and how she got the building are unchanged.

### Fixed

- **`Act 1 - Placeholder` was retagged `campaign: strahd`.** The 2026-09-30 `/transition` run retagged it `homebrew` on the assumption it would become the first homebrew act — but four Strahd historian sessions (11–14) and the paused mission `Find the Wine Wizard` reference it as their act, so a homebrew tag pointed five Strahd records at a homebrew act. The file is now explicitly a Strahd stand-in, and the homebrew act is a separate file. No Strahd record was edited; their links still resolve.
- **`scripts/session-state.py` reported the wrong party.** It read the party table from `campaign_files[0]` — whichever campaign file globs first, which alphabetically is `Curse of Strahd.md` — so `[PARTY]` listed the paused campaign's four PCs instead of the active campaign's five, omitting Halsby entirely. It now picks the file with `state: active`. Same class of bug as `9fbdbaa`, which fixed it in `session-brief.py` and left this script alone.

## [0.2.1] — 2026-10-01

### Fixed

- `Halsby.md`'s `campaign: homebrew` tag was invisible to every script. `get_frontmatter` in `scripts/lib/common.py` only accepts a scalar line that ends immediately after its value — an inline `#` comment makes the whole line fail to match, so the field is **silently dropped** while still looking correct in the file and in Obsidian. The campaign-separation tag the comment was explaining was the thing the comment broke. Comments moved to full lines above their fields; `level: 4` now parses too.

### Added

- `meta/entity-creation.md` → Obsidian Frontmatter Rules: never put an inline `#` comment on a frontmatter scalar; put the note on its own full line above the field.

## [0.2.0] — 2026-10-01

### Added

- Sub-day timeline placement: optional `daypart` (`dawn|morning|midday|afternoon|evening|night|late`) and `order` (1-based intra-day sequence) sibling fields on events, so the beats a session mints spread across the day instead of stacking on one point. Contract in `meta/calendar-template.md`; inference rules in `meta/events.md`; `/recap` assigns both. Chronicle rows carry them as flag tokens (`daypart=evening order=3`).
- `daypart`/`order` support in `scripts/timeline-data.py` and the interactive renderer (`applySubDayOffsets` in `app/components/charts/_common/helpers/axis.ts`, windows in `calendar.ts`). The mermaid `/timeline` gantt stays day-granular and ignores both.
- Companion affinity: `affinity:` on the creature schema, and affinity scope widened to **PC↔creature-companion** (bi-directional). Backfilled on Bosco and Sergei Rubelgerd.
- Affinity band-crossing → timeline: a nudge that moves a pair into a new band is flagged as an automatic event-promotion candidate in `/recap` Phase 5.5.
- `## Party` roster on `scheduler/campaign/Homebrew Campaign.md`, which had none. All five PCs, with afflictions carried per the Session 28 seam ruling. The roster is the per-season source of truth for party membership; PC files keep only their debut-campaign link.

### Changed

- `/recap` now always sets `in_world_end_date` on the session record — without it the timeline plots the session by real-world `played_date` and it lands in the wrong era.
- `scripts/contribution-balance.py` derives its player list from `meta/players/` instead of a hardcoded four names, so adding a player no longer needs a script edit.

### Fixed

- `scripts/party-status.py` selected the campaign file **first alphabetically** rather than the one with `state: active`, so the active homebrew season read its party table out of the paused `Curse of Strahd.md`.
- The hardcoded player list in `scripts/contribution-balance.py` counted a fifth player's contributions but never rendered their row — 22 existing `contributed_by: kellan` entities had been invisible in the ledger.

## [0.1.0] — 2026-10-01

### Added

- Project versioning: `VERSION` anchor, this changelog, and bump rules in `meta/versioning.md`.
- `scripts/version-check.py` — flags when engine files changed since the last version bump.
- Session-start orientation: agents read `VERSION` + recent changelog entries to report what changed since they last worked here.

This is the engine baseline. Pre-`0.1.0` history is in git.
