// A [[wikilink]] in campaign prose. Clicking it opens the entity in the side panel;
// a name the campaign doesn't know is flagged `is-missing` (and still opens, to
// show that it's missing). It acts rather than navigates, so it's an InlineButton.

import type { ReactNode } from "react";
import { InlineButton } from "jeff-ui";
import { useSession } from "./SessionContext.js";

export function WikiLink({ entity, children }: { entity: string; children?: ReactNode }) {
  const { known, openEntity } = useSession();
  return (
    <InlineButton
      className={known(entity) ? "sr-wiki" : "sr-wiki is-missing"}
      hue={known(entity) ? undefined : "var(--ui-muted)"}
      data-entity={entity}
      onClick={() => openEntity(entity)}
    >
      {children ?? entity}
    </InlineButton>
  );
}
