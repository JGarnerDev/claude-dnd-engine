// Saved views in React: a Save and a Load button for the header actions slot
// (left of the settings gear). Save captures the live view under a typed name,
// with an inline overwrite confirm instead of window.prompt, which sandboxed
// iframes block. Load lists saved views, applies one on click, and deletes one
// with its ×. Both are jeff-ui Popovers, so they share the gear's
// one-open-at-a-time group. Persistence lives in viewstore.ts.

import { useRef, useState } from 'react';
import { Popover } from 'jeff-ui';
import './components/savedviews.css';
import { SaveViewForm } from './SaveViewForm.js';
import { SavedViewList } from './SavedViewList.js';
import { listViews } from './helpers/viewstore.js';
import type { ChartState, SavedView } from './types.js';

export interface SavedViewsProps {
  // Read the host's current tab + the active chart's full state.
  getCurrent(): { tab: SavedView['tab']; state: ChartState };
  // Switch to a loaded view's tab and seed its chart with the saved state.
  apply(view: SavedView): void;
}

const classNames = { button: 'chart-settings-btn chart-sv-btn', panel: 'chart-sv-popover' };

export function SavedViews({ getCurrent, apply }: SavedViewsProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  // Read from storage each time Load opens, so a view saved since shows up.
  const [views, setViews] = useState(listViews);
  return (
    <>
      <Popover label="Save view" icon={<SaveIcon />} classNames={classNames} unstyled onOpen={() => nameRef.current?.focus()}>
        {({ close }) => <SaveViewForm nameRef={nameRef} getCurrent={getCurrent} onSaved={close} />}
      </Popover>
      <Popover label="Load view" icon={<LoadIcon />} classNames={classNames} unstyled onOpen={() => setViews(listViews())}>
        {({ close }) => (
          <SavedViewList
            views={views}
            onLoad={(view) => {
              apply(view);
              close();
            }}
            onChange={setViews}
          />
        )}
      </Popover>
    </>
  );
}

const svg = {
  viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
} as const;

function SaveIcon() {
  return (
    <svg {...svg}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function LoadIcon() {
  return (
    <svg {...svg}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
