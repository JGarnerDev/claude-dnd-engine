*Generated 2026-09-30 by /todo · revised 2026-09-30 after the Session 28 seam pass*

**Who acts:**

- 🤖 — Claude can do it now (name the command)
- 🙋 — needs a human (creative call, manual work outside the engine)
- 🤝 — joint: Claude drafts/runs, Jeff decides or approves
- ⚪ — FYI only, no action needed right now
- ❓ — owner unclear

**Scope:** homebrew campaign only. Jeff is DM; Kellan is a player. All world-building calls — including questions originally handed to other players — are Jeff's.

**Season swap done 2026-09-30.** `/transition` ran: Curse of Strahd paused, Homebrew Campaign active with Jeff as DM and a premise built on Paul's Whatwill cosmology, Act 1 retagged, the Wanderer's Boon made campaign-agnostic, the Barovian wine-wizard mission stood down.

**Semantic index rebuilt 2026-09-30.** 907 entities indexed, restamped at `5214070` — story suggestions now read the post-swap campaign files.

**Session 28 changed the opening.** The crossing the group actually played is not the one Act 1 was designed around: Davian *gifted* the Wanderer's Boon, Odibli triggered it voluntarily, and the party arrived clean. There was no hag and no curse, so the workshop's "Unhoming" cold open is unrunnable. Full reconciliation and prep list: `workshop/first-homebrew-act/notes/the-seam.md`. Items 1–12 below come from it.

**Act 1 is designed, not empty.** Ashford, the Cael–Marlow feud, the Golden Lioness base-building track, the raid, and Sessions 1–2 are all worked out in `workshop/first-homebrew-act/` (gitignored scratch — `/todo` scans can't see it, which is why earlier revisions of this file read as if nothing existed). The remaining work is **graduation and rulings, not design.**

## 🔴 Do soon

Ordered for the first homebrew session (game night Tuesday 2026-10-06). Top items block the ones below them.

### Rulings — nothing below can be finalized first

- **1.** 🙋 **Jeff** — rule the party's resource state on arrival. They crossed with no long rest since Session 24, Odibli at zero spell slots, Dip's rage spent; the raid is calibrated to a party with resources. Recommended: the transit counts as a long rest — the relic's own stated purpose is to bring them somewhere to gather strength. Say it out loud in the first two minutes of play either way.
- **2.** 🙋 **Jeff** — rule the starting level. The encounter build locked level 5 (G19); the PCs are level 4, `level_confirmed: 28`. Recommended: level to 5 on arrival — "return strengthened" is justification already spoken at the table, and it closes the levelling friction Ben raised in Session 28.
- **3.** 🙋 **The group** — vote on season length. Jeff floated 10–14 sessions, Kellan wants 4 to a maximum of 6, and Kellan asked for a vote rather than a ruling. At 4–6 the designed S1–S4 arc *is* the whole season and Act 1 must end at the convergence night with two Stake ticks, not three. Act 1's `closing_state` can't be written until the number lands.
- **4.** 🤝 **Jeff** — reconcile the campaign's central conflict with Act 1's. `scheduler/campaign/Homebrew Campaign.md` reads `central_conflict: "Control of Whatwill"`; Act 1 is a local Cael–Marlow feud with no Whatwill content in it. Recommended: make E15b's nameless Marlow-coin cutout a **Partenariat** agent — one NPC, and the feud's money traces to the Whatwill economy. Alternative is demoting Whatwill to setting texture in the campaign file.

### Build — needed at the table

- **5.** 🤝 **Jeff** — rewrite `workshop/first-homebrew-act/sessions/session-01.md` Scene A. It opens on the Dream Pastry Woman cursing the party out of Barovia, which contradicts canon. Replacement shape is in the seam doc: replay Session 28's last thirty seconds, then a trimmed arrival beat (two stances — Steady / Read, one roll each) that feeds raid initiative exactly as the old Descent did. The Grab lever is moot; nobody crossed with them.
- **6.** 🤝 **Jeff** — retune the raid roster. `notes/session-1-raid-statblock.md` assumes 5 PCs at level 4–5; the party is 4. Drop to 4 bandits plus the big one — unless a cameo guest plays the opener, which changes the math more than the level does.
- **7.** 🙋 **Jeff** — decide whether a cameo guest plays Session 1. Tyler and Skyler are designed as S3/S4 beats, but Jeff mentioned guests generally at the table. Blocks item 6.
- **8.** 🙋 **Jeff** — build the Golden Lioness battlemap (priority): interior plus the exterior yard where the casks were staged. Roll20, per the platform call in Session 28 — the party's assets are already there, Owlbear stays a maybe.
- **9.** 🙋 **Jeff** — build the Ashford town overview map; the post-battle town tour is beat 5 of the session.
- **10.** 🤝 **Jeff** — verify `sessions/session-01-voices.md` covers the four NPCs who actually speak (Sable Wren, the nameless "big one", Mara Tull, Silas Crubb) and reflects the patron swap — Sable's patron is Asher, the deep-water being, not the hearth spirit the pool text still describes.
- **11.** 🤝 **Jeff** — put the base-building proposition on a readable card: Stake starts at 10%, one favor per town-help beat, construction 250–500 gp per room. The numbers exist in F17; they need to be at hand so Sable's offer lands concrete.
- **12.** 🤝 **Jeff** — show the Barovia debt in Session 1. One line does it: the Boon is still in Odibli's hand and doesn't work yet. Without it the season reads as a detour rather than the errand the relic sent them on.

### Graduation — move the designed act into the engine

- **13.** 🤝 **Jeff** — graduate the Session-1 spine out of `workshop/` into `data/` and `scheduler/` on a branch (the explicit gate step — `workshop/CLAUDE.md`). The batch: Ashford as a city entity · the Golden Lioness `city: Ashford` plus the not-yet-open brewery wing, **without** stripping its existing character · Sable's patron swap to Asher, plus the novel `patron` type decision against `meta/graph-settings.md` · Stonemarch and Duskwater · House Cael and House Marlow · Lord Corren Cael and Lady Sorcha Marlow · Harrow Bane with Jorn, Wick and Nella · Mara Tull, Richmond Ellesine, Silas Crubb, Elowen Rimetusk.
- **14.** 🤝 **Jeff** — fill `scheduler/acts/Act 1 - Placeholder.md`. Every field still reads "TBD": central_conflict, goal, opening_state, closing_state (waits on item 3), and the act difficulty curve (5/10 → 8/10, act-level, not `meta/difficulty.md`). Rename the campaign file to **Redwater** in the same pass, keeping "Homebrew Campaign" as an alias.
- **15.** 🤝 **Jeff** — write the first mission, then run `/session` to produce the real Session 1 plan. The workshop beat sheet is a draft, not a scheduler artifact.
- **16.** ✅ **done 2026-09-30** — the four PCs are retagged off `campaign: strahd` (field removed entirely, matching how `/transition` made the Wanderer's Boon agnostic). `level_confirmed: 28` is left as-is because it is still accurate; it needs restamping only when item 2's level ruling lands.
- **17.** 🙋 **Jeff** — fill the `meta/rewards.md` gold table (four empty cells). This is no longer backlog: Jeff floated handing out items instead of levels as his season's progression mechanic, which makes the file load-bearing for Session 1 loot.
- **18.** 🙋 **Jeff** — Roll20 asset prep: tokens for 5–6 bandits and the named NPCs. Party tokens are already in place.
- **19.** 🙋 **Jeff** — the world has no true name yet (still filed as "Homebrew World") and no naming questionnaire exists to answer. Deferred as non-blocking — it never gets spoken in Session 1 unless a player asks what planet they're on — but say the word and I'll propose options from the Whatwill cosmology.
- **20.** 🤝 **Jeff** — Iggy, Luci, and Odibli have no story hooks on file (Iggy is most overdue for the spotlight); a backstory pass lets the planner write scenes for them instead of around them.

## 🟡 Waiting on Jeff's calls

These were handed to players; they're Jeff's now. Nothing outside is blocked on anyone else.

- **21.** 🤝 **Jeff** — the Calenmere sheets look possibly done: Jeff's answers are filled and marked ingested, but the six sheets still read as outstanding. Confirm and close them out rather than re-answering.
- **22.** 🤝 **Jeff** — the world religion questionnaire is unanswered and the religion lore doc stays blank until it is; gods being real and present is a stated setting pillar, so this one reaches the table fastest.
- **23.** 🤝 **Jeff** — the world history/calendar questionnaire is unanswered, and both the calendar and history lore docs are parked behind it; no in-world dates until it lands.
- **24.** 🤝 **Jeff** — the Struck Side / Arc Side questionnaire is unanswered: how far the hemisphere split reaches into world impact, and whether it's labeled on the map or kept as in-world knowledge.
- **25.** 🤝 **Jeff** — the calendar proposal and the Whatwill timeline-dating sheet (originally Paul's) are unanswered; world dating can't be settled without them.
- **26.** 🤝 **Jeff** — three questionnaires the campaign file expects were never created: world magic, world naming, and Kellan's exotic mounts sheet. The magic lore doc is waiting on one of them.
- **27.** 🙋 **Jeff** — `questionnaires/answers/some fucking answers.md` is an empty file; either fill it or delete it so it stops looking like pending input.

## 🟢 Stale records to correct

- **28.** ✅ **done 2026-09-30** — `PROGRESS.md`'s C10 chart entry now carries the superseding half-old/half-new ruling instead of contradicting `DECISIONS.md`.
- **29.** ✅ **done 2026-09-30** — `PROGRESS.md`'s crossing checklist item is checked and rewritten: resolved by play via the Wanderer's Boon, the Unhoming marked dead-letter, and the item now points at `notes/the-seam.md`.
- **30.** ⚪ **anyone** (FYI) — `topics/the-unhoming.md` is now a dead-letter design doc (no hag, no curse, no hag's mark). Keep it for the record; don't plan off it. The affliction carry-over ruling survives — Iggy's shadow and Dip's whispers cross dormant — but Odibli's poison and Dip's mold were cured on screen by Davian and are gone.
- **31.** ⚪ **anyone** (FYI) — the cross-DM flag on the Unhoming ("Barovia worsens each return") is dissolved; there's no longer a claim about Barovia's trajectory needing Kellan's sign-off. His live constraint is narrower: the three seeds are unresolved, and nothing in Ashford should touch Barovia.
- **32.** ⚪ **anyone** (FYI) — the Barovia-side hag's-lair crossing map is permanently struck. The crossing happened on screen at the winery; there is no scene left to build.

## ⚪ Backlog

- **33.** ✅ **done 2026-09-30** — `/rumor` has a pool: 8 rumors seeded in `data/rumors/` (the folder was new; the `rumor` type and its graph colors were already registered, and a flat `rumor` tag was added to `meta/tags.md`). Grounded **only** in already-graduated `data/` lore — the Whatwill factions, the Islifts, Deorum Ostium, The Ashreaches — deliberately no Ashford or Redwater content, since that is still behind the workshop gate. Untagged by campaign, so they're eligible in either season; no `contributed_by`, since these are engine-seeded texture rather than a player submission. Truth values are mixed (2 true/false, 4 partial/unknown) so the information economy has teeth, and each carries a DM-only `truth_detail`.
- **34.** 🤝 **Jeff** — nine map regions still need /region detailing passes (western Struck Side, Caldera's Brace, Kethara, Greywood, The Reach, northern and southwestern waters, the sky layer); Continent C also needs naming before The Ashwall's region link resolves.
- **35.** 🤝 **Jeff** — the Stonemarch/Duskwater regional map is an S2 need (the pursuit vector), not an S1 one; build it after the opener.
- **36.** 🤝 **Jeff** — `meta/difficulty.md`'s five Skill Challenge DC cells are empty. S2's four-stage pursuit needs them; Session 1 does not.
- **37.** 🤝 **Jeff** — [[Tassad]] (the tri-tower and suspended saucer complex) is referenced as the Templar Triumvirate's seat but has no location entity; spawn one when a region hosts it.
- **38.** 🙋 **Jeff** — worldmap labels: name the Struck/Arc Side hemispheres and add a compass rose (skip the hemisphere labels if they should be player discovery).
- **39.** 🙋 **Jeff** — [[The Templar Triumvirate]]'s three tower-guilds (marble, onyx, malachite) have no school portfolios assigned; the faction reads as generic until each tower gets its limited set of magic schools.
- **40.** 🙋 **Jeff** — [[Grand Archon]] exists only as a titled seat, with no name, race, personality, or sheet; fill the person when the office matters at the table.
- **41.** 🙋 **Jeff** — does the Caldera need an island rim, or does it sit on an existing landmass?
- **42.** 🙋 **Jeff** — the four player files in `meta/players/` are blank templates; until they're filled, session planning can't lean on what each player actually enjoys.
- **43.** 🙋 **The party** — the group is still just called "The Party"; get them to pick a name.
- **44.** 🤝 **Jeff** (engine QA) — `.template-sync` manifest lists deleted PowerShell scripts (`scripts/lib/common.ps1`, `scripts/timeline-data.ps1`, `scripts/timeline-gantt.ps1`, removed in the PS→Python migration) and omits their `.py` replacements. Manifest has drifted across every migration group; needs one cleanup sweep to drop the dangling `.ps1` entries and add the ported `.py` files. Surfaced reviewing PR #10 (2026-07-01).
- **45.** ⚪ **anyone** (FYI) — the geography and magic lore docs are drafted but unfinished; calendar, history, and religion are blank pending items 22–23 and 26.
- **46.** ⚪ **anyone** (FYI) — 19 broken cross-references, all placeholder geography names (Calenmere Basin, Continent B/C, Sub Continent A/C, unnamed rivers and bays); they resolve as the map gets named.
- **47.** ⚪ **anyone** (FYI) — 15 group design ideas are on the wishlist and none have been used yet; worth a skim when shaping Act 1.
- **48.** ⚪ **anyone** (FYI) — the party still owes Davian Martikov three stolen seeds, and six Barovian threads stay open (the Dream Pastry Woman, Gertrude, Rose, Thorn, and Lady Wachter's daughter missing; Doru transformed). Kellan's to carry when the Strahd season resumes — not homebrew work.
- **49.** 🤝 **Jeff** (engine QA) — `.git/hooks/pre-commit` holds an old mixed-commit warning hook (engine vs. campaign files staged together) that never runs: `core.hooksPath` points at `.githooks`, so the Markdown auto-fix hook runs instead. Either fold the mixed-commit check into `.githooks/pre-commit` so the guard works again, or delete the dead file so it stops looking active. Surfaced 2026-09-30 while checking why the dashboard's numbering was at risk.
