// Runs before every spec file (vitest.config.js -> setupFiles).
//
// - Unmount whatever a React spec rendered, so each test starts from an empty
//   document. Vitest doesn't expose globals here, so RTL's auto-cleanup is off.
// - Stub fetch: opening an entity calls fetch('/__entity?…'), a dev-server-only
//   endpoint. Without the stub every such spec logs ECONNREFUSED :3000.
//   A spec that cares about fetch stubs it again itself.

import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 404 })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
