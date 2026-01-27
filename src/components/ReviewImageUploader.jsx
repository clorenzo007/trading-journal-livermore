import { uploadReviewImage } from "../api/trades";

export default function ReviewImageUploader({ trade, setTrade }) {
  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !trade._id) return;

    const updated = await uploadReviewImage(trade._id, file);
    setTrade(updated);
  }

  return (
    <div>
      <input type="file" onChange={onUpload} />
    </div>
  );
}
