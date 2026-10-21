---
# --- MANDATORY (entity base) ---
name: "Ashford"
type: location
subtype: city
exists: true
source_session: [[Session 29 The Mistake]]
confirmed_date: "2026-10-06"
state: troubled
campaign: homebrew
tags:
  - location
  - location/city

# --- MANDATORY (city) ---
global_location: [[Stonemarch]]
purpose: commerce

# --- OPTIONAL (entity base) ---
importance: major
active: true
rulership: [[Silas Crubb]]
relates_to:
  - "[[Stonemarch]] (the fief it sits in)"
  - "[[Lord Corren Cael]] (its lord, who cannot cover his own ground)"
  - "[[Mara Tull]] (its sheriff, and most of its actual defense)"
  - "[[Silas Crubb]] (its mayor and general-goods merchant)"
  - "[[Richmond Ellesine]] (its blacksmith, and the living witness to the feud)"
  - "[[Elowen Rimetusk]] (its old mage)"
  - "[[Harrow Bane]] (the name behind the raids)"
  - "[[House Cael]] (its lord's house)"
  - "[[House Marlow]] (the rival house whose deniable raiders bleed it)"
  - "[[Duskwater]] (the neighbouring fief the raiders come out of, overland)"
  - "[[The Golden Lioness]] (its brewery and pub)"
  - "[[Calenmere Basin]] (broader region — purple southern edge of the political map)"
description: "A riverside borderlands town on the small tributary feeding the Moorthistle, named for the ford that is its southern door. Lord Cael's ground, under-defended and steadily bled by deniable overland raids out of Duskwater — western-frontier country where a homestead learns to defend itself."

# --- OPTIONAL (city) ---
population: "A few hundred — a ford-town and market stop, not a city"
tensions:
  - "Preyed on by deniable land raiders and the extortion that rides with them"
  - "Its lord is a nominal protector stretched too thin to cover his own ground"
  - "The ford that makes the town is also the soft door raiders cross to reach it"
  - "Townsfolk survive by trading with whoever pays and favouring neither house out loud"
factions:
  - [[House Cael]]
shops:
  - [[The Golden Lioness]]
---

Ashford is a riverside borderlands town in **[[Stonemarch]]**, the purple frontier fief of
**[[House Cael]]**, on the southern edge of the **[[Calenmere Basin]]** near the
Moorthistle, the border-river that divides purple (Velmora) from red (Riolgatha). It sits on a small tributary threading down to
that river, and it takes its name from the **ford** that tributary makes — the fief's soft
southern crossing, and the reason there is a town here at all. Goods move through the ford;
so does everything else.

It is frontier country in the western sense: lawless margins, hard travel, a day's ride
between anywhere, and homesteads that learn to defend themselves because nobody else will.
**[[Lord Corren Cael]]** is Ashford's lord and means well enough, but he is bound to a
distant crown and cannot cover his own ground. What covers the town instead is
**[[Mara Tull]]**, a sheriff with too few hands; **[[Elowen Rimetusk]]**, an old town mage
whose power has outlasted her mind; and whoever happens to be standing there.

## The bleeding

Ashford is preyed on — raids on stock and stores, and the extortion that rides along behind
them. It has been going on for **two or three years**: a long, slow bleed. The town is worn
down and cynical, several families have already left, and every season makes Lord Cael's
letters look worse. The night the party arrives is the first strike to hit the whole town at
once. The raiders present as independent bandits, and the town mostly talks about them that
way. They are not. They are **[[Harrow Bane]]**'s band, on a leash held by **[[House Marlow]]** out of
neighbouring **[[Duskwater]]**, run overland from the southeast and across Ashford's own
ford, through enough intermediaries that no order exists on paper and the house can disavow
the whole business. The grievance underneath it is two generations old and belongs to the two houses,
not the town — but Ashford is where the bill lands.

This is discoverable, not announced. Townsfolk know pieces: a name they are afraid of, a
face they have seen twice, a strange marked man who hit the far side of town. Dig and the
feud comes apart in your hands. Don't dig and Ashford is simply a place being robbed.

## Living here

The town stays alive by being useful to everyone and loyal to no one in public.
**[[Silas Crubb]]** is both its mayor and its general-goods merchant, and keeps both roles
carefully neutral — he trades with whoever pays and has never been seen favouring one house
over the other. **[[Richmond Ellesine]]**, the smith, is of the old war generation and chose
the forge over the fight; he was there for the thing the two houses are still arguing about,
and will say so to anyone who respects good work.

For healing there is a roadside shrine to Lathander and a herb-wife who sets bones. No priest
in town can cast. For worse cases there is **the witch** at the edge of town, a niche healer the
village knows about and treats as risky to deal with. She has never harmed the village.
*(DM-only: she is a vampire, nobody knows it, and she is the target of [[Wick]]'s hunt. She is
Skyler's cameo, and her name waits on Skyler.)*

Ashford speaks Common, pays in plain gold, silver and copper, and treats
odd blood as unremarkable, because it is used to [[Sable Wren]]. Lord Cael's hall is a modest
fortified seat 3–4 days' ride north: too far to come in time, near enough for a letter.

Composition follows the surrounding region — no notable deviation from the frontier mix.

## The Golden Lioness

**[[The Golden Lioness]]** is meant to be the town's first tavern and brewery. **[[Sable Wren]]**
came about a week before the Session 29 raid to set it up, in a building still half-built. Its
hearth never goes out. The raid wrecked most of it and took the stock it was to open on
(retconned at Session 30; see its file).

## Open

- **World-grid placement** is unresolved. On `maps/locations/calenmere-political.png`
  Ashford sits in the purple region's southern edge, between markers 10 and 9; the
  world-master col/row gets captured at `/region` time. It has no city-registry ID — it was
  newly placed rather than graduated from an existing map dot.
- **Trade-route coverage** is missing. The Moorthistle is load-bearing lore and the ford is
  a real crossing, so a route entity naming Ashford is worth making once the regional trade
  picture is drawn.

## Canon — Session 29

The party arrived here by night, falling out of the light of [[The Wanderer's Boon]] into the
raid on [[The Golden Lioness]]. [[Halsby]] came overland, told by Asher's fox that Ashford is a
town on the river beset by bandits. The rest of the town (the separate raids, [[Mara Tull]],
[[Silas Crubb]]) has not yet been seen on screen.

## Canon — Session 30

- **Every street was hit at once.** [[Mara Tull]]: a coordinated raid by several groups, part of
  a larger, more organized force camped about a day across the river and now split up. The last
  raid was about three months ago. This is the third crew this season. The raiders call
  themselves independent, but every pair of boots came from the same cobbler.
- **Losses:** [[Old Tobin Reed]]'s only ferry boat was burned early, and with it much of the
  town's river trade. Only the armed townsfolk were hurt; [[Dunny Marsh]] was healed by the party.
- **No town hall yet.** [[Silas Crubb]] is acting mayor and market holder, organizing the town's
  construction. The town has no support from the local king, and the lords have other problems
  (per Sable).
- **Magic is rare here.** Townsfolk murmured at the door watching the party heal Dunny.
- **Named in fear:** [[Wick]] (an elf commander with a neat brand) and [[Harrow Bane]] (a name
  that hushes a room).
- **Heading:** [[Jory Pike]] saw the archer's cart take the southeast track, heavily loaded.
- Mara saw a ray of light fall from the sky about an hour before the party arrived. The party
  allowed that it could have been them.
