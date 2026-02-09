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

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "API error");

  return data;
}
