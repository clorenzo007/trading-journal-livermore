export default function StepExit({ form, updateField, next, back }) {
  const errors = [];

  if (!form.exit_date) errors.push("Falta la fecha de salida.");
  if (!form.exit_price) errors.push("Falta el precio de salida.");

  const entry = Number(form.entry_price);
  const exit = Number(form.exit_price);
  const size = Number(form.position_size);

  let pnl = null;
  let outcome = null;

  if (entry && exit && size) {
    pnl = (exit - entry) * size;
    if (pnl > 0) outcome = "Win";
    if (pnl < 0) outcome = "Loss";
    if (pnl === 0) outcome = "Break-even";
  }

  const canContinue = errors.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Salida del trade</h1>

      <div>
        <label className="text-sm text-zinc-400">Fecha y hora de salida</label>
        <input
          type="datetime-local"
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          value={form.exit_date || ""}
          onChange={(e) => updateField("exit_date", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Precio de salida</label>
        <input
          type="number"
          step="any"
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          placeholder="Ej: 198.50"
          value={form.exit_price || ""}
          onChange={(e) => updateField("exit_price", e.target.value)}
        />
      </div>

      {pnl !== null && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm space-y-1">
          <div>
            <b>Resultado:</b>{" "}
            <span
              className={
                outcome === "Win"
                  ? "text-emerald-400"
                  : outcome === "Loss"
                  ? "text-rose-400"
                  : "text-zinc-300"
              }
            >
              {outcome}
            </span>
          </div>
          <div>
            <b>PnL:</b>{" "}
            <span
              className={
                pnl > 0
                  ? "text-emerald-400"
                  : pnl < 0
                  ? "text-rose-400"
                  : "text-zinc-300"
              }
            >
              {pnl.toFixed(2)}
            </span>
          </div>
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
          onClick={() => {
            if (pnl !== null) {
              updateField("profit_loss", pnl);
              updateField("outcome", outcome);
            }
            next();
          }}
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
