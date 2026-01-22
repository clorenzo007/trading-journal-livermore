import { useState } from "react";
import { updateTrade, deleteTrade } from "../../api/trades";
import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";

export default function TradeDetailModal({ trade, onClose }) {
  const [local, setLocal] = useState(trade);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (k, v) => {
    setLocal((prev) => ({ ...prev, [k]: v }));
  };

  async function save() {
    try {
      setLoading(true);
      setError(null);
      await updateTrade(local._id, local);
      onClose();
    } catch (e) {
      console.error(e);
      setError("Error saving trade");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm("¿Borrar este trade?")) return;

    try {
      setLoading(true);
      await deleteTrade(local._id);
      onClose();
    } catch (e) {
      console.error(e);
      setError("Error deleting trade");
    } finally {
      setLoading(false);
    }
  }

  if (!trade) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl p-6 space-y-4 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{local.symbol} — Edit trade</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-900/40 text-red-300 p-2 rounded">{error}</div>
        )}

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
        <div className="flex justify-between pt-4 border-t border-zinc-800">
          <button
            onClick={remove}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded disabled:opacity-50"
          >
            Delete
          </button>

          <div className="space-x-2">
            <button
              onClick={onClose}
              className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
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
