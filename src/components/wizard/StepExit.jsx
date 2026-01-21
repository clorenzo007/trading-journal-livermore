import { useEffect, useRef } from "react";

export default function StepExit({ data, onChange, setData }) {
  const manualPL = useRef(false);
  const manualOutcome = useRef(false);

  useEffect(() => {
    if (!data.entry_price || !data.exit_price) return;

    if (!manualPL.current) {
      const e = Number(data.entry_price);
      const x = Number(data.exit_price);
      if (!e || !x || isNaN(e) || isNaN(x)) return;

      const isLong = x >= e;
      let pl;

      if (isLong) {
        pl = ((x - e) / e) * 100;
      } else {
        pl = ((e - x) / e) * 100;
      }

      const rounded = Number(pl.toFixed(2));

      setData((prev) => ({
        ...prev,
        profit_loss: rounded,
        outcome: manualOutcome.current
          ? prev.outcome
          : rounded > 0
            ? "Win"
            : rounded < 0
              ? "Loss"
              : "Break-even",
      }));
    }
  }, [data.entry_price, data.exit_price]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Exit</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exit date */}
        <div>
          <label className="block text-zinc-400 mb-1">Exit date</label>
          <input
            type="datetime-local"
            value={data.exit_date || ""}
            onChange={(e) => onChange("exit_date", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* Exit price */}
        <div>
          <label className="block text-zinc-400 mb-1">Exit price</label>
          <input
            type="number"
            step="0.0001"
            value={data.exit_price || ""}
            onChange={(e) => {
              manualPL.current = false;
              manualOutcome.current = false;
              onChange("exit_price", e.target.value);
            }}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* P/L % */}
        <div>
          <label className="block text-zinc-400 mb-1">P/L (%)</label>
          <input
            type="number"
            step="0.01"
            value={data.profit_loss || ""}
            onChange={(e) => {
              manualPL.current = true;
              onChange("profit_loss", e.target.value);
            }}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
          <div className="text-xs text-zinc-500 mt-1">
            Auto-calculated. You can override.
          </div>
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-zinc-400 mb-1">Outcome</label>
          <select
            value={data.outcome || ""}
            onChange={(e) => {
              manualOutcome.current = true;
              onChange("outcome", e.target.value);
            }}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          >
            <option value="">—</option>
            <option value="Win">Win</option>
            <option value="Loss">Loss</option>
            <option value="Break-even">Break-even</option>
          </select>
          <div className="text-xs text-zinc-500 mt-1">
            Auto-suggested. You can override.
          </div>
        </div>
      </div>
    </div>
  );
}
