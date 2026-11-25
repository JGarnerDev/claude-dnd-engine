// Vite plugin: feed the player guide page (player.html) every guide in
// meta/player-guides/*.md (files starting with `_` are templates and skipped).
//
// Each guide comes with the PC file's current `level`, read from
// historian/characters/pcs/<pc>.md, and the completed sessions whose `pcs_present`
// lists the PC (historian/sessions/), so the page can warn when the guide lags either.
// Exposed as the virtual module `virtual:player-guides`; editing a guide or a PC
// file reloads the page.

import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { frontmatterList, frontmatterValue, type GuideFile } from "./player/guide-file.js";

const VIRTUAL_ID = "virtual:player-guides";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

function readText(path: string): string | null {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

function pcLevel(pcsDir: string, pc: string): number | null {
  const text = readText(resolve(pcsDir, `${pc}.md`));
  const raw = text === null ? null : frontmatterValue(text, "level");
  return raw !== null && /^\d+$/.test(raw) ? Number(raw) : null;
}

interface PlayedSession {
  number: number;
  pcs: string[];
}

/** A session record's path: `Session NN Name.md`, flat or in its own `Session NN Name/` folder. */
function sessionFiles(sessionsDir: string): string[] {
  let entries;
  try {
    entries = readdirSync(sessionsDir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.name.startsWith("Session "))
    .map((e) =>
      e.isDirectory() ? resolve(sessionsDir, e.name, `${e.name}.md`) : resolve(sessionsDir, e.name),
    )
    .filter((p) => p.endsWith(".md"));
}

export function playedSessions(sessionsDir: string): PlayedSession[] {
  return sessionFiles(sessionsDir).flatMap((path) => {
    const text = readText(path);
    if (text === null || frontmatterValue(text, "state") !== "completed") return [];
    const raw = frontmatterValue(text, "session_number");
    if (raw === null || !/^\d+$/.test(raw)) return [];
    return [{ number: Number(raw), pcs: frontmatterList(text, "pcs_present") }];
  });
}

function sessionsWith(sessions: readonly PlayedSession[], pc: string): number[] {
  return sessions
    .filter((s) => s.pcs.includes(pc))
    .map((s) => s.number)
    .sort((a, b) => a - b);
}

export function loadGuides(repoRoot: string): GuideFile[] {
  const guidesDir = resolve(repoRoot, "meta", "player-guides");
  const pcsDir = resolve(repoRoot, "historian", "characters", "pcs");
  const sessions = playedSessions(resolve(repoRoot, "historian", "sessions"));
  let names: string[];
  try {
    names = readdirSync(guidesDir).filter((n) => n.endsWith(".md") && !n.startsWith("_"));
  } catch {
    return [];
  }
  return names.sort().map((file) => {
    const text = readText(resolve(guidesDir, file)) ?? "";
    const pc = frontmatterValue(text, "pc") ?? file.replace(/\.md$/, "");
    return { file, text, pcLevel: pcLevel(pcsDir, pc), sessionsPlayed: sessionsWith(sessions, pc) };
  });
}

export function playerGuides(repoRoot: string): Plugin {
  const watched = [
    resolve(repoRoot, "meta", "player-guides"),
    resolve(repoRoot, "historian", "characters", "pcs"),
    resolve(repoRoot, "historian", "sessions"),
  ];
  return {
    name: "player-guides",

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id !== RESOLVED_ID) return;
      return `export default ${JSON.stringify(loadGuides(repoRoot))};`;
    },

    configureServer(server) {
      server.watcher.add(watched);
      const onChange = (file: string) => {
        if (!file.endsWith(".md") || !watched.some((d) => resolve(file).startsWith(d))) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("change", onChange);
      server.watcher.on("add", onChange);
      server.watcher.on("unlink", onChange);
    },
  };
}
