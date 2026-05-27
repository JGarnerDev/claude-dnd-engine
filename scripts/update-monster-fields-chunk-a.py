"""
Chunk A: Aarakocra → Cult Fanatic
Adds weaknesses, resistances, immunities, legendary, movement to monster frontmatter.
"""

import os
import re

BASE_DIR = r"C:\Users\Jeff\Desktop\claude-dnd-engine\data\monsters"

# fmt: weaknesses/resistances/immunities = list of strings
# "nonmagical BPS" = bludgeoning, piercing, slashing from nonmagical attacks
# legendary = True/False
# movement = list of strings like "fly 60", "swim 40", "burrow 30", "climb 30"

MONSTER_DATA = {
    "Aarakocra": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["fly 50"],
    },
    "Aboleth": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": True,
        "movement": ["swim 40"],
    },
    "Abominable Yeti": {
        "weaknesses": ["fire"],
        "resistances": [],
        "immunities": ["cold"],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Acolyte": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Adult Black Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["acid"],
        "legendary": True,
        "movement": ["fly 80", "swim 40"],
    },
    "Adult Blue Dracolich": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["lightning", "poison", "charmed", "exhaustion", "frightened", "paralyzed", "poisoned"],
        "legendary": True,
        "movement": ["fly 80", "burrow 30"],
    },
    "Adult Blue Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["lightning"],
        "legendary": True,
        "movement": ["fly 80", "burrow 30"],
    },
    "Adult Brass Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["fire"],
        "legendary": True,
        "movement": ["fly 80", "burrow 30"],
    },
    "Adult Bronze Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["lightning"],
        "legendary": True,
        "movement": ["fly 80", "swim 40"],
    },
    "Adult Copper Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["acid"],
        "legendary": True,
        "movement": ["fly 80", "climb 40"],
    },
    "Adult Gold Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["fire"],
        "legendary": True,
        "movement": ["fly 80", "swim 40"],
    },
    "Adult Green Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["poison"],
        "legendary": True,
        "movement": ["fly 80", "swim 40"],
    },
    "Adult Oblex": {
        "weaknesses": ["fire"],
        "resistances": [],
        "immunities": ["blinded", "charmed", "deafened", "exhaustion", "prone"],
        "legendary": False,
        "movement": [],
    },
    "Adult Red Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["fire"],
        "legendary": True,
        "movement": ["fly 80", "climb 40"],
    },
    "Adult Silver Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["cold"],
        "legendary": True,
        "movement": ["fly 80"],
    },
    "Adult White Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["cold"],
        "legendary": True,
        "movement": ["fly 80", "burrow 30", "swim 30"],
    },
    "Air Elemental": {
        "weaknesses": [],
        "resistances": ["lightning", "thunder", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["poison", "exhaustion", "grappled", "paralyzed", "petrified", "poisoned", "prone", "restrained", "unconscious"],
        "legendary": False,
        "movement": ["fly 90"],
    },
    "Allosaurus": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Ancient Black Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["acid"],
        "legendary": True,
        "movement": ["fly 80", "swim 40"],
    },
    "Ancient Blue Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["lightning"],
        "legendary": True,
        "movement": ["fly 80", "burrow 40"],
    },
    "Ancient Brass Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["fire"],
        "legendary": True,
        "movement": ["fly 80", "burrow 40"],
    },
    "Ancient Bronze Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["lightning"],
        "legendary": True,
        "movement": ["fly 80", "swim 40"],
    },
    "Ancient Copper Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["acid"],
        "legendary": True,
        "movement": ["fly 80", "climb 40"],
    },
    "Ancient Gold Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["fire"],
        "legendary": True,
        "movement": ["fly 80", "swim 40"],
    },
    "Ancient Green Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["poison"],
        "legendary": True,
        "movement": ["fly 80", "swim 40"],
    },
    "Ancient Red Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["fire"],
        "legendary": True,
        "movement": ["fly 80", "climb 40"],
    },
    "Ancient Silver Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["cold"],
        "legendary": True,
        "movement": ["fly 80"],
    },
    "Ancient White Dragon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["cold"],
        "legendary": True,
        "movement": ["fly 80", "burrow 30", "swim 40"],
    },
    "Androsphinx": {
        "weaknesses": [],
        "resistances": ["bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["psychic", "charmed", "frightened"],
        "legendary": True,
        "movement": ["fly 60"],
    },
    "Animated Armor": {
        "weaknesses": [],
        "resistances": ["piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["poison", "psychic", "blinded", "charmed", "deafened", "exhaustion", "frightened", "paralyzed", "petrified", "poisoned"],
        "legendary": False,
        "movement": [],
    },
    "Ankheg": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["burrow 10"],
    },
    "Ankylosaurus": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Ape": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Arcanaloth": {
        "weaknesses": [],
        "resistances": ["cold", "fire", "lightning", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["acid", "poison", "charmed", "frightened", "poisoned"],
        "legendary": False,
        "movement": ["fly 30"],
    },
    "Archmage": {
        "weaknesses": [],
        "resistances": ["damage from spells"],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Assassin": {
        "weaknesses": [],
        "resistances": ["poison"],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Awakened Shrub": {
        "weaknesses": ["fire"],
        "resistances": ["bludgeoning", "piercing"],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Awakened Tree": {
        "weaknesses": ["fire"],
        "resistances": ["bludgeoning", "piercing"],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Axe Beak": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Azer": {
        "weaknesses": [],
        "resistances": ["piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["fire", "poison", "exhaustion", "poisoned"],
        "legendary": False,
        "movement": [],
    },
    "Baboon": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Badger": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["burrow 5"],
    },
    "Balhannoth": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": True,
        "movement": ["climb 30"],
    },
    "Balor": {
        "weaknesses": [],
        "resistances": ["cold", "lightning"],
        "immunities": ["fire", "poison", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks", "poisoned"],
        "legendary": False,
        "movement": ["fly 80"],
    },
    "Banderhobb": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["swim 40"],
    },
    "Bandit Captain": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Bandit": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Banshee": {
        "weaknesses": [],
        "resistances": ["acid", "fire", "lightning", "thunder", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["cold", "necrotic", "poison", "charmed", "exhaustion", "frightened", "grappled", "paralyzed", "petrified", "poisoned", "prone", "restrained"],
        "legendary": False,
        "movement": ["fly 40"],
    },
    "Baphomet": {
        "weaknesses": [],
        "resistances": ["cold", "fire", "lightning", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["poison", "charmed", "exhaustion", "frightened", "poisoned"],
        "legendary": True,
        "movement": [],
    },
    "Barbed Devil": {
        "weaknesses": [],
        "resistances": ["cold", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["fire", "poison", "poisoned"],
        "legendary": False,
        "movement": [],
    },
    "Barghest": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["fire", "poison", "poisoned"],
        "legendary": False,
        "movement": ["fly 60"],
    },
    "Barlgura": {
        "weaknesses": [],
        "resistances": ["cold", "fire", "lightning", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["poison", "poisoned"],
        "legendary": False,
        "movement": ["climb 40"],
    },
    "Basilisk": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Bat": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["fly 30"],
    },
    "Bearded Devil": {
        "weaknesses": [],
        "resistances": ["cold", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["fire", "poison", "poisoned"],
        "legendary": False,
        "movement": [],
    },
    "Behir": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["lightning"],
        "legendary": False,
        "movement": ["climb 40"],
    },
    "Beholder Zombie": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["poison", "exhaustion", "poisoned"],
        "legendary": False,
        "movement": ["fly 20"],
    },
    "Beholder": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["prone"],
        "legendary": True,
        "movement": ["fly 20"],
    },
    "Berserker": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Bheur Hag": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["cold"],
        "legendary": False,
        "movement": ["fly 50"],
    },
    "Black Bear": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Black Dragon Wyrmling": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["acid"],
        "legendary": False,
        "movement": ["fly 60", "swim 30"],
    },
    "Black Pudding": {
        "weaknesses": [],
        "resistances": ["cold", "fire", "slashing"],
        "immunities": ["acid", "lightning", "blinded", "charmed", "deafened", "exhaustion", "frightened", "prone"],
        "legendary": False,
        "movement": ["climb 20"],
    },
    "Blink Dog": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Blood Hawk": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["fly 60"],
    },
    "Blue Dragon Wyrmling": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["lightning"],
        "legendary": False,
        "movement": ["fly 60", "burrow 20"],
    },
    "Blue Slaad": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Boar": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Boggle": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Bone Devil": {
        "weaknesses": [],
        "resistances": ["cold", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["fire", "poison", "poisoned"],
        "legendary": False,
        "movement": ["fly 40"],
    },
    "Bone Naga": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["poison", "charmed", "exhaustion", "paralyzed", "poisoned"],
        "legendary": False,
        "movement": [],
    },
    "Boneclaw": {
        "weaknesses": ["radiant"],
        "resistances": ["cold", "lightning", "necrotic", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["poison", "charmed", "exhaustion", "frightened", "paralyzed", "poisoned"],
        "legendary": False,
        "movement": [],
    },
    "Brass Dragon Wyrmling": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["fire"],
        "legendary": False,
        "movement": ["fly 60", "burrow 20"],
    },
    "Bronze Dragon Wyrmling": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["lightning"],
        "legendary": False,
        "movement": ["fly 60", "swim 30"],
    },
    "Brown Bear": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Bugbear Chief": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Bugbear": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Bulette": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["burrow 40"],
    },
    "Bullywug": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["swim 40"],
    },
    "Cambion": {
        "weaknesses": [],
        "resistances": ["cold", "fire", "lightning", "poison", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": [],
        "legendary": False,
        "movement": ["fly 60"],
    },
    "Camel": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Carrion Crawler": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Cat": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Catoblepas": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Centaur": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Chain Devil": {
        "weaknesses": [],
        "resistances": ["cold", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["fire", "poison", "poisoned"],
        "legendary": False,
        "movement": [],
    },
    "Chasme": {
        "weaknesses": [],
        "resistances": ["cold", "fire", "lightning", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "immunities": ["poison", "poisoned"],
        "legendary": False,
        "movement": ["fly 40"],
    },
    "Chimera": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["fly 60"],
    },
    "Chitine": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Choldrith": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["climb 30"],
    },
    "Chuul": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["poison", "poisoned"],
        "legendary": False,
        "movement": ["swim 30"],
    },
    "Clay Golem": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["acid", "poison", "psychic", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks", "charmed", "exhaustion", "frightened", "paralyzed", "petrified", "poisoned"],
        "legendary": False,
        "movement": [],
    },
    "Cloaker": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["fly 40"],
    },
    "Cloud Giant Smiling One": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Cloud Giant": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Cockatrice": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["fly 40"],
    },
    "Commoner": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Constrictor Snake": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["swim 30"],
    },
    "Copper Dragon Wyrmling": {
        "weaknesses": [],
        "resistances": [],
        "immunities": ["acid"],
        "legendary": False,
        "movement": ["fly 60", "climb 30"],
    },
    "Couatl": {
        "weaknesses": [],
        "resistances": ["radiant"],
        "immunities": ["psychic", "bludgeoning from nonmagical attacks", "piercing from nonmagical attacks", "slashing from nonmagical attacks"],
        "legendary": False,
        "movement": ["fly 90"],
    },
    "Crab": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["swim 20"],
    },
    "Cranium Rat": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
    "Crawling Claw": {
        "weaknesses": [],
        "resistances": ["bludgeoning from nonmagical attacks"],
        "immunities": ["poison", "charmed", "exhaustion", "frightened", "poisoned"],
        "legendary": False,
        "movement": ["climb 20"],
    },
    "Crocodile": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": ["swim 30"],
    },
    "Cult Fanatic": {
        "weaknesses": [],
        "resistances": [],
        "immunities": [],
        "legendary": False,
        "movement": [],
    },
}


def yaml_list(items, field, indent=""):
    if not items:
        return f"{indent}{field}: []"
    lines = [f"{indent}{field}:"]
    for item in items:
        lines.append(f'{indent}  - "{item}"')
    return "\n".join(lines)


def build_new_fields(data):
    lines = []
    lines.append(yaml_list(data["weaknesses"], "weaknesses"))
    lines.append(yaml_list(data["resistances"], "resistances"))
    lines.append(yaml_list(data["immunities"], "immunities"))
    lines.append(f"legendary: {'true' if data['legendary'] else 'false'}")
    lines.append(yaml_list(data["movement"], "movement"))
    return "\n".join(lines)


def update_file(filepath, name):
    data = MONSTER_DATA.get(name)
    if data is None:
        print(f"SKIP (no data): {name}")
        return

    # Detect BOM to preserve original encoding
    with open(filepath, "rb") as f:
        raw = f.read(3)
    has_bom = raw[:3] == b"\xef\xbb\xbf"
    enc = "utf-8-sig" if has_bom else "utf-8"

    with open(filepath, "r", encoding=enc) as f:
        content = f.read()

    if "weaknesses:" in content:
        print(f"SKIP (already updated): {name}")
        return

    # Split on frontmatter delimiters; text mode converts \r\n -> \n
    match = re.match(r"^(---\n)(.*?)(\n---)(.*)", content, re.DOTALL)
    if not match:
        print(f"ERROR (no frontmatter): {name}")
        return

    prefix = match.group(1)      # "---\n"
    frontmatter = match.group(2) # frontmatter content
    separator = match.group(3)   # "\n---"
    body = match.group(4)        # rest of file

    new_fields = build_new_fields(data)
    new_content = f"{prefix}{frontmatter}\n{new_fields}{separator}{body}"

    with open(filepath, "w", encoding=enc, newline="\r\n") as f:
        f.write(new_content)

    print(f"OK: {name}")


def main():
    files = sorted(
        [f for f in os.listdir(BASE_DIR) if f.endswith(".md") and f != ".gitkeep"]
    )
    chunk_a = [f for f in files if f[:-3] <= "Cult Fanatic"]

    updated = 0
    skipped = 0
    errors = 0

    for filename in chunk_a:
        name = filename[:-3]
        filepath = os.path.join(BASE_DIR, filename)
        try:
            before = updated
            update_file(filepath, name)
            if updated == before:
                skipped += 1
            else:
                updated += 1
        except Exception as e:
            print(f"ERROR: {name} — {e}")
            errors += 1

    print(f"\nDone. Updated: {updated}, Skipped: {skipped}, Errors: {errors}")


if __name__ == "__main__":
    main()
