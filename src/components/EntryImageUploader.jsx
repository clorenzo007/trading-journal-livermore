import { uploadEntryImage } from "../api/trades";

export default function EntryImageUploader({ trade, setTrade }) {
  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !trade._id) return;

    const updated = await uploadEntryImage(trade._id, file);
    setTrade(updated);
  }

  return (
    <div>
      <input type="file" onChange={onUpload} />
    </div>
  );
}
