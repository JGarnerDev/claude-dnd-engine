// Entry for pages/home: the World | Campaign view switcher over the live
// campaign graph (virtual:campaign-data, backed by the Python extractor).
// TimelineView shows its own empty state when the graph has no dated beats yet:
// a fresh template, not an error.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "jeff-ui/tokens.css";
import "./theme.css";
import { TimelineView } from "./TimelineView.js";
import data from "virtual:campaign-data";

const root = document.getElementById("app");
if (root)
  createRoot(root).render(
    <StrictMode>
      <TimelineView data={data} />
    </StrictMode>,
  );
