const API = import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const accountId = localStorage.getItem("activeAccountId");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(accountId ? { "x-account-id": accountId } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    console.error("Respuesta no JSON:", text);
    throw new Error("Respuesta inválida del servidor");
  }

  if (!res.ok) {
    throw new Error(data?.error || "API error");
  }

  return data;
}
