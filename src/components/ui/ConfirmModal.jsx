import Modal from "./Modal";

import Modal from "./Modal";

/**
 * Reusable Confirmation Modal.
 * 
 * Props:
 * - open: Boolean to control visibility.
 * - onClose: Function called when cancelled/closed.
 * - onConfirm: Function called when confirmed.
 * - title: Modal title.
 * - message: Description or warning message.
 */
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6 pb-2 text-center">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed px-4">{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800/80 rounded-2xl py-3 hover:bg-zinc-700 transition-all font-semibold text-sm text-zinc-300"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-rose-600 rounded-2xl py-3 hover:bg-rose-500 transition-all font-bold text-sm shadow-lg shadow-rose-900/20"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}
