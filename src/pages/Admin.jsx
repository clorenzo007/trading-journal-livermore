import { useEffect, useState, useMemo } from "react";
import { api } from "../api/api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const data = await api("/admin/users");
      setUsers(data);
    } catch (err) {
      setError("Error loading users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStatus(id) {
    try {
      await api(`/admin/users/${id}/toggle`, { method: "PATCH" });
      load();
    } catch (err) {
      alert(err.message || "Error toggling status");
    }
  }

  async function changeRole(id, newRole) {
    try {
      await api(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      load();
    } catch (err) {
      alert("Error changing role");
    }
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure? This action is permanent and will delete all user data.")) return;
    try {
      await api(`/admin/users/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert(err.message || "Error deleting user");
    }
  }

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = filterRole === "all" || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, search, filterRole]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.active).length,
      admins: users.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-geist">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Control</h1>
          <p className="text-zinc-400 text-sm">Manage users, roles, and access permissions</p>
        </div>
        <button 
          onClick={load}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={stats.total} />
        <StatCard label="Active Accounts" value={stats.active} color="text-emerald-400" />
        <StatCard label="Admins" value={stats.admins} color="text-indigo-400" />
      </div>

      {/* Filters */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px] font-bold tracking-widest border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-zinc-500 italic">Loading database...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-zinc-500">No users found matching your criteria.</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u._id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{u.email}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-tighter">ID: {u._id}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(u._id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        u.active 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20" 
                        : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`}></span>
                      {u.active ? "ACTIVE" : "DISABLED"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold bg-zinc-950 border border-zinc-800 focus:outline-none transition-colors ${
                        u.role === 'admin' ? 'text-indigo-400 border-indigo-500/30' : 'text-zinc-400'
                      }`}
                    >
                      <option value="user">USER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="text-zinc-600 hover:text-rose-500 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-white" }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg hover:border-zinc-700 transition-all group">
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 group-hover:text-zinc-400 transition-colors">{label}</div>
      <div className={`text-4xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
