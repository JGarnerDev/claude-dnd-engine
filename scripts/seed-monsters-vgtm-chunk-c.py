"""Seed VGtM Chunk C: Hobgoblin Devastator → Orc Red Fang of Shargaas (28 monsters)."""
import os

MONSTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'monsters')

def cr_tag(cr):
    table = {"0": "0", "1/8": "0.125", "1/4": "0.25", "1/2": "0.5"}
    return table.get(cr, cr)

MONSTERS = [
    {
        "name": "Hobgoblin Devastator",
        "creature_type": "humanoid",
        "cr": "4",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Mountains]]", "[[Forest]]"],
        "description": "A hobgoblin arcanist who has integrated magic into military doctrine, the Devastator treats spellcasting the way other hobgoblins treat formations — as a tool of war that requires discipline and produces results, not mystery and metaphysics.",
    },
    {
        "name": "Hobgoblin Iron Shadow",
        "creature_type": "humanoid",
        "cr": "2",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Mountains]]", "[[Forest]]", "[[City]]"],
        "description": "A monk-spy in the hobgoblin hierarchy who uses psionic and martial training to infiltrate and assassinate, the Iron Shadow is the instrument hobgoblin warlords reach for when a problem needs to disappear rather than be defeated.",
    },
    {
        "name": "Hydroloth",
        "creature_type": "fiend",
        "cr": "9",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Gehenna]]", "[[Ocean]]"],
        "description": "A yugoloth that inhabits the River Styx and drinks from it freely, the Hydroloth causes memory loss in those it wounds — not out of cruelty but efficiency, since contracts are easier to renegotiate with someone who cannot recall the original terms.",
    },
    {
        "name": "Kobold Dragonshield",
        "creature_type": "humanoid",
        "cr": "1",
        "size": "small",
        "alignment": "lawful neutral",
        "habitats": ["[[Mountains]]", "[[Cave]]", "[[Dungeon]]"],
        "description": "A kobold chosen to guard its colony and infused with draconic energy from prolonged proximity to dragon lairs, the Dragonshield fights with a conviction wildly disproportionate to its size and a resistance to magic that surprises everyone who dismissed the size.",
    },
    {
        "name": "Kobold Inventor",
        "creature_type": "humanoid",
        "cr": "1/4",
        "size": "small",
        "alignment": "lawful neutral",
        "habitats": ["[[Mountains]]", "[[Cave]]", "[[Dungeon]]"],
        "description": "A kobold that has learned to convert its paucity of combat options into creative engineering, the Inventor enters battle carrying whatever improvised contraption it thought of most recently — unpredictable in ways that are interesting in retrospect and terrifying in real time.",
    },
    {
        "name": "Kobold Scale Sorcerer",
        "creature_type": "humanoid",
        "cr": "1",
        "size": "small",
        "alignment": "lawful neutral",
        "habitats": ["[[Mountains]]", "[[Cave]]", "[[Dungeon]]"],
        "description": "A kobold that has manifested the draconic magic sleeping in its blood, the Scale Sorcerer occupies the highest social position in kobold society short of the dragon itself — a position it intends to hold for as long as the dragon remains unaware of the scale sorcerer's ambitions.",
    },
    {
        "name": "Kraken Priest",
        "creature_type": "humanoid",
        "cr": "5",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Coastline]]", "[[Ocean]]"],
        "description": "A mortal who received the kraken's attentions and survived, the Kraken Priest carries the god-monster's divine power in a human frame, spending that power in service to the only thing they have left that qualifies as a patron.",
    },
    {
        "name": "Leucrotta",
        "creature_type": "monstrosity",
        "cr": "3",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Plains]]", "[[Forest]]"],
        "description": "A hyena-deer-badger nightmare that can mimic any voice it has ever heard and uses this talent to lure prey into isolation, the Leucrotta is proof that hearing something familiar from an unexpected direction is always worth stopping for — to check, not to approach.",
    },
    {
        "name": "Meenlock",
        "creature_type": "fey",
        "cr": "2",
        "size": "small",
        "alignment": "neutral evil",
        "habitats": ["[[Forest]]", "[[Dungeon]]"],
        "description": "A shadow fey that emerges from darkness to paralyze and torture victims before gradually transforming them into more meenlocks — a creature whose reproduction is indistinguishable from its recreation, which says something about its priorities.",
    },
    {
        "name": "Mind Flayer Lich",
        "creature_type": "undead",
        "cr": "22",
        "size": "medium",
        "alignment": "neutral evil",
        "habitats": ["[[Underdark]]"],
        "description": "A mind flayer that refused the Elder Brain's final communion and pursued lichdom instead, the Illithilich is the illithid hierarchy's greatest heresy and most powerful individual — it has kept its soul in a phylactery rather than surrendering it to the colony, which the colony will never forgive.",
    },
    {
        "name": "Mindwitness",
        "creature_type": "aberration",
        "cr": "5",
        "size": "large",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]"],
        "description": "An eye tyrant captured by mind flayers and partially ceremorphed into something new, the Mindwitness has gained telepathic capability in exchange for its autonomy — a beholder forced into a colony it would otherwise despise, networked against its will.",
    },
    {
        "name": "Morkoth",
        "creature_type": "aberration",
        "cr": "11",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Ocean]]", "[[Underdark]]"],
        "description": "An ancient, hypnotic aberration that accumulates treasure and the minds of those who come to claim it, the Morkoth has inhabited the same cursed stretch of deep water since before most coastal civilizations drew their first borders.",
    },
    {
        "name": "Mouth of Grolantor",
        "creature_type": "giant",
        "cr": "6",
        "size": "huge",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Plains]]"],
        "description": "A hill giant variant so consumed by hunger that it has grown enormous even by giant standards, the Mouth of Grolantor is named for the god of the hill giants' stomach — its deity's commandment and its own appetite are indistinguishable.",
    },
    {
        "name": "Neogi",
        "creature_type": "aberration",
        "cr": "3",
        "size": "small",
        "alignment": "lawful evil",
        "habitats": ["[[Dungeon]]", "[[Underdark]]"],
        "description": "A spider-eel hybrid from beyond the material plane that enslaves every creature it can reach, the Neogi has built an entire culture around ownership as the foundational relationship between all beings — in neogi philosophy, the only question is who owns whom.",
    },
    {
        "name": "Neogi Hatchling",
        "creature_type": "aberration",
        "cr": "1/8",
        "size": "tiny",
        "alignment": "lawful evil",
        "habitats": ["[[Dungeon]]", "[[Underdark]]"],
        "description": "Neogi young produced from the body of an elder consumed from within by its own offspring — a birth process that establishes neogi cultural values at the earliest possible developmental stage.",
    },
    {
        "name": "Neogi Master",
        "creature_type": "aberration",
        "cr": "4",
        "size": "medium",
        "alignment": "lawful evil",
        "habitats": ["[[Dungeon]]", "[[Underdark]]"],
        "description": "The largest and most powerful neogi in a group, having grown fat on the labor of the enslaved and the essence of rivals it outlived, the Master has optimized every social relationship in its vicinity into a form of ownership.",
    },
    {
        "name": "Neothelid",
        "creature_type": "aberration",
        "cr": "13",
        "size": "gargantuan",
        "alignment": "chaotic evil",
        "habitats": ["[[Underdark]]"],
        "description": "What grows in the Underdark when a mind flayer colony is destroyed before its Elder Brain matures — a vast, mindless worm that consumes with the hunger of something that was supposed to become an apex intelligence and became an apex appetite instead.",
    },
    {
        "name": "Nilbog",
        "creature_type": "humanoid",
        "cr": "1",
        "size": "small",
        "alignment": "chaotic neutral",
        "habitats": ["[[Cave]]", "[[Plains]]"],
        "description": "A goblin possessed by a spirit of chaos and reversal, the Nilbog heals from attacks, takes damage from healing, and inverts every assumption opponents carry into the fight — a goblin that the universe has decided to treat as a cosmic joke at everyone else's expense.",
    },
    {
        "name": "Oblex Spawn",
        "creature_type": "ooze",
        "cr": "1/4",
        "size": "tiny",
        "alignment": "lawful evil",
        "habitats": ["[[Underdark]]", "[[Dungeon]]"],
        "description": "The smallest oblex, not yet large enough to maintain a simulacrum, the Spawn extends filaments toward sleeping creatures and takes the barest edge of their memories — practicing, growing, waiting to be able to wear a face.",
    },
    {
        "name": "Ogre Battering Ram",
        "creature_type": "giant",
        "cr": "4",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Plains]]"],
        "description": "An ogre weaponized into a siege engine by hobgoblin commanders, strapped into a harness carrying an actual ram and trained to charge fortifications until something breaks — the ogre's mass and the hobgoblin's doctrine, combined.",
    },
    {
        "name": "Ogre Bolt Launcher",
        "creature_type": "giant",
        "cr": "2",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Plains]]"],
        "description": "An ogre fitted with a massive crossbow frame worn like a backpack and fired by pulling a rope, a combination of hobgoblin engineering and ogre structural integrity that produces results neither could achieve alone.",
    },
    {
        "name": "Ogre Chain Brute",
        "creature_type": "giant",
        "cr": "3",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Plains]]"],
        "description": "An ogre that has been given a chain as both its weapon and its enthusiasm, the Chain Brute has developed an affection for the weapon that its hobgoblin commanders find useful and slightly alarming.",
    },
    {
        "name": "Ogre Howdah",
        "creature_type": "giant",
        "cr": "2",
        "size": "large",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Plains]]"],
        "description": "An ogre fitted with a wooden structure on its back that carries four small soldiers into battle, the Howdah has accepted this arrangement in exchange for regular feeding and has stopped asking questions about where the small creatures go after the fighting.",
    },
    {
        "name": "Orc Blade of Ilneval",
        "creature_type": "humanoid",
        "cr": "4",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Plains]]", "[[Forest]]"],
        "description": "A war priest of the orc god Ilneval who leads from the front with tactical acuity, the Blade has learned to read battle the way other priests read omens — as a language in which the god of strategy is always speaking.",
    },
    {
        "name": "Orc Claw of Luthic",
        "creature_type": "humanoid",
        "cr": "4",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Plains]]", "[[Forest]]"],
        "description": "A cave-mother's priest of the orc goddess Luthic, the Claw channels protection and healing through claws blessed by worship — an orc whose violence is devotional in the specific sense of defending everything behind it.",
    },
    {
        "name": "Orc Hand of Yurtrus",
        "creature_type": "humanoid",
        "cr": "2",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Plains]]", "[[Forest]]"],
        "description": "A disease priest of the orc god of death, the Hand carries plague as a sacrament and delivers it by touch — moving through enemy ranks as an argument for the mortality of everything Yurtrus claims, which is everything.",
    },
    {
        "name": "Orc Nurtured One of Yurtrus",
        "creature_type": "humanoid",
        "cr": "1/2",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Plains]]", "[[Forest]]"],
        "description": "An orc slowly killed and partially preserved by Yurtrus's priests as a living death-delivery mechanism, the Nurtured One walks until it finds something living and detonates — a sacrifice whose theology is the theology of rot.",
    },
    {
        "name": "Orc Red Fang of Shargaas",
        "creature_type": "humanoid",
        "cr": "3",
        "size": "medium",
        "alignment": "chaotic evil",
        "habitats": ["[[Mountains]]", "[[Cave]]", "[[City]]"],
        "description": "A spy and assassin-priest of the rat-god Shargaas, the Red Fang moves through darkness with none of the aggression typical of orcs and all of the lethality, conducting Shargaas's work in the silence the other orc gods cannot abide.",
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
