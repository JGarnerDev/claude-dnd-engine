"""Seed data/feats/ with all PHB 5e feats."""
import os

FEATS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'feats')
os.makedirs(FEATS_DIR, exist_ok=True)

FEATS = [
    {
        "name": "Actor",
        "prerequisite": "",
        "effect": "+1 Charisma (max 20). Advantage on Deception and Performance checks when disguising yourself. Can mimic the speech or sounds of a creature you've heard for 1 minute.",
        "description": "A gift for mimicry and performance that blurs the line between player and role.",
        "source": "Player's Handbook p.165",
    },
    {
        "name": "Alert",
        "prerequisite": "",
        "effect": "+5 to initiative. Cannot be surprised while conscious. Creatures you can't see don't gain advantage on attack rolls against you from being hidden.",
        "description": "Always the first to notice the wrong shadow, the wrong breath, the wrong silence.",
        "source": "Player's Handbook p.165",
    },
    {
        "name": "Athlete",
        "prerequisite": "",
        "effect": "+1 Strength or Dexterity (max 20). Standing from prone costs only 5 feet of movement. Climbing doesn't cost extra movement. Running long/high jump requires only 5-foot run-up.",
        "description": "The body trained past the point where terrain becomes an obstacle.",
        "source": "Player's Handbook p.165",
    },
    {
        "name": "Charger",
        "prerequisite": "",
        "effect": "When you Dash as an action, you can use a bonus action to make one melee weapon attack or shove a creature. If you moved at least 10 feet before the attack, +5 damage or push 10 feet.",
        "description": "Converts momentum into violence with the efficiency of someone who has learned that speed is its own weapon.",
        "source": "Player's Handbook p.165",
    },
    {
        "name": "Crossbow Expert",
        "prerequisite": "",
        "effect": "Ignore the loading property of crossbows. Ranged attack rolls don't suffer disadvantage from being within 5 feet of a hostile creature. Bonus action attack with a hand crossbow after a one-handed weapon attack.",
        "description": "The bolt is already loaded before most people have decided to reach for a weapon.",
        "source": "Player's Handbook p.165",
    },
    {
        "name": "Defensive Duelist",
        "prerequisite": "Dexterity 13 or higher",
        "effect": "When wielding a finesse weapon you are proficient with, use your reaction to add your proficiency bonus to your AC against one melee attack that would hit you.",
        "description": "A fighter who has learned that a blade turned is worth more than a wound absorbed.",
        "source": "Player's Handbook p.165",
    },
    {
        "name": "Dual Wielder",
        "prerequisite": "",
        "effect": "+1 AC while wielding a melee weapon in each hand. Can two-weapon fight with non-light weapons. Can draw or stow two one-handed weapons when normally allowed to draw or stow one.",
        "description": "Two weapons, one purpose — the redundancy is intentional.",
        "source": "Player's Handbook p.165",
    },
    {
        "name": "Dungeon Delver",
        "prerequisite": "",
        "effect": "Advantage on Perception and Investigation checks to detect secret doors. Advantage on saves against traps. Resistance to damage from traps. Can search for traps at a normal pace rather than slow pace.",
        "description": "The dungeon has been read so many times that its grammar is familiar — the pressure plate is a comma, the pit a period.",
        "source": "Player's Handbook p.166",
    },
    {
        "name": "Durable",
        "prerequisite": "",
        "effect": "+1 Constitution (max 20). When you roll Hit Dice during a short rest, minimum HP regained equals twice your Constitution modifier (minimum 2).",
        "description": "The body that refuses to stay down long enough for the situation to get worse.",
        "source": "Player's Handbook p.166",
    },
    {
        "name": "Elemental Adept",
        "prerequisite": "Spellcasting or Pact Magic feature",
        "effect": "Choose acid, cold, fire, lightning, or thunder. Spells of that damage type ignore resistance. When rolling that damage type, treat any 1 on a die as a 2. Can take this feat multiple times for different elements.",
        "description": "The element chosen does not bend for armor or resistance — it simply arrives.",
        "source": "Player's Handbook p.166",
    },
    {
        "name": "Grappler",
        "prerequisite": "Strength 13 or higher",
        "effect": "Advantage on attack rolls against creatures you are grappling. Can use an action to pin a grappled creature (both restrained until grapple ends).",
        "description": "Combat simplified to its oldest truth: hold on and don't let go.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Great Weapon Master",
        "prerequisite": "",
        "effect": "When you score a critical hit or reduce a creature to 0 HP with a melee weapon, make one melee weapon attack as a bonus action. Before an attack with a heavy melee weapon, take -5 to the roll for +10 damage.",
        "description": "The heavy weapon swings harder when you stop trying to control it and start trying to end things.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Healer",
        "prerequisite": "",
        "effect": "Use a healer's kit to stabilize a creature and restore 1 HP. Use a healer's kit as an action to restore 1d6 + 4 HP to a creature, plus additional HP equal to the creature's max Hit Dice (once per short rest per creature).",
        "description": "Keeping people alive is a skill, not a miracle, and this person has acquired it.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Heavily Armored",
        "prerequisite": "Proficiency with medium armor",
        "effect": "+1 Strength (max 20). Gain proficiency with heavy armor.",
        "description": "The next step in a systematic commitment to making yourself harder to kill.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Heavy Armor Master",
        "prerequisite": "Proficiency with heavy armor",
        "effect": "+1 Strength (max 20). While wearing heavy armor, bludgeoning, piercing, and slashing damage from nonmagical weapons is reduced by 3.",
        "description": "The armor has been refined to the point where most swords are having an argument with metal rather than with flesh.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Inspiring Leader",
        "prerequisite": "Charisma 13 or higher",
        "effect": "After a 10-minute speech, grant up to 6 creatures who can hear and understand you temporary HP equal to your level + Charisma modifier.",
        "description": "Words that translate directly into the physical will to survive — which is a kind of magic that requires no spell slot.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Keen Mind",
        "prerequisite": "",
        "effect": "+1 Intelligence (max 20). Always know which way is north, when the next sunrise/sunset will be, and can accurately recall anything seen or heard within the past month.",
        "description": "A mind organized well enough that nothing filed in it stays lost.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Lightly Armored",
        "prerequisite": "",
        "effect": "+1 Strength or Dexterity (max 20). Gain proficiency with light armor.",
        "description": "The first step toward learning that going unarmored is an argument you don't need to have.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Linguist",
        "prerequisite": "",
        "effect": "+1 Intelligence (max 20). Learn 3 languages of your choice. Create written ciphers only you (or someone you teach) can decipher.",
        "description": "Every language learned is another door that isn't closed.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Lucky",
        "prerequisite": "",
        "effect": "3 luck points per long rest. Spend a luck point to roll an additional d20 for an attack roll, ability check, or saving throw and choose which result to use. Can also use it to impose disadvantage on an attack roll against you.",
        "description": "Luck is not random — it is a resource, and this person has learned to spend it.",
        "source": "Player's Handbook p.167",
    },
    {
        "name": "Mage Slayer",
        "prerequisite": "",
        "effect": "When a creature within 5 feet casts a spell, use your reaction to make a melee attack against them. Impose disadvantage on their concentration saves from your damage. Advantage on saves against spells cast by creatures within 5 feet.",
        "description": "Built to solve the problem of arcane power at close range, which is the only range that matters.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Magic Initiate",
        "prerequisite": "",
        "effect": "Choose a class (Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard). Learn 2 cantrips and one 1st-level spell from that class's list (cast once per long rest without a spell slot, or with a slot if you have one).",
        "description": "The door to magic opened just enough to change what you are capable of.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Martial Adept",
        "prerequisite": "",
        "effect": "Learn 2 maneuvers from the Battle Master archetype. Gain 1 superiority die (d6) that refreshes on a short or long rest.",
        "description": "Two tricks from the fighter's manual, filed away for the moment they become necessary.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Medium Armor Master",
        "prerequisite": "Proficiency with medium armor",
        "effect": "No disadvantage on Stealth checks while wearing medium armor. Maximum Dexterity bonus to AC while wearing medium armor increases from +2 to +3.",
        "description": "The armor fitted until it stopped being a liability and started being a strategy.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Mobile",
        "prerequisite": "",
        "effect": "+10 feet speed. Difficult terrain doesn't cost extra movement when you Dash. After attacking a creature with a melee attack (hit or miss), that creature cannot make opportunity attacks against you for the rest of the turn.",
        "description": "Speed used as a defensive resource — you cannot be hit by the thing you have already left behind.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Moderately Armored",
        "prerequisite": "Proficiency with light armor",
        "effect": "+1 Strength or Dexterity (max 20). Gain proficiency with medium armor and shields.",
        "description": "The middle ground between vulnerability and restriction — not the last word in protection, but a convincing second-to-last.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Mounted Combatant",
        "prerequisite": "",
        "effect": "Advantage on melee attacks against unmounted creatures smaller than your mount. Force attacks targeting your mount to target you instead. Your mount takes no damage on successful Dex saves (half on failed).",
        "description": "The horse is not a vehicle — it is a weapons platform, and you have learned to treat it as one.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Observant",
        "prerequisite": "",
        "effect": "+1 Intelligence or Wisdom (max 20). If you can see a creature's mouth, you can interpret what it's saying by lip reading. +5 passive Perception and passive Investigation.",
        "description": "Perception refined until the world's background becomes readable rather than ambient.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Polearm Master",
        "prerequisite": "",
        "effect": "Bonus action attack with the opposite end of a glaive, halberd, quarterstaff, or spear (1d4 bludgeoning). Opportunity attack when a creature enters your reach with a polearm weapon.",
        "description": "The reach weapon's second lesson: the end you're not swinging is also a weapon.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Resilient",
        "prerequisite": "",
        "effect": "+1 to one ability score (max 20). Gain proficiency in saving throws for that ability.",
        "description": "The specific vulnerability has been found and addressed — the weak point reinforced until it isn't one anymore.",
        "source": "Player's Handbook p.168",
    },
    {
        "name": "Ritual Caster",
        "prerequisite": "Intelligence or Wisdom 13 or higher",
        "effect": "Acquire a ritual book with 2 first-level ritual spells from your chosen class (Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard). Can copy ritual spells of your chosen class into the book.",
        "description": "Magic that doesn't burn a slot because you've learned to take your time with it.",
        "source": "Player's Handbook p.169",
    },
    {
        "name": "Savage Attacker",
        "prerequisite": "",
        "effect": "Once per turn when you roll damage for a melee weapon attack, roll the damage dice twice and use the higher result.",
        "description": "The second roll is the one that counts — this person has learned to throw twice and keep the better throw.",
        "source": "Player's Handbook p.169",
    },
    {
        "name": "Sentinel",
        "prerequisite": "",
        "effect": "Opportunity attacks hit targets even on Disengage. Opportunity attacks reduce speed to 0 on hit. When a creature makes a melee attack against someone other than you while within 5 feet of you, use your reaction to attack that creature.",
        "description": "The space around this fighter is not neutral ground — it is contested ground, and the contest has been decided in their favor.",
        "source": "Player's Handbook p.169",
    },
    {
        "name": "Sharpshooter",
        "prerequisite": "",
        "effect": "Ranged attacks ignore half and three-quarters cover. No disadvantage on long-range attacks. Before an attack with a ranged weapon, take -5 to the roll for +10 damage.",
        "description": "Distance is a detail, cover is a suggestion, and the +10 is the argument that ends the conversation.",
        "source": "Player's Handbook p.170",
    },
    {
        "name": "Shield Master",
        "prerequisite": "",
        "effect": "Bonus action shove after an Attack action. Add shield's AC bonus to Dex saves against effects targeting only you. Use your reaction to take no damage on a successful Dex save (instead of half) against an effect targeting only you.",
        "description": "The shield is a weapon, a wall, and an escape hatch — it depends entirely on what the situation calls for.",
        "source": "Player's Handbook p.170",
    },
    {
        "name": "Skilled",
        "prerequisite": "",
        "effect": "Gain proficiency in any combination of 3 skills or tools.",
        "description": "Competence acquired — three doors that used to be closed, opened.",
        "source": "Player's Handbook p.170",
    },
    {
        "name": "Skulker",
        "prerequisite": "Dexterity 13 or higher",
        "effect": "Can hide when only lightly obscured. Missing an attack while hidden doesn't reveal your position. Dim light doesn't impose disadvantage on Perception checks relying on sight.",
        "description": "Darkness is not cover — it is residence, and this person lives there.",
        "source": "Player's Handbook p.170",
    },
    {
        "name": "Spell Sniper",
        "prerequisite": "Spellcasting or Pact Magic feature",
        "effect": "Double range of attack-roll spells. Ranged spell attacks ignore half and three-quarters cover. Learn one cantrip from any class that requires an attack roll.",
        "description": "The spell doesn't need to see the target clearly — it needs a vector, and this caster always has one.",
        "source": "Player's Handbook p.170",
    },
    {
        "name": "Tavern Brawler",
        "prerequisite": "",
        "effect": "+1 Strength or Constitution (max 20). Proficient with improvised weapons and unarmed strikes (1d4 bludgeoning). Bonus action grapple attempt after unarmed strike or improvised weapon hit.",
        "description": "Trained in the only combat school that is open at 2am and never turns anyone away.",
        "source": "Player's Handbook p.170",
    },
    {
        "name": "Tough",
        "prerequisite": "",
        "effect": "Maximum HP increases by 2 per level (including retroactively). Gain 2 additional HP each subsequent level.",
        "description": "The body has been built past what the dice suggested — more of everything that keeps you standing.",
        "source": "Player's Handbook p.170",
    },
    {
        "name": "War Caster",
        "prerequisite": "Spellcasting or Pact Magic feature",
        "effect": "Advantage on Constitution saves to maintain concentration when taking damage. Can perform somatic components while holding weapons or a shield. Can cast a spell as an opportunity attack reaction (must target only that creature, must have a casting time of 1 action).",
        "description": "Magic that works while everything else is also happening — the mark of a spellcaster who has survived long enough to learn how.",
        "source": "Player's Handbook p.170",
    },
    {
        "name": "Weapon Master",
        "prerequisite": "",
        "effect": "+1 Strength or Dexterity (max 20). Gain proficiency with 4 weapons of your choice.",
        "description": "Four more languages added to the vocabulary of violence.",
        "source": "Player's Handbook p.170",
    },
]

TEMPLATE = """---
name: "{name}"
type: feat
exists: false
state: available
tags:
  - feat
effect: "{effect}"
prerequisite: "{prerequisite}"
source: "{source}"
description: "{description}"
---
"""


def escape(s):
    return s.replace('"', '\\"')


created = 0
skipped = 0

for feat in FEATS:
    filename = feat["name"] + ".md"
    filepath = os.path.join(FEATS_DIR, filename)

    if os.path.exists(filepath):
        skipped += 1
        continue

    content = TEMPLATE.format(
        name=escape(feat["name"]),
        effect=escape(feat["effect"]),
        prerequisite=escape(feat.get("prerequisite", "")),
        source=escape(feat.get("source", "")),
        description=escape(feat["description"]),
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    created += 1

print(f"Created: {created}")
print(f"Skipped (already exist): {skipped}")
print(f"Total feats in data/feats/: {len(os.listdir(FEATS_DIR))}")
