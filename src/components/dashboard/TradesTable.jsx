import { useEffect, useMemo, useState } from "react";
import TradesFilters from "./TradesFilters";
import { getTrades, updateTrade, deleteTrade } from "../../api/trades";
import TradeDetailModal from "./TradeDetailModal";

const EMPTY_FILTERS = {
  search: "",
  outcome: "",
  session: "",
  from: "",
  to: "",
  minPL: "",
  maxPL: "",
};

export default function TradesTable() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getTrades();

      console.log("TRADES RAW:", data);

      if (Array.isArray(data)) {
        setTrades(data);
      } else if (Array.isArray(data.trades)) {
        setTrades(data.trades);
      } else {
        console.warn("Unexpected trades format", data);
        setTrades([]);
      }
    } catch (e) {
      console.error("Error loading trades", e);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  }

  const remove = async (id) => {
    if (!confirm("¿Eliminar trade?")) return;
    await deleteTrade(id);
    setTrades((prev) => prev.filter((t) => t._id !== id));
    setSelected(null);
  };

  const saveTrade = async (updated) => {
    const res = await updateTrade(updated._id, updated);
    setTrades((prev) => prev.map((t) => (t._id === updated._id ? res : t)));
  };

  const filtered = useMemo(() => {
    return trades.filter((t) => {
      // Search
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const hay = [t.symbol, t.strategy_type, t.pattern, t.reason_for_entry]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(s)) return false;
      }

      // Outcome
      if (filters.outcome && t.outcome !== filters.outcome) return false;

      // Session
      if (filters.session && t._session !== filters.session) return false;

      // From
      if (filters.from) {
        const d = new Date(t.entry_date);
        const f = new Date(filters.from);
        if (d < f) return false;
      }

      // To
      if (filters.to) {
        const d = new Date(t.entry_date);
        const to = new Date(filters.to);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }

      // Min PL
      if (filters.minPL !== "") {
        if (Number(t.profit_loss) < Number(filters.minPL)) return false;
      }

      // Max PL
      if (filters.maxPL !== "") {
        if (Number(t.profit_loss) > Number(filters.maxPL)) return false;
      }

      return true;
    });
  }, [trades, filters]);

  if (loading) {
    return <div className="p-6 text-zinc-400">Cargando trades…</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Trades</div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <TradesFilters
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      )}

      <div className="text-sm text-zinc-400">
        Mostrando {filtered.length} de {trades.length}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-400">
              <th className="text-left">Symbol</th>
              <th className="text-left">Strategy</th>
              <th className="text-left">Pattern</th>
              <th className="text-left">Entry</th>
              <th className="text-left">Exit</th>
              <th className="text-left">Outcome</th>
              <th className="text-right">P/L</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr
                key={t._id}
                onClick={() => setSelected(t)}
                className="border-t border-zinc-800 hover:bg-zinc-800/40 cursor-pointer"
              >
                <td className="px-2 py-1">{t.symbol}</td>
                <td className="px-2 py-1">{t.strategy_type}</td>
                <td className="px-2 py-1">{t.pattern}</td>
                <td className="px-2 py-1">{t.entry_date?.slice(0, 16)}</td>
                <td className="px-2 py-1">
                  {t.exit_date?.slice(0, 16) || "—"}
                </td>
                <td className="px-2 py-1">{t.outcome || "—"}</td>
                <td
                  className={`px-2 py-1 text-right ${
                    Number(t.profit_loss) >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {t.profit_loss}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center text-zinc-500 py-8">
            No hay trades que coincidan con los filtros.
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <TradeDetailModal
          trade={selected}
          onClose={() => setSelected(null)}
          onSave={saveTrade}
          onDelete={remove}
        />
      )}
    </div>
  );
}
