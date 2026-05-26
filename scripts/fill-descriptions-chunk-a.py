"""Fill description: "" for monsters in Chunk A (Adult Black Dragon → Ettercap)."""
import os
import re

MONSTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'monsters')

DESCRIPTIONS = {
    "Adult Black Dragon": "Dissolution is its religion: it rules acid-eaten ruins and festering swamps not as a hoard-keeper but as a slow-working executioner, taking pleasure in watching everything it claims slowly rot.",
    "Adult Red Dragon": "The most dangerous thing about an adult red dragon is not its fire — it is the absolute certainty, burning behind its eyes, that everything it surveys already belongs to it.",
    "Ancient Brass Dragon": "Millennia of accumulated conversation have made the ancient brass dragon the most well-informed creature in any desert, and the most exhausting — it will talk until the sun sets and rise again.",
    "Ancient Gold Dragon": "The pinnacle of dragonkind in form and moral weight, the ancient gold dragon carries the grief of every evil it failed to prevent as heavily as the legend of every evil it stopped.",
    "Ancient Green Dragon": "It has had centuries to learn that direct violence is inefficient; the ancient green dragon lets mortals destroy each other, pulling strings from within its old-growth cathedral until the forest floor is littered with the bones of fools who thought they were making their own choices.",
    "Beholder Zombie": "The horror of a beholder zombie is not its power but its wrongness: all that alien ego and paranoia, reduced to a stumbling corpse with eye stalks that still twitch toward movement.",
    "Black Dragon Wyrmling": "Even at hatchling size a black dragon wyrmling is already cruel in the specific, deliberate way that marks a predator with a long memory — it hasn't forgotten the egg it hatched from, and it won't forget you.",
    "Boar": "A boar does not attack because it is hungry or afraid; it attacks because you were standing in a place it has decided is its place, and this is not something it is willing to discuss.",
    "Bone Devil": "Hell's interrogator-class, the bone devil finds pain not pleasurable but efficient — a precise instrument for extracting confession, compliance, or despair, whichever is most useful.",
    "Bone Naga": "Even death did not free it from service; the bone naga guards its master's lair as a skeleton, stripped of everything except the memory of its binding and the hatred that memory keeps warm.",
    "Brass Dragon Wyrmling": "A brass dragon wyrmling already has opinions about everything and the confidence to share them at length — the tragedy is that it is usually right, and it knows it.",
    "Bronze Dragon Wyrmling": "Fascinated by warfare and honor from its first breath, the bronze dragon wyrmling collects stories of battles the way other hatchlings collect shiny objects, asking pointed questions no hatchling should know to ask.",
    "Bugbear": "Patient, massive, and practiced in the art of waiting where the shadows pool deepest, a bugbear turns its size into a weapon not through brute force but through the moment of paralyzing surprise just before it.",
    "Bugbear Chief": "A bugbear chief has survived longer than its competitors through a simple philosophy: hit first, hit harder, and make certain everyone who might challenge you has seen what happened to the last one who tried.",
    "Bulette": "A landshark that treats the earth as water, the bulette does not distinguish between prey and obstacle — it simply accelerates toward anything warm and lets physics finish the argument.",
    "Bullywug": "Bullywugs inhabit the miserable middle of every hierarchy they enter, too weak to dominate and too proud to accept it, which makes them mean in the small, exhausting way of creatures who have given up on anything better.",
    "Cambion": "Born of fiend and mortal, the cambion carries both inheritances as weapons: it understands human desire well enough to exploit it, and has infernal patience enough to wait.",
    "Camel": "It has survived the harshest environment on the material plane and has formed opinions about everything as a result; the camel cooperates when it chooses to, which is less often than you would prefer.",
    "Carrion Crawler": "The carrion crawler does not need its prey to be dead when it finds them — its paralytic tentacles are a courtesy extended to the living, making the transition from meal-in-progress to meal a quiet one.",
    "Cat": "Entirely self-possessed, faintly contemptuous of everyone around it, and capable of vanishing from a locked room — the cat is the familiar of the universe itself.",
    "Centaur": "A centaur's loyalty runs to the land first, its herd second, and visitors a distant third; crossing their territory uninvited is not trespassing, it is a declaration of intent.",
    "Chain Devil": "The kyton does not just bind its victims in chain — it reads them, finding the fear that lives beneath the flesh and naming it aloud as the links draw tight.",
    "Chasme": "A demon-fly whose droning is less sound than a slow erasure of will, the chasme does not rush its victims — it waits for consciousness to thin and then settles.",
    "Chimera": "Three hungry natures in one body that have never reached agreement, the chimera is less a creature than an ongoing argument between lion, goat, and dragon about who decides when to kill things.",
    "Chuul": "A lobster-like aberration from before memory, the chuul attends to magic the way a hound attends to blood — drawn by the scent of spells, patient and ancient and very difficult to kill.",
    "Clay Golem": "Built to obey but carrying something like rage in its animated clay, the clay golem functions reliably until it does not, at which point the distinction between servant and catastrophe collapses entirely.",
    "Cloaker": "It has hung from dungeon ceilings long enough that the stalactites have stopped noticing it — the cloaker is patient in the way that only something which perfectly resembles its environment can afford to be.",
    "Cloud Giant": "Cloud giants measure status in bloodline purity and treasure accumulated, and they look down on the world below in both senses: from their sky castles, and with the particular disdain of aristocrats who have never had to walk anywhere.",
    "Cockatrice": "Small enough to be dismissed and terrible enough to be remembered, the cockatrice turns living things to stone not out of malice but appetite — it simply prefers its food to hold still.",
    "Commoner": "No armor, no training, no particular destiny — just someone who has woken up in the wrong place at the wrong time, which is enough to make them dangerous in sufficient numbers.",
    "Constrictor Snake": "It does not chase; it repositions and waits, and when the coils close the battle is already decided — the constrictor snake is proof that patience is a killing technique.",
    "Copper Dragon Wyrmling": "A copper dragon wyrmling arrives with a prank already in mind and a backup in case the first is too obvious; getting it to stop requires either genuine laughter or something more interesting to investigate.",
    "Couatl": "A feathered serpent of pure divine light, the couatl carries its celestial mandate like a second skin — it cannot lie, which means when it tells you the situation is dire, the situation is truly dire.",
    "Crab": "A crab has solved the problem of existing in hostile environments by becoming, in a modest way, hostile itself.",
    "Crawling Claw": "A severed hand that hasn't received the message — the crawling claw keeps working toward its last command with the mindless persistence of something that no longer understands why but has not been told to stop.",
    "Crocodile": "The crocodile has not changed in a hundred million years because it found a working solution: be still, be patient, be the water, and then be absolutely everything at once.",
    "Cyclops": "Solitary and melancholy, the cyclops lacks the depth perception to rule anything, which suits a creature whose chief relationship with the world is one of mutual misunderstanding.",
    "Dao": "A dao does not distinguish between indentured labor and slavery — it is a collector of effort, and the gems its thralls extract from the earth are simply effort made solid.",
    "Darkmantle": "The darkmantle drops darkness before it drops itself, converting the ceiling from ambush point to hunting ground — in the dark it has manufactured, it has already won.",
    "Death Dog": "Two heads, one appetite, zero mercy: the death dog's bite carries disease as casually as other dogs carry affection, a two-headed argument for keeping your distance.",
    "Death Slaad": "At the apex of slaad-kind lives something that has absorbed so much chaos it has become a kind of dark clarity — the death slaad knows exactly what it is doing and finds it hilarious.",
    "Death Tyrant": "What remains when a beholder's ego refuses to accept its own death: all the paranoid intelligence and devastating eye rays, now directed at a world it resents for continuing without its permission.",
    "Deep Gnome": "The svirfneblin have adapted to the Underdark by becoming as invisible within it as possible — not just through magic but through a cultural philosophy of self-erasure that is the only sensible response to what lives there.",
    "Deer": "Fleet, alert, and living proof that being harmless is its own form of survival — though prey animal and predator both understand this arrangement is always provisional.",
    "Demilich": "An archmage so ancient and so committed to magic that the body became irrelevant; the demilich persists as a floating skull because it is still working on something, and has declined death twice rather than be interrupted.",
    "Deva": "A deva moves through the mortal world like a message that hasn't been opened yet — carrying divine purpose behind eyes that have witnessed things mortals would not survive knowing, speaking carefully so as not to ignite with the full weight of what it carries.",
    "Displacer Beast": "The displacer beast has two bodies: the real one, which will kill you, and the projected one, designed to ensure you look in the wrong direction while the real one does it.",
    "Djinni": "Born of elemental air and sovereign within it, the djinni's great tension is that it understands freedom absolutely and must spend so much of its existence deciding what to do with that understanding.",
    "Doppelganger": "The doppelganger is the truest predator in any social environment — it hunts identities rather than bodies, reading surface thoughts to calibrate the performance and then wearing your face to meetings you will never know you missed.",
    "Draft Horse": "The architecture of civilization: roads, harvests, trade caravans, and siege engines all depend on the draft horse, which asks only for grain and a night's rest in return for bearing the world.",
    "Dragon Turtle": "An island that moves, a siege weapon that breathes steam, an ancient creature so immense that ships have mistaken it for geography and moored against its shell — the dragon turtle has no enemies because nothing can afford to make one.",
    "Dretch": "The dretch is miserable, weak, and prolific, which is precisely what the Abyss requires: filler for gaps in the demonic hierarchy, a soldier whose only qualification is that it costs nothing to replace.",
    "Drider": "Lolth's punishment made manifest: a drow who failed their goddess's test, now trapped in a form that is both spider and elf and accepted fully by neither, patrolling the tunnels with the bitter rage of someone who had everything and lost it to a theological examination.",
    "Drow": "The drow have built an entire civilization in the Underdark on the premise that beauty, power, and divine favor flow from Lolth's web — which means they are simultaneously the most cultured and the most dangerous thing to encounter in total darkness.",
    "Drow Elite Warrior": "A drow elite warrior has survived the Underdark's politics as much as its monsters; the blades are just the visible part of a creature that has been sharpened by something far more dangerous than combat training.",
    "Drow Mage": "In a society where magic is power and power is survival, the drow mage is the end of an argument — someone whose study of the arcane was never academic but existential, driven by the knowledge that the weak are not kept around.",
    "Drow Priestess of Lolth": "She does not serve Lolth so much as embody her: the cruelty, the hunger, the absolute conviction that power earned through pain is the only power worth having, channeled through divine magic and a society built entirely to reflect her approval.",
    "Druid": "The druid holds the contract between civilization and wilderness, and whenever the terms are violated — a forest burned, a river fouled, a sacred site desecrated — they arrive as the other party to renegotiate, usually accompanied by thunder.",
    "Dryad": "Rooted to a single tree and connected through its roots to every living thing in the forest, the dryad is not protecting nature so much as she is nature, looking out through humanoid eyes and growing very tired of what she sees.",
    "Duergar": "The gray dwarves have stripped everything from their culture that could not survive the Underdark's cruelty — warmth, art, mercy — and built something that could, which is bleaker than the stone it was carved from.",
    "Duodrone": "A duodrone processes the universe as a series of binary propositions: true or false, permitted or forbidden, self or not-self — not because it is simple, but because simplicity is what Mechanus requires of the small.",
    "Dust Mephit": "A dust mephit is what happens when spite becomes elemental: small enough to dismiss, abrasive enough to remember, and prone to detonating in a cloud of blinding powder when the argument doesn't go its way.",
    "Eagle": "The eagle does not share the sky; it surveys its territory from a height that converts everything below into either prey or irrelevance.",
    "Earth Elemental": "Slow in the way that mountains are slow, the earth elemental does not hurry because it does not need to — it has been stone longer than you have been anything, and will be stone again after you are forgotten.",
    "Efreeti": "An efreeti's cruelty is architectural: it builds situations from which those it enslaves cannot escape, not because it hates them but because their suffering is part of the design, and the efreeti finds its designs elegant.",
    "Elephant": "Four tons of social intelligence wrapped in hide thick enough to turn most weapons into a misunderstanding; the elephant's charge is not rage, it is a decision, and once made, it does not revisit it.",
    "Elk": "The elk moves through wilderness like punctuation — a pause in the forest, a declaration of space, a reminder that the woods contain things that are large and fast and entirely uninterested in you.",
    "Empyrean": "Offspring of the gods and therefore nearly one themselves, empyreans carry divine emotion at a scale that affects the weather: their grief causes storms, their joy makes crops grow, and their rage is a problem for everyone in the region.",
    "Erinyes": "A fallen angel who still fights with angelic precision, the erinyes is the most dangerous thing hell produces because it remembers what goodness looks like and has chosen this anyway — which means it has no illusions left to shatter.",
    "Ettercap": "The ettercap is what happens when the forest's appetite is given fingers: a web-spinning, spider-herding predator that has cultivated a whole ecology of horror in the places where travelers stop paying attention.",
}


def update_description(filepath, description):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Escape backslashes and special chars in replacement
    new_desc = f'description: "{description}"'
    updated = re.sub(r'^description:\s*""', new_desc, content, flags=re.MULTILINE)

    if updated == content:
        return False  # no change

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
