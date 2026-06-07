# seed-monsters.ps1 - Seeds data/monsters/ with all Monster Manual templates
# Skips files that already exist. Safe to re-run.
# Usage: .\scripts\seed-monsters.ps1 [-WhatIf]

param([switch]$WhatIf)

$root    = Resolve-Path "$PSScriptRoot\.."
$outDir  = Join-Path $root "data\monsters"

$monsters = @(
  # --- CR 0 ---
  @{ name="Awakened Shrub";       creature_type="plant";      cr="0";   size="small";      alignment="neutral";        habitats=@("forests","gardens","druids groves") }
  @{ name="Baboon";               creature_type="beast";      cr="0";   size="small";      alignment="unaligned";      habitats=@("jungles","tropical forests","plains") }
  @{ name="Badger";               creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("forests","grasslands","underground") }
  @{ name="Bat";                  creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("caves","ruins","forests") }
  @{ name="Cat";                  creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("urban","farms","ruins") }
  @{ name="Commoner";             creature_type="humanoid";   cr="0";   size="medium";     alignment="any alignment";  habitats=@("cities","towns","villages","farms") }
  @{ name="Crab";                 creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("coastlines","tidal pools","shallow water") }
  @{ name="Crawling Claw";        creature_type="undead";     cr="0";   size="tiny";       alignment="neutral evil";   habitats=@("dungeons","tombs","wizard towers") }
  @{ name="Deer";                 creature_type="beast";      cr="0";   size="medium";     alignment="unaligned";      habitats=@("forests","grasslands","hills") }
  @{ name="Eagle";                creature_type="beast";      cr="0";   size="small";      alignment="unaligned";      habitats=@("mountains","coastlines","plains") }
  @{ name="Frog";                 creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("swamps","rivers","lakes") }
  @{ name="Giant Fire Beetle";    creature_type="beast";      cr="0";   size="small";      alignment="unaligned";      habitats=@("underground","dungeons","caves") }
  @{ name="Goat";                 creature_type="beast";      cr="0";   size="medium";     alignment="unaligned";      habitats=@("mountains","hills","farms") }
  @{ name="Hawk";                 creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("forests","plains","mountains") }
  @{ name="Homunculus";           creature_type="construct";  cr="0";   size="tiny";       alignment="neutral";        habitats=@("wizard towers","laboratories","creators lair") }
  @{ name="Hyena";                creature_type="beast";      cr="0";   size="medium";     alignment="unaligned";      habitats=@("savannas","plains","deserts") }
  @{ name="Jackal";               creature_type="beast";      cr="0";   size="small";      alignment="unaligned";      habitats=@("deserts","savannas","ruins") }
  @{ name="Lemure";               creature_type="fiend";      cr="0";   size="medium";     alignment="lawful evil";    habitats=@("Nine Hells","infernal planes","summoning circles") }
  @{ name="Lizard";               creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("jungles","deserts","swamps") }
  @{ name="Myconid Sprout";       creature_type="plant";      cr="0";   size="small";      alignment="lawful neutral"; habitats=@("underground","caves","underdark") }
  @{ name="Octopus";              creature_type="beast";      cr="0";   size="small";      alignment="unaligned";      habitats=@("oceans","coastal waters","reefs") }
  @{ name="Owl";                  creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("forests","plains","mountains") }
  @{ name="Quipper";              creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("rivers","lakes","coastal waters") }
  @{ name="Rat";                  creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("urban","dungeons","sewers","ruins") }
  @{ name="Raven";                creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("forests","urban","mountains","plains") }
  @{ name="Scorpion";             creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("deserts","ruins","caves") }
  @{ name="Sea Horse";            creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("oceans","coral reefs","coastal waters") }
  @{ name="Shrieker";             creature_type="plant";      cr="0";   size="medium";     alignment="unaligned";      habitats=@("underground","caves","underdark") }
  @{ name="Spider";               creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("dungeons","forests","ruins","urban") }
  @{ name="Vulture";              creature_type="beast";      cr="0";   size="medium";     alignment="unaligned";      habitats=@("deserts","savannas","plains") }
  @{ name="Weasel";               creature_type="beast";      cr="0";   size="tiny";       alignment="unaligned";      habitats=@("forests","plains","urban") }
  # --- CR 1/8 ---
  @{ name="Bandit";               creature_type="humanoid";   cr="1/8"; size="medium";     alignment="any non-lawful"; habitats=@("roads","forests","ruins","border towns") }
  @{ name="Blood Hawk";           creature_type="beast";      cr="1/8"; size="small";      alignment="unaligned";      habitats=@("mountains","coastlines","plains") }
  @{ name="Camel";                creature_type="beast";      cr="1/8"; size="large";      alignment="unaligned";      habitats=@("deserts","plains","trade routes") }
  @{ name="Cultist";              creature_type="humanoid";   cr="1/8"; size="medium";     alignment="any non-good";   habitats=@("cult lairs","dungeons","urban hideouts") }
  @{ name="Flumph";               creature_type="aberration"; cr="1/8"; size="small";      alignment="lawful good";    habitats=@("underdark","deep underground") }
  @{ name="Flying Snake";         creature_type="beast";      cr="1/8"; size="tiny";       alignment="unaligned";      habitats=@("jungles","swamps","ruins") }
  @{ name="Giant Crab";           creature_type="beast";      cr="1/8"; size="medium";     alignment="unaligned";      habitats=@("coastlines","beaches","tidal caves") }
  @{ name="Giant Rat";            creature_type="beast";      cr="1/8"; size="small";      alignment="unaligned";      habitats=@("sewers","dungeons","ruins","urban") }
  @{ name="Giant Weasel";         creature_type="beast";      cr="1/8"; size="medium";     alignment="unaligned";      habitats=@("forests","plains","underground") }
  @{ name="Guard";                creature_type="humanoid";   cr="1/8"; size="medium";     alignment="any alignment";  habitats=@("cities","towns","keeps","roads") }
  @{ name="Kobold";               creature_type="humanoid";   cr="1/8"; size="small";      alignment="lawful evil";    habitats=@("caves","dungeons","underground","mountains") }
  @{ name="Manes";                creature_type="fiend";      cr="1/8"; size="small";      alignment="chaotic evil";   habitats=@("Abyss","demon lairs") }
  @{ name="Mastiff";              creature_type="beast";      cr="1/8"; size="medium";     alignment="unaligned";      habitats=@("urban","farms","keeps") }
  @{ name="Merfolk";              creature_type="humanoid";   cr="1/8"; size="medium";     alignment="neutral";        habitats=@("oceans","coastal waters","reefs") }
  @{ name="Monodrone";            creature_type="construct";  cr="1/8"; size="medium";     alignment="lawful neutral"; habitats=@("mechanus") }
  @{ name="Mule";                 creature_type="beast";      cr="1/8"; size="medium";     alignment="unaligned";      habitats=@("roads","farms","towns") }
  @{ name="Noble";                creature_type="humanoid";   cr="1/8"; size="medium";     alignment="any alignment";  habitats=@("cities","manors","courts") }
  @{ name="Poisonous Snake";      creature_type="beast";      cr="1/8"; size="tiny";       alignment="unaligned";      habitats=@("jungles","swamps","grasslands","deserts") }
  @{ name="Pony";                 creature_type="beast";      cr="1/8"; size="medium";     alignment="unaligned";      habitats=@("farms","roads","stables") }
  @{ name="Slaad Tadpole";        creature_type="aberration"; cr="1/8"; size="tiny";       alignment="chaotic neutral";habitats=@("limbo","slaad lairs","bodies of infected hosts") }
  @{ name="Stirge";               creature_type="beast";      cr="1/8"; size="tiny";       alignment="unaligned";      habitats=@("swamps","dungeons","ruins","forests") }
  @{ name="Tribal Warrior";       creature_type="humanoid";   cr="1/8"; size="medium";     alignment="any alignment";  habitats=@("wilderness","plains","forests","tundra") }
  @{ name="Twig Blight";          creature_type="plant";      cr="1/8"; size="small";      alignment="neutral evil";   habitats=@("forests","swamps","blighted land") }
  # --- CR 1/4 ---
  @{ name="Aarakocra";            creature_type="humanoid";   cr="1/4"; size="medium";     alignment="neutral good";   habitats=@("mountains","high peaks","elemental plane of air") }
  @{ name="Acolyte";              creature_type="humanoid";   cr="1/4"; size="medium";     alignment="any alignment";  habitats=@("temples","shrines","cities","towns") }
  @{ name="Axe Beak";             creature_type="beast";      cr="1/4"; size="large";      alignment="unaligned";      habitats=@("plains","savannas","tundra") }
  @{ name="Blink Dog";            creature_type="fey";        cr="1/4"; size="medium";     alignment="lawful good";    habitats=@("forests","feywild","plains") }
  @{ name="Boar";                 creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("forests","plains","hills") }
  @{ name="Bullywug";             creature_type="humanoid";   cr="1/4"; size="medium";     alignment="neutral evil";   habitats=@("swamps","bogs","marshes","fetid rivers") }
  @{ name="Constrictor Snake";    creature_type="beast";      cr="1/4"; size="large";      alignment="unaligned";      habitats=@("jungles","swamps","forests") }
  @{ name="Draft Horse";          creature_type="beast";      cr="1/4"; size="large";      alignment="unaligned";      habitats=@("farms","roads","cities") }
  @{ name="Dretch";               creature_type="fiend";      cr="1/4"; size="small";      alignment="chaotic evil";   habitats=@("Abyss","demon lairs") }
  @{ name="Drow";                 creature_type="humanoid";   cr="1/4"; size="medium";     alignment="neutral evil";   habitats=@("underdark","drow cities","deep caves") }
  @{ name="Duodrone";             creature_type="construct";  cr="1/4"; size="medium";     alignment="lawful neutral"; habitats=@("mechanus") }
  @{ name="Elk";                  creature_type="beast";      cr="1/4"; size="large";      alignment="unaligned";      habitats=@("forests","plains","mountains","tundra") }
  @{ name="Flying Sword";         creature_type="construct";  cr="1/4"; size="small";      alignment="unaligned";      habitats=@("dungeons","wizard towers","armories") }
  @{ name="Giant Badger";         creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("forests","plains","underground") }
  @{ name="Giant Bat";            creature_type="beast";      cr="1/4"; size="large";      alignment="unaligned";      habitats=@("caves","ruins","forests") }
  @{ name="Giant Centipede";      creature_type="beast";      cr="1/4"; size="small";      alignment="unaligned";      habitats=@("dungeons","caves","ruins","underground") }
  @{ name="Giant Frog";           creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("swamps","rivers","lakes","bogs") }
  @{ name="Giant Lizard";         creature_type="beast";      cr="1/4"; size="large";      alignment="unaligned";      habitats=@("jungles","swamps","deserts","underground") }
  @{ name="Giant Owl";            creature_type="beast";      cr="1/4"; size="large";      alignment="neutral";        habitats=@("forests","plains","mountains") }
  @{ name="Giant Poisonous Snake"; creature_type="beast";     cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("jungles","swamps","deserts") }
  @{ name="Giant Wolf Spider";    creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("dungeons","forests","caves") }
  @{ name="Goblin";               creature_type="humanoid";   cr="1/4"; size="small";      alignment="neutral evil";   habitats=@("caves","dungeons","ruins","forests") }
  @{ name="Grimlock";             creature_type="humanoid";   cr="1/4"; size="medium";     alignment="neutral evil";   habitats=@("underdark","deep caves") }
  @{ name="Kenku";                creature_type="humanoid";   cr="1/4"; size="medium";     alignment="chaotic neutral";habitats=@("urban","forests","ruins") }
  @{ name="Kuo-toa";              creature_type="humanoid";   cr="1/4"; size="medium";     alignment="neutral evil";   habitats=@("underdark","underground lakes","deep water temples") }
  @{ name="Mud Mephit";           creature_type="elemental";  cr="1/4"; size="small";      alignment="neutral evil";   habitats=@("swamps","bogs","elemental planes") }
  @{ name="Needle Blight";        creature_type="plant";      cr="1/4"; size="small";      alignment="neutral evil";   habitats=@("forests","blighted land") }
  @{ name="Panther";              creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("jungles","forests","plains") }
  @{ name="Pixie";                creature_type="fey";        cr="1/4"; size="tiny";       alignment="neutral good";   habitats=@("feywild","magical forests","ancient groves") }
  @{ name="Pseudodragon";         creature_type="dragon";     cr="1/4"; size="tiny";       alignment="neutral good";   habitats=@("forests","ruins","wizard towers") }
  @{ name="Pteranodon";           creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("coastlines","jungles","plains") }
  @{ name="Riding Horse";         creature_type="beast";      cr="1/4"; size="large";      alignment="unaligned";      habitats=@("plains","roads","stables") }
  @{ name="Skeleton";             creature_type="undead";     cr="1/4"; size="medium";     alignment="lawful evil";    habitats=@("tombs","ruins","dungeons","battlefields") }
  @{ name="Smoke Mephit";         creature_type="elemental";  cr="1/4"; size="small";      alignment="neutral evil";   habitats=@("volcanoes","foundries","elemental chaos") }
  @{ name="Sprite";               creature_type="fey";        cr="1/4"; size="tiny";       alignment="neutral good";   habitats=@("feywild","magical forests","ancient groves") }
  @{ name="Steam Mephit";         creature_type="elemental";  cr="1/4"; size="small";      alignment="neutral evil";   habitats=@("hot springs","volcanoes","foundries") }
  @{ name="Swarm of Bats";        creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("caves","ruins","crypts","dense forests") }
  @{ name="Swarm of Rats";        creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("sewers","dungeons","ruins","urban") }
  @{ name="Swarm of Ravens";      creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("forests","plains","ruins","rooftops") }
  @{ name="Troglodyte";           creature_type="humanoid";   cr="1/4"; size="medium";     alignment="chaotic evil";   habitats=@("underground","caves","underdark") }
  @{ name="Violet Fungus";        creature_type="plant";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("underground","dungeons","caves") }
  @{ name="Winged Kobold";        creature_type="humanoid";   cr="1/4"; size="small";      alignment="lawful evil";    habitats=@("caves","mountains","ruins") }
  @{ name="Wolf";                 creature_type="beast";      cr="1/4"; size="medium";     alignment="unaligned";      habitats=@("forests","plains","hills","tundra") }
  @{ name="Zombie";               creature_type="undead";     cr="1/4"; size="medium";     alignment="neutral evil";   habitats=@("graveyards","crypts","dungeons","ruins") }
  # --- CR 1/2 ---
  @{ name="Ape";                  creature_type="beast";      cr="1/2"; size="medium";     alignment="unaligned";      habitats=@("jungles","forests","mountains") }
  @{ name="Black Bear";           creature_type="beast";      cr="1/2"; size="medium";     alignment="unaligned";      habitats=@("forests","mountains","hills") }
  @{ name="Cockatrice";           creature_type="monstrosity";cr="1/2"; size="small";      alignment="unaligned";      habitats=@("plains","forests","ruins") }
  @{ name="Crocodile";            creature_type="beast";      cr="1/2"; size="large";      alignment="unaligned";      habitats=@("swamps","rivers","jungles") }
  @{ name="Darkmantle";           creature_type="monstrosity";cr="1/2"; size="small";      alignment="unaligned";      habitats=@("underground","caves","dungeons") }
  @{ name="Deep Gnome";           creature_type="humanoid";   cr="1/2"; size="small";      alignment="neutral good";   habitats=@("underdark","deep mines","underground cities") }
  @{ name="Dust Mephit";          creature_type="elemental";  cr="1/2"; size="small";      alignment="neutral evil";   habitats=@("deserts","elemental plane of earth") }
  @{ name="Gas Spore";            creature_type="plant";      cr="1/2"; size="large";      alignment="unaligned";      habitats=@("dungeons","underground","underdark") }
  @{ name="Giant Goat";           creature_type="beast";      cr="1/2"; size="large";      alignment="unaligned";      habitats=@("mountains","hills","plains") }
  @{ name="Giant Sea Horse";      creature_type="beast";      cr="1/2"; size="large";      alignment="unaligned";      habitats=@("oceans","coastal waters","reefs") }
  @{ name="Giant Wasp";           creature_type="beast";      cr="1/2"; size="medium";     alignment="unaligned";      habitats=@("forests","plains","ruins") }
  @{ name="Gnoll";                creature_type="humanoid";   cr="1/2"; size="medium";     alignment="chaotic evil";   habitats=@("plains","savannas","ruins","wilderness") }
  @{ name="Gray Ooze";            creature_type="ooze";       cr="1/2"; size="medium";     alignment="unaligned";      habitats=@("dungeons","caves","ruins","underground") }
  @{ name="Hobgoblin";            creature_type="humanoid";   cr="1/2"; size="medium";     alignment="lawful evil";    habitats=@("ruins","dungeons","borderlands","fortresses") }
  @{ name="Ice Mephit";           creature_type="elemental";  cr="1/2"; size="small";      alignment="neutral evil";   habitats=@("tundra","glaciers","elemental plane of ice") }
  @{ name="Jackalwere";           creature_type="humanoid";   cr="1/2"; size="medium";     alignment="chaotic evil";   habitats=@("deserts","plains","trade routes") }
  @{ name="Lizardfolk";           creature_type="humanoid";   cr="1/2"; size="medium";     alignment="neutral";        habitats=@("swamps","jungles","rivers","coastal areas") }
  @{ name="Magma Mephit";         creature_type="elemental";  cr="1/2"; size="small";      alignment="neutral evil";   habitats=@("volcanoes","lava fields","elemental chaos") }
  @{ name="Magmin";               creature_type="elemental";  cr="1/2"; size="small";      alignment="chaotic neutral";habitats=@("volcanoes","elemental plane of fire") }
  @{ name="Myconid Adult";        creature_type="plant";      cr="1/2"; size="medium";     alignment="lawful neutral"; habitats=@("underdark","underground forests","caves") }
  @{ name="Orc";                  creature_type="humanoid";   cr="1/2"; size="medium";     alignment="chaotic evil";   habitats=@("mountains","forests","ruins","borderlands") }
  @{ name="Piercer";              creature_type="monstrosity";cr="1/2"; size="medium";     alignment="unaligned";      habitats=@("underground","caves","dungeons") }
  @{ name="Reef Shark";           creature_type="beast";      cr="1/2"; size="medium";     alignment="unaligned";      habitats=@("coastal waters","reefs","shallow seas") }
  @{ name="Rust Monster";         creature_type="monstrosity";cr="1/2"; size="medium";     alignment="unaligned";      habitats=@("underground","dungeons","caves") }
  @{ name="Sahuagin";             creature_type="humanoid";   cr="1/2"; size="medium";     alignment="lawful evil";    habitats=@("oceans","coastal waters","underwater temples") }
  @{ name="Satyr";                creature_type="fey";        cr="1/2"; size="medium";     alignment="chaotic neutral";habitats=@("feywild","magical forests","ancient groves") }
  @{ name="Scout";                creature_type="humanoid";   cr="1/2"; size="medium";     alignment="any alignment";  habitats=@("wilderness","forests","border regions","mountain passes") }
  @{ name="Shadow";               creature_type="undead";     cr="1/2"; size="medium";     alignment="chaotic evil";   habitats=@("ruins","dungeons","dark forests","cursed locations") }
  @{ name="Swarm of Insects";     creature_type="beast";      cr="1/2"; size="medium";     alignment="unaligned";      habitats=@("forests","swamps","plains","underground") }
  @{ name="Thug";                 creature_type="humanoid";   cr="1/2"; size="medium";     alignment="any non-good";   habitats=@("urban","cities","docks","criminal lairs") }
  @{ name="Tridrone";             creature_type="construct";  cr="1/2"; size="medium";     alignment="lawful neutral"; habitats=@("mechanus") }
  @{ name="Vine Blight";          creature_type="plant";      cr="1/2"; size="medium";     alignment="neutral evil";   habitats=@("forests","swamps","blighted land") }
  @{ name="Warhorse";             creature_type="beast";      cr="1/2"; size="large";      alignment="unaligned";      habitats=@("plains","keeps","stables") }
  @{ name="Warhorse Skeleton";    creature_type="undead";     cr="1/2"; size="large";      alignment="lawful evil";    habitats=@("battlefields","dungeons","death knight lairs") }
  @{ name="Worg";                 creature_type="monstrosity";cr="1/2"; size="large";      alignment="neutral evil";   habitats=@("plains","forests","goblinoid territories") }
  # --- CR 1 ---
  @{ name="Animated Armor";       creature_type="construct";  cr="1";   size="medium";     alignment="unaligned";      habitats=@("dungeons","wizard towers","armories","keeps") }
  @{ name="Brass Dragon Wyrmling";creature_type="dragon";     cr="1";   size="medium";     alignment="chaotic good";   habitats=@("deserts","sandy ruins") }
  @{ name="Brown Bear";           creature_type="beast";      cr="1";   size="large";      alignment="unaligned";      habitats=@("forests","hills","mountains","tundra") }
  @{ name="Bugbear";              creature_type="humanoid";   cr="1";   size="medium";     alignment="chaotic evil";   habitats=@("forests","dungeons","ruins","goblinoid territories") }
  @{ name="Copper Dragon Wyrmling";creature_type="dragon";    cr="1";   size="medium";     alignment="chaotic good";   habitats=@("hills","rocky terrain") }
  @{ name="Death Dog";            creature_type="monstrosity";cr="1";   size="medium";     alignment="neutral evil";   habitats=@("deserts","plains","tombs") }
  @{ name="Dire Wolf";            creature_type="beast";      cr="1";   size="large";      alignment="unaligned";      habitats=@("forests","hills","mountains","tundra") }
  @{ name="Dryad";                creature_type="fey";        cr="1";   size="medium";     alignment="neutral";        habitats=@("forests","ancient groves","feywild") }
  @{ name="Duergar";              creature_type="humanoid";   cr="1";   size="medium";     alignment="lawful evil";    habitats=@("underdark","deep mines","duergar cities") }
  @{ name="Faerie Dragon";        creature_type="dragon";     cr="1";   size="tiny";       alignment="chaotic good";   habitats=@("feywild","magical forests","ancient groves") }
  @{ name="Fire Snake";           creature_type="elemental";  cr="1";   size="medium";     alignment="neutral evil";   habitats=@("volcanoes","elemental plane of fire","fire giant lairs") }
  @{ name="Ghoul";                creature_type="undead";     cr="1";   size="medium";     alignment="chaotic evil";   habitats=@("graveyards","crypts","dungeons","underdark") }
  @{ name="Giant Eagle";          creature_type="beast";      cr="1";   size="large";      alignment="neutral good";   habitats=@("mountains","high cliffs","plains") }
  @{ name="Giant Hyena";          creature_type="beast";      cr="1";   size="large";      alignment="unaligned";      habitats=@("plains","savannas","deserts") }
  @{ name="Giant Octopus";        creature_type="beast";      cr="1";   size="large";      alignment="unaligned";      habitats=@("oceans","coastal waters","deep water") }
  @{ name="Giant Spider";         creature_type="beast";      cr="1";   size="large";      alignment="unaligned";      habitats=@("dungeons","caves","dense forests","ruins") }
  @{ name="Giant Toad";           creature_type="beast";      cr="1";   size="large";      alignment="unaligned";      habitats=@("swamps","rivers","dungeons") }
  @{ name="Giant Vulture";        creature_type="beast";      cr="1";   size="large";      alignment="neutral evil";   habitats=@("deserts","plains","savannas") }
  @{ name="Goblin Boss";          creature_type="humanoid";   cr="1";   size="small";      alignment="neutral evil";   habitats=@("caves","dungeons","ruins") }
  @{ name="Half-Ogre";            creature_type="giant";      cr="1";   size="large";      alignment="chaotic evil";   habitats=@("mountains","ruins","ogre territory") }
  @{ name="Harpy";                creature_type="monstrosity";cr="1";   size="medium";     alignment="chaotic evil";   habitats=@("coastal cliffs","ruins","mountains") }
  @{ name="Hippogriff";           creature_type="monstrosity";cr="1";   size="large";      alignment="unaligned";      habitats=@("mountains","plains","hills") }
  @{ name="Imp";                  creature_type="fiend";      cr="1";   size="tiny";       alignment="lawful evil";    habitats=@("infernal lairs","wizard towers","urban hideouts") }
  @{ name="Kuo-toa Whip";         creature_type="humanoid";   cr="1";   size="medium";     alignment="neutral evil";   habitats=@("underdark","underground lakes") }
  @{ name="Lion";                 creature_type="beast";      cr="1";   size="large";      alignment="unaligned";      habitats=@("savannas","plains","grasslands") }
  @{ name="Quadrone";             creature_type="construct";  cr="1";   size="medium";     alignment="lawful neutral"; habitats=@("mechanus") }
  @{ name="Quaggoth Spore Servant";creature_type="plant";     cr="1";   size="medium";     alignment="unaligned";      habitats=@("underdark","myconid colonies") }
  @{ name="Quasit";               creature_type="fiend";      cr="1";   size="tiny";       alignment="chaotic evil";   habitats=@("Abyss","wizard towers","chaotic evil lairs") }
  @{ name="Scarecrow";            creature_type="construct";  cr="1";   size="medium";     alignment="chaotic evil";   habitats=@("farms","fields","crossroads","cursed land") }
  @{ name="Specter";              creature_type="undead";     cr="1";   size="medium";     alignment="chaotic evil";   habitats=@("haunted ruins","cursed sites","manors") }
  @{ name="Spy";                  creature_type="humanoid";   cr="1";   size="medium";     alignment="any alignment";  habitats=@("urban","courts","thieves guilds","cities") }
  @{ name="Swarm of Quippers";    creature_type="beast";      cr="1";   size="medium";     alignment="unaligned";      habitats=@("rivers","lakes","coastal waters") }
  @{ name="Thri-kreen";           creature_type="humanoid";   cr="1";   size="medium";     alignment="chaotic neutral";habitats=@("deserts","plains","savannas") }
  @{ name="Tiger";                creature_type="beast";      cr="1";   size="large";      alignment="unaligned";      habitats=@("jungles","forests","plains") }
  @{ name="Yuan-ti Pureblood";    creature_type="humanoid";   cr="1";   size="medium";     alignment="neutral evil";   habitats=@("jungles","desert ruins","yuan-ti temples") }
  # --- CR 2 ---
  @{ name="Allosaurus";           creature_type="beast";      cr="2";   size="large";      alignment="unaligned";      habitats=@("jungles","plains","prehistoric regions") }
  @{ name="Ankheg";               creature_type="monstrosity";cr="2";   size="large";      alignment="unaligned";      habitats=@("plains","farmland","underground") }
  @{ name="Awakened Tree";        creature_type="plant";      cr="2";   size="huge";       alignment="unaligned";      habitats=@("forests","ancient groves","druids territories") }
  @{ name="Azer";                 creature_type="elemental";  cr="2";   size="medium";     alignment="lawful neutral"; habitats=@("elemental plane of fire","fire giant citadels") }
  @{ name="Bandit Captain";       creature_type="humanoid";   cr="2";   size="medium";     alignment="any non-lawful"; habitats=@("roads","dungeons","ruins","criminal lairs") }
  @{ name="Berserker";            creature_type="humanoid";   cr="2";   size="medium";     alignment="any chaotic";    habitats=@("tundra","wilderness","tribal lands") }
  @{ name="Black Dragon Wyrmling";creature_type="dragon";     cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("swamps","flooded ruins") }
  @{ name="Bronze Dragon Wyrmling";creature_type="dragon";    cr="2";   size="medium";     alignment="lawful good";    habitats=@("coastlines","islands","sea cliffs") }
  @{ name="Carrion Crawler";      creature_type="monstrosity";cr="2";   size="large";      alignment="unaligned";      habitats=@("dungeons","underground","caverns") }
  @{ name="Centaur";              creature_type="monstrosity";cr="2";   size="large";      alignment="neutral good";   habitats=@("forests","plains","feywild") }
  @{ name="Cult Fanatic";         creature_type="humanoid";   cr="2";   size="medium";     alignment="any non-good";   habitats=@("cult lairs","temples","dungeons") }
  @{ name="Druid";                creature_type="humanoid";   cr="2";   size="medium";     alignment="any alignment";  habitats=@("forests","plains","swamps","wilderness") }
  @{ name="Ettercap";             creature_type="monstrosity";cr="2";   size="medium";     alignment="neutral evil";   habitats=@("forests","ruins","spider-infested areas") }
  @{ name="Gargoyle";             creature_type="elemental";  cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("ruins","castles","mountainsides","urban rooftops") }
  @{ name="Gelatinous Cube";      creature_type="ooze";       cr="2";   size="large";      alignment="unaligned";      habitats=@("dungeons","underground corridors") }
  @{ name="Ghast";                creature_type="undead";     cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("graveyards","crypts","underdark") }
  @{ name="Giant Boar";           creature_type="beast";      cr="2";   size="large";      alignment="unaligned";      habitats=@("forests","plains","hills") }
  @{ name="Giant Constrictor Snake";creature_type="beast";    cr="2";   size="huge";       alignment="unaligned";      habitats=@("jungles","swamps","forests") }
  @{ name="Giant Elk";            creature_type="beast";      cr="2";   size="huge";       alignment="unaligned";      habitats=@("forests","plains","mountains","tundra") }
  @{ name="Gibbering Mouther";    creature_type="aberration"; cr="2";   size="medium";     alignment="neutral";        habitats=@("underdark","dungeons","far realm rifts") }
  @{ name="Githzerai Monk";       creature_type="humanoid";   cr="2";   size="medium";     alignment="lawful neutral"; habitats=@("limbo","githzerai monasteries") }
  @{ name="Gnoll Pack Lord";      creature_type="humanoid";   cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("plains","ruins","wilderness") }
  @{ name="Green Dragon Wyrmling";creature_type="dragon";     cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("forests","hills") }
  @{ name="Grick";                creature_type="monstrosity";cr="2";   size="medium";     alignment="neutral";        habitats=@("dungeons","underground","caves") }
  @{ name="Griffon";              creature_type="monstrosity";cr="2";   size="large";      alignment="unaligned";      habitats=@("mountains","hills","plains") }
  @{ name="Hunter Shark";         creature_type="beast";      cr="2";   size="large";      alignment="unaligned";      habitats=@("oceans","coastal waters") }
  @{ name="Intellect Devourer";   creature_type="aberration"; cr="2";   size="tiny";       alignment="lawful evil";    habitats=@("underdark","mind flayer colonies") }
  @{ name="Lizardfolk Shaman";    creature_type="humanoid";   cr="2";   size="medium";     alignment="neutral";        habitats=@("swamps","jungles","rivers") }
  @{ name="Merrow";               creature_type="monstrosity";cr="2";   size="large";      alignment="chaotic evil";   habitats=@("oceans","coastal waters","underwater caves") }
  @{ name="Mimic";                creature_type="monstrosity";cr="2";   size="medium";     alignment="neutral";        habitats=@("dungeons","ruins","underground") }
  @{ name="Minotaur Skeleton";    creature_type="undead";     cr="2";   size="large";      alignment="lawful evil";    habitats=@("dungeons","labyrinths","tombs") }
  @{ name="Myconid Sovereign";    creature_type="plant";      cr="2";   size="large";      alignment="lawful neutral"; habitats=@("underdark","myconid colonies","deep caves") }
  @{ name="Nothic";               creature_type="aberration"; cr="2";   size="medium";     alignment="neutral evil";   habitats=@("dungeons","ruins","wizard towers") }
  @{ name="Ochre Jelly";          creature_type="ooze";       cr="2";   size="large";      alignment="unaligned";      habitats=@("dungeons","caves","underground") }
  @{ name="Ogre";                 creature_type="giant";      cr="2";   size="large";      alignment="chaotic evil";   habitats=@("mountains","hills","caves","ruins") }
  @{ name="Ogre Zombie";          creature_type="undead";     cr="2";   size="large";      alignment="neutral evil";   habitats=@("dungeons","ruins","battlefields") }
  @{ name="Orc Eye of Gruumsh";   creature_type="humanoid";   cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("mountains","plains","orc strongholds") }
  @{ name="Orog";                 creature_type="humanoid";   cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("mountains","orc strongholds","ruins") }
  @{ name="Pegasus";              creature_type="celestial";  cr="2";   size="large";      alignment="chaotic good";   habitats=@("mountains","plains","celestial realms") }
  @{ name="Pentadrone";           creature_type="construct";  cr="2";   size="large";      alignment="lawful neutral"; habitats=@("mechanus") }
  @{ name="Peryton";              creature_type="monstrosity";cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("mountains","coastlines","ruins") }
  @{ name="Plesiosaurus";         creature_type="beast";      cr="2";   size="large";      alignment="unaligned";      habitats=@("oceans","large lakes","rivers") }
  @{ name="Polar Bear";           creature_type="beast";      cr="2";   size="large";      alignment="unaligned";      habitats=@("tundra","glaciers","arctic coastlines") }
  @{ name="Poltergeist";          creature_type="undead";     cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("haunted ruins","cursed sites","manors") }
  @{ name="Priest";               creature_type="humanoid";   cr="2";   size="medium";     alignment="any alignment";  habitats=@("temples","cities","towns","shrines") }
  @{ name="Quaggoth";             creature_type="humanoid";   cr="2";   size="medium";     alignment="chaotic neutral";habitats=@("underdark","drow cities","underground") }
  @{ name="Rhinoceros";           creature_type="beast";      cr="2";   size="large";      alignment="unaligned";      habitats=@("plains","savannas","grasslands") }
  @{ name="Rug of Smothering";    creature_type="construct";  cr="2";   size="large";      alignment="unaligned";      habitats=@("dungeons","wizard towers","manors") }
  @{ name="Saber-Toothed Tiger";  creature_type="beast";      cr="2";   size="large";      alignment="unaligned";      habitats=@("tundra","plains","forests") }
  @{ name="Sahuagin Priestess";   creature_type="humanoid";   cr="2";   size="medium";     alignment="lawful evil";    habitats=@("oceans","underwater temples") }
  @{ name="Sea Hag";              creature_type="fey";        cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("coastal caves","swamps","dark waters") }
  @{ name="Silver Dragon Wyrmling";creature_type="dragon";    cr="2";   size="small";      alignment="lawful good";    habitats=@("mountains","high peaks","clouds") }
  @{ name="Spined Devil";         creature_type="fiend";      cr="2";   size="small";      alignment="lawful evil";    habitats=@("Nine Hells","devil lairs") }
  @{ name="Swarm of Poisonous Snakes";creature_type="beast";  cr="2";   size="medium";     alignment="unaligned";      habitats=@("jungles","swamps","ruins") }
  @{ name="Wererat";              creature_type="humanoid";   cr="2";   size="medium";     alignment="lawful evil";    habitats=@("urban","sewers","cities","underground") }
  @{ name="White Dragon Wyrmling";creature_type="dragon";     cr="2";   size="medium";     alignment="chaotic evil";   habitats=@("tundra","glaciers","mountains") }
  @{ name="Will-o-Wisp";          creature_type="undead";     cr="2";   size="tiny";       alignment="chaotic evil";   habitats=@("swamps","bogs","haunted forests","blighted wetlands") }
  # --- CR 3 ---
  @{ name="Ankylosaurus";         creature_type="beast";      cr="3";   size="huge";       alignment="unaligned";      habitats=@("plains","prehistoric regions","jungles") }
  @{ name="Basilisk";             creature_type="monstrosity";cr="3";   size="medium";     alignment="unaligned";      habitats=@("underground","plains","deserts") }
  @{ name="Bearded Devil";        creature_type="fiend";      cr="3";   size="medium";     alignment="lawful evil";    habitats=@("Nine Hells","devil summoning sites","battlefields") }
  @{ name="Blue Dragon Wyrmling"; creature_type="dragon";     cr="3";   size="medium";     alignment="lawful evil";    habitats=@("deserts","plains") }
  @{ name="Bugbear Chief";        creature_type="humanoid";   cr="3";   size="medium";     alignment="chaotic evil";   habitats=@("forests","dungeons","goblinoid strongholds") }
  @{ name="Displacer Beast";      creature_type="monstrosity";cr="3";   size="large";      alignment="lawful evil";    habitats=@("forests","plains","feywild") }
  @{ name="Doppelganger";         creature_type="monstrosity";cr="3";   size="medium";     alignment="neutral";        habitats=@("urban","cities","courts","thieves guilds") }
  @{ name="Giant Scorpion";       creature_type="beast";      cr="3";   size="large";      alignment="unaligned";      habitats=@("deserts","plains","ruins") }
  @{ name="Githyanki Warrior";    creature_type="humanoid";   cr="3";   size="medium";     alignment="lawful evil";    habitats=@("astral plane","githyanki strongholds") }
  @{ name="Gold Dragon Wyrmling"; creature_type="dragon";     cr="3";   size="medium";     alignment="lawful good";    habitats=@("plains","hills","near human settlements") }
  @{ name="Green Hag";            creature_type="fey";        cr="3";   size="medium";     alignment="neutral evil";   habitats=@("swamps","dark forests","blighted lands") }
  @{ name="Grell";                creature_type="aberration"; cr="3";   size="medium";     alignment="neutral evil";   habitats=@("underdark","dungeons","deep caves") }
  @{ name="Hell Hound";           creature_type="fiend";      cr="3";   size="medium";     alignment="lawful evil";    habitats=@("Nine Hells","fire giant lairs","devil strongholds") }
  @{ name="Hobgoblin Captain";    creature_type="humanoid";   cr="3";   size="medium";     alignment="lawful evil";    habitats=@("fortresses","ruins","borderlands") }
  @{ name="Hook Horror";          creature_type="monstrosity";cr="3";   size="large";      alignment="neutral";        habitats=@("underdark","deep caves","underground") }
  @{ name="Killer Whale";         creature_type="beast";      cr="3";   size="huge";       alignment="unaligned";      habitats=@("oceans","arctic seas") }
  @{ name="Knight";               creature_type="humanoid";   cr="3";   size="medium";     alignment="any alignment";  habitats=@("cities","keeps","battlefields","roads") }
  @{ name="Kuo-toa Monitor";      creature_type="humanoid";   cr="3";   size="medium";     alignment="neutral evil";   habitats=@("underdark","kuo-toa temples") }
  @{ name="Manticore";            creature_type="monstrosity";cr="3";   size="large";      alignment="lawful evil";    habitats=@("mountains","plains","deserts") }
  @{ name="Minotaur";             creature_type="monstrosity";cr="3";   size="large";      alignment="chaotic evil";   habitats=@("dungeons","labyrinths","ruins") }
  @{ name="Mummy";                creature_type="undead";     cr="3";   size="medium";     alignment="lawful evil";    habitats=@("tombs","deserts","ancient ruins") }
  @{ name="Nightmare";            creature_type="fiend";      cr="3";   size="large";      alignment="neutral evil";   habitats=@("lower planes","blighted lands","castles of dark lords") }
  @{ name="Owlbear";              creature_type="monstrosity";cr="3";   size="large";      alignment="unaligned";      habitats=@("forests","mountains","plains") }
  @{ name="Phase Spider";         creature_type="monstrosity";cr="3";   size="large";      alignment="unaligned";      habitats=@("dungeons","ruins","planes bordering ethereal") }
  @{ name="Quaggoth Thonot";      creature_type="humanoid";   cr="3";   size="medium";     alignment="chaotic neutral";habitats=@("underdark","quaggoth territory") }
  @{ name="Spectator";            creature_type="aberration"; cr="3";   size="medium";     alignment="lawful neutral"; habitats=@("dungeons","underdark","beholder territory") }
  @{ name="Veteran";              creature_type="humanoid";   cr="3";   size="medium";     alignment="any alignment";  habitats=@("cities","keeps","roads","mercenary companies") }
  @{ name="Water Weird";          creature_type="elemental";  cr="3";   size="large";      alignment="neutral";        habitats=@("ancient pools","flooded ruins","wells") }
  @{ name="Werewolf";             creature_type="humanoid";   cr="3";   size="medium";     alignment="chaotic evil";   habitats=@("forests","wilderness","rural villages") }
  @{ name="Wight";                creature_type="undead";     cr="3";   size="medium";     alignment="neutral evil";   habitats=@("ruins","battlefields","tombs","cold wastelands") }
  @{ name="Winter Wolf";          creature_type="monstrosity";cr="3";   size="large";      alignment="neutral evil";   habitats=@("tundra","glaciers","mountains") }
  @{ name="Yeti";                 creature_type="monstrosity";cr="3";   size="large";      alignment="chaotic evil";   habitats=@("mountains","tundra","glaciers") }
  @{ name="Yuan-ti Malison";      creature_type="monstrosity";cr="3";   size="medium";     alignment="neutral evil";   habitats=@("jungles","deserts","yuan-ti temples") }
  # --- CR 4 ---
  @{ name="Banshee";              creature_type="undead";     cr="4";   size="medium";     alignment="chaotic evil";   habitats=@("ruins","haunted manors","sites of tragic death") }
  @{ name="Black Pudding";        creature_type="ooze";       cr="4";   size="large";      alignment="unaligned";      habitats=@("dungeons","underground","caves") }
  @{ name="Bone Naga";            creature_type="undead";     cr="4";   size="large";      alignment="lawful evil";    habitats=@("tombs","dungeons","ancient ruins") }
  @{ name="Chuul";                creature_type="aberration"; cr="4";   size="large";      alignment="chaotic evil";   habitats=@("swamps","coastal areas","ruins") }
  @{ name="Couatl";               creature_type="celestial";  cr="4";   size="medium";     alignment="lawful good";    habitats=@("jungles","ruins","celestial sites") }
  @{ name="Elephant";             creature_type="beast";      cr="4";   size="huge";       alignment="unaligned";      habitats=@("plains","savannas","jungles") }
  @{ name="Ettin";                creature_type="giant";      cr="4";   size="large";      alignment="chaotic evil";   habitats=@("hills","mountains","caves") }
  @{ name="Flameskull";           creature_type="undead";     cr="4";   size="tiny";       alignment="neutral evil";   habitats=@("dungeons","wizard towers","ruins") }
  @{ name="Ghost";                creature_type="undead";     cr="4";   size="medium";     alignment="any alignment";  habitats=@("haunted ruins","cursed locations","manors","sites of violent death") }
  @{ name="Gnoll Fang of Yeenoghu";creature_type="fiend";     cr="4";   size="medium";     alignment="chaotic evil";   habitats=@("plains","ruins","gnoll lairs") }
  @{ name="Helmed Horror";        creature_type="construct";  cr="4";   size="large";      alignment="neutral";        habitats=@("dungeons","wizard towers","ruins") }
  @{ name="Incubus";              creature_type="fiend";      cr="4";   size="medium";     alignment="neutral evil";   habitats=@("Nine Hells","mortal dreams","cities") }
  @{ name="Lamia";                creature_type="monstrosity";cr="4";   size="large";      alignment="chaotic evil";   habitats=@("deserts","ruins","abandoned palaces") }
  @{ name="Lizard King";          creature_type="humanoid";   cr="4";   size="medium";     alignment="neutral evil";   habitats=@("swamps","jungles","lizardfolk temples") }
  @{ name="Orc War Chief";        creature_type="humanoid";   cr="4";   size="medium";     alignment="chaotic evil";   habitats=@("mountains","plains","orc strongholds") }
  @{ name="Red Dragon Wyrmling";  creature_type="dragon";     cr="4";   size="medium";     alignment="chaotic evil";   habitats=@("mountains","volcanoes") }
  @{ name="Shadow Demon";         creature_type="fiend";      cr="4";   size="medium";     alignment="chaotic evil";   habitats=@("Abyss","dark ruins","cursed sites") }
  @{ name="Succubus";             creature_type="fiend";      cr="4";   size="medium";     alignment="neutral evil";   habitats=@("Nine Hells","mortal dreams","cities") }
  @{ name="Wereboar";             creature_type="humanoid";   cr="4";   size="medium";     alignment="neutral evil";   habitats=@("forests","plains","wilderness") }
  @{ name="Weretiger";            creature_type="humanoid";   cr="4";   size="medium";     alignment="neutral";        habitats=@("jungles","plains","urban") }
  # --- CR 5 ---
  @{ name="Air Elemental";        creature_type="elemental";  cr="5";   size="large";      alignment="neutral";        habitats=@("elemental plane of air","storms","mountaintops") }
  @{ name="Barbed Devil";         creature_type="fiend";      cr="5";   size="medium";     alignment="lawful evil";    habitats=@("Nine Hells","devil summoning sites") }
  @{ name="Barlgura";             creature_type="fiend";      cr="5";   size="large";      alignment="chaotic evil";   habitats=@("Abyss","demon lairs","jungles") }
  @{ name="Beholder Zombie";      creature_type="undead";     cr="5";   size="large";      alignment="neutral evil";   habitats=@("dungeons","ruins","beholder territory") }
  @{ name="Bulette";              creature_type="monstrosity";cr="5";   size="large";      alignment="unaligned";      habitats=@("plains","hills","underground passages") }
  @{ name="Cambion";              creature_type="fiend";      cr="5";   size="medium";     alignment="any evil";       habitats=@("Nine Hells","Abyss","mortal cities") }
  @{ name="Drow Elite Warrior";   creature_type="humanoid";   cr="5";   size="medium";     alignment="neutral evil";   habitats=@("underdark","drow cities") }
  @{ name="Earth Elemental";      creature_type="elemental";  cr="5";   size="large";      alignment="neutral";        habitats=@("elemental plane of earth","mountains","underground") }
  @{ name="Fire Elemental";       creature_type="elemental";  cr="5";   size="large";      alignment="neutral";        habitats=@("elemental plane of fire","volcanoes","foundries") }
  @{ name="Flesh Golem";          creature_type="construct";  cr="5";   size="large";      alignment="neutral";        habitats=@("wizard towers","laboratories","dungeons","crypts") }
  @{ name="Giant Crocodile";      creature_type="beast";      cr="5";   size="huge";       alignment="unaligned";      habitats=@("swamps","rivers","jungles") }
  @{ name="Giant Shark";          creature_type="beast";      cr="5";   size="huge";       alignment="unaligned";      habitats=@("deep oceans","coastal waters") }
  @{ name="Gladiator";            creature_type="humanoid";   cr="5";   size="medium";     alignment="any alignment";  habitats=@("arenas","cities","coliseums") }
  @{ name="Gorgon";               creature_type="monstrosity";cr="5";   size="large";      alignment="unaligned";      habitats=@("plains","hills","underground") }
  @{ name="Half-Red Dragon Veteran";creature_type="humanoid"; cr="5";   size="medium";     alignment="any alignment";  habitats=@("cities","keeps","dragon lairs") }
  @{ name="Hill Giant";           creature_type="giant";      cr="5";   size="huge";       alignment="chaotic evil";   habitats=@("hills","mountains","plains") }
  @{ name="Mezzoloth";            creature_type="fiend";      cr="5";   size="medium";     alignment="neutral evil";   habitats=@("gehenna","lower planes","yugoloth lairs") }
  @{ name="Night Hag";            creature_type="fiend";      cr="5";   size="medium";     alignment="neutral evil";   habitats=@("swamps","blighted forests","ethereal plane") }
  @{ name="Otyugh";               creature_type="aberration"; cr="5";   size="large";      alignment="neutral";        habitats=@("dungeons","sewers","ruins","refuse heaps") }
  @{ name="Red Slaad";            creature_type="aberration"; cr="5";   size="large";      alignment="chaotic neutral";habitats=@("limbo","slaad lairs","portals to chaos") }
  @{ name="Revenant";             creature_type="undead";     cr="5";   size="medium";     alignment="neutral";        habitats=@("anywhere its quarry can be found") }
  @{ name="Roper";                creature_type="monstrosity";cr="5";   size="large";      alignment="neutral evil";   habitats=@("underdark","caves","dungeons") }
  @{ name="Sahuagin Baron";       creature_type="humanoid";   cr="5";   size="large";      alignment="lawful evil";    habitats=@("oceans","underwater fortresses") }
  @{ name="Salamander";           creature_type="elemental";  cr="5";   size="large";      alignment="neutral evil";   habitats=@("elemental plane of fire","volcanoes","fire giant lairs") }
  @{ name="Shambling Mound";      creature_type="plant";      cr="5";   size="large";      alignment="unaligned";      habitats=@("swamps","jungles","bogs","blighted forests") }
  @{ name="Triceratops";          creature_type="beast";      cr="5";   size="huge";       alignment="unaligned";      habitats=@("plains","jungles","prehistoric regions") }
  @{ name="Troll";                creature_type="giant";      cr="5";   size="large";      alignment="chaotic evil";   habitats=@("forests","swamps","mountains","ruins") }
  @{ name="Umber Hulk";           creature_type="monstrosity";cr="5";   size="large";      alignment="chaotic evil";   habitats=@("underdark","underground tunnels") }
  @{ name="Unicorn";              creature_type="celestial";  cr="5";   size="large";      alignment="lawful good";    habitats=@("magical forests","feywild","sacred groves") }
  @{ name="Vampire Spawn";        creature_type="undead";     cr="5";   size="medium";     alignment="neutral evil";   habitats=@("castles","crypts","urban shadows","noble estates") }
  @{ name="Water Elemental";      creature_type="elemental";  cr="5";   size="large";      alignment="neutral";        habitats=@("elemental plane of water","oceans","rivers") }
  @{ name="Werebear";             creature_type="humanoid";   cr="5";   size="medium";     alignment="neutral good";   habitats=@("forests","mountains","wilderness") }
  @{ name="Wraith";               creature_type="undead";     cr="5";   size="medium";     alignment="neutral evil";   habitats=@("blighted lands","cursed tombs","ancient ruins") }
  @{ name="Xorn";                 creature_type="elemental";  cr="5";   size="medium";     alignment="neutral";        habitats=@("elemental plane of earth","underground","mines") }
  @{ name="Young Remorhaz";       creature_type="monstrosity";cr="5";   size="large";      alignment="unaligned";      habitats=@("tundra","glaciers","mountains") }
  # --- CR 6 ---
  @{ name="Chasme";               creature_type="fiend";      cr="6";   size="large";      alignment="chaotic evil";   habitats=@("Abyss","demon lairs") }
  @{ name="Chimera";              creature_type="monstrosity";cr="6";   size="large";      alignment="chaotic evil";   habitats=@("mountains","hills","ruins") }
  @{ name="Cyclops";              creature_type="giant";      cr="6";   size="huge";       alignment="chaotic neutral";habitats=@("coastlines","islands","mountains") }
  @{ name="Drider";               creature_type="monstrosity";cr="6";   size="large";      alignment="chaotic evil";   habitats=@("underdark","drow cities","spider-infested ruins") }
  @{ name="Galeb Duhr";           creature_type="elemental";  cr="6";   size="medium";     alignment="neutral";        habitats=@("mountains","hills","rocky terrain") }
  @{ name="Githzerai Zerth";      creature_type="humanoid";   cr="6";   size="medium";     alignment="lawful neutral"; habitats=@("limbo","githzerai monasteries") }
  @{ name="Hobgoblin Warlord";    creature_type="humanoid";   cr="6";   size="medium";     alignment="lawful evil";    habitats=@("fortresses","borderlands","hobgoblin kingdoms") }
  @{ name="Invisible Stalker";    creature_type="elemental";  cr="6";   size="medium";     alignment="neutral";        habitats=@("elemental plane of air","anywhere summoned") }
  @{ name="Kuo-toa Archpriest";   creature_type="humanoid";   cr="6";   size="medium";     alignment="neutral evil";   habitats=@("underdark","kuo-toa temples") }
  @{ name="Mage";                 creature_type="humanoid";   cr="6";   size="medium";     alignment="any alignment";  habitats=@("cities","wizard towers","ruins") }
  @{ name="Mammoth";              creature_type="beast";      cr="6";   size="huge";       alignment="unaligned";      habitats=@("tundra","plains","cold grasslands") }
  @{ name="Medusa";               creature_type="monstrosity";cr="6";   size="medium";     alignment="lawful evil";    habitats=@("ruins","dungeons","isolated lairs") }
  @{ name="Vrock";                creature_type="fiend";      cr="6";   size="large";      alignment="chaotic evil";   habitats=@("Abyss","demon lairs","blighted wilderness") }
  @{ name="Wyvern";               creature_type="dragon";     cr="6";   size="large";      alignment="unaligned";      habitats=@("mountains","hills","cliffs") }
  @{ name="Young Brass Dragon";   creature_type="dragon";     cr="6";   size="large";      alignment="chaotic good";   habitats=@("deserts","sandy hills") }
  @{ name="Young White Dragon";   creature_type="dragon";     cr="6";   size="large";      alignment="chaotic evil";   habitats=@("tundra","glaciers","mountains") }
  # --- CR 7 ---
  @{ name="Blue Slaad";           creature_type="aberration"; cr="7";   size="large";      alignment="chaotic neutral";habitats=@("limbo","slaad lairs") }
  @{ name="Drow Mage";            creature_type="humanoid";   cr="7";   size="medium";     alignment="neutral evil";   habitats=@("underdark","drow cities") }
  @{ name="Giant Ape";            creature_type="beast";      cr="7";   size="huge";       alignment="unaligned";      habitats=@("jungles","forests","mountains") }
  @{ name="Grick Alpha";          creature_type="monstrosity";cr="7";   size="large";      alignment="neutral";        habitats=@("underdark","deep dungeons") }
  @{ name="Mind Flayer";          creature_type="aberration"; cr="7";   size="medium";     alignment="lawful evil";    habitats=@("underdark","mind flayer colonies") }
  @{ name="Oni";                  creature_type="giant";      cr="7";   size="large";      alignment="lawful evil";    habitats=@("mountains","forests","remote settlements") }
  @{ name="Shield Guardian";      creature_type="construct";  cr="7";   size="large";      alignment="neutral";        habitats=@("wherever its amulet holder commands") }
  @{ name="Stone Giant";          creature_type="giant";      cr="7";   size="huge";       alignment="neutral";        habitats=@("mountains","underground","caverns") }
  @{ name="Young Black Dragon";   creature_type="dragon";     cr="7";   size="large";      alignment="chaotic evil";   habitats=@("swamps","flooded ruins","bogs") }
  @{ name="Young Copper Dragon";  creature_type="dragon";     cr="7";   size="large";      alignment="chaotic good";   habitats=@("hills","rocky terrain") }
  @{ name="Yuan-ti Abomination";  creature_type="monstrosity";cr="7";   size="large";      alignment="neutral evil";   habitats=@("jungles","deserts","yuan-ti temples") }
  # --- CR 8 ---
  @{ name="Assassin";             creature_type="humanoid";   cr="8";   size="medium";     alignment="any non-good";   habitats=@("urban","cities","thieves guilds") }
  @{ name="Chain Devil";          creature_type="fiend";      cr="8";   size="medium";     alignment="lawful evil";    habitats=@("Nine Hells","devil lairs","torture chambers") }
  @{ name="Cloaker";              creature_type="aberration"; cr="8";   size="large";      alignment="neutral";        habitats=@("underdark","deep dungeons","caverns") }
  @{ name="Drow Priestess of Lolth";creature_type="humanoid";cr="8";   size="medium";     alignment="neutral evil";   habitats=@("underdark","drow cities","Lolth temples") }
  @{ name="Fomorian";             creature_type="giant";      cr="8";   size="huge";       alignment="chaotic evil";   habitats=@("underdark","feydark","giant caverns") }
  @{ name="Frost Giant";          creature_type="giant";      cr="8";   size="huge";       alignment="neutral evil";   habitats=@("tundra","glaciers","mountains","arctic") }
  @{ name="Githyanki Knight";     creature_type="humanoid";   cr="8";   size="medium";     alignment="lawful evil";    habitats=@("astral plane","githyanki strongholds") }
  @{ name="Green Slaad";          creature_type="aberration"; cr="8";   size="large";      alignment="chaotic neutral";habitats=@("limbo","slaad lairs") }
  @{ name="Hezrou";               creature_type="fiend";      cr="8";   size="large";      alignment="chaotic evil";   habitats=@("Abyss","demon lairs","swamps") }
  @{ name="Hydra";                creature_type="monstrosity";cr="8";   size="huge";       alignment="unaligned";      habitats=@("swamps","lakes","rivers","coastal caves") }
  @{ name="Mind Flayer Arcanist"; creature_type="aberration"; cr="8";   size="medium";     alignment="lawful evil";    habitats=@("underdark","mind flayer colonies") }
  @{ name="Spirit Naga";          creature_type="monstrosity";cr="8";   size="large";      alignment="chaotic evil";   habitats=@("ruins","dungeons","underground temples") }
  @{ name="Tyrannosaurus Rex";    creature_type="beast";      cr="8";   size="huge";       alignment="unaligned";      habitats=@("jungles","plains","prehistoric regions") }
  @{ name="Young Bronze Dragon";  creature_type="dragon";     cr="8";   size="large";      alignment="lawful good";    habitats=@("coastlines","islands","sea cliffs") }
  @{ name="Young Green Dragon";   creature_type="dragon";     cr="8";   size="large";      alignment="lawful evil";    habitats=@("forests","hills") }
  # --- CR 9 ---
  @{ name="Abominable Yeti";      creature_type="monstrosity";cr="9";   size="huge";       alignment="chaotic evil";   habitats=@("tundra","glaciers","mountains") }
  @{ name="Bone Devil";           creature_type="fiend";      cr="9";   size="large";      alignment="lawful evil";    habitats=@("Nine Hells","devil lairs","cold wastelands") }
  @{ name="Clay Golem";           creature_type="construct";  cr="9";   size="large";      alignment="unaligned";      habitats=@("temples","dungeons","wizard towers") }
  @{ name="Cloud Giant";          creature_type="giant";      cr="9";   size="huge";       alignment="neutral good";   habitats=@("mountains","clouds","giant strongholds") }
  @{ name="Fire Giant";           creature_type="giant";      cr="9";   size="huge";       alignment="lawful evil";    habitats=@("volcanoes","mountains","fire giant citadels") }
  @{ name="Glabrezu";             creature_type="fiend";      cr="9";   size="large";      alignment="chaotic evil";   habitats=@("Abyss","demon lairs","ruins") }
  @{ name="Gray Slaad";           creature_type="aberration"; cr="9";   size="medium";     alignment="chaotic neutral";habitats=@("limbo","slaad lairs") }
  @{ name="Nycaloth";             creature_type="fiend";      cr="9";   size="large";      alignment="neutral evil";   habitats=@("gehenna","lower planes") }
  @{ name="Treant";               creature_type="plant";      cr="9";   size="huge";       alignment="chaotic good";   habitats=@("ancient forests","magical groves","feywild") }
  @{ name="Young Blue Dragon";    creature_type="dragon";     cr="9";   size="large";      alignment="lawful evil";    habitats=@("deserts","plains","coasts") }
  @{ name="Young Silver Dragon";  creature_type="dragon";     cr="9";   size="large";      alignment="lawful good";    habitats=@("mountains","high peaks","clouds") }
  # --- CR 10 ---
  @{ name="Aboleth";              creature_type="aberration"; cr="10";  size="large";      alignment="lawful evil";    habitats=@("underground lakes","deep oceans","underdark") }
  @{ name="Death Slaad";          creature_type="aberration"; cr="10";  size="medium";     alignment="chaotic neutral";habitats=@("limbo","slaad lairs") }
  @{ name="Deva";                 creature_type="celestial";  cr="10";  size="medium";     alignment="lawful good";    habitats=@("celestial planes","mortal world as messenger") }
  @{ name="Guardian Naga";        creature_type="monstrosity";cr="10";  size="large";      alignment="lawful good";    habitats=@("ruins","sacred sites","ancient temples") }
  @{ name="Stone Golem";          creature_type="construct";  cr="10";  size="large";      alignment="unaligned";      habitats=@("dungeons","temples","wizard towers") }
  @{ name="Yochlol";              creature_type="fiend";      cr="10";  size="medium";     alignment="chaotic evil";   habitats=@("Abyss","Lolths realm","drow temples") }
  @{ name="Young Gold Dragon";    creature_type="dragon";     cr="10";  size="large";      alignment="lawful good";    habitats=@("plains","hills","near human settlements") }
  @{ name="Young Red Dragon";     creature_type="dragon";     cr="10";  size="large";      alignment="chaotic evil";   habitats=@("mountains","volcanoes") }
  # --- CR 11 ---
  @{ name="Behir";                creature_type="monstrosity";cr="11";  size="huge";       alignment="neutral evil";   habitats=@("mountains","underground","caves") }
  @{ name="Dao";                  creature_type="elemental";  cr="11";  size="large";      alignment="neutral evil";   habitats=@("elemental plane of earth","deserts","mines") }
  @{ name="Djinni";               creature_type="elemental";  cr="11";  size="large";      alignment="chaotic good";   habitats=@("elemental plane of air","deserts","high mountains") }
  @{ name="Efreeti";              creature_type="elemental";  cr="11";  size="large";      alignment="lawful evil";    habitats=@("elemental plane of fire","deserts","cities of brass") }
  @{ name="Gynosphinx";           creature_type="monstrosity";cr="11";  size="large";      alignment="lawful neutral"; habitats=@("deserts","ruins","ancient temples") }
  @{ name="Horned Devil";         creature_type="fiend";      cr="11";  size="large";      alignment="lawful evil";    habitats=@("Nine Hells","devil strongholds","battlefields") }
  @{ name="Marid";                creature_type="elemental";  cr="11";  size="large";      alignment="chaotic neutral";habitats=@("elemental plane of water","oceans","coastal palaces") }
  @{ name="Remorhaz";             creature_type="monstrosity";cr="11";  size="huge";       alignment="unaligned";      habitats=@("tundra","glaciers","arctic mountains") }
  @{ name="Roc";                  creature_type="monstrosity";cr="11";  size="gargantuan"; alignment="unaligned";      habitats=@("mountains","remote islands","high peaks") }
  # --- CR 12 ---
  @{ name="Arcanaloth";           creature_type="fiend";      cr="12";  size="medium";     alignment="neutral evil";   habitats=@("gehenna","yugoloth lairs","libraries of lore") }
  @{ name="Archmage";             creature_type="humanoid";   cr="12";  size="medium";     alignment="any alignment";  habitats=@("cities","towers","wizard academies") }
  @{ name="Erinyes";              creature_type="fiend";      cr="12";  size="medium";     alignment="lawful evil";    habitats=@("Nine Hells","devil courts","fallen battlefields") }
  # --- CR 13 ---
  @{ name="Adult Brass Dragon";   creature_type="dragon";     cr="13";  size="huge";       alignment="chaotic good";   habitats=@("deserts","ancient ruins","oases") }
  @{ name="Adult White Dragon";   creature_type="dragon";     cr="13";  size="huge";       alignment="chaotic evil";   habitats=@("tundra","glaciers","arctic mountains") }
  @{ name="Beholder";             creature_type="aberration"; cr="13";  size="large";      alignment="lawful evil";    habitats=@("dungeons","underground","beholder lairs") }
  @{ name="Nalfeshnee";           creature_type="fiend";      cr="13";  size="large";      alignment="chaotic evil";   habitats=@("Abyss","demon strongholds") }
  @{ name="Rakshasa";             creature_type="fiend";      cr="13";  size="medium";     alignment="lawful evil";    habitats=@("cities","palaces","upper-class society") }
  @{ name="Storm Giant";          creature_type="giant";      cr="13";  size="huge";       alignment="chaotic good";   habitats=@("mountains","cloud palaces","storm-swept coasts") }
  @{ name="Ultroloth";            creature_type="fiend";      cr="13";  size="medium";     alignment="neutral evil";   habitats=@("gehenna","yugoloth strongholds") }
  @{ name="Vampire";              creature_type="undead";     cr="13";  size="medium";     alignment="lawful evil";    habitats=@("castles","crypts","noble estates","urban shadows") }
  @{ name="Young Red Shadow Dragon";creature_type="dragon";   cr="13";  size="large";      alignment="chaotic evil";   habitats=@("mountains","shadow-blighted ruins") }
  # --- CR 14 ---
  @{ name="Adult Black Dragon";   creature_type="dragon";     cr="14";  size="huge";       alignment="chaotic evil";   habitats=@("swamps","fetid ruins","bogs") }
  @{ name="Adult Copper Dragon";  creature_type="dragon";     cr="14";  size="huge";       alignment="chaotic good";   habitats=@("hills","rocky highlands") }
  @{ name="Death Tyrant";         creature_type="undead";     cr="14";  size="large";      alignment="lawful evil";    habitats=@("dungeons","ruins","beholder lairs") }
  @{ name="Ice Devil";            creature_type="fiend";      cr="14";  size="large";      alignment="lawful evil";    habitats=@("Nine Hells","glacial wastelands","arctic fortresses") }
  # --- CR 15 ---
  @{ name="Adult Bronze Dragon";  creature_type="dragon";     cr="15";  size="huge";       alignment="lawful good";    habitats=@("coastlines","islands","sea cliffs") }
  @{ name="Adult Green Dragon";   creature_type="dragon";     cr="15";  size="huge";       alignment="lawful evil";    habitats=@("forests","hills","verdant ruins") }
  @{ name="Mummy Lord";           creature_type="undead";     cr="15";  size="medium";     alignment="lawful evil";    habitats=@("desert tombs","ancient ruins","cursed temples") }
  @{ name="Purple Worm";          creature_type="monstrosity";cr="15";  size="gargantuan"; alignment="unaligned";      habitats=@("underground","deserts","deep tunnels") }
  # --- CR 16 ---
  @{ name="Adult Blue Dragon";    creature_type="dragon";     cr="16";  size="huge";       alignment="lawful evil";    habitats=@("deserts","plains","coastal cliffs") }
  @{ name="Adult Silver Dragon";  creature_type="dragon";     cr="16";  size="huge";       alignment="lawful good";    habitats=@("mountains","clouds","near civilization") }
  @{ name="Iron Golem";           creature_type="construct";  cr="16";  size="large";      alignment="unaligned";      habitats=@("dungeons","keeps","wizard fortresses") }
  @{ name="Marilith";             creature_type="fiend";      cr="16";  size="large";      alignment="chaotic evil";   habitats=@("Abyss","demon strongholds","portals of chaos") }
  @{ name="Planetar";             creature_type="celestial";  cr="16";  size="large";      alignment="lawful good";    habitats=@("celestial planes","sacred sites") }
  # --- CR 17 ---
  @{ name="Adult Blue Dracolich"; creature_type="undead";     cr="17";  size="huge";       alignment="lawful evil";    habitats=@("ruins","ancient tombs","blighted lands") }
  @{ name="Adult Gold Dragon";    creature_type="dragon";     cr="17";  size="huge";       alignment="lawful good";    habitats=@("plains","hills","near cities") }
  @{ name="Adult Red Dragon";     creature_type="dragon";     cr="17";  size="huge";       alignment="chaotic evil";   habitats=@("mountains","volcanoes","dragon lairs") }
  @{ name="Androsphinx";          creature_type="monstrosity";cr="17";  size="large";      alignment="lawful neutral"; habitats=@("deserts","ruins","ancient temples") }
  @{ name="Death Knight";         creature_type="undead";     cr="17";  size="medium";     alignment="chaotic evil";   habitats=@("ruined fortresses","battlefields","cursed keeps") }
  @{ name="Dragon Turtle";        creature_type="dragon";     cr="17";  size="gargantuan"; alignment="neutral";        habitats=@("oceans","deep seas","coastal caves") }
  @{ name="Goristro";             creature_type="fiend";      cr="17";  size="huge";       alignment="chaotic evil";   habitats=@("Abyss","demon strongholds") }
  # --- CR 18 ---
  @{ name="Demilich";             creature_type="undead";     cr="18";  size="tiny";       alignment="neutral evil";   habitats=@("ancient tombs","dungeons","phylactery vaults") }
  # --- CR 19 ---
  @{ name="Balor";                creature_type="fiend";      cr="19";  size="huge";       alignment="chaotic evil";   habitats=@("Abyss","demon strongholds","volcanic lairs") }
  # --- CR 20 ---
  @{ name="Ancient Brass Dragon"; creature_type="dragon";     cr="20";  size="gargantuan"; alignment="chaotic good";   habitats=@("deserts","ancient ruins") }
  @{ name="Ancient White Dragon"; creature_type="dragon";     cr="20";  size="gargantuan"; alignment="chaotic evil";   habitats=@("tundra","glaciers","arctic") }
  @{ name="Pit Fiend";            creature_type="fiend";      cr="20";  size="large";      alignment="lawful evil";    habitats=@("Nine Hells","devil courts","infernal fortresses") }
  # --- CR 21 ---
  @{ name="Ancient Black Dragon"; creature_type="dragon";     cr="21";  size="gargantuan"; alignment="chaotic evil";   habitats=@("swamps","fetid ruins") }
  @{ name="Ancient Copper Dragon";creature_type="dragon";     cr="21";  size="gargantuan"; alignment="chaotic good";   habitats=@("hills","rocky highlands") }
  @{ name="Lich";                 creature_type="undead";     cr="21";  size="medium";     alignment="any evil";       habitats=@("towers","dungeons","ancient ruins","phylactery vaults") }
  @{ name="Solar";                creature_type="celestial";  cr="21";  size="large";      alignment="lawful good";    habitats=@("celestial planes","sacred sites") }
  # --- CR 22 ---
  @{ name="Ancient Bronze Dragon";creature_type="dragon";     cr="22";  size="gargantuan"; alignment="lawful good";    habitats=@("coastlines","islands") }
  @{ name="Ancient Green Dragon"; creature_type="dragon";     cr="22";  size="gargantuan"; alignment="lawful evil";    habitats=@("forests","verdant ruins") }
  # --- CR 23 ---
  @{ name="Ancient Blue Dragon";  creature_type="dragon";     cr="23";  size="gargantuan"; alignment="lawful evil";    habitats=@("deserts","plains") }
  @{ name="Ancient Silver Dragon";creature_type="dragon";     cr="23";  size="gargantuan"; alignment="lawful good";    habitats=@("mountains","clouds") }
  @{ name="Empyrean";             creature_type="celestial";  cr="23";  size="huge";       alignment="chaotic good";   habitats=@("celestial planes","divine realms") }
  @{ name="Kraken";               creature_type="monstrosity";cr="23";  size="gargantuan"; alignment="chaotic evil";   habitats=@("deep oceans","underwater lairs") }
  # --- CR 24 ---
  @{ name="Ancient Gold Dragon";  creature_type="dragon";     cr="24";  size="gargantuan"; alignment="lawful good";    habitats=@("plains","mountains","near cities") }
  @{ name="Ancient Red Dragon";   creature_type="dragon";     cr="24";  size="gargantuan"; alignment="chaotic evil";   habitats=@("mountains","volcanoes") }
  # --- CR 30 ---
  @{ name="Tarrasque";            creature_type="monstrosity";cr="30";  size="gargantuan"; alignment="unaligned";      habitats=@("anywhere it wakes","underground slumber sites") }
)

$created = 0
$skipped = 0

foreach ($m in $monsters) {
    $safeName = $m.name -replace '[\\/:*?"<>|]', '-'
    $filepath = Join-Path $outDir "$safeName.md"

    if (Test-Path $filepath) {
        Write-Host "SKIP  $($m.name)" -ForegroundColor DarkGray
        $skipped++
        continue
    }

    if ($m.habitats -and $m.habitats.Count -gt 0) {
        $habitatYaml = "habitats:`n" + (($m.habitats | ForEach-Object { "  - $_" }) -join "`n")
    } else {
        $habitatYaml = "habitats: []"
    }

    $content = @"
---
name: $($m.name)
type: monster
tags:
  - monster
  - monster/$($m.creature_type)

creature_type: $($m.creature_type)
challenge_rating: "$($m.cr)"

size: $($m.size)
alignment: $($m.alignment)
source: Monster Manual
$habitatYaml
description: ""
---
"@

    if ($WhatIf) {
        Write-Host "WOULD CREATE  $($m.name)" -ForegroundColor Cyan
    } else {
        Set-Content -Path $filepath -Value $content -Encoding UTF8
        Write-Host "OK    $($m.name)" -ForegroundColor Green
        $created++
    }
}

Write-Host ""
Write-Host "Done. Created: $created  Skipped: $skipped" -ForegroundColor Cyan
