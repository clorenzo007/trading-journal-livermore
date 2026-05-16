import { useEffect, useState } from "react";
import {
  getStrategies,
  createStrategy,
  deleteStrategy,
  updateStrategy,
  getPatterns,
  createPattern,
  deletePattern,
  getListItems,
  createListItem,
  updatePattern,
  getListItems,
  createListItem,
  deleteListItem,
  updateListItem,
  getUsers,
  toggleUserStatus,
  updateUserRole,
  updateUserPassword,
  deleteUser,
} from "../api/admin";
import { useAuth } from "../context/AuthContext";
import { User, Shield, Key, Trash2, Power, Edit2, X, Check } from "lucide-react";
export default function Setup() {
  const [activeTab, setActiveTab] = useState("strategies");
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === "admin";

  const tabs = [
    { id: "strategies", label: "Strategies" },
    { id: "patterns", label: "Patterns" },
    { id: "emotional_pre", label: "Emotional State (Pre)" },
    { id: "emotional_post", label: "Emotional State (Post)" },
    { id: "reason_entry", label: "Reason for Entry" },
    { id: "reason_exit", label: "Reason for Exit" },
    ...(isAdmin ? [{ id: "users", label: "Users" }] : []),
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
        {activeTab === "users" && <UserManager />}
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
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  
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
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

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

  const edit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await updateStrategy(id, editTitle);
      setEditingId(null);
      setEditTitle("");
      load();
    } catch {
      alert("Error updating strategy");
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
            {editingId === item._id ? (
              <div className="flex flex-1 items-center gap-2 mr-2">
                <input
                  autoFocus
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white flex-1 outline-none focus:border-indigo-500 text-sm"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") edit(item._id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <button onClick={() => edit(item._id)} className="text-emerald-500 hover:text-emerald-400 p-1">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-400 p-1">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <span className="text-zinc-300">{item.title}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingId(item._id);
                      setEditTitle(item.title);
                    }}
                    className="text-zinc-500 hover:text-indigo-400 transition-colors p-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => remove(item._id)}
                    className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
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
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

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

  const edit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await updatePattern(id, editTitle);
      setEditingId(null);
      setEditTitle("");
      load();
    } catch {
      alert("Error updating pattern");
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
            {editingId === item._id ? (
              <div className="flex flex-1 items-center gap-2 mr-2">
                <input
                  autoFocus
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white flex-1 outline-none focus:border-indigo-500 text-sm"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") edit(item._id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <button onClick={() => edit(item._id)} className="text-emerald-500 hover:text-emerald-400 p-1">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-400 p-1">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <span className="text-zinc-300">{item.title}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingId(item._id);
                      setEditTitle(item.title);
                    }}
                    className="text-zinc-500 hover:text-indigo-400 transition-colors p-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => remove(item._id)}
                    className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
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

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleUserStatus(id);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Error toggling status");
    }
  };

  const handleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
      await updateUserRole(id, newRole);
      load();
    } catch (err) {
      alert("Error updating role");
    }
  };

  const handlePassword = async (id) => {
    const pass = prompt("Enter new password (min 6 chars):");
    if (!pass) return;
    if (pass.length < 6) return alert("Too short");
    try {
      await updateUserPassword(id, pass);
      alert("Password updated");
    } catch (err) {
      alert("Error updating password");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete user account forever? This cannot be undone.")) return;
    try {
      await deleteUser(id);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting user");
    }
  };

  if (loading) return <div className="text-zinc-500 py-10 text-center">Loading users...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-lg font-bold mb-4 text-zinc-200">User Accounts</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest font-black">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((u) => (
              <tr key={u._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors group">
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-200">{u.name}</span>
                    <span className="text-xs text-zinc-500">{u.email}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    u.role === "admin" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`flex items-center gap-1.5 ${u.active ? "text-emerald-400" : "text-rose-400"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${u.active ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <span className="text-[10px] font-bold uppercase">{u.active ? "Active" : "Disabled"}</span>
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggle(u._id)}
                      title={u.active ? "Disable" : "Enable"}
                      className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <Power size={14} />
                    </button>
                    <button
                      onClick={() => handleRole(u._id, u.role)}
                      title="Change Role"
                      className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <Shield size={14} />
                    </button>
                    <button
                      onClick={() => handlePassword(u._id)}
                      title="Reset Password"
                      className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <Key size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      title="Delete User"
                      className="p-2 hover:bg-rose-500/10 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-zinc-500 text-sm italic p-4 text-center">No users found.</div>
        )}
      </div>
    </div>
  );
}
