import { useEffect } from "react";
import WizardCard from "./WizardCard";
import { useLanguage } from "../../context/LanguageContext";

// 👉 Fecha y hora LOCAL en formato datetime-local
function nowLocalDatetime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

/**
 * Wizard Step: Entry Details.
 * Captures Entry Date, Price, and Position Size.
 */
export default function StepEntry({
  trade,
  setTrade,
  onNext,
  onBack,
  onCancel,
}) {
  const { t } = useLanguage();
  // 🔥 Setear fecha/hora actual SOLO al montar
  useEffect(() => {
    if (!trade.entry_date) {
      setTrade({ entry_date: nowLocalDatetime() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const price = Number(trade.entry_price);
  const size = Number(trade.position_size);

  const isValid =
    trade.entry_date && !isNaN(price) && price > 0 && !isNaN(size) && size > 0;

  return (
    <WizardCard title="Entry" onCancel={onCancel}>
      <div className="space-y-4">
        {/* DIRECTION */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">{t("Direction")}</label>
          <div className="flex gap-2">
            {["Long", "Short"].map((dir) => (
              <button
                key={dir}
                onClick={() => setTrade({ direction: dir })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                  trade.direction === dir
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                {t(dir)}
              </button>
            ))}
          </div>
        </div>

        {/* ENTRY DATE */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">{t("Entry date")}</label>
          <input
            type="datetime-local"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.entry_date || ""}
            onChange={(e) => setTrade({ entry_date: e.target.value })}
          />
        </div>

        {/* ENTRY PRICE */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            {t("Entry price")}
          </label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.entry_price ?? ""}
            onChange={(e) => setTrade({ entry_price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        {/* POSITION SIZE */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            {t("Position size")}
          </label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.position_size ?? ""}
            onChange={(e) => setTrade({ position_size: e.target.value })}
            placeholder="0.01"
          />
        </div>

        {/* VALIDATION */}
        {!isValid && (
          <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm rounded p-3">
            {t("Entry date, entry price and position size are required and must be greater than 0.")}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        >
          {t("Back")}
        </button>

        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            isValid
              ? "bg-indigo-600 hover:bg-indigo-500"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
        >
          {t("Next")}
        </button>
      </div>
    </WizardCard>
  );
}
