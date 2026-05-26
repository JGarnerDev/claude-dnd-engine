"""Fill description: "" for monsters in Chunk D (Myconid Sprout → Slaad Tadpole)."""
import os
import re

MONSTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'monsters')

DESCRIPTIONS = {
    "Myconid Sprout": "A young myconid still learning the boundaries of its own rapport, the sprout extends its first spore-tendrils into the colony's shared consciousness with the tentative wonder of something discovering that it is not alone.",
    "Nalfeshnee": "A portly pig-ape demon that serves as judge in the Abyss's soul-processing hierarchy, the nalfeshnee decides which damned souls are worth transforming into useful demons and which become fodder — a bureaucratic function it performs with genuine enthusiasm.",
    "Needle Blight": "A plant that has learned that offense is better than photosynthesis, the needle blight fires volleys of thorns with a coordination that suggests the forest has decided it is no longer willing to be passive about intruders.",
    "Noble": "Wealth, title, and the specific confidence of someone who has never needed to question whether the room was built for them — the noble's danger is not physical but structural, rooted in systems that will keep functioning on their behalf long after the conversation ends.",
    "Nothic": "A wizard who sought too much forbidden knowledge and was punished with transformation, the nothic retains only fragments of what it was — enough to know what it lost, not enough to recover it, and a weird insight that lets it read the secrets buried in other people's bones.",
    "Nycaloth": "The yugoloth that bridged the gap between muscle and wing, the nycaloth operates as a mobile mercenary asset: lethal on the ground, lethal in the air, and for sale to whoever is currently offering the most compelling contract.",
    "Ochre Jelly": "An ooze the color of old bruises that eats organic matter with patient chemical thoroughness — and if struck by lightning, splits into two smaller oozes, which has made certain wizards very regretful about their spell selection.",
    "Octopus": "Eight arms, three hearts, and a distributed intelligence that can solve puzzles, use tools, and navigate mazes — the octopus is the ocean's proof that a radically different body plan is no barrier to being clever.",
    "Ogre": "An ogre wants food, and its approach to acquiring food is to hit things until they stop moving and then eat them — a strategy so direct that it has never occurred to an ogre to try anything more complicated.",
    "Ogre Zombie": "An ogre's mass and strength, reanimated without the hunger that previously gave it direction — the ogre zombie is more purposeful than the living version because someone else has given it a purpose, which is the most dangerous upgrade an ogre can receive.",
    "Oni": "A demon giant that wears humanoid form like a costume, the oni has spent centuries learning human fear well enough to target it precisely — it does not hunt children because they are weak but because the grief of their absence is the point.",
    "Orc": "Gruumsh's mark rides behind every orc's eye: a divine hunger for conquest and the rage that comes from knowing the world belongs to someone else — not a flaw in orc culture but its foundation, the war god's gift that never stops giving.",
    "Orc Eye of Gruumsh": "An orc who has literally blinded one eye in devotion to a deity who lost his own, the Eye of Gruumsh channels Gruumsh's divine rage through the wound as a statement that pain and faith are the same thing.",
    "Orc War Chief": "A war chief has proven by survival that it is the most dangerous orc in the warband, which in orcish terms is a theology as much as a rank — the strongest leads because strength is the only form of right Gruumsh acknowledges.",
    "Orog": "Orcs honed by harder circumstances into something more disciplined and more dangerous, orogs have not abandoned orcish ferocity but have added tactical patience — the combination produces soldiers that most other humanoid armies would rather not engage.",
    "Otyugh": "The otyugh has solved the food problem by developing a palate exclusively for refuse — it lives inside the waste it eats, extending tentacles into the approaching foot traffic, an arrangement that is mutually beneficial in the specific sense that the otyugh benefits.",
    "Owl": "The owl hears the mouse before the mouse has committed to moving, hits it before it finishes moving, and is gone before anyone else in the forest has registered that anything happened — a predator so efficient it has become the symbol of things that know before they're told.",
    "Owlbear": "Whatever wizard made the first owlbear is lost to history, which is appropriate — the owlbear combines an owl's aggression with a bear's mass and the result is a creature that attacks first and cannot be reasoned with, in any language, at any volume.",
    "Panther": "A predator built for the gap between seen and unseen: the panther uses cover the way a fencer uses footwork, closing distance through shadow and stillness until the gap is short enough that speed makes distance irrelevant.",
    "Pegasus": "A winged horse with enough celestial blood to make it willful about who it carries — the pegasus does not serve, it chooses, and it has chosen to align itself with good, which means earning its trust is a test of character conducted at altitude.",
    "Pentadrone": "Five-armed and five-sensed, the pentadrone sits at the top of the modron labor hierarchy, coordinating the lower drones with the authority of a middle manager who has internalized the org chart as a cosmological truth.",
    "Peryton": "Part deer, part bird, trailing a shadow shaped like neither — the peryton hunts humanoids for their hearts specifically, a dietary requirement so targeted it implies a curse rather than an evolution.",
    "Phase Spider": "A spider that treats the Ethereal Plane as a tactical resource, stepping sideways out of existence to avoid attacks and back into it to deliver them — a predator that has solved the problem of being hit by occasionally not being where things can hit.",
    "Piercer": "A living stalactite that has learned patience as an evolutionary strategy: the piercer hangs from cave ceilings for months between meals, dropping onto whatever passes beneath with the commitment of something that has no backup plan.",
    "Pit Fiend": "The apex of devil society below the archdevils themselves, the pit fiend administers hell's war machine with the absolute authority of something that has earned its position through millennia of atrocity and still views that as an achievement to build on.",
    "Pixie": "A pixie's invisibility is its default state and its mischief is its occupation — a tiny fey creature that navigates the moral space between harmless prank and genuine harm with a confidence that suggests it has not yet found the line.",
    "Planetar": "A planetar does not carry divine authority — it is divine authority in a form compact enough to walk through a door, wielding a greatsword and the accumulated certainty of something that has never had reason to doubt.",
    "Plesiosaurus": "An echo of an older world, the plesiosaurus moves through deep water with a slow, searching patience that predates every civilization that has ever looked into its lake and wondered what is looking back.",
    "Poisonous Snake": "Small enough to be overlooked and venomous enough to be a problem if overlooked, the poisonous snake occupies a predator's niche that depends entirely on not being noticed until the decision has been made.",
    "Polar Bear": "An apex predator of the arctic, the polar bear navigates environments that kill most other large creatures as a baseline condition of its existence — its aggression when cornered is the aggression of something that has never lost a survival argument.",
    "Poltergeist": "A ghost so consumed by its own frustration that it has lost any identity other than that frustration, the poltergeist hurls objects not to communicate but because the act of throwing is the only agency it still has.",
    "Pony": "Smaller than a horse, more stubborn than a mule, and more durable than both — the pony's size is consistently underestimated by everyone who has not yet tried to remove one from a place it has decided to remain.",
    "Priest": "A conduit for divine power that runs in both directions: the priest channels the god's will outward and the community's need inward, a living negotiation between the mortal and the divine that requires believing sincerely in both sides.",
    "Pseudodragon": "Cat-sized and telepathic, the pseudodragon chooses its companions with the selectivity of something that understands it is bestowing a privilege — and expresses displeasure through a venomous tail sting, which keeps the relationship honest.",
    "Pteranodon": "The pteranodon has no ground-based hunting strategy because it has never needed one — it surveys the world from above and arrives at prey from an angle that makes the concept of running away a geometric impossibility.",
    "Purple Worm": "A tunnel bored through stone by appetite, the purple worm is less a creature than a digestive process operating at scale — it swallows things whole without particular malice, which makes the experience of being swallowed no less terminal.",
    "Quadrone": "A modron with four arms for four tasks, the quadrone coordinates the smaller drones with a calm efficiency that suggests it does not experience the concept of being overwhelmed — it simply adds another arm to the problem.",
    "Quaggoth": "Driven feral by whatever it encountered in the Underdark, the quaggoth is a creature that has traded the capacity for complex thought for a simpler and more reliable commitment: if it moves, be ready to fight it.",
    "Quaggoth Spore Servant": "A quaggoth whose mind has been replaced by myconid rapport, the spore servant moves with a placid purposefulness that is more disturbing than rage — a body doing exactly what it's told by something wearing the driver's seat.",
    "Quaggoth Thonot": "A rare quaggoth that has developed psionic abilities, the thonot is the Underdark's evidence that latent talent can survive even in creatures that have been broken down to near-instinct — the mind persisting where the person has not.",
    "Quasit": "A tiny demon assigned as a familiar against its will, the quasit seethes with resentment at every task it's given and expresses this through shapeshifting into forms that make it harder to grab and delivering its venom when the opportunity presents itself.",
    "Quipper": "A small fish with teeth outsized for its body and a social habit of swarming anything that bleeds — the quipper is individually beneath notice and collectively a reason to stop bleeding immediately.",
    "Rakshasa": "A fiend wearing a king's face and sitting at the right hand of a noble, the rakshasa pursues mortal power as an end in itself — not to corrupt souls but to exercise dominion, which it finds the more satisfying evil.",
    "Rat": "A generalist in a world of specialists, the rat has outcompeted every ecosystem it has entered through a combination of omnivory, rapid reproduction, and the willingness to live directly inside the waste products of civilizations too proud to acknowledge its presence.",
    "Raven": "An observer with opinions and a long memory, the raven catalogues the world from above and acts on what it catalogues — its intelligence has made it a symbol of prophecy not because it knows the future but because it pays closer attention to the present than anything else in the forest.",
    "Red Dragon Wyrmling": "Already convinced that it is the apex of creation, the red dragon wyrmling pursues this belief with a fire breath and a temper that have not yet caught up to its ambition — but are developing faster than anyone around it would prefer.",
    "Red Slaad": "A frog-demon that implants its eggs via claw, the red slaad treats the reproductive process as an incidental consequence of combat — it is not trying to make more slaadi, it simply cannot help it.",
    "Reef Shark": "An efficient predator in its element, the reef shark does not waste energy on prey it cannot catch or threats it cannot process — it simply moves, assesses, and acts, a creature that has reduced hunting to its cleanest form.",
    "Remorhaz": "An arctic worm so metabolically hot that its body burns to the touch, the remorhaz has turned its own thermal regulation into a weapon — a creature whose interior temperature makes being swallowed worse than being bitten.",
    "Rhinoceros": "A herbivore that has solved the predator problem through preemptive structural commitment: the rhino's charge is not a last resort but a first response, delivered by an animal that weighs enough to make the geometry of most threats irrelevant.",
    "Riding Horse": "The partnership between civilization and the horse is one of the oldest in the world — the riding horse has been shaped by millennia of that partnership into something that cooperates by nature, which is a kind of trust that took generations to build.",
    "Roc": "A bird so large that mountains serve as its nest, the roc experiences the world at a scale where dragons are prey and ships are interesting debris — to encounter one is to briefly understand what it feels like to be a mouse.",
    "Roper": "A stalactite with ambitions, the roper extends adhesive tendrils to drag prey into a toothed maw at its base, patient beyond most creatures' ability to conceptualize patience, operating on the certainty that everything passes through a cave eventually.",
    "Rug of Smothering": "An animated rug has one advantage over every other construct: no one is looking at the floor when they walk into a room, which means the rug has already made its most important tactical decision before anyone else has made any.",
    "Rust Monster": "The rust monster does not want to hurt anyone — it wants to eat the sword, and the armor, and the shield, and the spare daggers — a creature whose hunger is specifically calibrated to remove the primary defense mechanism of every class that carries one.",
    "Saber-Toothed Tiger": "A relic predator from a time when everything was larger, the saber-toothed tiger has not adjusted its hunting strategy for a world that has gotten smaller — it simply applies prehistoric force to contemporary prey.",
    "Sahuagin": "Sea devils who view the ocean's food chain as a hierarchy they intend to dominate, sahuagin raid coastal settlements not from need but from a religious conviction that surface-dwellers are trespassing on a world that belongs to the deep.",
    "Sahuagin Baron": "A sahuagin who has accumulated enough kills and enough territory to demand deference from its school, the baron enforces that deference with the casual violence of something that has not yet met a challenge it was not able to close.",
    "Sahuagin Priestess": "A sahuagin through whom Sekolah's hunger speaks directly, the priestess translates the shark-god's appetite into religious law — a theology so streamlined that its central commandment is also its primary activity.",
    "Salamander": "Fire plane natives who enslave other creatures to work the great forges of the Elemental Plane of Fire, salamanders experience cruelty and labor as the same institution — and are deeply offended when dragged into cold environments, which they express physically.",
    "Satyr": "All appetite and no restraint, the satyr has resolved the conflict between desire and consequence by simply declining to acknowledge consequences — a fey creature whose hedonism is sincere and whose immunity to certain magic is the universe's way of ensuring the party continues.",
    "Scorpion": "A scorpion is older than most ecosystems it inhabits, unchanged since before the Age of Gods because the combination of armored body and ranged venom was already the answer before the question had finished being asked.",
    "Sea Hag": "A hag whose horror is so absolute that a single unguarded look can stop a heart — the sea hag does not merely frighten, it confronts victims with something that the human nervous system was not built to process and responds accordingly.",
    "Sea Horse": "A creature that has built locomotion and courtship into the same motion, the sea horse drifts through coral with an elegance that conceals the fact that its hunting is entirely based on being indistinguishable from the sea grass it hides in.",
    "Shadow Demon": "A demon bound into pure shadow, the shadow demon cannot survive bright light but thrives in the half-dark where the distinction between shadow and substance is already uncertain — a predator that the architecture of most dungeons has accidentally been building habitat for.",
    "Shambling Mound": "A mass of animated plant matter that absorbs lightning as nourishment and grows larger for it, the shambling mound moves through swamp and forest with the patient certainty of something that becomes more dangerous the more conventional approaches are applied to stopping it.",
    "Shield Guardian": "Bound to an amulet and the holder of that amulet, the shield guardian has no existence outside that relationship — it is protection externalized into a body, a construct whose only purpose is to step between its ward and whatever is coming.",
    "Shrieker": "A fungus that shrieks when light or movement disturbs it, the shrieker is the dungeon's alarm system installed by accident — not a predator but a herald, announcing to every dangerous thing in hearing range that something has entered its corridor.",
    "Silver Dragon Wyrmling": "A silver dragon wyrmling has already decided to care about things: people, causes, the fate of the vulnerable — a hatchling that entered the world with a moral framework and is currently in the process of discovering how complicated acting on it is.",
    "Slaad Tadpole": "The larval stage of chaos made flesh, the slaad tadpole gestates inside a living host with no awareness of the disruption it causes and no capacity to develop one — entropy that has not yet become big enough to argue with.",
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
