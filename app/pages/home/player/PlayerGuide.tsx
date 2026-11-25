// The player guide page: one PC's guide (meta/player-guides/<PC>.md) as tabs, one
// per `## ` section, each shown as cards of tappable plays (GuidePlays). A search box
// above the tabs finds plays across every section. The guide's `## Notes` and
// `## Roleplay` sit apart: Notes in a sticky column at the right on a wide screen,
// Roleplay at the left (under Notes when the screen is too narrow for both), each
// folded above the search on a phone.
// A PC picker when there are several guides; a notice when the PC file's level has
// moved past the guide's.

import { useState, type ReactNode } from "react";
import {
  Box,
  Column,
  Disclosure,
  EmptyState,
  Link,
  Notice,
  PageHeader,
  SearchInput,
  Select,
  Tabs,
} from "jeff-ui";
import {
  isBehind,
  isSessionsBehind,
  parseGuide,
  sessionsSince,
  type Guide,
  type GuideFile,
} from "./guide-file.js";
import { questionGroup, searchTree, searchWords, treeOf } from "./guide-items.js";
import { splitNotes } from "./guide-notes.js";
import { GuideNotes, ROLEPLAY_HUE } from "./GuideNotes.js";
import { onlyHit, SearchPlays, SectionPlays, type Opened } from "./GuidePlays.js";
import { useStoredSet } from "./stored-set.js";
import "./player.css";

function StaleNotice({ guide }: { guide: Guide }) {
  const levels = isBehind(guide);
  const sessions = isSessionsBehind(guide);
  if (!levels && !sessions) return null;
  const missed = sessionsSince(guide);
  return (
    <Notice tone="warn" className="pg-stale">
      {levels && (
        <>
          {guide.pc} is level {guide.pcLevel}, but this guide is for level {guide.level}.{" "}
        </>
      )}
      {sessions && (
        <>
          This guide was last checked at session {guide.confirmed || "0"}, and {guide.pc} has played{" "}
          {missed.length} since ({missed.join(", ")}).{" "}
        </>
      )}
      Run <code>/player-guide {guide.pc}</code> to refresh it.
    </Notice>
  );
}

function GuideBody({ guide, header }: { guide: Guide; header: ReactNode }) {
  const { sections, panels, roleplay } = splitNotes(guide.sections);
  const [tab, setTab] = useState(sections[0]?.slug ?? "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Opened | null>(null);
  const done = useStoredSet(`player-guide/${guide.pc}/done`);
  const tree = treeOf(sections);
  const section = tree.find((s) => s.slug === tab) ?? tree[0];
  const words = searchWords(query);
  // Tapping the open play again closes it.
  const tap = (o: Opened) => setOpen(open?.key === o.key ? null : o);
  const notes = <GuideNotes panels={panels} done={done} start="open" />;
  const hooks = <GuideNotes panels={roleplay} done={done} hue={ROLEPLAY_HUE} start="folded" />;
  const rail = panels.length > 0 || roleplay.length > 0;
  return (
    <div className={rail ? "pg-layout pg-layout-rail" : "pg-layout"}>
      <Column gap={3} className="pg-main">
        {header}
        <StaleNotice guide={guide} />
        {panels.length > 0 && (
          <Disclosure title="Notes" className="pg-notes-phone">
            <Column gap={3}>{notes}</Column>
          </Disclosure>
        )}
        {roleplay.length > 0 && (
          <Disclosure title="Roleplay" className="pg-notes-phone">
            <Column gap={3}>{hooks}</Column>
          </Disclosure>
        )}
        {tree.length > 0 && (
          <SearchInput
            label="Find a play"
            placeholder="flyers, prone, heal…"
            value={query}
            onChange={(v) => {
              setQuery(v);
              // A search down to one play opens it.
              setOpen(onlyHit(searchTree(tree, searchWords(v))));
            }}
          />
        )}
        {words.length > 0 ? (
          <SearchPlays hits={searchTree(tree, words)} query={query} open={open} onTap={tap} />
        ) : (
          section && (
            <>
              <Tabs
                label="Guide sections"
                items={tree.map((s) => ({ value: s.slug, label: s.title }))}
                selected={section.slug}
                onPick={(v) => {
                  if (!v) return;
                  setTab(v);
                  setOpen(null);
                }}
                className="pg-tabs"
              />
              <SectionPlays section={section} flow={questionGroup(tree)} open={open} onTap={tap} />
            </>
          )
        )}
      </Column>
      {panels.length > 0 && (
        <aside className="pg-side pg-side-notes" aria-label="Notes">
          {notes}
        </aside>
      )}
      {roleplay.length > 0 && (
        <aside className="pg-side pg-side-roleplay" aria-label="Roleplay">
          {hooks}
        </aside>
      )}
    </div>
  );
}

export function PlayerGuide({ files }: { files: readonly GuideFile[] }) {
  const guides = files.map(parseGuide);
  const [picked, setPicked] = useState(guides[0]?.pc ?? "");
  const guide = guides.find((g) => g.pc === picked) ?? guides[0];
  const home = (
    <Link variant="button" href="/" className="pg-home">
      Timeline
    </Link>
  );

  if (!guide)
    return (
      <Box padding={4} className="pg-root">
        <Column gap={3} className="pg-empty-page">
          <PageHeader title="Player guide">{home}</PageHeader>
          <EmptyState className="pg-empty">
            No player guides yet. Run <code>/player-guide</code> to write one.
          </EmptyState>
        </Column>
      </Box>
    );

  return (
    <Box padding={4} className="pg-root">
      <GuideBody
        key={guide.pc}
        guide={guide}
        header={
          <PageHeader title={`${guide.pc}’s guide`}>
            {guides.length > 1 && (
              <Select
                label="Character"
                options={guides.map((g) => g.pc)}
                value={guide.pc}
                onChange={setPicked}
                className="pg-pick"
              />
            )}
            {home}
          </PageHeader>
        }
      />
    </Box>
  );
}
