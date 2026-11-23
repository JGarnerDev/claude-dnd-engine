// Saved views in React: a Save and a Load button for the header actions slot
// (left of the settings gear). Save captures the live view under a typed name,
// with an inline overwrite confirm instead of window.prompt, which sandboxed
// iframes block. Load lists saved views, applies one on click, and deletes one
// with its ×. Both are jeff-ui Popovers, so they share the gear's
// one-open-at-a-time group. Persistence lives in viewstore.ts.

import { useId, useState } from "react";
import { Icon, Popover } from "jeff-ui";
import { SaveViewForm } from "./SaveViewForm.js";
import { SavedViewList } from "./SavedViewList.js";
import { listViews } from "./helpers/viewstore.js";
import type { ChartState, SavedView } from "./types.js";

export interface SavedViewsProps {
  // Read the host's current tab + the active chart's full state.
  getCurrent(): { tab: SavedView["tab"]; state: ChartState };
  // Switch to a loaded view's tab and seed its chart with the saved state.
  apply(view: SavedView): void;
}

export function SavedViews({ getCurrent, apply }: SavedViewsProps) {
  const nameId = useId();
  // Read from storage each time Load opens, so a view saved since shows up.
  const [views, setViews] = useState(listViews);
  return (
    <>
      <Popover
        label="Save view"
        icon={<Icon name="save" />}
        onOpen={() => document.getElementById(nameId)?.focus()}
      >
        {({ close }) => <SaveViewForm nameId={nameId} getCurrent={getCurrent} onSaved={close} />}
      </Popover>
      <Popover label="Load view" icon={<Icon name="list" />} onOpen={() => setViews(listViews())}>
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
