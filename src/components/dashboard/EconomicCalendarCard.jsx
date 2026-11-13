import { useState } from "react";
import EconomicCalendarFullscreen from "./EconomicCalendarFullscreen";
import { useLanguage } from "../../context/LanguageContext";

export default function EconomicCalendarCard() {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLanguage();

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-indigo-500 transition h-full flex flex-col"
      >
        <div className="text-sm text-zinc-400 mb-2">{t("Economic Calendar")}</div>

        <iframe
          src={`https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance&importance=1,2,3&features=datepicker&countries=25,32,5,72&calType=day&timeZone=12&lang=${lang === "en" ? 1 : 4}`}
          className="w-full flex-grow rounded"
          title={t("Economic Calendar")}
        />
      </div>

      {open && <EconomicCalendarFullscreen onClose={() => setOpen(false)} />}
    </>
  );
}
