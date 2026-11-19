// A [[wikilink]] in campaign prose. Clicking it opens the entity in the side panel;
// a name the campaign doesn't know is flagged `is-missing` (and still opens, to
// show that it's missing). No href: it's a button-like link, as before the port.

import type { ReactNode } from 'react';
import { useSession } from './SessionContext.js';

export function WikiLink({ entity, children }: { entity: string; children?: ReactNode }) {
  const { known, openEntity } = useSession();
  return (
    <a className={known(entity) ? 'sr-wiki' : 'sr-wiki is-missing'} data-entity={entity} onClick={() => openEntity(entity)}>
      {children ?? entity}
    </a>
  );
}
