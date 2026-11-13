import { useEffect, useState } from "react";
import { Globe, Activity, Zap } from "lucide-react";
import { NYSE_TIMEZONE, formatNYSETime } from "../../utils/formatDate";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Minutes a timezone's wall clock is ahead of UTC at the given instant
 * (e.g. +540 for Asia/Tokyo, -240 for America/New_York in EDT).
 * Computed from the real Intl conversion, so DST is handled correctly.
 */
function getOffsetMinutes(timeZone, date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}

/** Today's Y/M/D as seen from inside `timeZone`, at the given instant. */
function getZonedYMD(timeZone, date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day };
}

/** Real UTC instant for "HH:MM today" as seen from inside `timeZone`. */
function zonedTimeToInstant(timeZone, now, hhmm) {
  const [h, min] = hhmm.split(":").map(Number);
  const { y, m, d } = getZonedYMD(timeZone, now);
  const naiveUTC = Date.UTC(y, m - 1, d, h, min, 0, 0);
  const offset = getOffsetMinutes(timeZone, new Date(naiveUTC));
  return naiveUTC - offset * 60000;
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
  const { t, lang } = useLanguage();
  const timeFmt = { hour: "2-digit", minute: "2-digit", ...(lang === "es" && { hour12: false }) };

  useEffect(() => {
    const i = setInterval(() => force((v) => v + 1), 60000);
    return () => clearInterval(i);
  }, []);

  const now = new Date();

  // Today's open/close as real instants, computed from tz's own wall clock
  // (handles DST correctly; no double timezone conversion).
  const todayOpen = zonedTimeToInstant(tz, now, open);
  let todayClose = zonedTimeToInstant(tz, now, close);
  if (todayClose <= todayOpen) todayClose += 24 * 60 * 60000; // overnight session (e.g. Sydney)

  // A session that wraps past midnight may have started yesterday (tz-local);
  // check that window too so "now" lands in the right one.
  const yestOpen = todayOpen - 24 * 60 * 60000;
  const yestClose = todayClose - 24 * 60 * 60000;

  const nowMs = now.getTime();
  let isOpen = false;
  let activeOpen = todayOpen;
  let activeClose = todayClose;

  if (nowMs >= todayOpen && nowMs < todayClose) {
    isOpen = true;
  } else if (nowMs >= yestOpen && nowMs < yestClose) {
    isOpen = true;
    activeOpen = yestOpen;
    activeClose = yestClose;
  }

  const localOpen = new Date(todayOpen); // today's session, for the displayed label
  const localClose = new Date(todayClose);

  let label = t("Closed");
  let sub = "";
  let progress = 0;

  if (isOpen) {
    label = t("OPEN");
    const total = minutesBetween(activeOpen, activeClose);
    const elapsed = minutesBetween(activeOpen, nowMs);
    progress = Math.min(100, Math.round((elapsed / total) * 100));
    sub = t("{time} left", { time: format(minutesBetween(nowMs, activeClose)) });
  } else {
    const nextOpen = nowMs < todayOpen ? todayOpen : todayOpen + 24 * 60 * 60000;
    sub = t("Opens in {time}", { time: format(minutesBetween(nowMs, nextOpen)) });
  }

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-300 border ${isOpen
          ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
          : "bg-zinc-950/20 border-zinc-800/50 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all"
        }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <div className="text-sm font-black text-white uppercase tracking-tight">{t(name)}</div>
          <div className="text-[10px] font-bold text-zinc-500 tracking-wider">
            {formatNYSETime(localOpen, timeFmt)} – {formatNYSETime(localClose, timeFmt)}
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest ${isOpen ? "bg-emerald-500 text-emerald-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-800 text-zinc-400"
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
  const { t } = useLanguage();
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 rounded-3xl p-6 h-full relative overflow-hidden shadow-2xl flex flex-col gap-4">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Globe size={100} className="text-indigo-500" />
      </div>

      <div className="flex items-center justify-between relative z-10 mb-2">
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-zinc-500" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-500">{t("Market Sessions")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase">{t("Live")}</span>
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

