// Campaign selector for pages/home: a small dropdown in the header action cluster
// that scopes the World view to one campaign (there is no "all" option). The page
// owns the filtering — agnostic beats (no campaign tag) always show — and this
// only renders the choices and reports the pick. A native <select> keeps it
// accessible with no focus handling of its own.

import './campaign-select.css';

export interface CampaignOption {
  slug: string;
  label: string;
}

export interface CampaignSelectProps {
  campaigns: CampaignOption[]; // known campaigns (each a real slug)
  current: string; // the selected campaign slug
  onChange(slug: string): void;
  // Set on the Campaign view, which spans every campaign.
  hidden?: boolean;
}

export function CampaignSelect({ campaigns, current, onChange, hidden }: CampaignSelectProps) {
  return (
    <select
      className="chart-campaign-select"
      title="Campaign"
      aria-label="Campaign"
      value={current}
      hidden={hidden}
      onChange={(e) => onChange(e.target.value)}
    >
      {campaigns.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
