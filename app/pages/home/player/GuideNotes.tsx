// The guide's side panels (jeff-ui NotePanel): in Notes, "To do" is a checklist whose
// done marks the caller keeps; every other group, and every Roleplay character, is a
// list of folding reminders in the `hue` given. Each panel's heading folds its whole
// list; `start` says whether it starts open (Notes) or folded (Roleplay).

import { Badge, NoteItem, NotePanel } from "jeff-ui";
import { InlineMd } from "../session/MarkdownView.js";
import type { NotePanelData } from "./guide-notes.js";
import type { StoredSet } from "./stored-set.js";

const TODO_HUE = "var(--ui-ok)";
export const NOTE_HUE = "var(--ui-hue-sky)";
export const ROLEPLAY_HUE = "var(--ui-hue-rose)";

function Panel({
  panel,
  done,
  hue,
  start,
}: {
  panel: NotePanelData;
  done: StoredSet;
  hue: string;
  start: PanelStart;
}) {
  const { checklist, notes } = panel;
  const left = checklist ? notes.filter((n) => !done.has(n.id)).length : notes.length;
  return (
    <NotePanel
      title={panel.title}
      count={left}
      hue={checklist ? TODO_HUE : hue}
      folds
      defaultOpen={start === "open"}
    >
      {notes.map((n) => (
        <NoteItem
          key={n.id}
          title={n.lead}
          checked={checklist ? done.has(n.id) : undefined}
          onCheck={(on) => done.set(n.id, on)}
          tag={n.atTable ? <Badge hue="var(--ui-hue-amber)">at the table</Badge> : undefined}
        >
          {n.detail ? <InlineMd md={n.detail} /> : undefined}
        </NoteItem>
      ))}
    </NotePanel>
  );
}

/** How a panel starts: open, or folded to its heading and count. */
export type PanelStart = "open" | "folded";

/** `done` holds the ids of ticked to-dos (`useStoredSet`). */
export function GuideNotes({
  panels,
  done,
  hue = NOTE_HUE,
  start,
}: {
  panels: readonly NotePanelData[];
  done: StoredSet;
  hue?: string;
  start: PanelStart;
}) {
  return panels.map((p) => <Panel key={p.title} panel={p} done={done} hue={hue} start={start} />);
}
