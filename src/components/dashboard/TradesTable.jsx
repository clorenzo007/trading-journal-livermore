import { useMemo, useState } from "react";
import { deleteTrades } from "../../api/trades";
import TradeDetailModal from "./TradeDetailModal";
import { Trash2, X, CheckSquare } from "lucide-react";

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
  // Column filters state
  const [colFilters, setColFilters] = useState({
    symbol: "",
    strategy: "",
    pattern: "",
    outcome: "",
    minPL: "",
    maxPL: "",
  });

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toggle selection for a single row
  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  // Toggle select all visible
  const toggleSelectAll = (visibleTrades) => {
    if (selectedIds.size === visibleTrades.length && visibleTrades.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleTrades.map((t) => t._id)));
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} trades?`)) return;
    setDeleting(true);
    try {
      await deleteTrades(Array.from(selectedIds));
      setSelectedIds(new Set());
      onRefresh();
    } catch (err) {
      alert("Error deleting trades");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    return trades.filter((t) => {
      // Symbol
      if (colFilters.symbol && !t.symbol.toLowerCase().includes(colFilters.symbol.toLowerCase())) return false;
      // Strategy
      if (colFilters.strategy && !t.strategy_type?.toLowerCase().includes(colFilters.strategy.toLowerCase())) return false;
      // Pattern
      if (colFilters.pattern && !t.pattern?.toLowerCase().includes(colFilters.pattern.toLowerCase())) return false;
      // Outcome
      if (colFilters.outcome && t.outcome !== colFilters.outcome) return false;
       // P/L
      if (colFilters.minPL && Number(t.profit_loss) < Number(colFilters.minPL)) return false;
      if (colFilters.maxPL && Number(t.profit_loss) > Number(colFilters.maxPL)) return false;

      return true;
    });
  }, [trades, colFilters]);

  // ===========================================================================
  // FILTER LOGIC
  // Based on the user's selection in TradesFilters
  // ===========================================================================
  // OLD LOGIC REMOVED

  return (
    <div className="space-y-4">
      {/* HEADER & TOGGLE FILTERS */}
      {/* FILTER COMPONENT REMOVED - Using Column Filters */}
      
      {/* FLOATING BULK ACTIONS BAR */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 backdrop-blur-md bg-opacity-90">
            <div className="flex items-center gap-3 pr-6 border-r border-zinc-800">
              <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-lg">
                <CheckSquare size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none">
                  {selectedIds.size} trades seleccionados
                </div>
                <button 
                  onClick={() => setSelectedIds(new Set())}
                  className="text-zinc-500 hover:text-white text-xs mt-1 transition-colors flex items-center gap-1"
                >
                  <X size={12} /> Cancelar selección
                </button>
              </div>
            </div>

            <button 
              onClick={handleBulkDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900/50 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-rose-900/20"
            >
              {deleting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
              {deleting ? "Eliminando..." : "Eliminar Registros"}
            </button>
          </div>
        </div>
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
              <th className="border-zinc-800 text-center" style={{ width: '50px' }}>
                <div className="flex flex-col items-center gap-1">
                  <Trash2 size={14} className="text-zinc-600" />
                  <input 
                      type="checkbox" 
                      className="form-check-input bg-zinc-800 border-zinc-600 m-0"
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      onChange={() => toggleSelectAll(filtered)}
                  />
                </div>
              </th>
              <th className="border-zinc-800">Img</th>
              <th className="border-zinc-800">
                <div>Symbol</div>
                <input 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500"
                    placeholder="Filter..."
                    value={colFilters.symbol}
                    onChange={e => setColFilters(prev => ({...prev, symbol: e.target.value}))}
                />
              </th>
              <th className="border-zinc-800">
                <div>Strategy</div>
                <input 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500"
                    placeholder="Filter..."
                    value={colFilters.strategy}
                    onChange={e => setColFilters(prev => ({...prev, strategy: e.target.value}))}
                />
              </th>
              <th className="border-zinc-800">
                <div>Pattern</div>
                 <input 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500"
                    placeholder="Filter..."
                    value={colFilters.pattern}
                    onChange={e => setColFilters(prev => ({...prev, pattern: e.target.value}))}
                />
              </th>
              <th className="border-zinc-800">Entry</th>
              <th className="border-zinc-800">R:R</th>
              <th className="border-zinc-800 d-none d-lg-table-cell">Exit</th>
              <th className="border-zinc-800">
                <div>Outcome</div>
                <select 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500"
                    value={colFilters.outcome}
                    onChange={e => setColFilters(prev => ({...prev, outcome: e.target.value}))}
                >
                    <option value="">All</option>
                    <option value="Win">Win</option>
                    <option value="Loss">Loss</option>
                    <option value="BreakEven">BreakEven</option>
                    <option value="Open">Open</option>
                </select>
              </th>
              <th className="border-zinc-800 text-end">
                <div>P/L</div>
                 <div className="flex gap-1 mt-1">
                    <input 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Min"
                        type="number"
                        value={colFilters.minPL}
                        onChange={e => setColFilters(prev => ({...prev, minPL: e.target.value}))}
                    />
                     <input 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Max"
                        type="number"
                        value={colFilters.maxPL}
                        onChange={e => setColFilters(prev => ({...prev, maxPL: e.target.value}))}
                    />
                 </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr
                key={t._id}
                onClick={() => setSelected(t)}
                className="cursor-pointer"
              >
                <td className="border-zinc-800" onClick={(e) => e.stopPropagation()}>
                    <input 
                        type="checkbox" 
                        className="form-check-input bg-zinc-800 border-zinc-600"
                        checked={selectedIds.has(t._id)}
                        onChange={() => toggleSelect(t._id)}
                    />
                </td>

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
                <td className="border-zinc-800 text-indigo-400 font-medium">
                  {t.rr_ratio ? `1:${t.rr_ratio}` : "—"}
                </td>
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
               <div className="col-12 mt-2 pt-2 border-t border-zinc-800 flex justify-between items-center">
                 <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Risk : Reward</span>
                 <span className="text-indigo-400 font-black">1 : {t.rr_ratio || "0.00"}</span>
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
