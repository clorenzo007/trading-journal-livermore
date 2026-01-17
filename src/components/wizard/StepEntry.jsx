export default function StepEntry({ form, updateField, next, back }) {
  const errors = [];

  if (!form.entry_date) errors.push("Falta la fecha de entrada.");
  if (!form.entry_price) errors.push("Falta el precio de entrada.");
  if (!form.position_size) errors.push("Falta el tamaño de posición.");

  const sizeWarning = form.position_size && Number(form.position_size) > 5;

  const canContinue = errors.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Entrada</h1>

      <div>
        <label className="text-sm text-zinc-400">Fecha y hora</label>
        <input
          type="datetime-local"
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          value={form.entry_date}
          onChange={(e) => updateField("entry_date", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Precio de entrada</label>
        <input
          type="number"
          step="any"
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          placeholder="Ej: 192.45"
          value={form.entry_price}
          onChange={(e) => updateField("entry_price", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Tamaño de posición</label>
        <input
          type="number"
          step="any"
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          placeholder="Ej: 1 lote, 100 acciones, etc"
          value={form.position_size}
          onChange={(e) => updateField("position_size", e.target.value)}
        />
      </div>

      {sizeWarning && (
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 p-3 rounded-xl text-sm">
          ⚠️ Tamaño de posición alto. Livermore prefería empezar pequeño.
        </div>
      )}

      {!canContinue && (
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
