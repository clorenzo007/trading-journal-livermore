export default function TradeFilters({
  symbol,
  setSymbol,
  outcome,
  setOutcome,
  sort,
  setSort,
  reviewed,
  setReviewed,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-base sm:text-sm"
        placeholder="Filtrar por símbolo"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />

      <select
        className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-base sm:text-sm"
        value={outcome}
        onChange={(e) => setOutcome(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="Win">Win</option>
        <option value="Loss">Loss</option>
        <option value="Break-even">Break-even</option>
      </select>

      <select
        className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-base sm:text-sm"
        value={reviewed}
        onChange={(e) => setReviewed(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="true">Reviewed</option>
        <option value="false">Pending</option>
      </select>

      <select
        className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-base sm:text-sm"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="desc">Más recientes</option>
        <option value="asc">Más antiguos</option>
      </select>
    </div>
  );
}
