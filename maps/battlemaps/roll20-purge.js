// Roll20 upload purge: bulk-deletes uploaded assets to free storage quota (free tier is 100 MB).
// Usage: paste into the DevTools console on app.roll20.net/editor, then r20peek() and r20purge().
// r20stop() halts between batches. Deletion is permanent and removes the image from every game.
//
// Internal endpoints (found via the Network tab, 2026-10-12; may change without notice):
//   GET  /image_library/fetchorphanassets/false/<page>  -> [{id, name, file_size, image_url, ...}]
//   POST /image_library/permdelete  {"ids":{"imageids":["<id>"]}}
// Use the list's `id` (library id). The number in image_url (/images/<n>/) is a different id;
// permdelete answers 200 to it and deletes nothing.
(() => {
  const KEEP = [];          // name substrings to keep, e.g. ['Desert_Guard']
  const BATCH = 50;
  const PAUSE_MS = 1500;
  const MAX_ROUNDS = 500;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Always page 1: each round deletes it, so the next batch moves up.
  const LIST = async (flag = 'false', page = 1) => {
    const res = await fetch(`/image_library/fetchorphanassets/${flag}/${page}`, {
      headers: { 'x-requested-with': 'XMLHttpRequest' },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`List HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  };

  async function post(chunk) {
    const res = await fetch('/image_library/permdelete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ids: { imageids: chunk.map(String) } }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  let running = true;
  window.r20stop = () => { running = false; console.log('Stopping after current batch.'); };

  window.r20peek = async () => {
    try {
      for (const flag of ['false', 'true']) {
        const items = await LIST(flag);
        console.log(`[${flag}/1] ${items.length} items`, items.slice(0, 3).map(x => `${x.id} ${x.name}`));
      }
    } catch (e) { console.error(e.message); }
  };

  window.r20purge = async () => {
    running = true;
    const sent = new Set();
    let total = 0;
    try {
      for (let round = 1; running && round <= MAX_ROUNDS; round++) {
        const items = await LIST();
        const doomed = items.filter(x => !KEEP.some(k => String(x.name).includes(k))).map(x => x.id);
        if (!doomed.length) { console.log(`Nothing left to delete. Total: ${total}`); break; }
        if (doomed.every(id => sent.has(id))) {
          console.error('Stopped: list keeps returning ids already deleted. Deletes are not taking effect.');
          break;
        }
        for (let i = 0; i < doomed.length && running; i += BATCH) {
          const chunk = doomed.slice(i, i + BATCH).filter(id => !sent.has(id));
          if (!chunk.length) continue;
          await post(chunk);
          chunk.forEach(id => sent.add(id));
          total += chunk.length;
          console.log(`Round ${round}: deleted ${total}`);
          await sleep(PAUSE_MS);
        }
      }
      console.log('Finished. Reload to see the new quota.');
    } catch (e) {
      console.error('Stopped:', e.message);
    }
  };

  console.log('Ready. Run r20peek(), then r20purge().');
})();
