import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

function getOutcome(trade) {
  const p = Number(trade.profit_loss);
  if (isNaN(p)) return null;
  if (p > 0) return "Win";
  if (p < 0) return "Loss";
  return "BE";
}

/**
 * Win / Loss / BE Distribution Chart (Bar).
 * Shows the absolute count of trades for each outcome.
 */
export default function WinLossBar({ trades }) {
  const data = useMemo(() => {
    const counts = { Win: 0, Loss: 0, BE: 0 };

    if (!Array.isArray(trades)) return [];

    trades.forEach((t) => {
      const o = getOutcome(t);
      if (!o) return;
      counts[o]++;
    });

    return [
      { name: "Win", value: counts.Win },
      { name: "Loss", value: counts.Loss },
      { name: "BE", value: counts.BE },
    ].filter((d) => d.value > 0);
  }, [trades]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full">
      <div className="text-sm text-zinc-400 mb-2">Win / Loss Distribution</div>

      {data.length === 0 ? (
        <div className="text-zinc-500 text-sm">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa" }} />
            <YAxis tick={{ fill: "#a1a1aa" }} />
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
              }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
