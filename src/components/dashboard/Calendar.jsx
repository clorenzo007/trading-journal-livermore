import { useMemo, useState } from "react";
import DayTooltip from "./DayTooltip";
import { useLanguage } from "../../context/LanguageContext";

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  const startWeekday = firstDay.getDay();

  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

/**
 * Trading Calendar Component.
 * Displays a monthly view of trading activity.
 * 
 * Features:
 * - Navigate months (prev/next).
 * - Highlights days with trades using color coding (Profit/Loss).
 * - Shows trade count per day.
 * - Interactive tooltip with daily stats (Profit, Win Rate).
 */
export default function Calendar({ trades, onSelectDay }) {
  const today = new Date();
  const { t: tr, locale } = useLanguage();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  const tradesByDay = useMemo(() => {
    const map = {};
    trades.forEach((t) => {
      if (!t.entry_date) return;
      const key = formatDate(new Date(t.entry_date));
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [trades]);

  const dayStats = useMemo(() => {
    const map = {};
    trades.forEach((t) => {
      if (!t.entry_date) return;
      const key = formatDate(new Date(t.entry_date));
      if (!map[key]) {
        map[key] = { total: 0, count: 0, wins: 0, losses: 0, be: 0 };
      }
      const p = Number(t.profit_loss || 0);
      map[key].total += p;
      map[key].count++;
      if (p > 0) map[key].wins++;
      else if (p < 0) map[key].losses++;
      else map[key].be++;
    });
    return map;
  }, [trades]);

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function getDayColor(dayTrades) {
    if (!dayTrades || dayTrades.length === 0) return "bg-zinc-900";
    const sum = dayTrades.reduce(
      (acc, t) => acc + Number(t.profit_loss || 0),
      0,
    );
    if (sum > 0) return "bg-emerald-500/20 text-emerald-400";
    if (sum < 0) return "bg-rose-500/20 text-rose-400";
    return "bg-zinc-700 text-zinc-300";
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 relative overflow-x-auto h-full">
      <div className="min-w-[600px]"> {/* Ensure minimum width for the grid */}
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-2 py-1 bg-zinc-800 rounded">
          ←
        </button>

        <div className="font-semibold">
          {new Date(year, month).toLocaleString(locale, {
            month: "long",
            year: "numeric",
          })}
        </div>

        <button onClick={nextMonth} className="px-2 py-1 bg-zinc-800 rounded">
          →
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-zinc-400 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
          <div key={w}>{tr(w)}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          if (!d)
            return (
              <div
                key={i}
                className="h-16 rounded bg-zinc-950 border border-zinc-900"
              />
            );

          const key = formatDate(d);
          const dayTrades = tradesByDay[key];
          const color = getDayColor(dayTrades);

          return (
            <div
              key={i}
              onClick={() => onSelectDay?.(key)}
              onMouseEnter={(e) => {
                setHoveredDay(key);
                setHoverPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredDay(null)}
              className={`h-16 rounded border border-zinc-800 p-1 text-xs flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-indigo-500 ${color}`}
            >
              <div className="text-right">{d.getDate()}</div>

              {dayTrades && (
                <div className="text-[10px]">
                  {dayTrades.length} {dayTrades.length > 1 ? tr("trades") : tr("trade")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredDay && dayStats[hoveredDay] && (
        <div
          style={{
            position: "fixed",
            left: hoverPos.x + 10,
            top: hoverPos.y + 10,
          }}
        >
          <DayTooltip day={hoveredDay} stats={dayStats[hoveredDay]} />
        </div>
      )}
      </div>
    </div>
  );
}
