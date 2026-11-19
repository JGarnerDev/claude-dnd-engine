# Migrate the Engine App (`app/`) to React — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Tick boxes as you go and keep the **Status** line current, so a fresh session can pick up where the last one stopped. Run `npm` from `app/`.

**Status:** Task 0 done (2026-11-18), except Jeff's collaborator-access step; jeff-ui `v0.1.0` (Tabs) released. Next: Task 1.

**Goal:** Rewrite the two pages in `app/pages/home/`, the timeline home page (`index.html`) and the session runner (`session.html`), plus the chart components in `app/components/charts/`, in React 19. Nothing the DM sees should change. The pure logic modules and their tests stay as they are.

**Why:** Jeff is building a shared React component library, `jeff-ui` (`../jeff-ui-project`, private repo `JGarnerDev/jeff-ui-project`), used by `gym` and `music-generator`. Today the engine's UI is plain TypeScript that builds HTML strings and wires up DOM by hand, so it can't share components with those apps. React also replaces the hand-written re-render and event-delegation code in `runner.ts`, `panel.ts` and `view.ts`.

**Architecture:** The pages switch from "build an HTML string and attach listeners to it" to React components. The work goes **one page at a time, from the leaf components up**, and the app keeps working after every task:

1. A page gets a React root first. Charts that haven't been ported yet run inside a small adapter component (`LegacyMount`) that calls the old `renderX(container, …)` in a `useEffect` and clears the container on cleanup.
2. String builders (`scene.ts`, `rail.ts`, `stats.ts`, …) become `.tsx` components one at a time. Each one's pure logic moves into a sibling `.ts` file, or stays where it is if it's already pure.
3. Pan, zoom and scroll stay imperative. They become hooks that attach native listeners to a ref, because putting every wheel or scroll event through React state would make the charts lag.

**Tech stack:** React 19, Vite 8, TypeScript 7, Vitest 4, happy-dom, `@vitejs/plugin-react`, `@testing-library/react` and `@testing-library/user-event`. These were upgraded on 2026-11-18 in commit `408d8a4`. React, React DOM and `jeff-ui` become runtime dependencies of `app/`. Everything else is a dev dependency.

## Decisions (settled by Jeff, 2026-11-18)

- **D1. Remove the HTML-shell route.** On master it was already dead: `app/pages/demo/` doesn't exist, so `npm run build:timeline` fails, and `scripts/timeline-data.py` writes a shell that was never built. Task 1 removes it (the singlefile build, the `TL_DATA` sentinel, the shell output in `timeline-data.py`, and `vite-plugin-singlefile`). The charts are served only by the dev server (`npm run home`). This resolves todo-dashboard item 55, and branch `timeline-subday-binding` (item 54) can then be deleted.
- **D2. The engine depends on `jeff-ui` now.** General-purpose widgets (Popover, SettingsPanel, Tabs, Chip, …) are built in `jeff-ui-project` during this migration, not inside the engine. The engine installs it from GitHub, pinned to a tag: `"jeff-ui": "github:JGarnerDev/jeff-ui-project#vX.Y.Z"`. Accepted cost: jeff-ui is a private repo, so **every collaborator who runs `npm install` in `app/` needs read access to `JGarnerDev/jeff-ui-project`**. Jeff grants that access (Task 0); Claude does not.
- **D3. Session runner fallback.** The old runner stays reachable at `session-legacy.html` until one real session has been played on the React runner, then it is deleted.

## Global constraints

- **No visible change.** Same DOM class names where the CSS depends on them, same keyboard shortcuts, same `localStorage` keys (`session-runner:<folder>:v1`, `campaign:saved-views:v1`), same visuals. Keep the existing `.css` files and import them from the `.tsx` files that replace their `.ts` versions.
- **Pure modules don't change.** Everything that doesn't touch the DOM stays as it is, along with its specs: `components/charts/*/helpers/*`, `_common/helpers/*`, `_common/constants.ts`, `_common/types.ts`, and in `pages/home/session/`: `store.ts`, `hp-log.ts`, `flow.ts`, `frontmatter.ts`, `entities.ts`, `cues.ts`, `sky-geometry.ts`, `sky-words.ts`, `provenance.ts`, `types.ts`. If a port needs a change to one of these, stop and flag it.
- **The data plugins don't change.** `campaign-data-plugin.ts`, `session-data-plugin.ts`, `run-python.ts` and the `virtual:*` modules feed React exactly as they feed today's code.
- **Follow `app/components/CLAUDE.md`.** One concern per file, a soft cap of about 100 lines, specs next to the code, pure logic kept separate from rendering, and imports with `.js` extensions (`.tsx` files are imported as `.js` too). Update that file in Task 6 to describe React (`.tsx` files, hooks folder, testing).
- **Build first, test after we agree the piece is right** (rule from `app/components/CLAUDE.md`). Each DOM spec is rewritten once its component is accepted, not before.
- **Every task must end green:** `npm run typecheck`, `npm test`, and a manual check in the browser (`npm run home`, then open `/` and `/session.html`).
- **Git (root `CLAUDE.md` → Working Rules).** Jeff commits straight to `master`, with no feature branches. Commit once per task, only after Jeff says go in that turn, and show what the commit will include. Because each task ends green, master always works and the table can run off it.
- **Versioning:** follow `meta/versioning.md` and add a `CHANGELOG.md` entry per commit group. Removing the shell route in D1 changes script output, so check whether it counts as a breaking change. Porting with no visible change is a PATCH. Mention new behavior only if any was added.
- **jeff-ui rules apply to anything built there** (`jeff-ui-project/CLAUDE.md`): only `--ui-*` tokens, one component per folder, no imports from the engine, nothing engine-specific (no campaign types, no `chart-` classes). Code there must also pass the engine's stricter tsconfig (`noUnusedLocals`, `noUnusedParameters`), because the engine typechecks jeff-ui's source.
- **jeff-ui release loop.** Build and check a widget in jeff-ui first (its demo page, `npm run typecheck`, `npm test`). To try it inside the engine before releasing, run `npm install ../../jeff-ui-project --no-save` from `app/`. That links the local folder without editing `package.json`. To release: commit and push jeff-ui, tag it (`git tag vX.Y.Z && git push --tags`), then point the engine's dependency at the new tag and run `npm install`. The engine never commits a `file:` link.
- **Template:** don't touch `claude-dnd-engine-template` here. It follows through the usual sync process (`.claude/commands/sync.md`) once the engine work has merged.
- **State:** keep to React's own state (`useState`, `useReducer`, props). If state gets more advanced (shared across distant components, derived, persisted), use Jotai atoms, per `PREFERENCES.md` → React state. Adding `jotai` to `app/` is fine then; jeff-ui stays free of it.
- **Test noise:** opening an entity calls `fetch('/__entity?…')`, a dev-server-only endpoint. Stub `fetch` in tests (`vi.stubGlobal`) so `ECONNREFUSED :3000` stops showing up in test output.

## Inventory (as of 2026-11-18)

About 15k lines across 54 spec files, 27 of which need a DOM (happy-dom).

**Files that build DOM, which need porting:**

- **Shared widgets:** `_common/components/{popovers,settingspanel,savedviews,filterbar,controls}.ts`. `controls.ts` is pan, wheel zoom and marker interaction, which become hooks.
- **Charts:** `timeline/timeline.ts` (573 lines), `swimlane/swimlane.ts` (657). The largest files; they return an api (`controls`, `getState`) to the host.
- **Timeline page:** `pages/home/{view,campaign-select,main}.ts`. `view.ts` switches between the two chart views and owns the settings and saved views.
- **Session runner:** `pages/home/session/{runner,scene,panel,rail,slides,main}.ts`. `runner.ts` handles events for the whole page and keyboard shortcuts.
- **Session string builders:** `achievements, combatants, dice, entity-view, markdown, mysteries, peeks, prompt-book, recap, refs, reputation, scene-head, scene-header, sky, sky-plate, stats, steps`. Most are leaf components; `markdown.ts` produces `<a class="sr-wiki" data-entity>` links that the runner handles by event delegation.

## File structure (target)

- `jeff-ui-project/src/components/<Name>/<Name>.tsx` (+ `.css`, `.spec.tsx`): general-purpose widgets (Popover, SettingsPanel, Tabs, Chip). Exported from jeff-ui's `src/index.ts` and shown on its demo page.
- `app/pages/home/theme.css`: the engine's dark slate palette mapped onto jeff-ui's `--ui-*` tokens (`--chart-bg` → `--ui-bg`, and so on). Imported after `jeff-ui/tokens.css` in both page entries.
- `app/components/charts/_common/hooks/{usePan,useWheelZoom,useMarkerInteraction}.ts`: replace `controls.ts`.
- `app/components/charts/{timeline,swimlane}/{Timeline,Swimlane}.tsx`: new chart components. Their `helpers/` folders don't change.
- `app/pages/home/{TimelineView,CampaignSelect}.tsx`, `main.tsx`.
- `app/pages/home/session/*.tsx`: one component per old string builder. `useRunner.ts` holds the reducer and persistence (built on `store.ts`), and `useKeys.ts` holds the keyboard shortcuts.
- Delete each old `.ts` DOM file, and its spec, in the same task as its replacement.

---

## Group A: Setup (commit group 1)

### Task 0: React tooling

- [x] `npm i react react-dom` and `npm i -D @vitejs/plugin-react @types/react @types/react-dom @testing-library/react @testing-library/dom @testing-library/user-event`.
- [x] `tsconfig.json`: add `"jsx": "react-jsx"`. `include` already covers `pages` and `components`.
- [x] Add `react()` to `pages/home/vite.config.ts`. (`vite.config.js` is deleted in Task 1.)
- [x] Vitest setup file: run `cleanup()` after each test and stub `fetch`. Add a `**/*.spec.tsx` include. Keep `pool: 'forks'` and `fileParallelism: false`.
- [ ] **Jeff:** give every collaborator who runs the app read access to `JGarnerDev/jeff-ui-project`.
- [x] **jeff-ui smoke release:** add a trivial exported component to jeff-ui (it can be the first real one, Tabs), commit, push, and tag `v0.1.0`.
- [x] `npm i github:JGarnerDev/jeff-ui-project#v0.1.0`. Vitest config: add `server.deps.inline: ['jeff-ui']` under `test`. npm 12 refuses git dependencies by default, so `app/.npmrc` sets `allow-git=root` (only git deps named in `app/package.json`).
- [x] Add `pages/home/theme.css` with the engine palette mapped onto `--ui-*`. It also sets `color-scheme: normal`, undoing jeff-ui's `dark`, which the engine never had.
- [x] Smoke check: render the jeff-ui component in a throwaway `.spec.tsx` and in the dev server, and confirm typecheck, `npm test` and `npm run home` all accept jeff-ui's TypeScript source. Delete the throwaway spec.
- [x] Check: typecheck clean, all 54 spec files still pass, and `npm run home` serves both pages unchanged.

### Task 1: Remove the shell route (D1)

- [ ] Delete `app/vite.config.js`, the `build:timeline` script, `vite-plugin-singlefile`, and the sentinel declarations in `app/globals.d.ts`.
- [ ] `scripts/timeline-data.py`: remove the shell and HTML output (`--shell`, the `TL_DATA` swap, writing `historian/timeline/timeline.html`) and keep only the JSON path used by `campaign-data-plugin.ts`. Update its pytest tests if there are any.
- [ ] Update the docs that mention it: `app/components/CLAUDE.md` (the "Output stays self-contained" section and the `pages/demo` lines), `.claude/commands/timeline.md`, and the root `CLAUDE.md` if it refers to it.
- [ ] Update `todo-dashboard.md`: close item 55, and unblock deleting `timeline-subday-binding` in item 54.
- [ ] Bump the version and add a changelog entry. Commit.

## Group B: Timeline page (commit group 2)

Do this page first. It isn't used live at the table, so it's the safer place to settle on patterns before touching the runner.

### Task 2: Shared widgets to React

- [ ] **In jeff-ui:** `Popover`, `SettingsPanel` (gear button plus overlay with sections), `Tabs` (the World and Campaign tabs; use music-generator's `Tabs.tsx` API as the model: `label`, `items`, `selected`, `onPick`), and `Chip` if the filter bar needs it. Build each through the jeff-ui release loop, release a new tag, and bump the engine's dependency.
- [ ] **In the engine**, built from those widgets: `charts/_common/FilterBar.tsx`, `SavedViews.tsx` (still using `viewstore.ts` and `viewstate.ts`), `pages/home/CampaignSelect.tsx`.
- [ ] Hooks `usePan`, `useWheelZoom`, `useMarkerInteraction`, ported from `controls.ts` with the same behavior. Attach native listeners in `useEffect`, using `{ passive: false }` for wheel events.
- [ ] Rewrite the specs for each widget and hook once Jeff accepts it.

### Task 3: TimelineView shell

- [ ] `TimelineView.tsx` replaces `view.ts`. It holds the active tab, campaign scope and saved views in React state, plus the empty state. Wrap the not-yet-ported `renderTimeline` and `renderSwimlane` in `LegacyMount`. Charts still rebuild when the tab changes, and a loaded view still applies as `initialState`, as the saved-views rules require.
- [ ] Settings sections: the legacy charts return `controls` as DOM nodes. Until Task 4, `SettingsPanel` accepts a `ReactNode | HTMLElement` section; that branch gets removed when the port is done.
- [ ] `main.tsx` replaces `main.ts`. Update the script tag in `index.html`.

### Task 4: Port the charts

- [ ] `Swimlane.tsx` (start with the smaller layout). Render from `swimlane-layout.ts` and `tracks.ts` output. Expanding and collapsing the track tree becomes state. The synced scroll (`swim.addEventListener('scroll')`) moves into a hook.
- [ ] `Timeline.tsx`: render from `computeLayoutFrom` and `layoutLabels`. Zoom becomes state. Pan writes `scrollLeft` straight to the ref, not through state. `getState()` becomes an `onStateChange` callback or a `useImperativeHandle` ref, and `TimelineView` uses it for saving views.
- [ ] Remove `LegacyMount` from the timeline page, and the `HTMLElement` branch from `SettingsPanel`.
- [ ] Rewrite `timeline.spec.ts` and `swimlane.spec.ts` as `.spec.tsx` covering the same behaviors (marker count, track tree toggle, zoom clamp, restoring saved state).
- [ ] Bump the version and add a changelog entry. Commit.

## Group C: Session runner (commit group 3)

### Task 5: Runner to React

Work from the leaf components up. The old runner keeps working until the last step.

- [ ] Leaf components, one at a time, each replacing its string builder with a `.tsx` of the same name: `Dice`, `Stats`, `Reputation`, `Achievements`, `Mysteries`, `Combatants`, `Recap`, `PromptBook`, `SkyPlate`/`Sky` (SVG), `SceneHead`/`SceneHeader`, `Steps`, `Refs`, `Peeks`, `EntityView`.
- [ ] `markdown.ts`: move the parsing into a pure `parseMarkdown()` that returns tokens, and add a `<Markdown>` component that renders them. Wiki links become `<WikiLink entity=…>`, which calls `onOpenEntity`, replacing the runner's event delegation. Keep `escapeHtml` for anything that still builds strings during the transition. No `dangerouslySetInnerHTML` once this task is done.
- [ ] `useRunner.ts`: a reducer over `RunnerState` (history, tokensOpen, hp, hpLog, rounds), saved through `loadState`/`saveState` from the unchanged `store.ts`. Undo for the HP log stays as it is.
- [ ] `useKeys.ts`: keyboard shortcuts for the whole page (arrows, digit keys for options, Esc) with the same priority order as `runner.ts`, including the slides overlay taking over keys while it's open.
- [ ] `Scene.tsx`, `Rail.tsx`, `Panel.tsx` (entity, beat and scene views, plus the history the panel steps back through), `Slides.tsx` (rendered into `document.body` with `createPortal`), `Runner.tsx`, `main.tsx`.
- [ ] D3: copy the old entry to `session-legacy.html` plus `session/legacy-main.ts` before deleting any old files the legacy runner still needs. Simplest approach: keep the old `.ts` files under `session/legacy/` until the cutover, then delete them.
- [ ] Rewrite the runner specs (`runner`, `scene`, `panel`, `rail`, `slides` and the leaf specs) as `.spec.tsx` with Testing Library and user-event, covering the same scenarios (walking branches by click and key, stepping back, saving the path, opening slides and returning with Esc, wiki links opening the panel).
- [ ] Jeff runs one real session on the React runner. Then delete `session-legacy.html` and `session/legacy/`.
- [ ] Bump the version and add a changelog entry. Commit.

## Group D: Cleanup (commit group 4)

### Task 6: Docs and leftovers

- [ ] Search for leftover old-style DOM code: `grep -rE "innerHTML|createElement|addEventListener" app/components app/pages` should only find the imperative hooks.
- [ ] Rewrite `app/components/CLAUDE.md` for React: `.tsx` components, a `hooks/` folder, when a widget belongs in jeff-ui and the release loop, Testing Library, and the "Output stays self-contained" section replaced per D1.
- [ ] Root `README.md`: note that `npm install` in `app/` needs read access to `JGarnerDev/jeff-ui-project`.
- [ ] Check whether `.claude/commands/*.md` mention any file that changed (`view.ts`, `runner.ts`, `steps.ts`, `refs.ts`, …). The v0.72.0 changelog cites `steps.ts` and `refs.ts`, for example.
- [ ] Bump the version and add a changelog entry. Commit.

## Group E: After the migration (separate work)

- [ ] **Template sync:** bring `app/` changes into `claude-dnd-engine-template` with `/sync`. The template still has `pages/demo/` and the shell route, so apply D1 there too.
- [ ] **jeff-ui adoption elsewhere:** switch gym and music-generator over to the widgets the engine added to jeff-ui (jeff-ui `TODO.md` Phase 3).
- [ ] **Template and jeff-ui:** the template sync carries the jeff-ui dependency, so template users would need repo access too. Decide during the sync whether to give access or have the template keep its own copies.

## Risks

- **Chart performance.** Rendering hundreds of markers on every zoom step could stutter. Mitigation: memoize layouts with `useMemo` keyed on data, filter and zoom, keep scroll and pan in refs, and compare against the old chart on the real campaign graph before committing group 2.
- **Runner regressions at the table.** Mitigated by D3, the legacy fallback.
- **Spec rewrites hide behavior changes.** Port each old test scenario one-for-one before adding new ones, and list the old→new spec mapping in each commit message.
- **Collaborator setup.** New runtime dependencies (React, and jeff-ui from a private GitHub repo) mean collaborators must run `npm install` again, and it fails for anyone without read access to `JGarnerDev/jeff-ui-project`. Say so in the changelog entry, and make sure access is granted before that commit lands.
- **jeff-ui ships as TypeScript source.** Vite compiles it, but Vitest loads `node_modules` with plain Node, which can't run `.tsx`. Task 0 fixes this with `test.server.deps.inline: ['jeff-ui']` and checks it with a smoke component before any real widget is built.
