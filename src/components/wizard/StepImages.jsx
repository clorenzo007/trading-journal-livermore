import { useState } from "react";
import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";
import FullscreenViewer from "../FullscreenViewer";
import { deleteReviewImage, deleteEntryImage } from "../../api/trades";

export default function StepImages({ trade, setTrade, onNext, onBack }) {
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      alert("Error eliminando imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Trade images</h2>

      <div className="text-sm text-zinc-500">
        You can upload or change images here. Changes are saved immediately for existing trades.
      </div>

      {/* ENTRY IMAGE */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">Entry Image</div>

        {trade.entryImage?.url ? (
          <div className="relative group">
            <img
              src={trade.entryImage.url}
              alt="Entry"
              className="w-full h-64 object-cover rounded-xl cursor-zoom-in border border-zinc-800"
              onClick={() => setView(trade.entryImage.url)}
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                 onClick={() => handleDelete('entry')}
                 className="p-2 bg-rose-600 rounded-lg text-white text-xs shadow-lg"
                 disabled={loading}
               >
                 Eliminar
               </button>
            </div>
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <EntryImageUploader trade={trade} setTrade={setTrade} />
          </div>
        )}
      </div>

      {/* REVIEW IMAGE */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">Review Image</div>

        {trade.reviewImage?.url ? (
          <div className="relative group">
            <img
              src={trade.reviewImage.url}
              alt="Review"
              className="w-full h-64 object-cover rounded-xl cursor-zoom-in border border-zinc-800"
              onClick={() => setView(trade.reviewImage.url)}
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                 onClick={() => handleDelete('review')}
                 className="p-2 bg-rose-600 rounded-lg text-white text-xs shadow-lg"
                 disabled={loading}
               >
                 Eliminar
               </button>
            </div>
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <ReviewImageUploader trade={trade} setTrade={setTrade} />
          </div>
        )}
      </div>

      {view && <FullscreenViewer src={view} onClose={() => setView(null)} />}

      <div className="flex justify-between pt-6 border-t border-zinc-800">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors font-medium"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all font-bold shadow-lg shadow-indigo-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
