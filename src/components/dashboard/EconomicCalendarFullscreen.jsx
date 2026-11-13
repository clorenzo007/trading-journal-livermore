import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function EconomicCalendarFullscreen({ onClose }) {
  const { lang, t } = useLanguage();
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[999] flex flex-col"
      onClick={onClose}
    >
      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold">{t("Economic Calendar")}</h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white text-sm"
        >
          {t("ESC to close")}
        </button>
      </div>

      <iframe
        src={`https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&importance=1,2,3&features=datepicker,timezone,timeselector&countries=25,32,5,72&calType=day&timeZone=12&lang=${lang === "en" ? 1 : 4}`}
        className="flex-1 w-full"
        title={t("Economic Calendar")}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
