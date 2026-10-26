---
# --- MANDATORY ---
name: "Session 31 The Red Trail"
campaign: homebrew
type: session
session_number: 31
exists: false
state: draft
tags:
  - session

mission: [[The Stolen Casks]]
planned_date: "TBD"
pcs_present:
  - "Iggy"
  - "Luci"
  - "Odibli"
  - "Dip"
  - "Halsby"

# --- OPTIONAL ---
act: [[Act 1 - The Hearth at Ashford]]
locations:
  - [[Ashford]]
  - [[The Golden Lioness]]
key_npcs:
  - "[[Sable Wren]] (historian — the unsigned deed, the hearth, the send-off)"
  - "[[Mara Tull]] (historian — sheriff; wants a statement tonight, and holds the prisoner at the close)"
  - "[[Silas Crubb]] (historian — mayor; the horses, and the party's pitches from last night)"
  - "[[Aashal-Groon Mellenegon Borak]] (historian — Asher, through the fox again; the Spear)"
  - "[[Nella]] (historian — on the ridge; loses, escapes, drops her tally)"
  - "Varrick Tenn, the drover (human — Nella's second, the camp's floor anchor; not an entity)"
  - "Sennet Orrin (human — Bane's tally-man, keeps the duty ledger; not an entity)"
  - "[[Sergei Rubelgerd]] (historian — Odibli's mastiff; drawn in by Iggy's song, Bosco riding him)"
  - "[[Bosco]] (historian — Iggy's raccoon; arrives on Sergei's back, the cold war with Odibli still on)"
  - "the prisoner (a silhouette only — Tyler's cameo, beat 1; no name, no lines)"
encounters:
  - "The Dusk Fork — Nella's rear guard: Ilsa Hask (human Scout) and Fennel Dray (human Bandit), mounted, with Fennel's Wolf Cinder. ~350 adjusted XP, under Easy by design (an objective fight, RTC under 1), 1-2 rounds. Fennel shoots the borrowed horses and Cinder goes for their legs, not the PCs. A rider who escapes toward the camp raises its alert by one step."
  - "The Waystation — Varrick Tenn the drover (human Bandit Captain), Haddo Keel and Brask (human and half-orc Thugs, the cask-hands), Sennet Orrin (human Spy), Hesper Mudd (halfling Acolyte), Tam 'Clatter' Cobb (human Bandit, on the roof) and Brick and Mortar (Mastiffs) on the floor, Nella (custom, ~CR 3) on the ridge. ~4,188 adjusted XP against an all-level-5 party, Hard, RTC ~3.4 (floor ~2.7), RTD ~2 front / ~3 back, 3-4 rounds. Tactics: the crew stays on its stations around the cart; Nella spreads her shots to wound and pin, marks whoever climbs toward her, never a caster, and never finishes a downed PC. Morale DC 12 WIS when the drover drops or the crew is down to 2 standing."
loose_threads:
  - "[[Session 30 Keep the Ale]]'s unplayed beats: Mara's statement, the dead Boon, the dying hearth (Tallis's smother-charm), then all of the dawn pursuit"
  - "Dip's private roll from Iggy's song, owed as a flashback (Ben was absent at Session 30), and the 150 gp the table assigned them"
  - "Sable's deed: terms heard and agreed, never formally taken"
  - "Odibli's debt-rebundling pitch and Halsby's shade-on-command pitch: Silas left both uncommitted"
  - "Ashford repeats that the party came out of Mara's light"
  - "[[The Shadowless Spear]] is owed to [[Halsby]] by Asher's fox: 'after you, not before'"
  - "Three seeds owed to [[Davian Martikov]] — Barovia-side, acknowledged in one line inside the Boon beat, not pursued"
  - "Still open from Session 29: what the order doesn't like at [[Tassad]], and the later job Halsby owes Sable"
difficulty_attrition: standard
difficulty_lethality: standard
depth: narrated
scope: inline
opening_scene: "Late the same night, in the one surviving room of the Golden Lioness. The song is over, Sergei and Bosco are asleep by a hearth that feeds itself, and the townsfolk are filing out into the dark."
closing_hook: "The casks ride home on the party's own cart, and Ashford is buzzing about something else. While they were gone, a raider walked into town and surrendered. He sits in Mara Tull's cell, silent, and the town wants a rope."
relates_to:
  - "[[The Stolen Casks]] (resolves this session)"
  - "[[Act 1 - The Hearth at Ashford]] (act)"
  - "[[Redwater]] (campaign)"
  - "[[Session 30 Keep the Ale]] (its unplayed beats carry over to here)"
  - "[[The Wanderer's Boon]] (shown inert)"
  - "[[The Shadowless Spear]] (delivered at the ford)"
  - "[[Harrow Bane]] (named in the camp's ledger; still no face)"
importance: critical
active: true
description: "The back half of Session 30's plan, reworked 2026-10-21. The rest of the night (Mara's statement, Dip's owed moment, the dead Boon, the dying hearth), then the dawn pursuit of Nella's cart to a drover's waystation. Nella loses, escapes on a fallback she rigged, and drops her debt tally. The party comes home with the casks to a silent prisoner in Mara's cell."
---

Campaign: [[Redwater]] | Act: [[Act 1 - The Hearth at Ashford]] | Mission: [[The Stolen Casks]]

> **Carried from [[Session 30 Keep the Ale]], reworked 2026-10-21.** Session 30 played only its
> first three scenes. This plan is everything that didn't run, with the `S2_` ids kept so they
> still match `_flow.md`. The rework dropped the played beats, added `S2_DIP` and `S2_CRYSTALS`
> (both draft), checked every Lioness line against its Session 30 retcon (a week-old venture in a
> half-built building, one room standing), and folded in what the table chose at Session 30.

**Shape:** balanced · **Length:** long (~3 hr+, 6 scenes; overplanned on purpose, Jeff 2026-10-21)
· **Attrition:** standard · **Lethality:** standard.

**Decided by Jeff, 2026-10-07:** whole pursuit in one session · 24-hour rule held (short rest at
dawn only) · Spear at dawn by the ford · Elowen held for a later breather · Nella drops her tally
· close on a silent prisoner · cart kept, horses returned · the camp gives up band scale, Bane's
name and the aegis-banner · night trimmed to the character beats · Nella spreads her fire · chase
DCs 12/13/13/14, scored by stages won · waystation Common set (Varrick's Parrying Bracer, Dip) · camp resized to Hard after the
v0.18.0 offense check (Option A: Captain drover, two Thug cask-hands, morale at 2 standing) ·
three level-ups, each on its own beat: Iggy at the song, Odibli after saving the hearth, Halsby
at the Spear · a third cask-hand added to hold the camp at Hard against an all-5 party · then
both fights varied and the crew named (a Spy, an Acolyte, Mastiffs, a Wolf; mostly human, as the region is), still Hard.

**Proposed by the engine, 2026-10-09; committed by Jeff, 2026-10-13:** more choices for the
players, so the night and the chase aren't only watched · Mara asks for one volunteer to give a
statement at the jail (`S2_STATEMENT`) · the flame track sits on the table where the party can see
it (`S2_HEARTH`) · a route choice at chase stages 2 and 4 (`S2_ROAD`, `S2_APPROACH`) · Nella's
escape route can be scouted, and cut off, before the camp goes loud (`S2_SCOUT`, `S2_ESCAPE`).

## Combatants

All enemy stat blocks in one place. 2014 Monster Manual Bandit, Thug, Bandit Captain, Scout, Spy,
Acolyte, Mastiff and Wolf, reskinned, plus Nella's custom block (from
`workshop/first-homebrew-act/notes/session-2-pursuit-statblock.md`, tuned here). Mixed in for
variety (Jeff, 2026-10-07): a sneak, a healer, dogs and a wolf, so the fights aren't all melee bodies.

### At a glance

- **The Dusk Fork** (Scene 4), mounted except the wolf:
  - **Archer Rider** — Ilsa Hask (human, Scout), the rider who goes for the camp
  - **Crossbow Rider** — Fennel Dray (human, Bandit), crossbow on the horses
  - **Wolf** — Cinder (Wolf), Fennel's, runs with the horses
- **The Waystation** (Scene 5):
  - **Drover** — Varrick Tenn (human, Bandit Captain), between cart and fire
  - **Cask-hand** — Haddo Keel (human, Thug), at the cart
  - **Half-orc Cask-hand** — Brask (half-orc, Thug), at the cart
  - **Tally-man** — Sennet Orrin (human, Spy), Bane's ledger clerk, in and out of the shed
  - **Hedge Priest** — Hesper Mudd (halfling, Acolyte), at the fire
  - **Roof Guard** — Tam "Clatter" Cobb (human, Bandit), crossbow on the shed roof
  - **Mastiff 1** and **Mastiff 2** — Brick and Mortar (Mastiffs), chained at the corral
  - **Sniper** — [[Nella]], on the ridge
- **Morale:**
  - **The fork:** when Ilsa drops, or Fennel and Cinder are both down, each survivor makes a
    DC 12 WIS save (+0).
  - **The camp:** when Varrick drops, or the crew (everyone but Nella and Varrick) is down to 2
    standing. Not at half: half the crew falls in round 1, and the fight would end before Nella
    matters. The dogs don't roll; they slink off when Varrick drops.
  - Failures flee and drop what they carry.

### Difficulty check (v0.18.0)

Session 29's raid ended in two rounds, so both fights were re-run against the party's offense.

- **Party thresholds** (all level 5 once the night's two level-ups and the dawn one land): Easy
  1,250 · Medium 2,500 · Hard 3,750 · Deadly 5,500.
- **Party damage, after the dawn short rest:** ~70 a round. Dip ~25–30 (raging, Reckless, Extra
  Attack, Frenzy, Cleave), Luci ~14, Odibli ~12, with Shatter or now **Fireball** on clusters,
  Halsby ~12 with 3rd-level slots, and Iggy ~9 plus Bless or Faerie Fire (more with Smite if he
  takes Paladin 2). Whatever slots went into the hearth (`S2_HEARTH`) are gone for the camp; the
  short rest doesn't return them, except through Arcane Recovery.
- **The fork:** 175 XP, ×2 = 350 adjusted, **under Easy**. 38 HP, RTC under 1. Left small on
  purpose: the stake is the rider and the horses, not HP.
- **The camp:** 1,675 XP, 9 creatures ×2.5 = **4,188 adjusted, Hard** (Deadly starts at 5,500).
  235 HP; RTC ~3.4 overall, ~2.7 on the floor. Varrick survives two hits from anyone; the Thugs
  survive two from anyone but Dip, and one Fireball. Sennet, Hesper, Clatter and the dogs are
  one-hit bodies, but each asks the party a different question: find the sneak, drop the healer,
  get the roof, deal with the dogs.
- **RTD, crew on its stations:** a front-liner takes ~35 a round (Varrick ~10, the Thugs ~12
  between them with Pack Tactics, Sennet's Sneak Attack ~5 averaged over misses, Nella's share
  ~8), so RTD ~2 for a raging Dip and ~1.2 for Luci if she dives the cart. The dogs add prone,
  not much damage. The back line takes Nella's spread, Clatter's crossbow and Hesper's Sacred
  Flame, ~RTD 3. Standard lethality holds **only** while the crew stays on its
  stations and Nella keeps to wound and pin.
- **Why Hard:** the day carries ~11 of standard's 18–24 rounds, so the camp is the day's one real
  fight. The missing long rest is the squeeze; the party is otherwise near full.

### Bandit — Fennel Dray (fork) and Clatter (camp)

- AC 12 · HP 11 · Speed 30 ft · CR 1/8
- **Scimitar** +3 to hit, 1d6+1 slashing (avg 4)
- **Light crossbow** +3 to hit, range 80/320, 1d8+1 piercing (avg 5)
- **Fennel Dray** (human): wiry farm lad gone wrong, twitchy, talks fast, loves Cinder more than anyone in the band.
  Shoots the horses. If Cinder goes down, Fennel stops fighting and goes to the wolf.
  - **Kit (player-facing):** *a patched farm jerkin, no real armour, a light crossbow across the
    saddle and a cheap curved blade on his hip.*
  - **Label (party-facing):** Crossbow Rider
- **Tam "Clatter" Cobb** (human): on the shed roof (half cover), crossbow on whoever is in the
  open. Named for the bolts he never stops fiddling with; you hear him before you see him. Calls
  out targets to the floor, so whoever he's watching gets no hiding in the open.
  - **Kit (player-facing):** *a light crossbow and a quiver of mismatched bolts, a curved blade
    stuck through his belt, and a leather jerkin that has seen better owners.*
  - **Label (party-facing):** Roof Guard

### Scout — Ilsa Hask, the rear guard's rider

- AC 13 · HP 16 · Speed 30 ft · CR 1/2 · Perception +5, Stealth +6, Survival +5
- **Keen Hearing and Sight:** advantage on Perception checks that use hearing or sight
- **Multiattack:** two melee or two ranged attacks
- **Shortsword** +4 to hit, 1d6+2 piercing (avg 5)
- **Longbow** +4 to hit, range 150/600, 1d8+2 piercing (avg 6)
- **Ilsa Hask** (human): Nella's best rider and the closest thing she has to a student. Quiet,
  sun-squinting, already half-turned toward the camp.
  - **Kit (player-facing):** *sun-faded leather riding armour, a longbow strung and ready, and a
    short sword at her hip.*
  - **Label (party-facing):** Archer Rider
- **Job:** watch the back trail. When the fight turns, Ilsa rides for the camp, not for the party.

### Wolf — Cinder

- AC 13 · HP 11 · Speed 40 ft · CR 1/4
- **Keen Hearing and Smell** · **Pack Tactics**
- **Bite** +4 to hit, 2d4+2 piercing (avg 7); target makes DC 11 STR or is knocked prone
- Grey-black, scarred muzzle, keeps pace with the horses. Goes for a horse's legs first (a prone
  horse throws its rider).
  - **Kit (player-facing):** *no gear, just a frayed rope collar somebody tied on with care.*
  - **Label (party-facing):** Wolf

### The drover — Varrick Tenn, reskinned Bandit Captain

- AC 15 (studded leather) · **HP 65** · Speed 30 ft · CR 2
- STR 15 · DEX 16 · CON 14 · INT 14 · WIS 11 · CHA 14 · Saves STR +4, DEX +5, WIS +2
- **Multiattack:** two cart-whip attacks and one dagger, or two thrown daggers
- **Cart-whip** (scimitar) +5 to hit, 1d6+3 slashing (avg 6)
- **Dagger** +5 to hit, reach 5 ft or range 20/60, 1d4+3 piercing (avg 5)
- **Parry (reaction):** +2 AC against one melee attack he can see
- **Varrick Tenn** (human): leathery, barks orders, ex-soldier who treats the cart like a
  posting. He anchors the camp floor the way the big one anchored the raid, and **he holds the
  crew together:** while he stands, morale holds until only 2 are left. He doesn't roll morale
  himself. **He knows nothing useful** — taken alive, he is a Mara Tull problem.
  - Taken alive, first line, with a nod at the ridge: *"I drive the cart. Paid by the mile. Ask
    her."*
  - Pushed on who pays: *"The clerk pays. I don't ask whose coin it is."*
- **Kit (player-facing):** *studded leather worn like a uniform, a long drover's cart-whip, a
  row of throwing daggers across his chest, and a scuffed leather bracer on his left forearm, laced
  and relaced so often the holes have worn into slots.* (The bracer is the loot; let them see it
  turn a blow first.)
- **Label (party-facing):** Drover

### Thug — the cask-hands, Haddo Keel and Brask

- AC 11 · HP 32 · Speed 30 ft · CR 1/2
- **Pack Tactics:** advantage on an attack if an ally is within 5 ft of the target
- **Multiattack:** two mace attacks (a cask-mallet in the fiction), +4 to hit, 1d6+2 bludgeoning
  each (avg 5)
- **Heavy crossbow** +2 to hit, range 100/400, 1d10 piercing
- **Haddo Keel** (human): huge, patient, hums while he works. Counts the casks out loud.
- **Brask** (half-orc): long arms and a bad temper, sleeps against the cart wheel when off watch.
- **Kit (player-facing, both):** *stained leather aprons over leather jerkins, iron-banded
  cask-mallets, and a heavy crossbow each, propped against the cart wheel.*
- **Label (party-facing):** Cask-hand (Haddo), Half-orc Cask-hand (Brask)
- **Station:** the cart, together, so Pack Tactics is live whenever someone reaches the casks.
  Paid by the barrel. *"Nobody touches the cart"* is their whole job.

### Spy — Sennet Orrin, Bane's tally-man

- AC 12 · HP 27 · Speed 30 ft · CR 1 · Deception +5, Insight +4, Stealth +4
- **Cunning Action:** Dash, Disengage or Hide as a bonus action
- **Sneak Attack (1/turn):** +2d6 (7) when he has advantage or an ally is within 5 ft of the target
- **Multiattack:** two shortsword attacks, +4 to hit, 1d6+2 piercing (avg 5)
- **Hand crossbow** +4 to hit, range 30/120, 1d6+2 piercing (avg 5)
- **Sennet Orrin** (human): ink on his fingers, a ledger under his arm. **He keeps Bane's duty
  ledger** (`S2_CAMP_INTEL`); the clerk's tidy hand is his. Not one of Nella's crew; Bane's man,
  checking the haul. Slips between the shed doors and stabs whoever the Thugs are already hitting.
- **Kit (player-facing):** *a clerk's coat, no armour, ink on the cuffs. A short sword he wears
  like he knows how to use it, and a little hand crossbow hooked to his belt.*
- **Label (party-facing):** Tally-man
- **If taken alive and asked about Bane,** he says the name and goes white. He'll trade the ledger
  for his life before he'll trade anything else.
  - Asked who he works for: *"Harrow Bane. I shouldn't have said that. Take the book. Just the
    book."*

### Acolyte — Hesper Mudd, hedge-priest

- AC 10 · HP 9 · Speed 25 ft · CR 1/4
- **Spellcasting** (WIS, save DC 12, +4 to hit): *sacred flame* (1d8 radiant, DEX save), *light*,
  *thaumaturgy* · 1st (3 slots): *bless*, *cure wounds*, *sanctuary*
- **Club** +2 to hit, 1d4 bludgeoning
- **Hesper Mudd** (halfling): the band's patch-up, prays to whatever is listening. *Bless* on
  Varrick and the Thugs in round 1, then *cure wounds* on whoever is about to drop.
- **Kit (player-facing):** *a homespun robe, a knotted wooden club, and a cord of mismatched holy
  charms she touches one after another, like she isn't sure which one works.*
- **Label (party-facing):** Hedge Priest
- **Use *sanctuary* sparingly.** On Varrick it stalls the morale trigger; if the fight is running
  long, she casts *bless* or heals instead.

### Mastiff — Brick and Mortar

- AC 12 · HP 5 · Speed 40 ft · CR 1/8
- **Keen Hearing and Smell:** advantage on Perception by hearing or smell
- **Bite** +3 to hit, 1d6+1 piercing (avg 4); target makes DC 11 STR or is knocked prone
- Chained at the corral (15-ft chains). They bark at anyone sneaking within 30 ft of the corral
  unless Stealth beats their passive Perception 18 (13, +5 for advantage). Loosed by any crew member as an action.
- **Kit (player-facing):** *spiked iron collars on heavy chains.*
- **Label (party-facing):** Mastiff 1 (Brick), Mastiff 2 (Mortar)

### Nella — veteran sniper (~CR 3, custom)

- AC 15 (studded leather) · **HP 49** · Speed 35 ft
- STR 12 · **DEX 18 (+4)** · CON 12 · INT 12 · **WIS 16 (+3)** · CHA 10
- Stealth +8, Survival +7, Perception +7, Nature +5
- **Multiattack:** two longbow attacks
- **Longbow** +6 to hit, range 150/600, 1d8+4 piercing (avg 8)
- **Shortsword** +6, 1d6+4 piercing — cornered only; she never chooses melee
- **Marked Quarry (1/turn):** +1d6 against a creature she hit on her previous turn
- **Skirmisher's Step:** Dash, Disengage or Hide as a bonus action
- **Prepared Ground:** on ground she chose, advantage on initiative and her fallback routes are
  rigged (see `S2_ESCAPE`)
- **Tactics (Jeff, 2026-10-07): wound and pin, never kill.** She spreads her two shots across
  targets. Marked Quarry goes on whoever is climbing toward the ridge, **never on a caster**. She
  never shoots a downed PC. This holds her at standard lethality against a party with no long
  rest; on paper her block is RTD ~1 against the back line.
- **Kit (player-facing):** *dark studded leather under a long weathered cape, a tall longbow,
  and a short sword at her hip she doesn't touch.*
- **Label (party-facing):** Sniper

### Running it

- **The crew stays on its stations:** Haddo and Brask at the cart, Varrick between cart and fire,
  Hesper at the fire, Clatter on the shed roof, Brick and Mortar chained at the corral, and Sennet
  working between the shed's side door and the cart. All eight converging on one PC is ~50 a
  round, RTD under 1, and quietly turns this into a deadly fight. Same rule as the Session 29 raid,
  and it matters more now the camp is sized Hard. Sennet is the one who moves; he goes where the
  Thugs already are, for Sneak Attack, not after the back line.
- **Alert states** (set by the chase, `S2_APPROACH`):
  - **Unaware** (4 stages won): Clatter and Hesper dicing by the fire, Brask asleep against the
    cart wheel, Sennet in the shed over the ledger, the dogs dozing (Stealth still has to beat
    their passive 18 near the corral). The party picks its position and gets surprise if it wants
    it. Nella is in the shed (O6), so her **first two rounds** are the run to her perch: out the
    side door and up the slope is ~80 ft of movement, and her best is 70 (Dash via Skirmisher's
    Step). She shoots from the slope on round 2 if anyone is in the open.
  - **Dusk** (2–3 won): Clatter on the roof and Hesper at the fire on watch, Nella on her perch at
    the dusk rotation.
  - **Night alert** (0–1 won): perimeter staked (difficult ground, or DEX 12 to cross at speed),
    double watch, fires banked. Nella pre-positioned, Prepared Ground live from round 1.
- **Round budget:** ~3 on the clock from the raid, ~1–2 at the fork, ~3–4 at the camp ≈ 8–9 of
  standard's 18–24. The squeeze is the missing long rest, not the round count.

## Orientation

Late the same night, in the one surviving room of [[The Golden Lioness]]. The party has eaten
Sable's soup, heard Ashford's names (Wick, Harrow Bane, the boots), told the town the truth about
falling out of Barovia, and agreed to bring Sable's stock back from [[Nella]]'s camp for rooms,
meals and 10% of the bar (terms heard; no deed signed). Iggy's song stilled the hearth for ten
seconds, and Sable saw it and said nothing. [[Sergei Rubelgerd]] and [[Bosco]] are asleep by the
fire. Every PC wears an [[Earshot Crystals|earshot crystal]]. The townsfolk are filing out, and
Mara hasn't left yet.

- **Levels:** Dip, Luci and Iggy 5 (Iggy is now Bard 3 / Paladin 2); Halsby and Odibli 4. **Both
  level this session**, each on a deed of their own (Jeff, 2026-10-07):
  - **Odibli** on the last stroke that saves the hearth (`S2_HEARTH`)
  - **Halsby** when the Spear is fused at dawn (`S2_SPEAR`)
  The party walks into the camp all level 5, and the camp is sized for that.
- **Resources:** nothing has come back since Session 29's fight. Halsby spent heavily
  (Invisibility, a twinned Chromatic Orb, Magic Missile upcast to ~3rd; Kellan to confirm); Odibli
  spent Hold Person (Miguel to confirm); Luci spent ki and her emanation; Iggy one Bardic
  Inspiration; Dip one rage and took 8 fire. Healing Dunny cost Iggy and Luci something too.
- **Afflictions:** Iggy's shadow and Dip's whispers are dormant in Aethryn. Luci's Sacred Flame and
  Odibli's familiar are still gone.
- **Mood:** the night ran long on roleplay and the table loved it. The financial-advice bit was the
  comedy high point, and Sable's eye-roll landed ("she's my new favourite"). Keep her dry with
  Odibli. Players asking about unplanned things worked well; leave room for it. **Ben was absent
  at Session 30**, so Dip has a moment owed (`S2_DIP`).
- **Roll20:** Session 30 lost time to token labels not showing and the grid not aligning. Check
  both, plus sheets, before starting.

### Rest Clock across the session

- **Night (Scene 1):** the party sleeps at the Lioness. **It is not a long rest.** The 24-hour
  gate holds (Jeff, 2026-10-07): the transit's rest started about an hour before the raid, and it
  is ~4 hours on now. Say it in fiction — they sleep, it helps, it isn't enough — never as a rules
  call.
- **Dawn (Scene 2):** one short rest at the ford, before they ride. Hit dice, short-rest features,
  Halsby's sorcery points if his build recovers any.
- **Day (Scenes 3–4):** the ride. Rounds at the fork go on the clock.
- **Dusk to night (Scene 5):** the camp. Roughly 20–23 hours have passed since the transit rest
  started. **The 24-hour window reopens during or just after the camp fight.** Once the camp is
  taken, the waystation is the first place safe enough for a real long rest before the ride home.
  If they ride straight through the night instead, they arrive in Ashford still unrested.
- **In-world time:** the working label is "Day 2, Ashford reckoning" from dawn. Aethryn has no
  calendar yet. Exact distances to the waystation are unset: it is **a long day's ride** for a laden
  cart's pursuers. Leave the mileage as `<a day's ride southeast>` until a region pass sets it.

### Unresolved from Sessions 29–30

- **Fida**, Luci's name for the broken moon, has no entity yet. Nothing tonight needs it.
- **The pull Odibli feels in one direction** is player-side only. Miguel's lore (2026-10-25)
  puts [[The Citadel]] in Aethryn but doesn't say the pull points at it. No character knows it,
  and nothing in this plan touches it.
- **Sable's brewing copper** is ruined; only [[George Ringo]] and [[Zach]] could remake it. A
  state note, not a beat tonight.
- **The raiders' names** stay recap-only. If anyone in town asks, Mara knows Tallis by reputation
  ("hedge-witch, sold charms at the fair, then didn't").

## Scenes

### Scene 1 — The Rest of the Night

- **Summary:** The night winds down. Mara wants one of them at the jail for a statement, Dip gets
  their owed moment from the song, the Boon stays dead, and then the hearth starts dying. Odibli has
  to write over a charm in the coals while the party keeps the flame alive. Odibli levels to 5.
- **Where:** [[The Golden Lioness]], the one room that survived: crates half-unpacked, the hearth,
  a blown-open wall through to the half-built wing.
- **Cast:** [[Sable Wren]] · [[Mara Tull]] · [[Dunny Marsh]] · [[Sergei Rubelgerd]] · [[Bosco]]
- **Enemies:** none
- **DCs:** Insight or Arcana 15 / 20 — Dip's private roll (bands) · Arcana 13 — read the charm ·
  INT (calligrapher's supplies) 14 — each of Odibli's three strokes · DEX 13 save — the burst, 2d6
  fire, half on a success
- **Time:** ~30 min
- **Trigger:** the song is over and the room is emptying. The tail of Session 30's Scene 3.

#### S2_STATEMENT — Mara wants one of them at the jail tonight

- **Tokens:** the Lioness `indoors` map. Party, Sable, Sergei and Bosco by the hearth; Mara and
  Dunny at the door; clear the other townsfolk as they leave.
- **Choice (party):** send one of them with Mara, or nobody. Whoever goes misses the stone and comes back a round late to the hearth, but learns Tallis's name and earns Mara's first off-duty line.
- **Engine, 2026-10-09; committed 2026-10-13.** A small choice inside the inn night. Nobody has to go.
- **The party told the town the truth at Session 30**, so the town is already repeating it. Mara
  wants their version on paper before the story grows.
- Before she leaves, Mara asks: *"Half the street's already saying you came down in my light. I'd
  like your version on paper before theirs gets any bigger. I need one of you to walk back with me.
  Just one. The rest of you, sleep."*
- **If Dip goes,** run `S2_DIP`'s private roll on the walk instead, as they look back at the
  lit window.
- **If nobody goes:** *"Then first thing tomorrow."* No penalty. Tallis's name waits for the hearth.
- **Whoever goes:**
  - Misses `S2_BOON` and walks back in one round into `S2_HEARTH`, as the fire starts to dip. That
    leaves one fewer person to feed the fire in round 1.
  - Gets Mara off duty for one line on the walk: *"Six years I've had this star. Tonight's the
    first night I couldn't be everywhere at once."*
  - Sees the jail: two cells, both empty. They'll remember that at `S2_CELL`.
  - Learns Tallis's name. Mara has the dead hedge-mage's satchel on her desk, full of blank charm
    paper: *"That one's Tallis. Sold charms at the fair. Wrote them himself, on good paper. I
    bought one off him for my mother."* When the page turns up in the coals, this PC can name him
    at once.
- **If Odibli goes:** the hearth waits for him. It starts to dip as he comes through the door, and
  the flame track starts at **2**, not 3.
- **Transition:** `S2_DIP`, then `S2_BOON` for whoever stayed.
- **Tokens:** Mara leaves with the volunteer, if there is one. Dunny goes with her.

#### S2_DIP — Dip's owed moment: the private roll, and the 150 gp

- **Draft (engine, 2026-10-21).** Ben missed Session 30, so Dip's private roll at Iggy's song
  (Session 30's `S2_IGGY`) is owed, and the table gave Dip the 150 gp while Ben was away.
- **Choice (Dip):** what Dip shares from the private roll: all of it, some of it, or nothing.
- **Choice (Dip):** keep the 150 gp, or put some or all of it toward Sable's ~650 gp debt to Silas.
- **Time:** ~5 minutes.
- **The private roll, as a flashback.** Tell Ben privately, or pass a note. Frame it as Dip, by the
  dying-down fire, remembering what they felt when the hearth went still mid-song. Wisdom (Insight),
  or Intelligence (Arcana) if Ben argues for the Sage training:
  - **Under 15:** a lurch of nested wrongness, layers inside layers, then gone.
  - **15–19:** a nesting doll — real, then hollow, then *real* again, and the innermost layer is
    inside Iggy.
  - **20+:** that innermost layer is a presence, divine, small and very tired, and not hostile.
  - **Describe only what Dip felt.** Jeff is Iggy's player and the DM, so [[Sah]] is never named
    or narrated. Ben decides what he says aloud.
- **The 150 gp.** Confirm with Ben first that Dip took it from the bodies. Sable never asks for it:
  she isn't that kind of host. If Dip offers, one line, no fuss: *"Put it away. …Fine. Leave it on
  the bar, and I'll pretend I didn't see you do it."* If they keep it, nothing changes, and she
  doesn't look at them differently.
- **Dip's crystal:** the DM ruled at `/recap` that Dip took one from the pile. Confirm with Ben in
  the same breath.
- **Transition:** `S2_BOON`.

#### S2_BOON — Odibli's stone does nothing at all

- Late in the evening Odibli takes [[The Wanderer's Boon]] out again, because of course he does.

> *"It sits in your palm doing nothing at all. Warm, like it's been in a pocket. Dead, like it never
> worked. Somebody owes somebody three seeds back in Barovia, and the stone has nothing to say about
> it."*

- One line for the Barovia debt, then let it sit.
- **The deed.** At Session 30 the party agreed to fetch the stock and heard the terms (rooms, meals,
  a month or two's stay, 10% rising, naming the new sections), but nobody signed. If they want it
  formal, this is the moment. A no is fine: the deed stays on the table.
- If they sign tonight: Sable slides the deed across, says *"Ten,"* and pours another round.
  Record the 10% Stake.
- **Sable and Odibli.** He told her she was a bad business owner last night, and she's exasperated
  with him. If he talks money again, or reaches for the paper: *"Don't. Whatever you're about to
  rebundle, don't."*
- **Transition:** the room empties, and the fire starts to go wrong.
- **Tokens:** clear all the townsfolk and Silas. Only Sable, the party and the companions stay.

#### S2_HEARTH — The hearth is dying. Odibli finds the charm and writes over it

- **Choice (Odibli):** Miguel picks the word Odibli writes over the glyph. The word is recorded, and Asher remembers it.
- **Odibli's deed and level-up** (Jeff, 2026-10-07).
- **Time:** ~10–15 minutes. Late, with the room emptied, so it stays apart from Iggy's song.

**What's going on (DM only):**

> The cause below is locked (Jeff, 2026-10-25). Miguel's lore notes arrived without covering the
> hearth. What the hearth is *linked to* is a separate question and stays open (`meta/mysteries.md`).

- During the raid, **Tallis** (the hedge-mage who sold charms at the fair) dropped a written charm
  into the hearth of the one room that would survive. It's a **smother-charm**: it drinks the fire,
  stores the heat, and lets it all go at once when the flame finally dies. The half-built wing took
  the blast; this was meant to finish the last standing room while everyone slept in it.
- The fire is Asher's breath coming up from under the floor. He feels the charm as suffocation,
  and **he remembers who saved it.**
- **This hearth is Asher's small dominion** (Jeff, 2026-10-25). The gnomish fire channel and
  [[The Palimpsest]] don't surface in it: nothing ghosts up under the glyph, and Odibli finds no
  mail here.
- **It fits what Odibli already read.** His Arcana 23 at Session 30 found the hearth "linked to
  another entity not currently present". That read the link, not the coals. The charm works
  slowly, and it is why the link already felt thin.
- **Tallis is the dead mage Odibli wouldn't go near** at Session 30. Odibli also kept clear of the
  fireplace that night. Tonight the fire comes to him.

**The symptom:**

- The fire that never needs feeding gutters. Sable stops mid-pour, and for the first time tonight
  she looks afraid: *"It doesn't do that. It has never done that."* Wood won't help; this fire has
  never taken wood.

> *"The hearth dips. Not a flicker, a dip, like something under it took a breath and didn't let it
> out. Then again. The light in the room goes the colour of old brass, and Sable has stopped
> pouring."*

**Finding it and reading it:**

- **Finding it:** Odibli checks every fire for mail, so give him advantage, or let him find it
  automatically. A page is curled in the coals and won't burn, and a glyph on it is slowly
  brightening.
- **Reading it** (Arcana DC 13): it's a smother-charm. It can't be pulled out, because it's bound to
  the fire, and it can't be erased, because it's written. **It can be written over**, but only
  while the fire stays alight.

**The deed, run in rounds:**

- **The flame track: 3 → 2 → 1 → 0.** At 0, the charm lets go.
- **Show the track (engine 2026-10-09, committed 2026-10-13).** Put three coins on the table and take one away
  each time the flame drops. A good Arcana read tells them what 0 means: *"When it dies, it all
  comes out at once."* They should know they can lose this. Don't tell them that Odibli levels
  either way.
- **Each round, someone feeds the fire magic, or it drops one step.** A fire cantrip (Fire Bolt
  into the hearth, Produce Flame, Prestidigitation) holds it for one round. A spell slot burned
  into it holds it for as many rounds as the slot's level. **This is the party's job**, and Halsby
  and Odibli can both do it.
- **Halsby and fire (narration only, no rules cost; Jeff 2026-10-25).** Heat costs him out of
  all proportion, and he avoids fire and lies badly about why. If he feeds the flame, show it:
  *"The heat comes to your hands like something dragged up a well. Your fingers go grey to the
  knuckle, and you're shaking by the time it catches."* If anyone asks, he lies, and badly.
- **Each round, Odibli makes one stroke:** INT with calligrapher's supplies, DC 14 (he's at +7). A
  failed stroke also drops the flame one step.
- **Three successful strokes** overwrite the glyph.
- **If the flame hits 0:** the charm bursts. 2d6 fire to everyone at the hearth (DEX 13 for half),
  and the room catches. They put it out, but the one room that survived the raid is scorched and the
  hearth is cold until Asher recovers. Odibli still levels: he tried, in the fire, for her.

**The last stroke:**

- **Miguel picks the word he writes over the glyph.** If he wants a suggestion: the charm says
  *consume*, and he turns it into *kindle*.

> *"The last stroke goes into the coals and the glyph stops being what it was. For a heartbeat the
> fire is all the way out, and every one of you feels the cold come up through the floor. Then it
> comes back up the chimney in one long breath, gold to the rafters, and stays."*

- **Odibli levels to 5.**
- Sable lets go of the bar, looks at Odibli a long moment, and says only: *"…Don't tell anyone it
  went out."* She explains nothing (she's not saying Asher's name tonight).
- **The seed:** the charm paper matches the charms Tallis sold at the fair. Mara knows his name.
  Someone may ask who taught him. Leave it there.
- **His Aethryn rule (Jeff, 2026-10-25):** each leveled spell rolls a hidden d6, and a 1 means the
  Citadel sensed it. Every slot he burns into the hearth is a cast; cantrips are never sensed. Log
  every cast and any spell 1s in `scheduler/campaign/_citadel-clock.md`, which also holds the
  ideas to spend on a sensed cast.
- **They sleep.** Upstairs, in rooms with beds and not much else. It helps; it is not a long rest. One line: *"You sleep
  like dropped coats. It isn't enough, and you all know it."*
- **Transition:** grey light, and the trail is getting older.

### Scene 2 — Dawn at the Ford

- **Summary:** Breakfast and a short rest. Sable sees them off, Silas lends five horses as a favour
  debt, and Asher's fox is waiting mid-ford to fuse Halsby's Shadowless Spear. Halsby levels to 5.
  Then the ruts, heading southeast.
- **Where:** [[Ashford]]'s ford. Cold water over flat stones, mist on the tributary, the cart ruts
  biting into the far bank.
- **Cast:** [[Sable Wren]] · [[Silas Crubb]] · [[Jory Pike]] · the fox ([[Aashal-Groon Mellenegon Borak]])
- **Enemies:** none
- **DCs:** none
- **Time:** ~15 min
- **Trigger:** first light.

#### S2_SHORT_REST — The short rest is here, before they ride

- Breakfast at the Lioness and an hour at the ford. One short rest: hit dice and short-rest
  features. Nothing else comes back.
- **Sable's send-off** (engine, 2026-10-21), at the door with a sack of hardtack and cold pie:
  *"Bring back what you can carry. Bring back all five of you. If it's one or the other, I know
  which I'd pick, and so does the bank."* If the hearth was scorched, she says it without looking
  back at it.

#### S2_HORSES — Silas lends the horses: "bring them back shod"

- **Tokens:** Silas and Jory with five horses at the ford. No other townsfolk.
- Silas brings five horses himself, with Jory Pike leading the last two, which tells you how much he wants that ale back.
- *"These are loans, not gifts. I want them back with all four shoes. You'd be amazed how many
  come back with one."*
- *"Funny thing about horses…"* — and it lands on a number: *"…eleven gold a head if you lame one.
  I'm not saying you will."*
- **This is a favour debt.** Returning them sound pays it off (Jeff, 2026-10-07). Log it for the
  favours currency when base-building resumes.
- **Last night's pitches** (engine, 2026-10-21). Silas left both uncommitted. One line each, only
  if the PC is in earshot:
  - To Odibli: *"I've been thinking about your rebundling. Thought about it most of the night,
    actually. Bring me my ale and we'll talk about who's bundling whom."*
  - To Halsby: *"And shade on command. Two hundred and fifty gold. I laughed, and then I didn't
    sleep. Don't tell me how it works. I'm not buying."* A beat. *"Yet."*
- **"Came out of the light."** Jory Pike, holding the last two horses, can't stop staring at them.
  He asks one of them, quietly, if it hurt.

#### S2_SPEAR — The fox waits at the water's edge. Halsby's Spear

- **Tokens:** the fox on the stone mid-ford, placed only when Halsby spots it.
- **Introduce:** the fox (Halsby has met it; the rest of the party hasn't)
  - **Look:** an ordinary red fox, sitting perfectly dry on a stone mid-ford. Green eyes leaking
    smoke.
  - **Sound:** precise and dry, a little amused. Talks like someone settling a bill.
  - **Impression:** far too calm, and it knows far more than it says.
- **Choice (Halsby):** he gets one question for the fox, and it answers it, in Asher's dry voice and without ever giving his name. What he asks is recorded.
- **Halsby's spotlight beat.** "After you, not before." The job is done.
- The fox is sitting on a flat stone mid-ford, dry, as if the water goes around it. Smoky green
  eyes. Nobody else sees it until Halsby does.

> *"On a flat stone in the middle of the ford, where the water should be washing over it, there's a
> fox sitting perfectly dry. The current bends around the stone like it's been asked to. Its eyes
> are green and leaking smoke, and it's looking at Halsby the way a creditor looks at a man who's
> finally paid."*

- **The fox's lines** (Asher's voice, through it; never gives his name):
  - *"You did it the way I asked. People rarely do. Your spear, please. And the shard."*
  - *"It'll hurt the shadow, not you."*
  - When it's done: *"It casts no shadow at the point. That's the part that keeps the dark from
    eating you quite so fast. Don't lose it."*
  - If Halsby asks what Asher wants next: *"She'll ask. Not me."* (the later job he owes Sable)
- **His one question (Jeff, 2026-10-25).** The fox answers truthfully, in one or two sentences,
  and never with a name. Each answer pays a sliver of a hook and spends no big reveal: not
  *Rivalen*, not the sacrifice, not what the fade really is. Likeliest questions:
  - "What am I?": *"Borrowed. Most people are. Yours just has a lender who keeps very good
    books."*
  - "What is the shard?", asked as it sinks into the spearhead: *"A piece of the underside of
    something that was never meant to touch the ground. Why it casts no shadow, I'd rather not
    guess. Out loud."*
  - "What does the order want with me?": *"What every lender wants. For you to keep coming back.
    They've been keeping your account since before you could read."*
  - "Did my grandmother know?": *"She knew everything you ever asked her. That was rather the
    problem."*
  - **Anything else:** one true sentence, dry, no names. If the true answer is a big reveal, the
    fox declines: *"That one costs more than a spear."*
- **The fusing:** about two minutes. Halsby keeps hold of both the whole time. The shard sinks into
  the spearhead as if it grew there. The haft throws a shadow. The point does not.
- **[[The Shadowless Spear]]** (confirmed, `meta/loot-options/Halsby/weapons/The Shadowless
  Spear.md`): +1 · his spellcasting focus · **while he carries it, each mourning rite holds the fade off twice as long (12 days, 16 after a good night)** ·
  reach 15 ft in dim light or darkness. Uncommon — his act Uncommon.
- **History, three sentences, if asked:** *His own spear and his own shard, fused by something old
  in the water under Ashford. It was promised by a fox and delivered at a ford. What it cost the
  thing that made it, nobody said.*
- **Halsby levels to 5** as the point stops casting a shadow. The fade slows and the level lands
  together.
- The fox walks off the stone and under the water. It doesn't come up.

#### S2_TRAIL — Deep ruts, a dropped stave, southeast

- The ruts are deep (laden cart). A cask stave lies split on the far bank. The trail heads
  southeast toward Duskwater.
- **Transition:** they ride.

### Scene 3 — The Red Trail

- **Summary:** The chase, run as a skill challenge in four stages. Each PC makes one check per
  stage, and a stage is won when 3 of 5 pass. Stages won set how ready the camp is: 4 unaware,
  2–3 dusk, 0–1 night alert. Failures cost lead, never the trail.
- **Where:** the southeast road from [[Ashford]] toward Duskwater: the ford, the drover's road, the
  dusk fork, the camp approach.
- **Cast:** the party and Silas's horses
- **Enemies:** none (the rear guard at stage 3 is Scene 4)
- **DCs:** Stage 1 — 12 · Stage 2 — road 13 or shortcut 11 · Stage 3 — 13 · Stage 4 — ride in 14 or
  walk in 12 · Checks: Survival, Perception, Animal Handling, Nature, Athletics, Investigation,
  Stealth (stage 4)
- **Time:** ~25 min
- **Trigger:** they ride out.
- **Stops:** working labels only. Stops are scheduler content; `/recap` canonizes only what they
  visit.

#### S2_CHASE_RULES — Four stages, one check each, scored by stages won

- **Each stage:** every PC makes one check from the open menu, describing how they help. **A stage
  is won when at least half the party passes** (3 of 5).
- **Menu:** Survival (tracking) · Perception (spotting sign) · Animal Handling (pushing the horses)
  · Nature (reading terrain) · Athletics (crossings) · Investigation (the cart's tells) · Stealth
  (stage 4 only). A player who argues well for something else gets it.
- **DCs:** stage 1 **12** · stage 2 **13** · stage 3 **13** · stage 4 **14** (Jeff, 2026-10-07).
  Record what actually gets used; it fills the empty Skill Challenge table in `meta/difficulty.md`.
- **Two route choices (engine 2026-10-09, committed 2026-10-13):** at stage 2 and stage 4, the party picks a route
  before anyone rolls. Say both options out loud, let them choose, then roll. Details are under
  `S2_ROAD` and `S2_APPROACH`.
- **Failures cost lead, never the trail.** A lost stage is a lamed horse, a cold fork, a night
  crossing. They always find the camp.
- **Result** (stages won): **4** → camp unaware · **2–3** → dusk · **0–1** → night alert.
  Then apply the fork's rider bump, if Ilsa got away (`S2_RIDER`): one step up, capped at night
  alert.

#### S2_FORD_STAGE — Stage 1, the far bank (DC 12)

> *"The ruts come up out of the water deep enough to stand a boot in. Somebody's been dragging a
> great deal of weight in a hurry, and somebody else has been sweeping the edges with a branch to
> make it look like less."*

- **Loss:** a horse balks in the ford and somebody takes a cold soaking. Twenty minutes lost.

#### S2_ROAD — Stage 2, the drover's road (DC 13)

- **Choice (party):** the road (DC 13, a loss costs time) or the shortcut (DC 11, a loss lames one of Silas's horses: 11 gp, favour debt in doubt).
- A wide, old cattle road through rolling scrub. The ruts mix with other traffic here.
- **The route choice:** the road winds around the hills, and a drover's shortcut cuts straight over
  broken scrub.
  - **Stay on the road:** DC 13, as written. A loss costs time.
  - **Take the shortcut:** DC 11. A loss costs a horse, not time: one of Silas's horses goes lame
    (he'll want 11 gp, and the favour debt is in doubt).
- **Perception or Investigation finds (offer one or two):** a hoofprint with a cracked shoe,
  repeated every stride · a wet patch where a cask has been weeping · a whittled curl of antler,
  fresh — someone sitting on the cart seat cutting notches.
- **Loss:** they follow the wrong ruts for an hour before the cracked shoe goes missing.

#### S2_FORK — Stage 3, the dusk fork, and a false trail (DC 13)

- The road splits. One branch shows the ruts plainly — too plainly. A dragged log has laid them;
  the real cart went the other way over hard ground.
- **Survival or Investigation sees through it.** Nature notices the "ruts" don't sink where the
  ground goes soft.
- **The rear guard is here** — see Scene 4. If the party wins this stage, they spot the riders
  first.
- **Loss:** they ride the false branch until it dead-ends at a stream, and double back in the dark.

#### S2_APPROACH — Stage 4, the camp approach (DC 14)

- **Choice (party):** ride in (DC 14, horses close) or tie the horses out and walk (DC 12, nobody mounted, and a fleeing crewman can steal a horse).
- Woodsmoke, and a corral full of horses that can smell theirs.
- **Animal Handling** keeps the borrowed horses quiet. **Stealth** works here too.
- **The route choice:** ride in close, or leave the horses and walk.
  - **Ride in:** DC 14, as written. The horses stay close at hand.
  - **Tie the horses half a mile out and walk in:** DC 12, with no horses to give them away. But
    nobody is mounted if someone runs, and a crewman who flees the camp can steal one of Silas's
    horses on his way out (11 gp, favour debt in doubt).
- **Loss:** a horse whinnies, a corral answers, and somebody at the camp looks up.
- **Set the alert state** now from stages won, add the rider bump if Ilsa escaped at the fork,
  then go to Scene 5.

### Scene 4 — The Dusk Fork

- **Summary:** Nella's rear guard holds the fork. It's a small fight on purpose: what's at stake is
  the rider and the horses, not HP. If Ilsa gets away, the camp's alert goes up a step. The party
  can also scare them off or bluff their way close.
- **Where:** the fork in the drover's road. Long light, scrub, one lone tree, open ground either
  side. Riders show for a long way out here.
- **Cast:** Nella's rear guard, mounted
- **Enemies:** Archer Rider (Ilsa Hask) · Crossbow Rider (Fennel Dray) · Wolf (Cinder)
- **DCs:** Intimidation 13 — Fennel and Cinder run · WIS 12 save — morale · Silas's horses: AC 10,
  HP 13
- **Tactics:** Fennel shoots the horses and Cinder goes for their legs. Ilsa rides for the camp
  when the fight turns. Morale breaks when Ilsa drops, or Fennel and Cinder are both down.
- **Time:** ~15 min, 1–2 rounds
- **Trigger:** during stage 3 of the chase.

#### S2_REARGUARD — Nella's rear guard holds the fork

- **Tokens:** dusk fork map. Archer Rider and Crossbow Rider mounted by the lone tree, Wolf low in
  the grass between them. Ilsa's token goes to the grey margin if she rides off.
- **Introduce:** Archer Rider (Ilsa Hask, Scout)
  - **Look:** sun-faded leather riding armour, a longbow strung and ready, a short sword. Squinting
    into the sun, already half-turned toward the camp.
  - **Sound:** quiet. Says one thing to Fennel you can't hear.
  - **Impression:** the one who'll ride for help, and the one you'd want to stop.
- **Introduce:** Crossbow Rider (Fennel Dray, Bandit)
  - **Look:** wiry farm lad in a patched jerkin, a light crossbow across the saddle, a cheap curved
    blade.
  - **Sound:** twitchy, talks fast, too loud.
  - **Impression:** a boy in over his head who loves his wolf more than anyone in the band.
- **Introduce:** Wolf (Cinder)
  - **Look:** grey-black, scarred muzzle, a frayed rope collar somebody tied on with care.
  - **Sound:** silent until it moves.
  - **Impression:** someone's pet, and still a wolf.
- **Choice (party):** fight, scare them off (Intimidation DC 13: Fennel and Cinder run, and nobody reports), or bluff to close the distance. Ilsa riding for the camp is the cost of getting it wrong.
- **If the party won stage 3:** they see the riders first, sitting their horses by the lone tree.
  Surprise is theirs to take.
- **If they lost it:** Ilsa sees them first and puts an arrow into the lead horse's
  saddlebag as a warning.

> *"Two riders by a lone tree at the fork, black against the low sun, and something grey and low
> in the grass between them. One of them stands in the stirrups to look at you, then sits back
> down and says something to the other. You can't hear it. The grey thing gets up."*

- **Fennel's lines:** *"Told you someone'd come."* · *"That's the sky lot. That's them."* · *"Ilsa,
  go! Ride for her!"*
- **Talking it down works:** Intimidation DC 13 sends Fennel and Cinder running, off the road
  and away from the camp. A scared farm lad doesn't report to Nella. A good bluff keeps them
  sitting long enough to close.
- **Fennel shoots the horses, and Cinder goes for their legs.** Unhorse the pursuit and they
  still find the camp, but late and on foot (a lost horse costs them stage 4's lead, never the
  trail). Silas's horses: AC 10, HP 13. A downed horse is one Silas wants 11 gp for, and it puts
  the favour debt in doubt. Say it the first time a bolt goes in: *"That's Silas's horse."*

#### S2_RIDER — Does a rider reach the camp?

- **Ilsa's job** is to warn the camp, not to win. When the fight turns, she rides.
- **The head start:** if the party lost stage 3, Ilsa is already moving when initiative
  starts. A Dashing horse covers 120 ft a round, so the casters get one or two rounds of shots
  (Fire Bolt and Magic Missile reach 120 ft, Chromatic Orb 90 ft) before she is out of range. Her
  horse (AC 10, HP 13) is the easier target than she is (AC 13, HP 16).
- **The map edge isn't her escape; range is (Jeff, 2026-10-12).** The Roll20 map is about 100 ft
  across, so she leaves the northwest edge on her first move. Keep her token on the page's grey
  margin and count feet: ~120 ft out after round 1 (cantrips still reach), ~240 ft after round 2
  (past cantrips, still inside longbow long range).
- **If Ilsa escapes toward the camp**, its alert state goes up one step (unaware → dusk →
  night alert), applied **after** stage 4 sets it, and capped at night alert. Only Ilsa carries
  the warning; Fennel flees home, not to Nella. Stopping her is the real objective. Make that
  legible: *"The woman isn't fighting you any more. She's riding for the camp."*
- **Morale:** Ilsa down, or Fennel and Cinder both down → DC 12 WIS. Failures flee. A fleeing
  Ilsa rides for the camp (the bump above); Fennel and Cinder just run.
  - Fennel, when Cinder drops: *"No — Cinder, get up, get up—"* He stops fighting and goes to
    the wolf.
  - Fennel, when he runs: *"I'm out. Tell her I'm out."*
- **Transition:** the light goes. The camp approach (stage 4).

### Scene 5 — The Waystation

- **Summary:** Nella's camp. The party scouts (or not), picks heist, assault, parley or trick, and
  takes the casks back. Nella loses, escapes on a fallback she rigged days ago, and drops her debt
  tally. The camp gives up three things: the band's size, Harrow Bane's name and the banner.
- **Where:** an old drover's relay short of Duskwater: long shed, corral, well, the cart,
  watch-fire, and set back, the overwatch ridge, a fast river and a rigged plank bridge.
- **Cast:** [[Nella]] on the ridge · the camp crew · the Marlow banner on the shed's pole
- **Enemies:** Drover (Varrick Tenn) · Cask-hand (Haddo Keel) · Half-orc Cask-hand (Brask) ·
  Tally-man (Sennet Orrin) · Hedge Priest (Hesper Mudd) · Roof Guard (Clatter) · Mastiff 1 (Brick)
  · Mastiff 2 (Mortar) · Sniper ([[Nella]])
- **DCs:** Perception or Survival 14 — scout the back of the ridge · Perception 13 — spot the crew's
  crystal cords · Stealth vs passive 18 — past the dogs · Athletics 13 — swim the river · Animal
  Handling 13 — start a stampede · Deception vs Insight — Varrick easy, Sennet +4, Nella +7 · WIS 12
  save — morale · Investigation 12 / 16 — read the tally · DEX 12 — cross the staked perimeter at
  speed (night alert)
- **Tactics:** the crew holds its stations around the cart and never converges. Nella spreads her
  shots to wound and pin, marks whoever climbs toward her (never a caster), and never shoots a
  downed PC. Morale breaks when Varrick drops or the crew is down to 2.
- **Time:** ~45 min
- **Trigger:** the chase ends.
- **The ground:** an old drover's relay short of Duskwater. **Long shed** (bunks, ledger, stores) ·
  **corral** of nervous horses (noise hazard for sneaks, stampede lever for chaos) · **well** ·
  **the cart**, parked by the shed with the casks still loaded · **watch-fire** · and set back, the
  **overwatch ridge** with a brush blind, a **fast cold river** behind it, a **rigged plank bridge**
  over the river, and a **cached horse** half a mile beyond. Map: `maps/waystation.txt` (render with `uv run scripts/battlemap.py --session 30`). Key refs: cart R10:S12, Nella's blind AB8:AC10 (55 ft from the cart, up a difficult slope at X:Z), bridge AF9:AH9, 15 ft behind the blind.
- **Jeff's Roll20 map (2026-10-12)** differs from the reference render. Rulings:
  - **The cart** is the covered wagon nearest the slope. Haddo and Brask hold there, between the
    yard and the ridge.
  - **The boulder band** is the slope, difficult terrain, **except the rubble gap** where the
    bridge path cuts through. The gap is normal ground, the fast way up, and Nella's Marked Quarry
    goes on whoever takes it.
  - **The river:** swimming it is DC 13 Athletics; a failure costs the round and carries you 10 ft
    downstream. A crossing still takes ~3 rounds, so the bridge drop holds her lead.
  - **The bridge** is pinned to drop. One action pulls the pins and the deck goes into the water.
  - **The quiet approach** is the south tree line, lightly obscured. No scrub patch; sneaking is
    harder than the reference had it.

> *"The waystation sits in a fold of the land: a long shed with a sagging roof, a corral full of
> horses that have already noticed yours, a well with a bucket on a chain, and a fire. Beside the
> shed is a cart you'd know anywhere now, still loaded, the casks lashed down under a tarp. On a pole
> above the shed a banner moves in the dusk wind, too fine for this place. And up on the ridge
> behind it all, where the brush is thickest, nothing moves at all."*

#### S2_APPROACH_CHOICE — Heist, assault, parley or trick?

- **Tokens:** waystation map. Drover by the watch-fire, Cask-hand and Half-orc Cask-hand at the
  cart, Tally-man at his table by the shed, Hedge Priest at the fire, Roof Guard on the shed roof,
  Mastiff 1 and 2 chained at the corral, horses in the corral. Sniper in the brush blind on the
  GM layer until she's seen or speaks. Party tokens on the south tree line, or wherever the chase
  left them.
- **Introduce:** Drover (Varrick Tenn)
  - **Look:** leathery, studded leather worn like a uniform, a long cart-whip, a row of throwing
    daggers across his chest, a scuffed bracer on his left forearm.
  - **Sound:** barks orders like he's still in the army.
  - **Impression:** an old soldier who treats the cart like a posting. The one holding them
    together.
- **Introduce:** Cask-hands (Haddo Keel, and Brask the half-orc)
  - **Look:** stained leather aprons over jerkins, iron-banded cask-mallets, heavy crossbows
    propped on the cart wheel. Haddo is huge; Brask is long-armed, asleep against the wheel.
  - **Sound:** Haddo hums and counts the casks out loud. Brask grunts and snores.
  - **Impression:** paid by the barrel. "Nobody touches the cart" is their whole job.
- **Introduce:** Tally-man (Sennet Orrin)
  - **Look:** a clerk's coat, ink on his cuffs and fingers, a ledger under his arm, a short sword
    and a little hand crossbow.
  - **Sound:** precise, clipped, suspicious. "Who signed your orders?"
  - **Impression:** doesn't belong with this crew. Someone else's man, here to check the haul.
- **Introduce:** Hedge Priest (Hesper Mudd, halfling)
  - **Look:** homespun robe, a knotted club, a cord of mismatched holy charms she keeps touching.
  - **Sound:** fretful, bossy with the wounded.
  - **Impression:** prays to whatever's listening, and isn't sure which one works.
- **Introduce:** Roof Guard (Tam "Clatter" Cobb)
  - **Look:** on the shed roof, a light crossbow, a quiver of mismatched bolts, a curved blade in
    his belt.
  - **Sound:** you hear him before you see him, fiddling with his bolts. Shouts targets.
  - **Impression:** nervy lookout who'll give away anyone standing in the open.
- **Introduce:** Mastiffs 1 and 2 (Brick and Mortar)
  - **Look:** big dogs in spiked iron collars on heavy chains at the corral.
  - **Sound:** bark at anything sneaking within 30 ft.
  - **Impression:** the camp's alarm bell.
- **Choice (party):** heist, assault, parley or trick. Each reaches the casks; each costs and gains something different (see below).
- **Choice (party):** scout the ridge first (`S2_SCOUT`), or go straight in. Scouting costs time and a check; it buys the chance to cut Nella's exit.
- **All four are viable.** Let the party pick and don't steer.
- **`S2_SCOUT` — Nella's exit can be found first (engine 2026-10-09, committed 2026-10-13).** Anyone who scouts
  before choosing finds the back of the ridge. They can circle wide (Perception or Survival
  DC 14), send Bosco or a familiar around (no roll, just time), or follow Sergei's nose (he smells
  the cached horse). What they find: the brush blind, the plank bridge pinned to drop into the river, and
  fresh dung half a mile out where a horse has been tied for days. Say it plainly: *"Someone's
  planned a way out of here."* This is what lets them cut off her escape on purpose (see
  `S2_ESCAPE`).
- **Night heist** — get the cart out without a fight. Watch rotations, the corral, and Nella is the
  light sleeper. Pulling it off means **the party leaves *her* the taunt for once.** Don't steer. If they
  choose it, a clean heist pays well.
  If it goes loud halfway, drop into `S2_FIGHT` with the party already at the cart.
  - **A good Perception check notices (offer one or two):** Haddo humming a count under his
    breath, even half asleep · Brask snoring against the cart wheel · a chain clinking at the
    corral whenever a dog shifts · the watch-fire burned down to red coals, with little light past
    the well · one fresh bootprint on the ridge path, pointing up.
  - **A clean heist still pays out.** The tally rides with the cart: she whittles it on the seat
    (the antler shavings at `S2_ROAD`), so it's in the box under the seat, and they drive off
    with it (`S2_TALLY`, found later, not dropped). The ledger (Sennet's table, I5), the banner
    (the pole, L3) and Varrick's bracer (his bedroll by the watch-fire) are each one more Stealth
    check to take; failing one goes loud.
  - **Nella, after a clean heist:** no rout, no bridge dropped. Skip the escape ladder. She wakes to
    an empty cart, and the party never sees her face. If they left a taunt, it reached her.
- **Assault** — `S2_FIGHT` on their initiative.
- **Parley** under a truce-branch. Nella talks from the ridge, never comes down. She won't give up
  the casks, but **her debt can show its edge:**
  - *"That ale's worth a number to me. You aren't."*
  - *"Everyone wants something back from me tonight. Get in line."*
  - Pushed on why she does this: *"I owe someone. When it's paid, I'm done."* Then
    nothing more.
- **Trickery** — posing as the band's relay riders, or Marlow men with new orders. Insight and
  Deception contested; Varrick is easy to fool, Sennet less so (Insight +4), Nella isn't (Insight +7 from the ridge). If it
  half-works, it buys positioning, not the cart.
  - Varrick, fooled: *"Relay's early. Fine. Horses in the corral, and nobody touches the cart."*
  - Sennet, suspicious: *"Who signed your orders? Show me the hand."*
  - Nella from the ridge, not fooled: *"Varrick. Count them."*

#### S2_CRYSTALS — The crew wear crystals too

- **Draft (engine, 2026-10-21).** It pays off Halsby dealing an earshot crystal to every PC at
  Session 30, and it runs alongside whichever approach they pick. Nothing in it is new canon
  unless it fires.
- **What's true (DM only):** every raider at the Lioness wore a crystal cut from the same stone,
  and so do Nella and most of this crew (cords at the neck, crudely wrapped in metal). Listening
  only needs the crystal on your body (`meta/loot-options/Party/misc/Earshot Crystals.md`), so
  **a PC who speaks to "all holders" within 300 ft is heard by every crew member wearing one.**
  Speaking to one PC they can see is safe. The camp is well inside 300 ft from the tree line.
- **Don't warn them.** Let them find out the way they found out how the crystals work: by
  accident. A careful party can find out first: a Perception check (DC 13) on the camp sees
  the same cord at Varrick's and Haddo's necks, or someone remembers that the bodies wore them.
- **If someone broadcasts to "all":**
  - **During a heist:** the crew hears a stranger's words in their heads. Haddo stops counting.
    Varrick: *"Who said that? Who's in my head?"* The heist goes loud next round, unless the party
    turns it (see below).
  - **Before an assault or parley:** Nella hears it on the ridge and knows how many they are and
    roughly where. She takes her first shot with advantage, and the parley opens on her terms:
    *"You talk too much. All five of you."*
  - **During the fight:** a called target or plan reaches the crew too. Once, the target moves
    first.
- **The lever, if they work it out:** a broadcast reaches the crew as well. A PC can use it on
  purpose: a false order in Nella's voice (Deception against Varrick, DC 12), panic ("she's
  leaving you") for disadvantage on the morale save at `S2_MORALE`, or a private word to one crew
  member they can see (Fennel's kind, or Hesper), which Nella can't hear.
- **Nella's own crystal:** she never broadcasts. If the party listens in, they hear Varrick once:
  *"Nella? Nella, where do you want us?"* No answer.
- **Tokens:** none.

#### S2_FIGHT — Two layers: the floor and the ridge, 3–4 rounds

- **Tokens:** move the Sniper token from the GM layer to the brush blind on her first shot (or
  earlier, if they parleyed and she spoke).
- **Introduce:** Sniper ([[Nella]]); first seen here, or at parley
  - **Look:** long hair, a long weathered cape over dark studded leather, a tall longbow, a short
    sword she never touches. Odibli has seen her once, on the cart seat.
  - **Sound:** patient, dry, never raised. Short sentences from a long way away. Counts out loud
    when she's thinking.
  - **Impression:** calm in a way that's worse than anger. Watches the fight like she's doing sums.
- **The floor:** Varrick, Haddo and Brask at the cart, Sennet slipping between them, Hesper at the
  fire, Clatter on the roof, and the dogs at the corral. Sized **Hard** (see Difficulty check):
  Varrick and the cask-hands are built to take two hits and keep swinging, so Dip and a Shatter
  don't end it in round 1. The crew holds stations; they don't converge.
- **The ridge:** Nella's ranged pressure, spread to wound and pin. Closing on her costs the floor
  fight bodies; ignoring her costs HP every round. **That squeeze is the fight.**
- **Mid-fight lines:**
  - Varrick: *"Hold the cart! Nobody touches the cart!"* · *"She's up there, she's got you, keep
    them in the open!"*
  - Haddo, counting: *"Eleven. Twelve. Nobody touches twelve."* · Brask: *"That's the sky lot."*
  - Sennet, the first time he's hit: *"I count this lot. I don't bleed for it."* · Hesper: *"Stand still, Varrick, I can't — stand
    STILL."*
  - Clatter, from the roof: *"One by the well! One by the WELL!"* · once Nella leaves her perch
    (escape ladder, step 1 or 3): *"Where's she going? Where's she GOING?"*
  - Nella, calm, to whoever is climbing toward her: *"Keep climbing. I'll be gone before you're halfway."*
- **Halsby's Spear in the dark:** reach 15 ft in dim light or darkness. If the fight is at night,
  describe the shadow carrying the point the last ten feet.
- **The horses:** a stampede through the corral is a lever for chaos (DC 13 Animal Handling to
  start it on purpose, or it starts on its own if fire reaches the corral).

#### S2_MORALE — The drover drops, or the crew is down to two, and the rest break

- DC 12 WIS for every surviving crew member (the dogs slink off instead). Failures scatter into
  the dark, dropping what they hold. Sennet runs with the ledger if nobody is near the shed.
- **Not at half.** Half the crew falls in round 1 against this party, which would end the fight
  before Nella's pressure lands. Varrick keeps them in it until he drops.
- Morale-break line: *"She's leaving us. She's LEAVING us."* — and they run.
- Hesper, when a PC closes on her after Varrick drops: *"Don't. I'll put the club down. I'll put
  it down."*
- **This also triggers `S2_ESCAPE`.**

#### S2_ESCAPE — Nella loses, and gets away on a fallback she rigged

- **She loses.** The party takes the casks and breaks her crew. Her escape is flight from a
  defeat. She steals nothing this time.
- **The ladder, in order, run honest:**
  1. **Cover the rout:** up to 2 rounds of covering fire for whoever is running.
  2. **The taunt:** one deliberate miss into a post at head height, then a dry voice from the dark:
     ***"Keep the ale."***
  3. **Withdrawal:** over the river on the plank bridge, **pulling the pins behind her** so the deck
     drops into the water. The party swims it (DC 13 Athletics, ~3 rounds) or detours. The cached horse is half a mile out. Skirmisher's Step and
     Prepared Ground keep the gap honest.
  4. **The tally falls (Jeff, 2026-10-07):** in the scramble she drops it — see `S2_TALLY`.
  5. **Last valve:** if truly cornered, the river plunge, letting the current take her
     downstream. She knows the water. If even that can't
     honestly stick, **the table wins** and her arc gets re-planned. Never visibly cheat.
- **If they cut her off first (engine 2026-10-09, committed 2026-10-13).** If the party found her exit at
  `S2_SCOUT` and acted on it, those steps of the ladder are gone. Skip them:
  - **Bridge dropped early, or someone holding it:** she has to swim the river, and they can
    catch her in the water.
  - **Cached horse taken or chased off:** she runs for the river (step 5).
  - **Both:** they cornered her fairly. The table wins (see Contingencies).
- **Make the preparation visible afterwards.** Whoever reaches the bank sees the pulled pins, the
  deck pinned in place days ago, the trampled spot where the cached horse waited. *She planned her exit
  before you ever arrived.*

#### S2_TALLY — She drops her debt tally

- **Choice (party):** the 250 gp purse: keep it (about one room in the new wing), spend it, or give it back. It is exactly her remaining debt, and the choice comes due later (`S4_DEBT`, `PAY_NELLA`).
- At the bridgehead, where she pulled the pins: **a notched antler stick and a purse of counted,
  sorted coin.** After a clean heist, both are in the box under the cart seat instead.
- **First touch:** the antler is worn smooth where a thumb rests. Hundreds of notches, in groups,
  some scored through. The purse is tied in three places, each section a different coin, counted.
- **Investigation, DC 12:** the notches are payments; the scored-through groups are *years*.
  **DC 16:** the last group isn't finished, and the gap left for it is small. She is close.
- **Don't name the debt.** The party holds something she needs back. That's the whole beat.
- **The coin** in the purse: **250 gp**, in its three tied sections: **150 gp · 500 sp · 5 pp**.
  It is exactly what she still owes. The unfinished last group of notches leaves room for the same
  sum, so anyone who counts both (DC 16 on the tally, then a look at the purse) can work it out.
  Never say it aloud for them. The choice: about one room in the new wing, or her freedom. Whether
  they spend it has a consequence later (`S4_DEBT`, `PAY_NELLA`).
- **Varrick:** *"That's not wages. Nobody saves like that for wages."* Cue: the purse is opened in
  front of him, if he's a prisoner.

#### S2_CAMP_INTEL — What the camp gives up: the band's size, Bane's name, the banner

Three discoverables, from Jeff's pick. **Nothing else** — no Marlow coppers, no Jorn.

- **Band scale:** the shed is provisioned for far more than one crew. Thirty bedrolls, rations for
  a month, a rack of matched boots. *This was one finger of a hand.*
- **Bane confirmed:** a duty ledger in a clerk's tidy hand (Sennet's). Rotations, payments, and at
  the foot of each page the same initials and one name in full: **Harrow Bane**. No face, no
  description. If Sennet is taken alive and asked, he says the name and goes white. If he ran with
  the ledger, it is found dropped in the scrub on the road east, or he's caught with it.
- **The Marlow aegis-banner** on the shed's pole: old, fine, heraldic, far too good for a bandit
  relay. The party can take it. **It hangs in the Lioness later** and is the prop that unspools the
  feud. Nobody in the camp can say whose it is. Silas can, back home, and goes quiet when he does.
  - Sample, on first look: *"That's not a bandit flag. Bandits don't have flags. That's someone's
    grandfather's flag."*
- **The waystation Common: [[Varrick's Parrying Bracer]], for Dip.** It is on Varrick's left
  forearm, and it is his Parry in the fight, so the table sees it turn their blows before they own
  it. Taken off him, dead or captured. After a heist or parley, it hangs unlaced on his bedroll by
  the watch-fire. Once per short rest, reaction: +2 AC against one melee hit Dip can see.
  - **First touch:** the lacing has been redone so many times the holes have worn into slots.

The camp crew are named in Combatants, but none of them are entities. If one survives and matters,
`/recap` creates them.

### Scene 6 — The Man in the Cell

- **Summary:** The casks come home on their own cart. The horses go back to Silas, Silas sees the
  banner, and Sable sees the cart. But the town is looking at Mara's cell: a raider walked in and
  surrendered while they were gone. End on the cell door.
- **Where:** the road back, then [[Ashford]] at dusk the next day (or by night, if they ride
  straight through).
- **Cast:** [[Silas Crubb]] · [[Sable Wren]] · [[Mara Tull]] · the prisoner (a silhouette: no name,
  no lines)
- **Enemies:** none
- **DCs:** none
- **Time:** ~10 min
- **Trigger:** the party heads home with the cart.

#### S2_HAUL_HOME — The casks come home on their own cart

- **Choice (party):** bring the banner home or leave it. Hung in the Lioness, it is the prop that unspools the feud, and Silas sees it.
- **The cart is theirs** (Jeff, 2026-10-07). It becomes the Lioness's delivery cart.
- **The horses go back to Silas** sound and shod, and the favour is paid.
  - Silas, checking each hoof: *"All four shoes on every one. You kept your word, so I'll keep
    mine. We're square, and I'll remember you were good for it."*
- **Silas sees the banner** (first look, before he goes quiet; he never says whose it is):
  *"Where did you get that banner?"* A beat. *"If you hang it, hang it high. Some people who
  drink here would know whose it is, and you don't want them knowing you have it."*
- **Long rest:** if they rest at the waystation first, the clock resets there. Note it for `/recap`.
- **Sable, at the door, sees the cart.** She doesn't run out. She puts down what she's holding and
  stands very still. *"That's twice now you've saved this place."* (the second deed — banked, and the next Stake tick
  pays when base-building resumes)
- If they bring the banner: she looks at it a long time. *"Not in my bar."* A beat. *"…Fine. Above
  the hearth. Where I can see it."*

#### S2_CELL — While they were gone, a raider walked in and surrendered

- The town is buzzing about something else. A raider walked into Ashford this morning, laid his
  weapons on the ground in front of Mara's office, and surrendered. He hasn't said a word since.

> *"The square is fuller than it should be at this hour. Nobody's looking at your cart. They're
> looking at the sheriff's office, at the one small barred window in its side. Through it you can
> see a man sitting on a bench with his hands on his knees, not moving. Somebody near you says
> 'rope' like it's already been decided."*

- **The prisoner is a silhouette only (Jeff, 2026-10-07).** No name, no lines, no face in the light.
  He is Tyler's cameo, beat 1. **Nothing at this table depends on Tyler's backstory.** The scene
  commits only what the cameo already locks: a raider from Bane's band walked in, surrendered, and
  went silent. Who he is and why he quit stay open.
- **If Tyler needs more time:** the silhouette carries over. The hanging waits on Cael's reeve, so
  Mara can hold a silent man for days, and Session 32 can open somewhere else and come back to the
  cell later. Don't invent a name, a face, or a reason here to fill the gap.
- **Mara, at the door, before anyone asks:** *"He walked in. Put his blade down on my step. Hasn't
  said a word since. Half the town wants him hanged by week's end."* A beat. *"I haven't decided
  anything."*
- **End on the cell door.** Don't let them in tonight.

## NPC Quick-Reference

### [[Sable Wren]]

- **Motivation:** open Ashford's first tavern on time, pay Silas the ~650 gp she still owes, and
  keep her permit. She can't do it without the stolen stock, and can't defend the place alone.
- **Knows:** what the stolen stock is worth, and that without it she loses her permit · that the raiders are
  not local · that something under the town answers her, and she calls it Asher (she won't say so
  tonight) · nothing about Harrow Bane beyond the name · why the ale is called The Mistake, and she
  isn't telling.
- **Voice:** warm, competent, unhurried. Treats a lord and a drifter the same. Answers the question
  asked, not the one implied, and never explains herself.
- **Now:** exasperated with Odibli since his "bad business owner" verdict at Session 30. The
  eye-roll was the table's favourite thing; keep it dry, never cruel.

### [[Mara Tull]]

- **Motivation:** hold the town together with too few hands, and decide what the party is.
- **Knows:** every raid Ashford has taken and what it cost · the matched boots · that Lord Cael
  answers letters and sends nothing · that the far side of town was hit by someone different ·
  nothing yet about why her prisoner surrendered.
- **Voice:** quiet, weathered, economical. Gives an order once. Grief steeled into grit, never
  spoken.
- **Kit (player-facing):** *a sheriff's star on a worn coat, a long knife on her belt, and tonight
  a deputy's blood down one side. Slung across her back, muzzle down, a short heavy thing of dark
  brass and iron with a flared mouth like a bell bolted to a walnut stock. It smells of burnt
  sulfur, the way the air does after lightning.*
- **Label (party-facing):** Mara (the party knows her)
- **The Fourth Letter** (lore in her entity file): a Cael heirloom sent by Lord Cael in place of
  the soldiers Ashford asked for. If anyone asks, a townsperson answers, not Mara: *"His lordship
  wrote back three times. Fourth time he sent that."* She fired one charge in her own street fight
  tonight; the party may have heard the clap from the yard. Six left, and nobody can make more.

### [[Silas Crubb]]

- **Motivation:** keep Ashford, and himself, carefully neutral. Get the ale back without picking a
  side.
- **Knows:** stock, debts and prices · who owes whom · whose banner that is (and he'd rather not).
- **Voice:** affable, drawling, self-deprecating. Tangents that always land on a number. Slightly
  slippery.

### The fox ([[Aashal-Groon Mellenegon Borak]])

- **Motivation:** pay what it promised, and keep Sable safe through people with reasons.
- **Knows:** far more than it says. Says almost none of it.
- **Voice:** precise and dry, a little amused. Talks like someone settling a bill. Never gives
  Asher's name.

### [[Nella]]

- **Motivation:** get to the end of the tally. Tonight that means keeping the casks if it's cheap,
  and keeping herself if it isn't.
- **Knows:** Bane's operation from the inside, and would trade it for the right number. Not tonight.
- **Voice:** patient, watchful, dry. Short sentences from a long way away. Never raises her voice.
  Counts things out loud when she's thinking.
- **Look:** long hair, a cape, a bow across her knees on the cart seat. Odibli has seen her once.

### Walk-ons (Ashford townsfolk)

Old Tobin Reed, Jory Pike, Agnes Brand and Dunny Marsh became canon at Session 30; the rest have
no entity files, and `/recap` decides. Full introductions were at Session 30 (`S2_TOWN` and
`S2_NAMES`, in its file). Token look in brackets.

- **Old Tobin Reed** — ferryman, lost his boat tonight. Gives the Wick description.
- **Jory Pike** — stable boy, fourteen. Saw Nella take the southeast track. Leads two horses at dawn.
- **Agnes Brand** — washerwoman, burned hands. Hums when nervous. Mutters *"Bane's lot."*
- **Dunny Marsh** — young deputy, arm in a sling. *[slight, dark clothes]*
- **Wenna Moss** — herb-wife, sets bones. *[green coat]*
- **Mother Hollis** — four kids under one blanket, no token for them. *[braided hair, bangles]*
- **Hob Fenner** — cooper, split brow, angry about the casks. *[burly, auburn]*
- **Nan Cotter** — widow from the ford street. *[red shawl, feather]*
- **Pell Ashby** — lamplighter, saw most of the raid. *[dark blue pointed hood]*

## Contingencies

- **The fork rider gets away and the camp is on night alert.** Still winnable. Lean on the heist
  (the camp is watching the road, not the river side) or a parley. The casks are always there.
- **They corner Nella.** Run the escape ladder honestly down to the river plunge. If even that can't
  stick, the table wins — capture her, and re-plan her arc around the tally and the debt. Never
  cheat visibly. Captured-Nella sample, cold: *"Well. That'll cost me."*
- **They want to chase Nella past the river.** She's mounted and gone. Let them find the cached
  horse's tracks running toward the river and stop at the bank. *"She knows this water. You don't."*
- **They go straight at the feud with the ledger or the banner.** Give the next rung only:
  *someone* is paying Harrow Bane. Stop there. Silas recognises the banner back home and won't say
  more in the street.

#### S2_SKIP — They skip the pursuit

- **They skip the pursuit and stay to build.** Fine. The cart reaches a fence in Duskwater. The
  casks aren't gone, but recovering them becomes a costlier beat later (buy-back or a riskier lift).
  Sable eats the loss and the Stake ladder starts one deed behind. Varrick and his bracer are still
  at the waystation if they go later.

## Closing

Land it on the cell door, not on the casks.

> *"The cart's back, the ale's back, and nobody's looking at either. They're looking at a barred
> window, and a man behind it who walked in on his own and hasn't said a word. Mara's at the door
> with her arms folded. Somewhere behind you, Sable is rolling casks into the one room she has
> left, and it finally has something to pour. And someone in the crowd says 'week's end,' and someone else agrees."*

**Leave unresolved:** who the prisoner is and why he surrendered · Bane's face · whose banner it is
· Nella's tally, which she will want back · whether the Boon ever opens again.

## Engine notes

- **Carryover.** The back half of [[Session 30 Keep the Ale]]'s plan, reworked 2026-10-21. Ids
  keep the act-session prefix `S2_` so they match `_flow.md` and Session 30's chart. Played there
  and dropped here: `S2_SABLE_FREE`, `S2_LOOT`, `S2_TOWN`, `S2_NAMES`, `S2_WREN`, `S2_OFFER`,
  `S2_IGGY`, `S2_COMPANIONS`.
- **Choices** (`meta/player-agency.md`):
  - Party: who goes to the jail (`S2_STATEMENT`) · sign the deed tonight or not (`S2_BOON`) ·
    chase or stay (`S2_SKIP`) · the route at stages 2 and 4 (`S2_ROAD`, `S2_APPROACH`) · the rear
    guard: fight, scare off or bluff (`S2_REARGUARD`) · scout first (`S2_SCOUT`) · heist, assault,
    parley or trick (`S2_APPROACH_CHOICE`) · Nella's purse (`S2_TALLY`) · the banner in the bar
    (`S2_HAUL_HOME`)
  - Character: Dip, what to share from the private roll, and the 150 gp (`S2_DIP`) · Odibli, the
    word he writes (`S2_HEARTH`) · Halsby, his one question for the fox (`S2_SPEAR`)
  - Past choices paid off: the truth told to the town, "came out of the light" (`S2_STATEMENT`,
    `S2_HORSES`) · Odibli's verdict on Sable and his pitch to Silas (`S2_BOON`, `S2_HORSES`) ·
    Halsby's shade pitch (`S2_HORSES`) · Halsby dealing a crystal to every PC (`S2_CRYSTALS`) ·
    Halsby taking the fox's job without haggling (`S2_SPEAR`)
- **Spotlight.** The trend says lean party-centric this week; the chase and the camp are. Halsby,
  the overdue PC, gets `S2_SPEAR` (a promised delivery, not one of his `spotlight_hooks`, none
  seeded) and indirectly `S2_CRYSTALS`. Odibli gets his deed, `S2_HEARTH`. Dip gets their owed
  moment (`S2_DIP`) and [[Varrick's Parrying Bracer]] at the camp. Luci and Iggy carry no beat of
  their own this session; Iggy had the song at Session 30.
- **Deployment tracking:** none planned from `meta/literary-devices.md` or the design
  preferences. The false trail at the fork is a device candidate if `/recap` wants to log it.
- **For `/recap`:**
  - Levels: Odibli and Halsby to 5 (stamp `level_confirmed: 31` on all five PCs)
  - The hearth: saved or scorched · the coals held Tallis's charm · Odibli's casts, d6 results and spell 1s into `scheduler/campaign/_citadel-clock.md`
  - Dip's private roll and what they shared · the 150 gp: kept, or put toward Sable's debt · Ben's
    confirmation of the gold and Dip's crystal
  - The 10% Stake, if signed · the second deed (casks home), banked
  - [[The Shadowless Spear]] delivered — flip its loot file to delivered; Halsby's mourning rite now holds the fade off twice as long
  - Silas's favour debt paid if the horses come back · where Silas stands on the two pitches
  - Nella's tally in party hands, and the 250 gp purse: kept, spent, or returned (it equals her
    remaining debt); Harrow Bane named by the ledger; the aegis-banner taken
  - [[Varrick's Parrying Bracer]] taken — flip its loot file to delivered, add it to Dip's gear
  - Chase DCs used → `meta/difficulty.md` Skill Challenge table, including the route choices
    taken at stages 2 and 4
  - Who went to the jail with Mara, if anyone (`S2_STATEMENT`) · whether they found and cut off
    Nella's exit (`S2_SCOUT`) · whether the crew heard a broadcast (`S2_CRYSTALS`); if so, Nella's
    crew holding crystals becomes canon on [[Earshot Crystals]]
  - Rest Clock: reset if they rested at the waystation
  - The prisoner: canonize only what was shown
  - **New canon if played:** Nella's remaining debt to Bane is 250 gp, the sum in her purse ·
    [[Varrick's Parrying Bracer]] was Varrick Tenn's, a soldier's guard he wore as the camp's
    drover · Tallis sold written charms at the fair, and Mara bought one for her mother · the
    hearth's cause, Tallis's smother-charm (`S2_HEARTH`) · Mara has worn the star six years · Ashford's
    jail has two cells · Silas charges 11 gp a lamed horse · the waystation is an old drover's
    relay short of Duskwater, provisioned for about thirty · Sennet Orrin keeps Bane's duty ledger
    · the cart becomes the Lioness's delivery cart · a hanging in Ashford waits on Cael's reeve ·
    the camp crew's names (Ilsa Hask, Fennel Dray, Cinder, Varrick Tenn, Haddo Keel, Brask, Sennet
    Orrin, Hesper Mudd, Tam "Clatter" Cobb, Brick and Mortar), only for whoever comes up
- **Held for later:** Elowen and Odibli (the Unfinished Binding) · Jorn's foreshadow · the Marlow
  coppers · Asher's Dead Sun phrase for Luci · the battlefield-spirit and coin-forgery spitballs ·
  the pull Odibli feels (Miguel's homework).
- **Before the table:** Tyler's
  backstory (optional; the cell stays a silhouette without it) · confirm the 150 gp and Dip's
  crystal with Ben. Maps, tokens and cards are tracked in `_tasks.md`.
