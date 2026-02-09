import { useEffect, useState } from "react";
import {
  getStrategies,
  createStrategy,
  deleteStrategy,
  getPatterns,
  createPattern,
  deletePattern,
  getListItems,
  createListItem,
  deleteListItem,
} from "../api/admin";

export default function Setup() {
  const [activeTab, setActiveTab] = useState("strategies");

  const tabs = [
    { id: "strategies", label: "Strategies" },
    { id: "patterns", label: "Patterns" },
    { id: "emotional_pre", label: "Emotional State (Pre)" },
    { id: "emotional_post", label: "Emotional State (Post)" },
    { id: "reason_entry", label: "Reason for Entry" },
    { id: "reason_exit", label: "Reason for Exit" },
  ];

  return (
    <div className="container py-6">
      <h1 className="h3 fw-bold text-white mb-2">Setup</h1>
      <p className="text-zinc-400 mb-6 text-sm">Manage your trading environment and list values.</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        {activeTab === "strategies" && <StrategyManager />}
        {activeTab === "patterns" && <PatternManager />}
        {["emotional_pre", "emotional_post", "reason_entry", "reason_exit"].includes(activeTab) && (
          <ListManager type={activeTab} />
        )}
      </div>
    </div>
  );
}

function ListManager({ type }) {
    const [items, setItems] = useState([]);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      load();
    }, [type]);
  
    const load = async () => {
      try {
        const data = await getListItems(type);
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };
  
    const add = async (e) => {
      e.preventDefault();
      if (!value.trim()) return;
      setLoading(true);
      try {
        await createListItem({ type, value });
        setValue("");
        load();
      } catch (err) {
        alert("Error adding item");
      } finally {
        setLoading(false);
      }
    };
  
    const remove = async (id) => {
      if (!confirm("Delete item?")) return;
      try {
        await deleteListItem(id);
        load();
      } catch {
        alert("Error deleting item");
      }
    };
  
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h2 className="text-lg font-bold mb-4 text-zinc-200">Manage Values</h2>
        
        <form onSubmit={add} className="flex gap-2 mb-6">
          <input
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white flex-1 outline-none focus:border-indigo-500 transition-colors"
            placeholder="New Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
  
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-lg p-3 group hover:border-zinc-700 transition-colors"
            >
              <span className="text-zinc-300">{item.value}</span>
              <button
                onClick={() => remove(item._id)}
                className="text-zinc-600 hover:text-rose-400 text-sm transition-colors opacity-0 group-hover:opacity-100 px-2"
              >
                Delete
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <div className="text-zinc-500 text-sm italic p-4 text-center bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                No items found. Add your first one above.
            </div>
          )}
        </ul>
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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-lg font-bold mb-4 text-zinc-200">Manage Strategies</h2>
      
      <form onSubmit={add} className="flex gap-2 mb-6">
        <input
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white flex-1 outline-none focus:border-indigo-500 transition-colors"
          placeholder="New Strategy Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-lg p-3 group hover:border-zinc-700 transition-colors"
          >
            <span className="text-zinc-300">{item.title}</span>
            <button
              onClick={() => remove(item._id)}
              className="text-zinc-600 hover:text-rose-400 text-sm transition-colors opacity-0 group-hover:opacity-100 px-2"
            >
              Delete
            </button>
          </li>
        ))}
        {items.length === 0 && (
            <div className="text-zinc-500 text-sm italic p-4 text-center bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                No strategies found.
            </div>
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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-lg font-bold mb-4 text-zinc-200">Manage Patterns</h2>
      
      <form onSubmit={add} className="flex gap-2 mb-6">
        <input
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white flex-1 outline-none focus:border-indigo-500 transition-colors"
          placeholder="New Pattern Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-lg p-3 group hover:border-zinc-700 transition-colors"
          >
            <span className="text-zinc-300">{item.title}</span>
            <button
              onClick={() => remove(item._id)}
              className="text-zinc-600 hover:text-rose-400 text-sm transition-colors opacity-0 group-hover:opacity-100 px-2"
            >
              Delete
            </button>
          </li>
        ))}
        {items.length === 0 && (
            <div className="text-zinc-500 text-sm italic p-4 text-center bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                No patterns found.
            </div>
        )}
      </ul>
    </div>
  );
}
