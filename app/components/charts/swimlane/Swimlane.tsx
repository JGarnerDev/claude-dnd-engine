// Swimlane chart (the Campaign view). Track rows down the left gutter (an
// expand/collapse tree), beats as dots on their row across a shared time axis,
// drawn by jeff-ui's Swimlane. This file builds the lanes from the track tree
// (tracks.ts), the items and session columns from the events (items.ts) and the
// TimeScale from the calendars (axis.ts), and wires the filter, the collapse
// state and the pre-campaign history toggle around it.
//
// The filter never moves anything: a filter edit only hides dots and recounts
// the density bars. Collapse changes the lanes, so it re-lays the chart.

import { useImperativeHandle, useRef, useState } from "react";
import { Checkbox, EmptyState, type SettingsSection } from "jeff-ui";
import { Swimlane as SwimChart, type ChartItem, type TimeChartHandle } from "jeff-ui/charts";
import { DEFAULT_CALENDAR } from "../_common/helpers/calendar.js";
import { indexEvents, timeScaleFor } from "../_common/helpers/axis.js";
import { breaksOf, itemsOf, spansOf } from "../_common/helpers/items.js";
import { axisOptionsFor } from "../_common/helpers/segments.js";
import {
  buildTrackTree,
  laneFor,
  lanesFor,
  parseTrack,
  DEFAULT_CATEGORIES,
} from "../_common/helpers/tracks.js";
import { makeMatcher } from "../_common/helpers/filters.js";
import { serializeState, DEFAULT_STATE } from "../_common/helpers/viewstate.js";
import { seedFilter, useFilterSections } from "../_common/FilterBar.js";
import { ChartSettings, type ChartProps } from "../_common/ChartSettings.js";
import { EDGE_PAD } from "../_common/constants.js";

const PAD = [EDGE_PAD, EDGE_PAD] as const;

export function Swimlane(props: ChartProps) {
  const cal = props.data.calendar || DEFAULT_CALENDAR;
  // Sort + day-index the full set once. The Campaign view spans every campaign on
  // the party's lived time: each world's dates synced at the crossings, one ruler
  // row per world (segments.ts).
  const full = indexEvents(props.data.events, cal, axisOptionsFor(props.data));
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

const rootClass = (extra?: string): string => (extra ? `chart-root ${extra}` : "chart-root");

type FullIndex = ReturnType<typeof indexEvents>;

function SwimlaneChart({
  data,
  initialState,
  settingsSlot,
  className,
  ref,
  full,
}: ChartProps & { full: FullIndex }) {
  const cal = data.calendar || DEFAULT_CALENDAR;
  const chartRef = useRef<TimeChartHandle>(null);

  const [filter, setFilter] = useState(() => seedFilter(data.events, initialState));
  // Initial collapse state from the configured defaults (only bites a category
  // that actually has children — see lanesFor).
  const [collapsed, setCollapsed] = useState(
    () => new Set(DEFAULT_CATEGORIES.filter((c) => c.collapsed).map((c) => c.key)),
  );
  const [showDeepHistory, setShowDeepHistory] = useState(false);

  // The campaign floor: the earliest session (party) beat. The view locks its left
  // edge there so pre-campaign deep history (world events before session 1) is
  // hidden unless the DM opts in via the History toggle. The lock only bites when a
  // party beat exists AND something precedes it.
  const party = full.events
    .filter((e) => parseTrack(e.track).category === "party")
    .map((e) => e._idx);
  const floor = party.length ? Math.min(...party) : null;
  const hasPreCampaign = floor !== null && full.events.some((e) => e._idx < floor);

  // The index and track tree for the current history setting. Sessions render as
  // full-height columns, not as a lane, so they're kept out of the tree; the Party
  // lane then vanishes on its own when sessions are its only members.
  const events =
    showDeepHistory || floor === null ? data.events : full.events.filter((e) => e._idx >= floor);
  const idx = events === data.events ? full : indexEvents(events, cal, axisOptionsFor(data));
  const tree = buildTrackTree(events.filter((e) => !e.session));

  const lanes = lanesFor(tree, collapsed);
  const beats = idx.events.filter((e) => !e.session);
  const laneKeys = new Set(lanes.map((l) => l.key));
  const items = itemsOf(beats, (e) => laneFor(e.track, laneKeys));
  const spans = spansOf(idx);
  const breaks = breaksOf(idx);
  const scale = timeScaleFor(idx, cal);

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

  const toggle = (category: string): void =>
    setCollapsed((c) => {
      const next = new Set(c);
      if (!next.delete(category)) next.add(category);
      return next;
    });

  const sections: SettingsSection[] = useFilterSections(data.events, filter, setFilter);
  if (hasPreCampaign) {
    sections.push({
      label: "History",
      content: (
        <Checkbox
          className="chart-swim-deephistory"
          label="Show pre-campaign history"
          checked={showDeepHistory}
          onChange={setShowDeepHistory}
        />
      ),
    });
  }

  return (
    <SwimChart
      ref={chartRef}
      className={rootClass(className)}
      items={items}
      lanes={lanes}
      spans={spans}
      breaks={breaks}
      scale={scale}
      domain={[idx.minIdx, idx.maxIdx]}
      pad={PAD}
      visible={visible}
      onToggle={toggle}
      initialZoom={initialState?.zoomLevel}
      initialScroll={initialState?.scrollLeft}
    >
      <ChartSettings slot={settingsSlot} sections={sections} />
    </SwimChart>
  );
}
