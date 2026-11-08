# The Sky Clock (as of: Session 32)

DM-only. Not an entity. Holds Aethryn's running date, the Crawl tally, the next Kerning and a
per-session log. The `_` prefix keeps it out of `validate.ps1` and the semantic index. **Update it at
every homebrew `/recap` and restamp the header even when no time passed** (the engine's stamp
pattern). The time system is canon in `data/lore/calendar.md`; the maths is `scripts/sky.py`.

## Engine

A campaign tracker: `/transcript`, `/recap` and `/session` read every `scheduler/campaign/_*.md`
file with an `(as of: Session NN)` header and follow this section. Homebrew sessions only.

- **`/transcript` mines:** cues for how much in-world time passed (sleeps, travel, "next morning"),
  the time of day the session ends, and any Kerning or Whatwill landing played at the table. Write
  them under `### Sky Clock` in the inbox note's `## Trackers`, marked `(?)` when unsure.
- **`/recap` asks:** the in-world date and time the session ended (propose it from the last log line
  plus the time that passed), and whether a Showering or a major landing happened. Then:
  - Set the session's `in_world_end_date` and `in_world_end_time` to match.
  - Update `## Now`. A major landing ends the Crawl: the next Crawl begins that day. The running
    Crawl carries over when the year turns; Crawl 1 of a year begins at its first major landing.
  - If the date passed the next Kerning, reroll it (`uv run scripts/roll.py 1d6+4`) from the day of
    the last Showering. About one Showering in four or five is a major landing; the DM calls it.
  - Append the session's line to `## Log` in the exact shape below (`scripts/lib/sky.py` parses
    it for the recap deck's sky slide), then restamp the header.
- **`/session` checks:** run `uv run scripts/sky.py <date> --time <time> --crawl-start <began>
  --days 3` from `## Now` and open the plan with the sky line: date, Crawl and day, tonight's true
  dark, Fida, days to the next Kerning. If the next Kerning falls inside the session's likely span,
  offer it as a beat and ask whether it is a major landing. Never put the Kerning roll in
  player-facing text.

## Now

- **Date:** `6743-05-21`, about 10 a.m. (Ashford Day 2), on the hill south of [[The Waystation]]
- **Crawl:** 5 of 6743, began `6743-04-25` (day 27 today). No major landing since.
- **Sun phase:** 5 of 18: about 5.3 hours of true dark tonight, shrinking to none by `6743-05-25`
- **Fida:** full on the night of Ashford Day 1, waning now
- **Next Kerning:** `6743-06-01` (rolled 1d6+4 = 10 from `6743-05-21` at the calendar ingest,
  2026-11-08). The DM decides at the time whether it is a major landing.
- **Seventh Glistening:** year 7000, 257 years out

## Log

One line per recapped homebrew session, in this exact shape:
`- **Session NN** · YYYY-MM-DD HH:MM · Crawl N of YYYY (began YYYY-MM-DD)` then any notes.

- **Session 29** · 6743-05-20 22:00 · Crawl 5 of 6743 (began 6743-04-25) · arrival and the raid;
  Luci names Fida under a full moon. Dated at the calendar ingest.
- **Session 30** · 6743-05-20 23:30 · Crawl 5 of 6743 (began 6743-04-25) · the Golden Lioness.
  Dated at the calendar ingest.
- **Session 31** · 6743-05-21 07:00 · Crawl 5 of 6743 (began 6743-04-25) · the Red Trail sets out.
  Dated at the calendar ingest.
- **Session 32** · 6743-05-21 10:00 · Crawl 5 of 6743 (began 6743-04-25) · the chase, the fork and
  the scout. Dated at the calendar ingest.

## Ideas sheet

Not canon until played. Mark **used: Session NN** when one lands.

1. **A Kerning mid-scene.** The whistle sounds while the party is in the middle of something else.
   Everyone in Ashford knows to get indoors; the party doesn't yet.
2. **The fifth Crawl runs long.** It is already 27 days old. Ashford's people start counting out loud
   ("thirty-one days, no landing"), and a long Crawl reads as a bad sign.
3. **A major landing nearby** ends Crawl 5 and makes a Lensing Zone within a day's ride. Partenariat
   buyers and Courts Superior claimants arrive within the week.
4. **The bright nights.** Around `6743-05-25` there is no true dark at all. Anyone the party hunts
   by night has nowhere to hide, and neither does the party.
