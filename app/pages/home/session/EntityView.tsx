// One entity, opened in the side panel: layer badge, description, this session's
// quick-ref for it (when the plan has one), frontmatter fields, then the body,
// fetched (entity-fetch.ts) once the header is up.

import { useEffect, useState } from 'react';
import { Badge, Disclosure } from 'jeff-ui';
import { fetchEntity, LAYER_LABEL } from './entity-fetch.js';
import { splitEntity } from './frontmatter.js';
import { InlineMd, Markdown } from './MarkdownView.js';
import type { EntityRef } from './types.js';

export function EntityHeader({ e, root, quickRef }: { e: EntityRef; root: string; quickRef?: string }) {
  const layer = e.path.split('/')[0];
  const chips = [e.type, e.subtype, e.campaign].filter(Boolean);
  return (
    <div className="sr-ent-head">
      <h2>{e.name}</h2>
      <div className="sr-ent-tags">
        <Badge className="sr-layer" data-layer={layer}>{LAYER_LABEL[layer] ?? layer}</Badge>
        {chips.map((c, i) => <Badge key={i} className="sr-chiptag">{c}</Badge>)}
      </div>
      {e.description && <p className="sr-ent-desc"><InlineMd md={e.description} /></p>}
      {quickRef && <div className="sr-quickref"><div className="sr-quickref-label">This session</div><Markdown md={quickRef} /></div>}
      <a className="sr-openfile" href={`vscode://file/${encodeURI(`${root}/${e.path}`)}`}>Open in VS Code</a>
    </div>
  );
}

export function EntityBody({ text }: { text: string }) {
  const { fields, body } = splitEntity(text);
  return (
    <>
      {fields.length > 0 && (
        <Disclosure className="sr-fields" title="Fields"><dl>{fields.map(([k, v]) => [
          <dt key={`t${k}`}>{k.replace(/_/g, ' ')}</dt>,
          <dd key={`d${k}`}>{Array.isArray(v) ? <ul>{v.map((x, i) => <li key={i}><InlineMd md={x} /></li>)}</ul> : <InlineMd md={v} />}</dd>,
        ])}</dl></Disclosure>
      )}
      <div className="sr-md"><Markdown md={body} /></div>
    </>
  );
}

type Load = { path: string; text?: string; failed?: boolean };

// The header now, the body once its file arrives.
export function EntityView({ e, root, quickRef }: { e: EntityRef; root: string; quickRef?: string }) {
  const [load, setLoad] = useState<Load>({ path: e.path });
  useEffect(() => {
    let live = true;
    fetchEntity(e.path).then(
      (text) => { if (live) setLoad({ path: e.path, text }); },
      () => { if (live) setLoad({ path: e.path, failed: true }); },
    );
    return () => { live = false; };
  }, [e.path]);
  const mine = load.path === e.path ? load : { path: e.path };
  return (
    <>
      <EntityHeader e={e} root={root} quickRef={quickRef} />
      <div className="sr-ent-body">
        {mine.text !== undefined ? <EntityBody text={mine.text} /> : mine.failed ? 'Could not load this file.' : 'Loading…'}
      </div>
    </>
  );
}
