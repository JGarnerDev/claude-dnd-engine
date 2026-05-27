"""Seed VGtM Chunk B: Duergar Hammerer → Guard Drake (26 monsters)."""
import os

MONSTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'monsters')

def cr_tag(cr):
    table = {"0": "0", "1/8": "0.125", "1/4": "0.25", "1/2": "0.5"}
    return table.get(cr, cr)

MONSTERS = [
    {
        "name": "Duergar Hammerer",
        "creature_type": "construct",
        "cr": "4",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "A duergar-made construct that walks on its own hammer-fists, the Hammerer is what happens when a culture's entire aesthetic centers on violence against stone and they decide to make that aesthetic mobile.",
    },
    {
        "name": "Duergar Kavalrachni",
        "creature_type": "humanoid",
        "cr": "2",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "A duergar cavalry specialist trained to ride giant spiders into battle, the Kavalrachni has developed a relationship with its mount that the duergar would not call trust but that functions as trust in every practical sense.",
    },
    {
        "name": "Duergar Mind Master",
        "creature_type": "humanoid",
        "cr": "2",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "A duergar who has developed psionic power to a degree that sets it apart even among a people for whom grudges are a spiritual practice, the Mind Master uses its abilities to dominate and deceive where other duergar use axes.",
    },
    {
        "name": "Duergar Screamer",
        "creature_type": "construct",
        "cr": "3",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "A duergar construct built around a mechanism that produces sound at destructive frequencies, the Screamer is designed for the specific tactical problem of enemy spellcasters — it makes concentration impossible and everything else worse.",
    },
    {
        "name": "Duergar Soulblade",
        "creature_type": "humanoid",
        "cr": "1",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "A psionic fighter who materializes a weapon from pure thought, the Soulblade has resolved the problem of being caught unarmed by making the concept of being unarmed inapplicable to them.",
    },
    {
        "name": "Duergar Stone Guard",
        "creature_type": "humanoid",
        "cr": "2",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "The elite infantry of duergar warbands, Stone Guards are the ones who hold the line after everything behind it has already failed — wearing full plate and a hundred years of grievances into battle.",
    },
    {
        "name": "Duergar Warlord",
        "creature_type": "humanoid",
        "cr": "12",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "A duergar who has survived long enough and killed enough rivals to command an army, the Warlord has turned the duergar gift for holding grudges into a strategic doctrine: identify every enemy, wait for the right moment, and never forgive.",
    },
    {
        "name": "Duergar Xarrorn",
        "creature_type": "humanoid",
        "cr": "2",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "A duergar fire-weapon specialist whose flame pike produces fire in enclosed stone corridors where fire is most dangerous, the Xarrorn has made terrain-as-weapon into a technical profession.",
    },
    {
        "name": "Elder Brain",
        "creature_type": "aberration",
        "cr": "14",
        "size": "large",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "The central consciousness of a mind flayer colony, the Elder Brain is simultaneously every illithid in its telepathic network and something greater than all of them combined — a distributed intelligence that thinks in centuries and whose long game no individual is alive long enough to watch conclude.",
    },
    {
        "name": "Elder Oblex",
        "creature_type": "ooze",
        "cr": "10",
        "size": "huge",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]", "[[Dungeon]]"],
        "description": "The largest and oldest oblex, the Elder has absorbed so many people that its simulacra can maintain complete false identities indefinitely — it manages an entire false social network from within a body of living memory.",
    },
    {
        "name": "Firenewt Warlock of Imix",
        "creature_type": "humanoid",
        "cr": "1",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Desert]]", "[[Mountains]]"],
        "description": "A firenewt who has made a pact with the Prince of Evil Fire, the Warlock channels Imix's pure elemental aggression through magic — it is less a spellcaster than a conduit for fire's oldest desire, which is to consume.",
    },
    {
        "name": "Firenewt Warrior",
        "creature_type": "humanoid",
        "cr": "1/2",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Desert]]", "[[Mountains]]"],
        "description": "A newt-person from volcanic regions who fights with fire and the aggression of something that has spent its entire life surrounded by things that burn, the Firenewt Warrior treats the distinction between soldier and religion as a misunderstanding.",
    },
    {
        "name": "Flail Snail",
        "creature_type": "elemental",
        "cr": "3",
        "size": "large",
        "alignment": "unaligned",
        "habitats": ["[[Forest]]", "[[Swamp]]", "[[Cave]]"],
        "description": "An elemental creature in an iridescent shell that generates wild magic when targeted by spells, the flail snail is nature's argument against the assumption that soft-bodied animals are safe to approach.",
    },
    {
        "name": "Froghemoth",
        "creature_type": "monstrosity",
        "cr": "10",
        "size": "huge",
        "alignment": "unaligned",
        "habitats": ["[[Swamp]]"],
        "description": "A massive frog aberration from the Far Realm that has no business existing on the material plane, the froghemoth converts everything in its swamp into prey with four tentacles, a sticky tongue, and the absolute confidence of something that has never lost an argument about who is at the top of the food chain.",
    },
    {
        "name": "Gauth",
        "creature_type": "aberration",
        "cr": "6",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Dungeon]]", "[[Underdark]]"],
        "description": "A lesser beholder with fewer eye rays and considerably more willingness to negotiate, the gauth is what you get when the beholder's paranoia is turned down slightly and its hunger turned up — producing something mercenary rather than sovereign.",
    },
    {
        "name": "Gazer",
        "creature_type": "aberration",
        "cr": "1/2",
        "size": "tiny",
        "alignment": "neutral evil",
        "habitats": ["[[Dungeon]]", "[[Underdark]]"],
        "description": "A tiny beholder too small to be truly dangerous, the gazer nonetheless carries enough eye rays to make that assessment an error — it serves larger beholders as a spy and alarm system, providing surveillance in exchange for the patron it cannot survive without.",
    },
    {
        "name": "Geryon",
        "creature_type": "fiend",
        "cr": "22",
        "size": "huge",
        "alignment": "lawful evil",
        "habitats": ["[[Nine Hells]]"],
        "description": "The archdevil cast out from the fifth layer of hell by Asmodeus, Geryon was offered reinstatement in exchange for loyalty he cannot afford to give — which makes him simultaneously the most imprisoned and the most motivated devil in existence.",
    },
    {
        "name": "Giant Strider",
        "creature_type": "monstrosity",
        "cr": "1",
        "size": "large",
        "alignment": "neutral evil",
        "habitats": ["[[Desert]]", "[[Mountains]]"],
        "description": "A fire-creature in the shape of a giant flightless bird, the Giant Strider carries its own ambient combustion everywhere it runs, burning the terrain it passes through as a side effect of being what it is.",
    },
    {
        "name": "Gnoll Flesh Gnawer",
        "creature_type": "humanoid",
        "cr": "1",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Plains]]", "[[Forest]]"],
        "description": "A gnoll pushed past even gnoll standards of violence into something that fights with a frenzy so complete it becomes mechanically distinct — the Flesh Gnawer has found the frequency at which Yeenoghu's hunger directly operates a body.",
    },
    {
        "name": "Gnoll Hunter",
        "creature_type": "humanoid",
        "cr": "1/2",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Plains]]", "[[Forest]]"],
        "description": "The ambush specialist of a gnoll warband, the Hunter kills efficiently at range where the Flesh Gnawer kills enthusiastically up close — two expressions of the same theology, selecting the appropriate sacrament for the distance.",
    },
    {
        "name": "Gnoll Witherling",
        "creature_type": "undead",
        "cr": "1/4",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Plains]]", "[[Desert]]"],
        "description": "A gnoll that Yeenoghu found so pleasing in life that he kept it working after death: an undead gnoll with none of the frenzy and all of the violence, useful precisely because it follows instructions the living gnolls cannot be trusted to follow.",
    },
    {
        "name": "Gray Render",
        "creature_type": "monstrosity",
        "cr": "10",
        "size": "large",
        "alignment": "neutral",
        "habitats": ["[[Swamp]]", "[[Forest]]"],
        "description": "A large beast-monstrosity that bonds to a single creature with a devotion so complete it becomes weaponized, the Gray Render will destroy anything that threatens its bonded companion with a single-mindedness that would be touching if the creature doing it weren't already covered in whatever it destroyed last.",
    },
    {
        "name": "Grung",
        "creature_type": "humanoid",
        "cr": "1/4",
        "size": "small",
        "alignment": "lawful evil",
        "habitats": ["[[Forest]]", "[[Swamp]]", "[[Jungle]]"],
        "description": "A poisonous frog-person from jungle canopies with a caste system encoded in skin color, the grung arranges its entire society around the toxicity of touching it — which makes social interaction a matter of life and death in a very literal sense.",
    },
    {
        "name": "Grung Elite Warrior",
        "creature_type": "humanoid",
        "cr": "2",
        "size": "small",
        "alignment": "lawful evil",
        "habitats": ["[[Forest]]", "[[Swamp]]", "[[Jungle]]"],
        "description": "The warrior caste of grung society, distinguished by color and by the specific type of poison its skin produces — a soldier whose armor is itself a weapon, a function it does not distinguish from its rank.",
    },
    {
        "name": "Grung Wildling",
        "creature_type": "humanoid",
        "cr": "3",
        "size": "small",
        "alignment": "neutral evil",
        "habitats": ["[[Forest]]", "[[Swamp]]", "[[Jungle]]"],
        "description": "A grung shaman who can speak with beasts and has established relationships with jungle wildlife that its toxic skin makes impossible with most humanoids — which tells you something about the jungle wildlife.",
    },
    {
        "name": "Guard Drake",
        "creature_type": "dragon",
        "cr": "2",
        "size": "medium",
        "alignment": "unaligned",
        "habitats": ["[[Dungeon]]", "[[Cave]]", "[[Mountains]]"],
        "description": "A dragon-descended lizard bred by kobolds as a loyal guard animal, the Guard Drake has the dragon's instinct and coloration with the dragon's ambition removed — a fierce, trainable creature that knows exactly whose authority it recognizes and no one else's.",
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
