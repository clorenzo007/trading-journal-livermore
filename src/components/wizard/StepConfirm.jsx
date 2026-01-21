export default function StepConfirm({ trade, onNext, onBack }) {
  function Row({ label, value }) {
    return (
      <div className="flex justify-between border-b border-zinc-800 py-1">
        <span className="text-zinc-400">{label}</span>
        <span className="font-medium">
          {value !== "" && value !== undefined ? String(value) : "—"}
        </span>
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
        <Row label="Position size" value={trade.position_size} />

        <Row label="Stop loss" value={trade.stop_loss} />
        <Row label="Risk %" value={trade.risk_percent} />

        <Row label="Exit date" value={trade.exit_date} />
        <Row label="Exit price" value={trade.exit_price} />
        <Row label="P/L" value={trade.profit_loss} />
        <Row label="Outcome" value={trade.outcome} />

        <Row label="Emotion (pre)" value={trade.emotional_state_pre} />
        <Row label="Reason entry" value={trade.reason_for_entry} />

        <Row label="Emotion (post)" value={trade.emotional_state_post} />
        <Row label="Reason exit" value={trade.reason_for_exit} />
        <Row label="Notes" value={trade.review_notes} />
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
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
