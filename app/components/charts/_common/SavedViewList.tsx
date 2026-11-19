// Load popover body: one row per saved view — its name loads it, its × deletes
// it (decision G) — or an empty note.

import { deleteView } from './helpers/viewstore.js';
import type { SavedView } from './types.js';

interface SavedViewListProps {
  views: SavedView[];
  onLoad(view: SavedView): void;
  // Gets the list left after a delete.
  onChange(views: SavedView[]): void;
}

export function SavedViewList({ views, onLoad, onChange }: SavedViewListProps) {
  return (
    <div className="chart-sv-list">
      {views.length === 0 && <div className="chart-sv-empty">No saved views yet.</div>}
      {views.map((v) => (
        <div key={v.name} className="chart-sv-row">
          <button
            type="button"
            className="chart-sv-load"
            title={v.tab === 'tracks' ? 'Campaign view' : 'World view'}
            onClick={() => onLoad(v)}
          >
            {v.name}
          </button>
          <button
            type="button"
            className="chart-sv-del"
            aria-label={`Delete ${v.name}`}
            onClick={() => onChange(deleteView(v.name))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
