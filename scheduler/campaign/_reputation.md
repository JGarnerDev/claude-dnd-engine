# Reputation (as of: Session 33)

DM-only. Not an entity. What each fame and infamy tier unlocks, the rewards already given, and
where each PC stands. Scores and rules: `meta/reputation.md`. The deed ledger is
`historian/sessions/_reputation.md`. The `_` prefix keeps this out of `validate.ps1` and the
semantic index. **Restamp the header at every homebrew `/recap`, even when no deed landed** (the
engine's stamp pattern).

## Engine

A campaign tracker: `/transcript`, `/recap` and `/session` read every `scheduler/campaign/_*.md`
file with an `(as of: Session NN)` header and follow this section. Homebrew sessions only.

- **`/transcript` mines:** deed candidates per PC under `### Reputation` in the inbox note's
  `## Trackers`. One bullet per moment: fame or infamy, the place where word would spread, the
  multipliers that might apply (named foe, witnesses, style, underdog), and a timestamp. Only
  moments people saw or will hear about. Mark unsure ones `(?)`.
- **`/recap` asks:** nothing extra. The Reputation step (after stats) scores the deeds, writes the
  ledger, and brings tier crossings here: propose one reward per crossing from the table below,
  fitted to the PC and place. On approval, write it as a frontmatter change on its entity, log it
  under Rewards given as `unspent`, update Current tiers from
  `uv run scripts/reputation-standings.py --session {NN}`, and restamp.
- **`/session` checks:** the Rewards given marked `unspent`, plus the local tiers for the places the
  next session visits. Surface at most two as light suggestions ("Ashford knows Dip: Noticed.
  Unspent: the sheriff's favor"). Mark a reward `spent` at `/recap` once it's played.

## Reward table

A reward *kind* per tier, from `meta/rewards.md` § Narrative Rewards. `/recap` picks something
concrete of that kind. Local rewards are tied to the place that crossed.

1. **Unknown / Unremarked:** nothing.
2. **Noticed / Suspect:**
   - Fame: world, a stranger buys a round and asks for the story. Local, a better price or a
     spare room.
   - Infamy: world, guards check papers twice. Local, a fence or a thug offers work.
3. **Talked About / Whispered:**
   - Fame: world, a small **favor** from an NPC who heard. Local, a tavern names a drink after
     the PC.
   - Infamy: world, a small **secret** sold to the PC by someone hoping to stay on their good side.
     Local, shopkeepers pay a little to be left alone.
4. **Known / Disreputable:**
   - Fame: world, **access**, a seat at a minor lord's table. Local, a guard captain owes a favor.
   - Infamy: world, a rival faction makes contact. Local, a safe house that asks no questions.
5. **Respected / Notorious:**
   - Fame: world, a **title** in common use ("the Drakefeller"). Local, standing with the town's
     ruling faction moves up a band.
   - Infamy: world, **leverage**, a frightened official does what they're asked. Local, the watch
     looks away once.
6. **Celebrated / Feared:**
   - Fame: world, a patron offers a commission or sponsorship. Local, a free room for life.
   - Infamy: world, enemies hesitate, and named foes negotiate before they fight. Local, tribute.
7. **Acclaimed / Reviled:**
   - Fame: world, an audience with a regional power. Local, a statue, a song or a feast day.
   - Infamy: world, a bounty-hunter faction declines contracts on the PC. Local, a gang swears
     loyalty.
8. **Famed / Dreaded:**
   - Fame: world, **titles and deeds**: land or an ownership stake. Local, the town defends the PC
     by name.
   - Infamy: world, a lord pays to keep the PC out of their lands. Local, the town empties when the
     PC arrives.
9. **Storied / Accursed:**
   - Fame: world, strangers recognize the PC on sight, everywhere. Local, the PC can call a militia.
   - Infamy: world, a cult or order takes the PC as its emblem. Local, the place is named for the
     PC's crime.
10. **Legendary / Infamous:**
    - Fame: world, a ballad that outlives the PC, and a crown or council opens its doors. Local, the
      place becomes the PC's home base if they want it.
    - Infamy: world, kingdoms move against the PC or bargain with them. Local, the place is
      theirs by fear.

## Rewards given

Backfilled at the engine build (2026-11-03), from Session 29's crossings.

- **S29 · Dip · Noticed (fame, world)** · `unspent`: at the next tavern stop, a stranger buys Dip a
  round and asks for the story of the three raiders.
- **S29 · Dip · Noticed (fame, Ashford)** · `unspent`: Richmond Ellesine, the blacksmith, gives
  Dip a better price. Not yet written to his file: he's still in the `data/` pool. Write it into
  his `relates_to` when he's canonized.
- **S29 · Halsby · Noticed (fame, world)** · `unspent`: a traveler on the road has heard of "the
  missile and the horse" and asks Halsby to tell it.
- **S29 · Halsby · Noticed (fame, Ashford)** · `unspent`: Silas Crubb waives the shoeing on
  Halsby's borrowed horse when it comes back. Written to `Silas Crubb` `relates_to`.

Session 33 crossings, toned down by the DM (2026-11-10): it is only the party's second day in
Aethryn, so word hasn't left the waystation. The world and Duskwater crossings are `held` until
fleeing crew could plausibly have carried the story; the waystation rewards are in-scene flavour
only (no free hits, no surrenders).

- **S33 · Dip · Suspect (infamy, The Waystation)** · `unspent`: the crew give Dip room. The first
  time he steps toward one of them in Session 34, that crewman backs off a step before standing.
- **S33 · Halsby · Suspect (infamy, The Waystation)** · `unspent`: Clatter keeps one eye on Halsby.
  When Halsby raises the Spear, Clatter shouts "Lightning man!" and the crew flinch.
- **S33 · Dip · Suspect (infamy, world)** · `held`: nobody beyond the waystation has heard yet.
- **S33 · Dip · Suspect (infamy, Duskwater)** · `held`: as above.
- **S33 · Halsby · Suspect (infamy, world)** · `held`: as above.
- **S33 · Halsby · Suspect (infamy, Duskwater)** · `held`: as above.

## Current tiers

From `reputation-standings.py`. Rewritten at each `/recap`.

Party fame 1,960 (Unknown).

- **Dip:** fame 4,791 Noticed · infamy 8,450 Suspect. Ashford: Noticed. The Waystation: infamy Suspect. Duskwater: infamy Suspect (held).
- **Halsby:** fame 3,616 Noticed · infamy 7,345 Suspect. Ashford: Noticed. The Waystation: infamy Suspect. Duskwater: infamy Suspect (held).
- **Luci:** fame 850 Unknown · infamy 978 Unremarked.
- **Iggy:** fame 544 Unknown · infamy 0.
- **Odibli:** fame 0 · infamy 0.
