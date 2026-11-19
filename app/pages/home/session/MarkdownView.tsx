// Renders markdown tokens (markdown-tokens.ts) as React. <Markdown> is a block of
// prose, <InlineMd> one line of it. `text` lets a caller swap plain text runs for
// something richer (dice buttons in a stat block); it never sees text inside a
// link or `code`, as rollableHtml never did. Under a RefContext, beat ids, card paths
// and "Scene N" become chips (RefChips.tsx). `spoken` gives an *"italic quote"* the
// read-aloud face, as the prompt book's blocks do.

import { createContext, Fragment, useContext, useMemo, type ReactNode } from 'react';
import { parseInline, parseMarkdown, type Block, type Inline, type ListItem } from './markdown-tokens.js';
import { CodeRef, NoSceneLinks, useSceneLinker } from './RefChips.js';
import { WikiLink } from './WikiLink.js';

export type TextRender = (s: string) => ReactNode;

const TextContext = createContext<TextRender>((s) => s);
const SpokenContext = createContext(false);

// A class for each list item, by its tokens: a Watch block lights the items that
// have come true (fight-cues.ts). Unset, items carry no class.
export const ItemClassContext = createContext<((it: ListItem) => string | undefined) | null>(null);

// An em that opens on a quote mark (inside a leading bold too) is a line to say.
function quoted(c: Inline[]): boolean {
  const first = c[0]?.t === 'strong' ? c[0].c[0] : c[0];
  return first?.t === 'text' && /^["“']/.test(first.s);
}

function Inlines({ c }: { c: Inline[] }) {
  const text = useContext(TextContext);
  const spoken = useContext(SpokenContext);
  const link = useSceneLinker();
  return c.map((n, i) => {
    switch (n.t) {
      case 'text': return <Fragment key={i}>{link ? link(text(n.s)) : text(n.s)}</Fragment>;
      case 'code': return <CodeRef key={i} s={n.s} />;
      case 'strong': return <strong key={i}><Inlines c={n.c} /></strong>;
      case 'em': return <em key={i} className={spoken && quoted(n.c) ? 'sr-say' : undefined}><Inlines c={n.c} /></em>;
      case 'wiki': return <WikiLink key={i} entity={n.name}>{n.label}</WikiLink>;
    }
  });
}

function Items({ items }: { items: readonly ListItem[] }) {
  const cls = useContext(ItemClassContext);
  return items.map((it, i) => (
    <li key={i} className={cls?.(it)}><Inlines c={it.c} />{it.sub.length > 0 && <List items={it.sub} />}</li>
  ));
}

function List({ items }: { items: ListItem[] }) {
  return <ul><Items items={items} /></ul>;
}

// List items picked out of a block (the fight bar card's boss lines), without their <ul>.
export function MdItems({ items, text }: { items: readonly ListItem[]; text?: TextRender }) {
  return withText(text, false, <Items items={items} />);
}

function Pre({ s }: { s: string }) {
  const link = useSceneLinker();
  return <pre>{link ? link(s) : s}</pre>;
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((b, i) => {
    switch (b.t) {
      case 'pre': return <Pre key={i} s={b.s} />;
      case 'h': {
        const H = `h${b.level}` as 'h1';
        return <H key={i}>{b.level <= 2 ? <NoSceneLinks><Inlines c={b.c} /></NoSceneLinks> : <Inlines c={b.c} />}</H>;
      }
      case 'quote': return <blockquote key={i}><Blocks blocks={b.c} /></blockquote>;
      case 'list': return <List key={i} items={b.items} />;
      case 'p': return <p key={i}><Inlines c={b.c} /></p>;
    }
  });
}

interface MdProps { md: string; text?: TextRender; spoken?: boolean }

function withText(text: TextRender | undefined, spoken: boolean | undefined, node: ReactNode) {
  const n = text ? <TextContext.Provider value={text}>{node}</TextContext.Provider> : node;
  return spoken ? <SpokenContext.Provider value>{n}</SpokenContext.Provider> : n;
}

export function Markdown({ md, text, spoken }: MdProps) {
  const blocks = useMemo(() => parseMarkdown(md), [md]);
  return withText(text, spoken, <Blocks blocks={blocks} />);
}

export function InlineMd({ md, text, spoken }: MdProps) {
  const c = useMemo(() => parseInline(md), [md]);
  return withText(text, spoken, <Inlines c={c} />);
}
