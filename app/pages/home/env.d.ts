// Ambient type for the live-data virtual module supplied by campaign-data-plugin.
declare module 'virtual:campaign-data' {
  import type { TimelineData } from '../../components/charts/_common/types.js';
  const data: TimelineData | null;
  export default data;
}

// Ambient type for the session runner's data, supplied by session-data-plugin.
declare module 'virtual:session-data' {
  import type { SessionData } from './session/types.js';
  const data: SessionData | null;
  export default data;
}
