// What the fight has made true (fight-cues.ts), for the Watch blocks and `When:`
// pills deep in a scene page to light themselves. Scene.tsx provides it; outside a
// scene nothing lights.

import { createContext, useContext } from 'react';
import type { Lit } from './fight-cues.js';

export const FightContext = createContext<Lit | null>(null);

export const useFightLit = (): Lit | null => useContext(FightContext);
