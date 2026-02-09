import { useEffect, useState } from "react";
import {
  getStrategies,
  createStrategy,
  deleteStrategy,
  getPatterns,
  createPattern,
  deletePattern,
} from "../api/admin";

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState("strategies");

  return (
    <div className="container py-4">
      <h1 className="h3 fw-bold mb-4">Maintenance</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("strategies")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === "strategies"
              ? "bg-zinc-800 text-white border border-zinc-700"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Strategies
        </button>
        <button
          onClick={() => setActiveTab("patterns")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === "patterns"
              ? "bg-zinc-800 text-white border border-zinc-700"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Patterns
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        {activeTab === "strategies" ? <StrategyManager /> : <PatternManager />}
      </div>
    </div>
  );
}

function StrategyManager() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getStrategies();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createStrategy({ title });
      setTitle("");
      load();
    } catch (err) {
      alert("Error adding strategy");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete strategy?")) return;
    try {
      await deleteStrategy(id);
      load();
    } catch {
      alert("Error deleting strategy");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Manage Strategies</h2>
      
      <form onSubmit={add} className="flex gap-2 mb-6">
        <input
          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white flex-1"
          placeholder="New Strategy Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded p-3"
          >
            <span>{item.title}</span>
            <button
              onClick={() => remove(item._id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <div className="text-zinc-500 text-sm">No strategies found.</div>
        )}
      </ul>
    </div>
  );
}

function PatternManager() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getPatterns();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createPattern({ title });
      setTitle("");
      load();
    } catch (err) {
      alert("Error adding pattern");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete pattern?")) return;
    try {
      await deletePattern(id);
      load();
    } catch {
      alert("Error deleting pattern");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Manage Patterns</h2>
      
      <form onSubmit={add} className="flex gap-2 mb-6">
        <input
          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white flex-1"
          placeholder="New Pattern Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded p-3"
          >
            <span>{item.title}</span>
            <button
              onClick={() => remove(item._id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <div className="text-zinc-500 text-sm">No patterns found.</div>
        )}
      </ul>
    </div>
  );
}
