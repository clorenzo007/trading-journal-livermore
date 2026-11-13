import WizardCard from "./WizardCard";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Wizard Step: Final Action.
 * The final screen before saving the trade to the database.
 */
export default function StepFinish({ trade, onBack, onFinish, onCancel }) {
  const { t } = useLanguage();
  return (
    <WizardCard title="Trade ready" onCancel={onCancel}>
      <div className="space-y-4 text-center">
        <p className="text-zinc-400">
          {t("Everything looks good. You can now save this trade.")}
        </p>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">{t("Symbol")}</span>
            <span className="font-medium">{trade.symbol || "—"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">{t("Outcome")}</span>
            <span className="font-medium">{trade.outcome ? t(trade.outcome) : "—"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">{t("P/L")}</span>
            <span className="font-medium">{trade.profit_loss ?? "—"}</span>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          >
            {t("Back")}
          </button>

          <button
            onClick={onFinish}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium"
          >
            {t("Save trade")}
          </button>
        </div>
      </div>
    </WizardCard>
  );
}
