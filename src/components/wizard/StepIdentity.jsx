export default function StepIdentity({ trade, setTrade, onNext }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Trade Identity</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400">Symbol</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.symbol || ""}
            onChange={(e) => setTrade({ symbol: e.target.value })}
            placeholder="EURUSD, XAUUSD, SPX..."
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400">Strategy</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.strategy_type || ""}
            onChange={(e) => setTrade({ strategy_type: e.target.value })}
            placeholder="Breakout, Pullback, Reversal..."
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400">Pattern</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.pattern || ""}
            onChange={(e) => setTrade({ pattern: e.target.value })}
            placeholder="Flag, Range, Liquidity sweep..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
