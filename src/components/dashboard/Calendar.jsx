import { useMemo, useState } from "react";

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  const startWeekday = firstDay.getDay(); // 0 = Sunday

  // Padding before
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export default function Calendar({ trades }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-2 py-1 bg-zinc-800 rounded">
          ←
        </button>

        <div className="font-semibold">
          {new Date(year, month).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>

        <button onClick={nextMonth} className="px-2 py-1 bg-zinc-800 rounded">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-zinc-400 mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

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
              className={`h-16 rounded border border-zinc-800 p-1 text-xs flex flex-col justify-between ${color}`}
            >
              <div className="text-right">{d.getDate()}</div>

              {dayTrades && (
                <div className="text-[10px]">
                  {dayTrades.length} trade
                  {dayTrades.length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
