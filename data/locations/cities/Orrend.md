---
# --- MANDATORY (entity base) ---
name: "Orrend"
type: location
subtype: city
exists: false
state: stable
campaign: homebrew
tags:
  - location
  - location/city

# --- MANDATORY (city) ---
global_location: [[Stonemarch]]
purpose: commerce

# --- OPTIONAL (entity base) ---
aliases:
  - C05-04d
  - Dot 9
importance: major
active: true
contributed_by: jeff
relates_to:
  - "[[Stonemarch]] (the city and its market sit on Cael ground)"
  - "[[Duskwater]] (the wharves are Marlow property; Duskwater's land starts across the water meadows)"
  - "[[House Cael]] (holds the market charter)"
  - "[[House Marlow]] (holds the wharves and the river dues)"
  - "[[Ashford]] (a day and a half upriver; where Ashford's barges actually load)"
  - "[[Silas Crubb]] (sells through it and resents paying both houses)"
  - "[[The Broadwend Run]] (the barge trade it ships down to the bay)"
description: "The first big city south of Ashford: a walled river city on the bend of the Moorthistle, a day and a half's ride away. The upper town, market and charter are House Cael's; the wharf district and the river dues are House Marlow's. Everything that leaves by water pays both, and most of the money ends up on the water."

# --- OPTIONAL (city) ---
population: "~12,000, a walled river city"
tensions:
  - "Two lords in one city: Cael's reeve holds the walled upper town and the market, Marlow's wharfmaster holds the wharf district"
  - "Two garrisons inside one wall, each sworn to a different house"
  - "Every barge pays twice, market toll and river dues, and both houses blame the other for the price"
  - "A border port facing Riolgatha across the Moorthistle"
  - "The city is Cael's richest holding on paper, and most of its wealth leaves through Marlow's gate"
factions:
  - [[House Cael]]
  - [[House Marlow]]
rulership: "Split. Cael's reeve runs the upper town, the market and the walls; Marlow's wharfmaster runs the wharf district and the river. Both unnamed."
trade_specialty: "the river trade of the upper Moorthistle: grain, ale, hides and timber out by barge; salt, tools, cloth and coin back up"
routes:
  - [[The Broadwend Run]]
---

# Orrend

Orrend is the first big city south of [[Ashford]]: a walled river city of about twelve thousand
on the bend of the Moorthistle, a day and a half's ride away. Ashford has a creek and a ford;
Orrend has stone quays deep enough for bay barges, warehouses five storeys high, and a wall
that runs down to the water and stops there. From its wharves, freight goes down the
Moorthistle and the Broadwend to the bay, and on to [[Tassad]] by [[The Broadwend Run]].

On paper it is [[Stonemarch]]'s richest holding and the nearest thing [[Lord Corren Cael]] has
to a seat of trade. In practice it is only half his, and it is the less profitable half.

## Two lords, one city

The **upper town** belongs to [[House Cael]]: the walls, the gates, the market square, the
charter and the reeve. The **wharf district** below the wall belongs to [[House Marlow]], out
of neighbouring [[Duskwater]]: the quays, the cranes, the warehouses, the river dues and the
river gate. Each house keeps its own garrison inside the same circuit of wall, sworn to
different lords, and they change the watch at different hours.

Nobody in the city agrees on how the split came about. It is old, it is written down, and both
houses have been reading the document differently for two generations.

In practice a barge loaded in Orrend pays twice: Cael's market toll to sell on the square, and
Marlow's dues to leave by water. Each house blames the other for the price. Market tolls are
modest and river dues are not, so the city's wealth flows downhill to the wharves. That is a
large part of why Stonemarch is so thin everywhere else: its one rich city mostly enriches
Duskwater.

Orrend is peaceful in the way a crowded room is peaceful. The reeve and the wharfmaster greet
each other in the street, and their people drink in different taverns.

## At the table

- **[[Silas Crubb]]'s line on the map:** *"Orrend. Market's Cael's, the water's Marlow's, and you
  pay both."*
- It is the party's first real city: somewhere to sell loot, buy what Ashford doesn't stock,
  find a scribe or a temple with a priest who can cast, ship something downriver, or see the
  feud up close, where both houses have to be civil.
- Lord Cael's reeve here answers letters the way Lord Cael does: promptly, and with nothing.

## DM only

- **Marlow's wharves face Riolgatha across the water.** This is where [[House Marlow]] keeps
  its quiet line to the red side. Barges that clear Orrend "for the bay" do not always go
  to the bay.
- **Suggested hook (Jeff's call):** the matched boots on [[Harrow Bane]]'s raiders ("Third crew
  this season. Same cobbler.") trace to a cobbler who works out of a Marlow warehouse on the
  Orrend wharf. It is a findable thread from Ashford to Duskwater that never names
  [[Lady Sorcha Marlow]].

## Open

- Names for the reeve and the wharfmaster, and the city's inns, temples and shops.
- Where the Cael/Marlow split came from. It belongs to the two-generation grievance, which is
  held, so it is left vague here on purpose.
- Map: registry dot `C05-04d` (overlay dot 9). Label it in Inkarnate, then graduate it per
  `maps/CLAUDE.md`.
