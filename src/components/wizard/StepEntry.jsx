export default function StepEntry({ trade, setTrade, onNext, onBack }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Entry</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400">Entry date</label>
          <input
            type="datetime-local"
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.entry_date || ""}
            onChange={(e) => setTrade({ entry_date: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400">Entry price</label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.entry_price || ""}
            onChange={(e) => setTrade({ entry_price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400">
            Position size (lots)
          </label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.position_size || ""}
            onChange={(e) => setTrade({ position_size: e.target.value })}
            placeholder="0.01"
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
