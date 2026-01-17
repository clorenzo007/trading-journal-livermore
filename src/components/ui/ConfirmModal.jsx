import Modal from "./Modal";

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
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-zinc-400">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 rounded py-2 hover:bg-zinc-700"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-rose-600 rounded py-2 hover:bg-rose-500"
          >
            Borrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
