// Entry for pages/home/player.html: the player guide page over
// meta/player-guides/*.md (virtual:player-guides, from player-guide-plugin).

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "jeff-ui/tokens.css";
import "jeff-ui/base.css";
import { PlayerGuide } from "./PlayerGuide.js";
import files from "virtual:player-guides";

const root = document.getElementById("app");
if (root)
  createRoot(root).render(
    <StrictMode>
      <PlayerGuide files={files} />
    </StrictMode>,
  );
