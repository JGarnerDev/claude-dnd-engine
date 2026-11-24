import { describe, expect, it } from "vitest";
import { sessionTitle } from "./session-title.js";

describe("sessionTitle", () => {
  it("puts a separator between the number and the title", () => {
    expect(sessionTitle("Session 35 The Reeve's Ledger")).toBe("Session 35 · The Reeve's Ledger");
  });
  it("leaves other names alone", () => {
    expect(sessionTitle("Session 35")).toBe("Session 35");
    expect(sessionTitle("One-shot: The Bell")).toBe("One-shot: The Bell");
  });
});
