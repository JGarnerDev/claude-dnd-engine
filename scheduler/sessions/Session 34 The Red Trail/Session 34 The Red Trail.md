---
# --- MANDATORY ---
name: "Session 34 The Red Trail"
campaign: homebrew
type: session
session_number: 34
exists: false
state: draft
tags:
  - session

mission: [[The Stolen Casks]]
planned_date: ""
pcs_present:
  - "Iggy"
  - "Luci"
  - "Odibli"
  - "Dip"
  - "Halsby"

# --- OPTIONAL ---
act: [[Act 1 - The Hearth at Ashford]]
locations:
  - [[The Waystation]]
  - [[Ashford]]
  - [[The Golden Lioness]]
key_npcs:
  - "[[Nella]] (historian — on the ridge now, Tithe hunting for her; loses, escapes, drops her tally)"
  - "[[Sable Wren]] (historian — the casks home, the deed)"
  - "[[Mara Tull]] (historian — sheriff; holds the prisoner at the close)"
  - "[[Silas Crubb]] (historian — his horses scattered and his cart wrecked)"
  - "Sennet Orrin (human — Bane's tally-man, keeps the duty ledger; not an entity)"
  - "Brannoch Vey (human — leads the relief riders up the east road; not an entity)"
  - "[[Sergei Rubelgerd]] (historian — Odibli's mastiff)"
  - "[[Bosco]] (historian — Iggy's raccoon)"
  - "the prisoner (a silhouette only — Tyler's cameo, beat 1; no name, no lines)"
encounters:
  - "The Waystation, mid-fight and stepped up (Jeff, 2026-11-10, option 4). Left from Session 33: Sennet Orrin (Spy, ~10/27 HP), Brask (Thug, ~15/32), Ilsa Hask (Scout, ~5/16), Clatter (Bandit, 11/11). Nella (custom, ~CR 3, 49 HP) drops to the ridge blind and shoots from half cover, and sends Tithe (Griffon, 59 HP) to hunt riderless. In the round after Iggy's first turn, relief riders come up the east road: Brannoch Vey (Veteran, 58 HP) and three Bandits (Dace Morrow, Pim Ostler, Callan Shire), spread out. 2,350 XP standing, ~5,875 adjusted (just over Deadly on paper, though four of them are hurt); RTC ~3.5 rounds counting Iggy's opening turn; RTD ~2 spread, ~1 if Tithe and Vey pile on one PC. Tactics: no station clusters; Tithe takes whoever is in the open and moving, never stays on a downed PC; Nella still never shoots a downed PC. Morale DC 12 WIS when Vey drops or the crew is down to two."
loose_threads:
  - "[[Session 33 The Red Trail]] played the hill and the opening of the camp fight; the rest of the fight, Nella's escape and tally, the intel, the haul home and the cell carry here"
  - "Silas's five horses scattered at the charge (recoverable, maybe lame or unshod); his cart is wrecked against the shed"
  - "Dip shouted at Iggy mid-charge that 'a flame went inside' him; whether that shared the nesting-doll vision is unconfirmed"
  - "Dip took Varrick's cart-whip; Varrick's Parrying Bracer is still on his body"
  - "The Citadel Clock is at 1/3 (Odibli's Magic Missile, sensed); the brief cold wasn't played at the table"
  - "Sable owes Odibli a talk about the self-feeding fire, and asked him to keep quiet until then"
  - "Sable's deed: 10% offered, Dip asked for more, a larger share open on their return; still unsigned"
  - "Still open from Session 29: what the order doesn't like at [[Tassad]], and the later job Halsby owes Sable"
difficulty_attrition: standard
difficulty_lethality: standard
depth: narrated
scope: inline
opening_scene: "About 11 a.m. on Day 2, mid-fight in the waystation yard. Iggy, missed from initiative last session, acts first. Four of the crew are down; Nella is in the air on Tithe."
closing_hook: "The casks ride home, and Ashford is buzzing about something else. While they were gone, a raider walked into town and surrendered. He sits in Mara Tull's cell, silent, and the town wants a rope."
relates_to:
  - "[[The Stolen Casks]] (resolves this session)"
  - "[[Act 1 - The Hearth at Ashford]] (act)"
  - "[[Redwater]] (campaign)"
  - "[[Session 33 The Red Trail]] (its unplayed fight and Scene 4 carry over to here)"
  - "[[The Shadowless Spear]]"
  - "[[Harrow Bane]] (named in the camp's ledger; still no face)"
importance: critical
active: true
description: "The rest of the waystation fight, carried from Session 33 and stepped up: Nella takes the ridge and sets her griffon hunting, and relief riders come up the east road. Iggy acts first, and his wings break the sky. Then Nella's escape and dropped tally, the camp's intel, the casks home on a borrowed-and-wrecked trail, and a silent prisoner in Mara's cell."
---

Campaign: [[Redwater]] | Act: [[Act 1 - The Hearth at Ashford]] | Mission: [[The Stolen Casks]]

> **Carried from [[Session 33 The Red Trail]] at its `/recap` (2026-11-10).** Session 33 played the
> hill and the opening of the fight (rounds 0–1 and the start of round 2) and stopped mid-round.
> The played beats are dropped from this copy; their record is in the Session 33 historian file.
> The `S2_` ids are kept so they still match `_flow.md`.
>
> **Stepped up (Jeff, 2026-11-10, option 4).** The floor that's left (~41 HP) would die to Iggy's
> first turn and the one after it. So Nella drops to the ridge blind and sends Tithe to hunt
> riderless (`S2_TITHE_HUNTS`), and four relief riders come up the east road the round after
> Iggy's first turn (`S2_RELIEF`). Sized by the v0.56.0 rules in `meta/difficulty.md` (area damage
> per body, round 0). Both new beats are drafts (`[-]`) until Jeff commits them.
>
> **Other changes since the plan was written:**
>
> - **Dead:** Varrick (Dip), Hesper (Halsby's Lightning Bolt), Haddo (Luci), Cinder (Dip). Their
>   blocks are cut. **The morale trigger moves** to Brannoch Vey (Jeff chose not to roll it at
>   Varrick's death).
> - **Silas's horses** are scattered nearby and his cart is wrecked against the shed, so the casks
>   need the camp's own wagon home (`S2_HAUL_HOME`).
> - **Ilsa and Cinder** came out of the shed, not the tree line. Cinder is dead.

## Combatants

All enemy stat blocks in one place. 2014 Monster Manual Bandit, Thug, Scout, Spy, Veteran and
Griffon, reskinned, plus Nella's custom block (from
`workshop/first-homebrew-act/notes/session-2-pursuit-statblock.md`, tuned here).

### At a glance

- **The Waystation** (Scene 3, mid-fight). HP as Session 33 left it; the runner's HP boxes start
  full, so type the damage in at the top (`=10` and so on).
  - **Tally-man** — Sennet Orrin (human, Spy), on Halsby by the wrecked cart · **~10 / 27**
  - **Half-orc Cask-hand** — Brask (half-orc, Thug), on Halsby · **~15 / 32**
  - **Archer Rider** — Ilsa Hask (human, Scout), by Iggy, badly hurt · **~5 / 16**
  - **Roof Guard** — Tam "Clatter" Cobb (human, Bandit), on the shed roof's corner · 11 / 11
  - **Sniper** — [[Nella]], on Tithe about 60 ft up; drops to the ridge blind on her turn · 49 / 49
  - **Griffon** — Tithe (Griffon), riderless once she's down, hunting · 59 / 59
  - **Relief Captain** — Brannoch Vey (human, Veteran), east road, arrives the round after Iggy's
    first turn · 58 / 58
  - **Relief Rider 1–3** — Dace Morrow, Pim Ostler and Callan Shire (humans, Bandits), with him,
    spread out · 11 / 11 each
- **Dead (Session 33):** Varrick Tenn (the drover), Hesper Mudd (the hedge priest), Haddo Keel
  (the big cask-hand), Cinder (the wolf).
- **Morale:** DC 12 WIS when Vey drops, or the crew (everyone but Nella and Tithe) is down to 2
  standing. Not at Varrick's death (Jeff, 2026-11-10). Tithe and Nella don't roll.

### Difficulty check (stepped up 2026-11-10, v0.56.0 rules)

Session 33's fight went faster than its plan: a readied Lightning Bolt through four of the crew
and two free turns put ~125 damage down before anyone acted. Jeff wants the rest of it harder.

- **The party now:** about 2 rounds into its day's budget, all level 5. Halsby is hasted and out of
  3rd-level slots (sorcery points left). Odibli still has **both Fireballs**. Luci has spent 1
  focus point. Iggy is untouched in resources, Radiant Soul included, and **acts first**. HP
  lost: Iggy 22, Odibli 18, Halsby 9, Dip ~7.
- **Party damage:** ~85 a round, plus a Fireball (~28 per body it reaches) and Iggy's +5 radiant
  once the wings are open.
- **What's standing, without the step-up:** ~41 HP on the floor, plus Nella 49 and Tithe 59. The
  floor dies to Iggy's opening turn and the one after it (RTC under 1), leaving only the sky.
- **With the step-up:** +91 HP of relief (Vey 58 survives two average hits, the anchor the floor
  lacked) arriving where the opener can't reach, and Tithe as a second sky threat. ~240 HP in
  all; **RTC ~3.5 rounds counting Iggy's opening turn**, inside the 3+ the rules ask for.
- **Area exposure:** the riders come in spread, about 20 ft apart, so a Fireball takes two at
  most. Don't bunch them on the road.
- **RTD:** Tithe ~13 a round, Nella ~12, Vey ~13, riders ~3 each. About 2 spread across the party;
  about 1 if Tithe and Vey both go for one PC. Keep Tithe on whoever is in the open and moving.
  Tithe leaves a downed PC for the next target; Nella still never shoots a downed PC.
- **Round budget:** 2 played, ~3–4 more. About 6 of standard's 18–24.

### Bandit — Clatter and the relief riders

- AC 12 · HP 11 · Speed 30 ft · CR 1/8
- **Scimitar** +3 to hit, 1d6+1 slashing (avg 4)
- **Light crossbow** +3 to hit, range 80/320, 1d8+1 piercing (avg 5)
- **Fennel Dray** (human, the fork's crossbow rider): dead at the fork, Session 32. No token.
- **Tam "Clatter" Cobb** (human): on the shed roof (half cover), crossbow on whoever is in the
  open. Named for the bolts he never stops fiddling with; you hear him before you see him. Calls
  out targets to the floor, so whoever he's watching gets no hiding in the open.
  - **Kit (player-facing):** *a light crossbow and a quiver of mismatched bolts, a curved blade
    stuck through his belt, and a leather jerkin that has seen better owners.*
  - **Label (party-facing):** Roof Guard
  - **Reputation (S33, unspent):** he keeps one eye on Halsby now. When Halsby raises the Spear,
    Clatter shouts *"Lightning man!"* and the crew flinch. Flavour only.
- **Dace Morrow, Pim Ostler and Callan Shire** (humans): Vey's riders, three of the thirty the
  shed is stocked for. Dace is the loud one; Pim is barely grown; Callan rides like he was born
  to it and fights like he wasn't. Mounted on arrival; they swing down to fight on foot once
  they reach the yard (half their movement).
  - **Kit (player-facing):** *riding leathers, a curved blade each, and a light crossbow slung
    from the saddle.*
  - **Label (party-facing):** Relief Rider 1, Relief Rider 2, Relief Rider 3

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
- **Now (after Session 33):** ~5 HP left, Cinder dead in two halves at her feet, Fennel dead at
  the fork. She came out of the shed shouting that the party killed her friend, and she's on Iggy
  because he's nearest. At morale, or at 0 HP if a PC wants her alive, she drops the sword. She
  is the one crew member who might talk about Nella.

### Thug — Brask, the half-orc cask-hand

- AC 11 · HP 32 · Speed 30 ft · CR 1/2
- **Pack Tactics:** advantage on an attack if an ally is within 5 ft of the target
- **Multiattack:** two mace attacks (a cask-mallet in the fiction), +4 to hit, 1d6+2 bludgeoning
  each (avg 5)
- **Heavy crossbow** +2 to hit, range 100/400, 1d10 piercing
- **Brask** (half-orc): long arms and a bad temper. ~15 HP left after Halsby's bolt. Haddo, his
  partner, lies dead by the cart. He's on Halsby, who burned him.
- **Kit (player-facing):** *a stained leather apron over a leather jerkin, an iron-banded
  cask-mallet, and a heavy crossbow propped against the cart wheel.*
- **Label (party-facing):** Half-orc Cask-hand
- **Reputation (S33, unspent):** the first time Dip steps toward him, Brask backs off a step
  before he stands. Flavour only.

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

### Nella — veteran sniper (~CR 3, custom)

- AC 15 (studded leather) · **HP 49** · Speed 35 ft · CR 3
- STR 12 · **DEX 18 (+4)** · CON 12 · INT 12 · **WIS 16 (+3)** · CHA 10
- Stealth +8, Survival +7, Perception +7, Nature +5
- **Multiattack:** two longbow attacks
- **Longbow ×2** +6 to hit, range 150/600, 1d8+4 piercing (avg 8)
- **Shortsword** +6, 1d6+4 piercing — cornered only; she never chooses melee
- **Marked Quarry (1/turn):** +1d6 against a creature she hit on her previous turn
- **Skirmisher's Step:** Dash, Disengage or Hide as a bonus action
- **Prepared Ground:** on ground she chose, advantage on initiative and her fallback routes are
  rigged (see `S2_ESCAPE`)
- **Tactics (Jeff, 2026-10-07): wound and pin, never kill.** She spreads her two shots across
  targets. Marked Quarry goes on whoever is climbing toward the ridge or flying at her, **never on
  a caster**. She never shoots a downed PC. This holds her at standard lethality; on paper her
  block is RTD ~1 against the back line.
- **Mounted (Jeff, 2026-10-28):** once she's on Tithe she fights from the air (see Running it).
  Mounting costs half her movement. She keeps her own crystal and **never broadcasts**.
- **Stepped up (Jeff, 2026-11-10):** on her next turn she brings Tithe down on the overwatch
  ridge, steps off into the brush blind (half cover) and sends the griffon back up: *"Tithe.
  Hunt."* From the blind she shoots twice a turn as before. She's on foot now, so her ways out
  are the plank bridge behind her, the river, or a whistle that brings Tithe back for her
  (`S2_ESCAPE`).
- **Kit (player-facing):** *dark studded leather under a long weathered cape, a tall longbow,
  and a short sword at her hip she doesn't touch.*
- **Label (party-facing):** Sniper

### Griffon — Tithe, Nella's mount

- AC 12 · HP 59 · Speed 30 ft, **fly 80 ft** · CR 2 · Perception +5, darkvision 60 ft
- **Keen Sight:** advantage on Perception checks that rely on sight
- **Multiattack:** beak +6, 1d8+4 piercing, and claws +6, 2d6+4 slashing (only when nobody rides
  it)
- **Tithe:** a big tawny griffon, an eagle's front end on a lion's back end. Kept hooded and
  staked behind the blind on a long tether, fed on mutton. **Whose it is stays open.** It isn't
  Nella's; she rides it like a borrowed horse, carefully. Nobody at the camp says where it came
  from, and nobody in the ledger names it.
- **Controlled mount:** while Nella rides it, it only Dashes, Disengages or Dodges (it Dodges
  every turn she isn't running). It never attacks with her on its back.
- **Hunting (stepped up, Jeff 2026-11-10):** once Nella sets it loose (`S2_TITHE_HUNTS`) it fights
  for her, riderless. It dives on whoever is in the open and moving, beak and claws, then climbs
  back into the grey. It leaves a downed PC for the next target, and goes for the horses only if
  no PC is in the open.
- **Sah's voice** (`S2_IGGY_BEAT`) hits it hardest: WIS save DC 13 (it has +3). Fail: it screams,
  drops, and ends its turn on the ground within 60 ft of Iggy, and doesn't attack that turn.
- **At half HP (30)** it breaks off and flies to Nella for the pickup. **If Nella is down or
  gone,** it climbs and flies east, home to whoever owns it.
- **Kit (player-facing):** *a leather hood with brass rings over its eyes, and a long rider's
  saddle with deep saddlebags strapped behind its wings.*
- **Label (party-facing):** Griffon

### Veteran — Brannoch Vey, the relief captain

- AC 17 (splint) · HP 58 · Speed 30 ft · CR 3 · Athletics +5, Perception +2
- **Multiattack:** two longsword attacks, plus a shortsword attack if he has it drawn
- **Longsword** +5 to hit, 1d8+3 slashing (avg 7), or 1d10+3 two-handed
- **Shortsword** +5 to hit, 1d6+3 piercing (avg 6)
- **Heavy crossbow** +3 to hit, range 100/400, 1d10+1 piercing (avg 6)
- **Brannoch Vey** (human): grey at the temples, a broken nose set crooked, splint mail he keeps
  oiled. Came up the east road to collect the casks for the band and found a fight. Thinks the
  waystation crew are amateurs and says so. Bane's man more than Nella's: he doesn't wait for her
  orders and she doesn't give him any.
  - Riding in, seeing the yard: *"Twelve casks and you couldn't hold a cart. Off the horses.
    Spread out, don't bunch."*
  - To Nella on the ridge, not looking up: *"You'll want to be gone before I'm done here."*
  - At half HP: *"Hold. Hold, I said."*
- **Kit (player-facing):** *splint mail, grey and oiled, a longsword and a short one at his belt,
  and a heavy crossbow on the saddle.*
- **Label (party-facing):** Relief Captain
- **He's the morale trigger now.** When he drops, everyone left on the floor rolls.

### Running it

- **Initiative:** Iggy wasn't in it last session (Jeff's slip). **He goes first,** then pick the
  order up where it stopped: round 2, after Nella. Add Vey and the riders when they arrive; roll
  one initiative for the four of them.
- **The floor that's left** fights where it stands: Sennet and Brask on Halsby, Ilsa on Iggy,
  Clatter on the roof calling targets. Nobody converges.
- **Nella's next turn:** down to the ridge blind, *"Tithe. Hunt."* (`S2_TITHE_HUNTS`). From then
  on she's a token on the ridge with half cover, and Tithe is the thing in the cloud.
- **The relief, the round after Iggy's first turn** (`S2_RELIEF`): Vey and three riders up the
  east road. **Spread, about 20 ft apart.** Never let them bunch: a Fireball takes two at most.
- **The cloud:** Tithe circles in it and drops out on its own turn. On the party's turns, attacks
  on it guess its square at disadvantage, and a readied action works as before. Iggy's wings
  light the cloud for good (`S2_IGGY_BEAT`).
- **Until Iggy flies:** that's the pressure, from the sky and now from the road. Don't soften it.
  The wings are still Jeff's timing; this fight gives them more to answer.
- **Round budget:** ~3–4 more.

## Orientation

About 11 a.m. on Day 2 (`6743-05-21`, the DM's estimate), mid-fight in the yard of
[[The Waystation]]. Everything below happened in [[Session 33 The Red Trail]].

- **Where everyone is (from Jeff's end-of-session screenshot):** the wrecked cart lies tilted
  against the long shed's corner. Sennet (Tally-man) and Brask (Half-orc Cask-hand) are at the
  cart's end, on Halsby. Ilsa (Archer Rider) is by Iggy near the corral's north side, with
  Cinder's halves at her feet. Clatter (Roof Guard) is at the shed roof's west corner. Nella and
  Tithe are about 60 ft up over the yard's west side. Sergei and Bosco are by the shed's west
  wall. The corral horses are still penned; Silas's five are loose east of the yard.
- **Dead:** the drover by the cart (headless), the hedge priest by the corral's east corner, the
  big cask-hand by the cart, the wolf by the corral.
- **Levels:** all five PCs are level 5 (confirmed Session 33).
- **Resources:** Halsby is **hasted** (concentrating, ~8 rounds left) and out of 3rd-level slots;
  sorcery points unspent. Odibli has spent one 1st-level slot and still has **both Fireballs**.
  Luci has spent 1 focus point. Dip is **raging**. Iggy hasn't acted: Radiant Soul unspent.
- **HP lost:** Iggy 22, Odibli 18, Halsby 9, Dip ~7, Luci 0.
- **Gear:** Dip carries Varrick's cart-whip. Varrick's Parrying Bracer is still on his body.
- **The Citadel Clock is at 1 / 3:** Odibli's Magic Missile was sensed (rolled at the recap). The
  brief cold wasn't played at the table. **Give it to Miguel at the top,** before Iggy acts: *"A
  cold goes through you, quick, like stepping into shade. Then it's gone."*
- **Open from Session 33:** mid-charge, Dip shouted at Iggy that "a flame went inside" him the
  night of the fire. Whether that told Iggy the nesting-doll vision is unconfirmed, so treat the
  vision as still Dip's own. If Ben or Jeff bring it up, it's theirs to play.
- **Afflictions:** Iggy's shadow and Dip's whispers are dormant in Aethryn. Luci's Sacred Flame
  and Odibli's familiar are still gone.

### Rest Clock across the session

- **Start:** about 7 hours after the long rest (overnight Day 1 → Day 2), 11 a.m. Day 2. Two rounds
  of combat spent this day.
- **The fight:** ~3–4 more rounds.
- **Home (Scene 4):** a loaded wagon and five horses to round up make the ride back slow, so they
  reach Ashford in the evening of Day 2. A long rest at the Lioness that night clears the 24-hour
  gate.

## Scenes

> **Pick up here.** Mid-fight. The cold for Odibli, then **Iggy's turn first**, then the order
> from round 2 after Nella. Nella's next turn takes her to the ridge (`S2_TITHE_HUNTS`); the relief
> comes the round after Iggy's first turn (`S2_RELIEF`). Lines and read-alouds below are guidance,
> not script.

### Scene 3 — The Waystation

- **Summary:** the rest of the fight at Nella's camp, stepped up. Nella takes the ridge and sets
  her griffon hunting, and four relief riders come up the east road. Iggy's wings light the
  cloud and Sah speaks. Nella loses, escapes on a fallback she rigged days ago, and drops her
  debt tally. The camp gives up three things: the band's size, Harrow Bane's name and the banner.
- **Where:** [[The Waystation]], an old drover's relay short of Duskwater: long shed, corral, well,
  the cart, a fire, and set back, the overwatch ridge, a fast river and a rigged plank bridge.
  Grey mid-morning under a low cloud.
- **Cast:** [[Nella]] on Tithe, then the ridge · Tithe the griffon · what's left of the crew · the
  relief riders · Sergei and Bosco · Pablo on the hill · the Marlow banner on the shed's pole
- **Enemies:** Tally-man (Sennet Orrin) · Half-orc Cask-hand (Brask) · Archer Rider (Ilsa Hask) ·
  Roof Guard (Clatter) · Sniper ([[Nella]]) · Griffon (Tithe) · Relief Captain (Brannoch Vey) ·
  Relief Rider 1 (Dace Morrow) · Relief Rider 2 (Pim Ostler) · Relief Rider 3 (Callan Shire)
- **DCs:** Perception 13 — spot the crew's crystal cords · Animal Handling 13 — start a stampede ·
  Animal Handling 12 — round up one of Silas's horses · WIS 13 (Tithe, +3) — hold when Sah speaks ·
  Athletics 13 — swim the river · WIS 12 save — morale · Investigation 12 / 16 — read the tally ·
  Arcana 15 — Dip reads Iggy (`S2_IGGY_BEAT`)
- **Tactics:** no station clusters any more. What's left of the floor fights where it stands.
  Nella shoots from the ridge blind with half cover, two arrows a turn, never Marked Quarry on a
  caster, never a downed PC. Tithe hunts whoever is in the open and moving, then climbs back into
  the cloud. Vey's riders come in spread and Vey goes for whoever is hurting the crew most.
  Morale breaks when Vey drops or the crew is down to 2. The sky breaks when Iggy flies.
- **Time:** ~60 min
- **Trigger:** the session opens here, mid-fight.
- **The sky:** low cloud over the river valley, its base about 100 ft up, mist lifting off the
  water. Under it the yard is flat grey daylight, and everyone on the ground can be seen. Inside
  the cloud is heavily obscured. It counts as bright light, so the Spear's 15-ft reach is off
  unless Halsby makes his own dark.
- **The ground:** an old drover's relay short of Duskwater. **Long shed** (bunks, ledger, stores) ·
  **corral** of nervous horses (noise hazard for sneaks, stampede lever for chaos) · **well** ·
  **the cart**, turned broadside by the shed with the casks still loaded · **fire** · and set back,
  the **overwatch ridge** with a brush blind, a **fast cold river** behind it, a **rigged plank
  bridge** over the river, and the empty stake where Tithe was tethered, between the blind and the
  river. Map: `maps/waystation.txt` (render with `uv run scripts/battlemap.py --session 33`). Key
  refs: cart R10:S12, Nella's blind AB8:AC10 (55 ft from the cart, up a difficult slope at X:Z),
  bridge AF9:AH9, 15 ft behind the blind.
- **Jeff's Roll20 map (2026-10-12)** differs from the reference render. Rulings:
  - **The cart** is the covered wagon nearest the slope, turned broadside to the shed as a
    barricade. **Now wrecked**, tilted against the shed's corner (Session 33's charge).
  - **The boulder band** is the slope, difficult terrain, **except the rubble gap** where the
    bridge path cuts through. The gap is normal ground, the fast way up, and Nella's Marked Quarry
    goes on whoever takes it.
  - **The river:** swimming it is DC 13 Athletics; a failure costs the round and carries you 10 ft
    downstream. A crossing still takes ~3 rounds, so the bridge drop holds her lead.
  - **The bridge** is pinned to drop. One action pulls the pins and the deck goes into the water.
    It's her way out if she ends up on foot.
  - **Tithe's stake** is just behind the blind, toward the river: empty now, with sheep bones and
    flattened grass around it.
  - **The east road** comes in past the corral toward Duskwater. The relief rides in along it
    (`S2_RELIEF`).

#### S2_TITHE_HUNTS — Nella takes the ridge and sets the griffon loose

- **[-] Draft (stepped up, Jeff 2026-11-10, option 4).** Nella's next turn.
- **What happens:** Tithe drops out of the cloud onto the overwatch ridge. Nella swings off into the
  brush blind and slaps its neck once: *"Tithe. Hunt."* It goes straight back up.
- **From now on:** Nella shoots from the blind (half cover), two arrows a turn. Tithe is the thing
  in the cloud: it drops on whoever is in the open and moving, beak and claws, and climbs back.
- **What the party can use:** Nella is on foot now. Someone who reaches the ridge can corner her;
  someone who reaches the bridge first can cut her best way out (`S2_ESCAPE`). Tithe at half HP
  breaks off to fetch her.
- **Tokens:** Sniper to the ridge blind (AB8:AC10, or the brush on Jeff's map), token layer.
  Griffon back to the GM layer on the grey margin; up only on its own turn.

> *"The griffon drops onto the ridge so hard the brush shakes. The archer slides off its back into
> the blind, slaps its neck once, and says something short. It goes up again, straight up, and the
> cloud takes it."*

#### S2_RELIEF — Riders on the east road

- **[-] Draft (stepped up, Jeff 2026-11-10, option 4).** The round after Iggy's first turn.
- **What happens:** hoofbeats on the east road, then four riders at a canter: Brannoch Vey in grey
  splint, three behind him. They came to collect the casks and found a fight. Vey takes the yard in
  one look and doesn't like what he sees.
- **They come in spread,** about 20 ft apart, swing down at the corral, and fight on foot. Vey goes
  for whoever is hurting the crew most; the riders take crossbows to anyone in the open.
- **Vey, riding in:** *"Twelve casks and you couldn't hold a cart. Off the horses. Spread out, don't
  bunch."*
- **Vey, to the ridge, not looking up:** *"You'll want to be gone before I'm done here."* Nella
  doesn't answer.
- **What it tells the party, if they listen:** these four are not Nella's crew. They answer to
  someone else and come from a camp that can spare riders. (It feeds `S2_CAMP_INTEL`'s thirty
  bedrolls.)
- **Introduce:** Relief Captain (Brannoch Vey)
  - **Look:** grey at the temples, a broken nose set crooked, splint mail kept oiled, a longsword
    and a short one at his belt.
  - **Sound:** flat and tired, like an officer inspecting a bad post.
  - **Impression:** a professional. The waystation crew were amateurs, and he knows it.
- **Tokens:** Relief Captain and Relief Rider 1–3, mounted, at the east edge on the road; spread
  them 20 ft apart. One initiative for the four.

> *"Hoofbeats on the east road. Four riders come round the corral at a canter, and the one in front
> wears grey plate that has seen a lot of oil. He reins in, looks at the cart, at the bodies, at you,
> and swings down without hurrying."*

#### S2_CRYSTALS — The crew wear crystals too

- **What's true (DM only):** every raider at the Lioness wore a crystal cut from the same stone,
  and so do Nella and most of this crew (cords at the neck, crudely wrapped in metal). Listening
  only needs the crystal on your body (`meta/loot-options/Party/misc/Earshot Crystals.md`), so
  **anything a PC says to "all" holders within 300 ft is heard by every crew member wearing one.**
  Speaking to one PC they can see is safe.
- **What changed:** Halsby's broadcast in Session 32 taught the crew it works both ways. Varrick
  banned talking into the stones before he died, so the crew shouts its orders out loud. They
  still wear them, so they still hear the party's broadcasts, Halsby's "going dark" included.
  Vey's riders don't wear them.
- **Finding out:** the party knows the crystals leak, but may not know the crew wears them. A
  Perception check (DC 13) sees the same cord at Varrick's and Haddo's necks (both dead in the
  yard), or someone remembers that the Lioness bodies wore them.
- **The lever, once they know:**
  - A false order over the crystals, in Nella's voice or any voice "from above" (Deception against
    the listener's Insight; Sennet +4): one crew member leaves where he stands.
  - Panic ("she's leaving you"): disadvantage on the morale save at `S2_MORALE`.
- **The risk:** a broadcast plan or a called target reaches the crew too. Once, the target moves
  first.
- **Brask's slip:** once, when the fight turns against him, he forgets the rule, and every PC
  hears it: *"Nella? Nella, where do you want us?"* No answer.
- **Nella's own crystal:** she never broadcasts.
- **Tokens:** none.

#### S2_FIGHT — The rest of it: the floor, the ridge, the cloud and the road, 3–4 rounds

- **Tokens:** as Session 33 left them (Orientation). Sniper and Griffon together over the yard's
  west side until Nella's turn (`S2_TITHE_HUNTS`); after that the Sniper sits on the ridge and the
  Griffon on the GM layer except on its own turn. Relief tokens off-map east until `S2_RELIEF`.
- **Set HP in the runner first:** Tally-man `=10`, Half-orc Cask-hand `=15`, Archer Rider `=5`.
- **The floor:** Sennet and Brask on Halsby, Ilsa on Iggy, Clatter on the roof calling targets.
  Then Vey and the riders from the east. Nobody converges on one PC.
- **The sky:** Tithe is in the cloud on every turn but its own; it drops on whoever is in the open
  and moving, then climbs back. On the party's turns, attacks on it guess its square at
  disadvantage. A **readied action** for "when it comes out of the cloud" hits it normally. Show
  the pattern, don't say it: *"It comes out of the same thin patch twice, over the corral."*
- **The ridge:** Nella in the blind, half cover, two arrows a turn, never at a downed PC. Reaching
  her means the slope (difficult) or the rubble gap, and her Marked Quarry goes on whoever takes
  the gap.
- **Mid-fight lines:**
  - Clatter, whenever Tithe drops out: *"There it is! THERE it is!"* · when Halsby raises the
    Spear (reputation, S33): *"Lightning man!"*
  - Brask, when the relief rides in: *"About time somebody showed up."*
  - Sennet, the first time he's hit again: *"I count this lot. I don't bleed for it."*
  - Ilsa, to Iggy, sword up: *"Fennel tied that collar. Fennel."*
  - Vey, at half HP: *"Hold. Hold, I said."*
  - Nella, calm, to whoever is climbing toward the ridge: *"Keep climbing. I'll be gone before
    you're halfway."* · counting her arrows: *"Nine. Eight."*
- **Halsby's Spear:** under the cloud it's still bright daylight, so the 15-ft reach is off unless
  he makes his own dark. The +1 rides on his spell attacks and save DC either way.
- **Sabathiel and the Spear (played Session 33):** don't repeat it. Kept for reference: the first time Luci
  stands within 5 ft of Halsby while he casts through the Spear, or touches it. Once only. Don't
  explain it, and don't let Halsby notice. It seeds Luci's light against Halsby's shadow ways, so
  check Paul's and Kellan's appetite for PC friction before using it.
- **Private (Luci):** Sabathiel and the Spear
  - **The message:** Halsby casts through his spear, and the warmth on your face goes cold. For
    one breath it's gone completely. Then it comes back, and the voice says nothing about it.
- **The horses:** a stampede through the corral is a lever for chaos (DC 13 Animal Handling to
  start it on purpose; it starts on its own if fire reaches the corral, or the first time Tithe
  dives on it). It would run straight at the relief riders coming off the east road.

#### S2_IGGY_BEAT — "Up, Wallaed": Iggy flies, and Sah shows himself

- **Jeff's design (2026-10-28):** the camp fight feels desperate while Nella owns the sky. Iggy's
  wings (Radiant Soul, once per long rest: 1 minute, fly 30 ft, +5 radiant once a turn) are what
  break it, and the moment he opens them, the party sees Sah for the first time. **Jeff picks the
  moment;** the pressure is on from Nella's first arrow, so whenever it lands, it lands as the
  turn.
- **The cues build all session** (Prince of Nothing style: doubled voices, light in the words, a
  mark on the world). Show; never explain. Nobody says the name Sah but Iggy.
  1. **His first spell of the session** (wherever it falls, the fork included): the words come out
     in two voices, his and an older one half a beat behind, in a language nobody at the table
     knows. Only whoever stands nearest him hears the second voice. Send it to that player
     (`Private (nearest PC)`, below).
  2. **His first Smite:** the words glow as they leave his mouth, and the strike leaves a hard
     white line hanging in the air for a breath, straight as a ruler stroke. The hedge priest's
     cord of charms lies by her body; if anyone is near it, one of the charms cracks.
  3. **Arcane senses:** Detect Magic, an Arcana look at Iggy, or Dip's sage-sense shows him
     **marked**, like ink pressed hard into paper, darker than anything else in the camp. No more
     than that.
  4. **The wings.** Below.
- **Private (nearest PC):** cue 1, Iggy's first spell of the session, sent to whoever stands
  nearest him
  - **The message:** When Iggy speaks the spell, you hear a second voice under his, older, half a
    beat behind, in a language you don't know. Nobody else seems to hear it.
- **Private (Dip):** if Dip uses their sage-sense on Iggy, or rolls Arcana on him, at any point
  this session
  - **Ask:** an Arcana check.
  - **15 or higher:** Iggy looks the way he always does. But he's pressed into the world harder
    than anyone around him, like a word someone wrote over and over until the pen went through
    the page. The pressing is fresh. Whatever is doing it is doing it now.
  - **Under 15:** the air right around Iggy feels heavier than the air anywhere else in the
    camp. You can't tell why.
- **Private (whoever casts Detect Magic on Iggy):** cue 3, for anyone but Dip
  - **The message:** Iggy shows no school of magic you know. But he's pressed into the world
    harder than anything around him, like ink pressed hard into paper. Nothing else in the camp
    looks like that.
- **When the wings open:**
  - **The voice.** Every earshot crystal within 300 ft speaks at once: the party's five, and every
    one on the crew and on Nella. An old voice, level and unhurried, the way a drill sergeant says
    a thing the hundredth time: ***"Up, Wallaed."*** The crew hear a stranger in their heads, and
    their **next morale save is at disadvantage**.
  - **The light.** For the rest of the fight Iggy's words come out lit, light spilling from his
    mouth and eyes when he casts, and the wings light the cloud from underneath. **Tithe can't
    hide in it any more**: it shows as a dark shape on the lit grey, so anyone who can reach it
    hits it without guessing.
  - **Tithe shies.** The griffon has never heard a god. If Nella is still in the saddle when the
    wings open, she makes the WIS save (+3) DC 13 to hold it; once it's hunting riderless, Tithe
    makes it (+3). **Fail:** it drops screaming and ends its turn within 60 ft of Iggy, in range
    of everyone, and doesn't attack (or Nella gets no shots) that turn. **Pass:** it holds, lit.
  - **The relief hears it too?** No: Vey's riders don't wear crystals. They see the wings.
  - Either way, **Nella's next turn starts the escape ladder** (`S2_ESCAPE`). She's done the sums:
    an angel in the air was not in them.

> *"The voice comes out of every crystal at once, old and level, like a drill sergeant who has
> said it a hundred times: 'Up, Wallaed.' Iggy's wings open, and the cloud over the river lights up
> from underneath, white as a lamp. Inside it, plain as a shadow on a sheet, the griffon jinks
> sideways."*

- **Choice (Iggy):** when Tithe picks Nella up and breaks east through the cloud, **chase her or
  turn back**.
  - **Chase:** he's too slow to catch Tithe (30 ft against 80), but he gets one pass alongside.
    He can strike once, or snatch at the saddlebags and come away with the tally and the purse
    (`S2_TALLY` falls to him, in his hands). He's alone in the cloud for two rounds, with only his own light, and the yard
    fights without him.
  - **Turn back:** the wings come down over the yard, between the crew and his friends, and the
    +5 radiant goes where it's needed. Nella gets clean away, and the tally falls where it falls.
  - Don't frame it as right or wrong. His file says he never runs, and he never crossed back over
    Caelion's bridge. Either answer says something.
- **What stays hidden:** what Sah is, why the crystals carried him, and anything about the
  Lioness hearth or the song in the viol. If someone asks Iggy who that was, it's his answer, not
  the DM's.
- **Iggy hasn't cast this fight yet,** so cue 1 is still live on his first spell (he acts first).

#### S2_MORALE — Vey drops, or the crew is down to two, and the rest break

- **Not at Varrick's death** (Jeff, 2026-11-10). Vey is the anchor now.
- DC 12 WIS for every surviving crew member and rider (at disadvantage if Sah's voice has just
  spoken, for those wearing crystals). Failures scatter into the scrub and down the east road,
  dropping what they hold. Sennet runs with the ledger if nobody is near the shed.
- Morale-break line, Brask, the first to fail the save, looking up at the ridge: *"She's leaving
  us. She's LEAVING us."* Then they run.
- Pim Ostler, the youngest rider, when he breaks: *"I'm not — I didn't sign for this."*
- Ilsa, if she's still up: she drops her sword before she runs. *"Fennel's at the fork. Somebody
  bury him."*
- **Tokens:** each crew member who fails goes off the nearest map edge. Anyone who surrenders
  stays where they stand.
- **This also triggers `S2_ESCAPE`.**

#### S2_ESCAPE — Nella loses, and gets away on a fallback she rigged

- **She loses.** The party takes the casks and breaks her crew. Her escape is flight from a
  defeat. She steals nothing this time.
- **She's on foot on the ridge now** (`S2_TITHE_HUNTS`), so her way out needs Tithe, the bridge
  or the river.
- **The ladder, in order, run honest:**
  1. **Cover the rout:** up to 2 rounds of covering fire from the blind for whoever is running.
  2. **The taunt:** one deliberate miss into a post at head height, then the dry voice from the
     ridge: ***"Keep the ale."***
  3. **Withdrawal:** a two-note whistle. Tithe drops to the ridge (its whole turn), she mounts
     (half her movement), and on its next turn it climbs east through the cloud at 80 ft a round.
     **That one turn on the ridge is the party's window:** anyone on the ridge or in reach can hit
     a griffon that isn't moving, or stand on the stake ground and make it land elsewhere. Once
     it climbs, nothing the party has catches it, Iggy's wings included. **Tokens:** Sniper and
     Griffon off the grey margin, east.
  4. **The tally falls:** as Tithe banks over the river, the saddlebag flap comes loose. See
     `S2_TALLY`. If Iggy chased her (`S2_IGGY_BEAT`), it may be in his hands instead.
  5. **Last valve:** if truly cornered, the river plunge, letting the current take her
     downstream. She knows the water. If even that can't honestly stick, **the table wins** and
     her arc gets re-planned. Never visibly cheat.
- **On foot, her second way out is the bridge.** She crosses the plank bridge and pulls the pins
  behind her, and the deck drops into the water. The party swims it (DC 13 Athletics, ~3 rounds)
  or detours.
  - **Bridge dropped early, or someone holding it:** she runs for the river (step 5).
  - **Bridge held and the river cut off:** they cornered her fairly. The table wins (see
    Contingencies).
- **If Tithe never comes for her** (dead, driven off, or held off the ridge): she's on foot for
  good. The bridge, then the river.
- **If the party hurts her or Tithe** (this party can put ~85 into one target in a round; run
  these honestly too):
  - **If Nella drops to half (24 HP) or Tithe to half (30 HP):** she skips the covering fire and
    the taunt and goes straight to withdrawal (step 3). She's done the sums.
  - **If Tithe drops to 0 while hunting:** it falls where it was hit. The tally is in its
    saddlebags; whoever gets to the body first finds it. Nella is on foot for good.
  - **If Tithe drops to 0 with her on it:** it falls from wherever it was hit. Over the river, she
    lets go and drops into the water, and that's the river plunge (step 5) on the spot. Over land,
    she takes 1d6 per 10 ft fallen, lands prone beside it, and is on foot: the bridge, then the
    river. The tally is in the saddlebags on the dead griffon.
  - **If she's knocked out of the saddle** (forced movement, or knocked prone while mounted,
    DEX DC 10 to stay on): Tithe climbs east without her, and she's on foot as above. The flap
    comes loose as it climbs, so the tally still falls over the river (step 4).
  - **If Nella drops to 0:** the table wins. Knocked out or killed is the party's call, not hers.
    She comes down with Tithe if it's low, or slides off and falls if it's high; Tithe climbs east
    riderless, and the tally falls as in step 4. Re-plan her arc around the tally and the debt
    (see Contingencies). Waking up tied: *"Well. That'll cost me."*
  - **Never** add HP, a reaction or a rescue she didn't have when the fight started.
- **Make the preparation visible afterwards.** Whoever reaches the ridge sees the empty stake and
  tether, the sheep bones, the bridge pins drilled days ago:
  *"The pin holes are worn smooth, drilled days ago. Around the stake the grass is flattened in a
  wide ring, and the bones in it run from old to fresh."*

#### S2_TALLY — She drops her debt tally

- **Choice (party):** the 250 gp purse: keep it (about one room in the new wing), spend it, or give it back. It is exactly her remaining debt, and the choice comes due later (`S4_DEBT`, `PAY_NELLA`).
- On the near bank of the river, where Tithe banked (or at the bridgehead, if she ran on foot):
  **a notched antler stick and a purse of counted, sorted coin.** If Iggy snatched the saddlebag, they're in his hands.
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
- **Sennet or Ilsa, if a prisoner:** *"That's not wages. Nobody saves like that for wages."* Cue:
  the purse is opened in front of them.

#### S2_CAMP_INTEL — What the camp gives up: the band's size, Bane's name, the banner

Three discoverables, from Jeff's pick. **Nothing else** — no Marlow coppers, no Jorn.

- **Band scale:** the shed is provisioned for far more than one crew. Thirty bedrolls, rations for
  a month, a rack of matched boots.
- **Bane confirmed:** a duty ledger in a clerk's tidy hand (Sennet's). Rotations, payments, and at
  the foot of each page the same initials and one name in full: **Harrow Bane**. No face, no
  description. If Sennet is taken alive and asked, he says the name and goes white. If he ran with
  the ledger, it is found dropped in the scrub on the road east, or he's caught with it.
- **The Marlow aegis-banner** on the shed's pole: old, fine, heraldic, far too good for a bandit
  relay. The party can take it. **It hangs in the Lioness later** and is the prop that unspools the
  feud. Nobody in the camp can say whose it is. Silas can, back home, and goes quiet when he does.
  - Vey, if he's a prisoner, as they take it down in front of him: *"That's not a bandit flag.
    Bandits don't have flags. That's someone's grandfather's flag."*
- **The waystation Common: [[Varrick's Parrying Bracer]], for Dip.** It is on Varrick's left
  forearm, still laced on his headless body by the cart (Dip killed him in Session 33). Once per
  short rest, reaction: +2 AC against one melee hit Dip can see.
  - **First touch:** the lacing has been redone so many times the holes have worn into slots.

The camp crew are named in Combatants, but none of them are entities. If one survives and matters,
`/recap` creates them.

### Scene 4 — The Man in the Cell

- **Summary:** The casks come home on their own cart. The horses go back to Silas, Silas sees the
  banner, and Sable sees the cart. But the town is looking at Mara's cell: a raider walked in and
  surrendered while they were gone. End on the cell door.
- **Where:** the road back, then [[Ashford]] in the evening of Day 2.
- **Cast:** [[Silas Crubb]] · [[Sable Wren]] · [[Mara Tull]] · the prisoner (a silhouette: no name,
  no lines)
- **Enemies:** none
- **DCs:** none
- **Time:** ~10 min
- **Trigger:** the party heads home with the cart.

#### S2_HAUL_HOME — The casks come home on their own cart

- **Choice (party):** bring the banner home or leave it. Hung in the Lioness, it is the prop that unspools the feud, and Silas sees it.
- **Silas's cart is wrecked** against the shed (Session 33). The casks go home in the camp's own
  wagon, the covered one by the shed, and that wagon becomes the Lioness's delivery cart (the old
  ruling, Jeff 2026-10-07, moved to the wagon that survived).
- **Silas's horses scattered** at the charge but are nearby. Rounding them up takes time
  (Animal Handling 12 each, or Odibli's last Speak with Animals for all five). Roll a d6 for each
  horse: on a 1 it comes back lame or has thrown a shoe.
- **The horses go back to Silas**, and he checks every hoof.
  - Silas, checking each hoof: *"All four shoes on every one. We're square. Next time you need
    horses, you come to me first."*
  - Silas, if a horse came back lame: *"That one's lame. Eleven gold, and we'll talk about the
    rest another day."*
  - Silas, about the cart: *"And my cart is where, exactly?"* A beat. *"That's a number too."* It's
    worth about 35 gp; he'll take the camp's wagon in trade if they offer, and think less of them
    if they don't.
- **Silas sees the banner** (first look, before he goes quiet; he never says whose it is):
  *"Where did you get that banner?"* A beat. *"If you hang it, hang it high. Some people who
  drink here would know whose it is, and you don't want them knowing you have it."*
- **Long rest:** if they rest at the waystation first, the clock resets there. Note it for `/recap`.
- **Sable, at the door, sees the cart.** She doesn't run out. She puts down what she's holding and
  stands very still. *"That's twice now you've saved this place."* (the second deed — banked, and the next Stake tick
  pays when base-building resumes)
- **Dip's push for more than 10%** (Session 31) comes back here. Once the casks are inside, she
  raises it before anyone else does: *"You said ten was thin. Bring the deed tomorrow and we'll
  argue it."* Don't set a number tonight.
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
  Mara can hold a silent man for days, and Session 34 can open somewhere else and come back to the
  cell later. Don't invent a name, a face, or a reason here to fill the gap.
- **Mara, at the door, before anyone asks:** *"He walked in. Put his blade down on my step. Hasn't
  said a word since. Half the town wants him hanged by week's end."* A beat. *"I haven't decided
  anything."*
- **If they bring prisoners home** (Sennet, Ilsa, Vey, anyone from the camp), when she sees them
  roped on the cart: *"Two more? I've one cell and one man in it already. Put them in the stable
  and get Dunny."*
- **End on the cell door.** Don't let them in tonight.

## NPC Quick-Reference

### [[Sable Wren]]

- **Motivation:** open Ashford's first tavern on time, pay Silas the ~650 gp she still owes, and
  keep her permit. She can't do it without the stolen stock, and can't defend the place alone.
- **Knows:** what the stolen stock is worth, and that without it she loses her permit · that the raiders are
  not local · that something under the town answers her, and she calls it Asher (she won't say so
  tonight) · nothing about Harrow Bane beyond the name · why the ale is called The Mistake, and she
  isn't telling.
- **Voice:** practical and dry; acts first, thanks later. Blunt to the point of swearing when
  pushed, warm under it. Turns straight to the next job. Treats a lord and a drifter the same, and
  never explains herself, least of all The Mistake.
- **Tell:** one glance at the hearth when it comes up, then back to work.
- **Now:** exasperated with Odibli since his "bad business owner" verdict at Session 30. The
  eye-roll was the table's favourite thing; keep it dry, never cruel.

### [[Mara Tull]]

- **Motivation:** hold the town together with too few hands, and decide what the party is.
- **Knows:** every raid Ashford has taken and what it cost · the matched boots · that Lord Cael
  answers letters and sends nothing · that the far side of town was hit by someone different ·
  nothing yet about why her prisoner surrendered.
- **Voice:** quiet, weathered, economical. Gives an order once. Grief steeled into grit, never
  spoken.
- **Kit (player-facing):** *a sheriff's star on a worn coat, a long knife on her belt, and slung
  across her back, muzzle down, a short heavy thing of dark brass and iron with a flared mouth
  like a bell bolted to a walnut stock.*
- **Label (party-facing):** Mara (the party knows her)
- **The Fourth Letter** (lore in her entity file): a Cael heirloom sent by Lord Cael in place of
  the soldiers Ashford asked for. If anyone asks, a townsperson answers, not Mara: *"His lordship
  wrote back three times. Fourth time he sent that."* Six charges left, and nobody can make more.

### [[Silas Crubb]]

- **Motivation:** keep Ashford, and himself, carefully neutral. Get the ale back without picking a
  side.
- **Knows:** stock, debts and prices · who owes whom · whose banner that is (and he'd rather not).
- **Voice:** affable, drawling, self-deprecating. Tangents that always land on a number. Slightly
  slippery.

### [[Nella]]

- **Motivation:** get to the end of the tally. Today that means keeping the casks if it's cheap,
  and keeping herself if it isn't.
- **Knows:** Bane's operation from the inside, and would trade it for the right number. Not today.
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

- **Pablo gets loose.** He walks down the hill into the corral, to the oats, and stays there.
- **They corner Nella.** Run the escape ladder honestly down to the river plunge. If even that can't
  stick, the table wins — capture her, and re-plan her arc around the tally and the debt. Never
  cheat visibly. Captured-Nella sample, cold: *"Well. That'll cost me."*
- **They rush the ridge before Tithe comes back.** Good: that's the window. She fights from the
  blind, then runs for the bridge. Run the ladder honestly; cornered fairly, the table wins.
- **The relief is too much.** If two PCs are down at once, Vey pulls his riders back to the corral
  to collect the casks rather than finish anyone. He came for ale, not a war.
- **They want to chase Nella into the cloud.** She's on a griffon. Nothing they have keeps up.
  Let the light of Iggy's wings show her shape for a moment longer, then nothing. *"She's going
  east faster than any horse could. You're not catching that."*
- **Iggy goes down before he flies.** Nella won't shoot him again, and the wings can still open
  when he's back up. If the session runs out before they do, hold the voice for another night.
- **They go straight at the feud with the ledger or the banner.** Give the next rung only:
  *someone* is paying Harrow Bane. Stop there. Silas recognises the banner back home and won't say
  more in the street.

## Closing

Land it on the cell door, not on the casks.

> *"Mara's at the door with her arms folded, and she doesn't move aside. Behind you, Sable is
> rolling the casks in one at a time. Through the bars, the man on the bench still hasn't moved."*

**Leave unresolved:** who the prisoner is and why he surrendered · Bane's face · whose banner it is
· Nella's tally, which she will want back · whether the Boon ever opens again.

## Engine notes

- **Carryover.** The pursuit half of the plan first written for [[Session 30 Keep the Ale]], carried
  four times. Ids keep the act-session prefix `S2_` so they match `_flow.md`. Played at Session 30:
  `S2_SABLE_FREE`, `S2_LOOT`, `S2_TOWN`, `S2_NAMES`, `S2_WREN`, `S2_OFFER`, `S2_IGGY`,
  `S2_COMPANIONS`. Played at Session 31: `S2_DIP`, `S2_BOON`, `S2_HEARTH`, `S2_SHORT_REST`,
  `S2_HORSES`, `S2_SPEAR`. Played at Session 32: `S2_TRAIL`, `S2_CHASE_RULES`, `S2_FORD_STAGE`,
  `S2_ROAD`, `S2_FORK`, `S2_REARGUARD`, `S2_RIDER`, `S2_SCOUT`, `S2_CRYSTALS`. Played at Session
  33: `S2_TEN_MINUTES`, `S2_SPOTTER`, `S2_AMBUSH`, `S2_APPROACH_CHOICE` (assault, by cart charge),
  and `S2_FIGHT` through the start of round 2. Cut: `S2_STATEMENT`, `S2_HEIST`, `S2_SKIP`,
  `S2_PARLEY`.
- **Stepped up (Jeff, 2026-11-10, option 4 of four):** reinforcements in the round after Iggy's
  first turn, and the griffon fights riderless. Not taken: Nella stops holding back (Marked Quarry
  on casters, shots at downed PCs). Sized with the v0.56.0 difficulty rules after Session 33's
  ~125-damage opening (`meta/difficulty.md`).
- **Choices** (`meta/player-agency.md`):
  - Party: corner Nella on the ridge before Tithe comes back for her, or let her go
    (`S2_TITHE_HUNTS`, `S2_ESCAPE`) · Nella's purse (`S2_TALLY`) · the banner in the bar
    (`S2_HAUL_HOME`) · what to give Silas for his cart (`S2_HAUL_HOME`)
  - Iggy: chase Nella into the cloud or turn back (`S2_IGGY_BEAT`)
- **Mysteries:** `S2_IGGY_BEAT` touches what Sah is; `S2_CAMP_INTEL` touches Harrow Bane and the
  banner; `S2_TALLY` touches Nella's debt. Check `scheduler/campaign/_mysteries.md` when the
  answers land.
- **For `/recap`:** log Odibli's casts (Citadel Clock, at 1 / 3), and his two Fireballs if they
  come out. Restamp the trackers. The reputation rewards at the waystation (Clatter's "Lightning
  man!", Brask backing off from Dip) are `unspent` until played.
