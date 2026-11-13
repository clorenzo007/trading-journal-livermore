import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Equity Curve Chart.
 * Visualizes the cumulative portfolio growth over time based on trade results.
 * 
 * Logic:
 * - Sorts trades by entry date.
 * - Calculates cumulative % return starting from base 100.
 * - Renders a line chart using Recharts.
 */
export default function EquityCurve({ trades }) {
  const { t } = useLanguage();
  const data = useMemo(() => {
    if (!Array.isArray(trades) || trades.length === 0) return [];

    // ordenar por fecha de entrada
    const sorted = [...trades]
      .filter((t) => !isNaN(Number(t.profit_loss)))
      .sort((a, b) => new Date(a.entry_date) - new Date(b.entry_date));

    let capital = 100;
    const base = 100;

    return sorted.map((t, i) => {
      capital = capital * (1 + Number(t.profit_loss) / base);

      return {
        index: i + 1,
        equity: Number(capital.toFixed(2)),
      };
    });
  }, [trades]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-sm text-zinc-400 mb-2">{t("Equity Curve (%)")}</div>

      {data.length === 0 ? (
        <div className="text-zinc-500 text-sm">{t("No equity data")}</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <XAxis dataKey="index" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
              }}
              labelFormatter={(v) => `${t("Trade")} ${v}`}
              formatter={(v) => [`${v}%`, t("Equity")]}
            />
            <Line
              type="monotone"
              dataKey="equity"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
