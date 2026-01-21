export default function StepRisk({ trade, setTrade, onNext, onBack }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Risk</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400">Stop loss</label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.stop_loss || ""}
            onChange={(e) => setTrade({ stop_loss: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400">Risk %</label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.risk_percent || ""}
            onChange={(e) => setTrade({ risk_percent: e.target.value })}
            placeholder="1.00"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          Back
        </button>

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
