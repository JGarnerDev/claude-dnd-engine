// Timeline chart (the World view). Beats as points on one time axis, sessions
// as bands behind them, drawn by jeff-ui's Timeline. This file turns the engine's
// events into the chart's items (items.ts) and its calendars into a TimeScale
// (axis.ts), and wires the filter and saved-view state around it.
//
// The filter never moves the axis: a filter edit hides points in place (the
// chart recounts its bars and re-packs labels over the survivors).

import { useImperativeHandle, useRef, useState } from "react";
import { EmptyState } from "jeff-ui";
import { Timeline as TimeChart, type ChartItem, type TimeChartHandle } from "jeff-ui/charts";
import { DEFAULT_CALENDAR } from "../_common/helpers/calendar.js";
import { indexEvents, timeScaleFor } from "../_common/helpers/axis.js";
import { breaksOf, itemsOf, recentRange, spansOf } from "../_common/helpers/items.js";
import { axisOptionsFor } from "../_common/helpers/segments.js";
import { makeMatcher } from "../_common/helpers/filters.js";
import { serializeState, DEFAULT_STATE } from "../_common/helpers/viewstate.js";
import { seedFilter, useFilterSections } from "../_common/FilterBar.js";
import { ChartSettings, type ChartProps } from "../_common/ChartSettings.js";
import { EDGE_PAD, WORLD_RIGHT_PAD } from "../_common/constants.js";

// Extra room past the latest beat, for what comes next.
const PAD = [EDGE_PAD, WORLD_RIGHT_PAD] as const;

const rootClass = (extra?: string): string => (extra ? `chart-root ${extra}` : "chart-root");

export function Timeline(props: ChartProps) {
  const cal = props.data.calendar || DEFAULT_CALENDAR;
  // Sort + day-index every event exactly once; every zoom level reuses this. Dead
  // stretches (an ancient beat thousands of years before the present) squeeze into
  // a break, and every synced world gets a ruler row (the selected one nearest).
  const idx = indexEvents(props.data.events, cal, axisOptionsFor(props.data));
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

function TimelineChart({
  data,
  initialState,
  settingsSlot,
  className,
  ref,
  idx,
}: ChartProps & { idx: Index }) {
  const cal = data.calendar || DEFAULT_CALENDAR;
  const chartRef = useRef<TimeChartHandle>(null);
  const [filter, setFilter] = useState(() => seedFilter(data.events, initialState));

  const beats = idx.events.filter((e) => !e.session);
  const items = itemsOf(beats);
  const spans = spansOf(idx);
  const breaks = breaksOf(idx);
  const scale = timeScaleFor(idx, cal);

  const sections = useFilterSections(data.events, filter, setFilter);
  const match = makeMatcher(filter);
  const visible = (_: ChartItem, i: number) => match(beats[i]);

  useImperativeHandle(
    ref,
    () => ({
      getState: () => {
        const view = chartRef.current?.getView() ?? { zoom: 1, scrollLeft: 0 };
        return serializeState(
          filter.query,
          filter.tracks,
          view.zoom,
          view.scrollLeft,
          filter.audiences,
        );
      },
    }),
    [filter],
  );

  return (
    <TimeChart
      ref={chartRef}
      className={rootClass(className)}
      items={items}
      spans={spans}
      breaks={breaks}
      scale={scale}
      domain={[idx.minIdx, idx.maxIdx]}
      pad={PAD}
      visible={visible}
      initialZoom={initialState?.zoomLevel}
      initialScroll={initialState?.scrollLeft}
      focus={recentRange(beats, { breaks: idx.breaks.map((b) => b.idx) })}
    >
      <ChartSettings slot={settingsSlot} sections={sections} />
    </TimeChart>
  );
}
