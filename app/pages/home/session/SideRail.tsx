// The thin rail beside the side panel: search, home (party and this scene) and
// the last thing opened, with how deep the panel's Back stack runs. On a narrow
// window it is all of the panel that shows until something slides it open; the
// Drawer shows it only while the panel is not docked.

import { Column, Icon, IconButton } from "jeff-ui";
import type { PanelApi } from "./usePanel.js";

export function SideRail({ p }: { p: PanelApi }) {
  const n = p.stack.length;
  return (
    <Column as="nav" gap={2} align="center" className="sr-siderail" aria-label="Side panel">
      <IconButton
        data-rail="search"
        title="Search ( / )"
        label="Search"
        onClick={() => p.rail("search")}
      >
        <Icon name="search" />
      </IconButton>
      <IconButton data-rail="home" label="Party and this scene" onClick={() => p.rail("home")}>
        <Icon name="users" />
      </IconButton>
      {n > 0 && (
        <IconButton data-rail="last" label="Last opened" count={n} onClick={() => p.rail("last")}>
          <Icon name="file" />
        </IconButton>
      )}
    </Column>
  );
}
