// Entry for pages/home/session.html: the session runner over the next planned
// session (virtual:session-data, backed by scripts/session-cards.py). Runner shows
// its own empty page when there is no session folder with a flow chart yet.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "jeff-ui/tokens.css";
import "jeff-ui/base.css";
import "../theme.css";
import { Runner } from "./Runner.js";
import data from "virtual:session-data";

const root = document.getElementById("app");
if (root)
  createRoot(root).render(
    <StrictMode>
      <Runner data={data} />
    </StrictMode>,
  );
