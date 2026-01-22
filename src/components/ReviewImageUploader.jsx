import { uploadReviewImage } from "../api/trades";

export default function ReviewImageUploader({ trade, setTrade }) {
  console.log("REVIEW UPLOADER trade IN:", trade);
  console.log("REVIEW UPLOADER trade._id IN:", trade?._id);

  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;

    console.log("REVIEW UPLOAD START trade._id:", trade?._id);

    const updated = await uploadReviewImage(trade._id, file);

    console.log("REVIEW UPLOAD RESPONSE:", updated);
    console.log("REVIEW UPLOAD RESPONSE _id:", updated?._id);

    setTrade(updated);
  }

  return <input type="file" onChange={upload} />;
}
