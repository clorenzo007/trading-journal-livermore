import { useLanguage } from "../../context/LanguageContext";
/**
 * Wizard UI Container.
 * Standard layout for a wizard step with a title and content area.
 */
export default function WizardCard({ title, children, onCancel }) {
  const { t } = useLanguage();
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-lg">
      {title && (
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h2 className="text-xl font-semibold">{typeof title === "string" ? t(title) : title}</h2>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm text-zinc-400 hover:text-white"
            >
              {t("Cancel")}
            </button>
          )}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}
