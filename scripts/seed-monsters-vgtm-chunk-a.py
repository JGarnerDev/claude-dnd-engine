"""Seed VGtM Chunk A: Adult Oblex → Drow Shadowblade (25 monsters).
CRs and types from training knowledge — verify against book if precision matters."""
import os

MONSTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'monsters')

def cr_tag(cr):
    table = {"0": "0", "1/8": "0.125", "1/4": "0.25", "1/2": "0.5"}
    return table.get(cr, cr)

MONSTERS = [
    {
        "name": "Adult Oblex",
        "creature_type": "ooze",
        "cr": "5",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]", "[[Dungeon]]"],
        "description": "A memory-thief in ooze form, the adult oblex creates filament-connected simulacra of the people it has absorbed, wearing their faces and speech patterns in social encounters while the originals' memories dissolve in its mass.",
    },
    {
        "name": "Balhannoth",
        "creature_type": "aberration",
        "cr": "11",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Underdark]]", "[[Cave]]"],
        "description": "An aberration that hunts by reading desire — it reshapes the cave around it to mimic whatever a creature most desperately wants to find, then takes the creature when it arrives at what it believed was safe harbor.",
    },
    {
        "name": "Banderhobb",
        "creature_type": "monstrosity",
        "cr": "5",
        "size": "large",
        "alignment": "neutral evil",
        "habitats": ["[[Swamp]]", "[[Forest]]", "[[City]]"],
        "description": "A shadow-frog the size of a horse that swallows people whole and retreats through darkness with the body, conjured by hags and shadow cults to perform disappearances that leave no evidence except absence.",
    },
    {
        "name": "Baphomet",
        "creature_type": "fiend",
        "cr": "23",
        "size": "huge",
        "alignment": "chaotic evil",
        "habitats": ["[[Abyss]]"],
        "description": "The Horned King is not merely a demon lord but a philosophy — the absolute supremacy of predator over prey, given divine shape and the patience of something that has been hunting since before civilization learned to build walls against the dark.",
    },
    {
        "name": "Barghest",
        "creature_type": "fiend",
        "cr": "4",
        "size": "large",
        "alignment": "neutral evil",
        "habitats": ["[[Plains]]", "[[City]]"],
        "description": "A fiend from Gehenna wearing the skin of a goblin or wolf until it has devoured enough souls to ascend — the barghest is a creature on a schedule, and the schedule requires harvesting whatever lives nearby.",
    },
    {
        "name": "Bheur Hag",
        "creature_type": "fey",
        "cr": "7",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Tundra]]", "[[Mountains]]"],
        "description": "A hag whose cruelty is expressed in cold — the bheur finds winter beautiful for the same reason she finds suffering beautiful, and she extends both across the tundra with her graystaff and her patience.",
    },
    {
        "name": "Boggle",
        "creature_type": "fey",
        "cr": "1/8",
        "size": "small",
        "alignment": "chaotic neutral",
        "habitats": ["[[City]]", "[[Forest]]", "[[Dungeon]]"],
        "description": "A pocket-sized fey that sweats slick oil or adhesive depending on its mood, lives in forgotten spaces between walls and beneath floors, and steals small things not out of need but compulsion.",
    },
    {
        "name": "Boneclaw",
        "creature_type": "undead",
        "cr": "12",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Dungeon]]", "[[Ruins]]", "[[Underdark]]"],
        "description": "A failed lich's punishment given predatory shape — the soul that couldn't complete its transformation was drawn to a nearby evil and made into its instrument, with claws long enough to reach around corners and a hunger with nowhere else to go.",
    },
    {
        "name": "Catoblepas",
        "creature_type": "monstrosity",
        "cr": "5",
        "size": "large",
        "alignment": "unaligned",
        "habitats": ["[[Swamp]]"],
        "description": "A buffalo-pig of phenomenal ugliness whose death-ray gaze is kept aimed at the ground by the weight of the neck that holds it — the catoblepas could kill most things it encounters, which is why it is perpetually staring at the mud.",
    },
    {
        "name": "Chitine",
        "creature_type": "monstrosity",
        "cr": "1/2",
        "size": "small",
        "alignment": "chaotic evil",
        "habitats": ["[[Underdark]]", "[[Cave]]"],
        "description": "Spider-humanoids created by drow priests from humanoid stock and arachnid essence, chitines weave webs and fight in expendable packs in service to a goddess who views all her creations as tools and replaces broken ones without ceremony.",
    },
    {
        "name": "Choldrith",
        "creature_type": "monstrosity",
        "cr": "3",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Underdark]]", "[[Cave]]"],
        "description": "The priestess caste of chitine society, the choldrith has inherited slightly more spider and slightly less expendability — it leads where the chitines follow, occupying the narrow space between Lolth's favor and Lolth's appetite.",
    },
    {
        "name": "Cloud Giant Smiling One",
        "creature_type": "giant",
        "cr": "11",
        "size": "huge",
        "alignment": "chaotic neutral",
        "habitats": ["[[Mountains]]"],
        "description": "A cloud giant who has rejected the rigid divine hierarchy of its people and broken from Annam's order, the Smiling One pursues chaos and trickery as a theological statement — its smile is sincere, and that is the most unsettling thing about it.",
    },
    {
        "name": "Cranium Rat",
        "creature_type": "aberration",
        "cr": "0",
        "size": "tiny",
        "alignment": "lawful evil",
        "habitats": ["[[City]]", "[[Underdark]]"],
        "description": "A rat whose brain has been enhanced by mind flayer tampering into a node in a distributed psychic network — alone it is a rat; in swarms, the collective achieves an intelligence no individual possesses and does not survive dissolving back into.",
    },
    {
        "name": "Darkling",
        "creature_type": "fey",
        "cr": "1/2",
        "size": "small",
        "alignment": "chaotic neutral",
        "habitats": ["[[Forest]]", "[[Feywild]]", "[[Underdark]]"],
        "description": "A fey exiled from the light by a bargain gone wrong, the darkling has shed all brightness until even its body emanates darkness, living in shadow and directing the bitterness of its exile at the bright things it can no longer touch.",
    },
    {
        "name": "Darkling Elder",
        "creature_type": "fey",
        "cr": "2",
        "size": "medium",
        "alignment": "chaotic neutral",
        "habitats": ["[[Forest]]", "[[Feywild]]", "[[Underdark]]"],
        "description": "The oldest and darkest of its kind, the darkling elder's death releases the light it spent its entire existence suppressing — a creature defined entirely by what it lacks, ending in the one thing it was denied.",
    },
    {
        "name": "Deep Scion",
        "creature_type": "humanoid",
        "cr": "3",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Ocean]]", "[[Coastline]]", "[[City]]"],
        "description": "A person taken by aboleths or deep sea cults and transformed into a shapeshifter, the deep scion wears its human face on land and its aquatic truth in the depths, reporting to masters it once had names for and now only has commands.",
    },
    {
        "name": "Demogorgon",
        "creature_type": "fiend",
        "cr": "26",
        "size": "huge",
        "alignment": "chaotic evil",
        "habitats": ["[[Abyss]]"],
        "description": "The Prince of Demons rules through duality — his two heads despise each other as much as they despise everything else, and the madness that tension generates is the gift he forces upon every creature that meets his gaze.",
    },
    {
        "name": "Derro",
        "creature_type": "humanoid",
        "cr": "1/4",
        "size": "small",
        "alignment": "chaotic evil",
        "habitats": ["[[Underdark]]"],
        "description": "Underground humanoids driven to endemic madness by something that happened to them in the deep dark ages ago, derro channel their shared delusions into cruelty and strange scholarship, building a civilization on the foundation of a wound that never healed.",
    },
    {
        "name": "Derro Savant",
        "creature_type": "humanoid",
        "cr": "3",
        "size": "small",
        "alignment": "chaotic evil",
        "habitats": ["[[Underdark]]"],
        "description": "The rare derro whose madness has crystallized into something that functions like arcane power, the savant is respected in derro society the way that anything dangerous and unpredictable is respected: carefully, from a distance, with the intention of being elsewhere when it detonates.",
    },
    {
        "name": "Dire Troll",
        "creature_type": "giant",
        "cr": "13",
        "size": "huge",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Swamp]]", "[[Forest]]"],
        "description": "A troll that has grown beyond the scale where regeneration makes it unkillable and into the scale where it simply never needed to be — the dire troll is larger, meaner, and more thoroughly committed to the premise that everything in its territory is food.",
    },
    {
        "name": "Drow Favored Consort",
        "creature_type": "humanoid",
        "cr": "18",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Underdark]]"],
        "description": "Elevated to the Matron Mother's side through mastery of arcane power rather than divine favor, the Favored Consort occupies a position of dangerous proximity to absolute authority — useful enough to keep, talented enough to fear.",
    },
    {
        "name": "Drow House Captain",
        "creature_type": "humanoid",
        "cr": "9",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Underdark]]"],
        "description": "The sword at the center of a drow noble house's military apparatus, the House Captain has survived long enough in drow politics to have opinions about violence that its superiors find strategically valuable and personally threatening in equal measure.",
    },
    {
        "name": "Drow Inquisitor",
        "creature_type": "humanoid",
        "cr": "14",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Underdark]]"],
        "description": "Lolth's theological enforcement, the Inquisitor hunts heresy in the Underdark with the conviction of someone who knows exactly what the goddess does to the faithful who fail her — and has decided that finding heretics is preferable to being found as one.",
    },
    {
        "name": "Drow Matron Mother",
        "creature_type": "humanoid",
        "cr": "20",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Underdark]]"],
        "description": "The apex of drow society and the closest mortal expression of Lolth's will, the Matron Mother holds her house together through divine magic, political ruthlessness, and the absolute certainty that every person around her is either a tool or a threat.",
    },
    {
        "name": "Drow Shadowblade",
        "creature_type": "humanoid",
        "cr": "11",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Underdark]]", "[[City]]"],
        "description": "An assassin trained at the edge where drow martial tradition meets shadow magic, the Shadowblade uses darkness as a resource the way other warriors use terrain — converting it into weapons, cover, and exits that only they can use.",
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
