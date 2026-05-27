"""Seed VGtM Chunk D: Quickling → Yuan-ti Pit Master (30 monsters)."""
import os

MONSTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'monsters')

def cr_tag(cr):
    table = {"0": "0", "1/8": "0.125", "1/4": "0.25", "1/2": "0.5"}
    return table.get(cr, cr)

MONSTERS = [
    {
        "name": "Quickling",
        "creature_type": "fey",
        "cr": "1",
        "size": "tiny",
        "alignment": "chaotic evil",
        "habitats": ["[[Forest]]", "[[Feywild]]"],
        "description": "The fastest fey creature in existence, the Quickling moves so far beyond normal perception that it takes damage just from existing at its natural speed relative to the slower world, which has made it permanently bitter toward everything that moves at the pace of the merely living.",
    },
    {
        "name": "Rot Troll",
        "creature_type": "giant",
        "cr": "9",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Swamp]]", "[[Forest]]"],
        "description": "A troll whose regenerative biology has been perverted by necrotic energy, the Rot Troll cannot heal its wounds and spreads decay on contact — an irony the troll itself would not appreciate even if it understood it.",
    },
    {
        "name": "Shadow Mastiff",
        "creature_type": "monstrosity",
        "cr": "2",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Forest]]", "[[Plains]]", "[[Dungeon]]"],
        "description": "A dog-shaped predator from the Shadowfell that flows between areas of darkness between attacks, the Shadow Mastiff hunts in packs and leads with a howl that inspires fear independent of what the rest of the pack is doing.",
    },
    {
        "name": "Shadow Mastiff Alpha",
        "creature_type": "monstrosity",
        "cr": "3",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Forest]]", "[[Plains]]", "[[Dungeon]]"],
        "description": "The leader of a shadow mastiff pack, the Alpha is canny enough to position itself in total darkness before initiating a hunt, directing its pack's howls to drive prey toward the shadow where it waits.",
    },
    {
        "name": "Slithering Tracker",
        "creature_type": "ooze",
        "cr": "3",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Swamp]]", "[[Dungeon]]"],
        "description": "The animated remains of a person killed by a will-o-wisp, the Slithering Tracker is liquid revenge: invisible and patient, capable of following a target across any terrain while its paralytic secretions close the distance between hunter and prey.",
    },
    {
        "name": "Spirit Troll",
        "creature_type": "giant",
        "cr": "11",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Swamp]]", "[[Forest]]"],
        "description": "A troll destroyed so completely that only its animating spirit remains, the Spirit Troll fights incorporeally and is immune to the fire and acid that kill ordinary trolls — a creature that has transcended its one vulnerability by no longer having a body to apply it to.",
    },
    {
        "name": "Star Spawn Grue",
        "creature_type": "aberration",
        "cr": "1/4",
        "size": "small",
        "alignment": "neutral evil",
        "habitats": ["[[Far Realm]]", "[[Dungeon]]"],
        "description": "A tiny humanoid that manifests near Far Realm breaches and devours light in a radius around itself, the Grue is the Far Realm's punctuation — small, pervasive, and preceding something considerably worse.",
    },
    {
        "name": "Star Spawn Hulk",
        "creature_type": "aberration",
        "cr": "10",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Far Realm]]", "[[Dungeon]]"],
        "description": "A massive Far Realm creature that generates psychic pulses when struck, damaging and disorienting every nearby creature simultaneously — the Hulk converts taking damage into dealing damage in a way that makes standard combat tactics self-defeating.",
    },
    {
        "name": "Star Spawn Larva Mage",
        "creature_type": "aberration",
        "cr": "16",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Far Realm]]", "[[Dungeon]]"],
        "description": "A human body completely consumed from within by a Far Realm entity that has taken up residence in the vacated architecture, the Larva Mage breeds Grues from its own dying — because the Far Realm does not distinguish between reproduction and death.",
    },
    {
        "name": "Star Spawn Mangler",
        "creature_type": "aberration",
        "cr": "5",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Far Realm]]", "[[Dungeon]]"],
        "description": "A low-profile Far Realm predator that flows across surfaces and attacks with multiple limbs per turn, the Mangler is the Far Realm's answer to how much damage can be dealt by something that never fully enters the room.",
    },
    {
        "name": "Star Spawn Seer",
        "creature_type": "aberration",
        "cr": "13",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Far Realm]]", "[[Dungeon]]"],
        "description": "A humanoid so thoroughly colonized by Far Realm influence that it perceives time non-linearly, the Seer reacts to things that have not happened yet — a tactical advantage that makes it the most dangerous star spawn in any encounter until you understand how it works, at which point it becomes merely the second most dangerous.",
    },
    {
        "name": "Swarm of Cranium Rats",
        "creature_type": "aberration",
        "cr": "5",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[City]]", "[[Underdark]]"],
        "description": "At sufficient numbers, a swarm of cranium rats achieves a collective intelligence and telepathic reach that no individual possesses — reaching into nearby minds and imposing its will on the weak-willed, which is the mind flayer colony's preferred form of distributed urban surveillance.",
    },
    {
        "name": "Sword Wraith Commander",
        "creature_type": "undead",
        "cr": "8",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Dungeon]]", "[[Ruins]]", "[[Tomb]]"],
        "description": "The spirit of a warrior who died for glory that was denied, the Sword Wraith Commander leads undead soldiers in an endless re-enactment of the honorable death it never received, granting them ferocity in exchange for the acknowledgment it cannot get from the living.",
    },
    {
        "name": "Sword Wraith Warrior",
        "creature_type": "undead",
        "cr": "3",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Dungeon]]", "[[Ruins]]", "[[Tomb]]"],
        "description": "An undead soldier bound to a battlefield or commander by the same denied-glory curse, the Sword Wraith Warrior fights with the desperate ferocity of something that believes winning this next battle will finally resolve the question that has kept it here for centuries.",
    },
    {
        "name": "Thorny",
        "creature_type": "plant",
        "cr": "1",
        "size": "medium",
        "alignment": "neutral",
        "habitats": ["[[Forest]]", "[[Swamp]]"],
        "description": "A vegepygmy variant that serves as the colony's shock troop, bristling with thorns that wound on contact and regenerating damage like the fungal mass it is — a walking briar patch with rudimentary purpose and no subtlety whatsoever.",
    },
    {
        "name": "Tlincalli",
        "creature_type": "monstrosity",
        "cr": "5",
        "size": "large",
        "alignment": "neutral evil",
        "habitats": ["[[Desert]]"],
        "description": "A scorpion-centaur from desert wastes that hunts with a poisoned tail and a lasso, the Tlincalli combines pursuit, capture, and incapacitation into a single body — one of the desert's most efficient predators of large prey.",
    },
    {
        "name": "Troglodyte Champion of Laogzed",
        "creature_type": "humanoid",
        "cr": "2",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Underdark]]", "[[Cave]]"],
        "description": "A troglodyte devoted to the lizard-toad god Laogzed to the point of divine blessing, the Champion has received physical enhancement in exchange for a devotion so complete it has stopped distinguishing between Laogzed's hunger and its own.",
    },
    {
        "name": "Ulitharid",
        "creature_type": "aberration",
        "cr": "9",
        "size": "large",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "A mind flayer selected by the Elder Brain for additional ceremorphosis, producing a creature larger and more powerful than any standard illithid — the Ulitharid is the colony's great investment, watched the way a chess player watches a promoted piece.",
    },
    {
        "name": "Vargouille",
        "creature_type": "fiend",
        "cr": "1",
        "size": "tiny",
        "alignment": "chaotic evil",
        "habitats": ["[[Nine Hells]]", "[[Dungeon]]"],
        "description": "A severed head that flies on its own bat-like ears, shrieks to paralyze prey, and reproduces by kissing victims into a transformation that will eventually detach their head from their body — a creature whose existence is both the product of and the cause of dismemberment.",
    },
    {
        "name": "Vegepygmy",
        "creature_type": "plant",
        "cr": "1/4",
        "size": "small",
        "alignment": "neutral",
        "habitats": ["[[Forest]]", "[[Swamp]]", "[[Jungle]]"],
        "description": "A small fungal humanoid that emerged from the corpse of a creature killed by russet mold, the Vegepygmy is the mold's second life — mobile, social, and deeply invested in protecting the colony it has formed with others from the same patch of rot.",
    },
    {
        "name": "Vegepygmy Chief",
        "creature_type": "plant",
        "cr": "2",
        "size": "medium",
        "alignment": "neutral",
        "habitats": ["[[Forest]]", "[[Swamp]]", "[[Jungle]]"],
        "description": "The oldest and most developed vegepygmy in a colony, the Chief has grown a thorny exterior and the authority to direct the colony's defense, which it does with the proprietary conviction of something that knows it is literally made of this place.",
    },
    {
        "name": "Venom Troll",
        "creature_type": "giant",
        "cr": "7",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Swamp]]", "[[Forest]]", "[[Mountains]]"],
        "description": "A troll whose regenerative biology has been twisted to produce acid and poison instead of clean flesh, the Venom Troll heals from acid damage, bleeds corrosive blood when cut, and has made itself into a tactical problem that punishes all of the standard solutions.",
    },
    {
        "name": "Xvart",
        "creature_type": "humanoid",
        "cr": "1/8",
        "size": "small",
        "alignment": "chaotic evil",
        "habitats": ["[[Cave]]", "[[City]]"],
        "description": "A tiny blue-skinned humanoid who follows Raxivort, the cowardly god who stole from Graz'zt and is now eternally hunted for it — the Xvart has inherited its god's paranoia and tendency to run, qualities that have kept both god and worshipper alive against considerable odds.",
    },
    {
        "name": "Xvart Warlock of Raxivort",
        "creature_type": "humanoid",
        "cr": "1",
        "size": "small",
        "alignment": "chaotic evil",
        "habitats": ["[[Cave]]", "[[City]]"],
        "description": "A xvart who has made a pact with Raxivort for magical power and must perform the god's errands in exchange — mostly stealing things from devils, an arrangement that suits neither party but persists because neither has a better option.",
    },
    {
        "name": "Yagnoloth",
        "creature_type": "fiend",
        "cr": "11",
        "size": "large",
        "alignment": "neutral evil",
        "habitats": ["[[Gehenna]]"],
        "description": "A yugoloth with one giant arm and one humanoid arm, the Yagnoloth uses one for negotiating and one for enforcing those negotiations — the mercenary plane's ideal middle manager, capable of drafting the contract and of ensuring compliance personally.",
    },
    {
        "name": "Yuan-ti Anathema",
        "creature_type": "monstrosity",
        "cr": "12",
        "size": "huge",
        "alignment": "neutral evil",
        "habitats": ["[[Jungle]]", "[[Forest]]"],
        "description": "The most complete expression of yuan-ti transformation, the Anathema has left behind everything recognizably humanoid in exchange for divine serpentine power — a six-armed, multi-headed creature that yuan-ti worship as a near-deity and the rest of the world encounters as a final answer.",
    },
    {
        "name": "Yuan-ti Broodguard",
        "creature_type": "humanoid",
        "cr": "2",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Jungle]]", "[[Forest]]"],
        "description": "A yuan-ti with a failed transformation who has been repurposed as a guard beast, the Broodguard is what yuan-ti keep around to do work that requires aggression without ambition — a partially-transformed humanoid used as furniture in the hierarchy it was excluded from.",
    },
    {
        "name": "Yuan-ti Mind Whisperer",
        "creature_type": "monstrosity",
        "cr": "4",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Jungle]]", "[[Forest]]", "[[City]]"],
        "description": "A yuan-ti malison specialized in psionic infiltration and mind control, the Mind Whisperer is the most invisible member of the yuan-ti hierarchy — operating inside other people's decisions, felt only as a persistent intuition that aligns suspiciously with yuan-ti interests.",
    },
    {
        "name": "Yuan-ti Nightmare Speaker",
        "creature_type": "monstrosity",
        "cr": "4",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Jungle]]", "[[Forest]]"],
        "description": "A yuan-ti malison who invokes Dendar the Night Serpent to spread fear and harvest the nightmares of sleeping victims, the Nightmare Speaker is engaged in a theological project of ending the world by feeding the oldest hunger in existence one dream at a time.",
    },
    {
        "name": "Yuan-ti Pit Master",
        "creature_type": "monstrosity",
        "cr": "5",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Jungle]]", "[[Forest]]"],
        "description": "A yuan-ti malison devoted to Merrshaulk's most violent aspect, the Pit Master is the instrument of sacrifice and punishment — the priest who decides what goes into the pit and what comes out of it, which are rarely the same thing.",
    },
]

TEMPLATE = """\
---
name: {name}
type: monster
tags:
  - monster
  - monster/{creature_type}
  - cr/{cr_tag}

creature_type: {creature_type}
challenge_rating: "{cr}"

size: {size}
alignment: {alignment}
source: Volo's Guide to Monsters
habitats:
{habitats_yaml}
description: "{description}"
---
**Habitats:** {habitats_inline}
"""


def escape(s):
    return s.replace('"', '\\"')


created = 0
skipped = 0

for m in MONSTERS:
    filepath = os.path.join(MONSTERS_DIR, m["name"] + ".md")
    if os.path.exists(filepath):
        skipped += 1
        continue

    habitats_yaml = "\n".join(f'  - "{h}"' for h in m["habitats"])
    habitats_inline = " | ".join(m["habitats"])
    cr_t = cr_tag(m["cr"])

    content = TEMPLATE.format(
        name=m["name"],
        creature_type=m["creature_type"],
        cr=m["cr"],
        cr_tag=cr_t,
        size=m["size"],
        alignment=m["alignment"],
        habitats_yaml=habitats_yaml,
        habitats_inline=habitats_inline,
        description=escape(m["description"]),
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    created += 1

print(f"Created: {created}")
print(f"Skipped (already exist): {skipped}")
