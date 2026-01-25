import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TradesFilters from "./TradesFilters";

const EMPTY_FILTERS = {
  search: "",
  outcome: "",
  session: "",
  from: "",
  to: "",
  minPL: "",
  maxPL: "",
};

export default function TradesTable({ trades }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(true);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return trades.filter((t) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const hay = [t.symbol, t.strategy_type, t.pattern, t.reason_for_entry]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(s)) return false;
      }

      if (filters.outcome && t.outcome !== filters.outcome) return false;
      if (filters.session && t._session !== filters.session) return false;

      return true;
    });
  }, [trades, filters]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Trades</div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      {showFilters && (
        <TradesFilters
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 text-zinc-400">
            <tr>
              <th className="text-left px-3 py-2">Symbol</th>
              <th className="text-left px-3 py-2">Strategy</th>
              <th className="text-left px-3 py-2">Pattern</th>
              <th className="text-left px-3 py-2">Entry</th>
              <th className="text-left px-3 py-2">Exit</th>
              <th className="text-left px-3 py-2">Outcome</th>
              <th className="text-right px-3 py-2">P/L</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr
                key={t._id}
                onClick={() => {
                  // 🔒 asegurar cuenta correcta
                  localStorage.setItem("activeAccountId", t.account);
                  navigate(`/edit/${t._id}`);
                }}
                className="border-t border-zinc-800 hover:bg-zinc-800/40 cursor-pointer"
              >
                <td className="px-3 py-2">{t.symbol}</td>
                <td className="px-3 py-2">{t.strategy_type}</td>
                <td className="px-3 py-2">{t.pattern}</td>
                <td className="px-3 py-2">{t.entry_date?.slice(0, 16)}</td>
                <td className="px-3 py-2">
                  {t.exit_date?.slice(0, 16) || "—"}
                </td>
                <td className="px-3 py-2">{t.outcome || "—"}</td>
                <td
                  className={`px-3 py-2 text-right ${
                    Number(t.profit_loss) >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {t.profit_loss ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
