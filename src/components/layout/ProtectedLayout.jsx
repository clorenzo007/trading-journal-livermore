import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Layout for authenticated routes.
 * Renders the Navbar and the page content (Outlet) within a container.
 * Ensures consistent spacing and background for the app.
 */
export default function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="container-fluid px-0 px-md-3">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
