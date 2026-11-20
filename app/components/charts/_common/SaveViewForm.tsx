// Save popover body: a name field and a Save button. Saving over an existing
// name takes a second click (decision F); editing the name cancels that.

import { useState, type RefObject } from 'react';
import { Button } from 'jeff-ui';
import { listViews, saveView } from './helpers/viewstore.js';
import type { ChartState, SavedView } from './types.js';

interface SaveViewFormProps {
  nameRef: RefObject<HTMLInputElement | null>;
  getCurrent(): { tab: SavedView['tab']; state: ChartState };
  onSaved(): void;
}

export function SaveViewForm({ nameRef, getCurrent, onSaved }: SaveViewFormProps) {
  const [name, setName] = useState('');
  // The name the next click will overwrite, once confirmed.
  const [pending, setPending] = useState('');

  const commit = (viewName: string) => {
    const { tab, state } = getCurrent();
    saveView({ name: viewName, tab, state });
    setName('');
    setPending('');
    onSaved();
  };

  const confirm = () => {
    const n = name.trim();
    if (!n) {
      nameRef.current?.focus();
      return;
    }
    if (pending === n || !listViews().some((v) => v.name === n)) commit(n);
    else setPending(n);
  };

  return (
    <div className="chart-sv-form">
      <input
        ref={nameRef}
        type="text"
        className="chart-sv-name"
        placeholder="View name…"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setPending('');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') confirm();
        }}
      />
      <Button variant="primary" className="chart-sv-confirm" onClick={confirm}>
        {pending ? 'Overwrite?' : 'Save'}
      </Button>
      <div className="chart-sv-msg">{pending && `"${pending}" already exists.`}</div>
    </div>
  );
}
