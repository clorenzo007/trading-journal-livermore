import { useState } from "react";
import { updateTrade, deleteTrade } from "../../api/trades";
import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";

export default function TradeDetailModal({ trade, onClose }) {
  console.log("MODAL RECEIVED TRADE:", trade);
  console.log("MODAL RECEIVED trade._id:", trade?._id);

  const [local, setLocal] = useState(trade);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setLocal((prev) => ({ ...prev, [k]: v }));

  async function save() {
    console.log("SAVE CLICKED");
    console.log("SAVE trade._id:", trade?._id);
    console.log("SAVE local._id:", local?._id);
    console.log("SAVE local OBJECT:", local);

    try {
      setLoading(true);
      await updateTrade(trade._id, local);
      console.log("SAVE SUCCESS");
      onClose();
    } catch (e) {
      console.error("SAVE ERROR:", e);
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    console.log("DELETE CLICKED trade._id:", trade?._id);
    await deleteTrade(trade._id);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-3xl text-white space-y-4">
        <h2 className="text-xl font-bold">{local.symbol}</h2>

        <input
          value={local.symbol || ""}
          onChange={(e) => update("symbol", e.target.value)}
          className="input"
        />

        <div className="border-t border-zinc-800 pt-4 space-y-4">
          <EntryImageUploader trade={local} setTrade={setLocal} />
          <ReviewImageUploader trade={local} setTrade={setLocal} />
        </div>

        <div className="flex justify-between pt-4">
          <button onClick={remove} className="bg-red-600 px-4 py-2 rounded">
            Delete
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="bg-indigo-600 px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
