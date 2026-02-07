import { useState } from "react";
import FullscreenViewer from "../FullscreenViewer";

export default function TradePreviewModal({ trade, onClose, onEdit }) {
  const [viewer, setViewer] = useState(null);
  
  if (!trade) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 space-y-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white">
              {trade.symbol}
            </h2>
            <div className={`text-sm font-bold uppercase tracking-widest ${trade.outcome === 'Win' ? 'text-emerald-400' : trade.outcome === 'Loss' ? 'text-rose-400' : 'text-zinc-400'}`}>
               {trade.outcome || "Open Trade"} • {trade.strategy_type}
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DataBlock label="Entry Price" value={trade.entry_price} />
              <DataBlock label="Exit Price" value={trade.exit_price} />
              <DataBlock label="P/L" value={trade.profit_loss} isMoney />
              <DataBlock label="Volume" value={trade.position_size} />
            </div>

            <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 space-y-4">
               <div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Reason for Entry</div>
                  <div className="text-sm text-zinc-300">{trade.reason_for_entry || "—"}</div>
               </div>
               <div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Psychology (Pre)</div>
                  <div className="text-sm text-zinc-300">{trade.emotional_state_pre || "—"}</div>
               </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <PreviewImage 
                src={trade.entryImage?.url} 
                label="Entry Image" 
                onClick={() => setViewer(trade.entryImage?.url)} 
              />
              <PreviewImage 
                src={trade.reviewImage?.url} 
                label="Review Image" 
                onClick={() => setViewer(trade.reviewImage?.url)} 
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors font-medium order-2 sm:order-1"
          >
            Salir
          </button>

          <button
            onClick={onEdit}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all font-bold shadow-lg shadow-indigo-500/20 order-1 sm:order-2"
          >
            Editar Trade
          </button>
        </div>
      </div>

      {viewer && <FullscreenViewer src={viewer} onClose={() => setViewer(null)} />}
    </div>
  );
}

function DataBlock({ label, value, isMoney }) {
  return (
    <div className="bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/50">
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-lg font-bold ${isMoney ? (Number(value) >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-white'}`}>
        {isMoney && value >= 0 ? `+${value}` : value || "—"}
      </div>
    </div>
  );
}

function PreviewImage({ src, label, onClick }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{label}</div>
      <div 
        className={`aspect-video bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center ${src ? 'cursor-zoom-in group' : ''}`}
        onClick={src ? onClick : undefined}
      >
        {src ? (
          <img src={src} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-zinc-800 text-xs italic font-medium">No image provided</span>
        )}
      </div>
    </div>
  );
}
