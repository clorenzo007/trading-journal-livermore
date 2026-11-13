import WizardCard from "./WizardCard";
import SearchSelect from "../ui/SearchSelect";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Wizard Step: Identity.
 * Captures basic trade info: Symbol, Strategy, and Pattern.
 */
export default function StepIdentity({ trade, setTrade, onNext, strategies = [], patterns = [], onCancel }) {
  const { t } = useLanguage();
  const isValid =
    trade.symbol?.trim() &&
    trade.strategy_type?.trim() &&
    trade.pattern?.trim();

  return (
    <WizardCard title="Trade identity" onCancel={onCancel}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">{t("Symbol")}</label>
          <input
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.symbol || ""}
            onChange={(e) => setTrade({ symbol: e.target.value })}
            placeholder="EURUSD, XAUUSD, NDX100…"
          />
        </div>

        <SearchSelect
          label={t("Strategy")}
          value={trade.strategy_type || ""}
          onChange={(val) => setTrade({ strategy_type: val })}
          placeholder={t("Select or type strategy...")}
          options={strategies}
        />

        <SearchSelect
          label={t("Pattern")}
          value={trade.pattern || ""}
          onChange={(val) => setTrade({ pattern: val })}
          placeholder={t("Select or type pattern...")}
          options={patterns}
        />

        {!isValid && (
          <div className="text-sm text-red-400">
            {t("Please complete all fields to continue.")}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-6">
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
