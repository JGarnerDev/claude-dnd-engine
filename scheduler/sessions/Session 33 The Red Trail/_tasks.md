# Session 33 — The Red Trail · prep tasks

Not an entity. A checklist for getting `Session 33 The Red Trail.md` (in this folder) ready to run.
The `_` prefix keeps it out of `validate.ps1` and the semantic index. Delete it after the session is
played.

Carried from Sessions 30 and 31, which each played only part of this plan. Rebuilt 2026-10-28:
the camp is resized for a long-rested party, the Spear's +1 is
settled, and the scenes are renumbered 1–4. Then the same day: Nella rides a griffon, Iggy's
wings and Sah's voice break her hold on the sky (`S2_IGGY_BEAT`), and the third cask-hand and the
dogs are cut to pay for it. Already done in earlier rounds: the waystation Common
(Varrick's Parrying Bracer), Nella's purse (250 gp), both map sketches, both Roll20 builds.

Planned date: 2026-11-10.

**Carried from Session 32 (recap 2026-11-04).** The chase and the fork are played; only the waystation is
left. **Reworked for daylight the same day (`/session`):** low cloud instead of dark, the camp digs
in and lays a tree-line ambush, Ilsa and Cinder fight, and Halsby spots it go in (new beats
`S2_TEN_MINUTES`, `S2_SPOTTER`, `S2_AMBUSH`).

## Blocking — decide before the table

- [x] **Re-commit the beats** after the daylight rework (all 14, 2026-11-04).
- [x] **Run `/review 33 --ready`** (done 2026-11-10), then flip the plan to `state: planned`.

## Maps and Roll20

- [x] **Render the reference maps** (done 2026-11-03, after the waystation layout was updated for the griffon): `uv run scripts/battlemap.py --session 32` (dusk fork and
      waystation; the Roll20 builds already exist).
- [ ] **Re-render the waystation reference** for the ambush layout (Ilsa and Cinder in the south
      brush, Sennet at the side door, crew behind the cart, the stake line):
      `uv run scripts/battlemap.py --session 33`.
- [ ] **Roll20 waystation:** the cart turned broadside, a stake line across the open ground south of
      the yard, Ilsa and Cinder hidden in the south tree line, and the empty tether stake behind the
      blind. Nella and Tithe start on the GM layer over the river, in the cloud.
- [ ] **Tokens** (and `tokens.txt`): Varrick (drover, wearing the bracer), Haddo and Brask
      (Thugs), Sennet (Spy), Hesper (Acolyte), Clatter (Bandit), Ilsa (Scout),
      Cinder (Wolf), Nella, **Tithe the griffon** (Large; hooded at its tether, plus a way to show
      Nella in the saddle), and five horses for the party plus Pablo. Labels are in the plan's Combatants.
- [ ] **Sheet check at the top of the session.** Session 29 lost a lot of time to Roll20.
      Make sure Paul can open Luci's sheet and dice are visible.

## Cards and handouts

- [x] **The Shadowless Spear card for Kellan** (todo 88; built 2026-11-10 as `handouts/shadowless-spear.html`): +1 to attack and damage, **and +1 to his
      spell attacks and save DC** when he casts through it. His focus; the fade-rite holds twice
      as long while he carries it; 15 ft reach in dim light or darkness.
- [x] **The chase card (DM side)** (not needed; the chase played at Session 32): DCs 12/13/13/14. A stage is won when 3 of 5 pass.
      4 stages won means the camp is unaware, 2–3 means dusk, 0–1 means night alert. The skill
      menu is listed under `S2_CHASE_RULES`.
- [x] **The Stake terms card** (moved to Session 34, todo 94): 10% → 25% → 40% earned by deeds, never coin. With it
      come a room each, free meals, and the party naming one thing in the new wing. Rooms cost
      250–500 gp to build. Useful if Sable's bigger-share talk comes up at `S2_HAUL_HOME`.
- [x] **The Earshot Crystals card** (built 2026-11-10 as `handouts/earshot-crystals.html`): words only, to one holder you can see or to "all" holders
      within 300 ft. Hand it over only after someone finds out by accident.

## Optional

- [ ] **Tyler's backstory** (todo 71). The prisoner stays a silhouette without it (`S2_CELL`).

## Engine housekeeping

- [ ] **Rebuild the semantic index:** `uv run scripts/index-entities.py` (stale 13 commits).
- [ ] **Write the loot answer into `questionnaires/redwater/act-1-loot.md`:** question 24 (the
      cart is kept, the horses go back to Silas).

## Have on hand at the table (no prep needed)

- Nella's taunt: ***"Keep the ale."***
- The camp gives up three things only: the band's size, Harrow Bane's name in the ledger, and the
  banner. No Marlow coppers and no Jorn.
- The prisoner gets no name and no lines. End on the cell door.
- No set stopping point: stop where the table stops, and carry the rest.
