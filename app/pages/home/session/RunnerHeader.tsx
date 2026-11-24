// The runner's header: the session's name and date, the search box (`/`) that
// feeds the side panel, and the actions: step back, copy the walked path, restart,
// the timeline, and the pin that docks or hides the panel (`\`).

import { Box, Button, Kbd, Link, Row, SearchInput, Text } from "jeff-ui";
import type { PanelApi } from "./usePanel.js";
import { sessionTitle } from "./session-title.js";

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
    <Box as="header" padding={3} className="sr-header">
      <Row justify="between" gap={3}>
        <Row align="baseline" gap={3} className="sr-title">
          <Text as="span" size="md" strong>
            {sessionTitle(name)}
          </Text>
          <Text as="span" size="sm" tone="muted">
            {date}
          </Text>
        </Row>
        <SearchInput
          id={p.searchId}
          className="sr-searchbox"
          label="Search people, places, beats and mysteries"
          placeholder="Search the session"
          shortcut="/"
          value={p.query}
          onChange={p.setQuery}
          onKeyDown={p.onSearchKey}
        />
        <Row gap={2} className="sr-actions">
          <Button data-act="back" title="Step back (←)" onClick={onBack}>
            ← Back
          </Button>
          <Button data-act="copy" title="Copy the path walked so far" onClick={onCopy}>
            Copy path
          </Button>
          <Button data-act="restart" onClick={onRestart}>
            Restart
          </Button>
          <Link variant="button" href="/">
            Timeline
          </Link>
          <Button className="sr-pin" title="Dock or hide the side panel (\)" onClick={p.toggleDock}>
            {p.docked ? "Hide panel" : "Pin panel"} <Kbd>\</Kbd>
          </Button>
        </Row>
      </Row>
    </Box>
  );
}
