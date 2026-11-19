// The runner's header: the session's name and date, the search box (`/`) that
// feeds the side panel, and the actions: step back, copy the walked path, restart,
// the timeline, and the pin that docks or hides the panel (`\`).

import type { PanelApi } from './usePanel.js';

export interface RunnerHeaderProps {
  name: string;
  date: string;
  p: PanelApi;
  onBack: () => void;
  onCopy: () => void;
  onRestart: () => void;
}

export function RunnerHeader({ name, date, p, onBack, onCopy, onRestart }: RunnerHeaderProps) {
  return (
    <header className="sr-header">
      <div className="sr-title"><strong>{name}</strong><span>{date}</span></div>
      <div className="sr-searchbox">
        <input ref={p.search} className="sr-search" type="search" autoComplete="off" placeholder="Search people, places, beats, mysteries"
          aria-label="Search people, places, beats and mysteries" value={p.query} onChange={p.onSearchInput} onKeyDown={p.onSearchKey} />
        <kbd>/</kbd>
      </div>
      <div className="sr-actions">
        <button type="button" data-act="back" title="Step back (←)" onClick={onBack}>← Back</button>
        <button type="button" data-act="copy" title="Copy the path walked so far" onClick={onCopy}>Copy path</button>
        <button type="button" data-act="restart" onClick={onRestart}>Restart</button>
        <a href="/">Timeline</a>
        <button type="button" className="sr-pin" title="Dock or hide the side panel (\)" onClick={p.toggleDock}>
          {p.docked ? 'Hide panel' : 'Pin panel'}<kbd>\</kbd>
        </button>
      </div>
    </header>
  );
}
