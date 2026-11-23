// Load popover body: one row per saved view — its name loads it, its × deletes
// it (decision G) — or an empty note.

import { Column, EmptyState, Icon, IconButton, Row, RowButton } from "jeff-ui";
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
    <Column gap={1} className="chart-sv-list">
      {views.length === 0 && (
        <EmptyState className="chart-sv-empty">No saved views yet.</EmptyState>
      )}
      {views.map((v) => (
        <Row key={v.name} gap={1} className="chart-sv-row">
          <RowButton
            className="chart-sv-load"
            title={v.name}
            sub={v.tab === "tracks" ? "Campaign view" : "World view"}
            onClick={() => onLoad(v)}
          />
          <IconButton
            danger
            className="chart-sv-del"
            label={`Delete ${v.name}`}
            onClick={() => onChange(deleteView(v.name))}
          >
            <Icon name="close" />
          </IconButton>
        </Row>
      ))}
    </Column>
  );
}
