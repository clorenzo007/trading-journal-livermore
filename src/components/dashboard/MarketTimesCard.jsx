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
import { useEffect, useState } from "react";
import { Globe, Activity, Zap } from "lucide-react";

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
    sub = `${format(minutesBetween(localNow, localClose))} left`;
  } else if (localNow < localOpen) {
    sub = `Opens in ${format(minutesBetween(localNow, localOpen))}`;
  } else {
    sub = "Opens tomorrow";
  }

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-300 border ${
        isOpen
          ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
          : "bg-zinc-950/20 border-zinc-800/50 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <div className="text-sm font-black text-white uppercase tracking-tight">{name}</div>
          <div className="text-[10px] font-bold text-zinc-500 tracking-wider">
            {localOpen.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {localClose.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest ${
            isOpen ? "bg-emerald-500 text-emerald-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-800 text-zinc-400"
          }`}>
            {isOpen && <Zap size={10} fill="currentColor" />}
            {label}
          </div>
          <div className="text-[11px] font-bold text-zinc-400 mt-1">{sub}</div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function MarketTimesCard() {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 rounded-3xl p-6 h-full relative overflow-hidden shadow-2xl flex flex-col gap-4">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Globe size={100} className="text-indigo-500" />
      </div>

      <div className="flex items-center justify-between relative z-10 mb-2">
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-zinc-500" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Market Sessions</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
        </div>
      </div>

      <div className="space-y-3 relative z-10 overflow-y-auto pr-1 no-scrollbar flex-1">
        <MarketRow name="New York" tz="America/New_York" open="09:30" close="16:00" />
        <MarketRow name="London" tz="Europe/London" open="08:00" close="16:30" />
        <MarketRow name="Tokyo" tz="Asia/Tokyo" open="09:00" close="15:00" />
        <MarketRow name="Sydney" tz="Australia/Sydney" open="10:00" close="16:00" />
      </div>
    </div>
  );
}

