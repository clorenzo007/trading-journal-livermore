export default function TradeTable({ trades, onSelect }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-800 text-zinc-400">
          <tr>
            <th className="text-left px-3 py-2">Símbolo</th>
            <th className="text-left px-3 py-2">Estrategia</th>
            <th className="text-left px-3 py-2">PnL</th>
            <th className="text-center px-3 py-2">Resultado</th>
            <th className="text-center px-3 py-2">Review</th>
            <th className="text-right px-3 py-2">Entrada</th>
            <th className="text-right px-3 py-2">Salida</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelect(t)}
              className="border-t border-zinc-800 hover:bg-zinc-800/40 cursor-pointer"
            >
              <td className="px-3 py-2 font-medium">{t.symbol}</td>
              <td className="px-3 py-2">{t.strategy_type}</td>

              <td
                className={`px-3 py-2 text-right ${
                  t.profit_loss > 0
                    ? "text-emerald-400"
                    : t.profit_loss < 0
                      ? "text-rose-400"
                      : "text-zinc-300"
                }`}
              >
                {t.profit_loss}
              </td>

              <td className="px-3 py-2 text-center">{t.outcome}</td>

              <td className="px-3 py-2 text-center">
                {t.reviewed ? (
                  <span className="px-2 py-1 rounded text-xs bg-emerald-900/40 text-emerald-400">
                    Reviewed
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded text-xs bg-zinc-700/40 text-zinc-300">
                    Pending
                  </span>
                )}
              </td>

              <td className="px-3 py-2 text-right">
                {formatDate(t.entry_date)}
              </td>

              <td className="px-3 py-2 text-right">
                {formatDate(t.exit_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString();
}
