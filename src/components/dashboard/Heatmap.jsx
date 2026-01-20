import { useMemo, useState } from "react";
import DayTooltip from "./DayTooltip";

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function interpolateColor(c1, c2, t) {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// Paleta GitHub-like
const GREEN_LIGHT = [74, 222, 128]; // #4ade80
const GREEN_DARK = [22, 163, 74]; // #16a34a
const RED_LIGHT = [248, 113, 113]; // #f87171
const RED_DARK = [220, 38, 38]; // #dc2626
const NEUTRAL = "#27272a";

export default function Heatmap({ trades }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const statsMap = useMemo(() => {
    const map = {};
    trades.forEach((t) => {
      if (!t.entry_date) return;
      const d = new Date(t.entry_date);
      if (d.getFullYear() !== year || d.getMonth() !== month) return;

      const key = formatDate(d);
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
  }, [trades, year, month]);

  const days = useMemo(() => {
    const arr = [];
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d));
    }

    return arr;
  }, [year, month]);

  const maxAbs = useMemo(() => {
    let max = 0;
    Object.values(statsMap).forEach((s) => {
      max = Math.max(max, Math.abs(s.total));
    });
    return max || 1;
  }, [statsMap]);

  function getColor(total) {
    if (total === 0) return NEUTRAL;

    const t = clamp(Math.abs(total) / maxAbs, 0, 1);

    if (total > 0) {
      return interpolateColor(GREEN_LIGHT, GREEN_DARK, t);
    } else {
      return interpolateColor(RED_LIGHT, RED_DARK, t);
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

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 relative">
      <div className="flex justify-between items-center mb-3">
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

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const key = formatDate(d);
          const stats = statsMap[key];
          const total = stats?.total || 0;
          const bg = stats ? getColor(total) : NEUTRAL;

          return (
            <div
              key={i}
              onMouseEnter={(e) => {
                if (!stats) return;
                setHoveredDay(key);
                setHoverPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredDay(null)}
              className="h-10 rounded border border-zinc-800 flex items-center justify-center text-xs"
              style={{ background: bg }}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-2 mt-4 text-xs text-zinc-400">
        <span>Low</span>
        <div
          className="w-4 h-4 rounded"
          style={{ background: interpolateColor(RED_LIGHT, RED_DARK, 1) }}
        />
        <div className="w-4 h-4 rounded" style={{ background: NEUTRAL }} />
        <div
          className="w-4 h-4 rounded"
          style={{ background: interpolateColor(GREEN_LIGHT, GREEN_DARK, 1) }}
        />
        <span>High</span>
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
