// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { mountCampaignSelect } from './campaign-select.js';

describe('mountCampaignSelect', () => {
  const campaigns = [
    { slug: 'strahd', label: 'Curse of Strahd' },
    { slug: 'homebrew', label: 'Homebrew Campaign' },
  ];

  it('renders one option per campaign, in order, with no "all" option', () => {
    const host = document.createElement('div');
    const sel = mountCampaignSelect(host, { campaigns, current: 'strahd', onChange: () => {} });
    expect([...sel.options].map((o) => o.value)).toEqual(['strahd', 'homebrew']);
    expect([...sel.options].map((o) => o.textContent)).toEqual(['Curse of Strahd', 'Homebrew Campaign']);
    expect(host.querySelector('.chart-campaign-select')).toBe(sel);
  });

  it('reflects the current selection', () => {
    const host = document.createElement('div');
    const sel = mountCampaignSelect(host, { campaigns, current: 'homebrew', onChange: () => {} });
    expect(sel.value).toBe('homebrew');
  });

  it('emits the chosen slug on change', () => {
    const host = document.createElement('div');
    const onChange = vi.fn();
    const sel = mountCampaignSelect(host, { campaigns, current: 'strahd', onChange });
    sel.value = 'homebrew';
    sel.dispatchEvent(new Event('change'));
    expect(onChange).toHaveBeenCalledWith('homebrew');
  });
});
