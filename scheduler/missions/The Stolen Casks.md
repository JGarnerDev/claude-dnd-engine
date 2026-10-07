---
# --- MANDATORY ---
name: "The Stolen Casks"
type: mission
campaign: homebrew
exists: false
state: active
tags:
  - mission

act: [[Act 1 - The Hearth at Ashford]]
objective: "Get the Golden Lioness's stolen casks back. Nella's crew takes the new brewery wing's delivery during the raid the party lands in; the mission ends when the casks are recovered, bought back, or written off for good."
hook: "The party arrives in Ashford mid-raid and saves Sable Wren, but the ale is already gone southeast on a laden cart. Sable's unopened brewery wing is the only thing she owns outright, the delivery was not paid for yet, and the party has just been offered a provisional share in the building. The casks are the first thing that share is worth defending."

# --- OPTIONAL ---
sessions:
  - [[Session 29 The Mistake]]
locations:
  - [[Ashford]]
  - [[The Golden Lioness]]
key_npcs:
  - "[[Sable Wren]] (whose casks they are; makes the Stake offer that gives the party a reason to care)"
  - "[[Nella]] (took them; escapes clean in the raid and again at the camp, both by design)"
  - "[[Silas Crubb]] (lends the mounts that make the pursuit possible — a favor debt, not a gift)"
obstacles:
  - "The party has no horses, no money and no standing in Ashford when the cart leaves"
  - "A laden cart is slow, but only a party that reads the ground well catches it before Duskwater"
  - "Nella fights from overwatch and never enters the melee; the mook fight and the sniper duel are two layers of one scene"
  - "She has a pre-set escape ready before the party ever arrives"
success_consequences: "The casks come home on the cart. That is the second Stake deed, banked until base-building resumes in Ashford, and the brewery wing has stock to open with. The party also comes back holding what the camp gave up: the band is far bigger than one crew, and it answers to a man named Harrow Bane."
failure_consequences: "The cart reaches a fence in Duskwater. The casks are not destroyed — recovering them becomes a costlier beat later (buy-back through the fence, or a riskier lift), so momentum survives but a price is paid. Sable eats the loss on a delivery she had not finished paying for, and the Stake ladder starts one deed behind."
reward: "Bandit gear and camp coin. One Common magic item hidden at the waystation, ideally a personalised candidate for whichever PC is up on spotlight rotation. Narratively: the second Stake deed, Harrow Bane's name, and one deniable Marlow breadcrumb."
relates_to:
  - "[[Act 1 - The Hearth at Ashford]] (the act this opens)"
  - "[[Harrow Bane]] (the name the camp gives up; no face yet)"
  - "[[Lady Sorcha Marlow]] (pays for the raids; reachable only through the breadcrumb)"
  - "[[Wick]] (hit the town's other half the same night; not part of this mission)"
importance: major
active: false
description: "Act 1's opening mission. Nella's crew carries off the Golden Lioness's undelivered ale during the raid the party lands in; the party runs the cart down before it reaches Duskwater. Two sessions — the raid, then the pursuit. Nella escapes both times on purpose."
---

Campaign: [[Redwater]] | Act: [[Act 1 - The Hearth at Ashford]] | Given by: [[Sable Wren]]

## Objective

Recover the casks [[Nella]]'s crew took from [[The Golden Lioness]]'s unopened brewery wing.

The casks are a delivery Sable Wren has not finished paying for, staged in a wing that is
built but undefended. They are also the cheapest possible proof that the party's provisional
share in the building means something — which is why this, and not the feud, is Act 1's
opening errand.

## Hook

The party lands in [[Ashford]] in the middle of a raid. By the time they can act, **the ale is
already gone** — Nella and half her crew left with the bulk of it, and what is in front of
the party is the remnant shaking Sable down. Saving Sable is the deed that earns the first
Stake tick; the casks are what the party is still owed afterward.

Sable does not have to ask twice. She is running the place alone, her own crew has not
arrived, and the stock was the wing's whole reason to open.

## Shape — two sessions

- **Session 1, the raid.** The casks leave regardless; Nella is clear at distance by design.
  What is live is the race at the near end — two bandits hauling the last cask toward a cart
  while the big one works Sable over. The party cannot cover both ends. Whichever they pick,
  they end the session with the trail and without the ale.
- **Session 2, the pursuit.** The cart trail reads plain at the ford, southeast toward
  Duskwater. Mounts borrowed from [[Silas Crubb]], a four-stage chase where failures cost
  lead but never the trail, and a drover's waystation where the cart is parked with the casks
  still loaded. Approach is the party's call: night heist, assault, parley, or trickery.

The mission resolves at the end of Session 2 — casks recovered, or gone to a fence and owed
back later.

## [[Nella]] escapes twice, on purpose

Both escapes are designed, and the second must read as her skill rather than protection. She
loses the fight and steals nothing the second time; the escape is flight from a defeat, with
a rigged crossing and a cached horse the players should be able to *see* she prepared. Twice
escaped commits the third meeting to a payoff — the natural slot is as the support sniper on
convergence night, where her debt to [[Harrow Bane]] becomes the lever that lets her walk away
from the band.

## What this mission is not

The same night, [[Wick]]'s crew hit the far side of town and left; that is a separate thread
and nothing in this mission chases it. [[Lady Sorcha Marlow]] is paying for the raids, but she
is reachable only through the one deniable breadcrumb the waystation gives up — the leash is
discoverable, never handed over. The party can run this entire mission treating Nella's crew
as independent bandits without being wrong about anything that matters to them.

## Notes

- **The party loots Earshot Crystals off the raiders in Session 1, and Nella kept hers.** The
  twist that she can overhear "all" messages is a long fuse, revealed well after this mission.
  Nothing in either session reveals it, and her Session 2 escape is her own skill, not
  something she overheard. See the Session 29 plan's `## Rewards`.
- **Session 1 is planned as [[Session 29 The Mistake]]**, 2026-10-06. Numbering is continuous
  across both campaigns rather than restarting per season, so the act's "Session 1" is
  act-relative shorthand. The pursuit session is not written yet.
- **Draft material, not canon.** The beat sheets live at
  `workshop/first-homebrew-act/sessions/session-01.md` and `session-02.md`, with mechanics in
  `notes/session-1-raid-statblock.md` and `notes/session-2-pursuit-statblock.md`. Both drafts
  predate the 2026-10-01 rulings and still say *level 5* in places — **the party is five PCs
  at level 4**, and the Session 1 roster is six bodies: four bandits (melee and crossbow), one hedge-mage, and the big one. The session plan holds the current statblock.
- **Session 1's opening is not the drafted one.** `session-01.md` Scene A is a hag cold open
  that contradicts canon; the replacement shape is in `notes/the-seam.md`, and the transit
  carries the long rest in fiction. That rewrite belongs in the `/session` plan, not here.
- **Open from the S2 draft:** chase DCs are placeholders at 12–14 (candidates for the empty
  Skill Challenge table in `meta/difficulty.md`); whether Nella drops her debt tally is an
  uncalled DM choice; the waystation needs a rough sketch, not a battlemap.
