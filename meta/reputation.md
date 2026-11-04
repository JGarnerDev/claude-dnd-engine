---
type: meta
tags: [guideline]
---

# Reputation

**Reputation** is how well known each PC is in Aethryn, scored as two numbers: **fame** for
admired deeds and **infamy** for feared or condemned ones. Scores are big, odd arcade numbers that
climb toward a million by level 20. Players see them on a slide in the recap deck. The DM alone
sees what each tier unlocks.

Read once per task by `/transcript` (spotting deed candidates), `/recap` (scoring and approving
deeds, tier rewards), `/session` (unspent rewards), and anyone editing these rules.
`scripts/lib/reputation.py` reads the catalog and the ledger; `scripts/reputation-standings.py`
prints the standings; `scripts/session-cards.py` hands them to the runner's slide
(`app/pages/home/session/reputation.ts`). The DM-only tier rewards live in the campaign tracker
`scheduler/campaign/_reputation.md`.

## Rules

- **Homebrew only.** Strahd is record-only, so it keeps the old prose-only fame beat in `/recap`
  and gets no score.
- **DM-approved.** `/recap` proposes deeds with the points worked out. Nothing counts until the
  DM approves it.
- **Two tracks, both up-only.** Fame and infamy never offset each other: a PC can be both
  Celebrated and Feared. Nothing ever subtracts.
- **Rewards stay DM-side.** Players see scores, tier names and deeds. The reward table, its
  proposals and the approved rewards never reach the deck.
- **Not standing, not renown.** Standing (`meta/rewards.md`) is how a place *feels* about the party,
  kept in `disposition`/`affinity`. Reputation is how *well known* a PC is. A PC can be famous in a
  town that hates them. "Renown" belongs to military units (`meta/warfare.md`).
- **Never "hall of fame".** That's the lifetime stat leaders (`meta/stats.md`).
- **Not "contribution".** That word means a player's submitted entities (`data/CLAUDE.md`). A
  scored entry is a **deed**.

## Terms

- **Deed:** one approved ledger entry: PC, session, track, scope, size, multipliers, level,
  points, and one line on what happened.
- **Scope:** the one place where word spread, named by a historian location.
- **World score:** a PC's total on one track, all deeds summed at full points.
- **Local score:** a PC's total at one place, with the diluted rollup (below).
- **Party fame:** the average world fame across the PC roster (`historian/characters/pcs/`,
  homebrew or untagged). Derived, never stored.
- **Tier:** a named band of a score (see Catalog). It's reached when the score meets the threshold.
- **Crossing:** a session that lifts a world or local score into a higher tier.
- **Top deeds:** up to 3 of last session's deeds with the most points, per PC.
- **Known for:** one line per track, ten words at most, on what a PC is known for. It's written
  the way the people at the scope would say it, and it sums up the track, not one deed. It carries
  forward until a later session rewrites it.

## Scoring

`points = size base × level² × multipliers`, rounded half up to a whole number.

- **Size:** the engine proposes it, the DM confirms. A minor deed is a local story; a legendary
  one is a ballad.
- **Level:** the PC's level at the time of the deed, written into the deed so later level-ups
  don't change history.
- **Multipliers** stack, and each one is a call the DM approves:
  - **named foe:** beat or outwitted a named NPC, not a generic enemy
  - **witnesses:** a crowd, a town or a gossiping faction saw it
  - **style:** done in a way the table will retell
  - **underdog:** the party was outmatched (a deadly fight, outnumbered, out of resources)
- **Infamy** uses the same formula on its own track.
- **Cap:** up to 3 deeds per PC per session, fame and infamy combined. Most sessions give a PC 0–1.
  Never invent a deed to fill a slot.
- **Stored, not recomputed.** Points are written at approval. If the catalog changes later, old
  deeds keep their points.

### Local rollup

Full points at the scope, ½ at its parent, ¼ at the grandparent, halving at each step up. **Parent**
is the location's `global_location:` field. The chain stops where a link is missing, so a deed
scoped to a shop with no `global_location:` stays at the shop. World score always takes full
points.

### Tiers

10 tiers, about one every 2 levels. The thresholds are the expected total at each even level before
multipliers, so a stylish party runs ahead of them. Fame and infamy share the thresholds and have
their own names. Local scores use the same ladder.

## Catalog

The lib reads this block. One line per value: `size | <id> | <base>`, `mult | <id> | <factor> |
<label>`, `tier | <rank> | <threshold> | <fame name> | <infamy name>`. Changing a value never
rewrites stored deeds.

```text
size | minor     | 17
size | notable   | 113
size | major     | 457
size | legendary | 1999
mult | named-foe | 1.5  | Named foe
mult | witnesses | 2    | Many witnesses
mult | style     | 1.3  | Style or absurdity
mult | underdog  | 1.75 | Underdog
tier | 1  | 0       | Unknown      | Unremarked
tier | 2  | 3333    | Noticed      | Suspect
tier | 3  | 18181   | Talked About | Whispered
tier | 4  | 54321   | Known        | Disreputable
tier | 5  | 122222  | Respected    | Notorious
tier | 6  | 231231  | Celebrated   | Feared
tier | 7  | 390390  | Acclaimed    | Reviled
tier | 8  | 609609  | Famed        | Dreaded
tier | 9  | 897897  | Storied      | Accursed
tier | 10 | 1265265 | Legendary    | Infamous
```

## Ledger

One file, `historian/sessions/_reputation.md`. The leading `_` keeps it out of validate, the index
and the inventory. Not an entity, no frontmatter, no `[[wikilinks]]`: the scope is the location's
plain name.

- Text before the first `##` is a DM note.
- `## Session <n>` per homebrew session, newest at the bottom. `### <PC>` per PC under it, using the
  short name as the stats ledger does (`Iggy`, `Odibli`).
- One bullet per deed, with multipliers joined by `×` and points written with commas:
  `- <fame|infamy> · <scope> · <size> [× <mult>…] · lvl <n> = <points>: <what happened>`.
  A longer description may wrap onto indented continuation lines.
- A session with no deeds gets no section. Scores still show; the slide just has no deeds.
- **Known-for lines** go under the PC as `- known · <fame|infamy>: <ten words at most>`, at most
  one per track per session. The latest one up to a session is what shows; when a PC has no
  deeds that session, the `### <PC>` block may hold only these lines. Rewrite one when a new
  deed changes the story, not every session.

```markdown
## Session 40

### Dip

- fame · Ashford · notable × named-foe × witnesses · lvl 4 = 5,424: Felled the raider
  captain in the market square while half the town watched.
- infamy · Ashford · minor · lvl 4 = 272: Threw the captain's body in the town well.
- known · fame: Dropped the raider captain in front of half the town.
- known · infamy: The one who put a raider in the well.
```

The lib warns when a deed's stored points don't match the formula, when its scope names no
historian location (that deed still counts, with no rollup), when the session isn't homebrew, and
when a known-for line runs over ten words.

## Rewards

The tier → reward-kind table, the reward log and the current tiers live in the DM-only tracker
`scheduler/campaign/_reputation.md`. Reward kinds come from `meta/rewards.md` § Narrative Rewards
(favor, standing, access, secrets and leverage, titles and deeds). Its test applies: every reward
is written as a frontmatter change on some entity.

- **World crossing:** a PC reward of that tier's kind, fitted to the PC.
- **Local crossing:** a perk tied to that place (a free room, a guard who looks away).
- **Infamy** kinds lean toward fear and leverage: doors open because people are scared.

## Slide

One reputation slide in the recap deck, after the achievement slides and before the stats slides
(`meta/recap-slides.md`). Generated by the runner from the ledger, never written into `_slides.md`.

- **Header:** party fame.
- **Per PC:** fame and infamy, each with its tier name and the gain since last session (a track
  at zero is left out). A PC with nothing on either track is left out.
- **Under each PC:** the known-for line for each track that has a score, then that session's top
  deeds with their points.
- **Tier-up:** a banner naming the new world tier. Never the reward.
- **Party-safe:** deed and known-for lines follow the names check in `meta/recap-slides.md`.
