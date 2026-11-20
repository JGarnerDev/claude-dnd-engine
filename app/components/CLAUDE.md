# Frontend components — working rules

Auto-loaded when working under `app/components/`. These are the React components (charts, widgets) for the engine's local DM pages (`app/pages/home/`), served by the Vite dev server (`npm run home`). All JS/TS tooling (`components/`, `pages/`, `package.json`, the configs) lives under `app/`; run `npm` from there. The campaign content (`data/`, `historian/`, `scheduler/`, `meta/`, `maps/`) and the PowerShell engine scripts (`scripts/`) stay at the repo root, one level up. There is no build step: the pages run only under the dev server.

## TypeScript and React

Source is **TypeScript**, `strict` mode (`app/tsconfig.json`), with React 19 and the `react-jsx` transform. Run `npm run typecheck` (`tsc --noEmit`) — it must stay clean. Shared types live in one `types.ts` per component; importers use `import type { … }` (the config sets `verbatimModuleSyntax`). Import specifiers keep the `.js` extension (e.g. `import { x } from './layout.js'`) — the bundler resolves them to the `.ts`/`.tsx` files. Avoid `any`; in tests, type `querySelector` with its generic (`querySelector<HTMLInputElement>('…')`) and assert non-null (`!`) where the element is known to exist.

- **Components are `.tsx` function components**, named in PascalCase after what they draw (`Timeline.tsx`, `FilterBar.tsx`). Pure modules stay `.ts`, kebab-case.
- **Render with JSX, never with strings.** No `innerHTML`, no `dangerouslySetInnerHTML`, no `document.createElement`. Markdown goes through `MarkdownView` (`pages/home/session/MarkdownView.tsx`), not an HTML string.
- **Imperative DOM only inside hooks and effects**, and only where React has no prop for it: pointer pan, wheel zoom with `passive: false`, marker tooltips, document-level keys, `matchMedia`. These live in hooks and clean up after themselves; the chart ones (pan, zoom, wheel, tooltip, viewport size) come from `jeff-ui/charts`.
- **State:** React's own (`useState`, `useReducer`, props). When state gets more advanced (shared across distant components, derived, persisted), use Jotai atoms, per the hub's `PREFERENCES.md`. Context is fine for handing callbacks and settings down a subtree, not as a store; no other store library.
- **Keep the CSS classes and `localStorage` keys stable.** The stylesheets and saved user data depend on them.

## File splitting

Keep modules small and single-purpose. When a file starts doing several jobs, split it.

- **One concern per file.** Separate pure logic from rendering. Math/data-shaping modules must not import React or touch `document`; components import them.
- **Soft cap ~100 lines.** Past that, look for a seam to extract (a child component, a hook, a helper). It's a smell, not a hard rule — don't split mid-concern just to hit a number.
- **Shared constants live in one place** (e.g. `constants.ts`) so layout math and CSS stay in agreement.
- **Adjacent tests.** Every `x.ts` has a sibling `x.spec.ts`, every component `X.tsx` a sibling `X.spec.tsx`. Pure modules test under the default (node) env; component and hook specs start with `// @vitest-environment happy-dom`.

### Folder layout (charts)

Each chart is its own folder under `components/charts/`; its root component is named after the chart (`timeline/Timeline.tsx`, `swimlane/Swimlane.tsx`). A chart owns a `helpers/` of pure logic only that chart uses. Anything shared by more than one chart drops to `components/charts/_common/`.

- `<chart>/<Chart>.tsx` (+ spec) — the chart component; `<chart>/helpers/` — pure math used only by that chart (+ specs).
- `_common/*.tsx` — components shared by both charts: `FilterBar`, `SavedViews` (+ `SaveViewForm`, `SavedViewList`), `ChartSettings` (+ specs).
- `_common/helpers/` — pure logic shared by more than one chart (+ specs). `items.ts` turns indexed events into jeff-ui chart items, spans and breaks.
- `_common/components/` — the CSS for the shared widgets (`filterbar.css`, `savedviews.css`, `settingspanel.css`).
- `_common/constants.ts` (static data) and `_common/types.ts` (shared types).
- `app/pages/home/` (sibling of `app/components/` — not under `components/`) — the timeline home page (`main.tsx` → `TimelineView.tsx`) and the session runner (`session/`, `main.tsx` → `Runner.tsx`), fed by the live campaign graph through the data plugins. This is the Vite root (see `app/pages/home/vite.config.ts`) and what `npm run home` opens; it imports the charts via `../../components/charts/…`.

### Shared widgets: jeff-ui

Generic widgets come from `jeff-ui` (`Desktop/Organized/jeff-ui-project`): `SettingsPanel`, `Popover`, `Tabs`, `Chip`, `Button`, `IconButton`, `Badge`, `Card`, `Disclosure`, `EmptyState`, and the design tokens (`jeff-ui/tokens.css`). Reach for these before writing a `<button>`, `<details>`, tag `<span>` or empty-state message by hand; pass the engine class as `className` so the specs and CSS that query it keep working. The engine installs it from GitHub pinned to a tag (`github:JGarnerDev/jeff-ui-project#vX.Y.Z` in `app/package.json`), because the engine has collaborators. Collaborators need read access to that repo for `npm install` to work.

- **A widget belongs in jeff-ui** when it knows nothing about the campaign (no entities, no engine types) and another of Jeff's apps could use it as-is. Campaign-specific widgets stay here.
- **The charts themselves are in `jeff-ui/charts`:** `Timeline` and `Swimlane` draw items, spans, breaks and lanes on a time axis, with pan, zoom, density bars, label packing and the dots' look. The engine's charts are thin wrappers: they turn events into those shapes (`_common/helpers/items.ts`, `tracks.ts`), turn the calendars into a `TimeScale` (`timeScaleFor` in `axis.ts`) and wire the filter and saved views. Calendar, segments, rulers, ticks, session bands, the track tree, filters and viewpoints stay here.
- **jeff-ui stays generic:** no Jotai, no app imports; it takes state through props. Components with their own look take `unstyled` plus `classNames`/`className`, so the engine keeps its `chart-*` / `sr-*` classes.
- **Release loop:** change jeff-ui in its own repo, bump its `version`, prepend its `CHANGELOG.md` entry, commit and push; then tag (`git tag vX.Y.Z && git push --tags`) — confirm with Jeff before pushing a tag. Then bump the pin in `app/package.json`, run `npm install --allow-git=all` (npm 12 refuses git dependencies without it), and run the gates here. Never move or delete a pushed tag; fix forward with a new one.

### Styling (CSS)

CSS lives next to the component that produces the markup and is pulled in by a side-effect `import './x.css'` in that module — Vite serves it with the module (no `<link>` needed). Mirror the same file layout as the source:

- `<chart>/<chart>.css` — styles for that chart only (e.g. `swimlane/swimlane.css`), imported by `<chart>/<Chart>.tsx`. The drawn chart's own CSS ships with jeff-ui (`ui-chart-*`).
- `_common/common.css` — theme tokens (`:root --chart-*` / `--track-*`), their mapping onto jeff-ui's `--ui-chart-*` variables on `.chart-root`, and `.chart-empty`. Each chart imports it (Vite dedupes).
- `_common/components/<widget>.css` — styles for a shared widget, imported by its `.tsx` (e.g. `filterbar.css` by `FilterBar.tsx`).
- `pages/home/view.css` — styles for the page-level view switcher, imported by `TimelineView.tsx`. `pages/home/theme.css` maps the jeff-ui tokens onto the pages.

Classes are prefixed `chart-` (page-agnostic). Keep a rule with the element that owns it; lift a rule to `_common/` only when more than one chart needs it (the "shared when applicable" rule). When CSS geometry and layout math must agree, the constant lives in `_common/constants.ts` and the CSS comments point back to it. Per-element dynamic values go through inline custom properties (`style={{ '--from': … }}`), not string-built styles.

Don't let a chart's private helper be imported by another chart — if both need it, it belongs in `_common` (this is why `toneFor` and `lanesFor` live in `_common/helpers/tracks.ts`).

Example: `timeline/` (World view) and `swimlane/` (Tracks view) are each one wrapper file; both draw on `_common/helpers/{axis,calendar,ticks,items,tracks,bands,filters}`, `jeff-ui/charts`, and `_common/{FilterBar,ChartSettings}` over `_common/{constants,types}`; `pages/home/TimelineView.tsx` mounts either chart.

### Saved-views state contract

Both charts save/load named UI snapshots through one shared contract — don't re-derive it:

- The shape is `ChartState` (`query`/`tracks`/`zoomLevel`/`scrollLeft`) and `SavedView` (`name`/`tab`/`state`) in `_common/types.ts`.
- Both charts take `ChartProps` (`_common/ChartSettings.tsx`). Each chart **emits** its state through its `ref` (`ChartHandle.getState(): ChartState`) and **accepts** it as `initialState`, read once at mount. The host re-keys the chart to apply a loaded view — never mutate a live chart. `FilterBar`'s `initial` prop (`{ query, tracks }`) seeds the search box + chips.
- Fail-soft apply rules (clamp zoom to the current `maxZoom`, intersect saved tracks with present ones) are pure helpers in `_common/helpers/viewstate.ts`. Persistence (`localStorage` key `campaign:saved-views:v1`, fail-soft CRUD) is in `_common/helpers/viewstore.ts`.
- The Save/Load widget (`_common/SavedViews.tsx`) sits in the header actions **before** the settings gear (order: Save · Load · Settings); `pages/home/TimelineView.tsx` wires its `getCurrent`/`apply` callbacks to the active chart's ref and a re-keyed remount. Each chart portals its settings into the header's slot through `ChartSettings`.

## Testing

- Vitest (runs `.ts`/`.tsx` directly). `npm test` runs all; `npm run test:watch` for the loop. `npm run typecheck` is separate — run both.
- Components and hooks are tested with **React Testing Library** (`render`, `cleanup`; `afterEach(cleanup)` in each spec). Query the rendered DOM by the same classes the CSS uses; drive input with `fireEvent` or `act`.
- Build first, test after we agree the piece is right (no TDD).
- DOM env is **happy-dom** (jsdom pulls a broken transitive dep on the dev node version).

## No build step

The pages run only under the dev server (`npm run home`); nothing is built or shipped. The charts read the campaign data through the Vite data plugins (`campaign-data-plugin.ts`, `session-data-plugin.ts`), which run the Python extractors and cache the result until a watched campaign file changes. The old self-contained HTML build was removed in 0.74.0.
