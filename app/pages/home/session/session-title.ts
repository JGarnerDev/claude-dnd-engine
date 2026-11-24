// A session's display title: "Session 35 The Reeve's Ledger" (the file's name)
// reads as "Session 35 · The Reeve's Ledger". A name that is not "Session <n> <title>"
// is shown as it is.

const SESSION_NAME_RE = /^(Session \d+)\s+(\S.*)$/;

export function sessionTitle(name: string): string {
  const m = SESSION_NAME_RE.exec(name.trim());
  return m ? `${m[1]} · ${m[2]}` : name;
}
