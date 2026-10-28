// View switcher: a World | Campaign toggle over the same data. World = the
// single-axis layout (render.ts); Campaign = the swimlane multi-track layout
// (swimlane-render.ts). Thin host — each view fully owns its own content node.
//
// The header bar carries the view tabs (left) and the action buttons (right);
// the settings gear lives there and hoists the active chart's controls (zoom,
// filter) into its overlay, so the chart canvas below takes the full height.
//
// The action cluster also carries a campaign selector. It scopes the World view to
// one campaign (plus campaign-agnostic beats); the Campaign view ignores it and
// always spans every campaign the party is in, so the selector is hidden there.

import './view.css';
import { renderTimeline } from '../../components/charts/timeline/timeline.js';
import { renderSwimlane } from '../../components/charts/swimlane/swimlane.js';
import { mountSettingsPanel } from '../../components/charts/_common/components/settingspanel.js';
import type { SettingsSection } from '../../components/charts/_common/components/settingspanel.js';
import { mountSavedViews } from '../../components/charts/_common/components/savedviews.js';
import { mountCampaignSelect } from './campaign-select.js';
import { syncOffsets } from '../../components/charts/_common/helpers/segments.js';
import { DEFAULT_CALENDAR } from '../../components/charts/_common/helpers/calendar.js';
import type { ChartState, TimelineData } from '../../components/charts/_common/types.js';

export type View = 'world' | 'tracks';

// The slice of each chart's api the host needs: its hoistable controls and a
// snapshot of its full restorable state (both charts implement both).
interface ChartApi {
  controls: SettingsSection[];
  getState(): ChartState;
}

// Shared empty state: shown when the data carries no dated beats the timeline can
// place. Used by pages/home against the live graph (a fresh template, not an
// error). The fixture/artifact entries always pass dated sample data, so they
// never hit this branch.
function renderEmpty(container: HTMLElement): void {
  container.innerHTML = `
    <div class="chart-empty">
      <h1>No timeline yet</h1>
      <p>This view plots your campaign's dated beats. Nothing carries a date
         the timeline can place yet.</p>
      <p>Add any of these, then this page reloads on its own:</p>
      <ul>
        <li><code>timeline_date</code> on a <code>type: event</code> in
            <code>data/events/</code> or <code>historian/events/</code></li>
        <li><code>in_world_end_date</code> on a <code>type: session</code> in
            <code>historian/sessions/</code> (written by <code>/recap</code>)</li>
        <li>a <code>chronicle:</code> beat on any historian/scheduler entity</li>
      </ul>
    </div>`;
}

export function renderTimelineView(container: HTMLElement, data: TimelineData | null, initial: View = 'world'): void {
  container.innerHTML = '';

  if (!data || !Array.isArray(data.events) || data.events.length === 0) {
    renderEmpty(container);
    return;
  }

  container.classList.add('chart-viewhost');

  // Header: tabs on the left, action buttons (settings + future) on the right.
  const header = document.createElement('div');
  header.className = 'chart-headerbar';
  const tabs = document.createElement('div');
  tabs.className = 'chart-viewtabs';
  const actions = document.createElement('div');
  actions.className = 'chart-actions';
  header.append(tabs, actions);

  // Leftmost action: the session runner (session.html), served by the same dev server.
  const sessionLink = document.createElement('a');
  sessionLink.href = '/session.html';
  sessionLink.className = 'chart-sessionlink';
  sessionLink.textContent = 'Run session';
  actions.append(sessionLink);

  const content = document.createElement('div');
  content.className = 'chart-viewcontent';

  // Campaign scope. Beats carry an optional `campaign` slug; agnostic beats (no
  // slug) belong to every campaign. The World view is scoped to exactly one
  // campaign (slug match OR agnostic) — it defaults to the active campaign, or the
  // first known one if none is marked active. A campaign with no dated beats yet
  // (e.g. a fresh homebrew world) scopes to an empty set — the chart then renders
  // its own "No events to show." in place. When the graph knows no campaigns at
  // all, currentCampaign is null and the full graph is shown unscoped.
  const known = data.campaigns ?? [];
  let currentCampaign: string | null = known.length ? (known.find((c) => c.active) ?? known[0]).slug : null;
  // The scoped view also takes that campaign's own calendar when it has one, so the
  // World view's main ruler speaks the selected world's months. It carries the
  // lived-time sync worked out from the FULL graph (the scoped set holds only one
  // world's sessions, so it can't find the crossings), so the other worlds' rulers
  // still line up under it.
  const calendars: Record<string, NonNullable<TimelineData['calendar']>> = {};
  for (const c of known) if (c.calendar) calendars[c.slug] = c.calendar;
  const sync = syncOffsets(data.events, data.calendar || DEFAULT_CALENDAR, calendars);
  const scopeData = (slug: string | null): TimelineData => {
    if (!slug) return data;
    const keep = (b: { campaign?: string }) => !b.campaign || b.campaign === slug;
    const calendar = known.find((c) => c.slug === slug)?.calendar ?? data.calendar;
    return { ...data, calendar, sync, primary: slug, events: data.events.filter(keep), spans: data.spans?.filter(keep) };
  };
  let activeData = scopeData(currentCampaign);

  // Live refs the saved-views widget reads: which tab is showing and the active
  // chart's api. Switching tabs rebuilds the chart from scratch (discarding its
  // state), so a loaded view must be applied as initial state at render time —
  // select() threads an optional ChartState into the renderer for exactly that.
  let currentView: View = initial;
  let activeApi: ChartApi | null = null;
  let campaignSelect: HTMLSelectElement | null = null;

  const tabBtns = new Map<View, HTMLButtonElement>();
  // The World view honors the campaign filter. The Campaign (tracks) view is the
  // party's cross-campaign chronicle — it spans every campaign the party is in, so
  // it always renders the full graph and the selector is hidden there.
  const select = (v: View, initialState?: ChartState) => {
    currentView = v;
    for (const [key, btn] of tabBtns) btn.classList.toggle('is-active', key === v);
    if (campaignSelect) campaignSelect.hidden = v !== 'world';
    const viewData = v === 'world' ? activeData : data;
    activeApi = v === 'world' ? renderTimeline(content, viewData, initialState) : renderSwimlane(content, viewData, initialState);
    settings.setSections(activeApi.controls);
  };

  // Campaign selector sits leftmost in the action cluster (before Save/Load/gear).
  // Only shown when the graph knows at least one campaign. Changing it re-scopes the
  // data and re-renders the current tab from scratch (chart state resets — campaign
  // is a separate axis from a saved view).
  if (known.length > 0) {
    campaignSelect = mountCampaignSelect(actions, {
      campaigns: known.map((c) => ({ slug: c.slug, label: c.label })),
      current: currentCampaign!, // non-null: known.length > 0 set it above
      onChange: (slug) => {
        currentCampaign = slug;
        activeData = scopeData(slug);
        select(currentView);
      },
    });
  }

  // Save · Load sit left of the gear. Save reads the current tab + chart state;
  // Load re-renders the target tab seeded with the saved state.
  mountSavedViews(actions, {
    getCurrent: () => ({ tab: currentView, state: activeApi!.getState() }),
    apply: (view) => select(view.tab, view.state),
  });

  // One persistent settings panel; the gear stays put across view switches and
  // its contents are swapped to the active chart's controls.
  const settings = mountSettingsPanel(actions);

  const mk = (v: View, label: string) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chart-viewtab';
    b.textContent = label;
    b.addEventListener('click', () => select(v));
    tabBtns.set(v, b);
    return b;
  };
  tabs.append(mk('world', 'World'), mk('tracks', 'Campaign'));
  container.append(header, content);
  select(initial);
}
