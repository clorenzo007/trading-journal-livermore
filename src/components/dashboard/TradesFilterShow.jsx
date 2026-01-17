export default function TradesFiltersRow({ filters, setFilters }) {
  const set = (k, v) => {
    setFilters((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <tr className="border-t border-zinc-800 bg-zinc-900/40">
      <th>
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs"
          placeholder="Symbol"
          value={filters.symbol || ""}
          onChange={(e) => set("symbol", e.target.value)}
        />
      </th>

      <th>
        <select
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs"
          value={filters.strategy_type || ""}
          onChange={(e) => set("strategy_type", e.target.value)}
        >
          <option value="">All</option>
          <option value="breakout">Breakout</option>
          <option value="reversal">Reversal</option>
          <option value="scalp">Scalp</option>
        </select>
      </th>

      <th>
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs"
          placeholder="Pattern"
          value={filters.pattern || ""}
          onChange={(e) => set("pattern", e.target.value)}
        />
      </th>

      <th>
        <input
          type="date"
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs"
          value={filters.fromEntry || ""}
          onChange={(e) => set("fromEntry", e.target.value)}
        />
      </th>

      <th />

      <th>
        <input
          type="date"
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs"
          value={filters.toEntry || ""}
          onChange={(e) => set("toEntry", e.target.value)}
        />
      </th>

      <th />

      <th />

      <th />

      <th>
        <select
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs"
          value={filters.outcome || ""}
          onChange={(e) => set("outcome", e.target.value)}
        >
          <option value="">All</option>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
          <option value="breakeven">BE</option>
        </select>
      </th>

      <th className="flex gap-1">
        <input
          type="number"
          placeholder="Min"
          className="w-1/2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs"
          value={filters.minPL || ""}
          onChange={(e) => set("minPL", e.target.value)}
        />
        <input
          type="number"
          placeholder="Max"
          className="w-1/2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs"
          value={filters.maxPL || ""}
          onChange={(e) => set("maxPL", e.target.value)}
        />
      </th>

      <th />

      <th />
    </tr>
  );
}
