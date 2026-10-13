# Battlemaps

Rules for battle-map layouts, their renders, and the Roll20 asset kits that dress them. Shared map rules (two kinds of map, delegation, no committed images) are in `maps/CLAUDE.md`.

**This file does not auto-load for session layouts.** They live under `scheduler/sessions/`, so `scheduler/CLAUDE.md` points here. Read this file before editing or rendering any layout.

## Layouts and renders

Session battlemaps are **text layouts kept beside the session plan, gitignored** (`scheduler/sessions/<Session folder>/maps/<name>.txt`, one char per 5-ft square, A1 top-left) and rendered by `uv run scripts/battlemap.py --session <n>`. The script's header documents the layout format and terrain chars. Output goes to `maps/battlemaps/session-<n>/` as `<name>-vtt.png` (clean, for Roll20/Foundry/Owlbear; `--px 100` for Foundry) and `<name>-key.png` (DM copy). Both are gitignored like every map image. Layouts are local planning reference, not record: anything the table needs (grid refs, distances) goes into the session plan itself. Edit the `.txt` and re-render; never hand-edit the PNGs.

`uv run scripts/battlemap.py --session <n>` or `uv run scripts/battlemap.py maps/battlemaps/<location>` `[--px <n>] [--vtt-grid]`.

**Standing location maps** — maps of a place the party keeps coming back to, grown over time (the Golden Lioness's `indoors.txt` and `outdoors.txt`) — live in `maps/battlemaps/<location>/` and render beside their layout: `uv run scripts/battlemap.py maps/battlemaps/golden-lioness`. Each carries a `note: State:` line naming the session it reflects. After a `/recap` that changes the place (a room fitted out, a structure built), edit the grid and restamp that line. They are gitignored like the session layouts. The Golden Lioness outdoors map stays a 5-ft battle map, so base-building is planned on the same grid a raid would be fought on.

A layout's `scale:` line says which kind of map it is: default 5 means a battle map, anything larger an overview. An overview layout (such as `maps/battlemaps/ashford/`, a town drawn at 25 ft a square) is a draft blueprint for Inkarnate, not a deliverable. Placements on a draft overview are not canon until confirmed; each draft says in its notes which placements are canon and which are only drawn.

## Roll20 asset packs

Purchased VTT asset packs (Forgotten Adventures, ~4 GB zips) live in `maps/roll20 assets/`, which is gitignored as a whole folder. They are licensed and huge: **never commit them, and never unpack a whole pack.** Pull a small per-session kit instead.

**Kit workflow (worked on Session 29's maps):**

1. Read the session's layouts (`scheduler/sessions/<Session folder>/maps/*.txt`) and grep the session plan for set dressing (casks, hearth, smoke, stage). Together they are the shopping list.
2. List the zip **once** into the scratchpad: `unzip -Z1 "<zip>" | grep -v '/$' > <scratchpad>/fa.txt`. That's 64k lines, so grep that file from then on and never re-list the zip.
3. Write a manifest of `<scene>/<group>` + filename regex, one rule per line, and count each rule's matches before extracting. Retune rules that hit 0 or hundreds.
4. Extract with Python `zipfile` (`uv run --no-project python`), flattening into `maps/roll20 assets/session-<n>/<n>-<scene>/<group>/`. **Don't pass member names to `unzip` on the command line:** FA's folders start with `!` (`!Core_Settlements`, `!Effects`), and shell escaping mangles them.
5. Write a `README.md` in the kit mapping each group to grid refs. **Count the squares in the `.txt` to get a ref.** Never guess one: A1 is top-left, and each character is one column.

Target ~400 files / ~40 MB per session. Enough choice to dress the maps, small enough to upload to Roll20 by hand.

**Roll20 storage quota:** the free tier holds 100 MB of uploads. To clear old kits, paste `maps/battlemaps/roll20-purge.js` into the browser console on the Roll20 editor and run `r20purge()`. It bulk-deletes through Roll20's internal endpoints, and its header says how. Deletion is permanent and pulls the image from every game, so keep a local copy of anything still in use.

**Forgotten Adventures naming (Core Mapmaking Pack Part 1):**

- Tree: `FA_Assets/!Core_Settlements/<Category>/<Subcategory>/...` (Clutter, Decor, Furniture, Lightsources, Workplace_Equipment, Combat, Textures, Vehicles, Burial_and_Graves, Natural_Decor), and `FA_Assets/!Effects/` (Fire, Smoke, Blast_Marks, Lightning, Magic, Webs, and animated `.webm`).
- **Footprint suffix** `_<W>x<H>`: the size in 5-ft squares (`_2x3` is 10x15 ft). Set the Roll20 token size from it.
- **Material/tone tokens** in the name: `Wood_Walnut|Ashen|Dark|Light|Red`, `Metal_Gray|Rusty|Brass|Bronze|Gold|Black|Silver`; fire comes in `Red|Blue|Green|Purple|Yellow`. Filter with these tokens so one location gets a single matching tone. The Golden Lioness uses Walnut.
- Variant letters/numbers (`A1`, `B2`) are alternate drawings of the same object. Floor and wall textures are `.jpg` tiles under `Textures/`; everything else is transparent `.png`.
- **Names are literal, not thematic. Search synonyms:** no `Cask` (use `Barrel`, `Keg`), no `Hearth`/`Fireplace` (use `Coals_Hot`, `Firewood`, `Cooking_Pit`), no `Stage`, no `Rubble` (use `Blast_Mark_Debris`), no `Stair`/`Trapdoor`.
- **Part 1 has no** trees, grass, water, dirt yard texture, walls, doors, stairs or fireplaces. Those are presumably in Part 2 (not yet checked). Say what's missing in the kit README so the gap is known before game night.

**Forgotten Adventures Tokens Library (v1.14):** 1,446 PNGs, ~750 MB. Pull tokens into the same per-session kit, under `tokens/<role>/`, a few choices per role. Keep every choice in the kit, since Jeff swaps tokens at the table rather than picking ahead.

**Token kits are built by `scripts/token-kit.py`, inside a storage budget (default 30 MB).** Don't hand-extract tokens.

1. Write `maps/roll20 assets/session-<n>/tokens.txt`, one rule per line: `<tier> <role> <max> <regex>  ; note`. Tier 1 is the plan's Combatants, tier 2 named NPCs and companions, tier 3 walk-ons and set pieces. Leave PCs out; their tokens are already in the Roll20 game. Picking rules are in the bullets below.
2. Dry-run with `uv run scripts/token-kit.py --session <n> --count`: matches, picks and estimated MB per rule. Retune rules that hit 0.
3. Build with `uv run scripts/token-kit.py --session <n> [--budget <MB>] [--px <n>]`. It fills tier by tier, round-robin across roles. Then it fills from the evergreen manifest `maps/battlemaps/tokens-common.txt` (townsfolk, watch, bandits, road beasts) until the budget is spent. It downscales to 280 px per square, about half the size, and still crisp at Roll20's full zoom. It names files `<role>__<FA name>.png` so the art library can be searched by role. It writes `tokens/README.md` with each token's Roll20 size and anything left over budget.
4. Library gaps (e.g. there is no raccoon) show as "No token in the library" in the README. Note the stand-in in the rule's note.

- Tree: `FA_Tokens/Adventurers/<Ancestry>/` (PC-style classes, e.g. `Tiefling_Wizard_B1_Wand_Magic`), `FA_Tokens/Adversaries/<Faction>/` (Bandits, Guards, Cultists, Pirates, Undead, Goblinoids…), `FA_Tokens/Creatures/<5e creature type>/` (Beast has subfolders such as `Mammals`, `Birds`, `Aquatic`; also `Mounts`), and `FA_Tokens/NPCs/{Commoners,Nobles,Workers}/`.
- Name pattern: `<Role>_<Variant>_<Gear>_<Size>_Scale<NNN>_<CreatureType>_01.png`. Gear names what the token holds (`Crossbow`, `Sword_Shield`, `Magic_Fire`), so match it to the stat block's attacks. Commoners and nobles are `<Ancestry>_Commoner_<F|M|A>_<NNN><A|B>`. Workers are trades (`Barkeep`, `Cook`, `Server`, `Apprentice_Wizard`, `Minstrel`, `Stablehand`).
- **Sizing:** 400 px is one 5-ft square. Tiny, Small and Medium are drawn on a 1x1 canvas, Large on 2x2. `Scale<NNN>` means the canvas is NNN% oversized (`Riding_Horse_A1_Large_Scale200` is 1600 px, i.e. 4x4). Set the Roll20 token to the category size × NNN/100, and the art overhangs its base as intended.
- Pick tokens from canon. Check each NPC's `race`, livelihood and description in its entity file (Sable Wren is a tiefling, so tiefling tokens), and from the session plan the stat block and gear (the screen has sword and shield, the crossbow raider has a crossbow). Leave choices open where the plan does (*"Kellan picks the animal"*) by pulling several candidates.
- Skip the `Desert_*` variants unless the setting calls for them. A regex like `Guard_Fighter` matches `Desert_Guard_Fighter` too.
