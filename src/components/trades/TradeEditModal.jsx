import { useState } from "react";
import { updateTrade, deleteTrade } from "../../api/trades";
import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";

const TABS = ["General", "Risk", "Psychology", "Review", "Images"];

export default function TradeEditModal({ trade, onClose, onSaved }) {
  const [form, setForm] = useState({ ...trade });
  const [tab, setTab] = useState("General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    try {
      setLoading(true);
      setError(null);
      await updateTrade(trade.id, form);
      onSaved();
    } catch {
      setError("Error saving trade");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this trade?")) return;
    await deleteTrade(trade.id);
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl p-6 text-white max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Trade — {trade.symbol}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded text-sm ${
                tab === t ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/40 text-red-300 p-2 rounded">{error}</div>
        )}

        {/* CONTENT */}
        {tab === "General" && (
          <Grid>
            <Field label="Symbol">
              <input
                value={form.symbol || ""}
                onChange={(e) => update("symbol", e.target.value)}
                className="input"
              />
            </Field>

            <Field label="Strategy">
              <input
                value={form.strategy_type || ""}
                onChange={(e) => update("strategy_type", e.target.value)}
                className="input"
              />
            </Field>

            <Field label="Pattern">
              <input
                value={form.pattern || ""}
                onChange={(e) => update("pattern", e.target.value)}
                className="input"
              />
            </Field>

            <Field label="Entry date">
              <input
                type="datetime-local"
                value={toLocal(form.entry_date)}
                onChange={(e) => update("entry_date", new Date(e.target.value))}
                className="input"
              />
            </Field>

            <Field label="Exit date">
              <input
                type="datetime-local"
                value={toLocal(form.exit_date)}
                onChange={(e) => update("exit_date", new Date(e.target.value))}
                className="input"
              />
            </Field>
          </Grid>
        )}

        {tab === "Risk" && (
          <Grid>
            <Field label="Entry price">
              <input
                type="number"
                value={form.entry_price ?? ""}
                onChange={(e) => update("entry_price", Number(e.target.value))}
                className="input"
              />
            </Field>

            <Field label="Exit price">
              <input
                type="number"
                value={form.exit_price ?? ""}
                onChange={(e) => update("exit_price", Number(e.target.value))}
                className="input"
              />
            </Field>

            <Field label="Stop loss">
              <input
                type="number"
                value={form.stop_loss ?? ""}
                onChange={(e) => update("stop_loss", Number(e.target.value))}
                className="input"
              />
            </Field>

            <Field label="Take profit">
              <input
                type="number"
                value={form.take_profit ?? ""}
                onChange={(e) => update("take_profit", Number(e.target.value))}
                className="input"
              />
            </Field>

            <Field label="Position size">
              <input
                type="number"
                value={form.position_size ?? ""}
                onChange={(e) =>
                  update("position_size", Number(e.target.value))
                }
                className="input"
              />
            </Field>

            <Field label="Risk %">
              <input
                type="number"
                value={form.risk_percent ?? ""}
                onChange={(e) => update("risk_percent", Number(e.target.value))}
                className="input"
              />
            </Field>

            <Field label="P/L">
              <input
                type="number"
                value={form.profit_loss ?? ""}
                onChange={(e) => update("profit_loss", Number(e.target.value))}
                className="input"
              />
            </Field>
          </Grid>
        )}

        {tab === "Psychology" && (
          <Grid>
            <Field label="Emotional state (pre)">
              <input
                value={form.emotional_state_pre || ""}
                onChange={(e) => update("emotional_state_pre", e.target.value)}
                className="input"
              />
            </Field>

            <Field label="Emotional state (post)">
              <input
                value={form.emotional_state_post || ""}
                onChange={(e) => update("emotional_state_post", e.target.value)}
                className="input"
              />
            </Field>

            <Field label="Reason for entry">
              <textarea
                value={form.reason_for_entry || ""}
                onChange={(e) => update("reason_for_entry", e.target.value)}
                className="input h-24"
              />
            </Field>

            <Field label="Reason for exit">
              <textarea
                value={form.reason_for_exit || ""}
                onChange={(e) => update("reason_for_exit", e.target.value)}
                className="input h-24"
              />
            </Field>
          </Grid>
        )}

        {tab === "Review" && (
          <Grid>
            <Field label="Reviewed">
              <select
                value={String(form.reviewed)}
                onChange={(e) => update("reviewed", e.target.value === "true")}
                className="input"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </Field>

            <Field label="Lesson learned">
              <textarea
                value={form.review_notes || ""}
                onChange={(e) => update("review_notes", e.target.value)}
                className="input h-24"
              />
            </Field>
          </Grid>
        )}

        {tab === "Images" && (
          <div className="space-y-6">
            <EntryImageUploader trade={form} setTrade={setForm} />
            <ReviewImageUploader trade={form} setTrade={setForm} />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-zinc-800">
          <button onClick={remove} className="bg-red-600 px-3 py-1 rounded">
            Delete
          </button>

          <div className="space-x-2">
            <button onClick={onClose} className="bg-zinc-700 px-3 py-1 rounded">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={loading}
              className="bg-indigo-600 px-3 py-1 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-sm text-zinc-400 mb-1">{label}</div>
      {children}
    </div>
  );
}

function toLocal(d) {
  if (!d) return "";
  const date = new Date(d);
  const off = date.getTimezoneOffset();
  const local = new Date(date.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}
