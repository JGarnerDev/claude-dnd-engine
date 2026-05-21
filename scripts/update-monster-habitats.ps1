param([switch]$WhatIf)

# Map from plain habitat strings (lowercase) to entity names
$habitatMap = [ordered]@{
    # Forest
    "forests"                    = "Forest"
    "forest"                     = "Forest"
    "ancient forests"            = "Forest"
    "ancient forest"             = "Forest"
    "dark forests"               = "Forest"
    "dense forests"              = "Forest"
    "haunted forests"            = "Forest"
    "magical forests"            = "Forest"
    "blighted forests"           = "Forest"
    "ancient groves"             = "Forest"
    "ancient grove"              = "Forest"
    "druids groves"              = "Forest"
    "druids grove"               = "Forest"
    "magical groves"             = "Forest"
    "sacred groves"              = "Forest"
    "sacred grove"               = "Forest"
    "wilderness"                 = "Forest"
    "blighted land"              = "Forest"
    "blighted lands"             = "Forest"
    "blighted wilderness"        = "Forest"
    "druids territories"         = "Forest"
    "spider-infested areas"      = "Forest"
    "cursed land"                = "Forest"

    # Jungle
    "jungles"                    = "Jungle"
    "jungle"                     = "Jungle"
    "tropical forests"           = "Jungle"
    "tropical forest"            = "Jungle"
    "yuan-ti temples"            = "Jungle"

    # Plains
    "plains"                     = "Plains"
    "plain"                      = "Plains"
    "grasslands"                 = "Plains"
    "grassland"                  = "Plains"
    "fields"                     = "Plains"
    "field"                      = "Plains"
    "farmland"                   = "Plains"
    "farms"                      = "Plains"
    "farm"                       = "Plains"
    "savannas"                   = "Plains"
    "savanna"                    = "Plains"
    "battlefields"               = "Plains"
    "battlefield"                = "Plains"
    "fallen battlefields"        = "Plains"
    "roads"                      = "Plains"
    "road"                       = "Plains"
    "trade routes"               = "Plains"
    "trade route"                = "Plains"
    "crossroads"                 = "Plains"
    "border regions"             = "Plains"
    "border region"              = "Plains"
    "borderlands"                = "Plains"
    "borderland"                 = "Plains"
    "tribal lands"               = "Plains"
    "tribal land"                = "Plains"
    "prehistoric regions"        = "Plains"
    "cold grasslands"            = "Plains"
    "goblinoid territories"      = "Plains"
    "gnoll lairs"                = "Plains"
    "rural villages"             = "Plains"

    # Desert
    "deserts"                    = "Desert"
    "desert"                     = "Desert"
    "desert ruins"               = "Desert"
    "oases"                      = "Desert"
    "oasis"                      = "Desert"
    "sandy hills"                = "Desert"
    "sandy ruins"                = "Desert"
    "lava fields"                = "Desert"
    "volcanic lairs"             = "Desert"
    "volcanoes"                  = "Desert"
    "volcano"                    = "Desert"

    # Tundra
    "tundra"                     = "Tundra"
    "arctic"                     = "Tundra"
    "arctic mountains"           = "Tundra"
    "arctic coastlines"          = "Tundra"
    "arctic fortresses"          = "Tundra"
    "arctic seas"                = "Tundra"
    "glaciers"                   = "Tundra"
    "glacier"                    = "Tundra"
    "glacial wastelands"         = "Tundra"
    "cold wastelands"            = "Tundra"

    # Mountains
    "mountains"                  = "Mountains"
    "mountain"                   = "Mountains"
    "mountain passes"            = "Mountains"
    "mountain pass"              = "Mountains"
    "high mountains"             = "Mountains"
    "mountainsides"              = "Mountains"
    "mountaintops"               = "Mountains"
    "hills"                      = "Mountains"
    "hill"                       = "Mountains"
    "rocky highlands"            = "Mountains"
    "rocky terrain"              = "Mountains"
    "cliffs"                     = "Mountains"
    "cliff"                      = "Mountains"
    "high cliffs"                = "Mountains"
    "sea cliffs"                 = "Mountains"
    "high peaks"                 = "Mountains"
    "high fortresses"            = "Mountains"
    "cloud palaces"              = "Mountains"
    "cloud settlements"          = "Mountains"
    "clouds"                     = "Mountains"
    "storms"                     = "Mountains"
    "giant strongholds"          = "Mountains"
    "fire giant citadels"        = "Mountains"
    "fire giant lairs"           = "Mountains"

    # Coastline
    "coastlines"                 = "Coastline"
    "coastline"                  = "Coastline"
    "coasts"                     = "Coastline"
    "coast"                      = "Coastline"
    "beaches"                    = "Coastline"
    "beach"                      = "Coastline"
    "coastal areas"              = "Coastline"
    "coastal area"               = "Coastline"
    "coastal caves"              = "Coastline"
    "coastal cave"               = "Coastline"
    "coastal cliffs"             = "Coastline"
    "coastal cliff"              = "Coastline"
    "coastal waters"             = "Coastline"
    "coastal water"              = "Coastline"
    "coastal palaces"            = "Coastline"
    "storm-swept coasts"         = "Coastline"
    "tidal caves"                = "Coastline"
    "tidal cave"                 = "Coastline"
    "tidal pools"                = "Coastline"
    "tidal pool"                 = "Coastline"
    "reefs"                      = "Coastline"
    "reef"                       = "Coastline"
    "coral reefs"                = "Coastline"
    "coral reef"                 = "Coastline"
    "islands"                    = "Coastline"
    "island"                     = "Coastline"
    "remote islands"             = "Coastline"
    "remote island"              = "Coastline"
    "docks"                      = "Coastline"

    # Ocean
    "oceans"                     = "Ocean"
    "ocean"                      = "Ocean"
    "deep oceans"                = "Ocean"
    "seas"                       = "Ocean"
    "sea"                        = "Ocean"
    "deep seas"                  = "Ocean"
    "shallow seas"               = "Ocean"
    "underwater caves"           = "Ocean"
    "underwater cave"            = "Ocean"
    "underwater fortresses"      = "Ocean"
    "underwater lairs"           = "Ocean"
    "underwater lair"            = "Ocean"
    "underwater temples"         = "Ocean"
    "underwater temple"          = "Ocean"
    "deep water"                 = "Ocean"
    "dark waters"                = "Ocean"
    "rivers"                     = "Ocean"
    "river"                      = "Ocean"
    "lakes"                      = "Ocean"
    "lake"                       = "Ocean"
    "large lakes"                = "Ocean"
    "shallow water"              = "Ocean"
    "ancient pools"              = "Ocean"
    "ancient pool"               = "Ocean"
    "hot springs"                = "Ocean"
    "hot spring"                 = "Ocean"
    "wells"                      = "Ocean"
    "well"                       = "Ocean"
    "deep water temples"         = "Ocean"

    # Swamp
    "swamps"                     = "Swamp"
    "swamp"                      = "Swamp"
    "marshes"                    = "Swamp"
    "marsh"                      = "Swamp"
    "bogs"                       = "Swamp"
    "bog"                        = "Swamp"
    "blighted wetlands"          = "Swamp"
    "blighted wetland"           = "Swamp"
    "fetid ruins"                = "Swamp"
    "fetid rivers"               = "Swamp"
    "hag covens"                 = "Swamp"
    "hag coven"                  = "Swamp"
    "lizardfolk temples"         = "Swamp"

    # Cave
    "caves"                      = "Cave"
    "cave"                       = "Cave"
    "caverns"                    = "Cave"
    "cavern"                     = "Cave"
    "deep caves"                 = "Cave"
    "giant caverns"              = "Cave"
    "giant cavern"               = "Cave"
    "underground lakes"          = "Cave"
    "underground lake"           = "Cave"

    # Dungeon / Underground
    "dungeons"                   = "Dungeon"
    "dungeon"                    = "Dungeon"
    "deep dungeons"              = "Dungeon"
    "labyrinths"                 = "Dungeon"
    "labyrinth"                  = "Dungeon"
    "sewers"                     = "Dungeon"
    "sewer"                      = "Dungeon"
    "underground"                = "Dungeon"
    "underground passages"       = "Dungeon"
    "underground passage"        = "Dungeon"
    "underground tunnels"        = "Dungeon"
    "underground tunnel"         = "Dungeon"
    "underground corridors"      = "Dungeon"
    "underground corridor"       = "Dungeon"
    "mines"                      = "Dungeon"
    "mine"                       = "Dungeon"
    "deep mines"                 = "Dungeon"
    "deep mine"                  = "Dungeon"
    "deep tunnels"               = "Dungeon"
    "deep tunnel"                = "Dungeon"
    "deep underground"           = "Dungeon"
    "death knight lairs"         = "Dungeon"
    "chaotic evil lairs"         = "Dungeon"
    "creators lair"              = "Dungeon"
    "dragon lairs"               = "Dungeon"
    "dragon lair"                = "Dungeon"
    "torture chambers"           = "Dungeon"
    "torture chamber"            = "Dungeon"
    "armories"                   = "Dungeon"
    "armory"                     = "Dungeon"
    "goblinoid strongholds"      = "Dungeon"
    "goblinoid stronghold"       = "Dungeon"
    "hobgoblin kingdoms"         = "Dungeon"
    "hobgoblin kingdom"          = "Dungeon"
    "orc strongholds"            = "Dungeon"
    "orc stronghold"             = "Dungeon"
    "cult lairs"                 = "Dungeon"
    "cult lair"                  = "Dungeon"

    # Underdark
    "underdark"                  = "Underdark"
    "underground cities"         = "Underdark"
    "underground city"           = "Underdark"
    "drow cities"                = "Underdark"
    "drow city"                  = "Underdark"
    "duergar cities"             = "Underdark"
    "duergar city"               = "Underdark"
    "myconid colonies"           = "Underdark"
    "myconid colony"             = "Underdark"
    "mind flayer colonies"       = "Underdark"
    "mind flayer colony"         = "Underdark"
    "quaggoth territory"         = "Underdark"
    "beholder lairs"             = "Underdark"
    "beholder lair"              = "Underdark"
    "beholder territory"         = "Underdark"
    "drow temples"               = "Underdark"
    "drow temple"                = "Underdark"
    "kuo-toa temples"            = "Underdark"
    "kuo-toa temple"             = "Underdark"
    "lolth temples"              = "Underdark"
    "lolth temple"               = "Underdark"
    "lolths realm"               = "Underdark"
    "feydark"                    = "Underdark"
    "underground forests"        = "Underdark"
    "underground forest"         = "Underdark"

    # Ruins
    "ruins"                      = "Ruins"
    "ruin"                       = "Ruins"
    "ancient ruins"              = "Ruins"
    "ancient ruin"               = "Ruins"
    "haunted ruins"              = "Ruins"
    "haunted ruin"               = "Ruins"
    "ruined fortresses"          = "Ruins"
    "ruined fortress"            = "Ruins"
    "flooded ruins"              = "Ruins"
    "flooded ruin"               = "Ruins"
    "dark ruins"                 = "Ruins"
    "shadow-blighted ruins"      = "Ruins"
    "verdant ruins"              = "Ruins"
    "barovian ruins"             = "Ruins"
    "ancient temples"            = "Ruins"
    "ancient temple"             = "Ruins"
    "cursed temples"             = "Ruins"
    "cursed temple"              = "Ruins"
    "cursed keeps"               = "Ruins"
    "cursed keep"                = "Ruins"
    "cursed locations"           = "Ruins"
    "cursed sites"               = "Ruins"
    "cursed site"                = "Ruins"
    "abandoned palaces"          = "Ruins"
    "abandoned palace"           = "Ruins"
    "arenas"                     = "Ruins"
    "arena"                      = "Ruins"
    "coliseums"                  = "Ruins"
    "coliseum"                   = "Ruins"
    "towers"                     = "Ruins"
    "tower"                      = "Ruins"
    "wizard towers"              = "Ruins"
    "wizard tower"               = "Ruins"
    "wizard fortresses"          = "Ruins"
    "wizard fortress"            = "Ruins"
    "wizard academies"           = "Ruins"
    "wizard academy"             = "Ruins"
    "libraries of lore"          = "Ruins"
    "library of lore"            = "Ruins"
    "laboratories"               = "Ruins"
    "laboratory"                 = "Ruins"
    "castles"                    = "Ruins"
    "castle"                     = "Ruins"
    "keeps"                      = "Ruins"
    "keep"                       = "Ruins"
    "fortresses"                 = "Ruins"
    "fortress"                   = "Ruins"
    "temples"                    = "Ruins"
    "temple"                     = "Ruins"
    "shrines"                    = "Ruins"
    "shrine"                     = "Ruins"
    "sacred sites"               = "Ruins"
    "sacred site"                = "Ruins"
    "sites of great evil"        = "Ruins"
    "sites of tragic death"      = "Ruins"
    "sites of violent death"     = "Ruins"
    "haunted manors"             = "Ruins"
    "haunted manor"              = "Ruins"
    "summoning circles"          = "Ruins"
    "summoning circle"           = "Ruins"
    "spider-infested ruins"      = "Ruins"

    # Tomb
    "tombs"                      = "Tomb"
    "tomb"                       = "Tomb"
    "crypts"                     = "Tomb"
    "crypt"                      = "Tomb"
    "graveyards"                 = "Tomb"
    "graveyard"                  = "Tomb"
    "ancient tombs"              = "Tomb"
    "ancient tomb"               = "Tomb"
    "cursed tombs"               = "Tomb"
    "cursed tomb"                = "Tomb"
    "desert tombs"               = "Tomb"
    "desert tomb"                = "Tomb"
    "phylactery vaults"          = "Tomb"
    "phylactery vault"           = "Tomb"
    "burial sites"               = "Tomb"
    "burial site"                = "Tomb"
    "underground slumber sites"  = "Tomb"

    # City
    "cities"                     = "City"
    "city"                       = "City"
    "cities of brass"            = "City"
    "city of brass"              = "City"
    "towns"                      = "City"
    "town"                       = "City"
    "villages"                   = "City"
    "village"                    = "City"
    "near cities"                = "City"
    "near civilization"          = "City"
    "near human settlements"     = "City"
    "urban"                      = "City"
    "urban hideouts"             = "City"
    "urban hideout"              = "City"
    "urban rooftops"             = "City"
    "urban rooftop"              = "City"
    "urban shadows"              = "City"
    "settlements"                = "City"
    "settlement"                 = "City"
    "remote settlements"         = "City"
    "border towns"               = "City"
    "border town"                = "City"
    "mortal cities"              = "City"
    "mortal city"                = "City"
    "courts"                     = "City"
    "court"                      = "City"
    "noble estates"              = "City"
    "noble estate"               = "City"
    "manors"                     = "City"
    "manor"                      = "City"
    "palaces"                    = "City"
    "palace"                     = "City"
    "stables"                    = "City"
    "stable"                     = "City"
    "rooftops"                   = "City"
    "rooftop"                    = "City"
    "upper-class society"        = "City"
    "gardens"                    = "City"
    "garden"                     = "City"
    "foundries"                  = "City"
    "foundry"                    = "City"
    "criminal lairs"             = "City"
    "criminal lair"              = "City"
    "thieves guilds"             = "City"
    "thieves guild"              = "City"
    "mercenary companies"        = "City"
    "mercenary company"          = "City"

    # Nine Hells
    "nine hells"                 = "Nine Hells"
    "infernal fortresses"        = "Nine Hells"
    "infernal fortress"          = "Nine Hells"
    "infernal lairs"             = "Nine Hells"
    "infernal lair"              = "Nine Hells"
    "infernal planes"            = "Nine Hells"
    "infernal plane"             = "Nine Hells"
    "devil courts"               = "Nine Hells"
    "devil court"                = "Nine Hells"
    "devil lairs"                = "Nine Hells"
    "devil lair"                 = "Nine Hells"
    "devil strongholds"          = "Nine Hells"
    "devil stronghold"           = "Nine Hells"
    "devil summoning sites"      = "Nine Hells"

    # Abyss
    "abyss"                      = "Abyss"
    "demon lairs"                = "Abyss"
    "demon lair"                 = "Abyss"
    "demon strongholds"          = "Abyss"
    "demon stronghold"           = "Abyss"
    "lower planes"               = "Abyss"
    "lower plane"                = "Abyss"
    "slaad lairs"                = "Limbo"
    "slaad lair"                 = "Limbo"

    # Feywild
    "feywild"                    = "Feywild"

    # Elemental Planes
    "elemental planes"           = "Elemental Planes"
    "elemental plane"            = "Elemental Planes"
    "elemental chaos"            = "Elemental Planes"
    "elemental plane of air"     = "Elemental Planes"
    "elemental plane of earth"   = "Elemental Planes"
    "elemental plane of fire"    = "Elemental Planes"
    "elemental plane of ice"     = "Elemental Planes"
    "elemental plane of water"   = "Elemental Planes"

    # Astral Plane
    "astral plane"               = "Astral Plane"
    "githyanki strongholds"      = "Astral Plane"
    "githyanki stronghold"       = "Astral Plane"

    # Limbo
    "limbo"                      = "Limbo"
    "portals of chaos"           = "Limbo"
    "portals to chaos"           = "Limbo"
    "githzerai monasteries"      = "Limbo"
    "githzerai monastery"        = "Limbo"

    # Gehenna
    "gehenna"                    = "Gehenna"
    "yugoloth lairs"             = "Gehenna"
    "yugoloth lair"              = "Gehenna"
    "yugoloth strongholds"       = "Gehenna"
    "yugoloth stronghold"        = "Gehenna"

    # Celestial Planes
    "celestial planes"           = "Celestial Planes"
    "celestial plane"            = "Celestial Planes"
    "celestial realms"           = "Celestial Planes"
    "celestial realm"            = "Celestial Planes"
    "celestial sites"            = "Celestial Planes"
    "celestial site"             = "Celestial Planes"
    "divine realms"              = "Celestial Planes"
    "divine realm"               = "Celestial Planes"

    # Far Realm
    "far realm"                  = "Far Realm"
    "far realm rifts"            = "Far Realm"
    "far realm rift"             = "Far Realm"

    # Mechanus
    "mechanus"                   = "Mechanus"

    # Ethereal Plane
    "the ethereal plane"         = "Ethereal Plane"
    "ethereal plane"             = "Ethereal Plane"
    "planes bordering ethereal"  = "Ethereal Plane"
}

# Strings that have no meaningful entity mapping — drop them
$dropSet = @(
    "anywhere it wakes"
    "anywhere its quarry can be found"
    "anywhere summoned"
    "wherever its amulet holder commands"
    "bodies of infected hosts"
    "mortal world as messenger"
    "mortal dreams"
    "castle ravenloft"          # specific named location
    "isolated lairs"            # too vague
    "border regions"            # already mapped above
    "near cities"               # already mapped
    "near civilization"         # already mapped
    "near human settlements"    # already mapped
    "border towns"              # already mapped
)

$root        = Resolve-Path "$PSScriptRoot\.."
$monstersDir = Join-Path $root "data\monsters"
$files       = Get-ChildItem "$monstersDir\*.md"
$updated     = 0
$skipped     = 0
$errors      = 0

foreach ($file in $files) {
    $lines = Get-Content $file.FullName -Encoding UTF8

    # Locate frontmatter bounds
    $fmStart = -1; $fmEnd = -1; $dashCount = 0
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^---') {
            $dashCount++
            if ($dashCount -eq 1) { $fmStart = $i }
            elseif ($dashCount -eq 2) { $fmEnd = $i; break }
        }
    }
    if ($fmEnd -lt 0) { $errors++; continue }

    # Find habitats block — read ALL entries regardless of format
    $habitatsStartIdx = -1
    $habitatsEndIdx   = -1
    $rawHabitats      = @()   # plain strings (not yet linked)
    $inHabitats       = $false

    for ($i = $fmStart; $i -le $fmEnd; $i++) {
        $l = $lines[$i]
        if ($l -match '^habitats:') {
            $habitatsStartIdx = $i
            if ($l -match '^habitats:\s*\[\]') { $habitatsEndIdx = $i; break }
            $inHabitats = $true
            continue
        }
        if ($inHabitats) {
            if ($l -match '^\s{2}-\s+(.+)') {
                $val = $Matches[1].Trim().Trim('"')   # strip quotes if present
                # Strip existing [[...]] wrapper if already linked
                if ($val -match '^\[\[(.+)\]\]$') { $val = $Matches[1] }
                $rawHabitats += $val
                $habitatsEndIdx = $i
            } else {
                $inHabitats = $false
                break
            }
        }
    }

    if ($habitatsStartIdx -lt 0 -or $rawHabitats.Count -eq 0) { $skipped++; continue }

    # Map to entity names, deduplicate
    $mapped = @()
    foreach ($h in $rawHabitats) {
        $key = $h.ToLower()
        if ($dropSet -contains $key) { continue }
        if ($habitatMap.Contains($key)) {
            $entity = $habitatMap[$key]
            if ($mapped -notcontains $entity) { $mapped += $entity }
        }
        # Keys already wiki-link entity names (from prior partial run) pass through via ToLower lookup
        # If no match, silently drop — no entity for that habitat string
    }

    if ($mapped.Count -eq 0) { $skipped++; continue }

    # Build new habitats YAML block
    $newHabitatLines = @("habitats:")
    foreach ($e in $mapped) { $newHabitatLines += "  - `"[[$e]]`"" }

    # Build wiki-link body line
    $wikiLinks       = ($mapped | ForEach-Object { "[[$_]]" }) -join " | "
    $habitatBodyLine = "**Habitats:** $wikiLinks"

    # Check if body already has a Habitats line (from prior partial run)
    $bodyHasLink = ($lines | Where-Object { $_ -match '^\*\*Habitats:\*\*' }).Count -gt 0

    # Replace habitats block; strip any existing body Habitats line first
    $cleanedLines = $lines | Where-Object { $_ -notmatch '^\*\*Habitats:\*\*' }

    # Recalculate indices in cleaned array
    $cleanHabitatsStart = -1; $cleanHabitatsEnd = -1; $ci = 0
    foreach ($l in $cleanedLines) {
        if ($l -match '^habitats:') { $cleanHabitatsStart = $ci }
        if ($cleanHabitatsStart -ge 0 -and $ci -gt $cleanHabitatsStart -and $l -match '^\s{2}-') { $cleanHabitatsEnd = $ci }
        elseif ($cleanHabitatsStart -ge 0 -and $ci -gt $cleanHabitatsStart -and $l -notmatch '^\s') { break }
        $ci++
    }
    if ($cleanHabitatsStart -lt 0) { $errors++; continue }
    if ($cleanHabitatsEnd -lt 0) { $cleanHabitatsEnd = $cleanHabitatsStart }  # inline []

    $newLines  = $cleanedLines[0..($cleanHabitatsStart - 1)] + $newHabitatLines + $cleanedLines[($cleanHabitatsEnd + 1)..($cleanedLines.Count - 1)]
    $newLines += $habitatBodyLine

    if (-not $WhatIf) {
        Set-Content -Path $file.FullName -Value $newLines -Encoding UTF8
    }
    $updated++
}

Write-Host "Updated: $updated | Skipped: $skipped | Errors: $errors"
