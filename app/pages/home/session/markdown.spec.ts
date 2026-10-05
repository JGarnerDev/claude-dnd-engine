import { describe, expect, it } from 'vitest';
import { escapeHtml, inline, plainText, renderMarkdown, splitNodeSections, splitSections } from './markdown.js';

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
