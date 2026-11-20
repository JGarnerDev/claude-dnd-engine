// The thin rail beside the side panel: search, home (party and this scene) and
// the last thing opened, with how deep the panel's Back stack runs. On a narrow
// window it is all of the panel that shows until something slides it open.

import { IconButton } from 'jeff-ui';
import type { PanelApi } from './usePanel.js';

export function SideRail({ p }: { p: PanelApi }) {
  const n = p.stack.length;
  return (
    <nav className="sr-siderail" aria-label="Side panel">
      <IconButton data-rail="search" title="Search ( / )" label="Search" onClick={() => p.rail('search')}>
        <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
      </IconButton>
      <IconButton data-rail="home" label="Party and this scene" onClick={() => p.rail('home')}>
        <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.8 3.4-6 6.5-6s5.7 2.2 6.5 6" /><circle cx="17" cy="9" r="2.6" /><path d="M17 14c2.4 0 4 1.6 4.6 4.4" /></svg>
      </IconButton>
      <IconButton data-rail="last" label="Last opened" hidden={!n} onClick={() => p.rail('last')}>
        <svg viewBox="0 0 24 24"><path d="M5 4h10l4 4v12H5z" /><path d="M9 12h7M9 16h5" /></svg>
        <span className="sr-rail-n">{n ? String(n) : ''}</span>
      </IconButton>
    </nav>
  );
}
