export default function StepConfirm({ trade, onNext, onBack }) {
  function Row({ label, value }) {
    return (
      <div className="flex justify-between border-b border-zinc-800 py-1">
        <span className="text-zinc-400">{label}</span>
        <span className="font-medium">{value || "—"}</span>
      </div>
    );
  }

  // ======================
  // SANITY CHECKS
  // ======================
  const warnings = [];
  let blockingError = null;

  if (trade.exit_date && !trade.exit_price) {
    blockingError = "Exit price is required when exit date is set.";
  }

  if (trade.exit_price && !trade.outcome) {
    blockingError = "Outcome is required when exit price is set.";
  }

  if (trade.exit_price && !trade.profit_loss) {
    warnings.push("Profit / Loss is empty for a closed trade.");
  }

  if (!trade.entryImage?.url) {
    warnings.push("No entry image attached.");
  }

  if (!trade.reviewImage?.url) {
    warnings.push("No review image attached.");
  }

  const canConfirm = !blockingError;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Confirm trade</h2>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2 text-sm">
        <Row label="Symbol" value={trade.symbol} />
        <Row label="Strategy" value={trade.strategy_type} />
        <Row label="Pattern" value={trade.pattern} />
        <Row label="Entry date" value={trade.entry_date} />
        <Row label="Entry price" value={trade.entry_price} />
        <Row label="Stop loss" value={trade.stop_loss} />
        <Row label="Risk %" value={trade.risk_percent} />
        <Row label="Exit date" value={trade.exit_date} />
        <Row label="Exit price" value={trade.exit_price} />
        <Row label="P/L" value={trade.profit_loss} />
        <Row label="Outcome" value={trade.outcome} />
      </div>

      {/* WARNINGS */}
      {warnings.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 text-sm rounded p-3 space-y-1">
          {warnings.map((w, i) => (
            <div key={i}>⚠ {w}</div>
          ))}
        </div>
      )}

      {/* BLOCKING ERROR */}
      {blockingError && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm rounded p-3">
          {blockingError}
        </div>
      )}

      {/* IMAGES PREVIEW */}
      <div className="grid grid-cols-2 gap-4">
        {trade.entryImage?.url && (
          <img
            src={trade.entryImage.url}
            alt="Entry"
            className="h-32 object-cover rounded border border-zinc-800"
          />
        )}
        {trade.reviewImage?.url && (
          <img
            src={trade.reviewImage.url}
            alt="Review"
            className="h-32 object-cover rounded border border-zinc-800"
          />
        )}
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
          disabled={!canConfirm}
          className={`px-4 py-2 rounded font-medium transition ${
            canConfirm
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
