import WizardCard from "./WizardCard";
import SearchSelect from "../ui/SearchSelect";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Wizard Step: Post-Trade Psychology.
 * Captures emotional state after the trade, reason for exit, and review notes.
 */
export default function StepPsychologyPost({
  trade,
  setTrade,
  onNext,
  onBack,
  onCancel,
}) {
  const { t } = useLanguage();
  const presets = [
    "Satisfied",
    "Frustrated",
    "Neutral",
    "Angry",
    "Disappointed",
    "Confident",
    "Relieved",
  ].map((p) => t(p));

  return (
    <WizardCard title="Psychology (After)" onCancel={onCancel}>
      <div className="space-y-4">
        <SearchSelect
          label={t("Emotional state")}
          value={trade.emotional_state_post || ""}
          onChange={(val) => setTrade({ emotional_state_post: val })}
          placeholder={t("Select or type…")}
          options={presets}
        />

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            {t("Reason for exit")}
          </label>
          <textarea
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.reason_for_exit || ""}
            onChange={(e) =>
              setTrade({ reason_for_exit: e.target.value })
            }
            placeholder={t("Why did you exit this trade?")}
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            {t("Review notes")}
          </label>
          <textarea
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.review_notes || ""}
            onChange={(e) =>
              setTrade({ review_notes: e.target.value })
            }
            placeholder={t("Any other thoughts?")}
          />
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
          onClick={onNext}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium transition"
        >
          {t("Next")}
        </button>
      </div>
    </WizardCard>
  );
}
