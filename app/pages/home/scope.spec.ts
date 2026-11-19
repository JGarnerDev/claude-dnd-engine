import { describe, it, expect } from 'vitest';
import { campaignScope } from './scope.js';
import type { TimelineData } from '../../components/charts/_common/types.js';

describe('campaignScope', () => {
  const cal = (name: string) => ({ ...({} as NonNullable<TimelineData['calendar']>), name });
  const data: TimelineData = {
    calendar: null,
    campaigns: [
      { slug: 'strahd', label: 'Curse of Strahd', active: false },
      { slug: 'homebrew', label: 'Homebrew Campaign', active: true },
    ],
    events: [
      { date: '1340-02-15', label: 'War begins', track: 'world', campaign: 'strahd' },
      { date: '1341-03-01', label: 'Gate opens', track: 'world', campaign: 'homebrew' },
      { date: '1341-06-01', label: 'A timeless myth', track: 'world' },
    ],
    spans: [
      { start: '1340-01-01', end: '1340-12-01', label: 'Siege', track: 'world', campaign: 'strahd' },
      { start: '1341-01-01', end: '1341-12-01', label: 'Long winter', track: 'world' },
    ],
  } as TimelineData;

  const labels = (d: TimelineData) => d.events.map((e) => e.label);

  it('lists the known campaigns as slug + label', () => {
    expect(campaignScope(data).campaigns).toEqual([
      { slug: 'strahd', label: 'Curse of Strahd' },
      { slug: 'homebrew', label: 'Homebrew Campaign' },
    ]);
  });

  it('starts on the active campaign, else the first, else none', () => {
    expect(campaignScope(data).initial).toBe('homebrew');
    const noneActive = { ...data, campaigns: data.campaigns!.map((c) => ({ ...c, active: false })) };
    expect(campaignScope(noneActive).initial).toBe('strahd');
    expect(campaignScope({ ...data, campaigns: undefined }).initial).toBeNull();
  });

  it("keeps a campaign's own beats plus agnostic ones", () => {
    const s = campaignScope(data).scoped('strahd');
    expect(labels(s)).toEqual(['War begins', 'A timeless myth']);
    expect(s.spans!.map((x) => x.label)).toEqual(['Siege', 'Long winter']);
    expect(s.primary).toBe('strahd');
  });

  it('returns the full graph unscoped when there is no slug', () => {
    expect(campaignScope(data).scoped(null)).toBe(data);
  });

  it("uses the campaign's own calendar when it has one, else the graph's", () => {
    const withCal = {
      ...data,
      calendar: cal('Harptos'),
      campaigns: [{ ...data.campaigns![0], calendar: cal('Barovian') }, data.campaigns![1]],
    } as TimelineData;
    const scope = campaignScope(withCal);
    expect(scope.scoped('strahd').calendar).toEqual(cal('Barovian'));
    expect(scope.scoped('homebrew').calendar).toEqual(cal('Harptos'));
  });

  it('carries the same full-graph sync into every scoped view', () => {
    const scope = campaignScope(data);
    expect(scope.scoped('strahd').sync).toBe(scope.scoped('homebrew').sync);
  });
});
