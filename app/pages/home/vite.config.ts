// Dev config for pages/home — the user-facing timeline view fed by the LIVE
// campaign graph.
//
// `npm run home` -> vite serves this with the campaign-data plugin, which runs
// scripts/timeline-data.py under the hood and hot-reloads on entity edits.
// /session.html is the session runner (session/), fed by the session-data plugin.
// No build step: these pages are a local DM tool, served only by this dev server.

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { optimizeDeps, reactCompiler } from "../../react-compiler";
import { campaignData } from "./campaign-data-plugin";
import { sessionData } from "./session-data-plugin";

const here = dirname(fileURLToPath(import.meta.url)); // app/pages/home
const repoRoot = resolve(here, "..", "..", ".."); // up out of app/pages/home to the campaign repo root

export default defineConfig({
  root: here,
  plugins: [react(), reactCompiler(), campaignData(repoRoot), sessionData(repoRoot)],
  optimizeDeps,
  server: {
    open: true,
    // home imports charts from components/ and opens source .md via /@fs/ —
    // both live outside the page root, so allow the whole repo.
    fs: { allow: [repoRoot] },
  },
});
