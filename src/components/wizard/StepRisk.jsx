import WizardCard from "./WizardCard";

export default function StepRisk({
  trade,
  setTrade,
  onNext,
  onBack,
  onCancel,
}) {
  const stopLoss = Number(trade.stop_loss);
  const risk = Number(trade.risk_percent);

  const errors = [];

  if (!stopLoss || stopLoss <= 0) {
    errors.push("Stop loss must be a number greater than 0.");
  }

  if (!risk || risk <= 0 || risk > 100) {
    errors.push("Risk % must be between 0 and 100.");
  }

  const isValid = errors.length === 0;

  return (
    <WizardCard title="Risk management" onCancel={onCancel}>
      <div className="space-y-4">
        {/* STOP LOSS */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Stop loss</label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.stop_loss ?? ""}
            onChange={(e) => setTrade({ stop_loss: e.target.value })}
            placeholder="Price level"
          />
        </div>

        {/* RISK % */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Risk %</label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.risk_percent ?? ""}
            onChange={(e) => setTrade({ risk_percent: e.target.value })}
            placeholder="1.0"
          />
        </div>

        {/* ERRORS */}
        {!isValid && (
          <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm rounded p-3 space-y-1">
            {errors.map((e, i) => (
              <div key={i}>• {e}</div>
            ))}
          </div>
        )}
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
          disabled={!isValid}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            isValid
              ? "bg-indigo-600 hover:bg-indigo-500"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </WizardCard>
  );
}
