// Load popover body: one row per saved view — its name loads it, its × deletes
// it (decision G) — or an empty note.

import { Button, EmptyState, IconButton } from "jeff-ui";
import { deleteView } from "./helpers/viewstore.js";
import type { SavedView } from "./types.js";

interface SavedViewListProps {
  views: SavedView[];
  onLoad(view: SavedView): void;
  // Gets the list left after a delete.
  onChange(views: SavedView[]): void;
}

export function SavedViewList({ views, onLoad, onChange }: SavedViewListProps) {
  return (
    <div className="chart-sv-list">
      {views.length === 0 && (
        <EmptyState className="chart-sv-empty">No saved views yet.</EmptyState>
      )}
      {views.map((v) => (
        <div key={v.name} className="chart-sv-row">
          <Button
            variant="ghost"
            className="chart-sv-load"
            title={v.tab === "tracks" ? "Campaign view" : "World view"}
            onClick={() => onLoad(v)}
          >
            {v.name}
          </Button>
          <IconButton
            danger
            className="chart-sv-del"
            label={`Delete ${v.name}`}
            onClick={() => onChange(deleteView(v.name))}
          >
            ×
          </IconButton>
        </div>
      ))}
    </div>
  );
}
