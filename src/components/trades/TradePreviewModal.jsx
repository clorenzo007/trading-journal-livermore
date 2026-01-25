export default function TradePreviewModal({ trade, onClose, onEdit }) {
  if (!trade) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {trade.symbol} — {trade.outcome || "Open"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="text-sm text-zinc-400 space-y-2">
          <div>Strategy: {trade.strategy_type || "—"}</div>
          <div>Pattern: {trade.pattern || "—"}</div>
          <div>Entry price: {trade.entry_price || "—"}</div>
          <div>Exit price: {trade.exit_price || "—"}</div>
          <div>P/L: {trade.profit_loss || "—"}</div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
          >
            Salir
          </button>

          <button
            onClick={onEdit}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
