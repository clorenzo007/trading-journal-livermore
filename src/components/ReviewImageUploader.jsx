import { useState, useEffect } from "react";
import { uploadReviewImage, deleteReviewImage } from "../api/trades";

export default function ReviewImageUploader({ trade, setTrade }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tradeId = trade?.id || trade?._id;
  const isReady = Boolean(tradeId);

  useEffect(() => {
    console.log("TRADE EN ReviewImageUploader:", trade);
  }, [trade]);

  const onSelect = (e) => {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };

  const onUpload = async () => {
    if (!isReady) return;

    if (!file) {
      setError("Seleccioná una imagen primero.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updated = await uploadReviewImage(tradeId, file);
      setTrade(updated);
      setFile(null);
    } catch (e) {
      console.error(e);
      setError("Error subiendo imagen");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!isReady) return;
    if (!confirm("¿Borrar imagen de review?")) return;

    try {
      setLoading(true);
      setError(null);
      const updated = await deleteReviewImage(tradeId);
      setTrade(updated);
    } catch (e) {
      console.error(e);
      setError("Error borrando imagen");
    } finally {
      setLoading(false);
    }
  };

  if (!trade) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm text-zinc-400">Imagen de review</div>

      {!isReady && (
        <div className="text-xs text-zinc-500 italic">
          Guardá el trade para poder subir imágenes
        </div>
      )}

      {trade.reviewImage?.url ? (
        <div className="space-y-2">
          <img
            src={trade.reviewImage.url}
            alt="Review"
            className="w-full h-48 object-cover rounded-lg border border-zinc-800"
          />

          <div className="flex gap-2">
            <input type="file" onChange={onSelect} disabled={!isReady} />

            <button
              onClick={onUpload}
              disabled={loading || !isReady}
              className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Subiendo..." : "Reemplazar"}
            </button>

            <button
              onClick={onDelete}
              disabled={loading || !isReady}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50"
            >
              Borrar
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-zinc-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <input type="file" onChange={onSelect} disabled={!isReady} />

            <button
              onClick={onUpload}
              disabled={loading || !isReady}
              className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Subiendo..." : "Subir imagen"}
            </button>
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-400">{error}</div>}
    </div>
  );
}
