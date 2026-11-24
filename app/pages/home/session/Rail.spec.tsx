// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Rail } from "./Rail.js";
import { fixture } from "./fixture-data.js";

afterEach(cleanup);

describe("Rail", () => {
  it("groups chips by scene, adds loose nodes last, and marks current and visited", async () => {
    const d = fixture();
    const onJump = vi.fn();
    const rail = render(
      <Rail
        nodes={d.nodes}
        scenes={d.scenes}
        current="S1_REST"
        visited={new Set(["S1_OPEN", "S1_REST"])}
        onJump={onJump}
      />,
    ).container;
    const labels = [...rail.querySelectorAll(".sr-rail-label")].map((l) => l.textContent);
    expect(labels).toEqual(["1", "1b", "2", "3", "Asides"]);
    expect(rail.querySelector(".ui-waypoint-current")!.getAttribute("data-id")).toBe("S1_REST");
    expect(rail.querySelectorAll(".ui-waypoint-visited")).toHaveLength(2);
    expect(rail.querySelector(".ui-waypoint-current")!.textContent).toBe("2"); // step number, not the id
    await userEvent.click(rail.querySelector<HTMLButtonElement>('[data-id="S1_FIGHT"]')!);
    expect(onJump).toHaveBeenCalledWith("S1_FIGHT");
  });
});
