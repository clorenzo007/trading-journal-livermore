import { uploadReviewImage } from "../api/trades";

export default function ReviewImageUploader({ trade, setTrade }) {
  async function onUpload(e) {
    const file = e.target.files?.[0];

    if (!file) {
      console.warn("REVIEW UPLOADER: no file selected");
      return;
    }

    if (!trade || !trade._id) {
      console.warn("REVIEW UPLOADER: invalid trade", trade);
      return;
    }

    try {
      console.log("REVIEW UPLOADER START trade._id:", trade._id);

      const updated = await uploadReviewImage(trade._id, file);

      console.log("REVIEW UPLOADER RESPONSE:", updated);

      if (updated && updated.reviewImage) {
        setTrade((prev) => ({
          ...prev,
          reviewImage: updated.reviewImage,
        }));
      }
    } catch (err) {
      console.error("REVIEW UPLOADER ERROR:", err);
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-zinc-400">Imagen de review</div>

      {trade?.reviewImage?.url && (
        <img
          src={trade.reviewImage.url}
          alt="Review"
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
