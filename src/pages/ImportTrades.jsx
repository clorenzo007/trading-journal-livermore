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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Import MT5 Trades</h1>

      <input
        type="file"
        accept=".xlsx,.csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={upload}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 rounded"
      >
        {loading ? "Importing..." : "Import trades"}
      </button>

      {loading && (
        <div className="w-full bg-zinc-800 rounded h-3">
          <div
            className="bg-indigo-500 h-3 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4 space-y-2">
          <div>Imported: {result.imported}</div>
          <div>Skipped (duplicates): {result.skipped}</div>
          {result.errors?.length > 0 && (
            <div className="text-red-400">Errors: {result.errors.length}</div>
          )}
        </div>
      )}
    </div>
  );
}
