import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTradeById, reviewTrade } from "../api/trades";
import ReviewImageUploader from "../components/ReviewImageUploader";

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    score: 3,
    followedPlan: true,
    ruleBroken: "",
    lesson: "",
    wouldRepeat: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getTradeById(id);

        if (data.reviewed) {
          alert("Este trade ya fue revisado.");
          navigate("/dashboard");
          return;
        }

        setTrade(data);
      } catch (err) {
        alert("Error cargando trade");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, navigate]);

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await reviewTrade(id, form);
      navigate("/dashboard");
    } catch {
      alert("Error guardando review");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-zinc-400">Cargando...</div>;
  }

  if (!trade) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Review — {trade.symbol}</h1>
        <p className="text-zinc-400 text-sm">
          {trade.strategy_type} · {trade.pattern}
        </p>
      </div>

      {/* Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        {/* Score */}
        <div>
          <label className="text-sm text-zinc-400">Score</label>
          <input
            type="range"
            min="1"
            max="5"
            value={form.score}
            onChange={(e) => update("score", Number(e.target.value))}
            className="w-full mt-2"
          />
          <div className="text-sm text-zinc-400 mt-1">{form.score} / 5</div>
        </div>

        {/* Toggles */}
        <Toggle
          label="¿Seguí mi plan?"
          value={form.followedPlan}
          onChange={(v) => update("followedPlan", v)}
        />

        <Toggle
          label="¿Lo repetiría?"
          value={form.wouldRepeat}
          onChange={(v) => update("wouldRepeat", v)}
        />

        {/* Rule broken */}
        <Field label="Regla rota (si hubo)">
          <input
            value={form.ruleBroken}
            onChange={(e) => update("ruleBroken", e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
          />
        </Field>

        {/* Lesson */}
        <Field label="Lección aprendida">
          <textarea
            value={form.lesson}
            onChange={(e) => update("lesson", e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 h-24"
          />
        </Field>

        {/* Imagen de review */}
        <div className="border-t border-zinc-800 pt-4">
          <ReviewImageUploader trade={trade} setTrade={setTrade} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
          >
            {saving ? "Guardando..." : "Guardar review"}
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

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-zinc-400">{label}</div>
      <button
        onClick={() => onChange(!value)}
        className={`px-3 py-1 rounded text-sm ${
          value
            ? "bg-emerald-600/20 text-emerald-400"
            : "bg-zinc-700 text-zinc-300"
        }`}
      >
        {value ? "Sí" : "No"}
      </button>
    </div>
  );
}
