import Navbar from "./Navbar";

import Navbar from "./Navbar";

/**
 * Public Layout Component.
 * Wraps pages that are publicly accessible (though currently mostly used for protected ones).
 * Provides a flex column structure with a sticky footer if needed.
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
