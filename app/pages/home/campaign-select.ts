// Campaign selector for pages/home: a small dropdown in the header action cluster
// that scopes the timeline to one campaign (or all). The page owns the filtering;
// this widget only renders the choices and reports the selection back.
//
// A native <select> keeps it accessible and zero-dependency (no popover/focus
// trapping to manage), matching the self-contained-output rule. The World view is
// always scoped to exactly one campaign (no "all" option); agnostic beats (no
// campaign tag) always show, so the page filters with "no tag OR this slug".

import './campaign-select.css';

export interface CampaignOption {
  slug: string;
  label: string;
}

export interface CampaignSelectOpts {
  campaigns: CampaignOption[]; // known campaigns (each a real slug)
  current: string; // the selected campaign slug
  onChange: (slug: string) => void; // fires with the chosen campaign slug
}

// Mount the selector into `parent`. Returns the <select> for tests/callers.
export function mountCampaignSelect(parent: HTMLElement, opts: CampaignSelectOpts): HTMLSelectElement {
  const select = document.createElement('select');
  select.className = 'chart-campaign-select';
  select.title = 'Campaign';
  select.setAttribute('aria-label', 'Campaign');

  for (const c of opts.campaigns) {
    const opt = document.createElement('option');
    opt.value = c.slug;
    opt.textContent = c.label;
    select.append(opt);
  }

  select.value = opts.current;
  select.addEventListener('change', () => opts.onChange(select.value));

  parent.append(select);
  return select;
}
