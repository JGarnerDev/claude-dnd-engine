// Campaign scope for the timeline page. Beats carry an optional `campaign`
// slug; agnostic beats (no slug) belong to every campaign. The World view is
// scoped to exactly one campaign (slug match OR agnostic), defaulting to the
// active campaign, or the first known one if none is marked active. A campaign
// with no dated beats yet scopes to an empty set, and the chart shows its own
// "No events to show." When the graph knows no campaigns, the slug is null and
// the full graph shows unscoped.

import { syncOffsets } from '../../components/charts/_common/helpers/segments.js';
import { DEFAULT_CALENDAR } from '../../components/charts/_common/helpers/calendar.js';
import type { TimelineData } from '../../components/charts/_common/types.js';

export interface CampaignScope {
  campaigns: { slug: string; label: string }[];
  initial: string | null;
  scoped(slug: string | null): TimelineData;
}

export function campaignScope(data: TimelineData): CampaignScope {
  const known = data.campaigns ?? [];
  // The scoped view takes that campaign's own calendar when it has one, so the
  // World view's main ruler speaks the selected world's months. It carries the
  // lived-time sync worked out from the FULL graph (the scoped set holds only
  // one world's sessions, so it can't find the crossings), so the other worlds'
  // rulers still line up under it.
  const calendars: Record<string, NonNullable<TimelineData['calendar']>> = {};
  for (const c of known) if (c.calendar) calendars[c.slug] = c.calendar;
  const sync = syncOffsets(data.events, data.calendar || DEFAULT_CALENDAR, calendars);
  return {
    campaigns: known.map((c) => ({ slug: c.slug, label: c.label })),
    initial: known.length ? (known.find((c) => c.active) ?? known[0]).slug : null,
    scoped(slug) {
      if (!slug) return data;
      const keep = (b: { campaign?: string }) => !b.campaign || b.campaign === slug;
      const calendar = known.find((c) => c.slug === slug)?.calendar ?? data.calendar;
      return { ...data, calendar, sync, primary: slug, events: data.events.filter(keep), spans: data.spans?.filter(keep) };
    },
  };
}
