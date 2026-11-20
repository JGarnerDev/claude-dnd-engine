// Campaign selector for pages/home: a small dropdown in the header action cluster
// that scopes the World view to one campaign (there is no "all" option). The page
// owns the filtering — agnostic beats (no campaign tag) always show — and this
// only renders the choices and reports the pick, through jeff-ui's Select.

import { Select } from "jeff-ui";
import "./campaign-select.css";

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
    <Select
      className="chart-campaign-select"
      label="Campaign"
      options={campaigns.map((c) => ({ value: c.slug, label: c.label }))}
      value={current}
      hidden={hidden}
      onChange={onChange}
    />
  );
}
