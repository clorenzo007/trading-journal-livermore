export default function StepPsychologyPre({ form, updateField, next, back }) {
  const errors = [];

  if (!form.emotional_state_pre) errors.push("Falta el estado emocional.");
  if (!form.reason_for_entry || form.reason_for_entry.length < 20)
    errors.push("La razón de entrada debe tener al menos 20 caracteres.");

  const canContinue = errors.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Psicología — Antes del trade</h1>

      <div>
        <label className="text-sm text-zinc-400">Estado emocional</label>
        <select
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          value={form.emotional_state_pre || ""}
          onChange={(e) => updateField("emotional_state_pre", e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="Calm">Calmado</option>
          <option value="Confident">Confiado</option>
          <option value="Fearful">Temeroso</option>
          <option value="Greedy">Codicioso</option>
          <option value="Hesitant">Dudoso</option>
          <option value="Overconfident">Sobreconfiado</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-zinc-400">
          Razón de entrada (obligatoria)
        </label>
        <textarea
          rows={5}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 resize-none"
          placeholder="¿Por qué este trade es válido? ¿Qué viste? ¿Qué condiciones se cumplen?"
          value={form.reason_for_entry || ""}
          onChange={(e) => updateField("reason_for_entry", e.target.value)}
        />
      </div>

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
