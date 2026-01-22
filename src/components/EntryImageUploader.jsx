import { uploadEntryImage } from "../api/trades";

export default function EntryImageUploader({ trade, setTrade }) {
  console.log("ENTRY UPLOADER trade IN:", trade);
  console.log("ENTRY UPLOADER trade._id IN:", trade?._id);

  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;

    console.log("ENTRY UPLOAD START trade._id:", trade?._id);

    const updated = await uploadEntryImage(trade._id, file);

    console.log("ENTRY UPLOAD RESPONSE:", updated);
    console.log("ENTRY UPLOAD RESPONSE _id:", updated?._id);

    setTrade(updated);
  }

  return <input type="file" onChange={upload} />;
}
