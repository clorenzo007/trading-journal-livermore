export default function StepConfirm({ trade, onNext, onBack }) {
  function Row({ label, value }) {
    return (
      <div className="flex justify-between border-b border-zinc-800 py-1">
        <span className="text-zinc-400">{label}</span>
        <span className="font-medium">{value || "—"}</span>
      </div>
    );
  }

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
        <Row label="Exit price" value={trade.exit_price} />
        <Row label="P/L" value={trade.profit_loss} />
        <Row label="Outcome" value={trade.outcome} />
      </div>

      {/* IMAGES PREVIEW */}
      <div className="grid grid-cols-2 gap-4">
        {trade.entryImage?.url && (
          <img
            src={trade.entryImage.url}
            className="h-32 object-cover rounded border border-zinc-800"
          />
        )}
        {trade.reviewImage?.url && (
          <img
            src={trade.reviewImage.url}
            className="h-32 object-cover rounded border border-zinc-800"
          />
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="px-4 py-2 bg-zinc-800 rounded">
          Back
        </button>
        <button onClick={onNext} className="px-4 py-2 bg-emerald-600 rounded">
          Confirm
        </button>
      </div>
    </div>
  );
}
