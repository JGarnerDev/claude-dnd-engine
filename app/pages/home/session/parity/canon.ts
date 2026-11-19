// Scratch helpers for the parity specs: legacy HTML and React markup, canonicalized so they compare.
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const canon = (n: Node): string => {
  if (n.nodeType === 3) return (n.textContent ?? '').replace(/\s+/g, ' ');
  if (n.nodeType !== 1) return '';
  const e = n as Element;
  const attrs = [...e.attributes].map((a) => `${a.name}=${a.name === 'style' ? a.value.replace(/[\s;]/g, '') : a.value}`).sort().join(' ');
  return `<${e.tagName.toLowerCase()} ${attrs}>${[...e.childNodes].map(canon).join('')}</>`;
};
const tidy = (s: string) => s.replace(/> </g, '><').replace(/ +/g, ' ');
export const html = (h: string) => { const d = document.createElement('div'); d.innerHTML = h; return tidy(canon(d)); };
export const jsx = (b: unknown) => html(renderToStaticMarkup(b as ReactElement));
