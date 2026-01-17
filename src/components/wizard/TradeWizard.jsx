import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createTrade, updateTrade, getTradeById } from "../../api/trades";

import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";

const EMPTY_TRADE = {
  symbol: "",
  strategy_type: "",
  pattern: "",
  entry_date: "",
  entry_price: "",
  exit_date: "",
  exit_price: "",
  stop_loss: "",
  risk_percent: "",
  outcome: "",
  profit_loss: "",
  reason_for_entry: "",
};

export default function TradeWizard() {
  const { id } = useParams(); // si existe → EDIT
  const isEdit = Boolean(id);

  const navigate = useNavigate();
  const [trade, setTrade] = useState(EMPTY_TRADE);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // ======================
  // LOAD TRADE (EDIT)
  // ======================
  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        const data = await getTradeById(id);
        setTrade({
          ...EMPTY_TRADE,
          ...data,
        });
      } catch (e) {
        alert("Error cargando trade");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, isEdit, navigate]);

  const update = (k, v) => {
    setTrade((t) => ({ ...t, [k]: v }));
  };

  // ======================
  // SAVE
  // ======================
  const save = async () => {
    try {
      setSaving(true);

      if (isEdit) {
        await updateTrade(trade._id, trade);
      } else {
        await createTrade(trade);
      }

      navigate("/dashboard");
    } catch (e) {
      alert("Error guardando trade");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-zinc-400">Cargando trade…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Editar trade" : "Nuevo trade"}
      </h1>

      {/* ===== BASIC ===== */}
      <Card title="Datos básicos">
        <Field label="Símbolo">
          <input
            value={trade.symbol}
            onChange={(e) => update("symbol", e.target.value)}
          />
        </Field>

        <Field label="Estrategia">
          <input
            value={trade.strategy_type}
            onChange={(e) => update("strategy_type", e.target.value)}
          />
        </Field>

        <Field label="Pattern">
          <input
            value={trade.pattern}
            onChange={(e) => update("pattern", e.target.value)}
          />
        </Field>
      </Card>

      {/* ===== PRICES ===== */}
      <Card title="Precios y riesgo">
        <Field label="Entry date">
          <input
            type="datetime-local"
            value={trade.entry_date || ""}
            onChange={(e) => update("entry_date", e.target.value)}
          />
        </Field>

        <Field label="Entry price">
          <input
            type="number"
            value={trade.entry_price}
            onChange={(e) => update("entry_price", e.target.value)}
          />
        </Field>

        <Field label="Exit date">
          <input
            type="datetime-local"
            value={trade.exit_date || ""}
            onChange={(e) => update("exit_date", e.target.value)}
          />
        </Field>

        <Field label="Exit price">
          <input
            type="number"
            value={trade.exit_price}
            onChange={(e) => update("exit_price", e.target.value)}
          />
        </Field>

        <Field label="Stop loss">
          <input
            type="number"
            value={trade.stop_loss}
            onChange={(e) => update("stop_loss", e.target.value)}
          />
        </Field>

        <Field label="Risk %">
          <input
            type="number"
            value={trade.risk_percent}
            onChange={(e) => update("risk_percent", e.target.value)}
          />
        </Field>
      </Card>

      {/* ===== OUTCOME ===== */}
      <Card title="Resultado">
        <Field label="Outcome (manual)">
          <select
            value={trade.outcome || ""}
            onChange={(e) => update("outcome", e.target.value)}
          >
            <option value="">—</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="breakeven">Breakeven</option>
          </select>
        </Field>

        <Field label="P / L">
          <input
            type="number"
            value={trade.profit_loss}
            onChange={(e) => update("profit_loss", e.target.value)}
          />
        </Field>
      </Card>

      {/* ===== NOTES ===== */}
      <Card title="Notas">
        <textarea
          className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
          value={trade.reason_for_entry || ""}
          onChange={(e) => update("reason_for_entry", e.target.value)}
        />
      </Card>

      {/* ===== IMAGES ===== */}
      {isEdit && (
        <Card title="Imágenes">
          <EntryImageUploader trade={trade} setTrade={setTrade} />
          <ReviewImageUploader trade={trade} setTrade={setTrade} />
        </Card>
      )}

      {/* ===== ACTIONS ===== */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 rounded bg-zinc-700"
        >
          Cancelar
        </button>

        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}

/* ======================
   UI HELPERS
====================== */

function Card({ title, children }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
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
