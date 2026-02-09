import { useEffect, useState, useMemo } from "react";
import { api } from "../api/api";
import ConfirmModal from "../components/ui/ConfirmModal";
import PromptModal from "../components/ui/PromptModal";

/**
 * Admin Panel Page.
 * Restricted area for user management and system oversight.
 * 
 * Features:
 * - List all registered users (paginated/filtered).
 * - Toggle user activation status.
 * - Promote/Demote roles (User <-> Admin).
 * - Security actions: Reset Password, Delete User.
 */
export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  
  // Modal States
  const [deleteId, setDeleteId] = useState(null);
  const [resetPassId, setResetPassId] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const data = await api("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Error loading users", err);
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

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    try {
      await api(`/admin/users/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      load();
    } catch (err) {
      alert(err.message || "Error deleting user");
    }
  }

  async function handleResetPassword(password) {
    if (!resetPassId || !password) return;
    try {
      await api(`/admin/users/${resetPassId}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password }),
      });
      setResetPassId(null);
      alert("Password reset successfully!");
    } catch (err) {
      alert(err.message || "Error resetting password");
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
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8 font-geist animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tighter">
            User Control Center
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
             Manage user profiles, permissions and security protocols.
          </p>
        </div>
        <button 
          onClick={load}
          className="w-full lg:w-auto bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-xl active:scale-95"
        >
          Refresh Database
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <StatCard label="Total Userbase" value={stats.total} />
        <StatCard label="Live Sessions" value={stats.active} color="text-emerald-400" icon={<StatusDot active />} />
        <StatCard label="Admin Council" value={stats.admins} color="text-indigo-400" />
      </div>

      {/* Control Bar */}
      <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full group">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-600"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full md:w-56">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm focus:outline-none appearance-none cursor-pointer hover:bg-zinc-900 transition-colors"
          >
            <option value="all">Filter: All Roles</option>
            <option value="user">Filter: Users Only</option>
            <option value="admin">Filter: Admins Only</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left align-middle min-w-[900px] border-collapse">
            <thead className="bg-zinc-950/50 text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] border-b border-zinc-800/60">
              <tr>
                <th className="px-6 py-5">Internal ID & Registry</th>
                <th className="px-6 py-5">User Profile</th>
                <th className="px-6 py-5 text-center">Identity Status</th>
                <th className="px-6 py-5">Access Group</th>
                <th className="px-6 py-5 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-zinc-500 italic flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    Syncing database nodes...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-zinc-500">No users verified in this sector.</td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id} className="group hover:bg-zinc-800/20 transition-all duration-300">
                    <td className="px-6 py-6">
                      <div className="text-[10px] text-zinc-600 font-mono mb-1 tracking-tighter uppercase opacity-60 group-hover:opacity-100 transition-opacity">ID: {u._id}</div>
                      <div className="text-[10px] bg-zinc-950/50 border border-zinc-800 px-2 py-0.5 rounded inline-block text-zinc-500 font-semibold tracking-wide">
                        JOINED: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "PRIOR RELEASE"}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <UserAvatar email={u.email} />
                        <div className="font-bold text-white text-lg tracking-tight">{u.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <button 
                        onClick={() => toggleStatus(u._id)}
                        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                          u.active 
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/5" 
                          : "bg-zinc-800/50 text-zinc-600 border border-zinc-700/30 hover:bg-zinc-800 hover:text-zinc-400"
                        }`}
                      >
                        <StatusDot active={u.active} />
                        {u.active ? "AUTHORIZED" : "REVOKED"}
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <div className="relative inline-block w-full max-w-[120px]">
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u._id, e.target.value)}
                          className={`w-full px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest bg-zinc-950 border focus:outline-none transition-all cursor-pointer appearance-none text-center ${
                            u.role === 'admin' 
                            ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5' 
                            : 'text-zinc-500 border-zinc-800'
                          }`}
                        >
                          <option value="user">USER</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right space-x-3">
                      <button
                        onClick={() => setResetPassId(u._id)}
                        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 px-4 py-2 rounded-xl hover:bg-indigo-500/10 transition-all font-bold text-xs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        RESET
                      </button>
                      <button
                        onClick={() => setDeleteId(u._id)}
                        className="inline-flex items-center gap-2 text-zinc-700 hover:text-rose-500 px-4 py-2 rounded-xl hover:bg-rose-500/10 transition-all font-bold text-xs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        PURGE
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Modals */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Purge User Entity"
        message="This operation is irreversible. All associated trading data, psychological logs, and account settings will be permanently erased from the neural nodes."
      />

      <PromptModal
        open={!!resetPassId}
        onClose={() => setResetPassId(null)}
        onConfirm={handleResetPassword}
        title="Override Passcode"
        message="Enter the new secure access key for this user identity."
        type="password"
        placeholder="••••••••"
      />
    </div>
  );
}

function StatCard({ label, value, color = "text-white", icon }) {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-6 md:p-8 rounded-[2rem] shadow-xl hover:bg-zinc-900/60 hover:border-zinc-700/50 transition-all duration-500 group relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.25em] mb-3 group-hover:text-zinc-500 transition-colors uppercase">
            {label}
          </div>
          <div className={`text-4xl md:text-5xl font-black tracking-tighter ${color} drop-shadow-sm`}>
            {value}
          </div>
        </div>
        {icon}
      </div>
      {/* Background flourish */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity ${color.replace('text', 'bg')}`}></div>
    </div>
  );
}

function StatusDot({ active }) {
  return (
    <span className={`flex h-2 w-2 relative`}>
      {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
    </span>
  );
}

function UserAvatar({ email }) {
  const initial = (email || "U").charAt(0).toUpperCase();
  const colors = [
    "bg-indigo-500", "bg-emerald-500", "bg-amber-500", 
    "bg-rose-500", "bg-cyan-500", "bg-violet-500"
  ];
  // Stable color based on email
  const charCode = email.charCodeAt(0);
  const bgColor = colors[charCode % colors.length];

  return (
    <div className={`w-10 h-10 rounded-2xl ${bgColor} flex items-center justify-center text-white font-black text-sm shadow-lg shadow-${bgColor.split('-')[1]}-500/20`}>
      {initial}
    </div>
  );
}
