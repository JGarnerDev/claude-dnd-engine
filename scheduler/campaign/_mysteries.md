# Mystery Answers (as of: Session 32)

DM-only. Not an entity. The answer key to the questions on the recap deck's **Mysteries** slide
(`meta/recap-slides.md` → Mysteries slide). The `_` prefix keeps it out of `validate.ps1` and the
semantic index. The session runner shows each answer in its sidebar under **Mysteries**,
searchable. Each answer is tagged: **Canon** (historian), **Planned** (data or scheduler, not yet
played) or **Open** (deliberately unset; see `meta/mysteries.md`).

## Engine

A campaign tracker: `/transcript`, `/recap` and `/session` read every `scheduler/campaign/_*.md`
file with an `(as of: Session NN)` header and follow this section. Homebrew sessions only.

- **`/transcript` mines:** nothing.
- **`/recap` asks:** nothing new. After the deck's Mysteries list is approved (Phase 8), make
  `## Answers` match it: one `###` per question, its heading the question word for word, in the
  slide's order, reserve questions included. Write each answer from canon with wikilinks, tagged
  Canon, Planned or Open. Move a question the session answered to `## Answered` with the session
  that answered it. Restamp the header.
- **`/session` checks:** the runner reads `## Answers` (`scripts/session-cards.py`). When a plan
  touches a question, say so in the plan's DM notes.

## Answers

### Where are we? No map, and no names past Ashford and the river

**Canon.** The world is [[Aethryn]]. The town is [[Ashford]], on a small tributary that feeds the
**Moorthistle**, the border-river between the purple power (Velmora) and the red one (Riolgatha).
Ashford is Lord Cael's ground ([[House Cael]]), on the southern edge of the [[Calenmere Basin]]. The
raids come overland out of [[Duskwater]], the neighbouring fief to the southeast, where Nella's camp
and the stolen casks are heading.

**Planned.** [[Calenmere Basin]] and [[Duskwater]] are still data drafts. Townsfolk can name the
river, the fief and the Caels freely; the party has heard none of them yet.

### How different is this world from Barovia, and has anyone here heard of it?

**Canon.** No mists, no Strahd. Aethryn has a broken moon, two suns and Whatwill falling in
Showerings, and every power is built on getting to the landings first (`scheduler/campaign/Redwater.md`).
Luci's voice ([[Sabathiel]]) is louder and clearer here than it was in Barovia.

**Open.** Whether anyone in Aethryn has heard of Barovia is not established.

### Why does the sky look wrong: two suns, and a broken moon shedding shards?

**Canon** (`data/lore/calendar.md`). A gold sun and a dimmer red one orbit each other every 18
days, so true night swings from 12 hours down to none. The moon, Fida, was broken by [[The Astra Collision]]
6743 years ago and still sheds shards. They fall as Whatwill in Showerings about
weekly, each heralded by a Kerning. Astra itself is far out and returns around the year 7000.

### Who pays for raiders this organized: one cobbler's boots, a banner too fine for a camp?

**Canon.** The band is [[Harrow Bane]]'s: an ex-soldier running banditry as a business, hence the
matched boots and staged crews.

**Planned.** The money behind him is [[Lady Sorcha Marlow]] of House Marlow, holding [[Duskwater]],
bleeding [[House Cael]] through a deniable land band. Act 1 does not require the party to learn it
(`scheduler/acts/Act 1 - The Hearth at Ashford.md`, closing state).

### Who is Harrow Bane, and why did the room go quiet at the name?

**Canon.** [[Harrow Bane]] commands the land band raiding [[Ashford]]: an ex-soldier, matched boots,
no wasted violence. [[Nella]] is debt-collared to him and raids to buy herself out. His name is in
the camp's ledger (Session 32). The party has not seen his face; Act 1 means for them to meet him.

### Who else is listening on the raiders' crystals?

**Canon.** The [[Earshot Crystals]] were all cut from one stone, one per raider. [[Nella]] kept hers,
and so did a few of the crew who got away. Any message sent to "all" within 300 ft of her, she hears
and can answer. In Session 32 she heard Halsby's report and launched the griffon.

### What is the Lioness's hearth tied to, and why did it stop during Iggy's song?

**Open** (`meta/mysteries.md`, "What the Lioness hearth is linked to"; todo 78). Known: it feeds
itself, Odibli found it linked to something not present with an aura about 100–200 ft across, and
it stilled for ten seconds during Iggy's song (Session 30). [[Sable Wren]] calls the fire "a little
bit strange" and has asked Odibli to keep quiet until she talks to him. Her patron, Asher
([[Aashal-Groon Mellenegon Borak]]), lives in the aquifer under the cellar spring: a candidate, not
an answer. Settle it in play.

### Will Davian's stone wake again, and where would it take the party?

**Canon.** [[The Wanderer's Boon]] is inert. Halsby read it in Session 31: no magic now, but the
shape of where it will be. It is the route back to Barovia.

**Planned.** It is still inert when Act 1 ends; the road back stays shut for the act.

### Who pressed the charm into the hearth during the raid, and why smother the fire instead of burning the place?

**Canon.** The raiders' hedge mage, while the crew held [[Sable Wren]] with Hold Person after a
fireball hit the front of the tavern. It was meant to drown the self-feeding fire unnoticed over
about eight hours ([[The Golden Lioness]], Session 31).

**Open.** Why the band wanted the hearth dead rather than the building burned is not established.

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
