// Run one of the repo's Python extractors (scripts/*.py) and return its stdout.
// Shared by the dev-server data plugins (campaign-data, session-data).
//
// Interpreter candidates, in order: $PYTHON overrides; else `uv run` (the
// project standard — it picks the pinned Python from pyproject.toml), then
// `python3` (the norm on macOS/Linux) and `python` (Windows / venvs). Any
// failure moves on to the next candidate: on Windows `python3` is often the
// Microsoft Store stub, which exits non-zero rather than ENOENT, and a bare
// `python` can be some other program's bundled interpreter. Returns null when
// every candidate fails (after logging the last error) so the page renders its
// empty state rather than crashing the dev server.

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

type Candidate = [exe: string, prefix: string[]];

const CANDIDATES: Candidate[] = [
  ...(process.env.PYTHON ? [[process.env.PYTHON, []] as Candidate] : []),
  ['uv', ['run', '--quiet']],
  ['python3', []],
  ['python', []],
];

export function runPython(repoRoot: string, script: string, args: string[], tag: string): string | null {
  const path = resolve(repoRoot, 'scripts', script);
  let lastErr = '';
  for (const [exe, prefix] of CANDIDATES) {
    try {
      const out = execFileSync(exe, [...prefix, path, ...args], {
        cwd: repoRoot,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      return out.trim() || null;
    } catch (err) {
      lastErr = `${exe}: ${err instanceof Error ? err.message : String(err)}`;
    }
  }
  console.error(`[${tag}] ${script} failed with every interpreter:\n${lastErr}`);
  return null;
}
