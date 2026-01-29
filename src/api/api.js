const API_URL = import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const accountId = localStorage.getItem("activeAccountId");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(accountId && { "x-account-id": accountId }), // 👈 ESTO FALTABA
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "API error");

  return data;
}
