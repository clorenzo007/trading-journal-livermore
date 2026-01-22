import { useState } from "react";
import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";

export default function TradeDetailModal({ trade, onClose }) {
  const [local, setLocal] = useState(trade);

  const update = (k, v) => {
    setLocal((prev) => ({ ...prev, [k]: v }));
  };

  if (!trade) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl p-6 space-y-4 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{trade.symbol} — Trade</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Symbol">
            <input
              value={local.symbol || ""}
              onChange={(e) => update("symbol", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Strategy">
            <input
              value={local.strategy_type || ""}
              onChange={(e) => update("strategy_type", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Pattern">
            <input
              value={local.pattern || ""}
              onChange={(e) => update("pattern", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Outcome">
            <select
              value={local.outcome || ""}
              onChange={(e) => update("outcome", e.target.value)}
              className="input"
            >
              <option value="">—</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="breakeven">BE</option>
            </select>
          </Field>

          <Field label="Entry date">
            <input
              type="datetime-local"
              value={local.entry_date?.slice(0, 16) || ""}
              onChange={(e) => update("entry_date", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Exit date">
            <input
              type="datetime-local"
              value={local.exit_date?.slice(0, 16) || ""}
              onChange={(e) => update("exit_date", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Entry price">
            <input
              type="number"
              value={local.entry_price || ""}
              onChange={(e) => update("entry_price", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Exit price">
            <input
              type="number"
              value={local.exit_price || ""}
              onChange={(e) => update("exit_price", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Stop loss">
            <input
              type="number"
              value={local.stop_loss || ""}
              onChange={(e) => update("stop_loss", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Risk %">
            <input
              type="number"
              value={local.risk_percent || ""}
              onChange={(e) => update("risk_percent", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="P/L">
            <input
              type="number"
              value={local.profit_loss || ""}
              onChange={(e) => update("profit_loss", e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="Reason for entry">
          <textarea
            value={local.reason_for_entry || ""}
            onChange={(e) => update("reason_for_entry", e.target.value)}
            className="input h-20"
          />
        </Field>

        <Field label="Review notes">
          <textarea
            value={local.review_notes || ""}
            onChange={(e) => update("review_notes", e.target.value)}
            className="input h-20"
          />
        </Field>

        {/* Images */}
        <div className="border-t border-zinc-800 pt-4 space-y-4">
          <EntryImageUploader trade={local} setTrade={setLocal} />
          <ReviewImageUploader trade={local} setTrade={setLocal} />
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-zinc-400">{label}</div>
      {children}
    </div>
  );
}
