// Timeline chart (the World view). Beats as markers on one time axis, labels
// stacked above and below in tiers, crowds rolled into density bars. Positions
// come from the pure layout (layout.ts) and label packer (labels.ts); this file
// renders them.
//
// The filter never moves the axis: a filter edit hides markers, recounts the bars
// and re-packs the labels over the survivors (so a lone hit regains its label).
// Zoom changes the layout, so it re-renders it.

import { useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import '../_common/common.css';
import './timeline.css';
import { EmptyState } from 'jeff-ui';
import { DEFAULT_CALENDAR } from '../_common/helpers/calendar.js';
import { computeLayoutFrom } from './helpers/layout.js';
import { layoutLabels } from './helpers/labels.js';
import { barHeightFor } from '../_common/helpers/cluster.js';
import { indexEvents, spanYearsOf } from '../_common/helpers/axis.js';
import { axisOptionsFor } from '../_common/helpers/segments.js';
import { makeMatcher } from '../_common/helpers/filters.js';
import { serializeState, DEFAULT_STATE } from '../_common/helpers/viewstate.js';
import { seedFilter, useFilterSections } from '../_common/FilterBar.js';
import { ChartSettings, type ChartProps } from '../_common/ChartSettings.js';
import { usePan } from '../_common/hooks/usePan.js';
import { useMarkerInteraction } from '../_common/hooks/useMarkerInteraction.js';
import { useViewportSize } from '../_common/hooks/useViewportSize.js';
import { useZoom } from '../_common/hooks/useZoom.js';
import { RULER_ROW_H, ZOOM_MAX, MARGIN, TARGET_PX_PER_BEAT, MONTH_VIEW_FRAC, DAY_VIEW_FRAC, ZOOM_UPSCALE_FROM, ITEM_SCALE_MAX, WORLD_RIGHT_PAD } from '../_common/constants.js';
import { AXIS_GAP, TIER_H, LABEL_BOX_PAD, LABEL_MIN_TIERS, LABEL_TIER_CEIL } from '../_common/constants.js';
import { LABEL_GAP, LABEL_MAX_SHIFT, LABEL_GAP_SPREAD, LABEL_SHIFT_SPREAD, LABEL_LIFT, BAND_MIN_PX } from '../_common/constants.js';
import type { BreakMark, DensityBar, Layout, LayoutItem, SessionBand, Side, Tick, TimelineEvent } from '../_common/types.js';

const openSource = (source: string): void => void window.open(source, '_blank');

const rootClass = (extra?: string): string => (extra ? `chart-root ${extra}` : 'chart-root');

export function Timeline(props: ChartProps) {
  const cal = props.data.calendar || DEFAULT_CALENDAR;
  // Sort + day-index every event exactly once; every zoom level reuses this. Dead
  // stretches (an ancient beat thousands of years before the present) squeeze into
  // a break, and every synced world gets a ruler row (the selected one nearest).
  const idx = useMemo(() => indexEvents(props.data.events, cal, axisOptionsFor(props.data)), [props.data, cal]);
  if (idx.events.length === 0) return <TimelineEmpty {...props} />;
  return <TimelineChart {...props} idx={idx} />;
}

function TimelineEmpty({ settingsSlot, className, ref }: ChartProps) {
  useImperativeHandle(ref, () => ({ getState: () => ({ ...DEFAULT_STATE }) }), []);
  return (
    <div className={rootClass(className)}>
      <EmptyState className="chart-empty">No events to show.</EmptyState>
      <ChartSettings slot={settingsSlot} sections={[]} />
    </div>
  );
}

type Index = ReturnType<typeof indexEvents>;

function TimelineChart({ data, initialState, settingsSlot, className, ref, idx }: ChartProps & { idx: Index }) {
  const cal = data.calendar || DEFAULT_CALENDAR;
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState(() => seedFilter(data.events, initialState));
  const size = useViewportSize(rootRef, viewportRef, () => zoomer.keepCenter());

  // The width-dependent scale: fit density (zoom level 1 = the whole padded span
  // fills the viewport), the max-zoom cap, the label tier budget and the locked
  // canvas height. Keyed on the size, so a resize refits.
  const scale = useMemo(() => {
    if (!size) return null;
    // Label lane budget from the actual vertical room: how many TIER_H tiers fit in
    // each half of the viewport (×2 for the above + below stacks), clamped so a short
    // panel keeps a usable minimum and a very tall one can't tile an absurd wall.
    const tiersPerSide = Math.max(1, Math.floor((size.height / 2 - AXIS_GAP - LABEL_BOX_PAD) / TIER_H));
    const maxTiers = Math.min(LABEL_TIER_CEIL, Math.max(LABEL_MIN_TIERS, tiersPerSide * 2));
    // Match the world layout's asymmetric domain (extra right headroom) so the
    // fit-zoom density sizes the whole padded axis, not just the symmetric span.
    const spanYears = spanYearsOf(idx, WORLD_RIGHT_PAD);
    // The -2 keeps contentWidth a hair under the viewport so both MARGIN gutters
    // stay visible (CSS min-width:100% backfills the tiny undershoot).
    const fitDensity = Math.max(1, (size.width - MARGIN * 2 - 2) / spanYears);
    // Deepest zoom adapts to beat density (spread beats to ~TARGET_PX_PER_BEAT
    // apart), and always reaches a month filling ~MONTH_VIEW_FRAC of the viewport
    // and, one tier finer, a day filling ~DAY_VIEW_FRAC. Sparse timelines keep the
    // ZOOM_MAX floor.
    const targetDensity = (idx.events.length / spanYears) * TARGET_PX_PER_BEAT;
    const monthDensity = MONTH_VIEW_FRAC * size.width * (cal.months.length || 12);
    const dayDensity = DAY_VIEW_FRAC * size.width * idx.daysPerYear;
    const maxZoom = Math.max(ZOOM_MAX, targetDensity / fitDensity, monthDensity / fitDensity, dayDensity / fitDensity);
    return { maxTiers, fitDensity, maxZoom, cache: new Map<number, Layout>() };
  }, [size, idx, cal]);

  // Memoized per density (and per scale, whose tier budget it bakes in). The
  // filter never changes the geometry, so a layout is computed at most once per
  // zoom level.
  const layoutAt = (pxPerYear: number): Layout => {
    const { cache, maxTiers } = scale!;
    let layout = cache.get(pxPerYear);
    if (!layout) {
      layout = computeLayoutFrom(idx, cal, pxPerYear, maxTiers);
      cache.set(pxPerYear, layout);
    }
    return layout;
  };

  const zoomer = useZoom(viewportRef, {
    maxZoom: scale?.maxZoom ?? 1,
    widthAt: (z) => (scale ? layoutAt(scale.fitDensity * z).contentWidth : 0),
    initialZoom: initialState?.zoomLevel,
    initialScroll: initialState?.scrollLeft,
  });
  const layout = scale ? layoutAt(scale.fitDensity * zoomer.zoom) : null;
  // Lock the canvas height to the fit-zoom layout. Lanes only ever decrease as we
  // zoom in, so fit is the tallest; pinning it keeps the page from reflowing on
  // zoom. Extra ruler rows stack above the bottom tick strip, so grow by them.
  const canvasHeight = scale ? layoutAt(scale.fitDensity).canvasHeight + Math.max(0, idx.rulers.length - 1) * RULER_ROW_H : 0;

  const dragged = usePan(viewportRef);
  const hideTip = useMarkerInteraction(viewportRef, dragged, openSource);
  // A new layout discards markers; drop any tip hovering one (mouseout never fires
  // for a removed node).
  useLayoutEffect(() => hideTip(), [layout, hideTip]);

  useImperativeHandle(
    ref,
    () => ({
      getState: () => serializeState(filter.query, filter.tracks, zoomer.zoom, viewportRef.current?.scrollLeft ?? 0, filter.audiences),
    }),
    [filter, zoomer.zoom],
  );

  // Click a density bar → zoom in, anchored on the cluster. Skipped after a pan-drag.
  const onClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (dragged.current) return;
    const bar = (e.target as Element).closest<HTMLElement>('.chart-bar');
    if (!bar) return;
    const viewport = e.currentTarget;
    const left = viewport.getBoundingClientRect().left;
    zoomer.zoomBy('in', left + (Number(bar.dataset.centerx) - viewport.scrollLeft));
  };

  const sections = useFilterSections(data.events, filter, setFilter);
  const match = useMemo(() => makeMatcher(filter), [filter]);

  // Zoom progress 0 (fit) → 1 (max). Drives label spreading and marker growth.
  const maxZoom = scale?.maxZoom ?? 1;
  const progress = maxZoom > 1 ? Math.min(1, (zoomer.zoom - 1) / (maxZoom - 1)) : 0;

  // Labels re-gate over only the matching beats, so narrowing the view frees label
  // budget for the survivors. Deeper zoom opens up empty axis, so the packer gets
  // a wider gap and a longer slide; the whole stack lifts off the axis so leaders
  // stay readable once the session bands appear behind the dots.
  const placed = useMemo(() => {
    if (!layout || !scale) return null;
    const visible = layout.items.map((it) => match(it));
    const labels = layoutLabels(
      layout.items.map((it) => ({ x: it.x, major: !!it.major })),
      visible,
      {
        maxTiers: scale.maxTiers,
        gap: LABEL_GAP + progress * LABEL_GAP_SPREAD,
        maxShift: LABEL_MAX_SHIFT * (1 + progress * LABEL_SHIFT_SPREAD),
      },
    );
    return { visible, labels };
  }, [layout, scale, match, progress]);

  // Grow markers as zoom approaches its maximum so they're easy to see and click:
  // 1× until the last stretch of the range, then ramping to ITEM_SCALE_MAX.
  const itemScale = progress <= ZOOM_UPSCALE_FROM ? 1 : 1 + ((progress - ZOOM_UPSCALE_FROM) / (1 - ZOOM_UPSCALE_FROM)) * (ITEM_SCALE_MAX - 1);
  const lift = progress * LABEL_LIFT;

  return (
    <div ref={rootRef} className={rootClass(className)}>
      <div
        ref={viewportRef}
        className="chart-viewport"
        style={{ '--chart-item-scale': itemScale.toFixed(3) } as CSSProperties}
        onClick={onClick}
      >
        {layout && placed && (
          <div className="chart-canvas" style={{ width: layout.contentWidth, height: canvasHeight }}>
            <div className="chart-axis" />
            {/* Session bands sit behind the beats. Any too narrow to read at this
                zoom is skipped; it reappears as you zoom in. */}
            {layout.sessionBands.map((band, i) => (band.x1 - band.x0 >= BAND_MIN_PX ? <Band key={i} band={band} /> : null))}
            {layout.ticks.map((tick, i) => (
              <TickMark key={i} tick={tick} />
            ))}
            {layout.breaks.map((mark, i) => (
              <Break key={i} mark={mark} />
            ))}
            {layout.bars.map((bar, i) => (
              <Bar key={i} bar={bar} events={idx.events} match={match} />
            ))}
            {layout.items.map((item, i) => {
              const { side, offset, shift, showLabel } = placed.labels;
              return (
                <Marker key={i} item={item} visible={placed.visible[i]} side={side[i]} offset={offset[i] + lift} shift={shift[i]} showLabel={showLabel[i]} />
              );
            })}
          </div>
        )}
      </div>
      {idx.rulers.length > 1 && <RulerLegend rulers={idx.rulers.map((r) => r.label)} />}
      <ChartSettings slot={settingsSlot} sections={sections} />
    </div>
  );
}

// A session band: a rounded range box straddling the axis behind the beats in its
// span. The name surfaces on hover via the shared tooltip, and a source-backed
// band opens its note on click.
function Band({ band }: { band: SessionBand }) {
  return (
    <div
      className={'chart-band' + (band.major ? ' is-major' : '') + (band.source ? ' has-source' : '')}
      style={{ left: band.x0, width: Math.max(1, band.x1 - band.x0) }}
      data-label={band.label}
      data-track="session"
      data-source={band.source}
    />
  );
}

// A ruler tick. Row 0 (the selected world) draws its grid line; the other worlds'
// rows stack upward above it as labels only, each in its row colour.
function TickMark({ tick }: { tick: Tick }) {
  const row = tick.row ?? 0;
  const label = (
    <div className={`chart-tick-label is-row-${row}`} style={{ left: tick.x, bottom: row ? 4 + row * RULER_ROW_H : undefined }}>
      {tick.label}
    </div>
  );
  if (row) return label;
  return (
    <>
      <div className="chart-tick" style={{ left: tick.x }} />
      {label}
    </>
  );
}

// An axis break: a squeezed dead stretch ("6,742 years"), drawn as a dashed column
// with its label on the ruler line.
function Break({ mark }: { mark: BreakMark }) {
  return (
    <div className="chart-break" style={{ left: mark.x }} title={`${mark.label} squeezed out`}>
      <div className="chart-break-label">{mark.label}</div>
    </div>
  );
}

// A density bar (LOD), centered on the axis, sized to its filter-matching members:
// height ∝ matched count, hidden when none match, badged when a matched member is
// major. Its geometry stays fixed (scale-stable).
function Bar({ bar, events, match }: { bar: DensityBar; events: readonly TimelineEvent[]; match(e: TimelineEvent): boolean }) {
  let count = 0;
  let hasMajor = false;
  for (const m of bar.members) {
    if (match(events[m])) {
      count++;
      if (events[m].major) hasMajor = true;
    }
  }
  if (count === 0) return <div className="chart-bar chart-hidden" style={{ left: bar.centerX }} data-centerx={bar.centerX} />;
  return (
    <div
      className={`chart-bar${hasMajor ? ' has-major' : ''}`}
      style={{ left: bar.centerX, height: barHeightFor(count) }}
      data-centerx={bar.centerX}
      data-count={count}
      title={`${count} beats${hasMajor ? ' (incl. a major)' : ''} · click to zoom in`}
    />
  );
}

interface MarkerProps {
  item: LayoutItem;
  visible: boolean;
  side: Side;
  offset: number;
  shift: number;
  showLabel: boolean;
}

// One beat. Placement (side, offset off the axis, sideways shift) comes from the
// label packer. The leader is a 1px line rotated from the dot to the label anchor
// (dx = shift, dy = ±offset), so it bridges both the gap and any slide.
function Marker({ item, visible, side, offset, shift, showLabel }: MarkerProps) {
  let cls = `chart-marker ${item.weight}`;
  if (item.source) cls += ' has-source';
  if (item.draft) cls += ' is-draft';
  if (!visible) cls += ' chart-hidden';
  if (!showLabel) cls += ' chart-bare';
  cls += side === 'above' ? ' above' : ' below';
  const dy = side === 'above' ? -offset : offset;
  const style = { left: item.x, '--chart-offset': `${offset}px`, '--chart-shift': `${shift}px` } as CSSProperties;
  return (
    <div className={cls} style={style} data-track={item.track} data-label={item.label} data-date={item.date} data-source={item.source}>
      <div className="chart-dot" />
      <div
        className="chart-leader"
        style={{ width: Math.hypot(shift, dy), transform: `rotate(${(Math.atan2(dy, shift) * 180) / Math.PI}deg)` }}
      />
      <div className="chart-label">{item.text}</div>
    </div>
  );
}

// Which ruler row is which world: a small key under the chart, one entry per row
// in its row colour (row 0 is the bottom row). Only drawn with two or more worlds.
function RulerLegend({ rulers }: { rulers: string[] }) {
  return (
    <div className="chart-ruler-legend">
      {rulers.map((name, row) => (
        <span key={row} className={`chart-ruler-key is-row-${row}`}>
          {row === 0 ? `${name} (bottom row)` : name}
        </span>
      ))}
    </div>
  );
}
