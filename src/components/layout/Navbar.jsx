import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();
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

        <NavLink to="/entries" className={linkClass}>
          Entries
        </NavLink>

        <NavLink to="/import" className={linkClass}>
          Import Trades
        </NavLink>

        <NavLink to="/concepts" className={linkClass}>
          Concepts
        </NavLink>
      </div>

      <div className="flex items-center gap-3">
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
