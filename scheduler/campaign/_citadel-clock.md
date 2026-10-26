# The Citadel Clock (as of: Session 30)

DM-only. Not an entity. Tracks [[Odibli]]'s casting in Aethryn, whether [[The Citadel]] senses it,
and what the DM can do with the results. The `_` prefix keeps it out of `validate.ps1` and the
semantic index. **Update it at every homebrew `/recap` Odibli plays in, and restamp the header even
when nothing was sensed** (the engine's stamp pattern).

## Engine

A campaign tracker: `/transcript`, `/recap` and `/session` read every `scheduler/campaign/_*.md`
file with an `(as of: Session NN)` header and follow this section. Only homebrew sessions Odibli
plays in.

- **`/transcript` mines:** every spell Odibli casts (leveled or cantrip, with slot level when said)
  and every natural 1 on a spell attack or spell-related d20. Write them under `### Citadel Clock`
  in the inbox note's `## Trackers`, marked `(?)` when unsure. Hidden d6 rolls are not on the
  recording.
- **`/recap` asks:** confirm the cast list, then the DM's hidden d6 result for each leveled spell
  (a 1 = sensed). The DM may say "didn't roll"; log that. Write the session's cast-log block,
  update the clock (three sensed = teardown, reset to 0), restamp the header, and name any ideas
  below the new clock state makes ready, without marking them used.
- **`/session` checks:** the clock and the ideas not marked used. Surface at most one ready idea as
  a light suggestion. If the clock is at 2 / 3, flag that the next sensed cast brings a teardown.
  Remind the plan's `For /recap` list to log Odibli's casts.

## The rule (Jeff, 2026-10-25)

Miguel set the premise (his magic is less reliable here, and each cast risks the Citadel sensing
it) and left the specifics to the DM. Todo #80, settled:

- **Cantrips are never sensed.**
- **Each leveled spell:** roll a d6 (DM, hidden). **A 1 means it was sensed.** Rituals and free
  racial casts (Speak with Animals) count; they are still his magic.
- **Each sensed cast:** he feels a brief cold. Nothing else at the table.
- **Three sensed casts:** the Citadel's next teardown attempt reaches him. The cold, then the
  quiet, and his narration goes flat (his spotlight hook). The clock then resets to 0.
- **Spells never fail.** "Less reliable" is flavor only: a flicker, a half-beat delay, a glyph
  that wobbles.
- Who is reaching: [[The Original Odibli]], [[Berle Kempwick]] and [[Elspeth Moorlin]], in
  secret. [[Wendrick Schulden]] does not know. Odibli knows none of this.

## The clock

- **Sensed casts toward the next teardown: 0 / 3**
- Teardowns that have reached him in Aethryn: 0 (the Session 10 one, in Barovia, was the first)

## Cast log

One block per session. Leveled spells get their d6; cantrips are counted, not rolled. **Spell 1s**
are natural 1s on his spell attack rolls (and any spell-related d20 he rolls), tracked separately
from the d6 as fuel for the ideas sheet. They don't trigger anything on their own.

### Session 29 (before the rule; not rolled)

- Leveled: Hold Person (2nd) — not rolled
- Cantrips: Fire Bolt ×1
- Spell 1s: **1** (Fire Bolt at the crossbowman)

### Session 30 (before the rule; not rolled)

- Leveled: Speak with Animals (to Sergei; ritual, slot or free cast unconfirmed) — not rolled
- Cantrips: Prestidigitation ×1 (smothering the yard fire)
- Spell 1s: 0

### Session 31

- Leveled: `<spell — d6 result>`
- Cantrips: `<count>`
- Spell 1s: `<count>`
- Sensed: `<n>` · Clock after: `<n> / 3`

## Ideas sheet

Things to drop in mid-session or hold for a twist, keyed to what the log shows. Mark each one
**used: Session NN** when it lands, and add new ones as they occur. None of this is canon until
played.

### On a sensed cast (any)

1. **The ink runs.** That night his journal's newest page has bled, one line smeared as if wet.
   He wrote it in dry ink.
2. **A stranger's glance.** Someone in the room looks up the moment he casts, then back down. It
   means nothing, or it is the first time the Citadel has had eyes nearby.
3. **Halsby notices.** Halsby already reads Odibli as "not really there". On a sensed cast, Halsby,
   standing close, feels the cold pass off Odibli and nobody else does. Fuel for Kellan's wished-for
   secret between them.

### At 2 / 3 (building)

4. **Lines he didn't write.** A journal entry in his own hand that he has no memory of writing,
   short and procedural: a date, a reading, a number. It's the original's habit, coming through
   (his "pages in my handwriting" hook).
5. **The familiar feeling sharpens.** A street, a phrasing or a smell he knows without knowing why
   (his hook), landing right after the cast, as if the reach brought it with it.

### At 3 / 3 (the teardown)

6. **The quiet.** The cold, then nothing. Ask Miguel to play Odibli flat for a scene: no
   narration, no tales. Let the party notice before he does.
7. **A cost to someone else.** The teardown misfires around him, the way Session 10 left the party
   "not put back quite right". One small, strange, temporary wrongness on whoever is closest.
   Careful: Jeff ruled 2026-10-25 that Iggy's and Dip's afflictions are not Citadel residue, so
   don't wake those.

### On spell 1s

8. **Bad luck has a pattern.** If his spell 1s pile up (Session 29 already has one), the table
   will feel it before the fiction does. Pair a spell 1 with idea 1 or 2 to make it feel like
   something is pushing back.

### Plot twists, longer fuse

9. **Berle goes over to the Master** (his hook) after a teardown fails in Aethryn. Now the whole
   Citadel knows a copy is loose, and the secrecy that protected Odibli is gone.
10. **The original finds where he is** (his hook "the real Odibli detects his magic"). Rather than
    tearing him down at once, they are tempted to study him first (his hook): an observer arrives
    in Ashford.
11. **[[Elowen Rimetusk]] feels the reach.** If her scene comes after a sensed cast, she sees the
    hand reaching for "the other one". It sharpens her "you're not all here" line.
