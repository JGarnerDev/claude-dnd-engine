import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.spec.ts", "**/*.spec.tsx"],
    exclude: ["**/node_modules/**"],
    setupFiles: ["./vitest.setup.ts"],
    // jeff-ui ships TypeScript source (.tsx + .css imports), so Vitest must
    // transform it instead of handing it to Node as an external package.
    server: { deps: { inline: ["jeff-ui"] } },
    // node 18.15 + Windows: the default threads pool crashes ("No test suite
    // found") with multiple files / mixed environments. Use forked child
    // processes, one at a time. Revisit once dev node moves to >= 18.18 / 20.
    // One forked child process PER FILE, run serially. singleFork:true (all
    // files in one process) clashes when files use different environments
    // (happy-dom vs node) and reports "no tests".
    pool: "forks",
    fileParallelism: false,
  },
});
