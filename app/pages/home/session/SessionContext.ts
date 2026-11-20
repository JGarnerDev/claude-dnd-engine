// What every component deep in the runner needs without threading it through props:
// which entity names resolve (a link to a missing one is flagged), and how to open
// one in the side panel. Runner.tsx provides it; tests can wrap a component in it.

import { createContext, useContext } from "react";
import type { Known } from "./markdown.js";

export interface SessionCtx {
  known: Known;
  openEntity: (name: string) => void;
}

export const SessionContext = createContext<SessionCtx>({
  known: () => true,
  openEntity: () => {},
});

export const useSession = (): SessionCtx => useContext(SessionContext);
