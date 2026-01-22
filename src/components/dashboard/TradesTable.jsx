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

export default function TradesTable({ trades }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(true);
  const [selected, setSelected] = useState(null);

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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t._id}
                onClick={() => {
                  console.log("CLICK FROM TABLE:", t);
                  console.log("CLICK FROM TABLE _id:", t?._id);
                  setSelected({ ...t });
                }}
                className="border-t border-zinc-800 hover:bg-zinc-800/40 cursor-pointer"
              >
                <td className="px-2 py-1">{t.symbol}</td>
                <td className="px-2 py-1">{t.strategy_type}</td>
                <td className="px-2 py-1">{t.pattern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <TradeDetailModal trade={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
