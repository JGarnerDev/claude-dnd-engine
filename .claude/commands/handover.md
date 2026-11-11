---
description: "Hand a world to a new DM (a DM rotation, not a season swap): set the new DM, step their PC out, choose what passes on, and write the incoming DM a one-page handover."
argument-hint: "[incoming DM]"
---

# Handover

Walk the outgoing DM through a **DM rotation**: the same world passing to a new DM. Read
`meta/dm-rotation.md` once first; it holds the rules (rotation versus season swap, `dm:` as the only
record, the `away` state, the handover page, held-back truths). A season swap between worlds is
`/transition`, not this.

**One question per message**, 2–4 options with the recommended one first, room for notes (root
`CLAUDE.md` → Working Rules). **Write nothing until Phase 6 is approved.** Never commit without a
go-ahead.

---

## Phase 1 — Gather

Run `uv run scripts/handover-brief.py`. It is the whole signal set: campaign and DM, campaign-file
sections, PCs not active, trackers, the mysteries answer key (with any already held back), PC arcs,
open threads, and the dashboard items naming the outgoing DM. Read a file only when a later phase
needs its detail.

If the dashboard list is long, say so: a rotation is a good moment to close finished items, and the
outgoing DM may want a `/todo` regeneration first.

## Phase 2 — Who and how

Ask, one at a time:

1. Who is the incoming DM? (Use the argument if given; they need a `meta/players/<name>.md`.)
2. A new campaign file for them, with the current one set `on-hiatus`, or do they take over the
   current campaign file with `dm:` changed? Recommend asking what they want; if they plan new acts
   with their own premise, a new file keeps the threads tidy.

## Phase 3 — The incoming DM's PC

Ask which PC, if any, steps out while their player DMs, and the in-world reason in one line. That PC
goes `state: away` (`meta/schemas/character-pc.md`), with the reason in the body.

## Phase 4 — What passes on

For each DM-only truth (each answer-key entry, and each tracker's secrets: what the Citadel Clock is
building to, what reputation tiers unlock, any `DM-only` block the brief surfaced), ask once, as a
list the outgoing DM answers by number: pass on (default) or hold back. A held-back entry gets the
marker line from `meta/dm-rotation.md` → Held back in its own file. Say plainly that holding back is a
courtesy, not privacy.

## Phase 5 — The dashboard

Show the dashboard items naming the outgoing DM, numbered as the brief prints them, and propose
re-owning each to the incoming DM. Keep items that stay the outgoing DM's as a player or a helper
(their own PC's wishes, map work they do by hand). The outgoing DM answers by number ("all but 34,
67").

## Phase 6 — The handover page

Draft `scheduler/campaign/_handover.md` in the shape `meta/dm-rotation.md` → The handover page sets:
six short sections, about a page, plain and scannable, pointing at files rather than copying them.
Read `meta/prose-style.md` once for the DM-facing register. Show it in chat. On approval, write in
this order:

1. The campaign: change `dm:`, or create the new campaign file (schema `meta/schemas/campaign.md`)
   and set the old one `on-hiatus`.
2. The PC to `away`, with its reason.
3. The held-back markers.
4. The dashboard: re-owned items, and the Scope line naming the new DM.
5. `_handover.md`.

## Phase 7 — Close

Run `uv run scripts/session-start.py` and show its `DM:` line, then `.\scripts\validate.ps1 -Quiet`
(report only errors in files this flow wrote). List what changed, and offer the commit. Suggest the
incoming DM read `_handover.md`, then fill their `## Working with` section in `meta/players/`.
