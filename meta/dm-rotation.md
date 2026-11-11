---
type: meta
tags: [guideline]
---

# DM Rotation

How the engine changes DMs. The single source of truth for rotations; `/handover` runs the flow and
points here for the rules.

## What a rotation is

A **DM rotation** passes the same world, and the same `campaign:` tag, to a new DM: Jeff ran
Redwater in Aethryn, and Ben runs the next Aethryn campaign. It is not a **season swap**, where the
party moves between worlds (`/transition`, which the engine calls the "handoff"). The two can meet:
if a Strahd season sits between two Aethryn DMs, the rotation happens when the party swaps back, and
`/transition` hands off to `/handover` then.

## Who the DM is

The active campaign file's `dm:` field (`scheduler/campaign/`, `meta/schemas/campaign.md`) is the
only record of who the DM is. The session-start orientation and `session-brief.py` print it, and
`/todo` addresses the DM by it. Nothing else stores the DM's name.

- **Instructions use role wording.** Commands, meta rules and scripts say "the DM", never a name, so
  they stay right through every rotation.
- **History names stay.** A name and date on a decision (`Jeff, 2026-10-07`), a player's name on
  their own character, a speaker label, a changelog entry. These record who did what and never get
  rewritten.

## The incoming DM's PC

A player who takes over as DM usually steps their PC out of the story. Set that PC `state: away`
(`meta/schemas/character-pc.md`) with a one-line reason in the body (Dip leaves on pilgrimage).
The briefs and spotlight skip an `away` PC, and its PC arc pauses (`meta/pc-arcs.md`). Set it back to
`active` when the PC returns.

## The handover page

`scheduler/campaign/_handover.md`, written once per rotation for the incoming DM. About a page,
plain and scannable, built from the engine's own records (`scripts/handover-brief.py`), never from
memory. It holds:

1. **Where the story stands.** Last session played, the cliffhanger, the party's place and
   condition, the Rest Clock.
2. **Open threads,** most pressing first.
3. **What the DM now knows.** The answers behind the Mysteries & Loose Ends slide, what each tracker
   is counting toward, what reputation tiers unlock. Each in a line, pointing at the file that holds
   the full answer.
4. **The PCs.** Each PC arc in a line; any PC `away`, and why.
5. **What's unfinished.** The dashboard items the outgoing DM leaves to the incoming one.
6. **Held back.** How many truths the outgoing DM kept, and "ask `<outgoing DM>`". Never their content.

It is not a tracker: no `(as of: Session NN)` header, so `/recap` and `/session` skip it. The `_`
keeps it out of `validate.ps1` and the search index, so a player at the keyboard can't surface it by
searching. A later rotation replaces it.

## Held back

The outgoing DM may keep a DM-only truth for when they run the world again: an answer, a twist, what
a tracker is building to. A held-back entry gets one marker line in its own file:

```markdown
**Held back** (Jeff, 2026-11-24): ask before using.
```

`handover-brief.py` counts these, and the page names only the count. **This is a courtesy, not
privacy.** Anything in a shared repo can be read. Material that must stay truly private belongs
outside the repo (todo 99).

## What a rotation changes, and what it doesn't

- **Changes:** the campaign file's `dm:` (or a new campaign file, the old one set `on-hiatus`), the
  incoming DM's PC to `away`, dashboard items re-owned, the dashboard's Scope line, the handover
  page.
- **Doesn't:** canon, tags, PC arcs' content, the trackers' content, `VERSION`. A rotation is
  content, not an engine change.
