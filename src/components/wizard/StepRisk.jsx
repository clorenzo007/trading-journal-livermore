export default function StepRisk({ form, updateField, next, back }) {
  const errors = [];

  const entry = Number(form.entry_price);
  const stop = Number(form.stop_loss);
  const size = Number(form.position_size);

  let riskPerUnit = null;
  let totalRisk = null;
  let rr = null;

  if (entry && stop && size) {
    riskPerUnit = Math.abs(entry - stop);
    totalRisk = riskPerUnit * size;
  }

  if (!form.stop_loss) errors.push("Falta el Stop Loss.");
  if (!form.risk_percent) errors.push("Falta el riesgo por trade (%).");

  const riskPercent = Number(form.risk_percent);
  const riskWarning = riskPercent > 2;
  const riskDanger = riskPercent > 5;

  const canContinue = errors.length === 0 && !riskDanger;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Gestión de Riesgo</h1>

      <div>
        <label className="text-sm text-zinc-400">Stop Loss</label>
        <input
          type="number"
          step="any"
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          placeholder="Precio donde salís si estás equivocado"
          value={form.stop_loss || ""}
          onChange={(e) => updateField("stop_loss", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Riesgo por trade (%)</label>
        <input
          type="number"
          step="any"
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          placeholder="Ej: 1"
          value={form.risk_percent || ""}
          onChange={(e) => updateField("risk_percent", e.target.value)}
        />
      </div>

      {riskWarning && !riskDanger && (
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 p-3 rounded-xl text-sm">
          ⚠️ Riesgo alto. Livermore prefería riesgo pequeño y repetible.
        </div>
      )}

      {riskDanger && (
        <div className="bg-rose-900/40 border border-rose-700 text-rose-300 p-3 rounded-xl text-sm">
          ❌ Riesgo excesivo. Esto viola principios Livermore.
        </div>
      )}

      {riskPerUnit && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm space-y-1">
          <div>Riesgo por unidad: {riskPerUnit.toFixed(2)}</div>
          <div>Riesgo total: {totalRisk.toFixed(2)}</div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-rose-900/40 border border-rose-700 text-rose-300 p-3 rounded-xl text-sm">
          <ul className="list-disc pl-5">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={back}
          className="flex-1 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700"
        >
          ← Volver
        </button>

        <button
          disabled={!canContinue}
          onClick={next}
          className={`flex-1 h-12 rounded-xl font-medium ${
            canContinue
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-zinc-700 cursor-not-allowed"
          }`}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
