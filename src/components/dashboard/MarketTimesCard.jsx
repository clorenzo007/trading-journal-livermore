import { useEffect, useState } from "react";

function getNowInTZ(tz) {
  return new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
}

function buildMarketDate(base, time) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

function minutesBetween(a, b) {
  return Math.max(0, Math.round((b - a) / 60000));
}

function format(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function MarketRow({ name, tz, open, close }) {
  const [, force] = useState(0);

  useEffect(() => {
    const i = setInterval(() => force((v) => v + 1), 60000);
    return () => clearInterval(i);
  }, []);

  const localNow = new Date();
  const marketNow = getNowInTZ(tz);

  let openM = buildMarketDate(marketNow, open);
  let closeM = buildMarketDate(marketNow, close);

  // overnight safety
  if (closeM < openM) closeM.setDate(closeM.getDate() + 1);

  const localOpen = new Date(
    openM.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );

  const localClose = new Date(
    closeM.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );

  const isOpen = localNow >= localOpen && localNow <= localClose;

  let label = "Closed";
  let sub = "";
  let progress = 0;

  if (isOpen) {
    label = "OPEN";
    const total = minutesBetween(localOpen, localClose);
    const elapsed = minutesBetween(localOpen, localNow);
    progress = Math.min(100, Math.round((elapsed / total) * 100));
    sub = `Closes in ${format(minutesBetween(localNow, localClose))}`;
  } else if (localNow < localOpen) {
    sub = `Opens in ${format(minutesBetween(localNow, localOpen))}`;
  } else {
    sub = "Opens tomorrow";
  }

  return (
    <div
      className={`rounded-lg p-3 border ${
        isOpen
          ? "border-emerald-500/40 shadow-[0_0_12px_#10b98155]"
          : "border-zinc-800"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-zinc-400">
            {localOpen.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            –{" "}
            {localClose.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-xs font-semibold ${
              isOpen ? "text-emerald-400" : "text-zinc-400"
            }`}
          >
            {label}
          </div>
          <div className="text-[11px] text-zinc-500">{sub}</div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 h-2 bg-zinc-800 rounded overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Market Sessions Card.
 * Displays the status of major global markets (Open/Closed) and time remaining.
 * 
 * Logic:
 * - Calculates market open/close times in their respective timezones.
 * - Converts to local time for display.
 * - Shows progress bar for open sessions.
 */
export default function MarketTimesCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="text-sm text-zinc-400">Market sessions (local time)</div>

      <MarketRow
        name="New York (NYSE)"
        tz="America/New_York"
        open="09:30"
        close="16:00"
      />

      <MarketRow name="London" tz="Europe/London" open="08:00" close="16:30" />

      <MarketRow
        name="Frankfurt"
        tz="Europe/Berlin"
        open="09:00"
        close="17:30"
      />

      <MarketRow name="Tokyo" tz="Asia/Tokyo" open="09:00" close="15:00" />

      <MarketRow
        name="Sydney"
        tz="Australia/Sydney"
        open="10:00"
        close="16:00"
      />
    </div>
  );
}
