import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Admin() {
  const [users, setUsers] = useState([]);

  async function load() {
    const data = await api("/admin/users");
    setUsers(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id) {
    await api(`/admin/users/${id}/toggle`, { method: "PATCH" });
    load();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">User Management</h1>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-400">
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-zinc-800">
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.active ? "Active" : "Disabled"}</td>
              <td>
                <button
                  onClick={() => toggle(u._id)}
                  className="text-xs bg-zinc-700 px-2 py-1 rounded"
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
