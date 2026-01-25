import WizardCard from "./WizardCard";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime()) || d.getTime() === 0) return "—";
  return d.toLocaleString();
}

function formatValue(value) {
  if (value === null || value === undefined || value === "" || value === 0)
    return "—";
  return String(value);
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-zinc-800 py-2 text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium text-right break-all">{value}</span>
    </div>
  );
}

export default function StepConfirm({ trade, onNext, onBack, onCancel }) {
  return (
    <WizardCard title="Confirm trade" onCancel={onCancel}>
      <div className="space-y-1">
        <Row label="Symbol" value={formatValue(trade.symbol)} />
        <Row label="Strategy" value={formatValue(trade.strategy_type)} />
        <Row label="Pattern" value={formatValue(trade.pattern)} />

        <Row label="Entry date" value={formatDate(trade.entry_date)} />
        <Row label="Entry price" value={formatValue(trade.entry_price)} />
        <Row label="Position size" value={formatValue(trade.position_size)} />

        <Row label="Stop loss" value={formatValue(trade.stop_loss)} />
        <Row label="Risk %" value={formatValue(trade.risk_percent)} />

        <Row label="Exit date" value={formatDate(trade.exit_date)} />
        <Row label="Exit price" value={formatValue(trade.exit_price)} />
        <Row label="P/L" value={formatValue(trade.profit_loss)} />
        <Row label="Outcome" value={formatValue(trade.outcome)} />

        <Row
          label="Emotion (pre)"
          value={formatValue(trade.emotional_state_pre)}
        />
        <Row label="Reason entry" value={formatValue(trade.reason_for_entry)} />

        <Row
          label="Emotion (post)"
          value={formatValue(trade.emotional_state_post)}
        />
        <Row label="Reason exit" value={formatValue(trade.reason_for_exit)} />
        <Row label="Notes" value={formatValue(trade.review_notes)} />
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
          className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium"
        >
          Confirm
        </button>
      </div>
    </WizardCard>
  );
}
