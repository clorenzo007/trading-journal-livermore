import { uploadReviewImage } from "../api/trades";

export default function ReviewImageUploader({ trade, setTrade }) {
  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !trade?._id) return;

    const updated = await uploadReviewImage(trade._id, file);

    if (updated?.reviewImage) {
      setTrade((prev) => ({
        ...prev,
        reviewImage: updated.reviewImage,
      }));
    }
  }

  return (
    <div>
      <div className="text-sm text-zinc-400 mb-1">Review image</div>
      <input type="file" onChange={onUpload} />
    </div>
  );
}
