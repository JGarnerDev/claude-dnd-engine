// View switcher: a World | Campaign toggle over the same data. World is the
// single-axis timeline; Campaign is the swimlane multi-track layout. The header
// carries the view tabs (left) and the actions (right): the session-runner link,
// the campaign selector, Save · Load, and the settings gear, which hosts the
// active chart's controls so the chart takes the full height below.
//
// The campaign selector scopes the World view to one campaign (plus agnostic
// beats). The Campaign view always spans every campaign the party is in, so the
// selector is hidden there.

import { useMemo, useRef, useState } from "react";
import { Tabs } from "jeff-ui";
import "./view.css";
import { Timeline } from "../../components/charts/timeline/Timeline.js";
import { Swimlane } from "../../components/charts/swimlane/Swimlane.js";
import type { ChartHandle } from "../../components/charts/_common/ChartSettings.js";
import { SavedViews } from "../../components/charts/_common/SavedViews.js";
import { CampaignSelect } from "./CampaignSelect.js";
import { TimelineEmpty } from "./TimelineEmpty.js";
import { campaignScope } from "./scope.js";
import type { ChartState, TimelineData } from "../../components/charts/_common/types.js";

export type View = "world" | "tracks";

// What the chart area shows. Every change bumps `key`, which rebuilds the chart
// from scratch, so a loaded view applies as initial state at render.
interface Shown {
  view: View;
  initialState?: ChartState;
  key: number;
}

const TABS = [
  { value: "world", label: "World" },
  { value: "tracks", label: "Campaign" },
] as const;

export interface TimelineViewProps {
  data: TimelineData | null;
  initial?: View;
}

export function TimelineView({ data, initial = "world" }: TimelineViewProps) {
  if (!data || !Array.isArray(data.events) || data.events.length === 0) return <TimelineEmpty />;
  return <ChartHost data={data} initial={initial} />;
}

function ChartHost({ data, initial }: { data: TimelineData; initial: View }) {
  const scope = useMemo(() => campaignScope(data), [data]);
  const [campaign, setCampaign] = useState(scope.initial);
  const [shown, setShown] = useState<Shown>({ view: initial, key: 0 });
  // Where the active chart portals its settings gear and panel.
  const [settingsSlot, setSettingsSlot] = useState<HTMLElement | null>(null);
  const api = useRef<ChartHandle>(null);

  const show = (view: View, initialState?: ChartState) =>
    setShown((s) => ({ view, initialState, key: s.key + 1 }));
  const viewData = useMemo(
    () => (shown.view === "world" ? scope.scoped(campaign) : data),
    [shown.view, scope, campaign, data],
  );
  const Chart = shown.view === "world" ? Timeline : Swimlane;

  return (
    <div className="chart-viewhost">
      <div className="chart-headerbar">
        <Tabs
          label="Views"
          items={TABS}
          selected={shown.view}
          onPick={(v) => v && show(v)}
          unstyled
          className="chart-viewtabs"
          classNames={{ tab: "chart-viewtab" }}
        />
        <div className="chart-actions">
          <a href="/session.html" className="chart-sessionlink">
            Run session
          </a>
          {campaign !== null && (
            <CampaignSelect
              campaigns={scope.campaigns}
              current={campaign}
              hidden={shown.view !== "world"}
              onChange={(slug) => {
                setCampaign(slug);
                show(shown.view); // campaign is a separate axis from a saved view: chart state resets
              }}
            />
          )}
          <SavedViews
            getCurrent={() => ({ tab: shown.view, state: api.current!.getState() })}
            apply={(view) => show(view.tab, view.state)}
          />
          <div ref={setSettingsSlot} className="chart-settings-slot" />
        </div>
      </div>
      <Chart
        key={shown.key}
        ref={api}
        data={viewData}
        initialState={shown.initialState}
        settingsSlot={settingsSlot}
        className="chart-viewcontent"
      />
    </div>
  );
}
