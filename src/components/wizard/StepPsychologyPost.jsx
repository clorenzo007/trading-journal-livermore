export default function StepPsychologyPost({ form, updateField, next, back }) {
  const errors = [];

  if (!form.emotional_state_post)
    errors.push("Falta el estado emocional posterior.");
  if (!form.reason_for_exit || form.reason_for_exit.length < 20)
    errors.push("La razón de salida debe tener al menos 20 caracteres.");
  if (!form.review_notes || form.review_notes.length < 30)
    errors.push("La reflexión debe tener al menos 30 caracteres.");

  const canContinue = errors.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Psicología — Post Trade</h1>

      <div>
        <label className="text-sm text-zinc-400">Estado emocional final</label>
        <select
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          value={form.emotional_state_post || ""}
          onChange={(e) => updateField("emotional_state_post", e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="Calm">Calmado</option>
          <option value="Confident">Confiado</option>
          <option value="Frustrated">Frustrado</option>
          <option value="Greedy">Codicioso</option>
          <option value="Fearful">Temeroso</option>
          <option value="Satisfied">Satisfecho</option>
          <option value="Disappointed">Decepcionado</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-zinc-400">
          Razón de salida (obligatoria)
        </label>
        <textarea
          rows={4}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 resize-none"
          placeholder="¿Por qué saliste? ¿Fue parte del plan o fue emocional?"
          value={form.reason_for_exit || ""}
          onChange={(e) => updateField("reason_for_exit", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">
          Reflexión / Lecciones aprendidas
        </label>
        <textarea
          rows={5}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 resize-none"
          placeholder="¿Qué hiciste bien? ¿Qué hiciste mal? ¿Qué repetirías? ¿Qué no?"
          value={form.review_notes || ""}
          onChange={(e) => updateField("review_notes", e.target.value)}
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
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-zinc-700 cursor-not-allowed"
          }`}
        >
          Finalizar →
        </button>
      </div>
    </div>
  );
}
