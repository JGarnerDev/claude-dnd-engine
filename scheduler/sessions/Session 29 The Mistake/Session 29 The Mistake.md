---
# --- MANDATORY ---
name: "Session 29 The Mistake"
campaign: homebrew
type: session
session_number: 29
exists: false
state: draft
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
encounters:
  - "The New Wing — 5x Bandit (CR 1/8) + 1x the big one (reskinned Thug, CR 1/2). ~450 adjusted XP, 3-5 rounds. Tension is a timer and an objective, not attrition: two bandits haul the last cask toward a cart while the big one shakes Sable down, and the party cannot cover both ends. Tactics: keep the raiders on their jobs — all six converging on the party is RTD 1 and silently becomes Dangerous. Morale DC 12 WIS when the big one drops."
loose_threads:
  - "Three seeds owed to [[Davian Martikov]] — two from [[Baba Lysaga]], one from the druids of [[Yester Hill]]. Barovia-side; acknowledged in one line, not pursued"
  - "[[The Wanderer's Boon]] is inert in Odibli's hand and must be shown to be inert this session"
  - "Luci's energy storm feature (Session 28 new_entity) — name and mechanics still unrecorded"
  - "[[Halsby]] has race and background TBD, and no in-fiction reason to be in Ashford yet"
difficulty_attrition: light
difficulty_lethality: standard
depth: narrated
scope: inline
opening_scene: "The last thirty seconds of Session 28, replayed — hand-in-hand at the winery, Odibli's hand on the stone, the light climbing past blinding. Held inside the transit long enough for the relic to give them the long rest in fiction, then dropped into a yard where a man is running past them carrying a cask."
closing_hook: "The stake is real and the hearth is warm, and then Odibli takes the stone out again and it does nothing at all — warm as a pocketed pebble, dead as if it never worked. Somewhere southeast a cart with the Lioness's ale on it is making poor time on a bad road."
relates_to:
  - "[[The Stolen Casks]] (the mission this opens)"
  - "[[Act 1 - The Hearth at Ashford]] (act)"
  - "[[Redwater]] (campaign)"
  - "[[Session 28 The Wereravens' Gift]] (replayed in the cold open)"
  - "[[The Wanderer's Boon]] (brought them here; stays inert)"
  - "[[Aashal-Groon Mellenegon Borak]] (Asher — Sable's patron, named but not met)"
importance: critical
active: true
description: "The first homebrew session. The party arrives mid-raid beside the Golden Lioness, saves Sable Wren or the last cask but not both, and is offered a provisional share in the one building in Ashford worth defending. Named for Sable's bestselling ale, which she has never explained."
---

Campaign: [[Redwater]] | Act: [[Act 1 - The Hearth at Ashford]] | Mission: [[The Stolen Casks]]

**Shape:** balanced · **Length:** standard (~2 hr, 5 scenes) · **Attrition:** light · **Lethality:** standard

## Orientation

Five PCs at level 4, two of them dormantly afflicted, one brand new to the group. They have
not long-rested since Session 24 in fiction — but **the transit is the rest**, so they arrive
whole. Coming out of Session 28 the mood is curiosity rather than dread: nobody cursed them,
[[Davian Martikov]] gave them a gift, and the last thing they heard was a promise that this
place would make them stronger. They own no money, no standing, and one relic that has
stopped working.

- **[[Halsby]] joins here.** Kellan needs race and background before Tuesday; Halsby's
  `level_confirmed` stamps at this session's `/recap`, which clears the LEVEL STALE flag.
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

### Scene 1 — The Last Thirty Seconds

- **Trigger:** session open, before any description of Ashford.
- **Location:** [[Wizard of Wines]] — the winery grounds in Barovia, replayed.
- **NPCs present:** none. This is the party and the relic.

**Beats:**

- Replay the exact beat Kellan cut on: hand-in-hand, Odibli's hand on the stone, light rising
  past blinding.
- Then **hold them inside the transit**, because that is where the rest happens — and the
  relic is what says so, not the DM. Full HP, all slots, hit dice back.
- Afflictions go dormant *here*, and the dormancy is felt. That is the beat that sells the new
  world as different from Barovia.
- **Device — in medias res** (`Scale: session`, `Last used: —`). The light does not fade into
  a quiet field. It fades into shouting.

> *"The light does not hurt. That is the first wrong thing. It climbs past what your eyes
> should bear and keeps climbing, and somewhere in it the ache in your shoulder stops being an
> ache. Luci — you have not breathed properly since the blights. You are breathing properly.
> Dip, the whispers go quiet, all the way quiet, for the first time since the village. And
> underneath all of it, not a voice exactly, more the shape a voice leaves: **somewhere you can
> gather strength. And then return, strengthened.**"*

- **Say it in fiction, never as a rules announcement.** The players should work out that they
  are rested because the fiction told them, not because you said "take a long rest."
- **Transition:** the light drops and there is a man-shaped shadow going past them at a run,
  carrying a cask.

### Scene 2 — Somewhere You Can Gather Strength

- **Trigger:** immediate, same breath as Scene 1.
- **Location:** the yard outside [[The Golden Lioness]]'s new wing — bare dirt, staged cargo, a
  cart at the far edge, a half-built wing with its doors open and noise coming out.
- **NPCs present:** none yet; the raiders are scenery for one beat, then initiative.

This replaces the struck Descent. One beat, one roll each, straight into initiative — it does
the same mechanical job the Descent did in a third of the time. **The Grab lever is gone:**
nothing and nobody crossed with them, and there is no hag to escape.

**Beats** — each PC picks one stance, one roll, DC 12:

- **Steady** (CON / Athletics / Acrobatics) — land square. Success: normal start. Failure: one
  round of arriving badly, clears immediately after.
- **Read** (WIS / INT / Perception) — take in the yard mid-arrival. Success: initiative edge,
  or one raider caught flat-footed. Failure: nothing — you were busy not falling over.

Scatter on the fail spread, exactly as the statblock expects: some PCs start in the yard near
the cask-runners, some near the wing's doorway where Sable is. **That split is a positioning
puzzle, not a penalty.**

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
    does not explain herself. **She must not read as helpless** — she is outnumbered and holding
    a doorway.
  - **The big one** — nameless on purpose. Scarred, missing teeth, wearing a townsman's stolen
    coat. Give him a look, never a name.

**Roster (unchanged — do not retune):** 5 × Bandit (CR 1/8, HP 11, AC 12, scimitar +3 for 4,
light crossbow +3 for 5) + the big one (reskinned Thug, CR 1/2, HP 32, AC 11, Pack Tactics,
multiattack, mace +4 for 5). Raw 225 XP, ×2 group multiplier → **~450 adjusted**.

**Beats — the tension is a timer and an objective, not attrition:**

- Two bandits haul the last full cask toward the cart at ~15 ft per turn. It reaches the cart,
  it is **gone** — a clean loss that feeds Session 2.
- The big one is working Sable over at the bar. Ignored about two rounds, he drags her out as
  leverage.
- The remaining three screen the runners.
- **The party cannot cover both ends.** That is the scene — chase the cask or save Sable.
- Break the big one (killed, frightened, or talked down) → surviving bandits make **DC 12 WIS**;
  failures flee and drop what they carry.
- **Non-combat outs all live:** parley · trickery (pose as Marlow's people — they will believe
  it, they *are* paid by Marlow) · or leaning on the fact that five strangers just materialised
  out of a pillar of light. Any of these can trigger the morale check early or grant advantage.

> *"The big one has a fist in the front of her coat and she is still talking to him in the voice
> you use for a customer who has had too much. 'You'll want to think about who owns the thing
> you're standing in,' she says. He hits the bar beside her head and the whole bare room rings
> like it's still empty — because it is. Then he sees you. All five of you, standing in a yard
> where a second ago there was nothing but light."*

**Lethality note — the one number that matters.** All six attackers focused on one PC is ~30
damage a round against ~30 average HP: **RTD 1, which is Dangerous — a tier above the pick.**
The objective split is what holds it at Standard: with two bandits on the cask and the big one
on Sable, effective pressure is ~12 a round, **RTD ~2.5**. If you let them all converge on the
party you have silently changed tiers. **Keep them on their jobs.**

Max plausible spike is the big one's multiattack at 16, which cannot instant-kill anyone,
Odibli included. So the table can run its Odibli-goes-down gag with no real risk of it going
wrong — and on current table notes, it will.

**Fail-forward, not death:** botched, the big one hauls Sable off and more stock walks. Deeper
setback, rescue hook, higher base-building stakes. **No PC death in the premiere.**

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

**Beats:**

- The town was hit in **two** places. [[Wick]]'s crew took the far side and left — seed him as a
  *described* stranger, never seen. Guild-marked, and wrong somehow.
- Thread seeds, planted light and never lectured: **[[Nella]]** gets a face and a direction
  (southeast, laden cart, deep ruts) · **[[Harrow Bane]]** gets a name the town fears and no
  face · the feud gets **exactly one detail** — matched boots on dead "independent" bandits —
  and nothing more.
- Mara is honest about the arithmetic: [[Lord Corren Cael]] writes letters, and she has too few
  hands.
- Silas can be the one who mentions, in passing, what the stolen delivery was worth — and that
  Sable had not finished paying for it.
- *If the party pushes hard on the boots →* give the next rung only: someone is paying these
  men. Stop there.

**Do not front-load the feud.** It is a reward for curiosity across the whole act. One boot
detail is the entire budget for tonight.

- **Transition:** someone points them at the Lioness's old core, where the hearth is lit.

### Scene 5 — The Mistake

- **Trigger:** the party goes inside, or Sable comes to find them.
- **Location:** [[The Golden Lioness]], old core — warm, characterful, hearth always lit,
  reputedly the safest building in town. **The contrast with the bare wing next door is the
  whole pitch.**
- **NPCs present:** [[Sable Wren]], now on her own ground and not cornered.

**Beats:**

- She is running the place **entirely alone.** Her crew ([[Lok Thuliaga]], [[Bree Tealeaf]])
  has not arrived. The new wing is built, undefended, and was supposed to open.
- **The offer, and it is not charity** — a provisional share that grows: **10% now**, on
  tonight's deed. Earns to 25% and 40% by deeds, not coin. One favor per town-help beat.
  Construction runs **250–500 gp a room.** Have these numbers on a card so the offer lands
  concrete instead of vague.
- **Odibli's beat, and it is free.** Session 28's table notes record that his plan to conquer
  Vallaki through the power of good wine got real buy-in from the whole table. He has just been
  offered a stake in a brewery. Hand it to Miguel directly — **do not explain the joke**, just
  let Sable ask whether any of them knows anything about drink.
- **Iggy's beat — spotlight.** He is overdue at 2 rotation turns against everyone else's 4. A
  hearth, a rescued room, a town that needs cheering: he plays. Seeds his open hook *"decode the
  unfinished final song trapped in the viol"* — in a world that is neither Barovia nor Threnai,
  the unfinished part sits differently. One or two lines, **no resolution.**
- **The Barovia debt, one line.** Odibli still has [[The Wanderer's Boon]]. It is warm, it is
  inert, it does nothing. Without this line the season reads as a detour instead of the errand
  the relic sent them on.

> *"She pulls five mugs without asking and sets them down. 'That's The Mistake,' she says. 'It's
> the one people come back for.' Nobody has ever got her to say why it's called that. Behind her
> the hearth is doing what it has apparently always done, which is burn without anyone feeding
> it, and through the wall you can hear the new wing being very, very empty."*

- **Transition:** into the closing hook.

## Rewards

**Gold:** ~120–180 gp party total — the remnant's pocket coin, the big one's purse, salvage from
the wing. Standard session band per `meta/rewards.md` (100–250), about 25–35 gp a head.

**Item — one, Common, for Dip. Which one is still the DM's call** (`meta/loot-options/Dip/`).
Decided 2026-10-04 in `questionnaires/redwater/act-1-loot.md`, question 8: the session's item
goes to Dip, because Ben is the player who pushed on levelling, and the DM's own PC should not
be paid first. Iggy keeps his spotlight beat in scene 5. Only the item moves to later in the
act. The item is drawn from the Commons in `meta/loot-options/Dip/`. None of them is named
here until the DM confirms one there (`status: confirmed`), because every item in that folder
is a draft idea until then.

Handing it over follows the act's loot rules (see the act file's `## Loot`): a surprise, never
picked off a menu in front of the player, and with a history of at most three sentences
attached. Where it is found (question 19) is still open.

**Narrative rewards** — all recordable as frontmatter, per the file's own test:

- The **10% Stake** — a deed, written onto [[The Golden Lioness]]
- [[Sable Wren]]'s `disposition` and `affinity` toward the party
- Standing with Ashford — [[Mara Tull]] and [[Silas Crubb]] both shift on how the raid was handled

**Levelling: nobody levels tonight.** For this season, levels come **one PC at a time**, at a
moment the DM judges climactic, with the whole party at 5 before the December finale fight (act
`## Loot`). Ben pushed on levelling in Session 28. Say at the table that levels are coming, and
hand Dip his item in the same breath. Whether to name each PC's trigger ahead of time is an open
question (question 22, and see the act file).

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
- **They go straight at the feud.** Give the next rung — someone is paying these men — and stop.
  Harrow Bane's name comes from the town, not from a corpse. The leash is discoverable across
  the act, never handed over in session one.
- **Halsby has no reason to be there.** The one genuine structural gap: four PCs arrive by relic
  and the fifth is already in Ashford. Easiest answer is that he was in the old core when the
  wing was hit — a Sharran shadow-sorcerer passing through a border town is self-explaining, and
  it puts him in the fight from round one. **Clear with Kellan before Tuesday.**

## Closing

Land it on the relic, not the fight.

> *"The stake is real. The hearth is warm. And at some point in the evening Odibli takes the
> stone out again — because of course he does — and it sits in his palm doing nothing at all.
> Warm, like it's been in a pocket. Dead, like it never worked. Somewhere southeast of here a
> cart with your ale on it is making poor time on a bad road. Somebody owes somebody three
> seeds, and it isn't tonight's problem."*

**Leave unresolved:** the cart's destination · who Wick is · the name Harrow Bane · why Ashford
really bleeds · whether the Boon ever opens again.

## Engine notes

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
