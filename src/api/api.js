const API_URL = import.meta.env.VITE_API_URL;

/**
 * Generic API wrapper for making HTTP requests.
 * 
 * Automatically attaches:
 * - JWT Token (Authorization header)
 * - Active Account ID (x-account-id header)
 * 
 * Handles:
 * - JSON stringification for non-FormData bodies.
 * - Error parsing from response.
 */
export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const accountId = localStorage.getItem("activeAccountId");

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(accountId && { "x-account-id": accountId }),
    ...options.headers,
  };

  // Auto-detect JSON content type if not sending files
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Start Global Loading Bar
  window.dispatchEvent(new CustomEvent("loading-start"));

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error(`API JSON Parse Error [${res.status}]:`, text);
      throw new Error(`Server returned non-JSON response (${res.status} ${res.statusText})`);
    }

    // Usuario desactivado por un admin: cerrar sesión y volver al login
    if (res.status === 403 && data.error === "User disabled") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (!res.ok) throw new Error(data.error || "API error");

    return data;
  } finally {
    // Stop Global Loading Bar
    window.dispatchEvent(new CustomEvent("loading-end"));
  }
}
