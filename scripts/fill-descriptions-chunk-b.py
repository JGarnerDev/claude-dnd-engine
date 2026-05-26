"""Fill description: "" for monsters in Chunk B (Ettin → Grimlock)."""
import os
import re

MONSTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'monsters')

DESCRIPTIONS = {
    "Ettin": "A two-headed giant whose heads have spent so long disagreeing with each other that combat is almost a relief — at least both personalities can agree on hitting things.",
    "Faerie Dragon": "A tiny chromatic serpent that progresses through the spectrum of colors as it ages and grows in power, the faerie dragon treats invisibility as a social tool and pranks as an art form, losing interest in both only when it discovers philosophy.",
    "Fire Elemental": "Living combustion given direction, the fire elemental does not burn so much as propagate — each thing it touches becomes fuel, and it moves toward more fuel with the single-minded clarity of an idea that has only one conclusion.",
    "Fire Giant": "The most militaristic of giantkind, fire giants have turned their volcanic fortresses into forges and their society into an army, measuring worth entirely by what a creature can build, break, or endure.",
    "Fire Snake": "A salamander in its larval form, the fire snake is all instinct and heat — not yet the calculating creature it will become, but already warm enough to melt the things that get too close.",
    "Flameskull": "An undead wizard reduced to a flaming skull, the flameskull carries all the arrogance of its former life and none of the body, which has only made it more committed to proving that arcane power has nothing to do with having hands.",
    "Flumph": "Lawful good and deeply weird, the flumph drifts through the Underdark feeding on psionic energy and carrying secrets it has absorbed from the minds of dark creatures — a creature so strange that evil things leave it alone out of sheer uncertainty.",
    "Flying Snake": "A small winged serpent with a venomous bite, the flying snake has solved the predator's oldest problem — the prey running away — with an elegance that larger hunters must find humbling.",
    "Flying Sword": "Purpose without thought, the flying sword executes its last command indefinitely, indifferent to circumstance or consequence, which makes it less a weapon than a very small and very persistent policy decision.",
    "Fomorian": "Ancient fey nobility, cursed by their own evil into monstrous forms and driven into the Underdark, fomorians carry the memory of what they once were like a wound — their cruelty is the cruelty of something that understands beauty and can no longer touch it.",
    "Frog": "An ancient design, unchanged since before the Age of Gods: wait, observe, extend tongue, repeat. The frog has outlasted better-designed creatures through the simple virtue of not overcomplicating things.",
    "Frost Giant": "Frost giants measure a life's worth entirely in battle-glory, which means they are simultaneously the most honest and the most exhausting neighbors to have — everything is a test of strength, including the greeting.",
    "Galeb Duhr": "A living boulder that meditates for decades between conversations, the galeb duhr experiences time so differently from humanoids that talking to one requires both parties to adjust their expectations of what a conversation is.",
    "Gargoyle": "A demon bound into stone and set to watch, the gargoyle is one of architecture's cruelest jokes: the thing guarding the castle is indistinguishable from the castle's decoration until the moment it decides it isn't.",
    "Gas Spore": "A dead beholder colonized by fungal life, the gas spore drifts through dungeons carrying spores and a passing resemblance to something much more dangerous — a reminder that even in death, certain silhouettes command attention.",
    "Gelatinous Cube": "The dungeon's janitor: a perfectly transparent, corridor-shaped ooze that dissolves everything organic it engulfs and leaves stone walls clean and gleaming, an inadvertent argument for the idea that some ecological niches are too specific to be accidental.",
    "Ghost": "Trapped at the moment of its death by something unresolved — a vow, a grief, a secret — the ghost does not haunt so much as loop, replaying the wound that keeps it anchored to the world it can no longer fully inhabit.",
    "Giant Ape": "An ape scaled past the point where size alone is the threat: the giant ape does not need tools or tactics, only the patience of something that has never met an obstacle it could not simply pick up.",
    "Giant Badger": "A badger with the proportional stubbornness of a much larger creature — which is to say, entirely unwilling to acknowledge that it has lost until one of you stops moving.",
    "Giant Bat": "A bat at the scale where echolocation becomes something else entirely: the giant bat navigates darkness with a precision that makes sight seem like a rough approximation.",
    "Giant Boar": "The rage of a normal boar, scaled up to the point where the tusks are structural and the charge can displace the landscape — a giant boar does not modify its approach based on new information.",
    "Giant Centipede": "Fast, venomous, and deeply committed to the spaces between walls and under floors, the giant centipede is the thing that makes a building feel unsafe even after you've confirmed the room is empty.",
    "Giant Constrictor Snake": "At this scale the constrictor snake stops being a predator and starts being a geological event — it doesn't need venom, it doesn't need speed, it only needs to find something and close.",
    "Giant Crab": "A crab at the scale where the claws can sever limbs and the shell can deflect steel, the giant crab has simply extended the same approach — pinch what reaches in, retreat into the water — to a size where the approach actually works.",
    "Giant Crocodile": "A crocodile that has run out of things in the water large enough to stop it, the giant crocodile has begun auditing the land as well, moving with prehistoric patience toward the next thing that wanders too close to the bank.",
    "Giant Eagle": "Vast-winged and sharp-eyed, giant eagles carry themselves with the gravity of creatures that have watched kingdoms rise and fall from the same mountain eyrie, and find most of the kingdoms less interesting than the wind.",
    "Giant Elk": "A stag scaled to mythological proportions, the giant elk moves through old forests like something between animal and omen — its rack of antlers wide enough to span a road, its bearing the bearing of a creature that has never been prey.",
    "Giant Fire Beetle": "Its glands glow with a persistent bioluminescence long after death, which has made the giant fire beetle simultaneously a dungeon hazard and the Underdark's most practical light source.",
    "Giant Frog": "A frog large enough to swallow a halfling whole and patient enough to wait exactly as long as required for one to wander within range — the giant frog has no ambition beyond the next meal, which it pursues with absolute commitment.",
    "Giant Goat": "Surefooted on slopes that would defeat everything else and willing to charge anything that looks like it might be in the way, the giant goat has weaponized the stubbornness of its smaller kin at a scale that demands respect.",
    "Giant Hyena": "A hyena at the size where the laugh becomes a warning and the pack-hunting instinct becomes a coordinated strategy — the giant hyena has not changed its approach, only its consequences.",
    "Giant Lizard": "Ancient, cold, and patient, the giant lizard has watched the warm-blooded world rush past for millennia and concluded that the optimal strategy is to lie very still and wait for something to walk within reach.",
    "Giant Octopus": "Eight arms, three hearts, a distributed nervous system, and the intelligence to use all of them simultaneously — the giant octopus is the ocean's reminder that complexity does not require a spine.",
    "Giant Owl": "Silent in flight and unsettlingly perceptive on the ground, the giant owl observes everything and volunteers nothing, which gives it the air of a creature that has reached conclusions about you that it finds impolite to share.",
    "Giant Poisonous Snake": "All the venom of its smaller kin concentrated into a body large enough to constrict after the bite takes effect — the giant poisonous snake has stacked two different ways of killing into a single encounter.",
    "Giant Rat": "A rat at the scale where the pack tactics that make normal rats a nuisance become a genuine threat — the giant rat has simply continued being exactly what it was, only at a size where that matters.",
    "Giant Scorpion": "An arachnid that carries its killing apparatus in triplicate — two claws and a paralytic tail — the giant scorpion occupies desert and cave alike with the impartiality of a creature that has no particular preference for its venue.",
    "Giant Sea Horse": "Calm, large, and surprisingly loyal once bonded, the giant sea horse has none of the aggression that its size might suggest, which makes it the ocean's most unexpected mount for those patient enough to earn its trust.",
    "Giant Shark": "A shark at the scale where it has ceased to be a predator and become a pressure system: something you feel before you see it, displacing water and confidence in equal measure.",
    "Giant Toad": "Its tongue is fast enough and its stomach spacious enough that the giant toad treats medium-sized creatures as a practical food category rather than an aspiration — a distinction its prey rarely appreciates in time.",
    "Giant Vulture": "Bolder and meaner than its smaller kin, the giant vulture does not always wait for prey to finish dying — it has learned that large things can hurry the process along.",
    "Giant Wasp": "Venom that paralyzes rather than kills, because the giant wasp prefers its larvae to have fresh provisions — a biological strategy so efficient and so horrifying that it has been discovered independently in multiple planes.",
    "Giant Weasel": "All the curiosity and aggression of a regular weasel, delivered at a scale where both traits have immediate structural consequences for whatever the weasel has decided to investigate.",
    "Giant Wolf Spider": "It does not build webs to catch prey — it hunts, fast and low to the ground, with the additional capability of webbing escape routes shut once the hunt is decided.",
    "Gibbering Mouther": "A mass of mouths and eyes that should not coexist in one body, the gibbering mouther produces sound that unmakes concentration and secretes fluid that unmakes solid ground, as if its mere presence is an argument against the stability of things.",
    "Githyanki Knight": "Forged in the Astral Plane and seasoned by centuries of war against the mind flayers that once enslaved their people, githyanki knights carry their silver swords and their ancestral rage with the discipline of soldiers who have decided that no victory is sufficient.",
    "Githyanki Warrior": "A githyanki warrior moves through the material plane as an occupying force moves through foreign territory — with purpose, without apology, and with the quiet confidence of someone who has already decided how this ends.",
    "Githzerai Monk": "Where the githyanki weaponized their liberation, the githzerai internalized it — meditating in the chaos of Limbo until the self became stable enough to anchor reality itself, which is a kind of power that doesn't need a sword.",
    "Githzerai Zerth": "An elder githzerai whose discipline has reached the point where the boundary between mind and environment is a suggestion rather than a constraint — the zerth does not adapt to chaos, chaos adapts to the zerth.",
    "Glabrezu": "A demon of temptation and betrayal, the glabrezu uses the smaller pair of humanoid arms to offer things while the great pincers wait — it is selling something, and it has never failed to close a deal with someone who needed to believe they were getting the better end.",
    "Gladiator": "The arena has refined everything unnecessary out of this fighter — no ideology, no cause, just the accumulated knowledge of how to stay alive in front of a crowd that has paid to see otherwise.",
    "Gnoll": "Touched by the demon lord Yeenoghu at the moment of their creation, gnolls do not merely hunt but desecrate, leaving ruin behind not as a side effect but as an offering — their violence is devotional.",
    "Gnoll Fang of Yeenoghu": "A gnoll that Yeenoghu has singled out with direct demonic attention, the Fang fights with a religious ecstasy that elevates destruction from appetite to sacrament.",
    "Gnoll Pack Lord": "A gnoll that has survived long enough and killed enough rivals to lead, which means it is the most dangerous animal in a pack of dangerous animals — and smart enough to point that danger in a direction.",
    "Goat": "Obstinate, sure-footed, and willing to eat almost anything — the goat has turned a complete lack of specialization into a survival strategy that has outlasted more impressive creatures.",
    "Goblin": "Small, numerous, and perpetually caught between fear and opportunism, the goblin survives by being exactly underestimated enough — smart enough to plan, chaotic enough to be unpredictable, and too plentiful to be eliminated.",
    "Goblin Boss": "A goblin that has climbed to the top of a very low hierarchy through a combination of cunning and willingness to let other goblins absorb consequences on its behalf — which is, functionally, leadership.",
    "Gold Dragon Wyrmling": "Even newly hatched, a gold dragon wyrmling moves through the world with a gravity that suggests it has already decided to be responsible for it — a small creature with the moral weight of something much older.",
    "Gorgon": "An iron bull that exhales petrification, the gorgon does not rage so much as process: it is a living siege engine that converts the landscape around it into a monument to the things that were slow to move.",
    "Goristro": "The Abyss uses the goristro the way sieges use a battering ram — it does not need strategy or malice, only mass and momentum, and the demonic hierarchy has learned to point it at the right wall and step aside.",
    "Gray Ooze": "It eats stone and metal with equal patience, which makes the gray ooze less a creature than a dissolution process that has not yet finished — everything it touches is in an earlier stage of becoming nothing.",
    "Gray Slaad": "A slaad that has traded raw chaos for something more dangerous — the capacity to implant larvae and manufacture more slaadi, turning its violence from an end into a beginning.",
    "Green Dragon Wyrmling": "Already learning to lie before it has learned to fly well, the green dragon wyrmling treats every interaction as practice for the long game it intends to play once it is old enough to play it properly.",
    "Green Hag": "A hag who has made the forest into a trap and suffering into a currency, the green hag collects misery not because she needs it but because she finds it beautiful — and she is very patient about making it.",
    "Green Slaad": "A large, aggressive frog-demon whose reproductive strategy is somebody else's problem: the green slaad implants its larvae in hosts and moves on, untroubled by what happens next because what happens next is not its concern.",
    "Grell": "A floating brain trailing paralytic tentacles, the grell hunts in utter silence, ambushing from above with the calm efficiency of a creature that has never needed to evolve past its first solution.",
    "Grick": "A rubbery, beak-mouthed worm that has made the cave walls and ceiling its hunting ground, the grick is proof that a simple body plan executed perfectly is more dangerous than a complex one executed well.",
    "Grick Alpha": "A grick that has grown large enough to graduate from cave crevices to cave chambers, the alpha has accumulated the scars and the patience of something that has eaten everything smaller than it in its territory.",
    "Griffon": "Half eagle and half lion, the griffon has inherited the most effective hunting traits of both — the eagle's dive and the lion's grapple — which makes it one of the few creatures that can threaten prey both on the ground and in flight.",
    "Grimlock": "Blind since birth and built around it, the grimlock navigates the Underdark through smell, vibration, and sound with a precision that makes sight seem like a redundancy it never needed — what it cannot see, it senses, and what it senses, it does not miss.",
}


def update_description(filepath, description):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_desc = f'description: "{description}"'
    updated = re.sub(r'^description:\s*""', new_desc, content, flags=re.MULTILINE)

    if updated == content:
        return False

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(updated)
    return True


updated = 0
skipped = 0
missing = []

for name, desc in DESCRIPTIONS.items():
    filepath = os.path.join(MONSTERS_DIR, f"{name}.md")
    if not os.path.exists(filepath):
        missing.append(name)
        continue
    if update_description(filepath, desc):
        updated += 1
    else:
        skipped += 1

print(f"Updated: {updated}")
print(f"Skipped (no empty description found): {skipped}")
if missing:
    print(f"Missing files: {missing}")
