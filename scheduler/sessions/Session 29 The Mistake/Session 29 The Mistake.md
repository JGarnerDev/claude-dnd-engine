---
# --- MANDATORY ---
name: "Session 29 The Mistake"
campaign: homebrew
type: session
session_number: 29
exists: false
state: planned
tags:
  - session

mission: [[The Stolen Casks]]
planned_date: "2026-10-06"

# --- OPTIONAL ---
act: [[Act 1 - The Hearth at Ashford]]
locations:
  - [[Ashford]]
  - [[The Golden Lioness]]
key_npcs:
  - "[[Sable Wren]] (data — the offer, and the session's key NPC moment)"
  - "[[Mara Tull]] (data — sheriff; the town's first read on five armed strangers)"
  - "[[Silas Crubb]] (data — mayor; what the stolen delivery was worth)"
  - "the big one (nameless by design — the raid's focus-fire target)"
  - "[[Nella]] (offscreen — already gone with the ale; do not let the party catch her)"
  - "[[Aashal-Groon Mellenegon Borak]] (data — Asher, riding two animals in the woods; Halsby's bargain)"
encounters:
  - "The New Wing — 4x Bandit (2 melee cask-haulers, 1 melee screen, 1 crossbow) + 1x hedge-mage (reskinned Apprentice Wizard, CR 1/4) + 1x the big one (reskinned Thug, CR 1/2). ~500 adjusted XP, 3-5 rounds. Tension is a timer and an objective, not attrition: two bandits haul the last cask toward a cart while the big one drags a bound and gagged Sable toward the back door. The party can split for both, but neither end is safe. Tactics: keep the raiders on their jobs — all six converging on the party is RTD 1 and silently becomes Dangerous. Morale DC 12 WIS when the big one drops."
loose_threads:
  - "Three seeds owed to [[Davian Martikov]] — two from [[Baba Lysaga]], one from the druids of [[Yester Hill]]. Barovia-side; acknowledged in one line, not pursued"
  - "[[The Wanderer's Boon]] is inert in Odibli's hand and must be shown to be inert this session"
  - "Luci's energy storm feature (Session 28 new_entity) — name and mechanics still unrecorded"
  - "[[Halsby]]'s reason to be in Ashford is settled (Scene 1b, Asher's bargain). Still open: what the order doesn't like at [[Tassad]], and the later job he owes Sable"
difficulty_attrition: light
difficulty_lethality: standard
depth: narrated
scope: inline
opening_scene: "The last thirty seconds of Session 28, replayed — hand-in-hand at the winery, Odibli's hand on the stone, the light climbing past blinding. Held inside the transit long enough for the relic to give them the long rest in fiction, then dropped into a yard where a man is running past them carrying a cask."
closing_hook: "The offer is on the table and the hearth is warm, and then Odibli takes the stone out again and it does nothing at all — warm as a pocketed pebble, dead as if it never worked. Somewhere southeast a cart with the Lioness's ale on it is making poor time on a bad road."
relates_to:
  - "[[The Stolen Casks]] (the mission this opens)"
  - "[[Act 1 - The Hearth at Ashford]] (act)"
  - "[[Redwater]] (campaign)"
  - "[[Session 28 The Wereravens' Gift]] (replayed in the cold open)"
  - "[[The Wanderer's Boon]] (brought them here; stays inert)"
  - "[[Aashal-Groon Mellenegon Borak]] (Asher — Sable's patron; the party never meets him, Halsby bargains with him through two animals)"
  - "[[Halsby]] (joins in Scene 1b)"
  - "[[The Nightveil]] (sent Halsby on the road)"
importance: critical
active: true
description: "The first homebrew session. The party arrives mid-raid beside the Golden Lioness, saves Sable Wren or the last cask but not both, and is offered a provisional share in the one building in Ashford worth defending. Named for Sable's bestselling ale, which she has never explained."
---

Campaign: [[Redwater]] | Act: [[Act 1 - The Hearth at Ashford]] | Mission: [[The Stolen Casks]]

**Shape:** balanced · **Length:** standard (~2 hr, 5 scenes plus Halsby's short intro) · **Attrition:** light · **Lethality:** standard

## Orientation

Five PCs at level 4, two of them dormantly afflicted, one brand new to the group. They have
not long-rested since Session 24 in fiction — but **the transit is the rest**, so they arrive
whole. Coming out of Session 28 the mood is curiosity rather than dread: nobody cursed them,
[[Davian Martikov]] gave them a gift, and the last thing they heard was a promise that this
place would make them stronger. They own no money, no standing, and one relic that has
stopped working.

- **[[Halsby]] joins here,** through his own short intro (Scene 1b). His race and background
  are on his PC file now (Half-Elf, Haunted One). Halsby's `level_confirmed` stamps at this
  session's `/recap`, which clears the LEVEL STALE flag.
- **Tell Kellan before Tuesday, and only this:** Halsby is on the road for the Nightveil.
  [[Sister Maerith]] sent him to [[Tassad]], the bay's big harbor city (dot 6)
  to find out what, or who, is behind a rumor the order dislikes. The job is expected to take
  months. **Do not tell him** about the animals, Asher, or the bargain.
- Session 28 left three unresolved `new_entities`: Baba Lysaga's scarecrow constructs
  (offscreen), **Luci's energy storm feature** (Paul posted it to Discord; name and mechanics
  unrecorded), and Davian's marked map. All three are Barovia-side — none need acknowledgment
  here, but the energy storm should be written down before it matters mechanically.

### Rest Clock at session open

Zero rounds, zero short rests, freshly rested — the long-rest ruling of 2026-10-01 makes the
transit a long rest. That leaves the **full light-attrition budget of 6–10 rounds** against a
fight that wants 3–5. Comfortable. In-world date is deliberately unset: Aethryn has no settled
calendar yet, so the clock uses "Day 1, Ashford reckoning" as a working label rather than a
false date.

## Scenes

Each scene's prose is filed under `#### S1_ID` headings, one per flow-chart node, so the
session runner shows it as one dropdown per card, in flow order. Prose above the first
node heading is the scene's setup.

**Sample lines and read-aloud boxes are guidance, not script.** They set the voice and the
beat. Improvise from them, cut them, or say them in your own words.

### Scene 1 — The Last Thirty Seconds

- **Trigger:** session open, before any description of Ashford.
- **Location:** [[Wizard of Wines]] — the winery grounds in Barovia, replayed.
- **NPCs present:** none. This is the party and the relic.

#### S1_REPLAY — Replay the last thirty seconds of Session 28

- Replay the exact beat Kellan cut on: hand-in-hand, Odibli's hand on the stone, light rising
  past blinding.

> *"The vines. The cold. Davian's hand still raised in something between a blessing and a
> warning. Odibli's palm flat on the stone, and every one of you holding on to someone. The
> light starts in the stone and does not stay there."*

#### S1_REST — The long rest happens here, inside the transit

- Then **hold them inside the transit**, because that is where the rest happens — and the
  relic is what says so, not the DM. Full HP, all slots, hit dice back.
- Afflictions go dormant *here*, and the dormancy is felt. That is the beat that sells the new
  world as different from Barovia.

> *"The light does not hurt. That is the first wrong thing. It climbs past what your eyes
> should bear and keeps climbing, and somewhere in it the ache in your shoulder stops being an
> ache. Luci — you have not breathed properly since the blights. You are breathing properly.
> Dip, the whispers go quiet, all the way quiet, for the first time since the village. And
> underneath all of it, not a voice exactly, more the shape a voice leaves: **somewhere you can
> gather strength. And then return, strengthened.**"*

- **Say it in fiction, never as a rules announcement.** The players should work out that they
  are rested because the fiction told them, not because you said "take a long rest."
- **Device — in medias res** (`Scale: session`, `Last used: —`). The light does not fade into
  a quiet field. It fades into shouting.
- **Transition:** the light drops and there is a man-shaped shadow going past them at a run,
  carrying a cask.

### Scene 1b — The Green Eyes

- **Trigger:** right after Scene 1, while the light still holds the other four in the transit.
  Cut away to Halsby. *Meanwhile, a few miles off...*
- **Location:** the woods off the road to [[Tassad]], a few miles from [[Ashford]]. A stream
  that feeds the aquifer under the town runs nearby, and that is how Asher reaches here.
- **NPCs present:** **Asher** ([[Aashal-Groon Mellenegon Borak]]), riding two animals at once.
  Halsby has never heard of him, and Asher does not give his name.

Halsby's first scene, and the only one that is his alone. Keep it to about ten minutes.

#### S1_WOODS — Halsby on the road to Tassad, on the Nightveil's errand

- **The talker.** An animal steps onto the path and stops him. **Kellan picks what kind.** Its
  eyes burn green and leak smoke, and it speaks into his head, mind to mind.

> *"It is standing in the middle of the path as if it has been waiting there all morning, and
> it is looking at you the way nothing on four legs should. Its eyes are green, a deep-water
> green, and smoke curls up off them like breath on a cold day. The voice does not come from
> its mouth. It comes from behind your own eyes, too large for the space. **You are thinning,**
> it says. **I can stop that. There is a woman in the town below who is about to be hurt. Go.**"*

- **Never name the fade for him.** Kellan's file calls it that, but the table never has. Asher
  says *thinning*, which is the word Halsby uses for it.

#### S1_ASK — The ask: save Sable at the brewery in Ashford, now

- **The ask.** A woman named Sable is being robbed and beaten at a brewery in Ashford, right
  now. Go and save her. Later, help her with one more thing, and Asher will say when. *(What
  that later job is: decided later.)*
- **The offer.** **Protection from the fade.** He knows exactly what Halsby is losing and how
  fast. The visible proof: the spear and the shard he carries, made into one weapon that
  holds the fade off ([[The Shadowless Spear]], see `## Rewards`).
- **Halsby keeps the shard and the spear the whole time.** Nothing is taken from him.

**Asher's voice.** Lonely and very old. The water is how he remembers, so he speaks in short
weights, like someone who has not talked to anyone in a long time and is not sure how. He is
not cruel. He is just bad at asking. Sample lines:

- **The ask:** *"The brewery with the fire that does not go out. They are taking her. Go now,
  and I will remember that you did."*
- **The offer:** *"The spear on your back. The splinter you keep close. I can make them one
  thing. While you hold it, you stop thinning."*
- **The later job:** *"And after, when I say so, you help her once more. Once."*
- **If asked who he is:** *"I am under the town. I was under it before it was a town."* He gives
  no name.
- **If asked why Halsby:** *"You were on the road. You were thinning. I do not get many who
  are both."*

#### S1_SNAKE — Does he spot the snake hidden nearby?

- **The snake.** A second animal, a snake, waits in cover near him with the same eyes. Asher
  rides both. It acts only if Halsby refuses.
  - **Spotting it:** within 10 ft, his blindsight finds it automatically. Farther out, it is
    hidden at Stealth 14 against his passive Perception 11. Place it at 15 ft unless you want
    him to have the edge.
  - **What his blindsight finds:** a long body in the bracken, coiled loose and not cold the way
    a snake ought to be. It is warm as a hand, and perfectly still. If he gets eyes on it, the
    same green, the same smoke, lower to the ground.

#### S1_HAGGLE — He calls out the threat and bargains

- **He spots the snake → he can bargain.** Calling out the threat gives him leverage.
  Persuasion or Intimidation (+5 either way), DC 13. Success: the spear comes within **1–2
  sessions** instead of 3–4.
- **When he names the snake:** *"It was only to be sure of you."* No apology, and no denial.
- **Success:** a long pause, the smoke thickening. *"…Sooner, then."*
- **Failure:** *"It is a fair offer. It is the offer."*

#### S1_ANSWER — Does he take the deal?

- **He accepts.** The deal stands as offered. The spear comes in **3–4 sessions**.

#### S1_BITE — He refuses, and the snake bites

- **He refuses.** The snake bites. **Poisoned** until he drinks the antidote (disadvantage on
  attacks, his spell attacks included, and on ability checks; saving throws are unaffected).
  It does no damage and does not kill. The deal now adds **the antidote**, which is waiting at
  the Lioness. He can still refuse after the bite. Then he walks into the fight poisoned, and
  Sable has the antidote anyway.
- **After the bite:** *"I am sorry. I am not good at asking."* Then, plainly: *"The cure is
  with her. So am I, in a way."*

#### S1_DEAL — The deal stands: save Sable now, help her later

- **The catch, if Halsby works it out.** Asher can fuse the spear in about two minutes. He
  holds off because the unfinished spear keeps Halsby around until the second job is done. It
  is leverage, and Halsby reads leverage for a living. Let him see it.
  - **The tell:** if Halsby asks how long the fusing takes: *"It would take me no time at
    all."* A pause. *"Later."*
- **Transition:** Halsby comes out of the trees above the Lioness's yard just as a pillar of
  light comes down in it. He sees five strangers land, then Scene 2.

### Scene 2 — Somewhere You Can Gather Strength

- **Trigger:** immediate, same breath as Scene 1.
- **Location:** the yard outside [[The Golden Lioness]]'s new wing — bare dirt, staged cargo, a
  cart at the far edge, a half-built wing with its doors open and noise coming out.
- **NPCs present:** none yet; the raiders are scenery for one beat, then initiative.

This replaces the struck Descent. One beat, one roll each, straight into initiative — it does
the same mechanical job the Descent did in a third of the time. **The Grab lever is gone:**
nothing and nobody crossed with them, and there is no hag to escape.

#### S1_STANCE — Each player picks how their character lands

> *"The man with the cask is already past you, boots slapping, not even looking back. The light
> is still coming down around you and you are still in the air inside it. Below: a dirt yard,
> a cart at the far edge with a figure in scorched cuffs leaning on it, a man up on a stack of
> crates with a crossbow, and a half-built building with smoke pouring out of a hole in its
> wall. Someone in there is shouting orders. You have about one heartbeat to decide how you
> come down."*

**Beats** — each PC picks one stance, one roll, DC 12:

**Halsby does not roll a stance.** He arrived on foot, at the yard's edge, and he already
knows why he is there: Sable is the target. He starts at the edge nearest the wing's doorway.
If he is poisoned, he fights poisoned.

#### S1_STEADY — Steady — try to land square on your feet

- **Steady** (CON / Athletics / Acrobatics) — land square. The roll also sets where they land:
  - **17+** — they pick their spot anywhere in the yard.
  - **12–16** — they land in the Light zone (M9:O10 on the map), 15–20 ft from the nearest
    raider. Normal start.
  - **11 or less** — they land prone, in the middle of the bandits. No lost turn: standing up
    costs half their movement, as normal.

#### S1_READ — Read — take in the yard while still falling into it

- **Read** (WIS / INT / Perception) — take in the yard mid-arrival. Success: initiative edge,
  or one raider caught flat-footed. Failure: nothing — you were busy not falling over.
  - **What a successful Read notices** (one each, pick or let the player choose):
    - The crossbowman is slow to reload. He winds it like a man who learned last week.
    - The big one, inside the wing, has stopped dead and is staring straight up at the light.
    - The figure at the cart is patting an empty scroll case, the way you pat for lost keys.
    - The cart's brake is off. One good shove and it rolls.
    - Everyone wears the same cloudy stone on a cord. Nobody touches it. (Flavour only.)

#### S1_SCATTER — Nobody lands facing the same way, so the party starts split

Scatter places the **Read** PCs only; Steady's roll already placed the rest. The DM splits the
Read PCs as the statblock expects: some start in the yard near the cask-runners, some near the
wing's doorway where Sable is. **That split is a positioning
puzzle, not a penalty.**

#### S1_ENGAGE — Does the party step in, or stand back and watch?

**The first real choice: step in, or stand back?** Stepping in starts the fight. Hanging back
lets the worst case happen (Sable dragged off, more stock walking), which is still not a death.

**If anyone lands among the raiders** (Steady 11 or less), the raiders open with contempt. They
take the newcomers for more of Ashford's useless villagers, and they expect them to run like the
rest did:

- *"Another one fell out of the hayloft. Go on, run. Your lot's good at that."*
- *"Look at this — Ashford's sent its heroes. Back on your feet, sweetheart, and back indoors."*
- *"Town's full of cowards. Scatter, the way your neighbours did."*

Let the mockery hang for one beat. It hands the players their answer, and it makes stepping in
feel earned.

- **Transition:** initiative.

### Scene 3 — The New Wing

- **Trigger:** Scene 2 resolves.
- **Location:** [[The Golden Lioness]] — the new brewery wing and the yard. A complete shell
  with no fittings: crate stacks for cover, a bare bar, a chokepoint at the main doorway. The
  old core sits beside it warm and lit, and Sable will not retreat into it and leave the stock.
- **NPCs present:**
  - **[[Sable Wren]]** — tiefling warlock, patron **Asher** ([[Aashal-Groon Mellenegon Borak]]),
    the deep-water being under the town. *Wants:* the new stock not gone, and not to be dragged
    anywhere. *Voice:* warm and level even cornered; treats everyone like a regular customer;
    does not explain herself. **Bound and gagged when the party arrives.** The raiders knew she
    is a competent warlock and came prepared: a fire explosive in the wing to do damage and draw
    her out, then a *scroll of hold person* (read by the hedge-mage) to take her. Rope at wrists
    and ankles, a gag so she cannot cast. **She is not helpless in spirit**: they needed a bomb
    and a scroll for one woman, and her eyes say she is keeping score.
  - **The big one** — nameless on purpose. Scarred, missing teeth, wearing a townsman's stolen
    coat. Give him a look, never a name.

#### S1_FIGHT — The fight in the half-built brewery wing, 3 to 5 rounds

**Roster — six bodies, mixed (Jeff, 2026-10-05):**

- **2 × cask-hauler** — Bandit (CR 1/8, HP 11, AC 12, scimitar +3 for 4). Melee. Hands full with
  the cask; they fight only if someone blocks them.
- **1 × screen** — Bandit, melee (scimitar +3 for 4). Holds the gap between the yard and the wing.
- **1 × crossbow** — Bandit, ranged (light crossbow +3 for 5, range 80/320). Up on the crate
  stacks, covering the runners.
- **1 × hedge-mage** — reskinned Apprentice Wizard (CR 1/4, HP 9, AC 10). *Fire bolt* (+4, 1d10)
  and *burning hands* twice (15-ft cone, DC 12 DEX, 3d6 fire, half on a save). A raider with
  scorched cuffs and a trick bought cheap. Stays back near the cart.
- **The big one** — reskinned Thug (CR 1/2, HP 32, AC 11, Pack Tactics, multiattack, mace +4 for
  5). Dragging Sable toward the back door.

Raw 250 XP, ×2 group multiplier → **~500 adjusted**.

**Battlemap layout (Jeff, 2026-10-05)** — 5-ft grid:

- **Size:** a yard of ~60×40 ft beside a wing of ~40×30 ft. The old pub building sits beside the
  wing. It is set dressing only; nobody fights in it.
- **The cask starts ~45 ft from the cart**, so it gets there in about 3 turns at 15 ft a turn.
- **Sable and the big one start ~30 ft from the back door.** Dragging her halves his speed to
  15 ft, so she is out in 2 rounds.
- **The two sides of the fight are 40–60 ft apart**, so a party that splits up really can't
  help both sides.
- **Starting positions:** the 2 haulers are on the cask. The screen stands in the main doorway.
  The crossbowman is on top of the tall cargo stack in the yard, ~20 ft from the cart, so he can
  shoot at either side. The mage is at the cart. The big one is inside the wing with Sable.
- **The blown-out wall is half rubble (difficult terrain).** It is a second way into the wing,
  but a slow one. The doorway stays the fast route, so the screen bandit still matters.

**Grid refs (Jeff, 2026-10-05)** — the drawn map is `maps/new-wing.txt` in this folder. Render
it with `uv run scripts/battlemap.py --session 29`. That writes a clean VTT image and a DM key
with these refs to `maps/battlemaps/session-29/`. A1 is the top-left square.

- **The big one** I3 and **Sable** J3. The **back door** is D3, with his horse tied at B3.
- **The last cask** E12, with haulers at E11 and E13. **The cart** is at N12:O12, beside the
  open gate at P12:P13.
- **Screen** F8, in the main doorway (F8:G8). **Crossbow** J13, on the tall stack (J13:K14). He
  sees Sable straight up column J, through the blown wall (J8:L9). **Mage** N13.
- **Halsby** B9, at the alley's mouth.
- **Landing zones:** Light M9:O10 (Steady 12–16). Read split A F14:G15 (runners) and B H9:I10
  (doorway).

**Scenes 1b and 5 have maps too:** `maps/halsby-woods.txt` (talker G8, snake J11, Halsby G11)
and `maps/old-core.txt` (Sable behind the bar at D2). The core map places the cellar hatch,
the stairs and a shut door to the wing. Those are map-only, not canon, until `/recap`.

> *"Smoke is still rolling out of a blown-open wall of the new wing. Through it, a big man is
> dragging a tiefling woman across the bare floor by her collar. Her wrists and ankles are roped
> and there's a gag in her mouth. She isn't struggling. She's watching him, very calmly, the way
> you'd watch a man you intend to remember. Then he sees you. All five of you, standing in a yard
> where a second ago there was nothing but light."*

**Beats — the tension is a timer and an objective, not attrition:**

- The screen, the crossbow and the hedge-mage cover the runners.
- **Each raider wears a small cloudy crystal on a cord. None of them uses it.** Do not draw
  attention to it in the fight. These are the Earshot Crystals (see `## Rewards`).

**Sample lines in the fight:**

- **The big one (flat fact, never shouted):** *"She comes with me. You don't."* · *"Stay
  down."* · *"Your turn's next."*
- **The hedge-mage, on the second *burning hands*:** *"That's not what the man said it'd
  do!"* He bought it cheap and it shows.
- **The crossbowman, to the runners:** *"Move! Move the bloody barrel!"*
- **The cask-haulers, blocked:** *"We're not paid for this bit."*

**Lethality note — the one number that matters.** All six attackers focused on one PC is ~30
damage a round against ~30 average HP: **RTD 1, which is Dangerous — a tier above the pick.**
The objective split is what holds it at Standard: with two bandits on the cask and the big one
on Sable, effective pressure is ~12 a round, **RTD ~2.5**. If you let them all converge on the
party you have silently changed tiers. **Keep them on their jobs.**

The hedge-mage's *burning hands* is the new spike: about 10 to each PC in the cone, twice per
fight. Have it target a group, never one downed PC. Max single-target spike is still the big
one's multiattack at 16, which cannot instant-kill anyone,
Odibli included. So the table can run its Odibli-goes-down gag with no real risk of it going
wrong — and on current table notes, it will.

#### S1_FORK — Pressure, not a lock: they may split and try both

- **Two ends, one party.** Pressure, not a lock: the party *can* split and go for both, and
  Scatter has probably split them already. Each side is thinner, so both are winnable but
  neither is safe. Don't block a split; let the timers (cask ~15 ft a turn, Sable ~2 rounds)
  make each player's turn the choice. Saving the cask costs Session 2 nothing, because Nella
  already has most of the ale.

#### S1_CASKS — Go after the last cask

- Two bandits haul the last full cask toward the cart at ~15 ft per turn, starting ~45 ft out
  (about 3 turns). It reaches the cart,
  it is **gone**, and Session 2's chase matters more. Saved, it is a clean win.

#### S1_SABLE — Go after Sable instead

- The big one is dragging Sable, bound and gagged, through the wing toward the back door.
  He starts ~30 ft from it and drags her at 15 ft a round, so if he is ignored for two rounds
  he gets her out as leverage. Scorch marks and a blown-out wall section show where the fire
  explosive went off. The rubble there is difficult terrain, a slow second way into the wing.
- **Freeing her:** cutting her bonds is an action, and pulling the gag is free once she is
  loose. A freed Sable acts on her own turn from the next round (*eldritch blast*), so freeing
  her early is a real tactical win, not just a rescue.
- **While gagged, she still plays.** She doesn't struggle, but she signals. A jerk of the chin
  at the crossbowman, two fingers tapped toward the mage, a long look at the cart's brake. A
  player who watches her gets a free hint.
- **When the gag comes off.** Her regular-customer voice is the payoff, as if nothing unusual
  is happening: *"Evening. Give me one moment, I'll be right with you."* Then *eldritch blast*.
- **To the big one, later in the fight:** *"You've a tab here now. I keep very good books."*

#### S1_OUTS — Talking the raid down works too, and is encouraged

- **Non-combat outs all live:** parley · trickery (pose as the raiders' own people) ·
  intimidation. Any of these can trigger the morale check early or grant advantage. Details
  below.

#### S1_PARLEY — Parley — point out they came for goods, not for blood

- **Parley pays in clues.** The surface reason is goods; the hidden reason is keeping Ashford
  down (the act's spine). A parley roll that beats DC 12 gets the surface line, *"It's the ale,
  friend. Nothing personal."* **15+** adds one clue below; **20+** adds two. These are mook-level
  truths. None names Marlow or Harrow Bane, and none says *why* (that stays unresolved):
  1. *"Pay's steady, and up front. More than the casks are worth."*
  2. *"Orders were that the wing doesn't open. Take the stock, wreck the fittings."*
  3. *"Nobody dies. Boss was clear. Bleed the town, don't bury it."*
  4. *"We hit Ashford. Not the farms, not the road. Ashford, every time."*

#### S1_SCARE — Intimidate — live from the first jeer, even before initiative

- **Intimidate is live from the first jeer.** The raiders open with contempt (Scene 2) because
  they take the party for villagers; only the big one saw the light. A player can answer the
  jeering by turning it around, at any point, even before initiative. Intimidation DC 13
  triggers the morale check early. **Advantage** if they back it with proof: a raider already
  dropped, a spell in someone's face, or pointing at the light the big one saw and the rest
  missed (*"Ask him where we came from"*).

#### S1_TRICK — Bluff — 'the boss sent us, change of plan'

- **Bluff as the boss's people.** The party has never heard the name Marlow, so the bluff is
  generic: *"The boss sent us. Change of plan."* It works because the raiders really do take
  orders from someone. Deception DC 13 buys a round of hesitation, or advantage on the morale
  check. **18+:** a raider slips an already-planted name, *"Nella sent you?"* Never Marlow: the
  boots stay tonight's one feud detail.

#### S1_MORALE — Put the big one down and the rest break

- Break the big one (killed, frightened, or talked down) → surviving bandits make **DC 12 WIS**;
  failures flee and drop what they carry.
- **The break:** someone yells *"Nobody said fighting!"*, the cask hits the dirt, and the yard
  empties in three directions. The mage goes for the cart, if it is still there.

#### S1_BOTCH — Worst case, and it is still not a death

**Fail-forward, not death:** botched, the big one hauls Sable off, still bound, and more stock walks. Deeper
setback, rescue hook, higher base-building stakes. **No PC death in the premiere.**

> *"The back door bangs open and shut, and then there's just the sound of a horse being whipped
> hard, going away. Sable's not on the floor any more. Out in the yard, wheel ruts and a dropped
> cord where the last cask used to be."*

#### S1_LOOT — Right after the fight, in the yard, before the town arrives

- **Loot, right here:** as soon as the fight resolves, the party searches the yard: the crystals
  and the coin (see `## Rewards`). Then the town arrives.
- **First touch of a crystal.** It is cold, then suddenly not. Whatever the holder was thinking
  in words, the word they were halfway through, arrives in the head of the nearest crystal
  holder without going through anyone's ears. Let the players find it by accident if you can:
  wait for someone to mutter something while holding one.
- **Transition:** the last raider breaks and runs, or the cart rolls. Either way the yard goes
  quiet and there is a hole in the stock.

### Scene 4 — What the Raid Left

- **Trigger:** the fight ends.
- **Location:** [[Ashford]] — ford-town, western-frontier bones, under-defended and visibly bled.
- **NPCs present:**
  - **[[Mara Tull]]** — sheriff. *Wants:* to know what five armed strangers are, fast, and not
    to have to arrest them. *Voice:* quiet authority, gives an order once and expects that to be
    enough. Buried both children in the war and has never once mentioned it to ask for anything.
  - **[[Silas Crubb]]** — mayor and general-goods merchant. *Wants:* the ledger to balance and
    the town to stay neutral. *Voice:* drawling raconteur whose long tangents always end,
    apparently by accident, at a number he wanted you to know.

**This is the elastic scene** — cut it to narration if the raid ran long.

#### S1_TOWN — The whole town was hit at once by separate groups

- **The whole town was hit at once, by separate groups.** That's why nobody came for Sable: every
  street was fighting its own raid. The town arrives **late**, smoke-stained and bloodied, from
  its own fights. Mara comes from the ford with a wounded deputy; Silas from his store, which was
  also hit. They didn't abandon the Lioness; they couldn't reach it. (The raiders' jeers about
  cowardly neighbours were wrong, and the town's arrival quietly proves it.)

> *"They come up the road in ones and twos, not running. Nobody runs who's already done their
> running tonight. A woman with a sheriff's star has a deputy's arm over her shoulder and his
> blood down her side. Behind her, a big soft man in a shop apron with a burn on one sleeve,
> looking at the yard the way a merchant looks at a spilled order."*

- **Their first read on the party:** five strangers held the one place the town couldn't get to.
  Mara is grateful and wary in the same breath.
- **The light.** A few townsfolk saw the pillar mid-fight, and the rumour is already going round:
  *"they came down out of the sky."* Mara asks once: *"Folk are saying you came down in a light.
  I'd like to hear it from you."* The party chooses how to explain.
- **Mara, sample lines** (says each thing once):
  - *"You five. I'm not asking you to put those down. I'm asking you not to make me count
    them."*
  - *"You held the one door I couldn't reach. I'll thank you for it tonight and find out who
    you are tomorrow."*
  - On Lord Cael: *"Lord Cael writes a very good letter. I've a drawer full."*
  - To the wounded deputy, not looking at him: *"Sit. That's not a request."*
- **Silas, sample tangent.** It wanders, and it always lands on a number:
  *"Funny thing about rope. Everybody needs it, nobody budgets for it. My father used to say a
  town's only as good as its rope, which I always thought was a hanging joke, but no, he meant
  fences… anyway. That delivery was worth a thousand gold, and she'd paid me a third of it."*
  Sable owes him about 650 gp, and she's close to ruined (set 2026-10-05). She would never say
  so.
- Mara is honest about the arithmetic: [[Lord Corren Cael]] writes letters, and she has too few
  hands.
- Silas can be the one who mentions, in passing, what the stolen delivery was worth — and that
  Sable had not finished paying for it.

#### S1_NAMES — Town talk plants three names and stops there

- [[Wick]]'s crew was one of the groups, on the far side, and is already gone. Seed him as a
  *described* stranger, never seen: guild-marked, and wrong somehow.
- *If the party notes that bandits don't usually coordinate a town-wide raid,* agree, and stop
  there. That's the same rung as the boots: someone is organising this.
- Thread seeds, planted light and never lectured: **[[Nella]]** gets a face and a direction
  (southeast, laden cart, deep ruts) · **[[Harrow Bane]]** gets a name the town fears and no
  face · the feud gets **exactly one detail** — matched boots on dead "independent" bandits —
  and nothing more.
- *If the party pushes hard on the boots →* give the next rung only: someone is paying these
  men. Stop there.

**How each name lands, as guidance:**

- **Wick**, told secondhand by a villager: *"Elf. Had a mark on his hand like a brand, but
  neat, like someone did it with paperwork. Never raised his voice. Looked at the houses like
  he was counting the shutters."* (The shutters are a faint hint at his vampire hunt. Drop the
  line if that feels too early.)
- **Harrow Bane** lands as a silence, not as information. Someone mutters *"Bane's lot,"* the
  talk stops, and Mara says *"Not in the street."* That is all of it.
- **The boots:** Mara turns a dead raider's foot over with her own boot. *"Third crew this
  season that calls itself independent. Same cobbler."* Then stop.
- **Nella**, as a face and a direction: *"Woman on the cart seat, bow across her knees, cool as
  you like. Had a stick she kept cutting notches in. Took the southeast track, and the ruts are
  deep, so she's not hauling air."*

**Do not front-load the feud.** It is a reward for curiosity across the whole act. One boot
detail is the entire budget for tonight.

- **Transition:** someone points them at the Lioness's old core, where the hearth is lit.

### Scene 5 — The Mistake

- **Trigger:** the party goes inside, or Sable comes to find them.
- **Location:** [[The Golden Lioness]], old core — warm, characterful, hearth always lit,
  reputedly the safest building in town. **The contrast with the bare wing next door is the
  whole pitch.**
- **NPCs present:** [[Sable Wren]], now on her own ground and not cornered.

#### S1_WREN — Sable Wren is running the Golden Lioness entirely alone

- She is running the place **entirely alone.** Her crew ([[Lok Thuliaga]], [[Bree Tealeaf]])
  has not arrived. The new wing was built and was supposed to open; now it is scorched and blown
  open by the raiders' explosive, and still undefended.

> *"She pulls five mugs without asking and sets them down. 'That's The Mistake,' she says. 'It's
> the one people come back for.' Nobody has ever got her to say why it's called that. Behind her
> the hearth is doing what it has apparently always done, which is burn without anyone feeding
> it, and through the wall you can hear the new wing being very, very empty."*

#### S1_OFFER — Thanks first, no strings: a room and a meal tonight

- **Thanks first, with no strings.** A room and a hot meal tonight, because they saved her and
  her stock. Hospitality, not a deal: the party can accept without committing to anything.
- **Then the offer, and it is a standing one, not a question for tonight.** They are strangers
  who landed an hour ago, so nobody should expect a yes. Sable: *"I can't pay you. I can give you
  a piece of this place. It's worth more if you stay and help me hold it."* And her real logic,
  said plainly: *"A share's a reason to come back. I need people with a reason."* She is buying
  loyalty she can't afford in coin, which is why it is not charity.
  - **The terms:** 10% on tonight's deed, growing to 25% and 40% by deeds, never coin. One favour
    per town-help beat. With the deed come a room each, free meals, and the party naming one
    thing in the new wing. Construction runs **250–500 gp a room.** Put the terms on a card.
  - **Don't push for a yes.** The deed sits on the table. The reasons to take it are already in
    the fiction: they are broke and have no standing; Halsby owes Sable a favour through Asher;
    Nella's cart and the raiders' return are work waiting. The closing beat (the Boon is dead)
    is the real answer: they can't go home. Expect the yes early in Session 2.

#### S1_ODIBLI — Odibli is offered a stake in a brewery

- **Odibli's beat, and it is free.** Session 28's table notes record that his plan to conquer
  Vallaki through the power of good wine got real buy-in from the whole table. He has just been
  offered a stake in a brewery. Hand it to Miguel directly — **do not explain the joke**, just
  let Sable ask whether any of them knows anything about drink.
  - Sample: *"Any of you know drink? Not drinking it. Knowing it."*

#### S1_IGGY — Iggy plays the room he just saved — his spotlight beat

- **Iggy's beat — spotlight.** He is overdue at 2 rotation turns against everyone else's 4. A
  hearth, a rescued room, a town that needs cheering: he plays. Seeds his open hook *"decode the
  unfinished final song trapped in the viol"* — in a world that is neither Barovia nor Threnai,
  the unfinished part sits differently. **No resolution.**
  - **Rule for this beat: describe only what the table can see or hear.** Jeff is Iggy's player
    as well as the DM, so Iggy's inner experience (and [[Sah]]'s presence) is never narrated.
    What Iggy shares is a player choice.
  - **The sequence, about two minutes, then move on to the loot:**
    1. The room joins in. It is Mara's people only (set 2026-10-05): Mara, Silas, the wounded
       deputies, and a few families. Play it as a vigil, not a party. A dozen grieving people
       singing together is still close enough to a gathering in worship to wake Dip's gift (his
       Sage-enclave sense for weak points in reality).
    2. Mid-song the melody turns somewhere none of them has heard, holds a few bars, and stops.
    3. **The hearth goes still.** No flicker, just steady light, for as long as the phrase lasts.
       *(DM only: Asher senses a divine presence under his town, weighs it, and accepts it,
       because Sah is good and diminished.)*
    4. **The fire eases** back to normal. Sable, mid-pour, glances once at the floor toward her
       cellar spring, and says nothing.

       > *"The room's carrying the tune now, badly and loudly, the way rooms do. And then the
       > viol goes somewhere nobody follows. A few bars none of you have heard, not sad exactly,
       > more like the middle of a sentence. The hearth stops flickering. It doesn't dim. It just
       > holds, steady as a painted flame, for exactly as long as the phrase does. Then the song
       > stops, the fire breathes again, and Sable, mid-pour, glances once at the floor."*

    5. **Dip's moment: tell Ben privately** (note or whisper). Ben decides what Dip shares. Dip
       rolls Wisdom (Insight), or Intelligence (Religion) if Ben argues for his Sage training:
       - **Under 15:** a lurch of nested wrongness, layers inside layers, then gone.
       - **15–19:** it resolves like a nesting doll: real, then hollow, then *real* again, and
         the innermost layer is inside Iggy.
       - **20+:** clarity. That innermost layer is a presence, divine, small and very tired, and
         not hostile.

#### S1_ANTIDOTE — Only if Halsby was bitten: Sable already has the antidote

- **The antidote, if Halsby was bitten.** Sable already has it: a cup from her cellar spring.
  She does not explain how she knew to have it ready. *Do not let her name Asher here.* The
  party should leave knowing she has a patron, not that he went fishing for a fifth.
- **Sample.** She answers the question asked, not the one implied:
  - Halsby: *"How did you know?"*
  - Sable: *"It's spring water. Drink all of it."*
  - If he pushes: *"I know a great many things about this town. Most of them are about
    plumbing."*

#### S1_BOON — Close on the relic doing nothing at all

- **The sky, one line, when someone steps outside.** One huge moon with a bite out of it, and a
  faint glittering ring of debris along its path. Nobody in Ashford looks up at it (set
  2026-10-05).
- **The Barovia debt, one line.** Odibli still has [[The Wanderer's Boon]]. It is warm, it is
  inert, it does nothing. Without this line the season reads as a detour instead of the errand
  the relic sent them on.
- **Transition:** into the closing hook.

## Rewards

**Gold:** ~120–180 gp party total — the remnant's pocket coin, the big one's purse, salvage from
the wing. Standard session band per `meta/rewards.md` (100–250), about 25–35 gp a head.

**Item: the Earshot Crystals, one per PC.** Confirmed by Jeff on 2026-10-04
(`meta/loot-options/Party/misc/Earshot Crystals.md`, `confirmed_for` this session). It is a
Common and spends none of the act's Uncommon budget. No personalised item lands tonight.

- **What they do, at the table:** touch your crystal to speak telepathically, words only and
  past any language, to one holder you can see or to "all" holders within 300 ft. Listeners
  only need to carry theirs. Unlimited use.
- **When:** immediately after the fight resolves, in the yard, before the town arrives in
  Scene 4. The coin comes off the bodies at the same time.
- **Where they're found:** on the raiders, a crystal on a cord around every neck. They come
  off the fallen and out of what fleeing bandits drop. If fewer than five fall, the big one
  carries a pouch of spares.
- **They arrive as a mystery.** The raiders weren't using them because they thought the yard
  was already secured. If anyone asks, that is the whole answer. Nothing in the fight explains
  them. The players work out what they do by handling them. Touching one is enough to find out.
- **History (say it, at most three sentences):** *Every raider wore one, identical and cloudy,
  and not one of them was seen to use it.* Nothing about who made them or why. That stays
  unsaid.

**The twist, never said at the table:** [[Nella]] kept her crystal, and so did a few of her crew
who got away. Any time the party sends to "all" within 300 ft of one of them, they hear every
word. They can answer too.

- **It is a long fuse.** There will be many fights with Nella before it is revealed. She sits on
  it, and nobody on her side lets it slip in that time. Her escapes must still read as her own
  skill, never as something she overheard.
- **When it is revealed is open**, and well after this mission.
- **The way out is built in.** Messages to one holder you can see stay private, and re-cutting
  the crystals at a workshop the party builds closes the set. Either way, the fix pushes them
  toward base-building at the Lioness.

**Item, promised and not handed over: [[The Shadowless Spear]].** Confirmed by Jeff on
2026-10-04 (`meta/loot-options/Halsby/weapons/The Shadowless Spear.md`, `confirmed_for` this
session). Halsby's own spear and shard, fused: +1, his spellcasting focus, holds off the fade
while he carries it, and reaches 15 ft in dim light or darkness. Uncommon, so it spends his act
Uncommon.

- **Tonight it is only a promise,** made in Scene 1b. Asher fuses it in about two minutes when
  he chooses to: in **1–2 sessions** if Halsby bargained well, otherwise **3–4**.
- **Until then the fade runs as normal.** His dark-moon rite holds it off six to eight days at a
  time, as it always has.

**Narrative rewards** — all recordable as frontmatter, per the file's own test:

- The **10% Stake** — offered tonight as a deed on [[The Golden Lioness]]; it becomes theirs
  when they accept, likely early in Session 2
- [[Sable Wren]]'s `disposition` and `affinity` toward the party
- Standing with Ashford — [[Mara Tull]] and [[Silas Crubb]] both shift on how the raid was handled

**Levelling: nobody levels tonight.** For this season, levels come **one PC at a time**, at a
moment the DM judges climactic, with the whole party at 5 before the December finale fight (act
`## Loot`). Ben pushed on levelling in Session 28, so say at the table that **levels are coming**, and say no more.
No trigger is named. Each level lands as a surprise (act `## Loot`, overriding the announce rule
in `meta/rewards.md`).

## NPC Quick-Reference

### [[Sable Wren]]

- **Motivation:** open the new wing. She has built it, paid most of it off, and cannot defend it
  alone.
- **Knows:** the delivery's worth and that she has not finished paying for it · that the raiders
  are not local · that something under the town answers her, and she calls it Asher · nothing
  reliable about Harrow Bane beyond the name · why the ale is called The Mistake, and she is not
  telling.
- **Voice:** warm, competent, unhurried; treats a lord and a drifter identically; answers the
  question asked and not the one implied, and never explains herself.

### [[Mara Tull]]

- **Motivation:** hold the town together with too few hands, and find out what the party is.
- **Knows:** every raid Ashford has taken and what each cost · that the "independent" bandits
  wear matching boots · that Lord Cael answers letters and sends nothing · that the far side of
  town was hit by someone different.
- **Voice:** quiet, weathered, economical. Gives an order once. Grief steeled into grit, never
  spoken aloud.

### [[Silas Crubb]]

- **Motivation:** keep Ashford — and himself — carefully neutral, because neutrality is how a
  ford-town survives having two lords.
- **Knows:** stock, debts, prices, and what the raids have actually cost in coin · who owes whom
  · that he will trade with anyone who pays, including people he should not.
- **Voice:** affable, drawling, self-deprecating; wraps shrewd practicality in goofy tangents
  that always land on a number. Slightly slippery.

### The big one (nameless)

- **Motivation:** get the last cask on the cart, and get something out of the tiefling first.
- **Knows:** nothing useful. He is the meanest leftover, not a lieutenant — **do not let him
  become a source of intel.** Taken alive he is a Session 2 problem and a Mara Tull scene.
- **Voice:** barely verbal. Threat as a flat statement of fact.

## Contingencies

- **They chase the cart instead of saving Sable.** Fine, and arguably the better story. The big
  one drags her out; she is leverage, not a corpse. Session 2 opens as a rescue *and* a pursuit,
  and her offer comes later and costs her more to make. **Do not punish the choice** — the split
  is the scene, so both halves must be real.
- **They do not intervene at all.** Possible, with five strangers dropped into someone else's
  fight. Let it play: Sable is dragged off, the stock goes, and the town's first read on them is
  "they watched." Mara comes to *them* instead, much colder. The mission still runs; the Stake
  offer becomes something they earn back rather than something handed over.
  - **Colder Mara, sample:** *"You were standing right there."* A beat. *"I've buried better
    people for less. Don't leave town until I've decided what you are."*
- **They go straight at the feud.** Give the next rung — someone is paying these men — and stop.
  Harrow Bane's name comes from the town, not from a corpse. The leash is discoverable across
  the act, never handed over in session one.
- **Halsby kills the animals, or walks off toward [[Tassad]].** He can. The talker drops dead
  the moment it is hit, and its eyes go dark. The snake bites first if he turns his back.
  Asher tries once more, through a bird, a fox, anything nearby. If Halsby still walks, let him
  go: the poison sends him back to Ashford within the hour, because the antidote is only at the
  Lioness. The deal is waiting there, worse for him.
- **The talk runs long.** It is Kellan's first scene, so let it breathe. Even so, cut at ten
  minutes. The raid will not wait, and Asher knows it.

## Closing

Land it on the relic, not the fight.

> *"The deed is on the table. The hearth is warm. And at some point in the evening Odibli takes the
> stone out again — because of course he does — and it sits in his palm doing nothing at all.
> Warm, like it's been in a pocket. Dead, like it never worked. Somewhere southeast of here a
> cart with your ale on it is making poor time on a bad road. Somebody owes somebody three
> seeds, and it isn't tonight's problem."*

**Leave unresolved:** the cart's destination · who Wick is · the name Harrow Bane · why Ashford
really bleeds · whether the Boon ever opens again.

## Engine notes

- **Halsby's intro came from a spitball:**
  `spitball/act-1-the-hearth-at-ashford/halsby-intro-green-eyed-animal.md` (`state: used`).
  Two blanks are parked there for later: what the order dislikes at [[Tassad]], and the
  later job Halsby owes Sable.

- **Deployment tracking:** *in medias res* is used here (`meta/literary-devices.md`). At
  `/recap`, set its `Last used:` to [[Session 29 The Mistake]].
- **Spotlight commitment:** Iggy's hook *"decode the unfinished final song trapped in the viol"*
  moves `open → seeded` on his PC file when this plan is committed; it becomes `paid` at
  `/recap` if the beat lands.
- **Mission state:** [[The Stolen Casks]] flips `planned → active` when this session is played.
- **Wishlist drought:** 15 of 15 items in `meta/campaign-design-preferences.md` are undeployed
  after 28 sessions. Nothing was forced into this plan — they are arc-scale events and a
  curtain-raiser is the wrong place. Worth a deliberate look when shaping Sessions 3–4.
- **Callback search returned nothing above threshold** (top hit [[Sah]] at 0.289 against a 0.35
  bar). The one real callback is table-sourced: Odibli's wine plan from Session 28's notes.
