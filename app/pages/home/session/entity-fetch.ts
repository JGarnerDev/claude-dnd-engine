// Entity files, fetched from the dev server's /__entity endpoint and cached, and
// what each layer means at the table.

// What a layer means at the table: historian is canon, data is unplayed pool,
// scheduler is the plan.
export const LAYER_LABEL: Record<string, string> = {
  historian: "canon",
  data: "pool",
  scheduler: "plan",
  meta: "loot",
};

const cache = new Map<string, Promise<string>>();

export function fetchEntity(path: string): Promise<string> {
  let p = cache.get(path);
  if (!p) {
    p = fetch(`/__entity?path=${encodeURIComponent(path)}`).then((r) =>
      r.ok ? r.text() : Promise.reject(new Error(String(r.status))),
    );
    p.catch(() => cache.delete(path));
    cache.set(path, p);
  }
  return p;
}
