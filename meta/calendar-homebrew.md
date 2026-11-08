---
type: meta
tags: [guideline, calendar]
epoch_year: 0
year_suffix: ""
months:
  - "I:30"
  - "II:30"
  - "III:30"
  - "IV:30"
  - "V:30"
  - "VI:30"
  - "VII:30"
  - "VIII:30"
  - "IX:30"
  - "X:30"
  - "XI:30"
  - "XII:30"
weekdays: []
---

# Calendar (Aethryn)

Machine values for the homebrew world. The contract (`timeline_date` shape, ordering, precision,
sub-day placement) lives in `meta/calendar-template.md`; the time system itself is canon in
`data/lore/calendar.md`.

- **Year 0 is the Astra impact.** The present is 6743. Years are 360 days.
- **The twelve months are positional only.** They are 30-day blocks that give a day-of-year a
  `YYYY-MM-DD` shape; `6743-05-21` is day 141. They are not Crawls and have no in-world names, so
  they print as Roman numerals. The in-world month, the Crawl, is event-driven and tracked in
  `scheduler/campaign/_sky-clock.md`.
- **No weekdays.** Aethryn's week is the gap between two Showerings, not a fixed count of days.
