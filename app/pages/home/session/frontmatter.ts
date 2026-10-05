// Split an entity file into display fields + body (pure). YAML-ish, same tolerance
// as scripts/lib/common.py: `key: value` scalars and `  - item` lists, comments
// dropped. Bookkeeping keys the panel already shows (or never needs) are hidden.

export type Field = [key: string, value: string | string[]];

const HIDDEN = new Set(['name', 'type', 'subtype', 'exists', 'tags', 'aliases', 'description', 'campaign', 'importance', 'active']);

export function splitEntity(text: string): { fields: Field[]; body: string } {
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { fields: [], body: text };
  const fields: Field[] = [];
  let current: Field | null = null;
  for (const raw of m[1].split(/\r?\n/)) {
    if (/^\s*#/.test(raw) || !raw.trim()) continue;
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(raw);
    const item = /^\s+-\s+(.*)$/.exec(raw);
    if (kv) {
      const value = unquote(kv[2]);
      current = HIDDEN.has(kv[1]) ? null : [kv[1], value === '' ? [] : value];
      if (current) fields.push(current);
    } else if (item && current && Array.isArray(current[1])) {
      current[1].push(unquote(item[1]));
    }
  }
  return {
    fields: fields.filter(([, v]) => (Array.isArray(v) ? v.length > 0 : v !== '')),
    body: text.slice(m[0].length),
  };
}

function unquote(s: string): string {
  const t = s.trim();
  return /^".*"$/.test(t) ? t.slice(1, -1) : t;
}
