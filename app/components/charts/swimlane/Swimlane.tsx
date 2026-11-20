// Swimlane chart (the Campaign view). Track rows down the left gutter (an
// expand/collapse tree), beats as dots on their row across a shared time axis.
// Positions come from the pure layout (swimlane-layout.ts); this file renders
// them. Dots are `.chart-marker`s, so the shared hover and click-to-open work
// unchanged.
//
// The filter never moves anything: a filter edit only hides dots and recounts
// the density bars. Zoom and collapse change the layout, so they re-render it.

import { useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import type { SettingsSection } from 'jeff-ui';
import '../_common/common.css';
import './swimlane.css';
import { EmptyState } from 'jeff-ui';
import { DEFAULT_CALENDAR } from '../_common/helpers/calendar.js';
import { computeSwimlaneFrom } from './helpers/swimlane-layout.js';
import { indexEvents, spanYearsOf } from '../_common/helpers/axis.js';
import { axisOptionsFor } from '../_common/helpers/segments.js';
import { buildTrackTree, parseTrack, DEFAULT_CATEGORIES } from './helpers/tracks.js';
import { makeMatcher } from '../_common/helpers/filters.js';
import { barHeightFor } from '../_common/helpers/cluster.js';
import { serializeState, DEFAULT_STATE } from '../_common/helpers/viewstate.js';
import { seedFilter, useFilterSections } from '../_common/FilterBar.js';
import { ChartSettings, type ChartProps } from '../_common/ChartSettings.js';
import { usePan } from '../_common/hooks/usePan.js';
import { useMarkerInteraction } from '../_common/hooks/useMarkerInteraction.js';
import { useViewportSize } from '../_common/hooks/useViewportSize.js';
import { useZoom } from '../_common/hooks/useZoom.js';
import { ZOOM_MAX, MARGIN, GUTTER_W, SWIM_TOP_PAD, SWIM_RULER_ROW_H, MONTH_VIEW_FRAC, DAY_VIEW_FRAC, SWIM_BAR_MAX, SWIM_BAR_MIN, SWIM_BAR_FULL_COUNT, MAX_CONTENT_PX } from '../_common/constants.js';
import type { SwimBar, SwimItem, SwimLayout, Tick, TimelineEvent } from '../_common/types.js';

// Per-row bar height for a member count (swimlane sizing — fits inside a row).
const swimBarHeight = (count: number): number => barHeightFor(count, SWIM_BAR_MAX, SWIM_BAR_MIN, SWIM_BAR_FULL_COUNT);

const openSource = (source: string): void => void window.open(source, '_blank');

export function Swimlane(props: ChartProps) {
  const cal = props.data.calendar || DEFAULT_CALENDAR;
  // Sort + day-index the full set once. The Campaign view spans every campaign on
  // the party's lived time: each world's dates synced at the crossings, one ruler
  // row per world (segments.ts).
  const full = useMemo(() => indexEvents(props.data.events, cal, axisOptionsFor(props.data)), [props.data, cal]);
  if (full.events.length === 0) return <SwimlaneEmpty {...props} />;
  return <SwimlaneChart {...props} full={full} />;
}

function SwimlaneEmpty({ settingsSlot, className, ref }: ChartProps) {
  useImperativeHandle(ref, () => ({ getState: () => ({ ...DEFAULT_STATE }) }), []);
  return (
    <div className={rootClass(className)}>
      <EmptyState className="chart-empty">No events to show.</EmptyState>
      <ChartSettings slot={settingsSlot} sections={[]} />
    </div>
  );
}

const rootClass = (extra?: string): string => (extra ? `chart-root ${extra}` : 'chart-root');

type FullIndex = ReturnType<typeof indexEvents>;

function SwimlaneChart({ data, initialState, settingsSlot, className, ref, full }: ChartProps & { full: FullIndex }) {
  const cal = data.calendar || DEFAULT_CALENDAR;
  const rootRef = useRef<HTMLDivElement>(null);
  const swimRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState(() => seedFilter(data.events, initialState));
  // Initial collapse state from the configured defaults (only bites a category
  // that actually has children — see computeSwimlane).
  const [collapsed, setCollapsed] = useState(() => new Set(DEFAULT_CATEGORIES.filter((c) => c.collapsed).map((c) => c.key)));
  const [showDeepHistory, setShowDeepHistory] = useState(false);

  // The campaign floor: the earliest session (party) beat. The view locks its left
  // edge there so pre-campaign deep history (world events before session 1) is
  // hidden unless the DM opts in via the History toggle. The lock only bites when a
  // party beat exists AND something precedes it.
  const floor = useMemo(() => {
    const party = full.events.filter((e) => parseTrack(e.track).category === 'party').map((e) => e._idx);
    return party.length ? Math.min(...party) : null;
  }, [full]);
  const hasPreCampaign = floor !== null && full.events.some((e) => e._idx < floor);

  // The index and track tree for the current history setting. Sessions render as
  // full-height columns, not as a lane, so they're kept out of the tree; the Party
  // lane then vanishes on its own when sessions are its only members.
  const { idx, tree } = useMemo(() => {
    const events = showDeepHistory || floor === null ? data.events : full.events.filter((e) => e._idx >= floor);
    return {
      idx: events === data.events ? full : indexEvents(events, cal, axisOptionsFor(data)),
      tree: buildTrackTree(events.filter((e) => !e.session)),
    };
  }, [data, cal, full, floor, showDeepHistory]);

  const size = useViewportSize(rootRef, swimRef, () => zoomer.keepCenter());

  // The width-dependent scale: fit density (zoom level 1 = the whole span fills the
  // viewport) and the max-zoom cap.
  const scale = useMemo(() => {
    if (!size) return null;
    const spanYears = spanYearsOf(idx);
    const fitDensity = Math.max(1, (size.width - GUTTER_W - MARGIN * 2 - 2) / spanYears);
    const canvasWidth = Math.max(1, size.width - GUTTER_W);
    // Reach month ticks (a month fills ~MONTH_VIEW_FRAC of the canvas) and, one
    // tier finer, day ticks (a day fills ~DAY_VIEW_FRAC) — so a day-spaced campaign
    // can spread to per-day resolution, matching the world view.
    const monthDensity = MONTH_VIEW_FRAC * canvasWidth * (cal.months.length || 12);
    const dayDensity = DAY_VIEW_FRAC * canvasWidth * idx.daysPerYear;
    const maxZoom = Math.max(ZOOM_MAX, monthDensity / fitDensity, dayDensity / fitDensity);
    // Never zoom the canvas past what the browser can lay out (a long span at day
    // resolution would otherwise run to tens of millions of px).
    return { fitDensity, maxZoom: Math.max(1, Math.min(maxZoom, (MAX_CONTENT_PX - MARGIN * 2) / (fitDensity * spanYears))) };
  }, [size, idx, cal]);

  // Memoize per (density, collapse state); the filter never changes the layout.
  // A new index or tree starts a fresh cache.
  const cache = useMemo(() => new Map<string, SwimLayout>(), [idx, tree]);
  const layoutAt = (pxPerYear: number): SwimLayout => {
    const key = `${pxPerYear}|${[...collapsed].sort().join(',')}`;
    let layout = cache.get(key);
    if (!layout) {
      layout = computeSwimlaneFrom(idx, tree, collapsed, cal, pxPerYear);
      cache.set(key, layout);
    }
    return layout;
  };

  const zoomer = useZoom(swimRef, {
    maxZoom: scale?.maxZoom ?? 1,
    widthAt: (z) => (scale ? layoutAt(scale.fitDensity * z).contentWidth : 0),
    initialZoom: initialState?.zoomLevel,
    initialScroll: initialState?.scrollLeft,
  });
  const layout = scale ? layoutAt(scale.fitDensity * zoomer.zoom) : null;

  const dragged = usePan(swimRef);
  const hideTip = useMarkerInteraction(swimRef, dragged, openSource);

  useImperativeHandle(
    ref,
    () => ({
      getState: () => serializeState(filter.query, filter.tracks, zoomer.zoom, swimRef.current?.scrollLeft ?? 0, filter.audiences),
    }),
    [filter, zoomer.zoom],
  );

  // Ticks are drawn only for the visible slice plus a viewport-width buffer either
  // side (a deep zoom over a long span would otherwise mean one node per day).
  // A scroll that stays inside the window needs no tick work.
  const [tickWin, setTickWin] = useState({ lo: 0, hi: -1 });
  const refillTicks = (force: boolean): void => {
    const swim = swimRef.current;
    if (!swim || !size) return;
    const vw = swim.clientWidth || size.width;
    const lo = swim.scrollLeft;
    const hi = lo + vw;
    if (!force && lo >= tickWin.lo && hi <= tickWin.hi) return;
    setTickWin({ lo: lo - vw, hi: hi + vw });
  };
  // A new layout drops any tip hovering a dot it discarded (mouseout never fires
  // for a removed node) and redraws the ticks. Runs after useZoom has placed the
  // scroll for this layout.
  useLayoutEffect(() => {
    hideTip();
    refillTicks(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);
  const scrollRaf = useRef(0);
  const onScroll = (): void => {
    if (scrollRaf.current) return;
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0;
      refillTicks(false);
    });
  };
  useLayoutEffect(() => () => cancelAnimationFrame(scrollRaf.current), []);

  // Click a density bar → zoom in, anchored on the cluster. Skipped after a pan-drag.
  const onClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (dragged.current) return;
    const bar = (e.target as Element).closest<HTMLElement>('.chart-swim-bar');
    if (!bar) return;
    const swim = e.currentTarget;
    const left = swim.getBoundingClientRect().left;
    zoomer.zoomBy('in', left + (Number(bar.dataset.centerx) - swim.scrollLeft));
  };

  const toggle = (category: string): void =>
    setCollapsed((c) => {
      const next = new Set(c);
      if (!next.delete(category)) next.add(category);
      return next;
    });

  const sections: SettingsSection[] = useFilterSections(data.events, filter, setFilter);
  if (hasPreCampaign) {
    sections.push({
      label: 'History',
      content: (
        <label className="chart-swim-deephistory">
          <input type="checkbox" checked={showDeepHistory} onChange={(e) => setShowDeepHistory(e.target.checked)} />
          <span>Show pre-campaign history</span>
        </label>
      ),
    });
  }

  const match = useMemo(() => makeMatcher(filter), [filter]);
  const ticks = useMemo(() => layout?.ticksIn(tickWin.lo, tickWin.hi) ?? [], [layout, tickWin]);

  return (
    <div ref={rootRef} className={rootClass(className)}>
      <div ref={swimRef} className="chart-swim" onClick={onClick} onScroll={onScroll}>
        {layout && <Gutter layout={layout} onToggle={toggle} />}
        {layout && <Canvas layout={layout} events={idx.events} match={match} ticks={ticks} />}
      </div>
      <ChartSettings slot={settingsSlot} sections={sections} />
    </div>
  );
}

// The sticky track column. The head sits beside the tick strip; with two or more
// worlds it names each ruler row level with its labels (row colour), as a key.
function Gutter({ layout, onToggle }: { layout: SwimLayout; onToggle(category: string): void }) {
  const { rows, totalHeight, topPad, rulers } = layout;
  const multi = rulers.length > 1;
  return (
    <div className="chart-swim-gutter" style={{ height: totalHeight }}>
      <div className={`chart-swim-gutter-head${multi ? ' has-rulers' : ''}`} style={{ height: topPad }}>
        {multi
          ? rulers.map((name, row) => (
              <div key={row} className={`chart-swim-rulerkey is-row-${row}`} style={{ top: 6 + row * SWIM_RULER_ROW_H }}>
                {name}
              </div>
            ))
          : 'Tracks'}
      </div>
      {rows.map((row) => {
        // Name first (so every row's colour bar + text align at the same x), the
        // toggle arrow pushed to the right edge on toggleable rows.
        const name = (
          <span className="chart-swim-rowname" style={{ '--row-color': `var(${row.colorVar})` } as CSSProperties}>
            {row.label}
          </span>
        );
        const style = { top: row.y, height: row.height };
        // Toggleable rows are a full-width button so the whole label is the hit
        // area, not just the arrow. Leaf rows stay plain divs.
        return row.hasToggle ? (
          <button
            key={row.key}
            type="button"
            className={`chart-swim-rowlabel depth-${row.depth} is-toggle`}
            style={style}
            onClick={() => onToggle(row.category)}
          >
            {name}
            <span className="chart-swim-toggle" aria-hidden="true">
              {row.collapsed ? '▸' : '▾'}
            </span>
          </button>
        ) : (
          <div key={row.key} className={`chart-swim-rowlabel depth-${row.depth}`} style={style}>
            {name}
          </div>
        );
      })}
    </div>
  );
}

interface CanvasProps {
  layout: SwimLayout;
  events: readonly TimelineEvent[];
  match(e: TimelineEvent): boolean;
  ticks: Tick[];
}

function Canvas({ layout, events, match, ticks }: CanvasProps) {
  // Keep the session name below the tick strip when extra ruler rows deepen it.
  const sbandLabelTop = layout.topPad !== SWIM_TOP_PAD ? layout.topPad - 18 : undefined;
  return (
    <div className="chart-swim-canvas" style={{ width: layout.contentWidth, height: layout.totalHeight }}>
      {/* First child, so ticks paint beneath the session columns. */}
      <div className="chart-swim-ticks">
        {ticks.map((tick, i) => (
          <TickMark key={i} tick={tick} />
        ))}
      </div>
      {/* Session columns: full-height bands through every lane, behind the dots.
          Sessions aren't a lane here, so this is their only presence. They carry
          the same data-* as the world view's bands, so the shared tooltip and
          click-to-open work. (Not `chart-band`: all chart CSS is one bundle, so
          that class's axis-box geometry would bleed.) */}
      {layout.sessionBands.map((band, i) => (
        <div
          key={i}
          className={'chart-swim-sband' + (i % 2 ? ' is-alt' : '') + (band.major ? ' is-major' : '') + (band.source ? ' has-source' : '')}
          style={{ left: band.x0, width: Math.max(1, band.x1 - band.x0) }}
          data-label={band.label}
          data-track="session"
          data-source={band.source}
        >
          <div className="chart-swim-sband-label" style={{ top: sbandLabelTop }}>
            {band.major ? `★ ${band.label}` : band.label}
          </div>
        </div>
      ))}
      {/* Axis breaks (squeezed dead stretches) as dashed columns. */}
      {layout.breaks.map((mark, i) => (
        <div key={i} className="chart-swim-break" style={{ left: mark.x }} title={`${mark.label} squeezed out`}>
          <div className="chart-swim-break-label">{mark.label}</div>
        </div>
      ))}
      {/* Faint row bands so dots read as sitting on a lane. */}
      {layout.rows.map((row) => (
        <div key={row.key} className={`chart-swim-band${row.depth ? ' is-child' : ''}`} style={{ top: row.y, height: row.height }} />
      ))}
      {layout.bars.map((bar, i) => (
        <Bar key={i} bar={bar} events={events} match={match} />
      ))}
      {layout.items.map((item, i) => (
        <Dot key={i} item={item} visible={match(item)} />
      ))}
    </div>
  );
}

// A ruler tick. Row 0 (the active world) draws the full-height grid line; the
// other worlds' rows sit below it in the tick strip as labels only, each in its
// row colour, reading the same moment in that world's dates.
function TickMark({ tick }: { tick: Tick }) {
  const row = tick.row ?? 0;
  const label = (
    <div className={`chart-swim-ticklabel is-row-${row}`} style={{ left: tick.x, top: row ? 6 + row * SWIM_RULER_ROW_H : undefined }}>
      {tick.label}
    </div>
  );
  if (row) return label;
  return (
    <>
      <div className="chart-swim-grid" style={{ left: tick.x }} />
      {label}
    </>
  );
}

// A per-row density bar (LOD), sized to its filter-matching members: height ∝
// matched count, hidden when none match, badged when a matched member is major.
// Its geometry stays fixed (scale-stable).
function Bar({ bar, events, match }: { bar: SwimBar; events: readonly TimelineEvent[]; match(e: TimelineEvent): boolean }) {
  let count = 0;
  let hasMajor = false;
  for (const m of bar.members) {
    if (match(events[m])) {
      count++;
      if (events[m].major) hasMajor = true;
    }
  }
  const base = { left: bar.x, top: bar.y, background: `var(${bar.colorVar})` };
  if (count === 0) return <div className="chart-swim-bar chart-hidden" style={base} data-centerx={bar.x} />;
  return (
    <div
      className={`chart-swim-bar${hasMajor ? ' has-major' : ''}`}
      style={{ ...base, height: swimBarHeight(count) }}
      data-centerx={bar.x}
      data-count={count}
      title={`${count} beats${hasMajor ? ' (incl. a major)' : ''} · click to zoom in`}
    />
  );
}

// A beat dot on its row, with the density-gated inline label (max width runs to
// the next labelled dot in the row, so it truncates only when tight).
function Dot({ item, visible }: { item: SwimItem; visible: boolean }) {
  let cls = `chart-marker chart-swim-marker ${item.weight}`;
  if (item.source) cls += ' has-source';
  if (item.draft) cls += ' is-draft';
  if (!visible) cls += ' chart-hidden';
  return (
    <div className={cls} style={{ top: item.y, left: item.x }} data-label={item.label} data-date={item.date} data-track={item.track} data-source={item.source}>
      <div className="chart-dot" style={{ background: `var(${item.colorVar})` }} />
      {item.showLabel && (
        <div className="chart-swim-label" style={{ maxWidth: item.labelMaxWidth }}>
          {item.weight === 'is-major' ? `★ ${item.label}` : item.label}
        </div>
      )}
    </div>
  );
}
