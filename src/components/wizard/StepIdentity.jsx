export default function StepIdentity({ data, onChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Identity</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Symbol */}
        <div>
          <label className="block text-zinc-400 mb-1">Symbol</label>
          <input
            type="text"
            value={data.symbol || ""}
            onChange={(e) => onChange("symbol", e.target.value.toUpperCase())}
            placeholder="EURUSD, XAUUSD..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 uppercase"
          />
        </div>

        {/* Strategy */}
        <div>
          <label className="block text-zinc-400 mb-1">Strategy</label>
          <input
            type="text"
            value={data.strategy_type || ""}
            onChange={(e) => onChange("strategy_type", e.target.value)}
            placeholder="Breakout, Mean Reversion..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* Pattern */}
        <div className="md:col-span-2">
          <label className="block text-zinc-400 mb-1">Pattern</label>
          <input
            type="text"
            value={data.pattern || ""}
            onChange={(e) => onChange("pattern", e.target.value)}
            placeholder="Flag, Head & Shoulders..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
