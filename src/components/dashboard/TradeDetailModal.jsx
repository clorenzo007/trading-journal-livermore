import { useState } from "react";
import { updateTrade, deleteTrade } from "../../api/trades";
import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";

export default function TradeDetailModal({ trade, onClose }) {
  const [local, setLocal] = useState(trade);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (k, v) => setLocal((prev) => ({ ...prev, [k]: v }));

  async function save() {
    try {
      setLoading(true);
      setError(null);
      await updateTrade(trade._id, local);
      onClose();
    } catch (e) {
      setError("Error saving trade");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this trade?")) return;
    await deleteTrade(trade._id);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl p-6 space-y-4 text-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Trade — {local.symbol}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="bg-red-900/40 text-red-300 p-2 rounded">{error}</div>
        )}

        <input
          value={local.symbol || ""}
          onChange={(e) => update("symbol", e.target.value)}
          className="input"
        />

        <div className="border-t border-zinc-800 pt-4 space-y-4">
          <EntryImageUploader trade={local} setTrade={setLocal} />
          <ReviewImageUploader trade={local} setTrade={setLocal} />
        </div>

        <div className="flex justify-between pt-4 border-t border-zinc-800">
          <button onClick={remove} className="bg-red-600 px-4 py-2 rounded">
            Delete
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="bg-indigo-600 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
