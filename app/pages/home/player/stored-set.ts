// A set of ids kept in this browser's localStorage, such as a guide's done to-dos.
// A private window or blocked storage keeps it in memory for the visit.

import { useState } from "react";

function load(key: string): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function useStoredSet(key: string) {
  const [ids, setIds] = useState<string[]>(() => load(key));
  const save = (next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* kept in memory */
    }
  };
  return {
    has: (id: string) => ids.includes(id),
    set: (id: string, on: boolean) =>
      save(on ? [...ids.filter((x) => x !== id), id] : ids.filter((x) => x !== id)),
  };
}

export type StoredSet = ReturnType<typeof useStoredSet>;
