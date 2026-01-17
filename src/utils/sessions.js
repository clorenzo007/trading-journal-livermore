// Define sessions by base TZ and hours (local to that TZ)
export const SESSIONS = [
  { key: "Asia", tz: "Asia/Tokyo", open: "09:00", close: "15:00" },
  { key: "London", tz: "Europe/London", open: "08:00", close: "16:30" },
  { key: "NY", tz: "America/New_York", open: "09:30", close: "16:00" },
  { key: "Europe", tz: "Europe/Berlin", open: "09:00", close: "17:30" },
];

function dateInTZ(date, tz) {
  return new Date(date.toLocaleString("en-US", { timeZone: tz }));
}

function buildInTZ(base, time) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

export function getSessionByEntryDate(entryDate) {
  if (!entryDate) return null;
  const local = new Date(entryDate);

  for (const s of SESSIONS) {
    const base = dateInTZ(local, s.tz);
    let o = buildInTZ(base, s.open);
    let c = buildInTZ(base, s.close);
    if (c < o) c.setDate(c.getDate() + 1); // overnight safety

    const localOpen = new Date(
      o.toLocaleString("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );
    const localClose = new Date(
      c.toLocaleString("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );

    if (local >= localOpen && local <= localClose) return s.key;
  }
  return "Other";
}

export function withSession(trades) {
  if (!Array.isArray(trades)) return [];

  return trades.map((t) => {
    const session = getSessionByEntryDate(t.entry_date);

    return {
      ...t,
      _session: session,
    };
  });
}
