import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ImportTrades() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const upload = () => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    setProgress(5);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/import/mt5`);
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const p = Math.round((e.loaded / e.total) * 60);
        setProgress(p);
      }
    };

    xhr.onload = () => {
      setProgress(100);
      setResult(JSON.parse(xhr.responseText));
      setLoading(false);
    };

    xhr.onerror = () => {
      alert("Import failed");
      setLoading(false);
    };

    xhr.send(form);
  };

  return (...)
}
