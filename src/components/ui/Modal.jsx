/**
 * Base Modal Component.
 * Provides a centered, backdrop-blurred overlay with animation.
 */
export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="p-2 -mr-2 bg-zinc-800/50 hover:bg-zinc-700 rounded-full transition-colors text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
