import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getStrategies,
  createStrategy,
  deleteStrategy,
  updateStrategy,
  getPatterns,
  createPattern,
  deletePattern,
  updatePattern,
  getListItems,
  createListItem,
  deleteListItem,
  updateListItem,
  getUsers,
  createUser,
  toggleUserStatus,
  updateUserRole,
  updateUserPassword,
  deleteUser,
} from "../api/admin";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ui/ConfirmModal";
import {
  Shield,
  Key,
  Trash2,
  Power,
  Edit2,
  X,
  Check,
  Plus,
  Search,
  Target,
  Shapes,
  Smile,
  Meh,
  LogIn,
  LogOut,
  Users,
  UserPlus,
  Eye,
  EyeOff,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Settings2,
} from "lucide-react";

// =============================================================================
// SECTIONS
// Strategies / Patterns / list values are per-user; "users" is admin only.
// =============================================================================
const SECTIONS = [
  {
    id: "strategies",
    group: "Trading",
    label: "Strategies",
    hint: "The trading strategies you use (e.g. scalping, swing).",
    icon: Target,
    kind: "title",
    api: { list: getStrategies, create: (v) => createStrategy({ title: v }), update: updateStrategy, remove: deleteStrategy },
  },
  {
    id: "patterns",
    group: "Trading",
    label: "Patterns",
    hint: "Chart patterns or setups you trade.",
    icon: Shapes,
    kind: "title",
    api: { list: getPatterns, create: (v) => createPattern({ title: v }), update: updatePattern, remove: deletePattern },
  },
  {
    id: "emotional_pre",
    group: "Psychology",
    label: "Emotional State (Pre)",
    hint: "How you may feel before entering a trade.",
    icon: Smile,
    kind: "value",
  },
  {
    id: "emotional_post",
    group: "Psychology",
    label: "Emotional State (Post)",
    hint: "How you may feel after closing a trade.",
    icon: Meh,
    kind: "value",
  },
  {
    id: "reason_entry",
    group: "Reasons",
    label: "Reason for Entry",
    hint: "Typical reasons why you take a trade.",
    icon: LogIn,
    kind: "value",
  },
  {
    id: "reason_exit",
    group: "Reasons",
    label: "Reason for Exit",
    hint: "Typical reasons why you close a trade.",
    icon: LogOut,
    kind: "value",
  },
];

const USERS_SECTION = {
  id: "users",
  group: "Administration",
  label: "Users",
  hint: "Create accounts, manage roles, access and passwords.",
  icon: Users,
};

function listApiFor(section) {
  if (section.api) return section.api;
  return {
    list: () => getListItems(section.id),
    create: (v) => createListItem({ type: section.id, value: v }),
    update: updateListItem,
    remove: deleteListItem,
  };
}

// =============================================================================
// PAGE
// =============================================================================
export default function Setup() {
  const { user: authUser } = useAuth();
  const { t } = useLanguage();
  const isAdmin = authUser?.role === "admin";
  const [activeId, setActiveId] = useState("strategies");
  const [toast, setToast] = useState(null);

  const sections = useMemo(() => (isAdmin ? [...SECTIONS, USERS_SECTION] : SECTIONS), [isAdmin]);
  const active = sections.find((s) => s.id === activeId) || sections[0];

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const groups = sections.reduce((acc, s) => {
    (acc[s.group] = acc[s.group] || []).push(s);
    return acc;
  }, {});

  const ActiveIcon = active.icon;

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border-[1px] border-indigo-500/20 text-indigo-400">
          <Settings2 size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white m-0">{t("Setup")}</h1>
          <p className="text-zinc-400 text-sm m-0 mt-1">
            {t("Customize the lists you use when logging trades.")}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation: horizontal scroll on mobile, sidebar on desktop */}
        <nav className="lg:w-64 shrink-0">
          <div className="flex lg:flex-col gap-2 lg:gap-5 overflow-x-auto no-scrollbar pb-1 lg:pb-0 lg:sticky lg:top-4">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="flex lg:flex-col gap-2 lg:gap-1 shrink-0">
                <div className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-3 mb-1">
                  {t(group)}
                </div>
                {items.map((s) => {
                  const Icon = s.icon;
                  const selected = s.id === active.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveId(s.id)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors text-left ${
                        selected
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-zinc-900 lg:bg-transparent border-[1px] border-zinc-800 lg:border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      {t(s.label)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>

        {/* Content */}
        <section className="flex-1 min-w-0">
          <div className="bg-zinc-900 border-[1px] border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-start gap-3 mb-5 pb-4 border-b border-zinc-800">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                <ActiveIcon size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100 m-0">{t(active.label)}</h2>
                <p className="text-zinc-500 text-sm m-0 mt-0.5">{t(active.hint)}</p>
              </div>
            </div>

            {active.id === "users" ? (
              <UserManager notify={notify} currentUserId={authUser?._id} />
            ) : (
              <ItemManager key={active.id} section={active} notify={notify} />
            )}
          </div>
        </section>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

// =============================================================================
// TOAST
// =============================================================================
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div className="fixed bottom-12 right-4 left-4 sm:left-auto z-[1100] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div
        role="status"
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[1px] shadow-2xl text-sm sm:max-w-sm ${
          ok ? "bg-emerald-950/90 border-emerald-800 text-emerald-200" : "bg-rose-950/90 border-rose-800 text-rose-200"
        }`}
      >
        {ok ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
        <span className="flex-1">{toast.message}</span>
        <button onClick={onClose} className="opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// GENERIC LIST MANAGER (strategies, patterns, emotions, reasons)
// =============================================================================
function ItemManager({ section, notify }) {
  const { t } = useLanguage();
  const api = useMemo(() => listApiFor(section), [section]);
  const field = section.kind; // "title" | "value"

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setItems(await api.list());
    } catch (err) {
      notify(t(err.message), "error");
    } finally {
      setLoading(false);
    }
  }, [api, notify, t]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e) => {
    e?.preventDefault();
    if (!value.trim()) return;
    setAdding(true);
    try {
      await api.create(value.trim());
      setValue("");
      notify(t("Added successfully"));
      load();
    } catch (err) {
      notify(t(err.message) || t("Error adding item"), "error");
    } finally {
      setAdding(false);
    }
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;
    try {
      await api.update(id, editValue.trim());
      setEditingId(null);
      notify(t("Changes saved"));
      load();
    } catch (err) {
      notify(t(err.message) || t("Error updating item"), "error");
    }
  };

  const confirmDelete = async () => {
    const item = toDelete;
    setToDelete(null);
    try {
      await api.remove(item._id);
      notify(t("Deleted"));
      load();
    } catch (err) {
      notify(t(err.message) || t("Error deleting item"), "error");
    }
  };

  const filtered = items.filter((i) => (i[field] || "").toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Add */}
      <form onSubmit={add} className="flex flex-col sm:flex-row gap-2 mb-5">
        <textarea
          rows={1}
          className="bg-zinc-950 border-[1px] border-zinc-800 rounded-xl px-4 py-2.5 text-white flex-1 outline-none focus:border-indigo-500 transition-colors text-sm resize-y min-h-[42px]"
          placeholder={t("Write a new value and press Enter")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          disabled={adding || !value.trim()}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          <Plus size={16} />
          {adding ? t("Adding...") : t("Add")}
        </button>
      </form>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-zinc-500">
          {t("{n} items", { n: items.length })}
        </span>
        {items.length > 5 && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search...")}
              className="bg-zinc-950 border-[1px] border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500 w-44"
            />
          </div>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-zinc-800/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2 p-0 m-0">
          {filtered.map((item) => (
            <li
              key={item._id}
              className="flex items-center gap-2 bg-zinc-950 border-[1px] border-zinc-800 rounded-xl px-3 py-2.5 hover:border-zinc-700 transition-colors"
            >
              {editingId === item._id ? (
                <>
                  <textarea
                    autoFocus
                    rows={Math.min(6, Math.max(1, editValue.split("\n").length))}
                    className="bg-zinc-900 border-[1px] border-indigo-500/60 rounded-lg px-3 py-1.5 text-white flex-1 outline-none text-sm resize-y"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        saveEdit(item._id);
                      }
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                  <IconButton label={t("Save")} onClick={() => saveEdit(item._id)} className="text-emerald-400 hover:bg-emerald-500/10">
                    <Check size={16} />
                  </IconButton>
                  <IconButton label={t("Cancel")} onClick={() => setEditingId(null)}>
                    <X size={16} />
                  </IconButton>
                </>
              ) : (
                <>
                  <span className="text-zinc-200 text-sm break-words whitespace-pre-wrap min-w-0 flex-1">{item[field]}</span>
                  <IconButton
                    label={t("Edit")}
                    onClick={() => {
                      setEditingId(item._id);
                      setEditValue(item[field]);
                    }}
                  >
                    <Edit2 size={15} />
                  </IconButton>
                  <IconButton label={t("Delete")} onClick={() => setToDelete(item)} className="hover:text-rose-400 hover:bg-rose-500/10">
                    <Trash2 size={15} />
                  </IconButton>
                </>
              )}
            </li>
          ))}

          {filtered.length === 0 && (
            <EmptyState
              text={items.length === 0 ? t("Nothing here yet. Add your first value above.") : t("No results for your search.")}
            />
          )}
        </ul>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title={t("Delete item?")}
        message={toDelete ? `“${toDelete[field]}”` : ""}
      />
    </div>
  );
}

// =============================================================================
// USERS (admin)
// =============================================================================
function UserManager({ notify, currentUserId }) {
  const { t, locale } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [pwdUser, setPwdUser] = useState(null);
  const [confirm, setConfirm] = useState(null); // { title, message, action }

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setUsers(await getUsers());
    } catch (err) {
      notify(t(err.message), "error");
    } finally {
      setLoading(false);
    }
  }, [notify, t]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (fn, successMsg) => {
    try {
      await fn();
      if (successMsg) notify(successMsg);
      load();
    } catch (err) {
      notify(t(err.message), "error");
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    active: users.filter((u) => u.active).length,
  };

  const filtered = users.filter((u) => (u.email || "").toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Stats + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          <StatChip label={t("Total")} value={stats.total} />
          <StatChip label={t("Admins")} value={stats.admins} tone="indigo" />
          <StatChip label={t("Active users")} value={stats.active} tone="emerald" />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-indigo-500/20"
        >
          <UserPlus size={16} />
          {t("Create user")}
        </button>
      </div>

      {users.length > 5 && (
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search by email...")}
            className="w-full bg-zinc-950 border-[1px] border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-zinc-800/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2 p-0 m-0">
          {filtered.map((u) => {
            const isMe = u._id === currentUserId;
            return (
              <li
                key={u._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-950 border-[1px] border-zinc-800 rounded-xl p-3 sm:px-4 hover:border-zinc-700 transition-colors"
              >
                {/* Identity */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      u.active ? "bg-indigo-500/15 text-indigo-300" : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {(u.email || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-zinc-100 text-sm truncate">{u.email}</span>
                      {isMe && <span className="text-[10px] font-bold text-zinc-500 uppercase">({t("you")})</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          u.role === "admin"
                            ? "bg-indigo-500/10 text-indigo-300 border-[1px] border-indigo-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {u.role === "admin" ? t("Admin") : t("User")}
                      </span>
                      <span className={`flex items-center gap-1 text-[11px] font-semibold ${u.active ? "text-emerald-400" : "text-rose-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.active ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {u.active ? t("Active") : t("Disabled")}
                      </span>
                      {u.createdAt && (
                        <span className="text-[11px] text-zinc-500">
                          · {t("Since")} {new Date(u.createdAt).toLocaleDateString(locale)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 sm:justify-end border-t border-zinc-800 pt-2 sm:border-0 sm:pt-0">
                  <IconButton
                    label={u.active ? t("Disable") : t("Enable")}
                    disabled={isMe}
                    onClick={() =>
                      run(() => toggleUserStatus(u._id), u.active ? t("User disabled") : t("User enabled"))
                    }
                    className={u.active ? "hover:text-amber-400 hover:bg-amber-500/10" : "hover:text-emerald-400 hover:bg-emerald-500/10"}
                  >
                    <Power size={15} />
                  </IconButton>
                  <IconButton
                    label={u.role === "admin" ? t("Make user") : t("Make admin")}
                    disabled={isMe}
                    onClick={() => {
                      const newRole = u.role === "admin" ? "user" : "admin";
                      setConfirm({
                        title: t("Change role?"),
                        message: t("{email} will become {role}.", { email: u.email, role: newRole === "admin" ? t("Admin") : t("User") }),
                        action: () => run(() => updateUserRole(u._id, newRole), t("Role updated")),
                      });
                    }}
                  >
                    <Shield size={15} />
                  </IconButton>
                  <IconButton label={t("Reset password")} onClick={() => setPwdUser(u)}>
                    <Key size={15} />
                  </IconButton>
                  <IconButton
                    label={t("Delete user")}
                    disabled={isMe}
                    onClick={() =>
                      setConfirm({
                        title: t("Delete user?"),
                        message: t("{email} will be deleted forever. This cannot be undone.", { email: u.email }),
                        action: () => run(() => deleteUser(u._id), t("User deleted")),
                      })
                    }
                    className="hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </li>
            );
          })}
          {filtered.length === 0 && <EmptyState text={t("No users found.")} />}
        </ul>
      )}

      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(u) => {
          setShowCreate(false);
          notify(t("User {email} created", { email: u.email }));
          load();
        }}
      />

      <PasswordModal
        user={pwdUser}
        onClose={() => setPwdUser(null)}
        onSaved={() => {
          setPwdUser(null);
          notify(t("Password updated"));
        }}
      />

      <ConfirmModal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          const action = confirm.action;
          setConfirm(null);
          action();
        }}
        title={confirm?.title}
        message={confirm?.message}
      />
    </div>
  );
}

// =============================================================================
// CREATE USER MODAL
// =============================================================================
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generatePassword(len = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

function CreateUserModal({ open, onClose, onCreated }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail("");
      setPassword("");
      setRole("user");
      setShowPwd(false);
      setError(null);
      setTouched(false);
    }
  }, [open]);

  const emailOk = EMAIL_RE.test(email.trim());
  const pwdOk = password.length >= 6;

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!emailOk || !pwdOk) return;
    setSaving(true);
    setError(null);
    try {
      const created = await createUser({ email: email.trim(), password, role });
      onCreated(created);
    } catch (err) {
      setError(t(err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border-[1px] border-indigo-500/20 text-indigo-400">
            <UserPlus size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white m-0">{t("Create user")}</h2>
            <p className="text-sm text-zinc-400 m-0">{t("The user can sign in right away with these credentials.")}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-950/50 border-[1px] border-rose-900 text-rose-300 text-sm rounded-xl px-3 py-2">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <FormField label={t("Email")} error={touched && !emailOk ? t("Enter a valid email.") : null}>
          <input
            type="email"
            autoFocus
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("name@example.com")}
            className="w-full bg-zinc-950 border-[1px] border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500"
          />
        </FormField>

        <FormField
          label={t("Password")}
          hint={t("Minimum 6 characters.")}
          error={touched && !pwdOk ? t("Password must be at least 6 characters") : null}
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border-[1px] border-zinc-800 rounded-xl pl-4 pr-10 py-2.5 text-white text-sm outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-white"
                aria-label={showPwd ? t("Hide password") : t("Show password")}
                title={showPwd ? t("Hide password") : t("Show password")}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setPassword(generatePassword());
                setShowPwd(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold whitespace-nowrap"
              title={t("Generate a secure password")}
            >
              <Wand2 size={14} /> {t("Generate")}
            </button>
          </div>
        </FormField>

        <FormField label={t("Role")}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "user", title: t("User"), desc: t("Can log and review their own trades.") },
              { id: "admin", title: t("Admin"), desc: t("Can also manage users.") },
            ].map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r.id)}
                aria-pressed={role === r.id}
                className={`text-left rounded-xl border-[1px] p-3 transition-colors ${
                  role === r.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  {r.id === "admin" ? <Shield size={14} /> : <Users size={14} />}
                  {r.title}
                </div>
                <div className="text-xs text-zinc-500 mt-1">{r.desc}</div>
              </button>
            ))}
          </div>
        </FormField>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 rounded-xl py-2.5 font-semibold text-sm text-zinc-300"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl py-2.5 font-bold text-sm text-white shadow-lg shadow-indigo-500/20"
          >
            {saving ? t("Creating...") : t("Create user")}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// =============================================================================
// RESET PASSWORD MODAL
// =============================================================================
function PasswordModal({ user, onClose, onSaved }) {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPassword("");
    setShowPwd(false);
    setError(null);
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError(t("Password must be at least 6 characters"));
      return;
    }
    setSaving(true);
    try {
      await updateUserPassword(user._id, password);
      onSaved();
    } catch (err) {
      setError(t(err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={Boolean(user)} onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border-[1px] border-indigo-500/20 text-indigo-400">
            <Key size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white m-0">{t("Reset password")}</h2>
            <p className="text-sm text-zinc-400 m-0 truncate">{user?.email}</p>
          </div>
        </div>

        <FormField label={t("New password")} hint={t("Minimum 6 characters.")} error={error}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                autoFocus
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border-[1px] border-zinc-800 rounded-xl pl-4 pr-10 py-2.5 text-white text-sm outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-white"
                aria-label={showPwd ? t("Hide password") : t("Show password")}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setPassword(generatePassword());
                setShowPwd(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold whitespace-nowrap"
            >
              <Wand2 size={14} /> {t("Generate")}
            </button>
          </div>
        </FormField>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 rounded-xl py-2.5 font-semibold text-sm text-zinc-300"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl py-2.5 font-bold text-sm text-white"
          >
            {saving ? t("Saving...") : t("Save")}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// =============================================================================
// SMALL UI HELPERS
// =============================================================================
function IconButton({ label, onClick, children, className = "", disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-400 ${className}`}
    >
      {children}
    </button>
  );
}

function StatChip({ label, value, tone = "zinc" }) {
  const tones = {
    zinc: "bg-zinc-800/60 text-zinc-300 border-zinc-700/60",
    indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-[1px] text-xs ${tones[tone]}`}>
      <span className="font-bold text-sm">{value}</span>
      <span className="opacity-80">{label}</span>
    </div>
  );
}

function FormField({ label, hint, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
      {children}
      {error ? (
        <p className="text-xs text-rose-400 mt-1.5 m-0">{error}</p>
      ) : hint ? (
        <p className="text-xs text-zinc-500 mt-1.5 m-0">{hint}</p>
      ) : null}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-zinc-500 text-sm p-6 text-center bg-zinc-950/50 rounded-xl border-[1px] border-dashed border-zinc-800">
      {text}
    </div>
  );
}
