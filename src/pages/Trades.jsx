import { useEffect, useState } from "react";
import { getTrades } from "../api/trades";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

/**
 * Trades List Page.
 * Displays a simple, full-page list of all trades.
 * (Note: Simple alternative to the Dashboard's featured table).
 */
export default function Trades() {
  const [trades, setTrades] = useState([]);
  const navigate = useNavigate();
  const { t: tr } = useLanguage();

  useEffect(() => {
    getTrades().then(setTrades);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">{tr("Trades")}</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-800 text-zinc-400">
            <tr>
              <th className="p-2 text-left">{tr("Symbol")}</th>
              <th className="p-2 text-left">{tr("Entry")}</th>
              <th className="p-2 text-left">{tr("Outcome")}</th>
              <th className="p-2 text-right">P/L</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((t) => (
              <tr
                key={t._id}
                onClick={() => navigate(`/trades/${t._id}`)}
                className="border-t border-zinc-800 hover:bg-zinc-800 cursor-pointer"
              >
                <td className="p-2">{t.symbol}</td>
                <td className="p-2">{t.entry_date?.slice(0, 16)}</td>
                <td className="p-2">{t.outcome ? tr(t.outcome) : "—"}</td>
                <td
                  className={`p-2 text-right ${t.profit_loss >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {t.profit_loss}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
