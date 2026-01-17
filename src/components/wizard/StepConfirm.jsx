export default function StepConfirm({ form, next, back }) {
  const violations = [];

  if (!form.pattern) violations.push("No definiste un patrón.");
  if (!form.stop_loss) violations.push("No definiste stop.");
  if (Number(form.risk_percent) > 5) violations.push("Riesgo mayor al 5%.");
  if (!form.reason_for_entry || form.reason_for_entry.length < 20)
    violations.push("Razón de entrada débil o inexistente.");

  const criticalViolations = violations.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Confirmación Pre-Trade</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2 text-sm">
        <div>
          <b>Símbolo:</b> {form.symbol}
        </div>
        <div>
          <b>Estrategia:</b> {form.strategy_type}
        </div>
        <div>
          <b>Patrón:</b> {form.pattern}
        </div>
        <div>
          <b>Entrada:</b> {form.entry_price}
        </div>
        <div>
          <b>Tamaño:</b> {form.position_size}
        </div>
        <div>
          <b>Stop:</b> {form.stop_loss}
        </div>
        <div>
          <b>Riesgo %:</b> {form.risk_percent}
        </div>
        <div>
          <b>Estado emocional:</b> {form.emotional_state_pre}
        </div>
      </div>

      {criticalViolations && (
        <div className="bg-rose-900/40 border border-rose-700 text-rose-300 p-3 rounded-xl text-sm">
          <b>Violaciones Livermore:</b>
          <ul className="list-disc pl-5 mt-1">
            {violations.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      {!criticalViolations && (
        <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-300 p-3 rounded-xl text-sm">
          ✔ Este trade cumple las reglas básicas de disciplina.
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
          disabled={criticalViolations}
          onClick={next}
          className={`flex-1 h-12 rounded-xl font-medium ${
            !criticalViolations
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-zinc-700 cursor-not-allowed"
          }`}
        >
          Confirmar Trade →
        </button>
      </div>
    </div>
  );
}
