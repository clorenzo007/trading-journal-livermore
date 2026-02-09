/**
 * Advanced Filters Panel.
 * Provides global filters for the dashboard (Search, Outcome, Session, Date Range, P/L Range).
 */
export default function TradesFilters({ value, onChange, onReset }) {
  const update = (k, v) => {
    onChange((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search */}
        <input
          placeholder="Buscar…"
          value={value.search}
          onChange={(e) => update("search", e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
        />

        {/* Outcome */}
        <select
          value={value.outcome}
          onChange={(e) => update("outcome", e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
        >
          <option value="">Outcome (todos)</option>
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
          <option value="Break-even">Break-even</option>
        </select>

        {/* Session */}
        <select
          value={value.session}
          onChange={(e) => update("session", e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
        >
          <option value="">Session (todas)</option>
          <option value="Asia">Asia</option>
          <option value="London">London</option>
          <option value="NY">NY</option>
          <option value="Europe">Europe</option>
          <option value="Other">Other</option>
        </select>

        {/* From date */}
        <input
          type="date"
          value={value.from}
          onChange={(e) => update("from", e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
        />

        {/* To date */}
        <input
          type="date"
          value={value.to}
          onChange={(e) => update("to", e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
        />

        {/* Reset */}
        <button
          onClick={onReset}
          className="bg-zinc-800 hover:bg-zinc-700 rounded px-3 py-2 text-sm"
        >
          Reset filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Min PL */}
        <input
          type="number"
          placeholder="P/L min"
          value={value.minPL}
          onChange={(e) => update("minPL", e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
        />

        {/* Max PL */}
        <input
          type="number"
          placeholder="P/L max"
          value={value.maxPL}
          onChange={(e) => update("maxPL", e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
