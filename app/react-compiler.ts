// React Compiler for the engine's pages and their tests (pages/home/vite.config.ts
// and vitest.config.js). It does the memoizing, so components carry no useMemo,
// useCallback or memo of their own.
//
// Two things differ from the plain preset:
// - It runs in Vitest too. The preset skips non-browser environments, and the
//   specs should run the code the pages run.
// - It compiles jeff-ui. jeff-ui ships TypeScript source and is installed from
//   GitHub into node_modules, which three things skip by default: Babel's
//   filter, the compiler's own `sources` check, and Vite's dependency
//   pre-bundling (see optimizeDeps).

import { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

const NODE_MODULES = /[\\/]node_modules[\\/]/;
const JEFF_UI = /[\\/]node_modules[\\/]jeff-ui[\\/]/;

export function reactCompiler() {
  const preset = reactCompilerPreset({
    sources: (file) => !NODE_MODULES.test(file) || JEFF_UI.test(file),
  });
  preset.rolldown.applyToEnvironmentHook = undefined;
  return babel({ presets: [preset], exclude: /\/node_modules\/(?!jeff-ui\/)/ });
}

/** For the dev server: serve jeff-ui through the plugins rather than pre-bundled. */
export const optimizeDeps = { exclude: ["jeff-ui"] };
