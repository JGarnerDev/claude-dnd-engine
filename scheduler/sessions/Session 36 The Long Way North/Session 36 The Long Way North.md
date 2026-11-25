---
name: "Session 36 The Long Way North"
type: session
exists: false
state: draft
tags:
  - session/36
  - act/act-1-the-fire-that-eats-the-way
  - mission/a-small-worry-in-cinto
session_number: 36
mission: "[[A Small Worry in Cinto]]"
relates_to:
  - "[[A short quick trip to see some family]] (campaign)"
  - "[[Session 35 The Reeve's Ledger]] (picks up from its cliffhanger)"
  - "[[Shaw Proudfoot]] (his letter sends the party north)"
importance: major
active: true
description: "Ben's first session: Shaw's letter in Mara's office, leaving Ashford, two days downriver and eight at sea on Captain Mallow's ship, Haftimin rising out of the sea ice until a Beam cracks in the north, and Cinto under a Kerning."
act: "[[Act 1 - The Fire That Eats the Way]]"
planned_date: "TBD"
difficulty_attrition: light
difficulty_lethality: standard
depth: narrated
scope: inline
locations:
  - "[[Ashford]]"
  - "[[Cinto]]"
  - "[[The Last Fire]]"
key_npcs:
  - "[[Mara Tull]] (canon: the sheriff who freed Shaw)"
  - "[[Hober Mallow]] (free: the captain who sails them north)"
  - "[[Cal Mooney]] (free: the innkeeper at the Last Fire)"
  - "Hax (walk-on: Mallow's cook)"
  - "Pell Arno (walk-on: a deckhand)"
  - "Gaal Dornick (walk-on: Lord Cael's rider, only if the party waits)"
encounters:
  - "Haftimin, the thing under the sea ice: six tentacles at a time, a 4-round set piece that nobody wins; standard lethality"
loose_threads:
  - "The reeve from Orrend arrives the morning after Shaw walked free"
  - "Odibli's Citadel Clock stands at 1 of 3"
  - "Iggy's Act I item: The Unfinished Catechism"
  - "Shaw may be blacklisted by the Post for robbing its mail"
opening_scene: "About 4 p.m. on Day 3 in Mara Tull's office in Ashford. Shaw has just walked free, and he holds out a sealed letter."
closing_hook: "In Shaw's room at the Last Fire, a letter waits on his pillow: an envelope with nothing inside it but a RETURN TO SENDER stamp."
---

# Session 36 The Long Way North

Mission: [[A Small Worry in Cinto]] | Act: [[Act 1 - The Fire That Eats the Way]] | Campaign: [[A short quick trip to see some family]]

Ben's first session as DM. It picks up the moment [[Session 35 The Reeve's Ledger]] ended and carries the party from Ashford to [[Cinto]], about ten days in-world. The table plays it as five pieces: the letter, leaving town, the voyage, the thing under the ice, and Cinto.

## Combatants

### At a glance

- **The Undertow's deck** (Scene 5, night 6 at sea).
  - **Tentacle** ×6 at a time — [[Haftimin]], the body far below, out of reach · 33 / 33 each
  - Deckhands on the rail: Pell Arno and four more, noncombatants (10 HP each)

### Haftimin — the thing under the sea ice (set piece, ~CR 2 per tentacle, custom)

Haftimin's body never surfaces. The party fights its arms, and it has more arms than they have blades. This fight is built not to be won or lost: it ends at the top of round 4, when a Beam cracks in the north and Haftimin lets go to dive toward the sound.

- **Tentacle:** AC 15 (thick grey hide, barnacled) · **HP 33** · reach 15 ft · it can't leave the rail it rose beside
- STR 20 (+5) · DEX 12 (+1) · CON 16 (+3) · INT 3 · WIS 12 (+1) · CHA 4
- Immune to charmed and frightened. A tentacle has no mind of its own, so mind-affecting spells only work on Haftimin (WIS save +4), and then on all six at once.
- **Lash:** +7 to hit, reach 15 ft, 2d6+4 bludgeoning (avg 11). A Medium or smaller target is grappled (escape DC 15). A tentacle holds one creature at a time.
- **Drag:** at the start of its turn, a tentacle holding someone pulls them 10 ft toward the rail. A creature pulled over the rail goes into the black water: 2d6 cold damage, then held under (restrained, holding its breath) until the tentacle is cut or lets go.
- **Rising again:** a cut tentacle sinks, and at the start of the next round another rises somewhere else on the rail. There are always six.
- **The ship heels (initiative 20, once a round):** Haftimin pulls at the hull. Pick one: the deck tips (DEX save DC 13 or prone) · a wave comes over the rail (STR save DC 13 or pushed 10 ft toward the far rail) · ink boils up and the lantern side is heavily obscured until the next round.
- **Tactics:** the arms go for whatever is moving on the deck, sailors first, and spread out: no more than two on one PC. They never hold a downed PC under. They are trying to get the ship, not to kill one person.
- **Kit (player-facing):** *grey, barnacle-crusted arms as thick as a mast, each ending in a pale suckered paddle.*
- **Label (party-facing):** Tentacle

## Orientation

The party walks out of [[Mara Tull]]'s office into a late afternoon in [[Ashford]]: Day 3, about 4 p.m., `6743-05-22`. Everyone is at full HP after last night's rest at the Golden Lioness, with no fights since. [[Dip]] left at dawn on a pilgrimage of their own and is away for this campaign. [[Shaw Proudfoot]] has just spoken for the first time in two weeks, walked free at Iggy's asking, and is holding a sealed letter. He has to stay away from Ashford for about a month. They carry an earshot crystal each plus the crew's five spares, Bane's ledger in its copper tube, Nella's tally stick, 150 gp, 500 sp and 5 pp, and the five camp horses: Clover, Old Tom, Biscuit, Nettle and Parson. [[Sergei Rubelgerd]], Odibli's big talking dog, and [[Bosco]], Iggy's raccoon, ride along. The mood coming in: a season just ended, a home half-built, and a stranger with a letter.

- **New from Session 35:** Shaw himself. Everything Tyler said at the table stands: he was robbing the mail with Harrow Bane's band when he found a letter with his own name on it.
- **Odibli's Citadel Clock is at 1 of 3.** Roll a hidden d6 for every levelled spell he casts this session (`uv run scripts/roll.py 1d6 --label "Citadel: <spell>"`); a 1 means he was sensed and feels a brief cold (`scheduler/campaign/_citadel-clock.md`).

### Rest Clock across the session

- **Start:** 4 p.m., Day 3. Last long rest overnight Day 2 → 3, about 8 hours ago. No long rest until tonight.
- **Tonight:** a long rest on the riverboat or at Mara's. Either resets the clock.
- **The voyage:** a long rest every night at sea. The fight is on night 6, after a full night's sleep the night before, so the party starts it fresh.
- **End:** dawn, `6743-06-01`, in Cinto, with whatever the fight cost.

## Scenes

### Scene 1 — Mara's office

- **Summary:** the letter that starts the campaign. Shaw reads it aloud, and the party decides whether to leave tonight or in the morning.
- **Where:** [[Ashford]], [[Mara Tull]]'s office: a desk, a lamp lit early, the cells down the corridor, and a window onto the square where the gallows stands unused.
- **Cast:** [[Mara Tull]] · [[Shaw Proudfoot]] · [[Sergei Rubelgerd]] · [[Bosco]]
- **Enemies:** none
- **DCs:** none
- **Time:** ~20 min
- **Trigger:** the session starts.

#### S36_01_RECAP — a short "previously on", and Shaw holds out the letter

- **Tell the table:** last season ended in this room. Give a one-minute recap: the Lioness opened, Dip took the road at dawn, the reeve is on his way for the hanging, and the silent prisoner spoke.
- **Say:**

> *"The cell door stands open behind you. Mara's lamp is lit already, though the sun is still on the square outside, on the gallows nobody is going to use today. The little man in the blazer has said more in the last ten minutes than in two weeks. Now he puts a letter on the desk between you. The seal is broken already, the paper is soft from being carried, and in the corner of the envelope someone has pressed a small closed envelope into the wax."*

- **Plant (post-mark):** the closed-envelope mark on the seal. It comes back on the pillow at the end of the night.

#### S36_02_LETTER — Shaw reads Choco La's letter aloud

- **Handout:** Choco La's letter (the campaign doc, Shaw, Choco La and Hobbes). Give it to Tyler to read aloud, or read it for him.
- **Say (Shaw):** let Tyler read it. If he'd rather not, read it in a voice that isn't Shaw's.
- **When the party asks how he got it:** it's Tyler's story. Shaw found it in a sack of mail when Bane's band robbed a Post courier, with his own name on the front.
- **Say (Mara Tull):** *"The Deorum Sanctum. That's the far north, past the ice. Pilgrims go there and come back quieter, if they come back."*
- **What Mara knows:** only what pilgrims say: the port is called Cinto, ships go from the coast, and the ice there is older than anyone. Nothing about the Buckle, the Post or the Pillars.
- **Plant (hobbes):** the friend in the red knitted hat who "says he'll be back after breakfast." Hobbes comes back in Act 3.

#### S36_03_TONIGHT — go north now, or sleep first?

- **Choice (party):** leave tonight, or sleep and leave in the morning.
  - **Tonight:** a riverboat leaves Ashford's dock at dusk. They sleep on the boat, and the reeve never catches up (`S36_07A_NIGHT_BOAT`). Cost: no goodbyes at the Lioness.
  - **In the morning:** a proper long rest in a bed, and time to say goodbye. Cost: the reeve rides in at dawn, and Lord Cael's rider reaches the dock just as they board (`S36_07B_RIDER`).
- **Say (Mara Tull, if they hesitate):** *"The reeve rides in at dawn. I'd rather explain an empty cell than an empty dock."*
- **Transition:** whichever they choose, the horses come up next.

### Scene 2 — Leaving Ashford

- **Summary:** what to bring and who to thank. The horses can't go to sea, Mara says goodbye, and the party either slips away or talks their way past Cael's rider.
- **Where:** [[Ashford]]'s river dock: a riverboat loading crates, lanterns on the water, the Lioness's new roof just visible upstream.
- **Cast:** [[Mara Tull]] · Corwen Hale, the riverboat master · Clover, Old Tom, Biscuit, Nettle and Parson · Gaal Dornick (only if they waited)
- **Enemies:** none
- **DCs:** Persuasion 13 — talk Gaal Dornick down with Mara's name behind it · Persuasion 16 — without it · Animal Handling 12 — get Old Tom onto a boat
- **Time:** ~20 min
- **Trigger:** the party heads for the dock.

#### S36_04_HORSES — five horses can't go to sea

- **Introduce:** Corwen Hale, the riverboat master
  - **Look:** a heavy, sunburnt woman with a pole over her shoulder and rope burns on both palms.
  - **Sound:** short sentences, every one a price.
  - **Impression:** she'll take anyone who pays, and argue about the horses.
- **Say (Corwen Hale):** *"People, yes. A dog, fine. Five horses, no. Not on my deck, and not on any ship at the coast either."*
- **Old Tom, who decided in Session 35 that the party is a prophecy,** plants his hooves at the top of the ramp and won't be led away from them.
- **Old Tom aboard:** Animal Handling DC 12, or Odibli asks him with Speak with Animals (a levelled cast: roll the Citadel d6).

#### S36_05_HORSE_CHOICE — what happens to the horses

- **Choice (party):** the five camp horses.
  - **Leave them with Mara:** free, and Mara is glad to have them. Cost: Mara now considers the debt for Shaw paid in full.
  - **Sell them at the coast:** about 60 gp for the five. Cost: Old Tom goes too, and Odibli has to tell him.
  - **Pay to bring them:** 5 gp a horse on the riverboat, then 20 gp a horse on Mallow's ship. Cost: about 125 gp, and horses on an ice voyage.
- **Whatever they choose, Old Tom can come** if someone pays his own passage: Corwen Hale shrugs at one horse.

#### S36_06_MARA — Mara's goodbye

- **Say (Mara Tull, to Iggy):** *"You asked, and I listened. Don't make me sorry. Bring him back in a month and I'll buy you both a drink."*
- **Say (Mara Tull, to Shaw):** *"A month. Not a day sooner. If I see you before then, I didn't."*
- **Payoff of a past choice:** Iggy asked Mara to spare Shaw in Session 35. This is the town remembering it.

#### S36_07A_NIGHT_BOAT — if they leave tonight

- **When:** the party chose to leave tonight.
- **Say:**

> *"The riverboat pushes off as the last light goes off the water. Ashford's lamps slide past one by one: the dock, the Lioness with its new roof, the square with the gallows. Then nothing but reeds and the slap of the pole."*

- **The reeve:** arrives at dawn, finds an empty cell and a sheriff who shrugs. The party never sees him.

#### S36_07B_RIDER — if they waited for morning

- **When:** the party chose to sleep first.
- **Introduce:** Gaal Dornick, Lord Cael's rider
  - **Look:** a young man in a blue Cael tabard, mud to the knee, a sealed warrant in one fist.
  - **Sound:** polite, out of breath, reading half of it off the paper.
  - **Impression:** he'd rather not do this.
- **Say (Gaal Dornick):** *"By order of the reeve of Orrend, for the halfling deserter who rode with Harrow Bane. I'm to bring him back to hang."*
- **Persuasion DC 13 with Mara's name behind it, DC 16 without:** he goes back and tells the reeve the boat had already left.
- **If it fails:** he insists on the warrant. Offering Bane's ledger satisfies him at once, but that ledger belongs to Redwater's story; if the table reaches for it, let them, and note it for Jeff. Otherwise he gives up when the boat pushes off, because he can't swim.

### Scene 3 — Downriver

- **Summary:** two days of travel that let the party breathe, meet each other again without Dip, and see one ghost of last season.
- **Where:** the river below [[Ashford]]: reed banks, mudflats, villages on stilts, and the riverboat's one cabin, which smells of onions.
- **Cast:** Corwen Hale · Old Tom (if he came)
- **Enemies:** none
- **DCs:** Perception 14 — spot the hood on the barge
- **Time:** ~15 min
- **Trigger:** the boat leaves Ashford.

#### S36_08_RIVER — two days downriver, and one glimpse of Nella

- **Time passes:** the first night on the river, a long rest in the cabin, then two days of reeds and mudflats. The river widens, and on the second evening they smell salt.
- **Ask the table:** one thing each character does to pass the time on the boat. Let it be small.
- **Perception DC 14 (whoever is watching the water):** a barge passes going the other way, and someone in its stern wears a dark hood exactly like the one Nella hung on the bush. By the time anyone looks twice, the barge is round the bend. She's Redwater's: let her go.
- **Transition:** the coast, and a ship.

### Scene 4 — Captain Mallow's ship

- **Summary:** the long sea leg. Mallow links the party to Choco La, her crew teaches them a song they'll need in the maze, and the sailors' talk plants the Pillars.
- **Where:** a three-masted trader at a stone quay on the coast, then the open sea going north: grey water, then the first floating ice, then nights that barely get dark.
- **Cast:** [[Hober Mallow]] · Hax · Pell Arno · the crew
- **Enemies:** none
- **DCs:** Insight 13 — Mallow admits the shanty's verses are swapped
- **Time:** ~30 min
- **Trigger:** the riverboat reaches the coast.

#### S36_09_MALLOW — "Your brother paid for two."

- **Introduce:** [[Hober Mallow]], captain
  - **Look:** a broad triton in a salt-stiff coat, gill-slits at her throat, a brass spyglass on a cord.
  - **Sound:** gravelly, slow, and she measures everything in tides.
  - **Impression:** proud of her ship and sure of her sea.
- **Say (Hober Mallow, to Shaw):** *"Shaw. You've his chin. Your brother sailed with me in the spring, a monk, and a little scholar with him in a red hat who never stopped talking. Your brother paid for two. Said you'd be along."*
- **Shaw's passage is paid.** Everyone else pays 10 gp each to Cinto, or works it off.
- **Payoff (hobbes):** the friend in the red hat, seen with Choco La.

#### S36_10_SHANTY — the crew teaches "The River Daughter"

- **Say:**

> *"Chorus, everyone:*
> *Haul away, haul away, down where the cold winds blow,*
> *Haul away for the River Daughter, sleeping under the snow!"*

- **The full shanty** is in the campaign doc (Part 3, the dam and the wheel). The crew sings the verses in the wrong order, slept before wept, and stops before the ending.
- **Insight DC 13 on Mallow:** she admits they swapped two verses "for the tune."
- **Plant (river-daughter):** the shanty's order. It pays off in the maze's Dam Room.

#### S36_11_BOSCO — Bosco and Hax go to war

- **Introduce:** Hax, the ship's cook
  - **Look:** a lean old man in a stained apron, sleeves rolled, a cleaver he never puts down.
  - **Sound:** a low growl that runs on, mostly about his galley.
  - **Impression:** proud of his kitchen, and something about the way he watches the crew says he notices more than soup.
- **Say (Hax, holding up a half-eaten biscuit tin):** *"Somebody's been in my galley. Somebody small, with hands. When I find him, he's stew."*
- **Bosco, holding grudges like treasure,** decides Hax is his enemy for the rest of the voyage. Let Jeff run the war. If anyone makes peace between them, Hax slips that character an extra ration every night after.

#### S36_12_BEAMS — the bright nights, and the Beams groaning

- **Time passes:** five days at sea. The water goes from grey to black, ice floats by in plates, and around the twenty-fifth of the month the nights stop getting dark at all.
- **Introduce:** Pell Arno, deckhand
  - **Look:** a gangly boy of sixteen with a knitted cap pulled over his ears and a fishhook through his eyebrow.
  - **Sound:** fast and cheerful, and he asks questions without waiting for answers.
  - **Impression:** the kind of boy who goes too near the rail.
- **Say (Pell Arno, on night watch):** *"Hear that? Down in the hull, when it's still. The old hands say it's the Beams groaning. The things that hold the world up. Something's chewing on them, they say."*
- **Plant (beams):** the Pillars rumour. It pays off at the end of the fight.
- **What the crew says if pressed:** nobody agrees who is doing the chewing. Hax tells Pell to stop scaring the passengers.

### Scene 5 — The thing under the ice

- **Summary:** a set piece fight the party can't win or lose: Haftimin attacks the ship, and lets go when a Beam cracks in the north. It shows how strange the north is, and plants the Pillars for real.
- **Where:** the main deck at night under a sky that won't get dark: wet planks, lanterns swinging, sea ice grinding along the hull on both sides.
- **The deck:** 60 ft long, 20 ft wide, a mast in the middle, the galley hatch aft, the rail on both sides. The sea beside the ship is black water between floes.
- **Cast:** [[Hober Mallow]] · Hax · Pell Arno · four deckhands
- **Enemies:** Tentacle (Haftimin) ×6
- **DCs:** escape DC 15 — break a tentacle's grapple · DEX 13 save — the deck tips · STR 13 save — the wave
- **Tactics:** the arms grab whatever is moving, sailors first, and spread out, no more than two on one PC. They never hold a downed PC under. Cut ones rise again next round.
- **Time:** ~40 min
- **Trigger:** night 6 at sea.

#### S36_13_LIGHTS — lights under the sea ice

- **Time passes:** the sixth night at sea, after a full night's rest the night before. A long, pale dusk that never turns to dark.
- **Say:**

> *"There's light under the ice. Pale green, a long way down, moving slowly from floe to floe like a lantern carried under the sea. The sailors on watch have gone quiet. Mallow comes up from below, spyglass in hand, and doesn't put it to her eye."*

- **Say (Hober Mallow):** *"Lanterns out. Everyone off the rail."*
- **The rumour pays off:** the lights under the sea ice, which Mallow's crew talks about in Cinto.

#### S36_14_TENTACLES — Haftimin rises

- **Combat starts:** the first arms come over the rail.
- **Tokens:** the ship deck map ("Mallow's Ship (Roll20).png"; T marks on the DM sheet show where the arms rise). The party where they stand when the lights appear; Mallow at the wheel aft; Hax at the galley hatch; Pell Arno and two deckhands on the port rail, two more starboard. Six Tentacle tokens on the rails, three each side.
- **Say:**

> *"The ship stops dead, as if it hit a reef. Then the port rail splinters, and something comes over it: an arm as thick as the mast, grey and crusted with barnacles, ending in a pale paddle covered in suckers. Then another on the starboard side. Then four more. A sailor screams a name, and the whole crew picks it up: Haftimin."*

- **Roll initiative.** The ship heels on initiative 20 every round (see Combatants).
- **Say (Hax, cleaver up):** *"Mind the galley!"*

#### S36_15_DRAGGED — Pell Arno and the rail

- **When:** round 2.
- **A tentacle has Pell Arno** and drags him 10 ft toward the starboard rail. Next turn he goes over.
- **Choice (Iggy):** step in front of the boy, or hold the line where he is.
  - **Step in front:** Iggy reaches him, takes a Lash meant for Pell (11 bludgeoning), and is grappled in his place. Pell is free.
  - **Hold the line:** someone else has to cut the arm in time (33 HP), or Pell goes over the rail into the black water.
- **This faces Iggy's PC arc:** the man who stands in front and never steps back.

#### S36_16_BEAM_CRACK — the Beam cracks, and Haftimin lets go

- **When:** the top of round 4.
- **Say:**

> *"Far to the north, past the edge of the sky, something cracks. You feel it before you hear it, a deep jolt through the hull and up your legs, like a beam giving way in a house. The light under the ice flares white. Every arm on the ship goes still at once. Then they let go, all of them, and slide back over the rail, and the light goes north, fast, toward the sound."*

- **Combat ends.** Anyone held under comes up gasping as the arm lets go.
- **Say (Pell Arno, if he's alive and on deck):** *"That was a Beam. I told you. I told you."*
- **Say (Hober Mallow):** *"Nobody says that name again aboard my ship."*
- **Payoff (beams):** the Pillars are real.

### Scene 6 — Cinto at the Kerning

- **Summary:** arrival. The party sees the pilgrim port for the first time, and the Kerning shows them that this world has dangers they don't know yet.
- **Where:** [[Cinto]]'s harbour at dawn: three piers, the quay, the WELCOME, PILGRIMS banner over the pilgrim road, the wall of blue ice behind the town.
- **Cast:** [[Hober Mallow]] · dockhands · pilgrims
- **Enemies:** none
- **DCs:** none
- **Time:** ~15 min
- **Trigger:** two more days at sea after the fight.

#### S36_17_HARBOUR — Cinto out of the fog

- **Time passes:** two more days. The morning of `6743-06-01`, and the ship comes in through fog.
- **Say:**

> *"The ship's horn sounds three times as Cinto rises out of the fog: a jumble of rooftops, temple domes and smoking chimneys crammed against a wall of blue ice that climbs higher than the clouds. The docks ring with bells, bargaining and a dozen languages. A banner over the harbour reads WELCOME, PILGRIMS, and underneath, in smaller letters, ALL SECRETS APPRAISED."*

- **Map:** "Cinto - The Harbour (Roll20).png" for the quay (5 ft a square); the whole town is "Cinto - The Town and Port".

#### S36_18_KERNING — the whistle

- **When:** the party steps onto the quay.
- **Say:**

> *"A sound starts over the harbour, high and thin, like wind across the mouth of a bottle, getting louder. Every head on the quay turns up at once. Then everyone in Cinto is moving: dockhands drop crates, a woman scoops a child off the cobbles, doors bang all along the waterfront. In ten heartbeats the quay is empty except for you."*

- **This is a Kerning:** the whistle that sounds moments before Whatwill glass lands. Everyone in Cinto knows to get indoors. The party doesn't, yet.
- **Decide now whether it's a major landing** (`scheduler/campaign/_sky-clock.md`):
  - **Minor:** a scatter of pale, glowing glass shards rings off the roofs and the water. Anyone still in the open takes 1d4 piercing. Glass in the harbour hisses.
  - **Major:** a great piece lands out in the harbour or on the ice, and by noon the whole town is talking about who will claim it. That's a hook for later, and it ends Crawl 5.
- **Say (Cal Mooney, leaning out of the Last Fire's door, waving them in):** *"Inside! Come on, inside, you'll lose an eye!"*
- **Transition:** into the Last Fire.

### Scene 7 — The Last Fire

- **Summary:** Cinto meets the party, and the party meets the small worries that lead into the Sanctum. Iggy gets his Act I item, and Shaw gets a warning from the Post.
- **Where:** [[The Last Fire]], Cinto: a long common room around a stone hearth big enough to stand in, benches, a stew pot hanging over the fire, a front door that sticks.
- **Cast:** [[Cal Mooney]] · pilgrims · sailors from Mallow's crew
- **Enemies:** none
- **DCs:** none
- **Time:** ~40 min
- **Trigger:** the Kerning drives them indoors.
- **Map:** "Cinto - Town Buildings Grid".

#### S36_19_CAL — "Choco La's Shaw!"

- **Introduce:** [[Cal Mooney]], innkeeper of the Last Fire
  - **Look:** a huge bugbear in a flour-dusted apron, arms already open.
  - **Sound:** a big booming laugh, warm all the way through.
  - **Impression:** he hugs first and asks later.
- **Say (Cal Mooney, to Shaw):** *"Choco La's Shaw! He said you'd come!"* He hugs Shaw off the floor, then produces a slate: *"He left a tab. Three gold, four silver. Said family would settle up."*
- **Say (Cal Mooney, to Iggy):** *"And you. The viol player who got Ashford through a bad night. I kept you a stool."* The stool by the fire has a sign: RESERVED FOR THE VIOL PLAYER.

#### S36_20_WORD — word got here first

- **Pick two or three** from the campaign doc's "Word got here first" and "Shaw: Choco La got here first" sections, by who's at the table. A good pair: a sailor from Mallow's crew steering well clear of Luci near the lamps, and a pilgrim humming one of Iggy's songs wrong.
- **Choice (Shaw), if it comes up:** settle Choco La's tab (3 gp 4 sp), or leave it for his brother.

#### S36_21_CATECHISM — Iggy plays, and Cal hands him a prayer book

- **When:** Iggy plays at the Last Fire.
- **Say (Cal Mooney):** *"A pilgrim left this behind last spring. Didn't come back for it."* He sets a small bound book on the bar: blank pages, a good clasp, a heading on the first page and nothing under it. *"Somebody who knew what they believed would've filled it. Maybe you will."*
- **Loot (copy to the party):**

```text
The Unfinished Catechism (a blank prayer book, uncommon, no attunement)
```

- **The rules** are in `meta/loot-options/Iggy/misc/The Unfinished Catechism.md`: three tenets Jeff writes in play, and advantage once per long rest on a check that acts on one. Hand Jeff the item card.

#### S36_22_WORRY — whose worry first

- **Say (Cal Mooney, quieter, after the room thins out):** *"Can I ask you something? The Matron, at the Buckle. She writes me every month, regular as tides. I haven't had a letter in months."*
- **Choice (party):** whose worry to take up first. Each points into the Sanctum (the campaign doc, Opening hooks).
  - **Cal's:** no letters from the Matron. Leads to the Buckle inn.
  - **Mallow's:** the pilgrims she ferried north haven't come back, and there's talk of a monster on the passage. Leads to the Yule Log.
  - **Another regular's:** Bayta's spices, Jerichau's candles, Preem's seeds. Whoever the party talks to first.
- **There's no wrong pick:** every hook goes through the Sanctum and the Buckle.

#### S36_23_PILLOW — RETURN TO SENDER

- **When:** Shaw goes up to his room.
- **Private (Shaw):** what's on his pillow.
  - **The message:** On your pillow there's an envelope with your name on it. Inside there's nothing at all, only a stamp across the paper in red: RETURN TO SENDER. The seal on the back is a small closed envelope pressed into the wax, the same as the one on your brother's letter.
- **Payoff (post-mark):** the closed-envelope mark on Choco La's letter.
- **What it means (DM-only):** the Post knows who robbed its mail. Shaw is "under review" (the campaign doc, Shaw and the Post). Don't explain it. End the session on it.

## NPC Quick-Reference

### [[Mara Tull]]

- **Motivation:** be rid of a problem she likes, before the reeve makes it worse.
- **Knows:** that pilgrims go north from the coast to a port called Cinto; that the reeve rides in at dawn.
- **Voice:** dry, tired and fair; she says the hard thing first.

### [[Hober Mallow]]

- **Motivation:** get her ship and her passengers to Cinto in one piece.
- **Knows:** Choco La and Hobbes sailed with her in the spring; the lights under the ice; Haftimin's name, which she won't say twice.
- **Voice:** salty and gravelly, measures everything in tides. "The sea always tells you something. You just have to listen."

### [[Cal Mooney]]

- **Motivation:** feed everyone, and find out why the Matron stopped writing.
- **Knows:** Choco La came through and talked about Shaw the whole time; the Matron always writes; Iggy's songs from Ashford.
- **Voice:** big, booming, endlessly warm. "Sit down, you look frozen. Soup's on me."

### Hax (Mallow's cook)

- **Motivation:** keep his galley his.
- **Knows:** every man aboard, and more than he says.
- **Voice:** a low growl that runs on about his kitchen.

### Pell Arno (deckhand)

- **Motivation:** see something worth telling.
- **Knows:** the old hands' stories about the Beams.
- **Voice:** fast and cheerful, asks questions without waiting for answers.

### Corwen Hale (riverboat master) and Gaal Dornick (Cael's rider)

- **Corwen Hale:** short sentences, every one a price.
- **Gaal Dornick:** polite and out of breath; he'd rather not hang anyone.

## Contingencies

- **They fight the rider (`S36_07B_RIDER`):** Gaal Dornick is a guard with a warrant, not a soldier. He yields on the first hit, and the reeve now has a reason to send more than one rider later. Let it stand as a consequence.
- **They try to kill Haftimin:** they can't. Its body is far below, and cut arms rise again. If someone dives in after it, the cold (2d6 a round) and the dark send them back. The Beam crack at round 4 ends it whatever they do.
- **They stay out in the Kerning:** a minor landing does 1d4 to anyone in the open; a major one, if you choose it, is a spectacle, not a death trap. Nobody dies to the sky in the first session.
- **Tyler is late:** Shaw can arrive at Mara's door holding the letter. Start on the recap and the horses, then let him walk in.

## Closing

- **Land it with the pillow.** Send Tyler the private message, then say nothing else. Let the table ask.
- **Leave unresolved:** what the Beam crack was, who sent the empty letter, and whose worry they'll follow in the morning.
- **One thing answered first:** Choco La really was here, and Cal knew him.

## Approaching Entities

- **[[Kissoon]], [[Ebling Mis]], [[Bayta Darell]]:** likely key next session in Cinto. Their files are full; no elaboration needed.

## Engine notes

- **Choices:** `S36_03_TONIGHT` (party), `S36_05_HORSE_CHOICE` (party), `S36_15_DRAGGED` (Iggy), `S36_22_WORRY` (party), plus `S36_20_WORD`'s tab (Shaw, small).
- **Pays off a past choice:** `S36_06_MARA`, Iggy asking Mara to spare Shaw in Session 35.
- **Spotlight:** Iggy, the overdue PC: the stool, the Catechism, the rail. Shaw's letter hook is seeded.
- **Plants:** `post-mark` (paid at the pillow), `hobbes` (paid at Mallow; kept for Act 3 as well), `river-daughter` (kept for the maze), `beams` (paid at the crack).
- **Difficulty:** light attrition, standard lethality. One fight, fixed at 4 rounds. Six tentacles at 33 HP each are 198 HP on the board at a time, against a party that clears about 85 a round, so expect two or three arms cut in round 1; they rise again, so the fight's length doesn't depend on the party's damage. Lash averages 11, and no more than two arms on one PC: the worst round on one PC is about 22, a scare for Odibli and nothing worse for the rest. The ship heeling is the real hazard: prone near a rail is how people get dragged over.
- **New this session:** [[Haftimin]] (data/creatures), Hax, Pell Arno, Corwen Hale and Gaal Dornick (walk-ons, no files), the ship's deck map: "Mallow's Ship - Deck and Below" (Roll20: a 26 × 17-unit page), and "Cinto - Harbour Close-up" for the landing (a 40 × 30-unit page).
- **For /recap:** the horses' fate, the tab, whether Pell lived, the Kerning's size, Odibli's casts and Citadel rolls, the worry the party chose.
