# Session 30 — Keep the Ale · prep tasks

Not an entity. A checklist for getting `Session 30 Keep the Ale.md` (in this folder) ready to run.
The `_` prefix keeps it out of `validate.ps1` and the semantic index. Delete it after the session is
played. Items 70–73 mirror `todo-dashboard.md`; tick them in both places, or delete them there.

Made 2026-10-07. Planned date: `<not set>`.

## Blocking — decide before the table

- [ ] **Pick the waystation Common** (todo 70, loot question 23). It goes in `S2_CAMP_INTEL`'s
      placeholder. Dip is the lean, since Halsby gets the Spear this session. Whatever you pick,
      flip its loot file from `status: draft` to `confirmed`, with `confirmed_for: "Session 30 Keep the Ale"`.
- [ ] **Tyler's backstory**, enough to know why he surrendered (todo 71). He is only a silhouette
      at the close, but Session 31 opens on him. The concept is in `workshop/first-homebrew-act/drafts/cameos.md`.
- [ ] **Set the coin in Nella's purse** (todo 73). It's in `S2_TALLY`. Her savings toward the
      buyout: enough to matter, and enough that spending it feels like a choice.
- [ ] **Set the planned date** in the session frontmatter (`planned_date`).

## Maps and Roll20

- [x] **Sketch the waystation** (todo 72, done: `maps/waystation.txt`): shed, corral, well, cart, watch-fire, overwatch ridge,
      gully and rope-crossing, and the cached horse half a mile out. The ridge and gully distances
      keep Nella's escape honest. A rough sketch is fine, or a text grid in `maps/` rendered with
      `uv run scripts/battlemap.py --session 30`.
- [x] **The dusk fork** (done: `maps/dusk-fork.txt`): open ground, one lone tree, the road splitting. Either a plain field map
      or theatre of the mind.
- [ ] **Tokens:** Varrick (drover), Haddo and Brask (Thugs), Sennet (Spy), Hesper (Acolyte), Clatter (Bandit), Brick and Mortar (Mastiffs), Ilsa (Scout), Fennel (Bandit), Cinder (Wolf), Nella, the
      fox, and five horses for the party.
- [ ] **Sheet check at the top of the session.** Session 29 lost a lot of time to Roll20.
      Make sure Paul can open Luci's sheet, dice are visible, and Dip and Luci show level 5.

## Cards and handouts

- [ ] **The Stake terms card** (todo 11): 10% → 25% → 40% earned by deeds, never coin. With it
      come a room each, free meals, and the party naming one thing in the new wing. Rooms cost
      250–500 gp to build.
- [ ] **The Earshot Crystals card:** touch to speak in words only, to one holder you can see or
      to "all" holders within 300 ft. Hand it over only after someone finds out by accident.
- [ ] **The Shadowless Spear card for Kellan:** +1, works as his spellcasting focus, the fade
      doesn't advance while he carries it, and 15 ft reach in dim light or darkness.
- [ ] **The chase card (DM side):** DCs 12/13/13/14. A stage is won when 3 of 5 pass.
      4 stages won means the camp is unaware, 2–3 means dusk, 0–1 means night alert. The skill
      menu is listed under `S2_CHASE_RULES`.

## Check with players

- [ ] **Kellan:** confirm Halsby's Session 29 spend (slot levels and sorcery points for the
      twinned Chromatic Orb and the upcast Magic Missile), and whether anything comes back on a
      short rest. Halsby goes into the camp without a long rest.
- [ ] **Miguel:** confirm Odibli's remaining slots after Hold Person.

## Engine housekeeping

- [ ] **Commit the 13 draft beats** in `_flow.md` (todo 73). Check with
      `uv run scripts/flow-status.py --set "scheduler/sessions/Session 30 Keep the Ale"`.
- [ ] **Flip the plan to `state: planned`** once the blocking items are done. Run the Description
      & Dialogue Pass again at that point (`/session` Phase 6).
- [ ] **Write today's loot answers into `questionnaires/redwater/act-1-loot.md`:** question 23
      is pinned, and question 24 is answered (the cart is kept, the horses go back to Silas).
- [ ] **Rebuild the semantic index:** `uv run scripts/index-entities.py`. It's stale since Session 29.
- [ ] **Commit** the Session 30 folder, the mission update and the todo items.

## Have on hand at the table (no prep needed)

- Nella's taunt: ***"Keep the ale."***
- The camp gives up three things only: the band's size, Harrow Bane's name in the ledger, and the
  banner. No Marlow coppers and no Jorn.
- The prisoner gets no name and no lines. End on the cell door.
- The night's sleep is not a long rest. The window reopens around the camp.
