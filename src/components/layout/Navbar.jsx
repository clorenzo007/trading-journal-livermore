import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";

/**
 * Main Navigation Bar.
 * 
 * Features:
 * - Responsive design (collapses on mobile).
 * - Account Selector (switches active trading account).
 * - User Logout.
 * - Navigation links to all main modules.
 */
export default function Navbar() {
  const { logout, user } = useAuth();
  const { accounts, activeAccount, changeAccount, loading } = useAccount();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  // Toggles mobile menu
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "text-white active" : "text-zinc-400"}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-zinc-900 border-b border-zinc-800 py-2">
      <div className="container-fluid px-4">
        <span className="navbar-brand font-semibold text-white">
          Trading Journal
        </span>

        <button
          className="navbar-toggler border-zinc-700"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`${isNavCollapsed ? "collapse" : "show"} navbar-collapse justify-between`}
          id="navbarNav"
        >
          <ul className="navbar-nav gap-lg-2">
            <li className="nav-item">
              <NavLink to="/dashboard" className={linkClass} onClick={() => setIsNavCollapsed(true)}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/new-trade" className={linkClass} onClick={() => setIsNavCollapsed(true)}>
                Nuevo Trade
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/import" className={linkClass} onClick={() => setIsNavCollapsed(true)}>
                Import Trades
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/trades" className={linkClass} onClick={() => setIsNavCollapsed(true)}>
                Review Trades
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/entries" className={linkClass} onClick={() => setIsNavCollapsed(true)}>
                Entry Setups
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/concepts" className={linkClass} onClick={() => setIsNavCollapsed(true)}>
                Concepts
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/accounts" className={linkClass} onClick={() => setIsNavCollapsed(true)}>
                Cuentas
              </NavLink>
            </li>
            {user?.role === "admin" && (
              <li className="nav-item">
                <NavLink to="/admin" className={linkClass} onClick={() => setIsNavCollapsed(true)}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* ACCOUNT SELECTOR */}
            {!loading && accounts.length > 0 && (
              <select
                value={activeAccount?._id || ""}
                onChange={(e) => changeAccount(e.target.value)}
                className="form-select form-select-sm bg-zinc-800 text-white border-zinc-700 w-auto"
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

            <div className="d-flex align-items-center gap-3">
              <span className="text-xs text-zinc-400 d-none d-sm-inline">{user?.email}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="btn btn-sm btn-outline-light border-zinc-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
