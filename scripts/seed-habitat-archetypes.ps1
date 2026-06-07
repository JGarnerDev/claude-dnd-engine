param([switch]$WhatIf)

$root   = Resolve-Path "$PSScriptRoot\.."
$created = 0
$skipped = 0

function Write-Entity {
    param([string]$path, [string]$content)
    if (Test-Path $path) { $script:skipped++; return }
    if (-not $WhatIf) {
        $dir = Split-Path $path
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        Set-Content -Path $path -Value $content -Encoding UTF8
    }
    $script:created++
    Write-Host "  created: $(Split-Path $path -Leaf)"
}

# -- WILDERNESS -----------------------------------------------------------------

$wildernessDir = Join-Path $root "data\locations\wilderness"

Write-Entity (Join-Path $wildernessDir "Forest.md") @'
---
name: Forest
type: location
subtype: wilderness
exists: false
state: dangerous
tags:
  - location
  - location/wilderness
  - location/wilderness/forest
region: Various
terrain: forest
description: Generic forested habitat -- ancient woods, dark thickets, and woodland environments.
---

Generic forested habitat archetype. Covers ancient forests, dark forests, haunted forests, magical groves, and woodland environments.
'@

Write-Entity (Join-Path $wildernessDir "Plains.md") @'
---
name: Plains
type: location
subtype: wilderness
exists: false
state: safe
tags:
  - location
  - location/wilderness
region: Various
terrain: plains
description: Generic open-land habitat -- grasslands, savannas, fields, farmland, and rolling hills.
---

Generic open-land habitat archetype. Covers grasslands, savannas, fields, farmland, and open terrain.
'@

Write-Entity (Join-Path $wildernessDir "Desert.md") @'
---
name: Desert
type: location
subtype: wilderness
exists: false
state: dangerous
tags:
  - location
  - location/wilderness
region: Various
terrain: desert
description: Generic arid habitat -- deserts, badlands, lava fields, and sandy wastes.
---

Generic arid habitat archetype. Covers deserts, badlands, volcanic terrain, and sandy wastes.
'@

Write-Entity (Join-Path $wildernessDir "Tundra.md") @'
---
name: Tundra
type: location
subtype: wilderness
exists: false
state: dangerous
tags:
  - location
  - location/wilderness
region: Various
terrain: other
description: Generic frozen habitat -- arctic wastes, tundra, glaciers, and frozen wilderness.
---

Generic frozen habitat archetype. Covers arctic terrain, tundra, glaciers, and cold wastelands.
'@

Write-Entity (Join-Path $wildernessDir "Mountains.md") @'
---
name: Mountains
type: location
subtype: wilderness
exists: false
state: dangerous
tags:
  - location
  - location/wilderness
region: Various
terrain: mountain
description: Generic highland habitat -- mountains, peaks, passes, hills, cliffs, and rocky terrain.
---

Generic highland habitat archetype. Covers mountains, mountain passes, high peaks, hills, cliffs, and rocky terrain.
'@

Write-Entity (Join-Path $wildernessDir "Coastline.md") @'
---
name: Coastline
type: location
subtype: wilderness
exists: false
state: safe
tags:
  - location
  - location/wilderness
region: Various
terrain: coast
description: Generic coastal habitat -- beaches, sea cliffs, tidal pools, reefs, and shorelines.
---

Generic coastal habitat archetype. Covers beaches, sea cliffs, tidal pools, coral reefs, islands, and shorelines.
'@

Write-Entity (Join-Path $wildernessDir "Ocean.md") @'
---
name: Ocean
type: location
subtype: wilderness
exists: false
state: dangerous
tags:
  - location
  - location/wilderness
region: Various
terrain: other
description: Generic aquatic habitat -- oceans, seas, lakes, rivers, and underwater environments.
---

Generic aquatic habitat archetype. Covers oceans, deep seas, lakes, rivers, underwater caves, and aquatic environments.
'@

Write-Entity (Join-Path $wildernessDir "Swamp.md") @'
---
name: Swamp
type: location
subtype: wilderness
exists: false
state: dangerous
tags:
  - location
  - location/wilderness
region: Various
terrain: swamp
description: Generic wetland habitat -- swamps, bogs, marshes, fens, and blighted wetlands.
---

Generic wetland habitat archetype. Covers swamps, marshes, bogs, and blighted wetland environments.
'@

Write-Entity (Join-Path $wildernessDir "Jungle.md") @'
---
name: Jungle
type: location
subtype: wilderness
exists: false
state: dangerous
tags:
  - location
  - location/wilderness
region: Various
terrain: other
description: Generic tropical habitat -- jungles, tropical forests, and dense equatorial wilderness.
---

Generic tropical habitat archetype. Covers jungles and tropical forest environments.
'@

# -- DUNGEONS ------------------------------------------------------------------

$dungeonDir = Join-Path $root "data\locations\dungeons"

Write-Entity (Join-Path $dungeonDir "Cave.md") @'
---
name: Cave
type: location
subtype: dungeon
exists: false
state: active
tags:
  - location
  - location/dungeon
location: Various
origin: Natural cavern system
current_threat: Various
hook: Exploration or resource extraction
description: Generic cave habitat -- natural caverns, underground chambers, and subterranean spaces.
---

Generic cave habitat archetype. Covers caves, caverns, grottos, underground lakes, and natural subterranean spaces.
'@

Write-Entity (Join-Path $dungeonDir "Dungeon.md") @'
---
name: Dungeon
type: location
subtype: dungeon
exists: false
state: active
tags:
  - location
  - location/dungeon
location: Various
origin: Constructed or adapted underground complex
current_threat: Various
hook: Exploration, rescue, or objective recovery
description: Generic dungeon habitat -- constructed underground complexes, mines, sewers, tunnels, and labyrinths.
---

Generic dungeon habitat archetype. Covers constructed dungeons, mines, sewers, underground passages, labyrinths, and fortified subterranean complexes.
'@

Write-Entity (Join-Path $dungeonDir "Ruins.md") @'
---
name: Ruins
type: location
subtype: dungeon
exists: false
state: known
tags:
  - location
  - location/dungeon
  - location/dungeon/ruin
location: Various
origin: Abandoned settlement, fortress, or temple
current_threat: Various
hook: Exploration, salvage, or historical investigation
description: Generic ruins habitat -- collapsed structures, haunted manors, crumbling fortresses, and abandoned temples.
---

Generic ruins habitat archetype. Covers ancient ruins, haunted manors, ruined fortresses, abandoned temples, and crumbling structures.
'@

Write-Entity (Join-Path $dungeonDir "Tomb.md") @'
---
name: Tomb
type: location
subtype: dungeon
exists: false
state: active
tags:
  - location
  - location/dungeon
location: Various
origin: Burial site or mortuary complex
current_threat: Undead inhabitants
hook: Treasure recovery or undead clearance
description: Generic burial habitat -- tombs, crypts, graveyards, mausoleums, and burial chambers.
---

Generic burial habitat archetype. Covers tombs, crypts, graveyards, catacombs, and burial sites.
'@

# -- CITIES --------------------------------------------------------------------

$cityDir = Join-Path $root "data\locations\cities"

Write-Entity (Join-Path $cityDir "City.md") @'
---
name: City
type: location
subtype: city
exists: false
state: stable
tags:
  - location
  - location/city
global_location: Various
purpose: other
description: Generic urban habitat -- cities, towns, villages, and settled population centers.
---

Generic urban habitat archetype. Covers cities, towns, villages, urban districts, and settled population centers.
'@

# -- REGIONS (PLANES) ----------------------------------------------------------

$regionDir = Join-Path $root "data\locations\regions"

Write-Entity (Join-Path $regionDir "Underdark.md") @'
---
name: Underdark
type: location
subtype: region
exists: false
state: contested
tags:
  - location
  - location/region
geography: A vast subterranean world beneath the surface -- lightless tunnels, underground seas, and cities carved into stone.
controlling_faction: Unknown
description: The vast subterranean world beneath the surface, home to drow, duergar, mind flayers, and other creatures of the deep.
---

The vast subterranean world beneath the surface. Lightless tunnels and caverns stretch for miles, home to drow cities, duergar fortresses, mind flayer colonies, and horrors that have never seen sunlight.
'@

Write-Entity (Join-Path $regionDir "Nine Hells.md") @'
---
name: Nine Hells
type: location
subtype: region
exists: false
state: stable
tags:
  - location
  - location/region
geography: Nine layers of lawful evil -- from the frozen fields of Stygia to the burning courts of Avernus and Nessus below.
controlling_faction: Unknown
description: The Nine Hells of Baator -- nine layers of lawful evil ruled by archdevils, dominated by Asmodeus.
---

The Nine Hells of Baator -- nine layers of lawful evil ruled by archdevils and their legions. Home to devils, damned souls, and those who bargain with power.
'@

Write-Entity (Join-Path $regionDir "Abyss.md") @'
---
name: Abyss
type: location
subtype: region
exists: false
state: contested
tags:
  - location
  - location/region
geography: Infinite layers of chaotic evil -- demonic realms ranging from volcanic hellscapes to endless wastelands.
controlling_faction: Unknown
description: The Infinite Layers of the Abyss -- endless realms of chaotic evil ruled by demon lords.
---

The Infinite Layers of the Abyss -- endless demonic realms of chaos and destruction. Each layer is ruled (or contested) by a demon lord.
'@

Write-Entity (Join-Path $regionDir "Feywild.md") @'
---
name: Feywild
type: location
subtype: region
exists: false
state: stable
tags:
  - location
  - location/region
geography: A mirror of the mortal world suffused with wild magic -- colors brighter, seasons sharper, and nature untamed.
controlling_faction: Unknown
description: The Feywild -- an echo of the mortal plane suffused with fey magic, emotion, and primordial nature.
---

The Feywild -- a mirror realm of the mortal world, suffused with raw magic and fey emotion. Home to fey courts, archfey, and creatures of wild nature.
'@

Write-Entity (Join-Path $regionDir "Elemental Planes.md") @'
---
name: Elemental Planes
type: location
subtype: region
exists: false
state: contested
tags:
  - location
  - location/region
geography: Four elemental realms -- the Plane of Fire, Air, Earth, and Water -- surrounding the Elemental Chaos at their confluence.
controlling_faction: Unknown
description: The Inner Planes of elemental matter -- vast realms of pure fire, air, earth, and water.
---

The Inner Planes -- vast realms of elemental matter. The Plane of Fire blazes endlessly, the Plane of Air stretches to infinite sky, the Plane of Earth churns with stone, and the Plane of Water drowns all.
'@

Write-Entity (Join-Path $regionDir "Astral Plane.md") @'
---
name: Astral Plane
type: location
subtype: region
exists: false
state: frontier
tags:
  - location
  - location/region
geography: A silvery void connecting the material world to the outer planes -- drifting in timeless suspension.
controlling_faction: Unknown
description: The Astral Plane -- a silver void of psychic matter connecting the Material Plane to the Outer Planes.
---

The Astral Plane -- a silver void of psychic matter and drifting god-corpses. Githyanki roam its expanses, and travelers may find portals to any outer plane.
'@

Write-Entity (Join-Path $regionDir "Limbo.md") @'
---
name: Limbo
type: location
subtype: region
exists: false
state: contested
tags:
  - location
  - location/region
geography: An ever-shifting realm of pure chaos -- matter and energy collide and reform without logic or pattern.
controlling_faction: Unknown
description: Limbo -- the Ever-Changing Chaos, a realm of pure chaotic matter where form is temporary and reason fails.
---

Limbo -- the Ever-Changing Chaos. A realm where matter and energy swirl in constant flux. Home to githzerai monasteries and slaadi, where only the strong-willed can impose form on the chaos.
'@

Write-Entity (Join-Path $regionDir "Gehenna.md") @'
---
name: Gehenna
type: location
subtype: region
exists: false
state: stable
tags:
  - location
  - location/region
geography: Four volcanic mountains suspended in a void -- the realm of evil neutrality where yugoloths broker their bloody contracts.
controlling_faction: Unknown
description: Gehenna -- four volcanic mountains in a void, home to yugoloths and the neutral evil powers.
---

Gehenna -- four great volcanic mountains suspended in a void of ash and fire. Home to yugoloths who broker contracts between devils and demons, and the birthplace of mercenary evil.
'@

Write-Entity (Join-Path $regionDir "Celestial Planes.md") @'
---
name: Celestial Planes
type: location
subtype: region
exists: false
state: stable
tags:
  - location
  - location/region
geography: The upper planes of good alignment -- Mount Celestia, Elysium, Arborea, and the Beastlands among them.
controlling_faction: Unknown
description: The Upper Planes -- realms of good alignment, divine light, and celestial order.
---

The Upper Planes -- realms of good alignment where celestials dwell and souls of the virtuous rest. Includes Mount Celestia, Elysium, Arborea, and Bytopia.
'@

Write-Entity (Join-Path $regionDir "Far Realm.md") @'
---
name: Far Realm
type: location
subtype: region
exists: false
state: frontier
tags:
  - location
  - location/region
geography: An alien realm beyond the outer planes -- incomprehensible geometry and maddening truths lie beyond the edge of reality.
controlling_faction: Unknown
description: The Far Realm -- an alien dimension beyond the cosmology, source of aberrations and incomprehensible horror.
---

The Far Realm -- an alien dimension where geometry breaks down and sanity fails. Source of aberrations, mind flayers, and cosmic horror that defies mortal comprehension.
'@

Write-Entity (Join-Path $regionDir "Mechanus.md") @'
---
name: Mechanus
type: location
subtype: region
exists: false
state: stable
tags:
  - location
  - location/region
geography: An infinite realm of interlocking clockwork -- perfect order maintained by modrons under the Primus.
controlling_faction: Unknown
description: Mechanus -- the Clockwork Nirvana, a realm of perfect law and order maintained by modron hierarchies.
---

Mechanus -- the Clockwork Nirvana. An infinite realm of interlocking gears and perfect law, governed by modrons under the Primus. Where law is absolute and chaos cannot exist.
'@

Write-Entity (Join-Path $regionDir "Ethereal Plane.md") @'
---
name: Ethereal Plane
type: location
subtype: region
exists: false
state: frontier
tags:
  - location
  - location/region
geography: A misty border realm overlapping the material world -- travelers move unseen through physical space.
controlling_faction: Unknown
description: The Ethereal Plane -- a misty border realm that overlaps the material plane, used for travel, haunting, and planar transitions.
---

The Ethereal Plane -- a misty border dimension that overlaps the material world. Ghosts haunt it, phase spiders stalk it, and travelers pass through physical walls unseen.
'@

Write-Host ""
Write-Host "Done. Created: $created | Skipped (exist): $skipped"
