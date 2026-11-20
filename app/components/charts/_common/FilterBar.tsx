// Filter controls in React: the search box, one chip per track, and the
// "Known by" viewpoint chips. Controlled — the chart owns the filter value and
// gets every edit through onChange. useFilterSections hands the three parts to
// the header settings panel under their labels, as buildFilterBar's parts were
// hoisted before. Pure matching stays in filters.ts.

import { useMemo } from 'react';
import { Chip, SearchInput, type SettingsSection } from 'jeff-ui';
import './components/filterbar.css';
import { trackList, audienceList } from './helpers/filters.js';
import { DM_AUDIENCE, DM_LABEL } from './constants.js';
import type { TimelineEvent } from './types.js';

// An empty set means "filter nothing": every beat passes.
export interface FilterValue {
  query: string;
  tracks: Set<string>;
  audiences: Set<string>;
}

export const EMPTY_FILTER: FilterValue = { query: '', tracks: new Set(), audiences: new Set() };

interface AudienceOption {
  key: string;
  label: string;
  dm: boolean;
}

// The "Known by" chips: the DM first when some beat is secret (its point is
// seeing them), then each character named in any beat's knownBy. Empty means
// the group is left out.
function audienceOptions(events: TimelineEvent[]): AudienceOption[] {
  return [
    ...(events.some((e) => e.secret) ? [{ key: DM_AUDIENCE, label: DM_LABEL, dm: true }] : []),
    ...audienceList(events).map((name) => ({ key: name, label: name, dm: false })),
  ];
}

// The starting value from a loaded view. Tracks and audiences that no longer
// have a chip in this data are dropped.
export function seedFilter(
  events: TimelineEvent[],
  initial?: { query: string; tracks: string[]; audiences?: string[] },
): FilterValue {
  const tracks = new Set(trackList(events));
  const audiences = new Set(audienceOptions(events).map((a) => a.key));
  return {
    query: initial?.query ?? '',
    tracks: new Set(initial?.tracks.filter((t) => tracks.has(t))),
    audiences: new Set(initial?.audiences?.filter((a) => audiences.has(a))),
  };
}

function toggled(set: Set<string>, key: string, on: boolean): Set<string> {
  const next = new Set(set);
  if (on) next.add(key);
  else next.delete(key);
  return next;
}

// Sections for the settings panel: Search, Filter, and Known by (only when
// there is an audience to pick).
export function useFilterSections(
  events: TimelineEvent[],
  value: FilterValue,
  onChange: (next: FilterValue) => void,
): SettingsSection[] {
  const tracks = useMemo(() => trackList(events), [events]);
  const audiences = useMemo(() => audienceOptions(events), [events]);

  const sections: SettingsSection[] = [
    {
      label: 'Search',
      content: (
        <SearchInput
          className="chart-search"
          label="Search beats…"
          value={value.query}
          onChange={(query) => onChange({ ...value, query })}
        />
      ),
    },
    {
      label: 'Filter',
      content: (
        <div className="chart-chips">
          {tracks.map((track) => (
            <Chip
              key={track}
              unstyled
              className={value.tracks.has(track) ? 'chart-chip is-on' : 'chart-chip'}
              data-track={track}
              pressed={value.tracks.has(track)}
              onToggle={(on) => onChange({ ...value, tracks: toggled(value.tracks, track, on) })}
            >
              {track}
            </Chip>
          ))}
        </div>
      ),
    },
  ];

  if (audiences.length > 0) {
    sections.push({
      label: 'Known by',
      content: (
        <div className="chart-chips chart-audiences">
          {audiences.map(({ key, label, dm }) => {
            const on = value.audiences.has(key);
            const cls = `chart-chip chart-chip-audience${dm ? ' chart-chip-dm' : ''}${on ? ' is-on' : ''}`;
            return (
              <Chip
                key={key}
                unstyled
                className={cls}
                data-audience={key}
                pressed={on}
                onToggle={(next) => onChange({ ...value, audiences: toggled(value.audiences, key, next) })}
              >
                {label}
              </Chip>
            );
          })}
        </div>
      ),
    });
  }
  return sections;
}
