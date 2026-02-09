import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

const COLORS = {
  Win: "#22c55e",
  Loss: "#ef4444",
  BE: "#a1a1aa",
};

function getOutcome(trade) {
  const p = Number(trade.profit_loss);
  if (isNaN(p)) return null;
  if (p > 0) return "Win";
  if (p < 0) return "Loss";
  return "BE";
}

/**
 * Win / Loss / BE Ratio Chart (Pie).
 * Shows the percentage distribution of trade outcomes.
 */
export default function WinLossPie({ trades }) {
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-sm text-zinc-400 mb-2">Win / Loss Ratio</div>

      {data.length === 0 ? (
        <div className="text-zinc-500 text-sm">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
