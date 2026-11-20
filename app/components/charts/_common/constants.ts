// Constants for the engine side of the charts: the calendar-aware ruler and
// the segmented axis (axis.ts, segments.ts, ticks.ts), the filter, and the zoom
// reach handed to jeff-ui. Chart geometry (margins, label packing, density
// bars, lanes) lives in jeff-ui/charts.

export const PX_PER_YEAR = 160; // default density for tests that lay an axis out by hand
// Deepest zoom also guarantees you can get this close: one calendar month fills
// at least this fraction of the viewport width at maximum zoom (both views). >1
// lets a single month grow wider than the viewport so day-granular spans (a
// session-by-session campaign) can spread their beats apart instead of stacking.
export const MONTH_VIEW_FRAC = 1.4;
// One step finer than MONTH_VIEW_FRAC: the deepest zoom also guarantees you can
// reach day-granular ticks, where one calendar day fills at least this fraction
// of the viewport width (both views). dayWidth = pxPerYear / daysPerYear, so the
// density that puts a day at that fraction is DAY_VIEW_FRAC·viewportWidth·daysPerYear.
// Sized so a day clears MIN_TICK_PX comfortably on a normal viewport, letting a
// session-by-session campaign spread to per-day ticks instead of stopping at months.
export const DAY_VIEW_FRAC = 0.12;
// Tick labels are centered on their x (translateX(-50%)); a tick sitting flush at a
// canvas edge would spill its label past the bound and trip the horizontal
// scrollbar. The axis clips the tick band this many px in from BOTH edges so the
// first/last tick label keeps equal breathing room from each view edge. Sized to
// ~half the widest tick label at the 12px tick font (a long month name), well under
// jeff-ui's AXIS_MARGIN gutter so a near-edge year tick still shows.
export const TICK_LABEL_PAD = 40;
export const EDGE_PAD = 0.05; // breathing room before first / after last beat, as a fraction of span
// World view extends its right edge further than EDGE_PAD so the axis max sits at
// least 50% past the latest beat (the newest session) — headroom for sessions to
// come instead of jamming the latest one against the canvas edge. A fraction of
// the beat span added on the RIGHT only (left keeps EDGE_PAD). Swimlane keeps the
// symmetric EDGE_PAD.
export const WORLD_RIGHT_PAD = 0.5;

// Segmented axis (helpers/segments.ts). A stretch between two beats is "dead" and
// gets squeezed into a break when it is at least GAP_MIN_YEARS long AND at least
// GAP_SPAN_FRAC of what is left of its segment's span (so a 6,700-year hole
// between an ancient beat and the present goes, a 14-month lull mid-campaign
// stays). Every break is BREAK_FRAC of the kept (non-break) span wide, floored at
// BREAK_MIN_YEARS so it stays visible on a short campaign.
export const GAP_MIN_YEARS = 10;
export const GAP_SPAN_FRAC = 0.5;
export const BREAK_FRAC = 0.06;
export const BREAK_MIN_YEARS = 1 / 12;
// Ruler decluttering (axis.ts). A row whose first tick in a stretch lands more
// than ANCHOR_GAP_PX past the stretch's start also gets a "Month Year" anchor at
// the start. Label widths are estimated at LABEL_CHAR_PX per character (11-12px
// system font); a label is dropped when it would sit closer than LABEL_GAP_PX to
// the one before it in its row, or under a break chip (its label plus
// BREAK_CHIP_PAD each side).
export const ANCHOR_GAP_PX = 120;
export const LABEL_CHAR_PX = 6.5;
export const LABEL_GAP_PX = 10;
export const BREAK_CHIP_PAD = 10;

// Viewpoint filter ("Known by"). Works like the track filter: no audience selected
// = no filter (every beat shows, secrets included). Selecting audiences narrows to
// the union of what they know. DM_AUDIENCE is the sentinel for "the DM", who knows
// everything (incl. secrets). Any other value is a character name: a character
// knows the public beats plus the non-secret beats that name `knownBy`, but never
// a secret beat. The sentinel is `\0`-prefixed so it can't collide with a name.
export const DM_AUDIENCE = "\0dm";
export const DM_LABEL = "DM";

// Axis ticks: minimum pixel spacing between two tick labels. Drives the
// responsive granularity — months when zoomed in, single years mid-zoom,
// multi-year steps (2/5/10/25…) when zoomed out and years would crowd below this.
export const MIN_TICK_PX = 60;
