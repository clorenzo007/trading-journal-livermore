import { uploadEntryImage } from "../api/trades";

export default function EntryImageUploader({ trade, setTrade }) {
  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !trade?._id) return;

    const updated = await uploadEntryImage(trade._id, file);

    if (updated?.entryImage) {
      setTrade((prev) => ({
        ...prev,
        entryImage: updated.entryImage,
      }));
    }
  }

  return (
    <input
      type="file"
      onChange={onUpload}
      className="mt-2 text-xs text-zinc-400"
    />
  );
}
