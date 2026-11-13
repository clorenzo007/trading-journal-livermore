import WizardCard from "./WizardCard";
import SearchSelect from "../ui/SearchSelect";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Wizard Step: Pre-Trade Psychology.
 * Captures emotional state before entry and the reason for taking the trade.
 */
export default function StepPsychologyPre({
  trade,
  setTrade,
  onNext,
  onBack,
  onCancel,
}) {
  const { t } = useLanguage();
  const presets = [
    "Calm",
    "Focused",
    "Anxious",
    "Overconfident",
    "Fearful",
    "Tired",
    "Revenge mode",
  ].map((p) => t(p));

  const isValid =
    trade.emotional_state_pre?.trim() && trade.reason_for_entry?.trim();

  return (
    <WizardCard title="Psychology (Before)" onCancel={onCancel}>
      <div className="space-y-4">
        <SearchSelect
          label={t("Emotional state")}
          value={trade.emotional_state_pre || ""}
          onChange={(val) => setTrade({ emotional_state_pre: val })}
          placeholder={t("Select or type…")}
          options={presets}
        />

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            {t("Reason for entry")}
          </label>
          <textarea
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.reason_for_entry || ""}
            onChange={(e) => setTrade({ reason_for_entry: e.target.value })}
            placeholder={t("Why did you take this trade?")}
          />
        </div>

        {!isValid && (
          <div className="text-sm text-red-400">
            {t("Emotional state and reason for entry are required.")}
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
