// What both charts share with their host. A chart owns its controls' state, but
// the gear that shows them lives in the host's header, so the chart portals its
// own SettingsPanel into a slot element the host hands down. The host reads the
// chart's restorable state (for saved views) through the ref.

import type { Ref } from "react";
import { createPortal } from "react-dom";
import { SettingsPanel, type SettingsSection } from "jeff-ui";
import "./components/settingspanel.css";
import type { ChartState, TimelineData } from "./types.js";

export interface ChartHandle {
  getState(): ChartState;
}

export interface ChartProps {
  data: TimelineData;
  initialState?: ChartState; // a loaded view; read once, at mount
  settingsSlot: HTMLElement | null;
  className?: string; // added to the chart's root (.chart-root)
  ref?: Ref<ChartHandle>;
}

const classNames = {
  button: "chart-settings-btn",
  panel: "chart-settings-panel",
  group: "chart-settings-group",
  groupLabel: "chart-settings-grouplabel",
};

export function ChartSettings({
  slot,
  sections,
}: {
  slot: HTMLElement | null;
  sections: SettingsSection[];
}) {
  if (!slot) return null;
  return createPortal(<SettingsPanel sections={sections} classNames={classNames} unstyled />, slot);
}
