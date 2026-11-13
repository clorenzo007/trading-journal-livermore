import { useState } from "react";
import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";
import FullscreenViewer from "../FullscreenViewer";
import { deleteReviewImage, deleteEntryImage } from "../../api/trades";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Wizard Step: Images.
 * Interfaces for uploading Entry and Review screenshots.
 * Handles both local file selection (for new trades) and API deletion (for existing trades).
 */
export default function StepImages({ trade, setTrade, onNext, onBack }) {
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleDelete = async (type) => {
    if (!trade._id) {
       // Just clear local state for new trades
       setTrade({ [type === 'entry' ? 'entryImage' : 'reviewImage']: null, [type === 'entry' ? '_entryImageFile' : '_reviewImageFile']: null });
       return;
    }

    try {
      setLoading(true);
      if (type === 'entry') await deleteEntryImage(trade._id);
      else await deleteReviewImage(trade._id);
      setTrade({ [type === 'entry' ? 'entryImage' : 'reviewImage']: null });
    } catch {
      alert(t("Error eliminando imagen"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("Trade images")}</h2>

      <div className="text-sm text-zinc-500">
        {t("You can upload or change images here. Changes are saved immediately for existing trades.")}
      </div>

      <div className="row g-4">
        {/* 
          ==========================================================
          ENTRY IMAGE SECTION
          - Mobile: Full width (col-12)
          - Desktop: Half width (col-md-6)
          ==========================================================
        */}
        <div className="col-12 col-md-6">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t("Entry Image")}</div>

            {trade.entryImage?.url ? (
              <div className="relative group">
                <img
                  src={trade.entryImage.url}
                  alt={t("Entry")}
                  className="w-full h-64 object-cover rounded-xl cursor-zoom-in border border-zinc-800"
                  onClick={() => setView(trade.entryImage.url)}
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button
                     onClick={() => handleDelete('entry')}
                     className="p-2 bg-rose-600 rounded-lg text-white text-xs shadow-lg"
                     disabled={loading}
                   >
                     {t("Eliminar")}
                   </button>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors h-100 d-flex flex-column justify-content-center">
                <EntryImageUploader trade={trade} setTrade={setTrade} />
              </div>
            )}
          </div>
        </div>

        {/* 
          ==========================================================
          REVIEW IMAGE SECTION
          - Mobile: Full width (col-12)
          - Desktop: Half width (col-md-6)
          ==========================================================
        */}
        <div className="col-12 col-md-6">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t("Review Image")}</div>

            {trade.reviewImage?.url ? (
              <div className="relative group">
                <img
                  src={trade.reviewImage.url}
                  alt={t("Review")}
                  className="w-full h-64 object-cover rounded-xl cursor-zoom-in border border-zinc-800"
                  onClick={() => setView(trade.reviewImage.url)}
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button
                     onClick={() => handleDelete('review')}
                     className="p-2 bg-rose-600 rounded-lg text-white text-xs shadow-lg"
                     disabled={loading}
                   >
                     {t("Eliminar")}
                   </button>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors h-100 d-flex flex-column justify-content-center">
                <ReviewImageUploader trade={trade} setTrade={setTrade} />
              </div>
            )}
          </div>
        </div>
      </div>

      {view && <FullscreenViewer src={view} onClose={() => setView(null)} />}

      <div className="flex justify-between pt-6 border-t border-zinc-800">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors font-medium"
        >
          {t("Back")}
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all font-bold shadow-lg shadow-indigo-500/20"
        >
          {t("Next")}
        </button>
      </div>
    </div>
  );
}
