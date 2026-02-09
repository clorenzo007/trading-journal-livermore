import { uploadReviewImage } from "../api/trades";

export default function ReviewImageUploader({ trade, setTrade }) {
  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. IF TRADE EXISTS (EDIT MODE), UPLOAD IMMEDIATELY
    if (trade._id) {
      const updated = await uploadReviewImage(trade._id, file);
      setTrade(updated);
      return;
    }

    // 2. IF NEW TRADE, DEFER UPLOAD
    const url = URL.createObjectURL(file);
    // FIX: 'setTrade' is actually the 'update' function from TradeWizard which expects an object, not a function
    setTrade({
      reviewImage: { url }, // For preview
      _reviewImageFile: file, // For deferred upload
    });
  }

  return (
    <div>
      <input type="file" onChange={onUpload} />
    </div>
  );
}
