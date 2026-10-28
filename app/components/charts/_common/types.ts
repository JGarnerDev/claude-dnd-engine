// Shared types for the timeline view. Pure type declarations — no runtime code,
// so importers use `import type`. The render JSON contract (TimelineData) is the
// shape scripts/timeline-data.py emits and build-entry consumes.

export interface Month {
  name: string;
  days: number;
}

export interface Calendar {
  epochLabel: string;
  months: Month[];
}

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

// One plotted beat. track/major/minor/source are optional in the raw data;
// computeLayout resolves track to a concrete string on its output items.
// keywords are extra search terms (related-entity names from the source's
// relates_to/participants) so a beat is findable by a name not in its label.
export interface TimelineEvent {
  date: string;
  daypart?: string; // sub-day tier (dawn|morning|midday|afternoon|evening|night|late). Spreads same-day beats within the day; absent = day start. See calendar.ts DAYPART_WINDOWS.
  order?: number; // intra-day sequence (1-based). Tiebreaks beats sharing a daypart so coincident-date beats never share an x. Recap-assigned.
  label: string;
  track?: string;
  major?: boolean;
  minor?: boolean;
  source?: string;
  keywords?: string[];
  secret?: boolean; // DM-only beat: only the DM viewpoint shows it; characters never do
  draft?: boolean; // canon-pending (exists:false): rendered distinct (dashed/translucent); -Full exports only
  knownBy?: string[]; // character names who know this beat (drives the per-character "Known by" viewpoint)
  session?: boolean; // a play session: the world view draws it as a time-range band (date = its end), not an on-axis dot. The swimlane ignores this and treats it as a normal beat.
  campaign?: string; // campaign slug (e.g. 'strahd'); absent = agnostic (shows under every campaign). Drives pages/home's campaign selector.
  sessionNumber?: number; // play order of a session beat; syncs the worlds' calendars at each campaign swap (segments.ts)
}

// Act/mission span bar. Extracted by the generator; render consumes it in M4.
export interface Span {
  start: string;
  end: string;
  label: string;
  track?: string;
  source?: string;
  campaign?: string; // campaign slug; absent = agnostic (see TimelineEvent.campaign)
}

// A known campaign (type:campaign entity), for pages/home's campaign selector.
// slug matches the per-beat `campaign` tag; label is the display name; active marks
// the campaign the page defaults to. Listed even when it has no dated beats yet.
export interface Campaign {
  slug: string;
  label: string;
  active: boolean;
  calendar?: Calendar | null; // this world's own calendar; absent = the shared TimelineData.calendar
}

export interface TimelineData {
  calendar?: Calendar | null;
  campaigns?: Campaign[];
  // Set by pages/home when it scopes the data to one campaign: the lived-time sync
  // offsets worked out from the FULL graph (a scoped set has only one world's
  // sessions, so it can't find the swaps itself), and the selected campaign, whose
  // ruler sits nearest the axis. Absent = derived from these events / the active campaign.
  sync?: Record<string, number>;
  primary?: string;
  events: TimelineEvent[];
  spans?: Span[];
}

// --- Lived-time axis -----------------------------------------------------------
// See helpers/segments.ts. The axis is the party's lived time: every campaign's
// dates are shifted by that campaign's sync offset onto one shared day index, and
// each world draws its own ruler row across the full width. Dead stretches are cut
// into pieces, shifted end to end, with a labelled break between them.
export interface AxisRuler {
  slug: string; // campaign slug ('' = the lone ruler of a campaign-less graph)
  label: string; // display name, for the row caption
  cal: Calendar;
  offset: number; // shared day index = this calendar's day index + offset
}

export interface AxisOptions {
  compressGaps?: boolean; // squeeze dead stretches (thousands of empty years) into a break
  calendars?: Record<string, Calendar>; // campaign slug -> its own calendar
  offsets?: Record<string, number>; // campaign slug -> lived-time sync offset (days)
  rulers?: AxisRuler[]; // ruler rows, row 0 nearest the axis; absent = one ruler on the shared calendar
}

export interface AxisPiece {
  rawMin: number; // extent on the shared day index, before this piece's shift
  rawMax: number;
  offset: number; // virtual index = shared index + offset
}

// A squeezed dead stretch between two pieces. idx is the virtual day index of its
// center; label says how much time was cut ("6,742 years").
export interface AxisBreak {
  idx: number;
  label: string;
}

// A break placed on the canvas.
export interface BreakMark {
  x: number;
  label: string;
}

export type Side = 'above' | 'below';
export type Weight = 'is-major' | 'is-minor' | 'is-normal';

export interface Placement {
  side: Side;
  tier: number;
  offset: number;
}

// A laid-out beat: the event plus its computed geometry.
export interface LayoutItem extends TimelineEvent {
  x: number;
  side: Side;
  offset: number;
  shift: number; // px the label box slides right off the dot (leader spans it); 0 = centered
  weight: Weight;
  track: string; // resolved (defaults to 'world')
  text: string;
  showLabel: boolean; // density-gated: false => bare on-axis dot (hover still shows text)
}

export interface Tick {
  label: string;
  x: number;
  row?: number; // ruler row (0 = nearest the axis, the selected world); absent = 0
}

// A below-axis density bar: one fixed-width pixel bucket aggregating the non-major
// beats that crowd into it (LOD). height ∝ √count; members index back to events.
export interface DensityBar {
  x0: number; // bucket left edge, px
  centerX: number; // bar center (mean member x)
  count: number;
  height: number; // scaled bar height, px
  hasMajor: boolean; // bucket contains >= 1 major beat — badge it
  members: number[]; // indices into the (sorted) event set, for tooltip
}

// A session band: the world view draws each play session as a horizontal range
// straddling the axis (beats fall inside it) rather than as a dot. Sessions store
// only an end date, so a band's left edge is the previous session's end (derived
// in bands.ts — no extra data). x0/x1 are canvas px.
export interface SessionBand {
  x0: number;
  x1: number;
  label: string;
  major: boolean;
  source?: string;
}

export interface Layout {
  isEmpty: boolean;
  contentWidth: number;
  canvasHeight: number;
  items: LayoutItem[]; // individual markers: majors + sparse beats (dense ones roll into bars)
  bars: DensityBar[]; // density histogram for crowded buckets
  sessionBands: SessionBand[]; // play sessions drawn as time-range bands behind the beats
  breaks: BreakMark[]; // squeezed dead stretches
  rulers: string[]; // ruler row captions, row 0 first
  ticks: Tick[];
  laneCount: number;
  spanYears: number;
}

export interface FilterState {
  query?: string;
  tracks?: Set<string> | null;
  // Viewpoint whitelist (see knownTo). Empty/absent (default) = no filter: every
  // beat shows, secrets included. Otherwise a beat passes if any selected audience
  // knows it — DM_AUDIENCE knows everything; a character knows public beats + the
  // non-secret beats it's in knownBy of, never a secret.
  audiences?: Set<string> | null;
}

export type ZoomKind = 'in' | 'out';

// --- Saved views (named UI snapshots) ---------------------------------------
// ChartState is the per-tab restorable bundle both charts emit (getState) and
// accept (initialState). tracks is the live filter Set serialized to an array;
// zoomLevel 1 = fit; scrollLeft is the viewport pan in px. SavedView wraps one
// under a user name + which tab it belongs to. Storage shape lives in
// viewstore.ts; the fail-soft apply rules live in viewstate.ts.
export interface ChartState {
  query: string;
  tracks: string[];
  zoomLevel: number;
  scrollLeft: number;
  audiences: string[]; // viewpoint whitelist (empty = no filter); DM_AUDIENCE or character names
}

export interface SavedView {
  name: string;
  tab: 'world' | 'tracks';
  state: ChartState;
}

// --- Track tree (M4) --------------------------------------------------------
// A beat's `track` string is "category" or "category:member". member empty =>
// the beat sits directly on the parent category lane.
export interface ParsedTrack {
  category: string;
  member: string | null;
}

// Config for one parent category (D5 — config-driven, defaults shipped).
export interface CategoryConfig {
  key: string;
  label: string;
  colorVar: string; // CSS custom property, e.g. '--track-world'
  collapsed: boolean; // initial expand/collapse state
}

export interface TrackChild {
  member: string;
  label: string;
}

// A present parent category + the child members present under it. Only emitted
// when it actually carries beats (auto-derived presence; D7 explicit membership).
export interface TrackCategory {
  key: string;
  label: string;
  colorVar: string;
  collapsed: boolean;
  members: TrackChild[];
  hasParentBeats: boolean; // a beat tagged to the category with no member
}

// --- Swimlane layout (M4) ---------------------------------------------------
// One rendered track row. key = category (parent / roll-up) or `category:member`
// (child) — the same key a beat resolves to, so beats map straight onto rows.
export interface SwimRow {
  key: string;
  category: string;
  member: string | null; // null = parent / roll-up row
  label: string;
  depth: number; // 0 parent header, 1 child
  colorVar: string;
  isRollup: boolean; // collapsed parent aggregating its children's beats
  collapsed: boolean;
  hasToggle: boolean; // parent with children -> shows an expand/collapse control
  y: number; // row top, px
  centerY: number; // dot baseline, px
  height: number;
}

// A beat placed in the swimlane grid: x from the time axis, y from its row.
export interface SwimItem extends TimelineEvent {
  x: number;
  y: number;
  rowKey: string;
  colorVar: string;
  weight: Weight;
  track: string; // resolved
  showLabel: boolean; // density-gated inline label (clears when its row crowds)
  labelMaxWidth: number; // px to the next labelled dot in the row (responsive truncation)
}

// A per-row density bar (LOD): one crowded pixel bucket within a track row,
// centered on the row. height ∝ count; members index into the sorted event set.
export interface SwimBar {
  x: number; // center x (mean member x)
  y: number; // row center y
  height: number; // scaled bar height, px
  count: number;
  hasMajor: boolean;
  colorVar: string; // the row's track color
  rowKey: string;
  members: number[]; // indices into the sorted event set, for filter recount
}

export interface SwimLayout {
  isEmpty: boolean;
  topPad: number; // px above the first row: the tick strip, one ruler row per world
  contentWidth: number;
  totalHeight: number;
  spanYears: number;
  ticksIn: (x0: number, x1: number) => Tick[]; // ticks within a canvas-x window (drawn per visible slice)
  rows: SwimRow[];
  items: SwimItem[]; // individual dots (sparse buckets); dense ones roll into bars
  bars: SwimBar[]; // per-row density histogram
  sessionBands: SessionBand[]; // play sessions as full-height columns behind the lanes
  breaks: BreakMark[]; // squeezed dead stretches
  rulers: string[]; // ruler row captions, row 0 first
}

// The viewport element carries a flag set by enablePan so the click handler can
// tell a pan-drag from a tap.
export type PanViewport = HTMLElement & { _tlDragged?: boolean; _tlHideTip?: () => void };
