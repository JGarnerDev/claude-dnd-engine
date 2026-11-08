---
name: "World Calendar"
aliases:
  - "World Calendar"
  - "Aethryn Calendar"
campaign: homebrew
type: lore
subtype: calendar
exists: true
state: stable
contributed_by: miguel
confirmed_date: "2026-11-08"
source_session: "DM ratification (Jeff, calendar ingest)"
tags:
  - lore
  - lore/calendar
importance: major
description: "How Aethryn keeps time: a fixed 24-hour day and 360-day year counted from the Astra impact (present 6743), with weeks and months set by falling Whatwill rather than by the sky. Showerings, Crawls, the 18-day night of the two suns, Fida, and Astra's thousand-year return."
relates_to:
  - "[[World History]]"
  - "[[The Astra Collision]] (year 0)"
  - "[[Astra]] (the Glistening)"
  - "[[Whatwill]] (Showerings and Crawls)"
  - "[[The Vitricants]] (the Vitrian calendar)"
  - "[[The Lifted]] (Opticons)"
---

*Miguel built the system from Paul's Whatwill and Astra lore; Jeff ratified it on 2026-11-08 (the
decision record was `miguel-calendar-ingest.md`). Machine values live in `meta/calendar-homebrew.md`;
the current date lives in `scheduler/campaign/_sky-clock.md`.*

Aethryn keeps two kinds of time. The sky gives the day and the year, and anyone can count them in
advance. The glass gives the week and the month, and nobody can: they are written down after they
happen.

## Year Structure

- **Day.** 24 hours, sunrise to sunrise of the brighter sun.
- **Year.** 360 days, one orbit of the two suns.
- **Count.** Years run from the Astra impact, year 0. The present is **6743**.
- **Glistening.** Astra returns every thousand years: 1000, 2000 and so on. Six have passed. The
  Seventh falls in year 7000, about 257 years from now.

## Calendar Systems

- **Showering.** One Whatwill strike, about once a week, never on a schedule. The only warning is
  the **Kerning**, a whistle that sounds moments before the glass lands. What people call a week is
  the gap between two Showerings, five days or ten.
- **Crawl.** The month. A Crawl ends when a major landing comes down, so it runs about thirty days
  but sometimes far longer. A year can hold eleven Crawls or thirteen. People reckon as "late in the
  fifth Crawl" or "twenty-six days without a landing". The running Crawl carries over when the year
  turns; Crawl 1 of a new year begins at its first major landing.
- **Opticon.** When a strike lifts a new Islift, [[The Lifted]] call an Opticon and the Vitrian count
  ticks forward. Opticons do not end Crawls.

## The Sky

- **Two suns.** A bright gold sun and a dimmer red one orbit each other every 18 days. When they
  stand together they rise and set as one, and the night is 12 hours of real dark. As they drift
  apart the red sun lingers after the gold one sets, and the dark shrinks; at the far point of the
  cycle the red sun rises as the gold one sets and there is no real dark at all. Then it swings
  back. Neither sun has a settled name.
- **Fida.** Aethryn's moon, broken by the impact, with shards still drifting off it. It waxes and
  wanes over about 29.5 days and counts nothing. [[Luci]] gave it the name Fida in the Dead Sun
  tongue.
- **The Slices and Islifts.** Ground thrown up by the impact: the Slices in high orbit, the Islifts
  low and wandering. They move too irregularly to keep time.
- **Nine wanderers.** Other planets, unnamed, read for omens and nothing else.
- **The shard band.** The trillions of glass shards strung along Astra's orbit. The Showerings
  happen as Aethryn passes through it; the shards stay invisible against the Blanket until they
  land.
- **Astra.** It travels a long, narrow ellipse. For most of a thousand years it sits far out in
  the dark, faint and barely moving. In the last stretch it brightens, speeds up, threads between
  the two suns, and is flung back out. The pass lasts weeks. In 6743 Astra is far out and gives no
  sign of its return.

## Current Date

The party's date is kept in `scheduler/campaign/_sky-clock.md` and advanced at every homebrew
`/recap`. As of Session 32: **6743, day 141** (`6743-05-21`), about ten in the morning, Crawl 5, day 27.

## Note on the Vitrian Calendar

[[The Vitricants]] maintain their own calendar counting **Opticons** and tracking the **Glistening**
cycle. Its arithmetic is not a public document. It matters to Whatwill-economy actors and Lifted
communities, not to ordinary commerce or law.
