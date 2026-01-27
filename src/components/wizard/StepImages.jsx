import { useState } from "react";
import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";
import FullscreenViewer from "../FullscreenViewer";

export default function StepImages({ trade, setTrade, onNext, onBack }) {
  const [view, setView] = useState(null);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Trade images</h2>

      {/* ENTRY */}
      <div className="space-y-2">
        <div className="text-sm text-zinc-400">Entry</div>

        {trade.entryImage?.url ? (
          <img
            src={trade.entryImage.url}
            className="w-full h-48 object-cover rounded-lg cursor-zoom-in border border-zinc-800"
            onClick={() => setView(trade.entryImage.url)}
          />
        ) : (
          <EntryImageUploader trade={trade} setTrade={setTrade} />
        )}
      </div>

      {/* REVIEW */}
      <div className="space-y-2">
        <div className="text-sm text-zinc-400">Review</div>

        {trade.reviewImage?.url ? (
          <img
            src={trade.reviewImage.url}
            className="w-full h-48 object-cover rounded-lg cursor-zoom-in border border-zinc-800"
            onClick={() => setView(trade.reviewImage.url)}
          />
        ) : (
          <ReviewImageUploader trade={trade} setTrade={setTrade} />
        )}
      </div>

      {view && <FullscreenViewer src={view} onClose={() => setView(null)} />}

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="px-4 py-2 bg-zinc-800 rounded">
          Back
        </button>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 rounded">
          Next
        </button>
      </div>
    </div>
  );
}
