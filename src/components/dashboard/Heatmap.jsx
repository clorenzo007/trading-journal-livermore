import { useMemo } from "react";

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

export default function Heatmap({ trades }) {
  const map = useMemo(() => {
    const m = {};

    trades.forEach((t) => {
      if (!t.entry_date) return;
      const key = formatDate(new Date(t.entry_date));
      if (!m[key]) m[key] = 0;
      m[key] += Number(t.profit_loss || 0);
    });

    return m;
  }, [trades]);

  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-sm text-zinc-400 mb-2">Monthly Heatmap</div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const key = formatDate(d);
          const val = map[key] || 0;

          return (
            <div
              key={i}
              title={`${key}: ${val}`}
              className={`h-10 rounded border border-zinc-800 flex items-center justify-center text-xs ${getColor(
                val,
              )}`}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
