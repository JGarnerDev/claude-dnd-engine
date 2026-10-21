import { describe, expect, it } from 'vitest';
import { escapeHtml, extractCallouts, inline, nodeHeadings, plainText, renderMarkdown, splitNodeSections, splitSections, stripCallouts } from './markdown.js';

describe('plainText', () => {
  it('unwraps wikilinks and drops bold/code markup', () => {
    expect(plainText("[[Miguel]]'s PC, **gnome** `wizard` of [[The Citadel|the Citadel]]")).toBe("Miguel's PC, gnome wizard of the Citadel");
  });
});

describe('inline', () => {
  it('escapes HTML before formatting', () => {
    expect(inline('<b> & "x"')).toBe('&lt;b&gt; &amp; &quot;x&quot;');
    expect(escapeHtml('a<b')).toBe('a&lt;b');
  });

  it('renders bold, italic and code, leaving code contents alone', () => {
    expect(inline('**a** *b* `**c**`')).toBe('<strong>a</strong> <em>b</em> <code>**c**</code>');
  });

  it('renders wikilinks with alias and marks unknown names', () => {
    const known = (n: string) => n === 'Ashford';
    expect(inline('[[Ashford|the town]] and [[Nowhere]]', known)).toBe(
      '<a class="sr-wiki" data-entity="Ashford">the town</a> and <a class="sr-wiki is-missing" data-entity="Nowhere">Nowhere</a>',
    );
  });
});

describe('renderMarkdown', () => {
  it('renders indented blockquotes and headings without hanging', () => {
    const html = renderMarkdown('- read aloud:\n\n       > *"The room\'s carrying the tune"*\n       > now, badly\n\n   ### Aside');
    expect(html).toContain('<blockquote><p><em>&quot;The room\'s carrying the tune&quot;</em> now, badly</p></blockquote>');
    expect(html).toContain('<h5>Aside</h5>');
  });

  it('renders headings, paragraphs and blockquotes', () => {
    const html = renderMarkdown('## Title\n\nline one\nline two\n\n> *quoted*\n> more');
    expect(html).toContain('<h4>Title</h4>');
    expect(html).toContain('<p>line one line two</p>');
    expect(html).toContain('<blockquote><p><em>quoted</em> more</p></blockquote>');
  });

  it('nests indented list items and folds wrapped continuation lines', () => {
    expect(renderMarkdown('- one\n  wrapped\n  - inner\n- two')).toBe('<ul><li>one wrapped<ul><li>inner</li></ul></li><li>two</li></ul>');
  });

  it('keeps fenced code verbatim and escaped', () => {
    expect(renderMarkdown('```text\n<x> **y**\n```')).toBe('<pre>&lt;x&gt; **y**</pre>');
  });
});

describe('splitSections', () => {
  it('groups scene prose under its bold labels, with the lead-in as Setup', () => {
    const md = [
      '- **Trigger:** right after Scene 1.',
      '',
      '**Beats:**',
      '',
      '- **The talker.** An animal.',
      '',
      '**Beats** — each PC picks one stance:',
      '',
      '- **Steady**',
      '- **Transition:** initiative,',
      '  then Scene 3.',
      '',
      '**Halsby does not roll.** He arrived on foot.',
    ].join('\n');
    expect(splitSections(md)).toEqual([
      { title: 'Setup', md: '- **Trigger:** right after Scene 1.' },
      { title: 'Beats', md: '- **The talker.** An animal.' },
      { title: 'Beats', md: 'Each PC picks one stance:\n\n- **Steady**' },
      { title: 'Transition', md: 'Initiative,\n  then Scene 3.\n\n**Halsby does not roll.** He arrived on foot.' },
    ]);
  });

  it('keeps prose with no labels as one Setup group', () => {
    expect(splitSections('> Read aloud.')).toEqual([{ title: 'Setup', md: '> Read aloud.' }]);
  });
});

describe('splitNodeSections', () => {
  it('files prose under #### node headings, with the lead-in as setup', () => {
    const md = '- **Trigger:** now.\n\n#### S1_WOODS — on the road\n\n- The talker.\n\n#### S1_ASK\n\nSave Sable.';
    const { setup, nodes } = splitNodeSections(md);
    expect(setup).toBe('- **Trigger:** now.');
    expect([...nodes]).toEqual([['S1_WOODS', '- The talker.'], ['S1_ASK', 'Save Sable.']]);
  });

  it('finds no nodes in prose without node headings', () => {
    expect(splitNodeSections('**Beats:**\n\n#### Not a node').nodes.size).toBe(0);
  });
});

describe('extractCallouts', () => {
  it('lifts introductions with their nested bullets and wrapped token cues', () => {
    const md = [
      '- **Tokens:** outdoors map, Mara at the gate,',
      '  Silas behind her.',
      '- **Introduce:** [[Mara Tull]], sheriff',
      '  - **Look:** a worn coat,',
      '    a long knife.',
      '  - **Sound:** quiet.',
      '- **Mara\'s lines:** not a callout.',
    ].join('\n');
    const c = extractCallouts(md);
    expect(c.tokens).toEqual(['outdoors map, Mara at the gate, Silas behind her.']);
    expect(c.intros).toHaveLength(1);
    expect(c.intros[0].name).toBe('[[Mara Tull]], sheriff');
    expect(c.intros[0].md).toBe('- **Look:** a worn coat,\n  a long knife.\n- **Sound:** quiet.');
  });

  it('returns nothing for prose without callouts', () => {
    expect(extractCallouts('- a plain bullet\n\nText.')).toEqual({ intros: [], tokens: [] });
  });
});

describe('nodeHeadings and stripCallouts', () => {
  it('reads node heading titles by id', () => {
    expect([...nodeHeadings('#### S1_ASK — Mara asks\n\ntext\n\n#### S1_GO - Go').entries()]).toEqual([['S1_ASK', 'Mara asks'], ['S1_GO', 'Go']]);
  });

  it('takes callout bullets and their nested lines out of node prose', () => {
    expect(stripCallouts('- **Tokens:** a\n  more\n- **Introduce:** B\n  - **Look:** x\n- keep')).toBe('- keep');
  });
});
