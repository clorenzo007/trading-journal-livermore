import WizardCard from "./WizardCard";

export default function StepExit({ trade, setTrade, onNext, onBack }) {
  return (
    <WizardCard title="Exit">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Exit date</label>
          <input
            type="datetime-local"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.exit_date || ""}
            onChange={(e) => setTrade({ exit_date: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Exit price</label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.exit_price || ""}
            onChange={(e) => setTrade({ exit_price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Profit / Loss
          </label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.profit_loss || ""}
            onChange={(e) => setTrade({ profit_loss: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Outcome</label>
          <select
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.outcome || ""}
            onChange={(e) => setTrade({ outcome: e.target.value })}
          >
            <option value="">—</option>
            <option value="Win">Win</option>
            <option value="Loss">Loss</option>
            <option value="Break-even">Break-even</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        >
          Back
        </button>

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
