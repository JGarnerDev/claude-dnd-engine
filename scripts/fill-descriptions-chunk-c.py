"""Fill description: "" for monsters in Chunk C (Guardian Naga → Myconid Sovereign)."""
import os
import re

MONSTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'monsters')

DESCRIPTIONS = {
    "Guardian Naga": "A naga that has chosen devotion over dominion, the guardian naga binds itself to a sacred site and its accumulated divine magic to the task of keeping it — a serpent that has decided meaning matters more than freedom.",
    "Gynosphinx": "The gynosphinx does not guard treasure — it guards knowledge, dispensing it only to those who prove themselves worthy through riddle, which is its way of saying it guards knowledge from people who would misuse it, which is most people.",
    "Half-Ogre": "Neither the cunning of one parent nor the raw power of the other fully realized, the half-ogre occupies the middle in both senses: large enough to be dangerous, small enough to be underestimated, and usually found doing someone else's difficult work.",
    "Half-Red Dragon Veteran": "A seasoned warrior touched by draconic blood, the half-red dragon veteran carries the fire's arrogance alongside the soldier's discipline — a combination that makes it both effective and difficult to give orders to.",
    "Harpy": "Its song does not merely attract — it unmakes the will to resist, drawing victims forward with a compulsion that the harpy's appearance, once seen, makes the victim wish had simply killed them sooner.",
    "Hawk": "A hawk sees the world at a resolution that makes human vision seem approximate — it does not spot prey so much as read it, cataloguing distance, speed, and escape routes before it has even committed to the dive.",
    "Hell Hound": "A devil in dog form, the hell hound serves its infernal masters with the loyalty of a trained animal and the fire breath of something considerably more dangerous, which makes it the ideal guard for the things hell does not want found.",
    "Helmed Horror": "Animated armor with a will of its own and the unsettling ability to identify and ignore the specific spells its creators built it to resist — a construct that has been told which arguments it will not hear, and keeps that list current.",
    "Hezrou": "A demon that fights with brute strength and the additional weapon of a stench so profound it constitutes a tactical consideration — the hezrou is muscle with theology, a body built for smashing things that happens to be demonically committed to smashing things.",
    "Hill Giant": "The simplest of giantkind in every sense: hill giants eat, sleep, fight, and argue about food, operating on an appetite so immense that they have flattened settlements not out of malice but genuine hunger.",
    "Hippogriff": "The hippogriff has inherited the eagle's territorial fury and the horse's flight instinct in a body capable of acting on both simultaneously — an aerial predator that treats anything moving through its sky as either prey or a declaration of war.",
    "Hobgoblin": "Where goblins are chaos in small packages, hobgoblins are law in large ones: militaristic, hierarchical, and deeply invested in the idea that discipline is the only meaningful difference between winning and losing.",
    "Hobgoblin Captain": "A hobgoblin captain has survived the hierarchy by being the kind of soldier that wins battles, which in hobgoblin culture means both the competence to outfight enemies and the ruthlessness to outmaneuver rivals.",
    "Hobgoblin Warlord": "At the apex of hobgoblin society stands the warlord: a tactician who has turned the entire apparatus of hobgoblin militarism into a personal instrument, and who measures success in territory taken and subordinates who have not yet tried to take the title.",
    "Homunculus": "A construct extension of its creator's will, the homunculus shares its master's senses across any distance, which makes it less a familiar than a piece of the wizard distributed into the world as a very small and very vulnerable spy.",
    "Hook Horror": "In the dark caves it calls home, the hook horror communicates through clicks and clacks that carry meaning its companions understand perfectly — a creature that has built language from the sound of its own weapons, and uses both with equal precision.",
    "Horned Devil": "A cornugon does not serve hell out of compulsion but conviction: it has participated in the blood war long enough to believe in hierarchy absolutely, which makes it more frightening than a rebellious devil because it genuinely means it.",
    "Hunter Shark": "The open ocean has few creatures as precisely built for their purpose as the hunter shark — a sensory array wrapped in muscle, following the scent of blood across distances that make the concept of hiding irrelevant.",
    "Hydra": "Each head severed produces two, which means a hydra under attack is a hydra proliferating — the standard approach to killing things works backwards here, and the party that discovers this mid-fight has discovered it too late.",
    "Hyena": "The hyena is a more sophisticated predator than its reputation suggests: patient, socially intelligent, and capable of driving lions off their own kills — the laughter is not mockery, it is communication, which makes it stranger, not less so.",
    "Ice Devil": "The gelugon does not merely serve in hell's hierarchy, it administers it: cold, precise, and operating at a level of strategic patience that makes the warmer devils seem impulsive by comparison.",
    "Ice Mephit": "A pocket of spite made cold, the ice mephit finds everything warmer than itself offensive, which in most environments means it finds everything offensive — it expresses this through frost and a breath weapon it uses before being asked.",
    "Incubus": "The incubus does not seduce out of desire but methodology: it has identified the specific vulnerability that makes a person easy to approach, worn the appropriate face, and is collecting something that love is merely the delivery mechanism for.",
    "Intellect Devourer": "A brain that has eaten a brain and now wears the body, the intellect devourer is the illithid's most intimate weapon: invisible inside a skull, looking out through borrowed eyes, using a stolen life as cover for purposes the original owner would not have endorsed.",
    "Invisible Stalker": "An air elemental called into service as an assassin, the invisible stalker pursues its target across any distance and any obstacle with the relentlessness of a force of nature, because that is precisely what it is.",
    "Iron Golem": "The apotheosis of the golem tradition: immune to almost every avenue of harm, breathing poison clouds, and moving with a weight that makes the floor regret its existence — the iron golem is what you build when you have decided that the thing you are protecting is worth more than anything that might come for it.",
    "Jackal": "Opportunistic, clever, and designed by evolution to profit from other creatures' violence, the jackal does not compete with apex predators — it waits for them to finish and then negotiates with the remains.",
    "Jackalwere": "A jackalwere moves through human settlements in human form, using the hospitality it receives to identify the most vulnerable members, then repays that hospitality in service to its lamia masters — a betrayal so fundamental it has become a vocation.",
    "Kenku": "Cursed to silence and earthbound forever, kenku have rebuilt language entirely from mimicry — assembling meaning from stolen sounds with a precision that is almost communication, and carrying the grief of a voice they remember having but cannot find.",
    "Killer Whale": "The apex predator of cold seas and coordinator of the others, the killer whale does not simply hunt — it strategizes, teaching its young, varying its techniques by prey, and occasionally investigating the surface world with an intelligence the surface world finds unsettling.",
    "Knight": "Discipline and steel made into a person: the knight has subordinated everything individual to a code or a lord, which makes them predictable in the best sense — you know exactly what they will do when threatened, and it will be effective.",
    "Kobold": "Individually cowardly and collectively dangerous, kobolds have compensated for small bodies and smaller courage with an extraordinary talent for traps, tunnels, and swarming — they do not fight enemies, they prepare environments that fight enemies for them.",
    "Kraken": "So old and so vast that it approaches divinity sideways, the kraken does not think about the surface world so much as occasionally become aware of it — its storms and its hungers are geological events, and those who worship it do so for the same reason people build temples near volcanoes.",
    "Kuo-toa": "Their collective madness has bent inward into something stranger than sanity: kuo-toa belief is so concentrated that it literally manifests gods, which makes their religious fervor not delusional but ontologically productive in ways that no one involved fully understands.",
    "Kuo-toa Archpriest": "The archpriest has the highest concentration of the kuo-toa's reality-warping faith and the clearest communication with whatever their collective belief has most recently willed into existence — a priest of a god it helped create, which is a theological position with no good precedent.",
    "Kuo-toa Monitor": "The kuo-toa's warrior caste, monitors enforce the hierarchy with a violence that is less personal than institutional — they are not angry, they are structural, which makes them harder to reason with.",
    "Kuo-toa Whip": "A whip serves as both divine enforcer and ritual specialist, bridging the gap between the monitor's violence and the archpriest's madness — the translation layer between faith and force.",
    "Lamia": "It wears a beautiful face on a lion's body and uses a touch that corrupts the will, but the lamia's true weapon is patience — it does not destroy its victims outright but degrades them, hollowing out judgment until what remains is easy to use.",
    "Lemure": "The lowest form of devil is barely a form at all: a lemure is tormented flesh without purpose, the raw material of the infernal hierarchy before ambition and cruelty have shaped it into something useful — and it suffers the entire time.",
    "Lich": "An archmage who refused death on philosophical grounds, the lich has hidden its soul in a phylactery and continued working — centuries of uninterrupted study producing something that has outgrown human morality along with human mortality.",
    "Lion": "A social predator that coordinates hunts through silence and positioning, the lion does not fight so much as apply force efficiently — the males advertise, the females execute, and the pride remembers where the prey went.",
    "Lizard": "Small, cold-blooded, and entirely committed to staying alive in a world full of things that eat it — the lizard's main survival strategy is to be faster than expected and already somewhere else when expected.",
    "Lizard King": "A lizardfolk who has received the blessing of the demon prince Sess'innek, the lizard king rules by divine right in a culture that respects nothing else — equal parts warlord and priest, and aware that the two roles are the same thing.",
    "Lizardfolk": "Cold-blooded in physiology and in disposition, lizardfolk approach the world as a practical matter of survival — they do not hate enemies, they assess threats, and they do not mourn the dead, they evaluate what the dead left behind.",
    "Lizardfolk Shaman": "Where ordinary lizardfolk practice the pragmatism of predators, the shaman adds the pragmatism of prophecy: reading the swamp's omens and the spirits' moods because in the marsh, advance information is the difference between ambush and ambushed.",
    "Mage": "A person who has spent years learning to impose their will on reality through formula and gesture — the mage's power is entirely borrowed from the laws of magic, but borrowed at scale sufficient to remind everyone else that the laws of physics are also negotiable.",
    "Magma Mephit": "Where fire meets earth and both are annoyed about it, the magma mephit exists in a state of slow combustion, splattering molten material with the casual destructiveness of a creature that does not distinguish between hostile action and leaking.",
    "Magmin": "A fire elemental shaped vaguely like a person but not committed to the metaphor, the magmin sets things alight by touching them and experiences this as neutral — it is not malicious, it is simply very warm and does not understand why everything keeps catching.",
    "Mammoth": "A relic of an older world that still walks through this one, the mammoth carries its tusks through the present like a declaration that size and stubbornness are a valid response to everything that has changed around it.",
    "Manes": "The lowest form of demon is barely individuated at all: manes are the Abyss's background noise, chaotic evil expressed at minimal resolution, existing primarily to be consumed by larger demons on the way up.",
    "Manticore": "A lion's strength, a human face wearing a king's expression, and a tail that fires spikes as a ranged weapon — the manticore is an argument against the idea that predators need to choose between intimidation and efficiency.",
    "Marid": "Born of elemental water and enormously proud of it, the marid is the ocean's diplomat and its tantrum in equal measure — generous when pleased, devastating when slighted, and always several rhetorical moves ahead of whoever is talking to it.",
    "Marilith": "Six arms, a serpent's lower body, and the tactical intelligence to use all of it simultaneously — a marilith commands demon armies not because the Abyss requires generals but because it enjoys war as an aesthetic experience.",
    "Mastiff": "A dog bred for purpose rather than companionship, the mastiff applies its size and training to the work of guarding with a consistency and loyalty that makes it the most reliable creature in most situations that require reliability.",
    "Medusa": "The horror of the medusa is not the stone — it is that the stone begins at the moment of eye contact, which means the only safe approach is to not look at what is trying to kill you, which is easier to say than to do.",
    "Merfolk": "Occupying the ocean's middle depths with the same ambivalence toward the surface world that the surface world has toward them, merfolk have built cultures as complex as any above the waterline that no one above it will ever visit.",
    "Merrow": "What merfolk become when the Abyss reaches up from the ocean floor — all the aquatic capability and none of the civilization, replaced by hunger and the capacity for violence at depth.",
    "Mezzoloth": "A yugoloth built like an insect and sold like a soldier, the mezzoloth fights for whoever is paying this week with the professional neutrality of a mercenary that has accepted that having no principles is itself a business model.",
    "Mimic": "A predator that has solved the ambush problem perfectly: become the thing prey is already walking toward, wait, and let the assumption of safety do the hunting — the mimic does not look like a chest, it is a chest, right up until it isn't.",
    "Mind Flayer": "An illithid does not eat the body — it eats the mind, extracting the brain and with it everything that made a person a person, wearing the remains as camouflage in a society it surveys from behind humanoid faces as a long-standing strategic insult.",
    "Mind Flayer Arcanist": "A mind flayer that has grafted arcane study onto psionic power, the arcanist is what happens when the illithid's already devastating intellect decides to expand its available vocabulary of harm.",
    "Minotaur": "Cursed by the gods and shaped by the labyrinth, the minotaur is a predator in the purest sense — built for enclosed spaces, fueled by rage, and stripped of everything that would make the rage negotiable.",
    "Minotaur Skeleton": "All the physical threat of a minotaur with none of the anger replaced by nothing at all — the minotaur skeleton is what's left when someone has decided the curse should keep working after the original is done with it.",
    "Monodrone": "A monodrone processes exactly one thing at a time, in the order assigned, without deviation — not because it lacks capacity but because Mechanus has determined that the optimal unit of lawful order has exactly one purpose and has constructed this one accordingly.",
    "Mud Mephit": "The least glamorous of the mephit lineages, the mud mephit is cold, slow, and deeply unpleasant to be near — a pocket of elemental entropy that experiences being annoying as a neutral condition.",
    "Mule": "The product of hybridization that produced something more durable than either parent: the mule does not tire easily, does not panic easily, and does not move when it has decided not to move, which is its most infuriating characteristic and also what makes it irreplaceable.",
    "Mummy": "A body preserved and reanimated by ancient curses, the mummy carries its rot like a weapon — the disease it inflicts is the physical expression of the same forces that kept it from decomposing, distributed outward.",
    "Mummy Lord": "A priest-ruler who refused to leave their dominion even in death, the mummy lord governs its tomb with the same divine authority it wielded in life — now amplified by centuries of accumulated hatred for everything that continued without it.",
    "Myconid Adult": "The myconid carries its community with it everywhere through rapport spores — a fungal consciousness that experiences solitude as an aberration and collective awareness as the default state of being a person.",
    "Myconid Sovereign": "The oldest and largest myconid in a colony, the sovereign has accumulated enough rapport-network that its consciousness is partially distributed across every spore it has ever shared — a creature that thinks in first-person plural and means it.",
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
