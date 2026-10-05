// Vite plugin: feed the session runner (session.html) the next planned session.
//
// It runs scripts/session-cards.py (flow chart + written plan + entity index as
// one JSON blob) and exposes the result as the virtual module
// `virtual:session-data`. $SESSION picks a session folder or number; unset, the
// script picks the earliest planned session that has a _flow.md.
//
// Entity bodies are not in the blob — the side panel fetches one on demand from
// `/__entity?path=<repo-relative .md>`, which serves only .md files under the
// entity layers. Editing any .md under those layers re-extracts and reloads.

import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import type { Plugin } from 'vite';
import { runPython } from './run-python.js';

const VIRTUAL_ID = 'virtual:session-data';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const ENTITY_DIRS = ['data', 'historian', 'scheduler'];

function extract(repoRoot: string): string {
  const args = ['--root', repoRoot];
  if (process.env.SESSION) args.push('--session', process.env.SESSION);
  return runPython(repoRoot, 'session-cards.py', args, 'session-data') ?? 'null';
}

export function sessionData(repoRoot: string): Plugin {
  let cached: string | null = null;
  const roots = ENTITY_DIRS.map((d) => resolve(repoRoot, d));

  return {
    name: 'session-data',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id !== RESOLVED_ID) return;
      if (cached === null) cached = extract(repoRoot);
      return `export default ${cached};`;
    },

    configureServer(server) {
      server.middlewares.use('/__entity', (req, res) => {
        const rel = new URL(req.url ?? '', 'http://local').searchParams.get('path') ?? '';
        const abs = resolve(repoRoot, rel);
        if (!abs.endsWith('.md') || !roots.some((r) => abs.startsWith(r + sep))) {
          res.statusCode = 403;
          res.end();
          return;
        }
        readFile(abs, 'utf8').then(
          (text) => {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(text);
          },
          () => {
            res.statusCode = 404;
            res.end();
          },
        );
      });

      // Re-extract on any entity edit, and when the extractor itself changes.
      const script = resolve(repoRoot, 'scripts', 'session-cards.py');
      server.watcher.add([...roots, script]);
      const onChange = (file: string) => {
        const isEntity = file.endsWith('.md') && roots.some((r) => file.startsWith(r));
        if (!isEntity && resolve(file) !== script) return;
        cached = null;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('change', onChange);
      server.watcher.on('add', onChange);
      server.watcher.on('unlink', onChange);
    },
  };
}
