import { useMemo, useState } from "react";
import DayTooltip from "./DayTooltip";

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

export default function Heatmap({ trades }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const statsMap = useMemo(() => {
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

  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d));
    }

    return arr;
  }, []);

  function getColor(value) {
    if (value === 0) return "bg-zinc-900";
    if (value > 0) return "bg-emerald-500/30";
    return "bg-rose-500/30";
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 relative">
      <div className="text-sm text-zinc-400 mb-2">Monthly Heatmap</div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const key = formatDate(d);
          const stats = statsMap[key];
          const val = stats?.total || 0;

          return (
            <div
              key={i}
              onMouseEnter={(e) => {
                if (!stats) return;
                setHoveredDay(key);
                setHoverPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredDay(null)}
              className={`h-10 rounded border border-zinc-800 flex items-center justify-center text-xs cursor-default ${getColor(
                val,
              )}`}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      {hoveredDay && statsMap[hoveredDay] && (
        <div
          style={{
            position: "fixed",
            left: hoverPos.x + 10,
            top: hoverPos.y + 10,
          }}
        >
          <DayTooltip day={hoveredDay} stats={statsMap[hoveredDay]} />
        </div>
      )}
    </div>
  );
}
