import WizardCard from "./WizardCard";

export default function StepRisk({ trade, setTrade, onNext, onBack }) {
  return (
    <WizardCard title="Risk management">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Stop loss</label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.stop_loss || ""}
            onChange={(e) => setTrade({ stop_loss: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Risk %</label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.risk_percent || ""}
            onChange={(e) => setTrade({ risk_percent: e.target.value })}
            placeholder="1.00"
          />
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
