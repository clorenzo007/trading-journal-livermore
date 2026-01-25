import WizardCard from "./WizardCard";

export default function StepIdentity({ trade, setTrade, onNext }) {
  return (
    <WizardCard title="Trade identity">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Symbol</label>
          <input
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.symbol || ""}
            onChange={(e) => setTrade({ symbol: e.target.value })}
            placeholder="EURUSD, XAUUSD, NDX100…"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Strategy</label>
          <input
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.strategy_type || ""}
            onChange={(e) => setTrade({ strategy_type: e.target.value })}
            placeholder="Breakout, Pullback, Imported…"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Pattern</label>
          <input
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.pattern || ""}
            onChange={(e) => setTrade({ pattern: e.target.value })}
            placeholder="Flag, Range, MT5…"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={onNext}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium"
        >
          Next
        </button>
      </div>
    </WizardCard>
  );
}
