export default function StepIdentity({ form, updateField, next }) {
  const errors = [];

  if (!form.symbol) errors.push("Falta el símbolo.");
  if (!form.strategy_type) errors.push("Falta la estrategia.");
  if (!form.pattern) errors.push("Falta el patrón.");

  const canContinue = errors.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Identidad del trade</h1>

      <div>
        <label className="text-sm text-zinc-400">Símbolo</label>
        <input
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          placeholder="AAPL, BTCUSDT, XAUUSD..."
          value={form.symbol}
          onChange={(e) => updateField("symbol", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Tipo de estrategia</label>
        <select
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          value={form.strategy_type}
          onChange={(e) => updateField("strategy_type", e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="Breakout">Breakout</option>
          <option value="Reversal">Reversal</option>
          <option value="Continuation">Continuation</option>
          <option value="Range">Range</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-zinc-400">Patrón (Livermore)</label>
        <select
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl px-4"
          value={form.pattern}
          onChange={(e) => updateField("pattern", e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="Pivotal Point">Pivotal Point</option>
          <option value="Consolidation Breakout">Consolidation Breakout</option>
          <option value="Spring">Spring</option>
          <option value="Shakeout">Shakeout</option>
        </select>
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

      <button
        disabled={!canContinue}
        onClick={next}
        className={`w-full h-12 rounded-xl font-medium ${
          canContinue
            ? "bg-blue-600 hover:bg-blue-500"
            : "bg-zinc-700 cursor-not-allowed"
        }`}
      >
        Continuar →
      </button>
    </div>
  );
}
