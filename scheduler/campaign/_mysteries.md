# Mystery Answers (as of: Session 34)

DM-only. Not an entity. The answer key to the questions on the recap deck's **Mysteries & Loose Ends** slide
(`meta/recap-slides.md` → Mysteries & Loose Ends slide). The `_` prefix keeps it out of `validate.py` and the
semantic index. The session runner shows each answer in its sidebar under **Mysteries**,
searchable. Each answer is tagged: **Canon** (historian), **Planned** (data or scheduler, not yet
played) or **Open** (deliberately unset; see `meta/mysteries.md`).

## Engine

A campaign tracker: `/transcript`, `/recap` and `/session` read every `scheduler/campaign/_*.md`
file with an `(as of: Session NN)` header and follow this section. Homebrew sessions only.

- **`/transcript` mines:** nothing.
- **`/recap` asks:** nothing new. After the deck's Mysteries & Loose Ends list is approved (Phase 8), make
  `## Answers` match it: one `###` per question, its heading the question word for word, in the
  slide's order, reserve questions included. Write each answer from canon with wikilinks, tagged
  Canon, Planned or Open. Move a question the session answered to `## Answered` with the session
  that answered it. Restamp the header.
- **`/session` checks:** the runner reads `## Answers` (`scripts/session-cards.py`). When a plan
  touches a question, say so in the plan's DM notes.

## Answers

### Who sent riders to the camp, and how many more are out there?

**Canon (Session 34).** Four riders came in from the north under a captain in grey splint, to
collect the casks, and found a fight. All four died in the yard. The party never heard their
names (Garran Vey and three riders, plan names only).

**Planned.** They answer to someone other than Nella and come from a camp that can spare riders:
[[Harrow Bane]]'s main band, about a day across the river. The camp's ledger and bedrolls give the
band's size (`S2_CAMP_INTEL`, carried to Session 35).

### Who is Harrow Bane, and why did the room go quiet at the name?

**Canon.** [[Harrow Bane]] commands the land band raiding [[Ashford]]: an ex-soldier, matched boots,
no wasted violence. [[Nella]] is debt-collared to him and raids to buy herself out. His name is in
the camp's ledger (Session 32). The party has not seen his face; Act 1 means for them to meet him.

### Who pays for raiders this organized: one cobbler's boots, a banner too fine for a camp?

**Canon.** The band is [[Harrow Bane]]'s: an ex-soldier running banditry as a business, hence the
matched boots and staged crews.

**Planned.** The money behind him is [[Lady Sorcha Marlow]] of House Marlow, holding [[Duskwater]],
bleeding [[House Cael]] through a deniable land band. Act 1 does not require the party to learn it
(`scheduler/acts/Act 1 - The Hearth at Ashford.md`, closing state).

**Open.** The banner (Marlow's aegis-banner) is not recovered in Session 35 and isn't placed
anywhere yet (Jeff's review, 2026-11-22). The question stays live until it is.

### How did a bandit camp come by a griffon trained for war?

**Canon.** Tithe, a big tawny griffon kept hooded and staked behind the camp's blind and fed on
mutton. [[Nella]] rides it carefully, like a borrowed horse. It isn't hers.

**Open.** Whose it is, and where it came from, is deliberately unset (Session 33 plan): nobody at
the camp says, and nobody in the ledger names it. If it's set loose without a rider it flies east,
home to whoever owns it.

**Canon (Session 34).** Nella set Tithe loose to hunt the party riderless, and Halsby killed it in
the waystation yard. The DM called it an animal "trained for war, amongst other things". Its body
is in the yard ([[Tithe]]), and per the plan Nella's tally is in its saddlebags. Whose it was is
still open.

### What language was Iggy speaking when he healed Halsby?

**Canon (Session 34).** When Iggy healed Halsby, his words came out in "a strange language that
you cannot interpret".

**Planned.** It is [[Sah]], speaking half a beat behind him: the first of the cues that build to Sah
showing himself when Iggy's wings open (`S2_IGGY_BEAT`). The rest of that beat, "Up, Wallaed",
wasn't played; it goes into Session 35's combat flashback.

### Who else is listening on the raiders' crystals?

**Canon.** The [[Earshot Crystals]] were all cut from one stone, one per raider. [[Nella]] kept hers,
and so did a few of the crew who got away. Any message sent to "all" within 300 ft of her, she hears
and can answer. In Session 32 she heard Halsby's report and launched the griffon. The waystation crew wear them
too (Session 33), and heard Halsby's "going dark". The plan had the relief riders without crystals, but at the table their captain spoke to Nella over them ("Nella, where do you want us? We just arrived."), so at least he wore one. Dip used his to narrate kills to every crew member wearing one (Session 34).

> **Reliability:** the plan said the relief didn't wear crystals; the table had the captain speak
> on them. Treated as the table's version. Confirm with DM.

### What is the Lioness's hearth tied to, and why did it stop during Iggy's song?

**Open** (`meta/mysteries.md`, "What the Lioness hearth is linked to"; todo 78). Known: it feeds
itself, Odibli found it linked to something not present with an aura about 100–200 ft across, and
it stilled for ten seconds during Iggy's song (Session 30). [[Sable Wren]] calls the fire "a little
bit strange" and has asked Odibli to keep quiet until she talks to him. Her patron, Asher
([[Aashal-Groon Mellenegon Borak]]), lives in the aquifer under the cellar spring: a candidate, not
an answer. Settle it in play.

### What did Dip mean, shouting that a flame went inside Iggy the night of the fire?

**Canon.** During [[Iggy]]'s song at [[The Golden Lioness]] (Session 30, played as a flashback at
Session 31), [[Dip]] saw the hearth go still, and a private Arcana roll (15) opened it like a
nesting doll: real, then hollow, then real again, with the innermost layer inside Iggy. Dip told no
one. Mid-charge at Session 33, Dip shouted at Iggy that "a flame went inside" him that night.

**Open.** Whether the shout shared the vision in character is unconfirmed; the vision stays Dip's
own until Ben or Jeff play it. What the innermost layer is ties to "What is the Lioness's hearth
tied to" above, and stays unset (`meta/mysteries.md`). Added to the deck's reserve 2026-11-11, ahead
of Session 34; check with Ben before it ranks into the top eight.

### Who pressed the charm into the hearth during the raid, and why smother the fire instead of burning the place?

**Canon.** The raiders' hedge mage, while the crew held [[Sable Wren]] with Hold Person after a
fireball hit the front of the tavern. It was meant to drown the self-feeding fire unnoticed over
about eight hours ([[The Golden Lioness]], Session 31).

**Open.** Why the band wanted the hearth dead rather than the building burned is not established.

### Why did Luci's warmth go cold when Halsby cast through his spear?

**Canon.** In Session 33, when [[Halsby]] cast Lightning Bolt through [[The Shadowless Spear]],
the warmth [[Sabathiel]] keeps on [[Luci]]'s face went out for one breath and came back, and the
voice said nothing about it. Planted on purpose (todo 81) to seed Luci's light against Halsby's
shadow ways.

**Open.** What Sabathiel makes of the Spear, or of Halsby, is not set. Don't explain it; check
Paul's and Kellan's appetite for PC friction before building on it.

### Where are we? No map, and no names past Ashford and the river

**Canon.** The world is [[Aethryn]]. The town is [[Ashford]], on a small tributary that feeds the
**Moorthistle**, the border-river between the purple power (Velmora) and the red one (Riolgatha).
Ashford is Lord Cael's ground ([[House Cael]]), on the southern edge of the [[Calenmere Basin]]. The
raids come overland out of [[Duskwater]], the neighbouring fief to the southeast, where Nella's camp
and the stolen casks are heading.

**Planned.** [[Calenmere Basin]] and [[Duskwater]] are still data drafts. Townsfolk can name the
river, the fief and the Caels freely; the party has heard none of them yet.

### Why does the sky look wrong: two suns, and a broken moon shedding shards?

**Canon** (`data/lore/calendar.md`). A gold sun and a dimmer red one orbit each other every 18
days, so true night swings from 12 hours down to none. The moon, Fida, was broken by [[The Astra Collision]]
6743 years ago and still sheds shards. They fall as Whatwill in Showerings about
weekly, each heralded by a Kerning. Astra itself is far out and returns around the year 7000.

### How different is this world from Barovia, and has anyone here heard of it?

**Canon.** No mists, no Strahd. Aethryn has a broken moon, two suns and Whatwill falling in
Showerings, and every power is built on getting to the landings first (`scheduler/campaign/Redwater.md`).
Luci's voice ([[Sabathiel]]) is louder and clearer here than it was in Barovia.

**Open.** Whether anyone in Aethryn has heard of Barovia is not established.

### Will Davian's stone wake again, and where would it take the party?

**Canon.** [[The Wanderer's Boon]] is inert. Halsby read it in Session 31: no magic now, but the
shape of where it will be. It is the route back to Barovia.

**Planned.** It is still inert when Act 1 ends; the road back stays shut for the act.

### Why did the green-eyed fox want the bound woman saved?

**Canon.** The fox was possessed: Asher's mouthpiece ([[Aashal-Groon Mellenegon Borak]]), the
ancient deep-water being in the aquifer under the Lioness and [[Sable Wren]]'s patron. It sent
[[Halsby]] to save Sable, and repaid him by fusing his spear and shard into [[The Shadowless Spear]].
It gave no name.

### What answered "Closer." when Luci named the moon?

**Canon.** [[Sabathiel]], [[Luci]]'s warlock patron, the voice behind her Guidance and Augury.

**Open.** What "closer" points at (the Sun Temple, [[Aedra]], or somewhere in Aethryn) is not set.

## Answered

Nothing yet.
