---
# --- MANDATORY ---
name: "Session 30 Keep the Ale"
campaign: homebrew
type: session
session_number: 30
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
  - [[Ashford]]
  - [[The Golden Lioness]]
key_npcs:
  - "[[Sable Wren]] (historian — thanks, the deed, the hearth)"
  - "[[Mara Tull]] (data — sheriff; arrives late from her own fight, and holds the prisoner at the close)"
  - "[[Silas Crubb]] (data — mayor; the delivery's number, and the horses)"
  - "[[Aashal-Groon Mellenegon Borak]] (historian — Asher, through the fox again; the Spear)"
  - "[[Nella]] (historian — on the ridge; loses, escapes, drops her tally)"
  - "the drover (nameless by design — Nella's second, the camp's floor anchor)"
  - "the prisoner (a silhouette only — Tyler's cameo, beat 1; no name, no lines)"
encounters:
  - "The Dusk Fork — Nella's rear guard: 2x Bandit + 1x Scout, mounted. ~300 adjusted XP, 2-3 rounds. A rider who escapes toward the camp raises its alert by one step."
  - "The Waystation — 6x Bandit + the drover (reskinned Thug) on the floor, Nella (custom, ~CR 3) on the ridge. ~2,375 adjusted XP, 4-5 rounds, medium-hard. Tactics: the crew stays on its stations around the cart; Nella spreads her shots to wound and pin, marks whoever climbs toward her, never a caster, and never finishes a downed PC. Morale DC 12 WIS when the drover drops or half the crew is down."
loose_threads:
  - "Session 29's unplayed Scenes 4-5: the loot, the town, the names, Sable's offer, Odibli's drink, Iggy's song, the dead Boon"
  - "[[The Shadowless Spear]] is owed to [[Halsby]] by Asher's fox: 'after you, not before'"
  - "Three seeds owed to [[Davian Martikov]] — Barovia-side, acknowledged in one line inside the Boon beat, not pursued"
  - "Still open from Session 29: what the order doesn't like at [[Tassad]], and the later job Halsby owes Sable"
difficulty_attrition: standard
difficulty_lethality: standard
depth: narrated
scope: inline
opening_scene: "The raided yard of the Golden Lioness, minutes after the last raider fell. Sable Wren is on the ground beside a spooked horse, bound and gagged. Five strangers, and the smell of scorched timber. Somewhere up the road, the town is coming."
closing_hook: "The casks ride home on the party's own cart, and Ashford is buzzing about something else. While they were gone, a raider walked into town and surrendered. He sits in Mara Tull's cell, silent, and the town wants a rope."
relates_to:
  - "[[The Stolen Casks]] (resolves this session)"
  - "[[Act 1 - The Hearth at Ashford]] (act)"
  - "[[Redwater]] (campaign)"
  - "[[Session 29 The Mistake]] (Scenes 4-5 carry over from here)"
  - "[[The Wanderer's Boon]] (shown inert)"
  - "[[The Shadowless Spear]] (delivered at the ford)"
  - "[[Harrow Bane]] (named in the camp's ledger; still no face)"
importance: critical
active: true
description: "Act 1's second session, milestone #30. The night after the raid (Sable's thanks, the deed, the hearth, the dead Boon), then the dawn pursuit of Nella's cart to a drover's waystation. Nella loses, escapes on a fallback she rigged, and drops her debt tally. The party comes home with the casks to a silent prisoner in Mara's cell."
---

Campaign: [[Redwater]] | Act: [[Act 1 - The Hearth at Ashford]] | Mission: [[The Stolen Casks]]

**Shape:** balanced · **Length:** long (~3 hr+, 8 scenes) · **Attrition:** standard ·
**Lethality:** standard · **Milestone:** session #30 — worth marking at the table.

**Decided by Jeff, 2026-10-07:** whole pursuit in one session · 24-hour rule held (short rest at
dawn only) · Spear at dawn by the ford · Elowen held for a later breather · Nella drops her tally
· close on a silent prisoner · cart kept, horses returned · the camp gives up band scale, Bane's
name and the aegis-banner · night trimmed to the character beats · Nella spreads her fire · chase
DCs 12/13/13/14, scored by stages won · waystation Common pinned.

## Combatants

All enemy stat blocks in one place. 2014 Monster Manual Bandit, Thug and Scout, reskinned, plus
Nella's custom block (from `workshop/first-homebrew-act/notes/session-2-pursuit-statblock.md`,
tuned here).

### At a glance

- **The Dusk Fork** (Scene 6): 2 Bandits + 1 Scout, mounted
- **The Waystation** (Scene 7): 6 Bandits + the drover on the floor, Nella on the ridge
- **Morale (both fights):** when the leader drops (the Scout at the fork, the drover at the camp)
  or half the group is down, each survivor makes a DC 12 WIS save (+0). Failures flee and drop
  what they carry.

### Bandit — the crew

- AC 12 · HP 11 · Speed 30 ft
- **Scimitar** +3 to hit, 1d6+1 slashing (avg 4)
- **Light crossbow** +3 to hit, range 80/320, 1d8+1 piercing (avg 5)

### Scout — the rear guard's rider

- AC 13 · HP 16 · Speed 30 ft · Perception +5, Stealth +6, Survival +5
- **Keen Hearing and Sight:** advantage on Perception checks that use hearing or sight
- **Multiattack:** two melee or two ranged attacks
- **Shortsword** +4 to hit, 1d6+2 piercing (avg 5)
- **Longbow** +4 to hit, range 150/600, 1d8+2 piercing (avg 6)
- **Job:** watch the back trail. When the fight turns, the Scout rides for the camp, not for the
  party.

### The drover — reskinned Thug

- AC 11 · HP 32 · Speed 30 ft
- **Pack Tactics:** advantage on an attack if an ally is within 5 ft of the target
- **Multiattack:** two mace attacks (a cart-whip in the fiction), +4 to hit, 1d6+2 bludgeoning
  each (avg 5)
- **Heavy crossbow** +2 to hit, range 100/400, 1d10 piercing
- Leathery, barks orders, named by role and never by name. He anchors the camp floor the way the
  big one anchored the raid. **He knows nothing useful** — taken alive, he is a Mara Tull problem.

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

### Running it

- **The crew stays on its stations** (the cart, the corral, the fire). All seven converging on one
  PC is RTD ~1 and quietly turns this into a dangerous fight. Same rule as the Session 29 raid.
- **Alert states** (set by the chase, `S2_APPROACH`):
  - **Unaware** (4 stages won): sentries dicing, two crew asleep in the shed. The party picks its
    position and gets surprise if it wants it. Nella is in the shed, so her first round is the
    climb to her perch.
  - **Dusk** (2–3 won): two sentries posted, Nella on her perch at the dusk rotation.
  - **Night alert** (0–1 won): perimeter staked (difficult ground, or DEX 12 to cross at speed),
    double watch, fires banked. Nella pre-positioned, Prepared Ground live from round 1.
- **Round budget:** ~3 on the clock from the raid, ~2–3 at the fork, ~4–5 at the camp ≈ 11 of
  standard's 18–24. The squeeze is the missing long rest, not the round count.

## Orientation

Night in the raided yard of [[The Golden Lioness]], minutes after the fight. Six raiders are dead
(Arden, Willem, Gib, the hedge-mage Tallis, and the big one, nameless). [[Sable Wren]] is on the
ground beside a spooked horse, still bound and gagged, and has not spoken. [[Nella]]'s cart is
gone south under the trees with the barrels she had already loaded. [[Halsby]] walked out of the
shadows among four strangers who came down in a light, and Asher's fox still owes him a spear.

- **Levels:** Dip and Luci 5; Halsby, Iggy and Odibli 4. Levels keep coming one PC at a time, as
  a surprise. Nobody is planned to level tonight.
- **Resources:** the transit's long rest was about an hour before the raid. Halsby spent heavily
  (Invisibility, a twinned Chromatic Orb, Magic Missile upcast to ~3rd); Odibli spent Hold Person;
  Luci spent ki and her emanation; Iggy one Bardic Inspiration; Dip one rage and took 8 fire.
- **Afflictions:** Iggy's shadow and Dip's whispers are dormant in Aethryn. Luci's Sacred Flame and
  Odibli's familiar are still gone.
- **Mood:** the table loved the fight and agreed to open this session on roleplay. Roll20 ate much
  of Session 29 — check sheets before starting.

### Rest Clock across the session

- **Night (Scenes 1–3):** the party sleeps at the Lioness. **It is not a long rest.** The 24-hour
  gate holds (Jeff, 2026-10-07): the transit's rest started about an hour before the raid. Say it in
  fiction — they sleep, it helps, it isn't enough — never as a rules call.
- **Dawn (Scene 4):** one short rest at the ford, before they ride. Hit dice, short-rest features,
  Halsby's sorcery points if his build recovers any.
- **Day (Scenes 5–6):** the ride. Rounds at the fork go on the clock.
- **Dusk to night (Scene 7):** the camp. Roughly 20–23 hours have passed since the transit rest
  started. **The 24-hour window reopens during or just after the camp fight.** Once the camp is
  taken, the waystation is the first place safe enough for a real long rest before the ride home.
  If they ride straight through the night instead, they arrive in Ashford still unrested.
- **In-world time:** the working label is "Day 2, Ashford reckoning" from dawn. Aethryn has no
  calendar yet. Exact distances to the waystation are unset: it is **a long day's ride** for a laden
  cart's pursuers. Leave the mileage as `<a day's ride southeast>` until a region pass sets it.

### Unresolved from Session 29

- **Fida**, Luci's name for the broken moon, has no entity yet. Nothing tonight needs it.
- **The raiders' names** stay recap-only. If anyone in town asks, Mara knows Tallis by reputation
  ("hedge-witch, sold charms at the fair, then didn't").

## Scenes

Everything below is **guidance, not script**. Lines and read-alouds are there to improvise from,
not to read verbatim. The node headings (`#### S2_…`) match `_flow.md`, so the session runner puts
each block on its card.

### Scene 1 — The Yard

- **Trigger:** session open. Pick up in the yard exactly where Session 29 stopped.
- **Location:** [[The Golden Lioness]], the yard and the blown-open new wing. Scorched timber,
  dropped tools, one cask on its side, the horse still dancing.
- **NPCs present:** [[Sable Wren]], bound and gagged.
- **Time:** ~10 minutes. Quick.

> *"The yard goes quiet the way places do after a fight — not silent, just done. A cask rolls a
> slow half-turn and stops. The horse has backed itself into the corner of the wall and is
> breathing like a bellows. Beside it, a woman with horns and her wrists tied behind her is
> looking up at you over a gag, and her expression isn't fear. It's assessment."*

#### S2_SABLE_FREE — Cut Sable loose. Her first words are practical, not grateful

- Whoever frees her gets her first words. They are not thanks.
- **Sample lines** (pick one):
  - *"Horse first. He'll break a leg on that wall."*
  - *"Is the fire out in the wing? Then I'm fine."*
  - Once standing, to all of them, level and unhurried: *"Right. Who are you, and are you staying
    for supper?"*
- If someone asks if she's hurt: *"Ask me tomorrow. Tonight I'm counting."*
- She does not ask about the light. She will, later, and only once.

#### S2_LOOT — The bodies: coin, and a crystal on a cord around every neck

- **Coin:** ~120–180 gp across the bodies and the big one's purse. About 25–35 gp a head.
- **The Earshot Crystals**, one per PC (confirmed, `meta/loot-options/Party/misc/Earshot
  Crystals.md`). A cloudy crystal on a cord around every raider's neck, identical.
- **First touch:** cold, then suddenly not. Let them find what it does by accident. Wait for
  someone to mutter while holding one, and tell the nearest other holder they heard it *without
  hearing it* — the word arrived in their head, not their ears.
- **What they do:** touch your crystal to speak telepathically, words only and past any language,
  to one holder you can see or to "all" holders within 300 ft. Listeners only need to carry theirs.
- **History, at most three sentences, said only if asked:** *Every raider wore one, identical and
  cloudy, and not one of them was seen to use it.* Nothing about who made them or why.
- **DM only — the long fuse:** [[Nella]] kept hers, and so did a few of her crew. Any "all"
  message within 300 ft of one of them, they hear. **This matters tonight.** If the party uses
  "all" near the waystation, Nella hears it. She does not act on it in any way the party can
  notice. Her escape must read as her own skill.
- **Transition:** voices up the road. The town is coming.

### Scene 2 — What the Raid Left

- **Trigger:** the yard is cleared.
- **Location:** [[Ashford]], the road up to the Lioness. A ford-town that was hit everywhere at once.
- **NPCs present:**
  - **[[Mara Tull]]** — sheriff. *Wants:* to know what five armed strangers are, and not to have
    to arrest them. *Voice:* quiet authority, gives an order once.
  - **[[Silas Crubb]]** — mayor and general goods. *Wants:* the ledger to balance. *Voice:* drawling
    tangents that always land on a number.
- **Time:** ~10 minutes. Quick. Narrate around the lines.

#### S2_TOWN — The whole town was hit at once; they couldn't reach the Lioness

- Every street fought its own raid. That's why nobody came for Sable. The town arrives late,
  bloodied, from its own fights.

> *"They come up the road in ones and twos, not running. Nobody runs who's already done their
> running tonight. A woman with a sheriff's star has a deputy's arm over her shoulder and his blood
> down her side. Behind her, a big soft man in a shop apron with a burn on one sleeve, looking at
> the yard the way a merchant looks at a spilled order."*

- **Mara's lines** (each said once):
  - *"You five. I'm not asking you to put those down. I'm asking you not to make me count them."*
  - *"Folk are saying you came down in a light. I'd like to hear it from you."* — the party chooses
    how to explain. She listens all the way through and doesn't argue.
  - *"You held the one door I couldn't reach. I'll thank you for it tonight and find out who you are
    tomorrow."*
  - To the wounded deputy, not looking at him: *"Sit. That's not a request."*
- **Silas's tangent:** *"Funny thing about rope. Everybody needs it, nobody budgets for it. My father
  used to say a town's only as good as its rope, which I always thought was a hanging joke, but no,
  he meant fences… anyway. That delivery was worth a thousand gold, and she'd paid me a third of
  it."* Sable owes him about 650 gp. She would never say so.
- **The Barovian coin (optional, one beat):** only if someone spends or shows coin. Silas turns
  Iggy's electrum over: *"Who's the fellow on this? Handsome. Looks like he'd foreclose on you."*
  Then quietly: a coin with a face nobody knows looks forged, and he'd rather they didn't spend more
  of it in his town. Seed only.

#### S2_NAMES — Three names and the boots, one line each, then stop

- **[[Wick]]**, secondhand from a villager: *"Elf. Had a mark on his hand like a brand, but neat,
  like someone did it with paperwork. Looked at the houses like he was counting the shutters."*
- **[[Harrow Bane]]**, as a silence: someone mutters *"Bane's lot,"* the talk stops, and Mara says
  *"Not in the street."* That's all.
- **The boots:** Mara turns a dead raider's foot over with her own boot. *"Third crew this season
  that calls itself independent. Same cobbler."* Stop there.
- **[[Nella]]**, a face and a direction: *"Woman on the cart seat, bow across her knees, cool as you
  like. Took the southeast track, and the ruts are deep, so she's not hauling air."* Odibli saw her;
  let him connect the name if he wants to.
- **Budget:** the boots are tonight's one feud detail. If pushed: "someone is paying these men," and
  stop.
- **Transition:** Mara takes her deputy home. Sable, from the doorway of the old core: *"Hearth's
  lit. Come in before you fall down."*

### Scene 3 — The Mistake

- **Trigger:** the party goes inside.
- **Location:** [[The Golden Lioness]], the old core. Warm, characterful, the safest building in
  town, a hearth that burns without anyone feeding it. Through the wall, the new wing is very
  empty. **The contrast is the whole pitch.**
- **NPCs present:** [[Sable Wren]], on her own ground now.
- **Time:** ~30–35 minutes. **Played in full.** This is the heart of the night.

#### S2_WREN — Sable, alone, pours The Mistake

- She is running the place entirely alone. Her crew ([[Lok Thuliaga]], [[Bree Tealeaf]]) hasn't
  arrived. The new wing was built and was meant to open.

> *"She pulls five mugs without asking and sets them down. 'That's The Mistake,' she says. 'It's
> the one people come back for.' Behind her the hearth is doing what it has apparently always done,
> which is burn without anyone feeding it, and through the wall you can hear the new wing being
> very, very empty."*

- **Why's it called The Mistake?** *"Drink it and tell me it's not."* She never explains.
- **The light, asked once:** *"You came down out of the sky. I'm not going to ask how. I'm going to
  ask if you're going back up."* Whatever they answer, she nods like it's a delivery date.

#### S2_OFFER — A room and a meal, no strings. Then the deed, left on the table

- **Thanks first:** a room and a hot meal tonight, because they saved her and her stock. No deal.
- **Then the offer, a standing one:**
  - *"I can't pay you. I can give you a piece of this place. It's worth more if you stay and help
    me hold it."*
  - *"A share's a reason to come back. I need people with a reason."*
- **The terms** (on a card): 10% now, growing to 25% and 40% by deeds, never coin. With the deed:
  a room each, free meals, and the party names one thing in the new wing. Building runs 250–500 gp
  a room.
- **Don't push for a yes.** The deed sits on the table. Likely pushes and her answers:
  - "Why us?" — *"You were here. That's most of it."*
  - "What's the catch?" — *"The roof leaks over the third room and the raiders know where we
    live."*
  - "We have to get home." — *"Then you'll want somewhere to sleep until you do."*
  - A flat no: *"It'll be on the table in the morning."* And it is.
- **The casks:** if anyone raises the cart, she doesn't ask them to go. *"That ale was the wing's
  whole reason to open. I'd go myself if I had a horse and a bow."* Silas's horses come up at dawn.

#### S2_ODIBLI — "Any of you know drink?"

- Odibli's beat, free. He wanted to conquer Vallaki through good wine; he's just been offered a
  stake in a brewery. Don't explain the joke.
- Sable: *"Any of you know drink? Not drinking it. Knowing it."*
- If Odibli bites, she tests him: a thimble of something from under the bar. *"What's in it?"*
  A Nature or Intelligence check, DC 12: success names the honey and the spring water's odd
  sweetness. She raises an eyebrow, which from her is applause.

#### S2_IGGY — Iggy plays the room — his spotlight beat

- Carried from Session 29 (hook *"decode the unfinished final song trapped in the viol"*, seeded).
  **No resolution.**
- **Describe only what the table can see or hear.** Jeff is Iggy's player and the DM, so Iggy's
  inner experience (and [[Sah]]'s presence) is never narrated.
- **The sequence, about two minutes:**
  1. The room joins in. Mara's people only: Mara back from the deputy's bedside, Silas, the walking
     wounded, a few families. A vigil, not a party.
  2. Mid-song the melody turns somewhere none of them has heard, holds a few bars, and stops.
  3. **The hearth goes still.** No flicker, steady light, as long as the phrase lasts. *(DM only:
     Asher senses a divine presence under his town, weighs it, accepts it. Sah is good and
     diminished.)*
  4. The fire eases back. Sable, mid-pour, glances once at the floor toward her cellar spring and
     says nothing.

> *"The room's carrying the tune now, badly and loudly, the way rooms do. And then the viol goes
> somewhere nobody follows. A few bars none of you have heard, not sad exactly, more like the middle
> of a sentence. The hearth stops flickering. It doesn't dim. It just holds, steady as a painted
> flame, for exactly as long as the phrase does. Then the song stops, the fire breathes again, and
> Sable, mid-pour, glances once at the floor."*

- **Then Dip's moment — tell Ben privately.** Ben decides what Dip shares. Wisdom (Insight) or
  Intelligence (Arcana) if Ben argues for the Sage training:
  - **Under 15:** a lurch of nested wrongness, layers inside layers, then gone.
  - **15–19:** a nesting doll — real, then hollow, then *real* again, and the innermost layer is
    inside Iggy.
  - **20+:** that innermost layer is a presence, divine, small and very tired, and not hostile.

#### S2_BOON — Odibli's stone does nothing at all

- Late in the evening Odibli takes [[The Wanderer's Boon]] out again, because of course he does.

> *"It sits in your palm doing nothing at all. Warm, like it's been in a pocket. Dead, like it never
> worked. Somebody owes somebody three seeds back in Barovia, and the stone has nothing to say about
> it."*

- One line for the Barovia debt, then let it sit. **This is the reason to take the deed.** Expect
  the yes here, or at dawn.
- If they accept tonight: Sable slides the deed across, says *"Ten,"* and pours another round.
  Record the 10% Stake.
- **They sleep.** Rooms in the old core. It helps; it is not a long rest. One line: *"You sleep
  like dropped coats. It isn't enough, and you all know it."*
- **Transition:** grey light, and the trail is getting older.

### Scene 4 — Dawn at the Ford

- **Trigger:** first light.
- **Location:** [[Ashford]]'s ford. Cold water over flat stones, mist on the tributary, the cart
  ruts biting into the far bank.
- **NPCs present:** [[Silas Crubb]] with horses; the fox.
- **Time:** ~15 minutes.

#### S2_SHORT_REST — The short rest is here, before they ride

- Breakfast at the Lioness and an hour at the ford. One short rest: hit dice and short-rest
  features. Nothing else comes back.

#### S2_HORSES — Silas lends the horses: "bring them back shod"

- Silas brings five horses himself, which tells you how much he wants that ale back.
- *"These are not gifts, they are loans, and I'd like them back with four shoes each, which is
  three more than you'd think people manage."*
- *"Funny thing about horses…"* — and it lands on a number: *"…eleven gold a head if you lame one.
  I'm not saying you will."*
- **This is a favour debt.** Returning them sound pays it off (Jeff, 2026-10-07). Log it for the
  favours currency when base-building resumes.

#### S2_SPEAR — The fox waits at the water's edge. Halsby's Spear

- **Halsby's spotlight beat.** "After you, not before." The job is done.
- The fox is sitting on a flat stone mid-ford, dry, as if the water goes around it. Smoky green
  eyes. Nobody else sees it until Halsby does.

> *"On a flat stone in the middle of the ford, where the water should be washing over it, there's a
> fox sitting perfectly dry. The current bends around the stone like it's been asked to. Its eyes
> are green and leaking smoke, and it's looking at Halsby the way a creditor looks at a man who's
> finally paid."*

- **The fox's lines** (Asher's voice, through it; never gives his name):
  - *"You did it the way I asked. People rarely do. Spear, please. And the stone."*
  - *"It'll hurt the shadow, not you."*
  - When it's done: *"It casts no shadow at the point. That's the part that keeps the dark from
    eating you. Don't lose it."*
  - If Halsby asks what Asher wants next: *"She'll ask. Not me."* (the later job he owes Sable)
- **The fusing:** about two minutes. Halsby keeps hold of both the whole time. The shard sinks into
  the spearhead as if it grew there. The haft throws a shadow. The point does not.
- **[[The Shadowless Spear]]** (confirmed, `meta/loot-options/Halsby/weapons/The Shadowless
  Spear.md`): +1 · his spellcasting focus · **the fade does not advance while he carries it** ·
  reach 15 ft in dim light or darkness. Uncommon — his act Uncommon.
- **History, three sentences, if asked:** *His own spear and his own shard, fused by something old
  in the water under Ashford. It was promised by a fox and delivered at a ford. What it cost the
  thing that made it, nobody said.*
- The fox walks off the stone and under the water. It doesn't come up.

#### S2_TRAIL — Deep ruts, a dropped stave, southeast

- The ruts are deep (laden cart). A cask stave lies split on the far bank. The trail heads
  southeast toward Duskwater.
- **Transition:** they ride.

### Scene 5 — The Red Trail

- **Trigger:** they ride out.
- **Location:** the southeast road from [[Ashford]] toward Duskwater. Working labels only: the
  ford, the drover's road, the dusk fork, the camp approach. Stops are scheduler content; `/recap`
  canonizes only what they visit.
- **Time:** ~25 minutes. Skill challenge.

#### S2_CHASE_RULES — Four stages, one check each, scored by stages won

- **Each stage:** every PC makes one check from the open menu, describing how they help. **A stage
  is won when at least half the party passes** (3 of 5).
- **Menu:** Survival (tracking) · Perception (spotting sign) · Animal Handling (pushing the horses)
  · Nature (reading terrain) · Athletics (crossings) · Investigation (the cart's tells). A player
  who argues well for something else gets it.
- **DCs:** stage 1 **12** · stage 2 **13** · stage 3 **13** · stage 4 **14** (Jeff, 2026-10-07).
  Record what actually gets used; it fills the empty Skill Challenge table in `meta/difficulty.md`.
- **Failures cost lead, never the trail.** A lost stage is a lamed horse, a cold fork, a night
  crossing. They always find the camp.
- **Result** (stages won): **4** → camp unaware · **2–3** → dusk · **0–1** → night alert.

#### S2_FORD_STAGE — Stage 1, the far bank (DC 12)

> *"The ruts come up out of the water deep enough to stand a boot in. Somebody's been dragging a
> great deal of weight in a hurry, and somebody else has been sweeping the edges with a branch to
> make it look like less."*

- **Loss:** a horse balks in the ford and somebody takes a cold soaking. Twenty minutes lost.

#### S2_ROAD — Stage 2, the drover's road (DC 13)

- A wide, old cattle road through rolling scrub. The ruts mix with other traffic here.
- **Perception or Investigation finds (offer one or two):** a hoofprint with a cracked shoe,
  repeated every stride · a wet patch where a cask has been weeping · a whittled curl of antler,
  fresh — someone sitting on the cart seat cutting notches.
- **Loss:** they follow the wrong ruts for an hour before the cracked shoe goes missing.

#### S2_FORK — Stage 3, the dusk fork, and a false trail (DC 13)

- The road splits. One branch shows the ruts plainly — too plainly. A dragged log has laid them;
  the real cart went the other way over hard ground.
- **Survival or Investigation sees through it.** Nature notices the "ruts" don't sink where the
  ground goes soft.
- **The rear guard is here** — see Scene 6. If the party wins this stage, they spot the riders
  first.
- **Loss:** they ride the false branch until it dead-ends at a stream, and double back in the dark.

#### S2_APPROACH — Stage 4, the camp approach (DC 14)

- Woodsmoke, and a corral full of horses that can smell theirs.
- **Animal Handling** keeps the borrowed horses quiet. **Stealth** works here too.
- **Loss:** a horse whinnies, a corral answers, and somebody at the camp looks up.
- **Set the alert state** now, then go to Scene 7.

### Scene 6 — The Dusk Fork

- **Trigger:** during stage 3 of the chase.
- **Location:** the fork in the drover's road. Long light, scrub, one lone tree, open ground
  either side. Riders show for a long way out here.
- **NPCs present:** Nella's rear guard: two Bandits and the Scout, mounted, watching the back trail.
- **Time:** ~15 minutes, 2–3 rounds.

#### S2_REARGUARD — Nella's rear guard holds the fork

- **If the party won stage 3:** they see the riders first, sitting their horses by the lone tree.
  Surprise is theirs to take.
- **If they lost it:** the Scout sees them first and puts an arrow into the lead horse's
  saddlebag as a warning.

> *"Three riders by a lone tree at the fork, black against the low sun. One of them stands in the
> stirrups to look at you, then sits back down and says something to the others. You can't hear it.
> You can see them stop laughing."*

- **Bandit lines:** *"Told you someone'd come."* · *"That's the sky lot. That's them."* · *"Ride
  for her. Go!"*
- **Talking it down works:** Intimidation DC 13 sends the two Bandits running (but they run *to the
  camp*). A good bluff keeps them sitting long enough to close.

#### S2_RIDER — Does a rider reach the camp?

- **The Scout's job** is to warn the camp, not to win. When the fight turns, it rides.
- **If any rider escapes toward the camp**, its alert state goes up one step (unaware → dusk →
  night alert). Stopping the rider is the real objective. Make that legible: *"The scout isn't
  fighting you any more. He's riding for the camp."*
- **Morale:** the Scout down or the two Bandits down → DC 12 WIS. Failures flee, and fleeing
  Bandits go to the camp.
- **Transition:** the light goes. The camp approach (stage 4).

### Scene 7 — The Waystation

- **Trigger:** the chase ends.
- **Location:** an old drover's relay short of Duskwater. **Long shed** (bunks, ledger, stores) ·
  **corral** of nervous horses (noise hazard for sneaks, stampede lever for chaos) · **well** ·
  **the cart**, parked by the shed with the casks still loaded · **watch-fire** · and set back, the
  **overwatch ridge** with a brush blind, a **gully** behind it, a **rope-crossing** over the gully,
  and a **cached horse** half a mile beyond. No map yet: `<rough sketch before the table>`.
- **NPCs present:** [[Nella]] on the ridge · the drover · six Bandits · the Marlow banner on the
  shed's pole.
- **Time:** ~45 minutes.

> *"The waystation sits in a fold of the land: a long shed with a sagging roof, a corral full of
> horses that have already noticed yours, a well with a bucket on a chain, and a fire. Beside the
> shed is a cart you'd know anywhere now, still loaded, the casks lashed down under a tarp. On a pole
> above the shed a banner moves in the dusk wind, too fine for this place. And up on the ridge
> behind it all, where the brush is thickest, nothing moves at all."*

#### S2_APPROACH_CHOICE — Heist, assault, parley or trick?

- **All four are viable.** Let the party pick and don't steer.
- **Night heist** — get the cart out without a fight. Watch rotations, the corral, and Nella is the
  light sleeper. Pulling it off means **the party leaves *her* the taunt for once.** Encourage it.
  If it goes loud halfway, drop into `S2_FIGHT` with the party already at the cart.
- **Assault** — `S2_FIGHT` on their initiative.
- **Parley** under a truce-branch. Nella talks from the ridge, never comes down. She won't give up
  the casks, but **her debt can show its edge:**
  - *"That ale's worth a number to me. You aren't."*
  - *"Everyone wants something back from me tonight. Get in line."*
  - Pushed on why she does this: *"I'm working off a number. When it's done, I'm done."* Then
    nothing more.
- **Trickery** — posing as the band's relay riders, or Marlow men with new orders. Insight and
  Deception contested; the drover is easy to fool, Nella isn't (Insight +7 from the ridge). If it
  half-works, it buys positioning, not the cart.

#### S2_FIGHT — Two layers: the floor and the ridge, 4–5 rounds

- **The floor:** the drover and six Bandits around the cart and fire. Session 29's fight, one rung
  meaner. The crew holds stations; they don't converge.
- **The ridge:** Nella's ranged pressure, spread to wound and pin. Closing on her costs the floor
  fight bodies; ignoring her costs HP every round. **That squeeze is the fight.**
- **Mid-fight lines:**
  - Drover: *"Hold the cart! Nobody touches the cart!"* · *"She's up there, she's got you, keep
    them in the open!"*
  - Bandits: *"That's the sky lot."* · *"Bane doesn't pay us for this."* · *"Where's she going?
    Where's she GOING?"*
  - Nella, calm, to whoever is climbing toward her: *"Further than you'd like."*
- **Halsby's Spear in the dark:** reach 15 ft in dim light or darkness. If the fight is at night,
  describe the shadow carrying the point the last ten feet.
- **The horses:** a stampede through the corral is a lever for chaos (DC 13 Animal Handling to
  start it on purpose, or it starts on its own if fire reaches the corral).

#### S2_MORALE — The drover drops, or half the crew is down, and the rest break

- DC 12 WIS for every surviving Bandit. Failures scatter into the dark, dropping what they hold.
- Morale-break line: *"She's leaving us. She's LEAVING us."* — and they run.
- **This also triggers `S2_ESCAPE`.**

#### S2_ESCAPE — Nella loses, and gets away on a fallback she rigged

- **She loses.** The party takes the casks and breaks her crew. Her escape is flight from a
  defeat. She steals nothing this time.
- **The ladder, in order, run honest:**
  1. **Cover the rout:** up to 2 rounds of covering fire for whoever is running.
  2. **The taunt:** one deliberate miss into a post at head height, then a dry voice from the dark:
     ***"Keep the ale."***
  3. **Withdrawal:** over the gully on the rope-crossing, **cutting the ropes behind her.** The party
     detours or spends rounds re-rigging. The cached horse is half a mile out. Skirmisher's Step and
     Prepared Ground keep the gap honest.
  4. **The tally falls (Jeff, 2026-10-07):** in the scramble she drops it — see `S2_TALLY`.
  5. **Last valve:** if truly cornered, the river plunge. She knows the water. If even that can't
     honestly stick, **the table wins** and her arc gets re-planned. Never visibly cheat.
- **Make the preparation visible afterwards.** Whoever reaches the gully sees the cut ropes, the
  stakes driven in days ago, the trampled spot where the cached horse waited. *She planned her exit
  before you ever arrived.*

#### S2_TALLY — She drops her debt tally

- At the gully's lip, where she cut the ropes: **a notched antler stick and a purse of counted,
  sorted coin.**
- **First touch:** the antler is worn smooth where a thumb rests. Hundreds of notches, in groups,
  some scored through. The purse is tied in three places, each section a different coin, counted.
- **Investigation, DC 12:** the notches are payments; the scored-through groups are *years*.
  **DC 16:** the last group isn't finished, and the gap left for it is small. She is close.
- **Don't name the debt.** The party holds something she needs back. That's the whole beat.
- **The coin** in the purse: `<a sum Jeff sets — her savings, enough to matter>`. Whether they
  spend it is a choice with a consequence later.

#### S2_CAMP_INTEL — What the camp gives up: the band's size, Bane's name, the banner

Three discoverables, from Jeff's pick. **Nothing else** — no Marlow coppers, no Jorn.

- **Band scale:** the shed is provisioned for far more than one crew. Thirty bedrolls, rations for
  a month, a rack of matched boots. *This was one finger of a hand.*
- **Bane confirmed:** a duty ledger in a clerk's tidy hand. Rotations, payments, and at the foot of
  each page the same initials and one name in full: **Harrow Bane**. No face, no description. If a
  surviving Bandit is asked, he says the name and goes white.
- **The Marlow aegis-banner** on the shed's pole: old, fine, heraldic, far too good for a bandit
  relay. The party can take it. **It hangs in the Lioness later** and is the prop that unspools the
  feud. Nobody in the camp can say whose it is. Silas can, back home, and goes quiet when he does.
  - Sample, on first look: *"That's not a bandit flag. Bandits don't have flags. That's someone's
    grandfather's flag."*
- **The waystation Common** is hidden here (in the shed, the drover's bedroll, or under the cart
  seat): `<waystation Common — pinned by Jeff 2026-10-07, choose before the table>`.

### Scene 8 — The Man in the Cell

- **Trigger:** the party heads home with the cart.
- **Location:** the road back, then [[Ashford]] at dusk the next day (or by night, if they ride
  straight through).
- **Time:** ~10 minutes.

#### S2_HAUL_HOME — The casks come home on their own cart

- **The cart is theirs** (Jeff, 2026-10-07). It becomes the Lioness's delivery cart.
- **The horses go back to Silas** sound and shod, and the favour is paid.
- **Long rest:** if they rest at the waystation first, the clock resets there. Note it for `/recap`.
- **Sable, at the door, sees the cart.** She doesn't run out. She puts down what she's holding and
  stands very still. *"That's the second time."* (the second deed — banked, and the next Stake tick
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
  He is Tyler's cameo, beat 1, and his backstory has to exist before Session 31.
- **Mara, at the door, before anyone asks:** *"He walked in. Put his blade down on my step. Hasn't
  said a word since. Half the town wants him hanged by Sunday."* A beat. *"I haven't decided
  anything."*
- **End on the cell door.** Don't let them in tonight.

## NPC Quick-Reference

### [[Sable Wren]]

- **Motivation:** open the new wing, which she built, mostly paid for, and can't defend alone.
- **Knows:** the delivery's worth, and that she hasn't finished paying for it · that the raiders are
  not local · that something under the town answers her, and she calls it Asher (she won't say so
  tonight) · nothing about Harrow Bane beyond the name · why the ale is called The Mistake, and she
  isn't telling.
- **Voice:** warm, competent, unhurried. Treats a lord and a drifter the same. Answers the question
  asked, not the one implied, and never explains herself.

### [[Mara Tull]]

- **Motivation:** hold the town together with too few hands, and decide what the party is.
- **Knows:** every raid Ashford has taken and what it cost · the matched boots · that Lord Cael
  answers letters and sends nothing · that the far side of town was hit by someone different ·
  nothing yet about why her prisoner surrendered.
- **Voice:** quiet, weathered, economical. Gives an order once. Grief steeled into grit, never
  spoken.

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

## Contingencies

- **They skip the pursuit and stay to build.** Fine. The cart reaches a fence in Duskwater. The
  casks aren't gone, but recovering them becomes a costlier beat later (buy-back or a riskier lift).
  Sable eats the loss and the Stake ladder starts one deed behind. The waystation Common is still
  there if they go later.
- **The fork rider gets away and the camp is on night alert.** Still winnable. Lean on the heist
  (the camp is watching the road, not the gully side) or a parley. The casks are always there.
- **They corner Nella.** Run the escape ladder honestly down to the river plunge. If even that can't
  stick, the table wins — capture her, and re-plan her arc around the tally and the debt. Never
  cheat visibly. Captured-Nella sample, cold: *"Well. That's a new number."*
- **They want to chase Nella past the gully.** She's mounted and gone. Let them find the cached
  horse's tracks running toward the river and stop at the bank. *"She knows this water. You don't."*
- **They go straight at the feud with the ledger or the banner.** Give the next rung only:
  *someone* is paying Harrow Bane. Stop there. Silas recognises the banner back home and won't say
  more in the street.

## Closing

Land it on the cell door, not on the casks.

> *"The cart's back, the ale's back, and nobody's looking at either. They're looking at a barred
> window, and a man behind it who walked in on his own and hasn't said a word. Mara's at the door
> with her arms folded. Somewhere behind you, Sable is rolling casks into a wing that finally has
> something in it. And someone in the crowd says 'Sunday,' and someone else agrees."*

**Leave unresolved:** who the prisoner is and why he surrendered · Bane's face · whose banner it is
· Nella's tally, which she will want back · whether the Boon ever opens again.

## Engine notes

- **Carryover.** Session 29's Scenes 4–5 run here as Scenes 1–3, with `S1_` ids renumbered to `S2_`.
  `S1_LUCI` already played mid-fight in Session 29. `S1_ANTIDOTE` is dead (Halsby was never bitten).
- **Spotlight.** Halsby's beat is `S2_SPEAR` (a promised delivery, not one of his `spotlight_hooks`
  — none seeded). Iggy's `S2_IGGY` carries his already-seeded viol hook. Odibli gets `S2_ODIBLI`.
  The trend says lean party-centric; the chase and the camp are.
- **Deployment tracking:** none planned from `meta/literary-devices.md` or the design
  preferences. The false trail at the fork is a device candidate if `/recap` wants to log it.
- **For `/recap`:**
  - The 10% Stake, if accepted · the second deed (casks home), banked
  - [[The Shadowless Spear]] delivered — flip its loot file to delivered; Halsby's fade halts
  - The Earshot Crystals handed out
  - Silas's favour debt paid if the horses come back
  - Nella's tally in party hands; Harrow Bane named by the ledger; the aegis-banner taken
  - Chase DCs used → `meta/difficulty.md` Skill Challenge table
  - Rest Clock: reset if they rested at the waystation
  - The prisoner: canonize only what was shown
- **Held for later:** Elowen and Odibli (the Unfinished Binding) · Jorn's foreshadow · the Marlow
  coppers · Asher's Dead Sun phrase for Luci · the battlefield-spirit and coin-forgery spitballs.
- **Before the table:** pick the waystation Common · sketch the waystation · write Tyler's backstory
  enough to know why he surrendered (Session 31 needs it) · set Nella's purse total.
