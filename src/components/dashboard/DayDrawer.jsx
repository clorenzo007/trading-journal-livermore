import { useState } from "react";
import TradeDetailModal from "./TradeDetailModal";
import useDailyStats from "../../hooks/useDailyStats";
import { formatNYSEDate } from "../../utils/formatDate";
import { useLanguage } from "../../context/LanguageContext";

function formatDateHuman(dateStr) {
  return formatNYSEDate(dateStr, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Day Detail Drawer.
 * Slides in from the right to show all trades for a specific day.
 * 
 * Features:
 * - Daily stats summary (P/L, Winrate, etc.).
 * - List of trades for that day.
 * - Navigation to prev/next day.
 * - Opens TradeDetailModal for specific trade inspection.
 */
export default function DayDrawer({
  day,
  trades,
  onClose,
  onPrevDay,
  onNextDay,
  onRefresh,
}) {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const stats = useDailyStats(trades);
  const { t: tr } = useLanguage();

  function statCard(label, value, color = "text-zinc-200") {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
        <div className="text-xs text-zinc-400">{tr(label)}</div>
        <div className={`text-lg font-semibold ${color}`}>{value}</div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-[560px] bg-zinc-950 border-l border-zinc-800 z-[1050] p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-xs text-zinc-400">{tr("Trades for")}</div>
            <div className="text-lg font-semibold">{formatDateHuman(day)}</div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
          >
            {tr("Close")}
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {statCard(
            "Total P/L",
            stats.profitTotal.toFixed(2),
            stats.profitTotal >= 0 ? "text-emerald-400" : "text-rose-400",
          )}
          {statCard("Trades", stats.tradeCount)}
          {statCard("Winrate", `${stats.winrate.toFixed(1)}%`)}
          {statCard("Avg Win", stats.avgWin.toFixed(2), "text-emerald-400")}
          {statCard("Avg Loss", stats.avgLoss.toFixed(2), "text-rose-400")}
          {statCard(
            "Expectancy",
            stats.expectancy.toFixed(2),
            stats.expectancy >= 0 ? "text-emerald-400" : "text-rose-400",
          )}
          {statCard("Avg R", stats.avgR.toFixed(2))}
          {statCard(
            "Best trade",
            stats.bestTrade ? stats.bestTrade.profit_loss : "—",
            "text-emerald-400",
          )}
          {statCard(
            "Worst trade",
            stats.worstTrade ? stats.worstTrade.profit_loss : "—",
            "text-rose-400",
          )}
        </div>

        {/* Trades list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {trades.length === 0 && (
            <div className="text-zinc-500 text-sm">{tr("No trades this day.")}</div>
          )}

          {trades.map((t) => (
            <div
              key={t._id}
              onClick={() => setSelectedTrade(t)}
              className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{t.symbol}</div>
                  <div className="text-xs text-zinc-400">
                    {t.strategy_type} · {t.pattern}
                  </div>
                </div>

                <div
                  className={
                    Number(t.profit_loss) >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                >
                  {t.profit_loss}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onPrevDay}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
          >
            ← {tr("Previous")}
          </button>
          <button
            onClick={onNextDay}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
          >
            {tr("Next")} →
          </button>
        </div>
      </div>

      {selectedTrade && (
        <TradeDetailModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}
