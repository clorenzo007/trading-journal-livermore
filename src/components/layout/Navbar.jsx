import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";

export default function Navbar() {
  const { logout, user } = useAuth();
  const { accounts, activeAccount, changeAccount, loading } = useAccount();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm transition ${
      isActive ? "text-white" : "text-zinc-400 hover:text-white"
    }`;

  return (
    <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-white">Trading Journal</span>

        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/new-trade" className={linkClass}>
          Nuevo Trade
        </NavLink>

        <NavLink to="/import" className={linkClass}>
          Import Trades
        </NavLink>

        <NavLink to="/trades" className={linkClass}>
          Trades
        </NavLink>

        <NavLink to="/entries" className={linkClass}>
          Entries
        </NavLink>

        <NavLink to="/concepts" className={linkClass}>
          Concepts
        </NavLink>

        <NavLink to="/accounts" className={linkClass}>
          Cuentas
        </NavLink>
      </div>

      <div className="flex items-center gap-3">
        {!loading && accounts.length > 0 && (
          <select
            value={activeAccount?._id || ""}
            onChange={(e) => changeAccount(e.target.value)}
            className="bg-zinc-800 text-xs px-2 py-1 rounded"
          >
            {accounts
              .filter((a) => a.status === "active")
              .map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
          </select>
        )}

        <span className="text-xs text-zinc-400">{user?.email}</span>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="text-xs px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
