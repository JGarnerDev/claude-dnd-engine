// Swimlane renderer (DOM, M4). Track rows down the left gutter (expand/collapse
// tree), beats as dots on their row across a shared time axis. Reuses the pure
// swimlane layout (swimlane.ts) and the same interaction wiring as the world
// view (controls.ts) — dots are `.chart-marker`s so hover/click work unchanged.

import '../_common/common.css';
import './swimlane.css';
import { DEFAULT_CALENDAR } from '../_common/helpers/calendar.js';
import { computeSwimlaneFrom } from './helpers/swimlane-layout.js';
import { indexEvents, spanYearsOf } from '../_common/helpers/axis.js';
import { axisOptionsFor } from '../_common/helpers/segments.js';
import { buildTrackTree, parseTrack, DEFAULT_CATEGORIES } from './helpers/tracks.js';
import { makeMatcher, trackList, audienceList } from '../_common/helpers/filters.js';
import { buildFilterBar } from '../_common/components/filterbar.js';
import { DM_AUDIENCE } from '../_common/constants.js';
import { clampZoom, resolveTracks, serializeState, DEFAULT_STATE } from '../_common/helpers/viewstate.js';
import type { SettingsSection } from '../_common/components/settingspanel.js';
import { enablePan, enableWheelZoom, enableMarkerInteraction } from '../_common/components/controls.js';
import { barHeightFor } from '../_common/helpers/cluster.js';
import { ZOOM_FACTOR, ZOOM_MAX, MARGIN, GUTTER_W, SWIM_TOP_PAD, SWIM_RULER_ROW_H, MONTH_VIEW_FRAC, DAY_VIEW_FRAC, SWIM_BAR_MAX, SWIM_BAR_MIN, SWIM_BAR_FULL_COUNT, MAX_CONTENT_PX } from '../_common/constants.js';
import type { BreakMark, ChartState, PanViewport, SessionBand, SwimBar, SwimItem, SwimLayout, TimelineEvent, Tick, TimelineData, ZoomKind } from '../_common/types.js';

// Per-row bar height for a member count (swimlane sizing — fits inside a row).
const swimBarHeight = (count: number): number => barHeightFor(count, SWIM_BAR_MAX, SWIM_BAR_MIN, SWIM_BAR_FULL_COUNT);

interface SwimApi {
  eventCount: number;
  rowCount: number;
  contentWidth: number;
  // Chrome nodes (zoom toolbar, filter bar) for the host's settings panel.
  controls: SettingsSection[];
  // Snapshot the full restorable view (query/tracks/zoom/scroll) for saved views.
  getState(): ChartState;
}

// A dot's persistent structure + its zoom-invariant data (top/colour/weight,
// dataset, source). Only `y` (row), colour and weight live here — all fixed for
// a given collapse state — so a zoom reuses the node and just moves it. The
// inline label is owned by positionDot (it appears/disappears with the density
// gate).
function createDot(item: SwimItem): HTMLDivElement {
  const marker = document.createElement('div');
  marker.className = `chart-marker chart-swim-marker ${item.weight}`;
  marker.style.top = `${item.y}px`;
  marker.dataset.label = item.label;
  marker.dataset.date = item.date;
  marker.dataset.track = item.track;
  if (item.source) {
    marker.dataset.source = item.source;
    marker.classList.add('has-source');
  }
  if (item.draft) marker.classList.add('is-draft');
  const dot = document.createElement('div');
  dot.className = 'chart-dot';
  dot.style.background = `var(${item.colorVar})`;
  marker.appendChild(dot);
  return marker;
}

// Apply per-zoom state to an existing dot: x, visibility, and the density-gated
// inline label (created/removed as the gate flips, max-width retuned each zoom).
// labels[idx] caches the label node so we don't query for it. Label text is
// density-independent, so it's set once on creation.
function positionDot(
  marker: HTMLElement,
  item: SwimItem,
  labels: (HTMLElement | null)[],
  idx: number,
  visible: boolean,
): void {
  marker.style.left = `${item.x}px`;
  marker.classList.toggle('chart-hidden', !visible);
  let label = labels[idx];
  if (item.showLabel) {
    if (!label) {
      label = document.createElement('div');
      label.className = 'chart-swim-label';
      label.textContent = item.weight === 'is-major' ? `★ ${item.label}` : item.label;
      marker.appendChild(label);
      labels[idx] = label;
    }
    label.style.maxWidth = `${item.labelMaxWidth}px`; // responsive: full when there's room, ellipsis only when tight
  } else if (label) {
    label.remove();
    labels[idx] = null;
  }
}

// A session column: a full-height band passing through every lane, behind the
// dots (z 0). Sessions aren't a lane here — this is their only presence on the
// Campaign view. The name pins to the top of the column (truncated to its width).
// Carries the same data-* as the world view's bands and is matched by controls.ts'
// interaction selector, so the shared hover tooltip / click-to-open path works.
// (It deliberately does NOT reuse the world view's `chart-band` class — all chart
// CSS is bundled into one document, so that class's axis-box geometry would bleed.)
function buildSessionBand(band: SessionBand, i: number): HTMLDivElement {
  const el = document.createElement('div');
  // Zebra parity so adjacent columns read as distinct lanes-wide bands.
  el.className = 'chart-swim-sband' + (i % 2 ? ' is-alt' : '') + (band.major ? ' is-major' : '');
  el.style.left = `${band.x0}px`;
  el.style.width = `${Math.max(1, band.x1 - band.x0)}px`;
  el.dataset.label = band.label;
  el.dataset.track = 'session'; // tooltip meta label
  if (band.source) {
    el.dataset.source = band.source;
    el.classList.add('has-source');
  }
  const label = document.createElement('div');
  label.className = 'chart-swim-sband-label';
  label.textContent = band.major ? `★ ${band.label}` : band.label;
  el.appendChild(label);
  return el;
}

// An axis break (a squeezed dead stretch) as a full-height dashed column, label
// pinned in the tick strip. Mirrors the world view's buildBreak under swimlane
// class names (one CSS bundle).
function buildBreak(mark: BreakMark): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'chart-swim-break';
  el.style.left = `${mark.x}px`;
  el.title = `${mark.label} squeezed out`;
  const label = document.createElement('div');
  label.className = 'chart-swim-break-label';
  label.textContent = mark.label;
  el.appendChild(label);
  return el;
}

// A ruler tick. Row 0 (the active world) draws the full-height grid line; the
// other worlds' rows sit below it in the tick strip as labels only, each in its row
// colour, reading the same moment in that world's dates.
function tickNodesFor(tick: Tick): HTMLDivElement[] {
  const row = tick.row ?? 0;
  const label = document.createElement('div');
  label.className = `chart-swim-ticklabel is-row-${row}`;
  label.style.left = `${tick.x}px`;
  if (row) label.style.top = `${6 + row * SWIM_RULER_ROW_H}px`;
  label.textContent = tick.label;
  if (row) return [label];
  const line = document.createElement('div');
  line.className = 'chart-swim-grid';
  line.style.left = `${tick.x}px`;
  return [line, label];
}

// A per-row density bar (LOD), centered on its row at (x, y). Fixed geometry; the
// height/count are filter-dependent and set by styleSwimBar.
function buildSwimBar(bar: SwimBar): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'chart-swim-bar';
  el.style.left = `${bar.x}px`;
  el.style.top = `${bar.y}px`;
  el.style.background = `var(${bar.colorVar})`;
  el.dataset.centerx = String(bar.x);
  return el;
}

// Size a bar to its filter-matching members: height ∝ matched count, hidden when
// none match, badged when a matched member is major. Geometry stays fixed
// (scale-stable). Returns the matched count for the caller's total.
function styleSwimBar(el: HTMLElement, bar: SwimBar, events: readonly TimelineEvent[], match: (e: TimelineEvent) => boolean): number {
  let count = 0;
  let hasMajor = false;
  for (const m of bar.members) {
    const e = events[m];
    if (match(e)) {
      count++;
      if (e.major) hasMajor = true;
    }
  }
  if (count === 0) {
    el.classList.add('chart-hidden');
    return 0;
  }
  el.classList.remove('chart-hidden');
  el.classList.toggle('has-major', hasMajor);
  el.style.height = `${swimBarHeight(count)}px`;
  el.dataset.count = String(count);
  el.title = `${count} beats${hasMajor ? ' (incl. a major)' : ''} · click to zoom in`;
  return count;
}

// Builds the full canvas (tick layer, bands, per-row density bars, dots) and returns
// the dot nodes + bar nodes (layout order) and the visible count. The individual/bar
// split changes with zoom (buckets dissolve), so the canvas is rebuilt each draw.
// The tick layer starts empty: ticks are drawn per visible slice (renderTicks), since
// a deep zoom over a long span would otherwise mean one tick node per day.
interface BuiltSwimCanvas {
  canvas: HTMLDivElement;
  tickLayer: HTMLDivElement;
  markers: HTMLElement[];
  bars: HTMLElement[];
  visibleCount: number;
}
function buildCanvas(layout: SwimLayout, events: readonly TimelineEvent[], match: (e: TimelineEvent) => boolean): BuiltSwimCanvas {
  const canvas = document.createElement('div');
  canvas.className = 'chart-swim-canvas';
  canvas.style.width = `${layout.contentWidth}px`;
  canvas.style.height = `${layout.totalHeight}px`;

  // First child, so ticks paint beneath the session columns as before.
  const tickLayer = document.createElement('div');
  tickLayer.className = 'chart-swim-ticks';
  canvas.appendChild(tickLayer);
  // Session columns sit behind the lanes (z 0) — append before the row bands and
  // dots so those paint over them.
  layout.sessionBands.forEach((band, i) => {
    const el = buildSessionBand(band, i);
    // Keep the session name below the tick strip when extra ruler rows deepen it.
    if (layout.topPad !== SWIM_TOP_PAD) (el.firstChild as HTMLElement).style.top = `${layout.topPad - 18}px`;
    canvas.appendChild(el);
  });
  for (const mark of layout.breaks) canvas.appendChild(buildBreak(mark));
  // Faint row bands so dots read as sitting on a lane.
  for (const row of layout.rows) {
    const band = document.createElement('div');
    band.className = `chart-swim-band${row.depth ? ' is-child' : ''}`;
    band.style.top = `${row.y}px`;
    band.style.height = `${row.height}px`;
    canvas.appendChild(band);
  }

  let visibleCount = 0;
  const bars: HTMLElement[] = [];
  for (const bar of layout.bars) {
    const el = buildSwimBar(bar);
    bars.push(el);
    canvas.appendChild(el);
    visibleCount += styleSwimBar(el, bar, events, match);
  }

  const markers: HTMLElement[] = [];
  const labels: (HTMLElement | null)[] = [];
  layout.items.forEach((item, i) => {
    const marker = createDot(item);
    markers.push(marker);
    labels.push(null);
    canvas.appendChild(marker);
    const vis = match(item);
    positionDot(marker, item, labels, i, vis);
    if (vis) visibleCount++;
  });
  return { canvas, tickLayer, markers, bars, visibleCount };
}

function buildGutter(layout: SwimLayout, onToggle: (category: string) => void): HTMLDivElement {
  const { rows, totalHeight: height, topPad, rulers } = layout;
  const gutter = document.createElement('div');
  gutter.className = 'chart-swim-gutter';
  gutter.style.height = `${height}px`;

  // The head sits beside the tick strip. With two or more worlds it names each
  // ruler row level with its labels (row colour), so the strip reads as a key.
  const head = document.createElement('div');
  head.className = 'chart-swim-gutter-head';
  head.style.height = `${topPad}px`;
  if (rulers.length > 1) {
    head.classList.add('has-rulers');
    rulers.forEach((name, row) => {
      const key = document.createElement('div');
      key.className = `chart-swim-rulerkey is-row-${row}`;
      key.style.top = `${6 + row * SWIM_RULER_ROW_H}px`;
      key.textContent = name;
      head.appendChild(key);
    });
  } else {
    head.textContent = 'Tracks';
  }
  gutter.appendChild(head);

  for (const row of rows) {
    // Toggleable rows are a full-width button so the whole label is the hit area,
    // not just the arrow. Leaf rows stay plain divs.
    const label = document.createElement(row.hasToggle ? 'button' : 'div');
    label.className = `chart-swim-rowlabel depth-${row.depth}${row.hasToggle ? ' is-toggle' : ''}`;
    label.style.top = `${row.y}px`;
    label.style.height = `${row.height}px`;

    // Name first (so every row's colour bar + text align at the same x),
    // toggle arrow pushed to the right edge on toggleable rows.
    const text = document.createElement('span');
    text.className = 'chart-swim-rowname';
    text.textContent = row.label;
    text.style.setProperty('--row-color', `var(${row.colorVar})`);
    label.appendChild(text);

    if (row.hasToggle) {
      (label as HTMLButtonElement).type = 'button';
      label.addEventListener('click', () => onToggle(row.category));
      const tw = document.createElement('span');
      tw.className = 'chart-swim-toggle';
      tw.setAttribute('aria-hidden', 'true');
      tw.textContent = row.collapsed ? '▸' : '▾';
      label.appendChild(tw);
    }
    gutter.appendChild(label);
  }
  return gutter;
}

// The container carries the live ResizeObserver between renders so a re-render
// (tab switch back to Campaign) can disconnect the prior one instead of stacking.
type ResizeHost = HTMLElement & { _swimResizeObs?: ResizeObserver };

export function renderSwimlane(container: HTMLElement, data: TimelineData, initialState?: ChartState): SwimApi {
  const cal = data.calendar || DEFAULT_CALENDAR;
  let viewportWidth = container.clientWidth || 800;
  (container as ResizeHost)._swimResizeObs?.disconnect();
  container.innerHTML = '';
  container.classList.add('chart-root');

  // Initial collapse state from the configured defaults (only bites a category
  // that actually has children — see computeSwimlane).
  const collapsed = new Set(DEFAULT_CATEGORIES.filter((c) => c.collapsed).map((c) => c.key));

  // Sort + day-index the full set once to find the campaign floor: the earliest
  // session (party) beat. The Campaign view locks its left edge there so
  // pre-campaign deep history (world events before session 1) is hidden unless the
  // DM opts in via the History toggle. The lock only bites when a party beat exists
  // AND something precedes it — otherwise the full set is shown unchanged.
  // The Campaign view spans every campaign on the party's lived time: each world's
  // dates synced at the crossings, one ruler row per world (segments.ts).
  const axisOpts = axisOptionsFor(data);
  const fullIdx = indexEvents(data.events, cal, axisOpts);
  if (fullIdx.events.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'chart-empty';
    empty.textContent = 'No events to show.';
    container.appendChild(empty);
    return { eventCount: 0, rowCount: 0, contentWidth: 0, controls: [], getState: () => ({ ...DEFAULT_STATE }) };
  }
  const partyIdxs = fullIdx.events.filter((e) => parseTrack(e.track).category === 'party').map((e) => e._idx);
  const campaignFloor = partyIdxs.length ? Math.min(...partyIdxs) : null;
  const hasPreCampaign = campaignFloor !== null && fullIdx.events.some((e) => e._idx < campaignFloor);
  let showDeepHistory = false;
  const visibleEvents = (): TimelineEvent[] =>
    showDeepHistory || campaignFloor === null
      ? data.events
      : fullIdx.events.filter((e) => e._idx >= campaignFloor);

  const monthsPerYear = cal.months.length || 12;
  // Event subset, index, tree, fit density and max zoom all depend on the
  // deep-history toggle, so rebuildForEvents() (re)derives them — once at mount and
  // again whenever the toggle flips. zoomLevel survives a toggle (re-clamped). The
  // filter bar / controls are built once over the full set so they stay stable.
  let idx = fullIdx;
  // Sessions render as full-height columns, not as a lane — so they're kept out of
  // the track tree. The Party lane then vanishes on its own (presence-derived) when
  // sessions are its only members. rebuildForEvents() rebuilds the tree the same way.
  let tree = buildTrackTree(data.events.filter((e) => !e.session));
  let fitDensity = 1;
  let maxZoom = ZOOM_MAX;
  let zoomLevel = 1;
  let firstBuild = true;
  const api: SwimApi = {
    eventCount: 0,
    rowCount: 0,
    contentWidth: 0,
    controls: [],
    // filterState/swim are declared below but only read when getState runs
    // (post-render), so the closure is safe.
    getState: () => serializeState(filterState.query, filterState.tracks, zoomLevel, swim.scrollLeft, filterState.audiences),
  };

  const swim = document.createElement('div') as PanViewport;
  swim.className = 'chart-swim';

  // Memoize per (density, collapse state). The layout depends on zoom and which
  // categories are collapsed, but never on the filter — so filtering reuses the
  // current layout and only retoggles visibility.
  const layoutCache = new Map<string, SwimLayout>();
  const layoutAt = (pxPerYear: number): SwimLayout => {
    const key = `${pxPerYear}|${[...collapsed].sort().join(',')}`;
    let layout = layoutCache.get(key);
    if (!layout) {
      layout = computeSwimlaneFrom(idx, tree, collapsed, cal, pxPerYear);
      layoutCache.set(key, layout);
    }
    return layout;
  };

  let currentLayout: SwimLayout | null = null;
  // Nodes from the last draw, in layout order. A filter edit reuses them to retoggle
  // dot visibility / rescale bars without a relayout; a zoom rebuilds them (the
  // individual/bar split changes as buckets dissolve).
  let markerNodes: HTMLElement[] = [];
  let barNodes: HTMLElement[] = [];
  let tickLayer: HTMLDivElement | null = null;
  // Canvas-x window the tick layer currently covers; a scroll that stays inside it
  // needs no tick work.
  let tickLo = 0;
  let tickHi = -1;

  // Filtering keeps the layout fixed. Dots toggle .chart-hidden in place; per-row
  // density bars re-count their matching members and rescale (height/badge/hide) so
  // the histogram reflects the filtered set. eventCount = matching dots + matching
  // bar members.
  function applyVisibility() {
    if (!currentLayout) return;
    const match = makeMatcher(filterState);
    let count = 0;
    currentLayout.items.forEach((item, i) => {
      const vis = match(item);
      markerNodes[i]?.classList.toggle('chart-hidden', !vis);
      if (vis) count++;
    });
    currentLayout.bars.forEach((bar, i) => {
      if (barNodes[i]) count += styleSwimBar(barNodes[i], bar, idx.events, match);
    });
    api.eventCount = count;
  }

  // A loaded view seeds query + still-present tracks (decision H intersection).
  // Available viewpoint audiences for fail-soft seeding (see timeline.ts): the
  // characters from any beat's knownBy + the DM sentinel when secrets exist.
  const characters = audienceList(data.events);
  const available = data.events.some((e) => e.secret) ? [DM_AUDIENCE, ...characters] : characters;
  const seed = initialState
    ? {
        query: initialState.query,
        tracks: resolveTracks(initialState.tracks, trackList(data.events)),
        audiences: resolveTracks(initialState.audiences, available),
      }
    : undefined;
  const { bar: filterBar, search, chips, audience, state: filterState } = buildFilterBar(data.events, applyVisibility, seed);

  // Draw the ticks for the visible slice plus a viewport-width buffer either side,
  // so a pan has room before the next refill. force = the layout changed (new draw).
  function renderTicks(force = false) {
    if (!currentLayout || !tickLayer) return;
    const vw = swim.clientWidth || viewportWidth;
    const lo = swim.scrollLeft;
    const hi = lo + vw;
    if (!force && lo >= tickLo && hi <= tickHi) return;
    tickLo = lo - vw;
    tickHi = hi + vw;
    const nodes: HTMLDivElement[] = [];
    for (const tick of currentLayout.ticksIn(tickLo, tickHi)) nodes.push(...tickNodesFor(tick));
    tickLayer.replaceChildren(...nodes);
  }

  // Rebuild the gutter + canvas for the current density/collapse state. Both zoom
  // and collapse change the layout (the individual/bar split shifts with zoom, rows
  // shift with collapse), so the canvas is rebuilt each draw — cheap, since the
  // crowd rolls into a bounded number of bars. Listeners live on `swim`, so swapping
  // its children leaves pan/zoom/hover intact.
  function draw(anchor?: { frac: number; x: number }) {
    const layout = layoutAt(fitDensity * zoomLevel);
    currentLayout = layout;
    const match = makeMatcher(filterState);

    const built = buildCanvas(layout, idx.events, match);
    markerNodes = built.markers;
    barNodes = built.bars;
    tickLayer = built.tickLayer;
    // Drop any tip hovering a marker we're about to discard (mouseout never
    // fires for a removed node, so the tip would otherwise go stale).
    swim._tlHideTip?.();
    swim.replaceChildren(buildGutter(layout, toggle), built.canvas);

    api.eventCount = built.visibleCount;
    api.rowCount = layout.rows.length;
    api.contentWidth = layout.contentWidth;
    if (anchor) swim.scrollLeft = anchor.frac * layout.contentWidth - anchor.x;
    renderTicks(true);
  }

  function toggle(category: string) {
    if (collapsed.has(category)) collapsed.delete(category);
    else collapsed.add(category);
    draw();
  }

  // Derive the width-dependent scale: fit density (zoom level 1 = the whole span
  // fills the viewport) and the max-zoom cap. Both depend on viewportWidth, so this
  // re-runs whenever the width changes (mount, history toggle, resize). The live
  // zoom is re-clamped to the new cap; the first mount seeds it from a loaded view.
  function recomputeScale() {
    const spanYears = spanYearsOf(idx);
    fitDensity = Math.max(1, (viewportWidth - GUTTER_W - MARGIN * 2 - 2) / spanYears);
    const canvasWidth = Math.max(1, viewportWidth - GUTTER_W);
    // Reach month ticks (a month fills ~MONTH_VIEW_FRAC of the canvas) and, one
    // tier finer, day ticks (a day fills ~DAY_VIEW_FRAC) — so a day-spaced campaign
    // can spread to per-day resolution, matching the world view.
    const monthDensity = MONTH_VIEW_FRAC * canvasWidth * monthsPerYear;
    const dayDensity = DAY_VIEW_FRAC * canvasWidth * idx.daysPerYear;
    maxZoom = Math.max(ZOOM_MAX, monthDensity / fitDensity, dayDensity / fitDensity);
    // Never zoom the canvas past what the browser can lay out (a long span at day
    // resolution would otherwise run to tens of millions of px).
    maxZoom = Math.max(1, Math.min(maxZoom, (MAX_CONTENT_PX - MARGIN * 2) / (fitDensity * spanYears)));
    zoomLevel = firstBuild && initialState ? clampZoom(initialState.zoomLevel, maxZoom) : Math.min(zoomLevel, maxZoom);
  }

  // (Re)derive the event-dependent state for the current deep-history setting, then
  // redraw. Runs at mount and whenever the History toggle flips. Resets the layout
  // cache (the index/tree changed) and re-clamps zoom to the new span's max.
  function rebuildForEvents() {
    const events = visibleEvents();
    idx = indexEvents(events, cal, axisOpts);
    tree = buildTrackTree(events.filter((e) => !e.session));
    recomputeScale();
    firstBuild = false;
    layoutCache.clear();
    draw();
  }

  // Refit the canvas to the live viewport width. The fit density (zoom level 1 =
  // whole span fills the viewport) is derived from a width measurement, and that
  // measurement goes stale two ways: the initial container.clientWidth is read
  // before swim (and its scrollbar) exist, so it can be off; and a later
  // window/container resize changes it outright. Either way the canvas keeps the
  // old width — overflow + clipped edges when it shrank, dead space to the right
  // (canvas narrower than swim) when it grew. Measure swim.clientWidth (the true
  // scroll viewport, gutter included), recompute the scale, and redraw. keepAnchor
  // holds the on-screen center fixed (a live resize); without it the scroll is
  // left as-is (initial refit / saved-view restore). Returns whether a refit ran.
  // No-op when unchanged or detached (a stale observer after a tab switch away).
  function refit(keepAnchor: boolean): boolean {
    const w = swim.clientWidth || container.clientWidth;
    if (!w || w === viewportWidth || !swim.isConnected) return false;
    const anchor = keepAnchor ? anchorAt() : undefined;
    viewportWidth = w;
    recomputeScale();
    layoutCache.clear();
    draw(anchor);
    return true;
  }

  // The History toggle (only shown when there's pre-campaign history to reveal):
  // checked = include deep history before session 1; default off (locked).
  function buildDeepHistoryToggle(): HTMLElement {
    const wrap = document.createElement('label');
    wrap.className = 'chart-swim-deephistory';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = showDeepHistory;
    cb.addEventListener('change', () => {
      showDeepHistory = cb.checked;
      rebuildForEvents();
    });
    const text = document.createElement('span');
    text.textContent = 'Show pre-campaign history';
    wrap.append(cb, text);
    return wrap;
  }

  function anchorAt(clientX?: number) {
    const vw = swim.clientWidth || viewportWidth;
    const left = swim.getBoundingClientRect?.().left || 0;
    const x = clientX != null ? clientX - left : vw / 2;
    const frac = api.contentWidth ? (swim.scrollLeft + x) / api.contentWidth : 0.5;
    return { frac, x };
  }

  // Returns whether the level moved — false when already pinned at a bound, so the
  // caller can skip a redraw that would change nothing.
  function applyZoom(kind: ZoomKind): boolean {
    const before = zoomLevel;
    if (kind === 'in') zoomLevel = Math.min(maxZoom, zoomLevel * ZOOM_FACTOR);
    else zoomLevel = Math.max(1, zoomLevel / ZOOM_FACTOR);
    return zoomLevel !== before;
  }

  // Density-bar click: discrete zoom-in, draw immediately.
  function zoom(kind: ZoomKind, clientX?: number) {
    const anchor = anchorAt(clientX);
    if (applyZoom(kind)) draw(anchor);
  }

  // Wheel: coalesce a fling's many events into one draw per frame; anchor is
  // captured from the pre-batch layout, steps accumulate into zoomLevel.
  let zoomRaf = 0;
  let wheelAnchor: { frac: number; x: number } | undefined;
  function zoomWheel(kind: ZoomKind, clientX?: number) {
    const anchor = zoomRaf ? wheelAnchor : anchorAt(clientX);
    if (!applyZoom(kind)) return; // pinned at min/max zoom: nothing to redraw
    wheelAnchor = anchor;
    if (!zoomRaf) {
      zoomRaf = requestAnimationFrame(() => {
        zoomRaf = 0;
        draw(wheelAnchor);
        wheelAnchor = undefined;
      });
    }
  }

  // Click a density bar → zoom in, anchored on the cluster. Skipped after a pan-drag.
  swim.addEventListener('click', (e) => {
    if (swim._tlDragged) return;
    const bar = (e.target as Element | null)?.closest<HTMLElement>('.chart-swim-bar');
    if (!bar) return;
    const cx = Number(bar.dataset.centerx);
    const left = swim.getBoundingClientRect?.().left || 0;
    zoom('in', left + (cx - swim.scrollLeft));
  });

  // The filter controls are wired to this chart's state but handed to the host
  // via api.controls, which hoists them into the header settings panel under
  // their own labels — leaving the canvas to fill the full height. Zoom is
  // wheel-only (+ density-bar click).
  api.controls = [
    { label: 'Search', node: search },
    { label: 'Filter', node: chips },
    ...(audience ? [{ label: 'Known by', node: audience }] : []),
    ...(hasPreCampaign ? [{ label: 'History', node: buildDeepHistoryToggle() }] : []),
  ];
  container.append(filterBar, swim);
  rebuildForEvents();
  // The width read at the top (container.clientWidth, before swim was in the DOM)
  // can be stale; now that swim is mounted, refit to its true viewport width so
  // zoom-level-1 fills the canvas instead of leaving dead space to the right.
  refit(false);
  // Restore a loaded view's pan after the seeded draw (browser clamps over-range).
  if (initialState) swim.scrollLeft = initialState.scrollLeft;
  enablePan(swim);
  enableWheelZoom(swim, zoomWheel);
  // Pans (drag, wheel-scroll, scrollbar) refill the tick layer when they reach the
  // edge of its buffered window; coalesced to one check per frame.
  let scrollRaf = 0;
  swim.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      renderTicks();
    });
  });
  enableMarkerInteraction(swim, (source) => window.open(source, '_blank'));

  // One more refit after the browser settles layout, in case the synchronous read
  // above still ran pre-layout. draw() leaves scroll untouched when not anchored,
  // but replaceChildren can reset it, so reapply the current scroll across it.
  requestAnimationFrame(() => {
    const keepScroll = swim.scrollLeft;
    if (refit(false)) swim.scrollLeft = keepScroll;
  });

  // Track the live viewport width so zoom-level-1 always fits after a resize.
  // Coalesce a resize drag's many callbacks into one redraw per frame. The
  // observer is stashed on the container so the next render disconnects it.
  if (typeof ResizeObserver !== 'undefined') {
    let resizeRaf = 0;
    const obs = new ResizeObserver(() => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        refit(true); // keep the on-screen center fixed across a live resize
      });
    });
    obs.observe(container);
    (container as ResizeHost)._swimResizeObs = obs;
  }
  return api;
}

// Re-exported so a host can seed/inspect the tree without importing tracks.js.
export { buildTrackTree };
