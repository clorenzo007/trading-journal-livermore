import { uploadEntryImage } from "../api/trades";

export default function EntryImageUploader({ trade, setTrade }) {
  async function onUpload(e) {
    const file = e.target.files?.[0];

    if (!file) {
      console.warn("ENTRY UPLOADER: no file selected");
      return;
    }

    if (!trade || !trade._id) {
      console.warn("ENTRY UPLOADER: invalid trade", trade);
      return;
    }

    try {
      console.log("ENTRY UPLOADER START trade._id:", trade._id);

      const updated = await uploadEntryImage(trade._id, file);

      console.log("ENTRY UPLOADER RESPONSE:", updated);

      if (updated && updated.entryImage) {
        setTrade((prev) => ({
          ...prev,
          entryImage: updated.entryImage,
        }));
      }
    } catch (err) {
      console.error("ENTRY UPLOADER ERROR:", err);
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-zinc-400">Imagen de entrada</div>

      {trade?.entryImage?.url && (
        <img
          src={trade.entryImage.url}
          alt="Entry"
          className="w-full h-40 object-cover rounded border border-zinc-800"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="text-sm"
      />
    </div>
  );
}
