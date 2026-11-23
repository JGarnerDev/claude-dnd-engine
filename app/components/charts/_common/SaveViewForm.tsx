// Save popover body: a name field and a Save button. Saving over an existing
// name takes a second click (decision F); editing the name cancels that.

import { useState } from "react";
import { Button, Column, Text, TextInput } from "jeff-ui";
import { listViews, saveView } from "./helpers/viewstore.js";
import type { ChartState, SavedView } from "./types.js";

interface SaveViewFormProps {
  // The name field's id, so the popover can focus it when it opens.
  nameId: string;
  getCurrent(): { tab: SavedView["tab"]; state: ChartState };
  onSaved(): void;
}

export function SaveViewForm({ nameId, getCurrent, onSaved }: SaveViewFormProps) {
  const [name, setName] = useState("");
  // The name the next click will overwrite, once confirmed.
  const [pending, setPending] = useState("");

  const commit = (viewName: string) => {
    const { tab, state } = getCurrent();
    saveView({ name: viewName, tab, state });
    setName("");
    setPending("");
    onSaved();
  };

  const confirm = () => {
    const n = name.trim();
    if (!n) {
      document.getElementById(nameId)?.focus();
      return;
    }
    if (pending === n || !listViews().some((v) => v.name === n)) commit(n);
    else setPending(n);
  };

  return (
    <Column gap={2} className="chart-sv-form">
      <TextInput
        id={nameId}
        className="chart-sv-name"
        label="View name"
        placeholder="View name…"
        value={name}
        onChange={(next) => {
          setName(next);
          setPending("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") confirm();
        }}
      />
      <Button variant="primary" className="chart-sv-confirm" onClick={confirm}>
        {pending ? "Overwrite?" : "Save"}
      </Button>
      <Text as="div" size="xs" tone="muted" lines={1} className="chart-sv-msg">
        {pending && `"${pending}" already exists.`}
      </Text>
    </Column>
  );
}
