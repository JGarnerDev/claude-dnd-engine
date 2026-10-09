---
# --- MANDATORY (entity base) ---
name: "The Broadwend Run"
type: route
subtype: trade
exists: false
state: active
campaign: homebrew
tags:
  - route/trade
  - region/calenmere

# --- MANDATORY (route) ---
origin: [[Orrend]]
destination: [[Tassad]]
medium: river

# --- OPTIONAL (entity base) ---
importance: major
active: true
contributed_by: jeff
relates_to:
  - "[[Orrend]] (the loading port: every barge pays Marlow's dues here)"
  - "[[Tassad]] (where the barge freight is sold or shipped on)"
  - "[[House Marlow]] (owns the Orrend wharves and the river dues)"
  - "[[Ashford]] (feeds it by road and flatboat)"
  - "[[Bay B Circuit]] (the sea lanes it empties into at the Broadwend's mouth)"
description: "The barge trade down the Moorthistle and the Broadwend: loaded at Orrend's wharves, floated down to the bay, and carried by ship to Tassad. The upper Moorthistle's whole export economy, and House Marlow's toll on it."

# --- OPTIONAL (route) ---
controlling_faction: [[House Marlow]]
primary_goods:
  - Grain
  - Ale
  - Hides
  - Timber rafts
  - "Upriver: salt, tools, cloth, coin"
travelers:
  - Barge crews and polemen
  - Grain and ale factors
  - Travellers who would rather float than ride three weeks
hazards:
  - "The junction where the Moorthistle meets the western branch: shoals and a hard current"
  - "The lower Broadwend runs between Riolgatha and the navy nation, and both banks want a toll"
toll_points:
  - "Orrend wharves (Marlow river dues)"
distance: "about 900 km by water from Orrend to Tassad"
travel_time: "about 9 days: a week by barge to the Broadwend's mouth, then a ship across the bay. Locals round it to 'ten days from Ashford.'"
---

# The Broadwend Run

The **Broadwend Run** is how the upper Moorthistle reaches the sea. Barges load at
[[Orrend]]'s wharves, pay [[House Marlow]]'s river dues, and float down the Moorthistle to
where it meets its western branch and becomes the Broadwend. From there they go down the
Broadwend to the bay, where the freight moves onto ships for the short crossing to [[Tassad]].
At the Broadwend's mouth it joins the [[Bay B Circuit]].

Downriver go grain, ale, hides and rafted timber from [[Ashford]]'s country and the rest of
the Moorthistle valley. Upriver come salt, tools, cloth and coin. Locals call the whole trip
"a barge down the Moorthistle and a ship from the bay," and quote it as ten days from Ashford.

Whoever holds the Orrend wharves holds the Run. That is House Marlow, and it is most of
Marlow's wealth.

## Open

- The lower Broadwend is the red/navy border, so who tolls the lower river is unset.
- A named waystop or toll at the junction, if play ever goes there.
