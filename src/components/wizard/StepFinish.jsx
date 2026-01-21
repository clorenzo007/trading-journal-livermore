export default function StepFinish({ trade, onBack, onFinish }) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-xl font-semibold">Trade ready</h2>

      <p className="text-zinc-400">
        Everything looks good. You can now save this trade.
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-left space-y-2">
        <div>
          <span className="text-zinc-400">Symbol:</span>{" "}
          <span className="font-medium">{trade.symbol || "—"}</span>
        </div>

        <div>
          <span className="text-zinc-400">Outcome:</span>{" "}
          <span className="font-medium">{trade.outcome || "—"}</span>
        </div>

        <div>
          <span className="text-zinc-400">P/L:</span>{" "}
          <span className="font-medium">{trade.profit_loss || "—"}</span>
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
          onClick={onFinish}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
        >
          Save trade
        </button>
      </div>
    </div>
  );
}
