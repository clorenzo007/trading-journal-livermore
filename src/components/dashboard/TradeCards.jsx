export default function TradeCards({ trades, onSelect }) {
  return (
    <div className="space-y-3">
      {trades.map((t) => (
        <div
          key={t._id}
          onClick={() => onSelect(t)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2 cursor-pointer hover:bg-zinc-800/40"
        >
          <div className="flex justify-between items-center">
            <div className="font-semibold">{t.symbol}</div>
            <div
              className={
                t.profit_loss > 0
                  ? "text-emerald-400"
                  : t.profit_loss < 0
                    ? "text-rose-400"
                    : "text-zinc-300"
              }
            >
              {t.profit_loss}
            </div>
          </div>

          <div className="text-xs text-zinc-400">{t.strategy_type}</div>

          <div className="flex justify-between items-center text-xs">
            <div>
              {formatDate(t.entry_date)} → {formatDate(t.exit_date)}
            </div>

            <span
              className={`px-2 py-1 rounded ${
                t.reviewed
                  ? "bg-emerald-900/40 text-emerald-400"
                  : "bg-zinc-700/40 text-zinc-300"
              }`}
            >
              {t.reviewed ? "Reviewed" : "Pending"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString();
}
