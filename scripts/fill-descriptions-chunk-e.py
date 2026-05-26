"""Fill description: "" for monsters in Chunk E (Smoke Mephit → Yuan-ti Pureblood)."""
import os
import re

MONSTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'monsters')

DESCRIPTIONS = {
    "Smoke Mephit": "A mephit born where fire meets air in the worst possible way, the smoke mephit's breath creates blindness and its presence creates irritation — a creature that has made obscuring everything around it into its primary contribution.",
    "Solar": "The most powerful angel in existence approaches divinity so closely that the distinction becomes philosophical — a solar does not carry divine authority so much as it is divine authority, walking through the material plane as a temporary concession to the limits of mortal comprehension.",
    "Spectator": "A lesser beholder called from another dimension and bound to guard a specific treasure, the spectator performs its function with a completeness that does not distinguish between legitimate visitors and threats — after enough decades alone, the distinction has simply stopped mattering.",
    "Spider": "A spider does not think about the web it builds because the web is an extension of what it is — patient geometry deployed in the dark, waiting for the vibration that tells it the investment has paid off.",
    "Spined Devil": "The spinagon serves hell's communication infrastructure as a winged messenger and aerial skirmisher, hurling spines with the enthusiasm of a creature that has found the one task it was made for and intends to perform it indefinitely.",
    "Spirit Naga": "A naga that refused the oblivion of death and came back wrong, the spirit naga carries its former identity as wreckage — enough left to be purposeful, not enough left to be anything other than a very powerful, very committed problem.",
    "Sprite": "Tiny, armed with a bow, and capable of detecting alignment on contact, the sprite takes the protection of its fey territory with a seriousness disproportionate to its size — it knows exactly who means harm before they've decided to act on it.",
    "Spy": "The spy's greatest weapon is having already been trusted — moving through organizations undetected requires not talent but patience, and the willingness to become, temporarily, the person the target expects to see.",
    "Steam Mephit": "Born where fire and water argue themselves into vapor, the steam mephit vents both literally and figuratively, scalding those who get too close with a breath that encodes its entire personality in thermal terms.",
    "Stirge": "A flying needle with a hunger that exceeds its body size, the stirge latches on and drains blood until its host collapses or its luck runs out — individually fragile, collectively a reason to check the ceiling before resting.",
    "Stone Giant": "Stone giants live so deep in rock and so far from the surface that the sky is mythology to them — they carve art into cave walls and experience the world through stone, regarding everything above ground as a dream too loud to properly appreciate.",
    "Stone Golem": "Less flexible than the iron golem and more patient than any living creature, the stone golem waits in its assigned position across centuries if necessary — a construct that has resolved the problem of boredom by not experiencing it.",
    "Storm Giant": "The most powerful of giantkind, storm giants live at the intersection of sea and sky and have absorbed the prophetic weight of both — they do not rule so much as oversee, watching the world's patterns from a distance that makes individual events look like weather.",
    "Succubus": "The succubus does not seduce out of desire but methodology — it has identified the specific loneliness that makes a person reachable, worn the appropriate form, and is collecting something that love is merely the delivery mechanism for.",
    "Swarm of Insects": "A swarm of insects is not a creature so much as a threshold — a point at which individual insects become something qualitatively different, capable of getting into everything and enduring most of the conventional responses to it.",
    "Swarm of Poisonous Snakes": "Individually dangerous and collectively nightmarish, a swarm of poisonous snakes converts every step into a decision about whether the destination is worth the transit — a moving argument for not being in this location.",
    "Swarm of Quippers": "What looks like dark water in motion is the swarm of quippers in feeding mode — a hunger distributed across hundreds of small bodies that collectively have no mercy and no satiation point, just acceleration toward the thing that is bleeding.",
    "Swarm of Rats": "A swarm of rats is what happens when a population has been pushed past the threshold of individual survival into collective action — not organized, not intelligent, just more rats than the usual defenses were designed to address.",
    "Tarrasque": "The tarrasque is the question the universe poses when it wants to know whether civilization was worth building — an extinction event that wakes on a geological schedule and does not stop until it returns to dormancy, leaving the world to count what is left.",
    "Thri-kreen": "Insectoid nomads who communicate through antenna and mandible-clicks across distances no humanoid voice carries, thri-kreen experience solidarity differently than most races — their empathy is chemical, their consensus is faster, and their patience for those who communicate slowly is genuine but visibly effortful.",
    "Thug": "The thug is the bottom of someone else's hierarchy, doing the work that keeps the upper tiers of organized violence from having to get their hands dirty — reliable in the specific sense that what it does is simple and it does it consistently.",
    "Tiger": "A tiger does not announce itself: it is already there when you know about it, and the moment between your awareness and its arrival is the only negotiation it intends to have.",
    "Treant": "An ancient tree that woke up when the forest required a voice, the treant speaks slowly because it thinks in seasons, and acts decisively when it does act because a being that has watched a forest grow for centuries does not move without certainty.",
    "Tribal Warrior": "A warrior whose skill was earned in an environment where the consequence of failure is personal — no institution behind them, no supply line, just the knowledge that has kept their community alive and the will to apply it.",
    "Triceratops": "A living fortification on legs, the triceratops has three horns and a neck frill designed to make every angle of approach a worse angle than the last — it does not want to fight, but it has prepared for it thoroughly.",
    "Tridrone": "A three-armed modron that processes the universe in threes, the tridrone carries its portion of Mechanus's perfect order with the diligence of something that has never wondered what order is for, and never will.",
    "Troglodyte": "Cave humanoids who have traded almost everything for survival depth, troglodytes compensate for their limitations with a stench so chemically aggressive that it constitutes a tactical deterrent, which they deploy without the self-consciousness that would require smelling themselves.",
    "Troll": "Regeneration turns every wound into an inconvenience and every fight into a war of attrition — the troll does not experience pain the way prey does, only interruption, and it keeps coming back until fire or acid sends a different message.",
    "Twig Blight": "A corrupted plant-thing that hides in underbrush and attacks at close range with splintered limbs, the twig blight is individually fragile but collectively the forest's way of ensuring that walking through it is not a passive activity.",
    "Tyrannosaurus Rex": "An apex predator shaped by millions of years of unchallenged dominance into something that has no concept of being outmatched — the tyrannosaurus rex processes the world as a series of things it has not yet eaten and one thing it has decided to eat now.",
    "Ultroloth": "The general class of yugoloth, the ultroloth commands the mercenary armies of the lower planes with a tactical intelligence and a contempt for both its employers and its troops that it considers professionally appropriate.",
    "Umber Hulk": "A beetle-bodied burrower whose compound eyes produce a confusion effect on everything that meets its gaze, the umber hulk has turned its visual apparatus into a weapon and its tunnels into ambush corridors — a creature that fights best in the passages it has made.",
    "Unicorn": "A divine guardian of sacred forest, the unicorn is one of the few creatures whose goodness is structural rather than chosen — it cannot be otherwise, and its power flows from that impossibility as cleanly as its healing magic flows from its horn.",
    "Veteran": "A warrior who has accumulated everything that experience alone can teach and still carries it forward — the veteran fights without hesitation, positions without instruction, and reads a battlefield in the time it takes someone less seasoned to find it on a map.",
    "Vine Blight": "A plant-creature that grapples first and questions nothing, the vine blight converts its environment into a hazard by treating every creature within reach as something to be held until it stops moving.",
    "Violet Fungus": "The violet fungus does not move toward prey, it waits for prey to move toward it, extending rot-tendrils with patient biochemical certainty — a reminder that in fungal terms, standing still is not the same as doing nothing.",
    "Vrock": "A vulture-demon that uses its screech to stun and its spores to propagate misery, the vrock fights with the graceless ferocity of a creature that has no aesthetic investment in how it kills things, only in the fact that they are killed.",
    "Vulture": "A vulture does not make death — it finds it, which is a more sustainable strategy than most predators employ, and one that has given the vulture an excellent education in where things end up.",
    "Warhorse": "Bred for combat and trained into it, the warhorse has been shaped by generations of selection into something that does not flee from the things that horses evolved to flee from — a confidence that requires maintenance and can, under sufficient pressure, be unlearned.",
    "Warhorse Skeleton": "The loyalty that made a warhorse willing to charge has been preserved in its bones without the horse — an undead mount that goes forward because it was always going forward, and death has not provided a reason to change that.",
    "Water Elemental": "Living water given direction and intent, the water elemental flows around obstacles and through gaps with an adaptability that makes it one of the hardest elementals to contain — it does not fight the environment, it uses it.",
    "Water Weird": "An elemental spirit bound into a body of water, the water weird coils around intruders with a constrictive patience that blends perfectly with the thing it inhabits until the moment it decides not to.",
    "Weasel": "Small, fast, and committed to an aggression wildly disproportionate to its body mass, the weasel has earned its reputation through a refusal to acknowledge that any opponent is larger than it can handle.",
    "Werebear": "The lycanthrope that has made peace with what it is, the werebear carries its curse as a protectorate rather than a burden — its transformations are controlled, its territory defended, and its goodness as reliable as the seasons it watches from its forest.",
    "Wereboar": "A lycanthrope with the boar's stubbornness amplified by curse, the wereboar does not choose fights carefully or retreat from them at all — it simply charges whatever it has decided is in the way, which is a tactical philosophy with a high success rate until it isn't.",
    "Wererat": "The wererat has made urban environments into hunting grounds, using human form to collect information and rat form to move through the walls of the city it parasitizes — a lycanthrope whose curse suits a creature that was already comfortable in the dark.",
    "Weretiger": "Solitary, controlled, and more dangerous than any of its lycanthropic kin in the specific sense that it chooses when to fight — the weretiger does not transform out of anger but precision, treating the curse as a tool in the hands of something that already knew how to use it.",
    "Werewolf": "The werewolf's curse is not the transformation but the loss of control in it — a person whose worst violence happens without their consent, whose moon-madness is both punishment and weapon depending entirely on who is standing nearby.",
    "White Dragon Wyrmling": "The least intelligent of dragon wyrmlings, the white has compensated by being the most savage — a hatchling that has not yet needed to develop cunning because cold and aggression have solved every problem it has encountered so far.",
    "Will-o-Wisp": "Light without warmth, leading without destination: the will-o-wisp sustains itself on the life energy of those it lures into fatal terrain, a creature so perfectly adapted to predation through hope that it has become synonymous with the thing it simulates.",
    "Winged Kobold": "A kobold with wings is a kobold that has solved the problem of range — it carries rocks to altitude and drops them with the precise enthusiasm of a creature that has found the one upgrade that changes everything about its tactical situation.",
    "Winter Wolf": "An intelligent wolf aligned with the frost giants who use them, the winter wolf has language, strategy, and a breath weapon, which makes the standard approach of fighting wolves — assume they're animals — the last mistake some parties make.",
    "Worg": "A worg speaks, which is the first thing that goes wrong in any encounter with one — a wolf-shaped creature of malicious intelligence that has chosen to serve goblins not out of loyalty but because the arrangement lets it hunt without consequence.",
    "Wyvern": "A dragon that traded forelegs for wings and intelligence for appetite, the wyvern is what remains when you strip away everything except flight and venom — a creature less impressive than its draconic cousins and considerably more indiscriminate.",
    "Xorn": "A three-armed, three-eyed creature from the Elemental Plane of Earth that can smell gems through solid stone, the xorn passes through rock as easily as most creatures pass through air, which makes underground treasure significantly more contested.",
    "Yeti": "The yeti's gaze freezes prey where it stands before the claws arrive, which means the last thing many of its victims see is the creature coming for them and the first thing they lose is the ability to run — a predator that has outsourced its opening move to eye contact.",
    "Yochlol": "Lolth's personal handmaidens, yochlol are shapeshifters deployed as her agents in the world above and below, wearing drow faces or spider forms depending on what the mission requires — creatures of absolute loyalty to a goddess whose primary quality is that she deserves none.",
    "Young Black Dragon": "A young black dragon has not yet grown into the patience its elders display — it expresses the same acid-and-ruin philosophy with the bluntness of something that still experiences killing as immediately satisfying rather than merely inevitable.",
    "Young Blue Dragon": "A young blue dragon has learned that lightning is power and that power explains itself through demonstration — it practices both the magic and the monologue, working toward the rhetorical control its older kin have perfected.",
    "Young Brass Dragon": "A young brass dragon has discovered that it is the most interesting creature in any conversation it initiates, which it initiates constantly — it asks questions with the relentless curiosity of something that has not yet learned that not everyone has time for the answers.",
    "Young Bronze Dragon": "A young bronze dragon has begun collecting information about conflicts and heroism the way other dragons collect gold — building a treasury of stories about battles and honorable conduct that it intends to act on once it decides what acting on them means.",
    "Young Copper Dragon": "A young copper dragon has found that jokes work and has decided to build an entire worldview around this discovery — testing its material on every creature it encounters with the sincerity of something that genuinely finds existence funny.",
    "Young Gold Dragon": "A young gold dragon carries the weight of its species' goodness before it has fully grown into it — earnest, occasionally overconfident, and absolutely certain that the right thing to do and the effective thing to do are the same thing, which is an assumption that experience will complicate.",
    "Young Green Dragon": "A young green dragon is still perfecting the manipulation it will one day execute effortlessly — practicing deception on smaller creatures, building its network of obligations, acquiring leverage in preparation for the long game it intends to play once it is old enough to play it without being caught.",
    "Young Red Dragon": "A young red dragon has all its elder's arrogance and none of its patience, which makes it both more reckless and more immediately dangerous — it has not yet learned to let threats come to it, so it goes to the threats, loudly.",
    "Young Red Shadow Dragon": "A red dragon twisted by prolonged exposure to the Shadowfell, the young red shadow dragon breathes fire cold enough to kill hope — a chromatic and shadow nature fused into something that burns with a flame whose light illuminates nothing.",
    "Young Remorhaz": "Not yet large enough to swallow a person whole, the young remorhaz compensates with the same scalding body heat as its elders — a smaller thermal event moving through arctic terrain toward the nearest warm-blooded thing.",
    "Young White Dragon": "A young white dragon is cold, fast, and operating entirely on instinct — it hasn't had time to develop the cunning of older dragons, which means it attacks directly and continuously, relying on cold breath and savagery to close every argument it starts.",
    "Yuan-ti Abomination": "Almost entirely serpent, the abomination has crossed past the threshold where yuan-ti pretend to human sympathies — all the cold intelligence and none of the disguise, a creature that has transcended the need to pretend it values warm-blooded life.",
    "Yuan-ti Malison": "A yuan-ti at the midpoint of its sacred transformation, partially serpent and committed to completing the process — the malison exists in a state of becoming that it does not experience as incomplete but as consecrated.",
    "Yuan-ti Pureblood": "Indistinguishable from humans until examined closely, yuan-ti purebloods operate as the snake cult's face in the world above, using their near-human form to infiltrate, recruit, and position the cult's coils around institutions that don't yet know they've been entered.",
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
