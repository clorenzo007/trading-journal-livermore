import { useMemo, useState } from "react";
import TradesFilters from "./TradesFilters";
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

/**
 * Trades Table Component.
 * Displays a filtered list of trades in a table format (desktop) or card list (mobile).
 * 
 * Features:
 * - Filter logic (Search, Outcome, Session, Date, P/L).
 * - Sortable columns (implied).
 * - Responsive design (Table vs Cards).
 * - Opens TradeDetailModal on row click.
 */
export default function TradesTable({ trades = [], onRefresh }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(true);
  const [selected, setSelected] = useState(null);

  // ===========================================================================
  // FILTER LOGIC
  // Based on the user's selection in TradesFilters
  // ===========================================================================
  const filtered = useMemo(() => {
    return trades.filter((t) => {
      // 1. Search by text (Symbol, Strategy, Pattern, Reason)
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const hay = [t.symbol, t.strategy_type, t.pattern, t.reason_for_entry]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(s)) return false;
      }

      // 2. Exact match filters
      if (filters.outcome && t.outcome !== filters.outcome) return false;
      if (filters.session && t._session !== filters.session) return false;

      // 3. Date range filters
      if (filters.from) {
        const d = new Date(t.entry_date);
        const f = new Date(filters.from);
        if (d < f) return false;
      }

      if (filters.to) {
        const d = new Date(t.entry_date);
        const to = new Date(filters.to);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }

      // 4. P/L Range filters
      if (filters.minPL !== "") {
        if (Number(t.profit_loss) < Number(filters.minPL)) return false;
      }

      if (filters.maxPL !== "") {
        if (Number(t.profit_loss) > Number(filters.maxPL)) return false;
      }

      return true;
    });
  }, [trades, filters]);

  return (
    <div className="space-y-4">
      {/* HEADER & TOGGLE FILTERS */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Trades</div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      {/* FILTER COMPONENT */}
      {showFilters && (
        <TradesFilters
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      )}

      {/* RESULTS COUNT */}
      <div className="text-sm text-zinc-400">
        Mostrando {filtered.length} de {trades.length}
      </div>

      {/* =========================================================================
          DESKTOP VIEW (d-md-block)
          Standard table for larger screens
         ========================================================================= */}
      <div className="table-responsive bg-zinc-900 border border-zinc-800 rounded-xl p-0 p-md-3 d-none d-md-block">
        <table className="table table-dark table-hover mb-0 align-middle">
          <thead>
            <tr className="text-zinc-400">
              <th className="border-zinc-800">Img</th>
              <th className="border-zinc-800">Symbol</th>
              <th className="border-zinc-800">Strategy</th>
              <th className="border-zinc-800">Pattern</th>
              <th className="border-zinc-800">Entry</th>
              <th className="border-zinc-800 d-none d-lg-table-cell">Exit</th>
              <th className="border-zinc-800">Outcome</th>
              <th className="border-zinc-800 text-end">P/L</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr
                key={t._id}
                onClick={() => setSelected(t)}
                className="cursor-pointer"
              >
                {/* Entry Image Thumbnail */}
                <td className="border-zinc-800">
                  {t.entryImage?.url ? (
                    <img
                      src={t.entryImage.url}
                      alt=""
                      className="rounded"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(t.entryImage.url);
                      }}
                    />
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>

                <td className="border-zinc-800">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold">{t.symbol}</span>
                  </div>
                </td>

                <td className="border-zinc-800">{t.strategy_type}</td>
                <td className="border-zinc-800">{t.pattern}</td>
                <td className="border-zinc-800 text-nowrap">{t.entry_date?.slice(0, 16)}</td>
                <td className="border-zinc-800 text-nowrap d-none d-lg-table-cell">
                  {t.exit_date?.slice(0, 16) || "—"}
                </td>
                <td className="border-zinc-800">
                  <span className={`badge ${t.outcome === 'Win' ? 'bg-success' : t.outcome === 'Loss' ? 'bg-danger' : 'bg-secondary'}`}>
                    {t.outcome || "—"}
                  </span>
                </td>
                <td
                  className={`border-zinc-800 text-end fw-bold ${
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

      {/* =========================================================================
          MOBILE VIEW (d-md-none)
          Card layout for smaller screens (< 768px)
         ========================================================================= */}
      <div className="d-md-none space-y-3">
        {filtered.map((t) => (
          <div
            key={t._id}
            onClick={() => setSelected(t)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-sm cursor-pointer hover:border-zinc-700 transition-colors"
          >
            {/* Card Header: Image + Symbol + P/L */}
            <div className="d-flex justify-content-between align-items-center mb-3">
             <div className="d-flex align-items-center gap-3">
                {t.entryImage?.url ? (
                    <img
                      src={t.entryImage.url}
                      alt=""
                      className="rounded"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(t.entryImage.url);
                      }}
                    />
                  ) : (
                    <div className="bg-zinc-800 rounded d-flex align-items-center justify-content-center text-zinc-600" style={{ width: '40px', height: '40px' }}>
                       <span className="small">img</span>
                    </div>
                  )}
                 <div>
                    <div className="fw-bold text-white">{t.symbol}</div>
                    <div className="text-xs text-zinc-400">{t.entry_date?.slice(0, 10)}</div>
                 </div>
             </div>
             <div className="text-end">
                <span className={`badge ${t.outcome === 'Win' ? 'bg-success' : t.outcome === 'Loss' ? 'bg-danger' : 'bg-secondary'} mb-1 d-block`}>
                    {t.outcome || "Open"}
                </span>
                <div className={`fw-bold ${Number(t.profit_loss) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                   {t.profit_loss}
                </div>
             </div>
            </div>

            {/* Card Body: Details Grid */}
            <div className="row g-2 text-sm text-zinc-300">
               <div className="col-6">
                 <span className="text-zinc-500 d-block text-xs">Strategy</span>
                 {t.strategy_type || "—"}
               </div>
               <div className="col-6">
                 <span className="text-zinc-500 d-block text-xs">Pattern</span>
                 {t.pattern || "—"}
               </div>
               {t.exit_date && (
                <div className="col-12 border-t border-zinc-800 pt-2 mt-2">
                   <span className="text-zinc-500 d-block text-xs">Exit Date</span>
                   {t.exit_date?.slice(0, 16)}
                </div>
               )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-zinc-500 py-8">
            No trades found.
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <TradeDetailModal
          trade={selected}
          onClose={() => setSelected(null)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}
